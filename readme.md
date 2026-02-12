# Meal Architect - LLM-Based Personalized Recipe Recommendation Platform

End-to-end AI-assisted meal recommendation platform that transforms user preferences, dietary constraints, and biometric context into personalized meal suggestions.

Developed as part of my Bachelor's thesis in Software Engineering and Management (TU Graz).

---

## Overview

Meal Architect was built to reduce friction in meal planning by combining classical recipe APIs with LLM-driven recipe generation in one research-oriented platform.

The system focuses on three main research and engineering components:

1. **Personalized Nutrition & Preference Modeling**
2. **Hybrid Recommendation Pipeline (API + LLM)**
3. **User Study, Rating, and Evaluation Data Collection**

Together, these form a modular full-stack platform for experimentation with AI-supported food recommendation workflows.

---

## 1) Personalized Nutrition & Preference Modeling

The platform captures user-specific context to improve recommendation relevance:

- Age, height, weight, gender, and activity level
- Diet type (e.g., vegetarian, vegan, pescetarian)
- Preferred and excluded ingredients
- Meal type and quantity selections

The backend computes BMR/TDEE-based calorie targets and macro distributions to align generated meals with nutritional needs.

---

## 2) Hybrid Recommendation Pipeline (API + LLM)

To compare and combine approaches, the platform supports two generation modes:

- **`standard` mode**: Recipe retrieval and filtering via external recipe APIs
- **`architect` mode**: LLM-based JSON meal generation with structured output constraints

Pipeline behavior includes:

- Ingredient filtering and diet-aware exclusion logic
- Meal scaling to match calorie targets
- Structured meal objects (ingredients, macros, instructions)
- Optional AI image generation for meals

This enables both deterministic API-driven recommendations and adaptive LLM-generated plans.

---

## 3) User Study, Rating, and Evaluation Data Collection

The application includes a study-oriented interaction flow to support thesis evaluation.

Key features:

- Guided onboarding and consent-oriented study screens
- In-app meal rating workflow (required before survey continuation)
- Survey integration and response capture
- Supabase-based persistence for study/evaluation data

This supports systematic comparison of recommendation quality and user perception.

---

## System Architecture

User Input (biometrics + preferences)  
-> Frontend Form Workflow (Next.js)  
-> Backend Recommendation Route (`/standard` or `/architect`)  
-> Nutrition Logic + Filtering + External Providers (OpenAI / Spoonacular / Edamam)  
-> Structured Meal Response (+ optional image generation)  
-> User Rating + Survey Submission  
-> Supabase Storage for study analytics

The backend exposes modular routes so recommendation strategies can be tested independently.

---

## Core Features

- Personalized meal generation from biometric and preference data
- Dual recommendation strategy (`standard` API mode vs `architect` LLM mode)
- Diet-aware ingredient filtering and exclusion handling
- Calorie and macro target computation
- Structured meal output with instructions and ingredient quantities
- Optional AI-generated meal imagery
- Integrated participant feedback/rating flow
- Survey-backed thesis evaluation pipeline

---

## Tech Stack

### Backend
- Node.js
- Express
- OpenAI API
- Spoonacular API
- Edamam API
- Body-parser / CORS / dotenv

### Frontend
- Next.js (React + TypeScript)
- Material UI
- TailwindCSS
- Supabase JavaScript SDK

### Data / Study Layer
- Supabase (study data + survey-related persistence)

---

## Repository Structure

```text
.
|- backend/                 # Main Express API for recommendation logic
|  |- index.js              # API routes (/architect, /standard, provider routes)
|  |- main.js               # Core recommendation pipeline
|  |- helper.js
|  |- calculator.js
|  |- lists.js
|  `- package.json
|- frontend/                # Next.js frontend and study UX
|  |- pages/
|  |- components/
|  |- utils/
|  `- package.json
|- readme.md                # Original notes/questions file
`- README.md                # Project documentation
```

---

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- API keys for OpenAI and recipe providers (optional depending on mode)
- Supabase project (for data collection flow)

---

### Backend

```bash
cd backend
npm install
npm run dev
```

Create `backend/.env`:

```env
NODE_ENV=development
PORT=4000
DEV_URL=http://localhost
PROD_URL=https://your-domain.tld

OA_API_KEY=your_openai_api_key
ORGANIZATION=your_openai_org_id_optional

EDAMAM_APP_ID=your_edamam_app_id
EDAMAM_API_KEY=your_edamam_api_key
```

API base URL in development:
`http://localhost:4000`

Main recommendation routes:
- `POST /architect` (LLM mode)
- `POST /standard` (API mode)

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Frontend:
`http://localhost:3000`

---

## Research Context

This repository was developed within the scope of my Bachelor's thesis at TU Graz, focused on AI-assisted food recommender systems.

The project demonstrates:

- Applied LLM integration in a production-style recommendation flow
- Hybrid architecture combining classical APIs with generative models
- Personalized nutrition-aware recommendation logic
- Evaluation-driven development through user ratings and study data collection
- Full-stack system architecture (API + frontend + data layer)

---

## License

MIT License
