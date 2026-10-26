import {z} from 'zod';
import type {Program,Profile,SourceClaim} from './types';
import {profileSchema} from './validation';
import {studentInsuranceContextSchema,selectStudentInsuranceCost,type StudyCostSelection} from './study-costs';
import {getGermanyStudyCostData} from './germany-study-costs';
import {germanyStudyJourney} from './data/germany-study-journey';
import {studyPilotPrograms} from './data/study-pilot';
import {validateJourney,type JourneyCondition,type JourneyStage} from './journey';
import {assessRouteRequirements} from './route-requirements';
import {FACT_LABELS,type RequirementResult,type RequirementStatus} from './requirements';
import {canonicalJson} from './canonical-json';
import {germanyStageEvidenceFacts} from './data/germany-stage-review';
import {germanyStageReview} from './data/germany-stage-review';
import type {GermanyStageEvidence} from './data/germany-stage-review';

const quoteSchema=z.object({
  amount:z.number().finite().min(0).max(10_000_000),
  description:z.string().trim().min(1).max(300),
  sourceUrl:z.url().refine(url=>new URL(url).protocol==='https:','Only HTTPS source links are supported'),
  reviewedOn:z.iso.date(),coversMonths:z.literal(12).optional(),
}).strict();
const budgetQuotesSchema=z.object({
  tuition:quoteSchema.optional(),housing:quoteSchema.optional(),living:quoteSchema.optional(),insurance:quoteSchema.optional(),
  semesterFees:quoteSchema.optional(),relocation:quoteSchema.optional(),permitFees:quoteSchema.optional(),
}).strict();
export const germanyStudyPlanRequestSchema=z.object({
  profile:profileSchema,asOf:z.iso.date(),insuranceContext:studentInsuranceContextSchema.optional(),
  stageEvidence:z.object({
    work:z.object({qualifyingEmployment:z.boolean().optional(),qualificationRecognised:z.boolean().optional(),professionalLicenceOrNotRequired:z.boolean().optional(),authorityApproval:z.boolean().optional()}).strict().optional(),
    settlement:z.object({germanGraduation:z.boolean().optional(),qualifyingTitleTwoYears:z.boolean().optional(),pension24Months:z.boolean().optional(),permittedEmployment:z.boolean().optional(),livelihood:z.boolean().optional(),germanB1:z.boolean().optional(),civicKnowledge:z.boolean().optional(),adequateHousing:z.boolean().optional()}).strict().optional(),
  }).strict().optional(),
  budget:z.object({quotes:budgetQuotesSchema.optional(),monthlyProjectionMonths:z.literal(12).optional()}).strict().optional(),
}).strict();
export type GermanyStudyPlanInput=z.infer<typeof germanyStudyPlanRequestSchema>;
type BudgetCategory=keyof z.infer<typeof budgetQuotesSchema>;
type Quote=z.infer<typeof quoteSchema>;
const categories:readonly BudgetCategory[]=['tuition','housing','living','insurance','semesterFees','relocation','permitFees'];
const quotePeriod:Record<BudgetCategory,'annual'|'monthly'|'one-time'>={
  tuition:'annual',housing:'monthly',living:'monthly',insurance:'monthly',semesterFees:'annual',relocation:'one-time',permitFees:'one-time',
};
const categoryLabels:Record<BudgetCategory,string>={
  tuition:'Tuition',housing:'Housing including utilities',living:'Living costs excluding housing and insurance',insurance:'Health and care insurance',
  semesterFees:'Semester fees',relocation:'Relocation costs',permitFees:'Permit and application fees',
};
const proofLabel='2026 German study living-funds proof balance';

function unavailableResult(asOf:string,reason:string,profile:Profile,budget?:GermanyStudyPlanInput['budget'],insuranceContext?:GermanyStudyPlanInput['insuranceContext']) {
  const selectedEntryBranch=profile.hasJobOffer?'work-permit':'graduate-job-search';
  return {
    availability:'unavailable' as const,asOf,
    journey:{id:germanyStudyJourney.id,version:germanyStudyJourney.version,entryStageId:germanyStudyJourney.entryStageId,
      selectedEntryBranch,stages:germanyStudyJourney.stages.map(stage=>({id:stage.id,kind:stage.kind,label:stage.label,status:'unavailable' as const,
        checks:[] as RequirementResult[],claims:[] as SourceClaim[],missingActions:[reason],
        transitions:stage.transitions.map(edge=>({to:edge.to,jobOffer:edge.jobOffer,selected:stage.id===germanyStudyJourney.entryStageId&&edge.to===selectedEntryBranch,conditions:[] as RequirementResult[]}))}))},
    budget:buildBudget([],asOf,budget,profile,{unavailableReason:reason,insuranceContext}),
    limitations:planLimitations,
  };
}

