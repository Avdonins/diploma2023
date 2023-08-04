/*
  Warnings:

  - Added the required column `shop` to the `Good` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Good" ADD COLUMN     "isDel" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "shop" TEXT NOT NULL;
