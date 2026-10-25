ALTER TABLE "CatalogProgram" ADD COLUMN "audit" JSONB;

CREATE TABLE "CatalogAudit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "manifestHash" TEXT NOT NULL,
    "recordIds" JSONB NOT NULL,
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
