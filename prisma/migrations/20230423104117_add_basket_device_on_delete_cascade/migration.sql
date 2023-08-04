-- DropForeignKey
ALTER TABLE "Basket_Device" DROP CONSTRAINT "Basket_Device_goodId_fkey";

-- AddForeignKey
ALTER TABLE "Basket_Device" ADD CONSTRAINT "Basket_Device_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "Good"("id") ON DELETE SET NULL ON UPDATE CASCADE;
