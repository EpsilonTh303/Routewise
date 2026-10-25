import { test, expect } from '@playwright/test';

test('what-if comparison evaluates temporary changes without changing the saved profile',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('routewise-profile-v1',JSON.stringify({
    citizenship:'AZ',age:30,familyStatus:'single',dependents:0,budget:50000,monthlyIncome:3000,
    expectedSalary:0,hasJobOffer:false,education:'bachelor',experience:5,field:'it',englishLevel:2,
    turkish:false,russian:true,goal:'citizenship',timeline:'1y',risk:'medium',regions:[],remoteWork:false,
  })));
  await page.goto('/');
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  await expect(page.getByRole('heading',{name:'What if?'})).toBeVisible();
  const before=await page.evaluate(()=>localStorage.getItem('routewise-profile-v1'));
  await page.getByRole('spinbutton',{name:'Scenario available savings'}).fill('100000');
  await page.getByRole('spinbutton',{name:'Scenario dependents'}).fill('1');
  await page.getByRole('checkbox',{name:'I have a job offer'}).check();
  await page.getByRole('button',{name:'Evaluate scenario'}).click();
  await expect(page.getByRole('region',{name:'Current profile'})).toBeVisible();
  await expect(page.getByRole('region',{name:'Hypothetical scenario'})).toBeVisible();
  await expect(page.getByRole('note')).toContainText('never saved');
  expect(await page.evaluate(()=>localStorage.getItem('routewise-profile-v1'))).toBe(before);
  await page.getByRole('button',{name:'Reset'}).click();
  await expect(page.getByRole('region',{name:'Hypothetical scenario'})).toHaveCount(0);
  expect(await page.evaluate(()=>localStorage.getItem('routewise-profile-v1'))).toBe(before);
});

test('invalid numeric scenario edit is blocked without crashing the comparison UI',async({page})=>{
  await page.addInitScript(()=>localStorage.setItem('routewise-profile-v1',JSON.stringify({
    citizenship:'AZ',age:30,familyStatus:'single',dependents:0,budget:50000,monthlyIncome:3000,
    expectedSalary:0,hasJobOffer:false,education:'bachelor',experience:5,field:'it',englishLevel:2,
    turkish:false,russian:true,goal:'citizenship',timeline:'1y',risk:'medium',regions:['Western Europe','Nordics & Baltics'],remoteWork:false,
  })));
  await page.goto('/');
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  await page.getByRole('spinbutton',{name:'Scenario available savings'}).fill('');
  await page.getByRole('button',{name:'Evaluate scenario'}).click();
  await expect(page.getByRole('heading',{name:'What if?'})).toBeVisible();
  await expect(page.getByRole('region',{name:'Current profile'})).toHaveCount(0);
  const selected=await page.getByRole('listbox',{name:'Scenario preferred regions'}).locator('option:checked').allTextContents();
  expect(selected).toEqual(['Western Europe','Nordics & Baltics']);
});
