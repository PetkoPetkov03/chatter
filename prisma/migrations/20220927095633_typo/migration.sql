/*
  Warnings:

  - You are about to drop the column `durations` on the `Restrictions` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Restrictions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restrictions" DROP COLUMN "durations",
ADD COLUMN     "duration" TIMESTAMP(3) NOT NULL;
