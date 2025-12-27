import { MapPin } from "lucide-react";

interface FarmProfileWelcomeProps {
  userName: string | null;
  farmName: string | undefined;
}

function FarmProfileWelcome({ userName, farmName }: FarmProfileWelcomeProps) {
  return (
    <div className="mb-12 bg-gradient-to-br from-primary/10 via-primary/5 to-background rounded-3xl p-8 border border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="size-6 text-primary" />
        <span className="text-sm font-medium text-primary">Farm Profile</span>
      </div>
      
      <h1 className="text-4xl font-bold mb-2">
        {farmName ? `${farmName}` : "Your Farm Profile"} 🌾
      </h1>
      
      <p className="text-muted-foreground">
        {userName ? `Welcome, ${userName}!` : "Welcome!"} Manage your farm details, monitor soil health, and track weather conditions.
      </p>
      
      {!farmName && (
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <p className="text-sm text-amber-700 dark:text-amber-400">
            📍 You haven't set up your farm yet. Please add your farm details below to get started with predictions.
          </p>
        </div>
      )}
    </div>
  );
}

export default FarmProfileWelcome;