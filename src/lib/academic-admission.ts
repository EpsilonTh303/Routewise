import {z} from 'zod';
import {germanyAcademicProgrammes} from './data/germany-academic-programmes';

const answerSchema=z.enum(['yes','no','unknown']);
const ectsSchema=z.number().finite().min(0).max(600);
const evidenceReferenceSchema=z.string().trim().min(1).max(300);
const REVIEW_DATE='2026-10-26';
const REVIEW_CUTOFF='2026-12-31';
const applicantEvidenceSchema=z.object({
  relevantBachelor:answerSchema.optional(),
  degreeEquivalence:answerSchema.optional(),
  mathEctsReported:ectsSchema.optional(),mathEvidenceReference:evidenceReferenceSchema.optional(),
  theoryEctsReported:ectsSchema.optional(),theoryEvidenceReference:evidenceReferenceSchema.optional(),
  programmingEctsReported:ectsSchema.optional(),programmingEvidenceReference:evidenceReferenceSchema.optional(),
  thesisEctsReported:ectsSchema.optional(),thesisEvidenceReference:evidenceReferenceSchema.optional(),
  thesisScientificQuality:answerSchema.optional(),
  englishC1:answerSchema.optional(),acceptedEnglishProof:answerSchema.optional(),
}).strict();

/** Academic answers are plan-only and intentionally separate from Profile and visa evidence. */
export const academicAdmissionRequestSchema=z.object({
  programmeId:z.string().trim().min(1).max(100),
  asOf:z.iso.date(),
  intake:z.string().trim().min(1).max(80),
  evidence:applicantEvidenceSchema.optional(),
}).strict();
export type AcademicAdmissionInput=z.infer<typeof academicAdmissionRequestSchema>;
type ApplicantEvidence=z.infer<typeof applicantEvidenceSchema>;
type CreditKey='mathEctsReported'|'theoryEctsReported'|'programmingEctsReported'|'thesisEctsReported';
type ReferenceKey='mathEvidenceReference'|'theoryEvidenceReference'|'programmingEvidenceReference'|'thesisEvidenceReference';
type AnswerKey='relevantBachelor'|'degreeEquivalence'|'thesisScientificQuality'|'englishC1'|'acceptedEnglishProof';
type CheckStatus='unknown'|'unmet';
type ReportedComparison='reported-meets-minimum'|'reported-below-minimum'|'not-reported';
type AcademicCheck={
  id:string;label:string;kind:'credit'|'manual';status:CheckStatus;
  reportedValue:number|string|null;minimumEcts:number|null;reportedComparison:ReportedComparison|null;
  evidenceReference:string|null;sourceId:string|null;reason:string;
};

const creditInputs:readonly {requirementId:string;valueKey:CreditKey;referenceKey:ReferenceKey}[]=[
  {requirementId:'mathematical-foundations',valueKey:'mathEctsReported',referenceKey:'mathEvidenceReference'},
  {requirementId:'algorithms-theory-complexity-formal-languages',valueKey:'theoryEctsReported',referenceKey:'theoryEvidenceReference'},
  {requirementId:'programming-software-information-systems',valueKey:'programmingEctsReported',referenceKey:'programmingEvidenceReference'},
  {requirementId:'scientific-bachelors-thesis',valueKey:'thesisEctsReported',referenceKey:'thesisEvidenceReference'},
];

