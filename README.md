# 🌾 KrishiSaathi - Smart Farming Assistant

> An AI-powered agricultural intelligence platform that empowers Indian farmers with crop yield predictions, smart recommendations, and multilingual support.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Available Scripts](#available-scripts)
- [API Documentation](#api-documentation)
- [Multilingual Support](#multilingual-support)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Overview

**KrishiSaathi** (meaning "Farmer's Companion" in Hindi) is a comprehensive digital platform designed to modernize Indian agriculture through AI-powered decision support systems. The platform addresses critical challenges faced by farmers including unpredictable crop yields, inefficient resource management, and lack of access to timely agricultural intelligence.

### Problem Statement

Agricultural productivity in India faces unprecedented challenges due to climate change, resource scarcity, and information asymmetry. Farmers struggle with unpredictable yields, inefficient irrigation, excessive fertilizer use, and reactive pest control. KrishiSaathi bridges this gap by providing data-driven insights, personalized recommendations, and accessible multilingual interfaces.

### Key Objectives

- 🎯 **Accurate Yield Prediction** - AI/ML models for crop yield forecasting
- 💧 **Resource Optimization** - Smart irrigation and fertilization recommendations
- 🌐 **Multilingual Access** - Support for 5 Indian languages (EN, HI, GU, PA, TA)
- 🎤 **Voice Assistant** - Hands-free agricultural guidance
- 📊 **Data Analytics** - Insights for farmers and agricultural administrators

---

## ✨ Features

### For Farmers

#### 🏡 Farm Management
- Register and manage multiple farm parcels
- Digital farm profiles with GPS coordinates
- Soil health tracking (pH, NPK, organic matter)
- Irrigation infrastructure documentation
- Crop history and rotation planning

#### 🌾 Crop Yield Prediction
- AI-powered yield forecasting before planting
- Confidence levels and yield ranges (min, expected, max)
- Season-specific predictions (Kharif, Rabi, Zaid)
- Historical accuracy tracking
- Revenue estimation based on market prices

#### 🌤️ Weather Integration
- Real-time weather data for farm locations
- 7-day weather forecasts
- Historical climate pattern analysis
- Weather impact assessment on selected crops
- Early warnings for extreme weather events

#### 💡 Smart Recommendations
- **Irrigation Optimization**: Crop-specific water schedules
- **Fertilization Planning**: NPK balance, quantity, and timing
- **Pest Control**: Risk assessment and IPM strategies
- **Planting Guidance**: Optimal dates and crop selection

#### 🎤 Voice Assistant
- Multilingual voice commands (5 languages)
- Hands-free farm data entry
- Voice-based crop queries
- Weather updates via voice
- Agricultural advice in native language

#### 🌍 Multilingual Support
- English, Hindi (हिन्दी), Gujarati (ગુજરાતી), Punjabi (ਪੰਜਾਬੀ), Tamil (தமிழ்)
- Complete UI translation
- Voice support in all languages
- Regional crop terminology

### For Administrators

#### 📊 Analytics Dashboard
- User adoption and engagement metrics
- Prediction accuracy across regions
- Crop distribution and seasonal trends
- Farm size and soil type statistics
- Active farmers and prediction counts

#### 🔍 Insights & Reporting
- Regional agricultural patterns
- Prediction performance analysis
- Resource utilization trends
- Impact assessment data

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React Context API
- **Authentication**: Clerk

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes
- **ORM**: Prisma
- **Database**: PostgreSQL (Neon/Supabase)
- **Validation**: Zod

### AI/ML & External Services
- **Crop Prediction**: Custom ML models (Python/FastAPI - if applicable)
- **Voice Assistant**: Vapi AI
- **Weather API**: OpenWeatherMap / IMD
- **Translation**: Custom translation system

### DevOps & Tools
- **Version Control**: Git, GitHub
- **Package Manager**: npm/yarn/pnpm
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions (optional)

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm/yarn/pnpm
- PostgreSQL database (local or cloud)
- Clerk account for authentication
- Weather API key (OpenWeatherMap)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/krishisaathi.git
cd krishisaathi
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials (see [Environment Variables](#environment-variables))

4. **Set up the database**
```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) Seed the database
npx prisma db seed
```

5. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

6. **Open the application**

Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
krishisaathi/
├── src/
│   ├── app/                      # Next.js 14 App Router
│   │   ├── (auth)/              # Authentication routes
│   │   ├── admin/               # Admin dashboard
│   │   ├── dashboard/           # User dashboard
│   │   ├── farms/               # Farm management
│   │   │   └── [id]/
│   │   │       └── edit/        # Farm edit page
│   │   ├── predict/             # Crop prediction
│   │   ├── predictions/         # Analytics
│   │   ├── voice/               # Voice assistant
│   │   ├── api/                 # API routes
│   │   │   ├── farms/
│   │   │   ├── predictions/
│   │   │   └── weather/
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   └── globals.css          # Global styles
│   │
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── dashboard/           # Dashboard components
│   │   ├── farm/                # Farm management components
│   │   ├── prediction/          # Prediction components
│   │   ├── voice/               # Voice assistant components
│   │   ├── landing/             # Landing page components
│   │   ├── Navbar.tsx
│   │   ├── LanguageSelector.tsx
│   │   └── FloatingVoiceButton.tsx
│   │
│   ├── contexts/                # React contexts
│   │   └── LanguageContext.tsx  # Translation context
│   │
│   ├── lib/                     # Utility libraries
│   │   ├── i18n/
│   │   │   └── translations.ts  # Translation keys
│   │   ├── prisma.ts            # Prisma client
│   │   ├── auth.ts              # Auth configuration
│   │   └── utils.ts             # Helper functions
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useTranslation.ts
│   │   └── useToast.ts
│   │
│   └── types/                   # TypeScript types
│       ├── farm.ts
│       ├── prediction.ts
│       └── user.ts
│
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── seed.ts                  # Seed data
│
├── public/                      # Static assets
│   ├── LOGO-ONLY.png
│   └── ...
│
├── .env.local                   # Environment variables (not in repo)
├── .env.example                 # Example env file
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── package.json
└── README.md
```

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/krishisaathi"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Admin Configuration
ADMIN_EMAIL=admin@krishisaathi.com

# Weather API
NEXT_PUBLIC_WEATHER_API_KEY=your_openweathermap_api_key

# Voice Assistant (Vapi)
NEXT_PUBLIC_VAPI_PUBLIC_KEY=your_vapi_public_key

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🗄️ Database Setup

### Prisma Schema Overview

The database includes the following main models:

- **User** - Farmer/Admin profiles
- **Farm** - Farm information and properties
- **CropPrediction** - Yield predictions and recommendations
- **WeatherData** - Historical weather records (optional)

### Running Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio to view data
npx prisma studio
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma Client
npm run db:push      # Push schema changes
npm run db:studio    # Open Prisma Studio
npm run db:seed      # Seed database

# Type Checking
npm run type-check   # Run TypeScript compiler check
```

---

## 📡 API Documentation

### Farm Management

#### Create Farm
```http
POST /api/farms/create
Content-Type: application/json

{
  "name": "My Farm",
  "location": "Village, District, State",
  "totalArea": 5.5,
  "soilType": "LOAMY",
  "irrigationType": "DRIP",
  "farmOwnership": "OWNED",
  "farmingType": "ORGANIC",
  "primaryCrops": ["WHEAT", "RICE"]
}
```

#### Get All Farms
```http
GET /api/farms
```

#### Update Farm
```http
PATCH /api/farms/[id]
Content-Type: application/json

{
  "name": "Updated Farm Name",
  "totalArea": 6.0
}
```

#### Delete Farm
```http
DELETE /api/farms/[id]
```

### Crop Prediction

#### Create Prediction
```http
POST /api/predictions/create
Content-Type: application/json

{
  "farmId": "farm-id",
  "cropType": "WHEAT",
  "season": "RABI",
  "plantingDate": "2024-11-01",
  "fieldArea": 5.0,
  "soilPh": 7.2,
  "nitrogenContent": 250,
  "phosphorusContent": 50,
  "potassiumContent": 200
}
```

#### Get Predictions
```http
GET /api/predictions
```

#### Get Prediction by ID
```http
GET /api/predictions/[id]
```

### Weather Data

#### Get Weather Forecast
```http
GET /api/weather?lat=28.6139&lon=77.2090
```

---

## 🌐 Multilingual Support

KrishiSaathi supports 5 Indian languages:

| Language | Code | Native Name |
|----------|------|-------------|
| English | `en` | English |
| Hindi | `hi` | हिन्दी |
| Gujarati | `gu` | ગુજરાતી |
| Punjabi | `pa` | ਪੰਜਾਬੀ |
| Tamil | `ta` | தமிழ் |

### Adding New Translations

1. Open `src/lib/i18n/translations.ts`
2. Add new keys to all language objects:

```typescript
export const translations = {
  en: {
    myNewKey: "My New Text",
  },
  hi: {
    myNewKey: "मेरा नया टेक्स्ट",
  },
  // ... other languages
};
```

3. Use in components:

```typescript
import { useLanguage } from '@/contexts/LanguageContext';

const { t } = useLanguage();
<h1>{t('myNewKey')}</h1>
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation for new features

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact

- **Email**: a69448190@gmail.com
- **Website**: [https://krishi-saathi-green.vercel.app](https://krishi-saathi-green.vercel.app)
- **GitHub**: [@Anshu-AK-beep/krishisaathi](https://github.com/Anshu-AK-beep/krishisaathi)

---

## 🙏 Acknowledgments

- Farmers across India for inspiration and feedback
- Agricultural research institutions for data and insights
- Open-source community for amazing tools
- Indian government's digital agriculture initiatives

---

## 🚧 Roadmap

- [ ] Integration with IoT soil sensors
- [ ] Satellite imagery for field monitoring
- [ ] Market price prediction module
- [ ] Crop disease image recognition
- [ ] Community forum for farmers
- [ ] Mobile app (Android/iOS)
- [ ] Offline mode support
- [ ] Government scheme integration

---

## 📊 Project Status

**Current Version**: v1.0.0  
**Status**: Active Development  
**Last Updated**: January 2026

---

<div align="center">
  <p>Made with ❤️ for Indian Farmers</p>
  <p>🌾 <strong>KrishiSaathi - Your Smart Farming Companion</strong> 🌾</p>
</div>
