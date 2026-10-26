/**
 * Dated, partial evidence checklist for Germany work and graduate settlement stages.
 * This sidecar is descriptive and is not an applied catalog batch or eligibility engine.
 */

export const germanyStageReview = Object.freeze({
  id: 'germany-work-settlement-review-2026-10-26',
  reviewedAt: '2026-10-26',
  scope: 'selected official claims for qualified work and German graduate settlement',
  appliesToCatalog: false,
  appliedBatchId: null,
  reviewStatus: 'partial' as const,
  limitations: Object.freeze([
    'This is a selected checklist, not a complete permit or settlement assessment.',
    'Evidence values are applicant-reported facts only; an authority decision/document review remains manual and unknown.',
    'The general qualified-worker route does not require the job to relate to the qualification; EU Blue Card conditions are separate.',
    'The work checklist does not capture the first-time employment-permit age-over-45 salary/pension condition; verify whether it applies to the applicant.',
    'Dates, local procedures, regulated-profession licensing, and route-specific approvals require case-specific review.',
  ]),
});

export type GermanyWorkEvidenceKey =
  | 'qualifyingEmployment'
  | 'qualificationRecognised'
  | 'professionalLicenceOrNotRequired'
  | 'authorityApproval';

export type GermanySettlementEvidenceKey =
  | 'germanGraduation'
  | 'qualifyingTitleTwoYears'
  | 'pension24Months'
  | 'permittedEmployment'
  | 'livelihood'
  | 'germanB1'
  | 'civicKnowledge'
  | 'adequateHousing';

export type GermanyStageEvidence = Readonly<{
  work?: Partial<Record<GermanyWorkEvidenceKey, boolean>>;
  settlement?: Partial<Record<GermanySettlementEvidenceKey, boolean>>;
}>;

export type GermanyStageEvidenceFact = Readonly<{
  stage: 'work' | 'settlement';
  key: GermanyWorkEvidenceKey | GermanySettlementEvidenceKey;
  label: string;
  sourceUrl: string;
  reviewedAt: '2026-10-26';
  limitations: string;
}>;

const workSource = 'https://www.make-it-in-germany.com/en/visa-residence/types/work-qualified-professionals';
const settlementSource = 'https://www.make-it-in-germany.com/en/arriving-living/long-term/settlement-permit';
const reviewedAt = germanyStageReview.reviewedAt;

/**
 * Optional stage evidence keys, separate from Profile and its route fact namespace.
 * Boolean assertions never resolve the manual authority-review requirement.
 */
export const germanyStageEvidenceFacts = Object.freeze([
  Object.freeze({
    stage: 'work', key: 'qualifyingEmployment', label: 'Employment qualifies as skilled work',
    sourceUrl: workSource, reviewedAt,
    limitations: 'An offer alone is insufficient; the role must be qualified employment. The general qualified-worker route does not require the role to relate to the qualification; Blue Card has distinct requirements.',
  }),
  Object.freeze({
    stage: 'work', key: 'qualificationRecognised', label: 'Qualification is recognised or comparable',
    sourceUrl: workSource, reviewedAt,
    limitations: 'Recognition/comparability is route-specific and may need documentary assessment; this boolean is an applicant assertion, not an official equivalence decision.',
  }),
  Object.freeze({
    stage: 'work', key: 'professionalLicenceOrNotRequired', label: 'Required professional licence is held, or not required',
    sourceUrl: workSource, reviewedAt,
    limitations: 'Applies to regulated professions; the profession and licensing authority must be identified. A true value does not verify the licence.',
  }),
  Object.freeze({
    stage: 'work', key: 'authorityApproval', label: 'Any approval required for the chosen work status is confirmed',
    sourceUrl: workSource, reviewedAt,
    limitations: 'Approval is conditional on the selected route and facts; Federal Employment Agency approval is not a universal §18b requirement. The source also states an age-over-45 condition for a first work permit (salary or adequate pension provision); this checklist does not assess it. Authority review remains manual and unknown.',
  }),
  Object.freeze({
    stage: 'settlement', key: 'germanGraduation', label: 'Higher education was successfully completed in Germany',
    sourceUrl: settlementSource, reviewedAt,
    limitations: 'The facilitated graduate route requires completed German higher education or vocational training; retain the exact credential and completion evidence for authority review.',
  }),
  Object.freeze({
    stage: 'settlement', key: 'qualifyingTitleTwoYears', label: 'Eligible skilled-worker title held for at least two years',
    sourceUrl: settlementSource, reviewedAt,
    limitations: 'For the German-graduate track, the qualifying employment titles are §§18a, 18b, 18d or 18g. Student or job-search residence time is not interchangeable with this title period.',
  }),
  Object.freeze({
    stage: 'settlement', key: 'pension24Months', label: 'At least 24 months of statutory pension contributions paid',
    sourceUrl: settlementSource, reviewedAt,
    limitations: 'Keep contribution evidence and exact months; do not infer contribution periods from elapsed residence or employment dates.',
  }),
  Object.freeze({
    stage: 'settlement', key: 'permittedEmployment', label: 'Current job is permitted by the residence title',
    sourceUrl: settlementSource, reviewedAt,
    limitations: 'The current employment must be allowed by the applicant’s actual title; record the title and job evidence for authority review.',
  }),
  Object.freeze({
    stage: 'settlement', key: 'livelihood', label: 'Livelihood is secured',
    sourceUrl: settlementSource, reviewedAt,
    limitations: 'Evidence and household assessment are case-specific; a boolean does not verify income, benefits, dependants, or the authority’s livelihood determination.',
  }),
  Object.freeze({
    stage: 'settlement', key: 'germanB1', label: 'German language ability at B1 is demonstrated',
    sourceUrl: settlementSource, reviewedAt,
    limitations: 'Retain accepted certificate or other evidence and date; self-reported language ability is not document verification.',
  }),
  Object.freeze({
    stage: 'settlement', key: 'civicKnowledge', label: 'Basic legal and social knowledge is demonstrated',
    sourceUrl: settlementSource, reviewedAt,
    limitations: 'The federal guidance gives the “Living in Germany” test as a usual proof route; confirm accepted documents and any exception with the authority.',
  }),
  Object.freeze({
    stage: 'settlement', key: 'adequateHousing', label: 'Sufficient living space is available',
    sourceUrl: settlementSource, reviewedAt,
    limitations: 'The space requirement depends on household and local assessment; this record introduces no square-metre threshold.',
  }),
] as const satisfies readonly GermanyStageEvidenceFact[]);
