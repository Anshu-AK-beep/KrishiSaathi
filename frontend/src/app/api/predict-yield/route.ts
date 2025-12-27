// src/app/api/predict-yield/route.ts - ENHANCED VERSION
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

const ML_API_URL = process.env.ML_API_URL || "http://localhost:5000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Received prediction request:", body);

    const requiredFields = [
      "farmId", "cropType", "cropCategory", "season", "fieldArea",
      "plantingDate", "avgTemperature", "totalRainfall", "humidityLevel",
      "nitrogenContent", "phosphorusContent", "potassiumContent", "soilPh"
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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
          role: clerkUser.publicMetadata?.role === "ADMIN" ? "ADMIN" : "FARMER",
        },
      });
    }

    const farm = await prisma.farm.findUnique({
      where: { id: body.farmId },
    });

    if (!farm) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    // Enhanced ML input with ALL parameters
    const mlInput = {
      state: body.state || "Uttar Pradesh",
      district: body.district || extractDistrict(farm.location),
      season: body.season,
      crop: body.cropType,
      area: parseFloat(body.fieldArea),
      temperature: parseFloat(body.avgTemperature),
      rainfall: parseFloat(body.totalRainfall),
      humidity: parseFloat(body.humidityLevel),
      nitrogen: parseFloat(body.nitrogenContent),
      phosphorus: parseFloat(body.phosphorusContent),
      potassium: parseFloat(body.potassiumContent),
      ph: parseFloat(body.soilPh),
      // NEW: Farming practice parameters
      soilType: farm.soilType,
      irrigationType: farm.irrigationType,
      fertilizerType: body.fertilizerType,
      seedQuality: body.seedQuality,
    };

    console.log("Sending to ML API with all parameters:", mlInput);

    let mlResponse;
    try {
      const response = await fetch(`${ML_API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mlInput),
      });

      if (!response.ok) {
        throw new Error(`ML API returned ${response.status}`);
      }

      mlResponse = await response.json();
      console.log("ML API response:", mlResponse);
    } catch (mlError) {
      console.error("ML API error, using enhanced fallback:", mlError);
      mlResponse = generateEnhancedPrediction(mlInput);
    }

    const plantingDate = new Date(body.plantingDate);
    const expectedHarvestDate = calculateHarvestDate(
      plantingDate,
      body.cropType,
      body.season
    );

    const recommendations = mlResponse.recommendations || 
      generateRecommendations(mlInput, mlResponse.predicted_production || 0);

    const predictedYieldQuintals = (mlResponse.predicted_production || 0) * 10;
    const yieldPerHectareQuintals = (mlResponse.yield_per_hectare || 0) * 10;
    const predictedYieldMin = predictedYieldQuintals * 0.85;
    const predictedYieldMax = predictedYieldQuintals * 1.15;
    const confidenceLevel = mlResponse.confidence || 
      calculateConfidence(mlInput, predictedYieldQuintals);

    const prediction = await prisma.cropPrediction.create({
      data: {
        userId: user.id,
        farmId: body.farmId,
        cropType: body.cropType,
        cropCategory: body.cropCategory,
        fieldArea: parseFloat(body.fieldArea),
        soilPh: parseFloat(body.soilPh),
        nitrogenContent: parseFloat(body.nitrogenContent),
        phosphorusContent: parseFloat(body.phosphorusContent),
        potassiumContent: parseFloat(body.potassiumContent),
        irrigationType: farm.irrigationType,
        fertilizerType: body.fertilizerType,
        seedQuality: body.seedQuality,
        plantingDate,
        expectedHarvestDate,
        avgTemperature: parseFloat(body.avgTemperature),
        totalRainfall: parseFloat(body.totalRainfall),
        humidityLevel: parseFloat(body.humidityLevel),
        predictedYield: predictedYieldQuintals,
        predictedYieldMin,
        predictedYieldMax,
        confidenceLevel,
        recommendations: JSON.stringify(recommendations),
        weatherData: JSON.stringify(mlResponse.weather_data || {}),
        inputMethod: "MANUAL",
        predictionStatus: "COMPLETED",
      },
    });

    console.log("Prediction saved:", prediction.id);

    return NextResponse.json({
      success: true,
      predictionId: prediction.id,
      predictedYield: predictedYieldQuintals,
      yieldPerHectare: yieldPerHectareQuintals,
      confidenceLevel,
      recommendations,
    });

  } catch (error: any) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to generate prediction",
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

// ENHANCED fallback with farming practices impact
function generateEnhancedPrediction(input: any) {
  const baseYields: { [key: string]: number } = {
    "Rice": 2.5, "Wheat": 3.0, "Cotton": 1.5, "Sugarcane": 70,
    "Maize": 2.8, "Bajra": 1.2, "Jowar": 1.0, "Moong": 0.8,
    "Urad": 0.7, "Arhar": 0.9, "Groundnut": 1.5, "Sunflower": 1.2,
    "Soybean": 1.5, "Potato": 20, "Onion": 15, "Tomato": 25,
  };

  let baseYield = baseYields[input.crop] || 2.0;
  
  // Environmental factors
  if (input.temperature < 20 || input.temperature > 35) baseYield *= 0.90;
  if (input.rainfall < 50) baseYield *= 0.85;
  else if (input.rainfall > 300) baseYield *= 0.92;
  if (input.humidity < 40) baseYield *= 0.93;
  else if (input.humidity > 85) baseYield *= 0.95;
  if (input.ph < 6 || input.ph > 7.5) baseYield *= 0.90;
  if (input.nitrogen < 150) baseYield *= 0.90;
  if (input.phosphorus < 30) baseYield *= 0.93;
  if (input.potassium < 200) baseYield *= 0.93;

  // FARMING PRACTICES IMPACT
  
  // Fertilizer Type Impact
  if (input.fertilizerType === "ORGANIC") {
    baseYield *= 1.08; // +8% for organic (long-term soil health)
  } else if (input.fertilizerType === "CHEMICAL") {
    baseYield *= 1.12; // +12% for chemical (immediate nutrients)
  } else if (input.fertilizerType === "MIXED") {
    baseYield *= 1.10; // +10% for balanced approach
  }

  // Seed Quality Impact
  if (input.seedQuality === "HIGH") {
    baseYield *= 1.15; // +15% for high quality seeds
  } else if (input.seedQuality === "MEDIUM") {
    baseYield *= 1.05; // +5% for medium quality
  } else if (input.seedQuality === "LOW") {
    baseYield *= 0.90; // -10% for low quality
  }

  // Irrigation Type Impact
  if (input.irrigationType === "DRIP") {
    baseYield *= 1.10; // +10% for drip irrigation
  } else if (input.irrigationType === "SPRINKLER") {
    baseYield *= 1.07; // +7% for sprinkler
  } else if (input.irrigationType === "FLOOD") {
    baseYield *= 1.02; // +2% for flood
  } else if (input.irrigationType === "RAINFED") {
    if (input.rainfall < 100) baseYield *= 0.85; // -15% if low rain
  }

  // Soil Type Compatibility
  const cropSoilCompatibility: any = {
    "Rice": { "CLAY": 1.08, "LOAMY": 1.10, "ALLUVIAL": 1.12 },
    "Wheat": { "LOAMY": 1.10, "ALLUVIAL": 1.08, "BLACK": 1.05 },
    "Cotton": { "BLACK": 1.15, "RED": 1.05, "ALLUVIAL": 1.08 },
    "Sugarcane": { "CLAY": 1.10, "LOAMY": 1.12, "ALLUVIAL": 1.08 },
  };

  if (cropSoilCompatibility[input.crop]?.[input.soilType]) {
    baseYield *= cropSoilCompatibility[input.crop][input.soilType];
  }

  const totalProduction = baseYield * input.area;
  const confidence = calculateConfidence(input, totalProduction * 10);

  return {
    success: true,
    predicted_production: totalProduction,
    yield_per_hectare: baseYield,
    unit: "tonnes",
    confidence: confidence,
    recommendations: [],
  };
}

function extractDistrict(location: string): string {
  const parts = location.split(",").map(s => s.trim());
  return parts[0] || "Unknown";
}

function calculateHarvestDate(plantingDate: Date, cropType: string, season: string): Date {
  const durations: { [key: string]: number } = {
    "Rice": season === "Kharif" ? 120 : 150,
    "Wheat": 120, "Cotton": 180, "Sugarcane": 365,
    "Maize": 90, "Bajra": 75, "Jowar": 110,
    "Moong": 70, "Urad": 80, "Arhar": 150,
    "Groundnut": 120, "Sunflower": 100, "Soybean": 100,
    "Potato": 90, "Onion": 120, "Tomato": 75,
    "Banana": 365, "Coconut": 365,
  };

  const days = durations[cropType] || 120;
  const harvestDate = new Date(plantingDate);
  harvestDate.setDate(harvestDate.getDate() + days);
  return harvestDate;
}

function generateRecommendations(input: any, predictedYield: number): string[] {
  const recommendations: string[] = [];

  if (input.ph < 6.0) {
    recommendations.push("मिट्टी अम्लीय है। पीएच बढ़ाने के लिए 2-3 क्विंटल चूना प्रति एकड़ डालें।");
    recommendations.push("Soil is acidic. Apply 2-3 quintals of lime per acre to increase pH to 6.5-7.0");
  } else if (input.ph > 7.5) {
    recommendations.push("मिट्टी क्षारीय है। 5-10 टन कम्पोस्ट प्रति एकड़ डालें।");
    recommendations.push("Soil is alkaline. Add 5-10 tons of compost per acre");
  }

  if (input.nitrogen < 200) {
    recommendations.push(`नाइट्रोजन का स्तर कम है। ${input.crop === 'Rice' ? '120' : '100'} किलो यूरिया प्रति एकड़ डालें।`);
    recommendations.push(`Nitrogen levels are low. Apply ${input.crop === 'Rice' ? '120' : '100'} kg Urea per acre`);
  }

  if (input.seedQuality === "LOW") {
    recommendations.push("बीज की गुणवत्ता कम है। उच्च गुणवत्ता वाले प्रमाणित बीज का उपयोग करें।");
    recommendations.push("Seed quality is low. Use high-quality certified seeds for better yield");
  }

  if (input.fertilizerType === "CHEMICAL") {
    recommendations.push("केवल रासायनिक उर्वरक का उपयोग करने से मिट्टी की सेहत पर असर पड़ सकता है।");
    recommendations.push("Consider adding organic matter to maintain soil health alongside chemical fertilizers");
  }

  recommendations.push("नियमित रूप से कीट और रोग निगरानी करें।");
  recommendations.push("Monitor crops regularly for pests and diseases");

  return recommendations;
}

function calculateConfidence(input: any, predictedYield: number): number {
  let confidence = 85;

  if (input.temperature < 15 || input.temperature > 40) confidence -= 10;
  if (input.rainfall < 30 || input.rainfall > 300) confidence -= 10;
  if (input.ph < 5.5 || input.ph > 8.5) confidence -= 5;
  if (input.nitrogen < 100 || input.nitrogen > 400) confidence -= 5;
  if (input.seedQuality === "LOW") confidence -= 8;
  if (input.fertilizerType === "MIXED") confidence += 3;

  return Math.max(60, Math.min(95, confidence));
}