import { PrismaClient } from '@prisma/client'
import { databaseUrl } from '../../scripts/runtime-config.mjs'

export function createDatabase(url = databaseUrl()) {
  // Never log queries, profile values, or diagnostics to MCP's stdout channel.
  return new PrismaClient({ datasourceUrl: `${url}${url.includes('?')?'&':'?'}connection_limit=1`, log: [], transactionOptions: {maxWait:10000,timeout:30000} })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  createDatabase()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
