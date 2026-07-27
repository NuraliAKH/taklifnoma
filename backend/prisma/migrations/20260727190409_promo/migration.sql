-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "discount_amount" DECIMAL(10,2),
ADD COLUMN     "original_price" DECIMAL(10,2),
ADD COLUMN     "promocode_id" INTEGER;

-- CreateTable
CREATE TABLE "promocodes" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "discount_type" VARCHAR(20) NOT NULL DEFAULT 'percentage',
    "discount_value" DECIMAL(10,2) NOT NULL,
    "min_order_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "max_uses" INTEGER NOT NULL DEFAULT 100,
    "uses_count" INTEGER NOT NULL DEFAULT 0,
    "valid_from" TIMESTAMP(6),
    "valid_until" TIMESTAMP(6),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "partner_name" VARCHAR(150),
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "promocodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "promocodes_code_key" ON "promocodes"("code");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_promocode_id_fkey" FOREIGN KEY ("promocode_id") REFERENCES "promocodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
