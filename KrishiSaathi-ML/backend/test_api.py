from api_helpers import get_weather_data, get_coordinates_from_postal

API_KEY = "1c1fa8ef335b301e4a6dfec47d08ef5c"

postal_code = "201102"  # Loni postal code

lat, lon = get_coordinates_from_postal(postal_code)
weather = get_weather_data(lat, lon, API_KEY)

print(f"Weather data for postal code {postal_code}:")
print(weather)
