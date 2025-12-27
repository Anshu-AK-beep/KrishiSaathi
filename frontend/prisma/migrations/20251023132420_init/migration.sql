-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('FARMER', 'GOVERNMENT_OFFICIAL', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."Theme" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "public"."SoilType" AS ENUM ('ALLUVIAL', 'CLAY', 'SANDY', 'LOAMY', 'BLACK', 'RED', 'LATERITE', 'MIXED');

-- CreateEnum
CREATE TYPE "public"."IrrigationType" AS ENUM ('DRIP', 'SPRINKLER', 'FLOOD', 'RAINFED', 'MIXED');

-- CreateEnum
CREATE TYPE "public"."FarmOwnership" AS ENUM ('OWNED', 'LEASED', 'SHARECROP', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."FarmingType" AS ENUM ('ORGANIC', 'CONVENTIONAL', 'MIXED');

-- CreateEnum
CREATE TYPE "public"."CropCategory" AS ENUM ('CEREALS', 'PULSES', 'OILSEEDS', 'CASH_CROPS', 'VEGETABLES', 'FRUITS');

-- CreateEnum
CREATE TYPE "public"."FertilizerType" AS ENUM ('ORGANIC', 'CHEMICAL', 'MIXED');

-- CreateEnum
CREATE TYPE "public"."SeedQuality" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "public"."InputMethod" AS ENUM ('MANUAL', 'VOICE', 'HYBRID');

-- CreateEnum
CREATE TYPE "public"."PredictionStatus" AS ENUM ('PENDING', 'COMPLETED', 'HARVESTED');

-- CreateEnum
CREATE TYPE "public"."DataSource" AS ENUM ('PRIMARY_API', 'BACKUP_API', 'CACHE');

-- CreateEnum
CREATE TYPE "public"."AuditStatus" AS ENUM ('SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('INFO', 'WARNING', 'ALERT', 'SUCCESS');

-- CreateEnum
CREATE TYPE "public"."NotificationCategory" AS ENUM ('WEATHER', 'PREDICTION', 'SYSTEM', 'MARKET', 'ADVISORY');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "phone_number" TEXT,
    "country_code" TEXT DEFAULT '+91',
    "full_name" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "role" "public"."UserRole" NOT NULL DEFAULT 'FARMER',
    "language_preference" TEXT NOT NULL DEFAULT 'en',
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_preferences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "theme" "public"."Theme" NOT NULL DEFAULT 'LIGHT',
    "notifications_sms" BOOLEAN NOT NULL DEFAULT false,
    "notifications_push" BOOLEAN NOT NULL DEFAULT true,
    "notifications_email" BOOLEAN NOT NULL DEFAULT true,
    "accessibility_screen_reader" BOOLEAN NOT NULL DEFAULT false,
    "accessibility_high_contrast" BOOLEAN NOT NULL DEFAULT false,
    "accessibility_large_text" BOOLEAN NOT NULL DEFAULT false,
    "accessibility_voice_input" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."farms" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "total_area" DECIMAL(10,2) NOT NULL,
    "soil_type" "public"."SoilType" NOT NULL,
    "soil_ph" DECIMAL(3,1),
    "irrigation_type" "public"."IrrigationType" NOT NULL,
    "farm_ownership" "public"."FarmOwnership" NOT NULL,
    "farming_type" "public"."FarmingType" NOT NULL,
    "primary_crops" TEXT[],
    "farming_experience_years" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."crop_predictions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "farm_id" UUID NOT NULL,
    "crop_type" TEXT NOT NULL,
    "crop_variety" TEXT,
    "crop_category" "public"."CropCategory" NOT NULL,
    "field_area" DECIMAL(10,2) NOT NULL,
    "soil_type" TEXT,
    "soil_ph" DECIMAL(3,1),
    "irrigation_type" TEXT,
    "irrigation_frequency" INTEGER,
    "fertilizer_type" "public"."FertilizerType" NOT NULL,
    "fertilizer_quantity" DECIMAL(8,2),
    "pesticide_used" BOOLEAN NOT NULL DEFAULT false,
    "pest_control_method" TEXT,
    "seed_quality" "public"."SeedQuality" NOT NULL,
    "previous_crop" TEXT,
    "planting_date" TIMESTAMP(3) NOT NULL,
    "expected_harvest_date" TIMESTAMP(3) NOT NULL,
    "actual_harvest_date" TIMESTAMP(3),
    "avg_temperature" DECIMAL(5,2),
    "total_rainfall" DECIMAL(8,2),
    "humidity_level" DECIMAL(5,2),
    "weather_data" JSONB,
    "predicted_yield" DECIMAL(10,2) NOT NULL,
    "predicted_yield_min" DECIMAL(10,2),
    "predicted_yield_max" DECIMAL(10,2),
    "confidence_level" DECIMAL(5,2) NOT NULL,
    "actual_yield" DECIMAL(10,2),
    "accuracy_percentage" DECIMAL(5,2),
    "recommendations" JSONB,
    "risk_factors" JSONB,
    "key_factors" JSONB,
    "input_method" "public"."InputMethod" NOT NULL DEFAULT 'MANUAL',
    "prediction_status" "public"."PredictionStatus" NOT NULL DEFAULT 'COMPLETED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "crop_predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."weather_data" (
    "id" UUID NOT NULL,
    "location" TEXT NOT NULL,
    "latitude" DECIMAL(10,8) NOT NULL,
    "longitude" DECIMAL(11,8) NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "temperature" DECIMAL(5,2),
    "temperature_min" DECIMAL(5,2),
    "temperature_max" DECIMAL(5,2),
    "humidity" DECIMAL(5,2),
    "rainfall" DECIMAL(8,2),
    "wind_speed" DECIMAL(5,2),
    "weather_condition" TEXT,
    "forecast_data" JSONB,
    "raw_data" JSONB,
    "data_source" "public"."DataSource" NOT NULL DEFAULT 'PRIMARY_API',
    "is_forecast" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weather_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."audit_logs" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "action" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "old_values" JSONB,
    "new_values" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "status" "public"."AuditStatus" NOT NULL,
    "error_message" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "public"."NotificationType" NOT NULL,
    "category" "public"."NotificationCategory" NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "data" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."system_settings" (
    "id" UUID NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_phone_number_idx" ON "public"."users"("phone_number");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "public"."users"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key" ON "public"."user_preferences"("user_id");

-- CreateIndex
CREATE INDEX "farms_user_id_idx" ON "public"."farms"("user_id");

-- CreateIndex
CREATE INDEX "farms_location_idx" ON "public"."farms"("location");

-- CreateIndex
CREATE INDEX "farms_is_active_idx" ON "public"."farms"("is_active");

-- CreateIndex
CREATE INDEX "crop_predictions_user_id_idx" ON "public"."crop_predictions"("user_id");

-- CreateIndex
CREATE INDEX "crop_predictions_farm_id_idx" ON "public"."crop_predictions"("farm_id");

-- CreateIndex
CREATE INDEX "crop_predictions_crop_type_idx" ON "public"."crop_predictions"("crop_type");

-- CreateIndex
CREATE INDEX "crop_predictions_created_at_idx" ON "public"."crop_predictions"("created_at");

-- CreateIndex
CREATE INDEX "crop_predictions_prediction_status_idx" ON "public"."crop_predictions"("prediction_status");

-- CreateIndex
CREATE INDEX "weather_data_location_idx" ON "public"."weather_data"("location");

-- CreateIndex
CREATE INDEX "weather_data_date_idx" ON "public"."weather_data"("date");

-- CreateIndex
CREATE INDEX "weather_data_expires_at_idx" ON "public"."weather_data"("expires_at");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "public"."audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_idx" ON "public"."audit_logs"("entity_type");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "public"."audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "public"."notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "public"."notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "public"."notifications"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "public"."system_settings"("key");

-- AddForeignKey
ALTER TABLE "public"."user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."farms" ADD CONSTRAINT "farms_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."crop_predictions" ADD CONSTRAINT "crop_predictions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."crop_predictions" ADD CONSTRAINT "crop_predictions_farm_id_fkey" FOREIGN KEY ("farm_id") REFERENCES "public"."farms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
