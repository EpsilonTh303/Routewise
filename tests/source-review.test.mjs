import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PATHWAY_RECORDS} from '../src/lib/data/pathway-splits.ts';
import {PATHWAY_REVIEWS,buildReviewedPathway} from '../src/lib/data/reviewed-pathways.ts';
import {programSchema,importSchema} from '../src/lib/validation.ts';
import {scoreProgram,buildStrategy} from '../src/lib/scoring.ts';
const routes=PATHWAY_REVIEWS.map(item=>buildReviewedPathway(PATHWAY_RECORDS.find(row=>row.program.id===item.id).program,item));
const get=id=>routes.find(program=>program.id===id);
const profile={citizenship:'AZ',age:30,familyStatus:'single',dependents:0,budget:1000000,monthlyIncome:20000,expectedSalary:20000,hasJobOffer:true,education:'master',experience:10,field:'it',englishLevel:3,turkish:false,russian:true,goal:'remote',timeline:'flexible',risk:'medium',regions:[],remoteWork:true};
test('review coverage is explicit, partial and retains null costs and source gaps',()=>{
  assert.equal(routes.length,27);
  assert.equal(new Set(routes.map(p=>p.id)).size,27);
  for(const program of routes){
    programSchema.parse(program);
    assert.equal(program.verification.status,'unverified');
    assert.equal(program.pathway.review.status,'partial');
    assert.ok(program.pathway.review.limitations.length);
    assert.equal(program.totalYearOneCost,null);
    const result=scoreProgram(program,profile);
    assert.equal(result.explanation.dataComplete,false);
    assert.deepEqual(buildStrategy([result]),[]);
    assert.ok(result.explanation.warnings.some(w=>/Selected claims/.test(w)));
    for(const field of program.pathway.unknownFields) assert.equal(program[field],null);
  }
});
test('non-USD evidence never becomes a USD gate or a fake total cost',()=>{
  assert.equal(get('fr-talent-investor').minBudget,null);
  assert.equal(get('fr-talent-salaried').minMonthlyIncome,null);
  assert.equal(get('fi-specialist-permit').minMonthlyIncome,null);
  assert.equal(get('ae-golden-property').minBudget,null);
  const salary=get('fr-talent-salaried').pathway.review.financialRequirements[0];
  assert.deepEqual([salary.amount,salary.currency,salary.period],[39582,'EUR','annual']);
  const fee=get('sa-premium-annual').pathway.review.financialRequirements[0];
  assert.deepEqual([fee.amount,fee.currency,fee.period],[100000,'SAR','annual']);
});
test('alternative evidence and PR at grant are not turned into hard rejections or zero processing',()=>{
  assert.equal(get('br-vitem-xiv-nomad').minMonthlyIncome,null);
  assert.equal(get('us-eb2').jobOfferRequired,null);
  assert.equal(get('id-e33g-remote-worker').minBudget,null);
  assert.equal(get('th-ltr-wealthy').minMonthlyIncome,0);
  assert.equal(get('th-ltr-wealthy').minBudget,500000);
  for(const id of ['au-subclass-189','au-subclass-190']) {
    assert.equal(get(id).yearsToPR,0);
    assert.equal(get(id).processingWeeks,null);
  }
});
test('claim reviews require linked dated source evidence on import',()=>{
  const program=get('fr-talent-salaried');
  assert.throws(()=>importSchema.parse({program,reason:'Missing evidence'}),/matching dated source evidence/);
  const claim=program.pathway.review.claims[0];
  const sources=[{url:claim.sourceUrl,evidence:claim.summary,checkedAt:claim.checkedAt}];
  assert.doesNotThrow(()=>importSchema.parse({program,sources,reason:'Evidence'}));
  assert.throws(()=>importSchema.parse({program,sources:[{...sources[0],checkedAt:null}],reason:'Undated'}));
});
