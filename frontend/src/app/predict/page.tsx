// src/app/predict/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import PredictionForm from "@/components/prediction/PredictionForm";

async function PredictPage() {
  // Get the currently logged-in user from Clerk
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  // Find or create the user in our database
  let user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
    include: {
      farms: {
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!user) {
    // Create user if they don't exist
    user = await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        email: clerkUser.emailAddresses[0].emailAddress,
        fullName: `${clerkUser.firstName} ${clerkUser.lastName}`,
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined,
        profileImage: clerkUser.imageUrl,
        role: clerkUser.publicMetadata?.role === "ADMIN" ? "ADMIN" : "FARMER",
        isVerified: true,
      },
      include: {
        farms: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  // Transform Decimal fields to numbers for the component
  const farms = user.farms.map(farm => ({
    ...farm,
    latitude: farm.latitude ? Number(farm.latitude) : null,
    longitude: farm.longitude ? Number(farm.longitude) : null,
    totalArea: Number(farm.totalArea),
    soilPh: farm.soilPh ? Number(farm.soilPh) : null,
  }));

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <PredictionForm farms={farms} />
      </div>
    </>
  );
}

export default PredictPage;