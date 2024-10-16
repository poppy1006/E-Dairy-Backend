-- AlterTable
ALTER TABLE `Transactions` ADD COLUMN `pos_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_pos_id_fkey` FOREIGN KEY (`pos_id`) REFERENCES `POS`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
