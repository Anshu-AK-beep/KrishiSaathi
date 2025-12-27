// src/lib/serializers/decimal-serializer.ts

/**
 * Universal serializer for Prisma Decimal fields
 * Automatically converts all Decimal types to numbers
 */

import { Prisma } from "@prisma/client";

/**
 * Checks if a value is a Prisma Decimal
 */
function isDecimal(value: any): boolean {
  return (
    value &&
    typeof value === "object" &&
    "d" in value &&
    "e" in value &&
    "s" in value
  );
}

/**
 * Recursively converts all Decimal fields to numbers
 * Works with nested objects and arrays
 */
export function serializeDecimals<T>(data: T): T {
  if (data === null || data === undefined) {
    return data;
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return data.map((item) => serializeDecimals(item)) as any;
  }

  // Handle Decimal type
  if (isDecimal(data)) {
    return Number(data) as any;
  }

  // Handle Date objects (don't modify)
  if (data instanceof Date) {
    return data;
  }

  // Handle plain objects
  if (typeof data === "object") {
    const serialized: any = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        serialized[key] = serializeDecimals((data as any)[key]);
      }
    }
    return serialized;
  }

  // Return primitive values as-is
  return data;
}

/**
 * Specific serializer for Farm model
 */
export function serializeFarm(farm: any) {
  if (!farm) return null;

  return {
    ...farm,
    totalArea: farm.totalArea ? Number(farm.totalArea) : 0,
    soilPh: farm.soilPh ? Number(farm.soilPh) : null,
    latitude: farm.latitude ? Number(farm.latitude) : null,
    longitude: farm.longitude ? Number(farm.longitude) : null,
  };
}

/**
 * Specific serializer for CropPrediction model
 */
export function serializePrediction(prediction: any) {
  if (!prediction) return null;

  return {
    ...prediction,
    fieldArea: prediction.fieldArea ? Number(prediction.fieldArea) : 0,
    soilPh: prediction.soilPh ? Number(prediction.soilPh) : null,
    nitrogenContent: prediction.nitrogenContent ? Number(prediction.nitrogenContent) : null,
    phosphorusContent: prediction.phosphorusContent ? Number(prediction.phosphorusContent) : null,
    potassiumContent: prediction.potassiumContent ? Number(prediction.potassiumContent) : null,
    avgTemperature: prediction.avgTemperature ? Number(prediction.avgTemperature) : null,
    totalRainfall: prediction.totalRainfall ? Number(prediction.totalRainfall) : null,
    humidityLevel: prediction.humidityLevel ? Number(prediction.humidityLevel) : null,
    predictedYield: prediction.predictedYield ? Number(prediction.predictedYield) : 0,
    predictedYieldMin: prediction.predictedYieldMin ? Number(prediction.predictedYieldMin) : null,
    predictedYieldMax: prediction.predictedYieldMax ? Number(prediction.predictedYieldMax) : null,
    confidenceLevel: prediction.confidenceLevel ? Number(prediction.confidenceLevel) : 0,
    actualYield: prediction.actualYield ? Number(prediction.actualYield) : null,
    accuracyPercentage: prediction.accuracyPercentage ? Number(prediction.accuracyPercentage) : null,
    // Handle nested farm
    farm: prediction.farm ? serializeFarm(prediction.farm) : undefined,
  };
}

/**
 * Batch serializers
 */
export function serializeFarms(farms: any[]) {
  return farms.map((farm) => serializeFarm(farm));
}

export function serializePredictions(predictions: any[]) {
  return predictions.map((pred) => serializePrediction(pred));
}

/**
 * Helper for API responses
 * Use this in your API routes to automatically serialize
 */
export function createSerializedResponse(data: any, status = 200) {
  return new Response(JSON.stringify(serializeDecimals(data)), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}