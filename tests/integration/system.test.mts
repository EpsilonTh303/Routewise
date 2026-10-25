import { before, after, test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { PrismaClient } from "@prisma/client";
import { DatabaseSync } from "node:sqlite";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
import { projectRoot } from "../../scripts/runtime-config.mjs";
import { CatalogRepository } from "../../src/lib/server/catalog";
import { RouteWiseService } from "../../src/lib/server/service";
import { handleApi } from "../../src/lib/server/http";
import { ALL_PROGRAMS } from "../../src/lib/data/index";
import { PATHWAY_RECORDS } from "../../src/lib/data/pathway-splits";
import { PATHWAY_REVIEWS } from "../../src/lib/data/reviewed-pathways";
import { matchPrograms } from "../../src/lib/scoring";
import { CATALOG_SOURCE_AUDIT } from "../../src/lib/data/catalog-source-audit";
import { SOURCE_FOLLOWUP } from "../../src/lib/data/source-followup";
import { sourceInputs } from "../catalog-source-inputs.mts";

const exec=promisify(execFile);
const tempParent=resolve(projectRoot,"tmp");mkdirSync(tempParent,{recursive:true});
const directory=mkdtempSync(join(tempParent,"integration-"));
const url=`file:${join(directory,"test.sqlite").replaceAll('\\','/')}`;
const env={...process.env,ROUTEWISE_DATABASE_URL:url};
const database=new PrismaClient({datasourceUrl:url,log:[]});
const repository=new CatalogRepository(database);
const service=new RouteWiseService(repository);
const profile={citizenship:"AZ",age:30,familyStatus:"single" as const,dependents:0,budget:50000,monthlyIncome:3000,expectedSalary:0,hasJobOffer:false,
  education:"bachelor" as const,experience:5,field:"it" as const,englishLevel:2 as const,turkish:false,russian:true,goal:"citizenship" as const,timeline:"1y" as const,risk:"medium" as const,regions:[],remoteWork:false};
const run=(args:string[])=>exec(process.execPath,args,{cwd:projectRoot,env,timeout:45000,maxBuffer:8*1024*1024});

before(async()=>{
  await run(["--import","tsx","scripts/database.mts","setup"]);
  await repository.initializeConnection();
});
after(async()=>{
  await database.$disconnect();
  // Only remove the isolated directory created by mkdtemp under this project's tmp root.
  assert.ok(resolve(directory).startsWith(tempParent+sep));
  rmSync(directory,{recursive:true,force:true});
});

test("real migrations and seed produce queryable records, sources and revisions",async()=>{
  const stats=await service.stats();
  assert.equal(stats.programCount,79);assert.equal(stats.countryCount,51);assert.equal(stats.verifiedCount,0);
  assert.equal(await database.programRevision.count(),108+PATHWAY_REVIEWS.length+CATALOG_SOURCE_AUDIT.items.length);
  assert.equal(stats.auditedCount,79);assert.equal(stats.partiallyReviewedCount,78);assert.equal(stats.unresolvedAuditCount,1);
  for(const item of CATALOG_SOURCE_AUDIT.items) {
    const record=await repository.get(item.id);
    const followup=SOURCE_FOLLOWUP.items.find(candidate=>candidate.id===item.id);
    assert.deepEqual(record.program.audit,followup?.patch.audit??item.patch.audit);
    for(const claim of record.program.audit!.claims) assert.ok(record.sources.some(source=>source.url===claim.sourceUrl&&source.evidence?.includes(claim.summary)));
  }
  for (const item of SOURCE_FOLLOWUP.items) {
    const record=await repository.get(item.id);
    assert.deepEqual(record.program.audit,item.patch.audit);
  }
  const list=await repository.search({query:"blue card",limit:1});
  assert.equal(list.items[0].id,"de-bluecard");
  assert.equal((await repository.search({maxBudget:5000})).items.every(p=>p.minBudget<=5000&&p.totalYearOneCost<=5000),true);
  const page1=await repository.search({limit:3});
  const page2=await repository.search({limit:3,offset:page1.nextOffset});
  assert.equal(new Set([...page1.items,...page2.items].map(p=>p.id)).size,6);
});

test("a runtime repository initializes its own SQLite connection settings",async()=>{
  const runtime=new PrismaClient({datasourceUrl:`${url}?connection_limit=1`,log:[]});
  try {
    await new CatalogRepository(runtime).search({limit:1});
    const values=await runtime.$queryRawUnsafe<Record<string,unknown>[]>("PRAGMA busy_timeout");
    assert.equal(Number(Object.values(values[0])[0]),10000);
  } finally {await runtime.$disconnect();}
});

test("catalog updates are versioned, reject stale writes, and survive reseeding",async()=>{
  const old=await repository.get("de-bluecard");
  const prior=(await repository.snapshot()).version;
  const program={...old.program,tagline:"Test-only database revision"};
  await assert.rejects(()=>repository.import({program,sources:sourceInputs(old),reason:"Test update"}),/expectedHash/);
  await repository.import({program,sources:sourceInputs(old),expectedHash:old.contentHash,reason:"Test update"});
  await assert.rejects(()=>repository.import({program:{...program,tagline:"Stale update"},sources:sourceInputs(old),expectedHash:old.contentHash,reason:"Stale"}),/changed/);
  const current=await repository.get(program.id);
  assert.equal(current.revisions.length,old.revisions.length+1);assert.notEqual((await repository.snapshot()).version,prior);
  const history=await repository.history(program.id,1,0);
  assert.equal(history.total,old.revisions.length+1);assert.equal(history.nextOffset,1);
  assert.equal((await repository.revision(history.items[0].id)).programId,program.id);
  const seeded=await run(["--import","tsx","scripts/database.mts","seed"]);
  assert.match(seeded.stdout,/"unchanged":62/);
  assert.equal((await repository.get(program.id)).program.tagline,"Test-only database revision");
});

test("verified metadata requires evidence and preserves its precise source URL",async()=>{
  const sourceUrl="https://example.org/test-only-rule";
  const program={...ALL_PROGRAMS[0],id:"test-review",verification:{status:"verified" as const,checkedAt:"2026-10-01T00:00:00.000Z",sourceUrl}};
  await assert.rejects(()=>repository.import({program,reason:"Test missing evidence"}));
  const imported=await repository.import({program,sources:[{url:sourceUrl,evidence:"Test-only evidence, not a real rule",checkedAt:program.verification.checkedAt}],reason:"Fixture verification"});
  const record=await repository.get(program.id);
  assert.equal(record.program.verification?.sourceUrl,sourceUrl);
  assert.equal(record.sources.length,2);
  await repository.import({program,sources:[{url:sourceUrl,evidence:"Test-only evidence, not a real rule",checkedAt:program.verification.checkedAt}],active:false,expectedHash:imported.contentHash,reason:"Retire test fixture"});
  await assert.rejects(()=>repository.get(program.id),/not found/);
  assert.equal((await repository.get(program.id,true)).active,false);
});

test("stateless matching uses the live catalog and stores no private profiles",async()=>{
  const snapshot=await repository.snapshot();
  const result=await service.match({profile,includeIneligible:true,limit:100});
  assert.deepEqual(result.results,matchPrograms(snapshot.programs,profile).filter(r=>r.explanation.goalAligned));
  assert.equal(await database.savedProfile.count(),0);assert.equal(await database.strategyRun.count(),0);
  assert.equal(result.catalogVersion,snapshot.version);
  assert.equal(result.engineVersion,"3.5.0");
  const response=await handleApi(new Request("http://localhost/api/v1/match",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({profile,includeIneligible:true,limit:100})}),["match"],service);
  assert.equal(response.status,200);
  assert.deepEqual((await response.json()).data,result);
});

