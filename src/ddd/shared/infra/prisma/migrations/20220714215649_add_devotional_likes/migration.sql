-- CreateTable
CREATE TABLE "DevotionalLikes" (
    "devotionalId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "DevotionalLikes_pkey" PRIMARY KEY ("userId","devotionalId")
);

-- AddForeignKey
ALTER TABLE "DevotionalLikes" ADD CONSTRAINT "DevotionalLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DevotionalLikes" ADD CONSTRAINT "DevotionalLikes_devotionalId_fkey" FOREIGN KEY ("devotionalId") REFERENCES "Devotional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
