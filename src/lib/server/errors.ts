export class ServiceError extends Error {
  constructor(public code: "NOT_FOUND" | "CONFLICT" | "CATALOG_EMPTY" | "INVALID_INPUT" | "DATABASE_UNAVAILABLE", message: string, public status = 400) {
    super(message);
  }
}

export function publicError(error: unknown) {
  if (error instanceof ServiceError) return {code:error.code,message:error.message};
  return {code:"DATABASE_UNAVAILABLE",message:"The database operation failed. Run npm run db:setup and check the configured database path."};
}
