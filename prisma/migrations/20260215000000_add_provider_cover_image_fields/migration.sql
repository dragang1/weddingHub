-- AlterTable
ALTER TABLE "Provider" ADD COLUMN IF NOT EXISTS "coverImageUrl" TEXT,
ADD COLUMN IF NOT EXISTS "coverImageSource" TEXT,
ADD COLUMN IF NOT EXISTS "coverImageAttribution" TEXT;
