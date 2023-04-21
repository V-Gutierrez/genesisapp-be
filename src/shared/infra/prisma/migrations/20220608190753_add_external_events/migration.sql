-- CreateTable
CREATE TABLE "ExternalEvent" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "scheduledTo" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "addressInfo" TEXT NOT NULL,
    "maxSubscriptions" INTEGER NOT NULL,
    CONSTRAINT "ExternalEvent_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "ExternalSubscriptions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "externalEventId" TEXT,
    CONSTRAINT "ExternalSubscriptions_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "ExternalSubscriptions_email_key" ON "ExternalSubscriptions"("email");
-- CreateIndex
CREATE UNIQUE INDEX "ExternalSubscriptions_phone_key" ON "ExternalSubscriptions"("phone");
-- AddForeignKey
ALTER TABLE "ExternalSubscriptions"
ADD CONSTRAINT "ExternalSubscriptions_externalEventId_fkey" FOREIGN KEY ("externalEventId") REFERENCES "ExternalEvent"("id") ON DELETE
SET NULL ON UPDATE CASCADE;