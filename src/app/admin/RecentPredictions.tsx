import { useGetPredictions } from "@/hooks/use-predictions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Calendar, MapPin, Wheat } from "lucide-react";
import { format } from "date-fns";

function RecentPredictions() {
  const { data: predictions = [] } = useGetPredictions();

  // Get latest 10 predictions
  const recentPredictions = predictions.slice(0, 10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case "HARVESTED":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getAccuracyColor = (accuracy: number | null) => {
    if (!accuracy) return "text-muted-foreground";
    if (accuracy >= 80) return "text-green-600";
    if (accuracy >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Card className="mb-12">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="size-5 text-primary" />
              Recent Predictions
            </CardTitle>
            <CardDescription>Latest crop yield predictions from farmers</CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            {predictions.length} Total
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {recentPredictions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BarChart3 className="size-12 mx-auto mb-4 opacity-20" />
              <p>No predictions yet</p>
            </div>
          ) : (
            recentPredictions.map((prediction) => (
              <div
                key={prediction.id}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-xl border border-border/50 hover:border-primary/30 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
                    <Wheat className="size-6 text-primary" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{prediction.user?.fullName || "Unknown Farmer"}</span>
                      <Badge className={getStatusColor(prediction.predictionStatus)}>
                        {prediction.predictionStatus}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Wheat className="h-3 w-3" />
                        {prediction.cropType}
                        {prediction.cropVariety && ` (${prediction.cropVariety})`}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {prediction.farm?.location || "N/A"}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(prediction.createdAt), "MMM dd, yyyy")}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Predicted Yield */}
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">
                      {Number(prediction.predictedYield).toFixed(2)}
                    </div>
                    <div className="text-xs text-muted-foreground">Predicted (Q)</div>
                  </div>

                  {/* Actual Yield (if harvested) */}
                  {prediction.actualYield && (
                    <div className="text-center">
                      <div className="text-lg font-semibold">
                        {Number(prediction.actualYield).toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">Actual (Q)</div>
                    </div>
                  )}

                  {/* Accuracy (if harvested) */}
                  {prediction.accuracyPercentage && (
                    <div className="text-center">
                      <div className={`text-lg font-semibold ${getAccuracyColor(Number(prediction.accuracyPercentage))}`}>
                        {Number(prediction.accuracyPercentage).toFixed(1)}%
                      </div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                  )}

                  {/* Field Area */}
                  <div className="text-center">
                    <div className="text-sm font-medium">
                      {Number(prediction.fieldArea).toFixed(1)} acres
                    </div>
                    <div className="text-xs text-muted-foreground">Field Size</div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default RecentPredictions;