import type { Program } from "../types";
import { EUROPE_PROGRAMS } from "./europe";
import { AMERICAS_PROGRAMS } from "./americas";
import { APAC_PROGRAMS } from "./apac";
import { EMERGING_PROGRAMS } from "./emerging";

export const ALL_PROGRAMS: Program[] = [
  ...EUROPE_PROGRAMS,
  ...AMERICAS_PROGRAMS,
  ...APAC_PROGRAMS,
  ...EMERGING_PROGRAMS,
];

export const COUNTRY_COUNT = new Set(ALL_PROGRAMS.map((p) => p.country)).size;
export const PROGRAM_COUNT = ALL_PROGRAMS.length;

export function programsByCountry(): Map<string, Program[]> {
  const map = new Map<string, Program[]>();
  for (const p of ALL_PROGRAMS) {
    const arr = map.get(p.country) ?? [];
    arr.push(p);
    map.set(p.country, arr);
  }
  return map;
}
