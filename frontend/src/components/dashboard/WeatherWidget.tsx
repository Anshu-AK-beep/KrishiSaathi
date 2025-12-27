"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Droplets, Wind } from "lucide-react";
import { useEffect, useState } from "react";

interface WeatherWidgetProps {
  farmLocation: string;
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

function WeatherWidget({ farmLocation, latitude, longitude }: WeatherWidgetProps) {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Cloud className="size-5 text-primary" />
          Weather
        </CardTitle>
        <CardDescription>{farmLocation}</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : weather ? (
          <div className="space-y-4">
            {/* Temperature */}
            <div className="text-center pb-4 border-b">
              <div className="text-4xl font-bold text-primary">{weather.temperature}°C</div>
              <p className="text-sm text-muted-foreground mt-1">{weather.condition}</p>
            </div>

            {/* Weather Details */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Droplets className="size-4 text-primary mx-auto mb-1" />
                <div className="text-xs text-muted-foreground">Humidity</div>
                <div className="font-semibold">{weather.humidity}%</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Wind className="size-4 text-primary mx-auto mb-1" />
                <div className="text-xs text-muted-foreground">Wind</div>
                <div className="font-semibold">{weather.windSpeed} km/h</div>
              </div>
              <div className="text-center p-3 bg-muted/30 rounded-lg">
                <Cloud className="size-4 text-primary mx-auto mb-1" />
                <div className="text-xs text-muted-foreground">Rain</div>
                <div className="font-semibold">{weather.rainfall} mm</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Cloud className="size-12 mx-auto mb-2 opacity-20" />
            <p className="text-sm">Weather data unavailable</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default WeatherWidget;