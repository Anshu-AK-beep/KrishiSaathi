import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MicIcon, ShieldIcon, Languages } from "lucide-react";

function FeatureCards() {
  return (
    <div className="grid md:grid-cols-2 gap-8 mb-12">
      {/* How to Use Card */}
      <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <MicIcon className="h-5 w-5 text-primary" />
            </div>
            How to Use
          </CardTitle>
          <CardDescription>Simple steps to get started with voice assistance</CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <span className="text-sm">Click the "Start Call" button to begin talking</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <span className="text-sm">Ask questions about crops, soil, pests, or weather</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <span className="text-sm">Get instant voice responses from the AI expert</span>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
            <span className="text-sm">View conversation transcript in real-time</span>
          </div>
        </CardContent>
      </Card>

      {/* Features Card */}
      <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/30">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center">
              <ShieldIcon className="h-5 w-5 text-primary" />
            </div>
            Features
          </CardTitle>
          <CardDescription>Advanced capabilities for farming guidance</CardDescription>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="flex items-center p-3 bg-muted/30 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mr-3">
              <MicIcon className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium text-sm">Real-time Voice Recognition</span>
          </div>
          <div className="flex items-center p-3 bg-muted/30 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mr-3">
              <ShieldIcon className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium text-sm">AI-Powered Expert Responses</span>
          </div>
          <div className="flex items-center p-3 bg-muted/30 rounded-xl">
            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-lg flex items-center justify-center mr-3">
              <Languages className="h-4 w-4 text-primary" />
            </div>
            <span className="font-medium text-sm">Multi-Language Support</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default FeatureCards;