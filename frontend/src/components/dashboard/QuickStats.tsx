import { Card, CardContent } from "@/components/ui/card";
import { MapPin, BarChart3, CheckCircle, Target, TrendingUp } from "lucide-react";

interface QuickStatsProps {
  stats: {
    totalFarms: number;
    totalPredictions: number;
    completedPredictions: number;
    harvestedPredictions: number;
    avgAccuracy: number;
  };
}

function QuickStats({ stats }: QuickStatsProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Total Farms */}
      <Card className="border-2 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <MapPin className="size-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalFarms}</div>
              <div className="text-sm text-muted-foreground">Active Farms</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Predictions */}
      <Card className="border-2 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <BarChart3 className="size-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.totalPredictions}</div>
              <div className="text-sm text-muted-foreground">Total Predictions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed Predictions */}
      <Card className="border-2 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <CheckCircle className="size-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.completedPredictions}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Harvested Crops */}
      <Card className="border-2 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <Target className="size-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.harvestedPredictions}</div>
              <div className="text-sm text-muted-foreground">Harvested</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Accuracy */}
      <Card className="border-2 hover:border-primary/30 transition-all duration-300 md:col-span-2 lg:col-span-1">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="size-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{stats.avgAccuracy}%</div>
              <div className="text-sm text-muted-foreground">Avg Accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default QuickStats;