/** Source-backed, programme-specific academic checklist metadata. This is not an admissions decision. */

export type GermanyAcademicProgrammeSource = Readonly<{
  id: string;
  topic: string;
  summary: string;
  sourceUrl: string;
  checkedAt: '2026-10-26';
  retrieval: 'page';
  contentRetrieved: boolean;
  retrievalNote: string;
}>;

export type GermanyAcademicCreditRequirement = Readonly<{
  id: string;
  label: string;
  minimumEcts: 12 | 14 | 18;
  summary: string;
  sourceId: string;
  limitations: string;
}>;

export type GermanyAcademicManualRequirement = Readonly<{
  id: string;
  label: string;
  summary: string;
  sourceId: string;
  outcomeAlwaysManual: true;
}>;

export type GermanyAcademicProgrammeReview = Readonly<{
  id: 'bonn-computer-science-msc';
  programmeId: 'bonn-computer-science-msc';
  institution: 'University of Bonn';
  programme: 'Master of Science in Computer Science';
  intake: 'summer-2027';
  reviewedAt: '2026-10-26';
  reviewStatus: 'partial';
  sources: readonly GermanyAcademicProgrammeSource[];
  creditRequirements: readonly GermanyAcademicCreditRequirement[];
  manualRequirements: readonly GermanyAcademicManualRequirement[];
  limitations: readonly string[];
}>;

const sourceUrls = {
  overview: 'https://www.uni-bonn.de/en/studying/degree-programs/degree-programs-a-z/computer-science-msc',
  application: 'https://www.informatik.uni-bonn.de/en/studies/master-programs/master-program-application',
  regulations: 'https://www.uni-bonn.de/en/studying/during-your-studies/regulations_overview',
} as const;

const sources = Object.freeze([
  Object.freeze({
    id: 'bonn-cs-programme-overview',
    topic: 'Bonn Computer Science MSc overview',
    summary: 'Identifies the English-taught single-subject MSc and summarizes the relevant subject, C1 English, mathematical foundations, algorithm theory, programming/software/information-systems and scientific-thesis admission criteria.',
    sourceUrl: sourceUrls.overview,
    checkedAt: '2026-10-26',
    retrieval: 'page',
    contentRetrieved: true,
    retrievalNote: 'Official programme page content retrieved directly.',
  }),
  Object.freeze({
    id: 'bonn-cs-application-criteria',
    topic: 'Formal prerequisites and application evidence',
    summary: 'Detailed current Institute page: related bachelor degree recognized in Germany at bachelor level; 18 ECTS mathematics; 14 ECTS algorithms theory/complexity/formal languages; 18 ECTS programming/software technology/information systems; 12 ECTS scientific thesis; C1 English with conditional accepted-proof rules; documents and committee selection.',
    sourceUrl: sourceUrls.application,
    checkedAt: '2026-10-26',
    retrieval: 'page',
    contentRetrieved: true,
    retrievalNote: 'Official English application page content retrieved directly; the page covers multiple programmes, and only the Computer Science rules are represented here.',
  }),
  Object.freeze({
    id: 'bonn-cs-regulations-index',
    topic: 'Current examination-regulations index',
    summary: 'Official University index lists the PO 2023 regulation/amendment republication dated 13 July 2026 for the consecutive Computer Science, Artificial Intelligence and Cyber Security master programmes.',
    sourceUrl: sourceUrls.regulations,
    checkedAt: '2026-10-26',
    retrieval: 'page',
    contentRetrieved: false,
    retrievalNote: 'Index content was retrieved, but the linked bonndoc regulation document returned access denied and its text was not reviewed; the index is not evidence that the regulation clauses were read.',
  }),
] as const satisfies readonly GermanyAcademicProgrammeSource[]);

