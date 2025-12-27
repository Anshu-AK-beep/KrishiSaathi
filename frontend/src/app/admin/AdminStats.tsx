import { Card, CardContent } from "@/components/ui/card";
import { Users, BarChart3, CheckCircle, TrendingUp, Target, Sprout } from "lucide-react";

interface AdminStatsProps {
  totalFarmers: number;
  activeFarmers: number;
  totalPredictions: number;
  completedPredictions: number;
  harvestedPredictions: number;
  avgAccuracy: number;
}

function AdminStats({
  totalFarmers,
  activeFarmers,
  totalPredictions,
  completedPredictions,
  harvestedPredictions,
  avgAccuracy,
}: AdminStatsProps) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {/* Total Farmers */}
      <Card className="border-2 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <Users className="size-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalFarmers}</div>
              <div className="text-sm text-muted-foreground">Total Farmers</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Farmers */}
      <Card className="border-2 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <Sprout className="size-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{activeFarmers}</div>
              <div className="text-sm text-muted-foreground">Active Farmers</div>
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
              <div className="text-2xl font-bold">{totalPredictions}</div>
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
              <div className="text-2xl font-bold">{completedPredictions}</div>
              <div className="text-sm text-muted-foreground">Completed Predictions</div>
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
              <div className="text-2xl font-bold">{harvestedPredictions}</div>
              <div className="text-sm text-muted-foreground">Harvested Crops</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Average Accuracy */}
      <Card className="border-2 hover:border-primary/30 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <TrendingUp className="size-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{avgAccuracy}%</div>
              <div className="text-sm text-muted-foreground">Avg Accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AdminStats;