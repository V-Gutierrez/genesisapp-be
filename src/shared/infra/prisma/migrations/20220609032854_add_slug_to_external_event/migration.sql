/*
 Warnings:
 
 - Added the required column `slug` to the `ExternalEvent` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "ExternalEvent"
ADD COLUMN "slug" TEXT NOT NULL;