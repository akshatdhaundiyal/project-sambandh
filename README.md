# Project Sambandh: The Reciprocal Care Engine 🌿

> **The Ken Case Competition 2026 — Round 3 Simulation & Prototype**  
> *L3 Autonomous Care Agent managing elderly chronic health adherence through intergenerational dignity, deterministic fiduciary rails, and transparent family briefs.*

[![Model: Gemini 1.5 Pro](https://img.shields.io/badge/Model-Gemini%201.5%20Pro-blue.svg)](https://ai.google.dev/)
[![Autonomy: Level 3](https://img.shields.io/badge/Autonomy-Level%203%20(Bounded)-green.svg)]()
[![Stack: Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-brightgreen.svg)]()

---

## 📌 Executive Summary

**Project Sambandh** is an autonomous care agent operating within India's digital health landscape. Rather than acting as an intrusive medical monitor or clinical overseer, Sambandh operates across two conversational lanes:

1. **Lane 1 (Wisdom & Social Utility):** Initiates daily scheduled morning calls by connecting the elder with a curated mentorship prompt from an aspiring young professional suited to their career background.
2. **Lane 2 (Adherence & Autonomous Replenishment):** Contextually transitions to oral pill recall, verifies medication intake against ABDM digital prescriptions, and automatically triggers auto-debit payments and courier delivery when medicine inventory runway falls $\le 20\%$, staying strictly within the family's pre-authorized spending ceiling.

---

## 🏗️ Repository Architecture

```text
project-sambandh/
├── README.md                           # Project overview, architecture & docs
├── requirements.txt                   # Core Python dependencies (pip fallback)
├── pyproject.toml                     # Modern uv project definition & package config
├── .env.example                       # Template for API keys & tokens
├── .gitignore                         # Environment, notebook & cache exclusions
├── simulate_sambandh.py               # Main simulation runner (Gemini + Tools + WhatsApp)
├── simulate_sambandh.ipynb            # Interactive simulation notebook with rich UI
├── data/
│   ├── senior_profile.json            # Ramesh Chandra's Day One knowledge state
│   ├── prescription_bundle.json       # ABDM FHIR medication record
│   └── mock_external_responses.json   # Deterministic payloads (Pine Labs / Delhivery)
└── docs/
    ├── system_design_round2.md        # Complete Round 2 System Architecture
    └── simulation_guide_round3.md     # Wizard of Oz video recording guide
```

---

## ⚡ The Wizard of Oz Simulation Setup

This repository implements the **Wizard of Oz (WoZ)** protocol required for Round 3:
* **The Mind (Automated):** Gemini 1.5 Pro autonomously reasons over the system prompt, parses vernacular responses, checks inventory math, and issues structured function calls.
* **The Rails (Deterministic Mocks):** Pine Labs (payments) and Delhivery (logistics) mock responses are deterministically returned using standard API schemas.
* **The Physical World (Live):** When Gemini calls `send_whatsapp_caregiver_brief`, an actual HTTP request fires to the **Twilio / Meta WhatsApp Cloud API**, making the caregiver's phone buzz live on camera.

---

## 🚀 Quickstart Guide (using `uv`)

### 1. Set Up Environment with `uv`
Fast, deterministic virtual environment and dependency installation with `uv`:
```bash
# Sync virtual environment and all dependencies (including Jupyter)
uv sync

# Register Jupyter kernel for notebook execution
uv run python -m ipykernel install --user --name sambandh-kernel --display-name "Python (Project Sambandh)"
```

*(Legacy pip fallback: `python -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`)*

### 2. Configure Credentials
Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```

| Key | Description | Where to get it |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API Key | [Google AI Studio](https://aistudio.google.com/) |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot Token *(Recommended for Demo)* | Chat with `@BotFather` on Telegram |
| `TELEGRAM_CHAT_ID` | Your Telegram Chat ID *(Recommended for Demo)* | Chat with `@userinfobot` on Telegram |
| `CAREGIVER_CHANNEL` | Notification Channel (`telegram` / `whatsapp`) | Set to `telegram` (default) |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID *(Optional alternative)* | [Twilio Console](https://www.twilio.com/) |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token *(Optional alternative)* | [Twilio Console](https://www.twilio.com/) |
| `TWILIO_WHATSAPP_NUMBER` | Twilio Sandbox Number | Usually `whatsapp:+14155238886` |
| `CAREGIVER_WHATSAPP_NUMBER` | Personal WhatsApp number | e.g. `whatsapp:+919876543210` |

> *Note: If API credentials are not provided, the simulation runs in **Console / Notebook Inspection Mode**, executing deterministic rails and displaying the rich interactive Telegram cards locally.*

### 3. Run the Simulation

**Option A: Interactive Jupyter Notebook (Recommended)**
Open `simulate_sambandh.ipynb` in VS Code or Jupyter Lab:
```bash
uv run jupyter lab simulate_sambandh.ipynb
```
Select the kernel **`Python (Project Sambandh)`** to step through the interaction and render rich interactive Telegram / WhatsApp cards visually.

**Option B: CLI Script Runner**
```bash
uv run python simulate_sambandh.py
```

---

## 🎬 5-Minute Video Recording Layout

When recording your demonstration video:

1. **Split your screen 50/50:**
   * **Left Side:** VS Code / Jupyter Notebook executing `simulate_sambandh.ipynb` (or Terminal) showing Gemini's thinking, rule triggers, and function calls.
   * **Right Side:** [Telegram Web](https://web.telegram.org/) or Telegram Desktop logged in as the caregiver. *(WhatsApp Web is also supported).*
2. **Watch the live trigger:** As soon as Gemini decides to reorder and brief the family, the reassurance card arrives on Telegram in real-time with clickable interactive buttons.

---

## 🛡️ Boundary Governance & L3 Autonomy

Sambandh is bounded by strict **Level 3 Autonomy**:

* **What it does autonomously:** Reorders active prescription refills, debits the pre-authorized UPI mandate, and books courier drop-offs when inventory is $\le 20\%$ and cost is $\le$ pre-authorized limit (₹4,500).
* **Where it stops:** It **never** alters dosages, substitutes clinical salts, or ignores price spikes. Out-of-budget events trigger an asynchronous 1-tap UPI exception link to the adult child.

---

## 📜 License & Acknowledgments

Built for **The Ken Case Competition 2026**.  
Special thanks to **Gnani.ai**, **Pine Labs**, and **Delhivery** for public developer specifications and API references.