# Project Sambandh: The Reciprocal Care Engine 🌿

> **The Ken Case Competition 2026 — Track: Product Strategy (Systems Architecture, Product Feasibility & Unit Economics)**  
> **Opening 04:** Managing the family's health  
> **Autonomy Rating:** Level 3 (Bounded Fiduciary & Operational Autonomy)  
> **Live Telemetry Console:** [http://localhost:4173/](http://localhost:4173/)

[![Model: Gemini 1.5 Pro](https://img.shields.io/badge/Model-Gemini%201.5%20Pro%20%2F%20Flash-blue.svg)](https://ai.google.dev/)
[![Autonomy: Level 3](https://img.shields.io/badge/Autonomy-Level%203%20(Bounded)-green.svg)]()
[![Stack: React 19 + TypeScript](https://img.shields.io/badge/Console-React%2019%20%7C%20TypeScript%20%7C%20Vite-61dafb.svg)]()
[![Backend: Python 3.10+](https://img.shields.io/badge/Runner-Python%203.10%2B%20%7C%20uv-brightgreen.svg)]()
[![Compliance: DPDP Act 2023](https://img.shields.io/badge/Compliance-DPDP%20Act%202023%20%7C%20Schedule%20H-orange.svg)]()

---

## 📌 Executive Summary

**Project Sambandh** is an autonomous care platform engineered for India's digital health landscape. Rather than acting as an intrusive medical monitor or clinical overseer ("nanny-ware"), Sambandh operates across two synchronized conversational lanes:

1. **Lane 1 (Wisdom & Social Utility):** Daily morning calls open with curated intergenerational mentorship prompts from young aspiring professionals suited to the elder's lifetime vocation (e.g., asking a retired railway engineer for workshop leadership advice). This preserves elder dignity and passively monitors cognitive lucidity.
2. **Lane 2 (Adherence & Autonomous Replenishment):** Transitions contextually to oral medication recall, verifies adherence against national **ABDM FHIR** prescriptions, and autonomously executes auto-debit payments via **Pine Labs Plural** and express courier dispatch via **Delhivery CMU** when medicine runway falls $\le 20\%$ (<5 days remaining), strictly respecting the family's pre-authorized spending ceiling.

---

## 📚 Competition Documentation Suite

The complete competition submission has been partitioned into an exhaustive, modular documentation suite:

| Document | Topic & Focus Area | Key Coverage |
| :--- | :--- | :--- |
| **[01. Executive Summary & Thesis](file:///d:/lab/projects/project-sambandh/docs/01_executive_summary_and_thesis.md)** | Core Thesis & Problem Statement | Demographic crisis, failure of "nanny-ware", Reciprocal Care thesis, Bounded Level 3 Autonomy definition, Reliance Jio ecosystem fit. |
| **[02. System Architecture & Partner Rails](file:///d:/lab/projects/project-sambandh/docs/02_system_architecture_and_rails.md)** | Technical Infrastructure & FSM | Microservices block diagram, WhisperFlo telephony, ABDM FHIR R4 schemas, Pine Labs Plural UPI mandates, Delhivery logistics, Telegram MTProto. |
| **[03. Telemetry Console & Judge Guide](file:///d:/lab/projects/project-sambandh/docs/03_telemetry_console_and_judge_guide.md)** | Live Web Console User Manual | Dual-Pane architecture (`localhost:4173`), Recommended Prompts Table, multi-engine Hindi TTS voice subsystem, structured memory ledger, API timeline. |
| **[04. Evaluation Scenarios & Prompt Playbook](file:///d:/lab/projects/project-sambandh/docs/04_scenarios_and_prompt_playbook.md)** | 5 Competition Scenarios | Verbatim Devanagari & Hinglish prompts, partner rail execution sequences, latency benchmarks, and judge evaluation criteria. |
| **[05. Fiduciary & Clinical Guardrails](file:///d:/lab/projects/project-sambandh/docs/05_fiduciary_and_clinical_guardrails.md)** | Regulatory & Risk Governance | DPDP Act 2023 compliance, Drugs & Cosmetics Act Schedule H rules, Zero-Diagnostic clinical safety protocol, 182ms acoustic tripwire. |
| **[06. Unit Economics & Scalability](file:///d:/lab/projects/project-sambandh/docs/06_unit_economics_and_scale.md)** | Financial Viability & GTM | Monthly COGS breakdown (₹124.50/elder), subscription + pharmacy margins (82.4% gross margin), zero hardware cost, Jio 450M distribution. |
| **[07. Simulation & Video Pitch Guide](file:///d:/lab/projects/project-sambandh/docs/07_simulation_and_demo_script.md)** | Round 3 Video Pitch Script | Second-by-second 5:00-minute presentation script, 50/50 split-screen setup, pre-flight checklist, and judge Q&A defense. |

---

## 🖥️ Live Evaluation Interface: Dual-Pane Telemetry Console

For live testing and competition demonstration, Project Sambandh includes a dedicated **Dual-Pane L3 Telemetry Console** accessible in the browser:

```
┌──────────────────────────────────────────────┬──────────────────────────────────────────────┐
│  LEFT PANE: SENIOR-FRIENDLY TELEPHONY VIEW   │    RIGHT PANE: JUDGE & STEP API INSPECTOR    │
├──────────────────────────────────────────────┼──────────────────────────────────────────────┤
│ • Elder Identity & Jio PSTN Session State    │ • Partner Rails Catalog (Logo + Name + Hover)│
│ • Recommended Prompts Table (Hindi+Hinglish) │ • Tool Execution Node Timeline (Live SLAs)   │
│ • Ongoing Call Waveform & Audio Telemetry    │ • Collapsible HTTP Request / Response Blocks │
│ • Multi-Engine Hindi Voice Synthesis (TTS)   │ • Real-time Latency Metrics (84ms – 310ms)   │
│ • Structured Memory Ledger (~210 Tokens)     │ • Dynamic Partner API Firing & Accrual       │
│ • Vernacular Chat Stream & Custom Input Bar  │ • Acoustic Tripwire Fraud Intercept Banner   │
└──────────────────────────────────────────────┴──────────────────────────────────────────────┘
```

### Key Console Highlights:
1. **Interactive Recommended Prompts Table:** Directly test scenarios using authentic **Devanagari Hindi** and bracketed **Roman Hinglish** dialogue. Tapping `[ Insert & Fire ]` injects the speech turn, speaks it aloud in Hindi, and populates partner API execution nodes dynamically.
2. **Multi-Engine Hindi Speech (TTS):** Zero-latency voice synthesis featuring Microsoft Windows Local SAPI5/Natural Voices (`hi-IN`), Google Chrome Web Speech API, and WhisperFlo Cloud Audio.
3. **Structured Context Ledger:** Multi-category memory consolidation maintaining 0% context loss across arbitrary turns in ~210 tokens.
4. **Step API Inspector:** Real-time visibility into ABDM, Pine Labs, Delhivery, WhisperFlo, and Telegram JSON exchanges with HTTP status codes and microsecond latencies.

---

## ⚡ Quickstart Guide

### Option 1: Launch the L3 Web Telemetry Console (Recommended for Demo)
```powershell
# Navigate to telemetry console directory
cd d:\lab\projects\project-sambandh\telemetry-console

# Install dependencies & build production bundle
npm install
npm run build

# Start preview server on port 4173
npm run preview -- --port 4173
```
Open **`http://localhost:4173/`** in Google Chrome or Edge.

---

### Option 2: Run the Python Wizard of Oz Simulation
```powershell
# In project root, sync Python environment using uv
uv sync

# Configure credentials in .env
cp .env.example .env
# Set GEMINI_API_KEY, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

# Run interactive Jupyter Notebook
uv run jupyter lab simulate_sambandh.ipynb

# Or run the CLI simulation script
uv run python simulate_sambandh.py
```

---

## 🎯 The 5 Competition Evaluation Scenarios

| Preset ID | Scenario Name | Spoken Prompt (Hindi & Hinglish) | Autonomous Rails Triggered | Key SLA / Status |
| :--- | :--- | :--- | :--- | :--- |
| `sim-refill` | **Medicine Runway Refill** | *"बेटा, मेरी लाल वाली बीपी की गोली सिर्फ 3 बची हैं..."* <br> `[Beta, meri laal wali BP ki goli Telma 40 sirf 3 bachi hain...]` | ABDM Inventory + Pine Labs (₹840) + Netmeds DarkStore + Delhivery CMU + Telegram Brief | **215ms** Netmeds B2B <br> `200 ORDER PACKED` |
| `sim-mcp-pooja` | **Generic MCP Local Orders** | *"बेटा, आज शाम को मंदिर में सुंदरकांड का पाठ है, ताजे गेंदे के फूल मंगवा सकती हो?..."* | Generic Model Context Protocol + In-Memory Wallet Debit (₹210) | **165ms** local dispatch <br> `ORDERED_NOT_RECEIVED` |
| `sim-mentorship` | **Intermediary Mentorship & Safety Gate** | *"Ramesh Uncle, signal interlocking fail hone par mechanical override ka SOP kya tha?..."* | LLM Safety Gate + Asynchronous Wisdom Relay + Silent Family Advisory | **180ms** intent check <br> `SAFE TO RELAY` |
| `sim-fiduciary` | **Fiduciary Ceiling Step-Up** | *"डॉक्टर साहब ने 3 महीने की विशेष दवाइयां ₹5,200 की लिखी हैं..."* <br> `[Doctor ne 3 mahine ki vishesh dawaiyan ₹5,200 ki likhi hain...]` | Pine Labs Fiduciary Firewall + Telegram 2FA Approval Card | **165ms** mandate hold <br> `402 LIMIT EXCEEDED` |
| `sim-crisis` | **Clinical Emergency Crisis** | *"बेटा, छाती में अचानक बहुत भारीपन और पसीना आ रहा है..."* <br> `[Beta, chhati me achanak bahut bhaaripan aur paseena aa raha hai...]` | ABDM Clinical Escalation + Tier-1 Emergency Red Alert Card | **95ms** protocol trigger <br> `CRITICAL RED ALERT` |

---

## 🏛️ Strategic Alignment: Reliance Jio Healthcare Ecosystem

```
┌────────────────────────────────────────────────────────────────────────┐
│               RELIANCE JIO INTEGRATED HEALTHCARE ECOSYSTEM              │
├────────────────────────────────────────────────────────────────────────┤
│ • Connectivity Pipe: Jio 4G/5G PSTN & VoLTE Network (450M Subscribers)  │
│ • Fulfillment Spine: Netmeds Pharmacy Dark Stores (1,000+ Cities)      │
│ • Payment Mandates:  JioPay / Pine Labs UPI Autopay Rail               │
│ • Telephony Engine:  Jio Haptik / WhisperFlo Indic Voice AI Engine     │
│ • Digital Health:    Ayushman Bharat Digital Mission (ABDM / ABHA ID)   │
└────────────────────────────────────────────────────────────────────────┘
```

- **Universal Reach:** Functions seamlessly over basic feature phones (JioPhone) and landlines via carrier PSTN without requiring elder app downloads.
- **Zero-CAC Funnel:** Distributed as a high-margin add-on through **JioPostpaid Plus family plans** and the existing **Netmeds chronic buyer base**.
- **Robust Unit Economics:** Monthly COGS of **₹124.50** vs blended monthly revenue of **₹709.00** delivers an **82.4% gross margin** and a payback period of under 1 month.

---

## 📜 Intellectual Property & Competition Acknowledgments

- **Competition:** The Ken Case Competition 2026 — Product Strategy Track
- **Authors & Team:** Project Sambandh Systems Engineering Team
- **Infrastructure Partners:** Reliance Jio, ABDM (National Health Authority), Pine Labs Plural, Delhivery CMU, WhisperFlo, Telegram MTProto Bot API