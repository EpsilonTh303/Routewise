import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { mkdirSync, mkdtempSync, rmSync } from "node:fs";
import { join, resolve, sep } from "node:path";
import { PrismaClient } from "@prisma/client";
import { projectRoot } from "../../scripts/runtime-config.mjs";
import { CatalogRepository } from "../../src/lib/server/catalog";
import { applyStudyPilot, planStudyPilot, type StudyPilotBatch } from "../../src/lib/server/add-study-pilot";
import type { Program } from "../../src/lib/types";

const exec = promisify(execFile);
const tempParent = resolve(projectRoot, "tmp");
mkdirSync(tempParent, { recursive: true });
const directory = mkdtempSync(join(tempParent, "study-pilot-integration-"));
const url = `file:${join(directory, "study-pilot.sqlite").replaceAll("\\", "/")}`;
const env = { ...process.env, ROUTEWISE_DATABASE_URL: url };
const database = new PrismaClient({ datasourceUrl: url, log: [] });
const repository = new CatalogRepository(database);
const run = (args: string[]) => exec(process.execPath, args, { cwd: projectRoot, env, timeout: 45000, maxBuffer: 8 * 1024 * 1024 });

before(async () => {
  await run(["--import", "tsx", "scripts/database.mts", "setup"]);
  await repository.initializeConnection();
});
after(async () => {
  await database.$disconnect();
  assert.ok(resolve(directory).startsWith(tempParent + sep));
  rmSync(directory, { recursive: true, force: true });
});

const claim = {
  topic: "Study permit and post-study transition",
  summary: "Synthetic integration-test evidence; not a real immigration claim.",
  sourceUrl: "https://example.org/study-pilot-fixture",
  checkedAt: "2026-10-25T12:00:00.000Z",
  retrieval: "page" as const,
};

async function makeProgram(id: string, summary = claim.summary): Promise<Program> {
  const base = await repository.get("de-chancenkarte");
  const { pathway: _pathway, audit: _audit, ...fields } = base.program;
  return {
    ...fields,
    id,
    country: "Pilotland",
    program: `Study pilot ${id}`,
    category: "student",
    url: "https://example.org/study-pilot-route",
    verification: { status: "unverified", checkedAt: null, sourceUrl: "https://example.org/study-pilot-route" },
    audit: {
      batchId: "study-pilot-test-batch",
      status: "partial",
      reviewedAt: claim.checkedAt,
      routeStatus: "open",
      claims: [{ ...claim, summary }],
      financialRequirements: [],
      limitations: ["Synthetic test fixture only."],
      unknownFields: [],
    },
  };
}

async function makeBatch(id: string, recordIds: string[], summary = claim.summary): Promise<StudyPilotBatch> {
  return {
    id,
    programs: await Promise.all(recordIds.map((recordId) => makeProgram(recordId, summary).then((program) => ({
      ...program,
      audit: { ...program.audit!, batchId: id },
    })))),
  };
}

