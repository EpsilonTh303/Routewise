"use client";

import { useMemo, useState } from "react";
import type { Program, Profile } from "@/lib/types";
import { buildGermanyStudyPlan, germanyStudyPlanRequestSchema, type GermanyStudyPlanInput } from "@/lib/germany-study-plan";
import { germanyStageEvidenceFacts } from "@/lib/data/germany-stage-review";
import { RequirementChecklist } from "./RequirementChecklist";
import { GermanyAcademicCheck } from "./GermanyAcademicCheck";

const CATEGORIES = [
  { key: "tuition", label: "Tuition", period: "Annual" },
  { key: "housing", label: "Housing including utilities", period: "Monthly" },
  { key: "living", label: "Living costs excluding housing and insurance", period: "Monthly" },
  { key: "insurance", label: "Health insurance", period: "Monthly" },
  { key: "semesterFees", label: "Semester fees", period: "Annual" },
  { key: "relocation", label: "Relocation", period: "One time" },
  { key: "permitFees", label: "Permit fees", period: "One time" },
] as const;
type Category = typeof CATEGORIES[number]["key"];
type QuoteDraft = { amount: string; description: string; sourceUrl: string; reviewedOn: string; coversTwelveMonths: boolean };
type QuoteDrafts = Partial<Record<Category, QuoteDraft>>;
const WORK_FACTS = germanyStageEvidenceFacts.filter(fact => fact.stage === "work");
const SETTLEMENT_FACTS = germanyStageEvidenceFacts.filter(fact => fact.stage === "settlement");
const blankQuote = (): QuoteDraft => ({ amount: "", description: "", sourceUrl: "", reviewedOn: "", coversTwelveMonths: false });
const today = () => new Date().toISOString().slice(0, 10);
const money = (amount: number | null) => amount === null ? "Not available" : new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 2 }).format(amount);
const statusLabel = (status: string) => ({ met: "Applicant reports met", unmet: "Applicant reports not met", unknown: "Needs evidence", unavailable: "Not modeled" }[status] ?? status);
const statusClass = (status: string) => status === "met" ? "text-emerald-200" : status === "unmet" ? "text-rose-200" : "text-amber-200";

