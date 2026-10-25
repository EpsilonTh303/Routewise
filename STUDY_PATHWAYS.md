# Future pathway research: study to work and residence

## Purpose

Study should be modeled as a possible first step in a conditional sequence, not as a promise of employment, permanent residence, or citizenship. This is a research and data-design proposal for a later catalog phase. It adds no routes and applies no eligibility rules to the current catalog.

Official government starting pages below were located on 25 October 2026. Treat them as research leads: exact dated claims, country-specific exceptions, and current application instructions still need a source review before implementation.

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

## Official starting links

These pages are leads for a later exact-claim review, not a statement that the requirements below them have been fully audited.

| Country | Study permission starting point | Post-study starting point |
| --- | --- | --- |
| Germany | [Make it in Germany: studying](https://www.make-it-in-germany.com/en/visa-residence/types/studying) | [Make it in Germany: stay after graduation](https://www.make-it-in-germany.com/en/staying-in-germany-after-studies) |
| United Kingdom | [GOV.UK: Student visa](https://www.gov.uk/student-visa) | [GOV.UK: Graduate visa](https://www.gov.uk/graduate-visa) |
| Canada | [IRCC: study permit](https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/study-permit.html) | [IRCC: post-graduation work permit](https://www.canada.ca/en/immigration-refugees-citizenship/services/study-canada/work/after-graduation.html) |
| Netherlands | [IND: student residence permit](https://ind.nl/en/residence-permits/study/student-residence-permit-for-university-or-higher-professional-education) | [IND: orientation year](https://ind.nl/en/residence-permits/work/residence-permit-for-orientation-year) |
| Finland | [Migri: studies](https://migri.fi/en/studies) | [Migri: seeking work after graduation or research](https://migri.fi/en/application-for-students-and-researchers-residence-permit-to-look-for-work) |
| Australia | [Department of Home Affairs: Student visa subclass 500](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500) | [Department of Home Affairs: Temporary Graduate visa subclass 485](https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/temporary-graduate-485) |

Additional official transition endpoints to inspect include [Canada's Canadian Experience Class](https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/express-entry/who-can-apply/canadian-experience-class.html), [Australia's skilled visa listings](https://immi.homeaffairs.gov.au/visas/working-in-australia/skill-occupation-list), and each jurisdiction's PR and nationality pages. These are navigation starting points; do not treat linked rules as reviewed merely because they are listed here.

## Bounded next-phase deliverables

1. Select a small pilot set of countries and one or two credential types per country; verify admission, student permission, post-study permission, qualifying work, PR and citizenship independently against current issuing-authority pages.
2. Define the versioned schema for stages, conditional transitions, dated claims, institution/program eligibility and separate finance/timing evidence. Keep existing route records unchanged until a distinct reviewed addition batch is ready.
3. Build a source ledger for every transition with retrieval method, effective date, checked date, unresolved alternatives and exact official URLs. Mark unverified stages/edges explicitly.
4. Add representative cases that test eligible/ineligible institutions, completion dates, application windows, dependants, switches, gaps between permits, and residence-credit differences. Do not infer eligibility from the country alone.
5. Review local-currency display and missing-data behavior before producing any cost or residence-date summary. Keep unknown values null and avoid presenting benefit as guaranteed.

## Product consistency

When study pathways are eventually added, show the same stage graph, source claims, check dates, currencies, unresolved rules and status limitations in the mobile GUI, API and MCP outputs. Ensure no client presents a conditional post-study transition as automatic. Preserve the distinction between a catalog route, a particular user's assessed evidence, and a future projected timeline.
