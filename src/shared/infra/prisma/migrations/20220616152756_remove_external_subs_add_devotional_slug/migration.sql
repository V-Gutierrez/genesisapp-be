/*
 Warnings:
 
 - You are about to drop the `ExternalEvent` table. If the table is not empty, all the data it contains will be lost.
 - You are about to drop the `ExternalSubscriptions` table. If the table is not empty, all the data it contains will be lost.
 - A unique constraint covering the columns `[slug]` on the table `Devotional` will be added. If there are existing duplicate values, this will fail.
 
 */
-- DropForeignKey
ALTER TABLE "ExternalSubscriptions" DROP CONSTRAINT "ExternalSubscriptions_externalEventId_fkey";
-- DropTable
DROP TABLE "ExternalEvent";
-- DropTable
DROP TABLE "ExternalSubscriptions";
-- CreateIndex
CREATE UNIQUE INDEX "Devotional_slug_key" ON "Devotional"("slug");