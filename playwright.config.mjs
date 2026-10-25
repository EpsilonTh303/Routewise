import { defineConfig } from '@playwright/test';

const port=Number(process.env.ROUTEWISE_E2E_PORT??3100);
if(!Number.isInteger(port)||port<1024||port>65535) throw new Error('ROUTEWISE_E2E_PORT must be an integer from 1024 to 65535');
const baseURL=`http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45000,
  workers: 1,
  use: { baseURL, trace:'retain-on-failure' },
  projects: [
    { name:'desktop', use:{viewport:{width:1280,height:900}} },
    { name:'mobile', use:{viewport:{width:375,height:812},isMobile:true,hasTouch:true} },
  ],
  webServer: {
    command:'node scripts/e2e-server.mjs',
    url:baseURL,
    env:{PORT:String(port),HOSTNAME:'127.0.0.1'},
    reuseExistingServer:false,
    timeout:60000,
  },
});
