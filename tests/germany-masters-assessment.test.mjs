import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {germanyStudyJourney} from '../src/lib/data/germany-study-journey.ts';
import {studyPilotPrograms} from '../src/lib/data/study-pilot.ts';
import {assessRouteRequirements} from '../src/lib/route-requirements.ts';
import {matchPrograms,buildStrategy,buildRoadmap} from '../src/lib/scoring.ts';

const profile=JSON.parse(readFileSync(new URL('../examples/ai/match.json',import.meta.url),'utf8')).profile;
const program=studyPilotPrograms.find(program=>program.id==='de-masters-study');
const keys=['studyAdmission','programmeLanguage','securedLivelihood'];
const applicant=facts=>({...profile,goal:'study',evidence:{routes:{[program.id]:{facts}}}});

test('masters entry uses route-scoped evidence with all 27 met/unmet/missing combinations',()=>{
  for(const admission of [true,false,undefined]) for(const language of [true,false,undefined]) for(const funds of [true,false,undefined]){
    const values=[admission,language,funds];
    const facts=Object.fromEntries(keys.flatMap((key,index)=>values[index]===undefined?[]:[[key,values[index]]]));
    const assessment=assessRouteRequirements(program,applicant(facts));
    assert.equal(assessment.scope,'partial');
    assert.equal(assessment.result.status,values.includes(false)?'unmet':'unknown');
    assert.deepEqual(assessment.result.children.map(check=>[check.id,check.status]),[
      ...keys.map((key,index)=>[key,values[index]===undefined?'unknown':values[index]?'met':'unmet']),
      ['study-costs','unknown'],
    ]);
    for(const check of assessment.result.children){
      assert.equal(check.source.url,program.audit.claims[0].sourceUrl);
      assert.equal(check.source.reviewedAt,program.audit.claims[0].checkedAt);
    }
  }
});

test('positive applicant assertions never complete manual review or produce a primary plan',()=>{
  const documented=applicant(Object.fromEntries(keys.map(key=>[key,true])));
  const before=structuredClone(documented);
  const results=matchPrograms([program],documented);
  assert.equal(results[0].eligibility,'conditional');
  assert.equal(results[0].explanation.dataComplete,false);
  assert.equal(results[0].explanation.requirements.result.status,'unknown');
  assert.match(results[0].explanation.requirements.result.children[0].reason,/Applicant reports.*authority review/);
  assert.ok(results[0].explanation.nextSteps.some(step=>step.startsWith('Individual study costs and document checklist:')));
  assert.equal(results[0].adjustedCost,null);
  assert.deepEqual(buildStrategy(results),[]);
  const unmet=matchPrograms([program],applicant({studyAdmission:false}))[0];
  assert.equal(unmet.eligibility,'ineligible');
  assert.ok(unmet.explanation.nextSteps.some(step=>step.includes('Applicant reports this requirement is not met')));
  assert.deepEqual(documented,before);
});

test('generic credentials, languages, offers and planning budgets do not stand in for masters evidence',()=>{
  const unrelated={...profile,education:'master',german:true,englishLevel:3,hasJobOffer:true,budget:1000000,monthlyIncome:100000,
    evidence:{routes:{'de-graduate-jobsearch':{facts:Object.fromEntries(keys.map(key=>[key,true]))}}}};
  assert.ok(assessRouteRequirements(program,unrelated).result.children.every(check=>check.status==='unknown'));
  const documented=applicant({studyAdmission:true,programmeLanguage:true});
  documented.evidence.routes[program.id].financial=[{kind:'balance',amount:1000000,currency:'EUR'}];
  const results=assessRouteRequirements(program,documented).result.children;
  assert.equal(results.find(check=>check.id==='securedLivelihood').status,'unknown');
  assert.equal(results.find(check=>check.id==='study-costs').status,'unknown');
});

test('the masters model controls projection and unsupported or incomplete references fail closed',()=>{
  const stage=germanyStudyJourney.stages[0];
  const original=structuredClone(stage);
  try{
    for(const edit of [
      stage=>{stage.conditions[0].source.claimTopic='Missing claim';},
      stage=>{stage.conditions[0].source.auditBatchId='missing-batch';},
      stage=>{stage.conditions[0].evidence[0].programId='de-graduate-jobsearch';},
      stage=>{stage.conditions[0].evidence[0].fact='germanDegree';},
      stage=>{stage.conditions[0].evidence.pop();},
    ]){
      Object.assign(stage,structuredClone(original));edit(stage);
      assert.equal(assessRouteRequirements(program,applicant({})),undefined);
    }
  } finally {Object.assign(stage,original);}
});

test('later stages and transitions are not assessed and existing route outputs stay unchanged',()=>{
  const stages=germanyStudyJourney.stages;
  const original=structuredClone(stages);
  const person=applicant({studyAdmission:true});
  const before=matchPrograms(studyPilotPrograms,person);
  const roadmap=buildRoadmap(program,person);
  try{
    stages[0].transitions=[];
    for(const stage of stages.slice(1)) stage.conditions[0].source.claimTopic='Not connected';
    assert.deepEqual(matchPrograms(studyPilotPrograms,person),before);
    assert.deepEqual(buildRoadmap(program,person),roadmap);
  } finally {germanyStudyJourney.stages=original;}
});
