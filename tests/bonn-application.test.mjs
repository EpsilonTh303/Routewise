import test from 'node:test';
import assert from 'node:assert/strict';
import {bonnApplicationRequestSchema,evaluateBonnApplication} from '../src/lib/bonn-application.ts';
import {bonnApplicationReview} from '../src/lib/data/bonn-application-review.ts';

const base={programmeId:'bonn-computer-science-msc',intake:'summer-2027',asOf:'2026-10-26'};

test('even every document and positive content report cannot establish official completeness',()=>{
  const documents=Object.fromEntries(bonnApplicationReview.documentRequirements.map(item=>[item.id,'present']));
  const result=evaluateBonnApplication({...base,applicationDate:'2026-12-20',
    groupFactors:{eeaCitizen:'yes',eeaUniversityDegreeBy2027March31:'yes',eeaFamilyMemberBasis:'yes',otherEeaEquivalentBasis:'yes'},
    degreeDocumentBranch:'expected-completion',documents,
    degreeDocumentFacts:{expectedProofIssuedByExamOffice:'yes',expectedRemainingExamsAtMostHalfYear:'yes',expectedAllExamsBeforeSemesterStart:'yes',expectedThesisEctsStatedIfMissingFromTranscript:'yes'},
    conditionalFacts:{priorEducationInApsCountry:'yes',translationRequired:'yes',bothSecondaryAndBachelorEducationOutsideEurope:'yes',thesisNeedsEnglishSummary:'yes'}});
  assert.ok(result.documents.every(item=>item.reportedStatus==='reported-present'&&item.verificationStatus==='unknown'&&item.officialApplicability==='unknown'));
  assert.ok(result.degreeFacts.every(item=>item.status==='unknown'));
  assert.equal(result.group.officialGroup,'unknown');
  assert.equal(result.applicationCompleteness,'not-assessed');
  assert.equal(result.applicationDecision,'not-assessed');
  assert.equal(result.visaEligibilityAssessed,false);
  assert.ok(!Object.hasOwn(result,'complete'));
});

test('Bonn application manifest preserves the dated sources and direct-retrieval gap',()=>{
  assert.equal(bonnApplicationReview.reviewStatus,'partial');
  assert.deepEqual(bonnApplicationReview.applicationWindows.map(item=>[item.startsOn,item.endsOn,item.group]),[
    ['2026-10-01','2026-11-01','no-extra-restriction-stated'],['2026-12-15','2027-01-15','eea-students-only'],
  ]);
  assert.ok(bonnApplicationReview.documentRequirements.every(item=>item.verificationAlwaysManual));
  const deadline=bonnApplicationReview.sources.find(item=>item.id==='bonn-cs-deadlines-page');
  assert.equal(deadline.contentRetrieved,false);
  assert.equal(deadline.retrieval,'official-indexed-result');
  assert.match(deadline.retrievalNote,/timed out/);
});

test('empty checklist keeps deadline group and document presence unknown',()=>{
  const result=evaluateBonnApplication(base);
  assert.equal(result.availability,'available');
  assert.equal(result.applicationCompleteness,'not-assessed');
  assert.equal(result.applicationDecision,'not-assessed');
  assert.equal(result.group.officialGroup,'unknown');
  assert.equal(result.group.candidateEeaGroup,'unknown');
  assert.ok(result.documents.every(item=>item.reportedStatus==='unknown'));
  assert.ok(result.documents.some(item=>item.id==='aps-china-india-vietnam'&&item.applicability==='unknown'));
  assert.ok(result.sources.some(item=>item.id==='bonn-cs-deadlines-page'&&!item.contentRetrieved));
  assert.ok(!Object.hasOwn(result,'eligible'));
});