const creditRequirements = Object.freeze([
  Object.freeze({
    id: 'mathematical-foundations',
    label: 'Mathematical foundations',
    minimumEcts: 18,
    summary: 'At least 18 ECTS in topics such as logic, discrete structures, linear algebra, analysis, numerics, stochastics or geometry.',
    sourceId: 'bonn-cs-application-criteria',
    limitations: 'Applicant-entered credits are not accepted ECTS. Foreign-credit conversion and module categorization require academic review; this category must not be inferred from generic education or profile fields.',
  }),
  Object.freeze({
    id: 'algorithms-theory-complexity-formal-languages',
    label: 'Algorithms theory, complexity theory and formal languages',
    minimumEcts: 14,
    summary: 'At least 14 ECTS in theoretical foundations including algorithms/data structures (not programming), automata, graph theory, computability and computational complexity. Accompanying exercises/labs may count; practica, internships, theses and graduation projects do not.',
    sourceId: 'bonn-cs-application-criteria',
    limitations: 'Content and credit categorization require transcript/module-description review. Do not count programming, practica, internships, theses or graduation projects in this category.',
  }),
  Object.freeze({
    id: 'programming-software-information-systems',
    label: 'Programming, software technology and information systems',
    minimumEcts: 18,
    summary: 'At least 18 ECTS in specifically relevant modules. AI and graphics may count in this category; other prerequisite categories and hardware/operating-system subjects do not. Internships, theses and graduation projects do not count.',
    sourceId: 'bonn-cs-application-criteria',
    limitations: 'Content and credit categorization require transcript/module-description review. Prevent automatic double counting across categories.',
  }),
  Object.freeze({
    id: 'scientific-bachelors-thesis',
    label: 'Scientific bachelor’s thesis',
    minimumEcts: 12,
    summary: 'At least 12 ECTS for a thesis meeting Bonn’s scientific standard: research question within relevant literature, answered scientifically; usual publication standards; generally at least 750 lines of text, excluding code, input/output, bullet lists and tables.',
    sourceId: 'bonn-cs-application-criteria',
    limitations: 'Foreign graduation-project credit conversion may use a different, more generous factor. Credit equivalence and scientific quality are both manual; a completed thesis flag alone cannot satisfy the requirement.',
  }),
] as const satisfies readonly GermanyAcademicCreditRequirement[]);

const manualRequirements = Object.freeze([
  Object.freeze({
    id: 'recognized-related-bachelors-degree',
    label: 'Related bachelor-level degree is recognized as equivalent in Germany',
    summary: 'Bonn requires Computer Science or a related subject recognized in Germany as at least equivalent to a bachelor’s degree. Relatedness depends on the degree content; a CS degree alone is not sufficient without the required subject credits.',
    sourceId: 'bonn-cs-application-criteria',
    outcomeAlwaysManual: true,
  }),
  Object.freeze({
    id: 'scientific-thesis-review',
    label: 'Thesis meets scientific content and quality requirements',
    summary: 'Review thesis or permitted proposal/incomplete version, research question, literature context, scientific answer, text-length rule and foreign project-credit conversion.',
    sourceId: 'bonn-cs-application-criteria',
    outcomeAlwaysManual: true,
  }),
  Object.freeze({
    id: 'english-c1-proof-accepted',
    label: 'Accepted evidence demonstrates English at C1 or higher',
    summary: 'Bonn lists C1 and accepted certificates/education-system alternatives. Proof rules differ according to where secondary and bachelor studies occurred; a medium-of-instruction letter alone is not accepted.',
    sourceId: 'bonn-cs-application-criteria',
    outcomeAlwaysManual: true,
  }),
  Object.freeze({
    id: 'competitive-selection-and-offer',
    label: 'Examination Board ranking results in an admission offer for this intake',
    summary: 'Meeting formal prerequisites is not a seat offer. The Examination Board reviews eligibility, assigns the applicable applicant group, ranks qualified applicants and decides admission/conditional admission for the applied semester.',
    sourceId: 'bonn-cs-application-criteria',
    outcomeAlwaysManual: true,
  }),
] as const satisfies readonly GermanyAcademicManualRequirement[]);

const limitations = Object.freeze([
  'This is a partial, programme-specific academic checklist for Bonn MSc Computer Science, Summer 2027; it is not an admission decision or complete immigration route review.',
  'Missing evidence is unknown, never met. Applicant-reported credits, degree title, thesis completion or language ability do not establish Bonn acceptance.',
  'Degree equivalence/relatedness, foreign credit conversion, module-category allocation, thesis quality, accepted C1 proof, EEA applicant-group assignment, competitive ranking and offer remain manual/unknown.',
  'No GPA cut-off, selection points, application deadline or financial rule is implemented by this manifest.',
  'The official regulations index lists a 13 July 2026 PO 2023 republication; linked regulation text was access denied and remains unreviewed.',
  'Refresh all academic criteria and evidence rules against the official programme and application pages for later intakes.',
]);

/** Immutable metadata only; it does not mutate catalog records or assign positive admission states. */
export const germanyAcademicProgrammes = Object.freeze([
  Object.freeze({
    id: 'bonn-computer-science-msc',
    programmeId: 'bonn-computer-science-msc',
    institution: 'University of Bonn',
    programme: 'Master of Science in Computer Science',
    intake: 'summer-2027',
    reviewedAt: '2026-10-26',
    reviewStatus: 'partial',
    sources,
    creditRequirements,
    manualRequirements,
    limitations,
  }),
] as const satisfies readonly GermanyAcademicProgrammeReview[]);
