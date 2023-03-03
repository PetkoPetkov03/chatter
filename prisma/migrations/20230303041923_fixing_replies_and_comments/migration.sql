/*
  Warnings:

  - You are about to drop the column `userId` on the `Posts` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `postId` to the `Comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `authorId` to the `Replies` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_id_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "author";

-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_userId_fkey";

-- DropForeignKey
ALTER TABLE "Replies" DROP CONSTRAINT "Replies_id_fkey";

-- DropForeignKey
ALTER TABLE "Replies" DROP CONSTRAINT "comment";

-- AlterTable
ALTER TABLE "Comments" ADD COLUMN     "authorId" TEXT NOT NULL,
ADD COLUMN     "postId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Posts" DROP COLUMN "userId",
ADD COLUMN     "authorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Replies" ADD COLUMN     "authorId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "author" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Replies" ADD CONSTRAINT "Replies_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Replies" ADD CONSTRAINT "comment" FOREIGN KEY ("id") REFERENCES "Comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
