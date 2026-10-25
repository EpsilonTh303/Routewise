import type { Program } from "./types";

export type SourceQueueOptions = {asOf:string;maxAgeDays?:number;limit?:number};
export type SourceQueueReason = "Potential source conflict"|"Index-only evidence"|"Unreviewed"|"Review is stale"|"Partial coverage";
export type SourceQueueItem = {
  id:string;country:string;program:string;status:"unreviewed"|"partial"|"verified";
  reviewedAt:string|null;reasons:SourceQueueReason[];
  sources:{topic:string;summary:string;url:string;checkedAt:string|null;retrieval:"page"|"official-index"|"unreviewed"}[];
};
export type SourceReviewQueue = {
  asOf:string;maxAgeDays:number;limit:number;
  counts:{total:number;unreviewed:number;partial:number;verified:number;stale:number;indexOnly:number;conflicts:number};
  items:SourceQueueItem[];
};

function validDate(value:string):boolean {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed=new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(parsed.getTime())&&parsed.toISOString().slice(0,10)===value;
}
function dayNumber(value:string):number {return Date.parse(`${value}T00:00:00.000Z`)/86400000;}
const conflictWords=/\b(conflict(?:s|ing)?|contradict(?:s|ory|ion)?|disagree(?:s|ment)?|discrepan(?:cy|cies)?)\b/i;

export function buildSourceReviewQueue(programs:Program[],options:SourceQueueOptions):SourceReviewQueue {
  const {asOf}=options;
  const maxAgeDays=options.maxAgeDays??90,limit=options.limit??20;
  if(typeof asOf!=="string"||!validDate(asOf)) throw new Error("asOf must be a valid YYYY-MM-DD date.");
  if(!Number.isInteger(maxAgeDays)||maxAgeDays<1||maxAgeDays>3650) throw new Error("maxAgeDays must be an integer from 1 to 3650.");
  if(!Number.isInteger(limit)||limit<1||limit>100) throw new Error("limit must be an integer from 1 to 100.");

  const rows=programs.map(program=>{
    const review=program.pathway?.review;
    const verified=program.verification?.status==="verified";
    const status:SourceQueueItem["status"]=verified?"verified":review?"partial":"unreviewed";
    const reviewedAt=review?.reviewedAt.slice(0,10)??program.verification?.checkedAt?.slice(0,10)??null;
    const sources=review
      ?review.claims.map(claim=>({topic:claim.topic,summary:claim.summary,url:claim.sourceUrl,checkedAt:claim.checkedAt.slice(0,10),retrieval:claim.retrieval}))
      :verified
        ?[{topic:"Verification source",summary:"The catalog record is marked verified; this queue does not re-evaluate that review.",url:program.verification!.sourceUrl,checkedAt:program.verification!.checkedAt?.slice(0,10)??null,retrieval:"page" as const}]
        :[{topic:"Program URL (not a reviewed citation)",summary:"No dated claim review is attached to this route.",url:program.verification?.sourceUrl??program.url,checkedAt:null,retrieval:"unreviewed" as const}];
    const topics=new Map<string,Set<string>>();
    for(const claim of review?.claims??[]) {
      const key=claim.topic.trim().toLocaleLowerCase();
      const evidence=topics.get(key)??new Set<string>();evidence.add(claim.summary.trim().toLocaleLowerCase());topics.set(key,evidence);
    }
    const conflict=[...topics.values()].some(evidence=>evidence.size>1)||(review?.limitations.some(item=>conflictWords.test(item))??false)||(review?.claims.some(claim=>conflictWords.test(claim.topic+" "+claim.summary))??false);
    const indexOnly=sources.some(source=>source.retrieval==="official-index");
    const stale=!!reviewedAt&&validDate(reviewedAt)&&dayNumber(asOf)-dayNumber(reviewedAt)>maxAgeDays;
    const reasons:SourceQueueReason[]=[];
    if(conflict) reasons.push("Potential source conflict");
    if(indexOnly) reasons.push("Index-only evidence");
    if(status==="unreviewed") reasons.push("Unreviewed");
    if(stale) reasons.push("Review is stale");
    if(status==="partial") reasons.push("Partial coverage");
    return {item:{id:program.id,country:program.country,program:program.program,status,reviewedAt,reasons,sources},priority:conflict?0:indexOnly?1:status==="unreviewed"?2:stale?3:status==="partial"?4:5,stale,indexOnly,conflict};
  });
  rows.sort((a,b)=>a.priority-b.priority||(a.item.reviewedAt??"9999-99-99").localeCompare(b.item.reviewedAt??"9999-99-99")||a.item.country.localeCompare(b.item.country)||a.item.id.localeCompare(b.item.id));
  return {asOf,maxAgeDays,limit,counts:{total:programs.length,unreviewed:rows.filter(row=>row.item.status==="unreviewed").length,
    partial:rows.filter(row=>row.item.status==="partial").length,verified:rows.filter(row=>row.item.status==="verified").length,
    stale:rows.filter(row=>row.stale).length,indexOnly:rows.filter(row=>row.indexOnly).length,conflicts:rows.filter(row=>row.conflict).length},
    items:rows.slice(0,limit).map(row=>row.item)};
}
