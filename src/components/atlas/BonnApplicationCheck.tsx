"use client";

import { useMemo, useState } from "react";
import { bonnApplicationRequestSchema, evaluateBonnApplication } from "@/lib/bonn-application";
import { bonnApplicationReview } from "@/lib/data/bonn-application-review";

type Answer = "yes" | "no" | "unknown";
type Report = "present" | "absent" | "unknown";
type GroupKey = "eeaCitizen" | "eeaUniversityDegreeBy2027March31" | "eeaFamilyMemberBasis" | "otherEeaEquivalentBasis";
type ApplicabilityKey = "priorEducationInApsCountry" | "translationRequired" | "bothSecondaryAndBachelorEducationOutsideEurope" | "thesisNeedsEnglishSummary";
type DegreeFactKey = "provisionalIssuedByExamOffice" | "provisionalStatesAllRequirementsFulfilled" | "expectedProofIssuedByExamOffice" | "expectedRemainingExamsAtMostHalfYear" | "expectedAllExamsBeforeSemesterStart" | "expectedThesisEctsStatedIfMissingFromTranscript";
type DocumentId = typeof bonnApplicationReview.documentRequirements[number]["id"];

const GROUP_FACTS: readonly { key: GroupKey; groupId: string; label: string }[] = [
  { key: "eeaCitizen", groupId: "eea-citizen", label: "Applicant reports EEA citizenship (EU, Iceland, Liechtenstein, or Norway)" },
  { key: "eeaUniversityDegreeBy2027March31", groupId: "eea-degree-by-2027-03-31", label: "Applicant reports a Bachelor’s or Master’s degree at an EEA university completed by 31 March 2027" },
  { key: "eeaFamilyMemberBasis", groupId: "eea-family-member", label: "Applicant reports a possible qualifying family-member basis" },
  { key: "otherEeaEquivalentBasis", groupId: "selection-eea-citizenship", label: "Applicant reports other EEA-equivalent selection evidence" },
];
const CONDITIONAL_FACTS: readonly { key: ApplicabilityKey; label: string }[] = [
  { key: "priorEducationInApsCountry", label: "Was previous education completed in China, India, or Vietnam?" },
  { key: "translationRequired", label: "Does any application document require translation under Bonn’s language rules?" },
  { key: "bothSecondaryAndBachelorEducationOutsideEurope", label: "Were both secondary and Bachelor’s education completed outside Europe?" },
  { key: "thesisNeedsEnglishSummary", label: "Is the thesis in a language other than English, French, or German?" },
];
const DEGREE_FACTS: readonly { key: DegreeFactKey; branch: "final-pending" | "expected-completion"; label: string }[] = [
  { key: "provisionalIssuedByExamOffice", branch: "final-pending", label: "Provisional certificate is issued by the examination office or responsible authority" },
  { key: "provisionalStatesAllRequirementsFulfilled", branch: "final-pending", label: "Provisional certificate states every degree requirement is fulfilled" },
  { key: "expectedProofIssuedByExamOffice", branch: "expected-completion", label: "Expected-completion proof is issued by the examination office or responsible authority" },
  { key: "expectedRemainingExamsAtMostHalfYear", branch: "expected-completion", label: "Remaining exams total at most half a full-time study year" },
  { key: "expectedAllExamsBeforeSemesterStart", branch: "expected-completion", label: "Remaining exams, including thesis, can be completed before semester start" },
  { key: "expectedThesisEctsStatedIfMissingFromTranscript", branch: "expected-completion", label: "Expected thesis ECTS are stated if absent from the transcript" },
];
const emptyAnswers = <T extends string>(keys: readonly T[]) => Object.fromEntries(keys.map(key => [key, "unknown"])) as Record<T, Answer>;
const selectClass = "min-h-11 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-2 text-base";
const choiceText = (value: string) => value === "yes" ? "Applicant reports yes" : value === "no" ? "Applicant reports no" : "Unknown";

