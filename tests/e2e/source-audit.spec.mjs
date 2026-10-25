import {test,expect} from '@playwright/test';

test('catalog source audit exposes partial coverage and closed intake honestly',async({page,request})=>{
  const stats=(await (await request.get('/api/v1/stats')).json()).data;
  expect(stats.auditedCount).toBe(75);
  expect(stats.partiallyReviewedCount).toBe(74);
  expect(stats.unresolvedAuditCount).toBe(1);
  expect(stats.verifiedCount).toBe(0);
  expect(stats.closedIntakeCount).toBe(1);
  await page.goto('/');
  await page.getByRole('button',{name:'Explore all routes',exact:true}).click();
  await page.getByText('Source review queue',{exact:false}).click();
  await expect(page.getByText('Read-only source tracking.',{exact:false})).toBeVisible();
  await page.getByRole('textbox',{name:'Search programs'}).fill('Start-Up Visa');
  const card=page.getByRole('button',{name:/Start-Up Visa/});
  await expect(card.getByText('Ineligible',{exact:true})).toBeVisible();
  await card.click();
  const dialog=page.getByRole('dialog');
  await expect(dialog).toContainText('closed or paused to new applications');
  const evidence=dialog.getByRole('region',{name:'Official source review'});
  await expect(evidence).toContainText('Intake status in reviewed sources: closed');
  await expect(evidence).toContainText('June 30, 2026');
  await expect(evidence.getByRole('link')).toHaveAttribute('href',/canada\.ca/);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
