# RouteWise clean-session handoff

Updated 2026-10-25 after the engine 3.3.0 implementation. Read AGENTS.md, tasks.md, ELIGIBILITY.md, FINANCIAL.md, SOURCE_REVIEW.md and RECOVERY.md.

## Current application

- Package root is this project directory. Windows PowerShell; Node 22.18+; npm/package-lock.json is authoritative. Current host Node is 25.2.1.
- Engine version is 3.3.0; requirement snapshot is requirements-2026-10-25-v1.
- Live catalog is unchanged: 89 total records, 75 active routes, 51 countries, 26 active partially reviewed routes, zero wholly verified routes. The other 49 active archive records still need official review.
- No live catalog/schema migration or source batch was applied in this pass. Original fixture, applied review manifest, original archive, historical environment/database files and existing saved evaluations were preserved.
- Existing pre-session changes are numerous. Do not reset, clean or assume all modified/untracked files came from this pass.

## Implemented behavior

- Pure AND/OR requirement trees evaluate met/unmet/unknown and expose dated claim sources, retrieval limits and nullable effective dates. Twelve projections are bound to the exact expected applied review data; comparison is independent of JSON object key order because DB serialization canonicalizes it.
- Brazil accepts income OR bank funds. EB-2 separates ordinary sponsorship from requested NIW assessment; NIW decision stays unknown. Thailand separates qualifying investment from assets and does not demand additional liquid investment twice. Route-specific Australia/Finland/UAE checks preserve unresolved manual conditions.
- Optional applicant evidence is scoped to individual route IDs and validated at shared boundaries. Broad financial/education/language planning fields never manufacture documentary facts. Missing evidence stays unknown. Incomplete branches and unknown structured checks cannot enter primary strategies.
- Financial policy is matching-currency evidence only, no FX. Income period, gross/net/source-unspecified basis and history are explicit; monthly/annual conversion is deterministic. Fees, balances, assets, investment and spending are distinct. No missing costs/times were filled.
- Browser profiles use the existing routewise-profile-v1 key with a version 2 envelope {version:2,profile}; legacy complete raw profiles remain readable. API/DB Profile inputs remain raw profiles. Invalid optional drafts prevent strategy generation; no uploaded documents are stored.
- What-if comparisons use the same pure scoring/catalog snapshot, cap scenarios/results/change details, explain score/rank/dimension/adjustment/requirement changes and never persist inputs. GUI exposes planning changes; API/CLI/MCP also accept validated evidence patches.
- Explorer shows a read-only manual source queue with explicit date, 90-day default age threshold, index-only evidence and potential conflicts. Conflict labels are review candidates, not adjudicated findings. Review status never changes automatically.
- Backup restoration is tested in an isolated DB, including revisions, private profile, saved result, integrity and foreign-key checks.

## Interfaces and files

All interfaces share the evaluator. There are 18 MCP/CLI tools. New public operations are compare_scenarios (POST /api/v1/scenarios) and get_source_review_queue (GET /api/v1/reviews?asOf=YYYY-MM-DD). The HTTP API remains stateless and does not expose private saved profiles or writes.

Core additions: src/lib/requirements.ts, route-requirements.ts, financial.ts, scenarios.ts, source-freshness.ts. UI additions: ApplicantEvidenceEditor, RequirementChecklist, ScenarioComparison, SourceReviewQueue. See ELIGIBILITY.md for exact scope, FINANCIAL.md for comparison semantics and RECOVERY.md for restore procedure. Research leads are in research/eligibility-contract-2026-10-25.md; these are not an applied source update.

## Validation

- 62 unit/render/regression tests passed.
- 17 real database/API/CLI/MCP integration tests passed, including backup recovery and new stateless operations.
- ESLint, typecheck and production Webpack build passed.
- Browser checks cover desktop/mobile documentary evidence, scenarios, private-profile preservation, recommendation parity, focus and 320/375/390px plus landscape layouts. 24 browser cases validated successfully across the full suite and targeted rerun, with four deliberate desktop skips of mobile-only cases. The initial suite had 22 passes and two old storage-format assertions failing; those assertions were updated for version 2 and both desktop/mobile restore cases passed on rerun.
- SQLite integration/E2E databases are isolated under tmp; never point tests at the working database.

Windows build notes: stop verified project LAN/test processes before rebuilding; stale standalone servers can lock .next. In this pass a prior test server on 3100 was verified as this project's start.mjs/standalone process and stopped after it blocked the build. Sandbox static-page mkdir and local sockets were denied; approved execution outside sandbox completed build/tests. Playwright supports ROUTEWISE_E2E_PORT to avoid occupied ports (3118 used here), reuseExistingServer remains false. Do not stop unrelated listeners.

## Running LAN application

LAN service was restored with a hidden launcher after packaging. Verified via both localhost and http://192.168.1.65:3001: engine 3.3.0, 75 active, 26 partial, zero verified. This is host-side Wi-Fi-address validation, not proof of a phone connection. Windows Firewall was unchanged.

Read tmp/lan-server.json for current PID/port/addresses; never reuse a PID from documentation. Before stopping, verify its command includes this project's scripts/lan-server.mjs. Start via npm.cmd run start:lan or the hidden Start-Process pattern from AGENTS.md/session notes. Background launch may require approved execution outside sandbox to persist. Persistent hosting was not requested.

## Next work

The next substantive work is tasks.md section 1: resolve official source gaps and review prioritized remaining records. ICP/u.ae property duration conflict, index-only sources, Indonesia fees/national rules, Costa Rica checklists, complete costs/timing and PR/renewal/dependent/work-rights evidence remain open. Never mark a whole route verified from partial evidence. New evidence requires a NEW guarded batch/version; do not mutate official-review-2026-10-25-v1.

Further model work should be driven by that evidence: replace narrow manual checks, add actual effective ranges, richer individual income-history periods, and extend projections. Matching-currency evidence is the chosen policy; FX is optional future work, not a missing implicit conversion. Use Luna researchers if delegating, independently cross-check findings and keep retrieval limitations visible.
