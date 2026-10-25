# Study-to-work pilot and future expansion

## Purpose

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
