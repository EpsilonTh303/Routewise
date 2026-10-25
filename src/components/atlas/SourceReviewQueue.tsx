"use client";

import { useMemo } from "react";
import type { Program } from "@/lib/types";
import { buildSourceReviewQueue } from "@/lib/source-freshness";

export function SourceReviewQueue({programs,asOf}:{programs:Program[];asOf:string}) {
  const queue=useMemo(()=>buildSourceReviewQueue(programs,{asOf,maxAgeDays:90,limit:10}),[programs,asOf]);
  const counts=queue.counts;
  return <details className="rounded-2xl border border-amber-400/20 bg-card p-4 sm:p-5">
    <summary className="cursor-pointer list-none text-base font-extrabold focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300">
      Source review queue <span className="ml-2 text-xs font-normal text-muted-foreground">As of {queue.asOf} · {counts.conflicts} conflicts · {counts.stale} stale</span>
    </summary>
    <div className="mt-4 space-y-4">
      <p className="text-xs text-muted-foreground">Read-only source tracking. Partial review means selected claims were checked; it does not mean a route is verified or legally eligible.</p>
      <dl className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-3 lg:grid-cols-6">
        {([["Unreviewed",counts.unreviewed],["Partial",counts.partial],["Unresolved",counts.unresolved],["Verified",counts.verified],["Stale",counts.stale],["Index only",counts.indexOnly],["Conflicts",counts.conflicts]] as const).map(([label,value])=><div key={label} className="rounded-lg border border-white/10 p-2"><dt className="text-muted-foreground">{label}</dt><dd className="mt-1 font-bold">{value}</dd></div>)}
      </dl>
      <p className="text-xs text-muted-foreground">Showing up to {queue.items.length} of {counts.total} routes · freshness threshold {queue.maxAgeDays} days.</p>
      <ol className="space-y-3">{queue.items.map(item=><li key={item.id} className="min-w-0 rounded-xl border border-white/10 p-3">
        <h3 className="break-words text-sm font-bold">{item.country} · {item.program}</h3>
        <p className="mt-1 text-xs text-muted-foreground">{item.status==="verified"?"Verified record status":item.status==="partial"?"Partial claim review":item.status==="unresolved"?"Audit attempt unresolved": "No source review recorded"}{item.reviewedAt?` · reviewed ${item.reviewedAt}`:""}</p>
        {item.reasons.length>0&&<ul className="mt-2 flex flex-wrap gap-1.5">{item.reasons.map(reason=><li key={reason} className="rounded-full bg-amber-400/10 px-2 py-1 text-[11px] text-amber-100">{reason}</li>)}</ul>}
        {item.sources.length>0&&<ul className="mt-3 space-y-2">{item.sources.map((source,index)=><li key={`${source.url}-${index}`} className="min-w-0 text-xs"><p className="break-words">{source.topic}{source.checkedAt?` · checked ${source.checkedAt}`:" · no dated review"}{source.retrieval==="official-index"?" · index only":""}</p><a className="block break-all text-emerald-300 underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.summary}</a></li>)}</ul>}
      </li>)}</ol>
    </div>
  </details>;
}
