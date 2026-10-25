import type {
  Profile, Program, MatchResult, ScoreBreakdown, ScoreWeights, Eligibility, Goal,
} from "./types";
import { ALL_PROGRAMS } from "./data";
import { assessRouteRequirements } from "./route-requirements";
import { flattenRequirements } from "./requirements";
import { sourceReview } from "./source-review";

/* ------------------------------------------------------------------ */
/* Goal weighting — each goal redistributes the 6 score dimensions      */
/* ------------------------------------------------------------------ */
const GOAL_WEIGHTS: Record<Goal, ScoreWeights> = {
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
  if (u.german) knows.add("German");
  for (const l of p.languageBonus ?? []) if (knows.has(l)) bonus += 6;
  return Math.min(bonus, 14);
}

/** Expected total year-one spend for this user's family */
export function adjustedCost(p: Program, u: Profile): number | null {
  const deps = Math.max(u.dependents, u.familyStatus === "single" ? 0 : 1);
  if(p.totalYearOneCost===null || (deps>0 && p.costPerDependent===null)) return null;
  return p.totalYearOneCost + deps * (p.costPerDependent??0);
}

/** Required liquid budget: recorded capital floor or family spending, whichever is higher.
 * Year-one costs may already include investment, so do not add the floor twice.
 */
export function requiredBudget(p: Program, u: Profile): number | null {
  const cost=adjustedCost(p,u);
  return p.minBudget===null || cost===null ? null : Math.max(p.minBudget,cost);
}

export function compareOptionalNumber(a:number|null,b:number|null):number {
  return a===null?(b===null?0:1):b===null?-1:a-b;
}

export function programDataGaps(p:Program,u:Profile):string[] {
  const gaps=["minBudget","minMonthlyIncome","totalYearOneCost","processingWeeks","jobOfferRequired","remoteFriendly"].filter(key=>p[key as keyof Program]===null);
  gaps.push(...(p.audit?.unknownFields.filter(field=>!gaps.includes(field))??[]));
  if((u.dependents>0||u.familyStatus!=="single")&&p.costPerDependent===null) gaps.push("costPerDependent");
  if(u.goal==="citizenship"&&p.pathway?.unknownFields.includes("yearsToCitizenship")) gaps.push("yearsToCitizenship");
  return gaps;
}

