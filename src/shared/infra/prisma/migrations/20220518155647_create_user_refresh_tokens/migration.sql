/*
 Warnings:
 
 - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
 
 */
-- AlterTable
ALTER TABLE "User" DROP COLUMN "refreshToken";
-- CreateTable
CREATE TABLE "UserRefreshTokens" (
  "id" TEXT NOT NULL,
  "token" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT NOT NULL,
  CONSTRAINT "UserRefreshTokens_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "UserRefreshTokens_userId_key" ON "UserRefreshTokens"("userId");
-- AddForeignKey
ALTER TABLE "UserRefreshTokens"
ADD CONSTRAINT "UserRefreshTokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;