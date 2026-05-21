/*
  Warnings:

  - You are about to alter the column `solarV` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarA` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarW` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridV` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridA` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridW` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battV` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battA` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battW` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battTemp` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `espTemp` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalV` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalA` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalW` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalV` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalA` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalW` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battAMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battAMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battTempMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battTempMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battVMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battVMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battWMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battWMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `espTempMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `espTempMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalAMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalAMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalVMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalVMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalWMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalWMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridAMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridAMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridVMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridVMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridWMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridWMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalAMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalAMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalVMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalVMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalWMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalWMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarAMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarAMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarVMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarVMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarWMax` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarWMin` on the `SensorReading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarV` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarVMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarVMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarA` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarAMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarAMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarW` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarWMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `solarWMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridV` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridVMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridVMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridA` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridAMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridAMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridW` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridWMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `gridWMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battV` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battVMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battVMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battA` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battAMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battAMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battW` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battWMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battWMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battTemp` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battTempMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `battTempMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `espTemp` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `espTempMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `espTempMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalV` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalVMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalVMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalA` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalAMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalAMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalW` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalWMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `internalWMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalV` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalVMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalVMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalA` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalAMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalAMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalW` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalWMin` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.
  - You are about to alter the column `externalWMax` on the `SensorReadingDaily` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(8,3)`.

*/
-- AlterTable
ALTER TABLE "SensorReading" ALTER COLUMN "solarV" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarA" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarW" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridV" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridA" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridW" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battV" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battA" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battW" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battTemp" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "espTemp" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalV" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalA" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalW" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalV" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalA" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalW" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battAMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battAMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battTempMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battTempMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battVMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battVMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battWMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battWMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "espTempMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "espTempMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalAMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalAMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalVMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalVMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalWMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalWMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridAMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridAMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridVMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridVMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridWMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridWMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalAMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalAMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalVMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalVMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalWMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalWMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarAMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarAMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarVMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarVMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarWMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarWMin" SET DATA TYPE DECIMAL(8,3);

-- AlterTable
ALTER TABLE "SensorReadingDaily" ALTER COLUMN "solarV" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarVMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarVMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarA" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarAMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarAMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarW" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarWMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "solarWMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridV" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridVMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridVMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridA" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridAMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridAMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridW" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridWMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "gridWMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battV" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battVMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battVMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battA" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battAMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battAMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battW" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battWMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battWMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battTemp" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battTempMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "battTempMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "espTemp" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "espTempMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "espTempMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalV" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalVMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalVMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalA" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalAMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalAMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalW" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalWMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "internalWMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalV" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalVMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalVMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalA" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalAMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalAMax" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalW" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalWMin" SET DATA TYPE DECIMAL(8,3),
ALTER COLUMN "externalWMax" SET DATA TYPE DECIMAL(8,3);
