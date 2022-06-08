/*
  Warnings:

  - Added the required column `assetId` to the `ExternalEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverImage` to the `ExternalEvent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverThumbnail` to the `ExternalEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExternalEvent" ADD COLUMN     "assetId" TEXT NOT NULL,
ADD COLUMN     "coverImage" TEXT NOT NULL,
ADD COLUMN     "coverThumbnail" TEXT NOT NULL;