/* ------------------------------------------------------------------ */
/* Hard gates — budget, income, age, education                          */
/* ------------------------------------------------------------------ */
function runGates(p: Program, u: Profile, requirements:ReturnType<typeof assessRouteRequirements>) {
  const issues: string[] = [];
  if(p.audit?.routeStatus==="closed") issues.push("Official source records this route as closed or paused to new applications");
  const cost = adjustedCost(p, u);
  const funds = requiredBudget(p, u);
  const checks=requirements?flattenRequirements(requirements.result):[];
  const structuredIncome=checks.some(check=>check.comparison?.kind==="income");
  const structuredInvestment=checks.some(check=>check.comparison?.kind==="investment");
  const knownFloor=Math.max(structuredInvestment?0:p.minBudget??0,p.totalYearOneCost??0,cost??0);

  // Budget gate (one-time investment + relocation all-in)
  if (u.budget < knownFloor) {
    issues.push(`Need ${funds===null?"at least ":"≈ "}$${Math.ceil(knownFloor - u.budget).toLocaleString("en-US")} more available funds${funds===null?" for the known cost floor":""}`);
  }

  // Sponsored routes need offered salary; income-proof routes need current income.
  const qualifyingIncome = p.jobOfferRequired ? (u.hasJobOffer ? u.expectedSalary : 0) : u.monthlyIncome;
  if (!structuredIncome && p.minMonthlyIncome !== null && p.minMonthlyIncome > 0 && (!p.jobOfferRequired || u.hasJobOffer) && qualifyingIncome < p.minMonthlyIncome) {
    const gap = Math.ceil(p.minMonthlyIncome - qualifyingIncome);
    issues.push(`${p.jobOfferRequired ? "Offered salary" : "Income"} short by ≈ $${gap.toLocaleString("en-US")}/mo`);
  }

  // Job-offer gate for sponsored routes
  if (p.jobOfferRequired && !u.hasJobOffer && !(requirements&&u.evidence?.routes[p.id]?.facts?.localEmploymentContract===true)) {
    issues.push("Employer sponsorship required");
  }
  if(p.pathway?.remoteWorkRequired&&!u.remoteWork&&!requirements) issues.push("Remote-work evidence required by this archived pathway");

  return { issues, cost, funds, knownFloor, eligible: issues.length === 0 };
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
        else s -= 26;
      }
      if (u.age >= 45) s -= 15; else if (u.age <= 35) s += 6;
      return clamp(s);
    }
    case "investor": {
      if(p.minBudget===null||p.totalYearOneCost===null) return 50;
      const headroom = ratio(u.budget, Math.max(p.minBudget, p.totalYearOneCost));
      let s = clamp(40 + Math.log2(Math.max(headroom, 0.5)) * 22, 10, 100);
      if (u.field === "business" || u.field === "finance") s += 8;
      if (u.experience >= 5) s += 6;
      return clamp(s);
    }
    case "passive": {
      if(p.minMonthlyIncome===null) return 50;
      const inc = ratio(u.monthlyIncome, Math.max(p.minMonthlyIncome, 1));
      return clamp(35 + Math.log2(Math.max(inc, 0.4)) * 24 + (u.age >= 45 ? 6 : 0));
    }
    case "nomad": {
      if (!u.remoteWork) return 30;
      if(p.minMonthlyIncome===null) return 50;
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
      if(p.totalYearOneCost===null) return 50;
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
  const requirements=assessRouteRequirements(p,u);
  const { issues, cost, funds, knownFloor, eligible } = runGates(p, u,requirements);
  const requirementStatus=requirements?.result.status;
  const missingFields=programDataGaps(p,u);
  const costScore = funds === null ? null : funds === 0 ? 100 : clamp(45 + Math.log2(Math.max(ratio(u.budget, funds), 0.25)) * 24);
  // Decision speed is distinct from the residence clock. Missing PR is not a five-year wait.
  const speedScore = p.processingWeeks===null?null:100 / (1 + p.processingWeeks / 26);
  const citizenshipScore = p.pathway?.unknownFields.includes("yearsToCitizenship")||p.audit?.unknownFields.includes("yearsToCitizenship")?null:p.yearsToCitizenship === null ? 0 : p.yearsToCitizenship === 0 ? 100 : clamp(110 - p.yearsToCitizenship * 10);
  const hasFamily = u.familyStatus !== "single" || u.dependents > 0;
  const qolScore = clamp(p.devScore * 10 - (hasFamily || u.goal === "family-safe" ? (1 - p.familyFriendly) * 12 : 0));
  // The dataset has AZ-specific entry data only. An unknown passport gets a neutral value.
  const accessScore = u.citizenship === "AZ" ? clamp(ACCESS_BASE[p.passportAccess] * 0.72 + p.azEase * 20 * 0.28) : 50;
  let fit = clamp(fitScore(p, u) + languageFit(p, u));
  if (u.risk === "low" && p.category === "cbi") fit *= 0.72;
  if (u.risk === "high" && p.category === "cbi") fit = Math.min(100, fit * 1.12);
  const breakdown: ScoreBreakdown = {
    cost:costScore===null?null:Math.round(costScore),speed:speedScore===null?null:Math.round(speedScore),citizenship:citizenshipScore===null?null:Math.round(citizenshipScore),
    qol:Math.round(qolScore),access:Math.round(accessScore),fit:Math.round(fit),
  };
  const w = { ...GOAL_WEIGHTS[u.goal] };
  if (u.timeline === "asap") w.speed *= 1.5;
  if (u.timeline === "flexible") w.cost *= 1.15;
  const dimensions = Object.keys(w) as (keyof ScoreBreakdown)[];
  for(const key of dimensions) if(breakdown[key]===null) w[key]=0;
  const wsum = dimensions.reduce((sum,key)=>sum+w[key],0);
  const baseScore = dimensions.reduce((sum,key)=>sum+(breakdown[key]??0)*w[key],0)/wsum;
  const strengths:string[]=[],tradeoffs:string[]=[],warnings:string[]=[],nextSteps:string[]=[];
  if(languageFit(p,u)>0) strengths.push("Your language skills overlap with languages useful for this route.");
  if(requirements) {
    warnings.push("Structured checks cover selected dated claims only. Applicant-reported evidence is not authority verification or full legal eligibility.");
    for(const check of flattenRequirements(requirements.result).filter(check=>!check.children&&check.status!=="met")) nextSteps.push(`${check.label}: ${check.reason}`);
  }
  const adjustments:{reason:string;points:number}[]=[];
  const adjust=(reason:string,points:number)=>{adjustments.push({reason,points:Math.round(points*100)/100});tradeoffs.push(reason);};
  if (!eligible) adjust("Recorded requirements are not yet met",-14-Math.min(10,(issues.length-1)*4));
  if(missingFields.length) adjust("Branch-specific financial or timing information is incomplete",-10);
  if (u.regions.length>0 && !u.regions.includes(p.region)) adjust("Outside your preferred regions",-12);
  else if (u.regions.length>0) strengths.push("In one of your preferred regions");
  const goalAligned = u.goal === "citizenship" ? p.yearsToCitizenship !== null
    : u.goal === "remote" ? p.remoteFriendly===true
    : u.goal === "business" ? ["entrepreneur","investor"].includes(p.category)
    : u.goal === "study" ? p.category === "student"
    : u.goal === "family-safe" ? p.familyFriendly >= 0.75 : true;
  if (!goalAligned) adjust(u.goal === "citizenship" ? "No citizenship path is recorded for this route"
    : u.goal === "remote" ? "This route is not recorded as remote-work friendly"
    : "This route does not directly match your selected goal",u.goal === "remote" ? -22 : -18);
  else strengths.push(["citizenship","remote","business","study","family-safe"].includes(u.goal)?"Matches the type of route sought by your goal":"Evaluated using your goal's priority weights");
  const decisionMonths = p.processingWeeks===null?null:3 + p.processingWeeks * 12 / 52;
  const target = u.timeline === "asap" ? 3 : u.timeline === "6m" ? 6 : u.timeline === "1y" ? 12 : null;
  if (target !== null && decisionMonths!==null && decisionMonths > target) adjust("Recorded processing plus planning lead-in exceeds your timeline",-Math.min(18,(decisionMonths-target)/target*10));
  if (p.dvLottery) {
    adjust("Lottery selection is uncertain; this is not a dependable primary route",u.risk === "low" ? -30 : -20);
    warnings.push("This model does not evaluate selection or all lottery entry requirements.");
  }
  if (p.category === "cbi" && u.risk === "low") adjust("Investment-citizenship route conflicts with a low-risk preference",-6);
  if (u.risk === "low" && funds!==null && funds>0 && u.budget>=funds && u.budget<funds*1.2) adjust("Limited cash buffer above the recorded funds requirement",-(1.2-u.budget/funds)*30);
  if (funds!==null&&u.budget>=funds) strengths.push("Recorded capital and modeled family costs fit your available budget");
  if (p.processingWeeks!==null&&p.processingWeeks<=12) strengths.push("Recorded decision estimate is within twelve weeks of filing");
  if (hasFamily && p.familyFriendly>=0.9) strengths.push("High recorded family-inclusion score");
  if (u.citizenship!=="AZ") warnings.push("Passport access for your citizenship is not modeled; the access dimension uses a neutral score.");
  if (p.verification?.status!=="verified") warnings.push(sourceReview(p)?.claims.length?"Selected claims have dated official-source evidence; the full program, costs and eligibility remain unverified.":"Program rules and figures have not been source-verified.");
  if(p.audit) warnings.push(...p.audit.limitations,...(p.audit.routeStatus==="unclear"?["Current intake availability is unresolved; this route cannot enter a primary strategy."]:[]));
  warnings.push("Only recorded financial and sponsorship checks are automated. Review the listed qualifications, nationality rules, income type and any alternative qualifying paths.");
  if (p.category === "nomad" && !u.remoteWork) warnings.push("Remote-work evidence is not supplied; check which qualifying path applies.");
  if ((u.familyStatus==="single" && u.dependents>0) || (u.familyStatus!=="single" && u.dependents===0)) warnings.push("Household status and dependent count disagree; costs include at least the declared dependents and any implied partner.");
  if (p.category==="student" || (["skilled","work"].includes(p.category) && u.education==="highschool")) warnings.push("Age and education influence heuristic fit; they do not establish a legal rejection without program-specific rules.");
  if(missingFields.length){warnings.push(`Unknown branch fields: ${missingFields.join(", ")}. They are not zero and their score dimensions are omitted.`);nextSteps.push("Establish the missing branch costs, timing and conditions before relying on this pathway.");}
  if(p.pathway) warnings.push(...p.pathway.notes);
  if(u.budget<knownFloor) nextSteps.push(`Resolve the known available-funds gap of at least $${Math.ceil(knownFloor-u.budget).toLocaleString("en-US")}.`);
  if(p.jobOfferRequired&&!u.hasJobOffer) nextSteps.push("Obtain the employer sponsorship required by this recorded route before relying on it.");
  if(!requirements && p.minMonthlyIncome!==null && p.minMonthlyIncome>0 && (!p.jobOfferRequired||u.hasJobOffer) && (p.jobOfferRequired?u.expectedSalary:u.monthlyIncome)<p.minMonthlyIncome) nextSteps.push(`Check documented ${p.jobOfferRequired?"offered salary":"income"} against the recorded $${p.minMonthlyIncome.toLocaleString("en-US")}/month floor.`);
  if(!goalAligned) nextSteps.push("Compare a route that directly supports your selected goal.");
  nextSteps.push("Verify the remaining requirements and current figures using the official source link.");
  const status:Eligibility=requirementStatus==="unmet"||p.audit?.routeStatus==="closed"?"ineligible":eligible?(missingFields.length||requirementStatus==="unknown"||p.audit?.routeStatus==="unclear"?"conditional":"eligible"):issues.length===1 && u.budget>=knownFloor*0.75?"conditional":"ineligible";
  return {program:p,matchPct:Math.round(clamp(baseScore+adjustments.reduce((sum,item)=>sum+item.points,0),0,98)),breakdown,
    eligibility:status,gateIssues:[...issues,...(missingFields.length?["Branch data incomplete — review needed"]:[]),...(requirements&&requirementStatus!=="met"?[`Structured requirements: ${requirementStatus}`]:[])],adjustedCost:cost,
    explanation:{goalAligned,requiredBudget:funds,budgetHeadroom:funds===null?null:u.budget-funds,decisionMonths,dataComplete:missingFields.length===0,missingFields,knownBudgetFloor:knownFloor,
      ...(requirements?{requirements}:{}),accessCalibration:u.citizenship==="AZ"?"AZ":"unknown",strengths,tradeoffs,warnings,nextSteps,weights:w,baseScore,adjustments}};
}

