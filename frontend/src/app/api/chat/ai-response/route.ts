// src/app/api/chat/ai-response/route.ts
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

// You can integrate with OpenAI, Gemini, or your own AI model here
// For now, we'll use a smart rule-based system with context awareness

export async function POST(req: NextRequest) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, context, chatHistory } = await req.json();

    // Option 1: Use OpenAI (if you have API key)
    if (process.env.OPENAI_API_KEY) {
      return await generateOpenAIResponse(message, context, chatHistory);
    }

    // Option 2: Use Google Gemini (free tier available)
    if (process.env.GEMINI_API_KEY) {
      return await generateGeminiResponse(message, context, chatHistory);
    }

    // Option 3: Fallback to smart rule-based responses
    const response = generateSmartResponse(message, context, chatHistory);
    return NextResponse.json({ response });

  } catch (error: any) {
    console.error("Error generating AI response:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate response" },
      { status: 500 }
    );
  }
}

// Smart rule-based response system
function generateSmartResponse(message: string, context: any, chatHistory: any[]) {
  const lowerMessage = message.toLowerCase();
  const { farms = [], predictions = [] } = context;

  // Greeting
  if (lowerMessage.match(/\b(hello|hi|hey|namaste)\b/)) {
    return `Namaste! 🙏 I'm your AI farm assistant. I can help you with:
    
• Crop recommendations based on your ${farms.length} farm(s)
• Irrigation scheduling and water management
• Yield predictions and optimization tips
• Market prices and revenue estimates
• Weather impact analysis

How can I help you today?`;
  }

  // Yield related questions
  if (lowerMessage.match(/\b(yield|production|harvest)\b/)) {
    if (predictions.length === 0) {
      return `You haven't created any yield predictions yet. To get started:

1. Go to the Predictions tab
2. Select your farm
3. Enter crop details and weather conditions
4. Get AI-powered yield predictions!

Would you like tips on improving yields?`;
    }

    const avgYield = predictions.reduce((sum: number, p: any) => sum + p.predictedYield, 0) / predictions.length;
    const topCrop = predictions.reduce((max: any, p: any) => 
      p.predictedYield > (max?.predictedYield || 0) ? p : max, null);

    return `Based on your ${predictions.length} predictions:

📊 Average Yield: ${avgYield.toFixed(1)} quintals
🌟 Best Performer: ${topCrop?.crop} (${topCrop?.predictedYield.toFixed(1)} Q)
✅ Average Confidence: ${(predictions.reduce((sum: number, p: any) => sum + p.confidence, 0) / predictions.length).toFixed(0)}%

💡 Tips to improve yields:
• Maintain optimal soil pH (6.0-7.5)
• Ensure adequate NPK levels
• Follow recommended irrigation schedule
• Use quality seeds and fertilizers

Want specific advice for any crop?`;
  }

  // Irrigation questions
  if (lowerMessage.match(/\b(water|irrigation|irrigate|drip)\b/)) {
    const farmInfo = farms[0];
    if (!farmInfo) {
      return "Add your farm details first to get personalized irrigation recommendations!";
    }

    return `💧 Irrigation Recommendations for your farm:

**Current Setup:** ${farmInfo.irrigationType}
**Area:** ${farmInfo.area} acres
**Soil Type:** ${farmInfo.soilType}

**Best Practices:**
• Drip irrigation saves 30-50% water
• Water early morning (5-8 AM) or evening (6-8 PM)
• Avoid midday watering (high evaporation)
• Monitor soil moisture regularly

**For ${farmInfo.soilType} soil:**
${getSoilSpecificAdvice(farmInfo.soilType)}

Need help with irrigation scheduling for specific crops?`;
  }

  // Crop recommendations
  if (lowerMessage.match(/\b(crop|plant|grow|suitable)\b/)) {
    const farmInfo = farms[0];
    if (!farmInfo) {
      return "Add your farm details to get crop recommendations!";
    }

    return `🌾 Crop Recommendations for your farm:

**Location:** ${farmInfo.location}
**Soil Type:** ${farmInfo.soilType}
**Area:** ${farmInfo.area} acres

${getCropRecommendations(farmInfo.soilType, farmInfo.location)}

**Important Factors:**
✓ Check current season (Kharif/Rabi/Zaid)
✓ Ensure adequate water availability
✓ Test soil pH and NPK levels
✓ Monitor local market prices

Want details about a specific crop?`;
  }

  // Weather questions
  if (lowerMessage.match(/\b(weather|rain|temperature|climate)\b/)) {
    const latestPrediction = predictions[0];
    if (!latestPrediction) {
      return `I don't have recent weather data for your farm. When you create a prediction, I'll automatically fetch real-time weather conditions!

Current capabilities:
• Real-time temperature
• Rainfall data
• Humidity levels
• Weather-based recommendations`;
    }

    return `🌤️ Weather Insights:

**Recent Conditions:**
• Temperature: ${latestPrediction.temperature}°C
• Rainfall: ${latestPrediction.rainfall}mm
• Humidity: ${latestPrediction.humidity || 'N/A'}%

**Impact on Crops:**
${getWeatherImpactAdvice(latestPrediction.temperature, latestPrediction.rainfall)}

Want to know how this affects specific crops?`;
  }

  // Fertilizer questions
  if (lowerMessage.match(/\b(fertilizer|npk|nitrogen|phosphorus|potassium|manure)\b/)) {
    return `🌱 Fertilizer Recommendations:

**NPK Basics:**
• **Nitrogen (N):** Leaf growth, green color
• **Phosphorus (P):** Root development, flowering
• **Potassium (K):** Overall plant health, disease resistance

**Optimal Levels (kg/ha):**
• Nitrogen: 150-300 (depending on crop)
• Phosphorus: 30-60
• Potassium: 200-300

**Application Tips:**
✓ Split nitrogen applications for better absorption
✓ Apply phosphorus at planting time
✓ Add potassium for stress resistance
✓ Use organic manure when possible

**For Your Soil Type:**
${predictions[0] ? `Based on your recent data, focus on maintaining balanced NPK ratios.` : 'Create a prediction to get soil-specific advice!'}

Need fertilizer schedule for a specific crop?`;
  }

  // Market/price questions
  if (lowerMessage.match(/\b(price|market|sell|revenue|profit)\b/)) {
    if (predictions.length === 0) {
      return `I can help you with market prices and revenue estimates!

Create predictions first, and I'll show you:
• Current market prices for your crops
• Potential revenue calculations
• Price trends
• Best time to sell

Add your first prediction to get started!`;
    }

    return `💰 Market Insights:

**Your Crops:**
${predictions.slice(0, 3).map((p: any, i: number) => 
  `${i + 1}. ${p.crop}: Estimated ${p.predictedYield.toFixed(1)} quintals`
).join('\n')}

**Tips for Better Prices:**
• Monitor mandi prices regularly
• Consider storage if prices are low
• Sell when demand is high (festivals, seasons)
• Join farmer cooperatives for better rates
• Use government MSP schemes when available

Want specific price info for any crop?`;
  }

  // Disease/pest questions
  if (lowerMessage.match(/\b(disease|pest|insect|fungus|infection)\b/)) {
    return `🐛 Pest & Disease Management:

**Prevention Tips:**
✓ Regular crop monitoring
✓ Crop rotation to break pest cycles
✓ Use disease-resistant varieties
✓ Maintain proper spacing for air circulation
✓ Remove infected plants immediately

**Integrated Pest Management (IPM):**
1. Physical control (traps, barriers)
2. Biological control (natural predators)
3. Chemical control (only when necessary)

**Common Issues:**
• Rice: Brown plant hopper, blast disease
• Wheat: Rust, aphids
• Cotton: Bollworm, whitefly
• Vegetables: Fruit borers, fungal diseases

Noticed any symptoms? Describe them for specific advice!`;
  }

  // Help/capabilities
  if (lowerMessage.match(/\b(help|what|how|can you)\b/)) {
    return `🤖 I'm your AI Farm Assistant! Here's what I can help with:

**Analytics & Insights:**
• View your farm performance
• Track yield predictions
• Analyze crop patterns

**Recommendations:**
• Crop selection based on soil & location
• Irrigation scheduling
• Fertilizer application
• Pest management

**Market Intelligence:**
• Current crop prices
• Revenue estimates
• Best selling times

**Weather Analysis:**
• Impact on crops
• Irrigation needs
• Planting schedules

**Ask me anything like:**
"How can I improve wheat yield?"
"What's the best irrigation schedule?"
"Which crops are suitable for my soil?"
"Current market prices for rice?"

Try asking a question! 😊`;
  }

  // Default response with context
  return `I understand you're asking about "${message}".

${farms.length > 0 ? `
**Your Farm:** ${farms[0].name}
• Location: ${farms[0].location}
• Area: ${farms[0].area} acres
• Soil: ${farms[0].soilType}
` : ''}

${predictions.length > 0 ? `
**Recent Predictions:** ${predictions.length} crop(s)
` : ''}

I can help with:
• Crop recommendations
• Yield optimization
• Irrigation planning
• Market prices
• Weather impact
• Fertilizer advice

Could you rephrase your question or ask something specific? For example:
- "How to increase wheat yield?"
- "Best irrigation schedule for rice?"
- "Current market prices?"`;
}

