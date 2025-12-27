// src/components/prediction/PredictionForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Sparkles, CloudRain, Thermometer, Droplets, MapPin, Calendar, Sprout } from "lucide-react";

interface Farm {
  id: string;
  name: string;
  location: string;
  totalArea: number;
  soilType: string;
  soilPh: number | null;
  irrigationType: string;
  latitude: number | null;
  longitude: number | null;
}

interface PredictionFormData {
  farmId: string;
  cropType: string;
  cropCategory: string;
  season: string;
  fieldArea: string;
  plantingDate: string;
  
  // Weather (auto-fetched)
  avgTemperature: string;
  totalRainfall: string;
  humidityLevel: string;
  
  // Soil nutrients
  nitrogenContent: string;
  phosphorusContent: string;
  potassiumContent: string;
  soilPh: string;
  
  // Farming practices
  fertilizerType: string;
  seedQuality: string;
}

const CROPS = [
  "Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Bajra", "Jowar",
  "Ragi", "Moong", "Urad", "Arhar", "Groundnut", "Sunflower", "Soybean",
  "Potato", "Onion", "Tomato", "Banana", "Coconut"
];

const CROP_CATEGORIES = [
  { value: "CEREALS", label: "Cereals (Rice, Wheat, Maize)" },
  { value: "PULSES", label: "Pulses (Moong, Urad, Arhar)" },
  { value: "OILSEEDS", label: "Oilseeds (Groundnut, Sunflower)" },
  { value: "CASH_CROPS", label: "Cash Crops (Cotton, Sugarcane)" },
  { value: "VEGETABLES", label: "Vegetables (Potato, Onion, Tomato)" },
  { value: "FRUITS", label: "Fruits (Banana, Coconut)" }
];

const SEASONS = [
  { value: "Kharif", label: "Kharif (June-Oct)" },
  { value: "Rabi", label: "Rabi (Nov-Mar)" },
  { value: "Zaid", label: "Zaid (Apr-May)" },
  { value: "Whole Year", label: "Whole Year" }
];

