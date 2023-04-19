/*
  Warnings:

  - You are about to drop the column `vacancies` on the `Events` table. All the data in the column will be lost.
  - Added the required column `description` to the `Events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxSlots` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Events" DROP COLUMN "vacancies",
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "maxSlots" INTEGER NOT NULL;
