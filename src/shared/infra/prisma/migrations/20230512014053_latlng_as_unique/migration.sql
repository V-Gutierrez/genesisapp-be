/*
  Warnings:

  - A unique constraint covering the columns `[lat]` on the table `GrowthGroup` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[lng]` on the table `GrowthGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "Gallery" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "coverThumbnail" TEXT NOT NULL,
    "googlePhotosAlbumUrl" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "region" "Region" NOT NULL DEFAULT 'AEP',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gallery_googlePhotosAlbumUrl_key" ON "Gallery"("googlePhotosAlbumUrl");

-- CreateIndex
CREATE UNIQUE INDEX "GrowthGroup_lat_key" ON "GrowthGroup"("lat");

-- CreateIndex
CREATE UNIQUE INDEX "GrowthGroup_lng_key" ON "GrowthGroup"("lng");
