/*
  Warnings:

  - You are about to drop the column `quantity` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `sku` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `tracking_number` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `carton_size` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `wholesale_price` on the `products` table. All the data in the column will be lost.
  - Added the required column `user_email` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wholesale_price_bank_wire` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wholesale_price_paypal` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `quantity`,
    DROP COLUMN `sku`,
    DROP COLUMN `tracking_number`,
    DROP COLUMN `user_id`,
    ADD COLUMN `shipment_date` DATETIME(3) NULL,
    ADD COLUMN `user_email` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `carton_size`,
    DROP COLUMN `wholesale_price`,
    ADD COLUMN `quantity_per_carton` INTEGER NULL,
    ADD COLUMN `wholesale_price_bank_wire` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `wholesale_price_paypal` DECIMAL(10, 2) NOT NULL;

-- CreateTable
CREATE TABLE `order_lines` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `order_id` INTEGER NOT NULL,
    `sku` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `tracking_number` VARCHAR(191) NULL,
    `shipped_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order_lines` ADD CONSTRAINT `order_lines_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
