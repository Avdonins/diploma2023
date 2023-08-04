/*
  Warnings:

  - You are about to drop the column `date` on the `Old_Price` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Old_Price` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Old_Price" DROP CONSTRAINT "Old_Price_goodId_fkey";

-- AlterTable
ALTER TABLE "Old_Price" DROP COLUMN "date",
DROP COLUMN "price";

-- CreateTable
CREATE TABLE "Prices_Dates" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oldPriceId" INTEGER NOT NULL,

    CONSTRAINT "Prices_Dates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Old_Price" ADD CONSTRAINT "Old_Price_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "Good"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prices_Dates" ADD CONSTRAINT "Prices_Dates_oldPriceId_fkey" FOREIGN KEY ("oldPriceId") REFERENCES "Old_Price"("id") ON DELETE CASCADE ON UPDATE CASCADE;
