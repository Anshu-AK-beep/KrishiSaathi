"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Droplets, Wind, Thermometer } from "lucide-react";
import { useEffect, useState } from "react";

interface WeatherCardProps {
  farmLocation: string | undefined;
  latitude: any;
  longitude: any;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  rainfall: number;
  condition: string;
}

function WeatherCard({ farmLocation, latitude, longitude }: WeatherCardProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (latitude && longitude) {
      fetchWeather();
    } else {
      setLoading(false);
    }
  }, [latitude, longitude]);

  const fetchWeather = async () => {
    try {
      const res = await fetch(`/api/weather?lat=${latitude}&lon=${longitude}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
      }
    } catch (error) {
      console.error("Failed to fetch weather:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!farmLocation) {
    return (
      <Card className="border-2 border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Cloud className="size-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Location Set</h3>
          <p className="text-sm text-muted-foreground text-center">
            Add your farm location to see weather data
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="size-5 text-primary" />
          Weather Conditions
        </CardTitle>
        <CardDescription>Real-time weather data for {farmLocation}</CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : weather ? (
          <div className="space-y-4">
            {/* Weather Condition */}
            <div className="text-center py-4">
              <p className="text-3xl font-bold">{weather.temperature}°C</p>
              <p className="text-muted-foreground">{weather.condition}</p>
            </div>

            {/* Weather Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Droplets className="size-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="font-semibold">{weather.humidity}%</p>
              </div>

              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Wind className="size-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Wind</p>
                <p className="font-semibold">{weather.windSpeed} km/h</p>
              </div>

              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Cloud className="size-5 text-primary mx-auto mb-1" />
                <p className="text-xs text-muted-foreground">Rainfall</p>
                <p className="font-semibold">{weather.rainfall} mm</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Unable to fetch weather data</p>
            <p className="text-sm">Please check your location coordinates</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WeatherCard;