import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { PrismaClient } from "@prisma/client";
import { projectRoot } from "../../scripts/runtime-config.mjs";
import { CatalogRepository } from "../../src/lib/server/catalog";
import { applySourceAudit, planSourceAudit, type SourceAuditBatch } from "../../src/lib/server/apply-source-audit";
import { sourceInputs } from "../catalog-source-inputs.mts";

const exec=promisify(execFile);
const tempParent=resolve(projectRoot,"tmp");mkdirSync(tempParent,{recursive:true});
const directory=mkdtempSync(join(tempParent,"source-audit-integration-"));
const url=`file:${join(directory,"audit.sqlite").replaceAll("\\","/")}`;
const env={...process.env,ROUTEWISE_DATABASE_URL:url};
const database=new PrismaClient({datasourceUrl:url,log:[]});
const repository=new CatalogRepository(database);
const run=(args:string[])=>exec(process.execPath,args,{cwd:projectRoot,env,timeout:45000,maxBuffer:8*1024*1024});

before(async()=>{
  await run(["--import","tsx","scripts/database.mts","setup"]);
  await repository.initializeConnection();
});
after(async()=>{
  await database.$disconnect();
  assert.ok(resolve(directory).startsWith(tempParent+sep));
  rmSync(directory,{recursive:true,force:true});
});

const exampleClaim={
  topic:"Fixture rule",
  summary:"Synthetic integration-test evidence; not a real immigration claim.",
  sourceUrl:"https://example.org/source-audit-fixture",
  checkedAt:"2026-10-25T14:00:00.000Z",
  retrieval:"page" as const,
};
function makeBatch(id:string, targets:{id:string;expectedHash:string}[], summary=exampleClaim.summary):SourceAuditBatch {
  return {id,items:targets.map(target=>({id:target.id,expectedHash:target.expectedHash,patch:{audit:{
    batchId:id,status:"partial",reviewedAt:exampleClaim.checkedAt,routeStatus:"open",
    claims:[{...exampleClaim,summary}],financialRequirements:[],limitations:["Synthetic test fixture only."],unknownFields:[],
  }}}))};
}
async function currentHash(id:string) { return (await repository.get(id)).contentHash; }

test("plans pending, missing and conflicting targets before apply",async()=>{
  const id="source-audit-plan-fixture";
  const batch=makeBatch(id,[{id:"au-subclass-189",expectedHash:await currentHash("au-subclass-189")},{id:"missing-audit-target",expectedHash:"a".repeat(64)}]);
  const plan=await planSourceAudit(repository,batch);
  assert.deepEqual(plan.map(item=>item.status),["pending","missing"]);
  const stale=makeBatch("source-audit-stale-plan",[{id:"au-subclass-189",expectedHash:"b".repeat(64)}]);
  assert.equal((await planSourceAudit(repository,stale))[0].status,"conflict");
});

test("applies audit atomically, preserves historical evidence and active/private data",async()=>{
  const id="au-subclass-189";
  const before=await repository.get(id);
  const oldReview=before.program.pathway?.review;
  assert.ok(oldReview?.claims.length,"fixture must retain previous dated review evidence");
  await database.savedProfile.create({data:{id:"audit-private-fixture",name:"Private test fixture",profile:{marker:"keep unchanged"}}});
  await database.strategyRun.create({data:{profileId:"audit-private-fixture",profileVersion:1,profileSnapshot:{marker:"snapshot"},catalogVersion:"fixture-version",result:{marker:"result"}}});
  const privateBefore={profiles:await database.savedProfile.findMany({orderBy:{id:"asc"}}),runs:await database.strategyRun.findMany({orderBy:{id:"asc"}})};
  const revisions=await database.programRevision.count({where:{programId:id}});
  const receiptCount=await database.catalogAudit.count();
  const batch=makeBatch("source-audit-apply-fixture",[{id,expectedHash:before.contentHash}]);
  assert.equal((await planSourceAudit(repository,batch))[0].status,"pending");
  const applied=await applySourceAudit(repository,batch);
  assert.deepEqual(applied,[{id,status:"updated"}]);
  const after=await repository.get(id);
  assert.equal(after.active,true);
  assert.equal(after.program.audit?.batchId,batch.id);
  assert.equal(after.program.verification?.status,"unverified");
  assert.deepEqual(after.program.pathway,before.program.pathway);
  assert.equal(after.revisions.length,before.revisions.length+1);
  const fixtureSource=after.sources.find(source=>source.url===exampleClaim.sourceUrl)!;
  assert.equal(fixtureSource.checkedAt,exampleClaim.checkedAt);
  assert.ok(fixtureSource.evidence?.includes(`${exampleClaim.checkedAt}: ${exampleClaim.summary}`));
  for(const oldClaim of oldReview!.claims) {
    const source=after.sources.find(item=>item.url===oldClaim.sourceUrl);
    assert.ok(source?.evidence?.includes(`${oldClaim.checkedAt}: ${oldClaim.summary}`),`prior dated claim preserved: ${oldClaim.topic}`);
  }
  assert.equal(await database.programRevision.count({where:{programId:id}}),revisions+1);
  assert.equal(await database.catalogAudit.count(),receiptCount+1);
  assert.deepEqual({profiles:await database.savedProfile.findMany({orderBy:{id:"asc"}}),runs:await database.strategyRun.findMany({orderBy:{id:"asc"}})},privateBefore);
  assert.equal((await planSourceAudit(repository,batch))[0].status,"applied");
});

