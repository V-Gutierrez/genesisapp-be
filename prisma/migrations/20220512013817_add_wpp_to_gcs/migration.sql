/*
  Warnings:

  - Added the required column `whatsappLink` to the `GrowthGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GrowthGroup" ADD COLUMN     "whatsappLink" TEXT NOT NULL;
