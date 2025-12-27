// src/app/api/detect-soil-type/route.ts
import { NextResponse } from "next/server";

// Define soil type as a union of valid values
type SoilType = 
  | "ALLUVIAL" 
  | "LOAMY" 
  | "RED" 
  | "LATERITE" 
  | "BLACK" 
  | "SANDY" 
  | "CLAY" 
  | "MIXED";

// Soil type mapping by Indian states and regions
const SOIL_TYPE_BY_REGION: Record<string, SoilType> = {
  // North India
  "Punjab": "ALLUVIAL",
  "Haryana": "ALLUVIAL",
  "Uttar Pradesh": "ALLUVIAL",
  "Uttarakhand": "LOAMY",
  "Himachal Pradesh": "LOAMY",
  "Jammu and Kashmir": "LOAMY",
  "Delhi": "ALLUVIAL",
  
  // South India
  "Tamil Nadu": "RED",
  "Kerala": "LATERITE",
  "Karnataka": "RED",
  "Andhra Pradesh": "BLACK",
  "Telangana": "BLACK",
  
  // West India
  "Maharashtra": "BLACK",
  "Gujarat": "BLACK",
  "Rajasthan": "SANDY",
  "Goa": "LATERITE",
  
  // East India
  "West Bengal": "ALLUVIAL",
  "Bihar": "ALLUVIAL",
  "Jharkhand": "RED",
  "Odisha": "RED",
  
  // Central India
  "Madhya Pradesh": "BLACK",
  "Chhattisgarh": "RED",
  
  // Northeast
  "Assam": "ALLUVIAL",
  "Meghalaya": "RED",
  "Manipur": "RED",
  "Nagaland": "RED",
  "Tripura": "ALLUVIAL",
  "Mizoram": "RED",
  "Arunachal Pradesh": "LOAMY",
  "Sikkim": "LOAMY",
};

// District-specific overrides for more accuracy
const DISTRICT_SOIL_TYPE: Record<string, SoilType> = {
  "Vidarbha": "BLACK", // Maharashtra region
  "Marathwada": "BLACK",
  "Malwa": "BLACK", // MP region
  "Bundelkhand": "MIXED",
  "Konkan": "LATERITE",
  "Doab": "ALLUVIAL",
  "Thar": "SANDY",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const location = searchParams.get("location");

    if (!location) {
      return NextResponse.json(
        { error: "Location is required" },
        { status: 400 }
      );
    }

    console.log("Detecting soil type for location:", location);

    // Extract state and district
    const { state, district } = extractLocationParts(location);

    // Check district-specific mapping first
    for (const [region, soilType] of Object.entries(DISTRICT_SOIL_TYPE)) {
      if (location.toLowerCase().includes(region.toLowerCase())) {
        return NextResponse.json({
          soilType,
          confidence: "high",
          source: "district-specific",
          state,
          district,
          description: getSoilDescription(soilType),
        });
      }
    }

    // Check state-level mapping
    const soilType: SoilType = SOIL_TYPE_BY_REGION[state] || "LOAMY";

    return NextResponse.json({
      soilType,
      confidence: state in SOIL_TYPE_BY_REGION ? "medium" : "low",
      source: "state-level",
      state,
      district,
      description: getSoilDescription(soilType),
      alternatives: getAlternativeSoilTypes(state),
    });

  } catch (error: any) {
    console.error("Soil type detection error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to detect soil type" },
      { status: 500 }
    );
  }
}

function extractLocationParts(location: string): { state: string; district: string } {
  const parts = location.split(",").map(s => s.trim());
  
  const indianStates = Object.keys(SOIL_TYPE_BY_REGION);
  
  let state = "";
  let district = "";

  for (const stateName of indianStates) {
    if (location.toLowerCase().includes(stateName.toLowerCase())) {
      state = stateName;
      break;
    }
  }

  if (parts.length >= 2) {
    if (state) {
      const stateIndex = parts.findIndex(p => 
        p.toLowerCase().includes(state.toLowerCase())
      );
      if (stateIndex > 0) {
        district = parts[stateIndex - 1];
      }
    } else {
      district = parts[0];
      state = parts[parts.length - 1];
    }
  } else if (parts.length === 1) {
    district = parts[0];
  }

  return { state: state || "Unknown", district: district || "Unknown" };
}

function getSoilDescription(soilType: SoilType): string {
  const descriptions: Record<SoilType, string> = {
    "ALLUVIAL": "Highly fertile soil, rich in nutrients. Ideal for rice, wheat, sugarcane, and vegetables.",
    "BLACK": "Rich in calcium, iron, and clay. Best for cotton, pulses, jowar, and oilseeds.",
    "RED": "High iron content, porous. Suitable for groundnut, millets, pulses, and oilseeds.",
    "LATERITE": "High in iron and aluminum. Good for cashew, coconut, coffee, and tea with proper fertilization.",
    "SANDY": "Light, well-drained. Suitable for millets, groundnut, and vegetables with proper irrigation.",
    "LOAMY": "Balanced mix of sand, silt, and clay. Ideal for most crops including wheat, maize, and vegetables.",
    "CLAY": "Heavy, retains water well. Good for rice, wheat, and crops requiring moisture.",
    "MIXED": "Combination of soil types. Suitable for diverse crops based on specific composition.",
  };

  return descriptions[soilType];
}

function getAlternativeSoilTypes(state: string): SoilType[] {
  const alternatives: Record<string, SoilType[]> = {
    "Uttar Pradesh": ["ALLUVIAL", "LOAMY", "CLAY"],
    "Maharashtra": ["BLACK", "RED", "LATERITE"],
    "Rajasthan": ["SANDY", "MIXED", "LOAMY"],
    "Tamil Nadu": ["RED", "BLACK", "ALLUVIAL"],
  };

  return alternatives[state] || ["LOAMY", "MIXED"];
}