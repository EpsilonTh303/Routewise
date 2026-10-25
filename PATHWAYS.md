# Pathway separation

Archive decomposition, not official-source verification. The original 62-record fixture remains intact. The live catalog contains 89 records: 75 active routes, 13 inactive mixed parents and one inactive HNWI review record whose residence basis is not established.

| Original family | Separate branches |
|---|---|
| Costa Rica investor | Investment, rentista |
| Brazil investor | Business investment, VITEM XIV remote income |
| Indonesia Second Home | Second Home, E33G remote worker |
| France talent | Investment, salaried |
| UAE Golden | Property, professional |
| UAE Green | Skilled employee, freelance |
| Thailand LTR | Wealthy, standard remote, degree alternative remote |
| Georgia HNWI | Inactive HNWI review, business residence |
| Serbia company | Company, property |
| Finland specialist | Specialist, EU ICT |
| Australia skilled | Subclass 189, subclass 190 |
| US EB-2/3 | EB-2, EB-3 |
| Saudi premium | One-time, annual payment |

Only branch-attributable archive figures are retained. Shared costs, processing times, PR/citizenship clocks and unclear flags are null. No new currency conversions or eligibility claims were verified. Inherited country/access/family scores remain contextual heuristics, not pathway rights. Variations within a single permit are not all modeled yet.

## Migration

Back up existing databases with `npm run db:backup`, then apply `npm run db:deploy`. Inspect `npm run catalog:split:plan`, then run `npm run catalog:split`. Fresh setup and seeding perform the same idempotent split.

All splits run in one transaction. Parent hashes must match the original fixture; edited parents and preexisting child IDs cause rollback. Durable receipts protect edited children from reseeding. Original sources and revisions remain attached to inactive parents; children reference their parent and recipe and retain unverified source URLs. Private profiles and saved evaluations are not rewritten.

## Engine and API

Engine 3.1.0 uses null for unknown figures, not zero. Results expose dataComplete, missingFields, knownBudgetFloor, and nullable costs/times. The GUI displays Needs review. Known financial floors still apply, while incomplete routes cannot enter Plan A/B/C. The first official-source review pass is documented in SOURCE_REVIEW.md; complete eligibility and cost gaps remain.