export function matchPrograms(programs: Program[], u: Profile): MatchResult[] {
  return programs.map((p) => scoreProgram(p, u)).sort(compareMatches);
}

/** Ready modeled checks first, then goal alignment and fit; stable across input order. */
export function compareMatches(a:MatchResult,b:MatchResult):number {
  const readiness:Record<Eligibility,number>={eligible:0,conditional:1,ineligible:2};
  return readiness[a.eligibility]-readiness[b.eligibility]
    || Number(a.explanation?.dataComplete===false)-Number(b.explanation?.dataComplete===false)
    || Number(a.explanation?.goalAligned===false)-Number(b.explanation?.goalAligned===false)
    || b.matchPct-a.matchPct || compareOptionalNumber(a.adjustedCost,b.adjustedCost)
    || (a.program.id<b.program.id?-1:a.program.id>b.program.id?1:0);
}

/** Compatibility helper for the original import fixture. Live interfaces use matchPrograms. */
export function matchAll(u: Profile): MatchResult[] {
  return matchPrograms(ALL_PROGRAMS, u);
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
  const seen=new Set<string>();
  const viable = [...results].sort(compareMatches).filter(r=>{
    if(seen.has(r.program.id) || r.eligibility==="ineligible" || r.program.dvLottery || (r.program.audit&&r.program.audit.routeStatus!=="open") || r.explanation?.goalAligned===false || r.explanation?.dataComplete===false || (r.explanation?.requirements && r.explanation.requirements.result.status!=="met")) return false;
    seen.add(r.program.id);return true;
  });
  if (viable.length === 0) return [];
  const a = viable[0];
  const chosen=[a];
  // Diversify only within ten fit points of the best remaining route at the same readiness.
  const pickAlternative=()=>{
    const remaining=viable.filter(r=>!chosen.some(existing=>existing.program.id===r.program.id));
    if(!remaining.length) return undefined;
    const ready=remaining.filter(r=>r.eligibility===remaining[0].eligibility);
    const best=Math.max(...ready.map(r=>r.matchPct));
    const diversity=(r:MatchResult)=>Number(chosen.every(x=>x.program.country!==r.program.country))*2+Number(chosen.every(x=>x.program.category!==r.program.category));
    return ready.filter(r=>r.matchPct>=best-10).sort((x,y)=>diversity(y)-diversity(x)||compareMatches(x,y))[0];
  };
  const b=pickAlternative();if(b) chosen.push(b);
  const c=pickAlternative();
  const conditional=(r:MatchResult)=>r.eligibility==="conditional"?" Resolve the listed requirements before relying on this route.":" Other source requirements still need review.";
  const note=(r:MatchResult)=>{
    const differentCountry=r.program.country!==a.program.country,differentCategory=r.program.category!==a.program.category;
    return (differentCountry&&differentCategory?"Different country and route category among similarly ranked options.":differentCountry?"A different country among similarly ranked options.":differentCategory?"A different route category among similarly ranked options.":"Another program at a similar readiness level.")+conditional(r);
  };
  const plans:Plan[]=[{result:a,role:"Plan A — Primary",roleNote:(a.eligibility==="eligible"?"Best goal-aligned fit among routes passing the modeled checks.":"No ready goal-aligned route is available; this is a conditional candidate.")+conditional(a)}];
  if(b) plans.push({result:b,role:"Plan B — Hedge",roleNote:note(b)});
  if(c) plans.push({result:c,role:"Plan C — Alternative",roleNote:note(c)});
  return plans;
}

