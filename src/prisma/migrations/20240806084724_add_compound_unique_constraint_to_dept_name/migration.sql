/*
  Warnings:

  - A unique constraint covering the columns `[name,institution_id]` on the table `Department` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Department_name_institution_id_key` ON `Department`(`name`, `institution_id`);
