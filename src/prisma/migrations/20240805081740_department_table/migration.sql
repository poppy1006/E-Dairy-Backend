/*
  Warnings:

  - Added the required column `address` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `blood_group` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department_id` to the `Student` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dob` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Student` ADD COLUMN `address` JSON NOT NULL,
    ADD COLUMN `blood_group` VARCHAR(191) NOT NULL,
    ADD COLUMN `department_id` VARCHAR(191) NOT NULL,
    ADD COLUMN `dob` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `Department` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `institution_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_department_id_fkey` FOREIGN KEY (`department_id`) REFERENCES `Department`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Department` ADD CONSTRAINT `Department_institution_id_fkey` FOREIGN KEY (`institution_id`) REFERENCES `Institutions`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
