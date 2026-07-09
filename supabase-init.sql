-- BanglaWriter Database Initialization - CLEAN FINAL VERSION
-- Location: E:\Web Dasbord ai\Poject\BanglaWriter\supabase-init.sql
-- Run in Supabase SQL Editor: https://supabase.com/dashboard/project/ciepgxoayjydgcrfxsmh/sql/new

-- Drop existing tables
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

-- Create enums
CREATE TYPE "Plan" AS ENUM ('FREE', 'PRO');
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "FrameworkType" AS ENUM ('PAS', 'AIDA', 'HORMOZI', 'STORYTELLING', 'CUSTOM');
CREATE TYPE "Platform" AS ENUM ('FACEBOOK', 'INSTAGRAM_REELS', 'YOUTUBE_SHORTS', 'TIKTOK');
CREATE TYPE "LanguageMode" AS ENUM ('BANGLA', 'MIXED', 'ENGLISH');
CREATE TYPE "StockStatus" AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED');

-- users
CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "brandName" TEXT NOT NULL,
  "whatsappNumber" TEXT NOT NULL UNIQUE,
  "email" TEXT UNIQUE,
  "passwordHash" TEXT NOT NULL,
  "phone" TEXT,
  "referralCode" TEXT,
  "ownReferralCode" TEXT NOT NULL UNIQUE,
  "plan" "Plan" NOT NULL DEFAULT 'FREE',
  "role" "Role" NOT NULL DEFAULT 'USER',
  "isSuspended" BOOLEAN NOT NULL DEFAULT false,
  "avatarUrl" TEXT,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- brand_memory
CREATE TABLE "brand_memory" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" UUID NOT NULL UNIQUE,
  "brandTone" TEXT,
  "audiencePain" TEXT,
  "winningCTA" TEXT,
  "productOffers" JSONB DEFAULT '[]',
  "audienceProfile" JSONB,
  "winningReferences" JSONB DEFAULT '[]',
  "objections" JSONB DEFAULT '[]',
  "brandName" TEXT,
  "website" TEXT,
  "phone" TEXT,
  "facebookPage" TEXT,
  "whatsapp" TEXT,
  "ctaDefault" TEXT,
  "logoUrl" TEXT,
  "primaryColor" TEXT DEFAULT '#0b3d0b',
  "secondaryColor" TEXT DEFAULT '#22C55E',
  "targetAudience" TEXT,
  "description" TEXT,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "brand_memory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

-- frameworks
CREATE TABLE "frameworks" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "type" "FrameworkType" NOT NULL,
  "description" TEXT,
  "content" TEXT NOT NULL,
  "uploadedFileUrl" TEXT,
  "isPreset" BOOLEAN NOT NULL DEFAULT false,
  "icon" TEXT DEFAULT 'BookOpen',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "frameworks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

-- generations
CREATE TABLE "generations" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" UUID NOT NULL,
  "product" TEXT NOT NULL,
  "audience" TEXT NOT NULL,
  "tone" TEXT NOT NULL,
  "platform" "Platform" NOT NULL,
  "frameworkId" UUID,
  "languageMode" "LanguageMode" NOT NULL,
  "duration" INTEGER NOT NULL,
  "hooks" JSONB NOT NULL DEFAULT '[]',
  "fullScript" TEXT,
  "caption" TEXT,
  "cta" TEXT,
  "hashtags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "performanceNotes" TEXT,
  "templateType" TEXT,
  "language" TEXT DEFAULT 'BN',
  "length" TEXT DEFAULT 'MEDIUM',
  "inputData" JSONB DEFAULT '{}',
  "outputText" TEXT,
  "folderId" UUID,
  "isFavorite" BOOLEAN NOT NULL DEFAULT false,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "modelUsed" TEXT NOT NULL,
  "tokensUsed" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "isSaved" BOOLEAN NOT NULL DEFAULT false,
  CONSTRAINT "generations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX "generations_userId_createdAt_idx" ON "generations"("userId", "createdAt");

-- saved_outputs
CREATE TABLE "saved_outputs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" UUID NOT NULL,
  "generationId" UUID NOT NULL UNIQUE,
  "label" TEXT,
  "notes" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "saved_outputs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX "saved_outputs_userId_idx" ON "saved_outputs"("userId");

