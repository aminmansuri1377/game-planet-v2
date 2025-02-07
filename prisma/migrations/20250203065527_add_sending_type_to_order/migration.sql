/*
  Warnings:

  - Added the required column `sendingType` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SendingType" AS ENUM ('SELLER_SENDS', 'BUYER_PICKS_UP');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "sendingType" "SendingType" NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "inventory" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sendingType" "SendingType"[];
