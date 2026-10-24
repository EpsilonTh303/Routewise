import type {
  Profile, Program, MatchResult, ScoreBreakdown, Eligibility, Goal, Category,
} from "./types";
import { ALL_PROGRAMS } from "./data";

/* ------------------------------------------------------------------ */
/* Goal weighting — each goal redistributes the 6 score dimensions      */
/* ------------------------------------------------------------------ */
const GOAL_WEIGHTS: Record<Goal, Omit<ScoreBreakdown, never>> = {
  citizenship:   { cost: 8,  speed: 10, citizenship: 30, qol: 20, access: 12, fit: 20 },
  "pr-fast":     { cost: 12, speed: 30, citizenship: 18, qol: 12, access: 10, fit: 18 },
  "lowest-cost": { cost: 35, speed: 15, citizenship: 10, qol: 8,  access: 12, fit: 20 },
  "top-qol":     { cost: 13, speed: 12, citizenship: 15, qol: 30, access: 12, fit: 18 },
  remote:        { cost: 18, speed: 15, citizenship: 12, qol: 18, access: 12, fit: 25 },
  business:      { cost: 15, speed: 15, citizenship: 15, qol: 15, access: 10, fit: 30 },
  study:         { cost: 15, speed: 10, citizenship: 15, qol: 18, access: 12, fit: 30 },
  "family-safe": { cost: 12, speed: 10, citizenship: 15, qol: 25, access: 10, fit: 13 },
};

const ACCESS_BASE: Record<string, number> = {
  "visa-free": 100, evisa: 72, "visa-required": 38,
};

const EDU_SCORE: Record<Profile["education"], number> = {
  highschool: 40, bachelor: 65, master: 78, phd: 90,
};

const clamp = (n: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, n));
const ratio = (a: number, b: number) => (b <= 0 ? 1 : a / b);

/** Language overlap between user skills and program bonus list */
function languageFit(p: Program, u: Profile): number {
  let bonus = 0;
  const knows = new Set<string>();
  if (u.englishLevel >= 2) knows.add("English");
  if (u.turkish) knows.add("Turkish");
  if (u.russian) knows.add("Russian");
  for (const l of p.languageBonus ?? []) if (knows.has(l)) bonus += 6;
  return Math.min(bonus, 14);
}

/** Expected total year-one spend for this user's family */
export function adjustedCost(p: Program, u: Profile): number {
  const deps = u.familyStatus === "single" ? 0 : Math.max(1, u.dependents);
  return p.totalYearOneCost + deps * p.costPerDependent;
}

/* ------------------------------------------------------------------ */
/* Hard gates — budget, income, age, education                          */
/* ------------------------------------------------------------------ */
function runGates(p: Program, u: Profile) {
  const issues: string[] = [];
  const cost = adjustedCost(p, u);

  // Budget gate (one-time investment + relocation all-in)
  if (cost > 0 && u.budget < cost) {
    issues.push(`Need ≈ $${Math.round(cost - u.budget).toLocaleString()} more budget`);
  }

  // Income gate (passive / nomad / salary-proof programs)
  if (p.minMonthlyIncome > 0 && u.monthlyIncome < p.minMonthlyIncome) {
    const gap = Math.ceil(p.minMonthlyIncome - u.monthlyIncome);
    issues.push(`Income short by ≈ $${gap.toLocaleString()}/mo`);
  }

  // Job-offer gate for sponsored routes
  if (p.jobOfferRequired && !u.hasJobOffer && u.expectedSalary === 0 && p.category === "skilled") {
    issues.push("Employer sponsorship required");
  }

  // Age gates
  if (p.category === "student" && (u.age < 17 || u.age > 42)) {
    issues.push("Student route typically 17–42");
  }
  if (p.id === "ph-srrv" && u.age < 50) issues.push("Requires age 50+");

  // Education gate for points/skilled
  if (["skilled", "work"].includes(p.category) && u.education === "highschool") {
    issues.push("Degree or formal qualification usually required");
  }

  return { issues, cost, eligible: issues.length === 0 };
}

