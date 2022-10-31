/*
  Warnings:

  - You are about to drop the column `messages` on the `Chatrooms` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chatrooms" DROP COLUMN "messages";

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_id_fkey" FOREIGN KEY ("id") REFERENCES "Chatrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
