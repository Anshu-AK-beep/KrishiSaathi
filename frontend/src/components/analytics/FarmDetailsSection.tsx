// src/components/analytics/FarmDetailsSection.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Droplets, Sprout, TrendingUp, Calendar } from "lucide-react";

interface FarmDetailsSectionProps {
  farms: any[];
  predictions: any[];
  compact?: boolean;
}

export default function FarmDetailsSection({ farms, predictions, compact = false }: FarmDetailsSectionProps) {
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0]?.id || "");
  
  const selectedFarm = farms.find(f => f.id === selectedFarmId) || farms[0];
  const farmPredictions = predictions.filter(p => p.farmId === selectedFarmId);

  const totalYield = farmPredictions.reduce((sum, p) => sum + p.predictedYield, 0);
  const avgYield = farmPredictions.length > 0 ? totalYield / farmPredictions.length : 0;

  // Crop variety analysis
  const cropTypes = farmPredictions.reduce((acc: any, p) => {
    acc[p.cropType] = (acc[p.cropType] || 0) + 1;
    return acc;
  }, {});

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Farm Overview</CardTitle>
          <CardDescription>{selectedFarm?.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Area</p>
              <p className="text-2xl font-bold">{selectedFarm?.totalArea} acres</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Soil Type</p>
              <p className="text-lg font-semibold">{selectedFarm?.soilType}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Recent Crops</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(cropTypes).slice(0, 3).map(crop => (
                <Badge key={crop} variant="secondary">{crop}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Farm Selector */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Farm Details & Performance</CardTitle>
              <CardDescription>Select a farm to view detailed information</CardDescription>
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

      {selectedFarm && (
        <>
          {/* Farm Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-semibold">{selectedFarm.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedFarm.totalArea} acres
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Droplets className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Irrigation</p>
                    <p className="font-semibold">{selectedFarm.irrigationType}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Soil: {selectedFarm.soilType}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Yield</p>
                    <p className="font-semibold">{avgYield.toFixed(1)} Q</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {farmPredictions.length} predictions
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Crop History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sprout className="w-5 h-5" />
                Crop History & Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {farmPredictions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No predictions yet for this farm
                  </p>
                ) : (
                  farmPredictions.slice(0, 5).map(prediction => (
                    <div key={prediction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded">
                          <Sprout className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="font-semibold">{prediction.cropType}</p>
                          <p className="text-sm text-muted-foreground">
                            {prediction.fieldArea} acres • {prediction.cropCategory}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar className="w-3 h-3 text-muted-foreground" />
                            <p className="text-xs text-muted-foreground">
                              {new Date(prediction.plantingDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          {prediction.predictedYield.toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground">quintals</p>
                        <Badge className="mt-2" variant={
                          prediction.confidenceLevel >= 80 ? "default" :
                          prediction.confidenceLevel >= 60 ? "secondary" : "outline"
                        }>
                          {prediction.confidenceLevel}% confidence
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Soil & Environmental Data */}
          <Card>
            <CardHeader>
              <CardTitle>Soil & Environmental Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Soil pH</p>
                  <p className="text-2xl font-bold">
                    {selectedFarm.soilPh || 'N/A'}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Soil Type</p>
                  <p className="text-lg font-semibold">
                    {selectedFarm.soilType}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Irrigation</p>
                  <p className="text-lg font-semibold">
                    {selectedFarm.irrigationType}
                  </p>
                </div>
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Ownership</p>
                  <p className="text-lg font-semibold">
                    {selectedFarm.farmOwnership}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}