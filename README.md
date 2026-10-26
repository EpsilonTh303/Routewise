# RouteWise

GitHub Pages deployment and safe publication instructions: [PUBLISHING.md](PUBLISHING.md). The static site runs the same browser matching, scenarios and local profile editor from a reviewed public catalog snapshot.

A database-backed immigration-program explorer with a web GUI, JSON API, command-line tools, and a local MCP server. All interfaces use the same live SQLite catalog and scoring functions. The live catalog has 79 active routes across 51 countries, including four study/post-study pilot records; all have source-audit outcomes (78 partial, one unresolved). Complete-record verification remains pending; scores describe heuristic profile fit, not approval probability.

The current suggestion engine is version **3.5.0**. It prioritizes modeled readiness and direct goal alignment, diversifies comparable backups, and explains its scores, gaps and next checks. See [ENGINE.md](ENGINE.md) for the audit findings, policy, planning assumptions and remaining evidence gaps. Goals absent from the catalog produce an empty direct strategy. The study pilot is exploratory: missing costs and application evidence exclude it from primary strategies.

## Start locally

For a study profile, **My strategy** now includes a Germany study-to-settlement reference planner. It shows four separate conditional application stages, existing route evidence and missing checks, plus optional session-only work/settlement self-checks. These are partial reported-evidence assessments, not decisions on admission or residence. The additional official-source review is dated 26 October 2026; other years require a new review.

Its EUR expense worksheet accepts sourced applicant quotes for tuition, housing/utilities, living expenses, insurance, annual semester fees, relocation and combined entry/residence application fees. Missing quotes leave the total unknown. A total requires a single applicant, all categories, confirmed twelve-month monthly quote coverage and an explicit projection assumption. Financing proof and gross salary thresholds are displayed separately and never added to spending. Quotes and later-stage answers reset when leaving/reloading this view; they do not modify the saved profile or matching scores. See [MVP_PLAN.md](MVP_PLAN.md) for scope and remaining gaps.

The same pure planner is available through the read-only `get_germany_study_plan` tool in CLI/MCP and `POST /api/v1/tools/get_germany_study_plan`. Input is `{profile, asOf: "2026-10-26"}` with optional `budget`, `stageEvidence` and `insuranceContext`; discover its strict full schema through `/api/v1/tools` or `node scripts/cli.mjs tools`. Requests are not persisted. Static Pages uses the same computation locally.

The separate **Programme-specific academic requirements** panel now pilots University of Bonn's Computer Science MSc for summer 2027. It compares reported ECTS with four published minima and lists degree, thesis, language-evidence and selection checks with dated official sources. Positive reports and document references stay **unknown pending university review**; reported shortfalls are preliminary gaps. It never infers evidence from generic profile education/language, grants admission, or changes visa checks. Inputs remain in the page session. Foreign-credit conversion, transcript/category review, accepted certificate exceptions and selection decisions are manual; the linked regulations text could not be retrieved.

The same checker is exposed as `evaluate_academic_admission` in CLI/MCP and `POST /api/v1/tools/evaluate_academic_admission`, independently of the unchanged Germany-plan request. Minimal input: `{"programmeId":"bonn-computer-science-msc","intake":"summer-2027","asOf":"2026-10-26"}`. Its optional `evidence` fields are discoverable in the tool schema. The partial source review is dated 26 October 2026; the 31 December 2026 assessment cutoff is an application freshness policy, not a university rule expiry. No application deadlines or offer probability are calculated.

A separate **Summer 2027 application window and document inventory** panel now screens published date ranges, reported EEA-group bases and document presence. Citizenship, qualifying EEA study completion and possible family/selection grounds are distinct; the official group remains unknown. Date comparisons distinguish outside dates, boundary-day uncertainty and an in-range date with a reported group mismatch. The deadline page was available only as official indexed content; exact cutoff times/timezone and endpoint inclusion remain unknown.

