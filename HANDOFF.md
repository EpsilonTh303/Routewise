# RouteWise clean-session handoff

## Descriptive Germany journey v1 — 2026-10-26

Added standalone src/lib/journey.ts contract/validation and src/lib/data/germany-study-journey.ts four-stage example. Conditions link existing pilot audit claims and route-scoped fact/manual evidence specifications; offer present/absent/any branches are conditional navigation, not legal assessments. Work and PR have no fabricated standalone Program records. Existing Program/profile/persistence schemas, applied manifests, scoring and GUI remain unchanged; no runtime consumer is wired. Read STUDY_PATHWAYS.md for scope and future-consumption requirements. Seven new model tests cover JSON round trips, four stages, job branches, source/evidence links, old catalog compatibility, graph integrity and invalid data. Validation: 101 unit tests, 27 isolated integration tests, typecheck, lint and production build passed. LAN launcher restarted after build; firewall unchanged. No live data writes or deployment.

## German What-if fix — 2026-10-26

Added the existing optional boolean german field to the scenario patch allowlist. The full merged-profile validator and shared matching pipeline remain unchanged; German skill affects useful-language fit, not documented legal-language evidence. Two regression tests failed with Unknown profile patch key before the fix and now cover enabling/disabling German, legacy profiles, score changes, unchanged missing checks, explicit unmet language evidence, unrelated routes, invalid types, other languages and immutable base profiles. HTTP and real MCP integration scenarios now include German. Validation: 94 unit tests, 27 isolated integration tests, lint, typecheck and production build passed. Build initially met a Prisma DLL lock while integration was running; retry after completion succeeded. LAN launcher restarted afterward; firewall unchanged. No catalog or profile persistence changes.

## JSON key-order fix — 2026-10-26

Extracted the existing recursive canonical JSON comparison into src/lib/canonical-json.ts and reused it for the study evidence/requirements guard. Nested object key order no longer disables assessments or conditional roadmaps; array order and actual content changes still invalidate stale projections. Catalog manifests and rule semantics are unchanged. Regression coverage compares all four pilot routes across missing/positive/negative facts, scoring and roadmaps, plus array/content edits. Validation: 92 unit tests, 27 isolated integration tests, typecheck, lint and diff whitespace check passed. No live data changes or deployment; primary commits the scoped fix.

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

Stage 2 completed: separate My profile overview and direct grouped editor, local cropped photo, display name/headline/location/bio, v3 browser envelope with legacy/v2 migration. Identity/photo remain outside strict assessment/API Profile. Atomic explicit saves report quota errors without losing the prior saved profile; Cancel discards drafts. Validation: 76 unit tests, lint/typecheck/production build; 30 existing browser cases plus four corrected profile cases passed, four intentional skips. Initial new tests used a corrupt PNG and an ambiguous alert selector; corrected fixtures/selectors passed on targeted desktop/mobile rerun. Mobile profile screenshot inspected. No live database changes. Study/source additions remain in progress separately.

## Applied study and source extension

The live catalog is now 93 total / 79 active / 51 countries; 78 partial audits, one unresolved Korea audit, no whole verified routes and one closed intake. The scoring engine remains 3.4.0. Applied immutable `official-source-followup-2026-10-25-v1` to Portugal/Vanuatu and append-only `study-pilot-2026-10-25-v1` to four new records. Read STUDY_PATHWAYS.md and SOURCE_REVIEW.md for the exact scope; new research files are not all accepted rules.

New routes: de-masters-study, de-graduate-jobsearch, nl-graduate-orientation-year, fi-graduate-jobsearch. Six conditional roadmap stages separate admission/completion, search permission, work during search, new employment/business status, permanent residence and citizenship. All calendar milestones remain null; native proof/fees/salary criteria are distinct from an all-in cost. Four new partial requirement projections bring coverage to 16, with route-scoped facts rather than inferred degree eligibility. Exact attached audit/requirements matching disables stale projections/roadmaps after custom edits. Missing costs still exclude the pilot from primary plans.

The append-only helper validates schema/partial audits, rejects existing IDs in the same transaction, records sources/revisions and an exact manifest receipt, and preserves later edits on reapplication. No schema migration was necessary. CLI plan/apply commands are in README.md; fresh setup applies both new batches, ordinary startup remains read-only.

Live backup: backups/routewise-2026-10-25T17-53-27-181Z.sqlite (ignored). Before/after fingerprints confirmed saved profiles, strategy snapshots and 87 unrelated existing records unchanged. Both new batch plans now report applied. Never modify these manifests under their applied IDs.

