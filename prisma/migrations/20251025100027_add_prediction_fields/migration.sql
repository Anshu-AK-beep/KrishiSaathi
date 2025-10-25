-- AlterTable
ALTER TABLE "public"."crop_predictions" ADD COLUMN     "avg_humidity" DECIMAL(5,2),
ADD COLUMN     "avg_rainfall" DECIMAL(8,2),
ADD COLUMN     "fertilizer_amount" DECIMAL(8,2),
ADD COLUMN     "moisture_level" DECIMAL(5,2),
ADD COLUMN     "nitrogen_content" DECIMAL(8,2),
ADD COLUMN     "organic_matter" DECIMAL(5,2),
ADD COLUMN     "pest_disease_risk" JSONB,
ADD COLUMN     "phosphorus_content" DECIMAL(8,2),
ADD COLUMN     "potassium_content" DECIMAL(8,2),
ADD COLUMN     "sunlight_hours" DECIMAL(4,1);