const planLimitations=[
  'The selected rule and source review is partial and was checked on 2026-10-26; the as-of date does not trigger a fresh source check.',
  'Changes after 2026-10-26 are unassessed; EU/EFTA applicant rules are outside this planner scope.',
  'The assessment is not legal advice, eligibility confirmation, an authority decision, or an approval probability.',
];

function claimFor(program:Program|undefined,condition:JourneyCondition):SourceClaim|undefined {
  if(!program?.audit||program.audit.batchId!==condition.source.auditBatchId) return undefined;
  const matches=program.audit.claims.filter(claim=>claim.topic===condition.source.claimTopic);
  return matches.length===1?matches[0]:undefined;
}

function requirementFromCondition(condition:JourneyCondition,programs:ReadonlyMap<string,Program>,profile:Profile):RequirementResult[] {
  const sourceClaim=claimFor(programs.get(condition.source.programId),condition);
  const source=sourceClaim?{url:sourceClaim.sourceUrl,reviewedAt:sourceClaim.checkedAt,effectiveAt:null,retrieval:sourceClaim.retrieval as 'page'|'official-index'}:
    {url:'https://www.make-it-in-germany.com/',reviewedAt:'2026-10-25T00:00:00Z',effectiveAt:null,retrieval:'official-index' as const};
  return condition.evidence.map(evidence=>{
    if(evidence.kind==='manual') return {id:condition.id,label:evidence.label,source,kind:'manual' as const,status:'unknown' as const,reason:'Manual authority/source review is required; this condition is not assessed automatically.'};
    const value=profile.evidence?.routes[evidence.programId]?.facts?.[evidence.fact];
    const status:RequirementStatus=value===undefined?'unknown':value?'met':'unmet';
    return {id:`${condition.id}-${evidence.fact}`,label:FACT_LABELS[evidence.fact],source,kind:'fact' as const,status,
      reason:value===undefined?'Route-specific evidence was not supplied':value?'Applicant reports supporting evidence; authority review remains required':'Applicant reports this condition is not met'};
  });
}

function findClaims(stage:JourneyStage,programs:ReadonlyMap<string,Program>):SourceClaim[] {
  const all=[...stage.conditions,...stage.transitions.flatMap(edge=>edge.conditions)];
  const found=new Map<string,SourceClaim>();
  for(const condition of all){
    const claim=claimFor(programs.get(condition.source.programId),condition);
    if(claim) found.set(`${claim.sourceUrl}\u0000${claim.topic}`,claim);
  }
  return [...found.values()];
}

function stageReviewClaims(stage:'work'|'settlement'):SourceClaim[] {
  const found=new Map<string,SourceClaim>();
  for(const fact of germanyStageEvidenceFacts.filter(item=>item.stage===stage)){
    const claim:SourceClaim={topic:fact.label,summary:fact.limitations,sourceUrl:fact.sourceUrl,checkedAt:`${fact.reviewedAt}T00:00:00.000Z`,retrieval:'page'};
    found.set(`${claim.sourceUrl}\u0000${claim.topic}`,claim);
  }
  return [...found.values()];
}

function stageReviewChecks(stage:'work'|'settlement',evidence:GermanyStageEvidence|undefined):RequirementResult[] {
  const facts=germanyStageEvidenceFacts.filter(item=>item.stage===stage);
  const supplied=stage==='work'?evidence?.work:evidence?.settlement;
  const checks:RequirementResult[]=facts.map(fact=>{
    const value=(supplied as Record<string,boolean|undefined>|undefined)?.[fact.key];
    const status:RequirementStatus=value===undefined?'unknown':value?'met':'unmet';
    return {id:`${stage}-${fact.key}`,label:fact.label,kind:'fact',status,
      source:{url:fact.sourceUrl,reviewedAt:`${fact.reviewedAt}T00:00:00.000Z`,effectiveAt:null,retrieval:'page'},
      reason:`${value===undefined?'Applicant-reported fact not supplied':value?'Applicant reports supporting evidence; document and route review remain required':'Applicant reports this condition is not met'} ${fact.limitations}`,
    };
  });
  const first=facts[0];
  if(first) checks.push({id:`${stage}-authority-review`,label:'Competent authority assessment and exact route checklist',kind:'manual',status:'unknown',
    source:{url:first.sourceUrl,reviewedAt:`${first.reviewedAt}T00:00:00.000Z`,effectiveAt:null,retrieval:'page'},
    reason:'Manual review of the selected permit route, supporting documents and current authority requirements is required; this planner cannot assess approval.'});
  return checks;
}

