-- CreateTable
CREATE TABLE "GrowthGroup" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "name" TEXT NOT NULL,
    "leadership" TEXT[],

    CONSTRAINT "GrowthGroup_pkey" PRIMARY KEY ("id")
);
