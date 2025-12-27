"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, Ruler, Droplets, Sprout, ArrowLeft } from "lucide-react";

interface FarmFormData {
  name: string;
  location: string;
  area: string;
  soilType: string;
  irrigationType: string;
  primaryCrop: string;
  description: string;
}

export default function FarmProfileForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [formData, setFormData] = useState<FarmFormData>({
    name: "",
    location: "",
    area: "",
    soilType: "",
    irrigationType: "",
    primaryCrop: "",
    description: "",
  });

  const handleChange = (field: keyof FarmFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getLocation = async () => {
    setIsGettingLocation(true);
    try {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get location name
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const locationName = data.display_name || `${latitude}, ${longitude}`;
            
            setFormData((prev) => ({
              ...prev,
              location: locationName,
            }));
          } catch (error) {
            setFormData((prev) => ({
              ...prev,
              location: `${latitude}, ${longitude}`,
            }));
          }
          setIsGettingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          alert("Could not get your location. Please enter manually.");
          setIsGettingLocation(false);
        }
      );
    } catch (error) {
      console.error("Location error:", error);
      setIsGettingLocation(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/farms/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create farm");
      }

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Error creating farm:", error);
      alert(error.message || "Failed to create farm. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 mt-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-2">Add Your Farm</h1>
          <p className="text-muted-foreground">
            Tell us about your farm to get personalized crop recommendations and insights.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Farm Details</CardTitle>
            <CardDescription>
              Provide accurate information for better predictions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Farm Name */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  Farm Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Green Valley Farm"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">
                  Location <span className="text-red-500">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="location"
                    placeholder="e.g., Village, District, State"
                    value={formData.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    required
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={getLocation}
                    disabled={isGettingLocation}
                  >
                    {isGettingLocation ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <MapPin className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Click the location icon to auto-detect your location
                </p>
              </div>

              {/* Farm Area */}
              <div className="space-y-2">
                <Label htmlFor="area">
                  Farm Area (in acres) <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="area"
                    type="number"
                    step="0.01"
                    placeholder="e.g., 5.5"
                    value={formData.area}
                    onChange={(e) => handleChange("area", e.target.value)}
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Soil Type */}
              <div className="space-y-2">
                <Label htmlFor="soilType">
                  Soil Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.soilType}
                  onValueChange={(value) => handleChange("soilType", value)}
                  required
                >
                  <SelectTrigger id="soilType">
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLAY">Clay</SelectItem>
                    <SelectItem value="SANDY">Sandy</SelectItem>
                    <SelectItem value="LOAMY">Loamy</SelectItem>
                    <SelectItem value="SILT">Silt</SelectItem>
                    <SelectItem value="PEATY">Peaty</SelectItem>
                    <SelectItem value="CHALKY">Chalky</SelectItem>
                    <SelectItem value="BLACK">Black (Cotton Soil)</SelectItem>
                    <SelectItem value="RED">Red</SelectItem>
                    <SelectItem value="ALLUVIAL">Alluvial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Irrigation Type */}
              <div className="space-y-2">
                <Label htmlFor="irrigationType">
                  Irrigation Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.irrigationType}
                  onValueChange={(value) => handleChange("irrigationType", value)}
                  required
                >
                  <SelectTrigger id="irrigationType">
                    <Droplets className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select irrigation type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRIP">Drip Irrigation</SelectItem>
                    <SelectItem value="SPRINKLER">Sprinkler</SelectItem>
                    <SelectItem value="FLOOD">Flood/Surface</SelectItem>
                    <SelectItem value="RAINFED">Rainfed</SelectItem>
                    <SelectItem value="TUBEWELL">Tubewell</SelectItem>
                    <SelectItem value="CANAL">Canal</SelectItem>
                    <SelectItem value="MIXED">Mixed Methods</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Primary Crop */}
              <div className="space-y-2">
                <Label htmlFor="primaryCrop">
                  Primary Crop (Optional)
                </Label>
                <Select
                  value={formData.primaryCrop}
                  onValueChange={(value) => handleChange("primaryCrop", value)}
                >
                  <SelectTrigger id="primaryCrop">
                    <Sprout className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Select primary crop" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WHEAT">Wheat</SelectItem>
                    <SelectItem value="RICE">Rice</SelectItem>
                    <SelectItem value="COTTON">Cotton</SelectItem>
                    <SelectItem value="SUGARCANE">Sugarcane</SelectItem>
                    <SelectItem value="MAIZE">Maize</SelectItem>
                    <SelectItem value="PULSES">Pulses</SelectItem>
                    <SelectItem value="VEGETABLES">Vegetables</SelectItem>
                    <SelectItem value="FRUITS">Fruits</SelectItem>
                    <SelectItem value="MIXED">Mixed Crops</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Farm Description (Optional)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Tell us more about your farm, previous crops, challenges, etc."
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows={4}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Farm...
                    </>
                  ) : (
                    "Create Farm"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="mt-6 border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">💡 Why do we need this information?</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• <strong>Location:</strong> For weather forecasts and regional crop recommendations</li>
              <li>• <strong>Soil Type:</strong> To suggest crops best suited for your soil</li>
              <li>• <strong>Irrigation:</strong> To optimize water usage and crop selection</li>
              <li>• <strong>Area:</strong> For calculating yield predictions and resource planning</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}