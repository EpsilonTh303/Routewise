import test from "node:test";
import assert from "node:assert/strict";
import { studyPilotPrograms, studyPilotBatchId } from "../src/lib/data/study-pilot.ts";
import { programSchema } from "../src/lib/validation.ts";

const expectedIds = [
  "de-masters-study",
  "de-graduate-jobsearch",
  "nl-graduate-orientation-year",
  "fi-graduate-jobsearch",
];

test("study pilot contains four complete schema-valid partial records", () => {
  assert.equal(studyPilotBatchId, "study-pilot-2026-10-25-v1");
  assert.deepEqual(studyPilotPrograms.map((program) => program.id).sort(), [...expectedIds].sort());
  for (const program of studyPilotPrograms) {
    assert.deepEqual(programSchema.safeParse(program).success, true, `${program.id} must satisfy Program schema`);
    assert.equal(program.verification?.status, "unverified");
    assert.equal(program.audit?.status, "partial");
    assert.equal(program.audit?.batchId, studyPilotBatchId);
    assert.ok(program.audit?.claims.length >= 3, `${program.id} needs cited claims`);
    assert.ok(program.requirements.length >= 5);
    assert.ok(program.pros.length >= 1);
    assert.ok(program.cons.length >= 2);
    assert.ok(program.url.startsWith("https://"));
  }
});

test("pilot keeps unsupported cost and timeline values null and never invents USD totals", () => {
  for (const program of studyPilotPrograms) {
    for (const field of ["minBudget", "minMonthlyIncome", "totalYearOneCost", "costPerDependent", "processingWeeks", "yearsToPR", "yearsToCitizenship"]) {
      assert.equal(program[field], null, `${program.id}.${field} must remain unknown`);
    }
    assert.ok(program.audit.unknownFields.includes("totalYearOneCost"));
    assert.ok(program.audit.unknownFields.includes("yearsToPR"));
    for (const amount of program.audit.financialRequirements) {
      assert.equal(amount.currency, "EUR", "only sourced native EUR values are recorded in this pilot");
      assert.doesNotMatch(amount.description, /(?:USD|\$)\s?\d/i);
    }
    assert.doesNotMatch(JSON.stringify(program.audit.financialRequirements), /USD|\$\s?\d/);
  }
});

test("requirements describe conditional handoffs and do not promise automatic permanent residence", () => {
  for (const program of studyPilotPrograms) {
    const allText = [...program.requirements, ...program.pros, ...program.cons, ...program.audit.limitations].join(" ").toLowerCase();
    assert.match(allText, /separate|apply separately|conditional/);
    assert.match(allText, /not automatic|does not guarantee|not a legal eligibility decision/);
    assert.doesNotMatch(allText, /automatic(?:ally)? (?:get|receive|be granted) permanent residence/);
    assert.match(allText, /citizenship/);
  }
});
