import type {Program} from "./types";

/** New catalog-wide audits take precedence; original pathway evidence stays in history. */
export function sourceReview(program:Program) {
  return program.audit??program.pathway?.review;
}
