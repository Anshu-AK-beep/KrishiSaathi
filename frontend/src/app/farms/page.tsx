// src/app/farms/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import FarmListManager from "@/components/farm/FarmListManager";

async function FarmsPage() {
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
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { predictions: true },
      },
    },
  });

  // ✅ FIXED: Build object explicitly without spread operator
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
    predictionCount: farm._count.predictions,
  }));

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <FarmListManager farms={transformedFarms} />
      </div>
    </>
  );
}

export default FarmsPage;