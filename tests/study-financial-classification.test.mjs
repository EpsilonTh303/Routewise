import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {studyPilotPrograms} from '../src/lib/data/study-pilot.ts';
import {classifyGermanyStudyFinances,germanyStudyFinancialMetadata,studyFinancialClassificationSchema} from '../src/lib/study-financial-classification.ts';
import {adjustedCost,requiredBudget} from '../src/lib/scoring.ts';
import {assessRouteRequirements} from '../src/lib/route-requirements.ts';

const program=studyPilotPrograms.find(program=>program.id==='de-masters-study');
const profile=JSON.parse(readFileSync(new URL('../examples/ai/match.json',import.meta.url),'utf8')).profile;

test('existing proof and salary rows retain amounts, currencies, periods and sources with separate classifications',()=>{
  const before=structuredClone(program);
  const rows=classifyGermanyStudyFinances(program);
  assert.equal(rows.length,3);
  assert.deepEqual(rows.map(({classification,...row})=>row),program.audit.financialRequirements);
  assert.deepEqual(rows.map(row=>row.classification.purpose),['financing-proof','salary-threshold','salary-threshold']);
  assert.deepEqual(rows.map(row=>row.classification.stage),['masters','work-permit','work-permit']);
  assert.ok(rows.every(row=>row.classification.coveredDuration===null));
  assert.equal(rows[0].period,'balance');
  assert.ok(rows.slice(1).every(row=>row.period==='annual'));
  assert.equal(germanyStudyFinancialMetadata.auditBatchId,program.audit.batchId);
  assert.deepEqual(program,before);
});

test('blocked-account proof is not counted again as spending and salary thresholds are never study expenses',()=>{
  const rows=classifyGermanyStudyFinances(program);
  assert.ok(rows.every(row=>row.classification.includeInExpenseTotal===false));
  assert.deepEqual(rows.filter(row=>row.classification.stage==='masters'&&row.classification.includeInExpenseTotal),[]);
  assert.equal(adjustedCost(program,profile),null);
  assert.equal(requiredBudget(program,profile),null);
  // Synthetic legacy USD expense total: adding proof/salary rows must not inflate it.
  const withSpending={...program,totalYearOneCost:profile.budget,minBudget:profile.budget,costPerDependent:0};
  assert.equal(adjustedCost(withSpending,profile),profile.budget);
  assert.equal(requiredBudget(withSpending,profile),profile.budget);
});

test('classification cannot opt proof or salary into spending and invalid stage/purpose pairs are rejected',()=>{
  for(const item of germanyStudyFinancialMetadata.items){
    assert.equal(studyFinancialClassificationSchema.safeParse(item.classification).success,true);
    assert.equal(studyFinancialClassificationSchema.safeParse({...item.classification,includeInExpenseTotal:true}).success,false);
  }
  assert.equal(studyFinancialClassificationSchema.safeParse({...germanyStudyFinancialMetadata.items[0].classification,stage:'work-permit'}).success,false);
});

test('classification follows exact rows across JSON key/list order but not changed or unrelated source records',()=>{
  const reordered=structuredClone(program);
  reordered.audit.financialRequirements=reordered.audit.financialRequirements.reverse().map(row=>Object.fromEntries(Object.entries(row).reverse()));
  assert.deepEqual(classifyGermanyStudyFinances(reordered).map(row=>row.classification.purpose),['salary-threshold','salary-threshold','financing-proof']);
  for(const edit of [
    program=>{program.audit.financialRequirements[0].amount+=1;},
    program=>{program.audit.financialRequirements[0].sourceUrl='https://example.org/unreviewed';},
    program=>{program.audit.batchId='other-batch';},
    program=>{program.id='another-route';},
  ]){
    const changed=structuredClone(program);edit(changed);
    assert.equal(classifyGermanyStudyFinances(changed)[0].classification,null);
  }
  assert.ok(classifyGermanyStudyFinances(studyPilotPrograms[1]).every(row=>row.classification===null));
});

test('classified proof still drives the original balance comparison without approving finance or counting salaries',()=>{
  const rows=classifyGermanyStudyFinances(program);
  const proof=rows.find(row=>row.classification.purpose==='financing-proof');
  for(const amount of [proof.amount-1,proof.amount]){
    const applicant={...profile,evidence:{routes:{[program.id]:{financial:[{kind:'balance',amount,currency:proof.currency}]}}}};
    const result=assessRouteRequirements(program,applicant).result;
    const livelihood=result.children.find(child=>child.id==='securedLivelihood');
    assert.equal(livelihood.children[0].status,amount<proof.amount?'unmet':'met');
    assert.equal(livelihood.status,amount<proof.amount?'unmet':'unknown');
  }
});
