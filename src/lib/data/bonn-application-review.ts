/** Dated, partial application-procedure metadata for Bonn MSc Computer Science. */

export type BonnApplicationSource = Readonly<{
  id: 'bonn-cs-application-page' | 'bonn-cs-deadlines-page';
  topic: string;
  sourceUrl: string;
  checkedAt: '2026-10-26';
  retrieval: 'direct-page' | 'official-indexed-result';
  contentRetrieved: boolean;
  retrievalNote: string;
}>;

export type BonnApplicationWindow = Readonly<{
  id: 'first' | 'second';
  startsOn: '2026-10-01' | '2026-12-15';
  endsOn: '2026-11-01' | '2027-01-15';
  programme: 'computer-science';
  group: 'no-extra-restriction-stated' | 'eea-students-only';
  boundarySemantics: 'date-only-start-end-inclusion-unknown';
  sourceId: 'bonn-cs-deadlines-page';
}>;

export type BonnApplicantGroup = Readonly<{
  id:
    | 'eea-citizen'
    | 'eea-degree-by-2027-03-31'
    | 'eea-family-member'
    | 'eea-selection-degree'
    | 'foreign-default'
    | 'selection-eea-citizenship'
    | 'selection-abitur-or-european-baccalaureate'
    | 'selection-german-residence-and-working-eea-family';
  context: 'application-window' | 'selection-classification';
  summary: string;
  evidenceNotes: string;
  sourceId: 'bonn-cs-application-page' | 'bonn-cs-deadlines-page';
  assignmentAlwaysManual: true;
}>;

export type BonnApplicationDocument = Readonly<{
  id:
    | 'degree-certificates-completed'
    | 'expected-completion-confirmation'
    | 'provisional-degree-certificate'
    | 'transcripts-all-enrolled-programmes'
    | 'aps-china-india-vietnam'
    | 'diploma-supplement-module-descriptions'
    | 'cv'
    | 'thesis-original-or-permitted-draft'
    | 'thesis-english-summary'
    | 'english-proof-non-europe-secondary-and-bachelor'
    | 'english-evidence-european-education'
    | 'motivation-letter'
    | 'translation-if-required'
    | 'degree-final-before-semester-start-conditional-admission';
  label: string;
  requirement: 'required' | 'conditional' | 'recommended' | 'optional';
  condition: string;
  summary: string;
  sourceId: 'bonn-cs-application-page';
  verificationAlwaysManual: true;
}>;

export type BonnApplicationReview = Readonly<{
  id: 'bonn-computer-science-msc-summer-2027-application';
  programmeId: 'bonn-computer-science-msc';
  institution: 'University of Bonn';
  programme: 'Master of Science in Computer Science';
  intake: 'summer-2027';
  reviewedAt: '2026-10-26';
  reviewStatus: 'partial';
  sources: readonly BonnApplicationSource[];
  applicationWindows: readonly BonnApplicationWindow[];
  applicantGroups: readonly BonnApplicantGroup[];
  documentRequirements: readonly BonnApplicationDocument[];
  limitations: readonly string[];
}>;

const sources = Object.freeze([
  Object.freeze({
    id: 'bonn-cs-application-page',
    topic: 'Institute of Computer Science application instructions',
    sourceUrl: 'https://www.informatik.uni-bonn.de/en/studies/master-programs/master-program-application',
    checkedAt: '2026-10-26',
    retrieval: 'direct-page',
    contentRetrieved: true,
    retrievalNote: 'Official English application page opened and retrieved. The page covers AI, Computer Science, and Cyber Security; this metadata records Computer Science-specific statements only.',
  }),
  Object.freeze({
    id: 'bonn-cs-deadlines-page',
    topic: 'Institute of Computer Science application deadlines',
    sourceUrl: 'https://www.informatik.uni-bonn.de/en/studies/examination-office/deadlines-at-a-glance',
    checkedAt: '2026-10-26',
    retrieval: 'official-indexed-result',
    contentRetrieved: false,
    retrievalNote: 'Official indexed search-result content stated the summer 2027 dates and EEA group definition; direct page retrieval timed out. It is not a directly reviewed page. No time zone, closing time, or endpoint inclusion was stated.',
  }),
] as const satisfies readonly BonnApplicationSource[]);

const applicationWindows = Object.freeze([
  Object.freeze({
    id: 'first',
    startsOn: '2026-10-01',
    endsOn: '2026-11-01',
    programme: 'computer-science',
    group: 'no-extra-restriction-stated',
    boundarySemantics: 'date-only-start-end-inclusion-unknown',
    sourceId: 'bonn-cs-deadlines-page',
  }),
  Object.freeze({
    id: 'second',
    startsOn: '2026-12-15',
    endsOn: '2027-01-15',
    programme: 'computer-science',
    group: 'eea-students-only',
    boundarySemantics: 'date-only-start-end-inclusion-unknown',
    sourceId: 'bonn-cs-deadlines-page',
  }),
] as const satisfies readonly BonnApplicationWindow[]);

