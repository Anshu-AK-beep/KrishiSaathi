// src/components/dashboard/DashboardClient.tsx
"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  TrendingUp,
  CheckCircle,
  Target,
  Gauge,
  Sprout,
  Calendar,
  Mic,
} from "lucide-react";

// Proper TypeScript interfaces
interface Farm {
  id: string;
  userId: string;
  name: string;
  location: string;
  state: string | null;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  totalArea: number;
  soilType: string;
  soilPh: number | null;
  irrigationType: string;
  farmOwnership: string;
  farmingType: string;
  primaryCrops: string[];
  farmingExperienceYears: number | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface Prediction {
  id: string;
  userId: string;
  farmId: string;
  cropType: string;
  cropVariety: string | null;
  cropCategory: string;
  season: string | null;
  fieldArea: number;
  soilType: string | null;
  soilPh: number | null;
  nitrogenContent: number | null;
  phosphorusContent: number | null;
  potassiumContent: number | null;
  organicMatter: number | null;
  moistureLevel: number | null;
  irrigationType: string | null;
  irrigationFrequency: number | null;
  fertilizerType: string;
  fertilizerAmount: number | null;
  fertilizerQuantity: number | null;
  pesticideUsed: boolean;
  pestControlMethod: string | null;
  seedQuality: string;
  previousCrop: string | null;
  plantingDate: Date;
  expectedHarvestDate: Date;
  actualHarvestDate: Date | null;
  avgTemperature: number | null;
  totalRainfall: number | null;
  humidityLevel: number | null;
  avgRainfall: number | null;
  avgHumidity: number | null;
  sunlightHours: number | null;
  weatherData: any;
  soilData: any;
  predictedYield: number;
  predictedYieldMin: number | null;
  predictedYieldMax: number | null;
  confidenceLevel: number;
  confidence: number | null;
  yieldUnit: string | null;
  marketPrice: number | null;
  estimatedRevenue: number | null;
  notes: string | null;
  actualYield: number | null;
  accuracyPercentage: number | null;
  recommendations: any;
  riskFactors: any;
  keyFactors: any;
  pestDiseaseRisk: any;
  inputMethod: string;
  predictionStatus: string;
  createdAt: Date;
  updatedAt: Date;
  farm: {
    name: string;
    location: string;
  };
}

interface DashboardClientProps {
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  farms: Farm[];
  predictions: Prediction[];
  stats: {
    totalFarms: number;
    activeFarms: number;
    totalPredictions: number;
    completedPredictions: number;
    harvestedCrops: number;
    avgAccuracy: number;
  };
}

export default function DashboardClient({
  user,
  farms,
  predictions,
  stats,
}: DashboardClientProps) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm mb-2">
                  • Dashboard
                </span>
                <h1 className="text-4xl font-bold mb-2">
                  Good {getTimeOfDay()}, {user.fullName}! 🌾
                </h1>
                <p className="text-muted-foreground">
                  Welcome to your farming dashboard. Track your crops, predictions, and farm performance.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Sprout className="w-12 h-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.activeFarms}</p>
                  <p className="text-sm text-muted-foreground">Active Farms</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.totalPredictions}</p>
                  <p className="text-sm text-muted-foreground">Total Predictions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.completedPredictions}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <Target className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.harvestedCrops}</p>
                  <p className="text-sm text-muted-foreground">Harvested</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Gauge className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {stats.avgAccuracy > 0 ? `${stats.avgAccuracy.toFixed(0)}%` : "0%"}
                  </p>
                  <p className="text-sm text-muted-foreground">Avg Accuracy</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Predictions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Recent Predictions
                </CardTitle>
                {predictions.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.push("/predictions")}
                  >
                    View All →
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {predictions.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground mb-4">No predictions yet</p>
                    <Button onClick={() => router.push("/predict")}>
                      Create Your First Prediction
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {predictions.slice(0, 5).map((prediction) => (
                      <div
                        key={prediction.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => router.push(`/prediction-result/${prediction.id}`)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <p className="font-semibold">{prediction.cropType}</p>
                            <p className="text-sm text-muted-foreground">
                              {prediction.farm.name} • {prediction.farm.location}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              <Calendar className="w-3 h-3 inline mr-1" />
                              {new Date(prediction.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">
                            {prediction.predictedYield.toFixed(1)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {prediction.yieldUnit || "quintals"} ({prediction.fieldArea} acres)
                          </p>
                          {prediction.estimatedRevenue && (
                            <p className="text-xs text-green-600 font-semibold mt-0.5">
                              ₹{prediction.estimatedRevenue.toLocaleString()}
                            </p>
                          )}
                          <Badge
                            variant={
                              prediction.predictionStatus === "COMPLETED"
                                ? "default"
                                : prediction.predictionStatus === "HARVESTED"
                                ? "secondary"
                                : "outline"
                            }
                            className="mt-1"
                          >
                            {prediction.predictionStatus}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Voice Assistant - Featured */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Mic className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="font-semibold text-green-900 dark:text-green-100">Voice Assistant</span>
                    <span className="ml-auto px-2 py-0.5 bg-green-600 text-white text-[10px] font-semibold rounded">
                      NEW
                    </span>
                  </div>
                  <p className="text-xs text-green-700 dark:text-green-300 mb-3">
                    🎙️ Ask farming questions in your language
                  </p>
                  <Button
                    onClick={() => router.push("/voice")}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Start Voice Chat
                  </Button>
                </div>

                <Button
                  onClick={() => router.push("/farm-profile")}
                  className="w-full justify-start"
                  variant="default"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Add Farm
                </Button>

                <Button
                  onClick={() => router.push("/predict")}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Sprout className="w-4 h-4 mr-2" />
                  New Prediction
                </Button>

                <Button
                  onClick={() => router.push("/predictions")}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>

                {farms.length === 0 && (
                  <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      💡 Add your farm first to unlock predictions and analytics
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Morning";
  if (hour < 17) return "Afternoon";
  return "Evening";
}