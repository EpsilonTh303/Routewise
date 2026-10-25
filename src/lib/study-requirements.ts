import type {Program} from './types';
import type {FactKey,Requirement,RuleSource} from './requirements';
import {studyPilotPrograms} from './data/study-pilot';
import {canonicalJson} from './canonical-json';

/** Project only the immutable, attached pilot evidence; generic education never proves graduation. */
export function studyRouteRequirement(program:Program):Requirement|null {
  const original=studyPilotPrograms.find(item=>item.id===program.id);
  if(!original || canonicalJson(program.audit)!==canonicalJson(original.audit) ||
    canonicalJson(program.requirements)!==canonicalJson(original.requirements)) return null;
  const claims=program.audit!.claims;
  const source=(index=0):RuleSource=>({url:claims[index].sourceUrl,reviewedAt:claims[index].checkedAt,effectiveAt:null,retrieval:claims[index].retrieval});
  const fact=(key:FactKey,label:string,index=0):Requirement=>({id:key,kind:'fact',fact:key,label,source:source(index)});
  const manual=(id:string,label:string,reason:string,index=0):Requirement=>({id,kind:'manual',label,reason,source:source(index)});
  let children:Requirement[];
  switch(program.id) {
    case 'de-masters-study': children=[
      fact('studyAdmission','Recognised German institution and specific master’s admission'),
      fact('programmeLanguage','Programme-specific accepted language evidence'),
      fact('securedLivelihood','Living funds proved by blocked account, scholarship or declaration of commitment'),
      manual('study-costs','Individual study costs and document checklist','The EUR 11,904 blocked-account amount is one 2026 proof alternative. Confirm tuition, insurance, duration and consular documents separately.'),
    ];break;
    case 'de-graduate-jobsearch': children=[
      fact('germanDegree','Successfully completed German higher education'),
      fact('healthCoverage','Qualifying health insurance'),
      fact('securedLivelihood','Livelihood secured for requested search permit'),
      fact('applicationWindow','Apply for the new title before study permission expires'),
    ];break;
    case 'nl-graduate-orientation-year': children=[
      fact('qualifyingGraduate','Specific IND-qualifying programme or research completion'),
      fact('applicationWindow','Qualifying completion within three years; no repeat for same programme/research'),
      manual('foreign-degree','Foreign institution branch and general requirements','Where applicable check graduation-date top-200 rankings from two publishers, accepted language alternative and Nuffic evaluation; a generic master’s degree does not establish this.'),
    ];break;
    case 'fi-graduate-jobsearch': children=[
      fact('priorStudyPermit','Qualifying Finnish study/research permit history'),
      fact('qualifyingGraduate','Finnish completion appropriate to the prior permit class'),
      fact('applicationWindow','Five-year application window and correct first/extended filing procedure'),
      fact('securedLivelihood','Documented EUR 800/month for the requested duration'),
      manual('requested-duration','Requested period and funds','EUR 19,200 is the published full two-year amount. Confirm requested duration, split periods and applicable fee; do not treat a planning budget in USD as proof.',2),
    ];break;
    default:return null;
  }
  return {id:program.id,label:'Recorded study / post-study checks',kind:'all',source:source(),children};
}
