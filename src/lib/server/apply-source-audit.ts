import { programSchema, idSchema, sourceAuditSchema } from "../validation";
import type { Program, SourceClaim } from "../types";
import { CatalogRepository, decodeProgram, hashValue, jsonValue } from "./catalog";
import { ServiceError } from "./errors";

export interface SourceAuditItem {
  id:string;
  expectedHash:string;
  patch:Partial<Program>;
}
export interface SourceAuditBatch { id:string; items:SourceAuditItem[] }

type PlanStatus="missing"|"conflict"|"pending"|"applied";
const hashPattern=/^[a-f0-9]{64}$/;

function manifestHash(batch:SourceAuditBatch) { return hashValue(batch); }
function receiptId(batch:SourceAuditBatch) { return batch.id; }
function validateBatch(batch:SourceAuditBatch) {
  if(!batch||!idSchema.safeParse(batch.id).success||!Array.isArray(batch.items)||batch.items.length<1||batch.items.length>100) {
    throw new ServiceError("INVALID_INPUT","Audit batch needs a slug ID and between 1 and 100 items.");
  }
  if(new Set(batch.items.map(item=>item.id)).size!==batch.items.length) throw new ServiceError("INVALID_INPUT","Duplicate audit targets are not allowed.");
  for(const item of batch.items) {
    if(!idSchema.safeParse(item.id).success||!hashPattern.test(item.expectedHash)) throw new ServiceError("INVALID_INPUT",`Invalid target ID or expectedHash for ${item.id}.`);
    if(!item.patch||typeof item.patch!=="object"||Array.isArray(item.patch)) throw new ServiceError("INVALID_INPUT",`Invalid patch for ${item.id}.`);
    if(Object.hasOwn(item.patch,"id")||Object.hasOwn(item.patch,"pathway")) throw new ServiceError("INVALID_INPUT","Audit patches cannot change record identity or pathway lineage.");
    if(item.patch.verification?.status==="verified") throw new ServiceError("INVALID_INPUT","A source audit cannot mark a record verified.");
    if(!item.patch.audit||item.patch.audit.batchId!==batch.id) throw new ServiceError("INVALID_INPUT","Each patch must carry audit metadata for this batch ID.");
    const parsed=sourceAuditSchema.safeParse(item.patch.audit);
    if(!parsed.success) throw new ServiceError("INVALID_INPUT",`Invalid audit metadata for ${item.id}: ${parsed.error.issues[0]?.message??"schema validation failed"}.`);
  }
}

function auditedClaims(program:Program):SourceClaim[] {
  return [
    ...(program.pathway?.review?.claims??[]),
    ...(program.audit?.claims??[]),
  ];
}

function latestIso(values:(string|null|undefined)[]) {
  const valid=values.filter((value):value is string=>Boolean(value));
  if(!valid.length) return null;
  return valid.reduce((latest,current)=>Date.parse(current)>Date.parse(latest)?current:latest);
}

function mergeSources(existing:{url:string;title:string|null;evidence:string|null;checkedAt:Date|null}[],prior:Program,next:Program) {
  const claims=[...auditedClaims(prior),...(next.audit?.claims??[])];
  const byUrl=new Map(existing.map(source=>[source.url,{
    url:source.url,
    ...(source.title?{title:source.title}:{}),
    ...(source.evidence?{evidence:source.evidence}:{}),
    checkedAt:source.checkedAt?.toISOString()??null,
  }]));
  for(const claim of claims) {
    const previous=byUrl.get(claim.sourceUrl);
    const line=`${claim.checkedAt}: ${claim.summary}`;
    const evidence=[previous?.evidence,line].filter((value,index,all):value is string=>Boolean(value)&&all.indexOf(value)===index).join("\n");
    byUrl.set(claim.sourceUrl,{
      url:claim.sourceUrl,
      title:previous?.title??"Official source — claim audit",
      evidence,
      checkedAt:latestIso([previous?.checkedAt,claim.checkedAt]),
    });
  }
  return [...byUrl.values()].sort((a,b)=>a.url.localeCompare(b.url));
}

export async function planSourceAudit(repository:CatalogRepository,batch:SourceAuditBatch) {
  await repository.initializeConnection();
  validateBatch(batch);
  const hash=manifestHash(batch);
  const [receipt,...rows]=await Promise.all([
    repository.database.catalogAudit.findUnique({where:{id:batch.id},select:{id:true,manifestHash:true}}),
    ...batch.items.map(item=>repository.database.catalogProgram.findUnique({where:{id:item.id},select:{id:true,contentHash:true}})),
  ]);
  const sameReceipt=receipt?.manifestHash===hash;
  const changedReceipt=Boolean(receipt)&&!sameReceipt;
  return batch.items.map((item,index)=>({id:item.id,status:(sameReceipt?"applied":changedReceipt?"conflict":!rows[index]?"missing":rows[index]!.contentHash!==item.expectedHash?"conflict":"pending") as PlanStatus}));
}

/** Applies one immutable, explicitly reviewed source-audit batch atomically. */
export async function applySourceAudit(repository:CatalogRepository,batch:SourceAuditBatch) {
  await repository.initializeConnection();
  validateBatch(batch);
  const hash=manifestHash(batch);
  const id=receiptId(batch);
  return repository.database.$transaction(async tx=>{
    const existingReceipt=await tx.catalogAudit.findUnique({where:{id:batch.id},select:{id:true,manifestHash:true}});
    if(existingReceipt&&existingReceipt.manifestHash!==hash) throw new ServiceError("CONFLICT","This source-audit batch ID was already applied with a different manifest.",409);
    if(existingReceipt) return batch.items.map(item=>({id:item.id,status:"unchanged" as const}));

    const results:{id:string;status:"updated"}[]=[];
    for(const item of batch.items) {
      const row=await tx.catalogProgram.findUnique({where:{id:item.id},include:{sources:true}});
      if(!row) throw new ServiceError("NOT_FOUND",`Missing source-audit target ${item.id}.`,404);
      if(row.contentHash!==item.expectedHash) throw new ServiceError("CONFLICT",`Source-audit target ${item.id} changed; refresh expectedHash before applying.`,409);
      const current=decodeProgram(row);
      const prior=programSchema.parse({...current,...(row.audit?{audit:row.audit}:{})});
      if(prior.verification?.status==="verified"&&item.patch.verification) throw new ServiceError("INVALID_INPUT","An audit patch cannot change existing verified-source metadata.");
      const program=programSchema.parse({...prior,...item.patch,id:prior.id,pathway:prior.pathway,verification:prior.verification});
      const sources=mergeSources(row.sources,prior,program);
      await repository.importInTransaction(tx,{
        program,sources,active:row.active,expectedHash:row.contentHash,
        reason:`${batch.id}: claim-specific source audit; record remains unverified unless independently verified`,
      });
      results.push({id:item.id,status:"updated"});
    }
    await tx.catalogAudit.create({data:{id,manifestHash:hash,recordIds:jsonValue(batch.items.map(item=>item.id))}});
    return results;
  },{maxWait:10000,timeout:60000});
}
