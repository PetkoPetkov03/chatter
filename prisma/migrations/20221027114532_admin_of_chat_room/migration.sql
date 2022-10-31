/*
  Warnings:

  - Added the required column `adminId` to the `Chatrooms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chatrooms" ADD COLUMN     "adminId" TEXT NOT NULL;
