# Database backup and recovery

## Create a backup

Run `npm run db:backup` from the project directory. The command uses SQLite's online backup API, so it can take a consistent snapshot while the application is using the database. It prints the resulting backup path. To choose an explicit destination, run `npm run db:backup -- C:\path\to\routewise-backup.sqlite`; the destination must not already exist.

Keep backup files private and outside Git. A backup contains the full catalog, source evidence and revision history, along with saved profiles and immutable evaluation snapshots. Treat it as sensitive personal data.

## Restore

Stop application writers before replacing a database file. Preserve the current database by moving or copying it to a separate, new filename first. Copy the chosen backup into the configured database location, keeping the runtime's expected filename and path. Do not run setup, seed, reset, or migrations as part of a routine restore: the backup is already a complete database. Restart the application and verify that it can read the catalog and saved data.

For a non-destructive recovery check, copy the backup to a new isolated path and inspect it without changing the working database:

```powershell
Copy-Item .\backups\routewise-backup.sqlite .\tmp\recovery-check.sqlite
```

The integration recovery test exercises a fresh temporary database, takes a backup using the production command, opens a distinct restored copy through Prisma, verifies catalog revisions and saved profile/evaluation snapshots, and runs SQLite integrity checks. Run it with `npm run test:integration -- tests/integration/recovery.test.mts` (or run the full integration suite).

Backups are snapshots, not a source of current legal requirements. Keep source effective dates, retrieval dates, conflicts and review limitations visible after recovery. A freshness summary should distinguish stale or undated claims from current evidence without upgrading partial review to verification. Use a visible manual review queue prioritized by claim freshness, conflict and route relevance; require claim-level evidence and a guarded, versioned catalog batch for accepted changes. Never silently overwrite custom edits from research or source changes.
