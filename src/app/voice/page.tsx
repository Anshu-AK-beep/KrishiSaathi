import Navbar from "@/components/Navbar";
import FeatureCards from "@/components/voice/FeatureCards";
import VoiceWelcomeSection from "@/components/voice/VoiceWelcomeSection";
import VapiWidget from "@/components/voice/VapiWidget";

async function VoicePage() {
  // For now, everyone can access voice features (Free tier)
  // Later you can add premium checks here if needed
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
        <VoiceWelcomeSection />
        <FeatureCards />
      </div>
      <VapiWidget />
    </div>
  );
}

export default VoicePage;