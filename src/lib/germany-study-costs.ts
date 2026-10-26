import type {Program} from './types';
import {classifyGermanyStudyFinances} from './study-financial-classification';
import {studyMonthlyCostSchema} from './study-costs';
import {tkStudentCosts2026} from './data/tk-student-costs';

/** Additive cost-data view only: retain proof/salary rows separately from conditional expenses. */
export function getGermanyStudyCostData(program:Program) {
  if(program.id!=='de-masters-study'||program.country!=='Germany') return {financialRequirements:[],monthlyCosts:[]};
  return {
    financialRequirements:classifyGermanyStudyFinances(program),
    monthlyCosts:tkStudentCosts2026.map(cost=>studyMonthlyCostSchema.parse(cost)),
  };
}
