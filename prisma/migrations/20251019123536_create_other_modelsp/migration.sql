-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'client'
);

-- CreateTable
CREATE TABLE "Laptop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "laptop_name" TEXT NOT NULL,
    "storage" TEXT NOT NULL,
    "screen_size" REAL NOT NULL,
    "screen_type" TEXT NOT NULL,
    "battery" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "offer" INTEGER,
    "offer_expire" DATETIME,
    "shop_id" INTEGER NOT NULL,
    CONSTRAINT "Laptop_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Shop" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shop_name" TEXT NOT NULL,
    "shop_address" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CPU" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cpu_name" TEXT NOT NULL,
    "cores" INTEGER NOT NULL,
    "threads" INTEGER NOT NULL,
    "baseClock" REAL NOT NULL,
    "boostClock" REAL NOT NULL,
    "manufacturer" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GPU" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "gpu_name" TEXT NOT NULL,
    "vram" INTEGER NOT NULL,
    "clockSpeed" REAL NOT NULL,
    "manufacturer" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Ram" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ram_name" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    "speed" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Shop_shop_name_key" ON "Shop"("shop_name");

-- CreateIndex
CREATE UNIQUE INDEX "CPU_cpu_name_key" ON "CPU"("cpu_name");

-- CreateIndex
CREATE UNIQUE INDEX "GPU_gpu_name_key" ON "GPU"("gpu_name");
