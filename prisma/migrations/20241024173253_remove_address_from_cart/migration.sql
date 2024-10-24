/*
  Warnings:

  - You are about to drop the column `shippingAddressId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `subtTotal` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `subTotal` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_shippingAddressId_fkey";

-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "shippingAddressId",
DROP COLUMN "subtTotal",
ADD COLUMN     "subTotal" INTEGER NOT NULL;