test("goal mismatches are exploratory alternatives, not default recommendations",async()=>{
  const student=await service.match({profile:{...profile,goal:"study"},includeIneligible:true,limit:100});
  assert.equal(student.counts.goalAligned,1);
  assert.equal(student.strategyStatus,"none");assert.equal(student.results.length,1);assert.equal(student.results[0].program.category,"student");assert.deepEqual(student.plans,[]);
  assert.equal(student.results[0].program.minBudget,null);assert.equal(student.results[0].adjustedCost,null);
  assert.match(student.notice!,/No goal-aligned route/);
  const alternatives=await service.match({profile:{...profile,goal:"study"},includeIneligible:true,includeAlternatives:true,limit:100});
  assert.equal(alternatives.results.length,79);assert.deepEqual(alternatives.plans,[]);
});

test("structured evidence and temporary scenarios round trip through HTTP without persistence",async()=>{
  const privateCounts=[await database.savedProfile.count(),await database.strategyRun.count()];
  const programId="br-vitem-xiv-nomad";
  const documented={...profile,goal:"remote",evidence:{routes:{[programId]:{facts:{foreignRemoteContract:true},financial:[{kind:"balance",amount:18000,currency:"USD"}]}}}};
  const matched=await service.match({profile:documented,limit:100,includeIneligible:true});
  const check=matched.results.find(result=>result.program.id===programId)!;
  assert.equal(check.explanation.requirements?.result.status,"met");
  const input={profile,scenarios:[{id:"more-funds",label:"More funds",changes:{budget:100000}}],limit:5};
  const request=new Request("http://test/api/v1/scenarios",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(input)});
  const response=await handleApi(request,["scenarios"],service);
  assert.equal(response.status,200);
  assert.deepEqual((await response.json()).data,await service.scenarios(input));
  const queue=await handleApi(new Request("http://test/api/v1/reviews?asOf=2026-10-25&limit=3"),["reviews"],service);
  assert.equal(queue.status,200);
  const queueData=(await queue.json()).data;
  assert.equal(queueData.items.length,3);assert.equal(queueData.counts.unreviewed,0);assert.equal(queueData.counts.unresolved,1);
  assert.equal(queueData.items[0].id,"ae-golden-property");
  assert.deepEqual([await database.savedProfile.count(),await database.strategyRun.count()],privateCounts);
});

