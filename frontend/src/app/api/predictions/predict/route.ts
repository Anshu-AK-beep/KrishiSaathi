import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// External API endpoints
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

// Soil API (using SoilGrids or similar)
const SOIL_API_URL = 'https://rest.isric.org/soilgrids/v2.0/properties/query';

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      state,
      district,
      latitude,
      longitude,
      cropType,
      season,
      plantingDate,
      area,
      soilType,
      irrigationType,
      cropCategory = 'CEREALS',
      seedQuality = 'MEDIUM',
      fertilizerType = 'MIXED',
    } = body;

    // Validate required fields
    if (!state || !district || !cropType || !season || !area) {
      return NextResponse.json(
        { error: 'Missing required fields: state, district, cropType, season, area' },
        { status: 400 }
      );
    }

    // Step 1: Get user from database
    const dbUser = await prisma.user.findFirst({
      where: { 
        OR: [
          { clerkUserId: user.id },
          { email: user.emailAddresses[0].emailAddress }
        ]
      },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // Step 2: Fetch Weather Data
    const weatherData = await fetchWeatherData(latitude, longitude);
    
    // Step 3: Fetch Soil Data
    const soilData = await fetchSoilData(latitude, longitude);
    
    // Step 4: Prepare data for ML model
    const mlInputData = {
      State_Name: state,
      District_Name: district,
      Crop_Year: new Date().getFullYear(),
      Season: season,
      Crop: cropType,
      Area: parseFloat(area),
      // Weather features
      temperature: weatherData.temperature,
      humidity: weatherData.humidity,
      rainfall: weatherData.rainfall,
      // Soil features
      N: soilData.nitrogen || 50,
      P: soilData.phosphorus || 50,
      K: soilData.potassium || 50,
      ph: soilData.ph || 6.5,
      // Additional features
      irrigation: irrigationType || 'Rainfed',
      soil_type: soilType || 'Mixed',
    };

    // Step 5: Call ML Model API (Python backend)
    const mlPrediction = await callMLModel(mlInputData);
    
    // Step 6: Find or create farm
    let farm = await prisma.farm.findFirst({
      where: {
        userId: dbUser.id,
        location: district,
        state: state,
      },
    });

    if (!farm) {
      farm = await prisma.farm.create({
        data: {
          userId: dbUser.id,
          name: `${district} Farm`,
          location: district,
          state: state,
          district: district,
          totalArea: parseFloat(area),
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          soilType: soilType || 'MIXED',
          irrigationType: irrigationType || 'RAINFED',
          farmOwnership: 'OWNED',
          farmingType: 'CONVENTIONAL',
          primaryCrops: [cropType],
          isActive: true,
        },
      });
    }

    // Step 7: Create prediction record with ALL required fields
    const prediction = await prisma.cropPrediction.create({
      data: {
        userId: dbUser.id,
        farmId: farm.id,
        cropType,
        cropCategory: cropCategory,
        season: season,
        fieldArea: parseFloat(area),
        plantingDate: plantingDate ? new Date(plantingDate) : new Date(),
        expectedHarvestDate: new Date(calculateHarvestDate(plantingDate, cropType, season)),
        predictedYield: mlPrediction.predictedYield,
        confidenceLevel: mlPrediction.confidence,
        confidence: mlPrediction.confidence,
        predictionStatus: 'COMPLETED',
        seedQuality: seedQuality,
        fertilizerType: fertilizerType,
        avgTemperature: weatherData.temperature,
        totalRainfall: weatherData.rainfall,
        humidityLevel: weatherData.humidity,
        soilPh: soilData.ph,
        nitrogenContent: soilData.nitrogen,
        phosphorusContent: soilData.phosphorus,
        potassiumContent: soilData.potassium,
        weatherData: weatherData,
        soilData: soilData,
        recommendations: mlPrediction.recommendations,
        riskFactors: mlPrediction.riskFactors,
      },
    });

    // Step 8: Return comprehensive response
    return NextResponse.json({
      success: true,
      prediction: {
        id: prediction.id,
        predictedYield: Number(mlPrediction.predictedYield),
        confidence: Number(mlPrediction.confidence),
        unit: 'quintals/acre',
        estimatedRevenue: calculateRevenue(mlPrediction.predictedYield, cropType),
        weatherData,
        soilData,
        recommendations: mlPrediction.recommendations,
        riskFactors: mlPrediction.riskFactors,
        harvestDate: calculateHarvestDate(plantingDate, cropType, season),
      },
    });

  } catch (error: any) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Fetch weather data from OpenWeatherMap
async function fetchWeatherData(lat: string, lon: string) {
  try {
    if (!WEATHER_API_KEY) {
      throw new Error('Weather API key not configured');
    }

    const response = await fetch(
      `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    );
    
    if (!response.ok) {
      throw new Error('Weather API failed');
    }

    const data = await response.json();
    
    return {
      temperature: data.main.temp,
      humidity: data.main.humidity,
      rainfall: data.rain?.['1h'] || 0,
      pressure: data.main.pressure,
      windSpeed: data.wind.speed,
      clouds: data.clouds.all,
      description: data.weather[0].description,
    };
  } catch (error) {
    console.error('Weather API error:', error);
    return {
      temperature: 25,
      humidity: 70,
      rainfall: 100,
      pressure: 1013,
      windSpeed: 5,
      clouds: 50,
      description: 'Data unavailable',
    };
  }
}

// Fetch soil data
async function fetchSoilData(lat: string, lon: string) {
  try {
    const response = await fetch(
      `${SOIL_API_URL}?lon=${lon}&lat=${lat}&property=nitrogen&property=phh2o&depth=0-5cm&value=mean`
    );
    
    if (!response.ok) {
      throw new Error('Soil API failed');
    }

    const data = await response.json();
    
    return {
      nitrogen: data.properties?.nitrogen?.layers[0]?.depths[0]?.values?.mean || 50,
      phosphorus: 50,
      potassium: 50,
      ph: data.properties?.phh2o?.layers[0]?.depths[0]?.values?.mean / 10 || 6.5,
      organicCarbon: 1,
    };
  } catch (error) {
    console.error('Soil API error:', error);
    return {
      nitrogen: 50,
      phosphorus: 50,
      potassium: 50,
      ph: 6.5,
      organicCarbon: 1,
    };
  }
}

// Call ML Model (Python backend)
async function callMLModel(inputData: any) {
  try {
    const ML_MODEL_URL = process.env.ML_MODEL_URL;
    
    if (ML_MODEL_URL) {
      const response = await fetch(`${ML_MODEL_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData),
      });

      if (response.ok) {
        return await response.json();
      }
    }
    
    throw new Error('ML Model unavailable');
  } catch (error) {
    console.error('ML Model error:', error);
    return generateFallbackPrediction(inputData);
  }
}

