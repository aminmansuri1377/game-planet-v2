-- AlterTable
ALTER TABLE "Buyer" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Buyer_id_seq";

-- AlterTable
ALTER TABLE "Manager" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Manager_id_seq";

-- AlterTable
ALTER TABLE "Seller" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "Seller_id_seq";
