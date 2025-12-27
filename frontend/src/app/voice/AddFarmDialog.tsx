"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SoilType, IrrigationType, FarmOwnership, FarmingType } from "@prisma/client";

interface AddFarmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

function AddFarmDialog({ isOpen, onClose, userId }: AddFarmDialogProps) {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    latitude: "",
    longitude: "",
    totalArea: "",
    soilType: "LOAMY" as SoilType,
    soilPh: "",
    irrigationType: "RAINFED" as IrrigationType,
    farmOwnership: "OWNED" as FarmOwnership,
    farmingType: "CONVENTIONAL" as FarmingType,
    primaryCrops: "",
    farmingExperienceYears: "",
  });

  const createFarmMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/farms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to create farm");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      toast.success("Farm added successfully!");
      handleClose();
      window.location.reload(); // Refresh to show new farm
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add farm");
    },
  });

  const handleClose = () => {
    setFormData({
      name: "",
      location: "",
      latitude: "",
      longitude: "",
      totalArea: "",
      soilType: "LOAMY",
      soilPh: "",
      irrigationType: "RAINFED",
      farmOwnership: "OWNED",
      farmingType: "CONVENTIONAL",
      primaryCrops: "",
      farmingExperienceYears: "",
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.location || !formData.totalArea) {
      toast.error("Name, Location, and Total Area are required");
      return;
    }

    // Parse crops from comma-separated string
    const cropsArray = formData.primaryCrops
      .split(",")
      .map((crop) => crop.trim())
      .filter((crop) => crop.length > 0);

    const submitData = {
      userId,
      name: formData.name,
      location: formData.location,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      totalArea: parseFloat(formData.totalArea),
      soilType: formData.soilType,
      soilPh: formData.soilPh ? parseFloat(formData.soilPh) : null,
      irrigationType: formData.irrigationType,
      farmOwnership: formData.farmOwnership,
      farmingType: formData.farmingType,
      primaryCrops: cropsArray,
      farmingExperienceYears: formData.farmingExperienceYears
        ? parseInt(formData.farmingExperienceYears)
        : null,
    };

    createFarmMutation.mutate(submitData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Farm</DialogTitle>
          <DialogDescription>
            Register your farm details to start getting crop yield predictions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Farm Name */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Farm Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Green Valley Farm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">
              Location <span className="text-destructive">*</span>
            </Label>
            <Input
              id="location"
              placeholder="e.g., Village Name, District, State"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude (Optional)</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                placeholder="e.g., 28.6139"
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude (Optional)</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                placeholder="e.g., 77.2090"
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              />
            </div>
          </div>

          {/* Total Area */}
          <div className="space-y-2">
            <Label htmlFor="totalArea">
              Total Area (acres) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="totalArea"
              type="number"
              step="0.01"
              placeholder="e.g., 5.5"
              value={formData.totalArea}
              onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
              required
            />
          </div>

          {/* Soil Type */}
          <div className="space-y-2">
            <Label htmlFor="soilType">Soil Type</Label>
            <Select
              value={formData.soilType}
              onValueChange={(value) => setFormData({ ...formData, soilType: value as SoilType })}
            >
              <SelectTrigger id="soilType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALLUVIAL">Alluvial</SelectItem>
                <SelectItem value="CLAY">Clay</SelectItem>
                <SelectItem value="SANDY">Sandy</SelectItem>
                <SelectItem value="LOAMY">Loamy</SelectItem>
                <SelectItem value="BLACK">Black</SelectItem>
                <SelectItem value="RED">Red</SelectItem>
                <SelectItem value="LATERITE">Laterite</SelectItem>
                <SelectItem value="MIXED">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Soil pH */}
          <div className="space-y-2">
            <Label htmlFor="soilPh">Soil pH (Optional)</Label>
            <Input
              id="soilPh"
              type="number"
              step="0.1"
              min="0"
              max="14"
              placeholder="e.g., 6.5"
              value={formData.soilPh}
              onChange={(e) => setFormData({ ...formData, soilPh: e.target.value })}
            />
          </div>

          {/* Irrigation Type */}
          <div className="space-y-2">
            <Label htmlFor="irrigationType">Irrigation Type</Label>
            <Select
              value={formData.irrigationType}
              onValueChange={(value) =>
                setFormData({ ...formData, irrigationType: value as IrrigationType })
              }
            >
              <SelectTrigger id="irrigationType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRIP">Drip</SelectItem>
                <SelectItem value="SPRINKLER">Sprinkler</SelectItem>
                <SelectItem value="FLOOD">Flood</SelectItem>
                <SelectItem value="RAINFED">Rainfed</SelectItem>
                <SelectItem value="MIXED">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Farm Ownership */}
          <div className="space-y-2">
            <Label htmlFor="farmOwnership">Farm Ownership</Label>
            <Select
              value={formData.farmOwnership}
              onValueChange={(value) =>
                setFormData({ ...formData, farmOwnership: value as FarmOwnership })
              }
            >
              <SelectTrigger id="farmOwnership">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OWNED">Owned</SelectItem>
                <SelectItem value="LEASED">Leased</SelectItem>
                <SelectItem value="SHARECROP">Sharecrop</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Farming Type */}
          <div className="space-y-2">
            <Label htmlFor="farmingType">Farming Type</Label>
            <Select
              value={formData.farmingType}
              onValueChange={(value) =>
                setFormData({ ...formData, farmingType: value as FarmingType })
              }
            >
              <SelectTrigger id="farmingType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ORGANIC">Organic</SelectItem>
                <SelectItem value="CONVENTIONAL">Conventional</SelectItem>
                <SelectItem value="MIXED">Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Primary Crops */}
          <div className="space-y-2">
            <Label htmlFor="primaryCrops">Primary Crops (comma-separated)</Label>
            <Input
              id="primaryCrops"
              placeholder="e.g., Wheat, Rice, Corn"
              value={formData.primaryCrops}
              onChange={(e) => setFormData({ ...formData, primaryCrops: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">Separate multiple crops with commas</p>
          </div>

          {/* Farming Experience */}
          <div className="space-y-2">
            <Label htmlFor="farmingExperienceYears">Farming Experience (years)</Label>
            <Input
              id="farmingExperienceYears"
              type="number"
              min="0"
              placeholder="e.g., 10"
              value={formData.farmingExperienceYears}
              onChange={(e) =>
                setFormData({ ...formData, farmingExperienceYears: e.target.value })
              }
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createFarmMutation.isPending}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {createFarmMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Farm"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddFarmDialog;