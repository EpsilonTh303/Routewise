import test from 'node:test';
import assert from 'node:assert/strict';
import {serverPort} from '../scripts/server-port.mjs';

test('local servers default to 3001 and preserve explicit test/host ports',()=>{
  assert.equal(serverPort(undefined),3001);
  assert.equal(serverPort('3118'),3118);
  for(const value of ['', '0', '1023', '65536', '3001junk', '3e3', '-1']) assert.throws(()=>serverPort(value));
});
