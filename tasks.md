# RouteWise next tasks

Updated 2026-10-25 for engine 3.4.0. Read AGENTS.md, HANDOFF.md, SOURCE_REVIEW.md and research/PRIMARY_REVIEW.md. Primary agent owns commits; Luna agents do not stage/commit in the shared checkout.

## Latest requested delivery

- [x] What-if region cards, filters in normal page flow, source audits last in the country drawer and below Explorer cards.
- [x] Separate profile overview/direct editor, local photo and identity fields, explicit save/cancel and legacy profile migration. Commit a73312f; layout commit 0f2c0e6.
- [x] Applied four partial study/post-study routes: German master's, German graduate search, Dutch orientation year, Finnish post-study search. Conditional six-stage roadmap, separate clocks and route-specific evidence; generic education is not graduation proof.
- [x] Applied new guarded Portugal/Vanuatu source follow-up, preserving old evidence and all unrelated/private records. Portugal broad service availability established; Vanuatu fees now recorded with scope/date caveats.
- [ ] Remaining source closure depends on actual evidence: Korea current criteria; Montenegro official law text; Panama current nationality/application detail; DV contradictory official status; Vanuatu DSP applicability; UAE property-duration conflict. No unsupported value or review status is silently filled.

The earlier checklists below describe the broader research backlog. The pilot covers four routes only, not complete institution/tuition/dependant/PR-credit rules for every study destination.

## Completed source-audit pass

- [x] Audit outcomes for all 75 active routes from three Luna region contracts; primary reviewer cross-checked the 79 cited URL inventory and corrected misleading inferences, unit errors and cross-route evidence.
- [x] Applied immutable official-catalog-audit-2026-10-25-v2: 88 claim summaries, 74 partial audits, one unresolved retrieval. No whole route marked verified.
- [x] Added generalized program.audit metadata, nullable SQLite column and exact-ID immutable batch receipts; preserved original pathway evidence and revisions.
- [x] Backed up before migration/application; all 75 expected hashes matched. Private profiles/results and 14 inactive records passed unchanged fingerprint checks.
- [x] Kept Canada SUV searchable as closed to new intake and excluded it from primary strategies. Unclear intake cannot become a primary plan.
- [x] Removed unsupported archive total/dependent costs, USD conversions and universal processing/residence clocks. Unknown values remain null; native source amounts stay separate.
- [x] Prepared STUDY_PATHWAYS.md for a later study → post-study → employment → PR/citizenship phase. No new routes were added in this audit pass.

## 1. Resolve remaining source limitations

- [ ] Replace 42 official-index/limited claim retrievals with directly retrieved issuing-authority evidence where possible; record unsuccessful attempts instead of assuming verification.
- [ ] Korea F-2-7: retrieve current route-specific official criteria; the audit currently establishes no claim.
- [ ] Resolve six unclear availability/applicability records: Korea, Montenegro property, Panama Friendly Nations, Portugal D7, US DV and Vanuatu.
- [ ] Resolve UAE property-duration conflict with the issuing authority. Preserve contradictory official claims until resolved.
- [ ] Confirm Indonesia national Second Home/E33G application and current fee evidence separately from local reporting guidance.
- [ ] Complete current Costa Rica checklists, work/renewal conditions and source applicability.
- [ ] Expand each partial review into claim-specific financial, qualification, renewal, presence, dependent, work-rights and PR/citizenship evidence. An audit attempt is not whole-route verification.

New evidence requires a NEW guarded batch/version. Never modify the applied v1 review or v2 catalog audit. Preserve edits atomically and independently cross-check Luna results.

## 2. Add study and post-study pathways in a separate phase

- [x] Add the four-route German/NL/FI pilot from STUDY_PATHWAYS.md with selected official transition claims. Full institution/cohort/dependant coverage remains separate research.
- [ ] Model institutions/program eligibility, completion/cohort dates, application windows and permitted work; do not treat a degree as automatic post-study eligibility.
- [x] Keep published pilot living funds, balances, fees and salary criteria separate in native currency; unsupported tuition/dependant totals remain unknown.
- [x] Represent pilot student → post-study → employment → PR → citizenship as conditional transitions with separate clocks and no predicted PR date.
- [x] Introduce additions through a new guarded append-only batch using existing schema, with validation/API/MCP/mobile support and explicit incomplete states.

## 3. Improve assessment coverage from supported evidence

- [x] Extend structured checks from 12 to 16 route projections, including the pilot, without substituting planning sliders for documents. Further catalog coverage remains research work.
- [ ] Replace manual checks only when supported: accepted language/qualification evidence, invitation age, Finnish ICT pay/transfer and UAE authority/solvency alternatives.
- [ ] Add effective date ranges and individual income-history periods/document references.
- [ ] Establish defensible year-one/dependent spending scenarios separately from legal minimum funds; current missing costs must not be filled merely to enable Plan A/B/C.
- [ ] FX remains optional: current policy requires matching-currency evidence, with no network in scoring.

## Operational rules

Commit each completed validated version/fix with explicit task files. Never stage environment/profile/database/backup/runtime files or push without authorization. Use isolated tests, backup before live DB changes, verify ownership before stopping project processes, restore LAN after builds, and leave Windows Firewall unchanged. Exact final checks and runtime state belong in HANDOFF.md.