-- referrals
CREATE TABLE "referrals" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "referrerId" UUID NOT NULL,
  "refereeId" UUID NOT NULL,
  "rewardApplied" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "referrals_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "users"("id"),
  CONSTRAINT "referrals_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "users"("id")
);

CREATE INDEX "referrals_referrerId_idx" ON "referrals"("referrerId");
CREATE INDEX "referrals_refereeId_idx" ON "referrals"("refereeId");

-- products
CREATE TABLE "products" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT,
  "weight" TEXT,
  "shortDesc" TEXT,
  "longDesc" TEXT,
  "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "price" DOUBLE PRECISION,
  "discountPrice" DOUBLE PRECISION,
  "seoKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "stockStatus" "StockStatus" NOT NULL DEFAULT 'IN_STOCK',
  "sku" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "products_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX "products_userId_idx" ON "products"("userId");

-- folders
CREATE TABLE "folders" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "color" TEXT NOT NULL DEFAULT '#0b3d0b',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "folders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX "folders_userId_idx" ON "folders"("userId");

-- generated_contents
CREATE TABLE "generated_contents" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" UUID NOT NULL,
  "productId" UUID,
  "templateType" TEXT NOT NULL,
  "inputData" JSONB NOT NULL DEFAULT '{}',
  "outputText" TEXT NOT NULL,
  "language" TEXT NOT NULL DEFAULT 'BN',
  "tone" TEXT,
  "length" TEXT NOT NULL DEFAULT 'MEDIUM',
  "folderId" UUID,
  "isFavorite" BOOLEAN NOT NULL DEFAULT false,
  "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "generated_contents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE,
  CONSTRAINT "generated_contents_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL,
  CONSTRAINT "generated_contents_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL
);

CREATE INDEX "generated_contents_userId_createdAt_idx" ON "generated_contents"("userId", "createdAt");

ALTER TABLE "generations" ADD CONSTRAINT "generations_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE SET NULL;

-- brand_memories_ext
CREATE TABLE "brand_memories_ext" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" UUID NOT NULL UNIQUE,
  "data" JSONB NOT NULL,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "brand_memories_ext_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

-- templates
CREATE TABLE "templates" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "icon" TEXT NOT NULL DEFAULT 'FileText',
  "systemPrompt" TEXT NOT NULL,
  "inputSchema" JSONB NOT NULL DEFAULT '{}',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);

-- api_settings
CREATE TABLE "api_settings" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" UUID NOT NULL UNIQUE,
  "groqApiKeyEncrypted" TEXT,
  "modelPreference" TEXT NOT NULL DEFAULT 'llama-3.3-70b-versatile',
  "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
  "maxTokens" INTEGER NOT NULL DEFAULT 2048,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "api_settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

-- usage_logs
CREATE TABLE "usage_logs" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" UUID NOT NULL,
  "templateType" TEXT NOT NULL,
  "tokensUsed" INTEGER NOT NULL,
  "modelUsed" TEXT NOT NULL,
  "durationMs" INTEGER NOT NULL,
  "success" BOOLEAN NOT NULL DEFAULT true,
  "errorMessage" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "usage_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX "usage_logs_userId_createdAt_idx" ON "usage_logs"("userId", "createdAt");

-- sessions
CREATE TABLE "sessions" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "userId" UUID NOT NULL,
  "token" TEXT NOT NULL UNIQUE,
  "userAgent" TEXT,
  "ipAddress" TEXT,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- ============================================
-- SEED DATA
-- ============================================

-- Demo User (FashionBD)
INSERT INTO "users" ("id", "brandName", "whatsappNumber", "email", "passwordHash", "phone", "ownReferralCode", "role", "plan", "emailVerified", "updatedAt")
VALUES ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'FashionBD', '01800000000', 'demo@clicknshop.bd', '$2a$12$placeholder.hash.will.be.replaced', '+8801800000000', 'DEMO001', 'USER', 'PRO', true, CURRENT_TIMESTAMP);

