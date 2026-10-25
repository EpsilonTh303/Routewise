import {test} from 'node:test';
import assert from 'node:assert/strict';
import {parseBrowserProfile,serializeBrowserProfile,persistBrowserProfile,BROWSER_PROFILE_KEY} from '../src/lib/browser-profile.ts';
import {EMPTY_PERSONA} from '../src/lib/persona.ts';
const profile={citizenship:'AZ',age:30,familyStatus:'single',dependents:0,budget:50000,monthlyIncome:3000,expectedSalary:0,hasJobOffer:false,education:'bachelor',experience:5,field:'it',englishLevel:2,turkish:false,russian:true,goal:'citizenship',timeline:'1y',risk:'medium',regions:[],remoteWork:false};

test('browser profile migrates legacy and v2 inputs without losing preferences',()=>{
  for(const raw of [JSON.stringify(profile),JSON.stringify({version:2,profile})]) assert.deepEqual(parseBrowserProfile(raw),{profile,persona:EMPTY_PERSONA});
});
test('identity and photo round trip separately from strict assessment facts',()=>{
  const persona={...EMPTY_PERSONA,displayName:'Test person',photo:'data:image/jpeg;base64,/9j/AA=='};
  const raw=serializeBrowserProfile(profile,persona);
  assert.deepEqual(parseBrowserProfile(raw),{profile,persona});
  const envelope=JSON.parse(raw);
  assert.equal(envelope.version,3);assert.equal(Object.hasOwn(envelope.profile,'photo'),false);
  const invalidIdentity=JSON.stringify({version:3,profile,persona:{...persona,photo:'https://example.org/tracking.png'}});
  assert.deepEqual(parseBrowserProfile(invalidIdentity),{profile,persona:{...persona,photo:null}});
});
test('saving uses one atomic write and surfaces quota failures without erasing the old profile',()=>{
  let saved=JSON.stringify({version:2,profile}),writes=0;
  const storage={setItem(key,value){assert.equal(key,BROWSER_PROFILE_KEY);writes++;saved=value;}};
  persistBrowserProfile(storage,profile,EMPTY_PERSONA);assert.equal(writes,1);
  const before=saved;
  assert.throws(()=>persistBrowserProfile({setItem(){throw new Error('quota');}},profile,EMPTY_PERSONA),/previous saved profile is unchanged/);
  assert.equal(saved,before);
});
