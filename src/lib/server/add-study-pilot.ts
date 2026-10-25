import { programSchema, idSchema } from "../validation";
import type { Program, SourceClaim } from "../types";
import { CatalogRepository, hashValue, jsonValue } from "./catalog";
import { ServiceError } from "./errors";

/** Immutable append-only catalog addition batch. Each record must carry its own partial audit. */
export interface StudyPilotBatch {
  id: string;
  programs: Program[];
}

type AdditionStatus = "missing" | "conflict" | "pending" | "applied";
const MAX_BATCH_PROGRAMS = 100;

function validateBatch(batch: StudyPilotBatch): Program[] {
  if (!batch || !idSchema.safeParse(batch.id).success || !Array.isArray(batch.programs) ||
      batch.programs.length < 1 || batch.programs.length > MAX_BATCH_PROGRAMS) {
    throw new ServiceError("INVALID_INPUT", `Study pilot batch needs a slug ID and between 1 and ${MAX_BATCH_PROGRAMS} programs.`);
  }
  const normalized = batch.programs.map((raw) => {
    const program = programSchema.parse({
      ...raw,
      languageBonus: raw.languageBonus ?? [],
      dvLottery: raw.dvLottery ?? false,
      e2Treaty: raw.e2Treaty ?? false,
      verification: raw.verification ?? { status: "unverified", checkedAt: null, sourceUrl: raw.url },
    });
    if (program.pathway) throw new ServiceError("INVALID_INPUT", "Append-only study additions cannot introduce pathway lineage.");
    if (program.verification?.status !== "unverified") throw new ServiceError("INVALID_INPUT", "New catalog additions must remain unverified.");
    if (!program.audit || program.audit.status !== "partial" || program.audit.batchId !== batch.id || program.audit.claims.length === 0) {
      throw new ServiceError("INVALID_INPUT", "Each new program needs non-empty partial audit evidence matching the batch ID.");
    }
    return program;
  });
  if (new Set(normalized.map((program) => program.id)).size !== normalized.length) {
    throw new ServiceError("INVALID_INPUT", "Duplicate program IDs are not allowed in a study pilot batch.");
  }
  return normalized;
}

function sourceRows(program: Program) {
  const audit = program.audit!;
  const byUrl = new Map<string, { url: string; title?: string; evidence: string[]; checkedAt: string | null }>();
  const ensure = (url: string) => {
    let row = byUrl.get(url);
    if (!row) {
      row = { url, evidence: [], checkedAt: null };
      byUrl.set(url, row);
    }
    return row;
  };
  ensure(program.url);
  ensure(program.verification!.sourceUrl);
  for (const claim of audit.claims as SourceClaim[]) {
    const row = ensure(claim.sourceUrl);
    row.title ??= "Official source — claim-specific catalog addition";
    const line = `${claim.checkedAt}: ${claim.summary}`;
    const retrieval = `Retrieval: ${claim.retrieval}. ${line}`;
    if (!row.evidence.includes(retrieval)) row.evidence.push(retrieval);
    if (!row.checkedAt || Date.parse(claim.checkedAt) > Date.parse(row.checkedAt)) row.checkedAt = claim.checkedAt;
  }
  return [...byUrl.values()].sort((a, b) => a.url.localeCompare(b.url)).map((row) => ({
    url: row.url,
    ...(row.title ? { title: row.title } : {}),
    ...(row.evidence.length ? { evidence: row.evidence.join("\n") } : {}),
    checkedAt: row.checkedAt,
  }));
}

function manifestHash(batch: StudyPilotBatch) {
  return hashValue(batch);
}

/** Plans an append-only batch without changing catalog records or receipts. */
export async function planStudyPilot(repository: CatalogRepository, batch: StudyPilotBatch) {
  await repository.initializeConnection();
  const programs = validateBatch(batch);
  const hash = manifestHash(batch);
  const [receipt, ...rows] = await Promise.all([
    repository.database.catalogAudit.findUnique({ where: { id: batch.id }, select: { id: true, manifestHash: true, recordIds: true } }),
    ...programs.map((program) => repository.database.catalogProgram.findUnique({ where: { id: program.id }, select: { id: true } })),
  ]);
  const receiptMatches = receipt?.manifestHash === hash &&
    JSON.stringify(receipt.recordIds) === JSON.stringify(programs.map((program) => program.id));
  const status: AdditionStatus = receipt ? (receiptMatches ? "applied" : "conflict") :
    rows.some(Boolean) ? "conflict" : "pending";
  return {
    id: batch.id,
    status,
    programs: programs.map((program) => ({ id: program.id, status: status === "applied" ? "applied" : rows[programs.indexOf(program)] ? "conflict" : status })),
  };
}

/** Atomically creates new records, source rows, revision snapshots, and the immutable receipt. */
export async function applyStudyPilot(repository: CatalogRepository, batch: StudyPilotBatch) {
  await repository.initializeConnection();
  const programs = validateBatch(batch);
  const hash = manifestHash(batch);
  const recordIds = programs.map((program) => program.id);
  return repository.database.$transaction(async (tx) => {
    const existingReceipt = await tx.catalogAudit.findUnique({ where: { id: batch.id }, select: { id: true, manifestHash: true, recordIds: true } });
    if (existingReceipt) {
      const sameIds = JSON.stringify(existingReceipt.recordIds) === JSON.stringify(recordIds);
      if (existingReceipt.manifestHash !== hash || !sameIds) {
        throw new ServiceError("CONFLICT", "This catalog-addition batch ID was already applied with a different manifest.", 409);
      }
      return recordIds.map((id) => ({ id, status: "unchanged" as const }));
    }

    for (const program of programs) {
      if (await tx.catalogProgram.findUnique({ where: { id: program.id }, select: { id: true } })) {
        throw new ServiceError("CONFLICT", `Catalog addition ID ${program.id} already exists; append-only batches cannot update existing records.`, 409);
      }
      const sources = sourceRows(program);
      // Reuse the repository's canonical persistence mapping and revision snapshot convention.
      await repository.importInTransaction(tx, {
        program,
        sources,
        active: true,
        reason: `${batch.id}: append-only study pathway addition; partial evidence retained and route remains unverified`,
      });
    }
    await tx.catalogAudit.create({ data: { id: batch.id, manifestHash: hash, recordIds: jsonValue(recordIds) } });
    return recordIds.map((id) => ({ id, status: "created" as const }));
  }, { maxWait: 10000, timeout: 60000 });
}