test("saved profiles protect against lost updates and strategy snapshots remain immutable",async()=>{
  const saved=await service.saveProfile({id:"test-person",name:"Test person",profile});
  await assert.rejects(()=>service.saveProfile({id:saved.id,name:saved.name,profile}),/expectedVersion/);
  const run=await service.saveStrategy(saved.id);
  await service.saveProfile({id:saved.id,name:saved.name,profile:{...profile,budget:1000},expectedVersion:saved.version});
  const persisted=await service.getStrategy(run.id);
  assert.equal((persisted.profileSnapshot as {budget:number}).budget,50000);
  assert.equal(persisted.profileVersion,1);
  await assert.rejects(()=>service.deleteProfile(saved.id,1),/version changed/);
  await service.deleteProfile(saved.id,2);
  assert.equal(await database.strategyRun.count(),0);
  await assert.rejects(()=>service.saveProfile({id:saved.id,name:saved.name,profile,expectedVersion:2}),/no longer exists/);
});

test("HTTP validates requests and does not expose private profile tools",async()=>{
  const get=async(path:string)=>handleApi(new Request(`http://localhost/api/v1/${path}`),path.split("?")[0].split("/"),service);
  const valid=await get("programs?query=Blue%20Card&limit=1");assert.equal(valid.status,200);
  assert.equal((await valid.json()).data.items[0].id,"de-bluecard");
  assert.equal((await get("programs?limit=1&limit=2")).status,400);
  assert.equal((await get("programs?verifiedOnly=maybe")).status,400);
  assert.equal((await get("programs?unknown=x")).status,400);
  assert.equal((await get("programs?__proto__=x")).status,400);
  assert.equal((await get("programs/missing-program")).status,404);
  const tools=(await (await get("tools")).json()).data.tools;
  assert.equal(tools.some((t:{name:string})=>t.name==="save_profile"||t.name==="get_profile"),false);
  const privateCall=await handleApi(new Request("http://localhost/api/v1/tools/save_profile",{method:"POST",headers:{"Content-Type":"application/json"},body:"{}"}),["tools","save_profile"],service);
  assert.equal(privateCall.status,404);
  const large=await handleApi(new Request("http://localhost/api/v1/match",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({padding:"x".repeat(65536)})}),["match"],service);
  assert.equal(large.status,413);
  const wrongType=await handleApi(new Request("http://localhost/api/v1/match",{method:"POST",headers:{"Content-Type":"xapplication/json"},body:"{}"}),["match"],service);
  assert.equal(wrongType.status,415);
});

test("CLI returns machine-readable JSON from another working directory",async()=>{
  const result=await exec(process.execPath,[resolve(projectRoot,"scripts/cli.mjs"),"get_catalog_stats"],{cwd:directory,env,timeout:30000});
  assert.equal(JSON.parse(result.stdout).data.programCount,79);
});

