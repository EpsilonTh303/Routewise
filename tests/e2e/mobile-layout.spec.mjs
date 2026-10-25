import { test, expect } from '@playwright/test';

for(const size of [{width:320,height:568},{width:375,height:812},{width:390,height:844},{width:844,height:390}]) {
  test(`phone layout ${size.width}x${size.height} fits landing, wizard, results and drawer`,async({page},info)=>{
    test.skip(info.project.name==='desktop','Phone-only responsive checks');
    await page.setViewportSize(size);
    await page.emulateMedia({reducedMotion:'reduce'});
    const fits=async()=>expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth)).toBeLessThanOrEqual(size.width);
    await page.goto('/');
    await expect(page.getByRole('heading',{level:1})).toContainText('One passport in');
    await fits();
    await page.screenshot({path:info.outputPath('phone-landing.png')});
    for(const name of ['Explore all routes','My strategy']) {
      const box=await page.getByRole('button',{name,exact:true}).boundingBox();
      expect(Math.round(box.height)).toBeGreaterThanOrEqual(44);
    }
    await page.getByRole('button',{name:'My strategy',exact:true}).tap();
    await expect(page.getByRole('button',{name:'Next',exact:true})).toBeVisible();
    await fits();
    await page.getByRole('button',{name:'Next',exact:true}).tap();
    const salary=page.getByRole('spinbutton',{name:'Offered monthly salary'});
    await expect(salary).toBeVisible();
    expect(await salary.evaluate(el=>parseFloat(getComputedStyle(el).fontSize))).toBeGreaterThanOrEqual(16);
    await fits();
    await page.getByRole('button',{name:'Next',exact:true}).tap();
    await page.getByRole('button',{name:'Generate strategy'}).tap();
    await expect(page.getByRole('heading',{name:'Your relocation strategy'})).toBeVisible();
    await fits();
    await page.getByRole('button',{name:'Eligible only',exact:true}).tap();
    await expect(page.getByRole('button',{name:'Eligible only',exact:true})).toHaveAttribute('aria-pressed','true');
    await fits();
    await page.screenshot({path:info.outputPath('phone-results.png')});
    await page.getByRole('button',{name:'Explore all routes',exact:true}).tap();
    await page.getByRole('textbox',{name:'Search programs',exact:true}).fill('EU Blue Card');
    await fits();
    await page.getByRole('button',{name:/EU Blue Card/}).tap();
    const dialog=page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    const bounds=await dialog.boundingBox();
    expect(bounds.width).toBeLessThanOrEqual(size.width);
    expect(bounds.height).toBeLessThanOrEqual(size.height+1);
    const link=dialog.getByRole('link',{name:'Open official program page'});
    await expect(link).toBeVisible();
    const linkBounds=await link.boundingBox();
    expect(linkBounds.y+linkBounds.height).toBeLessThanOrEqual(size.height+1);
    expect(await dialog.locator('[data-radix-scroll-area-viewport]').evaluate(el=>el.clientHeight)).toBeGreaterThan(30);
    await page.screenshot({path:info.outputPath('phone-drawer.png')});
    await dialog.getByRole('button',{name:'Close',exact:true}).tap();
    await expect(dialog).toBeHidden();
  });
}
