import type {Journey,JourneyCondition} from '../journey';
import {studyPilotBatchId} from './study-pilot';

const study='de-masters-study',search='de-graduate-jobsearch';
const condition=(id:string,programId:string,claimTopic:string,evidence:JourneyCondition['evidence']):JourneyCondition=>({
  id,source:{programId,auditBatchId:studyPilotBatchId,claimTopic},evidence,
});
const manual=[{kind:'manual',label:'Review the referenced partial claim and supporting documents with the competent authority.'}] as const;
const completion=condition('completion-and-search',search,'18-month post-study permit',[
  {kind:'fact',programId:search,fact:'germanDegree'},
  {kind:'fact',programId:search,fact:'healthCoverage'},
  {kind:'fact',programId:search,fact:'securedLivelihood'},
  ...manual,
]);
const work=condition('separate-work-status',search,'separate work status',[...manual]);
const settlement=condition('separate-settlement',search,'separate settlement conditions',[...manual]);

/** First descriptive graph. All conditions retain the pilot's partial review scope.
 * Branches are possible application paths, never approval or automatic conversion.
 * No new thresholds, clocks, fact keys, catalog records or applicant results are added.
 */
export const germanyStudyJourney:Journey={
  version:1,id:'de-masters-to-residency',entryStageId:'masters',
  stages:[
    {id:'masters',kind:'masters',label:'Yüksek lisans',programIds:[study],
      conditions:[condition('study-entry',study,'study admission and 2026 living funds',[
        {kind:'fact',programId:study,fact:'studyAdmission'},
        {kind:'fact',programId:study,fact:'programmeLanguage'},
        {kind:'fact',programId:study,fact:'securedLivelihood'},
        ...manual,
      ])],
      transitions:[
        {to:'graduate-job-search',jobOffer:'absent',conditions:[completion]},
        {to:'work-permit',jobOffer:'present',conditions:[
          condition('completed-study',search,'18-month post-study permit',[
            {kind:'fact',programId:search,fact:'germanDegree'},...manual,
          ]),work,
        ]},
      ],
    },
    {id:'graduate-job-search',kind:'graduate-job-search',label:'Mezuniyet sonrası iş arama',programIds:[search],
      conditions:[completion,condition('filing-window',study,'post-study transition',[{kind:'fact',programId:search,fact:'applicationWindow'},...manual])],
      transitions:[{to:'work-permit',jobOffer:'present',conditions:[work]}],
    },
    {id:'work-permit',kind:'work-permit',label:'Çalışma izni',programIds:[],
      conditions:[work],transitions:[{to:'permanent-residence',jobOffer:'any',conditions:[settlement]}],
    },
    {id:'permanent-residence',kind:'permanent-residence',label:'Kalıcı oturum',programIds:[],
      conditions:[settlement],transitions:[],
    },
  ],
};
