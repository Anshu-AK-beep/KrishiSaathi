import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User, UserRole } from "@prisma/client";

// Extended type with relations
type UserWithRelations = User & {
  _count?: {
    predictions: number;
    farms: number;
  };
  predictions?: any[];
  farms?: any[];
};

export function useGetUsers(role?: UserRole) {
  return useQuery<UserWithRelations[]>({
    queryKey: ["users", role],
    queryFn: async () => {
      const url = role ? `/api/users?role=${role}` : "/api/users";
      const res = await fetch(url);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        
        if (res.status === 401) {
          throw new Error("Please sign in to view users");
        }
        if (res.status === 403) {
          throw new Error("Admin access required to view all users");
        }
        
        throw new Error(errorData.error || "Failed to fetch users");
      }
      
      return res.json();
    },
    retry: 1,
    staleTime: 30000, // Cache for 30 seconds
    refetchOnWindowFocus: false,
  });
}

export function useGetUserById(id: string) {
  return useQuery<UserWithRelations>({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await fetch(`/api/users/${id}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to fetch user");
      }
      
      return res.json();
    },
    enabled: !!id,
    retry: 1,
    staleTime: 30000,
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
      const res = await fetch(`/api/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to update user");
      }
      
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
    },
    onError: (error: Error) => {
      console.error("Error updating user:", error);
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to delete user");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      console.error("Error deleting user:", error);
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/users/${id}/toggle-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to toggle user status");
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: Error) => {
      console.error("Error toggling user status:", error);
    },
  });
}