-- CreateTable
CREATE TABLE "GalleryLikes" (
    "galleryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GalleryLikes_pkey" PRIMARY KEY ("userId","galleryId")
);

-- CreateTable
CREATE TABLE "GalleryViews" (
    "galleryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GalleryViews_pkey" PRIMARY KEY ("userId","galleryId")
);

-- AddForeignKey
ALTER TABLE "GalleryLikes" ADD CONSTRAINT "GalleryLikes_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryLikes" ADD CONSTRAINT "GalleryLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryViews" ADD CONSTRAINT "GalleryViews_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GalleryViews" ADD CONSTRAINT "GalleryViews_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
