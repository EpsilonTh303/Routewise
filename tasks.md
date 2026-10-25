# RouteWise next tasks

Updated 2026-10-25 for engine 3.3.0. Read AGENTS.md, HANDOFF.md, ELIGIBILITY.md and SOURCE_REVIEW.md. The applied review batch remains immutable; this pass made no live catalog changes.

## Implemented in this pass

- [x] Pure validated AND/OR requirements with met/unmet/unknown results, source review dates and nullable effective dates.
- [x] Twelve partial pathway projections: Brazil income OR funds; EB-2 sponsorship versus NIW assessment; Thailand assets/investment and remote history; Australia invitation/nomination; Finland and UAE occupational checks. Full legal eligibility remains unassessed.
- [x] Optional validated route-scoped applicant facts and financial evidence; legacy profiles remain readable, browser writes version 2, saved evaluation snapshots remain immutable.
- [x] Matching-currency financial policy with explicit income basis, period and history. No hidden FX; assets, investment, balances, fees and relocation spending remain separate.
- [x] Shared GUI/REST/CLI/MCP evaluation and bounded stateless scenario comparison. GUI scenarios never save changes.
- [x] Read-only source queue with explicit as-of date, default 90-day freshness threshold, index-only flags and potential conflict candidates.
- [x] Isolated backup/restore test preserving revisions, private profiles and evaluations; RECOVERY.md documents recovery.

## 1. Finish source coverage and resolve conflicts — next substantive work

- [ ] Resolve ICP versus u.ae property-residence duration with the issuing authority; preserve the conflict until then.
- [ ] Replace official-index-only evidence with directly retrieved official content where available (Saudi, Migri, Australia and Brazil). Blocked retrieval and research notes do not establish verification.
- [ ] Confirm Indonesia national E33G/Second Home rules and current checkout/renewal fees; distinguish local reporting guidance from national eligibility.
- [ ] Complete Costa Rica operational checklists, paid-work and renewal conditions; separate tax incentives.
- [ ] Review the remaining 49 active archive records, prioritizing actual strategy candidates and requested routes. No student routes are recorded.
- [ ] Establish route-specific PR/citizenship, physical-presence, renewal, dependent and work-rights claims.

Acceptance: exact official URL, dated claim evidence, retrieval method, applicability/effective dates where established, and limitations. New evidence requires a NEW guarded batch/version. Preserve custom catalog edits and atomic conflict rollback. Partial claim review never verifies a whole route. Use Luna researchers when delegating and independently cross-check their findings.

## 2. Extend documentary checks from new evidence

- [ ] Replace unresolved manual checks only when supported: Australia age at invitation and accepted English evidence; Finnish ICT pay/transfer; UAE competent authority, occupation and solvency alternatives.
- [ ] Attach effective date ranges and source-change policies to new snapshots. Current null effective dates mean unknown, not unlimited legal validity.
- [ ] Expand beyond the first 12 projections with versioned rules; edited/unrecognized reviews deliberately do not inherit old automatic checks.
- [ ] Establish year-one/dependent spending and timing separately. Passing partial checks must not promote incomplete branches into Plan A/B/C.
- [ ] Record individual income-history periods and documentary references rather than only an applicant assertion about qualifying history.

## 3. Optional follow-ups

- [ ] If conversion is desired, introduce dated authoritative FX snapshots and stale-rate behavior. Current policy requires matching-currency evidence; no network belongs in scoring.
- [ ] Extend GUI scenarios to documented-evidence editing and explicit saving only if requested. API/CLI/MCP already accept evidence patches without persistence.
- [ ] Prioritize the source queue using a requested profile or selected routes; current priority uses evidence quality and age.
- [ ] Assess persistent hosting only if requested. The current server is a local Windows process. Leave Windows Firewall unchanged.

## Definition of done

Back up before live DB changes. Use isolated test databases. Run required unit/integration/lint/build checks and production E2E for GUI/API changes. Verify ownership before stopping project servers and restore LAN service afterward. Update HANDOFF.md with exact results and remaining gaps. Never reset the DB, overwrite custom edits, or equate a heuristic score with legal eligibility.
