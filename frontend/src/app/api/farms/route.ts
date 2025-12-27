import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Helper function
function serializeFarm(farm: any) {
  if (!farm) return null;
  return {
    ...farm,
    totalArea: farm.totalArea ? Number(farm.totalArea) : 0,
    soilPh: farm.soilPh ? Number(farm.soilPh) : null,
    latitude: farm.latitude ? Number(farm.latitude) : null,
    longitude: farm.longitude ? Number(farm.longitude) : null,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let user = await prisma.user.findFirst();

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: "prototype-user",
          email: "prototype@example.com",
          fullName: "Prototype User",
          role: "FARMER",
        },
      });
    }

    const farm = await prisma.farm.create({
      data: {
        userId: user.id,
        name: body.name,
        location: body.location,
        latitude: body.latitude,
        longitude: body.longitude,
        totalArea: body.totalArea,
        soilType: body.soilType,
        soilPh: body.soilPh,
        irrigationType: body.irrigationType,
        farmOwnership: body.farmOwnership || "OWNED",
        farmingType: body.farmingType || "CONVENTIONAL",
        primaryCrops: body.primaryCrops || [],
        farmingExperienceYears: body.farmingExperienceYears,
      },
    });

    return NextResponse.json(serializeFarm(farm), { status: 201 });
  } catch (error) {
    console.error("Farm creation error:", error);
    return NextResponse.json(
      { error: "Failed to create farm" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await prisma.user.findFirst();

    if (!user) {
      return NextResponse.json({ farms: [] });
    }

    const farms = await prisma.farm.findMany({
      where: {
        userId: user.id,
        isActive: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const serializedFarms = farms.map(farm => serializeFarm(farm));

    return NextResponse.json({ farms: serializedFarms });
  } catch (error) {
    console.error("Error fetching farms:", error);
    return NextResponse.json(
      { error: "Failed to fetch farms" },
      { status: 500 }
    );
  }
}