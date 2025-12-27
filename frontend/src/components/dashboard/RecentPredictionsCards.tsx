import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wheat, MapPin, Calendar, ArrowRight, BarChart3 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

interface Prediction {
  id: string;
  cropType: string;
  predictedYield: any;
  predictionStatus: string;
  createdAt: Date;
  farm: {
    name: string;
    location: string;
  } | null;
}

interface RecentPredictionsCardProps {
  predictions: Prediction[];
}

function RecentPredictionsCard({ predictions }: RecentPredictionsCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400";
      case "HARVESTED":
        return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" />
            Recent Predictions
          </CardTitle>
          <CardDescription>Your latest crop yield predictions</CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link href="/predictions">
            View All
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {predictions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="size-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-4">No predictions yet</p>
            <Button asChild>
              <Link href="/predictions/create">Create Your First Prediction</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {predictions.map((prediction) => (
              <Link
                key={prediction.id}
                href={`/predictions/${prediction.id}`}
                className="block p-4 bg-muted/30 rounded-xl border border-border hover:border-primary/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Wheat className="size-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                        {prediction.cropType}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          <span>{prediction.farm?.name || "Unknown Farm"}</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>{format(new Date(prediction.createdAt), "MMM dd, yyyy")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={getStatusColor(prediction.predictionStatus)}>
                      {prediction.predictionStatus}
                    </Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        {Number(prediction.predictedYield).toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground">Quintals</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentPredictionsCard;