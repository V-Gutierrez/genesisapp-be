-- CreateTable
CREATE TABLE "News" (
    "id" TEXT NOT NULL,
    "scheduledTo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "coverThumbnail" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "News_slug_key" ON "News"("slug");