import type { Program } from "../types";

/** Evidence-backed study-to-post-study pilot. Partial reviews are not eligibility decisions. */
export const studyPilotBatchId = "study-pilot-2026-10-25-v1";
const checkedAt = "2026-10-25T17:42:10Z";
const deStudy = "https://www.make-it-in-germany.com/en/visa-recognition/visa-types/studying";
const deAfter = "https://www.make-it-in-germany.com/en/study-vocational-training/studies-in-germany/prospects-after";
const deBlue = "https://www.make-it-in-germany.com/en/visa-residence/types/eu-blue-card";
const dePr = "https://www.make-it-in-germany.com/en/visa-residence/living-permanently/settlement-permit";
const nlOrientation = "https://ind.nl/en/residence-permits/work/residence-permit-for-orientation-year";
const nlFees = "https://ind.nl/en/fees-costs-of-an-application";
const nlAmounts = "https://ind.nl/en/required-amounts-income-requirements";
const nlHsm = "https://ind.nl/en/residence-permits/work/highly-skilled-migrant";
const nlPr = "https://ind.nl/en/replace-extend-renew-and-change/permanent-residency/permanent-residence-permit";
const fiJob = "https://migri.fi/en/application-for-students-and-researchers-residence-permit-to-look-for-work";
const fiFees = "https://migri.fi/en/processing-fees-and-payment-methods";
const fiDegree = "https://migri.fi/en/degree-completed-in-finland1";
const fiPr = "https://migri.fi/en/application-for-a-permanent-residence-permit";
const fiPrChange = "https://migri.fi/en/-/amendments-to-provisions-on-permanent-residence-permits-enter-into-force-on-8-january-2026";

function audit(claims: NonNullable<Program["audit"]>["claims"], financialRequirements: NonNullable<Program["audit"]>["financialRequirements"] = [], unknownFields: NonNullable<Program["audit"]>["unknownFields"] = []): NonNullable<Program["audit"]> {
  return {
    batchId: studyPilotBatchId, status: "partial", reviewedAt: checkedAt, routeStatus: "open",
    claims, financialRequirements,
    limitations: ["Selected official claims only; this record is exploratory, not a legal eligibility decision or full route verification.", "Study admission/permit, post-study permission, qualifying work, permanent residence and citizenship are distinct conditional decisions. No transition is guaranteed.", "Tuition, insurance, dependants, full relocation cost and individual document/consular requirements are not fully reviewed; unsupported amounts and timelines remain null."],
    unknownFields,
  };
}
function claim(topic: string, summary: string, sourceUrl: string, retrieval: "page" | "official-index" = "page") {
  return { topic, summary, sourceUrl, checkedAt, retrieval } as const;
}

