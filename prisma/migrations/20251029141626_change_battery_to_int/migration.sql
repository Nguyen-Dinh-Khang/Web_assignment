/*
  Warnings:

  - You are about to alter the column `battery` on the `Laptop` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.

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
    "battery" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "shop_id" INTEGER NOT NULL,
    CONSTRAINT "Laptop_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Laptop" ("battery", "cpu", "gpu", "id", "laptop_img", "laptop_name", "price", "ram", "screen_size", "screen_type", "shop_id", "storage") SELECT "battery", "cpu", "gpu", "id", "laptop_img", "laptop_name", "price", "ram", "screen_size", "screen_type", "shop_id", "storage" FROM "Laptop";
DROP TABLE "Laptop";
ALTER TABLE "new_Laptop" RENAME TO "Laptop";
CREATE UNIQUE INDEX "Laptop_laptop_name_key" ON "Laptop"("laptop_name");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
