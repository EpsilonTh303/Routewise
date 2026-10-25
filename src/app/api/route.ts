import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({name:"RouteWise",version:"1",catalog:"/api/v1/programs",stats:"/api/v1/stats",tools:"/api/v1/tools",profileSchema:"/api/v1/profile-schema",match:"POST /api/v1/match"});
}
