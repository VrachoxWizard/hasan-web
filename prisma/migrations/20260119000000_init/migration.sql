-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
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
    "datumObjave" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleImage" (
    "id" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "alt" TEXT,

    CONSTRAINT "VehicleImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vehicle_datumObjave_idx" ON "Vehicle"("datumObjave");

-- CreateIndex
CREATE INDEX "Vehicle_ekskluzivno_ekskluzivnoOrder_idx" ON "Vehicle"("ekskluzivno", "ekskluzivnoOrder");

-- CreateIndex
CREATE INDEX "VehicleImage_vehicleId_order_idx" ON "VehicleImage"("vehicleId", "order");

-- AddForeignKey
ALTER TABLE "VehicleImage" ADD CONSTRAINT "VehicleImage_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
