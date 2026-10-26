import {defineConfig} from '@playwright/test';
const basePath=process.env.ROUTEWISE_STATIC_TEST_BASE_PATH??'/Routewise';
const port=Number(process.env.ROUTEWISE_STATIC_TEST_PORT??3120);
const baseURL=process.env.ROUTEWISE_STATIC_TEST_URL??`http://127.0.0.1:${port}${basePath}/`;
export default defineConfig({
  testDir:'./tests/pages',timeout:45000,workers:1,
  outputDir:'test-results/pages',
  use:{baseURL,trace:'retain-on-failure'},
  projects:[{name:'desktop',use:{viewport:{width:1280,height:900}}},{name:'mobile',use:{viewport:{width:375,height:812},isMobile:true,hasTouch:true}}],
  ...(!process.env.ROUTEWISE_STATIC_TEST_URL?{webServer:{command:'node scripts/serve-pages.mjs',url:baseURL,env:{PORT:String(port),NEXT_PUBLIC_BASE_PATH:basePath},reuseExistingServer:false,timeout:15000}}:{}),
});
