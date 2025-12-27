-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."IrrigationType" ADD VALUE 'TUBEWELL';
ALTER TYPE "public"."IrrigationType" ADD VALUE 'CANAL';

-- AlterTable
ALTER TABLE "public"."crop_predictions" ADD COLUMN     "confidence" DECIMAL(5,2),
ADD COLUMN     "season" TEXT,
ADD COLUMN     "soil_data" JSONB;

-- AlterTable
ALTER TABLE "public"."farms" ADD COLUMN     "district" TEXT,
ADD COLUMN     "state" TEXT;

-- CreateIndex
CREATE INDEX "crop_predictions_season_idx" ON "public"."crop_predictions"("season");

-- CreateIndex
CREATE INDEX "farms_state_idx" ON "public"."farms"("state");

-- CreateIndex
CREATE INDEX "farms_district_idx" ON "public"."farms"("district");