Remaining blockers are substantive: current Korea criteria, Montenegro operative official text, Panama current nationality/application conditions, DV contradictory official notices, Vanuatu DSP fee/form/intake applicability and UAE property-duration conflict. Portugal broad service availability is established but individualized net means and current consular handling remain incomplete. Unsupported tuition, dependants, spending and residence-credit details require case-specific evidence.

Final validation: 86 unit tests; all 27 integration cases validated (25 passed initially, two obsolete country/goal assertions corrected, targeted 16-case system suite passed); lint/typecheck and production Webpack build passed. All 38 browser cases validated with four intentional desktop skips. The final CSS pass initially exposed a test measuring the 94px image interior rather than its 96px bordered box and a scrolling test racing navigation/smooth scrolling; corrected profile/layout files passed all eight desktop/mobile cases. Fresh CSS generation was needed after stale Webpack styles omitted new component classes: explicit Tailwind component/app sources plus a verified cache move to ignored tmp forced regeneration. Inspected final desktop and 320px mobile profile screenshots and enforced avatar dimensions. Browser tests use isolated DBs.

LAN restored and Wi-Fi endpoint verified at http://192.168.1.65:3001, engine3.4.0/active79/audited79/verified0. Read current tmp metadata rather than this session's PID. Windows Firewall unchanged. Primary owns the final commit; no push. Unrelated preexisting environment/scaffold/database changes remain unstaged.

## Language fit and simpler drawer, engine 3.5.0

German is now an optional boolean alongside the existing planning language skills, exposed in initial setup and direct profile editing/overview. Missing German remains compatible with legacy profiles and strict REST/CLI/MCP schema. Useful route-language overlap adds six fit points per language (max14 before fit/risk limits) for every citizenship. The language bonus no longer changes AZ passport-access scores; documented legal-language facts remain independent. Saved strategy snapshots/catalog batches are unchanged.

The drawer removes radar charts, archived lineage, score arithmetic and unsupported passport/family/tax summaries. Unknown numeric tiles and repeated unknown budget labels are omitted; a concise missing-cost/timing note remains. Core requirements, warnings/pros-cons, roadmap, useful score explanation and final official source audit remain available. Language matching unit tests cover AZ/non-AZ fit gains, unrelated languages, strict booleans and unchanged eligibility checks; browser tests cover German setup/profile persistence and absence of removed sections.

Validation:89 unit tests,27 isolated integration tests,lint/typecheck/production build passed;38 desktop/mobile browser cases passed with4 intentional skips. After the final unknown-tile cleanup,14 affected recommendation/layout/mobile cases passed again with4 intentional skips. Inspected final narrow-phone drawer screenshot. No live schema/catalog/profile changes. LAN restored and checked at http://192.168.1.65:3001,engine3.5.0/active79;firewall unchanged. Primary commits only task files, no push.

## GitHub Pages publication

The user explicitly authorized pushing to EpsilonTh303/Routewise and approved changing this initially private, empty repo to public after GitHub returned422(plan does not support private-repo Pages). Repo is now public; Pages is enabled with build_type workflow and homepage https://epsilonth303.github.io/Routewise/.

All nine pre-publication commits were already present locally through8a417d5. A disposable publication clone filtered .env, db and .zscripts from every reachable commit, preserved application changes/messages and passed private-path/common-credential checks. Its first main push succeeded at publication head e2be1bbbf4b318c4927977db658c424e34f1911b. Original local main/history remains unchanged; hashes differ because ancestry was sanitized. Never push original main/backup refs; read PUBLISHING.md and use prepare-publication.mjs for future releases, then a fast-forward push from its reported clone. No GitHub credentials are written/staged; authentication uses the Git credential helper in memory.

Static mode loads a strict public catalog snapshot under the repository base path, computes scoring/scenarios in-browser, and retains local profiles/photos. The builder uses a fresh disposable seeded DB, never live profiles/DB; it excludes .ts API handlers via .tsx/.jsx page extensions and restores its temporary public/catalog.json. GitHub workflow builds and deploys out only. Node/REST/MCP remain in normal deployment. Next shares .next between modes, so stop the verified LAN launcher before builds on Windows and rebuild normal mode afterward. Initial isolated-folder build was replaced after Windows overhead/missing relative support files; a one-element pageExtensions loader bug required the two supported frontend extensions.

Checks:90 unit,27 isolated integration,lint/typecheck,static export and normal production build passed. Two dedicated static desktop/mobile cases verified /Routewise/ assets/catalog, German profile persistence, no backend API and no failed requests;16 normal catalog/profile/scenario browser cases passed. Normal LAN has been restored. The Pages release commit adds the deployment workflow; check the repo Actions/Pages deployment for its latest live status.