test('EEA deadline classification is three-valued OR and never an official group assignment',()=>{
  const yes=evaluateBonnApplication({...base,groupFactors:{eeaCitizen:'yes',eeaUniversityDegreeBy2027March31:'no',eeaFamilyMemberBasis:'no',otherEeaEquivalentBasis:'no'}});
  assert.equal(yes.group.candidateEeaGroup,'eea-reported');
  assert.equal(yes.group.officialGroup,'unknown');
  const no=evaluateBonnApplication({...base,groupFactors:{eeaCitizen:'no',eeaUniversityDegreeBy2027March31:'no',eeaFamilyMemberBasis:'no',otherEeaEquivalentBasis:'no'}});
  assert.equal(no.group.candidateEeaGroup,'non-eea-reported');
  const uncertain=evaluateBonnApplication({...base,groupFactors:{eeaCitizen:'no',eeaUniversityDegreeBy2027March31:'unknown',eeaFamilyMemberBasis:'no',otherEeaEquivalentBasis:'no'}});
  assert.equal(uncertain.group.candidateEeaGroup,'unknown');
  const family=evaluateBonnApplication({...base,groupFactors:{eeaCitizen:'no',eeaUniversityDegreeBy2027March31:'no',eeaFamilyMemberBasis:'yes',otherEeaEquivalentBasis:'no'}});
  assert.equal(family.group.candidateEeaGroup,'unknown');
  assert.equal(family.group.officialGroup,'unknown');
  const omittedAlt=evaluateBonnApplication({...base,groupFactors:{eeaCitizen:'no',eeaUniversityDegreeBy2027March31:'no',eeaFamilyMemberBasis:'no'}});
  assert.equal(omittedAlt.group.candidateEeaGroup,'unknown');
});

test('window dates are calendar-only and date boundaries require manual time confirmation',()=>{
  const interior=evaluateBonnApplication({...base,applicationDate:'2026-10-20'});
  assert.equal(interior.windows[0].dateStatus,'inside-date-range');
  assert.equal(interior.windows[0].status,'inside-date-range-conditional');
  const boundary=evaluateBonnApplication({...base,applicationDate:'2026-11-01'});
  assert.equal(boundary.windows[0].dateStatus,'boundary-time-unconfirmed');
  assert.equal(boundary.windows[0].status,'boundary-time-unconfirmed');
  const secondUnknown=evaluateBonnApplication({...base,applicationDate:'2027-01-05'});
  assert.equal(secondUnknown.windows[1].status,'group-unknown');
  const secondNo=evaluateBonnApplication({...base,applicationDate:'2027-01-05',groupFactors:{eeaCitizen:'no',eeaUniversityDegreeBy2027March31:'no',eeaFamilyMemberBasis:'no',otherEeaEquivalentBasis:'no'}});
  assert.equal(secondNo.windows[1].dateStatus,'inside-date-range');
  assert.equal(secondNo.windows[1].status,'inside-date-range-reported-group-mismatch');
  assert.match(secondNo.windows[1].reason,/not a directly retrieved/);
  assert.match(secondNo.windows[1].reason,/not an official group or eligibility decision/);
});

test('degree branches keep conditional proof content reported and unverified',()=>{
  const result=evaluateBonnApplication({...base,degreeDocumentBranch:'expected-completion',documents:{'expected-completion-confirmation':'present'},degreeDocumentFacts:{expectedProofIssuedByExamOffice:'yes',expectedRemainingExamsAtMostHalfYear:'yes',expectedAllExamsBeforeSemesterStart:'no'}});
  const expected=result.documents.find(item=>item.id==='expected-completion-confirmation');
  assert.equal(expected.applicability,'yes');
  assert.equal(expected.reportedStatus,'reported-present');
  assert.equal(expected.officialApplicability,'unknown');
  assert.equal(expected.applicabilityBasis,'reported-context');
  assert.equal(expected.verificationStatus,'unknown');
  assert.match(expected.reason,/unverified/);
  assert.equal(result.degreeFacts.find(item=>item.key==='expectedAllExamsBeforeSemesterStart').status,'unknown');
  assert.equal(result.degreeFacts.find(item=>item.key==='expectedAllExamsBeforeSemesterStart').reported,'no');
  assert.equal(result.documents.find(item=>item.id==='provisional-degree-certificate').applicability,'no');
  const unknown=evaluateBonnApplication({...base,degreeDocumentBranch:'unknown'});
  assert.equal(unknown.documents.find(item=>item.id==='expected-completion-confirmation').applicability,'unknown');
  assert.equal(unknown.documents.find(item=>item.id==='degree-certificates-completed').applicability,'unknown');
  assert.equal(unknown.degreeFacts.length,0);
});

