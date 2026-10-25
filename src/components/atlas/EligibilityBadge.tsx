import type { Eligibility } from "@/lib/types";
import { ELIGIBILITY_META } from "@/lib/eligibility";

export function EligibilityBadge({ status }: { status: Eligibility }) {
  const meta = ELIGIBILITY_META[status];
  return <span title="Result of modeled checks only; full legal eligibility remains unassessed" className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold ${meta.className}`}>{meta.label}</span>;
}