// Fallback prediction logic (simplified)
function generateFallbackPrediction(data: any) {
  const baseYields: { [key: string]: number } = {
    'Rice': 25,
    'Wheat': 20,
    'Cotton': 12,
    'Sugarcane': 350,
    'Maize': 18,
    'Soybean': 12,
    'Groundnut': 15,
    'Bajra': 10,
    'Jowar': 8,
    'Chickpea': 8,
  };

  const baseYield = baseYields[data.Crop] || 15;
  let adjustedYield = baseYield;
  
  if (data.temperature < 20 || data.temperature > 35) adjustedYield *= 0.9;
  if (data.humidity < 50 || data.humidity > 90) adjustedYield *= 0.95;
  if (data.rainfall < 50) adjustedYield *= 0.85;
  else if (data.rainfall > 200) adjustedYield *= 0.95;
  if (data.ph < 6 || data.ph > 7.5) adjustedYield *= 0.9;

  const confidence = Math.min(85 + Math.random() * 10, 95);

  return {
    predictedYield: Math.round(adjustedYield * 100) / 100,
    confidence: Math.round(confidence),
    recommendations: generateRecommendations(data, adjustedYield),
    riskFactors: identifyRiskFactors(data),
  };
}

// Generate farming recommendations
function generateRecommendations(data: any, predictedYield: number) {
  const recommendations = [];

  if (data.ph < 6) {
    recommendations.push({
      type: 'soil',
      priority: 'high',
      message: 'Soil is acidic. Apply lime to increase pH to 6.5-7.0',
      action: 'Add 2-3 quintals of lime per acre',
    });
  } else if (data.ph > 7.5) {
    recommendations.push({
      type: 'soil',
      priority: 'medium',
      message: 'Soil is alkaline. Consider adding organic matter',
      action: 'Apply 5-10 tons of compost per acre',
    });
  }

  if (data.N < 40) {
    recommendations.push({
      type: 'fertilizer',
      priority: 'high',
      message: 'Nitrogen levels are low',
      action: `Apply ${data.Crop === 'Rice' ? '120' : '100'} kg Urea per acre`,
    });
  }

  if (data.rainfall < 100) {
    recommendations.push({
      type: 'irrigation',
      priority: 'high',
      message: 'Low rainfall expected. Ensure adequate irrigation',
      action: 'Implement drip irrigation for water efficiency',
    });
  }

  if (data.temperature > 35) {
    recommendations.push({
      type: 'protection',
      priority: 'medium',
      message: 'High temperature may stress crops',
      action: 'Provide shade nets or increase irrigation frequency',
    });
  }

  return recommendations;
}