export const studyPilotPrograms: Program[] = [
  {
    id: "de-masters-study", country: "Germany", flag: "🇩🇪", region: "Western Europe",
    program: "German master's study residence route", category: "student",
    tagline: "Study at a state-recognised German higher education institution, then assess a separate post-graduation work-search permit.",
    minBudget: null, minMonthlyIncome: null, totalYearOneCost: null, costPerDependent: null,
    processingWeeks: null, yearsToPR: null, yearsToCitizenship: null,
    jobOfferRequired: false, remoteFriendly: false, familyFriendly: 0.95,
    passportAccess: "visa-required", devScore: 10, azEase: 3, languageBonus: ["German", "English"],
    requirements: [
      "Study-stage entry: obtain admission to a state-recognised German higher education institution; the exact master's admission, qualification equivalence and programme language requirements depend on the institution and course.",
      "For the student visa, third-country applicants must show means for living costs. The 2026 blocked-account amount is €11,904; scholarship or a declaration of commitment are alternative proof methods. This amount is financial proof, not tuition or a complete first-year budget.",
      "Some programmes require language proficiency, often B2 CEFR; confirm the selected programme's exact requirement.",
      "German study residence permits are usually initially issued for two years, with possible further two-year renewal if the degree is unfinished; not a guaranteed programme duration.",
      "During study, work rights are capped at 140 full days or 280 half days a year, or 20 hours weekly, with unlimited student part-time jobs described by the official site.",
      "After successful completion, third-country graduates may apply before their study permit expires for a distinct permit to seek qualified employment for up to 18 months. That post-study stage has separate proof of completion, health insurance and livelihood requirements.",
      "Graduation does not itself grant employment or settlement. A suitable job and a new skilled-worker or EU Blue Card permit are separate; PR is a later application with its own conditions."
    ],
    pros: ["Official 2026 living-funds proof amount is published and has alternatives to a blocked account.", "A successful German higher-education graduate can have up to 18 months after study to seek qualified work, with any occupation permitted during that search permit."],
    cons: ["Admission, degree recognition, language, tuition and funds are institution- and applicant-specific; this record does not estimate total study cost.", "A student permit is temporary and does not guarantee a qualifying post-study permit, job, work status or permanent residence.", "German language, regulated-profession recognition and labour-market fit may affect practical job prospects and later settlement."],
    url: deStudy,
    verification: { status: "unverified", checkedAt: null, sourceUrl: deStudy },
    audit: audit([
      claim("study admission and 2026 living funds", "Student visa requires admission to a state-recognised higher education institution and proof of living costs; blocked account at least €11,904 in 2026, scholarship or declaration of commitment also possible. Programme language conditions vary.", deStudy),
      claim("study permit and student work", "Study permits are usually initially two years; 140 full/280 half days yearly or 20 hours weekly work limits are stated.", deStudy),
      claim("post-study transition", "After successful completion, a third-country graduate may apply for up to 18 months to seek skilled employment; livelihood and health insurance proof required; any occupation may be worked during the search period.", deAfter),
      claim("work permit transition and Blue Card salary", "A qualifying offer permits a separate skilled-worker or EU Blue Card application. 2026 Blue Card salary is €50,700 gross annually generally; €45,934.20 for shortage occupations and recent graduates (within three years), with Federal Employment Agency approval where applicable.", deBlue),
      claim("PR after German higher education", "Graduates of German higher education may apply for settlement after at least two years on a skilled-worker employment residence permit, 24 months pension contributions, permitted job, B1 German, basic legal/social knowledge and adequate living space.", dePr),
    ], [
      { amount: 11904, currency: "EUR", period: "balance", description: "2026 minimum blocked-account proof for study living expenses; scholarship or declaration of commitment may be alternatives. Not tuition, a fee, or total relocation cost.", sourceUrl: deStudy },
      { amount: 50700, currency: "EUR", period: "annual", description: "2026 gross salary criterion for the EU Blue Card in general occupations; employment threshold, not a study fund requirement.", sourceUrl: deBlue },
      { amount: 45934.2, currency: "EUR", period: "annual", description: "2026 gross salary criterion for shortage occupations and qualifying graduates within three years; employment threshold, with BA approval where applicable.", sourceUrl: deBlue },
    ], ["minBudget", "minMonthlyIncome", "totalYearOneCost", "costPerDependent", "processingWeeks", "yearsToPR", "yearsToCitizenship"]),
  },
  {
    id: "de-graduate-jobsearch", country: "Germany", flag: "🇩🇪", region: "Western Europe",
    program: "German higher-education graduate job-search residence permit", category: "skilled",
    tagline: "After successful German university completion, apply for a time-limited permit to seek qualified employment.",
    minBudget: null, minMonthlyIncome: null, totalYearOneCost: null, costPerDependent: null,
    processingWeeks: null, yearsToPR: null, yearsToCitizenship: null,
    jobOfferRequired: false, remoteFriendly: false, familyFriendly: 0.95,
    passportAccess: "visa-required", devScore: 10, azEase: 3, languageBonus: ["German", "English"],
    requirements: [
      "The post-study route applies after successful completion of higher education in Germany. Degree-completion evidence, health insurance and ability to secure livelihood are required; confirm supporting documents with the competent foreigners authority.",
      "Apply for the appropriate new residence title before the current student permit expires. The permit can be granted for up to 18 months and is not renewable.",
      "During the search period, any type of job may be taken while seeking skilled employment; the aim of the permit is qualified work.",
      "Once a suitable qualified job is obtained, apply for a distinct skilled-worker residence permit or EU Blue Card. Blue Card requires recognized/comparable qualification, specific job offer of at least six months and applicable salary threshold; 2026 general threshold €50,700 gross/year, €45,934.20 for shortage fields or qualifying recent graduates (within three years), subject to applicable approval.",
      "A German graduate may later apply for a settlement permit after at least two years holding a skilled-worker employment permit, 24 months statutory pension contributions, permitted job, B1 German, basic legal/social knowledge and sufficient living space. This is not automatic and is separate from the 18-month job-search permit."
    ],
    pros: ["Up to 18 months to search; work may be performed in any occupation during the search period.", "A suitable offer may support transition into a skilled-worker status; recent German graduates may access the reduced Blue Card salary criterion when eligible."],
    cons: ["Successful German degree completion, insurance, livelihood evidence and timely application are prerequisites.", "The job-search permit is not renewable and does not itself convert when a job is found.", "Blue Card salary/occupation and permit conditions apply to the next status; settlement requires a separate application and further employment, contribution and integration conditions."],
    url: deAfter,
    verification: { status: "unverified", checkedAt: null, sourceUrl: deAfter },
    audit: audit([
      claim("18-month post-study permit", "After successful German higher education completion, up to 18 months to seek qualified work; proof of completion, health insurance and livelihood needed; any occupation permitted during job search; not renewable.", deAfter),
      claim("separate work status", "A suitable job offer supports applying separately for skilled-worker permit or EU Blue Card; Blue Card requires qualification, six-month job offer and current salary threshold.", deBlue),
      claim("2026 Blue Card salary thresholds", "General salary threshold €50,700 gross per year; €45,934.20 for shortage occupations or qualifying graduates in first three years after graduation, with BA approval where applicable.", deBlue),
      claim("separate settlement conditions", "German higher-education graduates may apply after at least two years on skilled-worker employment residence title and 24 months pension payments, alongside permitted employment, B1 German, basic legal/social knowledge and adequate housing.", dePr),
    ], [
      { amount: 50700, currency: "EUR", period: "annual", description: "2026 gross salary criterion for EU Blue Card in general occupations; not a job-search proof-of-funds requirement.", sourceUrl: deBlue },
      { amount: 45934.2, currency: "EUR", period: "annual", description: "2026 gross salary criterion for shortage occupations and qualifying graduates within three years; approval may apply.", sourceUrl: deBlue },
    ], ["minBudget", "minMonthlyIncome", "totalYearOneCost", "costPerDependent", "processingWeeks", "yearsToPR", "yearsToCitizenship"]),
  },
  {
    id: "nl-graduate-orientation-year", country: "Netherlands", flag: "🇳🇱", region: "Western Europe",
    program: "Netherlands orientation year for highly educated persons", category: "skilled",
    tagline: "A conditional one-year open-work permit for specified graduates and researchers, followed by a separate work-status application.",
    minBudget: null, minMonthlyIncome: null, totalYearOneCost: null, costPerDependent: null,
    processingWeeks: null, yearsToPR: null, yearsToCitizenship: null,
    jobOfferRequired: false, remoteFriendly: false, familyFriendly: 0.95,
    passportAccess: "visa-required", devScore: 10, azEase: 3, languageBonus: ["English", "Dutch"],
    requirements: [
      "Apply within three years of one of the specified qualifying events: accredited Dutch bachelor's/master's; Dutch post-master's of at least 10 months; listed Cultural Policy/development-cooperation programme; Erasmus Mundus Joint Master's; specified research in Netherlands; or master's/doctoral/post-master's at a designated foreign institution.",
      "For the foreign institution pathway, the top-200 test applies on graduation/promotion date in at least two of QS, THE and ShanghaiRanking; subject rankings must match the discipline. Nuffic evaluates foreign degrees (with stated Flemish exception), and additional language/education alternatives apply.",
      "The orientation-year permit lasts one year and cannot be extended. IND page states no income proof for this permit; application fee €254.",
      "Permit holder may work, intern, freelance, self-employ or do business without an employer work permit. During application, unrestricted work needs the specified evidence and an IND residence-endorsement sticker first.",
      "Finding a job does not automatically change status. Apply separately for a work permit such as highly skilled migrant; this needs a Dutch contract, IND-recognised sponsor, market-rate salary and required amount. The 2026 reduced HSM criterion is €3,122 gross/month excluding holiday allowance when its graduate/orientation-year conditions are met.",
      "Permanent residence is a separate later application. IND generally requires five consecutive years of valid residence, main residence, timely renewals, current non-temporary residence purpose, sufficient income, registration and civic integration (at least A2 or exemption). Do not infer a PR date from the orientation-year permit alone."
    ],
    pros: ["Unrestricted employment and self-employment during a qualifying permit year.", "No income proof is stated for the orientation-year application; eligible graduates may access a reduced HSM salary threshold for a subsequent qualifying job permit."],
    cons: ["Eligibility is narrow and date-sensitive; a foreign degree requires ranking, language and credential-evaluation checks.", "The permit lasts only one year and cannot be extended; a later job/work permit is a separate application.", "Settlement depends on a qualifying permit history and further conditions, not the orientation year alone."],
    url: nlOrientation,
    verification: { status: "unverified", checkedAt: null, sourceUrl: nlOrientation },
    audit: audit([
      claim("eligible cohorts and window", "Specified Dutch programmes, Erasmus Mundus, qualifying research and designated foreign graduate programmes can qualify within three years; foreign ranking, language and Nuffic requirements apply.", nlOrientation),
      claim("duration and work rights", "Permit lasts one year, not extendable; work, internship, freelance, self-employment and entrepreneurship allowed without employer work permit.", nlOrientation),
      claim("fee", "2026 orientation-year application fee is €254.", nlOrientation),
      claim("fee schedule", "IND lists €254 for a first orientation-year application or change of purpose.", nlFees),
      claim("separate HSM employment transition", "HSM requires contract, recognised sponsor and market-rate salary.", nlHsm),
      claim("2026 reduced HSM salary threshold", "Qualifying orientation-year graduates may use 2026 reduced criterion €3,122 gross/month excluding holiday allowance.", nlAmounts),
      claim("permanent residence", "General PR conditions include five consecutive years valid residence, main residence, timely extensions, current non-temporary permit, income, BRP registration and civic integration; exceptions can apply.", nlPr),
    ], [
      { amount: 254, currency: "EUR", period: "one-time", description: "IND 2026 orientation-year application fee.", sourceUrl: nlFees },
      { amount: 3122, currency: "EUR", period: "monthly", description: "2026 gross monthly salary criterion excluding holiday pay for qualifying highly skilled migrant graduate cases; an employment threshold, not funds to show.", sourceUrl: nlAmounts },
    ], ["minBudget", "minMonthlyIncome", "totalYearOneCost", "costPerDependent", "processingWeeks", "yearsToPR", "yearsToCitizenship"]),
  },
  {
    id: "fi-graduate-jobsearch", country: "Finland", flag: "🇫🇮", region: "Nordics & Baltics",
    program: "Finland post-study/research permit to look for work or start a business", category: "skilled",
    tagline: "A maximum two-year permit after Finnish study or qualifying research, with unrestricted work and separately assessed later status.",
    minBudget: null, minMonthlyIncome: null, totalYearOneCost: null, costPerDependent: null,
    processingWeeks: null, yearsToPR: null, yearsToCitizenship: null,
    jobOfferRequired: false, remoteFriendly: false, familyFriendly: 0.95,
    passportAccess: "visa-required", devScore: 10, azEase: 3, languageBonus: ["Finnish", "Swedish", "English"],
    requirements: [
      "Applicant has or had a Finnish residence permit for studies or research and completed a degree in Finland, finished qualifying research work, or completed a doctoral degree in Finland. National research-permit holders qualify only with a Finnish degree; EU Directive research permit holders may also qualify after finished research.",
      "Apply within five years from expiry of the prior study/research permit. First permit applications are filed abroad; extended permits are filed in Finland. A degree certificate expected within three months may be supplied after application subject to Migri's instructions.",
      "Must show at least €800/month for living costs; a full two-year request needs €19,200 available. This is proof of means, not a full cost estimate. Online application fee €750 first permit/€230 extension; paper €800/€430.",
      "Maximum permit length is two years, potentially in up to three parts; each part at least six months and final part must end within three years after the first part began.",
      "The permit carries unrestricted work regardless of study field. If an extended permit application is filed before existing status expires, Migri says work can begin after finding a job/starting a business; late filing does not give that interim right. First-permit work begins only after positive decision.",
      "A job does not by itself require a new permit while this permit remains valid; for continued stay on employment/business basis, apply for appropriate work-based status before expiry. Migri's degree-completed-in-Finland route is one separate option for someone with Finnish degree and job/business activity.",
      "Permanent residence is a separate assessment under rules effective 8 January 2026. Paths include (among others) six years continuous A-permit residence with two years Finnish work and B1 language; four years and annual income over €40,000; or a qualifying Finnish higher-education degree plus A2/developing Finnish/Swedish and other requirements. A previous two-year A permit on job-seeking/business grounds cannot itself be reused as that same PR basis. No settlement outcome is guaranteed."
    ],
    pros: ["Up to two years of unrestricted work regardless of study field.", "The five-year window and split-permit option can provide flexibility for graduates who leave and later return, subject to eligibility and timing conditions."],
    cons: ["Requires qualifying Finnish study/research permit history and Finnish completion; research rules vary by permit class.", "Funds threshold is material and varies with requested permit duration; fees vary by filing method and permit type.", "The post-study permit does not assure a work-based status or PR; Finnish PR rules changed in 2026 and depend on the selected application path and permit chronology."],
    url: fiJob,
    verification: { status: "unverified", checkedAt: null, sourceUrl: fiJob },
    audit: audit([
      claim("eligibility and window", "Prior Finnish study/research residence permit plus Finnish degree/research completion; research permit cohort affects qualification; apply within five years of prior permit expiry.", fiJob),
      claim("validity, split periods and work", "Maximum two years, up to three parts of at least six months, last ends within three years of first part start; unrestricted work regardless of study field.", fiJob),
      claim("proof of funds", "At least €800 monthly, €19,200 for two years.", fiJob),
      claim("application fees", "Online fees: €750 first permit/€230 extension; paper fees €800 first permit/€430 extension.", fiFees),
      claim("work-based transition", "Migri identifies a distinct degree-completed-in-Finland route for graduates who have job, trade or business activity; the look-for-work permit itself allows unrestricted work while valid.", fiDegree),
      claim("current permanent residence options", "2026-01-08 reform provides multiple PR paths, including six-year/A permit plus work/language, income path, and Finnish higher education plus language path; each has additional conditions.", fiPrChange),
      claim("Finnish higher-education PR path detail", "Qualifying Finnish higher education credential and developing A2 Finnish/Swedish are part of this path, alongside continued A permit, funds and other permanent-permit conditions.", fiPr),
    ], [
      { amount: 800, currency: "EUR", period: "monthly", description: "Migri minimum living resources per month for post-study look-for-work/start-business permit; proof of means, not a cost-of-living estimate.", sourceUrl: fiJob },
      { amount: 19200, currency: "EUR", period: "balance", description: "Funds available for the full two-year permit at €800/month, as stated by Migri.", sourceUrl: fiJob },
      { amount: 750, currency: "EUR", period: "one-time", description: "Online first-permit application fee.", sourceUrl: fiFees },
      { amount: 230, currency: "EUR", period: "one-time", description: "Online extended-permit application fee.", sourceUrl: fiFees },
      { amount: 800, currency: "EUR", period: "one-time", description: "Paper first-permit application fee.", sourceUrl: fiFees },
      { amount: 430, currency: "EUR", period: "one-time", description: "Paper extended-permit application fee.", sourceUrl: fiFees },
    ], ["minBudget", "minMonthlyIncome", "totalYearOneCost", "costPerDependent", "processingWeeks", "yearsToPR", "yearsToCitizenship"]),
  },
];
