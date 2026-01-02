# CopperGuard AI 🛡️

**Smart Scrap Grading & Supplier Discovery for Indian E-Waste Processors**

CopperGuard AI is a specialized web application designed for small-scale metal workshops and "garage-style" recyclers in India. It bridges the gap between informal scrap dealing and industrial-grade quality control using advanced AI, tailored specifically for low-budget operations.

## 🚀 Key Features

### 1. 🔍 AI Quality Scanner ("Expert Garage Mode")
- **Instant Grading:** Analyzes photos of copper scrap to detect standard market grades (**Berry**, **Candy**, **Birch/Burnt**) and oxidation levels.
- **Low-Cost Fixes:** Suggests accessible workshop remedies using household items like tamarind (*imli*), salt, and sawdust instead of expensive industrial chemicals.
- **Safety First:** Provides localized safety warnings for handling acid or burnt materials.
- **Powered by:** `gemini-3-flash-preview` (Multimodal Vision).

### 2. 📍 Supplier Finder ("The Uber for Scrap")
- **Local Discovery:** Finds nearby "kabadiwalas" (scrap dealers) and industrial scrap yards using real-time geolocation or city search.
- **Maps Integration:** Provides direct navigation links to verified businesses via Google Maps.
- **Contextual Advice:** AI explains *why* a specific dealer might be relevant for a small workshop.
- **Powered by:** `gemini-2.5-flash` with **Google Maps Grounding**.

### 3. 📋 Digital Logbook
- **Track Reliability:** Automatically logs every scan with the supplier's name and quality rating (1-10).
- **History:** Helps owners decide which dealers provide clean *maal* (goods) vs. burnt/oxidized scrap to avoid future losses.

## 🛠️ Technology Stack
- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS, Lucide Icons
- **AI Core:** Google Gemini API (`@google/genai` SDK)
    - **Vision:** `gemini-3-flash-preview`
    - **Grounding:** `gemini-2.5-flash` + Google Maps Tool

## 🎯 Target Audience
- Small e-waste processors in India.
- Metal workshop owners with limited budgets (~$10/month).
- Users dealing with the informal recycling sector who need "B2B tools" without corporate complexity.

## 📱 How It Works
1. **Capture:** Take a photo of the copper scrap batch.
2. **Analyze:** The AI grades the metal and suggests cleaning methods.
3. **Log:** The result is saved to track the supplier's quality over time.
4. **Find:** Use the Supplier Finder tab to locate new sources of raw material nearby.
