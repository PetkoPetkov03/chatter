/*
  Warnings:

  - Added the required column `durations` to the `Restrictions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restrictions" ADD COLUMN     "durations" TIMESTAMP(3) NOT NULL;
