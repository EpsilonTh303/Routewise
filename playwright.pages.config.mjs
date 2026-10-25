import {defineConfig} from '@playwright/test';
export default defineConfig({
  testDir:'./tests/pages',timeout:45000,workers:1,
  outputDir:'test-results/pages',
  use:{baseURL:'http://127.0.0.1:3120/Routewise/',trace:'retain-on-failure'},
  projects:[{name:'desktop',use:{viewport:{width:1280,height:900}}},{name:'mobile',use:{viewport:{width:375,height:812},isMobile:true,hasTouch:true}}],
  webServer:{command:'node scripts/serve-pages.mjs',url:'http://127.0.0.1:3120/Routewise/',reuseExistingServer:false,timeout:15000},
});
