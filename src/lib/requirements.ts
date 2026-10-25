import { z } from "zod";
import { compareFinancial, financialEvidenceSchema, financialRequirementSchema } from "./financial";
import type { FinancialEvidence, FinancialRequirement } from "./financial";

export const FACT_LABELS = {
  foreignRemoteContract: "Documented foreign employer or client contract",
  localEmploymentContract: "Qualifying local employment contract",
  laborCertification: "Approved labor certification where required",
  eb2Qualification: "EB-2 advanced-degree or exceptional-ability evidence",
  niwEndeavor: "NIW proposed endeavor and supporting evidence",
  qualifyingEmployer: "Employer meets this route's specific criteria",
  qualifyingRemoteAlternative: "Route-specific degree, IP or funding alternative evidence",
  healthCoverage: "Route-specific insurance or permitted coverage alternative",
  skilledAssessment: "Positive route-specific skills assessment",
  pointsThreshold: "Documented qualifying points score",
  invitation: "Invitation to apply for this specific route",
  nomination: "Required state or territory nomination",
  specialistQualification: "Specialist qualifications documented for this role",
  intraCompanyTransfer: "Qualifying intra-company transfer and prior employment",
  occupationalClassification: "Required occupational classification and qualifications",
  workPermit: "Required permit or competent-authority approval",
} as const;
export type FactKey = keyof typeof FACT_LABELS;
export const factKeySchema = z.enum(Object.keys(FACT_LABELS) as [FactKey, ...FactKey[]]);
export const routeEvidenceSchema = z.object({
  financial: z.array(financialEvidenceSchema).max(30).optional(),
  facts: z.partialRecord(factKeySchema,z.boolean()).optional(),
  eb2Path: z.enum(["sponsored","niw-assessment"]).optional(),
}).strict();
export const applicantEvidenceSchema=z.object({routes:z.record(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),routeEvidenceSchema).refine(routes=>Object.keys(routes).length<=20,"At most 20 routes can carry evidence")}).strict();
export interface ApplicantEvidence {
  financial?: FinancialEvidence[];
  facts?: Partial<Record<FactKey,boolean>>;
  eb2Path?: "sponsored" | "niw-assessment";
}
export type RequirementStatus = "met" | "unmet" | "unknown";
export interface RuleSource {
  url: string;
  reviewedAt: string;
  effectiveAt: string | null;
  retrieval: "page" | "official-index";
}
interface BaseRule { id: string; label: string; source: RuleSource }
export type Requirement = BaseRule & (
  | {kind:"all"|"any";children:Requirement[]}
  | {kind:"fact";fact:FactKey}
  | {kind:"financial";requirement:FinancialRequirement}
  | {kind:"manual";reason:string}
);
const sourceSchema=z.object({url:z.url().refine(v=>new URL(v).protocol==="https:"),reviewedAt:z.iso.datetime(),effectiveAt:z.iso.date().nullable(),retrieval:z.enum(["page","official-index"])}).strict();
// Recursive schema is bounded before evaluation; callers cannot supply executable predicates.
export const requirementSchema:z.ZodType<Requirement>=z.lazy(()=>z.union([
  z.object({id:z.string().min(1).max(100),label:z.string().min(1).max(500),source:sourceSchema,kind:z.enum(["all","any"]),children:z.array(requirementSchema).min(1).max(30)}).strict(),
  z.object({id:z.string().min(1).max(100),label:z.string().min(1).max(500),source:sourceSchema,kind:z.literal("fact"),fact:factKeySchema}).strict(),
  z.object({id:z.string().min(1).max(100),label:z.string().min(1).max(500),source:sourceSchema,kind:z.literal("financial"),requirement:financialRequirementSchema}).strict(),
  z.object({id:z.string().min(1).max(100),label:z.string().min(1).max(500),source:sourceSchema,kind:z.literal("manual"),reason:z.string().min(1).max(1000)}).strict(),
]));
export interface RequirementResult extends BaseRule {
  kind: Requirement["kind"];
  status: RequirementStatus;
  reason: string;
  children?: RequirementResult[];
  comparison?: FinancialRequirement;
}
export function evaluateRequirement(rule:Requirement,evidence:ApplicantEvidence={}):RequirementResult {
  const base={id:rule.id,label:rule.label,source:rule.source,kind:rule.kind};
  if(rule.kind==="manual") return {...base,status:"unknown",reason:rule.reason};
  if(rule.kind==="fact") {
    const fact=evidence.facts?.[rule.fact];
    return {...base,status:fact===undefined?"unknown":fact?"met":"unmet",reason:fact===undefined?"Evidence not supplied":fact?"Applicant reports documented evidence; authority review remains required":"Applicant reports this requirement is not met"};
  }
  if(rule.kind==="financial") return {...base,...compareFinancial(rule.requirement,evidence.financial??[]),comparison:rule.requirement};
  const children=rule.children.map(child=>evaluateRequirement(child,evidence));
  const status:RequirementStatus=rule.kind==="all"
    ?children.some(child=>child.status==="unmet")?"unmet":children.every(child=>child.status==="met")?"met":"unknown"
    :children.some(child=>child.status==="met")?"met":children.every(child=>child.status==="unmet")?"unmet":"unknown";
  return {...base,status,reason:rule.kind==="all"?"All listed requirements must be met":"At least one listed alternative must be met",children};
}
export function flattenRequirements(result:RequirementResult):RequirementResult[] {
  return [result,...(result.children??[]).flatMap(flattenRequirements)];
}
