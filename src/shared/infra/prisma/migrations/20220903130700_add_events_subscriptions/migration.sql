-- CreateTable
CREATE TABLE "Events" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL,
    "coverThumbnail" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "vacancies" INTEGER NOT NULL,
    "scheduledTo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "EventsSubscriptions" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userPhone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "EventsSubscriptions_pkey" PRIMARY KEY ("id")
);
-- AddForeignKey
ALTER TABLE "EventsSubscriptions"
ADD CONSTRAINT "EventsSubscriptions_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;