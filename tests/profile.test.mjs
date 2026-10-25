import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseSavedProfile, isProfile } from '../src/lib/profile.ts';

const valid = { citizenship:'AZ', age:30, familyStatus:'single', dependents:0,
  budget:50000, monthlyIncome:3000, expectedSalary:0, hasJobOffer:false,
  education:'bachelor', experience:5, field:'it', englishLevel:2, turkish:false,
  russian:true, goal:'citizenship', timeline:'1y', risk:'medium', regions:[], remoteWork:false };

test('saved profiles round trip without changing preferences', () => {
  assert.deepEqual(parseSavedProfile(JSON.stringify(valid)), valid);
});

test('missing, corrupt, partial, and incompatible storage is discarded', () => {
  for (const raw of [null, '', '{', '{}', 'null', '[]', 'true', JSON.stringify({...valid,regions:null}), JSON.stringify({...valid,goal:'unknown'})]) {
    assert.equal(parseSavedProfile(raw),null,String(raw));
  }
});

test('invalid numbers, flags, and regions never reach scoring', () => {
  for (const patch of [{budget:-1},{monthlyIncome:Infinity},{age:NaN},{age:30.5},
    {englishLevel:4},{hasJobOffer:'yes'},{regions:['unknown']},{regions:['toString']},
    {citizenship:'unknown'},{experience:-1},{dependents:-2}]) {
    assert.equal(isProfile({...valid,...patch}),false,JSON.stringify(patch));
  }
});
