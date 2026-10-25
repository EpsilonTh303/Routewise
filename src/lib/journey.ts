import {z} from 'zod';
import {factKeySchema} from './requirements';
import type {Program} from './types';

const id=z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100);
const text=z.string().trim().min(1).max(500);
const evidenceSchema=z.discriminatedUnion('kind',[
  z.object({kind:z.literal('fact'),programId:id,fact:factKeySchema}).strict(),
  z.object({kind:z.literal('manual'),label:text}).strict(),
]);
// A condition references an existing dated claim; it does not introduce a legal rule.
const conditionSchema=z.object({
  id,
  source:z.object({programId:id,auditBatchId:id,claimTopic:text}).strict(),
  evidence:z.array(evidenceSchema).min(1).max(20),
}).strict();
const transitionSchema=z.object({
  to:id,
  // Navigation branch only. All referenced conditions still need a separate review.
  jobOffer:z.enum(['any','present','absent']),
  conditions:z.array(conditionSchema).min(1).max(20),
}).strict();
const stageSchema=z.object({
  id,kind:z.enum(['masters','graduate-job-search','work-permit','permanent-residence']),label:text,
  // Empty when no standalone catalog record exists for this stage.
  programIds:z.array(id).max(20),
  conditions:z.array(conditionSchema).min(1).max(20),
  transitions:z.array(transitionSchema).max(20),
}).strict();

/** Descriptive sidecar only: not consumed by scoring, persistence or the GUI. */
export const journeySchema=z.object({
  version:z.literal(1),id,entryStageId:id,stages:z.array(stageSchema).min(1).max(20),
}).strict().superRefine((journey,ctx)=>{
  const ids=new Set(journey.stages.map(stage=>stage.id));
  const fail=(message:string)=>ctx.addIssue({code:'custom',message});
  if(ids.size!==journey.stages.length) fail('Stage IDs must be unique');
  if(!ids.has(journey.entryStageId)) fail('Entry stage must exist');
  for(const stage of journey.stages){
    if(new Set(stage.programIds).size!==stage.programIds.length) fail('Stage program IDs must be unique');
    for(const conditions of [stage.conditions,...stage.transitions.map(edge=>edge.conditions)]){
      if(new Set(conditions.map(condition=>condition.id)).size!==conditions.length) fail('Condition IDs must be unique within each checklist');
    }
    for(const edge of stage.transitions){
      if(!ids.has(edge.to)||edge.to===stage.id) fail('Transition must target another existing stage');
    }
  }
  const visited=new Set<string>(),active=new Set<string>();
  const visit=(id:string)=>{
    if(active.has(id)){fail('Stage transitions must not form a cycle');return;}
    if(visited.has(id)) return;
    visited.add(id);active.add(id);
    for(const edge of journey.stages.find(stage=>stage.id===id)?.transitions??[]) visit(edge.to);
    active.delete(id);
  };
  if(ids.has(journey.entryStageId)) visit(journey.entryStageId);
  if([...ids].some(id=>!visited.has(id))) fail('All stages must be reachable from the entry stage');
});
export type Journey=z.infer<typeof journeySchema>;
export type JourneyStage=Journey['stages'][number];
export type JourneyCondition=JourneyStage['conditions'][number];

/** Validate cross-record references without changing or evaluating the supplied catalog. */
export function validateJourney(value:unknown,programs:readonly Program[]):Journey {
  const journey=journeySchema.parse(value);
  const catalog=new Map(programs.map(program=>[program.id,program]));
  if(catalog.size!==programs.length) throw new Error('Journey catalog program IDs must be unique');
  for(const stage of journey.stages){
    for(const id of stage.programIds) if(!catalog.has(id)) throw new Error(`Unknown journey program: ${id}`);
    for(const condition of [...stage.conditions,...stage.transitions.flatMap(edge=>edge.conditions)]){
      const {programId,auditBatchId,claimTopic}=condition.source;
      const audit=catalog.get(programId)?.audit;
      if(!audit||audit.batchId!==auditBatchId||audit.claims.filter(claim=>claim.topic===claimTopic).length!==1)
        throw new Error(`Missing or ambiguous journey claim: ${condition.id}`);
      for(const evidence of condition.evidence){
        if(evidence.kind==='fact'&&!catalog.has(evidence.programId)) throw new Error(`Unknown evidence program: ${evidence.programId}`);
      }
    }
  }
  return journey;
}
