/*
  Warnings:

  - Added the required column `cpu_img` to the `CPU` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gpu_img` to the `GPU` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ram_img` to the `Ram` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CPU" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpu_name" TEXT NOT NULL,
    "cpu_img" TEXT NOT NULL,
    "cores" INTEGER NOT NULL,
    "threads" INTEGER NOT NULL,
    "baseClock" REAL NOT NULL,
    "boostClock" REAL NOT NULL,
    "manufacturer" TEXT NOT NULL
);
INSERT INTO "new_CPU" ("baseClock", "boostClock", "cores", "cpu_name", "id", "manufacturer", "threads") SELECT "baseClock", "boostClock", "cores", "cpu_name", "id", "manufacturer", "threads" FROM "CPU";
DROP TABLE "CPU";
ALTER TABLE "new_CPU" RENAME TO "CPU";
CREATE UNIQUE INDEX "CPU_cpu_name_key" ON "CPU"("cpu_name");
CREATE TABLE "new_GPU" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gpu_name" TEXT NOT NULL,
    "gpu_img" TEXT NOT NULL,
    "vram" INTEGER NOT NULL,
    "clockSpeed" REAL NOT NULL,
    "manufacturer" TEXT NOT NULL
);
INSERT INTO "new_GPU" ("clockSpeed", "gpu_name", "id", "manufacturer", "vram") SELECT "clockSpeed", "gpu_name", "id", "manufacturer", "vram" FROM "GPU";
DROP TABLE "GPU";
ALTER TABLE "new_GPU" RENAME TO "GPU";
CREATE UNIQUE INDEX "GPU_gpu_name_key" ON "GPU"("gpu_name");
CREATE TABLE "new_Ram" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ram_name" TEXT NOT NULL,
    "ram_img" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL
);
INSERT INTO "new_Ram" ("capacity", "id", "manufacturer", "ram_name", "speed", "type") SELECT "capacity", "id", "manufacturer", "ram_name", "speed", "type" FROM "Ram";
DROP TABLE "Ram";
ALTER TABLE "new_Ram" RENAME TO "Ram";
CREATE UNIQUE INDEX "Ram_ram_name_key" ON "Ram"("ram_name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
