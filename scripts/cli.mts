import { readFileSync } from "node:fs";
import { z } from "zod";
import { db } from "../src/lib/db";
import { service } from "../src/lib/server/default-service";
import { createTools } from "../src/lib/server/tools";
import { publicError, ServiceError } from "../src/lib/server/errors";

async function main() {
  const [name="help",...args]=process.argv.slice(2);
  const tools=createTools(service);
  if(name==="help" || name==="--help") return {usage:"npm run --silent cli -- <tool_name> [--input file.json | --json JSON]",commands:["tools",...tools.map(t=>t.name)]};
  if(name==="tools") return {tools:tools.map(t=>({name:t.name,description:t.description,inputSchema:z.toJSONSchema(t.schema),annotations:t.annotations}))};
  const tool=tools.find(t=>t.name===name);
  if(!tool) throw new ServiceError("NOT_FOUND",`Unknown tool '${name}'. Run cli -- tools.`,404);
  if(args.length!==0 && !(args.length===2 && ["--input","--json"].includes(args[0]))) throw new ServiceError("INVALID_INPUT","Use exactly one --input file.json or --json JSON argument.");
  const input=args.length?JSON.parse(args[0]==="--input"?readFileSync(args[1],"utf8"):args[1]):{};
  return tool.call(input);
}

try {console.log(JSON.stringify({data:await main()}));}
catch(error) {
  const detail=error instanceof z.ZodError?{code:"INVALID_INPUT",message:"Invalid tool input",issues:error.issues.map(i=>({path:i.path,message:i.message}))}:error instanceof SyntaxError?{code:"INVALID_JSON",message:"Input is not valid JSON"}:publicError(error);
  console.log(JSON.stringify({error:detail}));process.exitCode=1;
} finally {await db.$disconnect();}
