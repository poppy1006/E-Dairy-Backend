/*
  Warnings:

  - You are about to drop the column `transaction_date` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `transcation_type` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `transaction_date` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `transaction_type` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Transactions` DROP COLUMN `transcation_date`,
    DROP COLUMN `transcation_type`,
    ADD COLUMN `transaction_date` DATETIME(3) NOT NULL,
    ADD COLUMN `transaction_type` ENUM('CREDIT', 'DEBIT') NOT NULL;
