import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all predictions (with filters)
export async function GET(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    const clerkUser = await currentUser();
    
    if (!clerkUserId || !clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find or create user in database
    let currentDbUser = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId },
    });

    if (!currentDbUser) {
      currentDbUser = await prisma.user.create({
        data: {
          clerkUserId: clerkUserId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          firstName: clerkUser.firstName || null,
          lastName: clerkUser.lastName || null,
          fullName: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || null,
          role: (clerkUser.publicMetadata?.role as any) || "FARMER",
          isActive: true,
          lastLogin: new Date(),
        },
      });
    }

    const isAdmin = currentDbUser.role === "ADMIN";

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const farmerId = searchParams.get("farmerId");
    const cropType = searchParams.get("cropType");

    // Build where clause based on permissions
    const whereClause: any = {};

    // Admins can see all, farmers see only their own
    if (!isAdmin) {
      whereClause.userId = currentDbUser.id;
    }

    // Apply filters
    if (status) {
      whereClause.predictionStatus = status;
    }
    if (farmerId && isAdmin) {
      whereClause.userId = farmerId;
    }
    if (cropType) {
      whereClause.cropType = { contains: cropType, mode: "insensitive" };
    }

    const predictions = await prisma.cropPrediction.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
        farm: {
          select: {
            id: true,
            name: true,
            location: true,
            totalArea: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(predictions);
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return NextResponse.json(
      { error: "Failed to fetch predictions" },
      { status: 500 }
    );
  }
}

// POST - Create new prediction
export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get current user from database
    const currentDbUser = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!currentDbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "farmId",
      "cropType",
      "cropCategory",
      "fieldArea",
      "fertilizerType",
      "seedQuality",
      "plantingDate",
      "expectedHarvestDate",
      "predictedYield",
      "confidenceLevel",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Non-admins can only create predictions for themselves
    const userId = currentDbUser.role === "ADMIN" && body.userId 
      ? body.userId 
      : currentDbUser.id;

    const prediction = await prisma.cropPrediction.create({
      data: {
        userId,
        farmId: body.farmId,
        cropType: body.cropType,
        cropVariety: body.cropVariety || null,
        cropCategory: body.cropCategory,
        fieldArea: parseFloat(body.fieldArea),
        soilType: body.soilType || null,
        soilPh: body.soilPh ? parseFloat(body.soilPh) : null,
        nitrogenContent: body.nitrogenContent ? parseFloat(body.nitrogenContent) : null,
        phosphorusContent: body.phosphorusContent ? parseFloat(body.phosphorusContent) : null,
        potassiumContent: body.potassiumContent ? parseFloat(body.potassiumContent) : null,
        organicMatter: body.organicMatter ? parseFloat(body.organicMatter) : null,
        moistureLevel: body.moistureLevel ? parseFloat(body.moistureLevel) : null,
        irrigationType: body.irrigationType || null,
        irrigationFrequency: body.irrigationFrequency ? parseInt(body.irrigationFrequency) : null,
        fertilizerType: body.fertilizerType,
        fertilizerAmount: body.fertilizerAmount ? parseFloat(body.fertilizerAmount) : null,
        fertilizerQuantity: body.fertilizerQuantity ? parseFloat(body.fertilizerQuantity) : null,
        pesticideUsed: body.pesticideUsed || false,
        pestControlMethod: body.pestControlMethod || null,
        seedQuality: body.seedQuality,
        previousCrop: body.previousCrop || null,
        plantingDate: new Date(body.plantingDate),
        expectedHarvestDate: new Date(body.expectedHarvestDate),
        actualHarvestDate: body.actualHarvestDate ? new Date(body.actualHarvestDate) : null,
        avgTemperature: body.avgTemperature ? parseFloat(body.avgTemperature) : null,
        avgRainfall: body.avgRainfall ? parseFloat(body.avgRainfall) : null,
        totalRainfall: body.totalRainfall ? parseFloat(body.totalRainfall) : null,
        avgHumidity: body.avgHumidity ? parseFloat(body.avgHumidity) : null,
        humidityLevel: body.humidityLevel ? parseFloat(body.humidityLevel) : null,
        sunlightHours: body.sunlightHours ? parseFloat(body.sunlightHours) : null,
        weatherData: body.weatherData || null,
        predictedYield: parseFloat(body.predictedYield),
        predictedYieldMin: body.predictedYieldMin ? parseFloat(body.predictedYieldMin) : null,
        predictedYieldMax: body.predictedYieldMax ? parseFloat(body.predictedYieldMax) : null,
        confidenceLevel: parseFloat(body.confidenceLevel),
        actualYield: body.actualYield ? parseFloat(body.actualYield) : null,
        accuracyPercentage: body.accuracyPercentage ? parseFloat(body.accuracyPercentage) : null,
        recommendations: body.recommendations || null,
        riskFactors: body.riskFactors || null,
        pestDiseaseRisk: body.pestDiseaseRisk || null,
        keyFactors: body.keyFactors || null,
        inputMethod: body.inputMethod || "MANUAL",
        predictionStatus: body.predictionStatus || "COMPLETED",
      },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
          },
        },
        farm: {
          select: {
            name: true,
            location: true,
          },
        },
      },
    });

    return NextResponse.json(prediction, { status: 201 });
  } catch (error) {
    console.error("Error creating prediction:", error);
    return NextResponse.json(
      { error: "Failed to create prediction" },
      { status: 500 }
    );
  }
}