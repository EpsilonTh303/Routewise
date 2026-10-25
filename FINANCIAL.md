# Financial comparison module

`src/lib/financial.ts` compares an individual recorded financial threshold with applicant evidence. Amounts must be finite, nonnegative, and expressed in a recognized ISO 4217 currency. Currency must match exactly; the module does not fetch or infer exchange rates.

Schemas are strict: amounts are capped at `Number.MAX_SAFE_INTEGER`, and history is capped at 1,200 months. Income requires an explicit monthly/annual period. Requirements must state the income basis (`gross`, `net`, or `unspecified`); applicant evidence with no stated basis remains unknown. The same explicit basis must match on both sides. Monthly and annual income convert deterministically at 12 months per year. A requested minimum history requires applicant history evidence; insufficient history is unmet, while absent history is unknown. Non-income categories cannot carry income basis/history; fees may carry a period, which must match exactly. Other categories (`balance`, `assets`, `investment`, and `fee`) compare only with the same category and are never added together.

The result is `met`, `unmet`, or `unknown`. Unknown means evidence is missing, incompatible, or invalid; it is not an eligibility decision.
