import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALL_PROGRAMS } from '../src/lib/data/index.ts';
import { adjustedCost, requiredBudget, scoreProgram, buildStrategy } from '../src/lib/scoring.ts';

export const profile = { citizenship:'AZ', age:30, familyStatus:'single', dependents:0,
  budget:1000000, monthlyIncome:20000, expectedSalary:0, hasJobOffer:false,
  education:'master', experience:8, field:'it', englishLevel:3, turkish:true,
  russian:true, goal:'remote', timeline:'flexible', risk:'medium', regions:[], remoteWork:false };
const program = id => ALL_PROGRAMS.find(p => p.id === id);

test('imported records explicitly retain unverified source pointers', () => {
  for (const p of ALL_PROGRAMS) assert.deepEqual(p.verification, {status:'unverified',checkedAt:null,sourceUrl:p.url});
});

test('capital floor blocks a route even when year-one spending is affordable', () => {
  const dtv = program('th-dtv');
  const user = {...profile, budget:5000, monthlyIncome:0};
  assert.ok(adjustedCost(dtv, user) <= user.budget);
  assert.equal(requiredBudget(dtv, user), 15000);
  const result = scoreProgram(dtv, user);
  assert.equal(result.eligibility, 'ineligible');
  assert.match(result.gateIssues[0], /10,000 more available funds/);
  assert.equal(scoreProgram(dtv, {...user,budget:15000}).eligibility, 'eligible');
});

test('investment already included in spending is not double counted; family cost remains covered', () => {
  const p = {...program('th-dtv'), minBudget:10000, totalYearOneCost:12000, costPerDependent:4000};
  assert.equal(requiredBudget(p, profile), 12000);
  assert.equal(requiredBudget(p, {...profile,familyStatus:'family',dependents:2}), 20000);
});

test('salary cannot substitute for sponsorship across any required-offer route', () => {
  for (const p of ALL_PROGRAMS.filter(p => p.jobOfferRequired)) {
    const missing = scoreProgram(p,{...profile,expectedSalary:5000});
    assert.notEqual(missing.eligibility,'eligible',p.id);
    assert.ok(missing.gateIssues.includes('Employer sponsorship required'),p.id);
    assert.ok(!scoreProgram(p,{...profile,expectedSalary:5000,hasJobOffer:true}).gateIssues.includes('Employer sponsorship required'),p.id);
  }
  const work = {...program('de-bluecard'),category:'work'};
  assert.ok(scoreProgram(work,profile).gateIssues.includes('Employer sponsorship required'));
});

test('CBI displayed fit includes the risk adjustment used by the score', () => {
  const p = ALL_PROGRAMS.find(p => p.category === 'cbi');
  const user = {...profile,budget:p.totalYearOneCost};
  const medium = scoreProgram(p, user);
  const low = scoreProgram(p, {...user,risk:'low'});
  const high = scoreProgram(p, {...user,risk:'high'});
  assert.equal(low.breakdown.fit, Math.round(medium.breakdown.fit * .72));
  assert.equal(high.breakdown.fit, Math.round(Math.min(100, medium.breakdown.fit * 1.12)));
});

test('an actual sponsored offer uses offered salary, while income-proof routes use current income', () => {
  const p = program('de-bluecard');
  assert.ok(p.minMonthlyIncome > 0);
  const offered = {...profile,monthlyIncome:0,hasJobOffer:true,expectedSalary:p.minMonthlyIncome};
  assert.equal(scoreProgram(p,offered).eligibility,'eligible');
  assert.ok(scoreProgram(p,{...offered,monthlyIncome:50000,expectedSalary:p.minMonthlyIncome-1}).gateIssues.some(i=>i.startsWith('Offered salary short')));
  const passive = ALL_PROGRAMS.find(p=>p.category==='passive' && p.minMonthlyIncome>0);
  assert.ok(scoreProgram(passive,offered).gateIssues.some(i=>i.startsWith('Income short')));
});

test('strategy does not include ineligible programs', () => {
  const r = scoreProgram(program('th-dtv'), {...profile,budget:5000});
  assert.deepEqual(buildStrategy([r]), []);
});
