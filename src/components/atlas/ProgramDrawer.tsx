"use client";

import { motion } from "framer-motion";
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import {
  Banknote, CalendarClock, CheckCircle2, ExternalLink, Flag, Globe2,
  Landmark, ShieldCheck, TriangleAlert, Users, X, Percent,
} from "lucide-react";
import type { MatchResult, Profile } from "@/lib/types";
import { CATEGORY_META } from "@/lib/types";
import { buildRoadmap, passportInfo } from "@/lib/scoring";
import { MatchRing } from "./ProgramCard";
import { ScrollArea } from "@/components/ui/scroll-area";

function monthLabel(monthsFromNow: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + Math.round(monthsFromNow));
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ProgramDrawer({ result, profile, onClose }: {
  result: MatchResult; profile: Profile; onClose: () => void;
}) {
  const p = result.program;
  const meta = CATEGORY_META[p.category];
  const passport = passportInfo(profile.citizenship);
  const roadmap = buildRoadmap(p, profile);
  const radarData = [
    { dim: "Cost", v: result.breakdown.cost },
    { dim: "Speed", v: result.breakdown.speed },
    { dim: "Citizenship", v: result.breakdown.citizenship },
    { dim: "Quality of life", v: result.breakdown.qol },
    { dim: "Passport ease", v: result.breakdown.access },
    { dim: "Profile fit", v: result.breakdown.fit },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex justify-end"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.aside
        initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="relative z-10 flex h-full w-full max-w-xl flex-col border-l border-white/10 bg-[#101310]"
        role="dialog" aria-label={`${p.country} ${p.program} details`}
      >
        {/* header */}
        <div className="relative border-b border-white/8 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <MatchRing pct={result.matchPct} size={72} stroke={7} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">{p.flag}</span>
                  <h2 className="text-xl font-extrabold tracking-tight">{p.country}</h2>
                </div>
                <p className="mt-0.5 font-semibold text-emerald-300">{p.program}</p>
                <p className="text-xs text-muted-foreground">{meta.emoji} {meta.label} · {p.region}</p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/5 transition-colors hover:bg-white/15">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.tagline}</p>
          {result.eligibility !== "eligible" && (
            <div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-400/25 bg-amber-400/8 p-3 text-xs text-amber-200">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <span><strong>Conditional:</strong> {result.gateIssues.join(" · ")}</span>
            </div>
          )}
        </div>

        <ScrollArea className="min-h-0 flex-1 overflow-hidden">
          <div className="space-y-7 p-6">
            {/* key numbers */}
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {[
                { icon: Banknote, label: "Year 1 all-in", value: `$${result.adjustedCost.toLocaleString()}` },
                { icon: CalendarClock, label: "Decision", value: `~${p.processingWeeks} weeks` },
                { icon: Flag, label: "Citizenship", value: p.yearsToCitizenship === 0 ? "Immediate" : p.yearsToCitizenship ? `${p.yearsToCitizenship} years` : "None" },
                { icon: Percent, label: "QoL score", value: `${p.devScore}/10` },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
                  <s.icon className="h-4 w-4 text-emerald-400" />
                  <p className="mt-2 text-sm font-bold leading-tight">{s.value}</p>
                  <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>

            {/* radar */}
            <div>
              <h3 className="mb-1 text-sm font-bold uppercase tracking-wider text-emerald-300">Match anatomy</h3>
              <div className="h-64 rounded-2xl border border-white/8 bg-white/[0.02] p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="72%">
                    <PolarGrid stroke="oklch(0.35 0.01 100)" />
                    <PolarAngleAxis dataKey="dim" tick={{ fill: "oklch(0.7 0.01 100)", fontSize: 11 }} />
                    <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar dataKey="v" stroke="#34d399" fill="#34d399" fillOpacity={0.32} animationDuration={800} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

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
                      ≈ {monthLabel(s.monthsFromNow)}
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

            {/* passport & family & tax */}
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3.5">
                <Globe2 className="h-4 w-4 text-amber-300" />
                <p className="mt-2 text-xs font-bold">{passport.flag} {passport.name}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                  Entry: {p.passportAccess}. Your passport: ~{passport.visaFree} visa-free (rank #{passport.rank})
                </p>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3.5">
                <Users className="h-4 w-4 text-emerald-300" />
                <p className="mt-2 text-xs font-bold">Family</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                  {p.familyFriendly >= 0.9 ? "Spouse + children (often parents) included" : p.familyFriendly >= 0.75 ? "Spouse & children join" : "Dependents limited"}
                </p>
              </div>
              <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3.5">
                <Landmark className="h-4 w-4 text-amber-300" />
                <p className="mt-2 text-xs font-bold">Tax snapshot</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{p.taxNote ?? "Standard local taxation"}</p>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* footer CTA */}
        <div className="border-t border-white/8 p-4">
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
    </motion.div>
  );
}
