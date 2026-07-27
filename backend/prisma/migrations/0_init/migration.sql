CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "password_hash" VARCHAR(255),
    "role" VARCHAR(50) NOT NULL DEFAULT 'user',
    "google_id" VARCHAR(255),
    "name" VARCHAR(150),
    "avatar" VARCHAR(255),

    CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "media_url" VARCHAR(255) NOT NULL,
    "text_config" JSONB NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "discount_price" DECIMAL(10,2),

    CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "user_data" JSONB NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "final_asset_url" VARCHAR(255),
    "total_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "templateId" INTEGER,
    "userId" INTEGER,

    CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_transactions" (
    "id" SERIAL NOT NULL,
    "click_trans_id" BIGINT NOT NULL,
    "service_id" INTEGER NOT NULL,
    "click_paydoc_id" BIGINT,
    "merchant_trans_id" UUID NOT NULL,
    "merchant_prepare_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "action" INTEGER NOT NULL,
    "error" INTEGER NOT NULL DEFAULT 0,
    "error_note" VARCHAR(255),
    "status" VARCHAR(50) NOT NULL DEFAULT 'prepared',
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UQ_97672ac88f789774dd47f7c8be3" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transactions_click_trans_id_key" ON "payment_transactions"("click_trans_id");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "templates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_merchant_trans_id_fkey" FOREIGN KEY ("merchant_trans_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