test('partial document inventories are accepted without treating missing fields as complete',()=>{
  const result=evaluateBonnApplication({...base,documents:{cv:'present','diploma-supplement-module-descriptions':'absent'}});
  assert.equal(result.documents.find(item=>item.id==='cv').reportedStatus,'reported-present');
  assert.equal(result.documents.find(item=>item.id==='transcripts-all-enrolled-programmes').reportedStatus,'unknown');
  assert.equal(result.documents.find(item=>item.id==='diploma-supplement-module-descriptions').requirement,'recommended');
  assert.ok(!result.missingActions.some(item=>item.startsWith('Diploma supplement')));
  assert.equal(result.applicationCompleteness,'not-assessed');
});

test('all branch-specific degree evidence details remain individually unknown until reported',()=>{
  const provisional=evaluateBonnApplication({...base,degreeDocumentBranch:'final-pending'});
  assert.deepEqual(provisional.degreeFacts.map(item=>[item.key,item.reported,item.status]),[
    ['provisionalIssuedByExamOffice','unknown','unknown'],['provisionalStatesAllRequirementsFulfilled','unknown','unknown'],
  ]);
  const expected=evaluateBonnApplication({...base,degreeDocumentBranch:'expected-completion'});
  assert.equal(expected.degreeFacts.length,4);
  assert.ok(expected.degreeFacts.every(item=>item.status==='unknown'));
  assert.ok(expected.missingActions.some(item=>item.includes('expectedAllExamsBeforeSemesterStart')));
});

test('conditional APS, translation, thesis summary and English proof follow only explicit applicant condition answers',()=>{
  const result=evaluateBonnApplication({...base,conditionalFacts:{priorEducationInApsCountry:'yes',translationRequired:'no',bothSecondaryAndBachelorEducationOutsideEurope:'yes',thesisNeedsEnglishSummary:'yes'}});
  const doc=(id)=>result.documents.find(item=>item.id===id);
  assert.equal(doc('aps-china-india-vietnam').applicability,'yes');
  assert.equal(doc('translation-if-required').applicability,'no');
  assert.equal(doc('english-proof-non-europe-secondary-and-bachelor').applicability,'yes');
  assert.equal(doc('english-evidence-european-education').applicability,'no');
  assert.equal(doc('thesis-english-summary').applicability,'yes');
  assert.equal(doc('aps-china-india-vietnam').reportedStatus,'unknown');
});

test('unsupported programme, intake, pre-review and stale source dates are unavailable',()=>{
  for(const request of [
    {...base,programmeId:'other'},
    {...base,intake:'winter-2027'},
    {...base,asOf:'2026-10-25'},
    {...base,asOf:'2027-01-01'},
  ]){
    const result=evaluateBonnApplication(request);
    assert.equal(result.availability,'unavailable');
    assert.deepEqual(result.windows,[]);
    assert.deepEqual(result.documents,[]);
  }
});

test('strict request rejects generic profile, citizenship-only inference, verified toggles and malformed facts',()=>{
  assert.equal(bonnApplicationRequestSchema.safeParse(base).success,true);
  for(const request of [
    {...base,profile:{citizenships:['IS']}},
    {...base,citizenship:'IS'},
    {...base,groupFactors:{eeaCitizen:true}},
    {...base,groupFactors:{eeaCitizen:'yes',verified:true}},
    {...base,documents:{'cv':'verified'}},
    {...base,degreeDocumentBranch:'complete'},
    {...base,conditionalFacts:{apsApplicable:true}},
    {...base,asOf:'2026-2-3'},
    {...base,extra:true},
  ]) assert.equal(bonnApplicationRequestSchema.safeParse(request).success,false);
});
