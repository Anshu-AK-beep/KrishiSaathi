import { Sprout } from "lucide-react";

interface DashboardWelcomeProps {
  userName: string | null;
}

function DashboardWelcome({ userName }: DashboardWelcomeProps) {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="mb-8 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-8 border border-primary/20">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium text-primary">Dashboard</span>
          </div>
          <h1 className="text-4xl font-bold">
            {getGreeting()}, {userName || "Farmer"}! 🌾
          </h1>
          <p className="text-muted-foreground text-lg">
            Welcome to your farming dashboard. Track your crops, predictions, and farm performance.
          </p>
        </div>
        <div className="hidden lg:block">
          <div className="w-32 h-32 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
            <Sprout className="w-16 h-16 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardWelcome;