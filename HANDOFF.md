# RouteWise clean-session handoff

Updated 2026-10-25 after the all-catalog source audit. Read AGENTS.md, tasks.md, SOURCE_REVIEW.md, research/PRIMARY_REVIEW.md and STUDY_PATHWAYS.md.

## Current state

- Application root is this project directory. Engine 3.4.0; requirement snapshot requirements-2026-10-25-v1. npm/package-lock.json remains authoritative.
- Catalog: 89 total, 75 active, 51 countries. All 75 active records have audit outcomes: 74 partial, one unresolved (Korea F-2-7), zero fully verified. There are 88 cited claims from 79 source URLs; 42 claims across 39 routes remain indexed/limited retrieval. Two source conflicts remain visible.
- Six route availability/applicability states remain unclear: Korea, Montenegro property, Panama Friendly Nations, Portugal D7, US DV and Vanuatu. Canada SUV stays searchable but is closed/paused to new intake; it cannot enter primary plans.
- The new immutable batch is official-catalog-audit-2026-10-25-v2 in src/lib/data/catalog-source-audit.ts. It has already been applied. Do not mutate/regenerate it: later evidence needs a new batch/version.
- Original official-review-2026-10-25-v1 and pathway lineage remain unchanged. Archived fixtures and inactive parents were preserved. Unsupported archive costs, USD gates and generic processing/residence clocks were cleared to null on the 75 reviewed active records, not fabricated from fees or native thresholds.
- Incomplete routes remain exploratory and cannot enter Plan A/B/C. This is a data-readiness constraint, not a conclusion that legal pathways do not exist. Current primary plans can therefore be empty; the UI explains why.

## Research and acceptance

Three Luna agents covered Europe 25, Asia/Gulf/Caucasus 27, Americas/Africa/Caribbean 23. All research is in research/audit-*-2026-10-25.json, with source notes and primary review in research/PRIMARY_REVIEW.md. The primary agent independently attempted the cited URL inventory and corrected treaty-country misreadings, cross-route investment leakage, incorrect URLs, dynamic-wage currency misuse and unsupported timing/fees. Blocked, empty/JS, redirected and oversized evidence is disclosed instead of marked directly retrieved.

These are selected claim checks, not complete legal eligibility, document validation or full-route verification. Inherited country/family/access scores remain heuristic. Sources may conflict or describe only one consular post, category or year. No new routes were added.

STUDY_PATHWAYS.md is a future research/design proposal for conditional study → post-study permission → work → PR/citizenship transitions. Its official starting links are leads, not applied rules. The user wants such additions after source work; do not equate study completion with automatic work or permanent status.

## Storage and batch mechanics

Migration 202610250003_source_audit adds nullable CatalogProgram.audit JSON and the CatalogAudit receipt table. SourceAudit separates partial/unresolved evidence, availability, dated claims, native financial requirements, limitations and unknown fields. program.audit takes display/queue precedence over historical pathway.review, which remains intact.

apply-source-audit.ts validates targets/patches, refuses identity/lineage changes, guards exact expectedHash and applies all records atomically. Receipt PK is the exact batch ID, manifestHash is separate; prefix-related batch IDs do not collide. Same manifest is idempotent after later edits; an altered applied manifest is rejected. Source rows retain explicit dated historical claim lines alongside their latest checkedAt.

Commands: npm.cmd run db:backup; npm.cmd run db:deploy; npm.cmd run catalog:audit:plan; npm.cmd run catalog:audit. Fresh setup applies splits, original review and the same audit batch. Ordinary startup never seeds/migrates. Do not use setup/reset as a health check.

## Preservation and checks

- Live backup before migration/application: backups/routewise-2026-10-25T14-04-32-557Z.sqlite (ignored private file).
- Plan matched all 75 expected hashes; one transaction updated all 75; final plan reports all applied.
- Before/after fingerprints confirm saved profiles, immutable evaluation snapshots and all 14 inactive records were unchanged. Fingerprints are ignored under tmp; no personal values were printed or committed.
- 69 unit/render/regression tests passed; 23 isolated DB/API/CLI/MCP/recovery/batch tests passed; lint, typecheck and production Webpack build passed.
- 26 desktop/mobile browser cases validated, with four deliberate desktop skips of phone-only cases. Initial full run had 24 passes and two old single-citation assertions failing after E33G gained separate income/balance citations; the assertion now checks every API-reported citation, and both desktop/mobile cases passed on targeted rerun. Tests use isolated temporary DBs, never the user's working DB.

## LAN and operational state

Restored hidden LAN launcher after packaging. Verified Wi-Fi endpoint http://192.168.1.65:3001: engine 3.4.0, active75/audited75/partial74/unresolved1/closedIntake1/verified0. Host-side Wi-Fi checking is not proof of an actual phone session. Windows Firewall was unchanged.

Read tmp/lan-server.json for current PID/port/IP, never reuse documented PIDs. Verify command path matches this project's scripts/lan-server.mjs before stopping its tree. Stop verified LAN/test standalone processes before rebuilding on Windows; never stop unrelated listeners. Build and Chromium/local socket tests may need approved execution outside sandbox. Playwright supports ROUTEWISE_E2E_PORT; 3118 used here, reuseExistingServer=false.

## Commits and next work

The user requires commits for completed working versions/coherent fixes. AGENTS.md now records primary-agent commit ownership; shared-workspace Luna agents must not stage/commit unless explicitly assigned an isolated checkout. Never include environment values, DBs, backups, profiles or runtime artifacts. No push was authorized.

Local commits include 0c5cf1c (tested3.3 baseline and commit policy) and b544bf6 (75-route research and future study design). The final validated integration commit is visible in git log after this handoff update. Numerous unrelated preexisting environment/archive/scaffold modifications remain unstaged intentionally; do not reset/clean them.

Next: reduce indexed evidence and unresolved availability/contradictions; then implement a small source-backed study/post-study pilot with independent transition conditions. See tasks.md. Existing 12 structured checks, evidence profiles, matching-currency policy and stateless scenarios remain; richer rule coverage and defensible cost scenarios must be driven by evidence.

## Current user-requested stages (in progress)

1. Layout: non-sticky filters, touch-friendly What-if regions, source audit after route content.
2. Separate profile view/edit with local photo and direct editing after first setup.
3. Source-backed German master's and other post-study routes; retry existing evidence gaps. Never invent values to remove review labels.

Luna researchers own only scoped research files; primary agent implements, checks and commits each stage.

Stage 1 completed: region cards, non-sticky filters and bottom source audits. 69 unit + 30 browser cases passed (four desktop skips), lint/typecheck/build passed; LAN restored. Next implementation is separate browser profile view/edit/photo. Research for Germany/NL/FI and source-gap retries is in new research files pending primary acceptance; not yet applied.