The inventory separates final certificates, provisional and expected-completion proof, their reported issuer/content details, conditional APS/translation/English/thesis-summary requirements and recommended materials. “Present” never means verified or accepted; missing answers stay unknown and the tool never declares a complete application. Existing academic, visa, profile and budget assessments are unchanged. Inputs are session-only. Use standalone read-only `evaluate_bonn_application` through CLI/MCP or `POST /api/v1/tools/evaluate_bonn_application`; input is `{programmeId,intake,asOf,applicationDate?,groupFactors?,degreeDocumentBranch?,degreeDocumentFacts?,conditionalFacts?,documents?}`. Discover exact strict fields in the tool schema. See [research/bonn-application-2026-10-26.md](research/bonn-application-2026-10-26.md).

The immutable original 75-route v2 audit is retained. A separate follow-up adds Portugal own-income service/current wage evidence and Vanuatu published fees, with remaining applicability limits. An append-only pilot adds German master's study, German graduate search, Dutch orientation year and Finnish post-study search. Unsupported all-in costs and calendar predictions remain null. See [SOURCE_REVIEW.md](SOURCE_REVIEW.md) and [STUDY_PATHWAYS.md](STUDY_PATHWAYS.md).

After initial setup, use **Profile** to view your overview or edit settings directly. Name, headline, location, biography and a cropped photo are saved explicitly on this browser/device; identity/photo are separate from assessment requests. Cancel discards drafts, and a storage error preserves the previously saved profile.

English, German, Turkish and Russian skills influence profile fit where listed as useful for a route, for every citizenship. German is optional in older saved profiles. These planning answers do not satisfy official language-document requirements. Route details focus on requirements, costs, next steps and sources rather than scoring internals.

Engine 3.3.0 adds partial AND/OR requirement checks for 12 reviewed pathways, optional route-scoped applicant evidence, matching-currency financial comparisons and temporary what-if scenarios. Unknown evidence remains unknown; full legal eligibility is unassessed. See [ELIGIBILITY.md](ELIGIBILITY.md), [FINANCIAL.md](FINANCIAL.md), and [RECOVERY.md](RECOVERY.md). The Explorer includes a read-only source freshness/conflict queue. Browser profiles use a version 2 envelope and still read complete legacy profiles.

Use Node 22.18+ and npm. `package-lock.json` is authoritative; the original Bun lockfile is historical.

```sh
npm ci
npm run db:generate
npm run db:setup
npm run dev
```

`db:setup` applies committed migrations and imports only missing fixture records. Running it again preserves database edits, sources, review status, and saved profiles. It does not overwrite the original archive's `db/custom.db`; the new default is `db/routewise.sqlite`.

For production builds:

```sh
npm run build
npm start
```

Apply `npm run db:deploy` to an existing deployment before starting it. A first deployment also needs the catalog imported with `npm run db:seed`. Build/start do not migrate, reset, or seed implicitly. The build generates the Prisma client and enforces TypeScript; its configured Google Fonts and first-time Prisma engine setup need network access. `PORT` and `HOSTNAME` configure the web server.

To serve a completed build to a phone on the same Wi-Fi, run `npm run start:lan`. It chooses an unused TCP port between 3001 and 3099 and binds to all IPv4 interfaces. Use the URL for the computer's Wi-Fi adapter; virtual-machine adapter addresses are also printed when present. Runtime PID/port details are in ignored `tmp/lan-server.json`. Keep the computer awake while using it. Stop this LAN server before rebuilding on Windows, because the running Prisma engine can lock standalone output files.

Mobile layouts support narrow screens and landscape, horizontal category scrolling, touch-sized controls, 16px form inputs, dynamic viewport drawer height, safe-area insets and reduced-motion preferences. Phone-layout regression tests cover 320, 375 and 390px widths plus 844x390 landscape. The app never changes the firewall automatically; a matching existing inbound Node/TCP rule or a deliberately scoped port allowance is needed for LAN access.

## Database design and operations

`CatalogProgram` stores indexed program fields; JSON columns hold lists. `ProgramSource` records source URLs, evidence and review timestamps. `ProgramRevision` preserves immutable catalog snapshots and import reasons. `SavedProfile` uses optimistic versions, and `StrategyRun` stores the exact profile snapshot, engine result and catalog version used. Deleting a saved profile cascades to its strategy runs. Legacy User/Post models remain unused scaffold tables.

Set `ROUTEWISE_DATABASE_URL` in the process environment or `.env.local`, for example:

```dotenv
ROUTEWISE_DATABASE_URL="file:db/routewise.sqlite"
```

