import { z } from "zod";

export const financialKindSchema = z.enum(["income", "balance", "assets", "investment", "fee"]);
const currencyCodes = new Set(Intl.supportedValuesOf("currency"));
const currencySchema = z.string().length(3).regex(/^[A-Z]{3}$/).refine(value => currencyCodes.has(value), "Expected an ISO 4217 currency code");
const amountSchema = z.number().finite().nonnegative().max(Number.MAX_SAFE_INTEGER);
const historySchema = z.number().int().nonnegative().max(1200);

const financialRecordSchema = z.object({
  kind: financialKindSchema,
  amount: amountSchema,
  currency: currencySchema,
  period: z.enum(["monthly", "annual"]).optional(),
  basis: z.enum(["gross", "net", "unspecified"]).optional(),
  historyMonths: historySchema.optional(),
}).strict();

function validateCategory(value: {kind: z.infer<typeof financialKindSchema>; period?: "monthly" | "annual"; basis?: string; historyMonths?: number; minHistoryMonths?: number}, ctx: z.RefinementCtx) {
  if (value.kind === "income") {
    if (!value.period) ctx.addIssue({code:"custom",path:["period"],message:"Income requires an explicit period."});
  } else {
    if (value.kind !== "fee" && value.period !== undefined) ctx.addIssue({code:"custom",path:["period"],message:"Only income and fees may specify a period."});
    if (value.basis !== undefined) ctx.addIssue({code:"custom",path:["basis"],message:"Only income may specify a basis."});
    if (value.historyMonths !== undefined) ctx.addIssue({code:"custom",path:["historyMonths"],message:"Only income may specify history."});
    if (value.minHistoryMonths !== undefined) ctx.addIssue({code:"custom",path:["minHistoryMonths"],message:"Only income may require history."});
  }
}

export const financialEvidenceSchema = financialRecordSchema.superRefine(validateCategory);
export const financialRequirementSchema = financialRecordSchema.extend({
  minHistoryMonths: historySchema.optional(),
}).strict().superRefine((value, ctx) => {
  validateCategory(value, ctx);
  if (value.kind === "income" && value.basis === undefined) ctx.addIssue({code:"custom",path:["basis"],message:"Income requirements require an explicit basis."});
});

export type FinancialEvidence = z.infer<typeof financialEvidenceSchema>;
export type FinancialRequirement = z.infer<typeof financialRequirementSchema>;
export type FinancialComparison = { status: "met" | "unmet" | "unknown"; reason: string };

/** Compare a single recorded threshold against applicant evidence without FX or category mixing. */
export function compareFinancial(requirement: FinancialRequirement, evidence: FinancialEvidence[]): FinancialComparison {
  const parsedRequirement = financialRequirementSchema.safeParse(requirement);
  if (!parsedRequirement.success) return { status: "unknown", reason: "Financial requirement is invalid or incomplete." };
  if (!Array.isArray(evidence)) return { status: "unknown", reason: "Financial evidence is missing or invalid." };
  const req = parsedRequirement.data;
  const parsed = evidence.map(item => financialEvidenceSchema.safeParse(item));
  if (parsed.some(item => !item.success)) return { status: "unknown", reason: "Some financial evidence is invalid or incomplete." };
  const valid = parsed.filter(item => item.success).map(item => item.data);
  const relevant = valid.filter(item => item.kind === req.kind);
  if (!relevant.length) return { status: "unknown", reason: `No ${req.kind} evidence was provided.` };

  const unresolved: string[] = [];
  let insufficientHistory = false;
  let completeComparisons = 0;
  for (const item of relevant) {
    if (item.currency !== req.currency) { unresolved.push(`Currency mismatch (${item.currency} versus ${req.currency}); FX conversion is not applied.`); continue; }
    let value = item.amount;
    if (req.kind === "fee" && item.period !== req.period) { unresolved.push("Fee periods do not match."); continue; }
    if (req.kind === "income") {
      if (!req.period || !item.period) { unresolved.push("Income period is missing."); continue; }
      if (!req.basis || !item.basis) { unresolved.push("Income gross/net basis is missing."); continue; }
      if (req.basis !== item.basis) { unresolved.push("Income gross/net basis does not match."); continue; }
      if (req.minHistoryMonths !== undefined) {
        if (item.historyMonths === undefined) { unresolved.push("Required income history evidence is missing."); continue; }
        if (item.historyMonths < req.minHistoryMonths) { insufficientHistory = true; completeComparisons++; continue; }
      }
      if (item.period !== req.period) value = item.period === "monthly" ? value * 12 : value / 12;
    }
    completeComparisons++;
    if (value >= req.amount) return { status: "met", reason: `${req.kind} evidence meets the ${req.amount} ${req.currency} requirement.` };
  }
  if (unresolved.length) return { status: "unknown", reason: unresolved[0] };
  if (!completeComparisons) return { status: "unknown", reason: "Evidence could not be compared with this requirement." };
  if (insufficientHistory) return { status: "unmet", reason: `Income history is shorter than the required ${req.minHistoryMonths} months.` };
  return { status: "unmet", reason: `Provided ${req.kind} evidence is below the ${req.amount} ${req.currency} requirement.` };
}