function unavailable(programmeId:string,intake:string,asOf:string,reason:string) {
  return {availability:'unavailable' as const,programmeId,intake,asOf,programme:null,checks:[] as AcademicCheck[],overallStatus:'unavailable' as const,
    missingActions:[reason],visaEligibilityAssessed:false as const,admissionDecision:'not-assessed' as const,
    sourceDateScope:{reviewedAt:REVIEW_DATE,availabilityCutoff:REVIEW_CUTOFF,cutoffMeaning:'Product freshness policy only; not an official source expiry or legal effective date.'},
    limitations:['No academic or visa conclusion is available for this programme/intake/date combination.']};
}
function qualitativeCheck(id:string,label:string,sourceId:string|null,value:ApplicantEvidence[AnswerKey]|undefined):AcademicCheck {
  const status:CheckStatus=value==='no'?'unmet':'unknown';
  const reason=value==='no'
    ?'Applicant reports this requirement is not met; this is not an academic committee ruling.'
    :value==='yes'
      ?'Applicant reports this may be met, but the transcript/certificate and university acceptance remain unverified.'
      :value==='unknown'
        ?'Applicant selected unknown; obtain the relevant academic evidence and institutional review.'
        :'No applicant answer was supplied; the requirement remains unknown.';
  return {id,label,kind:'manual',status,reportedValue:value??null,minimumEcts:null,reportedComparison:null,evidenceReference:null,sourceId,reason};
}

