export type Category =
  | "skilled"
  | "investor"
  | "passive"
  | "nomad"
  | "entrepreneur"
  | "student"
  | "cbi"
  | "work";

export type Region =
  | "Western Europe"
  | "Nordics & Baltics"
  | "North America"
  | "Latin America"
  | "Caribbean & Pacific"
  | "Gulf & Middle East"
  | "Asia-Pacific"
  | "Caucasus & Balkans"
  | "Africa & Indian Ocean";

export type PassportAccess = "visa-free" | "evisa" | "visa-required";

export interface SourceClaim {
  topic:string; summary:string; sourceUrl:string; checkedAt:string; retrieval:"page"|"official-index";
}
export interface SourceFinancialRequirement {
  amount:number;currency:string;period:"one-time"|"monthly"|"annual"|"balance"|"assets";description:string;sourceUrl:string;
}
/** Claim audit, distinct from complete-route legal verification. */
export interface SourceAudit {
  batchId:string;
  status:"partial"|"unresolved";
  reviewedAt:string;
  routeStatus:"open"|"closed"|"unclear";
  claims:SourceClaim[];
  financialRequirements:SourceFinancialRequirement[];
  limitations:string[];
  unknownFields:string[];
  supportsRequirementVersion?:string;
}

export interface Program {
  audit?:SourceAudit;
  id: string;
  country: string;
  flag: string;
  region: Region;
  program: string;
  category: Category;
  tagline: string;
  /** One-time investment / deposit / donation in USD (0 if none) */
  minBudget: number | null;
  /** Required proven monthly income or salary, USD/month (0 if none) */
  minMonthlyIncome: number | null;
  /** Realistic all-in cost of year one incl. fees, legal, relocation — USD, main applicant */
  totalYearOneCost: number | null;
  /** Extra per dependent spouse/child, USD */
  costPerDependent: number | null;
  /** Weeks from application to residence decision */
  processingWeeks: number | null;
  /** Years of residence until permanent residence (null = no PR track) */
  yearsToPR: number | null;
  /** Years of residence until citizenship eligibility (0 = immediate, null = none) */
  yearsToCitizenship: number | null;
  /** Language required for citizenship, e.g. "German B1" */
  citizenshipLanguage?: string;
  jobOfferRequired: boolean | null;
  remoteFriendly: boolean | null;
  /** 0–1: how well the program includes spouse + children */
  familyFriendly: number;
  /** How easy the border is for an Azerbaijani passport */
  passportAccess: PassportAccess;
  /** Country development / quality of life, 1–10 */
  devScore: number;
  /** How smooth the bureaucracy is for AZ nationals, 1–5 */
  azEase: number;
  /** Languages that materially help this route */
  languageBonus?: string[];
  requirements: string[];
  pros: string[];
  cons: string[];
  taxNote?: string;
  url: string;
  /** Audit state of the recorded rules, not a claim that a linked page was checked. */
  verification?: {
    status: "unverified" | "verified";
    checkedAt: string | null;
    sourceUrl: string;
  };
  /** US Diversity Visa eligibility */
  dvLottery?: boolean;
  /** E-2 US treaty investor country */
  e2Treaty?: boolean;
  /** Archival decomposition provenance. Null numeric fields mean unknown, never zero. */
  pathway?: {
    parentId: string;
    recipeId: string;
    branch: string;
    unknownFields: string[];
    notes: string[];
    remoteWorkRequired: boolean;
    review?: {
      batchId: string;
      status: "partial";
      reviewedAt: string;
      claims: {topic: string; summary: string; sourceUrl: string; checkedAt: string; retrieval: "page" | "official-index"}[];
      limitations: string[];
      financialRequirements: {amount: number; currency: string; period: "one-time" | "monthly" | "annual" | "balance" | "assets"; description: string; sourceUrl: string}[];
    };
  };
}

export type Education = "highschool" | "bachelor" | "master" | "phd";
export type WorkField =
  | "it" | "medicine" | "engineering" | "finance"
  | "business" | "creative" | "trades" | "other";
export type Goal =
  | "citizenship" | "pr-fast" | "lowest-cost" | "top-qol"
  | "remote" | "business" | "study" | "family-safe";

export interface Profile {
  /** Optional documented facts; legacy financial sliders are planning estimates only. */
  evidence?: {routes:Record<string,import("./requirements").ApplicantEvidence>};
  citizenship: string; // ISO-ish key, e.g. "AZ"
  age: number;
  familyStatus: "single" | "couple" | "family";
  dependents: number;
  /** Liquid budget for relocation + investment, USD */
  budget: number;
  /** Current proven monthly income, USD */
  monthlyIncome: number;
  /** Expected monthly salary abroad, USD (0 = no job lined up) */
  expectedSalary: number;
  hasJobOffer: boolean;
  education: Education;
  experience: number;
  field: WorkField;
  englishLevel: 0 | 1 | 2 | 3; // none / basic / conversational / fluent
  turkish: boolean;
  russian: boolean;
  german?: boolean;
  goal: Goal;
  timeline: "asap" | "6m" | "1y" | "flexible";
  risk: "low" | "medium" | "high";
  regions: Region[]; // empty = all
  remoteWork: boolean;
}