/* ------------------------------------------------------------------ */
/* Category-specific profile fit                                        */
/* ------------------------------------------------------------------ */
function fitScore(p: Program, u: Profile): number {
  const edu = EDU_SCORE[u.education];
  const exp = clamp(u.experience * 3, 0, 30);
  const english = [40, 55, 75, 95][u.englishLevel];

  switch (p.category) {
    case "skilled":
    case "work": {
      let s = edu * 0.45 + exp * 0.8 + english * 0.25;
      if (["it", "medicine", "engineering"].includes(u.field)) s += 14;
      if (u.field === "finance") s += 8;
      if (p.jobOfferRequired) {
        if (u.hasJobOffer) s += 18;
        else if (u.expectedSalary > 0) s += clamp(28 * ratio(u.expectedSalary, p.minMonthlyIncome || u.expectedSalary) - 10, -8, 18);
        else s -= 26;
      }
      if (u.age >= 45) s -= 15; else if (u.age <= 35) s += 6;
      return clamp(s);
    }
    case "investor": {
      const headroom = ratio(u.budget, Math.max(p.minBudget, p.totalYearOneCost));
      let s = clamp(40 + Math.log2(Math.max(headroom, 0.5)) * 22, 10, 100);
      if (u.field === "business" || u.field === "finance") s += 8;
      if (u.experience >= 5) s += 6;
      return clamp(s);
    }
    case "passive": {
      const inc = ratio(u.monthlyIncome, Math.max(p.minMonthlyIncome, 1));
      return clamp(35 + Math.log2(Math.max(inc, 0.4)) * 24 + (u.age >= 45 ? 6 : 0));
    }
    case "nomad": {
      if (!u.remoteWork) return 30;
      const inc = ratio(u.monthlyIncome, Math.max(p.minMonthlyIncome, 1));
      let s = clamp(45 + Math.log2(Math.max(inc, 0.4)) * 22 + english * 0.2);
      if (u.englishLevel >= 2) s += 5;
      return clamp(s);
    }
    case "entrepreneur": {
      let s = exp * 1.4 + (u.field === "business" ? 22 : u.field === "it" ? 18 : 8);
      if (u.budget >= 30000) s += 10;
      if (u.englishLevel >= 2) s += 8;
      return clamp(s);
    }
    case "student": {
      const agePeak = 100 - Math.min(Math.abs(u.age - 23) * 6, 55);
      return clamp(agePeak * 0.6 + edu * 0.4);
    }
    case "cbi": {
      const headroom = ratio(u.budget, p.totalYearOneCost);
      return clamp(45 + Math.log2(Math.max(headroom, 0.4)) * 20);
    }
  }
  return 50;
}

