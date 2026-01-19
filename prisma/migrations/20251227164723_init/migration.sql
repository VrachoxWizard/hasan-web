-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "naziv" TEXT NOT NULL,
    "marka" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "godina" INTEGER NOT NULL,
    "cijena" INTEGER NOT NULL,
    "staracijena" INTEGER,
    "kilometraza" INTEGER NOT NULL,
    "gorivo" TEXT NOT NULL,
    "mjenjac" TEXT NOT NULL,
    "snaga" INTEGER NOT NULL,
    "boja" TEXT NOT NULL,
    "opis" TEXT NOT NULL,
    "karakteristike" JSONB NOT NULL,
    "istaknuto" BOOLEAN NOT NULL DEFAULT false,
    "ekskluzivno" BOOLEAN NOT NULL DEFAULT false,
    "ekskluzivnoOrder" INTEGER,
    "datumObjave" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "VehicleImage" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "vehicleId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "alt" TEXT,
    CONSTRAINT "VehicleImage_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Vehicle_ekskluzivno_ekskluzivnoOrder_idx" ON "Vehicle"("ekskluzivno", "ekskluzivnoOrder");

-- CreateIndex
CREATE INDEX "Vehicle_datumObjave_idx" ON "Vehicle"("datumObjave");

-- CreateIndex
CREATE INDEX "VehicleImage_vehicleId_order_idx" ON "VehicleImage"("vehicleId", "order");
