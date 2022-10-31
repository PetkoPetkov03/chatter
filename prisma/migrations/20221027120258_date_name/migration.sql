/*
  Warnings:

  - Added the required column `name` to the `Chatrooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chatrooms" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "name" TEXT NOT NULL;
