/*
  Warnings:

  - Added the required column `slug` to the `Devotional` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Devotional" ADD COLUMN     "slug" TEXT NOT NULL;
