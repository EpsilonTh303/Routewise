# Worklog

---
Task ID: 1
Agent: Z.ai (main agent)
Task: Build "RouteWise" — an immigration route/strategy website where users enter citizenship (Azerbaijani first), budget, profile; it scores 62 real visa programs across 51 countries and outputs a Plan A/B/C relocation strategy.

Work Log:
- Loaded fullstack-dev skill, ran init script, inspected scaffold (Next.js 16, Tailwind 4, shadcn/ui, framer-motion, recharts).
- Built dark premium theme (emerald + gold, glassmorphism, aurora background) in src/app/globals.css; layout.tsx metadata + dark class.
- Created data layer in src/lib/types.ts + src/lib/data/{europe,americas,apac,emerging,index}.ts — 62 hand-calibrated programs across 51 countries (visas, golden visas, CBI, nomad, passive, student, entrepreneur routes; AZ passport access, year-1 costs, PR/citizenship timelines, pros/cons, official links).
- Built scoring engine src/lib/scoring.ts: hard gates (budget, income, job offer, age, education), 6-dimension scores (cost, speed, citizenship, QoL, passport access, profile fit), goal-weighted totals, Plan A/B/C strategy builder, roadmap generator with month estimates, passport info.
- UI components in src/components/atlas/: Background, Navbar, Hero (3D tilting AZ passport card), Wizard (3 steps: identity, budget & career, goals), ProgramCard (animated match rings), ProgramDrawer (radar chart, roadmap timeline, requirements, pros/cons, official link), Results (podium + filters + grid), Explorer (full atlas browse), Footer (disclaimer).
- page.tsx orchestrates landing/wizard/results/explore views with localStorage profile persistence.

Fixes during browser verification (agent-browser):
- scoring.ts: const → let reassignment build error.
- ProgramDrawer ScrollArea: added min-h-0/overflow-hidden so the drawer body scrolls.
- Navbar: added aria-labels (buttons had empty accessible names on mobile due to hidden sm:inline spans).
- Nav logic: "My strategy" now jumps to results (saved profile) or wizard (no profile); logo still returns to hero.
- Hero stats row: fixed mobile horizontal overflow (flex-wrap).
- All marketing numbers made dynamic from PROGRAM_COUNT/COUNTRY_COUNT (62 programs / 51 countries).

Stage Summary:
- Verified end-to-end via agent-browser: landing → wizard → results podium → drawer roadmap/radar → filters → explorer, desktop + mobile (375px), no console errors, lint clean, dev.log clean.
- Scoring reacts correctly to profile changes (e.g., lowest-cost goal → Japan HSP 90% / Paraguay 88%).
- Deliverable: interactive Next.js app on port 3000 (single `/` route).

2026-10-25: Engine 3.3.0 — added partial AND/OR requirement checks for 12 reviewed routes, optional route-scoped evidence with backward-compatible browser profile v2 serialization, matching-currency financial comparisons, bounded stateless what-if comparison across GUI/REST/CLI/MCP, read-only source queue, and isolated recovery validation. Live catalog/source batches unchanged. Checks: 62 unit, 17 integration, lint/typecheck/build; 24 browser cases validated with four intentional desktop skips (two legacy storage assertions corrected and rerun). LAN restored and Wi-Fi endpoint verified at engine 3.3.0. Remaining source gaps and next work are in tasks.md/HANDOFF.md.

2026-10-25: Engine 3.4.0 — three Luna region audits cover all 75 active records; primary crosschecks accepted 88 claims (74 partial audits, one unresolved), retained 42 limited/indexed claims and six unclear intake states. Applied immutable official-catalog-audit-2026-10-25-v2 after backup and migration 202610250003_source_audit. All 75 expected hashes matched; profiles, saved evaluations and 14 inactive records preserved by fingerprints. Added generalized audit JSON, exact-ID/hash receipts, dated evidence preservation, closed/unclear intake strategy guards and null unsupported scalar estimates. Study/poststudy design is future-only in STUDY_PATHWAYS.md. Validation: 69 unit, 23 integration, lint/typecheck/production build, 26 browser cases with four intentional desktop skips (two legacy single-citation assertions updated and rerun). LAN restored and Wi-Fi verified engine3.4/75audited/74partial/1unresolved/0verified. Local commits handled by primary agent; no push.
