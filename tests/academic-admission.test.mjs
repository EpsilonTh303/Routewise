import test from 'node:test';
import assert from 'node:assert/strict';
import {academicAdmissionRequestSchema,evaluateAcademicAdmission} from '../src/lib/academic-admission.ts';
import {germanyAcademicProgrammes} from '../src/lib/data/germany-academic-programmes.ts';

const base={programmeId:'bonn-computer-science-msc',asOf:'2026-10-26',intake:'summer-2027'};
const evaluate=(evidence,overrides={})=>evaluateAcademicAdmission({...base,...overrides,...(evidence===undefined?{}:{evidence})});

test('Bonn MSc Computer Science manifest exposes four dated source-backed minimums and scoped limitations',()=>{
  assert.equal(germanyAcademicProgrammes.length,1);
  const review=germanyAcademicProgrammes[0];
  assert.equal(review.programmeId,base.programmeId);
  assert.equal(review.intake,base.intake);
  assert.equal(review.reviewStatus,'partial');
  assert.deepEqual(review.creditRequirements.map(item=>item.minimumEcts),[18,14,18,12]);
  assert.ok(review.sources.every(source=>source.checkedAt==='2026-10-26'&&source.sourceUrl.startsWith('https://')));
  const regulation=review.sources.find(source=>source.id==='bonn-cs-regulations-index');
  assert.equal(regulation.contentRetrieved,false);
  assert.match(regulation.retrievalNote,/not reviewed/);
});

test('missing academic evidence stays unknown and never affects visa status or admission outcome',()=>{
  const result=evaluate(undefined);
  assert.equal(result.availability,'available');
  assert.equal(result.programme.institution,'University of Bonn');
  assert.equal(result.overallStatus,'unknown');
  assert.equal(result.asOf,base.asOf);
  assert.equal(result.sourceDateScope.availabilityCutoff,'2026-12-31');
  assert.match(result.sourceDateScope.cutoffMeaning,/not an official source expiry/);
  assert.ok(result.checks.every(check=>check.status==='unknown'));
  assert.equal(result.visaEligibilityAssessed,false);
  assert.equal(result.admissionDecision,'not-assessed');
  assert.ok(!Object.hasOwn(result,'eligible'));
  assert.ok(result.checks.every(check=>check.sourceId));
  assert.ok(result.missingActions.length===result.checks.length);
});

test('reported ECTS comparisons are explicit while positive numbers and references remain unverified unknown',()=>{
  const result=evaluate({
    mathEctsReported:18,mathEvidenceReference:'transcript page 2',
    theoryEctsReported:13,theoryEvidenceReference:'transcript page 3',
    programmingEctsReported:18,programmingEvidenceReference:'modules A–D',
    thesisEctsReported:12,thesisEvidenceReference:'thesis record',
  });
  const math=result.checks.find(check=>check.id==='mathematical-foundations');
  const theory=result.checks.find(check=>check.id==='algorithms-theory-complexity-formal-languages');
  const programming=result.checks.find(check=>check.id==='programming-software-information-systems');
  const thesis=result.checks.find(check=>check.id==='scientific-bachelors-thesis');
  assert.equal(math.status,'unknown');assert.equal(math.reportedComparison,'reported-meets-minimum');assert.equal(math.evidenceReference,'transcript page 2');
  assert.equal(programming.status,'unknown');assert.equal(programming.reportedComparison,'reported-meets-minimum');
  assert.equal(thesis.status,'unknown');assert.equal(thesis.reportedComparison,'reported-meets-minimum');
  assert.equal(theory.status,'unmet');assert.equal(theory.reportedComparison,'reported-below-minimum');
  assert.match(theory.reason,/reported shortfall, not an academic committee ruling/);
  assert.equal(result.overallStatus,'reported-gaps');
  assert.ok(!result.checks.some(check=>check.status==='met'));
});

test('evidence references never promote numeric or qualitative claims to met',()=>{
  const result=evaluate({
    mathEctsReported:18,mathEvidenceReference:'verified=true',
    relevantBachelor:'yes',degreeEquivalence:'yes',thesisScientificQuality:'yes',englishC1:'yes',acceptedEnglishProof:'yes',
  });
  assert.equal(result.checks.find(check=>check.id==='mathematical-foundations').status,'unknown');
  for(const id of ['relevant-bachelor-subject','degree-equivalence','thesis-scientific-quality','english-c1','accepted-english-proof']){
    const check=result.checks.find(item=>item.id===id);
    assert.equal(check.status,'unknown',id);
    assert.match(check.reason,/unverified/);
  }
  assert.equal(result.overallStatus,'unknown');
  assert.ok(result.checks.every(check=>check.status!=='met'));
});

test('explicit negative qualitative answers are reported unmet, unknown and omitted answers stay unknown',()=>{
  const result=evaluate({relevantBachelor:'no',degreeEquivalence:'unknown',thesisScientificQuality:'no',englishC1:'yes'});
  assert.equal(result.checks.find(check=>check.id==='relevant-bachelor-subject').status,'unmet');
  assert.equal(result.checks.find(check=>check.id==='degree-equivalence').status,'unknown');
  assert.equal(result.checks.find(check=>check.id==='thesis-scientific-quality').status,'unmet');
  assert.equal(result.checks.find(check=>check.id==='english-c1').status,'unknown');
  assert.equal(result.checks.find(check=>check.id==='competitive-selection-and-offer').status,'unknown');
  assert.equal(result.overallStatus,'reported-gaps');
});

test('unsupported programme, intake, backdated review or ambiguous manifest return unavailable with no checks',()=>{
  for(const request of [
    {...base,programmeId:'other-program'},
    {...base,intake:'winter-2026'},
    {...base,asOf:'2026-10-25'},
    {...base,asOf:'2027-01-01'},
  ]){
    const result=evaluateAcademicAdmission(request);
    assert.equal(result.availability,'unavailable');
    assert.deepEqual(result.checks,[]);
    assert.equal(result.overallStatus,'unavailable');
  }
});

test('strict bounded request rejects caller verification, generic Profile inference and invalid ECTS',()=>{
  assert.equal(academicAdmissionRequestSchema.safeParse(base).success,true);
  for(const evidence of [
    {mathEctsReported:-1},{mathEctsReported:601},{mathEctsReported:18,mathEvidenceReference:'x'.repeat(301)},
    {mathEctsReported:18,verified:true},{bachelor:'master'},
  ]) assert.equal(academicAdmissionRequestSchema.safeParse({...base,evidence}).success,false);
  assert.equal(academicAdmissionRequestSchema.safeParse({...base,education:'master'}).success,false);
  assert.equal(academicAdmissionRequestSchema.safeParse({...base,extra:true}).success,false);
});
