import { NextResponse } from "next/server";

// GET - Fetch weather data by coordinates
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

    // OPTION 1: OpenWeatherMap API (Recommended - Free tier available)
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

    if (OPENWEATHER_API_KEY) {
      const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      
      const weatherResponse = await fetch(weatherUrl);
      
      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data from OpenWeatherMap");
      }

      const weatherData = await weatherResponse.json();

      // Transform to our format
      const formattedData = {
        temperature: Math.round(weatherData.main.temp),
        humidity: weatherData.main.humidity,
        windSpeed: Math.round(weatherData.wind.speed * 3.6), // Convert m/s to km/h
        rainfall: weatherData.rain?.["1h"] || 0,
        condition: weatherData.weather[0].main,
        description: weatherData.weather[0].description,
        icon: weatherData.weather[0].icon,
      };

      return NextResponse.json(formattedData);
    }

    // OPTION 2: WeatherAPI.com (Alternative - Free tier available)
    const WEATHERAPI_KEY = process.env.WEATHERAPI_KEY;

    if (WEATHERAPI_KEY) {
      const weatherUrl = `https://api.weatherapi.com/v1/current.json?key=${WEATHERAPI_KEY}&q=${lat},${lon}&aqi=no`;
      
      const weatherResponse = await fetch(weatherUrl);
      
      if (!weatherResponse.ok) {
        throw new Error("Failed to fetch weather data from WeatherAPI");
      }

      const weatherData = await weatherResponse.json();

      const formattedData = {
        temperature: Math.round(weatherData.current.temp_c),
        humidity: weatherData.current.humidity,
        windSpeed: Math.round(weatherData.current.wind_kph),
        rainfall: weatherData.current.precip_mm,
        condition: weatherData.current.condition.text,
        description: weatherData.current.condition.text,
        icon: weatherData.current.condition.icon,
      };

      return NextResponse.json(formattedData);
    }

    // OPTION 3: Mock data for testing (when no API key is set)
    console.warn("No weather API key found. Returning mock data.");
    
    const mockData = {
      temperature: 28,
      humidity: 65,
      windSpeed: 12,
      rainfall: 0,
      condition: "Partly Cloudy",
      description: "Partly cloudy with light winds",
      icon: "03d",
    };

    return NextResponse.json(mockData);

  } catch (error) {
    console.error("Error fetching weather data:", error);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}