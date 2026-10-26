import {z} from 'zod';
import type {Program,SourceFinancialRequirement} from './types';
import {studyPilotPrograms,studyPilotBatchId} from './data/study-pilot';
import {canonicalJson} from './canonical-json';

/** Classification of existing proof/salary records, not a new cost or source review. */
export const studyFinancialClassificationSchema=z.object({
  purpose:z.enum(['financing-proof','salary-threshold']),
  stage:z.enum(['masters','work-permit']),
  coveredDuration:z.object({unit:z.enum(['months','semesters','years']),count:z.number().int().positive()}).strict().nullable(),
  includeInExpenseTotal:z.literal(false),
}).strict().superRefine((value,ctx)=>{
  if(value.purpose==='financing-proof'&&value.stage!=='masters'||value.purpose==='salary-threshold'&&value.stage!=='work-permit')
    ctx.addIssue({code:'custom',message:'Financial purpose and journey stage must agree.'});
});
export type StudyFinancialClassification=z.infer<typeof studyFinancialClassificationSchema>;
export type ClassifiedStudyFinancialRequirement=SourceFinancialRequirement & {classification:StudyFinancialClassification|null};

/** Versioned sidecar: references immutable source rows without copying/changing their amounts. */
export const germanyStudyFinancialMetadata={
  id:'de-study-financial-classification-v1',
  programId:'de-masters-study',
  auditBatchId:studyPilotBatchId,
  items:[
    {sourceRow:0,classification:{purpose:'financing-proof',stage:'masters',coveredDuration:null,includeInExpenseTotal:false}},
    {sourceRow:1,classification:{purpose:'salary-threshold',stage:'work-permit',coveredDuration:null,includeInExpenseTotal:false}},
    {sourceRow:2,classification:{purpose:'salary-threshold',stage:'work-permit',coveredDuration:null,includeInExpenseTotal:false}},
  ],
} satisfies {id:string;programId:string;auditBatchId:string;items:{sourceRow:number;classification:StudyFinancialClassification}[]};

/** Read-only classified view. Unknown/edited source rows never inherit trusted metadata. */
export function classifyGermanyStudyFinances(program:Program):ClassifiedStudyFinancialRequirement[] {
  const original=studyPilotPrograms.find(item=>item.id===germanyStudyFinancialMetadata.programId);
  return (program.audit?.financialRequirements??[]).map(row=>{
    const entry=program.id===germanyStudyFinancialMetadata.programId&&program.audit?.batchId===germanyStudyFinancialMetadata.auditBatchId
      ?germanyStudyFinancialMetadata.items.find(item=>{
        const expected=original?.audit?.financialRequirements[item.sourceRow];
        return expected&&canonicalJson(expected)===canonicalJson(row);
      }):undefined;
    return {...row,classification:entry?studyFinancialClassificationSchema.parse(entry.classification):null};
  });
}
