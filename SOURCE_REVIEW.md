# Official-source review — 25 October 2026

Three Luna agents researched the 27 separated records in parallel. The primary agent cross-checked their sources, corrected stale research results, and reviewed the final data changes. Agent working notes are in `research/*-review.json`; the reviewed, applied catalog batch is `src/lib/data/reviewed-pathways.ts`.

## Scope and evidence

The batch records 28 cited claim summaries across 27 records: 26 active pathways and one inactive HNWI review record. The total catalog remains 75 active routes across 51 countries. The original parents, sources and revisions remain preserved. The other 49 active archive records were outside this review pass.

This is a **partial claim review**, not whole-record verification. Every reviewed record retains `verification.status: unverified`; `verifiedOnly` does not return partially reviewed records. `get_catalog_stats` reports `partiallyReviewedCount`. Route API, CLI and MCP outputs include `pathway.review`, with batch ID, review time, claims, source URLs, retrieval method, native financial evidence and unresolved limitations. The drawer shows the same evidence and links.

`retrieval: page` means readable official page/PDF content was retrieved. `official-index` means evidence was available in the search index of the official domain while direct access was blocked or returned an empty JavaScript shell. This is disclosed beside each citation. A check time is an observation time, not an effective date or a guarantee that indexed content is current.

## Important corrections

- Brazil nomad: USD 1,500 monthly **or** USD 18,000 funds; the single income hard gate is disabled until alternative evidence can be modeled.
- Thailand Wealthy Global Citizens: no personal income floor in BOI's 2025 update; USD 1 million assets includes USD 500,000 qualifying Thai investment. Asset and investment requirements are distinct. Remote alternative criteria also include IP/funding options, not only a degree.
- France: current Service-Public page dated 1 June 2026 lists EUR 39,582 annual gross salary for specified salaried tracks; direct investment is EUR 300,000 with personal investment/direction or 30% ownership, plus employment commitments. An initial stale research result was rejected.
- Finland: specialist salary is EUR 3,937 gross monthly for 2026, with qualifications/employment conditions; ICT has separate transfer and pay rules.
- Saudi: official indexed product evidence lists SAR 100,000 annual limited-duration fee, not the archive's SAR 40,000; unlimited-duration fee is SAR 800,000. Direct platform access remains unresolved.
- UAE: native AED thresholds and distinct employee/freelance conditions replace unverified USD approximations. ICP and the government portal disagree on property visa duration; both citations are retained without choosing a duration.
- Indonesia: Second Home bank and property evidence have different amounts and are not E33G conditions. E33G income and living-funds proof are separate; published local fees are not full relocation costs or verified current checkout charges.
- Australia: 189 and 190 are permanent at grant, but 190 requires nomination. Zero residence years until PR does not imply immediate application processing.
- US EB-2: the ordinary sponsorship and NIW exception cannot share an unconditional job-offer gate; it remains unknown until the relevant branch is chosen. EB-3 worker classes remain distinct.
- Serbia: unsupported shared income/capital estimates were removed. Georgia: enterprise turnover is not personal income; the HNWI claim remains inactive.

Non-USD thresholds are retained as native-currency evidence and are not silently converted into USD budget/salary gates. No total living costs, general processing times, dependent costs or citizenship timelines were invented. Incomplete pathways remain excluded from Plan A/B/C. Family and passport heuristics remain separate from legally verified rights.

## Applying and maintaining the batch

Before changing an existing catalog: `npm run db:backup`. Inspect `npm run catalog:review:plan`, then explicitly apply `npm run catalog:review`. Fresh `db:setup`/`db:seed` performs the same batch after pathway splits. Ordinary app startup never seeds or changes data.

The batch runs atomically. Expected original split hashes prevent overwriting edited, unreviewed branches. A completed batch is recognized through its ID and is not reapplied over subsequent edits. New evidence updates require a new, explicitly reviewed batch/version; do not modify an applied batch and expect it to rerun. Source evidence, timestamps and revisions are persisted, while saved profiles and prior evaluation snapshots remain unchanged. No schema migration was necessary; review metadata uses the existing pathway JSON field.

Next work: structured eligibility for alternative financial evidence, local-currency comparison with explicit dated exchange rates, qualification/nomination rules, and source-specific renewal/PR/citizenship checks. These are not established by a partial source review.
