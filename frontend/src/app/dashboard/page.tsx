// src/app/dashboard/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "@/components/dashboard/DashboardClient";

async function DashboardPage() {
  // Get the currently logged-in user from Clerk
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  const userEmail = clerkUser.emailAddresses[0].emailAddress;

  // Build full name properly (no "null" strings)
  const firstName = clerkUser.firstName || "";
  const lastName = clerkUser.lastName || "";
  const fullName = [firstName, lastName].filter(Boolean).join(" ") || userEmail.split("@")[0];

  // Use email as the primary identifier (more stable than clerkUserId)
  const user = await prisma.user.upsert({
    where: { email: userEmail },
    update: {
      // Update user info if they already exist (keeps data in sync)
      clerkUserId: clerkUser.id,
      fullName: fullName,
      firstName: firstName || null,
      lastName: lastName || null,
      profileImage: clerkUser.imageUrl,
      role: clerkUser.publicMetadata?.role === "ADMIN" ? "ADMIN" : "FARMER",
    },
    create: {
      // Create user if they don't exist
      clerkUserId: clerkUser.id,
      email: userEmail,
      fullName: fullName,
      firstName: firstName || null,
      lastName: lastName || null,
      profileImage: clerkUser.imageUrl,
      role: clerkUser.publicMetadata?.role === "ADMIN" ? "ADMIN" : "FARMER",
      isVerified: true,
    },
  });

  // Get THIS user's farms (not all farms)
  const farms = await prisma.farm.findMany({
    where: {
      userId: user.id,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Get THIS user's predictions (not all predictions)
  const predictions = await prisma.cropPrediction.findMany({
    where: { userId: user.id },
    include: {
      farm: {
        select: {
          name: true,
          location: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  // Transform farms - Convert all Decimal fields to numbers
  const transformedFarms = farms.map((farm) => ({
    id: farm.id,
    userId: farm.userId,
    name: farm.name,
    location: farm.location,
    state: farm.state,
    district: farm.district,
    latitude: farm.latitude ? Number(farm.latitude) : null,
    longitude: farm.longitude ? Number(farm.longitude) : null,
    totalArea: Number(farm.totalArea),
    soilType: farm.soilType,
    soilPh: farm.soilPh ? Number(farm.soilPh) : null,
    irrigationType: farm.irrigationType,
    farmOwnership: farm.farmOwnership,
    farmingType: farm.farmingType,
    primaryCrops: farm.primaryCrops,
    farmingExperienceYears: farm.farmingExperienceYears,
    isActive: farm.isActive,
    createdAt: farm.createdAt,
    updatedAt: farm.updatedAt,
  }));

  // Transform predictions - Convert all Decimal fields to numbers
  const transformedPredictions = predictions.map((pred) => ({
    id: pred.id,
    userId: pred.userId,
    farmId: pred.farmId,
    cropType: pred.cropType,
    cropVariety: pred.cropVariety,
    cropCategory: pred.cropCategory,
    season: pred.season,
    
    // Field Details
    fieldArea: Number(pred.fieldArea),
    soilType: pred.soilType,
    soilPh: pred.soilPh ? Number(pred.soilPh) : null,
    
    // Soil Nutrients
    nitrogenContent: pred.nitrogenContent ? Number(pred.nitrogenContent) : null,
    phosphorusContent: pred.phosphorusContent ? Number(pred.phosphorusContent) : null,
    potassiumContent: pred.potassiumContent ? Number(pred.potassiumContent) : null,
    organicMatter: pred.organicMatter ? Number(pred.organicMatter) : null,
    moistureLevel: pred.moistureLevel ? Number(pred.moistureLevel) : null,
    
    // Irrigation
    irrigationType: pred.irrigationType,
    irrigationFrequency: pred.irrigationFrequency,
    
    // Farming Practices
    fertilizerType: pred.fertilizerType,
    fertilizerAmount: pred.fertilizerAmount ? Number(pred.fertilizerAmount) : null,
    fertilizerQuantity: pred.fertilizerQuantity ? Number(pred.fertilizerQuantity) : null,
    pesticideUsed: pred.pesticideUsed,
    pestControlMethod: pred.pestControlMethod,
    seedQuality: pred.seedQuality,
    previousCrop: pred.previousCrop,
    
    // Timeline
    plantingDate: pred.plantingDate,
    expectedHarvestDate: pred.expectedHarvestDate,
    actualHarvestDate: pred.actualHarvestDate,
    
    // Weather Data
    avgTemperature: pred.avgTemperature ? Number(pred.avgTemperature) : null,
    totalRainfall: pred.totalRainfall ? Number(pred.totalRainfall) : null,
    humidityLevel: pred.humidityLevel ? Number(pred.humidityLevel) : null,
    avgRainfall: pred.avgRainfall ? Number(pred.avgRainfall) : null,
    avgHumidity: pred.avgHumidity ? Number(pred.avgHumidity) : null,
    sunlightHours: pred.sunlightHours ? Number(pred.sunlightHours) : null,
    weatherData: pred.weatherData,
    soilData: pred.soilData,
    
    // Predictions
    predictedYield: Number(pred.predictedYield),
    predictedYieldMin: pred.predictedYieldMin ? Number(pred.predictedYieldMin) : null,
    predictedYieldMax: pred.predictedYieldMax ? Number(pred.predictedYieldMax) : null,
    confidenceLevel: Number(pred.confidenceLevel),
    confidence: pred.confidence ? Number(pred.confidence) : null,
    
    // Market & Revenue (NEW FIELDS)
    yieldUnit: pred.yieldUnit,
    marketPrice: pred.marketPrice ? Number(pred.marketPrice) : null,
    estimatedRevenue: pred.estimatedRevenue ? Number(pred.estimatedRevenue) : null,
    notes: pred.notes,
    
    // Results
    actualYield: pred.actualYield ? Number(pred.actualYield) : null,
    accuracyPercentage: pred.accuracyPercentage ? Number(pred.accuracyPercentage) : null,
    
    // AI Analysis
    recommendations: pred.recommendations,
    riskFactors: pred.riskFactors,
    keyFactors: pred.keyFactors,
    pestDiseaseRisk: pred.pestDiseaseRisk,
    
    // Status
    inputMethod: pred.inputMethod,
    predictionStatus: pred.predictionStatus,
    
    // Timestamps
    createdAt: pred.createdAt,
    updatedAt: pred.updatedAt,
    
    // Relations
    farm: pred.farm,
  }));

  // Calculate statistics for THIS user only
  const stats = {
    totalFarms: farms.length,
    activeFarms: farms.filter((f) => f.isActive).length,
    totalPredictions: predictions.length,
    completedPredictions: predictions.filter((p) => p.predictionStatus === "COMPLETED").length,
    harvestedCrops: predictions.filter((p) => p.predictionStatus === "HARVESTED").length,
    avgAccuracy: predictions.length > 0
      ? predictions
          .filter((p) => p.actualYield)
          .reduce((acc, p) => {
            const accuracy = p.accuracyPercentage ? Number(p.accuracyPercentage) : 0;
            return acc + accuracy;
          }, 0) / predictions.filter((p) => p.actualYield).length
      : 0,
  };

  return (
    <DashboardClient
      user={{
        id: user.id,
        fullName: user.fullName || userEmail.split("@")[0],
        email: user.email,
        role: user.role,
      }}
      farms={transformedFarms}
      predictions={transformedPredictions}
      stats={stats}
    />
  );
}

export default DashboardPage;