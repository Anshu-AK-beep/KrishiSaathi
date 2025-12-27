// src/components/farm/FarmListManager.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Edit, 
  Trash2, 
  Plus, 
  Droplets, 
  Sprout,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Farm {
  id: string;
  name: string;
  location: string;
  totalArea: number;
  soilType: string;
  soilPh: number | null;
  irrigationType: string;
  farmOwnership: string;
  farmingType: string;
  primaryCrops: string[];
  isActive: boolean;
  createdAt: Date;
  predictionCount?: number;
}

interface FarmListManagerProps {
  farms: Farm[];
}

export default function FarmListManager({ farms: initialFarms }: FarmListManagerProps) {
  const router = useRouter();
  const [farms, setFarms] = useState(initialFarms);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [farmToDelete, setFarmToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (farmId: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/farms/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ farmId }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete farm");
      }

      // Remove from local state
      setFarms(farms.filter(f => f.id !== farmId));
      setDeleteDialogOpen(false);
      setFarmToDelete(null);
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete farm. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = (farmId: string) => {
    setFarmToDelete(farmId);
    setDeleteDialogOpen(true);
  };

  if (farms.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <Sprout className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">No Farms Yet</h2>
            <p className="text-muted-foreground mb-6">
              Add your first farm to start tracking predictions and analytics
            </p>
            <Button onClick={() => router.push('/farm-profile')} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Farm
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-4xl font-bold mb-2">🏡 My Farms</h1>
              <p className="text-muted-foreground">
                Manage your farm profiles and details
              </p>
            </div>
            <Button onClick={() => router.push('/farm-profile')} size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Add New Farm
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <Badge variant="secondary" className="text-base px-4 py-2">
              {farms.length} Total Farm{farms.length !== 1 ? 's' : ''}
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2">
              {farms.filter(f => f.isActive).length} Active
            </Badge>
            <Badge variant="secondary" className="text-base px-4 py-2">
              {farms.reduce((sum, f) => sum + f.totalArea, 0).toFixed(1)} Total Acres
            </Badge>
          </div>
        </div>

        {/* Farm Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {farms.map((farm) => (
            <Card key={farm.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">{farm.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {farm.location}
                    </CardDescription>
                  </div>
                  <Badge variant={farm.isActive ? "default" : "secondary"}>
                    {farm.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Area</p>
                    <p className="text-2xl font-bold">{farm.totalArea}</p>
                    <p className="text-xs text-muted-foreground">acres</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Predictions</p>
                    <p className="text-2xl font-bold text-green-600">
                      {farm.predictionCount || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">total</p>
                  </div>
                </div>

                {/* Farm Details */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Soil Type</span>
                    <Badge variant="outline">{farm.soilType}</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Irrigation</span>
                    <span className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium">{farm.irrigationType}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-sm text-muted-foreground">Ownership</span>
                    <span className="text-sm font-medium">{farm.farmOwnership}</span>
                  </div>
                  {farm.soilPh && (
                    <div className="flex items-center justify-between py-2 border-b">
                      <span className="text-sm text-muted-foreground">Soil pH</span>
                      <span className="text-sm font-medium">{farm.soilPh}</span>
                    </div>
                  )}
                </div>

                {/* Primary Crops */}
                {farm.primaryCrops.length > 0 && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Primary Crops</p>
                    <div className="flex flex-wrap gap-2">
                      {farm.primaryCrops.map((crop, idx) => (
                        <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                          <Sprout className="w-3 h-3" />
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => router.push(`/farm-profile/edit/${farm.id}`)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/predictions?farmId=${farm.id}`)}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => confirmDelete(farm.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Created Date */}
                <p className="text-xs text-muted-foreground text-center pt-2">
                  Added on {new Date(farm.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Delete Farm?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this farm and all associated predictions.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => farmToDelete && handleDelete(farmToDelete)}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}