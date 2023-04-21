-- AlterTable
ALTER TABLE "Devotional"
ADD COLUMN "coverImage" TEXT NOT NULL DEFAULT E'coverImage',
  ADD COLUMN "coverThumbnail" TEXT NOT NULL DEFAULT E'coverImageThumbnail',
  ALTER COLUMN "author" DROP DEFAULT;