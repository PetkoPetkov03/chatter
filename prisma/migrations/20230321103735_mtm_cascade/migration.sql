-- DropForeignKey
ALTER TABLE "PostsDislikes" DROP CONSTRAINT "PostsDislikes_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostsDislikes" DROP CONSTRAINT "PostsDislikes_userId_fkey";

-- DropForeignKey
ALTER TABLE "PostsLikes" DROP CONSTRAINT "PostsLikes_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostsLikes" DROP CONSTRAINT "PostsLikes_userId_fkey";

-- AddForeignKey
ALTER TABLE "PostsLikes" ADD CONSTRAINT "PostsLikes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsLikes" ADD CONSTRAINT "PostsLikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsDislikes" ADD CONSTRAINT "PostsDislikes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostsDislikes" ADD CONSTRAINT "PostsDislikes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
