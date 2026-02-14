-- CreateEnum
CREATE TYPE "Category" AS ENUM ('music', 'photo_video', 'decor');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('new', 'replied', 'closed');

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "subcategory" TEXT NOT NULL,
    "locationCity" TEXT NOT NULL,
    "locationRegion" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "priceFrom" INTEGER,
    "priceTo" INTEGER,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "galleryImages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "videoLinks" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerEmail" TEXT,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "eventCity" TEXT NOT NULL,
    "budget" INTEGER,
    "message" TEXT NOT NULL,
    "status" "LeadStatus" NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_providerId_idx" ON "Lead"("providerId");

-- CreateIndex
CREATE INDEX "Lead_createdAt_idx" ON "Lead"("createdAt");

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
