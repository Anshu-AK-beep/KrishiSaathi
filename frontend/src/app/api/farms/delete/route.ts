// src/app/api/farms/delete/route.ts
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { FarmOwnership, FarmingType, SoilType, IrrigationType } from "@prisma/client";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { farmId } = body;

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

    // Delete farm (cascade will delete predictions)
    await prisma.farm.delete({
      where: { id: farmId },
    });

    return NextResponse.json({
      success: true,
      message: "Farm deleted successfully",
    });

  } catch (error: any) {
    console.error("Farm delete error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete farm" },
      { status: 500 }
    );
  }
}