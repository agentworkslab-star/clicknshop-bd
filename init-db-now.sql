-- ClickNShop.bd Emergency DB Init (FINAL CLEAN VERSION)
-- Run in Neon SQL Editor: https://console.neon.tech/app/projects/summer-sun-05670628
-- Click "SQL Editor" in left sidebar → paste this entire file → click "Run"

DROP TABLE IF EXISTS "usage_logs" CASCADE;
DROP TABLE IF EXISTS "sessions" CASCADE;
DROP TABLE IF EXISTS "api_settings" CASCADE;
DROP TABLE IF EXISTS "templates" CASCADE;
DROP TABLE IF EXISTS "folders" CASCADE;
DROP TABLE IF EXISTS "brand_memories_ext" CASCADE;
DROP TABLE IF EXISTS "generated_contents" CASCADE;
DROP TABLE IF EXISTS "products" CASCADE;
DROP TABLE IF EXISTS "referrals" CASCADE;
DROP TABLE IF EXISTS "saved_outputs" CASCADE;
DROP TABLE IF EXISTS "generations" CASCADE;
DROP TABLE IF EXISTS "frameworks" CASCADE;
DROP TABLE IF EXISTS "brand_memory" CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

DROP TYPE IF EXISTS "Plan" CASCADE;
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "FrameworkType" CASCADE;
DROP TYPE IF EXISTS "Platform" CASCADE;
DROP TYPE IF EXISTS "LanguageMode" CASCADE;
DROP TYPE IF EXISTS "StockStatus" CASCADE;

CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "FrameworkType" AS ENUM ('PAS', 'AIDA', 'HORMOZI', 'STORYTELLING', 'CUSTOM');
CREATE TYPE "Platform" AS ENUM ('FACEBOOK', 'INSTAGRAM_REELS', 'YOUTUBE_SHORTS', 'TIKTOK');
CREATE TYPE "LanguageMode" AS ENUM ('BANGLA', 'MIXED', 'ENGLISH');
CREATE TYPE "StockStatus" AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED');

CREATE TABLE "users" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "brandName" TEXT NOT NULL, "whatsappNumber" TEXT NOT NULL UNIQUE, "email" TEXT UNIQUE, "passwordHash" TEXT NOT NULL, "phone" TEXT, "referralCode" TEXT, "ownReferralCode" TEXT NOT NULL UNIQUE, "plan" "Plan" NOT NULL DEFAULT 'FREE', "role" "Role" NOT NULL DEFAULT 'USER', "isSuspended" BOOLEAN NOT NULL DEFAULT false, "avatarUrl" TEXT, "emailVerified" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL);

CREATE TABLE "brand_memory" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "userId" UUID NOT NULL UNIQUE, "brandTone" TEXT, "audiencePain" TEXT, "winningCTA" TEXT, "productOffers" JSONB DEFAULT '[]', "audienceProfile" JSONB, "winningReferences" JSONB DEFAULT '[]', "objections" JSONB DEFAULT '[]', "brandName" TEXT, "website" TEXT, "phone" TEXT, "facebookPage" TEXT, "whatsapp" TEXT, "ctaDefault" TEXT, "logoUrl" TEXT, "primaryColor" TEXT DEFAULT '#0b3d0b', "secondaryColor" TEXT DEFAULT '#22C55E', "targetAudience" TEXT, "description" TEXT, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "brand_memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE);

CREATE TABLE "frameworks" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "userId" UUID NOT NULL, "name" TEXT NOT NULL, "type" "FrameworkType" NOT NULL, "description" TEXT, "content" TEXT NOT NULL, "uploadedFileUrl" TEXT, "isPreset" BOOLEAN NOT NULL DEFAULT false, "icon" TEXT DEFAULT 'BookOpen', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "frameworks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE);

CREATE TABLE "generations" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "userId" UUID NOT NULL, "product" TEXT NOT NULL, "audience" TEXT NOT NULL, "tone" TEXT NOT NULL, "platform" "Platform" NOT NULL, "frameworkId" UUID, "languageMode" "LanguageMode" NOT NULL, "duration" INTEGER NOT NULL, "hooks" JSONB NOT NULL DEFAULT '[]', "fullScript" TEXT, "caption" TEXT, "cta" TEXT, "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[], "performanceNotes" TEXT, "templateType" TEXT, "language" TEXT DEFAULT 'BN', "length" TEXT DEFAULT 'MEDIUM', "inputData" JSONB DEFAULT '{}', "outputText" TEXT, "folderId" UUID, "isFavorite" BOOLEAN NOT NULL DEFAULT false, "tags" TEXT[] DEFAULT ARRAY[]::TEXT[], "modelUsed" TEXT NOT NULL, "tokensUsed" INTEGER NOT NULL DEFAULT 0, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "isSaved" BOOLEAN NOT NULL DEFAULT false, CONSTRAINT "generations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE);

