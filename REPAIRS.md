# Repair status — 2026-10-25

Historical report for the first repair stage. A subsequent database/MCP implementation now uses a live SQLite catalog, migrations, private saved profiles and strategy snapshots. See README.md for current architecture and commands; the limitations below describe the earlier stage.

The first four stages of the inspection's repair order have been implemented. Stage five has an explicit audit-state foundation; checking the actual rules against official sources remains outstanding.

## Implemented

- Available-funds checks use the greater of recorded minimum capital and family-adjusted year-one spending, avoiding counting investment twice. Affordability scoring uses the same funds threshold.
- Required sponsorship cannot be bypassed with projected salary. Sponsored routes check the confirmed offer's salary, while income-proof routes check current income. The wizard labels the salary field accordingly.
- Cards, Plan A/B/C cards, and the drawer distinguish Eligible, Conditional, and Ineligible and show unresolved requirements.
- CBI risk adjustments are reflected in the displayed fit score. Strategy explanations no longer claim a backup is cheaper without checking its cost.
- Saved profiles are checked for complete fields, supported values, finite numbers, and valid ranges before scoring. Invalid storage is discarded.
- The drawer uses Radix Dialog for focus trapping, Escape and outside dismissal, background isolation, scroll handling, accessible title/description, and focus restoration; aria-modal is explicit.
- TypeScript errors fail builds. Unused WebSocket examples are excluded from app typechecking; Prisma client generation is part of the build.
- npm lockfile and Windows-compatible build/start scripts provide a repeatable local workflow. The original Bun lockfile remains an archival reference. Builds require network access for Google Fonts and first-time Prisma engines.
- Existing mobile and carousel helpers use external-store subscriptions so the installed lint rules pass, including cleanup for both carousel events.
- Caddy's request-selected local-port proxy was removed. Only the explicit port-3000 application upstream remains.
- Database packaging initializes fresh storage by default, requires PACKAGE_PREVIEW_DB=1 to copy preview data, refuses to reuse an existing target database, and no longer accepts schema data loss automatically. Production query logging is disabled.
- The main Linux build helper resolves its project path, validates BUILD_ID, and installs root dependencies with npm ci; mini-service helpers derive their root from their script location.
- All imported program records now expose source pointers and an unverified/null-date audit status, which is displayed in the drawer. No records have been presented as freshly fact-checked.

## Validation

- 13 Node regression/render tests passed for capital thresholds, family costs, sponsorship, offered versus current income, score display, strategy exclusion, profile validation, source audit defaults, and all three card statuses.
- TypeScript and ESLint passed.
- Production standalone build and static-asset packaging passed, including the final explicit aria-modal attribute.
- Database helper regression test passed for fresh initialization, default omission of preview data, explicit opt-in, and refusal to reuse an existing target. The test uses a mocked schema command and does not modify the bundled database.
- All six desktop/mobile browser checks passed against the final production build: invalid-storage recovery, strategy creation/persistence, and the drawer's eligibility label, modal semantics, focus trap, Escape dismissal, and return focus.
- Luna agents reviewed the scoring/profile and UI changes; the offered-salary gate gap found in that review was fixed and tested. Live browser checks caught the missing aria-modal attribute, which was then added.

## Remaining

The 62 program records still need official-source review, exact supporting rule references, verification dates, and a fuller model of alternate qualifying paths, capital timing, dependent funds, nationality restrictions, and residence conditions. Passport ease/access still uses the Azerbaijani calibration for all selectable passports.

The tracked environment file/database and existing Git history were preserved. These repairs do not introduce a production persistence system, database migrations, authentication, or a legal-rule verification service. The unused scaffold database is not used by the matching UI. Caddy runtime validation and full Linux deployment were not performed on this Windows host.

See README.md for setup and test commands, and src/lib/data/README.md for the dataset review process.
