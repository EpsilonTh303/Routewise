import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';

const sample=JSON.parse(readFileSync(new URL('../../examples/ai/match.json',import.meta.url),'utf8')).profile;

test('German study and graduate routes expose staged claims, unknown totals and manual evidence',async({page,request})=>{
  const response=await request.post('/api/v1/match',{data:{profile:{...sample,goal:'study'},includeAlternatives:true,limit:100}});
  expect(response.ok()).toBe(true);
  const {data}=await response.json();
  expect(data.engineVersion).toBe('3.5.0');
  expect(data.results.some(result=>result.program.id==='de-masters-study')).toBe(true);
  expect(data.results.some(result=>result.program.id==='de-graduate-jobsearch')).toBe(true);
  expect(data.plans).toEqual([]);
  const master=(await (await request.get('/api/v1/programs/de-masters-study')).json()).data;
  expect(master.program.minBudget).toBeNull();
  expect(master.program.totalYearOneCost).toBeNull();
  expect(master.program.audit.status).toBe('partial');
  expect(master.program.audit.financialRequirements.some(item=>item.amount===11904&&item.currency==='EUR')).toBe(true);

  await page.addInitScript(profile=>localStorage.setItem('routewise-profile-v1',JSON.stringify(profile)),{...sample,goal:'study'});
  await page.goto('/');
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  await expect(page.getByRole('region',{name:'Top strategy'}).getByRole('button')).toHaveCount(0);
  await page.getByRole('button',{name:'Explore all routes',exact:true}).click();
  await page.getByRole('textbox',{name:'Search programs'}).fill('German master');
  const card=page.getByRole('button',{name:/German master's study residence route/});
  await expect(card).toContainText('Needs review');
  await card.click();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toContainText('up to 18 months');
  await expect(dialog).toContainText('€11,904');
  const review=dialog.getByRole('region',{name:'Official source review'});
  await expect(review).toContainText('Source audit · partial');
  await expect(review).toContainText('tuition');
  await expect(review.getByRole('link')).toHaveCount(master.program.audit.claims.length);
  const order=await dialog.locator('section[aria-label="Official source review"]').evaluate(node=>{
    const content=node.parentElement;
    return [...content.children].indexOf(node)===content.children.length-1;
  });
  expect(order).toBe(true);
  await expect(dialog.getByRole('button',{name:/eligibility/i})).toHaveCount(0);
});

test('study eligibility facts are applicant-entered and do not create an automatic PR strategy',async({page,request})=>{
  const profile={...sample,goal:'study'};
  await page.addInitScript(value=>localStorage.setItem('routewise-profile-v1',JSON.stringify(value)),profile);
  await page.goto('/');
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  await page.getByRole('button',{name:'Edit profile'}).click();
  const editor=page.locator('details').filter({has:page.getByText('Optional route evidence')});
  await editor.locator('summary').click();
  await page.getByLabel('Route',{exact:true}).selectOption('de-masters-study');
  await page.getByLabel(/recognised study programme/i).selectOption('yes');
  await page.getByLabel('Required programme language evidence accepted',{exact:true}).selectOption('yes');
  await expect(page.getByText('Add documented facts for a specific route.',{exact:false})).toBeVisible();
  await page.getByRole('button',{name:'Save changes'}).click();
  const saved=await page.evaluate(()=>{
    const value=JSON.parse(localStorage.getItem('routewise-profile-v1'));
    return value.profile;
  });
  expect(saved.evidence.routes['de-masters-study'].facts).toEqual({studyAdmission:true,programmeLanguage:true});
  const response=await request.post('/api/v1/match',{data:{profile:saved,includeAlternatives:true,includeIneligible:true,limit:100}});
  expect(response.ok()).toBe(true);
  const {data}=await response.json();
  expect(data.plans).toEqual([]);
  expect(data.results.some(result=>result.program.id==='de-masters-study')).toBe(true);
  expect(data.results.find(result=>result.program.id==='de-masters-study').program.yearsToPR).toBeNull();
});
