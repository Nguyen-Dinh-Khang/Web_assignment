/*
  Warnings:

  - You are about to drop the column `offer` on the `Laptop` table. All the data in the column will be lost.
  - You are about to drop the column `offer_expire` on the `Laptop` table. All the data in the column will be lost.
  - Added the required column `cpu` to the `Laptop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gpu` to the `Laptop` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ram` to the `Laptop` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Laptop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "laptop_name" TEXT NOT NULL,
    "laptop_img" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "ram" TEXT NOT NULL,
    "cpu" TEXT NOT NULL,
    "gpu" TEXT NOT NULL,
    "screen_size" REAL NOT NULL,
    "screen_type" TEXT NOT NULL,
    "battery" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "shop_id" INTEGER NOT NULL,
    CONSTRAINT "Laptop_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Laptop" ("battery", "id", "laptop_img", "laptop_name", "price", "screen_size", "screen_type", "shop_id", "storage") SELECT "battery", "id", "laptop_img", "laptop_name", "price", "screen_size", "screen_type", "shop_id", "storage" FROM "Laptop";
DROP TABLE "Laptop";
ALTER TABLE "new_Laptop" RENAME TO "Laptop";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