// Helper functions
function getSoilSpecificAdvice(soilType: string): string {
  const advice: any = {
    "CLAY": "• Water less frequently but deeply\n• Improve drainage with organic matter\n• Avoid overwatering",
    "SANDY": "• Water more frequently\n• Add compost to improve retention\n• Use drip irrigation",
    "LOAMY": "• Ideal for most crops\n• Moderate watering schedule\n• Maintain organic content",
    "BLACK": "• Excellent water retention\n• Water every 7-10 days\n• Best for cotton and pulses",
  };
  return advice[soilType] || "• Follow standard watering practices\n• Monitor soil moisture\n• Adjust based on crop needs";
}

function getCropRecommendations(soilType: string, location: string): string {
  const recommendations: any = {
    "CLAY": "**Best Crops:** Rice, Wheat, Cotton, Sugarcane",
    "SANDY": "**Best Crops:** Groundnut, Millet, Pulses, Vegetables",
    "LOAMY": "**Best Crops:** Most crops thrive! Wheat, Maize, Vegetables",
    "BLACK": "**Best Crops:** Cotton, Jowar, Groundnut, Pulses",
    "RED": "**Best Crops:** Groundnut, Millets, Pulses, Oilseeds",
  };
  return recommendations[soilType] || "**Suitable Crops:** Consult local agricultural experts for best results";
}

