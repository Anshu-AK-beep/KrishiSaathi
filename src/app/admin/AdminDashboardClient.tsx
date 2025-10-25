"use client";
import AdminStats from "./AdminStats";
import FarmersManagement from "./FarmersManagement";
import RecentPredictions from "./RecentPredictions";
import Navbar from "@/components/Navbar";
import { useGetUsers } from "@/hooks/use-users";
import { useGetPredictions } from "@/hooks/use-predictions";
import { useUser } from "@clerk/nextjs";
import { Sprout, TrendingUp } from "lucide-react";

function AdminDashboardClient() {
  const { user } = useUser();
  const { data: farmers = [], isLoading: farmersLoading } = useGetUsers("FARMER");
  const { data: predictions = [], isLoading: predictionsLoading } = useGetPredictions();

  // Calculate stats from real agricultural data
  const stats = {
    totalFarmers: farmers.length,
    activeFarmers: farmers.filter((farmer) => farmer.isActive && farmer.lastLogin).length,
    totalPredictions: predictions.length,
    completedPredictions: predictions.filter((pred) => pred.predictionStatus === "COMPLETED").length,
    harvestedPredictions: predictions.filter((pred) => pred.predictionStatus === "HARVESTED").length,
    avgAccuracy: calculateAvgAccuracy(predictions),
  };

  if (farmersLoading || predictionsLoading) return <LoadingUI />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        {/* ADMIN WELCOME SECTION */}
        <div className="mb-12 flex items-center justify-between bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-8 border border-primary/20">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-primary">Platform Administrator</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">
                Welcome back, {user?.firstName || "Admin"}! 🌾
              </h1>
              <p className="text-muted-foreground">
                Monitor farmers, track crop predictions, and measure platform impact on agricultural productivity.
              </p>
            </div>
            {/* Quick Stats Pills */}
            <div className="flex gap-3 mt-4">
              <div className="px-4 py-2 bg-background/50 rounded-full border border-border flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {stats.avgAccuracy}% Avg Prediction Accuracy
                </span>
              </div>
              <div className="px-4 py-2 bg-background/50 rounded-full border border-border flex items-center gap-2">
                <Sprout className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">
                  {stats.activeFarmers} Active Farmers
                </span>
              </div>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <Sprout className="w-16 h-16 text-primary" />
            </div>
          </div>
        </div>

        <AdminStats
          totalFarmers={stats.totalFarmers}
          activeFarmers={stats.activeFarmers}
          totalPredictions={stats.totalPredictions}
          completedPredictions={stats.completedPredictions}
          harvestedPredictions={stats.harvestedPredictions}
          avgAccuracy={stats.avgAccuracy}
        />

        <FarmersManagement />

        <RecentPredictions />
      </div>
    </div>
  );
}

export default AdminDashboardClient;

// Helper function to calculate average prediction accuracy
function calculateAvgAccuracy(predictions: any[]): number {
  const harvestedPredictions = predictions.filter(
    (p) => p.predictionStatus === "HARVESTED" && p.accuracyPercentage
  );
  
  if (harvestedPredictions.length === 0) return 0;
  
  const totalAccuracy = harvestedPredictions.reduce(
    (sum, pred) => sum + Number(pred.accuracyPercentage), 
    0
  );
  
  return Number((totalAccuracy / harvestedPredictions.length).toFixed(1));
}

function LoadingUI() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading agricultural dashboard...</p>
          </div>
        </div>
      </div>
    </div>
  );
}