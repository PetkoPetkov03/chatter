-- DropForeignKey
ALTER TABLE "Posts" DROP CONSTRAINT "Posts_id_fkey";

-- AddForeignKey
ALTER TABLE "Posts" ADD CONSTRAINT "Posts_title_fkey" FOREIGN KEY ("title") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
