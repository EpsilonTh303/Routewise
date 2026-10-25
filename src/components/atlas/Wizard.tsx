"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Briefcase, GraduationCap, Heart, Languages,
  MapPin, Rocket, Target, Timer, Wallet, Compass, Globe2,
} from "lucide-react";
import type { Profile, Goal, Region, WorkField, Education } from "@/lib/types";
import { CITIZENSHIPS } from "@/lib/types";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { ApplicantEvidenceEditor } from "./ApplicantEvidenceEditor";

const REGION_LIST: Region[] = [
  "Western Europe", "Nordics & Baltics", "North America", "Latin America",
  "Caribbean & Pacific", "Gulf & Middle East", "Asia-Pacific",
  "Caucasus & Balkans", "Africa & Indian Ocean",
];

const REGION_EMOJI: Record<Region, string> = {
  "Western Europe": "🇪🇺", "Nordics & Baltics": "🌲", "North America": "🗽",
  "Latin America": "🌮", "Caribbean & Pacific": "🏝️", "Gulf & Middle East": "🕌",
  "Asia-Pacific": "🏯", "Caucasus & Balkans": "⛰️", "Africa & Indian Ocean": "🦁",
};

const GOALS: { key: Goal; label: string; desc: string; icon: React.ElementType }[] = [
  { key: "citizenship", label: "Second citizenship", desc: "Passport is the mission", icon: Globe2 },
  { key: "pr-fast", label: "Fast residence decision", desc: "Prioritize shorter processing", icon: Timer },
  { key: "lowest-cost", label: "Lowest cost", desc: "Stretch every dollar", icon: Wallet },
  { key: "top-qol", label: "Best quality of life", desc: "Top-tier countries only", icon: Heart },
  { key: "remote", label: "Remote work", desc: "Keep my job/income", icon: Briefcase },
  { key: "business", label: "Business / startup", desc: "Found & scale abroad", icon: Rocket },
  { key: "study", label: "Study abroad", desc: "Prioritize student routes", icon: GraduationCap },
  { key: "family-safe", label: "Family inclusion", desc: "Prioritize family-friendly routes", icon: Heart },
];

const FIELDS: { key: WorkField; label: string }[] = [
  { key: "it", label: "💻 IT / Software" },
  { key: "medicine", label: "🩺 Medicine" },
  { key: "engineering", label: "⚙️ Engineering" },
  { key: "finance", label: "🏦 Finance" },
  { key: "business", label: "📊 Business" },
  { key: "creative", label: "🎨 Creative" },
  { key: "trades", label: "🔧 Skilled trades" },
  { key: "other", label: "🧩 Other" },
];

