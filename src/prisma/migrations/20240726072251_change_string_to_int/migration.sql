/*
  Warnings:

  - You are about to alter the column `amount` on the `Transactions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `balance` on the `Wallet` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - Made the column `amount_to_withdraw` on table `POS` required. This step will fail if there are existing NULL values in that column.
  - Made the column `total_amount` on table `POS` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `POS` MODIFY `amount_to_withdraw` INTEGER NOT NULL DEFAULT 0,
    MODIFY `total_amount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Transactions` MODIFY `amount` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Wallet` MODIFY `balance` INTEGER NOT NULL;