-- Admin User
INSERT INTO "users" ("id", "brandName", "whatsappNumber", "email", "passwordHash", "phone", "ownReferralCode", "role", "plan", "emailVerified", "updatedAt")
VALUES ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'ClickNShop Admin', '01700000000', 'admin@clicknshop.bd', '$2a$12$placeholder.hash.will.be.replaced', '+8801700000000', 'ADMIN001', 'ADMIN', 'PRO', true, CURRENT_TIMESTAMP);

-- Brand Memory for Demo User
INSERT INTO "brand_memory" ("id", "userId", "brandName", "brandTone", "audiencePain", "winningCTA", "productOffers", "audienceProfile", "winningReferences", "objections", "primaryColor", "secondaryColor", "targetAudience", "description", "updatedAt")
VALUES ('c3d4e5f6-a7b8-9012-cdef-345678901234', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'FashionBD', 'Friendly, conversational, trustworthy', 'Customers confused by too many fashion choices and fake product claims', 'Message us for personal styling help', '["20% off Eid collection", "Free delivery in Dhaka", "7-day return policy"]', '{"age": "18-35", "gender": "female", "location": "Dhaka, Chittagong", "interests": ["fashion", "beauty", "lifestyle"]}', '[]', '["Too expensive", "Size issues", "Delivery delays"]', '#0b3d0b', '#22C55E', '18-35 year old women, Dhaka and Chittagong, fashion-conscious', 'FashionBD is Bangladeshs premium fashion brand. We deliver trendy, quality clothing at affordable prices.', CURRENT_TIMESTAMP);

