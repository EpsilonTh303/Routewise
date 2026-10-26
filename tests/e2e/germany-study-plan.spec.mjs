import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';

const sample=JSON.parse(readFileSync(new URL('../../examples/ai/match.json',import.meta.url),'utf8')).profile;

test('Germany plan keeps stage evidence, expense quotes and funds proof separate',async({page},testInfo)=>{
  const profile={...sample,goal:'study',dependents:0,familyStatus:'single',hasJobOffer:false};
  await page.addInitScript(value=>localStorage.setItem('routewise-profile-v1',JSON.stringify(value)),profile);
  await page.goto('/');
  await page.getByRole('button',{name:'My strategy',exact:true}).click();

  const plan=page.getByRole('region',{name:'Germany study plan'});
  await expect(plan.getByText('A conditional route plan')).toBeVisible();
  await expect(plan.locator(':scope > ol > li')).toHaveCount(4);
  await expect(plan.getByText('Partial source coverage')).toBeVisible();
  await expect(plan.getByText(/no stage or approval is guaranteed/i)).toBeVisible();
  await plan.screenshot({path:testInfo.outputPath('germany-plan.png')});

  const work=plan.locator('li').filter({has:page.getByRole('heading',{name:'Çalışma izni'})});
  await work.getByText('Review checks, actions and sources').click();
  await work.getByText('Optional work-stage self-check').click();
  await work.getByLabel('Employment qualifies as skilled work').selectOption('yes');
  await expect(work.getByText('Needs evidence').first()).toBeVisible();
  await expect(work.getByText(/document and route review remain required/i).first()).toBeVisible();

  const budget=plan.locator('details').filter({has:page.getByText('Personal year-one expense estimate · EUR')});
  await budget.locator(':scope > summary').click();
  await expect(budget.getByText('Not available')).toBeVisible();
  await expect(budget.getByText(/The TK tariff is not automatically applied/i)).toBeVisible();
  await budget.getByLabel('Tuition amount, EUR').fill('12000');
  await budget.getByLabel('Tuition description').fill('University fee quote');
  const reviewedOn=new Date().toISOString().slice(0,10);
  await budget.getByLabel('Tuition source URL').fill('http://example.edu/fees');
  await budget.getByLabel('Tuition reviewed on').fill(reviewedOn);
  await expect(budget.getByRole('alert')).toBeVisible();
  await budget.getByLabel('Tuition source URL').fill('https://example.edu/fees');
  await budget.getByLabel('Tuition reviewed on').fill('2099-01-01');
  await expect(budget.getByRole('alert')).toBeVisible();
  await budget.getByLabel('Tuition reviewed on').fill(reviewedOn);
  await expect(budget.getByText('Not available')).toBeVisible();
  await expect(budget.getByText(/Missing quote categories:/)).toBeVisible();

  const quotes=[
    ['Housing including utilities','1000'],
    ['Living costs excluding housing and insurance','800'],
    ['Health insurance','100'],
    ['Semester fees','300'],
    ['Relocation','500'],
    ['Permit fees','100'],
  ];
  for (const [label,amount] of quotes) {
    const quote=budget.locator('fieldset').filter({has:page.getByLabel(`${label} amount, EUR`)});
    await quote.getByLabel(`${label} amount, EUR`).fill(amount);
    await quote.getByLabel(`${label} description`).fill(`${label} estimate`);
    await quote.getByLabel(`${label} source URL`).fill('https://example.edu/costs');
    await quote.getByLabel(`${label} reviewed on`).fill(reviewedOn);
    if (label.includes('Housing') || label.includes('Living') || label.includes('insurance')) await quote.getByLabel('This quote covers 12 months.').check();
  }
  await budget.getByLabel('Assume a 12-month projection for monthly housing, living and insurance quotes.').check();
  await expect(budget.getByText('€35,700')).toBeVisible();
  await expect(budget.getByText(/not a required funds threshold/i)).toBeVisible();

  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('routewise-profile-v1')));
  expect(saved.profile??saved).toEqual(profile);

  await page.reload();
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  const resetBudget=page.getByRole('region',{name:'Germany study plan'}).locator('details').filter({has:page.getByText('Personal year-one expense estimate · EUR')});
  await resetBudget.locator(':scope > summary').click();
  await expect(resetBudget.getByText('Not available')).toBeVisible();
});

test('Germany plan exposes source notes and never predicts a PR date',async({page})=>{
  await page.addInitScript(value=>localStorage.setItem('routewise-profile-v1',JSON.stringify({...value,goal:'study'})),sample);
  await page.goto('/');
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  const plan=page.getByRole('region',{name:'Germany study plan'});
  const settlement=plan.locator('li').filter({has:page.getByRole('heading',{name:'Kalıcı oturum'})});
  await settlement.getByText('Review checks, actions and sources').click();
  await settlement.getByText(/Sources for this stage/).click();
  await expect(settlement.getByRole('link').first()).toBeVisible();
  await expect(settlement.getByText(/Supplemental partial review/)).toBeVisible();
  await settlement.getByText('Optional settlement self-check').click();
  await expect(plan.getByText(/no PR date is predicted/i).first()).toBeVisible();
});
