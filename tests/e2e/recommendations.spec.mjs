import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';

const sample=JSON.parse(readFileSync(new URL('../../examples/ai/match.json',import.meta.url),'utf8')).profile;

test('GUI Plan A agrees with the API and explains the recommendation',async({page,request})=>{
  const response=await request.post('/api/v1/match',{data:{profile:sample,limit:100}});
  expect(response.ok()).toBe(true);
  const {data}=await response.json();
  expect(data.engineVersion).toBe('3.3.0');
  const expected=data.plans[0].result;
  expect(expected.explanation.goalAligned).toBe(true);
  expect(expected.program.dvLottery).not.toBe(true);
  await page.addInitScript(profile=>localStorage.setItem('routewise-profile-v1',JSON.stringify(profile)),sample);
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  const primary=page.getByRole('region',{name:'Top strategy'}).getByRole('button',{name:/Plan A — Primary/});
  await expect(primary).toContainText(expected.program.program);
  await expect(primary).toContainText(expected.program.country);
  await primary.click();
  const dialog=page.getByRole('dialog');
  const explanation=dialog.getByRole('region',{name:'Recommendation explanation'});
  await explanation.getByRole('heading',{name:'Why this match',exact:true}).scrollIntoViewIfNeeded();
  await expect(explanation).toContainText('A fit score, not an approval probability');
  await expect(explanation).toContainText(expected.explanation.nextSteps[0]);
});

test('a goal absent from the catalog produces an honest empty strategy with opt-in alternatives',async({page,request})=>{
  const profile={...sample,goal:'study'};
  const response=await request.post('/api/v1/match',{data:{profile}});
  const {data}=await response.json();
  expect(data.strategyStatus).toBe('none');expect(data.results).toEqual([]);
  await page.addInitScript(value=>localStorage.setItem('routewise-profile-v1',JSON.stringify(value)),profile);
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  await expect(page.getByText('No dependable, goal-aligned plan passes the current strategy filters.',{exact:false})).toBeVisible();
  await expect(page.getByRole('region',{name:'Top strategy'}).getByRole('button')).toHaveCount(0);
  await page.getByRole('button',{name:'Other goals',exact:true}).click();
  await expect(page.getByText('Other goal',{exact:true}).first()).toBeVisible();
});


test('separated remote pathway displays unknown costs and timing honestly',async({page,request})=>{
  const response=await request.post('/api/v1/match',{data:{profile:{...sample,goal:'remote',remoteWork:true},includeIneligible:true,limit:100}});
  const {data}=await response.json();
  const branch=data.results.find(r=>r.program.id==='id-e33g-remote-worker');
  expect(branch.program.minBudget).toBeNull();
  expect(branch.adjustedCost).toBeNull();
  expect(data.plans.some(p=>p.result.program.id===branch.program.id)).toBe(false);
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await page.getByRole('button',{name:'Explore all routes'}).click();
  await page.getByRole('textbox',{name:'Search programs'}).fill('E33G');
  const card=page.getByRole('button',{name:/E33G remote-worker route/});
  await expect(card).toContainText('Needs review');
  await card.click();
  const dialog=page.getByRole('dialog');
  await expect(dialog.getByRole('region',{name:'Pathway provenance'})).toContainText('id-secondhome');
  await expect(dialog).toContainText('Needs review');
  const review=dialog.getByRole('region',{name:'Official source review'});
  await expect(review).toContainText('partial review');
  await expect(review).toContainText('60,000');
  await expect(review.getByRole('link')).toHaveAttribute('href',/bontang\.imigrasi\.go\.id/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
