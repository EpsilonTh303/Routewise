import { spawn, spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { projectRoot } from './runtime-config.mjs';

const parent=resolve(projectRoot,'tmp');mkdirSync(parent,{recursive:true});
const temporary=mkdtempSync(join(parent,'e2e-'));
const env={...process.env,ROUTEWISE_DATABASE_URL:`file:${join(temporary,'test.sqlite').replaceAll('\\','/')}`};
const clean=()=>{if(resolve(temporary).startsWith(parent+sep)) rmSync(temporary,{recursive:true,force:true});};
const initialized=spawnSync(process.execPath,['--import',pathToFileURL(resolve(projectRoot,'node_modules/tsx/dist/loader.mjs')).href,resolve(projectRoot,'scripts/database.mts'),'setup'],{stdio:'inherit',env});
if(initialized.status!==0) {clean();process.exit(initialized.status??1);}
const child=spawn(process.execPath,[resolve(projectRoot,'scripts/start.mjs')],{stdio:'inherit',env});
child.on('error',()=>{clean();process.exitCode=1;});
child.on('exit',code=>{clean();process.exitCode=code??1;});
for(const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>child.kill(signal));
