/*
  Warnings:

  - Added the required column `user_id` to the `Shop` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Shop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop_name" TEXT NOT NULL,
    "shop_address" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    CONSTRAINT "Shop_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Shop" ("id", "shop_address", "shop_name") SELECT "id", "shop_address", "shop_name" FROM "Shop";
DROP TABLE "Shop";
ALTER TABLE "new_Shop" RENAME TO "Shop";
CREATE UNIQUE INDEX "Shop_shop_name_key" ON "Shop"("shop_name");
CREATE UNIQUE INDEX "Shop_user_id_key" ON "Shop"("user_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
