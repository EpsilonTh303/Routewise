import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildGermanyStudyPlan,germanyStudyPlanRequestSchema} from '../src/lib/germany-study-plan.ts';
import {studyPilotPrograms} from '../src/lib/data/study-pilot.ts';

const profile=JSON.parse(readFileSync(new URL('../examples/ai/match.json',import.meta.url),'utf8')).profile;
const plan=(overrides={})=>buildGermanyStudyPlan(studyPilotPrograms,{profile,asOf:'2026-10-26',...overrides});
const quote=(amount,period='annual')=>({amount,description:`Applicant quote, ${period}; scope is described here.`,sourceUrl:'https://example.org/quote',reviewedOn:'2026-10-26',...(period==='monthly'?{coversMonths:12}:{})});
const completeQuotes={tuition:quote(10000),housing:quote(800,'monthly'),living:quote(500,'monthly'),insurance:quote(150,'monthly'),semesterFees:quote(300),relocation:quote(1000,'one-time'),permitFees:quote(200,'one-time')};

test('returns the validated four-stage graph, dated claims and profile-selected navigation only',()=>{
  const result=plan();
  assert.equal(result.availability,'available');
  assert.deepEqual(result.journey.stages.map(stage=>stage.id),['masters','graduate-job-search','work-permit','permanent-residence']);
  assert.equal(result.journey.selectedEntryBranch,'graduate-job-search');
  assert.equal(result.journey.stages[0].transitions.find(edge=>edge.to==='graduate-job-search').selected,true);
  assert.equal(result.journey.stages[0].transitions.find(edge=>edge.to==='work-permit').selected,false);
  assert.ok(result.journey.stages[0].claims.every(claim=>claim.checkedAt&&claim.sourceUrl));
  assert.equal(result.journey.stages[0].status,'unknown');
  assert.equal(result.journey.stages.find(stage=>stage.id==='work-permit').status,'unknown');
  assert.equal(result.journey.stages.find(stage=>stage.id==='permanent-residence').status,'unknown');
  assert.equal(result.journey.stages.find(stage=>stage.id==='permanent-residence').claims.some(claim=>claim.sourceUrl.includes('settlement-permit')),true);
  const work=result.journey.stages.find(stage=>stage.id==='work-permit');
  assert.equal(work.supplementalReview.appliesToCatalog,false);
  assert.equal(work.supplementalReview.reviewStatus,'partial');
  assert.ok(work.claims.every(claim=>claim.topic!=='Employment qualifies as skilled work'));
  assert.ok(work.supplementalReview.claims.some(claim=>claim.topic==='Employment qualifies as skilled work'));
});

test('self-reported later-stage facts never bypass the mandatory manual authority check',()=>{
  const work={qualifyingEmployment:true,qualificationRecognised:true,professionalLicenceOrNotRequired:true,authorityApproval:true};
  const settlement={germanGraduation:true,qualifyingTitleTwoYears:true,pension24Months:true,permittedEmployment:true,livelihood:true,germanB1:true,civicKnowledge:true,adequateHousing:true};
  const result=plan({stageEvidence:{work,settlement}});
  for(const id of ['work-permit','permanent-residence']){
    const stage=result.journey.stages.find(item=>item.id===id);
    assert.equal(stage.status,'unknown');
    assert.ok(stage.checks.some(check=>check.kind==='manual'&&check.status==='unknown'));
    assert.ok(stage.checks.filter(check=>check.kind==='fact').every(check=>check.status==='met'));
  }
  const invalid=()=>plan({stageEvidence:{work:{unreviewedFact:true}}});
  assert.throws(invalid);
});

test('profile evidence stays route-scoped and job offer does not become approval evidence',()=>{
  const evidence={routes:{'de-graduate-jobsearch':{facts:{germanDegree:true,healthCoverage:true,securedLivelihood:true,applicationWindow:true}}}};
  const withoutOffer=plan({profile:{...profile,evidence,hasJobOffer:false}});
  const withOffer=plan({profile:{...profile,evidence,hasJobOffer:true}});
  assert.equal(withoutOffer.journey.selectedEntryBranch,'graduate-job-search');
  assert.equal(withOffer.journey.selectedEntryBranch,'work-permit');
  assert.equal(withoutOffer.journey.stages.find(stage=>stage.id==='graduate-job-search').status,'unknown');
  assert.equal(withOffer.journey.stages.find(stage=>stage.id==='graduate-job-search').status,'unknown');
  assert.equal(withOffer.journey.stages.find(stage=>stage.id==='work-permit').status,'unknown');
});

test('stale, missing or backdated source models return structured unavailable output',()=>{
  const missing=buildGermanyStudyPlan(studyPilotPrograms.filter(item=>item.id!=='de-graduate-jobsearch'),{profile,asOf:'2026-10-26'});
  assert.equal(missing.availability,'unavailable');
  assert.equal(missing.budget.total,null);
  const backdated=plan({asOf:'2026-01-01'});
  assert.equal(backdated.availability,'unavailable');
  assert.match(backdated.journey.stages[0].missingActions[0],/predates/);
  const changed=structuredClone(studyPilotPrograms);
  changed.find(item=>item.id==='de-graduate-jobsearch').audit.claims[0].summary+=' changed';
  assert.equal(buildGermanyStudyPlan(changed,{profile,asOf:'2026-10-26'}).availability,'unavailable');
});

