import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

// The cloud web edition uses the existing reviewed-public-catalog static build.
// Its origin root has no GitHub Pages repository prefix.
const result=spawnSync(process.execPath,[fileURLToPath(new URL('./build-pages.mjs',import.meta.url))],{
  stdio:'inherit',env:{...process.env,NEXT_PUBLIC_BASE_PATH:''},
});
if(result.error) throw result.error;
process.exitCode=result.status??1;
