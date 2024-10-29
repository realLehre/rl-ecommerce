/*
  Warnings:

  - A unique constraint covering the columns `[cartItemId]` on the table `ProductRating` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cartItemId` to the `ProductRating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ProductRating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductRating" ADD COLUMN     "cartItemId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductRating_cartItemId_key" ON "ProductRating"("cartItemId");

-- CreateIndex
CREATE INDEX "ProductRating_productId_idx" ON "ProductRating"("productId");

-- CreateIndex
CREATE INDEX "ProductRating_cartItemId_idx" ON "ProductRating"("cartItemId");

-- CreateIndex
CREATE INDEX "ProductRating_userId_idx" ON "ProductRating"("userId");

-- AddForeignKey
ALTER TABLE "ProductRating" ADD CONSTRAINT "ProductRating_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES "CartItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