function statusOf(checks:RequirementResult[]):RequirementStatus {
  if(checks.some(check=>check.status==='unmet')) return 'unmet';
  return checks.length>0&&checks.every(check=>check.status==='met')?'met':'unknown';
}
const money2=(amount:number)=>Math.round((amount+Number.EPSILON)*100)/100;
function flatten(results:RequirementResult[]):RequirementResult[] {
  return results.flatMap(result=>[result,...(result.children?flatten(result.children):[])]);
}
function actionsFor(checks:RequirementResult[]):string[] {
  return [...new Set(flatten(checks).filter(check=>check.status!=='met').map(check=>check.status==='unmet'?`${check.label}: applicant reports this is not met.`:`${check.label}: ${check.reason||'confirm this item.'}`))];
}

function buildBudget(programs:readonly Program[],asOf:string,request:GermanyStudyPlanInput['budget'],profile:Profile,options:{unavailableReason?:string;insuranceContext?:GermanyStudyPlanInput['insuranceContext']}={}) {
  const quoteMap=request?.quotes??{};
  const quoteByCategory=quoteMap as Partial<Record<BudgetCategory,Quote>>;
  const known=programs.find(program=>program.id==='de-masters-study');
  const expenseData=known?getGermanyStudyCostData(known):{financialRequirements:[],monthlyCosts:[]};
  const insuranceMatchesRequest=!!options.insuranceContext&&options.insuranceContext.asOf===asOf&&options.insuranceContext.age===profile.age;
  const insuranceReference:StudyCostSelection=options.insuranceContext
    ?insuranceMatchesRequest?selectStudentInsuranceCost(expenseData.monthlyCosts,options.insuranceContext):{status:'unknown',cost:null,reason:'Insurance context date and age must match the plan date and profile age; no TK tariff is selected.'}
    :{status:'unknown',cost:null,reason:'No explicit insurance eligibility context was supplied; no TK tariff is selected.'};
  const projectionRequested=request?.monthlyProjectionMonths===12;
  const futureQuote=categories.some(category=>quoteByCategory[category]&&quoteByCategory[category]!.reviewedOn>asOf);
  const quotesComplete=categories.every(category=>quoteByCategory[category]!==undefined);
  const dependentsIncomplete=profile.dependents>0||profile.familyStatus!=='single';
  const uncoveredMonthly=categories.filter(category=>quotePeriod[category]==='monthly'&&quoteByCategory[category]!==undefined&&quoteByCategory[category]!.coversMonths!==12);
  const allMonthlyCovered=categories.filter(category=>quotePeriod[category]==='monthly').every(category=>quoteByCategory[category]?.coversMonths===12);
  const projectionAllowed=projectionRequested&&allMonthlyCovered&&!dependentsIncomplete&&!options.unavailableReason;
  const complete=!options.unavailableReason&&quotesComplete&&!futureQuote&&projectionRequested&&!dependentsIncomplete&&uncoveredMonthly.length===0;
  const items=categories.map(category=>{
    const quote=quoteByCategory[category];
    const future=quote!==undefined&&quote.reviewedOn>asOf;
    const amount=quote&&!future?quote.amount:null;
    const period=quotePeriod[category];
    const perItemProjection=projectionRequested&&!dependentsIncomplete&&!options.unavailableReason&&amount!==null&&(period!=='monthly'||quote?.coversMonths===12);
    const projected=amount===null?null:period==='monthly'?(perItemProjection?money2(amount*12):null):money2(amount);
    return {category,label:categoryLabels[category],amount,currency:'EUR' as const,period,yearOneAmount:projected,
      source:quote&&!future?'applicant-quote' as const:'unknown' as const,
      description:quote?.description??(future?'Quote date is later than the plan date.':'No applicant quote supplied; amount remains unknown.'),
      sourceUrl:quote&&!future?quote.sourceUrl:null,reviewedOn:quote&&!future?quote.reviewedOn:null,quoted:!!quote&&!future,included:complete&&amount!==null};
  });
  const missingCategories=categories.filter(category=>!quoteByCategory[category]||quoteByCategory[category]!.reviewedOn>asOf);
  const total=complete?money2(items.reduce((sum,item)=>sum+(item.yearOneAmount??0),0)):null;
  const original=studyPilotPrograms.find(program=>program.id==='de-masters-study');
  const originalProof=original?.audit?.financialRequirements.find(row=>row.period==='balance'&&row.currency==='EUR');
  const proofRows=expenseData.financialRequirements.filter(row=>row.classification?.purpose==='financing-proof'&&row.classification.stage==='masters'&&row.classification.includeInExpenseTotal===false);
  const proofSource=proofRows[0]?((({classification,...source})=>source)(proofRows[0])):undefined;
  const proof=proofRows.length===1&&originalProof&&canonicalJson(proofSource)===canonicalJson(originalProof)?proofRows[0]:undefined;
  const originalSalary=original?.audit?.financialRequirements.filter(row=>row.period==='annual'&&row.currency==='EUR')??[];
  const salaryRows=expenseData.financialRequirements.filter(row=>row.classification?.purpose==='salary-threshold'&&row.classification.stage==='work-permit'&&row.classification.includeInExpenseTotal===false&&
    originalSalary.some(expected=>canonicalJson(expected)===canonicalJson((({classification,...source})=>source)(row))));
  const tkCost=insuranceReference.status==='applicable'?insuranceReference.cost:null;
  return {
    currency:'EUR' as const,status:options.unavailableReason?'unavailable' as const:complete?'complete' as const:'partial' as const,
    complete,total,totalScope:'applicant-quoted-expense-scenario' as const,projectionMonths:projectionAllowed?12 as const:null,requestedProjectionMonths:projectionRequested?12 as const:null,
    items,missingCategories,uncoveredMonthlyCategories:uncoveredMonthly,dependentsIncomplete,
    proofItems:proof?[{label:proofLabel,amount:proof.amount,currency:'EUR' as const,period:'balance' as const,sourceUrl:proof.sourceUrl,
      classification:'funds-proof; not an expense and not included in the applicant-quoted expense total',validity:'2026 source amount; current applicability is not asserted outside 2026'}]:[],
    excludedItems:salaryRows.map(row=>({label:row.description,amount:row.amount,currency:'EUR' as const,period:row.period,sourceUrl:row.sourceUrl,
      classification:'salary threshold; excluded from study expense total',validity:'2026 source amount; current applicability is not asserted outside 2026'})),
    insuranceReference:{status:insuranceReference.status,monthlyAmount:tkCost?.amount??null,sourceUrl:tkCost?.sourceUrl??null,
      reviewedAt:tkCost?.source.reviewedAt??null,reason:insuranceReference.reason,addedToTotal:false},
    ...(options.unavailableReason?{limitation:options.unavailableReason}:{}),
    assumptions:[
      'Housing quote includes utilities.',
      'Living quote excludes housing, insurance and semester fees/transit.',
      'Permit-fee quote combines entry visa and residence-title fees.',
      'Tuition and semester-fee quotes are annual; relocation is one-time.',
    ],
    limitations:[
      'This is an expense worksheet from applicant-entered quotes, not an official or complete Germany study budget.',
      'A quoted scenario total requires all seven categories, an explicit 12-month projection, monthly quotes marked as covering 12 months, and a single applicant with no dependants; family costs are not modeled.',
      'The €11,904 2026 balance is funds proof, not a fee or spending amount. Salary thresholds are work-stage criteria and are excluded.',
      'The TK rate is only a separately selected dated monthly reference. Its duration is unknown and it is never automatically added or annualized.',
    ],
  };
}

