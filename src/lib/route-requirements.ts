import type { Program, Profile } from "./types";
import type { Requirement, RuleSource, FactKey } from "./requirements";
import { evaluateRequirement, requirementSchema } from "./requirements";
import type { FinancialRequirement } from "./financial";
import { PATHWAY_REVIEWS } from "./data/reviewed-pathways";
import {studyRouteRequirement} from './study-requirements';

export const REQUIREMENT_VERSION="requirements-2026-10-25-v1";
function canonical(value:unknown):string {
  if(Array.isArray(value)) return `[${value.map(canonical).join(",")}]`;
  if(value!==null&&typeof value==="object") return `{${Object.entries(value).sort(([a],[b])=>a<b?-1:a>b?1:0).map(([key,item])=>`${JSON.stringify(key)}:${canonical(item)}`).join(",")}}`;
  return JSON.stringify(value);
}
/** Read only the dated claims actually attached to the current catalog record.
 * A custom edit that removes review evidence also removes this automatic assessment.
 */
export function routeRequirement(program:Program,profile:Profile):Requirement|null {
  const study=studyRouteRequirement(program);
  if(study) return requirementSchema.parse(study);
  const review=program.pathway?.review;
  if(!review) return null;
  if(program.audit&&program.audit.supportsRequirementVersion!==REQUIREMENT_VERSION) return null;
  const expected=PATHWAY_REVIEWS.find(item=>item.id===program.id)?.review;
  if(!expected || canonical(review)!==canonical(expected)) return null;
  const claim=review.claims[0];
  const source:RuleSource={url:claim.sourceUrl,reviewedAt:claim.checkedAt,effectiveAt:null,retrieval:claim.retrieval};
  const fact=(id:FactKey,label:string):Requirement=>({id,label,source,kind:"fact",fact:id});
  const financial=(id:string,label:string,requirement:FinancialRequirement):Requirement=>({id,label,source,kind:"financial",requirement});
  const all=(id:string,label:string,children:Requirement[]):Requirement=>({id,label,source,kind:"all",children});
  const any=(id:string,label:string,children:Requirement[]):Requirement=>({id,label,source,kind:"any",children});
  const manual=(id:string,label:string,reason:string):Requirement=>({id,label,source,kind:"manual",reason});
  const income=(amount:number,currency:string,period:"annual"|"monthly",minHistoryMonths?:number,basis:"gross"|"unspecified"="unspecified")=>financial("income","Documented qualifying income",{kind:"income",amount,currency,period,basis,...(minHistoryMonths?{minHistoryMonths}:{})});
  const remote=fact("foreignRemoteContract","Foreign employer/client relationship and remote-work documentation");
  const cover=fact("healthCoverage","Qualifying health coverage, social-security or permitted deposit alternative");
  let rule:Requirement|null=null;
  switch(program.id) {
    case "br-vitem-xiv-nomad":
      rule=all("brazil-nomad","Recorded Brazil nomad checks",[remote,any("financial-alternatives","Income OR accessible bank funds",[
        income(1500,"USD","monthly"),financial("bank-funds","Documented accessible bank funds",{kind:"balance",amount:18000,currency:"USD"}),
      ])]);break;
    case "us-eb2": {
      const path=profile.evidence?.routes[program.id]?.eb2Path;
      rule=all("eb2","Recorded EB-2 checks",[fact("eb2Qualification","Documented underlying EB-2 classification"),
        ...(path==="sponsored"?[fact("localEmploymentContract","Qualifying sponsoring employer offer"),fact("laborCertification","Required labor certification or recognized exception evidence")]
          :path==="niw-assessment"?[fact("niwEndeavor","Proposed endeavor and supporting NIW evidence"),manual("niw-discretion","Discretionary NIW assessment","A request or qualification assertion cannot establish that USCIS will grant a waiver")]
          :[manual("select-eb2-path","Select ordinary sponsorship or requested NIW assessment","EB-2 path has not been selected; no blanket sponsorship decision is inferred")])]);break;
    }
    case "th-ltr-wealthy":rule=all("thai-wealthy","Recorded Thai wealthy checks",[
      financial("assets","Total qualifying assets (investment may be included)",{kind:"assets",amount:1000000,currency:"USD"}),
      financial("investment","Qualifying Thai investment (subset of assets)",{kind:"investment",amount:500000,currency:"USD"}),cover,
    ]);break;
    case "th-ltr-remote-standard":
    case "th-ltr-remote-degree":rule=all("thai-remote","Recorded Thai remote checks",[remote,fact("qualifyingEmployer","Listed or qualifying overseas employer with documented financial history"),
      income(program.id.endsWith("standard")?80000:40000,"USD","annual",24),
      ...(program.id.endsWith("degree")?[fact("qualifyingRemoteAlternative","Qualifying master's, IP ownership or Series A funding alternative")]:[]),cover]);break;
    case "au-subclass-189":
    case "au-subclass-190":rule=all("australia-skilled","Recorded Australian route checks",[
      fact("skilledAssessment","Suitable route-specific occupation and skills assessment"),fact("pointsThreshold","Documented points meeting the threshold and invitation score"),fact("invitation","Actual invitation for this subclass"),
      ...(program.id.endsWith("190")?[fact("nomination","State/territory nomination for subclass 190")]:[]),
      manual("invitation-criteria","Age at invitation and competent English","Current age or broad language level does not establish age at invitation or accepted legal language evidence"),
    ]);break;
    case "fi-specialist-permit":rule=all("finland-specialist","Recorded Finnish specialist checks",[fact("localEmploymentContract","Confirmed Finnish employment"),fact("specialistQualification","Role-specific degree or otherwise acquired specialist expertise"),income(3937,"EUR","monthly",undefined,"gross")]);break;
    case "fi-eu-ict-permit":rule=all("finland-ict","Recorded Finnish ICT checks",[fact("intraCompanyTransfer","Qualifying corporate relationship, assignment and prior group employment"),fact("specialistQualification","Qualifications for the manager/specialist/trainee category"),manual("ict-pay","ICT pay and transfer-specific conditions","Check the applicable collective agreement and precise transfer category; do not copy the specialist salary floor")]);break;
    case "ae-golden-professional":
    case "ae-green-skilled":rule=all("uae-employee","Recorded UAE employee checks",[fact("localEmploymentContract","Qualifying UAE employment contract"),fact("occupationalClassification","Required occupational level, degree and applicable professional approval"),income(program.id==="ae-green-skilled"?15000:30000,"AED","monthly"),manual("permit-scope","Work authorization and competent authority","Residence does not itself establish every occupational work right; confirm the applicable authority and permit")]);break;
    case "ae-green-freelance":rule=all("uae-freelance","Recorded UAE freelance checks",[fact("workPermit","Required MOHRE freelance/self-employment permit"),fact("occupationalClassification","Required degree/diploma or equivalent qualification"),income(360000,"AED","annual",24),manual("solvency-alternative","Continuing solvency and alternative evidence","Income/solvency interpretation and permit-specific checklist require manual review")]);break;
  }
  // Rules are partial claim projections, never a replacement for the full route checklist.
  return rule?requirementSchema.parse(rule):null;
}
export function assessRouteRequirements(program:Program,profile:Profile) {
  const rule=routeRequirement(program,profile);
  return rule?{version:REQUIREMENT_VERSION,scope:"partial" as const,result:evaluateRequirement(rule,profile.evidence?.routes[program.id])}:undefined;
}
