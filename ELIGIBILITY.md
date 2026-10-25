# Structured eligibility checks

## What the engine evaluates

The structured evaluator supplements the catalog's heuristic match score with route-specific checks. It reports each recorded requirement as **met**, **unmet**, or **unknown**. A user's submitted evidence is an input to a comparison, not an authority's confirmation. Unknown evidence remains unknown; it is not treated as approval or as an automatic legal rejection.

Requirements use explicit `all` and `any` groups, factual checks, typed financial checks, and manual checks that deliberately remain unknown. A failed child makes an `all` group unmet; an `any` group is met when one alternative is met. Missing facts and manual/discretionary questions remain unknown. Results identify the requirement rule version and are labeled partial.

The current rule version is `requirements-2026-10-25-v1`. Automatic route projections exist for exactly these 12 records:

- Brazil VITEM XIV digital nomad: foreign employer/client documentation and income **or** accessible funds.
- United States EB-2: underlying classification evidence, then a selected ordinary sponsorship or requested NIW assessment path.
- Thailand LTR wealthy: qualifying assets, a qualifying investment as a subset of assets, and coverage evidence.
- Thailand LTR remote professional standard and qualification alternative: foreign work/employer, income history, applicable qualification alternative, and coverage evidence.
- Australia subclasses 189 and 190: skills assessment, points, invitation, age/language evidence as a manual check, and nomination for 190.
- Finland specialist and intra-company transfer permits: employment/qualification evidence and relevant salary or transfer checks.
- UAE Golden professional, Green skilled, and Green freelance: employment/occupation/permit, salary or income history, and unresolved authority-specific checks.

These projections only run when the pathway review still exactly matches its expected entry in the fixed `official-review-2026-10-25-v1` batch. A missing or edited review does not silently inherit the rule projection. The batch and its source dates are not a promise that every source remains current.

## Applicant evidence and financial comparisons

Optional profile evidence is grouped by route ID. A route can include typed financial records, boolean factual evidence, and an EB-2 path selection. Validation bounds the evidence record count and allowed fact keys. Browser profile serialization uses a version 2 wrapper; complete legacy version 1 profiles can be read without inventing evidence.

Financial values have a kind (income, balance, assets, investment, or fee) and currency. Income also requires a period and a matching gross/net basis; rules can require a minimum history. Period conversion is limited to monthly versus annual income. Assets, investment, balances, and fees are never combined or substituted for one another. Different currencies, incompatible income bases, or missing periods/history produce an unknown comparison. No foreign-exchange conversion is implemented.

## Ranking and strategy limits

The existing score remains a heuristic fit score, not an approval probability. The structured result is surfaced alongside it. A route with an unmet structured requirement is ineligible in the model. Routes with unknown requirements remain conditional; routes with incomplete branch data are marked incomplete. The primary strategy builder excludes routes whose structured requirement result is not met and routes with incomplete required branch fields. This is a planning filter, not a finding that an applicant has no legal route.

The temporary what-if comparison applies validated profile patches to a copy of the base profile and computes base and hypothetical results against the same program list. It reports score, eligibility, ranking, dimension, adjustment, and requirement changes. It does not mutate or persist the base profile.

## Known boundaries

- Twelve pathway-specific projections do not amount to a complete immigration eligibility model. Other programs continue to use recorded scalar gates and heuristic factors.
- The EB-2 ordinary sponsorship path and a requested NIW assessment are distinct. Selecting NIW does not establish that the discretionary waiver will be granted; that outcome remains unknown.
- The Thailand asset and investment relationship is modeled so the investment is a subset of qualifying assets, not an additional amount to add to assets.
- Age, broad education, language categories, employer assertions, and applicant-reported facts do not establish every legal criterion, document, invitation, nomination, permit, or authority decision.
- General admissibility, complete application checklists, renewal conditions, dependent rights, and full work authorization remain outside these partial projections unless a rule explicitly models a narrower claim.
- Year-one relocation costs and dependent costs are not complete for the reviewed pathways. Unknown route figures remain null and incomplete branches are excluded from primary strategies rather than treated as free or zero.
- Financial checks require matching currency and compatible units/basis. The explicit policy is matching-currency evidence only; no FX rate source or conversion is used.
- Partial official-source review means only selected claims have dated citations. It does not set verification status to verified and does not establish the whole route, current law, or applicant eligibility.
