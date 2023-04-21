/*
 Warnings:
 
 - You are about to drop the column `author` on the `Devotional` table. All the data in the column will be lost.
 
 */
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
-- AlterTable
ALTER TABLE "Devotional" DROP COLUMN "author",
  ADD COLUMN "userId" TEXT;
-- CreateTable
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "role" "Role" NOT NULL DEFAULT E'USER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
-- AddForeignKey
ALTER TABLE "Devotional"
ADD CONSTRAINT "Devotional_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE
SET NULL ON UPDATE CASCADE;