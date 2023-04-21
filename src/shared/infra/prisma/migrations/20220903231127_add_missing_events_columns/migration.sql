/*
 Warnings:
 
 - You are about to drop the column `scheduledTo` on the `Events` table. All the data in the column will be lost.
 - Added the required column `dueDate` to the `Events` table without a default value. This is not possible if the table is not empty.
 - Added the required column `eventDate` to the `Events` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "scheduledTo",
  ADD COLUMN "dueDate" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "eventDate" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "subscriptionsScheduledDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;