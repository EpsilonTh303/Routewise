import {spawnSync} from 'node:child_process';
import {copyFileSync,existsSync,mkdirSync,mkdtempSync,readFileSync,renameSync,unlinkSync,writeFileSync} from 'node:fs';
import {dirname,join,resolve,sep} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const parent=join(root,'tmp');mkdirSync(parent,{recursive:true});
const workspace=mkdtempSync(join(parent,'pages-catalog-'));
const output=join(root,'out'),catalog=join(root,'public/catalog.json');
if(!workspace.startsWith(root+sep)||!output.startsWith(root+sep)||!catalog.startsWith(root+sep)) throw new Error('Build paths must stay inside project');
const basePath=process.env.NEXT_PUBLIC_BASE_PATH??'/Routewise';
if(basePath&&!/^\/[A-Za-z0-9_-]+(?:\/[A-Za-z0-9_-]+)*$/.test(basePath)) throw new Error('Invalid Pages base path');
const env={...process.env,NEXT_PUBLIC_STATIC_EXPORT:'true',NEXT_PUBLIC_BASE_PATH:basePath,ROUTEWISE_DATABASE_URL:`file:${join(workspace,'catalog.sqlite').replaceAll('\\','/')}`};
const run=args=>{
  const result=spawnSync(process.execPath,args,{cwd:root,env,stdio:'inherit'});
  if(result.error) throw result.error;
  if(result.status!==0) throw new Error(`Pages build step failed (${result.status})`);
};
// Always seed a disposable catalog. The user's live database is never read or copied.
const tsx=pathToFileURL(join(root,'node_modules/tsx/dist/loader.mjs')).href;
run(['--import',tsx,join(root,'scripts/database.mts'),'setup']);
run(['--import',tsx,join(root,'scripts/export-public-catalog.mts'),join(workspace,'catalog.json')]);
const previous=existsSync(catalog)?readFileSync(catalog):null;
try {
  copyFileSync(join(workspace,'catalog.json'),catalog);
  if(existsSync(output)) renameSync(output,join(parent,`pages-output-${Date.now()}`));
  // .tsx-only static mode excludes .ts Node API route handlers; sources stay untouched.
  run(['--input-type=module','-e',`const {default:load}=await import('next/dist/server/config.js');const c=await load.default('phase-production-build',process.cwd());if(c.output!=='export') throw new Error('Static build configuration not active');console.log(JSON.stringify({staticOutput:c.output,basePath:c.basePath}));`]);
  run([join(root,'node_modules/next/dist/bin/next'),'build','--webpack']);
  writeFileSync(join(output,'.nojekyll'),'');
} finally {
  if(previous) writeFileSync(catalog,previous);else if(existsSync(catalog)) unlinkSync(catalog);
}
console.log(JSON.stringify({output,basePath,mode:'static-pages'}));
