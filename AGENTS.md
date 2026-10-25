# RouteWise working instructions

## Session entry point

For a new session, read `HANDOFF.md` for the current state and `tasks.md` for the ordered next work. Verify runtime metadata rather than reusing old PIDs. Update both documents when completing a substantive task.

## Purpose and structure

RouteWise explores recorded immigration programs and computes heuristic profile matches. It is not a legal eligibility authority. Preserve explicit unverified-source status and the Azerbaijani calibration limits.

- `prisma/schema.prisma` and `prisma/migrations/`: persistent SQLite schema and reviewed migrations.
- `src/lib/data/`: original import fixture, not the live catalog. Never overwrite database edits implicitly from this fixture.
- `src/lib/scoring.ts`: pure scoring and roadmap functions; do not import database or HTTP code here.
- `src/lib/server/`: database configuration, catalog repository, service, validation, and shared tool definitions.
- `src/app/api/v1/`: stateless JSON query/evaluation API. Do not expose private saved profiles, unrestricted SQL, or database writes here.
- `src/mcp/`: local stdio MCP server. stdout is JSON-RPC only; diagnostics must go to stderr.
- `scripts/`: database setup/import/backup and machine-readable CLI entry points.
- `src/components/atlas/`: GUI, which reads the live database catalog through the API.

## Workflow

Commit each completed, working version or coherent fix after its required checks pass. Use small, descriptive commits and record the validation performed. Do not leave completed implementation work uncommitted. Never stage environment values, private profiles, database files, backups, browser caches or generated runtime artifacts. Stage explicit task files rather than using a blanket `git add .`.

The primary agent owns integration and commits. Research/implementation sub-agents must not stage, commit, amend, reset, clean, rebase or push unless the primary agent explicitly assigns commit ownership for a separate isolated checkout. Shared-workspace Luna agents produce scoped changes and evidence for review; the primary agent reviews, validates and commits the accepted result. A commit is not authorization to push or publish externally.

The owner explicitly authorized publication to EpsilonTh303/Routewise and making that repo public for Pages. The original local history contains private import paths; never push original main, backup refs, --all or --mirror. Read PUBLISHING.md and use scripts/prepare-publication.mjs to create/audit a sanitized publication clone without changing original local history. Future pushes must remain fast-forward and scoped to the approved release.

Use Node 22.18+ and `npm ci`; `package-lock.json` is authoritative. Use the commands in README.md for migration/setup, tests, MCP and CLI examples. Never invoke `db:reset` or pass `--accept-data-loss` as a routine fix. Production startup must not seed, reset, or silently modify schema. Use migrations and take a backup before modifying an existing database.

Keep the database path explicit and stable across working directories and interfaces. Do not put database credentials, profile values, database files, browser caches, or backups in Git. The original tracked `.env` and `db/custom.db` are historical imports; leave their values/history alone unless the user explicitly asks to change them.

For LAN hosting, `npm run start:lan` records its process and selected port in `tmp/lan-server.json`. On Windows, stop the project's own verified LAN process tree before rebuilding because the Prisma DLL may be locked; restart it afterward if it was serving the user. Never stop unrelated listeners. The user requested that Windows Firewall remain unchanged; use read-only checks of existing rules unless they explicitly authorize a new change.

Validate all inputs at shared boundaries. Keep tool outputs bounded, deterministic, and JSON-serializable; return actionable structured errors. New MCP tools must declare read/write and destructive behavior accurately. Saving a profile must be explicit, and deletion must remove associated saved evaluations. Never persist a stateless match request automatically.

## Checks

For service/schema/tool changes run `npm test`, the database/MCP integration suite, `npm run lint`, and `npm run build`. Database integration tests must use isolated temporary databases, not the user's working database. For GUI/API changes run `npm run test:e2e` against the production build after installing its browser once.

Prefer regression tests that exercise actual migrations, repository round trips, protocol calls and API behavior. Do not replace these with mocks of Prisma or hand-written MCP JSON-RPC emulation. Keep the original source verification gap visible in reports. Do not mark a source verified without actual evidence and a review date.

Pathway recipes live in `src/lib/data/pathway-splits.ts`; split receipts preserve branch edits. Read PATHWAYS.md before changing decomposition. Keep unknown figures null and exclude incomplete branches from primary strategies.

Official review batches live in `src/lib/data/reviewed-pathways.ts`; read SOURCE_REVIEW.md. Evidence is claim-specific, native-currency and explicitly partial. Preserve retrieval limitations and do not label a whole route verified from a partial check. Applied batch IDs are immutable: later evidence needs a new guarded batch, not silent mutation/reapplication.

Catalog-wide source audits live in `src/lib/data/catalog-source-audit.ts`, with independent immutable `CatalogAudit` receipts and a nullable `CatalogProgram.audit` JSON field. Read `research/PRIMARY_REVIEW.md` before changing source interpretation. The applied `official-catalog-audit-2026-10-25-v2` is immutable; new evidence needs a new batch. Preserve historical `pathway.review`, dated evidence, lineage and saved results. Unknown intake/conditions must not become primary plans. Study additions live in `study-pilot.ts`, applied by the append-only guarded `add-study-pilot.ts` batch; later source evidence lives in `source-followup.ts`. Read `STUDY_PATHWAYS.md` for the pilot scope and limitations. Never infer qualifying graduation from generic profile education or promise automatic study-to-PR transitions.