test("same manifest is idempotent after later edits; changed manifest under same ID is rejected",async()=>{
  const id="au-subclass-190";
  const before=await repository.get(id);
  const batch=makeBatch("source-audit-idempotence-fixture",[{id,expectedHash:before.contentHash}]);
  await applySourceAudit(repository,batch);
  const audited=await repository.get(id);
  const edit={...audited.program,tagline:"Later independent test edit"};
  await repository.import({program:edit,sources:audited.sources.map(source=>({url:source.url,...(source.evidence?{evidence:source.evidence}:{}),checkedAt:source.checkedAt})),expectedHash:audited.contentHash,reason:"Test later edit"});
  assert.deepEqual(await applySourceAudit(repository,batch),[{id,status:"unchanged"}]);
  assert.equal((await repository.get(id)).program.tagline,"Later independent test edit");
  const changed=makeBatch(batch.id,[{id,expectedHash:before.contentHash}],"Mutated immutable manifest fixture.");
  await assert.rejects(()=>applySourceAudit(repository,changed),/different manifest/);
  assert.equal((await repository.get(id)).program.tagline,"Later independent test edit");
});

test("receipt IDs are exact and prefix-related batch IDs apply independently",async()=>{
  const firstId="source-audit-prefix-fixture";
  const secondId="source-audit-prefix-fixture-child";
  const firstRecord="rs-property-residence",secondRecord="ae-green-skilled";
  const first=makeBatch(firstId,[{id:firstRecord,expectedHash:await currentHash(firstRecord)}]);
  const second=makeBatch(secondId,[{id:secondRecord,expectedHash:await currentHash(secondRecord)}]);
  assert.equal((await planSourceAudit(repository,first))[0].status,"pending");
  assert.equal((await planSourceAudit(repository,second))[0].status,"pending");
  await applySourceAudit(repository,first);
  await applySourceAudit(repository,second);
  assert.match((await database.catalogAudit.findUnique({where:{id:firstId}}))!.manifestHash,/^[a-f0-9]{64}$/);
  assert.match((await database.catalogAudit.findUnique({where:{id:secondId}}))!.manifestHash,/^[a-f0-9]{64}$/);
  assert.equal(await database.catalogAudit.count({where:{id:{in:[firstId,secondId]}}}),2);
});

test("stale target and invalid patches roll back the entire batch",async()=>{
  const first="au-subclass-189",second="hk-ttps";
  const a=await repository.get(first),b=await repository.get(second);
  const batch=makeBatch("source-audit-rollback-fixture",[{id:first,expectedHash:a.contentHash},{id:second,expectedHash:b.contentHash}]);
  await repository.import({program:{...b.program,tagline:"Stale before audit transaction"},sources:sourceInputs(b),expectedHash:b.contentHash,reason:"Test stale target"});
  const firstRevisionCount=await database.programRevision.count({where:{programId:first}});
  const receipts=await database.catalogAudit.count();
  await assert.rejects(()=>applySourceAudit(repository,batch),/changed/);
  assert.equal((await repository.get(first)).contentHash,a.contentHash);
  assert.equal(await database.programRevision.count({where:{programId:first}}),firstRevisionCount);
  assert.equal(await database.catalogAudit.count(),receipts);

  const current=await repository.get(first);
  const invalid=makeBatch("source-audit-invalid-patch-fixture",[{id:first,expectedHash:current.contentHash}]);
  invalid.items[0].patch.pathway={...current.program.pathway!,branch:"forbidden-lineage-edit"};
  await assert.rejects(()=>planSourceAudit(repository,invalid),/lineage/);
  delete invalid.items[0].patch.pathway;
  invalid.items[0].patch={...invalid.items[0].patch,verification:{status:"verified",checkedAt:exampleClaim.checkedAt,sourceUrl:exampleClaim.sourceUrl}};
  await assert.rejects(()=>applySourceAudit(repository,invalid),/mark a record verified/);
});

test("source audit cannot change record IDs or apply to absent targets",async()=>{
  const batch=makeBatch("source-audit-target-validation-fixture",[{id:"missing-audit-target",expectedHash:"c".repeat(64)}]);
  await assert.rejects(()=>applySourceAudit(repository,batch),/Missing source-audit target/);
  batch.items[0].patch={...batch.items[0].patch,id:"other-id"};
  await assert.rejects(()=>planSourceAudit(repository,batch),/identity/);
});
