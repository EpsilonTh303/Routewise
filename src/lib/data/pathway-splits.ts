import type { Program, Category } from "../types";
import { ALL_PROGRAMS } from "./index";

type Branch={id:string;name:string;category:Category;requirements:string[];values?:Partial<Program>;active?:boolean};
export interface PathwaySplit {id:string;parentId:string;branches:Branch[]}
// This is a decomposition of the supplied archive, NOT an official-source verification.
// Assign only amounts explicitly attributable to a branch; unallocated figures stay null.
export const PATHWAY_SPLITS:PathwaySplit[]=[
  {id:"split-cr-v1",parentId:"cr-investor",branches:[
    {id:"cr-investment-residency",name:"Investment residency",category:"investor",values:{minBudget:150000,minMonthlyIncome:0,jobOfferRequired:false},requirements:["Archived investment option: $150k+ in approved sectors/property","Renewal/presence requirements need branch-specific review"]},
    {id:"cr-rentista-residency",name:"Rentista income residency",category:"passive",values:{minMonthlyIncome:2500,jobOfferRequired:false},requirements:["Archived income option: $2,500/month for two years","Income evidence and financial guarantees need source review"]},
  ]},
  {id:"split-br-v1",parentId:"br-investor",branches:[
    {id:"br-business-investor",name:"Business investment residency",category:"investor",values:{minBudget:90000,minMonthlyIncome:0,jobOfferRequired:false},requirements:["Archived investment option: R$500k (legacy estimate $90k)","The archive also mentions a lower tech-startup amount; eligibility for that exception is not modeled","Criminal-record evidence"]},
    {id:"br-vitem-xiv-nomad",name:"VITEM XIV remote-income route",category:"nomad",values:{minMonthlyIncome:1500,jobOfferRequired:false,remoteFriendly:true},requirements:["Archived remote-income option: $1,500/month","Remote-work evidence; investor capital and investor PR timing do not transfer to this route"]},
  ]},
  {id:"split-id-v1",parentId:"id-secondhome",branches:[
    {id:"id-second-home",name:"Second Home",category:"investor",values:{minBudget:130000,minMonthlyIncome:0,jobOfferRequired:false},requirements:["Archived Second Home option: $130k funds/property proof","Review the type, timing and retention of qualifying funds"]},
    {id:"id-e33g-remote-worker",name:"E33G remote-worker route",category:"nomad",values:{minMonthlyIncome:5000,jobOfferRequired:false,remoteFriendly:true},requirements:["Archived E33G option: $60k/year remote income from a foreign employer","Second Home capital requirements do not transfer to this route"]},
  ]},
  {id:"split-fr-v1",parentId:"fr-talent",branches:[
    {id:"fr-talent-investor",name:"Talent Passport — investment",category:"investor",values:{minBudget:300000,minMonthlyIncome:0,jobOfferRequired:false},requirements:["Archived investment option: €300k in a French company with at least 10% control","The inherited $300k field is a legacy approximation, not a checked currency conversion","Business plan"]},
    {id:"fr-talent-salaried",name:"Talent Passport — salaried",category:"skilled",values:{minMonthlyIncome:4730,jobOfferRequired:true},requirements:["Archived salaried option: offer of at least 2× SMIC (archive estimate €47k/year)","Employment contract; category-specific thresholds need review"]},
  ]},
  {id:"split-ae-golden-v1",parentId:"ae-golden",branches:[
    {id:"ae-golden-property",name:"Golden Visa — property",category:"investor",values:{minBudget:545000,minMonthlyIncome:0,jobOfferRequired:false},requirements:["Archived property option: AED 2m (legacy estimate $545k)","The archive explicitly records no income floor for this property option","Emirates ID and medical checks"]},
    {id:"ae-golden-professional",name:"Golden Visa — professional",category:"skilled",values:{minMonthlyIncome:8150},requirements:["Archived professional option: AED 30k/month salary plus a degree","Do not apply the property investment floor to this option","Employment/category criteria need source review"]},
  ]},
  {id:"split-ae-green-v1",parentId:"ae-green",branches:[
    {id:"ae-green-skilled",name:"Green Visa — skilled employee",category:"skilled",values:{minMonthlyIncome:4100},requirements:["Archive groups a salaried/degree option under Green Visa","Legacy shared salary estimate: AED 15k/month","Employment and self-sponsorship conditions need branch-specific review"]},
    {id:"ae-green-freelance",name:"Green Visa — freelance",category:"entrepreneur",requirements:["Archive separately mentions a freelance-permit option","Its income floor was not separately established; the employee salary must not be copied to it","Health insurance"]},
  ]},
  {id:"split-th-ltr-v1",parentId:"th-ltr",branches:[
    {id:"th-ltr-wealthy",name:"LTR — wealthy option",category:"passive",values:{minMonthlyIncome:6700,jobOfferRequired:false},requirements:["Archived wealthy option: $1m assets plus $80k/year income","Total qualifying assets are not the same as a liquid relocation budget","Recorded health-insurance requirement needs review"]},
    {id:"th-ltr-remote-standard",name:"LTR — remote professional, standard income",category:"nomad",values:{minMonthlyIncome:6700,jobOfferRequired:false,remoteFriendly:true},requirements:["Archived standard remote option: $80k/year income","Evidence from a foreign employer","Recorded health-insurance requirement needs review"]},
    {id:"th-ltr-remote-degree",name:"LTR — remote professional, degree alternative",category:"nomad",values:{jobOfferRequired:false,remoteFriendly:true},requirements:["Archive mentions a $40k/year plus master's-degree alternative","Degree, income period and employer conditions require source review; no monthly floor is invented"]},
  ]},
  {id:"split-ge-v1",parentId:"ge-hnwi",branches:[
    {id:"ge-hnwi-review",name:"HNWI claim — residence basis unestablished",category:"passive",active:false,requirements:["The archive conflates HNWI status and business residence","Not established as a standalone immigration route; retained for review, not recommendations"]},
    {id:"ge-business-residence",name:"Business residence",category:"entrepreneur",requirements:["Archived business-residence option","Tax status, visa-free entry and residence eligibility must be reviewed separately"]},
  ]},
  {id:"split-rs-v1",parentId:"rs-company",branches:[
    {id:"rs-company-residence",name:"Company-based residence",category:"entrepreneur",values:{minMonthlyIncome:900,jobOfferRequired:false},requirements:["Archived company option: registered Serbian LLC (archive mentions approximately €200 capital)","Archived self-sufficiency figure: approximately €900/month","Registration and residence conditions require review"]},
    {id:"rs-property-residence",name:"Property-based residence",category:"investor",values:{minMonthlyIncome:900,jobOfferRequired:false},requirements:["Archived alternative: property deed","Archived self-sufficiency figure: approximately €900/month","Property eligibility and residence conditions require review"]},
  ]},
  {id:"split-fi-v1",parentId:"fi-specialist",branches:[
    {id:"fi-specialist-permit",name:"Specialist permit",category:"skilled",values:{minMonthlyIncome:4300,jobOfferRequired:true,remoteFriendly:false},requirements:["Archived specialist option: salary approximately €3,821/month (2025 archive)","Degree or specialist experience; employer filing"]},
    {id:"fi-eu-ict-permit",name:"EU ICT permit",category:"skilled",requirements:["The archive names an EU ICT alternative without a distinct quantitative rule set","Specialist salary, costs and residency timelines are not copied to this permit"]},
  ]},
  {id:"split-au-v1",parentId:"au-skilled",branches:[
    {id:"au-subclass-189",name:"Skilled PR — Subclass 189",category:"skilled",requirements:["Archive identifies Subclass 189","Shared points, occupation-list and assessment claims require subclass-specific review"]},
    {id:"au-subclass-190",name:"Skilled PR — Subclass 190",category:"skilled",requirements:["Archive identifies Subclass 190","Shared points, occupation-list and assessment claims require subclass-specific review"]},
  ]},
  {id:"split-us-eb-v1",parentId:"us-eb23",branches:[
    {id:"us-eb2",name:"EB-2 employment-based route",category:"skilled",values:{jobOfferRequired:true,remoteFriendly:false},requirements:["Archive describes an employer-sponsored EB-2 option","The archive's bachelor's/experience claim needs EB-2-specific review","Shared salary, cost and waiting-time figures are not established for this branch"]},
    {id:"us-eb3",name:"EB-3 employment-based route",category:"skilled",values:{jobOfferRequired:true,remoteFriendly:false},requirements:["Archive describes an employer-sponsored EB-3 option including skilled labor","Occupation, qualifications and category-specific timing need review","The EB-2 degree/experience claim is not transferred to this route"]},
  ]},
  {id:"split-sa-v1",parentId:"sa-premium",branches:[
    {id:"sa-premium-one-time",name:"Premium Residency — one-time payment",category:"passive",values:{minBudget:213000,minMonthlyIncome:0,jobOfferRequired:false},requirements:["Archived one-time option: SAR 800k (legacy estimate $213k)","Valid passport, record and medical checks"]},
    {id:"sa-premium-annual",name:"Premium Residency — annual payment",category:"passive",values:{minMonthlyIncome:0,jobOfferRequired:false},requirements:["Archived alternative: SAR 40k/year plus criteria","Annual fee conversion, renewal terms and additional criteria are not established"]},
  ]},
];