/** Session-only document inventory and date/group screen; no Profile or citizenship is read. */
export function BonnApplicationCheck({ asOf }: { asOf: string }) {
  const [applicationDate, setApplicationDate] = useState("");
  const [groupFactors, setGroupFactors] = useState<Record<GroupKey, Answer>>(() => emptyAnswers(GROUP_FACTS.map(item => item.key)));
  const [conditionalFacts, setConditionalFacts] = useState<Record<ApplicabilityKey, Answer>>(() => emptyAnswers(CONDITIONAL_FACTS.map(item => item.key)));
  const [degreeBranch, setDegreeBranch] = useState<"completed" | "final-pending" | "expected-completion" | "unknown">("unknown");
  const [degreeDocumentFacts, setDegreeDocumentFacts] = useState<Partial<Record<DegreeFactKey, Answer>>>({});
  const [documents, setDocuments] = useState<Partial<Record<DocumentId, Report>>>({});

  const computed = useMemo(() => {
    const degreeFacts = Object.fromEntries(DEGREE_FACTS
      .filter(item => item.branch === degreeBranch)
      .map(item => [item.key, degreeDocumentFacts[item.key] ?? "unknown"])) as Partial<Record<DegreeFactKey, Answer>>;
    const input = {
      programmeId: bonnApplicationReview.programmeId,
      intake: bonnApplicationReview.intake,
      asOf,
      ...(applicationDate ? { applicationDate } : {}),
      groupFactors,
      degreeDocumentBranch: degreeBranch,
      degreeDocumentFacts: degreeFacts,
      conditionalFacts,
      documents: Object.fromEntries(bonnApplicationReview.documentRequirements.map(item => [item.id, documents[item.id] ?? "unknown"])),
    };
    const parsed = bonnApplicationRequestSchema.safeParse(input);
    if (!parsed.success) return { result: null, error: parsed.error.issues[0]?.message ?? "Check the application checklist inputs." };
    return { result: evaluateBonnApplication(parsed.data), error: null };
  }, [asOf, applicationDate, conditionalFacts, degreeBranch, degreeDocumentFacts, documents, groupFactors]);

  const result = computed.result;
  const sources = result && "sources" in result ? result.sources : bonnApplicationReview.sources;
  const source = (id: string) => sources.find(item => item.id === id);
  const sourceLink = (id: string) => {
    const item = source(id);
    return item ? <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-200 underline">Source · reviewed {item.checkedAt} · {item.retrieval === "official-indexed-result" ? "indexed result; direct page retrieval failed" : "page retrieved"}</a> : null;
  };

  const setGroup = (key: GroupKey, value: string) => setGroupFactors(current => ({ ...current, [key]: value as Answer }));
  const setConditional = (key: ApplicabilityKey, value: string) => setConditionalFacts(current => ({ ...current, [key]: value as Answer }));
  const setDegreeFact = (key: DegreeFactKey, value: string) => setDegreeDocumentFacts(current => ({ ...current, [key]: value as Answer }));
  const documentGroups = ["required", "conditional", "recommended", "optional"] as const;

  return <details className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/[0.025]">
    <summary className="cursor-pointer list-none p-4 text-sm font-bold">Summer 2027 application window and document inventory</summary>
    <div className="space-y-4 px-4 pb-4">
      <p className="text-xs leading-relaxed text-muted-foreground">A dated checklist for the Bonn Computer Science MSc only. Window/group and document values are self-reports; the official deadline group, portal acceptance, document sufficiency, completeness, ranking and admission remain unassessed. These inputs stay in this page session and do not use Profile or citizenship.</p>
      <p className="rounded-xl border border-amber-300/15 p-3 text-[11px] leading-relaxed text-amber-100">Sources reviewed {bonnApplicationReview.reviewedAt}; current checklist date {asOf}. Available through 2026-12-31 under product freshness policy only, not an official source expiry. Changing the date does not refresh source pages.</p>

      <section className="rounded-xl border border-white/10 p-3" aria-label="Bonn application windows">
        <div className="grid gap-3 sm:grid-cols-[1fr_12rem] sm:items-end">
          <div><h3 className="text-xs font-bold">Published application periods</h3><p className="mt-1 text-[11px] text-muted-foreground">The deadlines source was retrieved as indexed result content; exact times, time zone and boundary inclusion remain unknown.</p></div>
          <label className="block text-xs font-semibold">Reported submission date<input aria-label="Reported application date" type="date" value={applicationDate} onChange={event => setApplicationDate(event.target.value)} className="mt-1 min-h-11 w-full rounded-lg border border-white/15 bg-slate-950 px-2.5 py-2 text-base" /></label>
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {bonnApplicationReview.applicationWindows.map(window => {
            const state = result?.windows.find(item => item.id === window.id);
            return <div key={window.id} className="rounded-lg bg-white/[0.03] p-2.5 text-xs">
              <p className="font-semibold">{window.id === "first" ? "First period" : "Second period · EEA students only"}</p>
              <p className="mt-1">{window.startsOn} – {window.endsOn}</p>
              <p className="mt-1 text-amber-100">{state?.dateStatus === "not-provided" ? "Unknown · enter a reported date" : state?.status === "outside-date-range" ? "Reported date outside the published date range" : state?.status === "boundary-time-unconfirmed" ? "Boundary date · exact cut-off time and inclusion unknown" : state?.status === "inside-date-range-reported-group-mismatch" ? "Date in range · reported factors do not indicate an EEA basis; official group remains unknown" : state?.status === "group-unknown" ? "Date in range · applicant group unknown" : state?.status === "inside-date-range-conditional" ? "Date in published range · eligibility and deadline remain unconfirmed" : "No deadline decision"}</p>
              <p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{state?.reason ?? window.boundarySemantics.replaceAll("-", " ")}</p>
              <p className="mt-1">{sourceLink(window.sourceId)}</p>
            </div>;
          })}
        </div>
      </section>

      <section className="space-y-3 rounded-xl border border-white/10 p-3" aria-label="Reported applicant-group factors">
        <div><h3 className="text-xs font-bold">Reported group factors</h3><p className="mt-1 text-[11px] text-amber-100">Candidate group: {result?.group.candidateEeaGroup === "eea-reported" ? "EEA reported" : result?.group.candidateEeaGroup === "non-eea-reported" ? "Non-EEA reported" : "Unknown"}. Official group: Unknown · Bonn assigns it. Citizenship alone does not determine the second-period group.</p></div>
        {GROUP_FACTS.map(fact => {
          const metadata = bonnApplicationReview.applicantGroups.find(item => item.id === fact.groupId);
          return <div key={fact.key} className="grid gap-1.5 border-t border-white/8 pt-2 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-center sm:gap-3">
            <div><label htmlFor={`bonn-group-${fact.key}`} className="text-xs font-medium">{fact.label}</label>{metadata && <><p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">{metadata.evidenceNotes}</p><p className="mt-0.5 text-[10px]">{sourceLink(metadata.sourceId)}</p></>}</div>
            <select id={`bonn-group-${fact.key}`} aria-label={fact.label} value={groupFactors[fact.key]} onChange={event => setGroup(fact.key, event.target.value)} className={selectClass}><option value="unknown">Unknown</option><option value="yes">Applicant reports yes</option><option value="no">Applicant reports no</option></select>
          </div>;
        })}
        <div className="rounded-lg bg-white/[0.03] p-2 text-[11px] text-muted-foreground"><strong>Selection classification remains unknown.</strong> It is separate from second-window EEA-student eligibility. {bonnApplicationReview.applicantGroups.filter(item => item.context === "selection-classification").map(item => <p key={item.id} className="mt-1">{item.summary} {sourceLink(item.sourceId)}</p>)}</div>
      </section>

      <section className="space-y-2 rounded-xl border border-white/10 p-3" aria-label="Conditional document applicability">
        <div><h3 className="text-xs font-bold">Conditional document applicability</h3><p className="mt-1 text-[11px] text-muted-foreground">Unknown applicability stays unknown; a presence report does not establish that a document is required or accepted.</p></div>
        {CONDITIONAL_FACTS.map(fact => <label key={fact.key} className="grid gap-1.5 border-t border-white/8 pt-2 text-xs sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-center sm:gap-3"><span>{fact.label}</span><select aria-label={fact.label} value={conditionalFacts[fact.key]} onChange={event => setConditional(fact.key, event.target.value)} className={selectClass}><option value="unknown">Unknown</option><option value="yes">Applicant reports yes</option><option value="no">Applicant reports no</option></select></label>)}
      </section>

      <section className="space-y-3 rounded-xl border border-white/10 p-3" aria-label="Degree document branch">
        <div><h3 className="text-xs font-bold">Degree-document branch</h3><p className="mt-1 text-[11px] text-muted-foreground">Choose the reported situation. Bonn’s examination office and the university must review supporting documents.</p></div>
        <label className="block text-xs font-semibold">Current degree-document situation<select aria-label="Degree document branch" value={degreeBranch} onChange={event => { setDegreeBranch(event.target.value as typeof degreeBranch); setDegreeDocumentFacts({}); }} className={`mt-1 ${selectClass}`}><option value="unknown">Unknown</option><option value="completed">Degree completed and final certificate issued</option><option value="final-pending">All requirements complete; final certificate pending</option><option value="expected-completion">Near completion; requirements remain</option></select></label>
        {degreeBranch !== "unknown" && <div className="space-y-2 rounded-lg bg-white/[0.03] p-2.5">{DEGREE_FACTS.filter(item => item.branch === degreeBranch).map(fact => <label key={fact.key} className="grid gap-1.5 text-xs sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-center sm:gap-3"><span>{fact.label}</span><select aria-label={fact.label} value={degreeDocumentFacts[fact.key] ?? "unknown"} onChange={event => setDegreeFact(fact.key, event.target.value)} className={selectClass}><option value="unknown">Unknown</option><option value="yes">Applicant reports yes</option><option value="no">Applicant reports no</option></select></label>)}</div>}
      </section>

      <section className="space-y-3 rounded-xl border border-white/10 p-3" aria-label="Reported document inventory">
        <div><h3 className="text-xs font-bold">Document inventory · applicant-reported presence</h3><p className="mt-1 text-[11px] text-muted-foreground">“Present” is only an inventory note. It does not verify authenticity, completeness, translation, sufficiency, or Bonn’s acceptance.</p></div>
        {documentGroups.map(requirement => {
          const rows = bonnApplicationReview.documentRequirements.filter(item => item.requirement === requirement);
          return rows.length ? <details key={requirement} className="border-t border-white/8 pt-2"><summary className="cursor-pointer text-xs font-semibold capitalize">{requirement} documents ({rows.length})</summary><div className="mt-2 space-y-2">{rows.map(item => {
            const output = result?.documents.find(document => document.id === item.id);
            return <div key={item.id} className="rounded-lg bg-white/[0.03] p-2.5">
              <div className="grid gap-1.5 sm:grid-cols-[minmax(0,1fr)_12rem] sm:items-start sm:gap-3"><div><label htmlFor={`bonn-doc-${item.id}`} className="text-xs font-semibold">{item.label}</label><p className="mt-0.5 text-[10px] leading-relaxed text-muted-foreground">{item.condition} {item.summary}</p></div><select id={`bonn-doc-${item.id}`} aria-label={`${item.label} reported presence`} value={documents[item.id] ?? "unknown"} onChange={event => setDocuments(current => ({ ...current, [item.id]: event.target.value as Report }))} className={selectClass}><option value="unknown">Unknown</option><option value="present">Applicant reports present</option><option value="absent">Applicant reports absent</option></select></div>
              <p className="mt-1 text-[10px] text-amber-100">Reported-context applicability: {output?.applicability ?? "unknown"} · Official applicability: {output?.officialApplicability ?? "unknown"} · Reported presence: {output?.reportedStatus ?? "unknown"} · Verification: {output?.verificationStatus ?? "unknown"}</p><p className="mt-1 text-[10px] leading-relaxed text-muted-foreground">{output?.reason ?? item.summary}</p><p className="mt-1 text-[10px]">{sourceLink(item.sourceId)}</p>
            </div>;
          })}</div></details> : null;
        })}
      </section>

      {computed.error && <p role="alert" className="rounded-xl border border-rose-300/20 bg-rose-300/[0.06] p-3 text-xs text-rose-100">{computed.error}</p>}
      {result && <section aria-label="Application checklist result" className="space-y-2 rounded-xl border border-amber-300/15 p-3">
        <h3 className="text-xs font-bold">Application checklist status</h3>
        <p className="text-xs text-amber-100">Application completeness: not assessed. Official group: {result.group.officialGroup}. Application decision: not assessed.</p>
        <details><summary className="cursor-pointer text-xs font-semibold">Next checks ({result.missingActions.length})</summary><ul className="mt-2 list-inside list-disc space-y-1 text-[11px] text-muted-foreground">{result.missingActions.map(action => <li key={action}>{action}</li>)}</ul></details>
        <details><summary className="cursor-pointer text-xs font-semibold">Source limitations</summary><ul className="mt-2 list-inside list-disc space-y-1 text-[10px] leading-relaxed text-muted-foreground">{result.limitations.map(item => <li key={item}>{item}</li>)}</ul></details>
      </section>}
      <details className="border-t border-white/8 pt-2"><summary className="cursor-pointer text-xs font-semibold text-cyan-200">Official application sources</summary><ul className="mt-2 space-y-2">{sources.map(item => <li key={item.id} className="text-[11px]"><p>{item.topic}</p><p className="mt-0.5 text-muted-foreground">{item.retrievalNote}</p><p className="mt-1">{sourceLink(item.id)}</p></li>)}</ul></details>
    </div>
  </details>;
}
