// src/components/analytics/IrrigationRecommendations.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Droplets, AlertTriangle, CheckCircle, Calendar, Thermometer, CloudRain } from "lucide-react";

interface IrrigationRecommendationsProps {
  farms: any[];
  predictions: any[];
}

export default function IrrigationRecommendations({ farms, predictions }: IrrigationRecommendationsProps) {
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0]?.id || "");
  
  const selectedFarm = farms.find(f => f.id === selectedFarmId) || farms[0];
  const farmPredictions = predictions.filter(p => p.farmId === selectedFarmId);

  // Calculate irrigation needs based on crop and weather
  const getIrrigationSchedule = (crop: string, rainfall: number, temperature: number) => {
    const schedules: any = {
      "Rice": { frequency: "Daily", amount: "50-70mm", critical: rainfall < 100 },
      "Wheat": { frequency: "Every 3-4 days", amount: "40-50mm", critical: rainfall < 50 },
      "Cotton": { frequency: "Every 7-10 days", amount: "30-40mm", critical: rainfall < 40 },
      "Sugarcane": { frequency: "Every 7-12 days", amount: "70-100mm", critical: rainfall < 80 },
      "Maize": { frequency: "Every 5-7 days", amount: "40-60mm", critical: rainfall < 60 },
      "Vegetables": { frequency: "Every 2-3 days", amount: "30-40mm", critical: rainfall < 50 },
    };

    return schedules[crop] || { frequency: "Every 5-7 days", amount: "40-50mm", critical: rainfall < 60 };
  };

  // Generate recommendations
  const generateRecommendations = () => {
    const recommendations: any[] = [];

    farmPredictions.forEach(pred => {
      const schedule = getIrrigationSchedule(
        pred.cropType, 
        pred.totalRainfall || 0,
        pred.avgTemperature || 25
      );

      recommendations.push({
        crop: pred.cropType,
        area: pred.fieldArea,
        schedule: schedule.frequency,
        amount: schedule.amount,
        critical: schedule.critical,
        rainfall: pred.totalRainfall,
        temperature: pred.avgTemperature,
        humidity: pred.humidityLevel,
      });
    });

    return recommendations;
  };

  const recommendations = generateRecommendations();
  const criticalCrops = recommendations.filter(r => r.critical);

  // Water usage calculation
  const calculateWaterUsage = () => {
    let total = 0;
    recommendations.forEach(r => {
      const amount = parseInt(r.amount.split('-')[1] || '50');
      total += amount * r.area;
    });
    return total;
  };

  const totalWaterNeeded = calculateWaterUsage();

  return (
    <div className="space-y-6">
      {/* Farm Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="w-6 h-6 text-blue-600" />
                Irrigation Recommendations
              </CardTitle>
              <CardDescription>Smart water management for your crops</CardDescription>
            </div>
            <Select value={selectedFarmId} onValueChange={setSelectedFarmId}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select farm" />
              </SelectTrigger>
              <SelectContent>
                {farms.map(farm => (
                  <SelectItem key={farm.id} value={farm.id}>
                    {farm.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Critical Alerts */}
      {criticalCrops.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Urgent:</strong> {criticalCrops.length} crop(s) require immediate irrigation due to low rainfall conditions.
          </AlertDescription>
        </Alert>
      )}

      {/* Water Usage Overview */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Droplets className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Water Needed</p>
                <p className="text-2xl font-bold">{totalWaterNeeded}mm</p>
                <p className="text-xs text-muted-foreground">per irrigation cycle</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Irrigation Type</p>
                <p className="text-xl font-bold">{selectedFarm?.irrigationType}</p>
                <p className="text-xs text-muted-foreground">Current system</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical Crops</p>
                <p className="text-2xl font-bold">{criticalCrops.length}</p>
                <p className="text-xs text-muted-foreground">Need attention</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Crop-wise Irrigation Schedule</CardTitle>
          <CardDescription>Customized schedule based on crop type and weather conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No active crops. Create predictions to get irrigation recommendations.
              </p>
            ) : (
              recommendations.map((rec, index) => (
                <Card key={index} className={`${rec.critical ? 'border-red-500 border-2' : ''}`}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${rec.critical ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'}`}>
                          <Droplets className={`w-5 h-5 ${rec.critical ? 'text-red-600' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold">{rec.crop}</h3>
                          <p className="text-sm text-muted-foreground">{rec.area} acres</p>
                        </div>
                      </div>
                      {rec.critical && (
                        <Badge variant="destructive">
                          Critical
                        </Badge>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Frequency:</span>
                          <span className="font-semibold">{rec.schedule}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Water Amount:</span>
                          <span className="font-semibold">{rec.amount}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <CloudRain className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Rainfall:</span>
                          <span className="font-semibold">{rec.rainfall?.toFixed(0) || 0}mm</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Thermometer className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">Temperature:</span>
                          <span className="font-semibold">{rec.temperature?.toFixed(1) || 0}°C</span>
                        </div>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm font-semibold mb-1">💡 Recommendation:</p>
                      <p className="text-sm text-muted-foreground">
                        {rec.critical 
                          ? `⚠️ Immediate irrigation required. Low rainfall (${rec.rainfall?.toFixed(0)}mm) detected. Ensure ${rec.amount} water per irrigation cycle.`
                          : `✓ Current conditions are adequate. Maintain ${rec.schedule} irrigation schedule with ${rec.amount} water per cycle.`
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10">
        <CardHeader>
          <CardTitle>💧 Water Conservation Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Drip Irrigation Benefits:</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• 30-50% water savings vs flood irrigation</li>
                <li>• Better nutrient absorption</li>
                <li>• Reduced weed growth</li>
                <li>• Lower disease risk</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100">Best Timing:</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Early morning (5-8 AM) - Best time</li>
                <li>• Late evening (6-8 PM) - Second best</li>
                <li>• Avoid midday (high evaporation)</li>
                <li>• Monitor soil moisture regularly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}