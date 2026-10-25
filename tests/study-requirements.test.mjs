import test from 'node:test';
import assert from 'node:assert/strict';
import {studyPilotPrograms} from '../src/lib/data/study-pilot.ts';
import {assessRouteRequirements} from '../src/lib/route-requirements.ts';
import {matchPrograms,buildStrategy,buildRoadmap} from '../src/lib/scoring.ts';
import {readFileSync} from 'node:fs';
const profile=JSON.parse(readFileSync(new URL('../examples/ai/match.json',import.meta.url),'utf8')).profile;

function reverseObjectKeys(value){
  if(Array.isArray(value)) return value.map(reverseObjectKeys);
  if(value!==null&&typeof value==='object') return Object.fromEntries(Object.entries(value).reverse().map(([key,item])=>[key,reverseObjectKeys(item)]));
  return value;
}

test('JSON object key order preserves study assessments, scores and roadmaps',()=>{
  for(const original of studyPilotPrograms){
    const reordered=JSON.parse(JSON.stringify(reverseObjectKeys(original)));
    assert.notEqual(JSON.stringify(reordered.audit),JSON.stringify(original.audit));
    for(const factValue of [undefined,true,false]){
      const initial=assessRouteRequirements(original,profile);
      assert.ok(initial);
      const facts=Object.fromEntries(initial.result.children.map(child=>[child.id,factValue]));
      const applicant={...profile,evidence:{routes:{[original.id]:{facts}}}};
      assert.deepEqual(assessRouteRequirements(reordered,applicant),assessRouteRequirements(original,applicant));
      assert.deepEqual(matchPrograms([reordered],applicant),matchPrograms([original],applicant));
      assert.deepEqual(buildRoadmap(reordered,applicant),buildRoadmap(original,applicant));
    }
  }
});

test('array order and requirement content still protect against stale study rules',()=>{
  for(const original of studyPilotPrograms){
    for(const edit of [
      program=>program.audit.claims.reverse(),
      program=>program.requirements.reverse(),
      program=>{program.requirements[0]='Changed requirement';},
    ]){
      const changed=structuredClone(original);edit(changed);
      assert.equal(assessRouteRequirements(changed,profile),undefined);
    }
  }
});
test('study journeys retain conditional stages without fabricated calendar milestones',()=>{
  for(const program of studyPilotPrograms){
    const steps=buildRoadmap(program,profile);
    assert.equal(steps.length,6);assert.ok(steps.every(step=>step.monthsFromNow===null));
    assert.match(steps[4].label,/Conditional permanent/);assert.match(steps[5].detail,/no citizenship date/);
  }
});
test('a generic master degree cannot establish German graduation or post-study eligibility',()=>{
  const program=studyPilotPrograms.find(p=>p.id==='de-graduate-jobsearch');
  const graduate={...profile,education:'master',budget:1000000};
  assert.equal(assessRouteRequirements(program,graduate).result.status,'unknown');
  const rejected={...graduate,evidence:{routes:{[program.id]:{facts:{germanDegree:false}}}}};
  assert.equal(assessRouteRequirements(program,rejected).result.status,'unmet');
  assert.equal(matchPrograms([program],rejected)[0].eligibility,'ineligible');
});
test('route-specific evidence does not invent costs or promise a primary plan',()=>{
  const program=studyPilotPrograms.find(p=>p.id==='de-graduate-jobsearch');
  const documented={...profile,evidence:{routes:{[program.id]:{facts:{germanDegree:true,healthCoverage:true,securedLivelihood:true,applicationWindow:true}}}}};
  assert.equal(assessRouteRequirements(program,documented).result.status,'met');
  const results=matchPrograms([program],documented);
  assert.equal(results[0].explanation.dataComplete,false);
  assert.deepEqual(buildStrategy(results),[]);
});
test('editing attached pilot evidence disables stale automatic rules',()=>{
  for(const original of studyPilotPrograms){
    const program=structuredClone(original);program.audit.claims[0].summary='Edited independently';
    assert.equal(assessRouteRequirements(program,profile),undefined);
    assert.equal(buildRoadmap(program,profile).some(step=>step.label==='Conditional permanent residence'),false);
  }
});
