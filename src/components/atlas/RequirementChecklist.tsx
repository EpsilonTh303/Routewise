import type { RequirementResult } from "@/lib/requirements";

export function RequirementChecklist({result}:{result:RequirementResult}) {
  return <div className="min-w-0 rounded-xl border border-white/10 p-3 text-xs">
    <p className="font-semibold">{result.label} <span className={result.status==="met"?"text-emerald-300":result.status==="unmet"?"text-red-300":"text-amber-200"}>· {result.status}</span></p>
    <p className="mt-1 text-muted-foreground">{result.reason}</p>
    {result.comparison&&<p className="mt-1">Source threshold: {result.comparison.currency} {result.comparison.amount.toLocaleString("en-US")} · {result.comparison.kind}{result.comparison.period?` · ${result.comparison.period}`:""}{result.comparison.basis?` · ${result.comparison.basis==="unspecified"?"gross/net unspecified by source":result.comparison.basis}`:""}{result.comparison.minHistoryMonths?` · ${result.comparison.minHistoryMonths} months history`:""}</p>}
    <a href={result.source.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block break-all text-emerald-300 underline">Official source · reviewed {result.source.reviewedAt.slice(0,10)}{result.source.retrieval==="official-index"?" · indexed evidence":""}</a>
    {result.children&&<div className="mt-3 space-y-2 border-l border-white/15 pl-2">{result.children.map(child=><RequirementChecklist key={child.id} result={child}/>)}</div>}
  </div>;
}
