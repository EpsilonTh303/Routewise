import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {studyMonthlyCostSchema,selectStudentInsuranceCost} from '../src/lib/study-costs.ts';
import {tkStudentCosts2026} from '../src/lib/data/tk-student-costs.ts';
import {studyPilotPrograms} from '../src/lib/data/study-pilot.ts';
import {classifyGermanyStudyFinances} from '../src/lib/study-financial-classification.ts';
import {adjustedCost,requiredBudget,matchPrograms} from '../src/lib/scoring.ts';
import {getGermanyStudyCostData} from '../src/lib/germany-study-costs.ts';

const base={programId:'de-masters-study',age:24,insurer:'TK',asOf:'2026-10-26',parenthood:'childless',freeFamilyInsuranceEligible:false,
  studentTariffConfirmation:{eligible:true,careBand:'childless-surcharge',validFrom:'2026-01-01',validUntil:'2026-12-31'}};
const select=changes=>selectStudentInsuranceCost(tkStudentCosts2026,{...base,...changes});

test('two dated source-backed monthly tariffs include health and care once, with no guessed coverage duration',()=>{
  assert.deepEqual(tkStudentCosts2026.map(row=>row.amount),[141.16,146.29]);
  for(const row of tkStudentCosts2026){
    assert.deepEqual(studyMonthlyCostSchema.parse(row),row);
    assert.equal(row.currency,'EUR');assert.equal(row.period,'monthly');
    assert.equal(row.source.effectiveFrom,'2026-01-01');assert.equal(row.source.effectiveUntil,null);
    assert.equal(row.classification.coveredDuration,null);
    assert.equal(row.classification.purpose,'health-and-care-insurance');
    assert.ok(row.sourceUrl.startsWith('https://www.tk.de/'));
    assert.ok(row.source.eligibilitySourceUrl.startsWith('https://www.tk.de/'));
    assert.equal(row.source.scope,'selected-tariff-claims');
  }
});

test('age 23 boundary and parenthood select one applicable combined tariff',()=>{
  for(const [age,parenthood,amount] of [[22,'childless',141.16],[23,'childless',146.29],[29,'childless',146.29],[24,'one-child',141.16]]){
    const selected=select({age,parenthood,studentTariffConfirmation:{...base.studentTariffConfirmation,careBand:amount===141.16?'standard':'childless-surcharge'}});
    assert.equal(selected.status,'applicable');assert.equal(selected.cost.amount,amount);
  }
  assert.equal(select({parenthood:'multiple-children'}).status,'unknown');
});

test('every missing context field prevents automatic tariff assignment',()=>{
  for(const key of Object.keys(base)){
    const input=structuredClone(base);delete input[key];
    const result=selectStudentInsuranceCost(tkStudentCosts2026,input);
    assert.equal(result.status,'unknown',key);assert.equal(result.cost,null);
  }
  assert.equal(select({studentTariffConfirmation:{eligible:'true',validFrom:'2026-01-01',validUntil:'2026-12-31'}}).status,'unknown');
  assert.equal(select({studentTariffConfirmation:{eligible:true,validFrom:'2026-01-01',validUntil:'2026-12-31'}}).status,'unknown');
  assert.equal(select({age:23,studentTariffConfirmation:{...base.studentTariffConfirmation,careBand:'standard'}}).status,'unknown');
  assert.equal(select({age:22}).status,'unknown');
});

test('ineligible, family-insured, other-insurer and other-route cases receive no paid TK tariff',()=>{
  for(const changes of [{freeFamilyInsuranceEligible:true},{studentTariffConfirmation:{...base.studentTariffConfirmation,eligible:false}},
    {insurer:'AOK'},{programId:'de-graduate-jobsearch'}]){
    const result=select(changes);assert.equal(result.status,'not-applicable');assert.equal(result.cost,null);
  }
});

test('30th birthday needs a current-semester or exception review, not an inferred age cutoff',()=>{
  assert.equal(select({age:30}).status,'unknown');
  assert.equal(select({age:31,ageLimitReviewConfirmed:false}).status,'unknown');
  assert.equal(select({age:30,ageLimitReviewConfirmed:true}).cost.amount,146.29);
  assert.equal(select({age:31,parenthood:'one-child',ageLimitReviewConfirmed:true,studentTariffConfirmation:{...base.studentTariffConfirmation,careBand:'standard'}}).cost.amount,141.16);
});

test('dates, stale confirmations and conflicting rate records fail closed',()=>{
  for(const asOf of ['2025-12-31','2027-01-01','invalid']) assert.equal(select({asOf}).status,'unknown');
  assert.equal(select({asOf:'2027-01-01',studentTariffConfirmation:{...base.studentTariffConfirmation,validUntil:'2027-12-31'}}).status,'unknown');
  assert.equal(select({studentTariffConfirmation:{...base.studentTariffConfirmation,validUntil:'2026-09-30'}}).status,'unknown');
  assert.equal(select({studentTariffConfirmation:{...base.studentTariffConfirmation,validFrom:'2026-12-31',validUntil:'2026-01-01'}}).status,'unknown');
  assert.equal(selectStudentInsuranceCost([...tkStudentCosts2026,tkStudentCosts2026[1]],base).status,'unknown');
  assert.equal(selectStudentInsuranceCost([],base).status,'unknown');
});

test('existing finance records, profile assessment and unknown totals are untouched; lookup never adds tariffs',()=>{
  const program=studyPilotPrograms.find(row=>row.id==='de-masters-study');
  const profile=JSON.parse(readFileSync(new URL('../examples/ai/match.json',import.meta.url),'utf8')).profile;
  const before=structuredClone({programs:studyPilotPrograms,classified:classifyGermanyStudyFinances(program),matches:matchPrograms(studyPilotPrograms,profile),costs:tkStudentCosts2026});
  const view=getGermanyStudyCostData(program);
  assert.deepEqual(view.financialRequirements,before.classified);
  assert.deepEqual(view.monthlyCosts,tkStudentCosts2026);
  assert.deepEqual(getGermanyStudyCostData(studyPilotPrograms[1]),{financialRequirements:[],monthlyCosts:[]});
  select(base);select({age:22});
  assert.deepEqual({programs:studyPilotPrograms,classified:classifyGermanyStudyFinances(program),matches:matchPrograms(studyPilotPrograms,profile),costs:tkStudentCosts2026},before);
  assert.equal(adjustedCost(program,profile),null);assert.equal(requiredBudget(program,profile),null);
  assert.equal(selectStudentInsuranceCost(tkStudentCosts2026,profile).cost,null);
});
