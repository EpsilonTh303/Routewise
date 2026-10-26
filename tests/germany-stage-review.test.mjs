import test from 'node:test';
import assert from 'node:assert/strict';
import {
  germanyStageEvidenceFacts,
  germanyStageReview,
} from '../src/lib/data/germany-stage-review.ts';
import { studyPilotBatchId, studyPilotPrograms } from '../src/lib/data/study-pilot.ts';

test('German work and settlement evidence keys are unique, sourced, and dated', () => {
  assert.equal(germanyStageEvidenceFacts.length, 12);
  assert.equal(new Set(germanyStageEvidenceFacts.map((fact) => fact.key)).size, germanyStageEvidenceFacts.length);
  for (const fact of germanyStageEvidenceFacts) {
    assert.ok(['work', 'settlement'].includes(fact.stage));
    assert.ok(fact.label.length > 0);
    assert.ok(fact.sourceUrl.startsWith('https://www.make-it-in-germany.com/'));
    assert.equal(fact.reviewedAt, '2026-10-26');
    assert.ok(fact.limitations.length > 0);
    assert.ok(Object.isFrozen(fact));
  }

  assert.deepEqual(
    germanyStageEvidenceFacts.filter((fact) => fact.stage === 'work').map((fact) => fact.key),
    ['qualifyingEmployment', 'qualificationRecognised', 'professionalLicenceOrNotRequired', 'authorityApproval'],
  );
  assert.deepEqual(
    germanyStageEvidenceFacts.filter((fact) => fact.stage === 'settlement').map((fact) => fact.key),
    ['germanGraduation', 'qualifyingTitleTwoYears', 'pension24Months', 'permittedEmployment', 'livelihood', 'germanB1', 'civicKnowledge', 'adequateHousing'],
  );
  assert.match(germanyStageEvidenceFacts[0].limitations, /does not require the role to relate/i);
  assert.match(germanyStageEvidenceFacts[3].limitations, /not a universal §18b requirement/i);
});

test('review remains partial self-reported metadata and leaves applied pilot batches untouched', () => {
  assert.ok(Object.isFrozen(germanyStageReview));
  assert.ok(Object.isFrozen(germanyStageReview.limitations));
  assert.equal(germanyStageReview.reviewedAt, '2026-10-26');
  assert.equal(germanyStageReview.reviewStatus, 'partial');
  assert.equal(germanyStageReview.appliesToCatalog, false);
  assert.equal(germanyStageReview.appliedBatchId, null);
  assert.match(germanyStageReview.limitations.join(' '), /authority decision.*manual and unknown/i);

  assert.equal(studyPilotBatchId, 'study-pilot-2026-10-25-v1');
  assert.equal(studyPilotPrograms.length, 4);
  assert.ok(studyPilotPrograms.every((program) => program.audit.batchId === studyPilotBatchId));
  assert.ok(studyPilotPrograms.every((program) => program.audit.status === 'partial'));
});
