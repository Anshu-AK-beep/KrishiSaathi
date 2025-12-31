from flask import Flask, request, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return jsonify({
        "message": "KrishiSaathi Crop Yield Prediction API is running"
    })

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'healthy'}), 200

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Mock prediction for demo
        area = float(data.get('area', 1.0))
        prediction = 150.5 * area  # Simple calculation
        yield_per_hectare = prediction / area if area > 0 else 0
        
        return jsonify({
            "success": True,
            "predicted_production": round(prediction, 2),
            "yield_per_hectare": round(yield_per_hectare, 2),
            "unit": "tonnes",
            "recommendations": [
                "Good soil conditions detected",
                "Maintain current irrigation practices"
            ]
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)