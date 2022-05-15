/*
  Warnings:

  - The primary key for the `GrowthGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "GrowthGroup" DROP CONSTRAINT "GrowthGroup_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "name" DROP DEFAULT,
ADD CONSTRAINT "GrowthGroup_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "GrowthGroup_id_seq";
