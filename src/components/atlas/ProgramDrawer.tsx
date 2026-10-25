"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Banknote, CalendarClock, CheckCircle2, ExternalLink, Flag,
  ShieldCheck, TriangleAlert, X,
} from "lucide-react";
import type { MatchResult, Profile } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";
import { buildRoadmap, requiredBudget } from "@/lib/scoring";
import { ELIGIBILITY_META } from "@/lib/eligibility";
import { EligibilityBadge } from "./EligibilityBadge";
import { formatMoney, formatDecision, formatCitizenship } from "@/lib/format";
import { MatchRing } from "./ProgramCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RequirementChecklist } from "./RequirementChecklist";

function monthLabel(monthsFromNow: number | null) {
  if(monthsFromNow===null) return "Timing needs review";
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + Math.round(monthsFromNow));
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ProgramDrawer({ result, profile, onClose }: {
  result: MatchResult; profile: Profile; onClose: () => void;
}) {
  const p = result.program;
  const review = p.audit ?? p.pathway?.review;
  const returnFocus = useRef<HTMLElement | null>(null);
  const meta = CATEGORY_META[p.category];
  const roadmap = buildRoadmap(p, profile);
  const funds=requiredBudget(p,profile);

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
      <Dialog.Content asChild aria-modal="true"
        onOpenAutoFocus={() => { returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; }}
        onCloseAutoFocus={(event) => { event.preventDefault(); returnFocus.current?.focus(); }}
      >
      <motion.aside
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed inset-y-0 right-0 z-50 flex h-dvh w-full max-w-xl flex-col overflow-hidden border-l border-white/10 bg-[#101310]"
      >
        {/* header */}
        <div className="relative max-h-[45dvh] shrink-0 overflow-y-auto border-b border-white/8 p-4 pt-[max(1rem,env(safe-area-inset-top))] sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <MatchRing pct={result.matchPct} size={72} stroke={7} />
              <div className="min-w-0 break-words">
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{p.flag}</span>
                  <Dialog.Title className="text-xl font-extrabold tracking-tight">{p.country} <span className="sr-only">{p.program} details</span></Dialog.Title>
                </div>
                <p className="mt-0.5 font-semibold text-emerald-300">{p.program}</p>
                <p className="text-xs text-muted-foreground">{meta.emoji} {meta.label} · {p.region}</p>
              </div>
            </div>
            <Dialog.Close asChild><button aria-label="Close"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/5 transition-colors hover:bg-white/15">
              <X className="h-4 w-4" />
            </button></Dialog.Close>
          </div>
          <Dialog.Description className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.tagline}</Dialog.Description>
          <div className="mt-3"><EligibilityBadge status={result.eligibility} /></div>
          {result.eligibility !== "eligible" && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/8 p-3 text-xs text-amber-200">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span><strong>{ELIGIBILITY_META[result.eligibility].label}:</strong> {result.gateIssues.join(" · ")}</span>
            </div>
          )}
          {funds!==null && result.adjustedCost!==null && funds>result.adjustedCost && <p className="mt-3 text-sm text-amber-200">Minimum available funds: {formatMoney(funds)}. This includes the recorded capital requirement; it is separate from the year-one spending estimate.</p>}
        </div>

        <ScrollArea className="min-h-0 flex-1 overflow-hidden">
          <div className="space-y-7 p-4 sm:p-6">
            {result.explanation.requirements&&<section aria-label="Structured requirement checks" className="space-y-3">
              <h3 className="text-sm font-bold text-emerald-300">Documented requirement checks · partial coverage</h3>
              <p className="text-xs text-muted-foreground">Missing evidence stays unknown. Alternatives are evaluated with OR; all required checks use AND. Applicant assertions do not verify documents. Comparison uses matching currency and income basis; no exchange rate is applied.</p>
              <RequirementChecklist result={result.explanation.requirements.result}/>
            </section>}
            {/* key numbers */}
            {(result.adjustedCost!==null||p.processingWeeks!==null||p.yearsToCitizenship!==null)&&<div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {[
                { icon: Banknote, label: "Year 1 all-in", value: formatMoney(result.adjustedCost), known:result.adjustedCost!==null },
                { icon: CalendarClock, label: "Decision", value: formatDecision(p.processingWeeks), known:p.processingWeeks!==null },
                { icon: Flag, label: "Citizenship", value: formatCitizenship(p), known:p.yearsToCitizenship!==null },
              ].filter(s=>s.known).map((s) => (
                <div key={s.label} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                  <s.icon className="h-4 w-4 text-emerald-400" />
                  <p className="mt-2 text-sm font-bold leading-tight">{s.value}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>}
            {result.adjustedCost===null&&p.processingWeeks===null&&p.yearsToCitizenship===null&&<p className="text-xs text-muted-foreground">Costs and timelines are still under review. See the source notes below.</p>}


            {result.explanation && <section aria-label="Recommendation explanation" className="space-y-4 rounded-2xl border border-white/10 p-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-300">Why this match</h3>
              <p className="text-xs text-muted-foreground">A fit score, not an approval probability.{result.explanation.requiredBudget!==null&&<> Available funds: {formatMoney(result.explanation.requiredBudget)}.</>}{result.explanation.budgetHeadroom!==null&&<> Budget buffer: {formatMoney(result.explanation.budgetHeadroom)}.</>}</p>
              <ul className="space-y-1 text-xs text-emerald-200">{result.explanation.strengths.map(item=><li key={item}>＋ {item}</li>)}</ul>
              {result.explanation.tradeoffs.length>0 && <div><h4 className="text-xs font-bold text-amber-200">Trade-offs</h4><ul className="mt-1 space-y-1 text-xs text-muted-foreground">{result.explanation.tradeoffs.map(item=><li key={item}>• {item}</li>)}</ul></div>}
              <div><h4 className="text-xs font-bold">Next checks</h4><ol className="mt-1 list-inside list-decimal space-y-1 text-xs text-muted-foreground">{result.explanation.nextSteps.map(item=><li key={item}>{item}</li>)}</ol></div>
            </section>}

            {/* roadmap */}
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-300">Your roadmap</h3>
              <div className="relative space-y-0 border-l-2 border-dashed border-emerald-400/25 pl-6">
                {roadmap.map((s, i) => (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className="relative pb-5 last:pb-0"
                  >
                    <span className="absolute -left-[35px] grid h-7 w-7 place-items-center rounded-full border border-emerald-400/30 bg-[#101310] text-sm">
                      {s.icon}
                    </span>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-300/90">
                      {s.monthsFromNow===null?(p.audit?.batchId==='study-pilot-2026-10-25-v1'?'Conditional stage':monthLabel(null)):`≈ ${monthLabel(s.monthsFromNow)}`}
                    </p>
                    <p className="text-sm font-bold">{s.label}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{s.detail}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* requirements */}
            <div>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-300">Core requirements</h3>
              <p className="mb-3 text-xs text-muted-foreground">Recorded requirements · {review ? `partial source review ${review.reviewedAt.slice(0,10)}` : p.verification?.status === "verified" && p.verification.checkedAt ? `source checked ${p.verification.checkedAt}` : "source review pending"}. Match scores measure profile fit, not approval probability.</p>
              <ul className="space-y-2">
                {p.requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span className="leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* pros / cons */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-300">
                  <ShieldCheck className="h-4 w-4" /> Strengths
                </h4>
                <ul className="space-y-2">
                  {p.pros.map((x) => (
                    <li key={x} className="text-xs leading-relaxed text-emerald-100/90">＋ {x}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-4">
                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                  <TriangleAlert className="h-4 w-4" /> Watch out
                </h4>
                <ul className="space-y-2">
                  {p.cons.map((x) => (
                    <li key={x} className="text-xs leading-relaxed text-amber-100/90">− {x}</li>
                  ))}
                </ul>
              </div>
            </div>

            {review && <section aria-label="Official source review" className="space-y-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-xs">
              <h3 className="font-bold text-emerald-200">Source audit · {review.status}</h3>
              <p className="text-muted-foreground">Reviewed {review.reviewedAt.slice(0,10)}. {review.status==="unresolved"?"Evidence retrieval remains unresolved; no route requirements were verified by this attempt.":"These citations support selected claims; the complete route and your eligibility remain under review."}</p>
              {p.audit&&<p className="font-semibold text-amber-100">Intake status in reviewed sources: {p.audit.routeStatus}. This does not establish individual eligibility.</p>}
              <ul className="space-y-3">{review.claims.map((claim,index)=><li key={`${claim.sourceUrl}-${index}`}><p>{claim.summary}</p><a className="mt-1 inline-block break-all text-emerald-300 underline" href={claim.sourceUrl} target="_blank" rel="noopener noreferrer">{new URL(claim.sourceUrl).hostname} · {claim.topic}{claim.retrieval==="official-index"?" · indexed evidence; direct access blocked":""}</a></li>)}</ul>
              {review.financialRequirements.length>0 && <div><h4 className="font-bold">Amounts in source currency</h4><ul className="mt-2 space-y-2">{review.financialRequirements.map((item,index)=><li key={index}>{item.currency} {item.amount.toLocaleString("en-US")} · {item.period}: {item.description}</li>)}</ul><p className="mt-2 text-muted-foreground">Non-USD amounts are not converted or compared against your USD budget. Fees, investments, assets and income are separate requirements.</p></div>}
              <details><summary className="cursor-pointer py-2 font-semibold">Unresolved evidence</summary><ul className="space-y-2 text-muted-foreground">{review.limitations.map(item=><li key={item}>{item}</li>)}</ul></details>
            </section>}

          </div>
        </ScrollArea>

        {/* footer CTA */}
        <div className="safe-bottom shrink-0 border-t border-white/8 p-4">
          <a
            href={p.url} target="_blank" rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-600 py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.01] active:scale-95"
          >
            Open official program page <ExternalLink className="h-4 w-4" />
          </a>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Estimates for orientation only — verify current rules with official sources before acting.
          </p>
        </div>
      </motion.aside>
      </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
