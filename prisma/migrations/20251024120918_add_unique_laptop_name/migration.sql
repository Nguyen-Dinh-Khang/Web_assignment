/*
  Warnings:

  - A unique constraint covering the columns `[laptop_name]` on the table `Laptop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Laptop_laptop_name_key" ON "Laptop"("laptop_name");
