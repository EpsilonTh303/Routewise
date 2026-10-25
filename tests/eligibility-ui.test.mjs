import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ProgramCard } from '../src/components/atlas/ProgramCard.tsx';
import { ALL_PROGRAMS } from '../src/lib/data/index.ts';

const labels = {eligible:'Eligible',conditional:'Conditional',ineligible:'Ineligible'};
for (const [status,label] of Object.entries(labels)) {
  test(`program card renders ${status} without substituting another eligibility state`, () => {
    const result = {program:ALL_PROGRAMS[0],matchPct:60,eligibility:status,
      gateIssues:status==='eligible'?[]:['Employer sponsorship required'],adjustedCost:20000,
      breakdown:{cost:60,speed:60,citizenship:60,qol:60,access:60,fit:60}};
    const html = renderToStaticMarkup(createElement(ProgramCard,{result,onOpen:()=>{}}));
    assert.ok(html.includes(`>${label}</span>`));
    for (const other of Object.values(labels).filter(l=>l!==label)) assert.ok(!html.includes(`>${other}</span>`));
    if(status!=='eligible') assert.ok(html.includes('Employer sponsorship required'));
  });
}
