"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit, Plus, Droplets, Sprout } from "lucide-react";
import { Farm } from "@prisma/client";
import { useState } from "react";
import AddFarmDialog from "./AddFarmDialog";
import EditFarmDialog from "./EditFarmDialog";

interface FarmDetailsCardProps {
  farm: Farm | null;
  userId: string;
}

function FarmDetailsCard({ farm, userId }: FarmDetailsCardProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (!farm) {
    return (
      <>
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MapPin className="size-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Farm Added</h3>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Add your farm details to start getting crop yield predictions
            </p>
            <Button 
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              <Plus className="mr-2 size-4" />
              Add Farm
            </Button>
          </CardContent>
        </Card>

        <AddFarmDialog 
          isOpen={isAddDialogOpen} 
          onClose={() => setIsAddDialogOpen(false)}
          userId={userId}
        />
      </>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="size-5 text-primary" />
              Farm Details
            </CardTitle>
            <CardDescription>Your farm information and characteristics</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Edit className="mr-2 size-4" />
            Edit
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Farm Name & Location */}
          <div>
            <h3 className="text-lg font-semibold">{farm.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="size-3" />
              {farm.location}
            </p>
          </div>

          {/* Farm Details Grid */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Total Area</p>
              <p className="font-semibold">{Number(farm.totalArea).toFixed(2)} acres</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Soil Type</p>
              <Badge variant="secondary">{farm.soilType}</Badge>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Soil pH</p>
              <p className="font-semibold">{farm.soilPh ? Number(farm.soilPh).toFixed(1) : "N/A"}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Irrigation</p>
              <div className="flex items-center gap-1">
                <Droplets className="size-3 text-primary" />
                <span className="font-semibold text-sm">{farm.irrigationType}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Ownership</p>
              <p className="font-semibold text-sm">{farm.farmOwnership}</p>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Farming Type</p>
              <div className="flex items-center gap-1">
                <Sprout className="size-3 text-primary" />
                <span className="font-semibold text-sm">{farm.farmingType}</span>
              </div>
            </div>
          </div>

          {/* Primary Crops */}
          <div className="pt-2">
            <p className="text-xs text-muted-foreground mb-2">Primary Crops</p>
            <div className="flex flex-wrap gap-2">
              {farm.primaryCrops.map((crop, index) => (
                <Badge key={index} variant="outline" className="bg-primary/5">
                  {crop}
                </Badge>
              ))}
            </div>
          </div>

          {/* Experience */}
          {farm.farmingExperienceYears && (
            <div className="pt-2">
              <p className="text-xs text-muted-foreground">Farming Experience</p>
              <p className="font-semibold">{farm.farmingExperienceYears} years</p>
            </div>
          )}

          {/* Status */}
          <div className="pt-2 flex items-center gap-2">
            <Badge className={farm.isActive ? "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-800 hover:bg-red-100"}>
              {farm.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <EditFarmDialog 
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        farm={farm}
      />
    </>
  );
}

export default FarmDetailsCard;