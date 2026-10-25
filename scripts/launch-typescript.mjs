import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export function launch(entry) {
  const child=spawn(process.execPath,[
    '--import',new URL('../node_modules/tsx/dist/loader.mjs',import.meta.url).href,
    fileURLToPath(new URL(entry,import.meta.url)),...process.argv.slice(2),
  ],{stdio:'inherit',env:process.env,windowsHide:true});
  child.on('error',()=>{console.error('Unable to start RouteWise. Run npm ci first.');process.exitCode=1;});
  child.on('exit',code=>{process.exitCode=code??1;});
  for(const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>child.kill(signal));
}
