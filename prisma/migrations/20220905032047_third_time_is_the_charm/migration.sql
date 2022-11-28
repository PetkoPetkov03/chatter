-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "admin" BOOLEAN NOT NULL DEFAULT false,
    "friends" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "chatrooms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "friendRequests" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
