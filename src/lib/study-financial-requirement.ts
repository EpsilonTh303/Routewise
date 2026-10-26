import type {Program} from './types';
import type {Requirement,RuleSource} from './requirements';
import {canonicalJson} from './canonical-json';
import {financialRequirementSchema} from './financial';

/** Budget screening only. A balance is neither blocked-account proof nor visa approval. */
export function mastersLivelihoodRequirement(program:Program,original:Program,source:RuleSource):Requirement {
  const id='study-living-funds-budget';
  const label='EUR balance compared with the recorded study living-funds alternative';
  const candidates=(items:NonNullable<Program['audit']>['financialRequirements'])=>items.filter(item=>
    item.currency==='EUR'&&item.period==='balance'&&item.sourceUrl===source.url);
  const expected=candidates(original.audit?.financialRequirements??[]);
  const attached=candidates(program.audit?.financialRequirements??[]);
  const trusted=expected.length===1&&attached.length===1&&canonicalJson(expected[0])===canonicalJson(attached[0])&&attached[0].amount>0;
  const parsed=trusted?financialRequirementSchema.safeParse({kind:'balance',amount:attached[0].amount,currency:attached[0].currency}):null;
  const budget:Requirement=parsed?.success
    ?{id,label,kind:'financial',source,requirement:parsed.data}
    :{id,label,kind:'manual',source,reason:'A reliable, uniquely sourced EUR living-funds amount is missing or changed; budget sufficiency is unknown.'};
  return {
    id:'securedLivelihood',label:'Living funds proved by blocked account, scholarship or declaration of commitment',kind:'all',source,
    children:[budget,
      {id:'securedLivelihood-proof',label:'Applicant-reported living-funds documentation',kind:'fact',fact:'securedLivelihood',source},
      {id:'study-financing-verification',label:'Separate official financing verification',kind:'manual',source,
        reason:'A sufficient EUR balance is only a budget comparison for one funding alternative. Confirm accepted blocked-account, scholarship or declaration-of-commitment evidence separately; budget sufficiency is not official financing proof or visa eligibility.'},
    ],
  };
}
