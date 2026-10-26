import {z} from 'zod';

/** Additive monthly-expense model; no totals and no changes to proof/salary records. */
export const studyMonthlyCostSchema=z.object({
  id:z.string().min(1),programId:z.literal('de-masters-study'),
  amount:z.number().finite().positive(),currency:z.literal('EUR'),period:z.literal('monthly'),
  description:z.string().min(1),sourceUrl:z.url(),costGroup:z.literal('tk-student-health-care'),
  classification:z.object({
    purpose:z.literal('health-and-care-insurance'),stage:z.literal('masters'),
    coveredDuration:z.null(),includeInExpenseTotal:z.literal(true),
  }).strict(),
  source:z.object({
    reviewedAt:z.iso.datetime(),effectiveFrom:z.iso.date(),effectiveUntil:z.iso.date().nullable(),
    sourcePageDate:z.iso.date(),retrieval:z.literal('page'),scope:z.literal('selected-tariff-claims'),
    eligibilitySourceUrl:z.url(),
  }).strict(),
  conditions:z.object({
    insurer:z.literal('TK'),reviewedCalendarYear:z.literal(2026),
    requiresConfirmedStudentTariff:z.literal(true),requiresNoFreeFamilyInsurance:z.literal(true),
    ageReviewFrom:z.literal(30),
    branches:z.array(z.object({
      parenthood:z.enum(['childless','one-child']),careBand:z.enum(['standard','childless-surcharge']),
      minAge:z.number().int().min(0),maxAgeExclusive:z.number().int().positive().nullable(),
    }).strict()).min(1),
  }).strict(),
}).strict();
export type StudyMonthlyCost=z.infer<typeof studyMonthlyCostSchema>;

/** Deliberately separate from Profile: dependents do not establish parenthood or insurance status. */
export const studentInsuranceContextSchema=z.object({
  programId:z.string().optional(),age:z.number().int().min(0).max(120).optional(),
  insurer:z.string().optional(),asOf:z.iso.date().optional(),
  parenthood:z.enum(['childless','one-child','multiple-children']).optional(),
  freeFamilyInsuranceEligible:z.boolean().optional(),
  studentTariffConfirmation:z.object({
    eligible:z.boolean(),careBand:z.enum(['standard','childless-surcharge']),validFrom:z.iso.date(),validUntil:z.iso.date(),
  }).strict().refine(value=>value.validFrom<=value.validUntil,'Invalid confirmation interval').optional(),
  ageLimitReviewConfirmed:z.boolean().optional(),
}).strict();
export type StudentInsuranceContext=z.infer<typeof studentInsuranceContextSchema>;
export type StudyCostSelection={status:'applicable'|'not-applicable'|'unknown';cost:StudyMonthlyCost|null;reason:string};

/** A conditional tariff lookup, not an insurance eligibility decision or a budget calculation. */
export function selectStudentInsuranceCost(records:readonly StudyMonthlyCost[],input:unknown):StudyCostSelection {
  const unknown=(reason:string):StudyCostSelection=>({status:'unknown',cost:null,reason});
  const notApplicable=(reason:string):StudyCostSelection=>({status:'not-applicable',cost:null,reason});
  const parsed=studentInsuranceContextSchema.safeParse(input);
  if(!parsed.success) return unknown('Insurance context is invalid or incomplete.');
  const context=parsed.data;
  if(context.programId!==undefined&&context.programId!=='de-masters-study') return notApplicable('Not the German masters route.');
  if(context.insurer!==undefined&&context.insurer!=='TK') return notApplicable('TK rates cannot be applied to another insurer.');
  if(context.freeFamilyInsuranceEligible===true) return notApplicable('Free family insurance takes precedence over this paid student tariff.');
  if(context.studentTariffConfirmation?.eligible===false) return notApplicable('Student tariff eligibility was not confirmed.');
  if(context.programId===undefined||context.age===undefined||context.insurer===undefined||context.asOf===undefined||
    context.parenthood===undefined||context.freeFamilyInsuranceEligible===undefined||!context.studentTariffConfirmation)
    return unknown('Age, insurer, date, parenthood and current student/family insurance confirmation are required.');
  const confirmation=context.studentTariffConfirmation;
  if(context.asOf<confirmation.validFrom||context.asOf>confirmation.validUntil) return unknown('Student tariff confirmation does not cover this date.');
  if(context.age>=30&&context.ageLimitReviewConfirmed!==true) return unknown('At 30 or older confirm current-semester coverage or an insurer-approved exception; age alone is insufficient.');
  if(context.parenthood==='multiple-children') return unknown('Multiple-child care contribution bands are outside these two recorded tariffs.');
  const validated=z.array(studyMonthlyCostSchema).safeParse(records);
  if(!validated.success) return unknown('Cost records are invalid.');
  const matches=validated.data.filter(record=>{
    const conditions=record.conditions;
    return context.asOf!>=record.source.effectiveFrom&&(!record.source.effectiveUntil||context.asOf!<=record.source.effectiveUntil)&&
      Number(context.asOf!.slice(0,4))===conditions.reviewedCalendarYear&&
      conditions.branches.some(branch=>branch.parenthood===context.parenthood&&branch.careBand===confirmation.careBand&&context.age!>=branch.minAge&&
        (branch.maxAgeExclusive===null||context.age!<branch.maxAgeExclusive));
  });
  if(matches.length!==1) return unknown('No uniquely applicable reviewed tariff for this date and age/parenthood band.');
  return {status:'applicable',cost:matches[0],reason:'Recorded TK monthly tariff matches the supplied current insurance confirmations; this is not an enrollment or visa decision.'};
}