Relative paths resolve against the project root, including when an MCP client launches from another directory. Process environment takes precedence. The original `DATABASE_URL` is ignored by the new system. Runtime Prisma clients use one SQLite connection, WAL mode and a 10-second busy timeout. This is a local/single-host database design; use persistent storage for deployment rather than a disposable application directory.

Useful commands:

```sh
npm run db:status
npm run db:deploy
npm run db:seed
npm run db:backup
npm run catalog:audit:plan
npm run catalog:audit
npm run catalog:followup:plan
npm run catalog:followup
npm run catalog:study:plan
npm run catalog:study
npm run db:backup -- /absolute/path/to/new-backup.sqlite
npm run catalog:import -- record.json
```

Backups use SQLite's online backup API and refuse to overwrite an existing target. Backups can contain personal and financial profile data. To restore, stop all writers and point `ROUTEWISE_DATABASE_URL` at a verified backup copy; avoid replacing a database while GUI/API/MCP processes are using it. The integration suite checks backup integrity and catalog contents.

Catalog imports are explicit and transactional. The input is `{ "program": <complete Program>, "sources": [...], "reason": "...", "expectedHash": "...", "active": true }`. Read `get_program` first and supply its current contentHash when updating. Stale/missing hashes are rejected. Imports with identical content are idempotent. Set active false to retire a record; inspect it with get_program and includeInactive true before reactivation. History is retained for audit rather than silently pruned; monitor database and backup size.

Marking a record verified requires a review timestamp and a matching source row with evidence and that same timestamp. This validates provenance structure; it does not independently prove a legal rule. See `src/lib/data/README.md`. Never label a source verified merely because its URL exists.

For new schema changes use `npm run db:migrate -- descriptive-name` in a development database, review the generated SQL, then deploy it normally. `db:push` is a compatibility alias for migration deployment, not destructive schema synchronization. No reset command is exposed.

## Ask an AI through MCP

Generate a connection configuration for this checkout:

```sh
npm run --silent mcp:config
```

The generated local `mcp.config.json` is ready for a host that accepts the mcpServers JSON format. Regenerate it after moving the checkout. `mcp.config.example.json` shows the portable shape. Other MCP hosts can use the same command, args and environment in their own configuration format. No global AI-client settings were changed automatically.

The host launches **node with the absolute scripts/mcp.mjs path**. Use that launcher directly in an MCP configuration, rather than npm's banner-printing command. It requires no running web server or GUI. It serves MCP over stdin/stdout with the official TypeScript SDK; stdout is reserved for JSON-RPC.

Example requests to an AI connected to RouteWise:

- “List the Germany programs under my available budget and show the sources.”
- “Get the profile schema, ask me for missing details, then compare my top three routes.”
- “Explain why the EU Blue Card is conditional for this profile and show its roadmap.”
- “Save this profile as relocation-2026, then save a strategy snapshot.”
- “Show the source and change history for this program.”

Available tools:

| Tools | Purpose |
| --- | --- |
| get_catalog_stats, get_profile_schema | Discover live catalog coverage, calibration limits and required inputs |
| list_programs, get_program | Filter/paginate the catalog and read detailed sources/review status |
| get_program_history, get_program_revision | Read revision metadata and immutable snapshots |
| match_profile, compare_programs, get_roadmap | Stateless evaluation and explanations |
| compare_scenarios | Compare 1–5 temporary profile patches with bounded ranking, requirement and score changes |
| get_source_review_queue | Dated read-only source freshness, partial coverage and potential conflict queue |
| list_profiles, get_profile, save_profile, delete_profile | Explicit local profile persistence with version checks |
| save_strategy, list_strategies, get_strategy | Store and retrieve reproducible evaluation snapshots |

An AI must ask for missing personal facts instead of inventing them. Save/delete tools change local data and are marked accordingly. The local MCP server and CLI trust the OS account/client that launches them; saved profiles are not a multi-user authenticated service. The server is stdio-only; no remote MCP listener is exposed.

## Use without an AI or GUI

The CLI emits one JSON document, exits nonzero on errors, and can be launched from any working directory. These fixture inputs are fictional examples, not your personal profile:

