import { test, expect } from '@playwright/test';

test('invalid saved JSON profile is discarded and the wizard remains usable', async ({page}) => {
  await page.addInitScript(() => localStorage.setItem('routewise-profile-v1','{}'));
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toContainText('One passport in');
  expect(await page.evaluate(()=>localStorage.getItem('routewise-profile-v1'))).toBeNull();
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  await expect(page.getByRole('button',{name:'Next',exact:true})).toBeVisible();
});

test('Explorer preserves ineligible labels and modal keyboard focus', async ({page}) => {
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(() => localStorage.setItem('routewise-profile-v1',JSON.stringify({
    citizenship:'AZ',age:30,familyStatus:'single',dependents:0,budget:1000,monthlyIncome:0,
    expectedSalary:0,hasJobOffer:false,education:'highschool',experience:0,field:'other',englishLevel:0,
    turkish:false,russian:false,goal:'lowest-cost',timeline:'1y',risk:'low',regions:[],remoteWork:false,
  })));
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await page.getByRole('button',{name:'Explore all routes'}).click();
  await page.getByRole('textbox',{name:'Search programs'}).fill('EU Blue Card');
  const card=page.getByRole('button',{name:/EU Blue Card/});
  await expect(card.getByText('Ineligible',{exact:true})).toBeVisible();
  await card.focus();
  await page.keyboard.press('Enter');
  const dialog=page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute('aria-modal','true');
  await expect(dialog.getByText('Ineligible',{exact:true})).toBeVisible();
  for(let i=0;i<6;i++) {
    await page.keyboard.press('Tab');
    expect(await dialog.evaluate(node=>node.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(card).toBeFocused();
  expect(errors).toEqual([]);
});

test('GUI displays the live API catalog and API keeps private tools local',async({page,request})=>{
  const stats=await request.get('/api/v1/stats');
  expect(stats.ok()).toBe(true);
  const {data}=await stats.json();
  const catalog=await request.get('/api/v1/programs?query=EU%20Blue%20Card&limit=1');
  const record=(await catalog.json()).data.items[0];
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toContainText(`${data.programCount} routes`);
  await page.getByRole('button',{name:'Explore all routes'}).click();
  await page.getByRole('textbox',{name:'Search programs'}).fill(record.program);
  await expect(page.getByRole('button',{name:new RegExp(record.program)}).getByText(record.tagline,{exact:true})).toBeVisible();
  const forbidden=await request.post('/api/v1/tools/save_profile',{data:{}});
  expect(forbidden.status()).toBe(404);
});

test('wizard creates and restores a strategy', async ({page}) => {
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  await page.getByRole('button',{name:'Next',exact:true}).click();
  await expect(page.getByRole('spinbutton',{name:'Offered monthly salary'})).toBeVisible();
  await page.getByRole('button',{name:'Next',exact:true}).click();
  await page.getByRole('button',{name:'Generate strategy'}).click();
  await expect(page.getByRole('heading',{name:'Your relocation strategy'})).toBeVisible();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('routewise-profile-v1')));
  expect(saved.version).toBe(2);
  expect(saved.profile.citizenship).toBe('AZ');
  await page.reload();
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  await expect(page.getByRole('heading',{name:'Your relocation strategy'})).toBeVisible();
});
