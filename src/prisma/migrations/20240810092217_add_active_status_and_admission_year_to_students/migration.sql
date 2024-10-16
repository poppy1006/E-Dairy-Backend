/*
  Warnings:

  - Added the required column `admission_year` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Student` ADD COLUMN `active` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `admission_year` VARCHAR(191) NOT NULL;
