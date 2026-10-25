import { z } from "zod";
import { CATEGORY_META, CITIZENSHIPS, REGION_META } from "./types";
import type { Category, Region, Profile, Program } from "./types";
import { applicantEvidenceSchema } from "./requirements";

export const categorySchema = z.enum(Object.keys(CATEGORY_META) as [Category, ...Category[]]);
export const regionSchema = z.enum(Object.keys(REGION_META) as [Region, ...Region[]]);
const money = z.number().finite().min(0).max(Number.MAX_SAFE_INTEGER);
const id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100);
export const idSchema = id;
export const profileSchema: z.ZodType<Profile> = z.object({
  evidence: applicantEvidenceSchema.optional(),
  citizenship: z.enum(CITIZENSHIPS.map(c => c.key) as [string, ...string[]]),
  age: z.number().int().min(0).max(120),
  familyStatus: z.enum(["single", "couple", "family"]),
  dependents: z.number().int().min(0).max(100),
  budget: money, monthlyIncome: money, expectedSalary: money,
  hasJobOffer: z.boolean(), education: z.enum(["highschool", "bachelor", "master", "phd"]),
  experience: z.number().int().min(0).max(100),
  field: z.enum(["it", "medicine", "engineering", "finance", "business", "creative", "trades", "other"]),
  englishLevel: z.union([z.literal(0), z.literal(1), z.literal(2), z.literal(3)]),
  turkish: z.boolean(), russian: z.boolean(),
  goal: z.enum(["citizenship", "pr-fast", "lowest-cost", "top-qol", "remote", "business", "study", "family-safe"]),
  timeline: z.enum(["asap", "6m", "1y", "flexible"]), risk: z.enum(["low", "medium", "high"]),
  regions: z.array(regionSchema).max(9), remoteWork: z.boolean(),
}).strict();

const text = z.string().trim().min(1).max(10000);
const texts = z.array(text).max(100);
const url = z.url().refine(v => ["https:", "http:"].includes(new URL(v).protocol), "Only HTTP(S) source links are supported");
const unknownFieldSchema=z.enum(["minBudget","minMonthlyIncome","totalYearOneCost","costPerDependent","processingWeeks","yearsToPR","yearsToCitizenship","jobOfferRequired","remoteFriendly"]);
const claimSchema=z.object({topic:text.max(100),summary:text.max(2000),sourceUrl:url,checkedAt:z.iso.datetime(),retrieval:z.enum(["page","official-index"])}).strict();
const sourceFinancialSchema=z.object({amount:money,currency:z.string().regex(/^[A-Z]{3}$/),period:z.enum(["one-time","monthly","annual","balance","assets"]),description:text,sourceUrl:url}).strict();
export const sourceAuditSchema=z.object({batchId:id,status:z.enum(["partial","unresolved"]),reviewedAt:z.iso.datetime(),routeStatus:z.enum(["open","closed","unclear"]),
  claims:z.array(claimSchema).max(30),financialRequirements:z.array(sourceFinancialSchema).max(30),limitations:texts.min(1),
  unknownFields:z.array(unknownFieldSchema).max(9),supportsRequirementVersion:z.string().min(1).max(100).optional(),
}).strict().superRefine((audit,context)=>{
  if(audit.status==="partial"&&audit.claims.length===0) context.addIssue({code:"custom",path:["claims"],message:"Partial review needs at least one cited claim"});
  if(audit.status==="unresolved"&&(audit.claims.length>0||audit.financialRequirements.length>0||audit.routeStatus!=="unclear")) context.addIssue({code:"custom",message:"Unresolved audit cannot assert claims, amounts or route availability"});
  if(audit.routeStatus==="closed"&&!audit.claims.some(claim=>/intake|availability|status/i.test(claim.topic))) context.addIssue({code:"custom",message:"Closed intake needs a cited availability claim"});
  if(audit.financialRequirements.some(item=>!audit.claims.some(claim=>claim.sourceUrl===item.sourceUrl))) context.addIssue({code:"custom",message:"Amounts must reference an audited claim source"});
});
export const sourceSchema = z.object({ url, title: text.optional(), evidence: text.optional(), checkedAt: z.iso.datetime().nullable().default(null) }).strict();
export const programSchema: z.ZodType<Program> = z.object({
  audit:sourceAuditSchema.optional(),
  id, country: text.max(150), flag: text.max(32), region: regionSchema, program: text.max(300),
  category: categorySchema, tagline: text,
  minBudget: money.nullable(), minMonthlyIncome: money.nullable(), totalYearOneCost: money.nullable(), costPerDependent: money.nullable(),
  processingWeeks: z.number().finite().min(0).max(5200).nullable(),
  yearsToPR: z.number().finite().min(0).max(200).nullable(),
  yearsToCitizenship: z.number().finite().min(0).max(200).nullable(),
  citizenshipLanguage: text.optional(), jobOfferRequired: z.boolean().nullable(), remoteFriendly: z.boolean().nullable(),
  familyFriendly: z.number().min(0).max(1), passportAccess: z.enum(["visa-free", "evisa", "visa-required"]),
  devScore: z.number().min(0).max(10), azEase: z.number().min(0).max(5), languageBonus: texts.optional(),
  requirements: texts, pros: texts, cons: texts, taxNote: text.optional(), url,
  dvLottery: z.boolean().optional(), e2Treaty: z.boolean().optional(),
  pathway:z.object({parentId:id,recipeId:id,branch:text,unknownFields:z.array(z.enum(["minBudget","minMonthlyIncome","totalYearOneCost","costPerDependent","processingWeeks","yearsToPR","yearsToCitizenship","jobOfferRequired","remoteFriendly"])).max(9),notes:texts,remoteWorkRequired:z.boolean(),review:z.object({
    batchId:id,status:z.literal("partial"),reviewedAt:z.iso.datetime(),
    claims:z.array(z.object({topic:text.max(100),summary:text.max(2000),sourceUrl:url,checkedAt:z.iso.datetime(),retrieval:z.enum(["page","official-index"])}).strict()).min(1).max(30),
    limitations:texts.min(1),
    financialRequirements:z.array(z.object({amount:money,currency:z.string().regex(/^[A-Z]{3}$/),period:z.enum(["one-time","monthly","annual","balance","assets"]),description:text,sourceUrl:url}).strict()).max(30),
  }).strict().optional()}).strict().optional(),
  verification: z.discriminatedUnion("status", [
    z.object({status:z.literal("unverified"),checkedAt:z.null(),sourceUrl:url}).strict(),
    z.object({status:z.literal("verified"),checkedAt:z.iso.datetime(),sourceUrl:url}).strict(),
  ]).optional(),
}).strict();

