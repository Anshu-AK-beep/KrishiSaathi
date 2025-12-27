from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
from api_helpers import get_weather_data, get_district_coordinates, get_soil_data

import os
import joblib
import requests

MODEL_PATH = "enhanced_model.pkl"
MODEL_URL = os.getenv("MODEL_URL")

if not os.path.exists(MODEL_PATH):
    r = requests.get(MODEL_URL)
    with open(MODEL_PATH, "wb") as f:
        f.write(r.content)

model = joblib.load(MODEL_PATH)


def safe_transform(encoder, val, label_type):
    classes = encoder.classes_
    if val in classes:
        return encoder.transform([val])[0]
    else:
        raise ValueError(f"{label_type} '{val}' not recognized in model encoder.")


app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from your frontend

# Load saved model and encoders
with open('enhanced_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('encoders.pkl', 'rb') as f:
    encoders = pickle.load(f)

print("Known districts:", encoders['district'].classes_)

# Replace this with your actual OpenWeatherMap API key:
WEATHER_API_KEY = "1c1fa8ef335b301e4a6dfec47d08ef5c"

@app.route('/')
def home():
    return jsonify({
        "message": "KrishiSaathi Crop Yield Prediction API is running"
    })

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Extract input fields
        state = data.get('state')
        district = data.get('district')
        season = data.get('season')
        crop = data.get('crop')
        area = float(data.get('area', 1.0))

        # Safe label encoding helper
        def safe_transform(encoder, val, label_type):
            if val in encoder.classes_:
                return encoder.transform([val])[0]
            else:
                raise ValueError(f"{label_type} '{val}' not recognized in model encoder.")

        # Encode categorical inputs safely
        try:
            state_enc = safe_transform(encoders['state'], state, 'State')
            district_enc = safe_transform(encoders['district'], district, 'District')
            season_enc = safe_transform(encoders['season'], season, 'Season')
            crop_enc = safe_transform(encoders['crop'], crop, 'Crop')
        except ValueError as ve:
            return jsonify({
                "success": False,
                "error": str(ve)
            }), 400

        # Get coordinates for district
        lat, lon = get_district_coordinates(district, state)

        # Get real-time weather & soil data
        weather = get_weather_data(lat, lon, WEATHER_API_KEY)
        soil = get_soil_data(district, state)

        # Prepare features for prediction
        features = np.array([[
            state_enc,
            district_enc,
            season_enc,
            crop_enc,
            area,
            weather['temperature'],
            weather['rainfall'],
            soil['nitrogen'],
            soil['phosphorus'],
            soil['potassium'],
            soil['ph']
        ]])

        # Make prediction
        prediction = model.predict(features)[0]
        yield_per_hectare = prediction / area if area > 0 else 0

        # Return results
        return jsonify({
            "success": True,
            "predicted_production": round(prediction, 2),
            "yield_per_hectare": round(yield_per_hectare, 2),
            "unit": "tonnes",
            "weather_data": weather,
            "soil_data": soil,
            "recommendations": generate_recommendations(yield_per_hectare, soil)
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400


def generate_recommendations(yield_val, soil):
    recs = []
    if yield_val < 2:
        recs.append("कम उपज - मिट्टी की जांच करें")
        recs.append("Improve soil fertility and irrigation")
    elif yield_val > 5:
        recs.append("उत्कृष्ट उपज!")
        recs.append("Maintain current farming practices")

    if soil['ph'] < 6.0:
        recs.append("मिट्टी अम्लीय है - चूना डालें")
    elif soil['ph'] > 8.0:
        recs.append("मिट्टी क्षारीय है - जैविक पदार्थ डालें")
    return recs

if __name__ == '__main__':
    app.run(debug=True, port=5000)