const nullableKeys=["minBudget","minMonthlyIncome","totalYearOneCost","costPerDependent","processingWeeks","yearsToPR","yearsToCitizenship","jobOfferRequired","remoteFriendly"] as const;
export function buildPathways(parent:Program,recipe:PathwaySplit):{program:Program;active:boolean}[] {
  return recipe.branches.map(branch=>{
    const program:Program={...parent,id:branch.id,program:branch.name,category:branch.category,
      tagline:`Separate ${branch.name.toLowerCase()} pathway from the unverified archive. Branch-specific figures need review.`,
      minBudget:null,minMonthlyIncome:null,totalYearOneCost:null,costPerDependent:null,processingWeeks:null,
      yearsToPR:null,yearsToCitizenship:null,citizenshipLanguage:undefined,jobOfferRequired:null,remoteFriendly:null,
      requirements:branch.requirements,pros:["Separate requirements prevent unrelated financial floors being combined"],
      cons:["Branch-specific costs, timelines and current eligibility require official-source review"],taxNote:undefined,
      dvLottery:false,e2Treaty:false,...branch.values,
      verification:{status:"unverified",checkedAt:null,sourceUrl:parent.url},
    };
    program.pathway={parentId:parent.id,recipeId:recipe.id,branch:branch.name,
      unknownFields:nullableKeys.filter(key=>program[key]===null),
      notes:["Decomposed from an unverified archive; no official source was newly checked.","Country/access/family heuristics are inherited context, not established pathway rights.","Legacy USD approximations are retained only where attributable; shared fees and time estimates are not allocated."],
      remoteWorkRequired:branch.category==="nomad"&&branch.values?.remoteFriendly===true,
    };
    return {program,active:branch.active!==false};
  });
}

export const SPLIT_PARENTS=new Set(PATHWAY_SPLITS.map(s=>s.parentId));
export const PATHWAY_RECORDS=PATHWAY_SPLITS.flatMap(recipe=>{
  const parent=ALL_PROGRAMS.find(p=>p.id===recipe.parentId);
  if(!parent) throw new Error(`Missing split parent ${recipe.parentId}`);
  return buildPathways(parent,recipe);
});
export const EXPECTED_ACTIVE_PROGRAM_COUNT=ALL_PROGRAMS.length-SPLIT_PARENTS.size+PATHWAY_RECORDS.filter(r=>r.active).length;
