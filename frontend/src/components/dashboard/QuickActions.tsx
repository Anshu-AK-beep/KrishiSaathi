"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Sprout, TrendingUp, PlusCircle, BarChart3 } from "lucide-react";

interface QuickActionsProps {
  hasFarm: boolean;
}

export default function QuickActions({ hasFarm }: QuickActionsProps) {
  const router = useRouter();

  const actions = [
    {
      icon: PlusCircle,
      label: hasFarm ? "Add Another Farm" : "Add Farm",
      description: "Register your farm details",
      onClick: () => router.push("/farm-profile"),
      variant: "default" as const,
      disabled: false,
    },
    {
      icon: Sprout,
      label: "New Prediction",
      description: "Get crop recommendations",
      onClick: () => router.push("/predict"),
      variant: "outline" as const,
      disabled: !hasFarm,
    },
    {
      icon: BarChart3,
      label: "View Analytics",
      description: "See your farm insights",
      onClick: () => router.push("/analytics"),
      variant: "outline" as const,
      disabled: !hasFarm,
    },
    {
      icon: TrendingUp,
      label: "Market Prices",
      description: "Check current rates",
      onClick: () => router.push("/market"),
      variant: "outline" as const,
      disabled: false,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            onClick={action.onClick}
            variant={action.variant}
            className="w-full justify-start h-auto py-3"
            disabled={action.disabled}
          >
            <action.icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <div className="text-left">
              <div className="font-semibold">{action.label}</div>
              <div className="text-xs text-muted-foreground">{action.description}</div>
            </div>
          </Button>
        ))}
        
        {!hasFarm && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 Add your farm first to unlock predictions and analytics
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}