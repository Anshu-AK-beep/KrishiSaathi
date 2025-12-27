import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const farmId = searchParams.get("farmId");

    if (!farmId) {
      return NextResponse.json(
        { error: "Farm ID is required" },
        { status: 400 }
      );
    }

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const farm = await prisma.farm.findFirst({
      where: {
        id: farmId,
        userId: user.id,
      },
    });

    if (!farm) {
      return NextResponse.json(
        { error: "Farm not found or access denied" },
        { status: 404 }
      );
    }

    console.log(`Fetching soil data for farm: ${farm.name}`);

    if (farm.latitude && farm.longitude) {
      try {
        const lat = Number(farm.latitude);
        const lon = Number(farm.longitude);
        
        const soilResponse = await fetch(
          `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=phh2o&property=nitrogen&property=soc&property=cec&depth=0-5cm&value=mean`,
          {
            headers: { "Accept": "application/json" },
            next: { revalidate: 86400 }
          }
        );

        if (soilResponse.ok) {
          const soilData = await soilResponse.json();
          
          const properties = soilData.properties?.layers || [];
          
          let ph = 6.5;
          let nitrogen = 200;
          let organicCarbon = 1.5;
          
          const phData = properties.find((p: any) => p.name === "phh2o");
          if (phData?.depths?.[0]?.values?.mean) {
            ph = phData.depths[0].values.mean / 10;
          }
          
          const nData = properties.find((p: any) => p.name === "nitrogen");
          if (nData?.depths?.[0]?.values?.mean) {
            nitrogen = nData.depths[0].values.mean * 15;
          }
          
          const socData = properties.find((p: any) => p.name === "soc");
          if (socData?.depths?.[0]?.values?.mean) {
            organicCarbon = socData.depths[0].values.mean / 10;
          }

          const estimates = estimateNPKFromSoil(farm.soilType, organicCarbon);

          return NextResponse.json({
            ph: Math.round(ph * 10) / 10,
            nitrogen: Math.round(nitrogen),
            phosphorus: estimates.phosphorus,
            potassium: estimates.potassium,
            organicCarbon: Math.round(organicCarbon * 10) / 10,
            source: "SoilGrids API + estimates",
            message: "P and K values are estimated based on soil type"
          });
        }
      } catch (error) {
        console.error("SoilGrids API error:", error);
      }
    }

    const soilDefaults = getSoilDefaults(farm.soilType);
    
    return NextResponse.json({
      ...soilDefaults,
      source: "estimated",
      message: "Values are estimated based on soil type. For accurate results, conduct soil testing."
    });

  } catch (error: any) {
    console.error("Soil data error:", error);
    
    return NextResponse.json({
      ph: 6.5,
      nitrogen: 200,
      phosphorus: 35,
      potassium: 220,
      source: "default",
      message: "Using default values"
    });
  }
}

function estimateNPKFromSoil(soilType: string, organicCarbon: number) {
  const baseValues = getSoilDefaults(soilType);
  
  const organicFactor = Math.min(1.3, Math.max(0.7, organicCarbon / 1.5));
  
  return {
    nitrogen: Math.round(baseValues.nitrogen * organicFactor),
    phosphorus: Math.round(baseValues.phosphorus * organicFactor),
    potassium: Math.round(baseValues.potassium * organicFactor),
  };
}

function getSoilDefaults(soilType: string) {
  const defaults: any = {
    "CLAY": {
      ph: 7.2,
      nitrogen: 250,
      phosphorus: 35,
      potassium: 280,
      description: "Clay soils are nutrient-rich but may have drainage issues"
    },
    "SANDY": {
      ph: 6.0,
      nitrogen: 150,
      phosphorus: 25,
      potassium: 180,
      description: "Sandy soils drain well but may need more frequent fertilization"
    },
    "LOAMY": {
      ph: 6.8,
      nitrogen: 280,
      phosphorus: 45,
      potassium: 240,
      description: "Loamy soils are ideal for most crops with good nutrient retention"
    },
    "SILT": {
      ph: 6.5,
      nitrogen: 220,
      phosphorus: 38,
      potassium: 210,
      description: "Silty soils have good moisture and nutrient retention"
    },
    "BLACK": {
      ph: 7.5,
      nitrogen: 300,
      phosphorus: 40,
      potassium: 320,
      description: "Black cotton soil - excellent for cotton and pulses"
    },
    "RED": {
      ph: 6.2,
      nitrogen: 180,
      phosphorus: 30,
      potassium: 200,
      description: "Red soils are good for groundnut, pulses, and millets"
    },
    "ALLUVIAL": {
      ph: 7.0,
      nitrogen: 260,
      phosphorus: 42,
      potassium: 250,
      description: "Alluvial soils are highly fertile and suitable for most crops"
    },
    "LATERITE": {
      ph: 5.8,
      nitrogen: 160,
      phosphorus: 28,
      potassium: 190,
      description: "Laterite soils need lime application and organic matter"
    },
    "MIXED": {
      ph: 6.5,
      nitrogen: 200,
      phosphorus: 35,
      potassium: 220,
      description: "Mixed soil type - values are general estimates"
    },
  };

  return defaults[soilType] || defaults["MIXED"];
}