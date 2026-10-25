import {execFileSync} from 'node:child_process';
import {mkdirSync,mkdtempSync} from 'node:fs';
import {dirname,join,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const parent=join(root,'tmp');mkdirSync(parent,{recursive:true});
const destination=mkdtempSync(join(parent,'github-publication-'));
if(!destination.startsWith(root+sep)) throw new Error('Publication clone must stay in project');
const git=(args,cwd=root)=>execFileSync('git',args,{cwd,encoding:'utf8',env:{...process.env,FILTER_BRANCH_SQUELCH_WARNING:'1'},stdio:['ignore','pipe','pipe']}).trim();
git(['clone','--no-local','--single-branch','--branch','main',root,destination]);
git(['remote','remove','origin'],destination);
// Rewrite only this disposable publication clone. Original branches/objects stay untouched.
git(['filter-branch','--prune-empty','--index-filter','git rm -r --cached --ignore-unmatch -- .env db .zscripts','--','--all'],destination);
const reachable=git(['rev-list','--objects','main'],destination).split('\n');
if(reachable.some(line=>/ (?:\.env(?:\.|$)|db\/|\.zscripts\/)/.test(line))) throw new Error('Forbidden private paths remain reachable');
const revisions=git(['rev-list','main'],destination).split('\n');
try {
  git(['grep','-I','-l','-E','(gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}|AKIA[A-Z0-9]{16}|sk-[A-Za-z0-9]{32,})',...revisions],destination);
  throw new Error('Possible credential material detected in publication history; review privately before pushing');
} catch(error) {if(error.status!==1) throw error;}
git(['remote','add','origin','https://github.com/EpsilonTh303/Routewise.git'],destination);
console.log(JSON.stringify({publicationDirectory:destination,sourceHead:git(['rev-parse','HEAD']),publicationHead:git(['rev-parse','HEAD'],destination),commits:revisions.length,privatePathsRemoved:true,pushed:false}));