export default function PredictionForm({ farms }: { farms: Farm[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [isFetchingSoil, setIsFetchingSoil] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null);
  const [stateDistrict, setStateDistrict] = useState({ state: "", district: "" });
  
  const [formData, setFormData] = useState<PredictionFormData>({
    farmId: "",
    cropType: "",
    cropCategory: "",
    season: "",
    fieldArea: "",
    plantingDate: new Date().toISOString().split('T')[0],
    
    avgTemperature: "",
    totalRainfall: "",
    humidityLevel: "",
    
    nitrogenContent: "",
    phosphorusContent: "",
    potassiumContent: "",
    soilPh: "",
    
    fertilizerType: "MIXED",
    seedQuality: "MEDIUM",
  });

  // Auto-fetch weather and soil when farm is selected
  useEffect(() => {
    if (selectedFarm) {
      // Set soil pH if available from farm
      if (selectedFarm.soilPh) {
        setFormData(prev => ({
          ...prev,
          soilPh: selectedFarm.soilPh?.toString() || ""
        }));
      }
      
      // Auto-fetch weather data
      if (selectedFarm.latitude && selectedFarm.longitude) {
        fetchWeatherData(Number(selectedFarm.latitude), Number(selectedFarm.longitude));
      } else {
        // Use location-based weather if coordinates not available
        fetchWeatherByLocation(selectedFarm.location);
      }
      
      // Auto-fetch soil data
      fetchSoilData();
    }
  }, [selectedFarm]);

  const handleFarmChange = async (farmId: string) => {
    const farm = farms.find(f => f.id === farmId);
    if (farm) {
      setSelectedFarm(farm);
      setFormData(prev => ({
        ...prev,
        farmId: farm.id,
        fieldArea: farm.totalArea.toString(),
      }));
      
      // Extract state and district from location
      await extractStateDistrict(farm.location);
    }
  };

  const extractStateDistrict = async (location: string) => {
    try {
      const response = await fetch(`/api/extract-location?location=${encodeURIComponent(location)}`);
      if (response.ok) {
        const data = await response.json();
        setStateDistrict(data);
      }
    } catch (error) {
      console.error("Error extracting location:", error);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    setIsFetchingWeather(true);
    try {
      const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          avgTemperature: data.temperature?.toFixed(1) || "",
          totalRainfall: data.rainfall?.toFixed(1) || "",
          humidityLevel: data.humidity?.toFixed(1) || "",
        }));
        console.log("Weather data fetched successfully:", data);
      } else {
        console.error("Weather API failed:", response.status);
        alert("Could not fetch weather data. Please enter manually.");
      }
    } catch (error) {
      console.error("Weather fetch error:", error);
      alert("Failed to fetch weather data. Please enter manually.");
    } finally {
      setIsFetchingWeather(false);
    }
  };

  const fetchWeatherByLocation = async (location: string) => {
    setIsFetchingWeather(true);
    try {
      // First, geocode the location to get coordinates
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
        {
          headers: {
            "User-Agent": "KrishiSaathi/1.0"
          }
        }
      );
      
      if (geocodeResponse.ok) {
        const geocodeData = await geocodeResponse.json();
        if (geocodeData.length > 0) {
          const { lat, lon } = geocodeData[0];
          await fetchWeatherData(parseFloat(lat), parseFloat(lon));
        } else {
          console.error("Location not found");
          alert("Could not find location. Please enter weather data manually.");
        }
      }
    } catch (error) {
      console.error("Location geocoding error:", error);
      alert("Failed to fetch weather data. Please enter manually.");
    } finally {
      setIsFetchingWeather(false);
    }
  };

  const fetchSoilData = async () => {
    if (!selectedFarm) return;
    
    setIsFetchingSoil(true);
    try {
      const response = await fetch(`/api/soil-data?farmId=${selectedFarm.id}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          nitrogenContent: data.nitrogen?.toFixed(0) || prev.nitrogenContent,
          phosphorusContent: data.phosphorus?.toFixed(0) || prev.phosphorusContent,
          potassiumContent: data.potassium?.toFixed(0) || prev.potassiumContent,
          soilPh: data.ph?.toFixed(1) || prev.soilPh,
        }));
        console.log("Soil data fetched successfully:", data);
        
        // Show a notification if using estimated values
        if (data.source === "estimated") {
          alert("ℹ️ Soil values are estimated based on soil type. For accurate results, conduct soil testing.");
        }
      } else {
        console.error("Soil API failed:", response.status);
        alert("Could not fetch soil data. Please enter manually.");
      }
    } catch (error) {
      console.error("Soil data fetch error:", error);
      alert("Failed to fetch soil data. Please enter manually.");
    } finally {
      setIsFetchingSoil(false);
    }
  };

  const handleChange = (field: keyof PredictionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/predict-yield", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          state: stateDistrict.state,
          district: stateDistrict.district,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Prediction failed");
      }

      const result = await response.json();
      router.push(`/prediction-result/${result.predictionId}`);
    } catch (error: any) {
      console.error("Prediction error:", error);
      alert(error.message || "Failed to generate prediction");
    } finally {
      setIsLoading(false);
    }
  };

  if (farms.length === 0) {
    return (
      <Alert className="max-w-2xl mx-auto">
        <AlertDescription className="flex items-center justify-between">
          <span>Please add a farm first before making predictions.</span>
          <Button onClick={() => router.push("/farm-profile")} className="ml-4">
            Add Farm
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🌾 Crop Yield Prediction</h1>
        <p className="text-muted-foreground">
          Get AI-powered crop yield predictions based on your farm conditions
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Farm Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Select Farm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={formData.farmId} onValueChange={handleFarmChange} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your farm" />
              </SelectTrigger>
              <SelectContent>
                {farms.map(farm => (
                  <SelectItem key={farm.id} value={farm.id}>
                    {farm.name} - {farm.location} ({farm.totalArea} acres)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {stateDistrict.state && (
              <p className="text-sm text-muted-foreground mt-2">
                📍 {stateDistrict.district}, {stateDistrict.state}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Crop Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sprout className="w-5 h-5" />
              Crop Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cropType">Crop Type *</Label>
              <Select value={formData.cropType} onValueChange={(v) => handleChange("cropType", v)} required>
                <SelectTrigger id="cropType">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  {CROPS.map(crop => (
                    <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cropCategory">Crop Category *</Label>
              <Select value={formData.cropCategory} onValueChange={(v) => handleChange("cropCategory", v)} required>
                <SelectTrigger id="cropCategory">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CROP_CATEGORIES.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">Season *</Label>
              <Select value={formData.season} onValueChange={(v) => handleChange("season", v)} required>
                <SelectTrigger id="season">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {SEASONS.map(season => (
                    <SelectItem key={season.value} value={season.value}>{season.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fieldArea">Field Area (acres) *</Label>
              <Input
                id="fieldArea"
                type="number"
                step="0.01"
                placeholder="e.g., 5.5"
                value={formData.fieldArea}
                onChange={(e) => handleChange("fieldArea", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="plantingDate">
                <Calendar className="w-4 h-4 inline mr-1" />
                Planting Date *
              </Label>
              <Input
                id="plantingDate"
                type="date"
                value={formData.plantingDate}
                onChange={(e) => handleChange("plantingDate", e.target.value)}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Weather Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CloudRain className="w-5 h-5" />
                Weather Conditions
              </span>
              {isFetchingWeather && (
                <span className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Fetching...
                </span>
              )}
            </CardTitle>
            <CardDescription>
              {selectedFarm ? (
                <>
                  {isFetchingWeather 
                    ? "Fetching real-time weather data..." 
                    : formData.avgTemperature 
                      ? "Real-time data fetched. You can adjust values if needed."
                      : "Select a farm to auto-fetch weather data"}
                </>
              ) : (
                "Select a farm first to fetch weather data"
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="avgTemperature">
                <Thermometer className="w-4 h-4 inline mr-1" />
                Temperature (°C) *
              </Label>
              <Input
                id="avgTemperature"
                type="number"
                step="0.1"
                placeholder="Auto-fetched or enter manually"
                value={formData.avgTemperature}
                onChange={(e) => handleChange("avgTemperature", e.target.value)}
                required
                disabled={isFetchingWeather}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalRainfall">
                <CloudRain className="w-4 h-4 inline mr-1" />
                Rainfall (mm) *
              </Label>
              <Input
                id="totalRainfall"
                type="number"
                step="0.1"
                placeholder="Auto-fetched or enter manually"
                value={formData.totalRainfall}
                onChange={(e) => handleChange("totalRainfall", e.target.value)}
                required
                disabled={isFetchingWeather}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="humidityLevel">
                <Droplets className="w-4 h-4 inline mr-1" />
                Humidity (%) *
              </Label>
              <Input
                id="humidityLevel"
                type="number"
                step="0.1"
                placeholder="Auto-fetched or enter manually"
                value={formData.humidityLevel}
                onChange={(e) => handleChange("humidityLevel", e.target.value)}
                required
                disabled={isFetchingWeather}
              />
            </div>
            
            {!selectedFarm && (
              <div className="md:col-span-3">
                <Alert>
                  <AlertDescription className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Please select a farm first to auto-fetch weather data
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Soil Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Soil Nutrients (NPK + pH)</span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={fetchSoilData}
                disabled={!selectedFarm || isFetchingSoil}
              >
                {isFetchingSoil ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Fetching...
                  </>
                ) : (
                  "Fetch Soil Data"
                )}
              </Button>
            </CardTitle>
            <CardDescription>
              {selectedFarm 
                ? "Click 'Fetch Soil Data' to auto-fill or enter values from soil test report"
                : "Select a farm first to fetch soil data"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="soilPh">Soil pH *</Label>
              <Input
                id="soilPh"
                type="number"
                step="0.1"
                placeholder="e.g., 6.5"
                value={formData.soilPh}
                onChange={(e) => handleChange("soilPh", e.target.value)}
                required
                disabled={isFetchingSoil}
              />
              <p className="text-xs text-muted-foreground">Optimal: 5.5 - 8.0</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nitrogenContent">Nitrogen (N) kg/ha *</Label>
              <Input
                id="nitrogenContent"
                type="number"
                placeholder="e.g., 280"
                value={formData.nitrogenContent}
                onChange={(e) => handleChange("nitrogenContent", e.target.value)}
                required
                disabled={isFetchingSoil}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phosphorusContent">Phosphorus (P) kg/ha *</Label>
              <Input
                id="phosphorusContent"
                type="number"
                placeholder="e.g., 40"
                value={formData.phosphorusContent}
                onChange={(e) => handleChange("phosphorusContent", e.target.value)}
                required
                disabled={isFetchingSoil}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="potassiumContent">Potassium (K) kg/ha *</Label>
              <Input
                id="potassiumContent"
                type="number"
                placeholder="e.g., 40"
                value={formData.potassiumContent}
                onChange={(e) => handleChange("potassiumContent", e.target.value)}
                required
                disabled={isFetchingSoil}
              />
            </div>
            
            {!selectedFarm && (
              <div className="md:col-span-2">
                <Alert>
                  <AlertDescription className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Please select a farm first to fetch soil data
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Farming Practices */}
        <Card>
          <CardHeader>
            <CardTitle>Farming Practices</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fertilizerType">Fertilizer Type *</Label>
              <Select value={formData.fertilizerType} onValueChange={(v) => handleChange("fertilizerType", v)} required>
                <SelectTrigger id="fertilizerType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ORGANIC">Organic</SelectItem>
                  <SelectItem value="CHEMICAL">Chemical</SelectItem>
                  <SelectItem value="MIXED">Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="seedQuality">Seed Quality *</Label>
              <Select value={formData.seedQuality} onValueChange={(v) => handleChange("seedQuality", v)} required>
                <SelectTrigger id="seedQuality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">High Quality</SelectItem>
                  <SelectItem value="MEDIUM">Medium Quality</SelectItem>
                  <SelectItem value="LOW">Low Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Prediction...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Yield Prediction
                </>
              )}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-3">
              AI prediction using trained ML model on Indian agricultural data
            </p>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}