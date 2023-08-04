-- DropForeignKey
ALTER TABLE "Basket_Device" DROP CONSTRAINT "Basket_Device_goodId_fkey";

-- AlterTable
ALTER TABLE "Basket_Device" ALTER COLUMN "count" DROP NOT NULL,
ALTER COLUMN "goodId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Basket_Device" ADD CONSTRAINT "Basket_Device_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "Good"("id") ON DELETE CASCADE ON UPDATE CASCADE;
