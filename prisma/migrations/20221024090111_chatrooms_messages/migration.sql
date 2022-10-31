-- AlterTable
ALTER TABLE "User" ALTER COLUMN "chatrooms" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Chatrooms" (
    "id" TEXT NOT NULL,
    "participants" TEXT[],
    "messages" TEXT[],

    CONSTRAINT "Chatrooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Messages" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Messages_pkey" PRIMARY KEY ("id")
);
