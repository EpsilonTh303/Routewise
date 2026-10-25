import { z } from "zod";
import { idSchema, matchSchema, profileSchema, searchSchema } from "../validation";
import { RouteWiseService, CALIBRATION } from "./service";
import { scenarioRequestSchema } from "../scenarios";

function tool<S extends z.ZodType>(name:string,description:string,schema:S,run:(input:z.output<S>)=>Promise<unknown>,options:{write?:boolean;destructive?:boolean;idempotent?:boolean}={}) {
  return {name,description,schema,annotations:{readOnlyHint:!options.write,destructiveHint:options.destructive??false,idempotentHint:options.idempotent??!options.write,openWorldHint:false},call:(input:unknown)=>run(schema.parse(input))};
}

export function createTools(service:RouteWiseService) {
  return [
    tool("get_catalog_stats","Get live database counts, catalog version, supported countries and calibration limits.",z.object({}).strict(),()=>service.stats()),
    tool("get_source_review_queue","Read a bounded source review queue as of an explicit date. Flags partial, old, index-only and potentially conflicting evidence; never changes verification or catalog records.",z.object({asOf:z.iso.date(),maxAgeDays:z.number().int().min(1).max(3650).default(90),limit:z.number().int().min(1).max(100).default(20)}).strict(),input=>service.reviewQueue(input)),
    tool("get_profile_schema","Get the complete JSON Schema for profiles before asking for missing fields. Do not invent a user's finances or circumstances.",z.object({}).strict(),async()=>({schema:z.toJSONSchema(profileSchema),calibration:CALIBRATION})),
    tool("list_programs","Search the live program catalog with filters and bounded pagination. maxBudget applies to a single applicant's recorded funds and spending, not family eligibility.",searchSchema,input=>service.catalog.search(input)),
    tool("get_program","Read a program, sources, review status, content hash and recent revisions. Set includeInactive to inspect a retired record before reactivating it.",z.object({id:idSchema,includeInactive:z.boolean().default(false)}).strict(),input=>service.catalog.get(input.id,input.includeInactive)),
    tool("get_program_history","Read paginated catalog revision metadata, including for retired records.",z.object({id:idSchema,limit:z.number().int().min(1).max(100).default(20),offset:z.number().int().min(0).max(100000).default(0)}).strict(),input=>service.catalog.history(input.id,input.limit,input.offset)),
    tool("get_program_revision","Read an immutable catalog revision snapshot and its import reason.",z.object({id:z.string().min(1).max(100)}).strict(),input=>service.catalog.revision(input.id)),
    tool("match_profile","Evaluate a complete profile without storing it. Returns scores, blocking issues and Plan A/B/C from the current catalog.",matchSchema,input=>service.match(input)),
    tool("compare_scenarios","Compare 1–5 temporary profile scenarios against the same catalog snapshot. Returns score, ranking and requirement changes; never saves profiles or results.",scenarioRequestSchema,input=>service.scenarios(input)),
    tool("compare_programs","Compare 2–10 distinct programs, optionally scored against a complete profile.",z.object({ids:z.array(idSchema).min(2).max(10),profile:profileSchema.optional()}).strict(),input=>service.compare(input.ids,input.profile)),
    tool("get_roadmap","Get recorded roadmap steps and match issues for one program and profile. Timelines are estimates.",z.object({id:idSchema,profile:profileSchema}).strict(),input=>service.roadmap(input.id,input.profile)),
    tool("list_profiles","List up to 100 local saved-profile IDs, names and versions; financial details are omitted.",z.object({}).strict(),()=>service.listProfiles()),
    tool("get_profile","Read a local saved profile, including personal/financial inputs. Use only for the user's requested profile.",z.object({id:idSchema}).strict(),input=>service.getProfile(input.id)),
    tool("save_profile","Explicitly persist a profile locally. Updates require the expectedVersion from get_profile; do not save without the user's request.",z.object({id:idSchema,name:z.string().trim().min(1).max(150),profile:profileSchema,expectedVersion:z.number().int().positive().optional()}).strict(),input=>service.saveProfile(input),{write:true}),
    tool("delete_profile","Delete a local saved profile and its saved strategy runs. Requires the version from get_profile and user intent to delete.",z.object({id:idSchema,expectedVersion:z.number().int().positive()}).strict(),input=>service.deleteProfile(input.id,input.expectedVersion),{write:true,destructive:true}),
    tool("save_strategy","Explicitly evaluate a saved profile and store an immutable result, profile snapshot and catalog version. Creates a new run on every call.",z.object({profileId:idSchema}).strict(),input=>service.saveStrategy(input.profileId),{write:true}),
    tool("list_strategies","List the 20 most recent strategy runs for a saved profile.",z.object({profileId:idSchema}).strict(),input=>service.listStrategies(input.profileId)),
    tool("get_strategy","Read an immutable saved strategy and the exact profile/catalog version used.",z.object({id:z.string().min(1).max(100)}).strict(),input=>service.getStrategy(input.id)),
  ];
}