export interface ScoreBreakdown {
  cost: number | null;
  speed: number | null;
  citizenship: number | null;
  qol: number;
  access: number;
  fit: number;
}
export type ScoreWeights = Record<keyof ScoreBreakdown, number>;

export type Eligibility = "eligible" | "conditional" | "ineligible";

export interface MatchExplanation {
  requirements?: {
    version: string;
    scope: "partial";
    result: import("./requirements").RequirementResult;
  };
  goalAligned: boolean;
  requiredBudget: number | null;
  budgetHeadroom: number | null;
  decisionMonths: number | null;
  dataComplete: boolean;
  missingFields: string[];
  knownBudgetFloor: number;
  accessCalibration: "AZ" | "unknown";
  strengths: string[];
  tradeoffs: string[];
  warnings: string[];
  nextSteps: string[];
  weights: ScoreWeights;
  baseScore: number;
  adjustments: { reason: string; points: number }[];
}

export interface MatchResult {
  program: Program;
  matchPct: number;
  breakdown: ScoreBreakdown;
  eligibility: Eligibility;
  /** Human-readable blocking issues */
  gateIssues: string[];
  /** Adjusted cost for the user's family size */
  adjustedCost: number | null;
  /** Transparent score calculation and the limits of the modeled checks. */
  explanation: MatchExplanation;
}

export const CATEGORY_META: Record<Category, { label: string; emoji: string; color: string }> = {
  skilled: { label: "Skilled work", emoji: "💼", color: "text-emerald-400" },
  work: { label: "General work", emoji: "🔧", color: "text-emerald-300" },
  investor: { label: "Investor", emoji: "📈", color: "text-amber-400" },
  passive: { label: "Passive income", emoji: "🌴", color: "text-lime-300" },
  nomad: { label: "Digital nomad", emoji: "🧳", color: "text-teal-300" },
  entrepreneur: { label: "Entrepreneur", emoji: "🚀", color: "text-amber-300" },
  student: { label: "Study route", emoji: "🎓", color: "text-yellow-200" },
  cbi: { label: "Citizenship by investment", emoji: "🛂", color: "text-gold" },
};

export const REGION_META: Record<Region, string> = {
  "Western Europe": "🇪🇺",
  "Nordics & Baltics": "🌲",
  "North America": "🗽",
  "Latin America": "🌮",
  "Caribbean & Pacific": "🏝️",
  "Gulf & Middle East": "🕌",
  "Asia-Pacific": "🏯",
  "Caucasus & Balkans": "⛰️",
  "Africa & Indian Ocean": "🦁",
};

export interface Citizenship {
  key: string;
  name: string;
  flag: string;
  visaFree: number;
  rank: number;
  dvLottery: boolean;
  note: string;
}

/** Passport data — engine is calibrated around the Azerbaijani passport */
export const CITIZENSHIPS: Citizenship[] = [
  { key: "AZ", name: "Azerbaijan", flag: "🇦🇿", visaFree: 76, rank: 66, dvLottery: true, note: "Engine flagship — every program below is hand-calibrated for this passport." },
  { key: "TR", name: "Türkiye", flag: "🇹🇷", visaFree: 118, rank: 51, dvLottery: false, note: "E-2 & Schengen-adjacent, strong global mobility." },
  { key: "GE", name: "Georgia", flag: "🇬🇪", visaFree: 121, rank: 48, dvLottery: false, note: "Visa-free Schengen access." },
  { key: "RU", name: "Russia", flag: "🇷🇺", visaFree: 116, rank: 55, dvLottery: false, note: "Sanctions may complicate banking abroad." },
  { key: "KZ", name: "Kazakhstan", flag: "🇰🇿", visaFree: 81, rank: 62, dvLottery: true, note: "DV-eligible, growing mobility." },
  { key: "UA", name: "Ukraine", flag: "🇺🇦", visaFree: 148, rank: 32, dvLottery: true, note: "Strong EU access; travel restrictions apply." },
  { key: "IR", name: "Iran", flag: "🇮🇷", visaFree: 45, rank: 94, dvLottery: true, note: "Many routes require enhanced vetting." },
  { key: "PK", name: "Pakistan", flag: "🇵🇰", visaFree: 33, rank: 104, dvLottery: true, note: "Investment routes dominate." },
  { key: "IN", name: "India", flag: "🇮🇳", visaFree: 62, rank: 80, dvLottery: false, note: "Strong skilled-worker routes." },
  { key: "CN", name: "China", flag: "🇨🇳", visaFree: 85, rank: 60, dvLottery: false, note: "No DV lottery; skilled routes lead." },
  { key: "BR", name: "Brazil", flag: "🇧🇷", visaFree: 173, rank: 17, dvLottery: false, note: "Already strong mobility." },
  { key: "GB", name: "United Kingdom", flag: "🇬🇧", visaFree: 187, rank: 6, dvLottery: false, note: "Elite mobility — many routes moot." },
];
