import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSourceReviewQueue } from '../src/lib/source-freshness.ts';

const route=(id,patch={})=>({id,country:id,program:`Route ${id}`,url:'https://example.org/program',verification:{status:'unverified',checkedAt:null,sourceUrl:'https://example.org'},...patch});
const reviewed=(id,review,verification={status:'unverified',checkedAt:null,sourceUrl:'https://example.org'})=>route(id,{verification,pathway:{review}});
const claim=(overrides={})=>({topic:'Income',summary:'Income threshold is X',sourceUrl:'https://example.org/rule',checkedAt:'2026-10-01T00:00:00.000Z',retrieval:'page',...overrides});
const review=(overrides={})=>({reviewedAt:'2026-10-01T00:00:00.000Z',claims:[claim()],limitations:[],...overrides});

test('queue validates real calendar dates and bounded options',()=>{
  for(const asOf of ['2026-2-01','2026-02-30','not-a-date']) assert.throws(()=>buildSourceReviewQueue([],{asOf}));
  for(const maxAgeDays of [0,3651,1.5]) assert.throws(()=>buildSourceReviewQueue([],{asOf:'2026-10-25',maxAgeDays}));
  for(const limit of [0,101,2.5]) assert.throws(()=>buildSourceReviewQueue([],{asOf:'2026-10-25',limit}));
});

test('queue counts review states, freshness and evidence characteristics without changing records',()=>{
  const inputs=[route('unreviewed'),reviewed('partial',review()),reviewed('verified',review(),{status:'verified',checkedAt:'2026-10-01T00:00:00.000Z',sourceUrl:'https://example.org'}),
    reviewed('old',review({reviewedAt:'2026-01-01T00:00:00.000Z'})),reviewed('indexed',review({claims:[claim({retrieval:'official-index'})]})),
    reviewed('conflict',review({claims:[claim(),claim({summary:'Income requirement is different'})]}))];
  const before=structuredClone(inputs);
  const queue=buildSourceReviewQueue(inputs,{asOf:'2026-10-25',maxAgeDays:90,limit:4});
  assert.deepEqual(queue.counts,{total:6,unreviewed:1,partial:4,verified:1,stale:1,indexOnly:1,conflicts:1});
  assert.deepEqual(queue.items.map(item=>item.id),['conflict','indexed','unreviewed','old']);
  assert.equal(queue.items.length,4);
  assert.deepEqual(inputs,before);
  assert.equal(queue.items[0].status,'partial');
  assert.ok(queue.items[0].reasons.includes('Potential source conflict'));
  assert.match(queue.items[0].reasons.join(' '),/Potential/);
});

test('limitations can flag a conflict and exact age threshold remains fresh',()=>{
  const queue=buildSourceReviewQueue([reviewed('limit-conflict',review({limitations:['Official sources conflict on duration.']})),reviewed('fresh',review({reviewedAt:'2026-07-27T00:00:00.000Z'}))],{asOf:'2026-10-25',maxAgeDays:90});
  assert.equal(queue.counts.conflicts,1);
  assert.equal(queue.counts.stale,0);
  assert.equal(queue.items[0].id,'limit-conflict');
});

test('explicit discrepancy topics lead the queue and unreviewed routes keep an undated program link',()=>{
  const discrepancy=reviewed('ae-golden-property',review({claims:[claim({topic:'Unresolved duration discrepancy',summary:'Official sources report different durations.'})]}));
  const unreviewed=route('no-review');
  const queue=buildSourceReviewQueue([unreviewed,discrepancy],{asOf:'2026-10-25'});
  assert.equal(queue.items[0].id,'ae-golden-property');
  assert.ok(queue.items[0].reasons.includes('Potential source conflict'));
  const noReview=queue.items.find(item=>item.id==='no-review');
  assert.equal(noReview.sources[0].url,unreviewed.verification.sourceUrl);
  assert.equal(noReview.sources[0].checkedAt,null);
  assert.equal(noReview.sources[0].retrieval,'unreviewed');
});
