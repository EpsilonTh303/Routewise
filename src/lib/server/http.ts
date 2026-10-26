import { z } from "zod";
import { createTools } from "./tools";
import { RouteWiseService } from "./service";
import { publicError, ServiceError } from "./errors";

const PUBLIC_TOOLS = new Set(["evaluate_academic_admission","get_germany_study_plan","get_catalog_stats","get_source_review_queue","get_profile_schema","list_programs","get_program","get_program_history","get_program_revision","match_profile","compare_programs","compare_scenarios","get_roadmap"]);
const response = (value:unknown,status=200) => Response.json(value,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff"}});

async function body(request:Request) {
  if(request.headers.get("content-type")?.split(";")[0].trim().toLowerCase()!=="application/json") throw new ServiceError("INVALID_INPUT","Content-Type must be application/json.",415);
  if(Number(request.headers.get("content-length")??0)>65536) throw new ServiceError("INVALID_INPUT","JSON body exceeds 64 KiB.",413);
  const reader=request.body?.getReader();
  if(!reader) throw new ServiceError("INVALID_INPUT","A JSON request body is required.");
  const chunks:Uint8Array[]=[];let size=0;
  while(true) {
    const {value,done}=await reader.read();if(done) break;
    size+=value.byteLength;
    if(size>65536){await reader.cancel();throw new ServiceError("INVALID_INPUT","JSON body exceeds 64 KiB.",413);}
    chunks.push(value);
  }
  const bytes=new Uint8Array(size);let offset=0;
  for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.byteLength;}
  try{return JSON.parse(new TextDecoder().decode(bytes));}
  catch {throw new ServiceError("INVALID_INPUT","Request body is not valid JSON.");}
}

function queryInput(request:Request) {
  const input:Record<string,unknown>=Object.create(null);
  for(const [key,value] of new URL(request.url).searchParams) {
    if(Object.hasOwn(input,key)) throw new ServiceError("INVALID_INPUT",`Duplicate query parameter '${key}'.`);
    if(["limit","offset","maxBudget","maxAgeDays"].includes(key)) {
      if(!/^\d+(?:\.\d+)?$/.test(value)) throw new ServiceError("INVALID_INPUT",`Invalid numeric parameter '${key}'.`);
      input[key]=Number(value);
    } else if(key==="verifiedOnly") {
      if(!["true","false"].includes(value)) throw new ServiceError("INVALID_INPUT","verifiedOnly must be true or false.");
      input[key]=value==="true";
    } else input[key]=value;
  }
  return input;
}

export async function handleApi(request:Request,path:string[],service:RouteWiseService) {
  try {
    const tools=createTools(service).filter(t=>PUBLIC_TOOLS.has(t.name));
    const key=path.join("/");
    if(request.method==="GET" && key==="tools") return response({data:{tools:tools.map(t=>({name:t.name,description:t.description,inputSchema:z.toJSONSchema(t.schema),annotations:t.annotations}))}});
    let name:string|undefined,input:unknown={};
    if(request.method==="GET") {
      if(key==="health" || key==="stats") name="get_catalog_stats";
      else if(key==="profile-schema") name="get_profile_schema";
      else if(key==="reviews") {name="get_source_review_queue";input=queryInput(request);}
      else if(key==="programs") {name="list_programs";input=queryInput(request);}
      else if(path.length===2 && path[0]==="programs") {name="get_program";input={id:path[1]};}
      else if(path.length===3 && path[0]==="programs" && path[2]==="history") {name="get_program_history";input={id:path[1],...queryInput(request)};}
      else if(path.length===2 && path[0]==="revisions") {name="get_program_revision";input={id:path[1]};}
    } else if(request.method==="POST") {
      if(path.length===2 && path[0]==="tools" && PUBLIC_TOOLS.has(path[1])) {name=path[1];input=await body(request);}
      else if(key==="match") {name="match_profile";input=await body(request);}
      else if(key==="compare") {name="compare_programs";input=await body(request);}
      else if(key==="scenarios") {name="compare_scenarios";input=await body(request);}
      else if(path.length===3 && path[0]==="programs" && path[2]==="roadmap") {
        name="get_roadmap";
        const payload=z.object({profile:z.unknown()}).strict().parse(await body(request));input={id:path[1],profile:payload.profile};
      }
    }
    const tool=tools.find(t=>t.name===name);
    if(!tool) throw new ServiceError("NOT_FOUND","Unknown API endpoint or method. Discover tools at /api/v1/tools.",404);
    return response({data:await tool.call(input)});
  } catch(error) {
    if(error instanceof z.ZodError) return response({error:{code:"INVALID_INPUT",message:"Input validation failed",issues:error.issues.map(i=>({path:i.path,message:i.message}))}},400);
    return response({error:publicError(error)},error instanceof ServiceError?error.status:503);
  }
}