const applicantGroups = Object.freeze([
  Object.freeze({
    id: 'eea-citizen',
    context: 'application-window',
    summary: 'For the summer 2027 second application window, citizens of an EEA member state count as EEA students. EEA here means the European Union, Iceland, Liechtenstein, and Norway.',
    evidenceNotes: 'Citizenship and documentary proof are self-reported unless reviewed by Bonn; the applicable deadline group remains manual.',
    sourceId: 'bonn-cs-deadlines-page',
    assignmentAlwaysManual: true,
  }),
  Object.freeze({
    id: 'eea-degree-by-2027-03-31',
    context: 'application-window',
    summary: 'For the summer 2027 second application window, students who will have completed a Bachelor\'s or Master\'s degree at an EEA university by 31 March 2027 also count as EEA students.',
    evidenceNotes: 'This is a degree-location and completion-date rule, not a citizenship rule. Degree location, award/completion timing, and evidence require manual review.',
    sourceId: 'bonn-cs-deadlines-page',
    assignmentAlwaysManual: true,
  }),
  Object.freeze({
    id: 'eea-family-member',
    context: 'application-window',
    summary: 'Family members of EEA citizens may also count as EEA students for the summer 2027 second application window.',
    evidenceNotes: 'The indexed deadline-page content refers applicants to the application form or §1(2) VergabeVO NRW for details. Those conditions and the legal provision were not reviewed; never infer this group from a family relationship alone.',
    sourceId: 'bonn-cs-deadlines-page',
    assignmentAlwaysManual: true,
  }),
  Object.freeze({
    id: 'eea-selection-degree',
    context: 'selection-classification',
    summary: 'The application page says everyone with a Bachelor\'s or higher degree from Germany or another EEA member state counts as German for selection.',
    evidenceNotes: 'Selection classification is distinct from citizenship and from the second-window EEA-student rule. Do not use this fact alone to assign second-window access.',
    sourceId: 'bonn-cs-application-page',
    assignmentAlwaysManual: true,
  }),
  Object.freeze({
    id: 'foreign-default',
    context: 'selection-classification',
    summary: 'In the absence of additional documents, the application page says an applicant is counted as a foreigner for selection classification.',
    evidenceNotes: 'This is the stated application-document default, not a finding about the person\'s citizenship, immigration status, or legal nationality.',
    sourceId: 'bonn-cs-application-page',
    assignmentAlwaysManual: true,
  }),
  Object.freeze({
    id: 'selection-eea-citizenship',
    context: 'selection-classification',
    summary: 'Where an applicant claims German/EEA selection classification without a Germany/EEA degree, Bonn lists proof of EEA citizenship as one possible route.',
    evidenceNotes: 'This is a selection-document route. It does not by itself decide family-member eligibility or any application-window date cutoff.',
    sourceId: 'bonn-cs-application-page',
    assignmentAlwaysManual: true,
  }),
  Object.freeze({
    id: 'selection-abitur-or-european-baccalaureate',
    context: 'selection-classification',
    summary: 'Where an applicant claims German/EEA selection classification without a Germany/EEA degree, Bonn lists an Abitur or European Baccalaureate as a possible proof route.',
    evidenceNotes: 'The application page lists this for selection classification only. It does not establish EEA-student eligibility for the second application window.',
    sourceId: 'bonn-cs-application-page',
    assignmentAlwaysManual: true,
  }),
  Object.freeze({
    id: 'selection-german-residence-and-working-eea-family',
    context: 'selection-classification',
    summary: 'Where an applicant claims German/EEA selection classification without a Germany/EEA degree, Bonn lists proof of German residence plus an EEA-citizen parent who has worked in Germany, or a German-resident EEA-citizen family member who works in Germany.',
    evidenceNotes: 'This is a selection-document route. The relationship, residence, citizenship, and employment facts must be assessed by Bonn; it does not by itself assign the second-window EEA-student group.',
    sourceId: 'bonn-cs-application-page',
    assignmentAlwaysManual: true,
  }),
] as const satisfies readonly BonnApplicantGroup[]);

