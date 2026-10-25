import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {scoreProgram} from '../src/lib/scoring.ts';
import {studyPilotPrograms} from '../src/lib/data/study-pilot.ts';
import {profileSchema} from '../src/lib/validation.ts';
const profile=JSON.parse(readFileSync(new URL('../examples/ai/match.json',import.meta.url),'utf8')).profile;
const program=studyPilotPrograms[0];
test('legacy profiles remain valid and German is a strictly optional boolean',()=>{
  assert.ok(profileSchema.safeParse(profile).success);
  assert.ok(profileSchema.safeParse({...profile,german:true}).success);
  assert.equal(profileSchema.safeParse({...profile,german:'yes'}).success,false);
});
test('useful German skills improve fit for AZ and other citizenships without changing legal checks',()=>{
  for(const citizenship of ['AZ','GB']){
    const base={...profile,citizenship,goal:'study',german:false};
    const before=scoreProgram(program,base),after=scoreProgram(program,{...base,german:true});
    assert.ok(after.breakdown.fit>before.breakdown.fit);
    assert.ok(after.matchPct>before.matchPct);
    assert.equal(after.breakdown.access,before.breakdown.access);
    assert.equal(after.explanation.requirements.result.status,before.explanation.requirements.result.status);
    assert.ok(after.explanation.strengths.some(s=>s.includes('language skills')));
  }
});
test('German does not add a language bonus to unrelated route languages',()=>{
  const unrelated={...program,languageBonus:['Spanish']};
  assert.equal(scoreProgram(unrelated,{...profile,german:true}).matchPct,scoreProgram(unrelated,{...profile,german:false}).matchPct);
});