export type GermanyStudyPlanResult=ReturnType<typeof buildGermanyStudyPlan>;

/** Compose the dated, partial Germany study journey and honest quote worksheet without persistence or network access. */
export function buildGermanyStudyPlan(programs:readonly Program[],input:unknown) {
  const request=germanyStudyPlanRequestSchema.parse(input);
  const parsedPrograms=programs;
  if(request.asOf.slice(0,4)!=='2026') return unavailableResult(request.asOf,'The reviewed Germany journey and 2026 financial references are scoped to the 2026 review year; no other year is assessed.',request.profile,request.budget,request.insuranceContext);
  let journey;
  try {journey=validateJourney(germanyStudyJourney,parsedPrograms);} catch(error) {
    const reason=error instanceof Error?`Germany journey source/model unavailable: ${error.message}`:'Germany journey source/model unavailable.';
    return unavailableResult(request.asOf,reason,request.profile,request.budget,request.insuranceContext);
  }
  const byId=new Map(parsedPrograms.map(program=>[program.id,program]));
  const requiredIds=['de-masters-study','de-graduate-jobsearch'];
  for(const id of requiredIds) if(!byId.has(id)) return unavailableResult(request.asOf,`Required Germany catalog record '${id}' is missing.`,request.profile,request.budget,request.insuranceContext);
  const reviewedDates=journey.stages.flatMap(stage=>[...stage.conditions,...stage.transitions.flatMap(edge=>edge.conditions)]
    .map(condition=>claimFor(byId.get(condition.source.programId),condition)?.checkedAt.slice(0,10)??null).filter((date):date is string=>date!==null));
  reviewedDates.push(...germanyStageEvidenceFacts.map(fact=>fact.reviewedAt));
  if(reviewedDates.some(date=>request.asOf<date)) return unavailableResult(request.asOf,'The requested plan date predates one or more reviewed Germany journey claims; no later evidence is projected backward.',request.profile,request.budget,request.insuranceContext);
  const stages=journey.stages.map(stage=>{
    const stageProgram=stage.programIds.length===1?byId.get(stage.programIds[0]):undefined;
    let checks:RequirementResult[]=[];
    if(stageProgram&&(stage.id==='masters'||stage.id==='graduate-job-search')){
      const assessment=assessRouteRequirements(stageProgram,request.profile);
      if(!assessment) return {id:stage.id,kind:stage.kind,label:stage.label,status:'unavailable' as const,checks:[],claims:findClaims(stage,byId),
        missingActions:['The attached source/requirement snapshot does not match the reviewed study pilot.'],
        transitions:stage.transitions.map(edge=>({to:edge.to,jobOffer:edge.jobOffer,selected:stage.id===journey.entryStageId&&edge.to===(request.profile.hasJobOffer?'work-permit':'graduate-job-search'),conditions:requirementFromCondition(edge.conditions[0],byId,request.profile)}))};
      checks=assessment.result.children??[assessment.result];
      if(stage.id==='graduate-job-search'){
        const claim=stage.conditions.flatMap(condition=>[claimFor(byId.get(condition.source.programId),condition)]).find((item):item is SourceClaim=>item!==undefined);
        if(claim) checks.push({id:'graduate-authority-review',label:'Competent authority review for the graduate permit',kind:'manual',status:'unknown',
          source:{url:claim.sourceUrl,reviewedAt:claim.checkedAt,effectiveAt:null,retrieval:claim.retrieval},
          reason:'Confirm the current permit checklist, completion evidence, filing window and authority decision; applicant facts do not establish permit approval.'});
      }
    } else {
      checks=stage.conditions.flatMap(condition=>requirementFromCondition(condition,byId,request.profile));
    }
    const reviewStage=stage.id==='work-permit'?'work':stage.id==='permanent-residence'?'settlement':undefined;
    if(reviewStage) checks.push(...stageReviewChecks(reviewStage,request.stageEvidence));
    return {id:stage.id,kind:stage.kind,label:stage.label,status:statusOf(checks),checks,claims:findClaims(stage,byId),
      ...(reviewStage?{supplementalReview:{id:germanyStageReview.id,reviewedAt:germanyStageReview.reviewedAt,reviewStatus:germanyStageReview.reviewStatus,
        appliesToCatalog:germanyStageReview.appliesToCatalog,limitations:[...germanyStageReview.limitations],claims:stageReviewClaims(reviewStage)}}:{}),
      missingActions:actionsFor(checks),
      transitions:stage.transitions.map(edge=>({to:edge.to,jobOffer:edge.jobOffer,
        selected:stage.id===journey.entryStageId&&edge.to===(request.profile.hasJobOffer?'work-permit':'graduate-job-search'),
        conditions:edge.conditions.flatMap(condition=>requirementFromCondition(condition,byId,request.profile))}))};
  });
  if(stages.some(stage=>stage.status==='unavailable')) {
    const reason='The attached Germany study route evidence is stale or incomplete; automatic plan assessment is unavailable.';
    return unavailableResult(request.asOf,reason,request.profile,request.budget,request.insuranceContext);
  }
  return {availability:'available' as const,asOf:request.asOf,
    journey:{id:journey.id,version:journey.version,entryStageId:journey.entryStageId,
      selectedEntryBranch:request.profile.hasJobOffer?'work-permit' as const:'graduate-job-search' as const,stages},
    budget:buildBudget(parsedPrograms,request.asOf,request.budget,request.profile,{insuranceContext:request.insuranceContext}),
    limitations:planLimitations,
  };
}
