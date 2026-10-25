import { createHash } from "node:crypto";
import { Prisma, type CatalogProgram, type PrismaClient } from "@prisma/client";
import { importSchema, programSchema, searchSchema } from "../validation";
import type { Program } from "../types";
import { ServiceError } from "./errors";

export const jsonValue = (value: unknown): Prisma.InputJsonValue => JSON.parse(JSON.stringify(value));
export const hashValue = (value: unknown) => createHash("sha256").update(JSON.stringify(value)).digest("hex");

export function decodeProgram(row: CatalogProgram): Program {
  return programSchema.parse({
    id:row.id,country:row.country,flag:row.flag,region:row.region,program:row.program,category:row.category,tagline:row.tagline,
    minBudget:row.minBudget,minMonthlyIncome:row.minMonthlyIncome,totalYearOneCost:row.totalYearOneCost,costPerDependent:row.costPerDependent,
    processingWeeks:row.processingWeeks,yearsToPR:row.yearsToPR,yearsToCitizenship:row.yearsToCitizenship,
    ...(row.citizenshipLanguage ? {citizenshipLanguage:row.citizenshipLanguage}:{}),
    jobOfferRequired:row.jobOfferRequired,remoteFriendly:row.remoteFriendly,familyFriendly:row.familyFriendly,
    passportAccess:row.passportAccess,devScore:row.devScore,azEase:row.azEase,languageBonus:row.languageBonus,
    requirements:row.requirements,pros:row.pros,cons:row.cons,...(row.taxNote ? {taxNote:row.taxNote}:{}),
    url:row.url,dvLottery:row.dvLottery,e2Treaty:row.e2Treaty,
    verification:{status:row.verificationStatus,checkedAt:row.checkedAt?.toISOString() ?? null,sourceUrl:row.verificationSourceUrl},
    ...(row.pathway?{pathway:row.pathway}:{}),
  });
}

export class CatalogRepository {
  private ready: Promise<void> | undefined;
  constructor(public database: PrismaClient) {}

  initializeConnection():Promise<void> {
    return this.ready??=(async()=>{
      await this.database.$queryRawUnsafe("PRAGMA journal_mode = WAL");
      await this.database.$queryRawUnsafe("PRAGMA busy_timeout = 10000");
    })().catch(error=>{this.ready=undefined;throw error;});
  }

  async search(input: unknown) {
    await this.initializeConnection();
    const q = searchSchema.parse(input);
    const where: Prisma.CatalogProgramWhereInput = {
      active:true,
      ...(q.country ? {country:{equals:q.country}}:{}),
      ...(q.category ? {category:q.category}:{}), ...(q.region ? {region:q.region}:{}),
      ...(q.verifiedOnly ? {verificationStatus:"verified"}:{}),
      ...(q.maxBudget !== undefined ? {minBudget:{lte:q.maxBudget},totalYearOneCost:{lte:q.maxBudget}}:{}),
      ...(q.query ? {OR:[{country:{contains:q.query}},{program:{contains:q.query}},{tagline:{contains:q.query}}]}:{}),
    };
    const [rows,total,versions] = await this.database.$transaction([
      this.database.catalogProgram.findMany({where,orderBy:[{country:"asc"},{id:"asc"}],take:q.limit,skip:q.offset}),
      this.database.catalogProgram.count({where}),
      this.database.catalogProgram.findMany({where:{active:true},orderBy:{id:"asc"},select:{id:true,contentHash:true}}),
    ]);
    return {items:rows.map(decodeProgram),total,limit:q.limit,offset:q.offset,nextOffset:q.offset+rows.length<total?q.offset+rows.length:null,catalogVersion:hashValue(versions.map(r=>[r.id,r.contentHash]))};
  }

  async snapshot() {
    await this.initializeConnection();
    const rows = await this.database.catalogProgram.findMany({where:{active:true},orderBy:{id:"asc"}});
    if (!rows.length) throw new ServiceError("CATALOG_EMPTY","No active programs are loaded. Run npm run db:setup.",503);
    return {programs:rows.map(decodeProgram),version:hashValue(rows.map(r=>[r.id,r.contentHash]))};
  }

  async get(id: string, includeInactive = false) {
    await this.initializeConnection();
    const row = await this.database.catalogProgram.findUnique({where:{id},include:{sources:{orderBy:{url:"asc"}},revisions:{orderBy:{createdAt:"desc"},take:10},children:{select:{id:true,program:true,active:true},orderBy:{id:"asc"}},parent:{select:{id:true,program:true}}}});
    if (!row || (!row.active && !includeInactive)) throw new ServiceError("NOT_FOUND",`Program '${id}' was not found.`,404);
    return {program:decodeProgram(row),active:row.active,contentHash:row.contentHash,updatedAt:row.updatedAt.toISOString(),parent:row.parent,children:row.children,
      sources:row.sources.map(s=>({url:s.url,title:s.title,evidence:s.evidence,checkedAt:s.checkedAt?.toISOString()??null})),
      revisions:row.revisions.map(r=>({id:r.id,contentHash:r.contentHash,reason:r.reason,createdAt:r.createdAt.toISOString()}))};
  }

