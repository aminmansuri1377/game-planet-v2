/*
  Warnings:

  - The `idCardImage` column on the `Buyer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `idCardImage` column on the `Seller` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Buyer" DROP COLUMN "idCardImage",
ADD COLUMN     "idCardImage" JSONB;

-- AlterTable
ALTER TABLE "Seller" DROP COLUMN "idCardImage",
ADD COLUMN     "idCardImage" JSONB;
