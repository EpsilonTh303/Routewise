import { test } from 'node:test';
import assert from 'node:assert/strict';
import { compareFinancial, financialEvidenceSchema, financialRequirementSchema } from '../src/lib/financial.ts';

const req = (overrides = {}) => ({kind:'income', amount:5000, currency:'USD', period:'monthly', basis:'gross', ...overrides});
const ev = (overrides = {}) => ({kind:'income', amount:5000, currency:'USD', period:'monthly', basis:'gross', ...overrides});

test('schemas require finite nonnegative amounts and valid ISO currencies', () => {
  assert.equal(financialEvidenceSchema.safeParse(ev({amount:Infinity})).success, false);
  assert.equal(financialEvidenceSchema.safeParse(ev({amount:-1})).success, false);
  assert.equal(financialEvidenceSchema.safeParse(ev({currency:'ZZZ'})).success, false);
  assert.equal(financialRequirementSchema.safeParse(req({minHistoryMonths:-1})).success, false);
  assert.equal(financialEvidenceSchema.safeParse({...ev(), extra:true}).success, false);
  assert.equal(financialEvidenceSchema.safeParse(ev({amount:Number.MAX_SAFE_INTEGER + 1})).success, false);
  assert.equal(financialEvidenceSchema.safeParse(ev({historyMonths:1201})).success, false);
});

test('income is compared with exact basis and explicit annual/monthly conversion', () => {
  assert.equal(compareFinancial(req(), [ev({amount:60000,period:'annual'})]).status, 'met');
  assert.equal(compareFinancial(req(), [ev({amount:59999,period:'annual'})]).status, 'unmet');
  assert.equal(compareFinancial(req(), [ev({basis:'net'})]).status, 'unknown');
  assert.equal(compareFinancial(req({basis:'unspecified'}), [ev({basis:'unspecified'})]).status, 'met');
  assert.equal(compareFinancial(req(), [{kind:'income',amount:5000,currency:'USD',period:'monthly'}]).status, 'unknown');
  assert.equal(compareFinancial(req(), [ev({period:undefined})]).status, 'unknown');
});

test('currency and requested history must match or remain unknown', () => {
  assert.equal(compareFinancial(req(), [ev({currency:'EUR'})]).status, 'unknown');
  const withHistory = req({minHistoryMonths:12});
  assert.equal(compareFinancial(withHistory, [ev({historyMonths:11})]).status, 'unmet');
  assert.equal(compareFinancial(withHistory, [ev()]).status, 'unknown');
});

test('balance, assets, investment, and fees cannot substitute for one another', () => {
  const assetsReq = req({kind:'assets', period:undefined, basis:undefined});
  assert.equal(compareFinancial(assetsReq, [{kind:'investment',amount:100000,currency:'USD'}]).status, 'unknown');
  assert.equal(compareFinancial(assetsReq, [{kind:'balance',amount:100000,currency:'USD'}]).status, 'unknown');
  assert.equal(compareFinancial(req({kind:'fee', period:undefined, basis:undefined}), [{kind:'income',amount:100000,currency:'USD'}]).status, 'unknown');
  assert.equal(financialEvidenceSchema.safeParse({kind:'assets',amount:100,currency:'USD',period:'annual'}).success, false);
  assert.equal(financialEvidenceSchema.safeParse({kind:'fee',amount:100,currency:'USD',basis:'gross'}).success, false);
  assert.equal(compareFinancial(req({kind:'fee',period:'annual',basis:undefined}), [{kind:'fee',amount:100,currency:'USD',period:'monthly'}]).status, 'unknown');
});

test('missing evidence and malformed requirements return unknown', () => {
  assert.equal(compareFinancial(req(), []).status, 'unknown');
  assert.equal(compareFinancial(req({currency:'ZZZ'}), [ev()]).status, 'unknown');
});