/** A session-only planning view. Quotes are never copied into Profile or scoring. */
export function GermanyStudyPlan({ profile, programs, asOf = today() }: { profile: Profile; programs: Program[]; asOf?: string }) {
  const [drafts, setDrafts] = useState<QuoteDrafts>({});
  const [projectTwelveMonths, setProjectTwelveMonths] = useState(false);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [stageEvidence, setStageEvidence] = useState<{ work?: Record<string, boolean>; settlement?: Record<string, boolean> }>({});
  const { plan, inputError } = useMemo(() => {
    const quotes: Record<string, { amount: number; description: string; sourceUrl: string; reviewedOn: string; coversMonths?: 12 }> = {};
    let issue: string | null = null;
    for (const category of CATEGORIES) {
      const row = drafts[category.key];
      if (!row || !row.amount.trim() || !row.description.trim() || !row.sourceUrl.trim() || !row.reviewedOn) continue;
      const amount = Number(row.amount);
      let secureUrl = false;
      try { secureUrl = new URL(row.sourceUrl.trim()).protocol === "https:"; } catch { /* report the invalid source below */ }
      if (!Number.isFinite(amount) || amount < 0 || amount > 10_000_000 || row.description.trim().length > 300 || !secureUrl || !/^\d{4}-\d{2}-\d{2}$/.test(row.reviewedOn) || row.reviewedOn > asOf) {
        issue ??= `${category.label}: enter an amount from 0 to 10,000,000, a description of at most 300 characters, an HTTPS source, and a review date no later than ${asOf}.`;
        continue;
      }
      if (category.period === "Monthly" && !row.coversTwelveMonths) {
        issue ??= `${category.label}: confirm the quote covers 12 months before it can be included in the year-one estimate.`;
        continue;
      }
      quotes[category.key] = { amount, description: row.description.trim(), sourceUrl: row.sourceUrl.trim(), reviewedOn: row.reviewedOn,
        ...(category.period === "Monthly" ? { coversMonths: 12 as const } : {}) };
    }
    const request = {
      profile,
      asOf,
      stageEvidence: stageEvidence as unknown as GermanyStudyPlanInput["stageEvidence"],
      budget: { quotes, ...(projectTwelveMonths ? { monthlyProjectionMonths: 12 as const } : {}) },
    };
    const validated = germanyStudyPlanRequestSchema.safeParse(request);
    if (!validated.success) return { plan: buildGermanyStudyPlan(programs, { profile, asOf }), inputError: "Some planning inputs are invalid; correct them to include those answers." };
    return { plan: buildGermanyStudyPlan(programs, validated.data), inputError: issue };
  }, [asOf, drafts, profile, programs, projectTwelveMonths, stageEvidence]);
  const allStages = plan.journey.stages;

  const changeQuote = (category: Category, key: keyof QuoteDraft, value: string) => {
    setDrafts(current => ({ ...current, [category]: { ...blankQuote(), ...current[category], [key]: value } }));
  };
  const changeStageFact = (stage: "work" | "settlement", key: string, value: string) => {
    setStageEvidence(current => {
      const next = { ...(current[stage] ?? {}) };
      if (value === "") delete next[key]; else next[key] = value === "yes";
      return { ...current, [stage]: Object.keys(next).length ? next : undefined };
    });
  };

  return <section aria-label="Germany study plan" className="mb-8 rounded-3xl border border-emerald-300/20 bg-emerald-300/[0.04] p-4 sm:p-6">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-emerald-300">Germany · Study to settlement</p>
        <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">A conditional route plan</h2>
        <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted-foreground">These are separate applications with conditions at each stage. Applicant answers are not document verification; no stage or approval is guaranteed. No PR date is predicted. Current view date: {plan.asOf}.</p>
        {plan.limitations?.[0] && <p className="mt-1 max-w-3xl text-[10px] leading-relaxed text-amber-100/80">{plan.limitations[0]}</p>}
      </div>
      <span className="rounded-full border border-amber-300/25 px-3 py-1 text-xs font-semibold text-amber-100">Partial source coverage</span>
    </div>

    <GermanyAcademicCheck asOf={plan.asOf} />

    <ol className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {allStages.map((stage, index) => <li key={stage.id} className="min-w-0 rounded-2xl border border-white/10 bg-black/15 p-3 sm:p-4">
        <div className="flex items-start justify-between gap-2">
          <div><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Stage {index + 1}</p><h3 className="mt-1 text-sm font-bold">{stage.label}</h3></div>
          <span className={`shrink-0 text-[10px] font-bold ${statusClass(stage.status)}`}>{statusLabel(stage.status)}</span>
        </div>
        <details className="mt-3 border-t border-white/8 pt-2">
        <summary className="cursor-pointer text-[11px] font-semibold text-emerald-200">Review checks, actions and sources</summary>
        <ul className="mt-2 space-y-2">
          {stage.checks.map(check => <li key={check.id}><RequirementChecklist result={check} /></li>)}
        </ul>
        {stage.missingActions.length > 0 && <div className="mt-3 rounded-xl bg-amber-300/[0.06] p-2.5"><p className="text-[10px] font-bold uppercase tracking-wide text-amber-100">Next checks</p><ul className="mt-1 list-inside list-disc space-y-1 text-[11px] text-muted-foreground">{stage.missingActions.map(action => <li key={action}>{action}</li>)}</ul></div>}
        {stage.transitions.length > 0 && <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">Possible next stage{stage.transitions.length === 1 ? "" : "s"}: {stage.transitions.map(edge => `${edge.to.replaceAll("-", " ")}${edge.selected ? " (selected planning branch)" : ""}`).join("; ")}. A job offer or other conditions can change the path.</p>}
        {stage.id === "work-permit" && <details className="mt-3 border-t border-white/8 pt-2"><summary className="cursor-pointer text-[11px] font-semibold text-emerald-200">Optional work-stage self-check</summary><p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">These answers are for planning only. A competent authority must review the documents and permit conditions.</p><div className="mt-2 space-y-2">{WORK_FACTS.map(fact => <label key={fact.key} className="grid grid-cols-[1fr_7rem] items-center gap-2 text-[11px]"><span>{fact.label}</span><select aria-label={fact.label} value={stageEvidence.work?.[fact.key] === undefined ? "" : stageEvidence.work[fact.key] ? "yes" : "no"} onChange={event => changeStageFact("work", fact.key, event.target.value)} className="rounded-lg border border-white/15 bg-slate-950 px-2 py-1.5"><option value="">Unknown</option><option value="yes">Yes</option><option value="no">No</option></select></label>)}</div></details>}
        {stage.id === "permanent-residence" && <details className="mt-3 border-t border-white/8 pt-2"><summary className="cursor-pointer text-[11px] font-semibold text-emerald-200">Optional settlement self-check</summary><p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">Self-reported planning answers only. A separate settlement application and authority review are required; no PR date is predicted.</p><div className="mt-2 space-y-2">{SETTLEMENT_FACTS.map(fact => <label key={fact.key} className="grid grid-cols-[1fr_7rem] items-center gap-2 text-[11px]"><span>{fact.label}</span><select aria-label={fact.label} value={stageEvidence.settlement?.[fact.key] === undefined ? "" : stageEvidence.settlement[fact.key] ? "yes" : "no"} onChange={event => changeStageFact("settlement", fact.key, event.target.value)} className="rounded-lg border border-white/15 bg-slate-950 px-2 py-1.5"><option value="">Unknown</option><option value="yes">Yes</option><option value="no">No</option></select></label>)}</div></details>}
        <details className="mt-3 border-t border-white/8 pt-2">
          <summary className="cursor-pointer text-[11px] font-semibold text-emerald-200">Sources for this stage ({stage.claims.length})</summary>
          <ul className="mt-2 space-y-2">{stage.claims.map((claim, claimIndex) => <li key={`${claim.sourceUrl}-${claimIndex}`} className="text-[11px]">
            <p className="leading-relaxed">{claim.summary}</p><a className="mt-1 inline-block break-all text-emerald-300 underline" href={claim.sourceUrl} target="_blank" rel="noopener noreferrer">{new URL(claim.sourceUrl).hostname} · {claim.topic} · reviewed {claim.checkedAt.slice(0, 10)}{claim.retrieval === "official-index" ? " · indexed evidence" : ""}</a>
          </li>)}</ul>
        </details>
        {"supplementalReview" in stage && stage.supplementalReview && <details className="mt-3 border-t border-white/8 pt-2"><summary className="cursor-pointer text-[11px] font-semibold text-amber-100">Supplemental {stage.supplementalReview.reviewStatus} review · {stage.supplementalReview.reviewedAt}</summary><p className="mt-2 text-[10px] leading-relaxed text-muted-foreground">{stage.supplementalReview.id}. This checklist is not applied to the catalog and does not replace authority review.</p><ul className="mt-2 space-y-2">{stage.supplementalReview.claims.map((claim, claimIndex) => <li key={`${claim.sourceUrl}-${claimIndex}`} className="text-[11px]"><p>{claim.summary}</p><a className="mt-1 inline-block break-all text-emerald-300 underline" href={claim.sourceUrl} target="_blank" rel="noopener noreferrer">{new URL(claim.sourceUrl).hostname} · {claim.topic} · reviewed {claim.checkedAt.slice(0, 10)}</a></li>)}</ul><ul className="mt-2 list-inside list-disc space-y-1 text-[10px] text-muted-foreground">{stage.supplementalReview.limitations.map(item => <li key={item}>{item}</li>)}</ul></details>}
        </details>
      </li>)}
    </ol>

    <details className="mt-4 rounded-2xl border border-white/10 bg-black/15" open={budgetOpen} onToggle={event => setBudgetOpen(event.currentTarget.open)}>
      <summary className="cursor-pointer list-none p-4 text-sm font-bold">Personal year-one expense estimate · EUR</summary>
      <div className="space-y-4 px-4 pb-4">
        <p className="text-xs leading-relaxed text-muted-foreground">Optional quotes stay in this page session and do not change your profile, route score, or legal funds checks. Add an amount, description, HTTPS source and review date for each category. Monthly quotes must cover 12 months, and the separate projection assumption must also be selected. Housing includes utilities; living excludes housing and insurance. All seven categories are needed for a total. Dependant costs are not modeled.</p>
        {inputError && <p role="alert" className="rounded-xl border border-amber-300/25 bg-amber-300/[0.06] p-3 text-xs text-amber-100">{inputError}</p>}
        <label className="flex items-start gap-2 rounded-xl border border-white/8 p-3 text-xs"><input type="checkbox" checked={projectTwelveMonths} onChange={event => setProjectTwelveMonths(event.target.checked)} className="mt-0.5 accent-emerald-400" /><span>Assume a 12-month projection for monthly housing, living and insurance quotes.</span></label>
        <div className="grid gap-3 md:grid-cols-2">
          {CATEGORIES.map(category => {
            const row = drafts[category.key] ?? blankQuote();
            const hasValues = Boolean(row.amount.trim() || row.description.trim() || row.sourceUrl.trim() || row.reviewedOn || row.coversTwelveMonths);
            const quoteFieldsComplete = Boolean(row.amount.trim() && row.description.trim() && row.sourceUrl.trim() && row.reviewedOn);
            const incomplete = hasValues && (!quoteFieldsComplete || (category.period === "Monthly" && !row.coversTwelveMonths));
            return <fieldset key={category.key} className="min-w-0 space-y-2 rounded-xl border border-white/10 p-3">
              <legend className="px-1 text-xs font-bold">{category.label} <span className="font-normal text-muted-foreground">· {category.period}</span></legend>
              <label className="block text-[11px]">Amount, EUR<input aria-label={`${category.label} amount, EUR`} type="number" min="0" step="any" value={row.amount} onChange={event => changeQuote(category.key, "amount", event.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-2 text-sm" /></label>
              <label className="block text-[11px]">Description<input aria-label={`${category.label} description`} value={row.description} onChange={event => changeQuote(category.key, "description", event.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-2 text-sm" /></label>
              <label className="block text-[11px]">HTTPS source URL<input aria-label={`${category.label} source URL`} type="url" value={row.sourceUrl} onChange={event => changeQuote(category.key, "sourceUrl", event.target.value)} className="mt-1 w-full min-w-0 rounded-lg border border-white/15 bg-slate-950 px-2.5 py-2 text-sm" /></label>
              <label className="block text-[11px]">Reviewed on<input aria-label={`${category.label} reviewed on`} type="date" max={asOf} value={row.reviewedOn} onChange={event => changeQuote(category.key, "reviewedOn", event.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-2 text-sm" /></label>
              {category.period === "Monthly" && <label className="flex items-start gap-2 text-[10px]"><input type="checkbox" checked={row.coversTwelveMonths} onChange={event => setDrafts(current => ({ ...current, [category.key]: { ...blankQuote(), ...current[category.key], coversTwelveMonths: event.target.checked } }))} className="mt-0.5 accent-emerald-400" /><span>This quote covers 12 months.</span></label>}
              {incomplete && <p className="text-[10px] text-amber-200">Complete the quote fields{category.period === "Monthly" ? " and confirm 12-month coverage" : ""} before this quote is counted.</p>}
            </fieldset>;
          })}
        </div>
        <div className="rounded-xl border border-white/10 p-3" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-sm font-bold">Year-one estimate</h3><span className="text-xs text-amber-100">{plan.budget.status === "complete" ? "Complete quote set" : "Partial · no total"}</span></div>
          <p className="mt-1 text-xl font-extrabold">{plan.budget.total === null ? "Not available" : money(plan.budget.total)}</p>
          {plan.budget.total !== null && <p className="text-[11px] text-muted-foreground">Applicant-entered estimates; this is not a required funds threshold or official cost figure.</p>}
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {plan.budget.items.map(item => <li key={item.category} className="rounded-lg bg-white/[0.03] p-2 text-xs">
              <div className="flex justify-between gap-2"><span className="font-semibold">{CATEGORIES.find(category => category.key === item.category)?.label ?? item.category}</span><span>{item.yearOneAmount === null ? "Unknown" : money(item.yearOneAmount)}</span></div>
              {item.description && <p className="mt-1 text-[10px] text-muted-foreground">{item.description}</p>}
              {item.sourceUrl && <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block break-all text-[10px] text-emerald-300 underline">Quote source · reviewed {item.reviewedOn}</a>}
            </li>)}
          </ul>
          {plan.budget.missingCategories.length > 0 && <p className="mt-2 text-xs text-amber-100">Missing quote categories: {plan.budget.missingCategories.map(key => CATEGORIES.find(category => category.key === key)?.label ?? key).join(", ")}.</p>}
          {plan.budget.dependentsIncomplete && <p className="mt-2 text-xs text-amber-100">Dependent costs remain unknown and are not included.</p>}
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <div><h4 className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Separate proof amounts</h4><ul className="mt-1 space-y-1 text-[11px]">{plan.budget.proofItems.map((item, index) => <li key={`${item.label}-${index}`}><span>{item.label}: {money(item.amount)} · {item.classification}</span><a className="ml-1 text-emerald-300 underline" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Source</a></li>)}</ul></div>
            <div><h4 className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">Excluded stage thresholds</h4><ul className="mt-1 space-y-1 text-[11px]">{plan.budget.excludedItems.map((item, index) => <li key={`${item.label}-${index}`}><span>{item.label}: {money(item.amount)} · {item.classification}</span><a className="ml-1 text-emerald-300 underline" href={item.sourceUrl} target="_blank" rel="noopener noreferrer">Source</a></li>)}</ul></div>
          </div>
          {plan.budget.insuranceReference && <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">{plan.budget.insuranceReference.reason} {plan.budget.insuranceReference.monthlyAmount !== null && <>Reference: {money(plan.budget.insuranceReference.monthlyAmount)}/month.</>} {plan.budget.insuranceReference.sourceUrl && <a className="text-emerald-300 underline" href={plan.budget.insuranceReference.sourceUrl} target="_blank" rel="noopener noreferrer">TK tariff source</a>} <span className="text-amber-100">The TK tariff is not automatically applied; confirm your current insurer quote.</span></p>}
          <details className="mt-3 border-t border-white/8 pt-2"><summary className="cursor-pointer text-[11px] font-semibold text-muted-foreground">Assumptions and source limits</summary><ul className="mt-2 list-inside list-disc space-y-1 text-[10px] leading-relaxed text-muted-foreground">{plan.budget.assumptions.map(item => <li key={item}>{item}</li>)}{plan.budget.limitations.map(item => <li key={item}>{item}</li>)}</ul></details>
        </div>
      </div>
    </details>
  </section>;
}
