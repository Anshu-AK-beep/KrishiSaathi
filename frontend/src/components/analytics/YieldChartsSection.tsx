// src/components/analytics/YieldChartsSection.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface YieldChartsSectionProps {
  predictions: any[];
  compact?: boolean;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function YieldChartsSection({ predictions, compact = false }: YieldChartsSectionProps) {
  // Prepare data for yield over time
  const yieldOverTime = predictions
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-10) // Last 10 predictions
    .map(p => ({
      date: new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      predicted: p.predictedYield,
      actual: p.actualYield || 0,
      crop: p.cropType,
    }));

  // Yield by crop type
  const yieldByCrop = predictions.reduce((acc: any, p) => {
    if (!acc[p.cropType]) {
      acc[p.cropType] = { crop: p.cropType, totalYield: 0, count: 0 };
    }
    acc[p.cropType].totalYield += p.predictedYield;
    acc[p.cropType].count += 1;
    return acc;
  }, {});

  const cropYieldData = Object.values(yieldByCrop).map((item: any) => ({
    name: item.crop,
    avgYield: (item.totalYield / item.count).toFixed(1),
    totalYield: item.totalYield.toFixed(1),
  }));

  // Confidence distribution
  const confidenceRanges = {
    'High (80-100%)': 0,
    'Medium (60-79%)': 0,
    'Low (0-59%)': 0,
  };

  predictions.forEach(p => {
    if (p.confidenceLevel >= 80) confidenceRanges['High (80-100%)']++;
    else if (p.confidenceLevel >= 60) confidenceRanges['Medium (60-79%)']++;
    else confidenceRanges['Low (0-59%)']++;
  });

  const confidenceData = Object.entries(confidenceRanges).map(([name, value]) => ({
    name,
    value,
  }));

  if (compact) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Yield Trends</CardTitle>
          <CardDescription>Recent prediction performance</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={yieldOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="predicted" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Yield Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Yield Predictions Over Time</CardTitle>
          <CardDescription>
            Track your predicted vs actual yields across different crops
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={yieldOverTime}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" />
              <YAxis label={{ value: 'Yield (Quintals)', angle: -90, position: 'insideLeft' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Predicted Yield"
                dot={{ fill: '#10b981', r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#3b82f6" 
                strokeWidth={3}
                name="Actual Yield"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Yield by Crop Type */}
        <Card>
          <CardHeader>
            <CardTitle>Average Yield by Crop</CardTitle>
            <CardDescription>Compare performance across different crops</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cropYieldData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="avgYield" fill="#10b981" name="Avg Yield (Q)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Confidence Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Prediction Confidence</CardTitle>
            <CardDescription>Distribution of prediction confidence levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={confidenceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}