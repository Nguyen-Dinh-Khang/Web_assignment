/*
  Warnings:

  - A unique constraint covering the columns `[ram_name]` on the table `Ram` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Ram_ram_name_key" ON "Ram"("ram_name");
