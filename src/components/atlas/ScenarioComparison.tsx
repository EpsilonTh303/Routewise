"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { MatchResult, Program, Profile, Region } from "@/lib/types";
import { REGION_META } from "@/lib/types";
import { compareScenarios } from "@/lib/scenarios";
import type { Plan } from "@/lib/scoring";
import { REQUIREMENT_VERSION } from "@/lib/route-requirements";

const regions = Object.keys(REGION_META) as Region[];
const timelines: {value:Profile["timeline"];label:string}[] = [
  {value:"asap",label:"As soon as possible"},{value:"6m",label:"Within 6 months"},
  {value:"1y",label:"Within 1 year"},{value:"flexible",label:"Flexible"},
];
const money = (value:number|null) => value===null ? "Not recorded" : `$${Math.round(value).toLocaleString("en-US")}`;

export function ScenarioComparison({profile,programs}:{profile:Profile;programs:Program[]}) {
  const [budget,setBudget]=useState(String(profile.budget));
  const [income,setIncome]=useState(String(profile.monthlyIncome));
  const [salary,setSalary]=useState(String(profile.expectedSalary));
  const [offer,setOffer]=useState(profile.hasJobOffer);
  const [dependents,setDependents]=useState(String(profile.dependents));
  const [remoteWork,setRemoteWork]=useState(profile.remoteWork);
  const [timeline,setTimeline]=useState<Profile["timeline"]>(profile.timeline);
  const [selectedRegions,setSelectedRegions]=useState<Region[]>([...profile.regions]);
  const [comparison,setComparison]=useState<ReturnType<typeof compareScenarios>|null>(null);
  const [error,setError]=useState<string|null>(null);

  const evaluate=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    setError(null);
    setComparison(null);
    const numberFields:[string,string][]=[["Available savings",budget],["Monthly income",income],["Offered monthly salary",salary],["Dependents",dependents]];
    for(const [label,raw] of numberFields) {
      if(raw.trim()==="") { setError(`${label} is required.`); return; }
      const value=Number(raw);
      if(!Number.isFinite(value)||value<0||value>Number.MAX_SAFE_INTEGER) { setError(`${label} must be a finite number from 0 to ${Number.MAX_SAFE_INTEGER.toLocaleString("en-US")}.`); return; }
    }
    if(!Number.isInteger(Number(dependents))||Number(dependents)>100) { setError("Dependents must be a whole number from 0 to 100."); return; }
    const changes:Partial<Profile>={budget:Number(budget),monthlyIncome:Number(income),expectedSalary:Number(salary),hasJobOffer:offer,
      dependents:Number(dependents),remoteWork,timeline,regions:selectedRegions};
    try { setComparison(compareScenarios(programs,profile,[{id:"what-if",label:"Hypothetical scenario",changes}],10)); }
    catch(cause) {
      const validation=cause as {issues?:{path:(string|number)[];message:string}[];message?:string};
      const issue=validation.issues?.[0];
      setError(issue?`${issue.path.join(".")||"Scenario"}: ${issue.message}`:validation.message??"Scenario could not be evaluated. Check the entered values and try again.");
    }
  };
  const scenario=comparison?.scenarios[0];

  const column=(title:string,results:MatchResult[],plans:Plan[])=> (
    <section className="min-w-0 rounded-2xl border border-white/10 bg-card p-4 sm:p-5" aria-label={title}>
      <h3 className="text-lg font-extrabold">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">Top goal aligned routes</p>
      {plans.length>0 ? <ol className="mt-4 space-y-3">{plans.map((plan,index)=><li key={plan.result.program.id} className="rounded-xl border border-white/10 p-3">
        <div className="flex min-w-0 items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-sm font-bold">{index+1}. {plan.result.program.flag} {plan.result.program.program}</p><p className="truncate text-xs text-muted-foreground">{plan.result.program.country}</p></div>
          <span className="shrink-0 text-sm font-bold">{plan.result.matchPct}%</span></div>
        <p className="mt-2 text-xs">{plan.result.eligibility} · Year one: {money(plan.result.adjustedCost)}</p>
        {plan.result.gateIssues.length>0&&<p className="mt-1 break-words text-xs text-amber-200">{plan.result.gateIssues.join(" · ")}</p>}
      </li>)}</ol> : <p className="mt-4 text-sm text-muted-foreground">No route currently passes the modeled strategy checks.</p>}
      <p className="mt-3 text-xs text-muted-foreground">{results.length} ranked results considered.</p>
    </section>
  );

  const field="block min-w-0 text-sm font-medium";
  const input="mt-1 block w-full min-w-0 rounded-lg border border-white/15 bg-background px-3 py-2 text-foreground";
  return <section className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6" aria-labelledby="scenario-title">
    <div className="rounded-3xl border border-emerald-400/20 bg-card p-4 sm:p-6">
      <h2 id="scenario-title" className="text-2xl font-extrabold">What if?</h2>
      <p className="mt-1 text-sm text-muted-foreground">Try a change and compare it with your current profile. The saved profile stays unchanged.</p>
      <form className="mt-5" onSubmit={evaluate}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className={field}>Available savings (USD)<input required className={input} aria-label="Scenario available savings" type="number" min="0" max={Number.MAX_SAFE_INTEGER} step="any" value={budget} onChange={e=>setBudget(e.target.value)} /></label>
          <label className={field}>Monthly income (USD)<input required className={input} aria-label="Scenario monthly income" type="number" min="0" max={Number.MAX_SAFE_INTEGER} step="any" value={income} onChange={e=>setIncome(e.target.value)} /></label>
          <label className={field}>Offered monthly salary (USD)<input required className={input} aria-label="Scenario offered monthly salary" type="number" min="0" max={Number.MAX_SAFE_INTEGER} step="any" value={salary} onChange={e=>setSalary(e.target.value)} /></label>
          <label className={field}>Dependents<input required className={input} aria-label="Scenario dependents" type="number" min="0" max="100" step="1" value={dependents} onChange={e=>setDependents(e.target.value)} /></label>
          <label className={field}>Timeline<select className={input} aria-label="Scenario timeline" value={timeline} onChange={e=>setTimeline(e.target.value as Profile["timeline"])}>{timelines.map(item=><option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
          <label className={field}>Preferred regions<select multiple className={`${input} min-h-28`} aria-label="Scenario preferred regions" value={selectedRegions} onChange={e=>setSelectedRegions(Array.from(e.target.selectedOptions,option=>option.value as Region))}>{regions.map(item=><option key={item} value={item}>{item}</option>)}</select></label>
          <label className="flex min-h-11 items-center gap-3 rounded-lg border border-white/10 px-3 text-sm"><input type="checkbox" checked={offer} onChange={e=>setOffer(e.target.checked)} />I have a job offer</label>
          <label className="flex min-h-11 items-center gap-3 rounded-lg border border-white/10 px-3 text-sm"><input type="checkbox" checked={remoteWork} onChange={e=>setRemoteWork(e.target.checked)} />I work remotely</label>
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="submit" className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-extrabold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300">Evaluate scenario</button>
          <button type="button" className="rounded-xl border border-white/15 px-5 py-3 text-sm font-bold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2" onClick={()=>{setBudget(String(profile.budget));setIncome(String(profile.monthlyIncome));setSalary(String(profile.expectedSalary));setOffer(profile.hasJobOffer);setDependents(String(profile.dependents));setRemoteWork(profile.remoteWork);setTimeline(profile.timeline);setSelectedRegions([...profile.regions]);setComparison(null);setError(null);}}>Reset</button>
          <p className="text-xs text-muted-foreground" role="note">Scenario changes are temporary and are never saved.</p>
        </div>
      </form>
      <p className="mt-3 text-xs text-muted-foreground">Requirement rules: {comparison?.ruleVersion??REQUIREMENT_VERSION}. Financial evidence compares only in the same currency; no FX conversion is applied.</p>
      {error&&<p className="mt-4 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-sm text-red-200" role="alert">{error}</p>}
      {comparison&&scenario&&<div className="mt-6 grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2" aria-live="polite">
        {column("Current profile",comparison.base.results,comparison.base.plans)}
        {column("Hypothetical scenario",scenario.results,scenario.plans)}
      </div>}
      {scenario&&<section className="mt-5 rounded-2xl border border-white/10 bg-card p-4" aria-label="Scenario changes">
        <h3 className="text-lg font-extrabold">What changed</h3>
        <p className="mt-1 text-xs text-muted-foreground">{scenario.totalChanges===0?"No ranking or modeled result changes.":`Showing ${scenario.changes.length} of ${scenario.totalChanges} changed programs.`}</p>
        {scenario.changes.length>0&&<ul className="mt-3 space-y-3">{scenario.changes.map(change=>{
          const program=programs.find(item=>item.id===change.programId);
          return <li key={change.programId} className="rounded-xl border border-white/10 p-3 text-sm">
            <p className="font-bold">{program?.program??change.programId}: {change.before.score}% → {change.after.score}% · rank {change.before.rank} → {change.after.rank} · {change.before.eligibility} → {change.after.eligibility}</p>
            {change.dimensions.length>0&&<p className="mt-1 text-xs text-muted-foreground">Dimensions: {change.dimensions.map(item=>`${item.dimension} ${item.before??"—"} → ${item.after??"—"}`).join("; ")}</p>}
            {change.adjustments.length>0&&<ul className="mt-1 list-inside list-disc text-xs text-muted-foreground">{change.adjustments.map(item=><li key={item.reason}>{item.reason}: {item.before??"—"} → {item.after??"—"}</li>)}</ul>}
            {change.requirements.length>0&&<ul className="mt-2 list-inside list-disc text-xs">{change.requirements.map(item=><li key={item.id}>Requirement: {item.label} ({item.before??"not present"} → {item.after??"not present"})</li>)}</ul>}
          </li>;
        })}</ul>}
      </section>}
    </div>
  </section>;
}
