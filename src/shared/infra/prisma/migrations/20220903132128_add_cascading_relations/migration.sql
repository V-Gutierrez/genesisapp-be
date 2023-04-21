/*
 Warnings:
 
 - You are about to drop the column `devotionalId` on the `User` table. All the data in the column will be lost.
 
 */
-- DropForeignKey
ALTER TABLE "DevotionalLikes" DROP CONSTRAINT "DevotionalLikes_devotionalId_fkey";
-- DropForeignKey
ALTER TABLE "DevotionalLikes" DROP CONSTRAINT "DevotionalLikes_userId_fkey";
-- DropForeignKey
ALTER TABLE "DevotionalViews" DROP CONSTRAINT "DevotionalViews_devotionalId_fkey";
-- DropForeignKey
ALTER TABLE "DevotionalViews" DROP CONSTRAINT "DevotionalViews_userId_fkey";
-- DropForeignKey
ALTER TABLE "EventsSubscriptions" DROP CONSTRAINT "EventsSubscriptions_eventId_fkey";
-- DropForeignKey
ALTER TABLE "NewsLikes" DROP CONSTRAINT "NewsLikes_newsId_fkey";
-- DropForeignKey
ALTER TABLE "NewsLikes" DROP CONSTRAINT "NewsLikes_userId_fkey";
-- DropForeignKey
ALTER TABLE "NewsViews" DROP CONSTRAINT "NewsViews_newsId_fkey";
-- DropForeignKey
ALTER TABLE "NewsViews" DROP CONSTRAINT "NewsViews_userId_fkey";
-- DropForeignKey
ALTER TABLE "UserRefreshTokens" DROP CONSTRAINT "UserRefreshTokens_userId_fkey";
-- AlterTable
ALTER TABLE "User" DROP COLUMN "devotionalId";
-- AddForeignKey
ALTER TABLE "UserRefreshTokens"
ADD CONSTRAINT "UserRefreshTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "DevotionalLikes"
ADD CONSTRAINT "DevotionalLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "DevotionalLikes"
ADD CONSTRAINT "DevotionalLikes_devotionalId_fkey" FOREIGN KEY ("devotionalId") REFERENCES "Devotional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "DevotionalViews"
ADD CONSTRAINT "DevotionalViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "DevotionalViews"
ADD CONSTRAINT "DevotionalViews_devotionalId_fkey" FOREIGN KEY ("devotionalId") REFERENCES "Devotional"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "NewsLikes"
ADD CONSTRAINT "NewsLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "NewsLikes"
ADD CONSTRAINT "NewsLikes_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "NewsViews"
ADD CONSTRAINT "NewsViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "NewsViews"
ADD CONSTRAINT "NewsViews_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "EventsSubscriptions"
ADD CONSTRAINT "EventsSubscriptions_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("id") ON DELETE CASCADE ON UPDATE CASCADE;