  async history(id:string,limit:number,offset:number) {
    await this.get(id,true);
    const [rows,total]=await this.database.$transaction([
      this.database.programRevision.findMany({where:{programId:id},orderBy:[{createdAt:"desc"},{id:"desc"}],take:limit,skip:offset,select:{id:true,contentHash:true,reason:true,createdAt:true}}),
      this.database.programRevision.count({where:{programId:id}}),
    ]);
    return {items:rows.map(r=>({...r,createdAt:r.createdAt.toISOString()})),total,limit,offset,nextOffset:offset+rows.length<total?offset+rows.length:null};
  }

  async revision(id:string) {
    await this.initializeConnection();
    const row=await this.database.programRevision.findUnique({where:{id}});
    if(!row) throw new ServiceError("NOT_FOUND","Catalog revision was not found.",404);
    return {...row,createdAt:row.createdAt.toISOString()};
  }

  /** Explicit import path only. Ordinary reads and startup never seed or mutate the catalog. */
  async import(input: unknown, initialOnly = false) {
    await this.initializeConnection();
    return this.database.$transaction(tx=>this.importInTransaction(tx,input,initialOnly),{maxWait:10000,timeout:30000});
  }

  /** Internal composition point for atomic, audited catalog migrations. */
  async importInTransaction(tx:Prisma.TransactionClient,input:unknown,initialOnly=false) {
    const record = importSchema.parse(input);
    const p = programSchema.parse({...record.program,
      languageBonus:record.program.languageBonus??[],dvLottery:record.program.dvLottery??false,e2Treaty:record.program.e2Treaty??false,
      verification:record.program.verification??{status:"unverified",checkedAt:null,sourceUrl:record.program.url}});
    // Retain the exact verification source alongside the main program URL.
    const sources = [...record.sources];
    for (const url of new Set([p.url,p.verification!.sourceUrl])) if (!sources.some(s=>s.url===url)) sources.push({url,checkedAt:null});
    sources.sort((a,b)=>a.url.localeCompare(b.url));
    if (new Set(sources.map(s=>s.url)).size!==sources.length) throw new ServiceError("INVALID_INPUT","Duplicate source URLs are not allowed.");
    const contentHash = hashValue({program:p,sources,active:record.active});
      const existing = await tx.catalogProgram.findUnique({where:{id:p.id}});
      if (existing && (initialOnly || existing.contentHash===contentHash)) return {id:p.id,status:"unchanged" as const,contentHash:existing.contentHash};
      if (existing && record.expectedHash!==existing.contentHash) throw new ServiceError("CONFLICT","Catalog record changed or expectedHash is missing. Read the current record before updating.",409);
      const {verification,pathway,...fields} = p;
      if(pathway) {
        if(pathway.parentId===p.id) throw new ServiceError("INVALID_INPUT","A pathway cannot be its own parent.");
        const parent=await tx.catalogProgram.findUnique({where:{id:pathway.parentId},select:{parentId:true}});
        if(!parent||parent.parentId) throw new ServiceError("INVALID_INPUT","Pathway parent must be an existing original family record.");
      }
      const data = {...fields,languageBonus:jsonValue(p.languageBonus),requirements:jsonValue(p.requirements),pros:jsonValue(p.pros),cons:jsonValue(p.cons),
        citizenshipLanguage:p.citizenshipLanguage??null,taxNote:p.taxNote??null,
        pathway:pathway?jsonValue(pathway):Prisma.DbNull,parentId:pathway?.parentId??null,
        verificationStatus:verification!.status,verificationSourceUrl:verification!.sourceUrl,checkedAt:verification!.checkedAt?new Date(verification!.checkedAt):null,
        contentHash,active:record.active};
      await tx.catalogProgram.upsert({where:{id:p.id},create:data,update:data});
      await tx.programSource.deleteMany({where:{programId:p.id}});
      await tx.programSource.createMany({data:sources.map(s=>({programId:p.id,url:s.url,title:s.title??null,evidence:s.evidence??null,checkedAt:s.checkedAt?new Date(s.checkedAt):null}))});
      await tx.programRevision.create({data:{programId:p.id,contentHash,snapshot:jsonValue({program:p,sources,active:record.active}),reason:record.reason}});
      return {id:p.id,status:existing?"updated" as const:"created" as const,contentHash};
  }
}
