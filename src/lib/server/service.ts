import { z } from "zod";
import { CatalogRepository, jsonValue } from "./catalog";
import { buildRoadmap, buildStrategy, matchPrograms, scoreProgram } from "../scoring";
import { idSchema, matchSchema, profileSchema } from "../validation";
import { ServiceError } from "./errors";
import { CATEGORY_META } from "../types";
import { compareScenarios, scenarioRequestSchema } from "../scenarios";
import { REQUIREMENT_VERSION } from "../route-requirements";
import { buildSourceReviewQueue } from "../source-freshness";
import { sourceReview } from "../source-review";

export const ENGINE_VERSION = "3.5.0";
export const CALIBRATION = {citizenship:"AZ",verifiedRules:false,notice:"Scores are heuristic profile-fit estimates, not approval probabilities. Passport ease/access is calibrated for Azerbaijan. Consult each program's source review status."};

export class RouteWiseService {
  constructor(public catalog: CatalogRepository) {}

  async reviewQueue(input:{asOf:string;maxAgeDays?:number;limit?:number}) {
    const {programs,version}=await this.catalog.snapshot();
    return {catalogVersion:version,...buildSourceReviewQueue(programs,input)};
  }

  async scenarios(input:unknown) {
    const request=scenarioRequestSchema.parse(input);
    const {programs,version}=await this.catalog.snapshot();
    return {catalogVersion:version,engineVersion:ENGINE_VERSION,requirementVersion:REQUIREMENT_VERSION,
      comparisonPolicy:"matching-currency; no FX conversion",calibration:CALIBRATION,
      ...compareScenarios(programs,request.profile,request.scenarios,request.limit)};
  }

  async stats() {
    const {programs,version} = await this.catalog.snapshot();
    return {catalogVersion:version,engineVersion:ENGINE_VERSION,programCount:programs.length,
      partiallyReviewedCount:programs.filter(p=>sourceReview(p)?.status==="partial").length,
      unresolvedAuditCount:programs.filter(p=>p.audit?.status==="unresolved").length,
      auditedCount:programs.filter(p=>p.audit).length,
      closedIntakeCount:programs.filter(p=>p.audit?.routeStatus==="closed").length,
      countryCount:new Set(programs.map(p=>p.country)).size,verifiedCount:programs.filter(p=>p.verification?.status==="verified").length,
      categoryCounts:Object.fromEntries(Object.keys(CATEGORY_META).map(category=>[category,programs.filter(p=>p.category===category).length])),
      countries:[...new Set(programs.map(p=>p.country))].sort(),calibration:CALIBRATION};
  }

  async match(input: unknown) {
    const {profile,limit,includeIneligible,includeAlternatives} = matchSchema.parse(input);
    const {programs,version} = await this.catalog.snapshot();
    const all = matchPrograms(programs,profile);
    const visible = all.filter(r=>(includeIneligible || r.eligibility!=="ineligible") && (includeAlternatives || r.explanation.goalAligned));
    const plans=buildStrategy(all);
    const alignedCount=all.filter(r=>r.explanation.goalAligned).length;
    return {catalogVersion:version,engineVersion:ENGINE_VERSION,calibration:CALIBRATION,
      counts:{total:all.length,eligible:all.filter(r=>r.eligibility==="eligible").length,conditional:all.filter(r=>r.eligibility==="conditional").length,ineligible:all.filter(r=>r.eligibility==="ineligible").length,goalAligned:alignedCount},
      results:visible.slice(0,limit),totalMatches:visible.length,plans,
      strategyStatus:plans.length?(plans[0].result.eligibility==="eligible"?"ready":"conditional"):"none",
      notice:plans.length?null:alignedCount===0?"No program in the current catalog directly matches this goal.":"No goal-aligned route passes the current strategy readiness filters."};
  }

  async roadmap(id: string, input: unknown) {
    const profile = profileSchema.parse(input);
    const {program} = await this.catalog.get(idSchema.parse(id));
    return {programId:program.id,match:scoreProgram(program,profile),steps:buildRoadmap(program,profile),engineVersion:ENGINE_VERSION,calibration:CALIBRATION};
  }

