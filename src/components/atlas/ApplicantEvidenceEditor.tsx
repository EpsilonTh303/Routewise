"use client";

import { useState } from "react";
import type { Profile } from "@/lib/types";
import { FACT_LABELS, routeEvidenceSchema, type ApplicantEvidence, type FactKey } from "@/lib/requirements";
import type { FinancialEvidence } from "@/lib/financial";

type RouteOption = { id: string; label: string; facts: FactKey[] };
const ROUTES: RouteOption[] = [
  {id:'de-masters-study',label:'Germany · Master’s study',facts:['studyAdmission','programmeLanguage','securedLivelihood']},
  {id:'de-graduate-jobsearch',label:'Germany · Graduate job search',facts:['germanDegree','healthCoverage','securedLivelihood','applicationWindow']},
  {id:'nl-graduate-orientation-year',label:'Netherlands · Graduate orientation year',facts:['qualifyingGraduate','applicationWindow']},
  {id:'fi-graduate-jobsearch',label:'Finland · Post-study job search',facts:['priorStudyPermit','qualifyingGraduate','applicationWindow','securedLivelihood']},
  { id: "br-vitem-xiv-nomad", label: "Brazil · Digital Nomad", facts: ["foreignRemoteContract"] },
  { id: "us-eb2", label: "United States · EB-2", facts: ["eb2Qualification", "localEmploymentContract", "laborCertification", "niwEndeavor"] },
  { id: "th-ltr-wealthy", label: "Thailand · LTR Wealthy Global Citizen", facts: ["healthCoverage"] },
  { id: "th-ltr-remote-standard", label: "Thailand · LTR Remote Professional", facts: ["foreignRemoteContract", "qualifyingEmployer", "healthCoverage"] },
  { id: "th-ltr-remote-degree", label: "Thailand · LTR Remote Professional (alternative)", facts: ["foreignRemoteContract", "qualifyingEmployer", "qualifyingRemoteAlternative", "healthCoverage"] },
  { id: "au-subclass-189", label: "Australia · Skilled Independent 189", facts: ["skilledAssessment", "pointsThreshold", "invitation"] },
  { id: "au-subclass-190", label: "Australia · Skilled Nominated 190", facts: ["skilledAssessment", "pointsThreshold", "invitation", "nomination"] },
  { id: "fi-specialist-permit", label: "Finland · Specialist", facts: ["localEmploymentContract", "specialistQualification"] },
  { id: "fi-eu-ict-permit", label: "Finland · Intra-company Transfer", facts: ["intraCompanyTransfer", "specialistQualification"] },
  { id: "ae-golden-professional", label: "UAE · Golden professional", facts: ["localEmploymentContract", "occupationalClassification", "workPermit"] },
  { id: "ae-green-skilled", label: "UAE · Green skilled employee", facts: ["localEmploymentContract", "occupationalClassification", "workPermit"] },
  { id: "ae-green-freelance", label: "UAE · Green freelance", facts: ["occupationalClassification", "workPermit"] },
];
const CURRENCIES = ["USD", "EUR", "AED", "BRL", "SAR"] as const;
const KINDS = ["income", "balance", "assets", "investment", "fee"] as const;
type DraftFinancial = Omit<FinancialEvidence, "amount"> & { amount: string };
function toDraft(evidence?: ApplicantEvidence): DraftFinancial[] {
  return (evidence?.financial ?? []).map(item => ({ ...item, amount: String(item.amount) }));
}

function parseFinancialDraft(draft: DraftFinancial[]): { rows: FinancialEvidence[]; error?: string } {
  const rows: FinancialEvidence[] = [];
  for (const row of draft) {
    if (row.amount.trim() === "") return { rows: [], error: "Enter an amount for each financial evidence row, or remove the incomplete row." };
    const amount = Number(row.amount);
    if (!Number.isFinite(amount) || amount < 0) return { rows: [], error: "Enter a valid non-negative amount." };
    if (row.kind === "income" && !row.period) return { rows: [], error: "Choose an income period or leave this evidence unknown." };
    rows.push(row.kind === "income"
      ? {
          kind: "income", amount, currency: row.currency, period: row.period!, ...(row.basis ? { basis: row.basis } : {}),
          ...(row.historyMonths !== undefined && String(row.historyMonths).trim() !== "" ? { historyMonths: Number(row.historyMonths) } : {}),
        }
      : { kind: row.kind, amount, currency: row.currency });
  }
  return { rows };
}

