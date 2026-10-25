import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const child = spawn(process.execPath, [fileURLToPath(new URL('../node_modules/@playwright/test/cli.js', import.meta.url)), ...args], {
  stdio:'inherit',
  env:{...process.env,PLAYWRIGHT_BROWSERS_PATH:fileURLToPath(new URL('../.playwright', import.meta.url))},
});
child.on('error', error=>{console.error(error);process.exitCode=1;});
child.on('exit', code=>{process.exitCode=code??1;});
