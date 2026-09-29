-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'main',
    "heroImageUrl" TEXT,
    "heroImageAlt" TEXT NOT NULL DEFAULT 'Mumbai profile directory preview',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);
