# Study-to-work pilot and future expansion

## Purpose

### Descriptive stage model v1 (2026-10-26)

`src/lib/journey.ts` defines a separate JSON-serializable `Journey` contract and Zod validator. `src/lib/data/germany-study-journey.ts` provides the German four-stage example: master's → graduate job search → work permit → permanent residence. Only the master's entry checklist is connected through `studyRouteRequirement` to existing profile assessment; the other three stages and all transitions remain descriptive. Existing `Program`/profile schemas, applied batch manifests and catalog records are unchanged. The GUI, budget system, catalog setup and persistence are unchanged.

Each stage has an ID, kind, label, optional catalog links (`programIds`, empty where no standalone record exists), conditions, and outgoing transitions. Each condition references one existing claim by program ID, immutable audit batch ID and unique claim topic; that claim retains its summary, source URL, retrieval method and observation date in the existing catalog. Evidence specifications either reference an existing route-scoped applicant fact or require manual document/authority review. They describe evidence needed, not evidence supplied or an assessed result. Conditions are partial checklists, never a full permit checklist.

Transitions carry a target stage, a `jobOffer` branch (`present`, `absent`, `any`) and their own conditions. The example distinguishes completion without an offer → job-search application, completion with an offer → separate work-status application, and job search with an offer → separate work-status application. These are navigation candidates only: the transition conditions **and destination-stage conditions** still require review; a job offer does not establish qualifying employment or grant a permit. Missing job-offer information must not be interpreted as `absent`. No transition traversal/evaluation is implemented. PR remains a separate conditional application; no durations, thresholds or new fact keys are introduced.

`journeySchema.parse` checks structure, strict fields, unique stage/checklist IDs, valid targets, reachability and absence of cycles. `validateJourney(value, programs)` additionally checks catalog/evidence links and dated claim references. Call it against the intended catalog snapshot before future expansion; a missing/renamed claim or changed batch must fail validation. This does not reverify current law or replace the pilot's partial-source limitations. New source evidence still requires a new guarded catalog batch. The model does not require a migration.

### Master's entry assessment

`studyRouteRequirement` reads only the German `masters` stage's conditions/evidence and projects them onto the four entry checks, retaining their top-level IDs, labels and dated sources. `assessRouteRequirements` and `evaluateRequirement` evaluate route-scoped admission and programme-language facts. The livelihood check now combines the EUR balance comparison described below, the existing applicant-reported `securedLivelihood` fact and a separate manual financing review. An explicit true is an applicant assertion of documented evidence, not authority verification; missing assertions remain unknown. The existing `study-costs` manual check also stays unknown. Generic education, German/English skills, a job offer, USD budget sliders and unrelated route evidence cannot fill these checks.

The canonical claim/requirements guard remains. Master's model references must resolve uniquely to the attached batch/claim and supported evidence, and must retain every existing check, including manual review. Unsupported/incomplete model mappings disable the projection rather than dropping safeguards. Transition and later-stage conditions are not read or evaluated by this adapter; the existing graduate/NL/FI projections and roadmap logic are unchanged.

### Conditional TK monthly expenses (2026 edition)

New `src/lib/data/tk-student-costs.ts` records add the directly reviewed TK EUR 141.16 / 146.29 combined monthly health-and-care tariffs, effective 2026-01-01. See `research/tk-student-insurance-2026-10-26.md` for primary sources and limitations. These are new expense records, not modifications to the original pilot, financing proof or salary rows. Their classification uses the same purpose/stage/coveredDuration/includeInExpenseTotal fields; `includeInExpenseTotal: true` identifies genuine expenses for future use but triggers no aggregation. The two records share one cost group and are mutually exclusive alternatives, not additive premiums. `period: monthly` is a rate period; full policy coverage duration and the official rate end date remain unknown.

