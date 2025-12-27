"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, TrendingUp, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditablePredictionResultProps {
  prediction: any;
}

export default function EditablePredictionResult({ prediction }: EditablePredictionResultProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const [editedValues, setEditedValues] = useState({
    fertilizerType: prediction.fertilizerType,
    seedQuality: prediction.seedQuality,
  });

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    
    try {
      const response = await fetch("/api/predict-yield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmId: prediction.farmId,
          cropType: prediction.cropType,
          cropCategory: prediction.cropCategory,
          season: prediction.season,
          fieldArea: prediction.fieldArea,
          plantingDate: prediction.plantingDate,
          avgTemperature: prediction.avgTemperature,
          totalRainfall: prediction.totalRainfall,
          humidityLevel: prediction.humidityLevel,
          nitrogenContent: prediction.nitrogenContent,
          phosphorusContent: prediction.phosphorusContent,
          potassiumContent: prediction.potassiumContent,
          soilPh: prediction.soilPh,
          fertilizerType: editedValues.fertilizerType,
          seedQuality: editedValues.seedQuality,
        }),
      });

      if (!response.ok) throw new Error("Failed to regenerate");

      const result = await response.json();
      router.push(`/prediction-result/${result.predictionId}`);
      
    } catch (error) {
      console.error("Regenerate error:", error);
      alert("Failed to regenerate prediction");
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Edit2 className="w-5 h-5" />
            Modify Prediction Parameters
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Parameters"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Fertilizer Type
            </label>
            {isEditing ? (
              <Select
                value={editedValues.fertilizerType}
                onValueChange={(value) =>
                  setEditedValues({ ...editedValues, fertilizerType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORGANIC">Organic</SelectItem>
                  <SelectItem value="CHEMICAL">Chemical</SelectItem>
                  <SelectItem value="MIXED">Mixed</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="secondary" className="text-base px-4 py-2">
                {prediction.fertilizerType}
              </Badge>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              Seed Quality
            </label>
            {isEditing ? (
              <Select
                value={editedValues.seedQuality}
                onValueChange={(value) =>
                  setEditedValues({ ...editedValues, seedQuality: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">High Quality</SelectItem>
                  <SelectItem value="MEDIUM">Medium Quality</SelectItem>
                  <SelectItem value="LOW">Low Quality</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <Badge variant="secondary" className="text-base px-4 py-2">
                {prediction.seedQuality}
              </Badge>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex-1"
            >
              {isRegenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Regenerating...
                </>
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Regenerate with New Parameters
                </>
              )}
            </Button>
          </div>
        )}

        {(editedValues.fertilizerType !== prediction.fertilizerType ||
          editedValues.seedQuality !== prediction.seedQuality) && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              💡 Changes detected! Click "Regenerate" to see updated predictions.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}