const documentRequirements = Object.freeze([
  Object.freeze({
    id: 'degree-certificates-completed',
    label: 'Certificates for completed degrees',
    requirement: 'required',
    condition: 'For every completed Bachelor\'s and Master\'s programme.',
    summary: 'Upload the degree certificates for all completed Bachelor\'s and Master\'s programmes. If the degree is complete but the final certificate has not been issued, use the provisional-certificate branch.',
    sourceId: 'bonn-cs-application-page',
    verificationAlwaysManual: true,
  }),
  Object.freeze({
    id: 'expected-completion-confirmation',
    label: 'Official proof of expected completion date',
    requirement: 'conditional',
    condition: 'Applicant is almost finished with a degree programme.',
    summary: 'Must be issued by the examination office or higher responsible authority. It must certify that remaining examinations, including a thesis, amount to no more than half a year of full-time study and can all be taken before the upcoming semester starts (31 March or 30 September). No probability-of-passing assessment is required. If thesis credits are absent from the transcript, state the expected thesis credits.',
    sourceId: 'bonn-cs-application-page',
    verificationAlwaysManual: true,
  }),
  Object.freeze({
    id: 'provisional-degree-certificate',
    label: 'Official provisional degree certificate',
    requirement: 'conditional',
    condition: 'Degree requirements are complete but the final certificate has not yet been issued.',
    summary: 'Must be issued by the examination office or higher responsible authority and explicitly state that every degree requirement is fulfilled. An advisor letter confirming thesis defense or a transcript listing credit totals alone is insufficient.',
    sourceId: 'bonn-cs-application-page',
    verificationAlwaysManual: true,
  }),
  Object.freeze({
    id: 'transcripts-all-enrolled-programmes',
    label: 'Current transcripts for all degree programmes',
    requirement: 'required',
    condition: 'Every programme in which the applicant is or was enrolled.',
    summary: 'Submit up-to-date transcripts for all degree programmes. If previously/currently enrolled in an unfinished Master\'s programme in Germany, include every exam taken, passed and failed.',
    sourceId: 'bonn-cs-application-page',
    verificationAlwaysManual: true,
  }),
  Object.freeze({
    id: 'aps-china-india-vietnam',
    label: 'APS Certificate of Authenticity',
    requirement: 'conditional',
    condition: 'Previous education was completed in China, India, or Vietnam.',
    summary: 'Upload the Certificate of Authenticity (APS certificate) issued by the German Academic Acknowledgement Bureau in the applicable country.',
    sourceId: 'bonn-cs-application-page',
    verificationAlwaysManual: true,
  }),
  Object.freeze({
    id: 'diploma-supplement-module-descriptions',
    label: 'Diploma supplement and module syllabus/handbook',
    requirement: 'recommended',
    condition: 'Recommended to explain grading system, credit system, and relevant module contents.',
    summary: 'Bonn strongly recommends documents explaining grading and credit systems and university-issued syllabi/module handbooks describing relevant transcript modules. The page does not present them as universally required.',
    sourceId: 'bonn-cs-application-page',
    verificationAlwaysManual: true,
  }),
  Object.freeze({
    id: 'cv',
    label: 'Curriculum vitae',
    requirement: 'required',
    condition: 'All applicants.',
    summary: 'Include relevant educational, professional, and other activities in reverse chronological order back to high school, and countries of residence longer than half a year in the prior five years, also in reverse chronological order.',
    sourceId: 'bonn-cs-application-page',
    verificationAlwaysManual: true,
  }),
  Object.freeze({
    id: 'thesis-original-or-permitted-draft',
    label: 'Bachelor\'s thesis in its original language',
    requirement: 'required',
    condition: 'All applicants; if unfinished, a specific proposal/incomplete-version alternative may apply.',
    summary: 'Upload the thesis in its original language. If not ready and solely authored by the applicant, Bonn can accept a proposal or incomplete version describing the scientific question, planned structure, and relevant literature in detail. A less detailed proposal may be submitted for a thesis being completed at a German university; a detailed proposal is recommended.',
    sourceId: 'bonn-cs-application-page',
    verificationAlwaysManual: true,
  }),
  Object.freeze({
    id: 'thesis-english-summary',
    label: 'Applicant-written English thesis summary',
    requirement: 'conditional',
    condition: 'Thesis is in a language other than English, French, or German.',
    summary: 'Submit an English summary written by the applicant, including the title page, scientific question, relevant literature, and most of the introduction, related-work section, and bibliography. Bonn says no official translation is required for this summary.',
    sourceId: 'bonn-cs-application-page',
    verificationAlwaysManual: true,
  }),
  Object.freeze({
    id: 'english-proof-non-europe-secondary-and-bachelor',
    label: 'Accepted English proficiency proof',
    requirement: 'conditional',
    condition: 'Applicant completed or is completing both secondary education and Bachelor\'s education outside Europe.',
    summary: 'Bonn accepts IELTS Academic ≥7.0, TOEFL ≥95 old scale or ≥5.0 new scale, Cambridge Advanced or higher, PTE ≥76, Oxford Test of English Advanced ≥141, LanguageCert Academic ≥75, TELC C1, UNIcert III, TOLIMO ≥620, or proof of at least three years of secondary or tertiary education in Australia, Canada, Ireland, New Zealand, the UK, or the US. IELTS, TOEFL, PTE, and TOLIMO validity must extend to semester start; TOLIMO may trigger separate speaking assessment. Medium of instruction alone is explicitly insufficient.',
    sourceId: 'bonn-cs-application-page',
    verificationAlwaysManual: true,
  }),
  Object.freeze({
    id: 'english-evidence-european-education',
    label: 'English certificate for education completed in Europe',
    requirement: 'recommended',
    condition: 'Secondary education or Bachelor\'s education was/is in Europe.',
    summary: 'Bonn recommends submitting any certificates that describe English proficiency. Bonn will assess whether it accepts them and may request additional proof. Do not assume an applicant-provided certificate or medium-of-instruction document is accepted.',
    sourceId: 'bonn-cs-application-page',
    verificationAlwaysManual: true,
  }),
  Object.freeze({
    id: 'motivation-letter',
    label: 'Motivation letter in the online form',
    requirement: 'required',
    condition: 'All applicants.',
    summary: 'Enter the letter in the corresponding form field, maximum 4,000 characters. The page asks the applicant to explain educational/professional choices and why Bonn is the next step; applicants with a previous German Master\'s should explain why a second degree is appropriate.',
    sourceId: 'bonn-cs-application-page',
    verificationAlwaysManual: true,
  }),
  Object.freeze({
    id: 'translation-if-required',
    label: 'Certified translation where required',
    requirement: 'conditional',
    condition: 'Document language is outside the language permissions specified for that document type.',
    summary: 'Application form must be completed in English or German. Degree certificates, transcripts, thesis examiners\' assessments, module descriptions, employment confirmations, and other certificates may currently be in Afrikaans, Catalan, Danish, Dutch, English, French, German, Italian, Norwegian, Portuguese, Spanish, or Swedish. Other documents may be in English, French, or German. Other-language documents require the original plus a translation into English, French, or German by a certified translator or the issuing university. Thesis remains in its original language and may separately require an English summary.',
    sourceId: 'bonn-cs-application-page',
    verificationAlwaysManual: true,
  }),
  Object.freeze({
    id: 'degree-final-before-semester-start-conditional-admission',
    label: 'Proof all degree requirements were met before semester start',
    requirement: 'conditional',
    condition: 'Bonn grants conditional admission before completion of the Bachelor\'s degree.',
    summary: 'All requirements still must be met before semester start. Within four months after the semester begins, provide a final or provisional degree certificate proving a graduation date before semester start; Bonn states that failure to do so leads to expulsion. Conditional admission and acceptance of proof are university decisions.',
    sourceId: 'bonn-cs-application-page',
    verificationAlwaysManual: true,
  }),
] as const satisfies readonly BonnApplicationDocument[]);