/** slider 0..100 -> dollars, log scale $1k → $10M */
const budgetFromSlider = (v: number) => Math.round(1000 * Math.pow(10, v / 25));
const sliderFromBudget = (b: number) => Math.min(100, Math.max(0, Math.round(25 * Math.log10(Math.max(b, 1000) / 1000))));
const fmtUSD = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`
  : n >= 10_000 ? `$${Math.round(n / 1000)}k`
  : `$${n.toLocaleString()}`;

const chip = (active: boolean) =>
  `rounded-xl border px-3.5 py-2.5 text-sm font-medium transition-all active:scale-95 ${
    active
      ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-200 shadow-[0_0_18px_-4px_rgba(16,185,129,0.5)]"
      : "border-white/10 bg-white/[0.03] text-muted-foreground hover:border-white/25 hover:text-foreground"
  }`;

function SectionTitle({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-emerald-300/90">
      <Icon className="h-4 w-4" /> {children}
    </h3>
  );
}

function OptionCard({ active, onClick, title, desc, icon: Icon }: {
  active: boolean; onClick: () => void; title: string; desc: string; icon: React.ElementType;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex items-start gap-3 rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
        active
          ? "border-emerald-400/60 bg-emerald-500/12 shadow-[0_0_24px_-6px_rgba(16,185,129,0.55)]"
          : "border-white/10 bg-white/[0.03] hover:border-white/25"
      }`}
      aria-pressed={active}
    >
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${
        active ? "bg-emerald-400 text-black" : "bg-white/5 text-muted-foreground group-hover:text-foreground"
      }`}>
        <Icon className="h-5 w-5" />
      </span>
      <span>
        <span className="block text-sm font-bold">{title}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">{desc}</span>
      </span>
    </button>
  );
}

export function Wizard({ initial, onComplete, onCancel }: {
  initial?: Profile | null;
  onComplete: (p: Profile) => void;
  onCancel: () => void;
}) {
  const [step, setStep] = useState(0);
  const [evidenceValid,setEvidenceValid]=useState(true);
  const [p, setP] = useState<Profile>(initial ?? {
    citizenship: "AZ", age: 30, familyStatus: "single", dependents: 0,
    budget: 50000, monthlyIncome: 3000, expectedSalary: 0, hasJobOffer: false,
    education: "bachelor", experience: 5, field: "it", englishLevel: 2,
    turkish: false, russian: true, goal: "citizenship", timeline: "1y",
    risk: "medium", regions: [], remoteWork: false,
  });

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => setP((s) => ({ ...s, [k]: v }));
  const budgetV = useMemo(() => sliderFromBudget(p.budget), [p.budget]);

  const steps = ["Identity", "Budget & career", "Goals"];
  const canNext = true;

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-6">
      {/* progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          {steps.map((s, i) => (
            <button
              key={s}
              onClick={() => setStep(i)}
              className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
                i === step ? "text-emerald-300" : i < step ? "text-foreground" : "text-muted-foreground/60"
              }`}
            >
              {i + 1}. {s}
            </button>
          ))}
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-amber-400"
            animate={{ width: `${((step + 1) / 3) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* ============ STEP 1 ============ */}
        {step === 0 && (
          <motion.section
            key="s1"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.25 }}
            className="space-y-8 glass rounded-3xl p-4 sm:p-8"
          >
            <div>
              <SectionTitle icon={Globe2}>Current citizenship</SectionTitle>
              <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                {CITIZENSHIPS.map((c) => (
                  <button key={c.key} aria-pressed={p.citizenship===c.key} onClick={() => set("citizenship", c.key)}
                    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all active:scale-95 ${
                      p.citizenship === c.key
                        ? "border-emerald-400/60 bg-emerald-500/15 shadow-[0_0_18px_-4px_rgba(16,185,129,0.5)]"
                        : "border-white/10 bg-white/[0.03] hover:border-white/25"
                    }`}
                  >
                    <span className="text-xl">{c.flag}</span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold">{c.name}</span>
                      <span className="block text-[10px] text-muted-foreground">{c.visaFree} visa-free</span>
                    </span>
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                {CITIZENSHIPS.find((c) => c.key === p.citizenship)?.note}
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <SectionTitle icon={Target}>Age</SectionTitle>
                <div className="flex items-center gap-4">
                  <Slider value={[p.age]} min={16} max={70} onValueChange={([v]) => set("age", v)} />
                  <span className="w-12 rounded-lg bg-white/5 py-1 text-center font-mono text-lg font-bold text-emerald-300">{p.age}</span>
                </div>
              </div>
              <div>
                <SectionTitle icon={Heart}>Family</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {(["single", "couple", "family"] as const).map((f) => (
                    <button key={f} onClick={() => { set("familyStatus", f); if (f === "single") set("dependents", 0); if (f === "couple") set("dependents", 1); if (f === "family") set("dependents", Math.max(1, p.dependents)); }}
                      className={chip(p.familyStatus === f)}>
                      {f === "single" ? "Single" : f === "couple" ? "Couple" : "With kids"}
                    </button>
                  ))}
                </div>
                {p.familyStatus !== "single" && (
                  <div className="mt-3 flex items-center gap-3 text-sm text-muted-foreground">
                    Dependents:
                    <button className="h-8 w-8 rounded-lg bg-white/5 text-lg font-bold hover:bg-white/10" onClick={() => set("dependents", Math.max(1, p.dependents - 1))}>−</button>
                    <span className="w-6 text-center font-mono font-bold text-foreground">{p.dependents}</span>
                    <button aria-label="Add dependent" className="h-8 w-8 rounded-lg bg-white/5 text-lg font-bold hover:bg-white/10" onClick={() => {set("dependents", Math.min(6, p.dependents + 1));if(p.familyStatus==="couple") set("familyStatus","family");}}>+</button>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
        )}

        {/* ============ STEP 2 ============ */}
        {step === 1 && (
          <motion.section
            key="s2"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.25 }}
            className="space-y-8 glass rounded-3xl p-4 sm:p-8"
          >
            <div>
              <SectionTitle icon={Wallet}>Budget — liquid funds for relocation & investment</SectionTitle>
              <div className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-5">
                <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
                  <span className="font-mono text-3xl font-extrabold text-gradient-gold">{fmtUSD(p.budget)}</span>
                  <div className="flex flex-wrap gap-1.5">
                    {[10000, 50000, 150000, 500000, 1000000].map((v) => (
                      <button key={v} onClick={() => set("budget", v)}
                        className={`rounded-md px-2 py-1 text-[11px] font-semibold transition-colors ${
                          Math.abs(p.budget - v) < 500 ? "bg-emerald-400/20 text-emerald-300" : "bg-white/5 text-muted-foreground hover:text-foreground"
                        }`}>{fmtUSD(v)}</button>
                    ))}
                  </div>
                </div>
                <Slider value={[budgetV]} min={0} max={100} step={1} onValueChange={([v]) => set("budget", budgetFromSlider(v))} />
                <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
                  <span>$1k</span><span>$100k</span><span>$10M</span>
                </div>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <SectionTitle icon={Wallet}>Current monthly income</SectionTitle>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input aria-label="Current monthly income" type="number" className="pl-7" value={p.monthlyIncome} min={0}
                    onChange={(e) => set("monthlyIncome", Math.max(0, +e.target.value || 0))} />
                </div>
                <p className="mt-1.5 text-[11px] text-muted-foreground">Salary, rent, dividends — provable income</p>
              </div>
              <div>
                <SectionTitle icon={Briefcase}>Offered monthly salary</SectionTitle>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input aria-label="Offered monthly salary" type="number" min={0} className="pl-7" value={p.expectedSalary || ""} placeholder="0 — no offer yet"
                    onChange={(e) => set("expectedSalary", Math.max(0, +e.target.value || 0))} />
                </div>
                <label className="mt-2.5 flex cursor-pointer items-center gap-2.5 text-sm">
                  <Switch checked={p.hasJobOffer} onCheckedChange={(v) => set("hasJobOffer", v)} />
                  I have an employer willing to sponsor
                </label>
                <p className="mt-1.5 text-[11px] text-muted-foreground">Used for salary thresholds only when you confirm an employer offer.</p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <SectionTitle icon={GraduationCap}>Education</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {(["highschool", "bachelor", "master", "phd"] as Education[]).map((e) => (
                    <button key={e} onClick={() => set("education", e)} className={chip(p.education === e)}>
                      {e === "highschool" ? "High school" : e === "bachelor" ? "Bachelor's" : e === "master" ? "Master's" : "PhD"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <SectionTitle icon={Briefcase}>Field</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {FIELDS.map((f) => (
                    <button key={f.key} onClick={() => set("field", f.key)} className={chip(p.field === f.key)}>{f.label}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <SectionTitle icon={Target}>Years of experience</SectionTitle>
                <div className="flex items-center gap-4">
                  <Slider value={[p.experience]} min={0} max={30} onValueChange={([v]) => set("experience", v)} />
                  <span className="w-12 rounded-lg bg-white/5 py-1 text-center font-mono text-lg font-bold text-emerald-300">{p.experience}</span>
                </div>
              </div>
              <div>
                <SectionTitle icon={Languages}>Languages</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {([0, 1, 2, 3] as const).map((l) => (
                    <button key={l} onClick={() => set("englishLevel", l)} className={chip(p.englishLevel === l)}>
                      {["English — none", "English — basic", "English — B1/B2", "English — fluent"][l]}
                    </button>
                  ))}
                  <button onClick={() => set("turkish", !p.turkish)} className={chip(p.turkish)}>🇹🇷 Turkish</button>
                  <button onClick={() => set("russian", !p.russian)} className={chip(p.russian)}>🇷🇺 Russian</button>
                </div>
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm">
              <Switch checked={p.remoteWork} onCheckedChange={(v) => set("remoteWork", v)} />
              <span><strong>My work is remote-friendly</strong> — I can work from anywhere with a laptop.</span>
            </label>
          </motion.section>
        )}

        {/* ============ STEP 3 ============ */}
        {step === 2 && (
          <motion.section
            key="s3"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.25 }}
            className="space-y-8 glass rounded-3xl p-4 sm:p-8"
          >
            <div>
              <SectionTitle icon={Rocket}>What matters most?</SectionTitle>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {GOALS.map((g) => (
                  <OptionCard key={g.key} icon={g.icon} title={g.label} desc={g.desc}
                    active={p.goal === g.key} onClick={() => set("goal", g.key)} />
                ))}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <SectionTitle icon={Timer}>Timeline</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {(["asap", "6m", "1y", "flexible"] as const).map((t) => (
                    <button key={t} onClick={() => set("timeline", t)} className={chip(p.timeline === t)}>
                      {t === "asap" ? "ASAP" : t === "6m" ? "≤ 6 months" : t === "1y" ? "~ 1 year" : "Flexible"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <SectionTitle icon={Compass}>Risk appetite</SectionTitle>
                <div className="flex flex-wrap gap-2">
                  {(["low", "medium", "high"] as const).map((r) => (
                    <button key={r} onClick={() => set("risk", r)} className={chip(p.risk === r)}>
                      {r === "low" ? "🛡️ Play safe" : r === "medium" ? "⚖️ Balanced" : "🎢 High risk, high reward"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <SectionTitle icon={MapPin}>Preferred regions <span className="normal-case text-muted-foreground">(empty = show all)</span></SectionTitle>
              <div className="flex flex-wrap gap-2">
                {REGION_LIST.map((r) => (
                  <button key={r}
                    onClick={() => set("regions", p.regions.includes(r) ? p.regions.filter((x) => x !== r) : [...p.regions, r])}
                    className={chip(p.regions.includes(r))}>
                    {REGION_EMOJI[r]} {r}
                  </button>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <div hidden={step!==2}><ApplicantEvidenceEditor profile={p} onChange={setP} onValidityChange={setEvidenceValid}/></div>

      {/* nav buttons */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => (step === 0 ? onCancel() : setStep(step - 1))}
          className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> {step === 0 ? "Back to home" : "Back"}
        </button>
        {step < 2 ? (
          <button
            onClick={() => canNext && setStep(step + 1)}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-600 px-7 py-3.5 text-base font-bold text-black glow-emerald transition-transform hover:scale-[1.03] active:scale-95"
          >
            Next <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        ) : (
          <button
            disabled={!evidenceValid}
            onClick={() => evidenceValid&&onComplete(p)}
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 to-amber-600 px-7 py-3.5 text-base font-bold text-black glow-gold transition-transform hover:scale-[1.03] active:scale-95"
          >
            Generate strategy <SparkleIcon />
          </button>
        )}
      </div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 transition-transform group-hover:rotate-90" fill="currentColor" aria-hidden>
      <path d="M12 2l2.1 6.3L20 12l-5.9 3.7L12 22l-2.1-6.3L4 12l5.9-3.7L12 2z" />
    </svg>
  );
}
