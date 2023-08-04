/*
  Warnings:

  - Added the required column `category` to the `Good` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Good" ADD COLUMN     "category" TEXT NOT NULL;
