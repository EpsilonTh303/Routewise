import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ALL_PROGRAMS} from '../src/lib/data/index.ts';
import {scoreProgram,matchPrograms,buildStrategy,buildRoadmap,adjustedCost} from '../src/lib/scoring.ts';

const user={citizenship:'AZ',age:30,familyStatus:'single',dependents:0,budget:100000,monthlyIncome:10000,expectedSalary:10000,hasJobOffer:true,
  education:'master',experience:10,field:'it',englishLevel:3,turkish:true,russian:true,goal:'citizenship',timeline:'flexible',risk:'medium',regions:[],remoteWork:true};
const original=ALL_PROGRAMS.find(p=>p.id==='de-bluecard');
const route=(patch={})=>({...original,...patch});

test('excluding a region never increases the same program score',()=>{
  const p=route({devScore:1,azEase:1,passportAccess:'visa-required',languageBonus:[]});
  assert.ok(scoreProgram(p,{...user,regions:['Latin America']}).matchPct<scoreProgram(p,user).matchPct);
});
test('a remote-incompatible route never gets a bonus for incompatibility',()=>{
  const p=route({category:'student',jobOfferRequired:false,minMonthlyIncome:0});
  const profile={...user,age:23,education:'phd',goal:'remote'};
  assert.ok(scoreProgram({...p,remoteFriendly:false},profile).matchPct<scoreProgram({...p,remoteFriendly:true},profile).matchPct);
});
test('decision speed does not invent a permanent-residence wait for a route without PR',()=>{
  assert.equal(scoreProgram(route({yearsToPR:null}),user).breakdown.speed,scoreProgram(route({yearsToPR:0}),user).breakdown.speed);
});
test('six-month and one-year timelines distinguish a long processing delay',()=>{
  const p=route({processingWeeks:40});
  assert.ok(scoreProgram(p,{...user,timeline:'6m'}).matchPct<scoreProgram(p,{...user,timeline:'1y'}).matchPct);
});
test('other citizenships do not inherit Azerbaijani entry scores',()=>{
  const gb={...user,citizenship:'GB'};
  assert.equal(scoreProgram(route({passportAccess:'visa-free',azEase:5}),gb).breakdown.access,
    scoreProgram(route({passportAccess:'visa-required',azEase:1}),gb).breakdown.access);
});
test('missing sponsorship is reported once rather than also inventing an offered salary deficit',()=>{
  const result=scoreProgram(original,{...user,hasJobOffer:false,expectedSalary:0});
  assert.ok(result.gateIssues.includes('Employer sponsorship required'));
  assert.ok(!result.gateIssues.some(issue=>issue.startsWith('Offered salary short')));
});
test('category heuristics cannot impose an unrecorded age or education rejection',()=>{
  const student=scoreProgram(route({category:'student',jobOfferRequired:false,minMonthlyIncome:0}),{...user,age:50});
  assert.ok(!student.gateIssues.some(issue=>issue.includes('17–42')));
  const work=scoreProgram(route({category:'work',jobOfferRequired:false}),{...user,education:'highschool'});
  assert.ok(!work.gateIssues.some(issue=>issue.includes('Degree or formal')));
});
test('all declared dependents contribute to costs even if a submitted household label is inconsistent',()=>{
  const p=route({totalYearOneCost:10000,costPerDependent:2000});
  assert.equal(adjustedCost(p,{...user,familyStatus:'single',dependents:2}),14000);
});
test('strategy primary prioritizes ready routes and never promotes a lottery',()=>{
  const ready={...scoreProgram(route({id:'ready'}),user),eligibility:'eligible',matchPct:70};
  const conditional={...ready,program:route({id:'conditional'}),eligibility:'conditional',matchPct:98,gateIssues:['Employer sponsorship required']};
  const lottery={...ready,program:route({id:'lottery',dvLottery:true}),matchPct:99};
  assert.equal(buildStrategy([lottery,conditional,ready])[0].result.program.id,'ready');
});
test('strategy handles unsorted input and provides distinct similarly ranked country/category backups',()=>{
  const make=(id,country,category,matchPct)=>({...scoreProgram(route({id,country,category}),user),eligibility:'eligible',matchPct});
  const plans=buildStrategy([make('same','Germany','skilled',90),make('best','Germany','skilled',91),make('hedge','Portugal','passive',89),make('third','France','student',88)]);
  assert.equal(plans[0].result.program.id,'best');
  assert.equal(plans[1].result.program.id,'hedge');
  assert.equal(plans[2].result.program.id,'third');
});
test('strategy cannot repeat a program if input contains duplicates',()=>{
  const result=scoreProgram(original,user);
  const plans=buildStrategy([result,result,result]);
  assert.equal(new Set(plans.map(p=>p.result.program.id)).size,plans.length);
});
test('residency milestones occur after activation and include PR granted at activation',()=>{
  const steps=buildRoadmap(route({processingWeeks:104,yearsToPR:1,yearsToCitizenship:1}),user);
  const activation=steps.find(s=>s.label==='Relocate & activate').monthsFromNow;
  assert.ok(steps.find(s=>s.label==='Permanent residence').monthsFromNow>=activation+12);
  assert.ok(steps.find(s=>s.label==='Citizenship application').monthsFromNow>=activation+12);
  const immediate=buildRoadmap(route({yearsToPR:0}),user);
  assert.ok(immediate.some(s=>s.label==='Permanent residence'));
});
test('direct citizenship scenarios do not mandate relocation or permanent residence',()=>{
  const steps=buildRoadmap(route({category:'cbi',yearsToCitizenship:0,yearsToPR:null}),user);
  assert.ok(!steps.some(s=>s.label==='Relocate & activate'));
  assert.ok(!steps.some(s=>s.label==='Permanent residence'));
});

