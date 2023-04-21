/*
  Warnings:

  - Made the column `userId` on table `Devotional` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Devotional" DROP CONSTRAINT "Devotional_userId_fkey";

-- AlterTable
ALTER TABLE "Devotional" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Devotional" ADD CONSTRAINT "Devotional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
