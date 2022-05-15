-- AlterTable
ALTER TABLE "GrowthGroup" ADD COLUMN     "addressInfo" TEXT NOT NULL DEFAULT E'Pending',
ADD COLUMN     "scheduledTime" TEXT NOT NULL DEFAULT E'Pending',
ADD COLUMN     "weekDay" TEXT NOT NULL DEFAULT E'Pending',
ALTER COLUMN "name" SET DEFAULT E'Pending';
