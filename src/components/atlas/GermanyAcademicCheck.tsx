"use client";

import { useMemo, useState } from "react";
import { academicAdmissionRequestSchema, evaluateAcademicAdmission } from "@/lib/academic-admission";
import { germanyAcademicProgrammes } from "@/lib/data/germany-academic-programmes";

const QUALITATIVE = [
  { key: "relevantBachelor", label: "Relevant bachelor's degree" },
  { key: "degreeEquivalence", label: "Degree equivalence" },
  { key: "thesisScientificQuality", label: "Thesis scientific quality" },
  { key: "englishC1", label: "English C1 level" },
  { key: "acceptedEnglishProof", label: "Accepted English proof" },
] as const;
const CREDITS = [
  { key: "mathEctsReported", reference: "mathEvidenceReference", label: "Mathematics" },
  { key: "theoryEctsReported", reference: "theoryEvidenceReference", label: "Theoretical computer science" },
  { key: "programmingEctsReported", reference: "programmingEvidenceReference", label: "Programming" },
  { key: "thesisEctsReported", reference: "thesisEvidenceReference", label: "Thesis" },
] as const;
type QualitativeKey = typeof QUALITATIVE[number]["key"];
type CreditKey = typeof CREDITS[number]["key"];
type ReferenceKey = typeof CREDITS[number]["reference"];
type AcademicDraft = {
  qualitative: Record<QualitativeKey, "yes" | "no" | "unknown">;
  credits: Partial<Record<CreditKey, string>>;
  references: Partial<Record<ReferenceKey, string>>;
};
const blankAnswers = (): AcademicDraft => ({
  qualitative: { relevantBachelor: "unknown", degreeEquivalence: "unknown", thesisScientificQuality: "unknown", englishC1: "unknown", acceptedEnglishProof: "unknown" },
  credits: {}, references: {},
});