/** Evaluate only reported facts for the one dated Bonn programme; never infer admission or visa eligibility. */
export function evaluateAcademicAdmission(input:unknown) {
  const request=academicAdmissionRequestSchema.parse(input);
  const review=germanyAcademicProgrammes.find(item=>item.programmeId===request.programmeId&&item.intake===request.intake);
  if(!review) return unavailable(request.programmeId,request.intake,request.asOf,'This programme or intake is not in the reviewed academic checklist.');
  if(request.asOf<review.reviewedAt) return unavailable(request.programmeId,request.intake,request.asOf,'The requested date predates this programme review; later evidence is not projected backward.');
  if(request.asOf>REVIEW_CUTOFF) return unavailable(request.programmeId,request.intake,request.asOf,'This intake checklist was reviewed on 2026-10-26 and is not assessed beyond 2026-12-31 without a refreshed source review.');

  const sourceIds=new Set(review.sources.map(source=>source.id));
  const sourceById=new Map(review.sources.map(source=>[source.id,source]));
  const creditCounts=creditInputs.map(rule=>review.creditRequirements.filter(item=>item.id===rule.requirementId));
  const creditRules=creditInputs.map((rule,index)=>({rule,requirement:creditCounts[index][0]}));
  const manualIds=['recognized-related-bachelors-degree','scientific-thesis-review','english-c1-proof-accepted','competitive-selection-and-offer'] as const;
  const manualRules=manualIds.map(id=>({id,matches:review.manualRequirements.filter(item=>item.id===id)}));
  const expectedMinimums=[18,14,18,12];
  const usedSources=[...creditRules.flatMap(item=>item.requirement?[item.requirement.sourceId]:[]),...manualRules.flatMap(item=>item.matches.map(requirement=>requirement.sourceId))];
  const malformed=review.id!=='bonn-computer-science-msc'||review.reviewedAt!==REVIEW_DATE||review.reviewStatus!=='partial'||
    review.creditRequirements.length!==creditInputs.length||creditRules.some(({requirement},index)=>creditCounts[index].length!==1||!requirement||requirement.minimumEcts!==expectedMinimums[index])||
    review.manualRequirements.length!==manualIds.length||manualRules.some(item=>item.matches.length!==1||item.matches[0].outcomeAlwaysManual!==true)||
    sourceById.size!==review.sources.length||usedSources.some(id=>!sourceIds.has(id)||sourceById.get(id)?.contentRetrieved!==true||sourceById.get(id)?.checkedAt!==REVIEW_DATE);
  if(malformed) return unavailable(request.programmeId,request.intake,request.asOf,'The reviewed academic checklist has incomplete, duplicated or unreviewed source links.');

  const evidence=request.evidence??{};
  const checks:AcademicCheck[]=creditRules.map(({rule,requirement})=>{
    const item=requirement!;
    const reported=evidence[rule.valueKey];
    const reference=evidence[rule.referenceKey]??null;
    const comparison:ReportedComparison=reported===undefined?'not-reported':reported>=item.minimumEcts?'reported-meets-minimum':'reported-below-minimum';
    const status:CheckStatus=comparison==='reported-below-minimum'?'unmet':'unknown';
    const detail=`${item.summary} ${item.limitations}`;
    const reason=reported===undefined
      ?reference?`An evidence reference was supplied without a reported ECTS amount; amount and academic acceptance remain unknown. ${detail}`:`No ECTS amount was supplied; the threshold comparison remains unknown. ${detail}`
      :comparison==='reported-below-minimum'
        ?`Applicant-reported ${reported} ECTS is below the ${item.minimumEcts} ECTS minimum. This is a reported shortfall, not an academic committee ruling. ${detail}`
        :`Applicant-reported ${reported} ECTS reaches the ${item.minimumEcts} ECTS minimum numerically; course content, credit conversion and university acceptance remain unverified. ${detail}`;
    return {id:item.id,label:item.label,kind:'credit',status,reportedValue:reported??null,minimumEcts:item.minimumEcts,reportedComparison:comparison,
      evidenceReference:reference,sourceId:item.sourceId,reason};
  });
  const findManualById=(id:string)=>review.manualRequirements.find(item=>item.id===id)!;
  const degreeSource=findManualById('recognized-related-bachelors-degree').sourceId;
  const thesisSource=findManualById('scientific-thesis-review').sourceId;
  const englishSource=findManualById('english-c1-proof-accepted').sourceId;
  checks.push(
    qualitativeCheck('relevant-bachelor-subject','Computer Science or a related bachelor-level subject',degreeSource,evidence.relevantBachelor),
    qualitativeCheck('degree-equivalence','Foreign degree is recognized as equivalent to at least a German bachelor’s degree',degreeSource,evidence.degreeEquivalence),
    qualitativeCheck('thesis-scientific-quality','Bachelor’s thesis meets the scientific content and quality requirements',thesisSource,evidence.thesisScientificQuality),
    qualitativeCheck('english-c1','English ability is at CEFR C1 or higher',englishSource,evidence.englishC1),
    qualitativeCheck('accepted-english-proof','The applicant’s language certificate or education-system evidence is accepted',englishSource,evidence.acceptedEnglishProof),
  );
  const selection=findManualById('competitive-selection-and-offer');
  checks.push({id:selection.id,label:selection.label,kind:'manual',status:'unknown',reportedValue:null,minimumEcts:null,reportedComparison:null,evidenceReference:null,sourceId:selection.sourceId,
    reason:`${selection.summary} A checklist cannot determine ranking or produce an admission offer.`});
  const missingActions=checks.map(check=>`${check.label}: ${check.reason}`);
  const overallStatus=checks.some(check=>check.status==='unmet')?'reported-gaps' as const:'unknown' as const;
  return {
    availability:'available' as const,programmeId:review.programmeId,intake:review.intake,asOf:request.asOf,
    sourceDateScope:{reviewedAt:review.reviewedAt,availabilityCutoff:REVIEW_CUTOFF,cutoffMeaning:'Product freshness policy only; not an official source expiry or legal effective date.'},
    programme:{id:review.id,institution:review.institution,programme:review.programme,intake:review.intake,reviewedAt:review.reviewedAt,
      reviewStatus:review.reviewStatus,sources:review.sources.map(source=>({...source})),limitations:[...review.limitations]},
    checks,overallStatus,missingActions,visaEligibilityAssessed:false as const,admissionDecision:'not-assessed' as const,
    limitations:[...review.limitations,`Source content was checked on ${REVIEW_DATE}; the as-of date does not trigger a new source check.`,`The ${REVIEW_CUTOFF} cutoff is a product freshness policy, not an official source expiry date or legal effective date.`,'A positive self-report or numeric minimum comparison is not verified evidence or an admission decision.','Visa/student-permit eligibility is not assessed by this academic checklist.'],
  };
}

export type AcademicAdmissionResult=ReturnType<typeof evaluateAcademicAdmission>;
