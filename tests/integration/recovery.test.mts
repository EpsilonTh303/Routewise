import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { PrismaClient } from "@prisma/client";
import { DatabaseSync } from "node:sqlite";
import { projectRoot } from "../../scripts/runtime-config.mjs";
import { CatalogRepository } from "../../src/lib/server/catalog";
import { RouteWiseService } from "../../src/lib/server/service";

const exec=promisify(execFile);
const tempParent=resolve(projectRoot,"tmp");mkdirSync(tempParent,{recursive:true});
const directory=mkdtempSync(join(tempParent,"recovery-"));
const sourcePath=join(directory,"source.sqlite"),backupPath=join(directory,"backup.sqlite"),restoredPath=join(directory,"restored.sqlite");
const urlFor=(path:string)=>`file:${path.replaceAll("\\","/")}`;
const sourceUrl=urlFor(sourcePath), env={...process.env,ROUTEWISE_DATABASE_URL:sourceUrl};
const source=new PrismaClient({datasourceUrl:sourceUrl,log:[]});
const repository=new CatalogRepository(source),service=new RouteWiseService(repository);
const profile={citizenship:"AZ",age:30,familyStatus:"single" as const,dependents:0,budget:50000,monthlyIncome:3000,expectedSalary:0,hasJobOffer:false,
  education:"bachelor" as const,experience:5,field:"it" as const,englishLevel:2 as const,turkish:false,russian:true,goal:"citizenship" as const,timeline:"1y" as const,risk:"medium" as const,regions:[],remoteWork:false};
const run=(args:string[])=>exec(process.execPath,args,{cwd:projectRoot,env,timeout:60000,maxBuffer:8*1024*1024});

before(async()=>{
  await run(["--import","tsx","scripts/database.mts","setup"]);
  await repository.initializeConnection();
});
after(async()=>{
  await source.$disconnect();
  assert.ok(resolve(directory).startsWith(tempParent+sep));
  rmSync(directory,{recursive:true,force:true});
});

test("backup restore retains catalog history, saved profiles, evaluation snapshots and integrity",async()=>{
  const prior=await repository.get("de-bluecard");
  await repository.import({program:{...prior.program,tagline:"Recovery fixture revision"},expectedHash:prior.contentHash,reason:"Recovery test revision"});
  const saved=await service.saveProfile({id:"recovery-profile",name:"Recovery profile",profile});
  const strategy=await service.saveStrategy(saved.id);
  const expectedHistory=await repository.history(prior.program.id,20,0);
  const expectedSnapshot=await service.getStrategy(strategy.id);
  await run(["--import","tsx","scripts/database.mts","backup",backupPath]);

  // Restore to a distinct isolated file to model copying a backup into a recovery location.
  copyFileSync(backupPath,restoredPath);
  const restoredUrl=urlFor(restoredPath);
  const restored=new PrismaClient({datasourceUrl:restoredUrl,log:[]});
  const restoredRepository=new CatalogRepository(restored),restoredService=new RouteWiseService(restoredRepository);
  const sqlite=new DatabaseSync(restoredPath,{readOnly:true});
  try {
    assert.equal(Object.values(sqlite.prepare("PRAGMA integrity_check").get()!)[0],"ok");
    assert.equal(Object.values(sqlite.prepare("PRAGMA foreign_key_check").get() ?? {})[0],undefined);
    const history=await restoredRepository.history(prior.program.id,20,0);
    assert.equal(history.total,expectedHistory.total);
    assert.deepEqual(history.items.map(item=>item.id),expectedHistory.items.map(item=>item.id));
    assert.equal((await restoredRepository.revision(history.items[0].id)).programId,prior.program.id);
    assert.equal((await restoredRepository.get(prior.program.id)).program.tagline,"Recovery fixture revision");
    assert.deepEqual(await restoredService.getProfile(saved.id),await service.getProfile(saved.id));
    assert.deepEqual(await restoredService.getStrategy(strategy.id),expectedSnapshot);
    assert.equal(await restored.savedProfile.count(),1);
    assert.equal(await restored.strategyRun.count(),1);
  } finally {
    sqlite.close();
    await restored.$disconnect();
  }
});
