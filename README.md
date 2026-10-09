# REPLATE — Give Surplus Food Another Route

> **"Food should move. Not waste."**

**REPLATE** is a smart, deterministic food-surplus decision and rescue platform developed for the **Food Waste & Supply Chain** competition. It helps kitchens, caterers, and food businesses assess surplus food, determine the most viable routing strategy, match with compatible intake destinations, track real-time custody handovers, and measure verified environmental and nutritional impact.

```text
SURPLUS → ASSESS → SCORE → ROUTE → MATCH → RESCUE → IMPACT
```

---

## 🌟 Key Highlights & Innovation

1. **Deterministic Rescue Decision Engine (100% Rule-Based):**
   - Zero black-box hallucinations. All scoring calculations are mathematically verifiable JavaScript linear combinations based on 5 weighted supply-chain criteria (Condition 30%, Urgensi 25%, Volume 15%, Distribusi 15%, Tujuan 15%).
2. **Multi-Tier Safety Routing Gates:**
   - **`REDISTRIBUTE`**: Direct human nourishment to community kitchens and shelters.
   - **`PROCESS`**: Culinary transformation and upcycling (croutons, purees, dehydrated ingredients).
   - **`ORGANIC`**: Mandatory biological diversion to composting/bio-gas when safety thresholds are exceeded. Never human consumption.
3. **Proximity & Capacity Matching Algorithm:**
   - Evaluates recipient dietary scope, refrigeration capacity, operating hours, and transit distance.
4. **Bilingual Support (ID 🇮🇩 / EN 🇬🇧):**
   - Seamless one-click language toggle across all pages, forms, and metrics.
5. **Local-First Architecture:**
   - 100% browser-based persistence using `localStorage`. No external database or login required. Works fully offline after build.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or pnpm

### 1. Installation
```bash
# Clone or extract repository
cd replate

# Install dependencies
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open your browser and navigate to:
👉 **`http://localhost:5173/`**

### 3. Production Build & Preview
```bash
# Verify production compilation
npm run build

# Preview production build locally
npm run preview
```

---

## 🎯 3-Minute Competition Demonstration Walkthrough

1. **Load Sample Data:**
   - Click the **`✨ Data Demo`** / **`✨ Sample Data`** pill button in the top right of the Navbar to populate the local database with realistic operational rescue scenarios.
2. **Report Surplus:**
   - Go to **`Lapor Surplus`** (`/report`).
   - Click one of the quick preset pills (e.g., **🍱 8 kg Nasi / Rice**).
   - Click **`Hitung Rute Penyelamatan ✨`** (**`Assess Surplus Now ✨`**).
3. **Inspect Decision Engine:**
   - View the calculated **Rescue Score** (e.g. 91/100 - High Priority).
   - Review the factor breakdown bars and the recommended route (**REDISTRIBUTE**).
   - Pick the top recommended partner: **Community Kitchen Alpha (94% Match)**.
   - Click **`Konfirmasi & Mulai Pengiriman 🚚`** (**`Confirm Route & Dispatch 🚚`**).
4. **Track Live Journey:**
   - Follow the custodial timeline in **`Perjalanan`** (`/journeys`).
   - Click **`Perbarui Status Pengiriman →`** (**`Advance Status →`**) to progress from *In Transit* to *Diterima & Terselamatkan ✅* (*Received & Rescued*).
5. **Measure Impact:**
   - Open **`Dampak`** (`/impact`) to see verified kilograms diverted, servings plated (GFN standard: 0.35 kg/portion), and CO₂e emissions prevented (US EPA WARM: 2.5 kg CO₂e/kg).
6. **Operational Simulator:**
   - Open **`Simulasi & Wawasan`** (`/insights`) to test the interactive surplus prevention simulator and see how kitchen batching trims upstream waste.

---

## 📁 Source Code Structure

```text
replate/
├── public/                 # Static assets (favicons, SVGs)
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── EmptyState.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── Footer.jsx
│   │   ├── JourneyTimeline.jsx
│   │   ├── MatchCard.jsx
│   │   ├── Navbar.jsx
│   │   ├── PreventionSimulator.jsx
│   │   ├── ScoreBreakdown.jsx
│   │   └── StatusBadge.jsx
│   ├── data/               # Static benchmark data & rules
│   │   ├── destinations.js
│   │   ├── foods.js
│   │   └── rules.js
│   ├── engine/             # Core Deterministic Business Logic
│   │   ├── matchingEngine.js
│   │   ├── rescueScore.js
│   │   └── routeEngine.js
│   ├── pages/              # 5 Core Application Pages
│   │   ├── Assessment.jsx
│   │   ├── Home.jsx
│   │   ├── Impact.jsx
│   │   ├── Insights.jsx
│   │   └── ReportSurplus.jsx
│   ├── utils/              # Storage, formatting, i18n
│   │   ├── calculations.js
│   │   ├── formatters.js
│   │   ├── i18n.js
│   │   └── storage.js
│   ├── App.jsx             # Root Application & State Sync
│   ├── index.css           # Tailwind & Custom Utility Styles
│   └── main.jsx            # Application Entry Point
├── index.html              # HTML Shell & Web Fonts
├── package.json            # Dependencies & Scripts
├── tailwind.config.js      # Custom Theme (Teal, Sun Yellow, Fredoka font)
└── vite.config.js          # Vite Bundler Configuration
```

---

## 🛡️ Food Safety & Integrity Notice

> **REPLATE provides algorithmic decision-support for commercial surplus redistribution. It does not replace professional on-site food safety inspections or verified temperature holding standards. Redistribution decisions should always comply with applicable public health and food safety guidelines.**

---

## ⚖️ License
MIT License. Built for competition demonstration.
