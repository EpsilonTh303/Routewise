-- CreateTable
CREATE TABLE "CatalogSplit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "parentId" TEXT NOT NULL,
    "parentContentHash" TEXT NOT NULL,
    "childIds" JSONB NOT NULL,
    "appliedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CatalogSplit_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CatalogProgram" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CatalogProgram" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "country" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "minBudget" REAL,
    "minMonthlyIncome" REAL,
    "totalYearOneCost" REAL,
    "costPerDependent" REAL,
    "processingWeeks" REAL,
    "yearsToPR" REAL,
    "yearsToCitizenship" REAL,
    "citizenshipLanguage" TEXT,
    "jobOfferRequired" BOOLEAN,
    "remoteFriendly" BOOLEAN,
    "familyFriendly" REAL NOT NULL,
    "passportAccess" TEXT NOT NULL,
    "devScore" REAL NOT NULL,
    "azEase" REAL NOT NULL,
    "languageBonus" JSONB NOT NULL,
    "requirements" JSONB NOT NULL,
    "pros" JSONB NOT NULL,
    "cons" JSONB NOT NULL,
    "taxNote" TEXT,
    "url" TEXT NOT NULL,
    "dvLottery" BOOLEAN NOT NULL DEFAULT false,
    "e2Treaty" BOOLEAN NOT NULL DEFAULT false,
    "verificationStatus" TEXT NOT NULL DEFAULT 'unverified',
    "verificationSourceUrl" TEXT NOT NULL,
    "checkedAt" DATETIME,
    "contentHash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "pathway" JSONB,
    "parentId" TEXT,
    CONSTRAINT "CatalogProgram_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CatalogProgram" ("id") ON DELETE RESTRICT ON UPDATE NO ACTION
);
INSERT INTO "new_CatalogProgram" ("active", "azEase", "category", "checkedAt", "citizenshipLanguage", "cons", "contentHash", "costPerDependent", "country", "createdAt", "devScore", "dvLottery", "e2Treaty", "familyFriendly", "flag", "id", "jobOfferRequired", "languageBonus", "minBudget", "minMonthlyIncome", "passportAccess", "processingWeeks", "program", "pros", "region", "remoteFriendly", "requirements", "tagline", "taxNote", "totalYearOneCost", "updatedAt", "url", "verificationSourceUrl", "verificationStatus", "yearsToCitizenship", "yearsToPR") SELECT "active", "azEase", "category", "checkedAt", "citizenshipLanguage", "cons", "contentHash", "costPerDependent", "country", "createdAt", "devScore", "dvLottery", "e2Treaty", "familyFriendly", "flag", "id", "jobOfferRequired", "languageBonus", "minBudget", "minMonthlyIncome", "passportAccess", "processingWeeks", "program", "pros", "region", "remoteFriendly", "requirements", "tagline", "taxNote", "totalYearOneCost", "updatedAt", "url", "verificationSourceUrl", "verificationStatus", "yearsToCitizenship", "yearsToPR" FROM "CatalogProgram";
DROP TABLE "CatalogProgram";
ALTER TABLE "new_CatalogProgram" RENAME TO "CatalogProgram";
CREATE INDEX "CatalogProgram_active_country_idx" ON "CatalogProgram"("active", "country");
CREATE INDEX "CatalogProgram_active_category_region_idx" ON "CatalogProgram"("active", "category", "region");
CREATE INDEX "CatalogProgram_verificationStatus_idx" ON "CatalogProgram"("verificationStatus");
CREATE INDEX "CatalogProgram_minBudget_idx" ON "CatalogProgram"("minBudget");
CREATE INDEX "CatalogProgram_parentId_idx" ON "CatalogProgram"("parentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