/* ------------------------------------------------------------------ */
/* Core scoring                                                         */
/* ------------------------------------------------------------------ */
export function scoreProgram(p: Program, u: Profile): MatchResult {
  const { issues, cost, eligible } = runGates(p, u);

  /* --- dimension scores --- */
  const costScore = clamp(
    45 + Math.log2(Math.max(ratio(u.budget, cost || 1), 0.25)) * 24
  );
  const speedDays = p.processingWeeks * 7 + (p.yearsToPR ?? 5) * 365 * 0.35;
  const speedScore = clamp(105 - speedDays / 12);
  const ciziYears = p.yearsToCitizenship;
  const timeScore =
    ciziYears === null ? 18 : ciziYears === 0 ? 100 : clamp(104 - ciziYears * 9.5);
  const citizenshipScore = clamp(timeScore * 0.55 + p.devScore * 10 * 0.45);
  const qolScore = p.devScore * 10;
  const accessScore = clamp(
    ACCESS_BASE[p.passportAccess] * 0.72 + p.azEase * 20 * 0.28 + languageFit(p, u)
  );
  let fit = fitScore(p, u);

  const breakdown: ScoreBreakdown = {
    cost: Math.round(costScore),
    speed: Math.round(speedScore),
    citizenship: Math.round(citizenshipScore),
    qol: Math.round(qolScore),
    access: Math.round(accessScore),
    fit: Math.round(fit),
  };

  /* --- goal-weighted total --- */
  const w = { ...GOAL_WEIGHTS[u.goal] };
  if (u.timeline === "asap") w.speed *= 1.5;
  if (u.timeline === "flexible") w.cost *= 1.15;
  if (u.risk === "low" && p.category === "cbi") fit *= 0.72;
  if (u.risk === "high" && p.category === "cbi") fit = Math.min(100, fit * 1.12);
  if (u.familyStatus !== "single") {
    const famPenalty = (1 - p.familyFriendly) * 30;
    breakdown.qol = Math.round(clamp(qolScore - famPenalty * 0.4));
  }
  if (u.regions.length > 0 && !u.regions.includes(p.region)) {
    w.qol *= 0.5; w.access *= 0.7; // soft de-rank, not exclusion
  }
  if (!p.remoteFriendly && u.remoteWork && u.goal === "remote") w.fit *= 1.3;

  const wsum = w.cost + w.speed + w.citizenship + w.qol + w.access + w.fit;
  let total =
    (costScore * w.cost +
      speedScore * w.speed +
      citizenshipScore * w.citizenship +
      breakdown.qol * w.qol +
      accessScore * w.access +
      fit * w.fit) / wsum;

  // Global adjusters
  if (!eligible) total -= 14;                       // soft penalty but keep visible
  if (p.dvLottery && u.citizenship === "AZ") total += 4;
  if (p.e2Treaty && u.citizenship === "AZ") total += 5;
  if (p.category === "cbi" && u.risk === "low") total -= 6;
  total = clamp(total, 8, 98);

  const status: Eligibility =
    issues.length === 0 ? "eligible" : eligible || issues.length <= 1 && u.budget >= cost * 0.75 ? "conditional" : "ineligible";

  return {
    program: p,
    matchPct: Math.round(total),
    breakdown,
    eligibility: issues.length === 0 ? "eligible" : status === "ineligible" ? "ineligible" : "conditional",
    gateIssues: issues,
    adjustedCost: cost,
  };
}

export function matchAll(u: Profile): MatchResult[] {
  return ALL_PROGRAMS.map((p) => scoreProgram(p, u)).sort(
    (a, b) => b.matchPct - a.matchPct
  );
}

/* ------------------------------------------------------------------ */
/* Strategy roadmap — Plan A / B / C with roles                         */
/* ------------------------------------------------------------------ */
export interface Plan {
  result: MatchResult;
  role: string;
  roleNote: string;
}

export function buildStrategy(results: MatchResult[]): Plan[] {
  const viable = results.filter((r) => r.eligibility !== "ineligible");
  if (viable.length === 0) return [];

  const a = viable[0];
  const pick = (pred: (r: MatchResult) => boolean) =>
    viable.find((r) => pred(r) && r.program.id !== a.program.id);

  const b =
    pick((r) => r.program.category !== a.program.category) ??
    pick((r) => r.program.country !== a.program.country) ??
    viable[1];

  const usedIds = new Set([a.program.id, b?.program.id]);
  const c =
    viable.find(
      (r) =>
        !usedIds.has(r.program.id) &&
        r.program.yearsToCitizenship !== null &&
        r.program.yearsToCitizenship <= 5
    ) ??
    viable.find((r) => !usedIds.has(r.program.id)) ??
    viable[2];

  const plans: Plan[] = [
    { result: a, role: "Plan A — Primary", roleNote: "Highest overall match to your profile and goal." },
  ];
  if (b) plans.push({ result: b, role: "Plan B — Hedge", roleNote: "A different route family, in case Plan A stalls." });
  if (c) plans.push({ result: c, role: "Plan C — Long game", roleNote: "Fast-track citizenship or budget-friendly backup." });
  return plans;
}

/* ------------------------------------------------------------------ */
/* Roadmap steps for one program                                        */
/* ------------------------------------------------------------------ */
export interface RoadmapStep {
  label: string;
  detail: string;
  monthsFromNow: number;
  icon: string;
}

