import { spawnSync } from "node:child_process";
import { closeSync, existsSync, mkdirSync, openSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { databasePath, databaseUrl, ensureDatabaseDirectory, projectRoot } from "./runtime-config.mjs";

const [command="help", argument] = process.argv.slice(2);
const prisma = (args:string[]) => {
  const result=spawnSync(process.execPath,[resolve(projectRoot,"node_modules/prisma/build/index.js"),...args],{
    cwd:projectRoot,stdio:"inherit",env:{...process.env,ROUTEWISE_DATABASE_URL:databaseUrl()},
  });
  if(result.error) throw result.error;
  if(result.status!==0) throw new Error(`Prisma command failed (${result.status})`);
};

async function main() {
  if(command==="generate") return prisma(["generate"]);
  if(command==="deploy" || command==="setup") {
    ensureDatabaseDirectory();
    // Bootstrap a real empty SQLite file before handing schema ownership to Prisma.
    // This also avoids the Prisma 6 schema-engine create-file failure on this Windows host.
    if(!existsSync(databasePath())) {
      const {DatabaseSync}=await import("node:sqlite");
      const fresh=new DatabaseSync(databasePath());
      try {fresh.exec("PRAGMA user_version = 0");} finally {fresh.close();}
    }
    prisma(["migrate","deploy"]);
    if(command==="deploy") return;
  }
  if(command==="status") return prisma(["migrate","status"]);
  if(command==="migrate") return prisma(["migrate","dev",...(argument?["--name",argument]:[])]);
  if(command==="backup") {
    if(!existsSync(databasePath())) throw new Error("Database does not exist. Run npm run db:setup first.");
    const target=argument?resolve(argument):resolve(projectRoot,"backups",`routewise-${new Date().toISOString().replaceAll(/[:.]/g,"-")}.sqlite`);
    if(existsSync(target)) throw new Error("Backup target already exists; choose a new filename.");
    mkdirSync(dirname(target),{recursive:true});
    // Reserve exclusively so concurrent backup commands cannot overwrite one another.
    closeSync(openSync(target,"wx",0o600));
    const {DatabaseSync,backup}=await import("node:sqlite");
    const source=new DatabaseSync(databasePath(),{readOnly:true});
    try { await backup(source,target); } finally {source.close();}
    console.log(JSON.stringify({backup:target}));
    return;
  }
  if(["setup","seed","import","split","split-plan","review","review-plan"].includes(command)) {
    const {db}=await import("../src/lib/db");
    const {CatalogRepository}=await import("../src/lib/server/catalog");
    const repository=new CatalogRepository(db);
    try {
      await repository.initializeConnection();
      if(command==="review" || command==="review-plan") {
        const {applyCatalogReviews,planCatalogReviews}=await import("../src/lib/server/review-catalog");
        console.log(JSON.stringify(await (command==="review"?applyCatalogReviews(repository):planCatalogReviews(repository))));
      } else if(command==="split" || command==="split-plan") {
        const {applyCatalogSplits,planCatalogSplits}=await import("../src/lib/server/split-catalog");
        console.log(JSON.stringify(await (command==="split"?applyCatalogSplits(repository):planCatalogSplits(repository))));
      } else if(command==="import") {
        if(!argument) throw new Error("Usage: npm run catalog:import -- record.json");
        console.log(JSON.stringify(await repository.import(JSON.parse(readFileSync(resolve(argument),"utf8")))));
      } else {
        const {ALL_PROGRAMS}=await import("../src/lib/data/index");
        const counts={created:0,unchanged:0,updated:0};
        for(const program of ALL_PROGRAMS) {
          const result=await repository.import({program,sources:[{url:program.url}],reason:"Initial archive dataset import"},true);
          counts[result.status]++;
        }
        const {applyCatalogSplits}=await import("../src/lib/server/split-catalog");
        const splits=await applyCatalogSplits(repository);
        const {applyCatalogReviews}=await import("../src/lib/server/review-catalog");
        const reviews=await applyCatalogReviews(repository);
        console.log(JSON.stringify({programs:ALL_PROGRAMS.length,...counts,splits,reviews}));
      }
    } finally {await db.$disconnect();}
    return;
  }
  console.log("Database commands: generate | setup (migrate + seed missing records) | deploy | seed | status | import record.json | split-plan | split | review-plan | review | backup [file]");
  if(command!=="help") process.exitCode=1;
}

main().catch(error=>{console.error(error instanceof Error?error.message:"Database command failed");process.exitCode=1;});