`getGermanyStudyCostData(program)` returns the original classified finance rows separately from conditional monthly costs. `selectStudentInsuranceCost(records, context)` is a strict, pure tariff lookup. It requires explicit route, age, TK choice, parenthood, absence of free family insurance, query date and student-tariff/care-band confirmation covering that date. Current Profile age, familyStatus, dependents, education or generic healthCoverage evidence alone cannot supply these facts. TK eligibility confirmation must account for enrollment, excluded statuses, priority coverage and work/foreign-insurance circumstances; the lookup does not decide those conditions itself. At 30+ current-semester/approved-exception review is mandatory. Unsupported age/care-band combinations, multiple-child discounts, expired/missing confirmations, ambiguous records and non-2026 query dates return unknown with no cost. Ineligible/family-insured/non-TK/other-route cases receive no tariff. Dates outside 2026 require a new review rather than assuming continued prices.

Profile/API/persistence schemas, GUI, scoring, proof checks and totals are unchanged. Insurance data is available through the additive cost view; it is not automatically inserted into existing match results or budget sums.

### Master's EUR living-funds budget comparison

`src/lib/study-financial-classification.ts` adds a versioned, read-only metadata sidecar to the immutable pilot rows via `classifyGermanyStudyFinances(program)`. Each returned row retains the original financial fields and has a `classification` with `purpose`, `stage`, `coveredDuration` and `includeInExpenseTotal`. The existing EUR balance is `financing-proof` for `masters`, with duration `null` and expense inclusion `false`. Both Blue Card figures are `salary-threshold` for `work-permit`, also excluded from study expenses. Their existing `annual` rate period remains unchanged; no permit duration or coverage interval is inferred from it. Classification is not a new source review or verification promotion.

Only exact original financial rows under the original route/batch receive this metadata; altered/unrelated rows receive `classification: null`. The adapter uses classified master's proof rows only, so salaries cannot become study-funds requirements. No amounts, source snapshots, persisted catalog manifests, database schema or UI are changed. The view is available for future cost breakdowns; it is not persisted into `Program.audit` or added to the public API. Unknown expense totals remain unknown, rather than becoming zero when all classified records are excluded. Regression tests assert proof/salary exclusion, unchanged legacy spending totals, unknown covered duration, unchanged amounts/source/period and preserved financing assessment.

The `study-living-funds-budget` child uses the existing `compareFinancial` path on `profile.evidence.routes['de-masters-study'].financial`, kind `balance`, currency `EUR`. The general `Profile.budget` is USD and is neither reinterpreted as EUR nor converted. Income, assets, fees and other routes' balances cannot substitute. The amount comes from the attached pilot's existing EUR balance row and its dated claim source; no new amount or year-one cost is introduced. This is screening against the recorded blocked-account alternative, not a complete assessment of scholarships or declarations of commitment.

An insufficient comparable balance is `unmet`; missing/invalid balance or currency mismatch is `unknown`. The amount must uniquely match the immutable pilot financial row, including source metadata. A missing, changed, unsourced or ambiguous amount makes this budget child `unknown` while retaining the other master's checks; changes to claims/other audit metadata still disable stale projections. No threshold is guessed from prose, salaries or fees. Sufficient EUR balance makes only the budget comparison `met`: `study-financing-verification` remains `unknown` pending separate official document review. Missing or negative applicant financing assertions remain unknown/unmet respectively. Thus sufficient funds alone never complete the livelihood check or establish visa eligibility. Other stages, financial comparison semantics, catalog batches and the GUI remain unchanged.

Study is a possible first step in a conditional sequence, not a promise of employment, permanent residence, or citizenship. The first four source-backed exploratory records now live in `src/lib/data/study-pilot.ts`:

- `de-masters-study`
- `de-graduate-jobsearch`
- `nl-graduate-orientation-year`
- `fi-graduate-jobsearch`

They use the existing `Program` record shape and partial `SourceAudit`; they do not change the schema or mark any route fully verified. All four remain explicitly unverified overall. Evidence supports selected claims, not complete eligibility. These records are not eligible for Plan A while required profile, cost or transition evidence is incomplete. Continue to show unsupported costs and timings as `null`.