export const searchSchema = z.object({
  query: z.string().trim().max(200).optional(), country: z.string().trim().min(1).max(150).optional(),
  category: categorySchema.optional(), region: regionSchema.optional(),
  maxBudget: money.optional(), verifiedOnly: z.boolean().default(false),
  limit: z.number().int().min(1).max(100).default(20), offset: z.number().int().min(0).max(100000).default(0),
}).strict();
export const matchSchema = z.object({profile:profileSchema, limit:z.number().int().min(1).max(100).default(20),includeIneligible:z.boolean().default(false),includeAlternatives:z.boolean().default(false)}).strict();

export const importSchema = z.object({
  program: programSchema, sources: z.array(sourceSchema).max(30).default([]),
  active: z.boolean().default(true), reason: text.max(1000),
  expectedHash: z.string().regex(/^[a-f0-9]{64}$/).optional(),
}).strict().superRefine((value,context) => {
  for(const review of [value.program.pathway?.review,value.program.audit].filter(item=>item!==undefined)) {
    for(const claim of review.claims) {
      if(!value.sources.some(source=>source.url===claim.sourceUrl && (source.checkedAt===claim.checkedAt||source.evidence?.includes(`${claim.checkedAt}: ${claim.summary}`)) && source.evidence?.includes(claim.summary))) {
        context.addIssue({code:"custom",path:["sources"],message:"Reviewed claims need matching dated source evidence"});
      }
    }
    if(review.financialRequirements.some(item=>!review.claims.some(claim=>claim.sourceUrl===item.sourceUrl))) {
      context.addIssue({code:"custom",path:["program","pathway","review"],message:"Financial evidence must reference a reviewed source"});
    }
  }
  for(const field of new Set([...(value.program.pathway?.unknownFields??[]),...(value.program.audit?.unknownFields??[])])) {
      if(value.program[field as keyof Program]!==null) context.addIssue({code:"custom",path:["program","pathway","unknownFields"],message:"Unknown fields must have null values"});
  }
  if (value.program.verification?.status === "verified") {
    const source = value.sources.find(s => s.url === value.program.verification?.sourceUrl && s.checkedAt === value.program.verification?.checkedAt && s.evidence);
    if (!source) context.addIssue({code:"custom",path:["sources"],message:"Verified records need a matching source with evidence and a review timestamp"});
  }
});