test("online SQLite backup is consistent and refuses to overwrite files",async()=>{
  const target=join(directory,"backup.sqlite");
  await run(["--import","tsx","scripts/database.mts","backup",target]);
  const copy=new DatabaseSync(target,{readOnly:true});
  try {assert.equal(Object.values(copy.prepare("PRAGMA integrity_check").get()!)[0],"ok");assert.equal((copy.prepare('SELECT count(*) AS n FROM CatalogProgram').get() as {n:number}).n,94);}
  finally {copy.close();}
  await assert.rejects(()=>run(["--import","tsx","scripts/database.mts","backup",target]));
});

test("official MCP client initializes, discovers tools, validates input and reads live data",async()=>{
  const transport=new StdioClientTransport({command:process.execPath,args:[resolve(projectRoot,"scripts/mcp.mjs")],cwd:directory,env:env as Record<string,string>,stderr:"pipe"});
  const client=new Client({name:"routewise-integration",version:"1.0.0"});
  try {
    await client.connect(transport);
    const tools=await client.listTools();
    assert.ok(tools.tools.some(t=>t.name==="match_profile"));
    assert.equal(tools.tools.find(t=>t.name==="delete_profile")?.annotations?.destructiveHint,true);
    const stats=await client.callTool({name:"get_catalog_stats",arguments:{}});
    assert.equal((stats.structuredContent as {programCount:number}).programCount,79);
    const matched=await client.callTool({name:"match_profile",arguments:{profile,limit:5,includeIneligible:true}});
    assert.deepEqual(matched.structuredContent,await service.match({profile,limit:5,includeIneligible:true}));
    const scenarios={profile,scenarios:[{id:"funds",label:"Funds",changes:{budget:100000}}],limit:3};
    assert.deepEqual((await client.callTool({name:"compare_scenarios",arguments:scenarios})).structuredContent,await service.scenarios(scenarios));
    assert.deepEqual((await client.callTool({name:"get_source_review_queue",arguments:{asOf:"2026-10-25",limit:3}})).structuredContent,await service.reviewQueue({asOf:"2026-10-25",limit:3}));
    const detail=await client.callTool({name:"get_program",arguments:{id:"de-bluecard"}});
    assert.equal(((detail.structuredContent as {program:{tagline:string}}).program.tagline),"Test-only database revision");
    const invalid=await client.callTool({name:"match_profile",arguments:{profile:{}}});
    assert.equal(invalid.isError,true);
    const saved=await client.callTool({name:"save_profile",arguments:{id:"mcp-test",name:"MCP test",profile}});
    assert.equal((saved.structuredContent as {version:number}).version,1);
    const removed=await client.callTool({name:"delete_profile",arguments:{id:"mcp-test",expectedVersion:1}});
    assert.equal((removed.structuredContent as {deleted:boolean}).deleted,true);
  } finally {await client.close();}
});


test("split receipts preserve lineage, history and edited children on rerun",async()=>{
  const {applyCatalogSplits}=await import("../../src/lib/server/split-catalog");
  const parent=await repository.get("br-investor",true);
  assert.equal(parent.active,false);
  assert.equal(parent.children.length,2);
  assert.equal(parent.revisions.length,2);
  const old=await repository.get("br-vitem-xiv-nomad");
  assert.equal(old.parent?.id,"br-investor");
  assert.equal(old.program.minBudget,null);
  await repository.import({program:{...old.program,tagline:"Preserved branch edit"},sources:old.sources.map(source=>({url:source.url,...(source.evidence?{evidence:source.evidence}:{}),checkedAt:source.checkedAt})),expectedHash:old.contentHash,reason:"Test branch edit"});
  await applyCatalogSplits(repository);
  assert.equal((await repository.get(old.program.id)).program.tagline,"Preserved branch edit");
  assert.equal(await database.catalogSplit.count(),13);
  assert.equal((await repository.get("ge-hnwi-review",true)).active,false);
});

