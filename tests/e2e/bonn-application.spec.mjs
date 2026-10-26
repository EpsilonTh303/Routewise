import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';

const sample=JSON.parse(readFileSync(new URL('../../examples/ai/match.json',import.meta.url),'utf8')).profile;

async function openApplicationCheck(page,profile) {
  await page.addInitScript(value=>localStorage.setItem('routewise-profile-v1',JSON.stringify(value)),profile);
  await page.goto('/');
  await page.getByRole('button',{name:'My strategy',exact:true}).click();
  const plan=page.getByRole('region',{name:'Germany study plan'});
  const academic=plan.locator(':scope > details').filter({hasText:/Programme-specific academic requirements/});
  await academic.locator(':scope > summary').click();
  const application=academic.locator(':scope > div > details').filter({hasText:/Summer 2027 application window and document inventory/});
  await application.locator(':scope > summary').click();
  return {plan,academic,application};
}

test('Bonn application dates and EEA factors stay conditional and official group unknown',async({page},testInfo)=>{
  const profile={...sample,goal:'study',education:'phd',englishLevel:3,citizenship:'AZ',evidence:{routes:{'de-masters-study':{facts:{studyAdmission:true,programmeLanguage:true}}}}};
  const {application}=await openApplicationCheck(page,profile);
  const storageBefore=await page.evaluate(()=>localStorage.getItem('routewise-profile-v1'));
  const windows=application.getByRole('region',{name:'Bonn application windows'});
  const groups=application.getByRole('region',{name:'Reported applicant-group factors'});
  await expect(groups.getByText(/Official group: Unknown/i)).toBeVisible();
  await expect(groups.getByText(/Candidate group: Unknown/i)).toBeVisible();
  await application.screenshot({path:testInfo.outputPath('bonn-application.png')});

  await application.getByLabel('Reported application date').fill('2026-11-01');
  await expect(windows.getByText(/Boundary date · exact cut-off time and inclusion unknown/i)).toBeVisible();
  await expect(application.getByText(/indexed result; direct page retrieval failed/i).first()).toBeVisible();
  await application.getByLabel('Reported application date').fill('2026-11-20');
  await expect(windows.getByText(/Reported date outside the published date range/i).first()).toBeVisible();

  await application.getByLabel('Reported application date').fill('2026-12-20');
  await expect(windows.getByText(/Date in range · applicant group unknown/i)).toBeVisible();
  await application.getByLabel(/Applicant reports EEA citizenship/).selectOption('no');
  await application.getByLabel(/Applicant reports a Bachelor’s or Master’s degree at an EEA university/).selectOption('no');
  await application.getByLabel(/Applicant reports a possible qualifying family-member basis/).selectOption('no');
  await application.getByLabel(/Applicant reports other EEA-equivalent selection evidence/).selectOption('no');
  const secondWindow=windows.locator('div.rounded-lg').filter({hasText:'Second period · EEA students only'});
  await expect(groups.getByText(/Candidate group: Non-EEA reported/i)).toBeVisible();
  await expect(secondWindow.getByText(/Date in range · reported factors do not indicate an EEA basis; official group remains unknown/i)).toBeVisible();

  await application.getByLabel(/Applicant reports a possible qualifying family-member basis/).selectOption('yes');
  await expect(groups.getByText(/Candidate group: Unknown/i)).toBeVisible();
  await application.getByLabel(/Applicant reports a Bachelor’s or Master’s degree at an EEA university/).selectOption('yes');
  await expect(groups.getByText(/Candidate group: EEA reported/i)).toBeVisible();
  await expect(groups.getByText(/Official group: Unknown/i)).toBeVisible();
  await expect(windows.getByText(/Date in published range · eligibility and deadline remain unconfirmed/i)).toBeVisible();
  await application.getByLabel('Reported application date').fill('2027-01-15');
  await expect(windows.getByText(/Boundary date · exact cut-off time and inclusion unknown/i).last()).toBeVisible();

  const storageAfter=await page.evaluate(()=>localStorage.getItem('routewise-profile-v1'));
  expect(storageAfter).toBe(storageBefore);
});

test('Bonn document branches and reported inventory never imply verified completeness',async({page})=>{
  const profile={...sample,goal:'study',education:'phd',englishLevel:3};
  const {application}=await openApplicationCheck(page,profile);
  const storageBefore=await page.evaluate(()=>localStorage.getItem('routewise-profile-v1'));
  await application.getByRole('combobox',{name:'Degree document branch',exact:true}).selectOption('final-pending');
  await application.getByLabel('Provisional certificate is issued by the examination office or responsible authority').selectOption('yes');
  await application.getByLabel('Provisional certificate states every degree requirement is fulfilled').selectOption('yes');
  await application.getByRole('combobox',{name:'Degree document branch',exact:true}).selectOption('expected-completion');
  await application.getByLabel('Expected-completion proof is issued by the examination office or responsible authority').selectOption('yes');
  await application.getByLabel('Remaining exams total at most half a full-time study year').selectOption('yes');
  await application.getByLabel('Remaining exams, including thesis, can be completed before semester start').selectOption('yes');
  await application.getByLabel('Expected thesis ECTS are stated if absent from the transcript').selectOption('yes');

  await application.getByLabel('Was previous education completed in China, India, or Vietnam?').selectOption('no');
  await application.getByLabel('Does any application document require translation under Bonn’s language rules?').selectOption('yes');
  await application.getByLabel('Were both secondary and Bachelor’s education completed outside Europe?').selectOption('no');
  await application.getByLabel('Is the thesis in a language other than English, French, or German?').selectOption('yes');

  const inventory=application.getByRole('region',{name:'Reported document inventory'});
  const conditional=inventory.locator(':scope > details').filter({hasText:/conditional documents/});
  await conditional.locator(':scope > summary').click();
  await conditional.getByLabel('Official provisional degree certificate reported presence').selectOption('present');
  await conditional.getByLabel('Official proof of expected completion date reported presence').selectOption('present');
  await conditional.getByLabel('APS Certificate of Authenticity reported presence').selectOption('absent');
  await conditional.getByLabel('Certified translation where required reported presence').selectOption('absent');
  await expect(conditional.getByText(/Reported-context applicability: yes · Official applicability: unknown · Reported presence: reported-present · Verification: unknown/i)).toBeVisible();
  await expect(conditional.getByLabel('Official provisional degree certificate reported presence')).toHaveValue('present');
  await expect(conditional.getByText(/Official applicability: unknown.*reported-absent/i).first()).toBeVisible();

  const required=inventory.locator(':scope > details').filter({hasText:/required documents/});
  await required.locator(':scope > summary').click();
  for(const label of ['Current transcripts for all degree programmes','Curriculum vitae',"Bachelor's thesis in its original language",'Motivation letter in the online form']) {
    await required.getByLabel(`${label} reported presence`).selectOption('present');
  }
  const result=application.getByRole('region',{name:'Application checklist result'});
  await expect(result.getByText(/Application completeness: not assessed/i)).toBeVisible();
  await expect(result.getByText(/Official group: unknown/i)).toBeVisible();
  await expect(application.getByText(/Applicant reports this item is present; authenticity, sufficiency, language and Bonn acceptance remain unverified/i).first()).toBeVisible();
  await expect(application.getByRole('checkbox')).toHaveCount(0);

  const after=await page.evaluate(()=>localStorage.getItem('routewise-profile-v1'));
  expect(after).toBe(storageBefore);
  expect(JSON.parse(after).profile??JSON.parse(after)).toEqual(profile);
});
