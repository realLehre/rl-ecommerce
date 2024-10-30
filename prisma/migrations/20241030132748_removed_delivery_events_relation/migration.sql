/*
  Warnings:

  - You are about to drop the column `orderId` on the `DeliveryEvent` table. All the data in the column will be lost.
  - Added the required column `deliveryEvents` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DeliveryEvent" DROP CONSTRAINT "DeliveryEvent_orderId_fkey";

-- DropIndex
DROP INDEX "DeliveryEvent_orderId_idx";

-- AlterTable
ALTER TABLE "DeliveryEvent" DROP COLUMN "orderId";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "deliveryEvents" JSONB NOT NULL;