function getWeatherImpactAdvice(temp: number, rainfall: number): string {
  let advice = "";
  
  if (temp > 35) {
    advice += "⚠️ High temperature may stress crops. Increase irrigation frequency.\n";
  } else if (temp < 15) {
    advice += "❄️ Low temperature may slow growth. Consider protective measures.\n";
  } else {
    advice += "✅ Temperature is optimal for most crops.\n";
  }

  if (rainfall < 50) {
    advice += "☀️ Low rainfall. Ensure adequate irrigation.\n";
  } else if (rainfall > 200) {
    advice += "🌧️ High rainfall. Check drainage, watch for fungal diseases.\n";
  } else {
    advice += "✅ Rainfall is adequate.\n";
  }

  return advice;
}

// Placeholder for OpenAI integration
async function generateOpenAIResponse(message: string, context: any, chatHistory: any[]) {
  // TODO: Implement OpenAI API call
  // const completion = await openai.chat.completions.create({...});
  return NextResponse.json({ 
    response: "OpenAI integration not configured. Using smart fallback responses." 
  });
}

// Placeholder for Gemini integration
async function generateGeminiResponse(message: string, context: any, chatHistory: any[]) {
  // TODO: Implement Google Gemini API call
  return NextResponse.json({ 
    response: "Gemini integration not configured. Using smart fallback responses." 
  });
}