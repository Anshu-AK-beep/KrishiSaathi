// src/components/analytics/AnalyticsDashboard.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  MapPin,
  Sprout,
  DollarSign,
  Droplets,
  MessageSquare,
  FileText
} from "lucide-react";
import YieldChartsSection from "@/components/analytics/YieldChartsSection";
import FarmDetailsSection from "@/components/analytics/FarmDetailsSection";
import MarketPricesSection from "@/components/analytics/MarketPricesSection";
import IrrigationRecommendations from "@/components/analytics/IrrigationRecommendations";
import StatisticsOverview from "@/components/analytics/StatisticsOverview";
import AIChatbotPanel from "@/components/analytics/AIChatbotPanel";
import { useRouter } from "next/navigation";

interface AnalyticsDashboardProps {
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  farms: any[];
  predictions: any[];
}

export default function AnalyticsDashboard({ user, farms, predictions }: AnalyticsDashboardProps) {
  const router = useRouter();
  const [selectedFarm, setSelectedFarm] = useState<any>(farms[0] || null);
  const [showChatbot, setShowChatbot] = useState(false);

  // Export functionality
  const handleExport = (format: 'csv' | 'pdf') => {
    if (format === 'csv') {
      exportToCSV();
    } else {
      exportToPDF();
    }
  };

  const exportToCSV = () => {
    const csvData = predictions.map(p => ({
      Date: new Date(p.createdAt).toLocaleDateString(),
      Farm: p.farm.name,
      Crop: p.cropType,
      Area: p.fieldArea,
      'Predicted Yield': p.predictedYield,
      'Actual Yield': p.actualYield || 'N/A',
      Confidence: `${p.confidenceLevel}%`,
      Status: p.predictionStatus,
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportToPDF = () => {
    alert('PDF export will be implemented with detailed report generation');
    // TODO: Implement PDF generation with charts and detailed analytics
  };

  if (farms.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <Sprout className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Farm Data Yet</h2>
            <p className="text-muted-foreground mb-6">
              Add your first farm to start viewing analytics and insights
            </p>
            <Button onClick={() => router.push('/farm-profile')}>
              <MapPin className="w-4 h-4 mr-2" />
              Add Your First Farm
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                📊 Farm Analytics & Insights
              </h1>
              <p className="text-muted-foreground">
                Track your crop performance, view predictions, and get AI-powered recommendations
              </p>
            </div>
            
            {/* Export Buttons */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExport('csv')}>
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => handleExport('pdf')}>
                <FileText className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <StatisticsOverview 
          farms={farms} 
          predictions={predictions} 
        />

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-2">
            <TabsTrigger value="overview">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="yield-charts">
              <TrendingUp className="w-4 h-4 mr-2" />
              Yield Charts
            </TabsTrigger>
            <TabsTrigger value="farm-details">
              <MapPin className="w-4 h-4 mr-2" />
              Farm Details
            </TabsTrigger>
            <TabsTrigger value="market-prices">
              <DollarSign className="w-4 h-4 mr-2" />
              Market Prices
            </TabsTrigger>
            <TabsTrigger value="irrigation">
              <Droplets className="w-4 h-4 mr-2" />
              Irrigation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <YieldChartsSection predictions={predictions} compact />
              <FarmDetailsSection farms={farms} predictions={predictions} compact />
            </div>
            <MarketPricesSection predictions={predictions} compact />
          </TabsContent>

          <TabsContent value="yield-charts">
            <YieldChartsSection predictions={predictions} />
          </TabsContent>

          <TabsContent value="farm-details">
            <FarmDetailsSection farms={farms} predictions={predictions} />
          </TabsContent>

          <TabsContent value="market-prices">
            <MarketPricesSection predictions={predictions} />
          </TabsContent>

          <TabsContent value="irrigation">
            <IrrigationRecommendations farms={farms} predictions={predictions} />
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Chatbot - Fixed Bottom Right */}
      <AIChatbotPanel 
        userId={user.id}
        farms={farms}
        predictions={predictions}
      />
    </div>
  );
}