const limitations = Object.freeze([
  'Partial application-procedure metadata for University of Bonn MSc Computer Science, summer 2027. It is not an application-completeness determination, academic eligibility result, ranking, offer, or immigration assessment.',
  'The deadlines page was represented by official indexed content because direct retrieval timed out. No exact closing time, timezone, or start/end boundary inclusivity is available; retain date-only ranges with unknown cutoff semantics and recheck the current source and applicant portal.',
  'EEA window group, selection classification, family-member eligibility, completion dates, applicable personal deadline, official-document sufficiency, authenticity, translations, APS authenticity, and every Bonn acceptance decision are manual. Self-reports and document names never count as verified.',
  'The indexed source says family members of EEA citizens may qualify but points to the application form or §1(2) VergabeVO NRW for details. Neither was separately reviewed; family route remains unresolved.',
  'The first deadline phase had no extra group restriction stated in retrieved indexed content; it is not encoded as a proven rule that every person is eligible for that phase.',
  'A selection classification route (including Abitur/European Baccalaureate) must not be substituted for the separate EEA-student test governing the second application period.',
  'English-evidence conditions are keyed to Europe as worded by Bonn, not EEA. If location/category is ambiguous, preserve unknown and request manual assessment.',
  'All application documents are due by the applicable deadline unless Bonn explicitly indicates otherwise. Application deadlines depend on personal situation; portal visibility alone does not establish that a deadline is still open.',
  'Refresh this metadata against Bonn’s live official pages for any later intake.',
]);

/** Immutable source metadata only; applicant inputs never become university-verified facts. */
export const bonnApplicationReview = Object.freeze({
  id: 'bonn-computer-science-msc-summer-2027-application',
  programmeId: 'bonn-computer-science-msc',
  institution: 'University of Bonn',
  programme: 'Master of Science in Computer Science',
  intake: 'summer-2027',
  reviewedAt: '2026-10-26',
  reviewStatus: 'partial',
  sources,
  applicationWindows,
  applicantGroups,
  documentRequirements,
  limitations,
} as const satisfies BonnApplicationReview);
