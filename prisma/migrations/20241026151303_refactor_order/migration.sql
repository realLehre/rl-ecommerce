/*
  Warnings:

  - You are about to drop the column `cartId` on the `Order` table. All the data in the column will be lost.
  - Added the required column `cartOrder` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_cartId_fkey";

-- DropIndex
DROP INDEX "Order_cartId_key";

-- AlterTable
ALTER TABLE "Cart" ADD COLUMN     "orderId" TEXT;

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "cartId",
ADD COLUMN     "cartOrder" JSONB NOT NULL;