-- Products (3 demo products) - BOTH createdAt AND updatedAt use CURRENT_TIMESTAMP
INSERT INTO "products" ("id", "userId", "name", "category", "weight", "shortDesc", "longDesc", "benefits", "price", "discountPrice", "seoKeywords", "images", "stockStatus", "sku", "createdAt", "updatedAt")
VALUES
  ('d4e5f6a7-b8c9-0123-def0-456789012345', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'প্রিমিয়াম সিল্ক শাড়ি', 'Fashion', '1.2 kg', 'বাংলাদেশি হাতের কাজ, প্রিমিয়াম কোয়ালিটি সিল্ক', 'আমাদের প্রিমিয়াম সিল্ক শাড়ি ১০০% খাঁটি সিল্ক দিয়ে তৈরি। বাংলাদেশি কারিগরদের হাতের কাজ।', ARRAY['১০০% খাঁটি সিল্ক', 'হাতের কাজের ডিজাইন', '৫ বছরের ওয়ারেন্টি', 'ফ্রি ডেলিভারি ঢাকায়'], 4500, 3800, ARRAY['silk saree', 'বাংলাদেশি শাড়ি', 'premium saree'], ARRAY['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'], 'IN_STOCK', 'SAR-001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('e5f6a7b8-c9d0-1234-ef01-567890123456', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'অর্গানিক হেয়ার অয়েল', 'Beauty', '200ml', 'নারকেল, তিল, আমলা — ১০০% প্রাকৃতিক উপাদান', 'আমাদের অর্গানিক হেয়ার অয়েল সম্পূর্ণ প্রাকৃতিক উপাদান দিয়ে তৈরি।', ARRAY['১০০% অর্গানিক', 'কেমিক্যাল মুক্ত', 'চুল পড়া কমায়'], 650, 550, ARRAY['organic hair oil', 'natural hair care'], ARRAY['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'], 'IN_STOCK', 'BEA-002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('f6a7b8c9-d0e1-2345-f012-678901234567', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'স্মার্ট ওয়াচ প্রো', 'Electronics', '50g', 'হার্ট রেট, SpO2, GPS, ৭ দিনের ব্যাটারি', 'স্মার্ট ওয়াচ প্রো সমস্ত আধুনিক ফিচার সহ। AMOLED ডিসপ্লে, ওয়াটার রেজিস্ট্যান্ট।', ARRAY['AMOLED Display', '৭ দিনের ব্যাটারি', 'GPS + SpO2', 'IP68'], 4500, 3999, ARRAY['smart watch', 'fitness watch'], ARRAY['https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600'], 'IN_STOCK', 'ELE-003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Frameworks (4 preset)
INSERT INTO "frameworks" ("id", "userId", "name", "type", "description", "content", "isPreset", "icon")
VALUES
  ('a7b8c9d0-e1f2-3456-0123-789012345678', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'PAS Framework', 'PAS', 'Problem → Agitation → Solution', '# PAS Framework\n- Problem: Highlight the pain your audience faces\n- Agitation: Twist the knife — describe consequences of ignoring it\n- Solution: Present the product as the calm, proven answer', true, 'Zap'),
  ('b8c9d0e1-f2a3-4567-1234-890123456789', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'AIDA Framework', 'AIDA', 'Attention → Interest → Desire → Action', '# AIDA Framework\n- Attention: Bold hook that stops scroll\n- Interest: Build curiosity with a twist\n- Desire: Show life after using the product\n- Action: Clear, single CTA', true, 'Target'),
  ('c9d0e1f2-a3b4-5678-2345-901234567890', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Hormozi Framework', 'HORMOZI', 'Value equation + bold claim + proof', '# Hormozi Framework\n- Value Equation: (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort & Sacrifice)\n- Proof: Show social proof, testimonials, before-after\n- Bold Claim + Justification', true, 'TrendingUp'),
  ('d0e1f2a3-b4c5-6789-3456-012345678901', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Storytelling', 'STORYTELLING', 'Hero → Struggle → Guide → Plan → Success', '# Storytelling Framework\n- Hero: The audience (relatable character)\n- Struggle: Their pain and challenge\n- Guide: The brand (mentor)\n- Plan: The actionable steps\n- Success: The transformation', true, 'BookOpen');

-- AI Templates (7 templates)
INSERT INTO "templates" ("id", "slug", "name", "description", "icon", "systemPrompt", "inputSchema", "isActive")
VALUES
  ('e1f2a3b4-c5d6-7890-4567-123456789012', 'FACEBOOK_POST', 'Facebook Post', 'Engaging Facebook post with hook, benefits, CTA, hashtags', 'Facebook', 'You are an expert Bangladeshi social media copywriter. Generate an engaging Facebook post based on the provided brand and product data.', '{"fields": ["productId", "language", "tone", "length"]}', true),
  ('f2a3b4c5-d6e7-8901-5678-234567890123', 'PRODUCT_DESCRIPTION', 'Product Description', 'E-commerce product description with bullet points', 'Package', 'You are a professional e-commerce product copywriter. Write a compelling product description.', '{"fields": ["productId", "language", "length"]}', true),
  ('a3b4c5d6-e7f8-9012-6789-345678901234', 'SEO_META', 'SEO Title & Meta', 'SEO-optimized title tags and meta descriptions', 'Search', 'You are an SEO expert. Generate SEO Title, Meta Description, and keywords.', '{"fields": ["productId", "language"]}', true),
  ('b4c5d6e7-f8a9-0123-7890-456789012345', 'OFFER_POST', 'Offer / Promotion', 'High-converting offer post with urgency', 'Tag', 'You are a promotional copywriter. Create offer post with bold headline, price, validity, CTA.', '{"fields": ["productId", "language"]}', true),
  ('c5d6e7f8-a9b0-1234-8901-567890123456', 'BANNER_TEXT', 'Banner Text', 'Short, punchy text for banners/ads', 'Image', 'You are a graphic design copywriter. Generate SHORT banner text.', '{"fields": ["productId"]}', true),
  ('d6e7f8a9-b0c1-2345-9012-678901234567', 'REEL_SCRIPT', 'Reel Script', '30-60 second viral short video script', 'Video', 'You are a viral short-video scriptwriter. Create 30-60 sec script with HOOK, PROBLEM, SOLUTION, BENEFITS, CTA.', '{"fields": ["productId", "language"]}', true),
  ('e7f8a9b0-c1d2-3456-0123-789012345678', 'IMAGE_PROMPT', 'Image Prompt', 'Detailed image prompts for Midjourney/DALL-E/Leonardo', 'Sparkles', 'You are a world-class AI image prompt engineer. Generate EXTREMELY DETAILED prompt.', '{"fields": ["productId", "imagePurpose", "imageStyle", "imageMood", "imageAspect", "imageElements"]}', true);

SELECT '✅ Database initialization complete!' as status;
