import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

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

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const farm = await prisma.farm.findUnique({
      where: { id: params.id },
    });

    if (!farm) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    return NextResponse.json(serializeFarm(farm));
  } catch (error) {
    console.error("Error fetching farm:", error);
    return NextResponse.json(
      { error: "Failed to fetch farm" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const existingFarm = await prisma.farm.findUnique({
      where: { id: params.id },
    });

    if (!existingFarm) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    const updatedFarm = await prisma.farm.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.location && { location: body.location }),
        ...(body.latitude !== undefined && { latitude: body.latitude }),
        ...(body.longitude !== undefined && { longitude: body.longitude }),
        ...(body.totalArea && { totalArea: body.totalArea }),
        ...(body.soilType && { soilType: body.soilType }),
        ...(body.soilPh !== undefined && { soilPh: body.soilPh }),
        ...(body.irrigationType && { irrigationType: body.irrigationType }),
        ...(body.farmOwnership && { farmOwnership: body.farmOwnership }),
        ...(body.farmingType && { farmingType: body.farmingType }),
        ...(body.primaryCrops && { primaryCrops: body.primaryCrops }),
        ...(body.farmingExperienceYears !== undefined && {
          farmingExperienceYears: body.farmingExperienceYears,
        }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });

    return NextResponse.json(serializeFarm(updatedFarm));
  } catch (error) {
    console.error("Error updating farm:", error);
    return NextResponse.json(
      { error: "Failed to update farm" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const existingFarm = await prisma.farm.findUnique({
      where: { id: params.id },
    });

    if (!existingFarm) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    await prisma.farm.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Farm deleted successfully" });
  } catch (error) {
    console.error("Error deleting farm:", error);
    return NextResponse.json(
      { error: "Failed to delete farm" },
      { status: 500 }
    );
  }
}