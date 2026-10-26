import {z} from 'zod';
import {bonnApplicationReview} from './data/bonn-application-review';

const answerSchema=z.enum(['yes','no','unknown']);
const reportSchema=z.enum(['present','absent','unknown']);
const applicantGroupFactorsSchema=z.object({
  eeaCitizen:answerSchema.optional(),
  eeaUniversityDegreeBy2027March31:answerSchema.optional(),
  eeaFamilyMemberBasis:answerSchema.optional(),
  otherEeaEquivalentBasis:answerSchema.optional(),
}).strict();
const conditionalFactsSchema=z.object({
  priorEducationInApsCountry:answerSchema.optional(),
  translationRequired:answerSchema.optional(),
  bothSecondaryAndBachelorEducationOutsideEurope:answerSchema.optional(),
  thesisNeedsEnglishSummary:answerSchema.optional(),
}).strict();
const degreeFactsSchema=z.object({
  provisionalIssuedByExamOffice:answerSchema.optional(),
  provisionalStatesAllRequirementsFulfilled:answerSchema.optional(),
  expectedProofIssuedByExamOffice:answerSchema.optional(),
  expectedRemainingExamsAtMostHalfYear:answerSchema.optional(),
  expectedAllExamsBeforeSemesterStart:answerSchema.optional(),
  expectedThesisEctsStatedIfMissingFromTranscript:answerSchema.optional(),
}).strict();
const documentIds=bonnApplicationReview.documentRequirements.map(item=>item.id) as [string,...string[]];
const documentInventorySchema=z.partialRecord(z.enum(documentIds),reportSchema).optional();
const REVIEW_CUTOFF='2026-12-31';
const DATE='2026-10-26';

/** Stateless reported application facts; never reads or infers Profile fields. */
export const bonnApplicationRequestSchema=z.object({
  programmeId:z.string().trim().min(1).max(100),
  intake:z.string().trim().min(1).max(80),
  asOf:z.iso.date(),
  applicationDate:z.iso.date().optional(),
  groupFactors:applicantGroupFactorsSchema.optional(),
  degreeDocumentBranch:z.enum(['completed','final-pending','expected-completion','unknown']).optional(),
  degreeDocumentFacts:degreeFactsSchema.optional(),
  conditionalFacts:conditionalFactsSchema.optional(),
  documents:documentInventorySchema,
}).strict();
export type BonnApplicationInput=z.infer<typeof bonnApplicationRequestSchema>;
type Request=z.infer<typeof bonnApplicationRequestSchema>;
type Applicability='yes'|'no'|'unknown';
type DocumentResult={id:string;label:string;requirement:'required'|'conditional'|'recommended'|'optional';condition:string;summary:string;sourceId:string;applicability:Applicability;applicabilityBasis:'published-unconditional'|'reported-context'|'unknown';officialApplicability:'unknown';reportedStatus:'reported-present'|'reported-absent'|'unknown';verificationStatus:'unknown';reason:string};

function unavailable(request:Request,reason:string) {
  return {availability:'unavailable' as const,programmeId:request.programmeId,intake:request.intake,asOf:request.asOf,applicationDate:request.applicationDate??null,
    programme:null,windows:[] as const,group:{candidateEeaGroup:'unknown' as const,officialGroup:'unknown' as const,factors:[] as const,selectionClassification:'unknown' as const},
    documents:[] as const,degreeBranch:request.degreeDocumentBranch??'unknown',degreeFacts:[] as const,missingActions:[reason],sources:[],
    applicationDecision:'not-assessed' as const,applicationCompleteness:'not-assessed' as const,visaEligibilityAssessed:false as const,
    sourceDateScope:{reviewedAt:DATE,availabilityCutoff:REVIEW_CUTOFF,cutoffMeaning:'Product freshness policy only; not an official source expiry or legal effective date.'},
    limitations:['No current application checklist is available for this programme/intake/date.']};
}

function orAnswer(values:readonly (Applicability|undefined)[]):Applicability {
  if(values.some(value=>value==='yes')) return 'yes';
  if(values.every(value=>value==='no')) return 'no';
  return 'unknown';
}
function mapReported(value:'present'|'absent'|'unknown'|undefined):DocumentResult['reportedStatus'] {
  if(value==='present') return 'reported-present';
  if(value==='absent') return 'reported-absent';
  return 'unknown';
}
function dateWindowStatus(date:string|undefined,start:string,end:string):'not-provided'|'before'|'after'|'inside-date-range'|'boundary-time-unconfirmed' {
  if(!date) return 'not-provided';
  if(date<start) return 'before';
  if(date>end) return 'after';
  if(date===start||date===end) return 'boundary-time-unconfirmed';
  return 'inside-date-range';
}

