-- CreateEnum
CREATE TYPE "InquiryStatus" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "city" TEXT NOT NULL DEFAULT 'Mumbai',
    "hub" TEXT NOT NULL,
    "categories" TEXT[],
    "hourlyRate" INTEGER NOT NULL,
    "dailyRate" INTEGER,
    "galleryUrls" TEXT[],
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "available" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "preferredAt" TIMESTAMP(3) NOT NULL,
    "selectedLocation" TEXT NOT NULL,
    "message" VARCHAR(1000),
    "status" "InquiryStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Inquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Profile_slug_key" ON "Profile"("slug");

-- CreateIndex
CREATE INDEX "Profile_active_hub_idx" ON "Profile"("active", "hub");

-- CreateIndex
CREATE INDEX "Profile_active_hourlyRate_idx" ON "Profile"("active", "hourlyRate");

-- CreateIndex
CREATE INDEX "Inquiry_profileId_createdAt_idx" ON "Inquiry"("profileId", "createdAt");

-- CreateIndex
CREATE INDEX "Inquiry_status_createdAt_idx" ON "Inquiry"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "Inquiry" ADD CONSTRAINT "Inquiry_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
