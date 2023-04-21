-- CreateTable
CREATE TABLE "Devotional" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    CONSTRAINT "Devotional_pkey" PRIMARY KEY ("id")
);