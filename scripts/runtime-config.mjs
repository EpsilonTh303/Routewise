import { existsSync, mkdirSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { dirname, isAbsolute, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const localEnv = resolve(projectRoot, '.env.local');
if (existsSync(localEnv)) loadEnvFile(localEnv);

export function databasePath() {
  const value = process.env.ROUTEWISE_DATABASE_URL ?? 'file:db/routewise.sqlite';
  if (!value.startsWith('file:') || /[?#]/.test(value)) throw new Error('ROUTEWISE_DATABASE_URL must be a SQLite file URL without query parameters');
  const path = value.startsWith('file://') ? fileURLToPath(value) : value.slice(5);
  if (!path || path === ':memory:') throw new Error('Use a persistent SQLite file path');
  return isAbsolute(path) ? path : resolve(projectRoot, path);
}

export function databaseUrl() {
  return `file:${databasePath().replaceAll('\\', '/')}`;
}

export function ensureDatabaseDirectory() {
  mkdirSync(dirname(databasePath()), { recursive: true });
}
