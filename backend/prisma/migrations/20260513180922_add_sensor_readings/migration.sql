-- CreateTable
CREATE TABLE "SensorReading" (
    "id" SERIAL NOT NULL,
    "deviceId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "solarV" DOUBLE PRECISION,
    "solarA" DOUBLE PRECISION,
    "solarW" DOUBLE PRECISION,
    "gridV" DOUBLE PRECISION,
    "gridA" DOUBLE PRECISION,
    "gridW" DOUBLE PRECISION,
    "battV" DOUBLE PRECISION,
    "battA" DOUBLE PRECISION,
    "battW" DOUBLE PRECISION,
    "battTemp" DOUBLE PRECISION,
    "battState" TEXT,
    "espTemp" DOUBLE PRECISION,
    "internalV" DOUBLE PRECISION,
    "internalA" DOUBLE PRECISION,
    "internalW" DOUBLE PRECISION,
    "externalV" DOUBLE PRECISION,
    "externalA" DOUBLE PRECISION,
    "externalW" DOUBLE PRECISION,
    "relay1" BOOLEAN,
    "relay2" BOOLEAN,
    "relay3" BOOLEAN,
    "relay4" BOOLEAN,

    CONSTRAINT "SensorReading_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SensorReading" ADD CONSTRAINT "SensorReading_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "Device"("deviceId") ON DELETE CASCADE ON UPDATE CASCADE;
