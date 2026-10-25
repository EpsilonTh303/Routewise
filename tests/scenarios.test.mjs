import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_PROGRAMS } from '../src/lib/data/index.ts';
import { PATHWAY_REVIEWS } from '../src/lib/data/reviewed-pathways.ts';
import { compareScenarios, scenarioRequestSchema } from '../src/lib/scenarios.ts';
import { studyPilotPrograms } from '../src/lib/data/study-pilot.ts';
import { matchPrograms } from '../src/lib/scoring.ts';

const profile = {
  citizenship:'AZ', age:30, familyStatus:'single', dependents:0, budget:100000, monthlyIncome:0, expectedSalary:0,
  hasJobOffer:false, education:'master', experience:8, field:'it', englishLevel:3, turkish:true, russian:true,
  goal:'remote', timeline:'flexible', risk:'medium', regions:[], remoteWork:true,
};
const from = id => structuredClone(ALL_PROGRAMS.find(program => program.id === id));

test('German what-ifs accept legacy profiles and recalculate scores without inventing language evidence',()=>{
  const catalog=[...studyPilotPrograms,from('de-bluecard'),from('us-dv')];
  const base={...profile,education:'bachelor',experience:0,englishLevel:0,turkish:false,russian:false,goal:'study'};
  const before=structuredClone(base);
  const result=compareScenarios(catalog,base,[{id:'german',label:'German skills',changes:{german:true}}]);
  assert.deepEqual(result.scenarios[0].results,matchPrograms(catalog,{...base,german:true}));
  const master=result.scenarios[0].results.find(item=>item.program.id==='de-masters-study');
  const oldMaster=result.base.results.find(item=>item.program.id===master.program.id);
  assert.ok(master.breakdown.fit>oldMaster.breakdown.fit);
  assert.ok(master.matchPct>oldMaster.matchPct);
  assert.equal(master.eligibility,oldMaster.eligibility);
  assert.deepEqual(master.explanation.requirements,oldMaster.explanation.requirements);
  assert.equal(master.explanation.requirements.result.status,'unknown');
  const unrelated=id=>result.scenarios[0].results.find(item=>item.program.id===id);
  assert.deepEqual(unrelated('us-dv'),result.base.results.find(item=>item.program.id==='us-dv'));
  const reversed=compareScenarios(catalog,{...base,german:true},[{id:'remove',label:'Remove German',changes:{german:false}}]);
  assert.deepEqual(reversed.scenarios[0].results,matchPrograms(catalog,{...base,german:false}));
  assert.deepEqual(base,before);
});

test('German and other language patches use the existing validated profile and evidence pipeline',()=>{
  const catalog=studyPilotPrograms;
  const id='de-masters-study';
  const changes={german:true,englishLevel:2,turkish:false,russian:false,evidence:{routes:{[id]:{facts:{programmeLanguage:false}}}}};
  const result=compareScenarios(catalog,profile,[{id:'languages',label:'Languages',changes}]);
  assert.deepEqual(result.scenarios[0].results,matchPrograms(catalog,{...profile,...changes}));
  const master=result.scenarios[0].results.find(item=>item.program.id===id);
  assert.equal(master.eligibility,'ineligible');
  assert.ok(result.scenarios[0].changes.find(item=>item.programId===id).requirements.some(item=>item.id==='programmeLanguage'&&item.before==='unknown'&&item.after==='unmet'));
  for(const changes of [{englishLevel:0},{englishLevel:3},{turkish:false},{russian:false}]){
    assert.deepEqual(compareScenarios(catalog,profile,[{id:'language',label:'Language',changes}]).scenarios[0].results,matchPrograms(catalog,{...profile,...changes}));
  }
  for(const german of ['true',1,null]) assert.throws(()=>compareScenarios(catalog,profile,[{id:'invalid',label:'Invalid',changes:{german}}]));
});

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
