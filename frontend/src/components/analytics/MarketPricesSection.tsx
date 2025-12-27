// src/components/analytics/MarketPricesSection.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MarketPricesSectionProps {
  predictions: any[];
  compact?: boolean;
}

// Mock market prices (in real app, fetch from API)
const MARKET_PRICES: any = {
  "Rice": { current: 2100, trend: 5.2, history: [1900, 1950, 2000, 2050, 2100] },
  "Wheat": { current: 2250, trend: 3.8, history: [2100, 2150, 2180, 2220, 2250] },
  "Cotton": { current: 6200, trend: -2.1, history: [6500, 6400, 6300, 6250, 6200] },
  "Sugarcane": { current: 320, trend: 1.5, history: [310, 312, 315, 318, 320] },
  "Maize": { current: 1900, trend: 4.2, history: [1800, 1825, 1850, 1875, 1900] },
  "Bajra": { current: 1850, trend: 2.8, history: [1780, 1800, 1820, 1835, 1850] },
  "Jowar": { current: 2700, trend: 6.1, history: [2500, 2550, 2600, 2650, 2700] },
  "Groundnut": { current: 5500, trend: 3.5, history: [5200, 5300, 5400, 5450, 5500] },
  "Soybean": { current: 4200, trend: -1.8, history: [4350, 4300, 4250, 4225, 4200] },
  "Potato": { current: 1200, trend: 8.3, history: [1050, 1100, 1150, 1175, 1200] },
  "Onion": { current: 2500, trend: 12.5, history: [2000, 2150, 2300, 2400, 2500] },
  "Tomato": { current: 1800, trend: -5.2, history: [2000, 1950, 1900, 1850, 1800] },
};

export default function MarketPricesSection({ predictions, compact = false }: MarketPricesSectionProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [priceData, setPriceData] = useState(MARKET_PRICES);

  // Get unique crops from predictions
  const userCrops = [...new Set(predictions.map(p => p.cropType))];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      // In real app, fetch fresh data from API
    }, 1000);
  };

  // Calculate potential revenue
  const calculateRevenue = (cropType: string, yield_quintals: number) => {
    const price = priceData[cropType]?.current || 2000;
    return yield_quintals * price;
  };

  const totalPotentialRevenue = predictions.reduce((sum, p) => {
    return sum + calculateRevenue(p.cropType, p.predictedYield);
  }, 0);

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Market Prices</CardTitle>
              <CardDescription>Current rates for your crops</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userCrops.slice(0, 3).map(crop => {
              const price = priceData[crop];
              if (!price) return null;
              return (
                <div key={crop} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold">{crop}</p>
                    <p className="text-sm text-muted-foreground">per quintal</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{price.current}</p>
                    <Badge variant={price.trend >= 0 ? "default" : "destructive"} className="text-xs">
                      {price.trend >= 0 ? '+' : ''}{price.trend}%
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <Card className="border-primary/20 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-green-600" />
            Potential Revenue
          </CardTitle>
          <CardDescription>Based on current market prices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600 mb-2">
            ₹{totalPotentialRevenue.toLocaleString('en-IN')}
          </div>
          <p className="text-sm text-muted-foreground">
            Estimated from {predictions.length} predictions at current market rates
          </p>
        </CardContent>
      </Card>

      {/* Market Prices Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Market Prices</CardTitle>
              <CardDescription>Live prices for your crops (per quintal)</CardDescription>
            </div>
            <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {userCrops.map(crop => {
              const price = priceData[crop];
              if (!price) return null;

              const chartData = price.history.map((p: number, i: number) => ({
                month: `M${i + 1}`,
                price: p,
              }));

              return (
                <Card key={crop} className="border-2">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{crop}</h3>
                        <p className="text-sm text-muted-foreground">Current Market Price</p>
                      </div>
                      <Badge 
                        variant={price.trend >= 0 ? "default" : "destructive"}
                        className="flex items-center gap-1"
                      >
                        {price.trend >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {price.trend >= 0 ? '+' : ''}{price.trend}%
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <p className="text-3xl font-bold text-green-600">
                        ₹{price.current}
                      </p>
                      <p className="text-sm text-muted-foreground">per quintal</p>
                    </div>

                    {/* Mini price trend chart */}
                    <ResponsiveContainer width="100%" height={80}>
                      <LineChart data={chartData}>
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke={price.trend >= 0 ? "#10b981" : "#ef4444"}
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>

                    {/* Predicted earnings */}
                    {predictions.filter(p => p.cropType === crop).length > 0 && (
                      <div className="mt-4 pt-4 border-t">
                        <p className="text-sm text-muted-foreground mb-1">
                          Your predicted yield: {predictions.filter(p => p.cropType === crop).reduce((sum, p) => sum + p.predictedYield, 0).toFixed(1)} Q
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          Est. Revenue: ₹{calculateRevenue(crop, predictions.filter(p => p.cropType === crop).reduce((sum, p) => sum + p.predictedYield, 0)).toLocaleString('en-IN')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <Card>
        <CardHeader>
          <CardTitle>💡 Market Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="font-semibold text-green-900 dark:text-green-100 mb-1">
                🔥 Hot Crop: Onion
              </p>
              <p className="text-sm text-green-700 dark:text-green-300">
                Prices up 12.5% this month. Consider planting in the next season.
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                📈 Trending Up: Wheat, Maize, Jowar
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Steady price increase expected due to high demand.
              </p>
            </div>
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
              <p className="font-semibold text-orange-900 dark:text-orange-100 mb-1">
                ⚠️ Watch Out: Cotton, Soybean
              </p>
              <p className="text-sm text-orange-700 dark:text-orange-300">
                Prices declining. Monitor market conditions before harvesting.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}