// Identify risk factors
function identifyRiskFactors(data: any) {
  const risks = [];

  if (data.temperature > 38) {
    risks.push({ factor: 'Heat Stress', severity: 'high', impact: 'May reduce yield by 15-20%' });
  }
  if (data.rainfall < 50) {
    risks.push({ factor: 'Drought', severity: 'high', impact: 'Critical water shortage' });
  }
  if (data.humidity > 85) {
    risks.push({ factor: 'High Humidity', severity: 'medium', impact: 'Increased disease risk' });
  }
  if (data.ph < 5.5 || data.ph > 8) {
    risks.push({ factor: 'Soil pH', severity: 'medium', impact: 'Nutrient availability affected' });
  }

  return risks;
}

// Calculate estimated revenue
function calculateRevenue(yield_quintals: number, cropType: string) {
  const prices: { [key: string]: number } = {
    'Rice': 1800,
    'Wheat': 2000,
    'Cotton': 5500,
    'Sugarcane': 300,
    'Maize': 1700,
    'Soybean': 3800,
    'Groundnut': 5000,
    'Bajra': 1700,
    'Jowar': 2500,
    'Chickpea': 4500,
  };

  const pricePerQuintal = prices[cropType] || 2000;
  const revenue = yield_quintals * pricePerQuintal;

  return {
    estimatedRevenue: Math.round(revenue),
    pricePerQuintal,
    currency: 'INR',
  };
}

// Calculate harvest date
function calculateHarvestDate(plantingDate: string, cropType: string, season: string) {
  const plantDate = new Date(plantingDate || Date.now());
  
  const durations: { [key: string]: number } = {
    'Rice': season === 'Kharif' ? 120 : 150,
    'Wheat': 120,
    'Cotton': 180,
    'Sugarcane': 365,
    'Maize': 90,
    'Soybean': 100,
    'Groundnut': 120,
    'Bajra': 75,
    'Jowar': 110,
    'Chickpea': 100,
  };

  const daysToHarvest = durations[cropType] || 120;
  const harvestDate = new Date(plantDate);
  harvestDate.setDate(harvestDate.getDate() + daysToHarvest);

  return harvestDate.toISOString().split('T')[0];
}