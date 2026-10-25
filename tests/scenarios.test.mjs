import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_PROGRAMS } from '../src/lib/data/index.ts';
import { PATHWAY_REVIEWS } from '../src/lib/data/reviewed-pathways.ts';
import { compareScenarios, scenarioRequestSchema } from '../src/lib/scenarios.ts';

const profile = {
  citizenship:'AZ', age:30, familyStatus:'single', dependents:0, budget:100000, monthlyIncome:0, expectedSalary:0,
  hasJobOffer:false, education:'master', experience:8, field:'it', englishLevel:3, turkish:true, russian:true,
  goal:'remote', timeline:'flexible', risk:'medium', regions:[], remoteWork:true,
};
const from = id => structuredClone(ALL_PROGRAMS.find(program => program.id === id));

test('scenario request bounds count, labels, limit and rejects unknown patch keys and duplicate ids', () => {
  const valid = {profile, scenarios:[{id:'what-if',label:'What if',changes:{budget:50000}}]};
  assert.equal(scenarioRequestSchema.safeParse(valid).success, true);
  assert.equal(scenarioRequestSchema.safeParse({...valid,scenarios:Array.from({length:6},(_,i)=>({id:`s-${i}`,label:'Scenario',changes:{}}))}).success, false);
  assert.equal(scenarioRequestSchema.safeParse({...valid,scenarios:[{...valid.scenarios[0],changes:{budegt:1}}]}).success, false);
  assert.equal(scenarioRequestSchema.safeParse({...valid,scenarios:[valid.scenarios[0],valid.scenarios[0]]}).success, false);
  assert.equal(scenarioRequestSchema.safeParse({...valid,scenarios:[{id:'x',label:'x'.repeat(101),changes:{}}]}).success, false);
  assert.equal(scenarioRequestSchema.safeParse({...valid,limit:21}).success, false);
});

test('results are deterministic, bounded, report ranking and requirement-leaf changes, and preserve the base profile', () => {
  const brazil = from('co-nomad');
  brazil.id = 'br-vitem-xiv-nomad';
  const reviewed = PATHWAY_REVIEWS.find(item => item.id === brazil.id);
  brazil.pathway = {parentId:'br-nomad',recipeId:'br-nomad-splits',branch:'test',unknownFields:[],notes:[],remoteWorkRequired:false,review:reviewed.review};
  const catalog = [brazil, from('de-bluecard'), from('us-dv')];
  const base = structuredClone(profile);
  const before = JSON.stringify(base);
  const scenarios = [{id:'funds',label:'Savings documented',changes:{monthlyIncome:10000,evidence:{routes:{[brazil.id]:{facts:{foreignRemoteContract:true},financial:[{kind:'balance',amount:18000,currency:'USD'}]}}}}}];
  const first = compareScenarios(catalog, base, scenarios, 2);
  const second = compareScenarios(catalog, base, scenarios, 2);
  assert.deepEqual(first, second);
  assert.equal(first.base.results.length, 2);
  assert.equal(first.scenarios[0].results.length, 2);
  assert.equal(first.ruleVersion, 'requirements-2026-10-25-v1');
  assert.ok(first.scenarios[0].changes.length <= 2);
  assert.ok(first.scenarios[0].totalChanges >= first.scenarios[0].changes.length);
  assert.equal(JSON.stringify(base), before);
  const brChange = first.scenarios[0].changes.find(change => change.programId === brazil.id);
  assert.ok(brChange?.requirements.some(change => change.id === 'financial-alternatives' || change.id === 'bank-funds'));
  assert.ok(brChange?.dimensions.length > 0);
  assert.equal(first.scenarios[0].plans.some(plan => plan.result.program.id === 'us-dv'), false);
  assert.equal(first.scenarios[0].plans.some(plan => plan.result.program.id === brazil.id), true);
});

test('missing structured requirements, incomplete data and lottery routes cannot enter plans', () => {
  const known = from('de-bluecard');
  known.pathway = {parentId:'test-parent',recipeId:'test-recipe',branch:'missing-rule',unknownFields:[],notes:[],remoteWorkRequired:false};
  const incomplete = {...from('de-bluecard'),id:'incomplete-route',processingWeeks:null};
  const lottery = {...from('de-bluecard'),id:'lottery-route',dvLottery:true};
  const result = compareScenarios([known,incomplete,lottery], profile, [{id:'baseline',label:'Baseline',changes:{}}]);
  const plans = result.base.plans.map(plan => plan.result.program.id);
  assert.equal(plans.includes(incomplete.id), false);
  assert.equal(plans.includes(lottery.id), false);
  // No structured route rule is available, so the scenario comparison cannot invent a leaf result.
  assert.equal(result.scenarios[0].changes.find(change => change.programId === known.id)?.requirements.length ?? 0, 0);
});

test('invalid merged profile patches reject instead of mutating or coercing profile values', () => {
  assert.throws(() => compareScenarios([from('de-bluecard')], profile, [{id:'bad',label:'Bad',changes:{age:121}}]));
  assert.throws(() => compareScenarios([from('de-bluecard')], profile, [{id:'bad',label:'Bad',changes:{age:30, evidence:{routes:{'unknown route':{}}}}}]));
});
