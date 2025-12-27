import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sprout, AlertCircle, CheckCircle } from "lucide-react";
import { Farm } from "@prisma/client";

interface SoilHealthCardProps {
  farm: Farm | null;
}

function SoilHealthCard({ farm }: SoilHealthCardProps) {
  if (!farm) {
    return null;
  }

  // Determine soil pH health status
  const getSoilPHStatus = (ph: number | null) => {
    if (!ph) return { status: "Unknown", color: "text-gray-500", icon: AlertCircle };
    if (ph >= 6.0 && ph <= 7.5) return { status: "Optimal", color: "text-green-600", icon: CheckCircle };
    if (ph >= 5.5 && ph < 6.0) return { status: "Slightly Acidic", color: "text-yellow-600", icon: AlertCircle };
    if (ph > 7.5 && ph <= 8.0) return { status: "Slightly Alkaline", color: "text-yellow-600", icon: AlertCircle };
    return { status: "Needs Attention", color: "text-red-600", icon: AlertCircle };
  };

  const phValue = farm.soilPh ? Number(farm.soilPh) : null;
  const phStatus = getSoilPHStatus(phValue);
  const StatusIcon = phStatus.icon;

  // Soil recommendations based on type
  const getSoilRecommendations = (soilType: string) => {
    const recommendations: Record<string, string[]> = {
      ALLUVIAL: ["Ideal for cereals and cash crops", "Good water retention", "Rich in nutrients"],
      CLAY: ["Heavy texture requires good drainage", "High water retention", "May need organic matter"],
      SANDY: ["Light texture, quick drainage", "May need frequent irrigation", "Benefits from organic amendments"],
      LOAMY: ["Best all-purpose soil", "Good drainage and retention", "Suitable for most crops"],
      BLACK: ["Excellent for cotton and cereals", "High water retention", "Rich in minerals"],
      RED: ["Good for pulses and vegetables", "Well-drained", "May need fertilization"],
      LATERITE: ["High in iron and aluminum", "Low fertility", "Requires heavy fertilization"],
      MIXED: ["Variable characteristics", "Check specific areas", "Custom management needed"],
    };
    return recommendations[soilType] || ["General farming practices recommended"];
  };

  const recommendations = getSoilRecommendations(farm.soilType);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sprout className="size-5 text-primary" />
          Soil Health Analysis
        </CardTitle>
        <CardDescription>Soil characteristics and recommendations for your farm</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Soil Type & pH */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Soil Type</p>
            <div className="flex items-center gap-2">
              <Badge className="text-base px-3 py-1">{farm.soilType}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Soil pH Level</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{phValue?.toFixed(1) || "N/A"}</span>
              <div className={`flex items-center gap-1 ${phStatus.color}`}>
                <StatusIcon className="size-4" />
                <span className="text-sm font-medium">{phStatus.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* pH Range Guide */}
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-sm font-medium mb-2">pH Range Guide</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Highly Acidic</span>
              <span>&lt; 5.5</span>
            </div>
            <div className="flex justify-between">
              <span>Slightly Acidic</span>
              <span>5.5 - 6.0</span>
            </div>
            <div className="flex justify-between text-green-600 font-medium">
              <span>Optimal Range</span>
              <span>6.0 - 7.5</span>
            </div>
            <div className="flex justify-between">
              <span>Slightly Alkaline</span>
              <span>7.5 - 8.0</span>
            </div>
            <div className="flex justify-between">
              <span>Highly Alkaline</span>
              <span>&gt; 8.0</span>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <p className="text-sm font-medium mb-3">Soil Recommendations</p>
          <ul className="space-y-2">
            {recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle className="size-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Irrigation Info */}
        <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
          <p className="text-sm font-medium mb-1">Irrigation System</p>
          <p className="text-sm text-muted-foreground">
            Your farm uses <span className="font-semibold text-foreground">{farm.irrigationType}</span> irrigation, 
            which is {farm.irrigationType === "DRIP" ? "highly efficient and water-saving" : 
                      farm.irrigationType === "SPRINKLER" ? "good for uniform water distribution" :
                      farm.irrigationType === "FLOOD" ? "traditional but may use more water" :
                      "dependent on rainfall patterns"}.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default SoilHealthCard;