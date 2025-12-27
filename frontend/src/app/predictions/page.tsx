// src/app/predictions/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";

async function PredictionsPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  let user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        fullName: `${clerkUser.firstName} ${clerkUser.lastName}`,
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined,
        role: clerkUser.publicMetadata?.role === "ADMIN" ? "ADMIN" : "FARMER",
      },
    });
  }

  const farms = await prisma.farm.findMany({
    where: {
      userId: user.id,
      isActive: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const predictions = await prisma.cropPrediction.findMany({
    where: { userId: user.id },
    include: {
      farm: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // ✅ FIXED: Transform farms without spread operator
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

  // ✅ FIXED: Transform predictions without spread operator
  const transformedPredictions = predictions.map((pred) => ({
    id: pred.id,
    userId: pred.userId,
    farmId: pred.farmId,
    cropType: pred.cropType,
    cropCategory: pred.cropCategory,
    season: pred.season,
    fieldArea: Number(pred.fieldArea),
    soilPh: pred.soilPh ? Number(pred.soilPh) : null,
    nitrogenContent: pred.nitrogenContent ? Number(pred.nitrogenContent) : null,
    phosphorusContent: pred.phosphorusContent ? Number(pred.phosphorusContent) : null,
    potassiumContent: pred.potassiumContent ? Number(pred.potassiumContent) : null,
    irrigationType: pred.irrigationType,
    fertilizerType: pred.fertilizerType,
    seedQuality: pred.seedQuality,
    plantingDate: pred.plantingDate,
    expectedHarvestDate: pred.expectedHarvestDate,
    actualHarvestDate: pred.actualHarvestDate,
    avgTemperature: pred.avgTemperature ? Number(pred.avgTemperature) : null,
    totalRainfall: pred.totalRainfall ? Number(pred.totalRainfall) : null,
    humidityLevel: pred.humidityLevel ? Number(pred.humidityLevel) : null,
    predictedYield: Number(pred.predictedYield),
    predictedYieldMin: pred.predictedYieldMin ? Number(pred.predictedYieldMin) : null,
    predictedYieldMax: pred.predictedYieldMax ? Number(pred.predictedYieldMax) : null,
    actualYield: pred.actualYield ? Number(pred.actualYield) : null,
    yieldUnit: pred.yieldUnit,
    confidenceLevel: Number(pred.confidenceLevel),
    confidence: pred.confidence ? Number(pred.confidence) : null,
    accuracyPercentage: pred.accuracyPercentage ? Number(pred.accuracyPercentage) : null,
    predictionStatus: pred.predictionStatus,
    inputMethod: pred.inputMethod,
    weatherData: pred.weatherData,
    soilData: pred.soilData,
    recommendations: pred.recommendations,
    riskFactors: pred.riskFactors,
    marketPrice: pred.marketPrice ? Number(pred.marketPrice) : null,
    estimatedRevenue: pred.estimatedRevenue ? Number(pred.estimatedRevenue) : null,
    notes: pred.notes,
    createdAt: pred.createdAt,
    updatedAt: pred.updatedAt,
    farm: {
      id: pred.farm.id,
      userId: pred.farm.userId,
      name: pred.farm.name,
      location: pred.farm.location,
      state: pred.farm.state,
      district: pred.farm.district,
      latitude: pred.farm.latitude ? Number(pred.farm.latitude) : null,
      longitude: pred.farm.longitude ? Number(pred.farm.longitude) : null,
      totalArea: Number(pred.farm.totalArea),
      soilType: pred.farm.soilType,
      soilPh: pred.farm.soilPh ? Number(pred.farm.soilPh) : null,
      irrigationType: pred.farm.irrigationType,
      farmOwnership: pred.farm.farmOwnership,
      farmingType: pred.farm.farmingType,
      primaryCrops: pred.farm.primaryCrops,
      farmingExperienceYears: pred.farm.farmingExperienceYears,
      isActive: pred.farm.isActive,
      createdAt: pred.farm.createdAt,
      updatedAt: pred.farm.updatedAt,
    },
  }));

  return (
    <>
      <Navbar />
      <div className="pt-16">
        <AnalyticsDashboard
          user={{
            id: user.id,
            fullName: user.fullName || `${user.firstName} ${user.lastName}` || "User",
            email: user.email,
          }}
          farms={transformedFarms}
          predictions={transformedPredictions}
        />
      </div>
    </>
  );
}

export default PredictionsPage;