test('incomplete quotes remain unknown and proof, salary and TK reference stay separate',()=>{
  const result=plan();
  assert.equal(result.budget.status,'partial');
  assert.equal(result.budget.total,null);
  assert.equal(result.budget.items.find(item=>item.category==='housing').amount,null);
  assert.deepEqual(result.budget.missingCategories,['tuition','housing','living','insurance','semesterFees','relocation','permitFees']);
  assert.equal(result.budget.proofItems[0].amount,11904);
  assert.match(result.budget.proofItems[0].classification,/not an expense/);
  assert.equal(result.budget.excludedItems.length,2);
  assert.ok(result.budget.excludedItems.every(item=>item.classification.includes('salary threshold')));
  assert.equal(result.budget.insuranceReference.status,'unknown');
  assert.equal(result.budget.insuranceReference.addedToTotal,false);
});

test('year-one quoted expense scenario needs all categories, explicit projection, single applicant and monthly coverage',()=>{
  const quotes=structuredClone(completeQuotes);
  const noProjection=plan({budget:{quotes}});
  assert.equal(noProjection.budget.complete,false);
  assert.equal(noProjection.budget.total,null);
  const noMonthlyCoverage=structuredClone(quotes);delete noMonthlyCoverage.housing.coversMonths;
  const notCovered=plan({budget:{quotes:noMonthlyCoverage,monthlyProjectionMonths:12}});
  assert.equal(notCovered.budget.projectionMonths,null);
  assert.equal(notCovered.budget.total,null);
  assert.ok(notCovered.budget.uncoveredMonthlyCategories.includes('housing'));
  const result=plan({budget:{quotes,monthlyProjectionMonths:12}});
  assert.equal(result.budget.status,'complete');
  assert.equal(result.budget.projectionMonths,12);
  assert.equal(result.budget.total,28900);
  assert.equal(result.budget.totalScope,'applicant-quoted-expense-scenario');
  assert.ok(result.budget.items.every(item=>item.included));
  assert.equal(result.budget.proofItems[0].amount,11904);
  const family=plan({profile:{...profile,familyStatus:'couple'},budget:{quotes,monthlyProjectionMonths:12}});
  assert.equal(family.budget.complete,false);
  assert.equal(family.budget.dependentsIncomplete,true);
  assert.equal(family.budget.total,null);
});

test('future-dated, invalid, ambiguous and non-HTTPS quotes fail closed',()=>{
  const future=structuredClone(completeQuotes);future.tuition.reviewedOn='2026-10-27';
  const later=plan({budget:{quotes:future,monthlyProjectionMonths:12}});
  assert.equal(later.budget.total,null);
  assert.equal(later.budget.items.find(item=>item.category==='tuition').amount,null);
  assert.ok(later.budget.missingCategories.includes('tuition'));
  for(const change of [
    quote=>{quote.amount=-1;},quote=>{quote.amount=10_000_001;},quote=>{quote.sourceUrl='http://example.org/quote';},quote=>{quote.reviewedOn='2026-02-30';},
  ]){
    const quotes=structuredClone(completeQuotes);change(quotes.tuition);
    assert.throws(()=>plan({budget:{quotes,monthlyProjectionMonths:12}}));
  }
  assert.throws(()=>plan({budget:{quotes:completeQuotes,monthlyProjectionMonths:12,extra:true}}));
  assert.equal(germanyStudyPlanRequestSchema.safeParse({profile,asOf:'2026-10-26',unknown:true}).success,false);
});

test('insurance tariff is a separate dated reference and contradictory age/date cannot select it',()=>{
  const context={programId:'de-masters-study',age:profile.age,insurer:'TK',asOf:'2026-10-26',parenthood:'childless',freeFamilyInsuranceEligible:false,
    ageLimitReviewConfirmed:true,studentTariffConfirmation:{eligible:true,careBand:'childless-surcharge',validFrom:'2026-01-01',validUntil:'2026-12-31'}};
  const selected=plan({insuranceContext:context});
  assert.equal(selected.budget.insuranceReference.status,'applicable');
  assert.equal(selected.budget.insuranceReference.monthlyAmount,146.29);
  assert.equal(selected.budget.insuranceReference.addedToTotal,false);
  const ageMismatch=plan({insuranceContext:{...context,age:profile.age-1}});
  assert.equal(ageMismatch.budget.insuranceReference.status,'unknown');
  const dateMismatch=plan({insuranceContext:{...context,asOf:'2026-10-25'}});
  assert.equal(dateMismatch.budget.insuranceReference.status,'unknown');
  const expired=plan({asOf:'2027-01-01',insuranceContext:{...context,asOf:'2027-01-01',studentTariffConfirmation:{...context.studentTariffConfirmation,validFrom:'2027-01-01',validUntil:'2027-12-31'}},
    budget:{quotes:completeQuotes,monthlyProjectionMonths:12}});
  assert.equal(expired.budget.insuranceReference.status,'unknown');
  assert.equal(expired.availability,'unavailable');
  assert.equal(expired.budget.total,null);
  assert.equal(expired.budget.items.find(item=>item.category==='tuition').amount,10000);
  assert.deepEqual(expired.budget.proofItems,[]);
});
