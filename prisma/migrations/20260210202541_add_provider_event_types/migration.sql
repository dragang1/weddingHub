-- AlterTable
ALTER TABLE "Provider" ADD COLUMN     "eventTypes" TEXT[] DEFAULT ARRAY['wedding']::TEXT[];
