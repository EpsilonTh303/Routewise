import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';

const sample=JSON.parse(readFileSync(new URL('../../examples/ai/match.json',import.meta.url),'utf8')).profile;

test('Bonn academic checker starts unknown and does not infer evidence from profile or visa facts',async({page},testInfo)=>{
  const profile={...sample,goal:'study',education:'phd',englishLevel:3,evidence:{routes:{'de-masters-study':{facts:{studyAdmission:true,programmeLanguage:true}}}}};
  await page.addInitScript(value=>localStorage.setItem('routewise-profile-v1',JSON.stringify(value)),profile);
  await page.goto('/');
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  const storageBefore=await page.evaluate(()=>localStorage.getItem('routewise-profile-v1'));
  const plan=page.getByRole('region',{name:'Germany study plan'});
  const academic=plan.locator('details').filter({has:page.getByText('Programme-specific academic requirements',{exact:true})});
  await academic.locator(':scope > summary').click();
  await expect(academic.getByText(/Unknown · choose the named programme and intake/i)).toBeVisible();

  await academic.getByLabel('Academic programme').selectOption('bonn-computer-science-msc');
  await expect(academic.getByText(/select an explicitly supported intake/i)).toBeVisible();
  await academic.getByLabel('Academic intake').selectOption('summer-2027');
  await academic.screenshot({path:testInfo.outputPath('academic-checker.png')});
  const comparison=academic.getByRole('region',{name:'Academic comparison'});
  await expect(comparison.getByText(/Unknown · institution review remains required/i)).toBeVisible();
  await expect(comparison.getByText('Computer Science or a related bachelor-level subject',{exact:false}).first()).toBeVisible();
  await expect(comparison.getByText(/English ability is at CEFR C1 or higher/i).first()).toBeVisible();
  await expect(comparison.getByText('Unknown pending review').first()).toBeVisible();
  await expect(comparison.getByText(/Applicant selected unknown/i).first()).toBeVisible();

  const sources=academic.locator(':scope > div > details').filter({hasText:/Official programme sources/});
  await sources.locator(':scope > summary').click();
  await expect(sources.getByRole('link')).toHaveCount(3);
  await expect(comparison.getByRole('link').first()).toBeVisible();
  await expect(academic.getByText(/linked regulation text was access denied/i)).toBeVisible();
  const storageAfter=await page.evaluate(()=>localStorage.getItem('routewise-profile-v1'));
  expect(storageAfter).toBe(storageBefore);
});

test('Bonn ECTS reports can show gaps but cannot establish admission',async({page})=>{
  const profile={...sample,goal:'study',education:'phd',englishLevel:3};
  await page.addInitScript(value=>localStorage.setItem('routewise-profile-v1',JSON.stringify(value)),profile);
  await page.goto('/');
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  const plan=page.getByRole('region',{name:'Germany study plan'});
  const academic=plan.locator('details').filter({has:page.getByText('Programme-specific academic requirements',{exact:true})});
  await academic.locator(':scope > summary').click();
  await academic.getByLabel('Academic programme').selectOption('bonn-computer-science-msc');
  await academic.getByLabel('Academic intake').selectOption('summer-2027');
  const comparison=academic.getByRole('region',{name:'Academic comparison'});

  await academic.getByLabel('Mathematics ECTS reported').fill('17');
  const math= comparison.locator(':scope > ul > li').filter({hasText:'Mathematical foundations'});
  await expect(math.getByText('Applicant-reported gap')).toBeVisible();
  await expect(math.getByText(/17 ECTS.*18 ECTS/).first()).toBeVisible();
  await expect(comparison.getByText('Reported gaps to review')).toBeVisible();

  await academic.getByLabel('Mathematics ECTS reported').fill('601');
  await expect(academic.getByRole('alert')).toBeVisible();
  await expect(comparison).toHaveCount(0);

  const values=[
    ['Mathematics ECTS reported','18'],
    ['Theoretical computer science ECTS reported','14'],
    ['Programming ECTS reported','18'],
    ['Thesis ECTS reported','12'],
  ];
  for(const [label,value] of values) await academic.getByLabel(label).fill(value);
  for(const label of ['Relevant bachelor\'s degree','Degree equivalence','Thesis scientific quality','English C1 level','Accepted English proof']) {
    await academic.getByLabel(label).selectOption('yes');
  }
  await academic.getByLabel('Mathematics evidence reference').fill('Transcript page 2, module MATH-101');
  const updated=academic.getByRole('region',{name:'Academic comparison'});
  await expect(updated.getByText(/Unknown · institution review remains required/i)).toBeVisible();
  await expect(updated.getByText(/reaches the 18 ECTS minimum numerically/i).first()).toBeVisible();
  await expect(updated.getByText(/Admission committee review remains unknown/i)).toBeVisible();
  await expect(updated.getByText(/not an admission decision/i)).toBeVisible();
  const saved=await page.evaluate(()=>localStorage.getItem('routewise-profile-v1'));
  expect(JSON.parse(saved).profile??JSON.parse(saved)).toEqual(profile);
});
