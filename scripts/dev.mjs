import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { databaseUrl, projectRoot } from './runtime-config.mjs';
const child=spawn(process.execPath,[resolve(projectRoot,'node_modules/next/dist/bin/next'),'dev','-p','3000',...process.argv.slice(2)],{
  cwd:projectRoot,stdio:'inherit',env:{...process.env,ROUTEWISE_DATABASE_URL:databaseUrl()},
});
child.on('error',error=>{console.error(error);process.exitCode=1;});
child.on('exit',code=>{process.exitCode=code??1;});
for(const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>child.kill(signal));
