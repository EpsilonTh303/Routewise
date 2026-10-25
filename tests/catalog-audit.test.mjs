import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ALL_PROGRAMS} from '../src/lib/data/index.ts';
import {PATHWAY_RECORDS,PATHWAY_SPLITS} from '../src/lib/data/pathway-splits.ts';
import {PATHWAY_REVIEWS,buildReviewedPathway} from '../src/lib/data/reviewed-pathways.ts';
import {CATALOG_SOURCE_AUDIT} from '../src/lib/data/catalog-source-audit.ts';
import {programSchema,sourceAuditSchema} from '../src/lib/validation.ts';
import {scoreProgram,buildStrategy} from '../src/lib/scoring.ts';
import {formatCitizenship} from '../src/lib/format.ts';

test('catalog-wide unknown citizenship fields display review rather than a missing legal path',()=>{
  const item=CATALOG_SOURCE_AUDIT.items.find(item=>item.id==='de-bluecard');
  assert.equal(formatCitizenship({...ALL_PROGRAMS.find(program=>program.id===item.id),...item.patch}),'Needs review');
});

const PROFILE={citizenship:'AZ',age:35,familyStatus:'single',dependents:0,budget:10_000_000,
  monthlyIncome:100_000,expectedSalary:100_000,hasJobOffer:true,education:'phd',experience:15,
  field:'it',englishLevel:3,turkish:true,russian:true,goal:'remote',timeline:'flexible',risk:'high',regions:[],remoteWork:true};

function reviewedBaseline(){
  const splitParents=new Set(PATHWAY_SPLITS.map(split=>split.parentId));
  const rows=new Map(ALL_PROGRAMS.filter(program=>!splitParents.has(program.id)).map(program=>[program.id,program]));
  for(const row of PATHWAY_RECORDS) if(row.active) rows.set(row.program.id,row.program);
  for(const review of PATHWAY_REVIEWS){
    const current=rows.get(review.id);
    if(!current) continue; // Review-only inactive records are not part of the active 75.
    rows.set(review.id,buildReviewedPathway(current,review));
  }
  return rows;
}

const baseline=reviewedBaseline();
const audited=new Map(CATALOG_SOURCE_AUDIT.items.map(item=>{
  const current=baseline.get(item.id);
  assert.ok(current,`audit target ${item.id} exists in the 75-route baseline`);
  return [item.id,programSchema.parse({...current,...item.patch})];
}));

test('catalog audit patches cover exactly the 75 active baseline routes',()=>{
  assert.equal(baseline.size,75);
  assert.equal(new Set(baseline.keys()).size,75);
  assert.equal(CATALOG_SOURCE_AUDIT.items.length,75);
  assert.equal(audited.size,75);
  assert.deepEqual([...audited.keys()].sort(),[...baseline.keys()].sort());
});

test('audit and patched program schemas validate, retain gaps, and never promote full verification',()=>{
  for(const item of CATALOG_SOURCE_AUDIT.items){
    const audit=sourceAuditSchema.parse(item.patch.audit);
    const program=audited.get(item.id);
    programSchema.parse(program);
    assert.equal(program.verification?.status,'unverified',`${item.id} stays unverified`);
    assert.ok(audit.limitations.length,`${item.id} retains source limitations`);
    if(audit.claims.length===0){
      assert.equal(audit.status,'unresolved',`${item.id} has no claim evidence`);
      assert.equal(audit.routeStatus,'unclear',`${item.id} cannot assert availability without claims`);
      assert.deepEqual(audit.financialRequirements,[]);
    }
    for(const amount of audit.financialRequirements){
      assert.ok(audit.claims.some(claim=>claim.sourceUrl===amount.sourceUrl),`${item.id} amount points to an audited source`);
      assert.match(amount.currency,/^[A-Z]{3}$/);
    }
    if(audit.financialRequirements.some(amount=>amount.currency!=='USD')){
      assert.equal(program.minBudget,null,`${item.id} native currency is not converted to the USD budget gate`);
      assert.equal(program.minMonthlyIncome,null,`${item.id} native currency is not converted to the USD income gate`);
    }
    for(const field of audit.unknownFields) assert.equal(program[field],null,`${item.id}.${field} remains unknown`);
  }
});

test('unpriced costs, dependent amounts, and processing times remain unknown',()=>{
  for(const item of CATALOG_SOURCE_AUDIT.items){
    const program=audited.get(item.id);
    assert.equal(program.totalYearOneCost,null,`${item.id} has no invented all-in cost`);
    assert.equal(program.costPerDependent,null,`${item.id} has no invented dependent cost`);
    assert.equal(program.processingWeeks,null,`${item.id} has no invented processing time`);
    assert.ok(program.audit?.limitations.some(text=>/cost|processing|dependent/i.test(text)),`${item.id} explains the gap`);
  }
});

test('dynamic Argentina and Colombia wage multiples are not frozen as currency values',()=>{
  for(const id of ['ar-residency','co-nomad']){
    const program=audited.get(id);
    assert.ok(program,`${id} is included in the audit`);
    assert.equal(program.minMonthlyIncome,null);
    assert.equal(program.minBudget,null);
    assert.ok(program.audit.financialRequirements.every(item=>item.amount!==3&&item.amount!==5));
    assert.ok(program.audit.claims.length>0||program.audit.status==='unresolved');
  }
});

test('Canada Start-Up Visa is closed and cannot become a primary plan at high budget',()=>{
  const program=audited.get('ca-suv');
  assert.equal(program.audit.routeStatus,'closed');
  const match=scoreProgram(program,PROFILE);
  assert.equal(match.eligibility,'ineligible');
  assert.deepEqual(buildStrategy([match],PROFILE),[]);
});

test('incomplete audited routes never enter primary strategies',()=>{
  for(const program of audited.values()){
    const match=scoreProgram(program,PROFILE);
    assert.equal(match.explanation.dataComplete,false,`${program.id} is incomplete`);
    assert.deepEqual(buildStrategy([match],PROFILE),[],`${program.id} is excluded from Plan A`);
  }
});
