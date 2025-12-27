import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { FarmOwnership, FarmingType, SoilType, IrrigationType } from "@prisma/client";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
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

    const farm = await prisma.farm.create({
      data: {
        userId: user.id,
        name: body.name,
        location: body.location,
        totalArea: parseFloat(body.area),
        soilType: body.soilType as SoilType,
        irrigationType: body.irrigationType as IrrigationType,
        farmOwnership: FarmOwnership.OWNED,
        farmingType: FarmingType.CONVENTIONAL,
        primaryCrops: body.primaryCrop ? [body.primaryCrop] : [],
      },
    });

    return NextResponse.json(
      { 
        success: true, 
        farm: {
          ...farm,
          totalArea: Number(farm.totalArea),
          latitude: farm.latitude ? Number(farm.latitude) : null,
          longitude: farm.longitude ? Number(farm.longitude) : null,
          soilPh: farm.soilPh ? Number(farm.soilPh) : null,
        }
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Farm creation error:", error);
    return NextResponse.json(
      { 
        error: error.message || "Failed to create farm",
        details: error.toString()
      },
      { status: 500 }
    );
  }
}