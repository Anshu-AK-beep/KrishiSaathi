// lib/utils/prisma-transforms.ts
import { Decimal } from "@prisma/client/runtime/library";

export function transformPredictionForClient(prediction: any) {
  return {
    ...prediction,
    season: getSeasonFromDate(prediction.plantingDate),
    fieldArea: Number(prediction.fieldArea),
    soilPh: prediction.soilPh ? Number(prediction.soilPh) : null,
    nitrogenContent: prediction.nitrogenContent ? Number(prediction.nitrogenContent) : null,
    phosphorusContent: prediction.phosphorusContent ? Number(prediction.phosphorusContent) : null,
    potassiumContent: prediction.potassiumContent ? Number(prediction.potassiumContent) : null,
    organicMatter: prediction.organicMatter ? Number(prediction.organicMatter) : null,
    moistureLevel: prediction.moistureLevel ? Number(prediction.moistureLevel) : null,
    fertilizerAmount: prediction.fertilizerAmount ? Number(prediction.fertilizerAmount) : null,
    fertilizerQuantity: prediction.fertilizerQuantity ? Number(prediction.fertilizerQuantity) : null,
    avgTemperature: prediction.avgTemperature ? Number(prediction.avgTemperature) : null,
    totalRainfall: prediction.totalRainfall ? Number(prediction.totalRainfall) : null,
    humidityLevel: prediction.humidityLevel ? Number(prediction.humidityLevel) : null,
    avgRainfall: prediction.avgRainfall ? Number(prediction.avgRainfall) : null,
    avgHumidity: prediction.avgHumidity ? Number(prediction.avgHumidity) : null,
    sunlightHours: prediction.sunlightHours ? Number(prediction.sunlightHours) : null,
    predictedYield: Number(prediction.predictedYield),
    predictedYieldMin: prediction.predictedYieldMin ? Number(prediction.predictedYieldMin) : null,
    predictedYieldMax: prediction.predictedYieldMax ? Number(prediction.predictedYieldMax) : null,
    confidenceLevel: Number(prediction.confidenceLevel),
    actualYield: prediction.actualYield ? Number(prediction.actualYield) : null,
    accuracyPercentage: prediction.accuracyPercentage ? Number(prediction.accuracyPercentage) : null,
  };
}

function getSeasonFromDate(date: Date): string {
  const month = date.getMonth() + 1;
  if (month >= 6 && month <= 10) return "Kharif";
  if (month >= 11 || month <= 3) return "Rabi";
  return "Zaid";
}