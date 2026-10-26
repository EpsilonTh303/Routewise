import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { databaseUrl, projectRoot } from './runtime-config.mjs';
import { serverPort } from './server-port.mjs';
const args=process.argv.slice(2);
const explicitPort=args.some(arg=>arg==='-p'||arg==='--port'||arg.startsWith('--port='));
const port=serverPort(process.env.PORT);
const child=spawn(process.execPath,[resolve(projectRoot,'node_modules/next/dist/bin/next'),'dev',...(!explicitPort?['-p',String(port)]:[]),...args],{
  cwd:projectRoot,stdio:'inherit',env:{...process.env,PORT:String(port),ROUTEWISE_DATABASE_URL:databaseUrl()},
});
child.on('error',error=>{console.error(error);process.exitCode=1;});
child.on('exit',code=>{process.exitCode=code??1;});
for(const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>child.kill(signal));
