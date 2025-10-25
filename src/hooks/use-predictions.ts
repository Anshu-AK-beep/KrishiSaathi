import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CropPrediction } from "@prisma/client";

// Extended type with relations
type PredictionWithRelations = CropPrediction & {
  user: {
    fullName: string | null;
    email: string;
  } | null;
  farm: {
    name: string;
    location: string;
  } | null;
};

export function useGetPredictions() {
  return useQuery<PredictionWithRelations[]>({
    queryKey: ["predictions"],
    queryFn: async () => {
      const res = await fetch("/api/predictions");
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        
        if (res.status === 401) {
          throw new Error("Please sign in to view predictions");
        }
        if (res.status === 403) {
          throw new Error("You don't have permission to view predictions");
        }
        if (res.status === 404) {
          throw new Error("User not found in database");
        }
        
        throw new Error(errorData.error || "Failed to fetch predictions");
      }
      
      return res.json();
    },
    retry: 1,
    staleTime: 30000, // Cache for 30 seconds
    refetchOnWindowFocus: false,
  });
}

export function useGetPredictionById(id: string) {
  return useQuery<PredictionWithRelations>({
    queryKey: ["prediction", id],
    queryFn: async () => {
      const res = await fetch(`/api/predictions/${id}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        
        if (res.status === 404) {
          throw new Error("Prediction not found");
        }
        
        throw new Error(errorData.error || "Failed to fetch prediction");
      }
      
      return res.json();
    },
    enabled: !!id,
    retry: 1,
    staleTime: 30000,
  });
}

export function useCreatePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<CropPrediction>) => {
      const res = await fetch("/api/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        
        if (res.status === 400) {
          throw new Error(errorData.error || "Invalid prediction data");
        }
        if (res.status === 401) {
          throw new Error("Please sign in to create predictions");
        }
        if (res.status === 404) {
          throw new Error("User not found in database");
        }
        
        throw new Error(errorData.error || "Failed to create prediction");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
    },
    onError: (error: Error) => {
      console.error("Error creating prediction:", error);
    },
  });
}

export function useUpdatePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CropPrediction> }) => {
      const res = await fetch(`/api/predictions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        
        if (res.status === 404) {
          throw new Error("Prediction not found");
        }
        if (res.status === 403) {
          throw new Error("You don't have permission to update this prediction");
        }
        
        throw new Error(errorData.error || "Failed to update prediction");
      }
      
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
      queryClient.invalidateQueries({ queryKey: ["prediction", variables.id] });
    },
    onError: (error: Error) => {
      console.error("Error updating prediction:", error);
    },
  });
}

export function useDeletePrediction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/predictions/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        
        if (res.status === 404) {
          throw new Error("Prediction not found");
        }
        if (res.status === 403) {
          throw new Error("You don't have permission to delete this prediction");
        }
        
        throw new Error(errorData.error || "Failed to delete prediction");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["predictions"] });
    },
    onError: (error: Error) => {
      console.error("Error deleting prediction:", error);
    },
  });
}