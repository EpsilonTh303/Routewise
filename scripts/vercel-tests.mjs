import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const result=spawnSync(process.execPath,[fileURLToPath(new URL('./browser-tests.mjs',import.meta.url)),'test','--config','playwright.pages.config.mjs'],{
  stdio:'inherit',env:{...process.env,ROUTEWISE_STATIC_TEST_BASE_PATH:'',ROUTEWISE_STATIC_TEST_PORT:process.env.ROUTEWISE_STATIC_TEST_PORT??'3124'},
});
if(result.error) throw result.error;
process.exitCode=result.status??1;