/** Optional, route-scoped evidence entry. General profile budget and education are never copied into it. */
export function ApplicantEvidenceEditor({ profile, onChange, onValidityChange }: { profile: Profile; onChange: (profile: Profile) => void; onValidityChange?: (valid: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const [routeId, setRouteId] = useState("");
  const [financialDraft, setFinancialDraft] = useState<DraftFinancial[]>([]);
  const [error, setError] = useState("");
  const route = ROUTES.find(item => item.id === routeId);
  const current = routeId ? profile.evidence?.routes[routeId] : undefined;
  const rows = current?.financial ?? [];

  const commit = (candidate: ApplicantEvidence) => {
    const parsed = routeEvidenceSchema.safeParse(candidate);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Check the route evidence fields.");
      onValidityChange?.(false);
      return;
    }
    setError("");
    onValidityChange?.(true);
    const routes = { ...(profile.evidence?.routes ?? {}), [routeId]: parsed.data };
    onChange({ ...profile, evidence: { routes } });
  };

  const updateFact = (key: FactKey, value: boolean | undefined) => {
    if (!routeId) return;
    const facts = { ...(current?.facts ?? {}) };
    if (value === undefined) delete facts[key]; else facts[key] = value;
    commit({ ...(current ?? {}), facts });
  };

  const addFinancial = () => {
    if (!routeId) return;
    const next: DraftFinancial[] = [...financialDraft, { kind: "income", amount: "", currency: "USD" }];
    setFinancialDraft(next);
    // Keep incomplete numeric drafts local; commit after a valid amount is entered.
    setError("Enter an amount for each financial evidence row, or remove the incomplete row.");
    onValidityChange?.(false);
  };

  const changeFinancial = (index: number, key: keyof DraftFinancial, value: string) => {
    const next = financialDraft.map((row, i) => i === index ? { ...row, [key]: value } : row);
    setFinancialDraft(next);
    const parsed = parseFinancialDraft(next);
    if (parsed.error) { setError(parsed.error); onValidityChange?.(false); return; }
    commit({ ...(current ?? {}), financial: parsed.rows });
  };

  const removeFinancial = (index: number) => {
    const next = financialDraft.filter((_, i) => i !== index);
    setFinancialDraft(next);
    const parsed = parseFinancialDraft(next);
    if (parsed.error) { setError(parsed.error); onValidityChange?.(false); return; }
    commit({ ...(current ?? {}), financial: parsed.rows });
  };

  const clearRoute = () => {
    if (!routeId) return;
    const routes = { ...(profile.evidence?.routes ?? {}) };
    delete routes[routeId];
    setFinancialDraft([]);
    setError("");
    onValidityChange?.(true);
    onChange({ ...profile, evidence: Object.keys(routes).length ? { routes } : undefined });
  };

  return <details className="rounded-2xl border border-white/10 bg-white/[0.03] p-4" open={open} onToggle={event => setOpen(event.currentTarget.open)}>
    <summary className="cursor-pointer select-none text-sm font-semibold text-white">Optional route evidence</summary>
    <div className="mt-4 space-y-4">
      <p className="text-xs leading-relaxed text-muted-foreground">Add documented facts for a specific route. General budget, income estimates, age, education and language answers are not copied here. Missing answers stay unknown; this editor does not determine approval.</p>
      <label className="block text-sm font-medium" htmlFor="evidence-route">Route</label>
      <select id="evidence-route" value={routeId} disabled={!!error} onChange={event => { const nextId=event.target.value; setRouteId(nextId); setFinancialDraft(toDraft(profile.evidence?.routes[nextId])); setError(""); onValidityChange?.(true); }} className="w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2.5 text-sm text-white disabled:opacity-50">
        <option value="">Choose a route…</option>
        {ROUTES.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
      </select>

      {route && <div className="space-y-5">
        {route.id === "us-eb2" && <fieldset className="space-y-2">
          <legend className="text-sm font-semibold">Requested EB-2 path</legend>
          <label className="block text-xs text-muted-foreground" htmlFor="eb2-path">Choose a review branch; NIW remains discretionary.</label>
          <select id="eb2-path" disabled={!!error} value={current?.eb2Path ?? ""} onChange={event => commit({ ...(current ?? {}), eb2Path: event.target.value ? event.target.value as "sponsored" | "niw-assessment" : undefined })} className="w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2.5 text-sm text-white disabled:opacity-50">
            <option value="">Unknown / not selected</option><option value="sponsored">Ordinary employer sponsorship</option><option value="niw-assessment">Request NIW assessment</option>
          </select>
        </fieldset>}

        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold">Route facts</legend>
          {route.facts.map(key => <div key={key} className="grid gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-[1fr_9rem] sm:items-center">
            <label htmlFor={`fact-${key}`} className="text-sm leading-snug">{FACT_LABELS[key]}</label>
            <select id={`fact-${key}`} disabled={!!error} value={current?.facts?.[key] === undefined ? "" : current.facts[key] ? "yes" : "no"} onChange={event => updateFact(key, event.target.value === "" ? undefined : event.target.value === "yes")} className="w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-2 text-sm text-white disabled:opacity-50">
              <option value="">Unknown</option><option value="yes">Yes, documented</option><option value="no">No / not met</option>
            </select>
          </div>)}
        </fieldset>

        <section className="space-y-3" aria-labelledby="financial-evidence-title">
          <div className="flex items-center justify-between gap-2"><h3 id="financial-evidence-title" className="text-sm font-semibold">Financial evidence</h3><button type="button" onClick={addFinancial} disabled={financialDraft.length >= 30} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-medium disabled:opacity-50">Add evidence</button></div>
          <p className="text-xs text-muted-foreground">Enter each balance, income, asset, investment or fee separately. Use the currency and income period/basis shown by your documents.</p>
          {financialDraft.map((row, index) => <fieldset key={index} className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 p-3 sm:grid-cols-3">
            <legend className="sr-only">Financial evidence {index + 1}</legend>
            <label className="text-xs">Type<select aria-label={`Financial evidence ${index + 1} type`} value={row.kind} onChange={event => changeFinancial(index, "kind", event.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2 py-2 text-sm text-white">{KINDS.map(kind => <option key={kind} value={kind}>{kind}</option>)}</select></label>
            <label className="text-xs">Amount<input aria-label={`Financial evidence ${index + 1} amount`} inputMode="decimal" type="number" min="0" step="any" value={row.amount} onChange={event => changeFinancial(index, "amount", event.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2 py-2 text-sm text-white" /></label>
            <label className="text-xs">Currency<select aria-label={`Financial evidence ${index + 1} currency`} value={row.currency} onChange={event => changeFinancial(index, "currency", event.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2 py-2 text-sm text-white">{CURRENCIES.map(currency => <option key={currency} value={currency}>{currency}</option>)}</select></label>
            {row.kind === "income" && <>
              <label className="text-xs">Period<select aria-label={`Financial evidence ${index + 1} period`} value={row.period ?? ""} onChange={event => changeFinancial(index, "period", event.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2 py-2 text-sm text-white"><option value="">Unknown</option><option value="monthly">Monthly</option><option value="annual">Annual</option></select></label>
              <label className="text-xs">Basis<select aria-label={`Financial evidence ${index + 1} gross or net`} value={row.basis ?? ""} onChange={event => changeFinancial(index, "basis", event.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2 py-2 text-sm text-white"><option value="">Unknown</option><option value="unspecified">Source does not specify gross/net</option><option value="gross">Gross</option><option value="net">Net</option></select></label>
              <label className="text-xs">History (months)<input aria-label={`Financial evidence ${index + 1} history months`} inputMode="numeric" type="number" min="0" max="1200" value={row.historyMonths ?? ""} onChange={event => changeFinancial(index, "historyMonths", event.target.value)} className="mt-1 w-full rounded-lg border border-white/15 bg-slate-950 px-2 py-2 text-sm text-white" /></label>
            </>}
            <button type="button" onClick={() => removeFinancial(index)} className="col-span-2 justify-self-start rounded-lg px-2 py-2 text-xs text-rose-300 underline sm:col-span-3">Remove evidence</button>
          </fieldset>)}
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
          <button type="button" onClick={clearRoute} className="rounded-lg px-2 py-2 text-xs text-rose-300 underline">Clear this route’s evidence</button>
          <span className="text-xs text-muted-foreground">Evidence remains optional and is scoped to this route.</span>
        </div>
        {error && <p role="alert" className="rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">{error} The invalid draft is not saved to the profile; finish or remove it before changing routes or generating a strategy.</p>}
        {rows.length > 0 && !error && <p className="text-xs text-emerald-200">{rows.length} financial evidence {rows.length === 1 ? "item" : "items"} saved for this route.</p>}
      </div>}
    </div>
  </details>;
}
