"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, 
  Calendar, 
  MapPin, 
  Sprout,
  Gauge,
  Lightbulb,
  Download,
  Share2,
  ArrowLeft,
  Leaf
} from "lucide-react";

interface Prediction {
  id: string;
  cropType: string;
  cropCategory: string;
  season: string;
  fieldArea: number;
  predictedYield: number;
  predictedYieldMin: number | null;
  predictedYieldMax: number | null;
  confidenceLevel: number;
  recommendations: string;
  plantingDate: Date;
  expectedHarvestDate: Date;
  avgTemperature: number;
  totalRainfall: number;
  humidityLevel: number;
  soilPh: number;
  nitrogenContent: number;
  phosphorusContent: number;
  potassiumContent: number;
  fertilizerType: string;
  seedQuality: string;
  createdAt: Date;
  farm: {
    name: string;
    location: string;
    soilType: string;
    irrigationType: string;
  };
}

export default function PredictionResult({ prediction }: { prediction: Prediction }) {
  const router = useRouter();
  const recommendations = JSON.parse(prediction.recommendations || "[]");
  
  const yieldPerAcre = prediction.predictedYield / prediction.fieldArea;
  
  const confidenceColor = 
    prediction.confidenceLevel >= 80 ? "text-green-600" :
    prediction.confidenceLevel >= 60 ? "text-yellow-600" :
    "text-orange-600";

  const confidenceBg = 
    prediction.confidenceLevel >= 80 ? "bg-green-100 dark:bg-green-900/20" :
    prediction.confidenceLevel >= 60 ? "bg-yellow-100 dark:bg-yellow-900/20" :
    "bg-orange-100 dark:bg-orange-900/20";

  const handleDownload = () => {
    const report = `
KRISHISAATHI - CROP YIELD PREDICTION REPORT
==========================================

Prediction ID: ${prediction.id}
Generated: ${new Date(prediction.createdAt).toLocaleString()}

═══════════════════════════════════════════
FARM DETAILS
═══════════════════════════════════════════
Farm Name: ${prediction.farm.name}
Location: ${prediction.farm.location}
Soil Type: ${prediction.farm.soilType}
Irrigation: ${prediction.farm.irrigationType}

═══════════════════════════════════════════
CROP INFORMATION
═══════════════════════════════════════════
Crop: ${prediction.cropType}
Category: ${prediction.cropCategory}
Season: Kharif/Rabi/Zaid (based on planting date)
Field Area: ${prediction.fieldArea} acres
Planting Date: ${new Date(prediction.plantingDate).toLocaleDateString()}
Expected Harvest: ${new Date(prediction.expectedHarvestDate).toLocaleDateString()}

═══════════════════════════════════════════
ENVIRONMENTAL CONDITIONS
═══════════════════════════════════════════
Temperature: ${prediction.avgTemperature}°C
Rainfall: ${prediction.totalRainfall}mm
Humidity: ${prediction.humidityLevel}%

═══════════════════════════════════════════
SOIL PARAMETERS
═══════════════════════════════════════════
pH Level: ${prediction.soilPh}
Nitrogen (N): ${prediction.nitrogenContent} kg/ha
Phosphorus (P): ${prediction.phosphorusContent} kg/ha
Potassium (K): ${prediction.potassiumContent} kg/ha

═══════════════════════════════════════════
FARMING PRACTICES
═══════════════════════════════════════════
Fertilizer Type: ${prediction.fertilizerType}
Seed Quality: ${prediction.seedQuality}

═══════════════════════════════════════════
PREDICTION RESULTS
═══════════════════════════════════════════
Predicted Total Yield: ${prediction.predictedYield} quintals
Yield per Acre: ${yieldPerAcre.toFixed(2)} quintals/acre
Expected Range: ${prediction.predictedYieldMin?.toFixed(2)} - ${prediction.predictedYieldMax?.toFixed(2)} quintals
Confidence Level: ${prediction.confidenceLevel}%

═══════════════════════════════════════════
AI RECOMMENDATIONS
═══════════════════════════════════════════
${recommendations.map((r: string, i: number) => `${i + 1}. ${r}`).join('\n')}

═══════════════════════════════════════════
DISCLAIMER
═══════════════════════════════════════════
This prediction is generated using AI/ML models trained on historical 
Indian agricultural data. Actual yields may vary based on unforeseen 
factors like extreme weather, pest attacks, or disease outbreaks.

For best results:
• Conduct regular soil testing
• Monitor weather forecasts
• Follow recommended farming practices
• Consult local agricultural experts

═══════════════════════════════════════════
Generated by KrishiSaathi AI Platform
Empowering Farmers with Data-Driven Insights
═══════════════════════════════════════════
    `;

    const blob = new Blob([report], { type: 'text/plain; charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KrishiSaathi_Prediction_${prediction.cropType}_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">🌾 Prediction Results</h1>
            <p className="text-muted-foreground">
              Generated on {new Date(prediction.createdAt).toLocaleDateString()} at {new Date(prediction.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download Report
            </Button>
            <Button variant="outline" onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Crop Yield Prediction',
                  text: `Predicted yield for ${prediction.cropType}: ${prediction.predictedYield} quintals`,
                });
              } else {
                alert('Sharing is not supported on this device');
              }
            }}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Results */}
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Predicted Yield */}
        <Card className="lg:col-span-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="w-8 h-8 text-primary" />
              Predicted Yield
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Production</p>
                <p className="text-6xl font-bold text-primary">
                  {prediction.predictedYield.toLocaleString()}
                </p>
                <p className="text-lg text-muted-foreground mt-1">quintals</p>
              </div>
              
              {prediction.predictedYieldMin && prediction.predictedYieldMax && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">Expected Range</p>
                  <p className="text-xl font-semibold">
                    {prediction.predictedYieldMin.toFixed(1)} - {prediction.predictedYieldMax.toFixed(1)} quintals
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-sm text-muted-foreground">Per Acre</p>
                  <p className="text-2xl font-semibold">{yieldPerAcre.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">quintals/acre</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Area</p>
                  <p className="text-2xl font-semibold">{prediction.fieldArea}</p>
                  <p className="text-xs text-muted-foreground">acres</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confidence Score */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-6 h-6" />
              Confidence
            </CardTitle>
            <CardDescription>Prediction accuracy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-full py-4">
              <div className={`text-7xl font-bold ${confidenceColor} mb-4`}>
                {prediction.confidenceLevel}%
              </div>
              <Badge className={`${confidenceBg} ${confidenceColor} text-base px-4 py-2`}>
                {prediction.confidenceLevel >= 80 ? "High Confidence" :
                 prediction.confidenceLevel >= 60 ? "Moderate Confidence" :
                 "Low Confidence"}
              </Badge>
              <p className="text-xs text-center text-muted-foreground mt-4">
                Based on ML model trained on historical data
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crop & Farm Info */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="w-5 h-5" />
              Crop Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Crop:</span>
              <span className="font-semibold">{prediction.cropType}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Category:</span>
              <Badge variant="outline">{prediction.cropCategory}</Badge>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">
                <Calendar className="w-4 h-4 inline mr-1" />
                Planting Date:
              </span>
              <span className="font-semibold">
                {new Date(prediction.plantingDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Expected Harvest:</span>
              <span className="font-semibold text-green-600">
                {new Date(prediction.expectedHarvestDate).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Farm Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Farm:</span>
              <span className="font-semibold">{prediction.farm.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Location:</span>
              <span className="font-semibold text-sm">{prediction.farm.location}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-muted-foreground">Soil Type:</span>
              <Badge variant="secondary">{prediction.farm.soilType}</Badge>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-muted-foreground">Irrigation:</span>
              <Badge variant="secondary">{prediction.farm.irrigationType}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Conditions */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-green-600" />
            Environmental & Soil Conditions
          </CardTitle>
          <CardDescription>Parameters used for prediction</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">Temperature</p>
              <p className="text-3xl font-bold">{prediction.avgTemperature}°C</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">Rainfall</p>
              <p className="text-3xl font-bold">{prediction.totalRainfall}</p>
              <p className="text-xs text-muted-foreground">mm</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">Humidity</p>
              <p className="text-3xl font-bold">{prediction.humidityLevel}%</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">Soil pH</p>
              <p className="text-3xl font-bold">{prediction.soilPh}</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 pt-6 border-t">
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/10">
              <p className="text-sm text-muted-foreground mb-1">Nitrogen (N)</p>
              <p className="text-2xl font-bold text-green-600">{prediction.nitrogenContent}</p>
              <p className="text-xs text-muted-foreground">kg/ha</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10">
              <p className="text-sm text-muted-foreground mb-1">Phosphorus (P)</p>
              <p className="text-2xl font-bold text-blue-600">{prediction.phosphorusContent}</p>
              <p className="text-xs text-muted-foreground">kg/ha</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/10">
              <p className="text-sm text-muted-foreground mb-1">Potassium (K)</p>
              <p className="text-2xl font-bold text-purple-600">{prediction.potassiumContent}</p>
              <p className="text-xs text-muted-foreground">kg/ha</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Farming Practices */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Farming Practices Used</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="flex justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-muted-foreground">Fertilizer Type:</span>
            <Badge>{prediction.fertilizerType}</Badge>
          </div>
          <div className="flex justify-between p-3 rounded-lg bg-muted/30">
            <span className="text-muted-foreground">Seed Quality:</span>
            <Badge>{prediction.seedQuality}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <Card className="border-yellow-200 dark:border-yellow-900 bg-yellow-50/50 dark:bg-yellow-900/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              AI Recommendations
            </CardTitle>
            <CardDescription>
              Actionable insights to maximize your yield
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recommendations.map((rec: string, index: number) => (
                <li key={index} className="flex gap-3 p-3 rounded-lg bg-background">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="mt-8 flex gap-4 justify-center flex-wrap">
        <Button onClick={() => router.push("/predict")} size="lg" className="min-w-[200px]">
          <Sprout className="w-4 h-4 mr-2" />
          New Prediction
        </Button>
        <Button variant="outline" onClick={() => router.push("/dashboard")} size="lg" className="min-w-[200px]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Dashboard
        </Button>
      </div>
    </div>
  );
}