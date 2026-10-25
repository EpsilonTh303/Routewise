import { z } from "zod";
import type { Profile, Program, MatchResult, ScoreBreakdown } from "./types";
import { profileSchema } from "./validation";
import { matchPrograms, buildStrategy } from "./scoring";
import type { Plan } from "./scoring";
import { flattenRequirements } from "./requirements";
import type { RequirementStatus } from "./requirements";
import { REQUIREMENT_VERSION } from "./route-requirements";

const PROFILE_KEYS = new Set([
  "evidence", "citizenship", "age", "familyStatus", "dependents", "budget", "monthlyIncome", "expectedSalary",
  "hasJobOffer", "education", "experience", "field", "englishLevel", "turkish", "russian", "german", "goal", "timeline", "risk", "regions", "remoteWork",
]);
const profileChangesSchema = z.record(z.string(), z.unknown()).superRefine((changes, ctx) => {
  for (const key of Object.keys(changes)) if (!PROFILE_KEYS.has(key)) ctx.addIssue({ code: "custom", path: [key], message: "Unknown profile patch key." });
});
const scenarioSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(100),
  label: z.string().trim().min(1).max(100),
  changes: profileChangesSchema,
}).strict();

export const scenarioRequestSchema = z.object({
  profile: profileSchema,
  scenarios: z.array(scenarioSchema).min(1).max(5),
  limit: z.number().int().min(1).max(20).default(10),
}).strict().superRefine((request, ctx) => {
  const ids = new Set<string>();
  request.scenarios.forEach((scenario, index) => {
    if (ids.has(scenario.id)) ctx.addIssue({ code: "custom", path: ["scenarios", index, "id"], message: "Scenario IDs must be unique." });
    ids.add(scenario.id);
  });
});

export type ScenarioInput = { id: string; label: string; changes: Partial<Profile> };
export type ScenarioRequirementChange = { id: string; label: string; before: RequirementStatus | null; after: RequirementStatus | null };
export type ScenarioProgramChange = {
  programId: string;
  before: { score: number; eligibility: MatchResult["eligibility"]; rank: number };
  after: { score: number; eligibility: MatchResult["eligibility"]; rank: number };
  dimensions: { dimension: keyof ScoreBreakdown; before: number | null; after: number | null }[];
  adjustments: { reason: string; before: number | null; after: number | null }[];
  requirements: ScenarioRequirementChange[];
};
export type ScenarioView = { id: string; label: string; results: MatchResult[]; plans: Plan[]; changes: ScenarioProgramChange[]; totalChanges:number; rankingChanged: boolean };
export type ScenarioComparison = { ruleVersion:string; base: { results: MatchResult[]; plans: Plan[] }; scenarios: ScenarioView[] };

function leafStatuses(result: MatchResult): Map<string, { label: string; status: RequirementStatus }> {
  const checks = result.explanation.requirements?.result;
  const leaves = checks ? flattenRequirements(checks).filter(check => !check.children?.length) : [];
  return new Map(leaves.map(check => [check.id, { label: check.label, status: check.status }]));
}

function changedRequirements(before: MatchResult, after: MatchResult): ScenarioRequirementChange[] {
  const oldLeaves = leafStatuses(before);
  const newLeaves = leafStatuses(after);
  const ids = [...new Set([...oldLeaves.keys(), ...newLeaves.keys()])].sort();
  return ids.flatMap(id => {
    const old = oldLeaves.get(id);
    const current = newLeaves.get(id);
    return old?.status !== current?.status || old?.label !== current?.label
      ? [{ id, label: current?.label ?? old?.label ?? id, before: old?.status ?? null, after: current?.status ?? null }]
      : [];
  });
}

/** Compare up to five profile what-ifs against one immutable program snapshot. */
export function compareScenarios(programs: Program[], baseProfile: Profile, scenarios: ScenarioInput[], limit = 10): ScenarioComparison {
  const parsedRequest = scenarioRequestSchema.parse({ profile: baseProfile, scenarios, limit });
  const catalogIds = new Set<string>();
  for (const program of programs) {
    if (catalogIds.has(program.id)) throw new Error(`Duplicate program id in scenario catalog: ${program.id}`);
    catalogIds.add(program.id);
  }

  const rank = (results: MatchResult[]) => new Map(results.map((result, index) => [result.program.id, index + 1]));
  const fullBase = matchPrograms(programs, parsedRequest.profile);
  const baseRanks = rank(fullBase);
  const baseById = new Map(fullBase.map(result => [result.program.id, result]));
  const base = { results: fullBase.slice(0, parsedRequest.limit), plans: buildStrategy(fullBase) };

  const outputs = parsedRequest.scenarios.map(scenario => {
    // Profile patches replace top-level fields (including evidence); merge is immutable and validated as a full profile.
    const mergedProfile = profileSchema.parse({ ...parsedRequest.profile, ...scenario.changes });
    const fullAfter = matchPrograms(programs, mergedProfile);
    const afterRanks = rank(fullAfter);
    const afterById = new Map(fullAfter.map(result => [result.program.id, result]));
    const changes: ScenarioProgramChange[] = [];
    for (const [programId, beforeResult] of baseById) {
      const afterResult = afterById.get(programId)!;
      const beforeRank = baseRanks.get(programId)!;
      const afterRank = afterRanks.get(programId)!;
      const requirements = changedRequirements(beforeResult, afterResult);
      const dimensions = (Object.keys(beforeResult.breakdown) as (keyof ScoreBreakdown)[]).flatMap(dimension =>
        beforeResult.breakdown[dimension] !== afterResult.breakdown[dimension]
          ? [{dimension,before:beforeResult.breakdown[dimension],after:afterResult.breakdown[dimension]}]
          : []);
      const beforeAdjustments = new Map(beforeResult.explanation.adjustments.map(item=>[item.reason,item.points]));
      const afterAdjustments = new Map(afterResult.explanation.adjustments.map(item=>[item.reason,item.points]));
      const adjustmentReasons = [...new Set([...beforeAdjustments.keys(),...afterAdjustments.keys()])].sort();
      const adjustments = adjustmentReasons.flatMap(reason=>{
        const before=beforeAdjustments.get(reason)??null, after=afterAdjustments.get(reason)??null;
        return before!==after?[{reason,before,after}]:[];
      });
      if (beforeResult.matchPct !== afterResult.matchPct || beforeResult.eligibility !== afterResult.eligibility || beforeRank !== afterRank || requirements.length > 0 || dimensions.length>0 || adjustments.length>0) {
        changes.push({
          programId,
          before: { score: beforeResult.matchPct, eligibility: beforeResult.eligibility, rank: beforeRank },
          after: { score: afterResult.matchPct, eligibility: afterResult.eligibility, rank: afterRank },
          dimensions,
          adjustments,
          requirements,
        });
      }
    }
    return {
      id: scenario.id,
      label: scenario.label,
      results: fullAfter.slice(0, parsedRequest.limit),
      plans: buildStrategy(fullAfter),
      changes:changes.slice(0,parsedRequest.limit),
      totalChanges:changes.length,
      rankingChanged: changes.some(change => change.before.rank !== change.after.rank),
    };
  });
  return { ruleVersion:REQUIREMENT_VERSION, base, scenarios: outputs };
}
