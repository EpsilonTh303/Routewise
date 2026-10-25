import { PATHWAY_RECORDS } from "../data/pathway-splits";
import { PATHWAY_REVIEWS, REVIEW_BATCH_ID, buildReviewedPathway, type PathwayReview } from "../data/reviewed-pathways";
import { programSchema } from "../validation";
import { CatalogRepository, decodeProgram, hashValue } from "./catalog";
import { ServiceError } from "./errors";

function expectedSplitHash(id:string) {
  const fixture=PATHWAY_RECORDS.find(item=>item.program.id===id);
  if(!fixture) throw new ServiceError("INVALID_INPUT",`No split fixture for ${id}`);
  const p=fixture.program;
  const program=programSchema.parse({...p,languageBonus:p.languageBonus??[],dvLottery:p.dvLottery??false,e2Treaty:p.e2Treaty??false,
    verification:p.verification??{status:"unverified",checkedAt:null,sourceUrl:p.url}});
  return hashValue({program,sources:[{url:program.url,checkedAt:null}],active:fixture.active});
}

export async function planCatalogReviews(repository:CatalogRepository,items=PATHWAY_REVIEWS) {
  await repository.initializeConnection();
  return Promise.all(items.map(async item=>{
    const row=await repository.database.catalogProgram.findUnique({where:{id:item.id}});
    const applied=row && decodeProgram(row).pathway?.review?.batchId===REVIEW_BATCH_ID;
    return {id:item.id,status:applied?"applied":!row?"missing":row.contentHash!==expectedSplitHash(item.id)?"conflict":"pending",claims:item.review.claims.length};
  }));
}

/** An explicit batch, guarded against overwriting catalog edits. No source fetching at runtime. */
export async function applyCatalogReviews(repository:CatalogRepository,items:PathwayReview[]=PATHWAY_REVIEWS) {
  await repository.initializeConnection();
  if(new Set(items.map(item=>item.id)).size!==items.length) throw new ServiceError("INVALID_INPUT","Duplicate review targets");
  return repository.database.$transaction(async tx=>{
    const results:{id:string;status:"updated"|"unchanged"}[]=[];
    for(const item of items) {
      if(item.review.batchId!==REVIEW_BATCH_ID) throw new ServiceError("INVALID_INPUT","Unexpected review batch");
      const row=await tx.catalogProgram.findUnique({where:{id:item.id},include:{sources:true}});
      if(!row) throw new ServiceError("NOT_FOUND",`Missing pathway ${item.id}; apply pathway splits first.`,404);
      const prior=decodeProgram(row);
      // A completed batch is never reapplied, including when the user has subsequently edited the route.
      if(prior.pathway?.review?.batchId===REVIEW_BATCH_ID) {results.push({id:item.id,status:"unchanged"});continue;}
      if(row.contentHash!==expectedSplitHash(item.id)) throw new ServiceError("CONFLICT",`Pathway ${item.id} was edited; review batch will not overwrite it.`,409);
      const program=buildReviewedPathway(prior,item);
      const sources=new Map(row.sources.map(source=>[source.url,{url:source.url,
        ...(source.title?{title:source.title}:{}),...(source.evidence?{evidence:source.evidence}:{}),checkedAt:source.checkedAt?.toISOString()??null}]));
      for(const claim of item.review.claims) {
        const current=sources.get(claim.sourceUrl);
        sources.set(claim.sourceUrl,{url:claim.sourceUrl,title:"Official source - partial claim review",
          evidence:[current?.evidence,`Retrieval: ${claim.retrieval}. ${claim.summary}`].filter(Boolean).join("\n"),checkedAt:claim.checkedAt});
      }
      await repository.importInTransaction(tx,{program,sources:[...sources.values()],active:row.active,
        expectedHash:row.contentHash,reason:`${REVIEW_BATCH_ID}: dated official evidence for selected claims; complete record remains unverified`});
      results.push({id:item.id,status:"updated"});
    }
    return results;
  },{maxWait:10000,timeout:60000});
}