```sh
node scripts/cli.mjs tools
node scripts/cli.mjs get_catalog_stats
node scripts/cli.mjs list_programs --input examples/ai/search.json
node scripts/cli.mjs match_profile --input examples/ai/match.json
```

Use an absolute launcher path when outside the project. Input file paths are relative to the caller's current directory. `--json` also accepts an inline JSON object. Every MCP tool is available as a CLI command with the same input schema. `get_profile_schema` exposes the complete profile JSON Schema.

## HTTP API

The app server exposes stateless public catalog/evaluation endpoints. All responses are `{data:...}` or `{error:{code,message,...}}`, with no-store caching. JSON POST bodies are limited to 64 KiB. Unknown fields, duplicate query parameters, malformed profiles and excessive limits are rejected.

| Method | Path | Input |
| --- | --- | --- |
| GET | /api | Discovery links |
| GET | /api/v1/stats | Live counts/version; /health is an alias |
| GET | /api/v1/profile-schema | Profile JSON Schema |
| GET | /api/v1/tools | Public tool manifests and input schemas |
| GET | /api/v1/programs | query, country, category, region, maxBudget, verifiedOnly, limit, offset |
| GET | /api/v1/programs/{id} | One active program and sources |
| GET | /api/v1/programs/{id}/history | limit and offset |
| GET | /api/v1/revisions/{id} | Immutable catalog snapshot |
| POST | /api/v1/match | profile, optional limit/includeIneligible/includeAlternatives |
| POST | /api/v1/compare | ids, optional profile |
| POST | /api/v1/scenarios | profile, 1–5 scenarios {id,label,changes}, optional limit (1–20) |
| GET | /api/v1/reviews | required asOf (YYYY-MM-DD), optional maxAgeDays and limit |
| POST | /api/v1/programs/{id}/roadmap | profile |
| POST | /api/v1/tools/{name} | The selected public tool's input |

Country filters use the names returned by get_catalog_stats. maxBudget checks a single applicant's recorded capital/spending floor, not family eligibility. Use match_profile for actual profile-based checks.

Public HTTP **does not expose saved profiles, saved strategies, catalog imports or arbitrary SQL**. Match requests are not persisted or logged by this app. The GUI fetches catalog pages and evaluates its localStorage profile in the browser; it does not transmit that profile to the matching API. Catalog pagination carries a version hash; a mid-load catalog change produces a retry screen rather than mixing versions.

## Checks

```sh
npm test
npm run test:integration
npm run lint
npm run build
npm run test:browser-install
npm run test:e2e
```

Integration tests use temporary SQLite files with real migrations, online backups, repository round trips, HTTP handlers, CLI subprocesses and the official MCP client. Browser tests initialize their own temporary catalog and start/stop a production server on port 3100. Browser binaries stay in ignored `.playwright/`; test databases/results are ignored. Test fixtures never replace the working database.

## Packaging and data limits

Set `ROUTEWISE_E2E_PORT` to an unused port if 3100 is occupied; the browser suite never reuses an unrelated server. For example in PowerShell: `$env:ROUTEWISE_E2E_PORT='3117'; npm.cmd run test:e2e`.

Caddy forwards only to localhost:3000. The optional Linux/Bash packaging helpers use migrations and catalog setup for a fresh artifact. PACKAGE_PREVIEW_DB=1 explicitly includes a full online backup of the local database, including saved profiles and runs; default packaging does not copy private data. Set ROUTEWISE_DATABASE_URL to persistent storage for real deployments and establish a backup/recovery policy. Full Linux deployment has not been verified on this Windows host.

The tracked legacy environment file/database and Git history from the archive were preserved. New databases, backups, private profiles and generated machine-specific MCP configuration are ignored. Source verification for the 62 imported records remains outstanding, and passport ease/access still uses Azerbaijani calibration for other selectable citizenships.

See [PATHWAYS.md](PATHWAYS.md) for pathway separation and migration commands. Unknown branch figures show Needs review and cannot enter primary strategies.

The official-source review pass is documented in [SOURCE_REVIEW.md](SOURCE_REVIEW.md). Use `catalog:review:plan` and `catalog:review` for the guarded batch. Native-currency evidence and citations are available through the GUI, REST, CLI and MCP; partial reviews do not count as fully verified routes.
