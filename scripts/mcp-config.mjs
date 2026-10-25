import { fileURLToPath } from 'node:url';
import { databaseUrl } from './runtime-config.mjs';
console.log(JSON.stringify({mcpServers:{routewise:{command:process.execPath,args:[fileURLToPath(new URL('./mcp.mjs',import.meta.url))],env:{ROUTEWISE_DATABASE_URL:databaseUrl()}}}},null,2));
