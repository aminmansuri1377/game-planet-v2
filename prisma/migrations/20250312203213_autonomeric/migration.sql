-- AlterTable
CREATE SEQUENCE buyer_id_seq;
ALTER TABLE "Buyer" ALTER COLUMN "id" SET DEFAULT nextval('buyer_id_seq');
ALTER SEQUENCE buyer_id_seq OWNED BY "Buyer"."id";

-- AlterTable
CREATE SEQUENCE manager_id_seq;
ALTER TABLE "Manager" ALTER COLUMN "id" SET DEFAULT nextval('manager_id_seq');
ALTER SEQUENCE manager_id_seq OWNED BY "Manager"."id";

-- AlterTable
CREATE SEQUENCE seller_id_seq;
ALTER TABLE "Seller" ALTER COLUMN "id" SET DEFAULT nextval('seller_id_seq');
ALTER SEQUENCE seller_id_seq OWNED BY "Seller"."id";
