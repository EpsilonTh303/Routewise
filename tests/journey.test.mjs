import test from 'node:test';
import assert from 'node:assert/strict';
import {journeySchema,validateJourney} from '../src/lib/journey.ts';
import {germanyStudyJourney} from '../src/lib/data/germany-study-journey.ts';
import {studyPilotPrograms} from '../src/lib/data/study-pilot.ts';
import {ALL_PROGRAMS} from '../src/lib/data/index.ts';
import {programSchema} from '../src/lib/validation.ts';

const clone=()=>structuredClone(germanyStudyJourney);
const conditions=journey=>journey.stages.flatMap(stage=>[...stage.conditions,...stage.transitions.flatMap(edge=>edge.conditions)]);

test('German journey round trips as JSON with four distinct stages and existing catalog links',()=>{
  const json=JSON.parse(JSON.stringify(germanyStudyJourney));
  assert.deepEqual(validateJourney(json,studyPilotPrograms),germanyStudyJourney);
  assert.deepEqual(json.stages.map(stage=>stage.kind),['masters','graduate-job-search','work-permit','permanent-residence']);
  assert.deepEqual(json.stages.map(stage=>stage.programIds),[['de-masters-study'],['de-graduate-jobsearch'],[],[]]);
  assert.deepEqual(json.stages.at(-1).transitions,[]);
});

test('job offer branches have distinct targets and remain conditional applications',()=>{
  const journey=validateJourney(clone(),studyPilotPrograms);
  const masters=journey.stages[0];
  assert.deepEqual(masters.transitions.filter(edge=>edge.jobOffer==='absent').map(edge=>edge.to),['graduate-job-search']);
  assert.deepEqual(masters.transitions.filter(edge=>edge.jobOffer==='present').map(edge=>edge.to),['work-permit']);
  assert.equal(journey.stages[1].transitions[0].jobOffer,'present');
  assert.equal(journey.stages[2].transitions[0].jobOffer,'any');
  for(const stage of journey.stages) for(const edge of stage.transitions){
    assert.ok(edge.conditions.length>0);
    assert.ok(edge.conditions.every(condition=>condition.evidence.some(item=>item.kind==='manual')));
  }
});

test('every condition refers to recorded dated evidence and existing applicant fact keys',()=>{
  for(const condition of conditions(validateJourney(clone(),studyPilotPrograms))){
    const program=studyPilotPrograms.find(program=>program.id===condition.source.programId);
    const claim=program.audit.claims.find(claim=>claim.topic===condition.source.claimTopic);
    assert.ok(claim.sourceUrl.startsWith('https://'));
    assert.ok(claim.checkedAt);
    assert.equal(program.audit.status,'partial');
    assert.equal(program.verification.status,'unverified');
    for(const evidence of condition.evidence) if(evidence.kind==='fact'){
      assert.ok(studyPilotPrograms.some(program=>program.id===evidence.programId));
    }
  }
});

test('sidecar validation leaves legacy Program records and pilot manifests untouched',()=>{
  const programs=[...ALL_PROGRAMS,...studyPilotPrograms];
  const before=JSON.stringify(programs);
  for(const program of programs) assert.deepEqual(programSchema.parse(program),program);
  validateJourney(germanyStudyJourney,programs);
  assert.equal(JSON.stringify(programs),before);
  assert.ok(programs.every(program=>!Object.hasOwn(program,'journey')));
});

test('graph rejects broken entries, targets, duplicate IDs, unreachable stages and cycles',()=>{
  const edits=[
    journey=>{journey.entryStageId='missing';},
    journey=>{journey.stages[0].transitions[0].to='missing';},
    journey=>{journey.stages[1].id='masters';},
    journey=>{journey.stages[0].transitions[0].to='masters';},
    journey=>{journey.stages[0].transitions=journey.stages[0].transitions.filter(edge=>edge.jobOffer!=='absent');},
    journey=>{journey.stages[3].transitions=[{to:'masters',jobOffer:'any',conditions:journey.stages[3].conditions}];},
    journey=>{journey.stages[0].conditions.push(structuredClone(journey.stages[0].conditions[0]));},
  ];
  for(const edit of edits){const journey=clone();edit(journey);assert.equal(journeySchema.safeParse(journey).success,false);}
});

test('conditions and transitions require explicit, bounded and known evidence shapes',()=>{
  const edits=[
    journey=>{journey.version=2;},
    journey=>{journey.stages[0].transitions[0].jobOffer='maybe';},
    journey=>{journey.stages[0].transitions[0].conditions=[];},
    journey=>{journey.stages[0].conditions=[];},
    journey=>{journey.stages[0].conditions[0].evidence=[];},
    journey=>{journey.stages[0].conditions[0].evidence[0].fact='unreviewed-fact';},
    journey=>{journey.stages[0].automaticApproval=true;},
  ];
  for(const edit of edits){const journey=clone();edit(journey);assert.equal(journeySchema.safeParse(journey).success,false);}
});

test('catalog validation rejects missing, stale or ambiguous claim references and evidence routes',()=>{
  for(const edit of [
    journey=>{journey.stages[0].programIds=['unknown-program'];},
    journey=>{journey.stages[0].conditions[0].source.programId='unknown-program';},
    journey=>{journey.stages[0].conditions[0].source.auditBatchId='other-batch';},
    journey=>{journey.stages[0].conditions[0].source.claimTopic='Unrecorded condition';},
    journey=>{journey.stages[0].conditions[0].evidence[0].programId='unknown-program';},
  ]){const journey=clone();edit(journey);assert.throws(()=>validateJourney(journey,studyPilotPrograms));}
  const ambiguous=structuredClone(studyPilotPrograms);
  ambiguous[0].audit.claims.push(structuredClone(ambiguous[0].audit.claims[0]));
  assert.throws(()=>validateJourney(clone(),ambiguous),/ambiguous journey claim/);
  assert.throws(()=>validateJourney(clone(),[...studyPilotPrograms,studyPilotPrograms[0]]),/unique/);
});
