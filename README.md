# 🚆 RAILSYNC: Autonomous Railway Block Planning System
### **Explainable AI-Assisted Automatic Block Planning for Coordinated Railway Maintenance**
*Ministry of Railways | Smart India Hackathon 2026 | Problem Statement ID: SIH26027*

[![SIH 2026](https://img.shields.io/badge/SIH-2026-blue?style=for-the-badge)](https://www.sih.gov.in/)
[![Ministry of Railways](https://img.shields.io/badge/Ministry-Railways-red?style=for-the-badge)](https://indianrailways.gov.in/)
[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Google OR-Tools](https://img.shields.io/badge/Google-OR--Tools-4285F4?style=for-the-badge&logo=google)](https://developers.google.com/optimization)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## 📌 Project Tagline
> **"One corridor. One coordinated plan. Maximum maintenance with minimum disruption—decided by the network, approved by humans."**

---

## 🎯 The Core Problem & Solution

### The Ground Reality:
Infrastructure maintenance across **Civil Engineering (TMS)**, **Electrical Traction (TDMS)**, and **Signal & Telecom (SMMS)** is planned independently via **BDMS**. Section Controllers under pressure to protect train punctuality repeatedly deny or curtail maintenance blocks. This results in:
* **422 Derailments (CAG Report No. 22)** linked to track maintenance defects and denied blocks.
* **45% Heavy Track Machinery Idling** (CSM tampers, BCM ballast cleaners) waiting for traffic block sanctions.
* **Fragmented Corridor Closures:** 3 separate daytime disconnections for the same corridor stretch.

### The RAILSYNC Solution:
RAILSYNC provides an **Explainable Decision-Support Cockpit** that:
1. **Scans Future Work (Look-Ahead Bundling):** Proactively pairs compatible Engineering, Traction, and S&T tasks into unified **3-in-1 Shadow Corridor Blocks**.
2. **Deterministic Safety Rules:** Enforces hard-coded 25 kV AC electrical isolation and train safety headways using **Google OR-Tools CP-SAT** (never delegates safety to black-box ML).
3. **Data-Quality Gateway:** Automatically flags real-world dirty data (duplicate requests, missing Km markers, stale feeds) without crashing.
4. **Dual Candidate Plans:** Delivers **Plan A (Least Train Disruption)** and **Plan B (Fastest Critical Work)** with transparent trade-offs for human Section Controller authorization.

---

## ⚡ Quick Start (Run in 1 Command)

Ensure you have **Python 3.10+** and **Node.js 18+** installed.

```bash
# Clone the repository
git clone https://github.com/Faheemframes/water-equity-mapper.git sih_rail
cd sih_rail

# Launch both Backend & Frontend with one script
./run_demo.sh
```

* 🖥️ **Section Controller Cockpit:** Open `http://localhost:5173`
* ⚡ **FastAPI Swagger API Documentation:** Open `http://localhost:8000/docs`

---

## 🛠️ Step-by-Step Manual Setup (For Teammates Editing Code)

### 1. Backend Setup (FastAPI + Google OR-Tools)
```bash
cd backend

# Create & activate Python virtual environment
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Regenerate canonical dataset
python data/generate_dataset.py

# Launch backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend Setup (React + TypeScript + Tailwind CSS)
```bash
cd frontend

# Install packages
npm install

# Launch development server
npm run dev
```

---

## 🏛️ System Architecture & File Structure

```text
sih_rail/
├── run_demo.sh                          # One-command prototype launcher
├── README.md                            # Complete setup & project documentation
├── additional_context_my_team_sent_over_to_me.md
│
├── backend/
│   ├── requirements.txt                 # FastAPI, OR-Tools, Pydantic, Pandas
│   ├── data/
│   │   ├── generate_dataset.py          # 9-step referentially consistent data generator
│   │   └── canonical_dataset.json       # 12 Corridors, 60 Assets, 81 Tasks, 40 Blocks
│   └── app/
│       ├── main.py                      # REST API endpoints & CORS configuration
│       ├── models.py                    # Pydantic data schemas & audit models
│       ├── gateway.py                   # Data-Quality Gateway (Dirty-data screening)
│       ├── priority.py                  # P0–P3 Safety Tiering & Look-Ahead Bundler
│       ├── safety_rules.py              # Deterministic Hard Safety Rules & Impact Index
│       └── solver.py                    # Google OR-Tools CP-SAT Solver (Plan A, B & Baseline)
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.tsx               # Status chips, G&SR rules & navigation tabs
│   │   │   ├── MareyDiagram.tsx         # Interactive Time-Distance Train Graph
│   │   │   ├── GanttTimeline.tsx        # Multi-Lane Synchronized Gantt Schedule
│   │   │   ├── DataQualityCenter.tsx    # Diagnostic viewer for 7 flagged anomalies
│   │   │   ├── OpportunityPanel.tsx     # 12 Look-Ahead Bundling Cards
│   │   │   ├── PlanComparison.tsx       # Plan A vs Plan B vs Baseline + Approval Gate
│   │   │   ├── DisruptionSimulator.tsx  # Sub-second live emergency re-dispatch (<0.4s)
│   │   │   └── AuditLogViewer.tsx       # Immutable Section Controller Ledger
│   │   ├── types/index.ts               # TypeScript interface definitions
│   │   ├── App.tsx                      # Cockpit state management & live API wiring
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── sih_presentation_pack/               # Official 6-Slide Pitch Deck & PDF Handover Packs
    ├── ppt_designer_handover_pack.pdf   # Complete designer guide with copy & wireframes
    ├── sih_pitch_deck_presentation.pdf  # Official 6-slide SIH pitch deck PDF
    ├── dashboard_ui_mockup.jpg          # High-resolution dashboard hero visual
    └── multiscreen_ui_mockup.jpg        # 3-Screen UI showcase visual
```

---

## 📊 Live Prototype Demonstration Sequence (For Hackathon Judges)

1. **Data-Quality Gateway Tab:** Show the system actively detecting 7 real-world dirty data records (duplicate request `DEF-9901`, missing Km, inconsistent labels, stale feeds) without crashing.
2. **Look-Ahead Bundling Tab:** Show **12 proactive bundling opportunities** automatically detected by scanning future work across 12 corridors.
3. **Planning Cockpit Tab:**
   * View the **Time-Distance Marey Diagram** with real trains (*Vande Bharat 20104*, *Howrah Rajdhani 12302*) overlaid with glowing **3-in-1 Shadow Maintenance Blocks** during night freight valleys.
   * View the **Multi-Lane Synchronized Gantt** showing Civil, TRD, and S&T tasks executing simultaneously under a single 25 kV power cutoff.
4. **Plan Comparison Tab:** Compare **Plan A (0 min passenger delay, 18/100 impact)** against the **FCFS Baseline (4 express trains delayed, 72/100 impact)**, and test the **Controller Authorization Gate**.
5. **Emergency Disruption Sandbox (Showstopper):** Click *"Trigger Live Emergency: Rail Fracture at Km 144.2"* to watch the CP-SAT engine dynamically re-schedule freight rakes and allocate an immediate repair window in **< 0.4 seconds**.

---

## ⚖️ Indian Railways Statutory Compliance Disclaimer
* **RAILSYNC is an advisory decision-support system.** It generates candidate plans for review by authorized Section Controllers.
* It does **not** grant railway blocks, issue movement authority, operate signalling, control traction power, or certify track fitness.
* All statutory safety procedures remain governed by the **Indian Railways General & Subsidiary Rules (G&SR)**.

---
*Developed for Smart India Hackathon 2026 • Ministry of Railways (SIH26027)*
