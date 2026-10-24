"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Compass } from "lucide-react";
import type { MatchResult, Profile, Category, Region, Program } from "@/lib/types";
import { CATEGORY_META, REGION_META } from "@/lib/types";
import { ALL_PROGRAMS, PROGRAM_COUNT } from "@/lib/data";
import { scoreProgram, passportInfo } from "@/lib/scoring";
import { ProgramCard } from "./ProgramCard";
import { ProgramDrawer } from "./ProgramDrawer";
import { Input } from "@/components/ui/input";

const CATEGORY_KEYS = Object.keys(CATEGORY_META) as Category[];
const REGION_KEYS = Object.keys(REGION_META) as Region[];

/** Neutral profile used to render cards in browse mode */
const NEUTRAL_PROFILE: Profile = {
  citizenship: "AZ", age: 30, familyStatus: "single", dependents: 0,
  budget: 1e9, monthlyIncome: 99999, expectedSalary: 99999, hasJobOffer: true,
  education: "master", experience: 8, field: "it", englishLevel: 3,
  turkish: true, russian: true, goal: "top-qol", timeline: "flexible",
  risk: "medium", regions: [], remoteWork: true,
};

export function Explorer({ savedProfile }: { savedProfile: Profile | null }) {
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [cat, setCat] = useState<Category | "all">("all");
  const [region, setRegion] = useState<Region | "all">("all");
  const [query, setQuery] = useState("");
  const profile = savedProfile ?? NEUTRAL_PROFILE;

  const results = useMemo<MatchResult[]>(
    () => ALL_PROGRAMS.map((p: Program) => scoreProgram(p, profile)).sort((a, b) => b.matchPct - a.matchPct),
    [profile]
  );

  const filtered = useMemo(() => {
    let list = results;
    if (cat !== "all") list = list.filter((r) => r.program.category === cat);
    if (region !== "all") list = list.filter((r) => r.program.region === region);
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((r) =>
        r.program.country.toLowerCase().includes(q) || r.program.program.toLowerCase().includes(q));
    }
    return list;
  }, [results, cat, region, query]);

  const drawerResult = results.find((r) => r.program.id === drawerId) ?? null;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          The <span className="text-gradient-gold">full atlas</span>
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground">
          All {PROGRAM_COUNT} programs across 45+ countries — scores shown against {savedProfile ? "your saved profile" : "a reference profile"}.{" "}
          Build your own profile for personalized results.
        </p>
      </div>

      <div className="sticky top-16 z-30 rounded-2xl glass-strong p-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={`Search ${PROGRAM_COUNT} programs…`}
              className="h-9 w-44 rounded-full bg-white/5 pl-8 text-xs" />
          </div>
          <button onClick={() => setCat("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${cat === "all" ? "bg-amber-400 text-black" : "bg-white/5 text-muted-foreground hover:text-foreground"}`}>
            All
          </button>
          {CATEGORY_KEYS.map((k) => (
            <button key={k} onClick={() => setCat(k)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${cat === k ? "bg-amber-400 text-black" : "bg-white/5 text-muted-foreground hover:text-foreground"}`}>
              {CATEGORY_META[k].emoji} {CATEGORY_META[k].label}
            </button>
          ))}
          <div className="ml-auto relative">
            <select
              value={region} onChange={(e) => setRegion(e.target.value as Region | "all")}
              aria-label="Region filter"
              className="h-9 appearance-none rounded-full border border-white/10 bg-white/5 pl-3 pr-8 text-xs font-semibold outline-none">
              <option value="all">All regions</option>
              {REGION_KEYS.map((k) => <option key={k} value={k}>{REGION_META[k]} {k}</option>)}
            </select>
          </div>
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">{filtered.length} programs</p>

      <motion.div layout className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((r, i) => (
            <ProgramCard key={r.program.id} result={r} onOpen={() => setDrawerId(r.program.id)} delay={Math.min(i * 0.03, 0.4)} />
          ))}
        </AnimatePresence>
      </motion.div>
      {filtered.length === 0 && (
        <div className="py-16 text-center text-muted-foreground">
          <Compass className="mx-auto h-8 w-8 opacity-40" />
          <p className="mt-3 text-sm">Nothing found — try another search.</p>
        </div>
      )}

      <AnimatePresence>
        {drawerResult && (
          <ProgramDrawer result={drawerResult} profile={profile} onClose={() => setDrawerId(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
