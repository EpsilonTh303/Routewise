import { createServer } from 'node:net';
import { networkInterfaces } from 'node:os';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { projectRoot } from './runtime-config.mjs';

async function unusedPort() {
  for(let port=3001;port<=3099;port++) {
    const available=await new Promise(resolvePort=>{
      const probe=createServer();
      probe.once('error',()=>resolvePort(false));
      probe.listen({port,host:'0.0.0.0',exclusive:true},()=>probe.close(()=>resolvePort(true)));
    });
    if(available) return port;
  }
  throw new Error('No free port between 3001 and 3099.');
}

const port=await unusedPort();
const addresses=Object.values(networkInterfaces()).flat().filter(address=>address?.family==='IPv4'&&!address.internal).map(address=>address.address);
const child=spawn(process.execPath,[resolve(projectRoot,'scripts/start.mjs')],{
  cwd:projectRoot,stdio:'inherit',env:{...process.env,PORT:String(port),HOSTNAME:'0.0.0.0'},windowsHide:true,
});
mkdirSync(resolve(projectRoot,'tmp'),{recursive:true});
writeFileSync(resolve(projectRoot,'tmp/lan-server.json'),JSON.stringify({pid:process.pid,childPid:child.pid,port,host:'0.0.0.0',urls:addresses.map(address=>`http://${address}:${port}`),startedAt:new Date().toISOString()},null,2));
console.log(`RouteWise LAN server starting on port ${port}`);
for(const address of addresses) console.log(`Phone on the same network: http://${address}:${port}`);
child.on('error',error=>{console.error(error.message);process.exitCode=1;});
child.on('exit',code=>{process.exitCode=code??1;});
for(const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>child.kill(signal));
