/*
 Warnings:
 
 - You are about to drop the column `dueDate` on the `Events` table. All the data in the column will be lost.
 - You are about to drop the column `subscriptionsScheduledDate` on the `Events` table. All the data in the column will be lost.
 - Added the required column `subscriptionsDueDate` to the `Events` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "dueDate",
  DROP COLUMN "subscriptionsScheduledDate",
  ADD COLUMN "subscriptionsDueDate" TIMESTAMP(3) NOT NULL,
  ADD COLUMN "subscriptionsScheduledTo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;