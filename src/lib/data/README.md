# Program source review

These TypeScript records are the original import fixture. The live catalog and its audit/revision data are in SQLite. `db:seed` imports missing records only; edit existing records through the explicit catalog importer with the current content hash. See the project README for the database, CLI, MCP and source-history interfaces.

The imported records are a starting dataset. Their existing URLs are source pointers, not evidence of a completed fact check. The aggregate export attaches `verification: { status: 'unverified', checkedAt: null, sourceUrl }` to every program.

Review each program against the responsible government's current official page before changing its audit status. Record the review date, exact rule URLs and supporting excerpts in a per-program source record, and reconcile the numeric fields with the cited rules. A program should remain unverified if any gating rule is unresolved.

For a fuller rule model, distinguish:

- Investment/donation paid, refundable deposits, and retained proof-of-funds, including when funds must be available.
- Fees and living costs, with dependent-specific funds/income requirements.
- Current income versus contracted salary, remote-employment evidence, and employer sponsorship.
- Nationality restrictions, residence/birthplace rules, qualifications, language and age requirements, and alternative qualification paths.
- Residency renewal conditions, physical-presence requirements, and PR/citizenship eligibility versus processing time.

Do not infer these rules solely from a category such as nomad or investor. Add focused regression cases for each structured gate and record uncertain requirements explicitly. Current capital checking uses max(minBudget, family year-one cost); it is a conservative improvement over ignoring minBudget, not a complete cash-flow model.
