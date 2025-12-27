"use client";
import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Farm, SoilType, IrrigationType, FarmOwnership, FarmingType } from "@prisma/client";

interface EditFarmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  farm: Farm | null;
}

function EditFarmDialog({ isOpen, onClose, farm }: EditFarmDialogProps) {
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
    isActive: true,
  });

  // Pre-populate form when farm changes
  useEffect(() => {
    if (farm) {
      setFormData({
        name: farm.name,
        location: farm.location,
        latitude: farm.latitude ? String(farm.latitude) : "",
        longitude: farm.longitude ? String(farm.longitude) : "",
        totalArea: String(farm.totalArea),
        soilType: farm.soilType,
        soilPh: farm.soilPh ? String(farm.soilPh) : "",
        irrigationType: farm.irrigationType,
        farmOwnership: farm.farmOwnership,
        farmingType: farm.farmingType,
        primaryCrops: farm.primaryCrops.join(", "),
        farmingExperienceYears: farm.farmingExperienceYears
          ? String(farm.farmingExperienceYears)
          : "",
        isActive: farm.isActive,
      });
    }
  }, [farm]);

  const updateFarmMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!farm) throw new Error("No farm selected");

      const res = await fetch(`/api/farms/${farm.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to update farm");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["farms"] });
      toast.success("Farm updated successfully!");
      onClose();
      window.location.reload(); // Refresh to show updates
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update farm");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
      isActive: formData.isActive,
    };

    updateFarmMutation.mutate(submitData);
  };

  if (!farm) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Farm Details</DialogTitle>
          <DialogDescription>Update your farm information and characteristics.</DialogDescription>
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
              <Label htmlFor="latitude">Latitude</Label>
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
              <Label htmlFor="longitude">Longitude</Label>
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
            <Label htmlFor="soilPh">Soil pH</Label>
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

          {/* Active Status */}
          <div className="flex items-center justify-between pt-2">
            <div className="space-y-0.5">
              <Label htmlFor="isActive">Active Status</Label>
              <p className="text-xs text-muted-foreground">
                Inactive farms won't be available for predictions
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateFarmMutation.isPending}
              className="bg-gradient-to-r from-primary to-primary/80"
            >
              {updateFarmMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditFarmDialog;