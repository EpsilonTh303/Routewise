# Recommendation engine 3.4.0

## Current catalog extension

The live catalog now has 79 active routes (78 partial audits and one unresolved), including four study/post-study records. Engine scoring policy is unchanged. The pilot adds route-scoped admission/completion/history/window/livelihood facts and six conditional roadmap stages with no predicted dates. Generic profile education never establishes German graduation, an eligible Dutch institution or Finnish permit history. Attached pilot evidence must match the reviewed snapshot for automatic checks and the pilot roadmap; custom source edits disable stale projections. Missing costs keep these routes out of primary strategies. Portugal/Vanuatu evidence is updated through a new immutable follow-up, not a changed original audit. See STUDY_PATHWAYS.md and SOURCE_REVIEW.md.

## 3.4.0 all-catalog source audit

All 75 active records now have a catalog-wide audit outcome: 74 partial and one unresolved. `program.audit` separates dated claims from intake availability, native financial evidence and missing fields; historical pathway evidence is preserved. No full-route verification is inferred. Canada SUV is closed/paused to new intake and remains searchable but cannot be a primary plan. Unclear availability is also excluded from primary strategies.

Unsupported archive costs, USD conversions and universal processing/residence clocks are null. The engine omits unknown score dimensions and does not interpret them as zero spending or immediate approval. All currently audited routes have incomplete year-one costs, so the strategy can honestly be empty. Citizenship fields explicitly marked unknown display Needs review rather than asserting that no legal pathway exists. The immutable audit batch, preservation checks and remaining source limitations are documented in SOURCE_REVIEW.md and research/PRIMARY_REVIEW.md.

## 3.3.0 structured checks and scenarios

The pure engine now evaluates dated partial requirement projections for 12 reviewed pathways, with explicit AND/OR groups and met/unmet/unknown results. Applicant evidence is optional, validated and scoped to a route. General age, education, language and financial sliders never manufacture documentary evidence. Brazil's financial alternatives, EB-2 sponsorship versus discretionary NIW, Thai asset/investment overlap, and route-specific qualification/nomination checks are covered. See ELIGIBILITY.md for exact coverage and unresolved manual checks.

Documented financial comparisons supersede incompatible scalar income checks for modeled routes. They use matching currencies and bases, explicit monthly/annual units and income history. No FX or invented all-in costs are introduced. Unknown structured checks cannot enter primary strategies, and incomplete branch records remain excluded even when their recorded checks are met.

Scenario comparisons reuse the same catalog and pure engine, return bounded score/rank/dimension/adjustment/requirement changes, and never save inputs. REST, CLI and MCP expose the same operation. Existing stored evaluation snapshots remain immutable. The earlier sections below describe the retained ranking model and its historical repairs.

The engine ranks recorded routes for exploration. It does not estimate visa approval probability or establish legal eligibility. Its weights and penalties are explicit heuristics, not a trained or empirically calibrated immigration model.

## Problems reproduced and repaired

Regression tests first demonstrated thirteen failures in the previous engine:

1. Selecting preferred regions could increase an outside-region route's score by changing the weighting denominator.
2. Remote-incompatible programs could gain points because their fit weight increased.
3. A missing PR path was treated as an invented five-year delay in the decision-speed dimension.
4. Six-month and one-year preferences produced identical results for long processing times.
5. Non-Azerbaijani users inherited AZ-specific entry-access scores.
6. Missing sponsorship was counted twice, as both no offer and insufficient offered salary.
7. Category-wide student age/degree assumptions could create unsupported eligibility rejections.
8. A single household label caused explicitly declared dependents to be ignored in costs.
9. A conditional route or lottery could displace a ready route as the primary plan.
10. Strategy selection trusted input ordering and did not reliably diversify country/category backups.
11. Duplicate inputs could create duplicate plans.
12. Residency milestones could precede arrival, equal PR/citizenship dates hid PR, and PR-at-activation was omitted.
13. Direct citizenship scenarios unnecessarily required relocation.

See tests/engine-regressions.test.mjs for those counterexamples and additional behavioral checks.

## Ranking and explanations

- Six dimensions remain: funds/cost, decision speed, citizenship timeline, quality of life, access and heuristic profile fit. Age and education may influence heuristic fit, but a category label alone no longer creates a legal age/education rejection.
- Affordability uses the greater of recorded minimum capital and family-adjusted spending, without adding investment twice. Every declared dependent counts. A zero-cost record remains affordable at zero budget.
- Decision speed uses processing weeks only. Citizenship has its own dimension; an absent citizenship track receives zero in that dimension rather than a quality-of-life-derived passport score.
- Weights depend on the selected goal. Timeline checks use the recorded decision time plus a **three-month illustrative preparation/filing lead-in**; this is a planning assumption, not a government processing promise.
- Outside-region and goal-incompatibility preferences apply explicit negative point adjustments instead of changing weighting denominators. Low-risk investment preferences and insufficient cash buffers are also explained.
- Access uses AZ-specific data for AZ profiles only. Other citizenships receive a neutral access score and an explicit coverage warning. Unmodeled treaty flags no longer confer automatic score bonuses.
- The score is computed from the returned integer dimensions and weights, then the returned point adjustments, clamped to 0–98 and rounded. `explanation.baseScore`, `weights` and `adjustments` reproduce the displayed total.
- Explanations include strengths, trade-offs, required funds, budget headroom, modeled decision time, manual-review warnings and actionable next checks.

