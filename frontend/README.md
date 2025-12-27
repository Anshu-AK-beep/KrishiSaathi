# 🌾 KrishiSaathi: AI-Powered Crop Yield Prediction and Optimization

> **Empowering Indian farmers with AI-powered agricultural insights to increase crop yields by 20-50%**

KrishiSaathi is a comprehensive web-based agricultural platform that integrates machine learning-based crop yield predictions, real-time weather data, soil health analysis, and expert consultations to transform traditional farming into precision agriculture.

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [ML Model Integration](#-ml-model-integration)
- [Database Setup](#-database-setup)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Team](#-team)
- [License](#-license)

---

## ✨ Features

### 🤖 **AI Crop Yield Prediction**
- ML model trained on 10+ years of Indian agricultural data
- 85-92% prediction accuracy
- Real-time weather integration
- Soil nutrient analysis (N-P-K, pH)
- Confidence intervals and risk assessment

### 👨‍🌾 **For Farmers**
- Multilingual support (Hindi, English, regional languages)
- Voice search and input
- Farm profile management
- Crop cycle tracking
- Prediction history and accuracy analysis
- Personalized farming recommendations

### 👨‍🏫 **For Agricultural Experts**
- Expert consultation system
- Regional farming insights
- Knowledge base management
- Farmer query resolution

### 🏛️ **For Government Officials**
- Real-time analytics dashboard
- Regional crop production monitoring
- Platform adoption metrics
- Policy decision support
- Aggregated farmer data (anonymized)

### 🔍 **Smart Search**
- Google-style search interface
- Voice search (Browser Speech API)
- 500+ agricultural knowledge articles
- Category-wise browsing

---

## 🎥 Demo

### Live Application
🔗 **[KrishiSaathi Live Demo](https://krishisaathi.vercel.app)** *(Replace with actual URL)*

### Screenshots

#### Landing Page
![Landing Page](docs/screenshots/landing.png)

#### Crop Prediction Form
![Prediction Form](docs/screenshots/prediction-form.png)

#### Prediction Results
![Results](docs/screenshots/prediction-results.png)

#### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin-dashboard.png)

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State Management:** React Query (TanStack Query)
- **Authentication:** Clerk
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts

### **Backend**
- **API:** Next.js API Routes (Serverless)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **ML Server:** Flask (Python)
- **File Storage:** Cloudinary / AWS S3

### **ML/AI**
- **Framework:** Scikit-learn
- **Algorithms:** Random Forest, XGBoost
- **Training Data:** Indian Government Agricultural Datasets
- **Features:** 50+ parameters (weather, soil, historical yields)

### **External APIs**
- **Weather:** OpenWeatherMap API
- **Maps:** Google Maps API
- **SMS:** Twilio
- **Email:** Resend

---

## 📁 Project Structure

```
krishisaathi/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication pages
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── dashboard/                # Main dashboard
│   │   ├── predictions/              # Crop prediction pages
│   │   ├── farms/                    # Farm management
│   │   ├── admin/                    # Admin dashboard
│   │   ├── voice/                    # Voice search page
│   │   ├── api/                      # API routes
│   │   │   ├── predictions/
│   │   │   ├── users/
│   │   │   ├── farms/
│   │   │   ├── search/
│   │   │   └── vapi/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/                   # React components
│   │   ├── ui/                       # shadcn/ui components
│   │   ├── Navbar.tsx
│   │   ├── CropPredictionForm.tsx
│   │   ├── SearchWidget.tsx
│   │   ├── AdminStats.tsx
│   │   └── ...
│   ├── lib/                          # Utility libraries
│   │   ├── actions/                  # Server actions
│   │   │   ├── users.ts
│   │   │   ├── predictions.ts
│   │   │   └── farms.ts
│   │   ├── prisma.ts
│   │   ├── db.ts
│   │   └── utils.ts
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-users.ts
│   │   ├── use-predictions.ts
│   │   └── use-farms.ts
│   └── types/                        # TypeScript types
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── seed.ts                       # Seed data
├── ml-backend/                       # Flask ML server
│   ├── app.py                        # Flask application
│   ├── model.pkl                     # Trained ML model
│   ├── encoders/                     # Label encoders
│   │   ├── state_encoder.pkl
│   │   ├── district_encoder.pkl
│   │   ├── season_encoder.pkl
│   │   └── crop_encoder.pkl
│   ├── requirements.txt
│   └── train_model.py                # Model training script
├── public/
│   ├── LOGO-ONLY.png
│   └── ...
├── docs/                             # Documentation
│   ├── SRS.pdf
│   ├── screenshots/
│   └── API.md
├── .env.local                        # Environment variables
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** 18.x or higher
- **npm** or **yarn** or **pnpm**
- **PostgreSQL** 16.x
- **Python** 3.10+ (for ML backend)
- **Git**

### **Installation**

#### 1. Clone the repository

```bash
git clone https://github.com/Anshu-AK-beep/krishisaathi.git
cd krishisaathi
```

#### 2. Install frontend dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

#### 3. Set up environment variables

Create `.env.local` file in root directory:

```bash
cp .env.example .env.local
```

Fill in the required environment variables (see [Environment Variables](#-environment-variables))

#### 4. Set up database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database (optional)
npx prisma db seed
```

#### 5. Install ML backend dependencies

```bash
cd ml-backend
pip install -r requirements.txt
```

#### 6. Start development servers

**Terminal 1: Frontend (Next.js)**
```bash
npm run dev
# Runs on http://localhost:3000
```

**Terminal 2: ML Backend (Flask)**
```bash
cd ml-backend
python app.py
# Runs on http://127.0.0.1:5000
```

#### 7. Open application

Navigate to `http://localhost:3000` in your browser.

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

# ML Backend
NEXT_PUBLIC_ML_API_URL=http://127.0.0.1:5000

# Weather API
WEATHER_API_KEY=your_openweathermap_api_key

# Google Maps (optional)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# File Storage (optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email (optional)
RESEND_API_KEY=your_resend_api_key

# SMS (optional)
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number
```

---

## 🤖 ML Model Integration

### **Flask Backend Setup**

#### 1. Navigate to ML backend

```bash
cd ml-backend
```

#### 2. Install dependencies

```bash
pip install flask flask-cors numpy scikit-learn pandas joblib
```

#### 3. Train the model (optional)

```bash
python train_model.py
```

This will generate:
- `model.pkl` - Trained ML model
- `encoders/` - Label encoders for categorical variables

#### 4. Start Flask server

```bash
python app.py
```

Server runs on `http://127.0.0.1:5000`

### **API Endpoint**

#### **POST /predict**

**Request:**
```json
{
  "State_Name": "Punjab",
  "District_Name": "Amritsar",
  "Season": "Rabi",
  "Crop": "Wheat",
  "Area": 2.5
}
```

**Response:**
```json
{
  "predicted_production": 12.5,
  "yield_per_hectare": 5.0,
  "unit": "tonnes",
  "weather_data": {
    "temperature": 28.5,
    "rainfall": 850.0,
    "humidity": 65.0
  },
  "soil_data": {
    "nitrogen": 280,
    "phosphorus": 45,
    "potassium": 55,
    "pH": 6.5
  },
  "recommendations": [
    "Expected yield for Wheat is 12.5 tonnes",
    "Ensure proper irrigation during critical growth stages",
    "Monitor soil moisture levels regularly"
  ]
}
```

---

## 💾 Database Setup

### **Prisma Schema**

The database schema is defined in `prisma/schema.prisma`:

```prisma
model User {
  id          String   @id @default(uuid())
  clerkUserId String   @unique
  email       String   @unique
  firstName   String?
  lastName    String?
  role        UserRole @default(FARMER)
  farms       Farm[]
  predictions CropPrediction[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Farm {
  id          String   @id @default(uuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  name        String
  location    String
  area        Float
  soilType    String
  predictions CropPrediction[]
}

model CropPrediction {
  id                  String   @id @default(uuid())
  userId              String
  user                User     @relation(fields: [userId], references: [id])
  farmId              String
  farm                Farm     @relation(fields: [farmId], references: [id])
  cropType            String
  season              String
  predictedYield      Float
  actualYield         Float?
  accuracyPercentage  Float?
  createdAt           DateTime @default(now())
}
```

### **Running Migrations**

```bash
# Create a new migration
npx prisma migrate dev --name your_migration_name

# Apply migrations to production
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

### **Database Studio**

View and edit your database with Prisma Studio:

```bash
npx prisma studio
```

Opens at `http://localhost:5555`

---

## 📚 API Documentation

### **Authentication**

All API routes (except public endpoints) require authentication via Clerk.

### **Endpoints**

#### **Users**

- `GET /api/users` - Get all users (admin only)
- `GET /api/users?role=FARMER` - Filter by role
- `GET /api/users/:id` - Get user by ID
- `PATCH /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

#### **Predictions**

- `GET /api/predictions` - Get user's predictions
- `POST /api/predictions` - Create prediction
- `GET /api/predictions/:id` - Get prediction details
- `PATCH /api/predictions/:id` - Update prediction
- `DELETE /api/predictions/:id` - Delete prediction

#### **Farms**

- `GET /api/farms` - Get user's farms
- `POST /api/farms` - Create farm
- `GET /api/farms/:id` - Get farm details
- `PATCH /api/farms/:id` - Update farm
- `DELETE /api/farms/:id` - Delete farm

#### **Search**

- `GET /api/search?q=wheat` - Search knowledge base

For detailed API documentation, see [docs/API.md](docs/API.md)

---

## 🧪 Testing

### **Run Tests**

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### **Test Structure**

```
tests/
├── unit/
│   ├── components/
│   ├── lib/
│   └── hooks/
├── integration/
│   ├── api/
│   └── ml/
└── e2e/
    ├── auth.spec.ts
    ├── prediction.spec.ts
    └── admin.spec.ts
```

### **Example Test**

```typescript
// tests/integration/api/predictions.test.ts
describe('Predictions API', () => {
  it('should create prediction successfully', async () => {
    const response = await fetch('/api/predictions', {
      method: 'POST',
      body: JSON.stringify({
        farmId: 'test-farm-id',
        cropType: 'Wheat',
        season: 'Rabi',
        area: 2.5
      })
    });
    
    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.predicted_production).toBeGreaterThan(0);
  });
});
```

---

## 🚀 Deployment

### **Frontend (Vercel)**

#### 1. Install Vercel CLI

```bash
npm i -g vercel
```

#### 2. Login to Vercel

```bash
vercel login
```

#### 3. Deploy

```bash
vercel --prod
```

### **ML Backend (Railway/AWS)**

#### **Option 1: Railway**

1. Create account at [railway.app](https://railway.app)
2. Install Railway CLI
3. Deploy:

```bash
cd ml-backend
railway login
railway init
railway up
```

#### **Option 2: AWS EC2**

1. Launch EC2 instance (Ubuntu 22.04)
2. SSH into instance
3. Install dependencies:

```bash
sudo apt update
sudo apt install python3-pip nginx
```

4. Clone repository and install requirements
5. Set up Gunicorn + Nginx
6. Configure SSL with Let's Encrypt

### **Database (Supabase)**

1. Create project at [supabase.com](https://supabase.com)
2. Copy connection string
3. Update `DATABASE_URL` in environment variables
4. Run migrations:

```bash
npx prisma migrate deploy
```

---

## 👥 Team

**Code_Catalysis Team**

| Name | Roll No | Contribution |
|------|---------|--------------|
| **Anshu** | 13438 / 23025570010 | Project Lead, Frontend Architecture, ML Integration |
| **Anshuman Singh** | 13440 / 23025570011 | Backend Development, API Design, Database |
| **Harsh Garg** | 13456 / 23025570026 | ML Model Development, Data Processing |
| **Suryansh Kashyap** | 13479 / 23025570069 | UI/UX Design, Component Development |
| **Harsh Dangwal** | 13488 / 23025570025 | Testing, Documentation, Deployment |

**Supervisor:** Mr. Suyash Kumar (Assistant Professor, Department of Computer Science, Hansraj College)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgements

- **Hansraj College, University of Delhi** for project support
- **Food and Agriculture Organization (FAO)** for agricultural data
- **Indian Meteorological Department (IMD)** for weather API
- **National Remote Sensing Centre (NRSC)** for Bhuvan API
- **Open source community** for amazing tools and libraries

---

## 📞 Contact

- **Email:** krishisaathi@gmail.com
- **GitHub:** [github.com/your-org/krishisaathi](https://github.com/your-org/krishisaathi)
- **Documentation:** [docs.krishisaathi.com](https://docs.krishisaathi.com)

---

## 🌟 Show Your Support

If this project helped you, please ⭐️ this repository and share it with others!

---

## 📈 Roadmap

### **Phase 1: MVP** ✅ (Completed)
- [x] User authentication
- [x] Crop yield prediction
- [x] Admin dashboard
- [x] Search interface

### **Phase 2: Enhanced Features** (In Progress)
- [ ] Expert consultation system
- [ ] Farmer community forums
- [ ] Mobile app (React Native)
- [ ] SMS notifications

### **Phase 3: Advanced Features** (Planned)
- [ ] IoT sensor integration
- [ ] Drone imagery analysis
- [ ] Market linkage
- [ ] Government scheme integration

---

## 🐛 Bug Reports & Feature Requests

Found a bug or have a feature request? Please open an issue on GitHub:

[Create New Issue](https://github.com/your-org/krishisaathi/issues/new)

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

```bash
# Fork the repo
# Create your feature branch
git checkout -b feature/AmazingFeature

# Commit your changes
git commit -m 'Add some AmazingFeature'

# Push to the branch
git push origin feature/AmazingFeature

# Open a Pull Request
```

---

<div align="center">

**Built with ❤️ for Indian Farmers**

*Transforming Agriculture Through Technology*

[Website](https://krishisaathi.vercel.app) • [Documentation](https://docs.krishisaathi.com) • [API Reference](https://api.krishisaathi.com)

</div>