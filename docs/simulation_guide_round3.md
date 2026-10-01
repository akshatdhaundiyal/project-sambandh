# Project Sambandh: Round 3 Wizard of Oz Video Simulation Guide 🎬

> **The Ken Case Competition 2026 — Round 3 Prototype & Video Pitch**  
> *Demonstrating Bounded Level 3 Autonomy, Dual-Lane Telephony, Fiduciary Guardrails & Ambient Caregiver Transparency.*

---

## 📌 Video Requirements & Specifications

- **Total Duration:** Exactly 5:00 minutes (or within 4:30 – 5:00 min).
- **Core Narrative:** How Project Sambandh transforms chronic elderly care from an intrusive clinical monitoring regime into a dignified, reciprocal bond with deterministic operational replenishment.
- **Key Technical Proof Point:** Proving **Bounded Level 3 Autonomy**—the agent autonomously acts within limits (Pine Labs payment and Delhivery logistics trigger when runway $\le 20\%$ and cost $\le$ ₹4,500 monthly cap), while strictly stopping and escalating clinical anomalies or out-of-budget spikes.

---

## 🖥️ Screen Layout Setup (50/50 Split Screen)

Arrange your display before hitting record:

```text
┌──────────────────────────────────────┬──────────────────────────────────────┐
│ LEFT 50%: PROTOTYPE RUNNER          │ RIGHT 50%: LIVE PHYSICAL RECEPTOR    │
│                                      │                                      │
│ • VS Code / Jupyter Notebook         │ • Telegram Web (web.telegram.org) or │
│   (simulate_sambandh.ipynb)          │   Telegram Desktop App               │
│ • Or Terminal running:               │ • Logged in as Priya Sharma          │
│   uv run python simulate_sambandh.py │ • Shows the live Telegram            │
│ • Live Gemini reasoning, tool calls, │   Reassurance Card arriving with     │
│   and deterministic rail responses   │   clickable inline buttons in <500ms │
│                                      │ • (WhatsApp Web also supported)      │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## ⏱️ Minute-by-Minute Script & Walkthrough

### 0:00 – 0:45 | Scene 1: The Core Thesis & L3 Autonomy
- **Speaker Focus:** Introduce yourself and Project Sambandh.
- **Narrative:**
  - "Indian elders reject clinical surveillance apps; they feel infantalized. Project Sambandh inverts this by introducing the **Reciprocal Care Engine**."
  - "Sambandh is bounded by **Level 3 Autonomy**: inside the family's pre-set parameters, it handles the tedious logistics without asking; outside those limits, it defers to humans."
  - Point to the screen setup: On the left is Sambandh's reasoning brain powered by Gemini 1.5 Pro with deterministic rails; on the right is the caregiver's live receptor (Telegram / WhatsApp).

### 0:45 – 1:45 | Scene 2: 08:30 AM Clock Tick & Lane 1 (Wisdom Exchange)
- **Action on Left:** Execute Step 1 and Step 2 in `simulate_sambandh.ipynb` (or runner).
- **Narrative:**
  - "At 08:30 AM, Sambandh initiates a scheduled carrier call via Gnani.ai's SIP telephony."
  - "Instead of asking 'Did you take your pills?', Sambandh opens **Lane 1: Wisdom & Social Utility**."
  - "It presents a real question from Aarav, a 23-year-old mentee in Pune asking how to earn trust from older railway workshop technicians."
  - "Ramesh Chandra, a 72-year-old retired railway engineer in Lucknow, feels respected and valued as he shares 4 minutes of lived experience."

### 1:45 – 2:45 | Scene 3: Lane 2 Adherence Ground-Truthing & Inventory Math
- **Action on Left:** Execute Step 3 in the notebook.
- **Narrative:**
  - "With baseline rapport established, the agent contextually bridges to **Lane 2: Adherence**."
  - "Uncle mentions taking his 'morning tea, pink BP tablet, and half sugar tablet'."
  - "Gemini maps colloquial Indic phrasing to the active ABDM FHIR prescription bundle: **Telmisartan 40mg** and **Metformin 500mg**."
  - "The Adherence Rail calculates consumption since the last delivery: 24 of 30 tablets consumed; **6 days remaining (20% runway threshold triggered)**."

### 2:45 – 3:45 | Scene 4: Autonomous Fiduciary & Logistics Execution
- **Action on Left:** Watch Gemini trigger `execute_pine_labs_debit` and `schedule_delhivery_dispatch`.
- **Narrative:**
  - "Here is the most consequential action Sambandh takes without asking anyone:"
  - "Because runway is $\le 20\%$ AND the ₹640 refill cost is well below the child's pre-authorized ₹4,500 monthly spending limit, Sambandh executes:"
    1. A ₹640 auto-debit charge under the UPI Autopay mandate via Pine Labs Plural.
    2. A 48-hour priority doorstep dispatch from Netmeds Lucknow East dark store via Delhivery (Waybill: `988120391203`).
  - "Neither Ramesh nor Priya had to manage cart checkouts or OTPs."

### 3:45 – 4:30 | Scene 5: Live Telegram Chime & Clickable Inline Buttons
- **Action on Right:** Watch the card pop up live on Telegram Web/Desktop with instant sound.
- **Narrative:**
  - "Notice the right side of the screen: within seconds of the call ending, Priya's Telegram chimes with the **Daily Reassurance Card**."
  - "Priya sees: Papa is spirited and cheerful; he mentored Aarav on railway leadership; pills are confirmed taken; and a fresh pack is arriving tomorrow afternoon."
  - "Even better: the card includes **live interactive buttons**—Priya can tap `[🎧 Listen to Papa's Story]` to hear a 30-second audio clip, or review the longitudinal adherence record."
  - "No anxiety, no nagging phone calls asking 'Papa did you take medicine?'—pure family peace."

### 4:30 – 5:00 | Scene 6: Boundary Governance & Closing
- **Speaker Focus:** Conclude on why L3 matters and how Reliance Jio can scale it.
- **Narrative:**
  - "What does Sambandh NEVER do? It never alters dosages, substitutes clinical salts, or ignores price spikes."
  - "If an emergency or budget breach occurs, it immediately triggers an asynchronous 1-tap exception link right in Telegram with buttons like `[📞 Call Papa Directly]` or `[⚡ Approve via UPI]`."
  - "By combining Jio's 450M connectivity pipe, Netmeds supply chain, JioPay UPI mandates, and ABDM health records, Project Sambandh can be deployed nationally on Day One."

---

## 🛠️ Execution Checklist Before Recording

1. **Virtual Environment & Dependencies:**
   ```powershell
   uv sync
   ```
2. **Environment Variables (`.env`):**
   - **Google Gemini:** `GEMINI_API_KEY` (Free from Google AI Studio).
   - **Telegram (Recommended for Demo):**
     1. Open Telegram & talk to `@BotFather` &rarr; Send `/newbot` to get your `TELEGRAM_BOT_TOKEN`.
     2. Talk to `@userinfobot` &rarr; Get your numeric `TELEGRAM_CHAT_ID`.
     3. Start your bot and put both into `.env`.
   - **WhatsApp (Alternative):** `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `CAREGIVER_WHATSAPP_NUMBER`.
   - *Fallback:* If credentials are not set, the runner displays formatted visual cards directly in the terminal and Jupyter Notebook.
3. **Launch Notebook:**
   ```powershell
   uv run jupyter lab simulate_sambandh.ipynb
   ```
   Or open directly in VS Code and select kernel `Python (Project Sambandh)`.