Rankings put records passing the implemented checks before conditional candidates, then prefer direct goal alignment, then fit. Ties use cost and stable program IDs. Increasing budget or reducing processing time must not reduce fit under otherwise identical inputs; the test suite checks this across the fixture.

Eligible means no failure in the implemented financial/sponsorship checks. Conditional remains a planning label for a single unresolved issue when the available budget is at least 75% of the modeled floor. It is not permission to apply without meeting a requirement. Other failures are ineligible in this model. Age, admissions, licensing, points, employer accreditation, nationality restrictions and other unstructured requirements remain manual checks.

## Plan A/B/C policy

Only goal-aligned, non-ineligible, non-lottery records can enter the strategy. A is the best fit at the highest available modeled readiness. If no ready route exists, its note explicitly identifies a conditional candidate.

B and C diversify country and route category among candidates at the best remaining readiness level, within ten fit points of the highest-scoring remaining candidate. Cost is a tie-breaker, not an unsupported claim that Plan C is cheap. Inputs are sorted and deduplicated internally. Lotteries remain searchable exploratory records but never become a primary/backup relocation plan.

If no direct plan exists, the engine returns an empty strategy rather than substituting unrelated programs. The imported fixture currently has **no student records**. Its study goal therefore produces an honest empty direct recommendation. The UI's Other goals switch and the API/MCP `includeAlternatives` option allow explicit exploration outside the selected goal.

## Roadmap model

Preparation is shown at 1.5 months and filing at 3 months. Decision follows the recorded processing estimate, and modeled activation follows one month later. Positive PR/citizenship residence periods are measured from that activation, with PR-at-activation represented explicitly. Equal milestone dates are preserved and steps are sorted chronologically. Direct citizenship scenarios show completion formalities without assuming relocation.

These are illustrative scenarios. Real residence-clock rules, document timing, investment completion and approval conditions require source review. UI month labels avoid end-of-month rollover artifacts.

## Interfaces and persisted results

GUI, REST and MCP use the same pure scoring/strategy functions and the live catalog. API/MCP matching hides goal-mismatched alternatives by default; `includeAlternatives:true` restores them independently of `includeIneligible`. Responses include `strategyStatus`, an empty-strategy notice when needed, and goal-aligned counts. The GUI provides matching explanation details and an explicit Other goals switch.

The service and MCP server report engine version 3.2.0. Previously saved strategy snapshots retain their original result and version; they are not silently rewritten. A newly saved evaluation records the new engine output. Original source-review state, saved profiles and prior evaluation snapshots are preserved. Mixed parents remain in history after the pathway migration.

## Remaining evidence gaps

The 62 imported program records remain unverified. Thirteen mixed families now have separate pathway records; per-path costs, residency clocks and financial requirements still need structured source review. Current-income fields do not establish passive-income type, and the model does not establish all nationality, qualification, points, admissions or licensing requirements. These limits are disclosed in result warnings rather than filled with invented rules.

## Upgrade validation

35 unit/render/regression tests, 11 real database/API/MCP integration tests and 16 desktop/mobile browser checks passed. Browser checks include matching Plan A to the API response, inspecting recommendation explanations, and opting into alternatives when a goal is absent. Typechecking, ESLint and the production build passed. All database tests used temporary databases; the working catalog and saved data were preserved.

## Pathway separation

Thirteen mixed records are retained as inactive parents of 27 separate branches, with 26 active. All branch figures remain unverified. Unknown cost, speed and citizenship dimensions are omitted from scoring; known capital floors still apply. Incomplete routes cannot enter Plan A/B/C. Null dates never become promised relocation dates. Existing saved profiles and snapshots remain intact. See PATHWAYS.md.

## Official claim review

See SOURCE_REVIEW.md for the 27-record partial review batch. Selected claims have dated official citations; full-route verification remains pending. Native-currency amounts are not fed into USD gates without conversion. Brazil nomad income and EB-2 sponsorship gates are unknown because they cannot express alternative qualifying evidence. The drawer and API expose evidence and retrieval limits. Engine 3.2.0 preserves incomplete-route strategy exclusions.
