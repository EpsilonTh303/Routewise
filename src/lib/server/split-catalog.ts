import { ALL_PROGRAMS } from "../data";
import { PATHWAY_SPLITS, buildPathways, type PathwaySplit } from "../data/pathway-splits";
import { programSchema } from "../validation";
import { CatalogRepository, decodeProgram, hashValue, jsonValue } from "./catalog";
import { ServiceError } from "./errors";

function expectedArchiveHash(recipe:PathwaySplit) {
  const fixture=ALL_PROGRAMS.find(p=>p.id===recipe.parentId);
  if(!fixture) throw new ServiceError("INVALID_INPUT",`Missing archive fixture ${recipe.parentId}`);
  const program=programSchema.parse({...fixture,languageBonus:fixture.languageBonus??[],dvLottery:fixture.dvLottery??false,e2Treaty:fixture.e2Treaty??false,
    verification:fixture.verification??{status:"unverified",checkedAt:null,sourceUrl:fixture.url}});
  return hashValue({program,sources:[{url:program.url,checkedAt:null}],active:true});
}

export async function planCatalogSplits(repository:CatalogRepository,recipes=PATHWAY_SPLITS) {
  await repository.initializeConnection();
  return Promise.all(recipes.map(async recipe=>{
    const receipt=await repository.database.catalogSplit.findUnique({where:{id:recipe.id}});
    const parent=await repository.database.catalogProgram.findUnique({where:{id:recipe.parentId}});
    return {id:recipe.id,parentId:recipe.parentId,status:receipt?"applied":!parent?"missing":parent.contentHash!==expectedArchiveHash(recipe)?"conflict":"pending",children:recipe.branches.map(b=>b.id)};
  }));
}

export async function applyCatalogSplits(repository:CatalogRepository,recipes=PATHWAY_SPLITS) {
  await repository.initializeConnection();
  return repository.database.$transaction(async tx=>{
    const results:{id:string;status:"applied"|"unchanged";children:string[]}[]=[];
    for(const recipe of recipes) {
      const receipt=await tx.catalogSplit.findUnique({where:{id:recipe.id}});
      if(receipt) {
        const children=recipe.branches.map(b=>b.id);
        const present=await tx.catalogProgram.count({where:{id:{in:children},parentId:recipe.parentId}});
        if(present!==children.length) throw new ServiceError("CONFLICT",`Split receipt ${recipe.id} has missing or mismatched children. Review the catalog before rerunning.`,409);
        results.push({id:recipe.id,status:"unchanged",children});continue;
      }
      const parent=await tx.catalogProgram.findUnique({where:{id:recipe.parentId},include:{sources:true}});
      if(!parent) throw new ServiceError("NOT_FOUND",`Missing parent ${recipe.parentId}. Seed the original archive first.`,404);
      if(parent.contentHash!==expectedArchiveHash(recipe)) throw new ServiceError("CONFLICT",`Parent ${recipe.parentId} was edited. The automatic split will not overwrite it. Review the recipe against those edits first.`,409);
      const branches=buildPathways(decodeProgram(parent),recipe);
      for(const branch of branches) {
        if(await tx.catalogProgram.findUnique({where:{id:branch.program.id},select:{id:true}})) throw new ServiceError("CONFLICT",`Pathway ID ${branch.program.id} already exists without a split receipt.`,409);
        await repository.importInTransaction(tx,{...branch,sources:parent.sources.map(s=>({url:s.url,checkedAt:null})),reason:`${recipe.id}: separate archived pathway; branch figures remain unverified`});
      }
      const sources=parent.sources.map(s=>({url:s.url,...(s.title?{title:s.title}:{}),...(s.evidence?{evidence:s.evidence}:{}),checkedAt:s.checkedAt?.toISOString()??null}));
      await repository.importInTransaction(tx,{program:decodeProgram(parent),sources,active:false,expectedHash:parent.contentHash,reason:`${recipe.id}: retain original family as an inactive historical record`});
      const children=branches.map(b=>b.program.id);
      await tx.catalogSplit.create({data:{id:recipe.id,parentId:parent.id,parentContentHash:parent.contentHash,childIds:jsonValue(children)}});
      results.push({id:recipe.id,status:"applied",children});
    }
    return results;
  },{maxWait:10000,timeout:60000});
}
