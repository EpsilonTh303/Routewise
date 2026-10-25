import test from 'node:test';
import assert from 'node:assert/strict';
import { SOURCE_FOLLOWUP } from '../src/lib/data/source-followup.ts';
import { CATALOG_SOURCE_AUDIT } from '../src/lib/data/catalog-source-audit.ts';
import { sourceAuditSchema } from '../src/lib/validation.ts';

const item = id => SOURCE_FOLLOWUP.items.find(entry => entry.id === id);
const oldItem = id => CATALOG_SOURCE_AUDIT.items.find(entry => entry.id === id);

test('source follow-up is a distinct immutable batch with valid partial audit payloads', () => {
  assert.equal(SOURCE_FOLLOWUP.id, 'official-source-followup-2026-10-25-v1');
  assert.deepEqual(SOURCE_FOLLOWUP.items.map(entry => entry.id), ['vu-cbi', 'pt-d7']);
  for (const entry of SOURCE_FOLLOWUP.items) {
    assert.match(entry.expectedHash, /^[a-f0-9]{64}$/);
    assert.equal(entry.patch.audit.batchId, SOURCE_FOLLOWUP.id);
    assert.equal(entry.patch.verification, undefined);
    assert.equal(sourceAuditSchema.safeParse(entry.patch.audit).success, true);
  }
  assert.equal(item('pa-friendly'), undefined);
});

test('Vanuatu fee follow-up preserves earlier audit claims and does not imply route availability', () => {
  const next = item('vu-cbi').patch.audit;
  const prior = oldItem('vu-cbi').patch.audit;
  for (const claim of prior.claims) assert.ok(next.claims.some(candidate => candidate.topic === claim.topic && candidate.summary === claim.summary && candidate.sourceUrl === claim.sourceUrl && candidate.checkedAt === claim.checkedAt && candidate.retrieval === claim.retrieval));
  assert.equal(next.routeStatus, 'unclear');
  assert.equal(item('vu-cbi').patch.minBudget, undefined);
  assert.equal(item('vu-cbi').patch.totalYearOneCost, undefined);
  assert.ok(next.claims.some(claim => claim.sourceUrl === 'https://vancitizenship.gov.vu/index.php/citizenship/fees-and-charges' && claim.retrieval === 'page'));
  assert.ok(next.financialRequirements.some(row => row.amount === 130000 && row.currency === 'USD' && row.period === 'one-time'));
  assert.ok(next.financialRequirements.some(row => row.amount === 5000 && row.currency === 'VUV'));
  assert.ok(next.limitations.some(text => /current case quote/.test(text)));
});

test('Portugal follow-up supports the own-income service and dated benchmark without a D7-specific floor', () => {
  const next = item('pt-d7').patch.audit;
  const prior = oldItem('pt-d7').patch.audit;
  for (const claim of prior.claims) assert.ok(next.claims.some(candidate => candidate.topic === claim.topic && candidate.summary === claim.summary && candidate.sourceUrl === claim.sourceUrl && candidate.checkedAt === claim.checkedAt && candidate.retrieval === claim.retrieval));
  assert.equal(next.routeStatus, 'open');
  assert.equal(item('pt-d7').patch.minMonthlyIncome, undefined);
  assert.ok(next.claims.some(claim => claim.sourceUrl.includes('gov.pt/pt/servicos/') && claim.retrieval === 'page'));
  assert.ok(next.claims.some(claim => claim.sourceUrl === 'https://dre.pt/application/conteudo/628798' && claim.summary.includes('12 months')));
  assert.ok(next.financialRequirements.some(row => row.amount === 920 && row.currency === 'EUR' && row.period === 'monthly'));
  assert.ok(next.limitations.some(text => /D7-specific exact net monthly floor/.test(text)));
});