  async compare(ids: string[], input?: unknown) {
    const parsed = z.array(idSchema).min(2).max(10).refine(v=>new Set(v).size===v.length,"Program IDs must be distinct").parse(ids);
    const profile = input===undefined?undefined:profileSchema.parse(input);
    const programs = await Promise.all(parsed.map(id=>this.catalog.get(id)));
    return {items:programs.map(item=>({...item,...(profile?{match:scoreProgram(item.program,profile)}:{})})),calibration:CALIBRATION};
  }

  async saveProfile(input: {id:string;name:string;profile:unknown;expectedVersion?:number}) {
    await this.catalog.initializeConnection();
    const id=idSchema.parse(input.id), name=z.string().trim().min(1).max(150).parse(input.name), profile=profileSchema.parse(input.profile);
    return this.catalog.database.$transaction(async tx=>{
      const existing=await tx.savedProfile.findUnique({where:{id}});
      if(!existing && input.expectedVersion!==undefined) throw new ServiceError("CONFLICT","Profile no longer exists. Do not recreate it with a stale version.",409);
      if(existing && input.expectedVersion!==existing.version) throw new ServiceError("CONFLICT","Profile exists. Read it and supply expectedVersion before updating.",409);
      const record=await tx.savedProfile.upsert({where:{id},
        create:{id,name,profile:jsonValue(profile)},
        update:{name,profile:jsonValue(profile),version:{increment:1}}});
      return {id:record.id,name:record.name,version:record.version,updatedAt:record.updatedAt.toISOString()};
    });
  }

  async listProfiles() {
    await this.catalog.initializeConnection();
    const rows=await this.catalog.database.savedProfile.findMany({orderBy:{id:"asc"},select:{id:true,name:true,version:true,updatedAt:true},take:100});
    return {items:rows.map(r=>({...r,updatedAt:r.updatedAt.toISOString()})),limit:100};
  }

  async getProfile(id: string) {
    await this.catalog.initializeConnection();
    const record=await this.catalog.database.savedProfile.findUnique({where:{id:idSchema.parse(id)}});
    if(!record) throw new ServiceError("NOT_FOUND",`Saved profile '${id}' was not found.`,404);
    return {...record,profile:profileSchema.parse(record.profile),createdAt:record.createdAt.toISOString(),updatedAt:record.updatedAt.toISOString()};
  }

  async deleteProfile(id: string, expectedVersion: number) {
    await this.catalog.initializeConnection();
    const result=await this.catalog.database.savedProfile.deleteMany({where:{id:idSchema.parse(id),version:expectedVersion}});
    if(!result.count) throw new ServiceError("CONFLICT","Profile missing or version changed. Read it before deleting.",409);
    return {id,deleted:true};
  }

  async saveStrategy(id: string) {
    const profile=await this.getProfile(id);
    const result=await this.match({profile:profile.profile,limit:100,includeIneligible:true,includeAlternatives:true});
    return this.catalog.database.$transaction(async tx=>{
      const current=await tx.savedProfile.findUnique({where:{id}});
      if(!current || current.version!==profile.version) throw new ServiceError("CONFLICT","Profile changed during evaluation. Retry.",409);
      const run=await tx.strategyRun.create({data:{profileId:id,profileVersion:profile.version,profileSnapshot:jsonValue(profile.profile),catalogVersion:result.catalogVersion,result:jsonValue(result)}});
      return {id:run.id,profileId:id,profileVersion:profile.version,catalogVersion:result.catalogVersion,createdAt:run.createdAt.toISOString(),result};
    });
  }

  async listStrategies(profileId: string) {
    await this.getProfile(profileId);
    const rows=await this.catalog.database.strategyRun.findMany({where:{profileId},orderBy:{createdAt:"desc"},take:20,select:{id:true,profileVersion:true,catalogVersion:true,createdAt:true}});
    return {items:rows.map(r=>({...r,createdAt:r.createdAt.toISOString()})),limit:20};
  }

  async getStrategy(id: string) {
    await this.catalog.initializeConnection();
    const run=await this.catalog.database.strategyRun.findUnique({where:{id:z.string().min(1).max(100).parse(id)}});
    if(!run) throw new ServiceError("NOT_FOUND","Saved strategy was not found.",404);
    return {...run,createdAt:run.createdAt.toISOString()};
  }
}
