import { serveStdio } from "@modelcontextprotocol/server/stdio";
import { createMcpServer } from "./create-server";
import { service } from "../lib/server/default-service";
import { db } from "../lib/db";

const connection=serveStdio(()=>createMcpServer(service),{onerror:()=>console.error("MCP transport error")});
process.stdin.once("end",()=>{void db.$disconnect();});
for(const signal of ["SIGINT","SIGTERM"] as const) process.on(signal,()=>{void connection.close().finally(()=>db.$disconnect()).finally(()=>process.exit(0));});
