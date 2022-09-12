-- CreateEnum
CREATE TYPE "Region" AS ENUM ('FEC', 'AEP');

-- AlterTable
ALTER TABLE "Devotional" ADD COLUMN     "region" "Region" NOT NULL DEFAULT 'AEP';

-- AlterTable
ALTER TABLE "Events" ADD COLUMN     "region" "Region" NOT NULL DEFAULT 'AEP';

-- AlterTable
ALTER TABLE "GrowthGroup" ADD COLUMN     "region" "Region" NOT NULL DEFAULT 'AEP';

-- AlterTable
ALTER TABLE "News" ADD COLUMN     "region" "Region" NOT NULL DEFAULT 'AEP';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "region" "Region" NOT NULL DEFAULT 'AEP';
