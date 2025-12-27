// src/components/analytics/StatisticsOverview.tsx
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, BarChart3, MapPin, Calendar } from "lucide-react";

interface StatisticsOverviewProps {
  farms: any[];
  predictions: any[];
}

export default function StatisticsOverview({ farms, predictions }: StatisticsOverviewProps) {
  // Calculate statistics
  const totalArea = farms.reduce((sum, farm) => sum + farm.totalArea, 0);
  const totalPredictions = predictions.length;
  const completedPredictions = predictions.filter(p => p.predictionStatus === "COMPLETED").length;
  const harvestedPredictions = predictions.filter(p => p.predictionStatus === "HARVESTED").length;
  
  const avgYield = predictions.length > 0
    ? predictions.reduce((sum, p) => sum + p.predictedYield, 0) / predictions.length
    : 0;
  
  const avgConfidence = predictions.length > 0
    ? predictions.reduce((sum, p) => sum + p.confidenceLevel, 0) / predictions.length
    : 0;

  // Calculate growth (comparing last month vs this month)
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1);
  
  const thisMonthPredictions = predictions.filter(p => new Date(p.createdAt) >= lastMonth);
  const lastMonthPredictions = predictions.filter(p => {
    const date = new Date(p.createdAt);
    return date < lastMonth && date >= new Date(now.getFullYear(), now.getMonth() - 2);
  });

  const growthRate = lastMonthPredictions.length > 0
    ? ((thisMonthPredictions.length - lastMonthPredictions.length) / lastMonthPredictions.length) * 100
    : 0;

  const stats = [
    {
      title: "Total Farm Area",
      value: `${totalArea.toFixed(1)} acres`,
      subtitle: `Across ${farms.length} farm${farms.length !== 1 ? 's' : ''}`,
      icon: MapPin,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Total Predictions",
      value: totalPredictions.toString(),
      subtitle: `${completedPredictions} completed, ${harvestedPredictions} harvested`,
      icon: BarChart3,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      trend: growthRate,
    },
    {
      title: "Average Yield",
      value: `${avgYield.toFixed(1)} Q`,
      subtitle: "Per prediction (quintals)",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Avg Confidence",
      value: `${avgConfidence.toFixed(0)}%`,
      subtitle: "Prediction accuracy",
      icon: Target,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/30",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              {stat.trend !== undefined && (
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  stat.trend >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.trend >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {Math.abs(stat.trend).toFixed(1)}%
                </div>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.subtitle}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}