"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Trophy, Filter, Search, ChevronDown } from "lucide-react";
import type { MatchResult, Profile, Category, Region } from "@/lib/types";
import { CATEGORY_META, REGION_META } from "@/lib/types";
import { buildStrategy, passportInfo } from "@/lib/scoring";
import { ProgramCard, MatchRing } from "./ProgramCard";
import { ProgramDrawer } from "./ProgramDrawer";
import { Input } from "@/components/ui/input";

const CATEGORY_KEYS = Object.keys(CATEGORY_META) as Category[];
const REGION_KEYS = Object.keys(REGION_META) as Region[];

function PlanPodiumCard({ plan, index, onOpen }: {
  plan: { result: MatchResult; role: string; roleNote: string };
  index: number;
  onOpen: () => void;
}) {
  const r = plan.result;
  const p = r.program;
  const gold = index === 0;
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.12, type: "spring", stiffness: 90, damping: 16 }}
      whileHover={{ y: -6 }}
      onClick={onOpen}
      className={`relative flex flex-col rounded-3xl border p-5 text-left transition-shadow sm:p-6 ${
        gold
          ? "border-amber-400/40 bg-gradient-to-b from-amber-400/10 to-card glow-gold sm:-translate-y-3"
          : "border-white/10 bg-card hover:shadow-[0_16px_44px_-18px_rgba(16,185,129,0.45)]"
      }`}
    >
      <span className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider ${
        gold ? "bg-amber-400 text-black" : "bg-emerald-400/15 text-emerald-300"
      }`}>
        {gold && <Trophy className="h-3.5 w-3.5" />} {plan.role}
      </span>
      <div className="flex items-center gap-3">
        <MatchRing pct={r.matchPct} size={66} stroke={7} delay={0.3 + index * 0.12} />
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{p.flag}</span>
            <span className="truncate text-lg font-extrabold">{p.country}</span>
          </div>
          <p className="truncate text-sm font-semibold text-emerald-300">{p.program}</p>
        </div>
      </div>
      <p className="mt-3 flex-1 text-xs leading-relaxed text-muted-foreground">{plan.roleNote}</p>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/8 pt-3 text-center">
        <div><p className="text-sm font-extrabold">${(r.adjustedCost >= 1000 ? Math.round(r.adjustedCost / 1000) + "k" : r.adjustedCost)}</p><p className="text-[9px] uppercase text-muted-foreground">Year 1</p></div>
        <div><p className="text-sm font-extrabold">{p.processingWeeks >= 52 ? (p.processingWeeks / 52).toFixed(1) + "y" : p.processingWeeks + "w"}</p><p className="text-[9px] uppercase text-muted-foreground">Decision</p></div>
        <div><p className="text-sm font-extrabold">{p.yearsToCitizenship === 0 ? "⚡ now" : p.yearsToCitizenship ? p.yearsToCitizenship + "y" : "—"}</p><p className="text-[9px] uppercase text-muted-foreground">Citizenship</p></div>
      </div>
    </motion.button>
  );
}

export function Results({ profile, results, onEdit }: {
  profile: Profile; results: MatchResult[]; onEdit: () => void;
}) {
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [cat, setCat] = useState<Category | "all">("all");
  const [region, setRegion] = useState<Region | "all">("all");
  const [onlyEligible, setOnlyEligible] = useState(false);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"match" | "cost" | "speed">("match");

  const plans = useMemo(() => buildStrategy(results), [results]);
  const passport = passportInfo(profile.citizenship);

  const filtered = useMemo(() => {
    let list = results.filter((r) => r.eligibility !== "ineligible");
    if (cat !== "all") list = list.filter((r) => r.program.category === cat);
    if (region !== "all") list = list.filter((r) => r.program.region === region);
    if (onlyEligible) list = list.filter((r) => r.eligibility === "eligible");
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((r) =>
        r.program.country.toLowerCase().includes(q) || r.program.program.toLowerCase().includes(q));
    }
    if (sortBy === "cost") list = [...list].sort((a, b) => a.adjustedCost - b.adjustedCost);
    if (sortBy === "speed") list = [...list].sort((a, b) => a.program.processingWeeks - b.program.processingWeeks);
    return list;
  }, [results, cat, region, onlyEligible, query, sortBy]);

  const drawerResult = results.find((r) => r.program.id === drawerId) ?? null;
  const eligibleCount = results.filter((r) => r.eligibility === "eligible").length;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">
      {/* profile banner */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-3xl glass p-5 sm:p-6"
      >
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald-300/80">Your profile</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
            {passport.flag} {passport.name} → <span className="text-gradient-emerald">{eligibleCount} eligible routes</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Budget ${profile.budget.toLocaleString()} · income ${profile.monthlyIncome.toLocaleString()}/mo · {profile.education === "highschool" ? "High school" : profile.education === "bachelor" ? "Bachelor's" : profile.education === "master" ? "Master's" : "PhD"} · {profile.experience}y exp · Passport ≈{passport.visaFree} visa-free (#{passport.rank})
          </p>
        </div>
        <button onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-emerald-400/50 hover:text-emerald-300">
          <Pencil className="h-4 w-4" /> Edit profile
        </button>
      </motion.div>

      {/* podium */}
      <section aria-label="Top strategy">
        <h2 className="mb-1 text-center text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">
          Your relocation strategy
        </h2>
        <p className="mb-8 text-center text-xs text-muted-foreground">Tap a card for the full roadmap, costs and requirements</p>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((plan, i) => (
            <PlanPodiumCard key={plan.result.program.id} plan={plan} index={i}
              onOpen={() => setDrawerId(plan.result.program.id)} />
          ))}
        </div>
      </section>

      {/* filters */}
      <div className="sticky top-16 z-30 mt-12 rounded-2xl glass-strong p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-1.5 pr-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            <Filter className="h-3.5 w-3.5" /> Filter
          </span>
          <button onClick={() => setCat("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${cat === "all" ? "bg-emerald-400 text-black" : "bg-white/5 text-muted-foreground hover:text-foreground"}`}>
            All routes
          </button>
          {CATEGORY_KEYS.map((k) => (
            <button key={k} onClick={() => setCat(k)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${cat === k ? "bg-emerald-400 text-black" : "bg-white/5 text-muted-foreground hover:text-foreground"}`}>
              {CATEGORY_META[k].emoji} {CATEGORY_META[k].label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search country…"
                className="h-9 w-36 rounded-full bg-white/5 pl-8 text-xs" />
            </div>
            <div className="relative">
              <select
                value={region} onChange={(e) => setRegion(e.target.value as Region | "all")}
                aria-label="Region filter"
                className="h-9 appearance-none rounded-full border border-white/10 bg-white/5 pl-3 pr-8 text-xs font-semibold outline-none">
                <option value="all">All regions</option>
                {REGION_KEYS.map((k) => <option key={k} value={k}>{REGION_META[k]} {k}</option>)}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
            <button
              onClick={() => setSortBy(sortBy === "match" ? "cost" : sortBy === "cost" ? "speed" : "match")}
              className="rounded-full bg-white/5 px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
              Sort: {sortBy === "match" ? "match %" : sortBy === "cost" ? "cheapest" : "fastest"} ↑↓
            </button>
            <button
              onClick={() => setOnlyEligible(!onlyEligible)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${onlyEligible ? "bg-emerald-400 text-black" : "bg-white/5 text-muted-foreground hover:text-foreground"}`}>
              Eligible only
            </button>
          </div>
        </div>
      </div>

      {/* grid */}
      <motion.div layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((r, i) => (
            <ProgramCard key={r.program.id} result={r} rank={i === 0 && sortBy === "match" && cat === "all" && region === "all" && !query ? 1 : undefined}
              onOpen={() => setDrawerId(r.program.id)} delay={Math.min(i * 0.04, 0.4)} />
          ))}
        </AnimatePresence>
      </motion.div>
      {filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          <p className="text-lg font-semibold">No routes match these filters</p>
          <p className="mt-1 text-sm">Try relaxing the category or region filters.</p>
        </div>
      )}

      {/* drawer */}
      <AnimatePresence>
        {drawerResult && (
          <ProgramDrawer result={drawerResult} profile={profile} onClose={() => setDrawerId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
