-- AlterTable
ALTER TABLE "SensorReading" ADD COLUMN     "battSoc" DECIMAL(8,3),
ADD COLUMN     "battSocMax" DECIMAL(8,3),
ADD COLUMN     "battSocMin" DECIMAL(8,3);

-- AlterTable
ALTER TABLE "SensorReadingDaily" ADD COLUMN     "battSoc" DECIMAL(8,3),
ADD COLUMN     "battSocMax" DECIMAL(8,3),
ADD COLUMN     "battSocMin" DECIMAL(8,3);

-- AlterTable
ALTER TABLE "SensorReadingHourly" ADD COLUMN     "battSoc" DECIMAL(8,3),
ADD COLUMN     "battSocMax" DECIMAL(8,3),
ADD COLUMN     "battSocMin" DECIMAL(8,3);

-- AlterTable
ALTER TABLE "SensorReadingWeekly" ADD COLUMN     "battSoc" DECIMAL(8,3),
ADD COLUMN     "battSocMax" DECIMAL(8,3),
ADD COLUMN     "battSocMin" DECIMAL(8,3);
