import {test} from 'node:test';
import assert from 'node:assert/strict';
import {PATHWAY_RECORDS} from '../src/lib/data/pathway-splits.ts';
import {PATHWAY_REVIEWS,buildReviewedPathway} from '../src/lib/data/reviewed-pathways.ts';
import {assessRouteRequirements,routeRequirement} from '../src/lib/route-requirements.ts';
import {evaluateRequirement,flattenRequirements,requirementSchema} from '../src/lib/requirements.ts';
import {scoreProgram,buildStrategy} from '../src/lib/scoring.ts';
import {profileSchema} from '../src/lib/validation.ts';
import {serializeSavedProfile,parseSavedProfile} from '../src/lib/profile.ts';
const routes=PATHWAY_REVIEWS.map(item=>buildReviewedPathway(PATHWAY_RECORDS.find(row=>row.program.id===item.id).program,item));
const get=id=>routes.find(p=>p.id===id);
const base={citizenship:'AZ',age:30,familyStatus:'single',dependents:0,budget:50000,monthlyIncome:0,expectedSalary:0,hasJobOffer:false,education:'bachelor',experience:5,field:'it',englishLevel:2,turkish:false,russian:true,goal:'remote',timeline:'1y',risk:'medium',regions:[],remoteWork:false};
const withEvidence=(id,evidence)=>({...base,evidence:{routes:{[id]:evidence}}});
const assessment=(id,evidence)=>assessRouteRequirements(get(id),withEvidence(id,evidence)).result;

test('Brazil funds-only satisfies the financial OR without invented income or route-wide approval',()=>{
  const id='br-vitem-xiv-nomad';
  const profile=withEvidence(id,{financial:[{kind:'balance',amount:18000,currency:'USD'}],facts:{foreignRemoteContract:true}});
  const match=scoreProgram(get(id),profile);
  assert.equal(match.explanation.requirements.result.status,'met');
  assert.equal(match.explanation.requirements.scope,'partial');
  assert.equal(match.explanation.dataComplete,false);
  assert.deepEqual(buildStrategy([match]),[]);
  assert.equal(match.gateIssues.some(issue=>/Income short|Remote-work evidence/.test(issue)),false);
});
test('AND/OR preserves unknowns and missing financial evidence cannot approve or reject',()=>{
  const id='br-vitem-xiv-nomad';
  assert.equal(assessment(id,{}).status,'unknown');
  assert.equal(assessment(id,{facts:{foreignRemoteContract:true},financial:[{kind:'balance',amount:1,currency:'USD'}]}).status,'unknown');
  assert.equal(assessment(id,{facts:{foreignRemoteContract:true},financial:[{kind:'balance',amount:1,currency:'USD'},{kind:'income',amount:1,currency:'USD',period:'monthly',basis:'unspecified'}]}).status,'unmet');
  const rule=routeRequirement(get(id),base);
  assert.doesNotThrow(()=>requirementSchema.parse(rule));
  assert.equal(evaluateRequirement({...rule,children:[{...rule.children[0],kind:'manual',reason:'Needs review'}]}).status,'unknown');
});
test('EB-2 selected NIW remains discretionary even with degree and endeavor assertions',()=>{
  const id='us-eb2';
  assert.equal(assessment(id,{eb2Path:'niw-assessment',facts:{eb2Qualification:true,niwEndeavor:true}}).status,'unknown');
  assert.equal(assessment(id,{eb2Path:'sponsored',facts:{eb2Qualification:true,localEmploymentContract:true,laborCertification:true}}).status,'met');
  assert.equal(assessment(id,{}).status,'unknown');
});
test('Thai assets include investment without requiring another liquid investment or adding amounts',()=>{
  const id='th-ltr-wealthy';
  const p=withEvidence(id,{financial:[{kind:'assets',amount:1000000,currency:'USD'},{kind:'investment',amount:500000,currency:'USD'}],facts:{healthCoverage:true}});
  const result=scoreProgram(get(id),{...p,budget:0});
  assert.equal(result.explanation.requirements.result.status,'met');
  assert.equal(result.explanation.knownBudgetFloor,0);
  assert.equal(result.gateIssues.some(issue=>/more available funds/.test(issue)),false);
  assert.equal(assessment(id,{financial:[{kind:'assets',amount:1000000,currency:'USD'}],facts:{healthCoverage:true}}).status,'unknown');
});
test('Australia nomination and invitation are independent from generic offer and education',()=>{
  const id='au-subclass-190';
  const result=assessment(id,{facts:{skilledAssessment:true,pointsThreshold:true}});
  assert.equal(result.status,'unknown');
  for(const name of ['nomination','invitation']) assert.equal(flattenRequirements(result).find(r=>r.id===name).status,'unknown');
  assert.equal(assessment(id,{facts:{nomination:false}}).status,'unmet');
});
test('native salary compares EUR gross evidence and never USD planning income',()=>{
  const id='fi-specialist-permit';
  const evidence={facts:{localEmploymentContract:true,specialistQualification:true},financial:[{kind:'income',amount:3937,currency:'EUR',period:'monthly',basis:'gross'}]};
  assert.equal(assessment(id,evidence).status,'met');
  assert.equal(assessment(id,{...evidence,financial:[{...evidence.financial[0],currency:'USD'}]}).status,'unknown');
});
test('profile evidence is validated, route-scoped, versioned and custom reviews are not overwritten',()=>{
  const id='br-vitem-xiv-nomad';
  const p=withEvidence(id,{financial:[{kind:'balance',amount:18000,currency:'USD'}],facts:{foreignRemoteContract:true}});
  assert.deepEqual(parseSavedProfile(serializeSavedProfile(p)),p);
  assert.deepEqual(parseSavedProfile(JSON.stringify(base)),base);
  assert.equal(parseSavedProfile(JSON.stringify({version:999,profile:base})),null);
  assert.equal(profileSchema.safeParse({...base,evidence:{routes:{[id]:{facts:{unknownFact:true}}}}}).success,false);
  assert.equal(assessRouteRequirements(get('th-ltr-wealthy'),p).result.status,'unknown');
  const changed=structuredClone(get(id));changed.pathway.review.claims[0].summary='Local edit';
  assert.equal(assessRouteRequirements(changed,p),undefined);
});
