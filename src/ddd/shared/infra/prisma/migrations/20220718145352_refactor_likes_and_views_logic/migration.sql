/*
  Warnings:

  - You are about to drop the column `likes` on the `Devotional` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `Devotional` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Devotional" DROP COLUMN "likes",
DROP COLUMN "views";

-- CreateTable
CREATE TABLE "DevotionalViews" (
    "devotionalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DevotionalViews_pkey" PRIMARY KEY ("userId","devotionalId")
);

-- CreateTable
CREATE TABLE "NewsLikes" (
    "newsId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "NewsLikes_pkey" PRIMARY KEY ("userId","newsId")
);

-- CreateTable
CREATE TABLE "NewsViews" (
    "newsId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "NewsViews_pkey" PRIMARY KEY ("userId","newsId")
);

-- AddForeignKey
ALTER TABLE "DevotionalViews" ADD CONSTRAINT "DevotionalViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevotionalViews" ADD CONSTRAINT "DevotionalViews_devotionalId_fkey" FOREIGN KEY ("devotionalId") REFERENCES "Devotional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsLikes" ADD CONSTRAINT "NewsLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsLikes" ADD CONSTRAINT "NewsLikes_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsViews" ADD CONSTRAINT "NewsViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewsViews" ADD CONSTRAINT "NewsViews_newsId_fkey" FOREIGN KEY ("newsId") REFERENCES "News"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
