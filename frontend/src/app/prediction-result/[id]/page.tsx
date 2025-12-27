// src/app/prediction-result/[id]/page.tsx
import { currentUser } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import PredictionResult from "@/components/prediction/PredictionResult";
import EditablePredictionResult from "@/components/prediction/EditablePredictionResult";
import { transformPredictionForClient } from "@/lib/utils/prisma-transforms";

async function PredictionResultPage({ params }: { params: { id: string } }) {
  // Get the currently logged-in user from Clerk
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  // Find the user in our database
  const user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });

  if (!user) {
    redirect("/sign-in");
  }

  // Get prediction with farm details - ONLY if it belongs to this user
  const dbPrediction = await prisma.cropPrediction.findFirst({
    where: {
      id: params.id,
      userId: user.id, // IMPORTANT: Only get predictions for this user
    },
    include: {
      farm: {
        select: {
          name: true,
          location: true,
          soilType: true,
          irrigationType: true,
        },
      },
    },
  });

  if (!dbPrediction) {
    notFound(); // Show 404 if prediction doesn't exist or doesn't belong to user
  }

  // Transform Decimal fields to numbers and add season
  const prediction = transformPredictionForClient(dbPrediction);

  return (
    <>
      <Navbar />
      <div className="pt-20">
        <EditablePredictionResult prediction={prediction} />
        <PredictionResult prediction={prediction} />
      </div>
    </>
  );
}

export default PredictionResultPage;