test('score explanations reproduce the displayed total and disclose unverified rules',()=>{
  const result=scoreProgram(original,user);
  const explained=result.explanation.baseScore+result.explanation.adjustments.reduce((sum,a)=>sum+a.points,0);
  assert.equal(result.matchPct,Math.round(Math.min(98,Math.max(0,explained))));
  assert.equal(result.explanation.requiredBudget,15000);
  assert.ok(result.explanation.warnings.some(w=>w.includes('not been source-verified')));
  assert.ok(result.explanation.nextSteps.length>0);
});

test('goal-specific plans do not substitute unrelated programs for study or business',()=>{
  for(const goal of ['study','business','remote','citizenship']) {
    const results=matchPrograms(ALL_PROGRAMS,{...user,goal});
    const plans=buildStrategy(results);
    if(goal==='study'&&!ALL_PROGRAMS.some(p=>p.category==='student')) assert.deepEqual(plans,[]);
    else assert.ok(plans.length>0,goal);
    for(const plan of plans) {
      assert.equal(plan.result.explanation.goalAligned,true,goal);
      assert.notEqual(plan.result.program.dvLottery,true);
      if(goal==='study') assert.equal(plan.result.program.category,'student');
    }
  }
});

test('a lottery alone cannot become a primary relocation strategy',()=>{
  assert.deepEqual(buildStrategy([scoreProgram(route({dvLottery:true}),user)]),[]);
});

test('free recorded routes remain affordable at zero budget',()=>{
  const result=scoreProgram(route({minBudget:0,totalYearOneCost:0,costPerDependent:0}),{...user,budget:0});
  assert.equal(result.breakdown.cost,100);
  assert.ok(Number.isFinite(result.matchPct));
});

test('larger budgets never lower a score across the fixture and every goal',()=>{
  for(const goal of ['citizenship','pr-fast','lowest-cost','top-qol','remote','business','study','family-safe']) {
    for(const p of ALL_PROGRAMS) {
      const small=scoreProgram(p,{...user,goal,budget:10000,risk:'low'});
      const large=scoreProgram(p,{...user,goal,budget:100000,risk:'low'});
      assert.ok(large.matchPct>=small.matchPct,`${goal}/${p.id}`);
    }
  }
});

test('less processing time never lowers decision speed or overall fit',()=>{
  for(const p of ALL_PROGRAMS) {
    const slow=scoreProgram({...p,processingWeeks:52},{...user,timeline:'6m'});
    const fast=scoreProgram({...p,processingWeeks:4},{...user,timeline:'6m'});
    assert.ok(fast.breakdown.speed>=slow.breakdown.speed,p.id);
    assert.ok(fast.matchPct>=slow.matchPct,p.id);
  }
});

test('rankings are deterministic for any input ordering and do not mutate the inputs',()=>{
  const input=Object.freeze([...ALL_PROGRAMS]);
  const before=input.map(p=>p.id);
  const first=matchPrograms(input,user);
  const reversed=matchPrograms([...input].reverse(),user);
  assert.deepEqual(first,reversed);
  assert.deepEqual(input.map(p=>p.id),before);
  for(const result of first) {
    assert.ok(Number.isFinite(result.matchPct));
    assert.ok(result.matchPct>=0&&result.matchPct<=98);
    assert.ok(Object.values(result.breakdown).every(n=>Number.isFinite(n)&&n>=0&&n<=100));
  }
});

test('all fixture roadmaps are chronologically ordered',()=>{
  for(const p of ALL_PROGRAMS) {
    const steps=buildRoadmap(p,user);
    assert.ok(steps.every((step,i)=>Number.isFinite(step.monthsFromNow)&&step.monthsFromNow>=0&&(i===0||step.monthsFromNow>=steps[i-1].monthsFromNow)),p.id);
  }
});

test('an unmodeled treaty flag does not grant a passport-specific ranking bonus',()=>{
  assert.equal(scoreProgram(route({e2Treaty:true}),user).matchPct,scoreProgram(route({e2Treaty:false}),user).matchPct);
});