The accepted source ledger is in `research/poststudy-europe-2026-10-25.json` with notes in `research/poststudy-europe-notes.md`. Claims were checked on 25 October 2026. Germany's official Make it in Germany studying and post-graduation pages were retrieved directly by the primary reviewer and independently by the pilot researcher. The IND orientation-year page was directly retrieved by both. The Migri job-search page was directly retrieved by the pilot researcher on 25 October (14:37 UTC); a later primary-review retry received HTTP 403. Keep that reproducibility limitation visible: the accepted evidence is the successful official page retrieval, while a subsequent request was blocked. Do not turn the latter into a claim that Migri withdrew the rule or that the source is permanently unavailable.

The records reuse, only as contextual heuristics, the existing country baseline values already present in `src/lib/data/europe.ts`: Germany (`devScore: 10`, `azEase: 3`, `familyFriendly: 0.95`), Netherlands (`10`, `3`, `0.95` from `nl-hsm`), and Finland (`10`, `3`, `0.95` from `fi-specialist`). These are inherited country context, not newly researched or validated measurements of the study routes.

A later primary indexed cross-check found Migri's PR application/FAQ use **at least EUR 40,000** in the most recently completed tax assessment, excluding taxable social benefits, whereas its reform/period overview uses **over EUR 40,000**. The pilot narrative cites the latter overview and does not automate this PR income gate. For a boundary case, use the current application instructions and authority confirmation; the pilot is not a complete PR assessment. The Finnish higher-education path also distinguishes university bachelor's degrees from university-of-applied-sciences bachelor's degrees and has a language-study alternative. Do not infer full qualification from the generic profile credential.

## Current pilot route graph

Treat a study pathway as a sequence of separate applications and decisions:

```text
eligible institution + admission
        ↓ conditional: student-permit requirements, funds, insurance and approval
valid study status → successful, documented completion
        ↓ conditional: qualifying credential/research, filing window, proof and funds
post-study job-search/open-work permit
        ↓ conditional: separate work-status eligibility, offer/employer/salary/recognition
qualifying employment or business status
        ↓ conditional: the specific PR path, residence credits, income/work, language/integration
permanent residence
        ↓ conditional: independent nationality-law residence, presence, language and good-character rules
citizenship eligibility
```

