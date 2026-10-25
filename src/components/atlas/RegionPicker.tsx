"use client";

import {useId} from "react";
import type {Region} from "@/lib/types";
import {REGION_META} from "@/lib/types";

export function RegionPicker({value,onChange,label="Preferred regions"}:{value:Region[];onChange:(regions:Region[])=>void;label?:string}) {
  const groupId=useId();
  return <fieldset className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.02] p-4" aria-label={label}>
    <legend className="px-1 text-sm font-semibold">{label}</legend>
    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
      <p className="text-xs text-muted-foreground">{value.length?`${value.length} selected` : "All regions · choose any that interest you"}</p>
      {value.length>0&&<button type="button" onClick={()=>onChange([])} className="rounded-lg px-3 py-2 text-xs font-semibold text-emerald-300 hover:bg-white/5">Clear regions</button>}
    </div>
    <div className="grid min-w-0 gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {(Object.keys(REGION_META) as Region[]).map((region,index)=><label key={region} htmlFor={`${groupId}-${index}`} className={`flex min-h-12 min-w-0 cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 text-sm transition-colors ${value.includes(region)?"border-emerald-400/60 bg-emerald-400/10 text-emerald-100":"border-white/10 text-muted-foreground hover:border-white/25"}`}>
        <input id={`${groupId}-${index}`} type="checkbox" checked={value.includes(region)} onChange={event=>onChange(event.target.checked?[...value,region]:value.filter(item=>item!==region))} className="h-4 w-4 shrink-0 accent-emerald-400"/>
        <span aria-hidden="true" className="shrink-0">{REGION_META[region]}</span><span className="min-w-0 break-words">{region}</span>
      </label>)}
    </div>
  </fieldset>;
}
