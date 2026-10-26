# Web publication

The owner requested GitHub publication and Vercel deployment on 2026-10-26. `vercel.json` selects the static web edition (`framework: null`, `npm run build:vercel`, output `out`). This reuses the reviewed Pages exporter with an empty base path. `npm run test:vercel` tests this root-address edition; `ROUTEWISE_STATIC_TEST_URL` can target its deployed URL. No live database or environment values are uploaded. SQLite REST/API, CLI and MCP still require the normal Node installation; Vercel hosts the browser edition only. Vercel manages its public HTTPS listener; local launchers default to port 3001.

The web interface has a static mode for `https://epsilonth303.github.io/Routewise/`. It includes the reviewed 79-program catalog, browser-side matching/scenarios and local profile/photo editing. Pages cannot run the SQLite/REST/MCP server; those interfaces remain available in the normal Node deployment.

`npm run build:pages` creates a disposable database from the committed reviewed batches and exports only validated public Program records. Static mode recognizes `.tsx`/`.jsx` page files, excluding the Node `.ts` API handlers without moving source files. It never reads or copies the user's live database; environment files are never copied into `out/`. A temporary public catalog file is restored/removed after the build. Output is `out/`; previous exports and temporary databases remain ignored under `tmp/`. `NEXT_PUBLIC_BASE_PATH` controls the repository subpath. `npm run test:pages` checks the exported site under `/Routewise/` with no API server.

Next.js shares `.next` build storage between modes. On Windows stop only the verified project LAN launcher before building (Prisma DLL locks otherwise prevent cleanup). To restore the Node/LAN edition after a Pages build, run the normal `npm run build`, then restart the launcher. CI runs the static build in its own checkout and needs no running database/server. Run `npm run db:generate` once after dependency installation before a static build.

The workflow `.github/workflows/pages.yml` builds on pushes to `main`, uploads only `out/` and deploys through GitHub Pages. Repository Pages must use GitHub Actions as its source. The owner explicitly approved making this repository public after GitHub reported that its plan did not support Pages on the private repository.

## Preserve local history without publishing private imports

The original imported Git history tracks `.env`, `db/custom.db` and old `.zscripts` screenshots/runtime scaffolding. Do not push that original `main` history directly. Keep its values/history unchanged locally.

After committing and validating a release, run:

```powershell
node scripts/prepare-publication.mjs
```

This creates an isolated `tmp/github-publication-*` clone, removes those paths from every reachable publication commit, retains application changes and commit messages, checks reachable paths and common credential patterns, and configures the requested GitHub remote. Original commits are untouched; publication SHAs differ because their ancestry is sanitized. The helper never pushes. Review the reported clone and then push its `main` explicitly:

```powershell
git -C "<reported publicationDirectory>" push origin main:main
```

Use a normal fast-forward push. If remote history has diverged, fetch and review it; do not force push. Never push original backup refs, `--all`, `--mirror` or private runtime files. Re-running the helper against a later original `main` deterministically rebuilds the same sanitized ancestors.
