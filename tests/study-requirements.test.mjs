import test from 'node:test';
import assert from 'node:assert/strict';
import {studyPilotPrograms} from '../src/lib/data/study-pilot.ts';
import {assessRouteRequirements} from '../src/lib/route-requirements.ts';
import {matchPrograms,buildStrategy,buildRoadmap} from '../src/lib/scoring.ts';
import {readFileSync} from 'node:fs';
const profile=JSON.parse(readFileSync(new URL('../examples/ai/match.json',import.meta.url),'utf8')).profile;
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
