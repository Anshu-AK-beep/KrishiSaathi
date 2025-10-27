import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all farms for a user
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const farmerId = searchParams.get("userId");

    const farms = await prisma.farm.findMany({
      where: {
        ...(farmerId && { userId: farmerId }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(farms);
  } catch (error) {
    console.error("Error fetching farms:", error);
    return NextResponse.json(
      { error: "Failed to fetch farms" },
      { status: 500 }
    );
  }
}

// POST - Create new farm
export async function POST(request: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "userId",
      "name",
      "location",
      "totalArea",
      "soilType",
      "irrigationType",
      "farmOwnership",
      "farmingType",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Ensure primaryCrops is an array
    if (!Array.isArray(body.primaryCrops)) {
      return NextResponse.json(
        { error: "primaryCrops must be an array" },
        { status: 400 }
      );
    }

    const farm = await prisma.farm.create({
      data: {
        userId: body.userId,
        name: body.name,
        location: body.location,
        latitude: body.latitude || null,
        longitude: body.longitude || null,
        totalArea: body.totalArea,
        soilType: body.soilType,
        soilPh: body.soilPh || null,
        irrigationType: body.irrigationType,
        farmOwnership: body.farmOwnership,
        farmingType: body.farmingType,
        primaryCrops: body.primaryCrops,
        farmingExperienceYears: body.farmingExperienceYears || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
      },
    });

    return NextResponse.json(farm, { status: 201 });
  } catch (error: any) {
    console.error("Error creating farm:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "A farm with similar details already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create farm" },
      { status: 500 }
    );
  }
}