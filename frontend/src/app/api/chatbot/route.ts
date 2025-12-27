import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const authResult = await auth();
    const { userId } = authResult;
    
    if (!userId) {
      console.error("No userId found in auth");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message } = await request.json();
    console.log(message);

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    console.log("Processing message for user:", userId);

    const systemPrompt = `You are an expert agricultural advisor helping farmers in India. 
Provide practical, actionable advice on:
- Crop selection and cultivation
- Soil health and fertilizers
- Pest and disease management
- Irrigation techniques
- Weather-based farming tips
- Seasonal recommendations

Keep responses concise, friendly, and easy to understand for small farmers.
Use simple language and provide specific steps when possible.`;

    // OPTION 1: Groq API (Free & Fast) - RECOMMENDED
    if (process.env.GROQ_API_KEY) {
      console.log("Using Groq API");
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile", // Fast and accurate
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Groq API error:", errorText);
        throw new Error("Groq API error");
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      return NextResponse.json({ response: aiResponse });
    }

    // OPTION 2: OpenAI API
    if (process.env.OPENAI_API_KEY) {
      console.log("Using OpenAI API");
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message }
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenAI API error:", errorText);
        throw new Error("OpenAI API error");
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      return NextResponse.json({ response: aiResponse });
    }

    // OPTION 3: Hugging Face API (Free)
    if (process.env.HUGGINGFACE_API_KEY) {
      console.log("Using Hugging Face API");
      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          },
          body: JSON.stringify({
            inputs: `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.7,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Hugging Face API error:", errorText);
        throw new Error("Hugging Face API error");
      }

      const data = await response.json();
      const aiResponse = data[0].generated_text.split("Assistant:")[1].trim();
      return NextResponse.json({ response: aiResponse });
    }

    // OPTION 4: Mock Response (Works without any API)
    console.log("No AI API configured. Using intelligent mock response.");
    const mockResponse = generateMockResponse(message);
    return NextResponse.json({ response: mockResponse });

  } catch (error: any) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process message" },
      { status: 500 }
    );
  }
}

// Enhanced Mock Response Generator
function generateMockResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("wheat") || lowerMessage.includes("गेहूं")) {
    return `🌾 **Wheat Cultivation Guide**

**Best Planting Time:** November-December (Rabi season)

**Soil Requirements:**
- Well-drained loamy soil
- pH level: 6.0-7.5
- Good organic matter content

**Fertilizer Application:**
- NPK ratio: 120:60:40 kg/acre
- Apply in 2-3 splits
- First dose at sowing, second at tillering

**Irrigation Schedule:**
- First irrigation: 20-25 days after sowing
- Then every 20-25 days
- Critical stages: Crown root initiation, tillering, flowering, grain filling

**Harvest:** Ready in 120-150 days when grains are hard and golden yellow.

Would you like variety recommendations for your region?`;
  }

  if (lowerMessage.includes("rice") || lowerMessage.includes("धान") || lowerMessage.includes("paddy")) {
    return `🌾 **Rice Farming Guide**

**Planting Season:** Kharif (June-July)

**Water Management:**
- Requires standing water (5-7 cm depth)
- Maintain water level throughout growth
- Drain 10 days before harvest

**Transplanting:**
- Seedlings: 21-25 days old
- Spacing: 20x15 cm or 15x15 cm
- 2-3 seedlings per hill

**Fertilizer Schedule:**
- Urea in 3 splits: Basal, Tillering, Panicle stage
- Apply DAP/SSP at basal dose

**Common Pests:**
- Stem borers, leaf folders, brown plant hopper
- Use light traps and biological control

Need specific variety suggestions?`;
  }

  if (lowerMessage.includes("soil") || lowerMessage.includes("मिट्टी")) {
    return `🌱 **Soil Health Management**

**Soil Testing:**
- Get soil tested every 2-3 years
- Test for: pH, NPK, organic carbon
- Contact your local agriculture office

**Improving Soil Health:**
1. **Add Organic Matter:** 5-10 tons/acre of FYM or compost
2. **Crop Rotation:** Alternate cereals with legumes
3. **Green Manuring:** Grow dhaincha, sunhemp before main crop
4. **Mulching:** Cover soil with crop residue
5. **Avoid Burning:** Don't burn crop residue

**pH Management:**
- For acidic soil: Add lime
- For alkaline soil: Add gypsum/sulfur

What's your soil type? (Sandy/Loamy/Clay)`;
  }

  if (lowerMessage.includes("pest") || lowerMessage.includes("कीट") || lowerMessage.includes("insect")) {
    return `🐛 **Integrated Pest Management**

**Prevention (Most Important):**
- Regular field inspection (2-3 times/week)
- Remove weeds and alternate hosts
- Use resistant varieties
- Proper spacing for air circulation

**Organic Control:**
- Neem oil spray (5ml/liter)
- Pheromone traps for moths
- Yellow sticky traps for whiteflies
- Encourage natural predators

**Chemical Control (Last Resort):**
- Use only when pest exceeds threshold
- Follow label instructions strictly
- Apply early morning or evening
- Wear protective equipment

**Spray Timing:** Avoid during flowering and before rain

Which pest are you facing? I can provide specific treatment.`;
  }

  if (lowerMessage.includes("fertilizer") || lowerMessage.includes("खाद") || lowerMessage.includes("manure")) {
    return `🌿 **Fertilizer Management Guide**

**Soil Test First:** Always get soil tested before application

**NPK Guidelines by Crop:**
- Wheat: 120:60:40 kg/acre
- Rice: 100:50:50 kg/acre
- Sugarcane: 200:80:80 kg/acre
- Cotton: 100:50:50 kg/acre

**Application Method:**
- Split application for better efficiency
- Don't apply on dry soil
- Incorporate into soil when possible

**Organic Alternatives:**
- FYM: 5-10 tons/acre
- Vermicompost: 2-3 tons/acre
- Green manure crops
- Biofertilizers (Rhizobium, PSB, Azotobacter)

**Signs of Deficiency:**
- Nitrogen: Yellowing of older leaves
- Phosphorus: Purple discoloration
- Potassium: Burning of leaf margins

Which crop are you growing?`;
  }

  if (lowerMessage.includes("water") || lowerMessage.includes("irrigation") || lowerMessage.includes("पानी")) {
    return `💧 **Irrigation Management**

**Efficient Methods:**
1. **Drip Irrigation** - 50-70% water saving
2. **Sprinkler** - 30-50% water saving
3. **Furrow** - Traditional method

**When to Irrigate:**
- Early morning or evening (less evaporation)
- Based on critical growth stages
- Avoid over-irrigation (causes diseases)

**Water Conservation:**
- Mulching reduces evaporation
- Leveling prevents water wastage
- Check for leaks regularly

**Critical Stages (Wheat):**
- Crown root initiation (20-25 days)
- Tillering (40-45 days)
- Flowering (60-65 days)
- Grain filling (85-90 days)

**Signs of Water Stress:**
- Leaf wilting, rolling
- Reduced growth
- Early flowering

What's your water source? (Tubewell/Canal/Rainfed)`;
  }

  if (lowerMessage.includes("disease") || lowerMessage.includes("बीमारी") || lowerMessage.includes("fungus")) {
    return `🦠 **Disease Management**

**Common Crop Diseases:**

**Fungal Diseases:**
- Rust, blight, wilt, mildew
- Prevention: Crop rotation, resistant varieties
- Control: Fungicides (Mancozeb, Copper oxychloride)

**Bacterial Diseases:**
- Leaf spot, soft rot
- Control: Remove infected plants, use copper sprays

**Viral Diseases:**
- Leaf curl, mosaic
- Control: Remove infected plants, control vectors

**Prevention Tips:**
1. Use disease-free seeds
2. Avoid overhead irrigation
3. Improve air circulation
4. Remove crop residue
5. Regular field monitoring

**Spray Schedule:**
- Preventive sprays at critical stages
- Don't spray during flowering
- Mix spreader-sticker for better coverage

Which crop and symptoms are you seeing?`;
  }

  if (lowerMessage.includes("weather") || lowerMessage.includes("मौसम") || lowerMessage.includes("rain")) {
    return `🌤️ **Weather-Based Farming Tips**

**Before Operations:**
- Check 7-day forecast
- Avoid spraying 24 hours before rain
- Don't apply fertilizer if heavy rain expected

**Temperature Effects:**
- >35°C: Increase irrigation frequency
- <10°C: Many crops get damaged
- Flowering stage sensitive to extreme temps

**Humidity Management:**
- High humidity increases disease risk
- Improve spacing and drainage
- Apply preventive fungicides

**Wind Protection:**
- Plant windbreaks for high-value crops
- Stake tall plants
- Harvest before storms

**Useful Apps:**
- Meghdoot (IMD's official app)
- Kisan Suvidha
- Mausam (Weather forecast)

**Regional Info:**
Check with your local agriculture office for specific advisories.

What's your location? I can provide seasonal advice.`;
  }

  if (lowerMessage.includes("organic") || lowerMessage.includes("जैविक")) {
    return `🌿 **Organic Farming Practices**

**Organic Fertilizers:**
- FYM: 10-15 tons/acre
- Vermicompost: 3-4 tons/acre
- Green manure: Dhaincha, Sunhemp
- Biofertilizers: Rhizobium, Azotobacter, PSB

**Pest Control:**
- Neem oil/cake
- Panchagavya spray
- Botanical extracts
- Trap crops

**Weed Management:**
- Manual weeding
- Mulching
- Stale seedbed technique
- Cover crops

**Certification:**
Contact nearby organic certification agencies
- 3-year conversion period required
- Maintain proper records

**Benefits:**
- Better soil health
- Premium prices
- Reduced input costs (long-term)
- Safer for environment

Interested in specific organic inputs?`;
  }

  // Default comprehensive response
  return `🌾 **Welcome to Agricultural Advisory!**

I'm here to help you with farming guidance. I can assist with:

**Crop Cultivation:**
• Wheat, Rice, Sugarcane, Cotton, Pulses
• Vegetables and Fruits
• Variety selection

**Soil & Nutrition:**
• Soil testing and amendments
• Fertilizer recommendations
• Organic farming

**Plant Protection:**
• Pest identification and control
• Disease management
• Weed control

**Farm Management:**
• Irrigation scheduling
• Weather-based advisories
• Crop rotation planning

**Please ask me about:**
- A specific crop you're growing
- Any farming problem you're facing
- Best practices for your region

Example: "How to grow wheat?" or "My rice plants have yellow leaves"

What would you like to know? 🌱`;
}