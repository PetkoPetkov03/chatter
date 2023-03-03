/*
  Warnings:

  - You are about to drop the `Comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Replies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_id_fkey";

-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "author";

-- DropForeignKey
ALTER TABLE "Replies" DROP CONSTRAINT "Replies_id_fkey";

-- DropForeignKey
ALTER TABLE "Replies" DROP CONSTRAINT "comment";

-- DropTable
DROP TABLE "Comments";

-- DropTable
DROP TABLE "Replies";
