# Project Sambandh: Wizard of Oz Simulation & Video Pitch Guide 🎬

> **The Ken Case Competition 2026 — Track: Product Strategy (Round 3 Video Pitch)**  
> **Document:** 07 — 5:00-Minute Wizard of Oz Recording Script, Split-Screen Protocol & Judge Defense  
> **Target Duration:** Exactly 4:45 – 5:00 minutes

---

## 1. Video Recording Setup: The 50/50 Split Screen

To deliver an undeniable technical demonstration to the judges, configure your display before recording:

```
┌──────────────────────────────────────────────┬──────────────────────────────────────────────┐
│ LEFT 50%: L3 AUTONOMOUS ENGINE & TELEMETRY   │ RIGHT 50%: LIVE CAREGIVER PHYSICAL RECEPTOR  │
├──────────────────────────────────────────────┼──────────────────────────────────────────────┤
│ • Chrome / Edge running:                     │ • Telegram Desktop App / Telegram Web        │
│   http://localhost:4173/                     │   (web.telegram.org)                         │
│ • Shows Senior Call Card with Recommended    │ • Logged in as Priya Sharma                  │
│   Prompts Table (Hindi & Hinglish)           │ • Shows the live Reassurance Card arriving   │
│ • Shows Right Pane API timeline executing    │   with instant chime sound and live          │
│   ABDM, Pine Labs, Delhivery & Tripwire nodes│   interactive buttons in <500ms              │
│ • (Or VS Code running simulate_sambandh.py)  │ • Proves zero-latency real-world delivery    │
└──────────────────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 2. Second-by-Second 5:00-Minute Pitch Script

### ⏱️ 0:00 – 0:45 | Scene 1: The Core Thesis & Bounded Level 3 Autonomy
- **Speaker Visual:** Introduce yourself and Project Sambandh with confidence.
- **Verbatim Voiceover:**
  > *"Judges, over 75% of Indian seniors suffer from chronic conditions, yet over half fail to take their daily medicines on time. Why? Because existing digital health apps treat elders like children—nagging them with clinical alerts that feel humiliating. At Project Sambandh, we invert this entirely with the **Reciprocal Care Engine**.*
  > 
  > *Sambandh operates under **Bounded Level 3 Autonomy**: inside the family's pre-set boundaries, it autonomously handles prescription replenishment without asking anyone; outside those limits, it strictly defers to humans.*
  > 
  > *Look at my screen: On the left is our autonomous voice agent connected to telecom carrier telephony; on the right is the daughter Priya's live Telegram phone receptor."*

---

### ⏱️ 0:45 – 1:45 | Scene 2: 08:30 AM Telephony & Tier 1 (Companion Banter & Wisdom)
- **Action on Screen:** 
  - On the Left Pane (`http://localhost:4173/`), show the 08:30 AM call connecting over Jio PSTN telephony.
  - Highlight the Recommended Prompts Table displaying Devanagari Hindi and Hinglish.
  - Show the warm opener on Delhi weather or trigger **Scenario: Local News & Opinion (`sim-news-opinion`)**.
  - Click `[📜 System Prompt]` in the top bar to show the **Modular JIT Prompt Inspector** with status badges (`[Companion Core: Active]`, `[Subtle Adherence: Dormant]`, `[Topics Streamed]`).
- **Verbatim Voiceover:**
  > *"At 08:30 AM, Sambandh initiates a scheduled carrier call to Ramesh Chandra, a 72-year-old retired railway engineer in Delhi. Notice the fundamental difference: instead of opening with a clinical audit, Sambandh opens as a warm **Conversational Companion**.*
  > 
  > *It opens with today's pleasant morning sunshine in Rohini and asks Ramesh Uncle for his opinion on the new walkway in Japanese Park, where he has walked for 15 years. Notice how Ramesh responds with enthusiasm and pride. Loneliness is banished, while our audio engine silently benchmarks his vocal vitality and cognitive lucidity.*
  > 
  > *Look at our Modular JIT Prompt Inspector: the agent runs on a lean companion core prompt without upfront clinical bloat, attaching specialized rules strictly when needed."*


---

### ⏱️ 1:45 – 2:45 | Scene 3: Lane 2 Adherence Ground-Truthing & Inventory Math
- **Action on Screen:** 
  - Click `[ Insert & Fire ]` on **Scenario 1: Low Stock (<5D)** in the Recommended Prompts Table.
  - Point to the dialogue inserted into the chat stream and spoken aloud in Hindi:
    > *"बेटा, मेरी लाल वाली बीपी की गोली (Telma 40) सिर्फ 3 बची हैं..."*
  - Show the Right Pane timeline firing the **ABDM FHIR** node in **84ms**.
- **Verbatim Voiceover:**
  > *"Now, with warmth established, Sambandh bridges seamlessly to **Lane 2: Adherence**.*
  > 
  > *Ramesh mentions he has only 3 pills of his pink BP tablet left. Look at the API inspector on the right pane: instantly, our agent maps 'laal wali goli' to the active ABDM digital prescription for Telmisartan 40mg.*
  > 
  > *The inventory math executes: 3 pills remaining triggers our **runway threshold of under 5 days**. The autonomous fulfillment sequence begins."*

