/*
  Warnings:

  - Added the required column `reportType` to the `Reports` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reports" ADD COLUMN     "reportType" TEXT NOT NULL;
