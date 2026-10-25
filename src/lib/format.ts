import type { Program } from "./types";

export const formatMoney=(value:number|null|undefined)=>value==null?"Needs review":`$${value.toLocaleString("en-US")}`;
export const formatDecision=(weeks:number|null)=>weeks===null?"Needs review":weeks>=52?`${(weeks/52).toFixed(1)}y`:`${weeks}w`;
export const formatCitizenship=(p:Program)=>p.yearsToCitizenship===0?"Direct":p.yearsToCitizenship!==null?`${p.yearsToCitizenship}y`:p.pathway?.unknownFields.includes("yearsToCitizenship")?"Needs review":"No path recorded";
