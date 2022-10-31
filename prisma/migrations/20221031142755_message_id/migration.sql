/*
  Warnings:

  - The required column `messageId` was added to the `Messages` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_id_fkey";

-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "messageId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Chatrooms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
