-- Add new columns
ALTER TABLE "Provider" ADD COLUMN IF NOT EXISTS "serviceCities" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Provider" ADD COLUMN IF NOT EXISTS "isNationwide" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Provider" ADD COLUMN IF NOT EXISTS "phone" TEXT;
ALTER TABLE "Provider" ADD COLUMN IF NOT EXISTS "email" TEXT;
ALTER TABLE "Provider" ADD COLUMN IF NOT EXISTS "website" TEXT;

-- Copy old contact fields to new columns (before dropping)
UPDATE "Provider" SET "email" = "contactEmail" WHERE "contactEmail" IS NOT NULL;
UPDATE "Provider" SET "phone" = "contactPhone" WHERE "contactPhone" IS NOT NULL;

-- Populate serviceCities with locationCity for existing rows
UPDATE "Provider" SET "serviceCities" = ARRAY["locationCity"]::TEXT[] WHERE "serviceCities" = ARRAY[]::TEXT[] OR "serviceCities" IS NULL;

-- Convert category from enum to TEXT (PostgreSQL keeps enum value as text)
ALTER TABLE "Provider" ALTER COLUMN "category" TYPE TEXT USING "category"::TEXT;

-- Map old enum value 'decor' to new slug 'decoration'
UPDATE "Provider" SET "category" = 'decoration' WHERE "category" = 'decor';

-- Drop old columns
ALTER TABLE "Provider" DROP COLUMN IF EXISTS "locationRegion";
ALTER TABLE "Provider" DROP COLUMN IF EXISTS "priceFrom";
ALTER TABLE "Provider" DROP COLUMN IF EXISTS "priceTo";
ALTER TABLE "Provider" DROP COLUMN IF EXISTS "tags";
ALTER TABLE "Provider" DROP COLUMN IF EXISTS "isFeatured";
ALTER TABLE "Provider" DROP COLUMN IF EXISTS "isPremium";
ALTER TABLE "Provider" DROP COLUMN IF EXISTS "contactEmail";
ALTER TABLE "Provider" DROP COLUMN IF EXISTS "contactPhone";
ALTER TABLE "Provider" DROP COLUMN IF EXISTS "updatedAt";

-- Drop the Category enum (no longer referenced)
DROP TYPE IF EXISTS "Category";