/* ------------------------------------------------------------------ */
/* Roadmap steps for one program                                        */
/* ------------------------------------------------------------------ */
export interface RoadmapStep {
  label: string;
  detail: string;
  monthsFromNow: number | null;
  icon: string;
}

export function buildRoadmap(p: Program, u: Profile): RoadmapStep[] {
  const studyIds=['de-masters-study','de-graduate-jobsearch','nl-graduate-orientation-year','fi-graduate-jobsearch'];
  if(studyIds.includes(p.id)&&assessRouteRequirements(p,u)?.result.id===p.id) {
    const germany=p.country==='Germany';
    const student=p.id==='de-masters-study';
    return [
      {label:student?'Admission & student permission':'Qualifying completion & permit history',detail:student?'Obtain qualifying German master’s admission, programme language evidence, living funds and the student residence decision. Tuition and actual course duration depend on the selected programme.':'Prove the specific qualifying graduation/research, institution and prior permit history described in this route’s requirements. A generic degree selection is insufficient.',monthsFromNow:null,icon:'🎓'},
      {label:'Apply for post-study permission',detail:germany?'After successful German completion, apply in time for up to 18 months to seek qualified work. Insurance and livelihood proof apply; it is not renewable.':p.country==='Netherlands'?'Apply within the qualifying three-year window. The orientation year lasts one year and cannot be extended; foreign institution cases have additional ranking/language/evaluation conditions.':'Check the five-year filing window, prior permit class and funds. Permission can last up to two years, subject to the split-period rules and the requested duration.',monthsFromNow:null,icon:'📨'},
      {label:'Work during the search period',detail:germany?'Any occupation may be worked while seeking qualified employment on the graduate search permit.':p.country==='Netherlands'?'The granted orientation-year permit allows unrestricted work and self-employment; interim application work needs the stated endorsement.':'The granted permit permits unrestricted work. Interim work depends on timely extended application and prior status.',monthsFromNow:null,icon:'🔎'},
      {label:'Separate employment / business status',detail:germany?'A qualifying offer may support a skilled-worker permit or EU Blue Card application. Check recognition, salary, licensing and the chosen title’s conditions.':p.country==='Netherlands'?'Before expiry, meet and apply for a new status, such as highly skilled migrant with recognised sponsor, contract and applicable salary.':'For continued stay after this permission, meet and apply for the appropriate employment/business status. A job does not require switching while the search permit itself remains valid.',monthsFromNow:null,icon:'💼'},
      {label:'Conditional permanent residence',detail:germany?'German graduates may qualify under the separate skilled-worker settlement route after the required two years of qualifying status and 24 months pension contributions, with language, livelihood and other conditions. Study/search time is not that employment clock.':'Assess the separate permanent-residence path, qualifying permit history, residence credit, income, language and absence conditions. Do not add course length and search-permit validity to predict PR.',monthsFromNow:null,icon:'🏠'},
      {label:'Separate citizenship assessment',detail:'Naturalisation has independent requirements and residence-credit rules. This pilot establishes no citizenship date; no stage guarantees the next.',monthsFromNow:null,icon:'🛂'},
    ];
  }
  const steps: RoadmapStep[] = [];
  const family =
    u.familyStatus === "single" && u.dependents===0 ? "" : " + dependents' documents";
  const decision=p.processingWeeks===null?null:3+p.processingWeeks*12/52;
  const activation=decision===null?null:decision+1;
  const money=(n:number|null)=>n===null?"needs review":`$${n.toLocaleString("en-US")}`;
  steps.push({
    label: "Document preparation",
    detail: `Passport renewal, apostilles, police clearance, bank statements${family}`,
    monthsFromNow: 1.5,
    icon: "📄",
  });
  steps.push({
    label: "Application filed",
    detail: `${p.program} scenario — modeled year-one cost: ${money(adjustedCost(p,u))}; available funds: ${money(requiredBudget(p,u))}`,
    monthsFromNow: 3,
    icon: "📨",
  });
  steps.push({
    label: "Decision expected",
    detail: p.processingWeeks===null?"Branch-specific processing time has not been established; no decision date is predicted":`Recorded processing estimate: ~${p.processingWeeks} weeks after filing; timing and approval are not guaranteed`,
    monthsFromNow: decision,
    icon: "⏳",
  });
  if(p.yearsToCitizenship===0) {
    steps.push({label:"Complete citizenship formalities",detail:"Direct-citizenship scenario, subject to approval and the recorded program conditions; relocation is not assumed",monthsFromNow:activation,icon:"🛂"});
    return steps;
  }
  if(decision===null) return steps;
  steps.push({
    label: "Relocate & activate",
    detail: `Register residence${p.jobOfferRequired ? " (with employer start date)" : ""}, open bank account`,
    monthsFromNow: activation,
    icon: "🛬",
  });
  if (p.yearsToPR != null) {
    steps.push({
      label: "Permanent residence",
      detail: p.yearsToPR===0?"PR on activation is recorded for this route; verify approval conditions":`${p.yearsToPR} modeled years after residence activation; verify the actual residence-clock rules`,
      monthsFromNow: activation===null?null:activation+p.yearsToPR*12,
      icon: "🏠",
    });
  }
  if (p.yearsToCitizenship != null && p.yearsToCitizenship > 0) {
    steps.push({
      label: "Citizenship application",
      detail: `Recorded residence milestone: ${p.yearsToCitizenship} years${p.citizenshipLanguage ? ` — ${p.citizenshipLanguage}` : ""}; other naturalization requirements still apply`,
      monthsFromNow: activation===null?null:activation+p.yearsToCitizenship*12,
      icon: "🛂",
    });
  }
  return steps.sort((a,b)=>compareOptionalNumber(a.monthsFromNow,b.monthsFromNow));
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