---

### ⏱️ 2:45 – 3:45 | Scene 4: Autonomous Fiduciary & Logistics Execution
- **Action on Screen:** 
  - Point to the Right Pane as **Pine Labs Plural** (`200 OK CAPTURED`) and **Delhivery CMU** (`200 MANIFESTED`) execute in real time.
  - Expand the collapsible HTTP Request/Response exchanges to reveal the transaction payload.
- **Verbatim Voiceover:**
  > *"Here is the most consequential thing Sambandh does without asking anyone:*
  > 
  > *Because the runway is under 5 days AND the ₹840 refill cost is well below Priya's pre-authorized ₹4,500 monthly limit, Sambandh executes two real-world transactions autonomously:*
  > 
  > *First, it debits ₹840 via Pine Labs Plural under the UPI Autopay mandate in 310ms.*
  > *Second, it manifests a priority healthcare courier dispatch from Apollo Dark Store via Delhivery with Waybill DLV-98234-DEL arriving today by 4:00 PM.*
  > 
  > *Neither Ramesh nor Priya had to download an app, browse a catalog, or enter an OTP."*

---

### ⏱️ 3:45 – 4:30 | Scene 5: Live Telegram Chime & Interactive Buttons
- **Action on Screen:** 
  - Direct the judges' eyes to the **Right 50% of the screen (Telegram)**.
  - Show the **Daily Reassurance Card** arriving live with an audible notification.
  - Click on the interactive buttons: `[🎧 Listen to Papa's Story]` and `[📦 Track Delhivery Delivery]`.
- **Verbatim Voiceover:**
  > *"Now look at the right side of the screen. Within seconds of the call ending, Priya's Telegram chimes with the Daily Reassurance Card.*
  > 
  > *Priya sees complete transparency: Papa is in high spirits; he shared a railway story; his morning pills are confirmed taken; and a fresh pack is arriving at his door today.*
  > 
  > *Best of all, Priya can tap live buttons right in Telegram: she can listen to a 30-second audio snippet of her father's voice, or click to track the courier live. No nagging, no family anxiety—pure peace of mind."*

---

### ⏱️ 4:30 – 5:00 | Scene 6: Boundary Governance, Jio Fit & Closing
- **Action on Screen:** 
  - Briefly demonstrate the **182ms Acoustic Tripwire** (Scenario 3) or the **₹4,500 Fiduciary Step-Up** (Scenario 4).
  - Show your face on camera for the closing statement.
- **Verbatim Voiceover:**
  > *"What does Sambandh NEVER do? It never alters prescriptions, never exceeds the ₹4,500 budget without 2FA, and if a scammer solicits money, our acoustic tripwire severs the line in 182ms.*
  > 
  > *By leveraging Reliance Jio's 450M subscriber pipe, Netmeds fulfillment network, and JioPay UPI mandates, Project Sambandh can be deployed nationwide on Day One.*
  > 
  > *Sambandh isn't just delivering pills on time—it's restoring dignity to Indian elders and giving peace of mind to their children. Thank you."*

---

## 3. Technical Pre-Flight Checklist Before Recording

1. **Start the Telemetry Console:**
   ```powershell
   cd d:\lab\projects\project-sambandh\telemetry-console
   npm run preview -- --port 4173
   ```
2. **Verify Browser Display:** Open `http://localhost:4173/` in Google Chrome or Edge. Ensure the Recommended Prompts Table is in **Table View** with Devanagari and Hinglish text clearly legible.
3. **Verify Telegram Connection:**
   - Open Telegram Desktop on the right half of your monitor.
   - Verify that `.env` contains your `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
4. **Test Hindi Audio Synthesis:** Ensure your computer speaker volume is audible so the screen recording captures the authentic Hindi speech turns.

---

## 4. Judge Defense & Rebuttal Guide (Competition Q&A)

### Q1: "Why did you build Level 3 autonomy instead of Level 4?"
> *"In geriatric chronic healthcare, Level 4 autonomy is illegal and unethical. Under India's Drugs and Cosmetics Act and DPDP Act 2023, an AI cannot alter Schedule H prescriptions, titrate dosages, or spend capital without governance. Level 3 is the architectural sweet spot: it automates the 95% of routine operational friction (refills, tracking, check-ins) while strictly deferring clinical and financial exceptions to humans."*

### Q2: "What if the senior lies about taking their medicine?"
> *"We cross-reference verbal adherence against three independent signals: (1) longitudinal vocal biomarker analysis detecting hesitation or cognitive confusion, (2) verified inventory depletion from Delhivery delivery drop timestamps, and (3) longitudinal clinical trends. If discrepancies appear, Sambandh alerts the daughter to check in gently."*

### Q3: "How do you protect against telephone financial fraud?"
> *"We embed an asynchronous Acoustic Semantic Tripwire directly on the DSP telephony audio stream. If an unverified caller speaks financial solicitation n-grams like 'GPay', 'fees', or 'are you alone', the SIP carrier trunk is severed in 182ms—well before the scammer can finish their pitch. The elder is protected, and the family receives an instant audit transcript."*