/** Evaluate only the partial Bonn CS Summer 2027 application review. */
export function evaluateBonnApplication(input:unknown) {
  const request=bonnApplicationRequestSchema.parse(input);
  if(request.programmeId!==bonnApplicationReview.programmeId||request.intake!==bonnApplicationReview.intake)
    return unavailable(request,'This programme or intake is not in the reviewed application checklist.');
  if(request.asOf<bonnApplicationReview.reviewedAt)
    return unavailable(request,'The requested source date predates this review; later evidence is not projected backward.');
  if(request.asOf>REVIEW_CUTOFF)
    return unavailable(request,'The checklist was reviewed on 2026-10-26 and is outside its product freshness window.');

  const sourceById=new Map(bonnApplicationReview.sources.map(item=>[item.id,item]));
  const usedIds=[...bonnApplicationReview.applicationWindows.map(item=>item.sourceId),...bonnApplicationReview.applicantGroups.map(item=>item.sourceId),...bonnApplicationReview.documentRequirements.map(item=>item.sourceId)];
  const expectedDocIds=['degree-certificates-completed','expected-completion-confirmation','provisional-degree-certificate','transcripts-all-enrolled-programmes','aps-china-india-vietnam','diploma-supplement-module-descriptions','cv','thesis-original-or-permitted-draft','thesis-english-summary','english-proof-non-europe-secondary-and-bachelor','english-evidence-european-education','motivation-letter','translation-if-required','degree-final-before-semester-start-conditional-admission'];
  const sourcesValid=sourceById.size===bonnApplicationReview.sources.length&&new Set(usedIds).size>0&&usedIds.every(id=>sourceById.has(id))&&
    sourceById.get('bonn-cs-application-page')?.contentRetrieved===true&&sourceById.get('bonn-cs-application-page')?.checkedAt===DATE&&
    sourceById.get('bonn-cs-deadlines-page')?.retrieval==='official-indexed-result'&&sourceById.get('bonn-cs-deadlines-page')?.contentRetrieved===false&&sourceById.get('bonn-cs-deadlines-page')?.checkedAt===DATE;
  const docsValid=bonnApplicationReview.documentRequirements.length===expectedDocIds.length&&expectedDocIds.every(id=>bonnApplicationReview.documentRequirements.filter(item=>item.id===id).length===1)&&bonnApplicationReview.documentRequirements.every(item=>item.verificationAlwaysManual===true&&item.sourceId==='bonn-cs-application-page');
  const windowsValid=bonnApplicationReview.applicationWindows.length===2&&new Set(bonnApplicationReview.applicationWindows.map(item=>item.id)).size===2&&bonnApplicationReview.applicationWindows.some(item=>item.id==='first'&&item.startsOn==='2026-10-01'&&item.endsOn==='2026-11-01'&&item.group==='no-extra-restriction-stated'&&item.boundarySemantics==='date-only-start-end-inclusion-unknown')&&bonnApplicationReview.applicationWindows.some(item=>item.id==='second'&&item.startsOn==='2026-12-15'&&item.endsOn==='2027-01-15'&&item.group==='eea-students-only'&&item.boundarySemantics==='date-only-start-end-inclusion-unknown');
  if(!sourcesValid||!docsValid||!windowsValid||bonnApplicationReview.reviewStatus!=='partial')
    return unavailable(request,'The application checklist contains missing, duplicated, or insufficiently reviewed source metadata.');

  const factors=request.groupFactors??{};
  const candidateEea=orAnswer([factors.eeaCitizen,factors.eeaUniversityDegreeBy2027March31]);
  const allEeaBasesExplicitlyNo=factors.eeaCitizen==='no'&&factors.eeaUniversityDegreeBy2027March31==='no'&&factors.eeaFamilyMemberBasis==='no'&&factors.otherEeaEquivalentBasis==='no';
  const candidateEeaGroup: 'eea-reported'|'non-eea-reported'|'unknown'=candidateEea==='yes'?'eea-reported':allEeaBasesExplicitlyNo?'non-eea-reported':'unknown';
  const groupFacts=bonnApplicationReview.applicantGroups.filter(item=>item.context==='application-window').map(item=>{
    const reported=item.id==='eea-citizen'?factors.eeaCitizen:item.id==='eea-degree-by-2027-03-31'?factors.eeaUniversityDegreeBy2027March31:item.id==='eea-family-member'?factors.eeaFamilyMemberBasis:undefined;
    return {id:item.id,label:item.summary,reported:reported??'unknown',status:'unknown' as const,sourceId:item.sourceId,reason:item.evidenceNotes};
  });
  const windows=bonnApplicationReview.applicationWindows.map(window=>{
    const dateStatus=dateWindowStatus(request.applicationDate,window.startsOn,window.endsOn);
    const groupCondition=window.group==='eea-students-only'?candidateEeaGroup:'not-stated';
    const outsideDateRange=dateStatus==='before'||dateStatus==='after';
    const reportedGroupMismatch=window.group==='eea-students-only'&&candidateEeaGroup==='non-eea-reported';
    return {id:window.id,startsOn:window.startsOn,endsOn:window.endsOn,group:window.group,groupCondition,dateStatus,
      status:!request.applicationDate?'unknown':outsideDateRange?'outside-date-range':dateStatus==='boundary-time-unconfirmed'?'boundary-time-unconfirmed':reportedGroupMismatch?'inside-date-range-reported-group-mismatch':candidateEeaGroup==='unknown'&&window.group==='eea-students-only'?'group-unknown':'inside-date-range-conditional',
      officialDeadlineDecision:'unknown' as const,sourceId:window.sourceId,sourceUrl:sourceById.get(window.sourceId)!.sourceUrl,
      reason:`Calendar dates are from an official indexed result, not a directly retrieved deadline page. No time zone, closing time, or endpoint inclusion was stated. ${window.group==='no-extra-restriction-stated'?'No additional group restriction was stated for this phase; this does not establish that every applicant can apply.':reportedGroupMismatch?'The applicant-reported factors do not indicate an EEA basis; this is not an official group or eligibility decision.':'The second period is stated for EEA students only; group assignment remains manual.'}`};
  });

  const branch=request.degreeDocumentBranch??'unknown';
  const conditional=request.conditionalFacts??{};
  const applicabilityFor=(id:string):Applicability=>{
    if(id==='degree-certificates-completed') return branch==='completed'?'yes':'unknown';
    if(id==='provisional-degree-certificate') return branch==='final-pending'?'yes':branch==='unknown'?'unknown':'no';
    if(id==='expected-completion-confirmation') return branch==='expected-completion'?'yes':branch==='unknown'?'unknown':'no';
    if(id==='aps-china-india-vietnam') return conditional.priorEducationInApsCountry??'unknown';
    if(id==='translation-if-required') return conditional.translationRequired??'unknown';
    if(id==='english-proof-non-europe-secondary-and-bachelor') return conditional.bothSecondaryAndBachelorEducationOutsideEurope??'unknown';
    if(id==='english-evidence-european-education') {
      const value=conditional.bothSecondaryAndBachelorEducationOutsideEurope;
      return value==='no'?'yes':value==='yes'?'no':'unknown';
    }
    if(id==='thesis-english-summary') return conditional.thesisNeedsEnglishSummary??'unknown';
    if(id==='degree-final-before-semester-start-conditional-admission') return 'unknown';
    return 'yes';
  };
  const documents:DocumentResult[]=bonnApplicationReview.documentRequirements.map(item=>{
    const applicability=applicabilityFor(item.id);
    const reportedStatus=mapReported(request.documents?.[item.id as keyof NonNullable<Request['documents']>]);
    const conditionalIds=['degree-certificates-completed','provisional-degree-certificate','expected-completion-confirmation','aps-china-india-vietnam','translation-if-required','english-proof-non-europe-secondary-and-bachelor','english-evidence-european-education','thesis-english-summary','degree-final-before-semester-start-conditional-admission'];
    const applicabilityBasis:DocumentResult['applicabilityBasis']=applicability==='unknown'?'unknown':conditionalIds.includes(item.id)?'reported-context':'published-unconditional';
    const reason=applicability==='unknown'?`Applicability is unknown until the stated condition is assessed. ${item.summary}`:applicability==='no'?`The applicant-reported branch or condition does not indicate this item; this is not an official exemption. Bonn decides actual applicability. ${item.summary}`:reportedStatus==='reported-absent'?`Applicant reports this item is absent in the stated context. This is not a university completeness decision. ${item.summary}`:reportedStatus==='reported-present'?`Applicant reports this item is present; authenticity, sufficiency, language and Bonn acceptance remain unverified. ${item.summary}`:`No document status was supplied. Presence and university acceptance remain unknown. ${item.summary}`;
    return {id:item.id,label:item.label,requirement:item.requirement,condition:item.condition,summary:item.summary,sourceId:item.sourceId,applicability,applicabilityBasis,officialApplicability:'unknown',reportedStatus,verificationStatus:'unknown',reason};
  });

  const relevantDegreeFactKeys=branch==='final-pending'
    ?['provisionalIssuedByExamOffice','provisionalStatesAllRequirementsFulfilled'] as const
    :branch==='expected-completion'
      ?['expectedProofIssuedByExamOffice','expectedRemainingExamsAtMostHalfYear','expectedAllExamsBeforeSemesterStart','expectedThesisEctsStatedIfMissingFromTranscript'] as const
      :[] as const;
  const degreeFacts=relevantDegreeFactKeys.map(key=>{
    const value=request.degreeDocumentFacts?.[key]??'unknown';
    return {key,applicability:'yes' as const,reported:value,status:'unknown' as const,
      reason:value==='no'?'Applicant reports the source-specific document detail is not met; this is not an institutional ruling.':value==='yes'?'Applicant reports this detail; issuer/document content has not been verified.':'No applicant answer was supplied; this required branch detail remains unknown.'};
  });
  const missingActions=[...windows.filter(item=>item.status==='group-unknown'||item.status==='boundary-time-unconfirmed'||item.status==='inside-date-range-reported-group-mismatch').map(item=>`${item.id} application window: ${item.reason}`),
    ...documents.filter(item=>item.id!=='degree-final-before-semester-start-conditional-admission'&&item.applicability==='unknown').map(item=>`${item.label}: Applicability requires review. ${item.condition}`),
    ...documents.filter(item=>item.applicability==='yes'&&(item.requirement==='required'||item.requirement==='conditional')&&(item.reportedStatus==='reported-absent'||item.reportedStatus==='unknown')).map(item=>`${item.label}: ${item.reason}`),
    ...degreeFacts.filter(item=>item.reported==='no'||item.reported==='unknown').map(item=>`${item.key}: ${item.reason}`),
    'Bonn must assign the applicant group, applicable filing deadline, document sufficiency, completeness, ranking, and admission decision.'];
  const usedSources=new Set([...windows.map(item=>item.sourceId),...documents.map(item=>item.sourceId),...groupFacts.map(item=>item.sourceId)]);
  const sources=bonnApplicationReview.sources.filter(source=>usedSources.has(source.id)).map(source=>({...source}));
  return {availability:'available' as const,programmeId:request.programmeId,intake:request.intake,asOf:request.asOf,applicationDate:request.applicationDate??null,
    sourceDateScope:{reviewedAt:bonnApplicationReview.reviewedAt,availabilityCutoff:REVIEW_CUTOFF,cutoffMeaning:'Product freshness policy only; not an official source expiry or legal effective date.'},
    programme:{id:bonnApplicationReview.id,institution:bonnApplicationReview.institution,programme:bonnApplicationReview.programme,intake:bonnApplicationReview.intake,reviewedAt:bonnApplicationReview.reviewedAt,reviewStatus:bonnApplicationReview.reviewStatus},
    group:{candidateEeaGroup,officialGroup:'unknown' as const,factors:groupFacts,selectionClassification:'unknown' as const,
      limitations:bonnApplicationReview.applicantGroups.filter(item=>item.context==='selection-classification').map(item=>({id:item.id,summary:item.summary,sourceId:item.sourceId,evidenceNotes:item.evidenceNotes,status:'unknown' as const}))},
    windows,degreeBranch:branch,degreeFacts,documents,missingActions,sources,
    applicationDecision:'not-assessed' as const,applicationCompleteness:'not-assessed' as const,visaEligibilityAssessed:false as const,
    limitations:[...bonnApplicationReview.limitations,`Sources were reviewed on ${DATE}; asOf does not trigger a new source review.`,`The ${REVIEW_CUTOFF} cutoff is a product freshness policy, not an official expiry or rule-validity date.`,`Applicant group factors, document-presence reports, dates, and content claims are unverified; positive answers never become university-confirmed.`,`For an expected-completion branch, the evaluator does not compare the final-examination date with the semester start; completion timing and proof remain unassessed.`,`No application-completeness, admission, ranking, or visa decision is made.`]};
}

export type BonnApplicationResult=ReturnType<typeof evaluateBonnApplication>;
