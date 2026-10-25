-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CatalogProgram" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "country" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "program" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tagline" TEXT NOT NULL,
    "minBudget" REAL NOT NULL,
    "minMonthlyIncome" REAL NOT NULL,
    "totalYearOneCost" REAL NOT NULL,
    "costPerDependent" REAL NOT NULL,
    "processingWeeks" REAL NOT NULL,
    "yearsToPR" REAL,
    "yearsToCitizenship" REAL,
    "citizenshipLanguage" TEXT,
    "jobOfferRequired" BOOLEAN NOT NULL,
    "remoteFriendly" BOOLEAN NOT NULL,
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
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProgramSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "programId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT,
    "evidence" TEXT,
    "checkedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProgramSource_programId_fkey" FOREIGN KEY ("programId") REFERENCES "CatalogProgram" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProgramRevision" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "programId" TEXT NOT NULL,
    "contentHash" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "reason" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProgramRevision_programId_fkey" FOREIGN KEY ("programId") REFERENCES "CatalogProgram" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SavedProfile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "profile" JSONB NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "StrategyRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "profileId" TEXT NOT NULL,
    "profileVersion" INTEGER NOT NULL,
    "profileSnapshot" JSONB NOT NULL,
    "catalogVersion" TEXT NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StrategyRun_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "SavedProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "CatalogProgram_active_country_idx" ON "CatalogProgram"("active", "country");

-- CreateIndex
CREATE INDEX "CatalogProgram_active_category_region_idx" ON "CatalogProgram"("active", "category", "region");

-- CreateIndex
CREATE INDEX "CatalogProgram_verificationStatus_idx" ON "CatalogProgram"("verificationStatus");

-- CreateIndex
CREATE INDEX "CatalogProgram_minBudget_idx" ON "CatalogProgram"("minBudget");

-- CreateIndex
CREATE UNIQUE INDEX "ProgramSource_programId_url_key" ON "ProgramSource"("programId", "url");

-- CreateIndex
CREATE INDEX "ProgramRevision_programId_createdAt_idx" ON "ProgramRevision"("programId", "createdAt");

-- CreateIndex
CREATE INDEX "StrategyRun_profileId_createdAt_idx" ON "StrategyRun"("profileId", "createdAt");

