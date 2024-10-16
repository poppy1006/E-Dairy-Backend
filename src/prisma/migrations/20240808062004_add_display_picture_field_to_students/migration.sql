/*
  Warnings:

  - Added the required column `display_picture` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Student` ADD COLUMN `display_picture` VARCHAR(191) NOT NULL;