export function buildRoadmap(p: Program, u: Profile): RoadmapStep[] {
  const steps: RoadmapStep[] = [];
  const family =
    u.familyStatus === "single" ? "" : " + dependents' documents";
  steps.push({
    label: "Document preparation",
    detail: `Passport renewal, apostilles, police clearance, bank statements${family}`,
    monthsFromNow: 1.5,
    icon: "📄",
  });
  steps.push({
    label: "Application filed",
    detail: `${p.program} submitted — total family budget ≈ $${adjustedCost(p, u).toLocaleString()}`,
    monthsFromNow: 3,
    icon: "📨",
  });
  steps.push({
    label: "Decision expected",
    detail: `Standard ${p.program} processing is ~${p.processingWeeks} weeks`,
    monthsFromNow: 3 + p.processingWeeks / 4.3,
    icon: "⏳",
  });
  steps.push({
    label: "Relocate & activate",
    detail: `Register residence${p.jobOfferRequired ? " (with employer start date)" : ""}, open bank account`,
    monthsFromNow: 4 + p.processingWeeks / 4.3,
    icon: "🛬",
  });
  if (p.yearsToPR != null && p.yearsToPR > 0 && p.yearsToPR !== p.yearsToCitizenship) {
    steps.push({
      label: "Permanent residence",
      detail: `${p.yearsToPR} years of continuous residence`,
      monthsFromNow: p.yearsToPR * 12 + 4,
      icon: "🏠",
    });
  }
  if (p.yearsToCitizenship != null && p.yearsToCitizenship > 0) {
    steps.push({
      label: "Citizenship application",
      detail: `Eligible at ${p.yearsToCitizenship} years${p.citizenshipLanguage ? ` — need ${p.citizenshipLanguage}` : ""}`,
      monthsFromNow: p.yearsToCitizenship * 12 + 4,
      icon: "🛂",
    });
  } else if (p.yearsToCitizenship === 0) {
    steps.push({
      label: "Citizenship granted",
      detail: "Direct citizenship on completion of investment",
      monthsFromNow: 3 + p.processingWeeks / 4.3 + 2,
      icon: "🛂",
    });
  }
  return steps;
}

/* ------------------------------------------------------------------ */
/* Passport strength                                                    */
/* ------------------------------------------------------------------ */
export function passportInfo(key: string) {
  const map: Record<string, { visaFree: number; rank: number; dv: boolean; name: string; flag: string }> = {
    AZ: { visaFree: 76, rank: 66, dv: true, name: "Azerbaijan", flag: "🇦🇿" },
    TR: { visaFree: 118, rank: 51, dv: false, name: "Türkiye", flag: "🇹🇷" },
    GE: { visaFree: 121, rank: 48, dv: false, name: "Georgia", flag: "🇬🇪" },
    RU: { visaFree: 116, rank: 55, dv: false, name: "Russia", flag: "🇷🇺" },
    KZ: { visaFree: 81, rank: 62, dv: true, name: "Kazakhstan", flag: "🇰🇿" },
    UA: { visaFree: 148, rank: 32, dv: true, name: "Ukraine", flag: "🇺🇦" },
    IR: { visaFree: 45, rank: 94, dv: true, name: "Iran", flag: "🇮🇷" },
    PK: { visaFree: 33, rank: 104, dv: true, name: "Pakistan", flag: "🇵🇰" },
    IN: { visaFree: 62, rank: 80, dv: false, name: "India", flag: "🇮🇳" },
    CN: { visaFree: 85, rank: 60, dv: false, name: "China", flag: "🇨🇳" },
    BR: { visaFree: 173, rank: 17, dv: false, name: "Brazil", flag: "🇧🇷" },
    GB: { visaFree: 187, rank: 6, dv: false, name: "United Kingdom", flag: "🇬🇧" },
  };
  return map[key] ?? { visaFree: 60, rank: 80, dv: false, name: "Other", flag: "🌍" };
}
