import type {StudyMonthlyCost} from '../study-costs';

const sourceUrl='https://www.tk.de/en/contribution-foreign-students-german-health-insurance-2038022';
const source={
  reviewedAt:'2026-10-26T12:25:15Z',effectiveFrom:'2026-01-01',effectiveUntil:null,sourcePageDate:'2026-02-04',
  retrieval:'page',scope:'selected-tariff-claims',
  eligibilitySourceUrl:'https://www.tk.de/resource/blob/2195380/1b1c09f21c6c695da2fcde7741a0a750/beratungsblatt-krankenversichert-im-studium-2026-englisch-data.pdf',
} as const;
const base={
  programId:'de-masters-study',currency:'EUR',period:'monthly',sourceUrl,source,costGroup:'tk-student-health-care',
  description:'Combined TK student health and long-term care insurance; mutually exclusive monthly tariff, not proof of living funds.',
  classification:{purpose:'health-and-care-insurance',stage:'masters',coveredDuration:null,includeInExpenseTotal:true},
} as const;
const conditions={insurer:'TK',reviewedCalendarYear:2026,requiresConfirmedStudentTariff:true,requiresNoFreeFamilyInsurance:true,ageReviewFrom:30} as const;

/** New immutable cost edition; no edits to the original pilot or its proof/salary classifications. */
export const tkStudentCosts2026:readonly StudyMonthlyCost[]=[
  {...base,id:'tk-student-health-care-2026-lower',amount:141.16,
    conditions:{...conditions,branches:[
      {parenthood:'childless',careBand:'standard',minAge:0,maxAgeExclusive:23},
      {parenthood:'one-child',careBand:'standard',minAge:0,maxAgeExclusive:null},
    ]}},
  {...base,id:'tk-student-health-care-2026-childless-23-plus',amount:146.29,
    conditions:{...conditions,branches:[{parenthood:'childless',careBand:'childless-surcharge',minAge:23,maxAgeExclusive:null}]}},
];
