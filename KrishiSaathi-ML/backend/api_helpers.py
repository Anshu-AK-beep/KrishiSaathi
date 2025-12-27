import requests

def get_weather_data(lat, lon, api_key):
    """Fetch current weather from OpenWeatherMap."""
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "lat": lat,
        "lon": lon,
        "appid": api_key,
        "units": "metric"
    }
    try:
        response = requests.get(url, params=params)
        data = response.json()
        return {
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "rainfall": data.get("rain", {}).get("1h", 0.0)
        }
    except Exception as e:
        print(f"Error fetching weather: {e}")
        # Return default values if API fails
        return {
            "temperature": 25.0,
            "humidity": 60,
            "rainfall": 0.0
        }

import requests

def get_coordinates_from_postal(postal_code):
    """Fetch lat/lon for a postal code using OpenStreetMap Nominatim API."""
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "postalcode": postal_code,
        "country": "India",
        "format": "json"
    }
    try:
        response = requests.get(url, params=params, headers={"User-Agent": "Mozilla/5.0"})
        data = response.json()
        if data:
            lat = float(data[0]['lat'])
            lon = float(data[0]['lon'])
            return lat, lon
        else:
            print("Postal code not found, defaulting to Delhi coordinates")
            return 28.7041, 77.1025  # Delhi lat/lon as default
    except Exception as e:
        print(f"Error fetching coordinates: {e}")
        return 28.7041, 77.1025  # Delhi lat/lon as default
    
def get_district_coordinates(district, state):
    # Map districts to postal codes (expand as needed)
    postal_code_map = {
        "Loni": "201102",
        "Ludhiana": "141001",
        "Patiala": "147001",
        # Add more as needed
    }
    postal_code = postal_code_map.get(district)
    if postal_code:
        return get_coordinates_from_postal(postal_code)
    else:
        # Default to Delhi
        return 28.7041, 77.1025


def get_soil_data(district, state):
    """Return average soil metrics.
       Extend or replace with satellite/API data later."""
    return {
        "nitrogen": 50.0,
        "phosphorus": 30.0,
        "potassium": 40.0,
        "ph": 6.5
    }
