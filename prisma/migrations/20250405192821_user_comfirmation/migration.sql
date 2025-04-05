-- AlterTable
ALTER TABLE "Buyer" ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Seller" ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false;