test("split conflict rolls back all earlier splits in the transaction",async()=>{
  const {applyCatalogSplits}=await import("../../src/lib/server/split-catalog");
  const {PATHWAY_SPLITS}=await import("../../src/lib/data/pathway-splits");
  const conflictUrl=`file:${join(directory,"conflict.sqlite").replaceAll('\\','/')}`;
  await exec(process.execPath,["--import","tsx","scripts/database.mts","deploy"],{cwd:projectRoot,env:{...env,ROUTEWISE_DATABASE_URL:conflictUrl},timeout:45000});
  const isolated=new PrismaClient({datasourceUrl:conflictUrl,log:[]});
  try {
    const repo=new CatalogRepository(isolated);
    for(const recipe of PATHWAY_SPLITS.slice(0,2)) {
      const program=ALL_PROGRAMS.find(p=>p.id===recipe.parentId)!;
      await repo.import({program,sources:[{url:program.url}],reason:"Test archive"});
    }
    const edited=await repo.get(PATHWAY_SPLITS[1].parentId);
    await repo.import({program:{...edited.program,tagline:"Custom parent"},expectedHash:edited.contentHash,reason:"Test parent edit"});
    await assert.rejects(()=>applyCatalogSplits(repo,PATHWAY_SPLITS.slice(0,2)),/was edited/);
    assert.equal(await isolated.catalogSplit.count(),0);
    assert.equal(await isolated.catalogProgram.count(),2);
    assert.equal((await repo.get(PATHWAY_SPLITS[0].parentId)).active,true);
    assert.equal((await repo.get(edited.program.id)).program.tagline,"Custom parent");
  } finally {await isolated.$disconnect();}
});


test("reviewed claims survive repository, tool and reseed round trips",async()=>{
  const {applyCatalogReviews,planCatalogReviews}=await import("../../src/lib/server/review-catalog");
  const before=await repository.get("br-vitem-xiv-nomad");
  const review=before.program.pathway!.review!;
  assert.equal(review.status,"partial");
  assert.equal(before.program.minMonthlyIncome,null);
  assert.ok(before.sources.some(source=>source.evidence?.includes(review.claims[0].summary)));
  const revisions=await database.programRevision.count();
  await applyCatalogReviews(repository);
  assert.equal(await database.programRevision.count(),revisions);
  assert.equal((await repository.get(before.program.id)).contentHash,before.contentHash);
  assert.ok((await planCatalogReviews(repository)).every(item=>item.status==="applied"));
  const response=await handleApi(new Request("http://test/api/v1/programs/br-vitem-xiv-nomad"),["programs","br-vitem-xiv-nomad"],service);
  assert.equal(response.status,200);
  const body=await response.json();
  assert.deepEqual(body.data.program.pathway.review,review);
  const stats=await service.stats();
  assert.equal(stats.partiallyReviewedCount,78);
});

test("review batch conflicts roll back all changes and preserve edited pathways",async()=>{
  const {applyCatalogSplits}=await import("../../src/lib/server/split-catalog");
  const {PATHWAY_SPLITS}=await import("../../src/lib/data/pathway-splits");
  const {applyCatalogReviews}=await import("../../src/lib/server/review-catalog");
  const conflictUrl=`file:${join(directory,"review-conflict.sqlite").replaceAll('\\','/')}`;
  await exec(process.execPath,["--import","tsx","scripts/database.mts","deploy"],{cwd:projectRoot,env:{...env,ROUTEWISE_DATABASE_URL:conflictUrl},timeout:45000});
  const isolated=new PrismaClient({datasourceUrl:conflictUrl,log:[]});
  try {
    const repo=new CatalogRepository(isolated);
    const parent=ALL_PROGRAMS.find(program=>program.id===PATHWAY_SPLITS[0].parentId)!;
    await repo.import({program:parent,sources:[{url:parent.url}],reason:"Test archive"});
    await applyCatalogSplits(repo,PATHWAY_SPLITS.slice(0,1));
    const edited=await repo.get("cr-rentista-residency");
    await repo.import({program:{...edited.program,tagline:"Custom branch"},expectedHash:edited.contentHash,reason:"Test custom branch",sources:[{url:edited.program.url}]});
    const first=await repo.get("cr-investment-residency");
    const revisionCount=await isolated.programRevision.count();
    await assert.rejects(()=>applyCatalogReviews(repo,PATHWAY_REVIEWS.slice(0,2)),/was edited/);
    assert.equal((await repo.get(first.program.id)).contentHash,first.contentHash);
    assert.equal((await repo.get(edited.program.id)).program.tagline,"Custom branch");
    assert.equal(await isolated.programRevision.count(),revisionCount);
  } finally {await isolated.$disconnect();}
});
