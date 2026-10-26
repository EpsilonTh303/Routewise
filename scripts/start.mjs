import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { databaseUrl } from './runtime-config.mjs';
import { serverPort } from './server-port.mjs';

const child = spawn(process.execPath, [fileURLToPath(new URL('../.next/standalone/server.js', import.meta.url))], {
  stdio: 'inherit', env: { ...process.env, PORT: String(serverPort(process.env.PORT)), NODE_ENV: 'production', ROUTEWISE_DATABASE_URL: databaseUrl() },
});
child.on('error', (error) => { console.error(error); process.exitCode = 1; });
child.on('exit', (code) => { process.exitCode = code ?? 1; });
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => child.kill(signal));
