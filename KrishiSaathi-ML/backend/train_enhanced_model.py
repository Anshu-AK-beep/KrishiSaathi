# train_enhanced_model.py

import pandas as pd
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import pickle

# Step 1: Load dataset
df = pd.read_csv('../ml-model/Crop-Yield-Prediction-in-India-using-ML/crop_production.csv')
print(f"Dataset loaded: {len(df)} rows")

# Step 2: Create and fit label encoders for categorical columns
le_state = LabelEncoder()
le_district = LabelEncoder()
le_season = LabelEncoder()
le_crop = LabelEncoder()

df['State_encoded'] = le_state.fit_transform(df['State_Name'])
df['District_encoded'] = le_district.fit_transform(df['District_Name'])
df['Season_encoded'] = le_season.fit_transform(df['Season'])
df['Crop_encoded'] = le_crop.fit_transform(df['Crop'])

# Step 3: Add static real-time API-inspired feature columns as placeholders
df['Temperature'] = 25.0    # degrees Celsius
df['Rainfall'] = 100.0      # millimeters/year
df['Soil_N'] = 50.0         # Nitrogen content
df['Soil_P'] = 30.0         # Phosphorus content
df['Soil_K'] = 40.0         # Potassium content
df['Soil_pH'] = 6.5         # Soil pH level

# Step 4: Select feature columns and target variable
feature_cols = [
    'State_encoded', 'District_encoded', 'Season_encoded', 'Crop_encoded',
    'Area', 'Temperature', 'Rainfall', 'Soil_N', 'Soil_P', 'Soil_K', 'Soil_pH'
]

X = df[feature_cols]
y = df['Production']

# Step 5: Fill missing values if any (safe practice)
X = X.fillna(0)
y = y.fillna(0)

# Step 6: Split dataset into train and test sets (80% train, 20% test)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Step 7: Create and train Random Forest Regressor
model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
print("Training enhanced model...")
model.fit(X_train, y_train)

# Step 8: Evaluate the model on test data
score = model.score(X_test, y_test)
print(f"Model R² Score: {score:.4f}")

# Step 9: Save the trained model as a pickle file
with open('enhanced_model.pkl', 'wb') as f:
    pickle.dump(model, f)

# Step 10: Save label encoders to a separate pickle file for later use
encoders = {
    'state': le_state,
    'district': le_district,
    'season': le_season,
    'crop': le_crop
}

with open('encoders.pkl', 'wb') as f:
    pickle.dump(encoders, f)

print("✓ Enhanced model and encoders saved successfully!")
