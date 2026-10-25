import { handleApi } from "@/lib/server/http";
import { service } from "@/lib/server/default-service";

export const runtime="nodejs";
export const dynamic="force-dynamic";
type Context={params:Promise<{path:string[]}>};
export async function GET(request:Request,context:Context){return handleApi(request,(await context.params).path,service);}
export async function POST(request:Request,context:Context){return handleApi(request,(await context.params).path,service);}
