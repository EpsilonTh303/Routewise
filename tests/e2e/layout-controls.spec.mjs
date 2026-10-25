import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
const profile=JSON.parse(readFileSync(new URL('../../examples/ai/match.json',import.meta.url),'utf8')).profile;

test('scenario regions use readable touch controls and filters scroll with the page',async({page},info)=>{
  await page.addInitScript(value=>localStorage.setItem('routewise-profile-v1',JSON.stringify(value)),profile);
  await page.goto('/');
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  const regions=page.getByRole('group',{name:'Scenario preferred regions'});
  await regions.getByRole('checkbox',{name:/Western Europe/}).check();
  await regions.getByRole('checkbox',{name:/Asia-Pacific/}).check();
  await expect(regions.getByText('2 selected')).toBeVisible();
  expect(await regions.evaluate(element=>element.scrollWidth<=element.clientWidth)).toBe(true);
  await regions.screenshot({path:info.outputPath('region-picker.png')});
  await regions.getByRole('button',{name:'Clear regions'}).click();
  await expect(regions.getByRole('checkbox',{checked:true})).toHaveCount(0);
  const filters=page.locator('.catalog-filters');
  expect(await filters.evaluate(element=>getComputedStyle(element).position)).toBe('static');
  await page.getByRole('button',{name:'Explore all routes',exact:true}).click();
  const explorerFilters=page.locator('.catalog-filters');
  expect(await explorerFilters.evaluate(element=>getComputedStyle(element).position)).toBe('static');
  await page.evaluate(()=>scrollTo(0,1200));
  expect((await explorerFilters.boundingBox()).y).toBeLessThan(0);
});

test('country evidence is last in the drawer and catalog audit follows the route cards',async({page})=>{
  await page.goto('/');
  await page.getByRole('button',{name:'Explore all routes',exact:true}).click();
  await page.getByRole('textbox',{name:'Search programs'}).fill('EU Blue Card');
  const card=page.getByRole('button',{name:/EU Blue Card/});
  const queue=page.getByText('Source review queue',{exact:false});
  expect(await queue.evaluate((node)=>!!document.querySelector('.catalog-filters')&&(node.compareDocumentPosition(document.querySelector('.catalog-filters'))&Node.DOCUMENT_POSITION_PRECEDING)!==0)).toBe(true);
  await card.click();
  const audit=page.getByRole('dialog').getByRole('region',{name:'Official source review'});
  expect(await audit.evaluate(element=>element===element.parentElement.lastElementChild)).toBe(true);
});
