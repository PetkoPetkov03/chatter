-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_messageId_fkey";

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Chatrooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;
