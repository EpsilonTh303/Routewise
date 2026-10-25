import type { Eligibility } from "./types";

export const ELIGIBILITY_META: Record<Eligibility, { label: string; className: string }> = {
  eligible: { label: "Eligible", className: "bg-emerald-400/10 text-emerald-300" },
  conditional: { label: "Conditional", className: "bg-amber-400/10 text-amber-300" },
  ineligible: { label: "Ineligible", className: "bg-red-400/10 text-red-300" },
};
