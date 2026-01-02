<img width="1894" height="2842" alt="high_grade_copper_scrap_test" src="https://github.com/user-attachments/assets/e8b179c2-d53c-4532-89e4-4badfe634d3e" /><img width="1778" height="2298" alt="low_grade_copper_scrap_test" src="https://github.com/user-attachments/assets/1859fd7c-b1a8-4796-a13a-1d6a27643f79" /><img width="1814" height="2842" alt="mixed_grade_copper_scrap_test" src="https://github.com/user-attachments/assets/cb72d9e9-2486-4785-89c3-1a97fbbdc048" /># CopperGuard AI 🛡️

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
<img width="1778" height="2298" alt="copper_recycling_solution" src="https://github.com/user-attachments/assets/b0d382fd-1d1e-4944-95ca-71eea3a38232" />

2. **Analyze:** The AI grades the metal and suggests cleaning methods.
<img width="1778" height="2298" alt="copper_analysis_process" src="https://github.com/user-attachments/assets/0f58672e-bc55-4ce5-b428-3046dac2380f" />
- Low grade
<img width="1778" height="2298" alt="low_grade_copper_scrap_test" src="https://github.com/user-attachments/assets/8415afbf-558a-4bf5-ac9b-b862f49ded90" />
- Mixed grade
<img width="1814" height="2842" alt="mixed_grade_copper_scrap_test" src="https://github.com/user-attachments/assets/17692af6-b527-4c3d-9dca-9bfea0cecc9a" />
- High grade
<img width="1894" height="2842" alt="high_grade_copper_scrap_test" src="https://github.com/user-attachments/assets/f5d9c33b-6415-4887-911b-3650ce453499" />

3. **Log:** The result is saved to track the supplier's quality over time.
<img width="2578" height="2442" alt="copper_log_suppliers" src="https://github.com/user-attachments/assets/4c09edca-a969-448b-a687-01156055e3d0" />

4. **Find:** Use the Supplier Finder tab to locate new sources of raw material nearby.
<img width="1778" height="2298" alt="copper_supplier_solution" src="https://github.com/user-attachments/assets/b4d9176a-c232-47a0-a9e6-a580e1b4e55e" />

