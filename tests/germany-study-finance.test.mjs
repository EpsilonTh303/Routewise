import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {studyPilotPrograms} from '../src/lib/data/study-pilot.ts';
import {assessRouteRequirements} from '../src/lib/route-requirements.ts';
import {flattenRequirements} from '../src/lib/requirements.ts';
import {matchPrograms,buildStrategy} from '../src/lib/scoring.ts';
import {compareScenarios} from '../src/lib/scenarios.ts';

const program=studyPilotPrograms.find(program=>program.id==='de-masters-study');
const threshold=program.audit.financialRequirements.find(item=>item.currency==='EUR'&&item.period==='balance');
const profile=JSON.parse(readFileSync(new URL('../examples/ai/match.json',import.meta.url),'utf8')).profile;
const person=(financial=[],facts={studyAdmission:true,programmeLanguage:true,securedLivelihood:true})=>({...profile,goal:'study',
  evidence:{routes:{[program.id]:{facts,financial}}}});
const balance=amount=>[{kind:'balance',amount,currency:'EUR'}];
const checks=(candidate,applicant)=>new Map(flattenRequirements(assessRouteRequirements(candidate,applicant).result).map(check=>[check.id,check]));

test('sourced EUR threshold compares below, exact and above amounts without approving financing',()=>{
  for(const [amount,status] of [[0,'unmet'],[threshold.amount-0.01,'unmet'],[threshold.amount,'met'],[threshold.amount+1,'met']]){
    const applicant=person(balance(amount));
    const result=checks(program,applicant);
    const budget=result.get('study-living-funds-budget');
    assert.equal(budget.status,status);
    assert.deepEqual(budget.comparison,{kind:'balance',amount:threshold.amount,currency:'EUR'});
    assert.equal(budget.source.url,threshold.sourceUrl);
    assert.equal(result.get('securedLivelihood').status,status==='unmet'?'unmet':'unknown');
    assert.equal(result.get('study-financing-verification').status,'unknown');
    assert.match(result.get('study-financing-verification').reason,/not official financing proof or visa eligibility/);
    const scored=matchPrograms([program],applicant);
    assert.equal(scored[0].eligibility,status==='unmet'?'ineligible':'conditional');
    assert.equal(scored[0].adjustedCost,null);
    assert.deepEqual(buildStrategy(scored),[]);
  }
});

test('missing EUR balance, wrong currencies or financial categories remain unknown regardless of USD budget',()=>{
  for(const financial of [[],[{kind:'balance',amount:threshold.amount*10,currency:'USD'}],
    [{kind:'income',amount:threshold.amount,currency:'EUR',period:'annual',basis:'gross'}],
    [{kind:'assets',amount:threshold.amount,currency:'EUR'}],
    [{kind:'balance',amount:-1,currency:'EUR'}]]){
    for(const budget of [0,1000000]){
      const result=checks(program,{...person(financial),budget});
      assert.equal(result.get('study-living-funds-budget').status,'unknown');
      assert.equal(result.get('securedLivelihood').status,'unknown');
    }
  }
});

test('missing, altered, unsourced or ambiguous financial amounts are unknown rather than assumed thresholds',()=>{
  for(const edit of [
    audit=>{audit.financialRequirements=[];},
    audit=>{audit.financialRequirements[0].amount=undefined;},
    audit=>{audit.financialRequirements[0].amount=0;},
    audit=>{audit.financialRequirements[0].amount=threshold.amount-1;},
    audit=>{audit.financialRequirements[0].sourceUrl='https://example.org/unreviewed';},
    audit=>{audit.financialRequirements.push(structuredClone(audit.financialRequirements[0]));},
    audit=>{audit.financialRequirements.push({...audit.financialRequirements[0],amount:threshold.amount+1});},
    audit=>{audit.financialRequirements[0].currency='USD';},
  ]){
    const candidate=structuredClone(program);edit(candidate.audit);
    const result=checks(candidate,person(balance(threshold.amount*10)));
    assert.equal(result.get('study-living-funds-budget').status,'unknown');
    assert.equal(result.get('securedLivelihood').status,'unknown');
    assert.equal(result.get('study-living-funds-budget').comparison,undefined);
    assert.equal(result.get('studyAdmission').status,'met');
  }
  const stale=structuredClone(program);stale.audit.claims[0].summary='Unreviewed claim';
  assert.equal(assessRouteRequirements(stale,person(balance(threshold.amount))),undefined);
});

test('a sufficient balance neither supplies missing documentation nor overrides a negative assertion',()=>{
  for(const value of [undefined,false,true]){
    const facts={studyAdmission:true,programmeLanguage:true,...(value===undefined?{}:{securedLivelihood:value})};
    const result=checks(program,person(balance(threshold.amount),facts));
    assert.equal(result.get('securedLivelihood-proof').status,value===undefined?'unknown':value?'met':'unmet');
    assert.equal(result.get('securedLivelihood').status,value===false?'unmet':'unknown');
    assert.equal(result.get('study-financing-verification').status,'unknown');
  }
});

test('EUR comparison uses only this route and leaves other routes and input data unchanged',()=>{
  const financial=balance(threshold.amount-1);
  const applicant=person(financial);
  const before=structuredClone({applicant,programs:studyPilotPrograms});
  const otherOnly={...profile,evidence:{routes:{'de-graduate-jobsearch':{financial}}}};
  assert.equal(checks(program,otherOnly).get('study-living-funds-budget').status,'unknown');
  for(const candidate of studyPilotPrograms.filter(candidate=>candidate.id!==program.id)){
    assert.deepEqual(assessRouteRequirements(candidate,applicant),assessRouteRequirements(candidate,{...applicant,evidence:undefined}));
  }
  assessRouteRequirements(program,applicant);
  assert.deepEqual({applicant,programs:studyPilotPrograms},before);
});

test('What-if EUR balances recalculate the budget and livelihood checks through the existing engine',()=>{
  const applicant=person(balance(threshold.amount-1));
  const comparison=compareScenarios([program],applicant,[{id:'funds',label:'EUR funds',changes:{evidence:person(balance(threshold.amount)).evidence}}]);
  const changed=comparison.scenarios[0].changes[0];
  assert.equal(changed.before.eligibility,'ineligible');
  assert.equal(changed.after.eligibility,'conditional');
  assert.ok(changed.requirements.some(check=>check.id==='study-living-funds-budget'&&check.before==='unmet'&&check.after==='met'));
  assert.equal(comparison.scenarios[0].results[0].explanation.requirements.result.status,'unknown');
});