test("plans and atomically appends partial unverified study records with sources and revisions", async () => {
  const batch = await makeBatch("study-pilot-append-fixture", ["study-pilot-alpha", "study-pilot-beta"]);
  assert.deepEqual((await planStudyPilot(repository, batch)).programs.map((item) => item.status), ["pending", "pending"]);

  await database.savedProfile.create({ data: { id: "study-pilot-private-fixture", name: "Private test fixture", profile: { marker: "keep unchanged" } } });
  await database.strategyRun.create({ data: { profileId: "study-pilot-private-fixture", profileVersion: 1, profileSnapshot: { marker: "snapshot" }, catalogVersion: "fixture-version", result: { marker: "result" } } });
  const privateBefore = {
    profiles: await database.savedProfile.findMany({ orderBy: { id: "asc" } }),
    runs: await database.strategyRun.findMany({ orderBy: { id: "asc" } }),
  };
  const receiptCount = await database.catalogAudit.count();
  const result = await applyStudyPilot(repository, batch);
  assert.deepEqual(result, [{ id: "study-pilot-alpha", status: "created" }, { id: "study-pilot-beta", status: "created" }]);
  assert.equal(await database.catalogAudit.count(), receiptCount + 1);

  const saved = await repository.get("study-pilot-alpha");
  assert.equal(saved.active, true);
  assert.equal(saved.program.audit?.batchId, batch.id);
  assert.equal(saved.program.audit?.status, "partial");
  assert.equal(saved.program.verification?.status, "unverified");
  assert.equal(saved.program.pathway, undefined);
  assert.equal(saved.revisions.length, 1);
  const source = saved.sources.find((item) => item.url === claim.sourceUrl);
  assert.ok(source?.evidence?.includes(`${claim.checkedAt}: ${claim.summary}`));
  assert.equal(source?.checkedAt, claim.checkedAt);
  assert.deepEqual({
    profiles: await database.savedProfile.findMany({ orderBy: { id: "asc" } }),
    runs: await database.strategyRun.findMany({ orderBy: { id: "asc" } }),
  }, privateBefore);
  assert.equal((await planStudyPilot(repository, batch)).status, "applied");
});

test("receipt idempotence preserves later edits and changed manifests conflict", async () => {
  const batch = await makeBatch("study-pilot-idempotence-fixture", ["study-pilot-idempotent"]);
  await applyStudyPilot(repository, batch);
  const before = await repository.get("study-pilot-idempotent");
  const later = { ...before.program, tagline: "Independent later edit preserved" };
  await repository.import({
    program: later,
    sources: before.sources.map((source) => ({ url: source.url, ...(source.evidence ? { evidence: source.evidence } : {}), checkedAt: source.checkedAt })),
    expectedHash: before.contentHash,
    reason: "Test later edit",
  });
  assert.deepEqual(await applyStudyPilot(repository, batch), [{ id: "study-pilot-idempotent", status: "unchanged" }]);
  assert.equal((await repository.get("study-pilot-idempotent")).program.tagline, "Independent later edit preserved");

  const changed = await makeBatch(batch.id, ["study-pilot-idempotent"], "Changed immutable manifest fixture.");
  await assert.rejects(() => applyStudyPilot(repository, changed), /different manifest/);
  assert.equal((await repository.get("study-pilot-idempotent")).program.tagline, "Independent later edit preserved");
});

test("append-only batches reject existing catalog IDs and invalid audit/verification data", async () => {
  const collision = await makeBatch("study-pilot-collision-fixture", ["au-subclass-189"]);
  assert.equal((await planStudyPilot(repository, collision)).programs[0].status, "conflict");
  await assert.rejects(() => applyStudyPilot(repository, collision), /already exists/);

  const mismatched = await makeBatch("study-pilot-audit-id-fixture", ["study-pilot-invalid-audit"]);
  mismatched.programs[0].audit!.batchId = "another-batch";
  await assert.rejects(() => planStudyPilot(repository, mismatched), /matching the batch ID/);

  const verified = await makeBatch("study-pilot-verified-fixture", ["study-pilot-invalid-verified"]);
  verified.programs[0].verification = { status: "verified", checkedAt: claim.checkedAt, sourceUrl: claim.sourceUrl };
  await assert.rejects(() => applyStudyPilot(repository, verified), /must remain unverified/);
});

test("a reused receipt ID with a different batch manifest is rejected", async () => {
  const first = await makeBatch("study-pilot-receipt-collision-fixture", ["study-pilot-receipt-alpha"]);
  await applyStudyPilot(repository, first);
  const second = await makeBatch(first.id, ["study-pilot-receipt-beta"]);
  assert.equal((await planStudyPilot(repository, second)).status, "conflict");
  await assert.rejects(() => applyStudyPilot(repository, second), /different manifest/);
  assert.equal(await database.catalogProgram.findUnique({ where: { id: "study-pilot-receipt-beta" } }), null);
});
