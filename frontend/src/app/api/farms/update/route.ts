// src/app/api/farms/update/route.ts
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { FarmOwnership, FarmingType, SoilType, IrrigationType } from "@prisma/client";

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const { farmId, ...updateData } = body;

    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify farm belongs to user
    const farm = await prisma.farm.findFirst({
      where: {
        id: farmId,
        userId: user.id,
      },
    });

    if (!farm) {
      return NextResponse.json({ error: "Farm not found" }, { status: 404 });
    }

    // Update farm
    const updatedFarm = await prisma.farm.update({
      where: { id: farmId },
      data: {
        name: updateData.name,
        location: updateData.location,
        totalArea: parseFloat(updateData.area || updateData.totalArea),
        soilType: updateData.soilType as SoilType,
        soilPh: updateData.soilPh ? parseFloat(updateData.soilPh) : null,
        irrigationType: updateData.irrigationType as IrrigationType,
        farmOwnership: updateData.farmOwnership as FarmOwnership || FarmOwnership.OWNED,
        farmingType: updateData.farmingType as FarmingType || FarmingType.CONVENTIONAL,
        primaryCrops: updateData.primaryCrop ? [updateData.primaryCrop] : updateData.primaryCrops || [],
        farmingExperienceYears: updateData.farmingExperienceYears ? parseInt(updateData.farmingExperienceYears) : null,
      },
    });

    return NextResponse.json({
      success: true,
      farm: {
        ...updatedFarm,
        totalArea: Number(updatedFarm.totalArea),
        soilPh: updatedFarm.soilPh ? Number(updatedFarm.soilPh) : null,
      },
    });

  } catch (error: any) {
    console.error("Farm update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update farm" },
      { status: 500 }
    );
  }
}