/** Session-only, programme-specific academic checklist. It never receives Profile. */
export function GermanyAcademicCheck({ asOf }: { asOf: string }) {
  const [programmeId, setProgrammeId] = useState("");
  const [intake, setIntake] = useState("");
  const [draft, setDraft] = useState<AcademicDraft>(blankAnswers);
  const selectedProgramme = germanyAcademicProgrammes.find(item => item.programmeId === programmeId);
  const computed = useMemo(() => {
    if (!programmeId || !intake) return { result: null, inputError: null as string | null };
    const evidence: Record<string, unknown> = { ...draft.qualitative };
    for (const item of CREDITS) {
      const value = draft.credits[item.key]?.trim();
      if (value !== undefined && value !== "") evidence[item.key] = Number(value);
      const reference = draft.references[item.reference]?.trim();
      if (reference) evidence[item.reference] = reference;
    }
    const input = { programmeId, intake, asOf, evidence };
    const parsed = academicAdmissionRequestSchema.safeParse(input);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const label = CREDITS.find(item => item.key === issue.path.at(-1))?.label;
      return { result: null, inputError: label ? `${label}: enter reported ECTS from 0 to 600.` : "Check the academic evidence values and references." };
    }
    return { result: evaluateAcademicAdmission(parsed.data), inputError: null };
  }, [asOf, draft, intake, programmeId]);

  const changeQualitative = (key: QualitativeKey, value: string) => {
    setDraft(current => ({ ...current, qualitative: { ...current.qualitative, [key]: value as "yes" | "no" | "unknown" } }));
  };
  const changeCredit = (key: CreditKey, value: string) => setDraft(current => ({ ...current, credits: { ...current.credits, [key]: value } }));
  const changeReference = (key: ReferenceKey, value: string) => setDraft(current => ({ ...current, references: { ...current.references, [key]: value } }));

  const result = computed.result;
  const effectiveSources = result?.programme?.sources ?? selectedProgramme?.sources ?? [];
  return <details className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.035]">
    <summary className="cursor-pointer list-none p-4 text-sm font-bold">Programme-specific academic requirements</summary>
    <div className="space-y-4 px-4 pb-4">
      <p className="text-xs leading-relaxed text-muted-foreground">This separate checklist compares applicant-reported academic details with one named programme's dated published criteria. It does not use profile education, English level, or visa-route facts. No document is uploaded or verified; positive answers remain pending university review. These answers stay in this page session.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-xs font-semibold">Programme<select aria-label="Academic programme" value={programmeId} onChange={event => { setProgrammeId(event.target.value); setIntake(""); }} className="mt-1 min-h-11 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2.5 text-base font-normal">
          <option value="">Choose a supported programme…</option>
          {germanyAcademicProgrammes.map(item => <option key={item.programmeId} value={item.programmeId}>{item.institution} · {item.programme}</option>)}
        </select></label>
        <label className="block text-xs font-semibold">Intake<select aria-label="Academic intake" value={intake} disabled={!selectedProgramme} onChange={event => setIntake(event.target.value)} className="mt-1 min-h-11 w-full rounded-xl border border-white/15 bg-slate-950 px-3 py-2.5 text-base font-normal disabled:opacity-50">
          <option value="">Choose an intake…</option>
          {selectedProgramme && <option value={selectedProgramme.intake}>{selectedProgramme.intake === "summer-2027" ? "Summer 2027" : selectedProgramme.intake}</option>}
        </select></label>
      </div>
      {!programmeId && <p className="rounded-xl border border-amber-300/20 p-3 text-xs text-amber-100">Unknown · choose the named programme and intake before a source-backed comparison is available.</p>}
      {programmeId && !intake && <p className="rounded-xl border border-amber-300/20 p-3 text-xs text-amber-100">Unknown · select an explicitly supported intake. No academic requirement is inferred from profile answers.</p>}

      {selectedProgramme && <>
        <div className="rounded-xl border border-white/10 p-3 text-xs"><p className="font-semibold">{selectedProgramme.institution} · {selectedProgramme.programme}</p><p className="mt-1 text-muted-foreground">Evidence reviewed {selectedProgramme.reviewedAt} · source status {selectedProgramme.reviewStatus}. This review is partial; admission is not guaranteed.</p></div>
        <fieldset className="space-y-2 rounded-xl border border-white/10 p-3"><legend className="px-1 text-xs font-bold">Applicant-reported academic facts</legend>
          {QUALITATIVE.map(item => <label key={item.key} className="grid grid-cols-1 items-center gap-1 text-xs sm:grid-cols-[1fr_11rem] sm:gap-3"><span>{item.label}</span><select aria-label={item.label} value={draft.qualitative[item.key]} onChange={event => changeQualitative(item.key, event.target.value)} className="min-h-11 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-2 text-base"><option value="unknown">Unknown</option><option value="yes">Applicant reports yes</option><option value="no">Applicant reports no</option></select></label>)}
        </fieldset>
        <fieldset className="space-y-3 rounded-xl border border-white/10 p-3"><legend className="px-1 text-xs font-bold">Reported prior-course ECTS</legend><p className="text-[11px] leading-relaxed text-muted-foreground">Enter the ECTS you believe are supported by your transcript or module descriptions. Comparisons are preliminary and do not determine equivalence.</p>
          {CREDITS.map(item => <div key={item.key} className="grid gap-2 rounded-lg border border-white/8 p-2.5 sm:grid-cols-[minmax(0,1fr)_9rem] sm:items-end">
            <label className="block text-xs">{item.label} ECTS reported<input aria-label={`${item.label} ECTS reported`} type="number" inputMode="decimal" min="0" max="600" step="any" value={draft.credits[item.key] ?? ""} onChange={event => changeCredit(item.key, event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-2 text-base" /></label>
            <label className="block text-xs sm:col-span-2">Evidence reference, optional<input aria-label={`${item.label} evidence reference`} maxLength={300} value={draft.references[item.reference] ?? ""} onChange={event => changeReference(item.reference, event.target.value)} placeholder="Transcript page or module title" className="mt-1 min-h-11 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-2 text-base" /></label>
          </div>)}
        </fieldset>
      </>}

      {computed.inputError && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/[0.06] p-3 text-xs text-rose-100">{computed.inputError}</p>}
        {result && <section aria-label="Academic comparison" className="space-y-3 rounded-xl border border-white/10 p-3">
        <div><h3 className="text-sm font-bold">Preliminary comparison</h3><p className="mt-1 text-xs text-amber-100">{result.overallStatus === "reported-gaps" ? "Reported gaps to review" : result.overallStatus === "unavailable" ? "Unavailable for this programme/intake/date" : "Unknown · institution review remains required"}. This is not an admission decision.</p></div>
        <p className="text-[10px] leading-relaxed text-muted-foreground">Sources reviewed {result.sourceDateScope.reviewedAt}. This checklist is available through {result.sourceDateScope.availabilityCutoff} under a product freshness policy only; that date is not an official source expiry or legal effective date. Selecting another as-of date does not refresh sources.</p>
        <ul className="space-y-2">{result.checks.map(check => <li key={check.id} className="rounded-lg bg-white/[0.03] p-2.5">
          <div className="flex flex-wrap justify-between gap-2"><span className="text-xs font-semibold">{check.label}</span><span className="text-[11px] text-amber-100">{check.status === "unmet" ? "Applicant-reported gap" : "Unknown pending review"}</span></div>
          {check.reportedValue !== null && <p className="mt-1 text-[11px] text-muted-foreground">Reported: {String(check.reportedValue)}{check.minimumEcts !== null ? ` ECTS · published minimum ${check.minimumEcts} ECTS` : ""}{check.reportedComparison === "reported-meets-minimum" ? " · reported amount reaches the published minimum; equivalence is unreviewed" : check.reportedComparison === "reported-below-minimum" ? " · below the published minimum" : ""}</p>}
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{check.reason}</p>
          {check.evidenceReference && <p className="mt-1 break-words text-[10px] text-muted-foreground">Applicant reference: {check.evidenceReference}</p>}
          {check.sourceId && effectiveSources.find(source => source.id === check.sourceId) && <a className="mt-1 inline-block break-all text-[10px] text-cyan-200 underline" href={effectiveSources.find(source => source.id === check.sourceId)!.sourceUrl} target="_blank" rel="noopener noreferrer">Programme criterion source · reviewed {effectiveSources.find(source => source.id === check.sourceId)!.checkedAt}</a>}
        </li>)}</ul>
        {result.missingActions.length > 0 && <div><h4 className="text-xs font-bold">Next checks</h4><ul className="mt-1 list-inside list-disc space-y-1 text-[11px] text-muted-foreground">{result.missingActions.map(action => <li key={action}>{action}</li>)}</ul></div>}
        {result.checks.some(check => check.kind === "manual") && <p className="rounded-lg bg-amber-300/[0.06] p-2.5 text-[11px] text-amber-100">Admission committee review remains unknown, even when reported values meet a published threshold.</p>}
      </section>}

      {selectedProgramme && <p className="rounded-lg bg-white/[0.03] p-2.5 text-[11px] leading-relaxed text-muted-foreground">Course categories must not double-count credits. Internship/practicum, thesis and graduation-project credits are excluded from the other prerequisite categories; thesis credits belong only in the separate thesis requirement. Foreign-credit conversion and course categorization remain for university review.</p>}
      {effectiveSources.length > 0 && <details className="border-t border-white/8 pt-2"><summary className="cursor-pointer text-xs font-semibold text-cyan-200">Official programme sources ({effectiveSources.length})</summary><ul className="mt-2 space-y-2">{effectiveSources.map(source => <li key={source.id} className="text-[11px]"><p>{source.summary}</p><a href={source.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block break-all text-cyan-200 underline">{source.topic} · reviewed {source.checkedAt.slice(0, 10)} · {source.contentRetrieved ? "page content retrieved" : "index retrieved; linked regulation text not reviewed"}</a><p className="mt-0.5 text-[10px] text-muted-foreground">{source.retrievalNote}</p></li>)}</ul></details>}
      {selectedProgramme?.limitations && <ul className="list-inside list-disc space-y-1 text-[10px] leading-relaxed text-muted-foreground">{selectedProgramme.limitations.map(item => <li key={item}>{item}</li>)}</ul>}
    </div>
  </details>;
}
