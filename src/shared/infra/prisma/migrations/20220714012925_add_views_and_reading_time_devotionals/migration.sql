/*
 Warnings:
 
 - You are about to drop the `Event` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
 
 */
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_eventId_fkey";
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";
-- AlterTable
ALTER TABLE "Devotional"
ADD COLUMN "likes" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "readingTimeInMinutes" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "views" INTEGER NOT NULL DEFAULT 0;
-- AlterTable
ALTER TABLE "User"
ADD COLUMN "devotionalId" TEXT;
-- DropTable
DROP TABLE "Event";
-- DropTable
DROP TABLE "Subscription";