/*
  Warnings:

  - You are about to drop the column `roles` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the `Transcations` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[student_id]` on the table `IDcard` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[student_id]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Transcations` DROP FOREIGN KEY `Transcations_wallet_id_fkey`;

-- AlterTable
ALTER TABLE `Admin` DROP COLUMN `roles`,
    ADD COLUMN `role` ENUM('SUPER_ADMIN', 'INSTITUTION_ADMIN') NOT NULL;

-- AlterTable
ALTER TABLE `IDcard` ADD COLUMN `transaction_limit` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `POS` MODIFY `amount_to_withdraw` VARCHAR(191) NULL DEFAULT '0';

-- DropTable
DROP TABLE `Transcations`;

-- CreateTable
CREATE TABLE `Transactions` (
    `id` VARCHAR(191) NOT NULL,
    `amount` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `transcation_date` DATETIME(3) NOT NULL,
    `transcation_type` ENUM('CREDIT', 'DEBIT') NOT NULL,
    `wallet_id` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `IDcard_student_id_key` ON `IDcard`(`student_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Wallet_student_id_key` ON `Wallet`(`student_id`);

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_wallet_id_fkey` FOREIGN KEY (`wallet_id`) REFERENCES `Wallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
