import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PATHWAY_RECORDS,EXPECTED_ACTIVE_PROGRAM_COUNT} from '../src/lib/data/pathway-splits.ts';
import {scoreProgram,buildStrategy,buildRoadmap} from '../src/lib/scoring.ts';
const profile={citizenship:'AZ',age:30,familyStatus:'single',dependents:0,budget:1000000,monthlyIncome:20000,expectedSalary:20000,hasJobOffer:true,education:'master',experience:10,field:'it',englishLevel:3,turkish:false,russian:true,goal:'remote',timeline:'flexible',risk:'medium',regions:[],remoteWork:true};
const route=id=>PATHWAY_RECORDS.find(r=>r.program.id===id).program;
test('split investor and remote routes keep separate financial requirements',()=>{
  assert.equal(EXPECTED_ACTIVE_PROGRAM_COUNT,75);
  assert.equal(route('br-business-investor').minBudget,90000);
  assert.equal(route('br-vitem-xiv-nomad').minBudget,null);
  assert.equal(route('br-vitem-xiv-nomad').minMonthlyIncome,1500);
  assert.equal(route('id-e33g-remote-worker').minMonthlyIncome,5000);
  assert.equal(route('id-e33g-remote-worker').yearsToPR,null);
});
test('unknown branch costs and timing cannot become free fast primary plans',()=>{
  for(const {program} of PATHWAY_RECORDS){
    const match=scoreProgram(program,profile);
    assert.equal(match.adjustedCost,null);
    assert.equal(match.breakdown.cost,null);
    assert.equal(match.breakdown.speed,null);
    assert.equal(match.explanation.dataComplete,false);
    assert.equal(match.explanation.requiredBudget,null);
    assert.deepEqual(buildStrategy([match],profile),[]);
    assert.ok(buildRoadmap(program,profile).some(step=>step.monthsFromNow===null));
  }
});
test('known capital floors and remote-work evidence still block provisional routes',()=>{
  assert.equal(scoreProgram(route('br-business-investor'),{...profile,budget:0}).eligibility,'ineligible');
  assert.ok(scoreProgram(route('br-vitem-xiv-nomad'),{...profile,remoteWork:false}).gateIssues.some(issue=>/remote/i.test(issue)));
});
