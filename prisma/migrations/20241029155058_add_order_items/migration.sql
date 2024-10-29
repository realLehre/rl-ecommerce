/*
  Warnings:

  - You are about to drop the column `cartId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `cartItemId` on the `ProductRating` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderItemId]` on the table `ProductRating` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `orderItemId` to the `ProductRating` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_cartId_fkey";

-- DropForeignKey
ALTER TABLE "ProductRating" DROP CONSTRAINT "ProductRating_cartItemId_fkey";

-- DropIndex
DROP INDEX "ProductRating_cartItemId_idx";

-- DropIndex
DROP INDEX "ProductRating_cartItemId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "cartId";

-- AlterTable
ALTER TABLE "ProductRating" DROP COLUMN "cartItemId",
ADD COLUMN     "orderItemId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "unit" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductRating_orderItemId_key" ON "ProductRating"("orderItemId");

-- CreateIndex
CREATE INDEX "ProductRating_orderItemId_idx" ON "ProductRating"("orderItemId");

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductRating" ADD CONSTRAINT "ProductRating_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
