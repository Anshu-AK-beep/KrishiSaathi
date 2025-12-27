// src/app/api/extract-location/route.ts
import { NextResponse } from "next/server";

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

    console.log("Extracting state/district from:", location);

    // Try to extract state and district from location string
    const extracted = extractStateDistrict(location);

    if (extracted.state && extracted.district) {
      return NextResponse.json(extracted);
    }

    // If extraction failed, try geocoding API
    try {
      const geocodeResponse = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&addressdetails=1&limit=1`,
        {
          headers: {
            "User-Agent": "KrishiSaathi/1.0"
          }
        }
      );

      if (geocodeResponse.ok) {
        const geocodeData = await geocodeResponse.json();
        
        if (geocodeData.length > 0) {
          const address = geocodeData[0].address;
          
          return NextResponse.json({
            state: address.state || extracted.state || "Unknown",
            district: address.state_district || address.county || extracted.district || "Unknown",
            fullAddress: geocodeData[0].display_name
          });
        }
      }
    } catch (error) {
      console.error("Geocoding error:", error);
    }

    // Return extracted values or defaults
    return NextResponse.json({
      state: extracted.state || "Uttar Pradesh",
      district: extracted.district || "Unknown",
      message: "Location extracted with partial confidence"
    });

  } catch (error: any) {
    console.error("Location extraction error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to extract location" },
      { status: 500 }
    );
  }
}

function extractStateDistrict(location: string): { state: string; district: string } {
  // Common patterns: "Village, District, State" or "District, State"
  const parts = location.split(",").map(s => s.trim());
  
  // Indian states list for matching
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh",
    "Andaman and Nicobar", "Dadra and Nagar Haveli", "Daman and Diu", "Lakshadweep"
  ];

  let state = "";
  let district = "";

  // Find state in location string
  for (const stateName of indianStates) {
    if (location.toLowerCase().includes(stateName.toLowerCase())) {
      state = stateName;
      break;
    }
  }

  // Extract district
  if (parts.length >= 2) {
    // If we found a state, the part before it is likely the district
    if (state) {
      const stateIndex = parts.findIndex(p => 
        p.toLowerCase().includes(state.toLowerCase())
      );
      if (stateIndex > 0) {
        district = parts[stateIndex - 1];
      }
    } else {
      // Otherwise, assume pattern is "District, State"
      district = parts[0];
      state = parts[parts.length - 1];
    }
  } else if (parts.length === 1) {
    district = parts[0];
  }

  // Clean up district name (remove common suffixes)
  district = district
    .replace(/\s*(district|zila|dist\.?)\s*/gi, "")
    .trim();

  return {
    state: state || "",
    district: district || ""
  };
}