CREATE INDEX "generations_userId_createdAt_idx" ON "generations"("userId", "createdAt");

CREATE TABLE "saved_outputs" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "userId" UUID NOT NULL, "generationId" UUID NOT NULL UNIQUE, "label" TEXT, "notes" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "saved_outputs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE);

CREATE INDEX "saved_outputs_userId_idx" ON "saved_outputs"("userId");

CREATE TABLE "referrals" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "referrerId" UUID NOT NULL, "refereeId" UUID NOT NULL, "rewardApplied" BOOLEAN NOT NULL DEFAULT false, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "referrals_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "users"("id"), CONSTRAINT "referrals_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "users"("id"));

CREATE TABLE "products" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "userId" UUID NOT NULL, "name" TEXT NOT NULL, "category" TEXT, "weight" TEXT, "shortDesc" TEXT, "longDesc" TEXT, "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[], "price" DOUBLE PRECISION, "discountPrice" DOUBLE PRECISION, "seoKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[], "images" TEXT[] DEFAULT ARRAY[]::TEXT[], "stockStatus" "StockStatus" NOT NULL DEFAULT 'IN_STOCK', "sku" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "products_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE);

CREATE INDEX "products_userId_idx" ON "products"("userId");

CREATE TABLE "folders" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "userId" UUID NOT NULL, "name" TEXT NOT NULL, "color" TEXT NOT NULL DEFAULT '#0b3d0b', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE);

CREATE INDEX "folders_userId_idx" ON "folders"("userId");

CREATE TABLE "generated_contents" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "userId" UUID NOT NULL, "productId" UUID, "templateType" TEXT NOT NULL, "inputData" JSONB NOT NULL DEFAULT '{}', "outputText" TEXT NOT NULL, "language" TEXT NOT NULL DEFAULT 'BN', "tone" TEXT, "length" TEXT NOT NULL DEFAULT 'MEDIUM', "folderId" UUID, "isFavorite" BOOLEAN NOT NULL DEFAULT false, "tags" TEXT[] DEFAULT ARRAY[]::TEXT[], "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "generated_contents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE, CONSTRAINT "generated_contents_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL, CONSTRAINT "generated_contents_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL);

CREATE INDEX "generated_contents_userId_createdAt_idx" ON "generated_contents"("userId", "createdAt");

ALTER TABLE "generations" ADD CONSTRAINT "generations_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL;

CREATE TABLE "brand_memories_ext" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "userId" UUID NOT NULL UNIQUE, "data" JSONB NOT NULL, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "brand_memories_ext_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE);

CREATE TABLE "templates" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "slug" TEXT NOT NULL UNIQUE, "name" TEXT NOT NULL, "description" TEXT, "icon" TEXT NOT NULL DEFAULT 'FileText', "systemPrompt" TEXT NOT NULL, "inputSchema" JSONB NOT NULL DEFAULT '{}', "isActive" BOOLEAN NOT NULL DEFAULT true, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL);

CREATE TABLE "api_settings" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "userId" UUID NOT NULL UNIQUE, "groqApiKeyEncrypted" TEXT, "modelPreference" TEXT NOT NULL DEFAULT 'llama-3.3-70b-versatile', "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7, "maxTokens" INTEGER NOT NULL DEFAULT 2048, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "api_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE);

CREATE TABLE "usage_logs" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "userId" UUID NOT NULL, "templateType" TEXT NOT NULL, "tokensUsed" INTEGER NOT NULL, "modelUsed" TEXT NOT NULL, "durationMs" INTEGER NOT NULL, "success" BOOLEAN NOT NULL DEFAULT true, "errorMessage" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "usage_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE);

CREATE INDEX "usage_logs_userId_createdAt_idx" ON "usage_logs"("userId", "createdAt");

CREATE TABLE "sessions" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL, "userId" UUID NOT NULL, "token" TEXT NOT NULL UNIQUE, "userAgent" TEXT, "ipAddress" TEXT, "expiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE);

CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

INSERT INTO "users" ("id", "brandName", "whatsappNumber", "email", "passwordHash", "phone", "ownReferralCode", "role", "plan", "emailVerified", "updatedAt") VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'FashionBD', '01800000000', 'demo@clicknshop.bd', 'placeholder', '+880****0000', 'DEMO001', 'USER', 'PRO', true, CURRENT_TIMESTAMP);

INSERT INTO "users" ("id", "brandName", "whatsappNumber", "email", "passwordHash", "phone", "ownReferralCode", "role", "plan", "emailVerified", "updatedAt") VALUES ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'ClickNShop Admin', '01700000000', 'admin@clicknshop.bd', 'placeholder', '+880****0000', 'ADMIN001', 'ADMIN', 'PRO', true, CURRENT_TIMESTAMP);

SELECT 'Tables and users created successfully!' as status;