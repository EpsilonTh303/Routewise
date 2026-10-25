import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';

const sample=JSON.parse(readFileSync(new URL('../../examples/ai/match.json',import.meta.url),'utf8')).profile;

test('Brazil route accepts documented bank funds as an alternative and guards incomplete evidence',async({page,request})=>{
  await page.addInitScript(profile=>localStorage.setItem('routewise-profile-v1',JSON.stringify({...profile,goal:'remote',remoteWork:true})),sample);
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  await page.getByRole('button',{name:'Edit profile'}).click();
  await page.getByRole('button',{name:'Next',exact:true}).click();
  await page.getByRole('button',{name:'Next',exact:true}).click();

  const editor=page.locator('details').filter({has:page.getByText('Optional route evidence')});
  await editor.locator('summary').click();
  await page.getByLabel('Route',{exact:true}).selectOption('br-vitem-xiv-nomad');
  await page.getByLabel(/foreign employer or client contract/i).selectOption('yes');
  await page.getByRole('button',{name:'Add evidence'}).click();
  const amount=page.getByLabel('Financial evidence 1 amount');
  await amount.fill('18000');
  await expect(page.getByRole('button',{name:'Generate strategy'})).toBeDisabled();
  await page.getByLabel('Financial evidence 1 type').selectOption('balance');
  await expect(page.getByRole('button',{name:'Generate strategy'})).toBeEnabled();
  await expect(page.getByText('1 financial evidence item saved for this route.')).toBeVisible();

  await page.getByRole('button',{name:'Generate strategy'}).click();
  await expect(page.getByRole('heading',{name:'Your relocation strategy'})).toBeVisible();
  const envelope=await page.evaluate(()=>JSON.parse(localStorage.getItem('routewise-profile-v1')));
  expect(envelope.version).toBe(2);
  const saved=envelope.profile;
  expect(saved.evidence.routes['br-vitem-xiv-nomad']).toEqual({
    facts:{foreignRemoteContract:true},
    financial:[{kind:'balance',amount:18000,currency:'USD'}],
  });

  const response=await request.post('/api/v1/match',{data:{profile:saved,includeIneligible:true,includeAlternatives:true,limit:100}});
  expect(response.ok()).toBe(true);
  const {data}=await response.json();
  const brazil=data.results.find(result=>result.program.id==='br-vitem-xiv-nomad');
  expect(brazil.explanation.requirements.result.status).toBe('met');
  const noEvidence=await request.post('/api/v1/match',{data:{profile:{...saved,evidence:undefined},includeIneligible:true,includeAlternatives:true,limit:100}});
  expect(noEvidence.ok()).toBe(true);
  const withoutFacts=(await noEvidence.json()).data;
  const unassessedBrazil=withoutFacts.results.find(result=>result.program.id==='br-vitem-xiv-nomad');
  expect(unassessedBrazil.explanation.requirements.result.status).toBe('unknown');
  expect(withoutFacts.plans.some(plan=>plan.result.program.id==='br-vitem-xiv-nomad')).toBe(false);

  await page.getByRole('button',{name:'Explore all routes'}).click();
  await page.getByRole('textbox',{name:'Search programs'}).fill('VITEM XIV');
  await page.getByRole('button',{name:/VITEM XIV/}).click();
  const drawer=page.getByRole('dialog');
  const checks=drawer.getByRole('region',{name:'Structured requirement checks'});
  await expect(checks).toContainText('Recorded Brazil nomad checks');
  await expect(checks).toContainText('met');
});