The four records cover selected steps in that graph. The German master's record includes admission and student-permit evidence plus the post-completion handoff. The German graduate job-search record describes the later permit and separate employment/settlement branches. The Netherlands and Finland records describe their respective post-study permissions and later conditional branches. A generic `master's degree` is insufficient: institution recognition/designation, program type, location, cohort and graduation date can determine whether an applicant qualifies. No earlier permit automatically converts to the next status.

Durations have distinct clocks. Germany's 18-month job-search maximum begins with the relevant post-study permission; Germany's settlement path requires a later period in skilled employment plus contributions and other conditions. The Netherlands' three-year period is a window to apply after specified qualifying events, while its orientation permit lasts one year; permanent residence has separate requirements. Finland's five-year period is measured from expiry of the prior study/research permit, the look-for-work permission can be up to two years, and its 8 January 2026 PR reform created multiple separate application paths. Do not combine these into a calendar date or one “years to PR/passport” figure without the applicant's exact events, qualifying status history and current evidence.

## Batch and application workflow

The pilot is an explicit, versioned addition. Do not overwrite existing catalog records or prior review receipts. For a fresh database, setup must seed the four pilot records and their immutable receipt after the existing catalog batches, so clean setup and incremental application yield the same IDs and evidence.

Use the explicit commands:

```powershell
npm.cmd run catalog:study:plan
npm.cmd run catalog:study
npm.cmd run catalog:followup:plan
npm.cmd run catalog:followup
```

`catalog:study:*` applies the original four-record pilot. Any later evidence or correction uses a new follow-up batch through `catalog:followup:*`. Applied batch IDs/manifests are immutable: do not edit or reapply a changed manifest under an applied ID. A follow-up must append a new uniquely identified receipt, preserve prior source claims and audit history, and guard the target records against unexpected edits. Review the plan output and expected hashes before applying; keep receipts and source evidence in the project.

Do not promote these records to fully verified merely because a batch applies successfully. The implementation step records curated partial evidence; the catalog's source status remains partial/unverified. Missing evidence and `null` fields are intentional and must remain excluded from primary strategies.

## Financial outputs

Show evidence-backed tuition, living-funds proof, insurance, application fees, salary thresholds and dependant requirements as separate native-currency items, with period and source. The proof of funds is not necessarily a fee or a complete living-cost budget. The German €11,904 blocked-account amount is a funds-proof balance; the Dutch €3,122 monthly amount is a qualifying-employment salary criterion; the Finnish €800 monthly / €19,200 two-year amount is proof of living means; application fees are separate one-time charges. Never sum salary thresholds, proof-of-funds and fees into one required budget. Annual tuition varies by provider/program and remains unknown unless sourced for the exact case. No USD conversion, full first-year budget, or dependant total is supported by this pilot.

## Model distinct stages and transitions

Represent each legal status as its own pathway stage with source-backed requirements and a transition edge to the next possible stage:

1. **Admission and student permission:** admission to a named, eligible school and program; the permit application and decision; study location/mode; financial support; insurance; and any student work limits.
2. **Post-study job search or open work permission:** only available where the jurisdiction has a qualifying post-study route. Record the qualifying institution and credential, completion evidence, application window, permitted work, validity and whether extensions are possible.
3. **Qualifying employment permission:** a separate work-status application that may require a qualifying job offer, occupation, salary, recognition or licensing, employer sponsorship, and a switch before current status expires.
4. **Permanent residence:** a further application with its own qualifying residence period, permit history, work/income, language, integration, absence, and admissibility requirements.
5. **Citizenship:** a separate naturalization application and eligibility clock. Record physical presence, language/civics, good-character and other rules separately from PR and from application processing.

Each edge is conditional. Examples: `student permit → post-study permission` requires successful completion and application within the relevant window; `post-study permission → employment permission` requires meeting that work route's conditions; `employment/other residence → PR` requires completing the applicable residence and integration rules; `PR/residence → citizenship` requires satisfying the separate nationality law. A transition may be unavailable, missed, refused, or superseded by a rule change. Do not infer automatic conversion from holding an earlier permit.

## Record the facts that change eligibility

Capture these as structured, dated evidence so a profile can be matched to the actual program rather than to a country-level “student route” label:

- Institution identity, accreditation/designation and official register entry; eligible program/course identity, level, length, delivery mode, location, and whether the program remains eligible for the cohort's start date.
- Admission offer and enrollment status; course start/end dates; completion/graduation date and proof; any attendance, credits, research or placement requirements.
- Applicant age, prior education and language evidence where the rule requires them; regulated profession and credential recognition where relevant.
- Student-permit funds by category and period: tuition due, living-funds amount and duration, insurance, dependants' amounts, and liquid-funds evidence. Preserve native currencies and separate tuition from living funds and fees. Do not convert these into a guessed all-in relocation cost.
- For post-study permissions: qualifying credential and school, completion notification, filing deadline, allowed work/self-employment, validity clock, and status-switch procedure.
- For qualifying work: offer/employer/sponsor, eligible occupation, contract duration, pay currency and period, salary basis, licensing, labor-market test, and required prior study/work experience.
- For PR/citizenship: residence-credit rules for each permit class, lawful residence dates, physical-presence/absence limits, language/integration evidence, and application-processing evidence if available.

Store the effective date and observation date for every rule claim. A school or program's eligibility may depend on cohort, credential, location, or provider status at the time of study; retain evidence of which list/version was checked.

## Keep timing clocks separate

Do not add unrelated durations into one “years to passport” estimate. Maintain separate fields and events for:

- course duration and expected completion date;
- student-permit validity and extension window;
- post-study application window and maximum permission validity;
- employment permit start/expiry and qualifying residence start;
- PR qualifying residence period and PR processing time;
- citizenship eligibility date and citizenship processing time.

Only calculate a projected date when the source-backed transition prerequisites and the applicant's actual dates are known. Clearly distinguish a legal eligibility date from an estimated decision date. A student period counts toward PR only when the relevant rule says it does and the permit type/conditions match; never assume it counts or does not count universally.

## Financial outputs

Show evidence-backed tuition, living-funds, insurance, application-fee and dependent-funds requirements as separate native-currency items, with their period and source. The amount required to prove funds is not necessarily a fee or a full relocation budget. If annual tuition varies by institution or program, show the official range or leave it unresolved; do not substitute an unsupported single figure. Keep cost of study, cash proof, income/salary, and residence-investment capital as distinct concepts.

## Official sources and retrieval limits

These exact official pages support the selected dated claims in the pilot; they do not constitute a complete route audit. The full URLs, per-claim summaries, direct-page retrieval method and checked timestamps are in the JSON ledger.

| Country | Study permission source | Post-study source | Later-stage sources |
| --- | --- | --- | --- |
| Germany | [Make it in Germany: visa for studying](https://www.make-it-in-germany.com/en/visa-recognition/visa-types/studying) | [Make it in Germany: prospects after graduation](https://www.make-it-in-germany.com/en/study-vocational-training/studies-in-germany/prospects-after) | [EU Blue Card](https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card), [settlement permit](https://www.make-it-in-germany.com/en/visa-residence/living-permanently/settlement-permit) |
| United Kingdom | [GOV.UK: Student visa](https://www.gov.uk/student-visa) | [GOV.UK: Graduate visa](https://www.gov.uk/graduate-visa) |
| Canada | [IRCC: study permit](https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html) | [IRCC: post-graduation work permit](https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html) |
| Netherlands | [IND: student residence permit](https://ind.nl/en/residence-permits/study/student-residence-permit-for-university-or-higher-professional-education) | [IND: orientation year](https://ind.nl/en/residence-permits/work/residence-permit-for-orientation-year) | [IND: highly skilled migrant](https://ind.nl/en/residence-permits/work/highly-skilled-migrant), [salary amounts](https://ind.nl/en/required-amounts-income-requirements), [permanent residence](https://ind.nl/en/replace-extend-renew-and-change/permanent-residency/permanent-residence-permit) |
| Finland | [Migri: studies](https://migri.fi/en/studies) | [Migri: seeking work after graduation or research](https://migri.fi/en/application-for-students-and-researchers-residence-permit-to-look-for-work) | [Migri: degree completed in Finland](https://migri.fi/en/degree-completed-in-finland1), [2026 PR application paths](https://migri.fi/en/application-for-a-permanent-residence-permit) |
| Australia | [Department of Home Affairs: Student visa subclass 500](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500) | [Department of Home Affairs: Temporary Graduate visa subclass 485](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485) |

Additional official transition endpoints to inspect include [Canada's Canadian Experience Class](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/who-can-apply/canadian-experience-class.html), [Australia's skilled visa listings](https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list), and each jurisdiction's PR and nationality pages. These are navigation starting points; do not treat linked rules as reviewed merely because they are listed here.

## Future expansion

1. Expand to additional countries and credential cohorts only after separately checking current admission, student permission, post-study permission, qualifying employment, permanent residence and citizenship rules.
2. Add exact institution/program eligibility and cohort/version evidence where lists or accreditation change over time.
3. Independently verify every later-stage transition and keep retrieval method, effective/checked dates, exceptions and conflicting evidence with the claim.
4. Add representative eligible/ineligible cases for institutions, completion dates, application windows, dependants, status switches, gaps and residence-credit differences. Do not infer an applicant result from country alone.
5. Review local-currency display and missing-data behavior before calculating costs or dates. Keep unknowns null and benefits conditional.

## Product consistency

As these records are integrated into the mobile GUI, API and MCP, expose the same stage graph, source claims, check dates, native currencies, unresolved rules and status limitations. No client should present a conditional post-study transition as automatic. Preserve the distinction between a catalog route, a particular applicant's assessed evidence and a future projected timeline.
