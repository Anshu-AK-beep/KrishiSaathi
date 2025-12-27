// src/components/farm/FarmEditDialog.tsx
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Farm {
  id: string;
  name: string;
  location: string;
  totalArea: number;
  soilType: string;
  soilPh: number | null;
  irrigationType: string;
  farmOwnership: string;
  farmingType: string;
  primaryCrops: string[];
  isActive: boolean;
  predictionCount: number;
}

interface FarmEditDialogProps {
  farm: Farm;
  open: boolean;
  onClose: () => void;
  onSuccess: (farm: Farm) => void;
}

export default function FarmEditDialog({ farm, open, onClose, onSuccess }: FarmEditDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [detectedSoil, setDetectedSoil] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: farm.name,
    location: farm.location,
    totalArea: farm.totalArea.toString(),
    soilType: farm.soilType,
    soilPh: farm.soilPh?.toString() || "",
    irrigationType: farm.irrigationType,
    farmOwnership: farm.farmOwnership,
    farmingType: farm.farmingType,
    isActive: farm.isActive,
  });

  // Detect soil type when location changes
  useEffect(() => {
    if (formData.location && formData.location !== farm.location) {
      detectSoilType(formData.location);
    }
  }, [formData.location]);

  const detectSoilType = async (location: string) => {
    try {
      const response = await fetch(`/api/detect-soil-type?location=${encodeURIComponent(location)}`);
      if (response.ok) {
        const data = await response.json();
        setDetectedSoil(data);
      }
    } catch (error) {
      console.error("Soil detection error:", error);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/farms/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmId: farm.id,
          ...formData,
          totalArea: parseFloat(formData.totalArea),
          soilPh: formData.soilPh ? parseFloat(formData.soilPh) : null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update farm");
      }

      const result = await response.json();
      onSuccess(result.farm);
      alert("Farm updated successfully!");
      
    } catch (error: any) {
      console.error("Update error:", error);
      alert(error.message || "Failed to update farm");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Farm Details</DialogTitle>
          <DialogDescription>
            Update your farm information. Changes will affect future predictions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Farm Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Farm Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              placeholder="Village, District, State"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              required
            />
            {detectedSoil && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Detected Soil:</strong> {detectedSoil.soilType} ({detectedSoil.confidence} confidence)
                  <br />
                  <small>{detectedSoil.description}</small>
                  {detectedSoil.soilType !== formData.soilType && (
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="p-0 h-auto mt-1"
                      onClick={() => handleChange("soilType", detectedSoil.soilType)}
                    >
                      Use detected soil type
                    </Button>
                  )}
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Area */}
          <div className="space-y-2">
            <Label htmlFor="totalArea">Farm Area (acres) *</Label>
            <Input
              id="totalArea"
              type="number"
              step="0.01"
              value={formData.totalArea}
              onChange={(e) => handleChange("totalArea", e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Soil Type */}
            <div className="space-y-2">
              <Label htmlFor="soilType">Soil Type *</Label>
              <Select
                value={formData.soilType}
                onValueChange={(value) => handleChange("soilType", value)}
              >
                <SelectTrigger id="soilType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CLAY">Clay</SelectItem>
                  <SelectItem value="SANDY">Sandy</SelectItem>
                  <SelectItem value="LOAMY">Loamy</SelectItem>
                  <SelectItem value="BLACK">Black (Cotton Soil)</SelectItem>
                  <SelectItem value="RED">Red</SelectItem>
                  <SelectItem value="ALLUVIAL">Alluvial</SelectItem>
                  <SelectItem value="LATERITE">Laterite</SelectItem>
                  <SelectItem value="MIXED">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Soil pH */}
            <div className="space-y-2">
              <Label htmlFor="soilPh">Soil pH (Optional)</Label>
              <Input
                id="soilPh"
                type="number"
                step="0.1"
                placeholder="e.g., 6.5"
                value={formData.soilPh}
                onChange={(e) => handleChange("soilPh", e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Irrigation Type */}
            <div className="space-y-2">
              <Label htmlFor="irrigationType">Irrigation Type *</Label>
              <Select
                value={formData.irrigationType}
                onValueChange={(value) => handleChange("irrigationType", value)}
              >
                <SelectTrigger id="irrigationType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRIP">Drip Irrigation</SelectItem>
                  <SelectItem value="SPRINKLER">Sprinkler</SelectItem>
                  <SelectItem value="FLOOD">Flood/Surface</SelectItem>
                  <SelectItem value="RAINFED">Rainfed</SelectItem>
                  <SelectItem value="MIXED">Mixed Methods</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Farm Ownership */}
            <div className="space-y-2">
              <Label htmlFor="farmOwnership">Ownership *</Label>
              <Select
                value={formData.farmOwnership}
                onValueChange={(value) => handleChange("farmOwnership", value)}
              >
                <SelectTrigger id="farmOwnership">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="OWNED">Owned</SelectItem>
                  <SelectItem value="LEASED">Leased</SelectItem>
                  <SelectItem value="SHARECROP">Sharecrop</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Farming Type */}
          <div className="space-y-2">
            <Label htmlFor="farmingType">Farming Type *</Label>
            <Select
              value={formData.farmingType}
              onValueChange={(value) => handleChange("farmingType", value)}
            >
              <SelectTrigger id="farmingType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ORGANIC">Organic</SelectItem>
                <SelectItem value="CONVENTIONAL">Conventional</SelectItem>
                <SelectItem value="MIXED">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Active Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => handleChange("isActive", e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="isActive" className="cursor-pointer">
              Farm is active
            </Label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}