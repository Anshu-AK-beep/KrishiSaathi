// src/app/api/weather/route.ts
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (!lat || !lon) {
      return NextResponse.json(
        { error: "Latitude and longitude are required" },
        { status: 400 }
      );
    }

    console.log(`Fetching weather for: ${lat}, ${lon}`);

    // Try OpenWeatherMap first (if API key is available)
    if (process.env.OPENWEATHER_API_KEY) {
      try {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`,
          { next: { revalidate: 3600 } } // Cache for 1 hour
        );

        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          
          return NextResponse.json({
            temperature: Math.round(weatherData.main.temp * 10) / 10,
            humidity: weatherData.main.humidity,
            rainfall: weatherData.rain?.["1h"] || weatherData.rain?.["3h"] || 5, // Default 5mm if no rain data
            windSpeed: weatherData.wind.speed,
            description: weatherData.weather[0].description,
            icon: weatherData.weather[0].icon,
            source: "OpenWeatherMap"
          });
        }
      } catch (error) {
        console.error("OpenWeatherMap API error:", error);
        // Continue to fallback
      }
    }

    // Fallback: Open-Meteo API (Free, no API key required)
    try {
      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&timezone=auto`,
        { next: { revalidate: 3600 } }
      );

      if (weatherResponse.ok) {
        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        return NextResponse.json({
          temperature: Math.round(current.temperature_2m * 10) / 10,
          humidity: current.relative_humidity_2m,
          rainfall: current.precipitation || 5, // Default 5mm if no precipitation
          windSpeed: current.wind_speed_10m,
          description: "Current weather conditions",
          source: "Open-Meteo"
        });
      }
    } catch (error) {
      console.error("Open-Meteo API error:", error);
      // Continue to fallback
    }

    // Final fallback: Return seasonal defaults based on location
    const defaults = getSeasonalDefaults(parseFloat(lat), parseFloat(lon));
    
    return NextResponse.json({
      ...defaults,
      source: "estimated",
      message: "Using estimated values based on seasonal patterns"
    });

  } catch (error: any) {
    console.error("Weather API error:", error);
    
    // Return reasonable defaults instead of error
    return NextResponse.json({
      temperature: 28.0,
      humidity: 65,
      rainfall: 100,
      windSpeed: 5,
      description: "Unable to fetch real-time data",
      source: "default"
    });
  }
}

function getSeasonalDefaults(lat: number, lon: number) {
  const month = new Date().getMonth() + 1; // 1-12
  
  // Determine season
  let temperature = 28;
  let humidity = 65;
  let rainfall = 100;

  if (month >= 3 && month <= 5) {
    // Summer (March-May)
    temperature = 32;
    humidity = 50;
    rainfall = 50;
  } else if (month >= 6 && month <= 9) {
    // Monsoon (June-September)
    temperature = 28;
    humidity = 80;
    rainfall = 200;
  } else if (month >= 10 && month <= 11) {
    // Post-Monsoon (October-November)
    temperature = 25;
    humidity = 70;
    rainfall = 80;
  } else {
    // Winter (December-February)
    temperature = 20;
    humidity = 60;
    rainfall = 30;
  }

  return {
    temperature,
    humidity,
    rainfall,
    windSpeed: 5,
    description: `Seasonal average for ${getSeasonName(month)}`,
  };
}

function getSeasonName(month: number): string {
  if (month >= 3 && month <= 5) return "Summer";
  if (month >= 6 && month <= 9) return "Monsoon";
  if (month >= 10 && month <= 11) return "Post-Monsoon";
  return "Winter";
}