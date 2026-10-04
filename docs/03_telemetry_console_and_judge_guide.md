# Project Sambandh: Web Telemetry Console & Judge Guide 🖥️

> **The Ken Case Competition 2026 — Track: Product Strategy (Evaluation & Inspection Guide)**  
> **Document:** 03 — Dual-Pane Web Telemetry Console, Bilingual Prompts & Inspector Manual  
> **Console Local URL:** `http://localhost:4173/`

---

## 1. Overview of the 3-Persona Telemetry Console

The **Project Sambandh L3 Telemetry Console** was engineered specifically for competition judges, technical evaluators, and system architects. Evaluating an autonomous voice agent presents an inherent challenge: speech is ephemeral. When an elder speaks over a phone, judges cannot see the internal reasoning loops, the database lookups, or the partner API handshakes taking place in the background.

The Telemetry Console solves this by providing a unified **3-Persona Architecture**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              PROJECT SAMBANDH TELEMETRY CONSOLE                         │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────┤
│ TAB 1: ELDER COMPANION   │ TAB 2: CAREGIVER HUB        │ TAB 3: YOUTH & WISDOM BRIDGE  │
│ (Ramesh Chandra, 72/M)   │ (Priya Sharma, Daughter)    │ (DTU Engineering Students)    │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┤
│ • Elder Telephony View   │ • Caregiver Command Deck    │ • Youth Mentorship Cards      │
│ • Recommended Prompts    │ • Dynamic Profile Editor    │ • Real-time Safety Gate (LLM) │
│ • Audio Waveform Viz     │ • Hobbies & Opinions Mgmt   │ • Acceptance/Rejection Flow   │
│ • Hindi Voice Synthesis  │ • Live DAG Execution Tree   │ • Asynchronous Voice Relay    │
│ • Memory Ledger (~210T)  │ • Fiduciary Mandate Ledger  │ • Privacy Name Hashing        │
│ • Step API Inspector     │ • PostgreSQL Direct Sync    │ • Student Persona Profiles    │
└──────────────────────────┴─────────────────────────────┴───────────────────────────────┘
```

---

## 2. Left Pane: Senior-Friendly Telephony Experience

The left pane reflects the natural, dignified experience experienced by Ramesh Chandra (72, retired Chief Signal Inspector living in Rohini Sector 8, Delhi).

### 2.1 Elder Identity & Morning Routine Banner
- **Header:** *"Namaste Ramesh Chandra Ji"*
- **Demographics:** Age 72 · Rohini Sector 8, Delhi 110085 · Chief Signal Inspector (Retd.)
- **Dialect Calibration:** Awadhi-Hindi (Native)
- **Caregiver on Record:** Priya Sharma (Daughter, Gurgaon)
- **Call Session Indicator:** Displays real-time duration clock and connection state (`Waiting for Initiation`, `Live Call Connected`, or `Call Concluded`).

### 2.2 Recommended Prompts & Autonomous Rails Table (`RecommendedPromptsTable.tsx`)
Located directly below the elder banner, this table serves as the primary evaluation dashboard for judges:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│               RECOMMENDED PROMPTS & AUTONOMOUS PARTNER RAILS (PLAYBOOK)                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [All Rails (5)] [💊 ABDM Refill] [⚡ Tripwire] [🚨 Crisis] [💳 Pine Labs] [👴 Wisdom]  │
├──────────────────────────┬──────────────────────────────────────┬──────────────────────┤
│ Scenario & Target Rails  │ Spoken Prompt (Hindi & Hinglish)     │ Autonomous Action    │
├──────────────────────────┼──────────────────────────────────────┼──────────────────────┤
│ 💊 Low Stock (<5D)       │ बेटा, मेरी लाल वाली बीपी की गोली     │ [ Insert & Fire ]    │
│ • ABDM FHIR              │ सिर्फ 3 बची हैं...                   │                      │
│ • Pine Labs (₹840)       │ [Beta, meri laal wali BP ki goli     │ 📦 Express Courier   │
│ • Delhivery CMU          │ Telma 40 sirf 3 bachi hain...]       │    ETA 4:00 PM       │
├──────────────────────────┼──────────────────────────────────────┼──────────────────────┤
│ ⚡ Fraud Solicitation    │ हैलो अंकल जी! मैं नया ट्रेनी हूँ...  │ [ Insert & Fire ]    │
│ • WhisperFlo Firewall    │ Google Pay पर ₹5,000 भेज सकते हैं?   │                      │
│ • Whitelist Lock         │ [Hello Uncle ji! GPay par ₹5,000     │ ⚡ Line Severed      │
│ • Silent Alert           │ bhej sakte hain? Akele rehte hain?]  │    in 182ms          │
└──────────────────────────┴──────────────────────────────────────┴──────────────────────┘
```

#### Key Capabilities of the Prompts Table:
1. **Authentic Devanagari Hindi Text:** Formatted prominently in a clear font (`text-sm font-semibold text-stone-900`) so native Hindi speakers can judge colloquial naturalness and respectfulness.
2. **Bracketed Roman Hinglish Transliteration:** Placed immediately beneath each Devanagari prompt (`text-[11px] font-mono italic`) to allow non-Hindi evaluators to follow the verbatim dialogue effortlessly.
3. **Target Partner Rails Badges:** Color-coded badges highlight exactly which national infrastructure rails will be engaged:
   - **ABDM FHIR:** `#0D9488` (Teal)
   - **Pine Labs Plural:** `#007A3D` (Forest Green)
   - **Delhivery CMU:** `#E41C38` (Crimson Red)
   - **WhisperFlo Line Sever:** `#DC2626` (Red Alert)
   - **Telegram MTProto Bot:** `#24A1DE` (Sky Blue)
4. **1-Click "Insert & Fire" Action:** Tapping any row or the `[ Insert & Fire ]` button executes a unified 3-step sequence:
   - Injects the spoken dialogue turn into the active chat stream.
   - Speaks the dialogue aloud via the active Hindi TTS voice engine.
   - Dynamically queues and manifests the exact partner API execution nodes in the Right Pane timeline.
5. **View Mode Switcher:** Toggle between **Table View** (comprehensive audit format) and **Card Grid View** (compact dashboard cards).
6. **1-Tap Clipboard Copy:** Copy icon allows judges to copy prompts and test variations in the custom text input bar.

### 2.3 Multi-Engine Hindi Voice Synthesis (TTS)
Sambandh features a production-grade, zero-latency speech synthesis hierarchy:
- **Microsoft Windows Local SAPI5 / Natural Voices:** Detects native Windows `hi-IN` voices (e.g., *Microsoft Hemant - Hindi*, *Microsoft Kalpana - Hindi*, *Microsoft Swara - Hindi*). Runs 100% offline with zero network latency.
- **Google Chrome / Edge Web Speech API:** Ingests browser-native neural Hindi voices.
- **WhisperFlo Cloud Web Audio:** Synthesizes high-fidelity 24kHz studio PCM speech tailored for elderly telephony.
- **Auto-Speak Toggle:** When turned **ON**, dialogue turns are automatically spoken aloud as they occur, recreating an authentic phone conversation.
- **Voice Configuration Modal:** Accessible via the `[⚙️ Voice Audio Options]` button, allowing judges to test sample audio, switch engines on the fly, and inspect active speech synthesis parameters.

### 2.4 Structured Memory Ledger
Instead of stuffing unlimited raw dialogue history into the LLM context window—which causes catastrophic attention degradation, hallucinations, and high inference costs—Sambandh utilizes a **Structured Context Ledger**:
- **Compact Footprint:** Compresses multi-turn conversation into **~210 structured tokens**.
- **Zero Context Loss:** Preserves clinical ground truths across arbitrary conversation turns.
- **5 Organized Categories:**
  1. *Clinical & Symptoms:* Active ailments, vitals reported, pain points.
  2. *Medication Adherence:* Daily pills consumed, timing relative to breakfast.
  3. *Emotional & Psychosocial:* Lucidity score, conversational tone, nostalgic topics.
  4. *Autonomous Action Rails:* Pending refills, delivery waybills, debited amounts.
  5. *Conversational Narrative:* Key memories shared (e.g., 1984 Purani Delhi signaling relay room).
- **Expandable Inspector:** Click `[Inspect Ledger]` in the console to audit the parsed key-value memory blocks or copy them via the `[Copy Ledger]` button.

### 2.5 Vernacular Chat Stream & Custom Input Bar
- Renders conversational turns between Ramesh Chandra (Senior) and Sambandh (Voice Agent).
- **Per-Turn Audio Playback:** Click the `[🔊]` icon beside any message to replay the Hindi voice synthesis on demand.
- **Colloquial Transliterator Bar:** Allows judges to type unscripted Hinglish phrases (e.g., *"aaj sugar ki goli bhool gaya tha"*); the built-in transliterator converts it to authentic Devanagari in real time.
- **Active Call Controls & "End Call" Button:** A red `[🔴 End Call]` button in the telephony header terminates the active session immediately, computing vitality scores and automatically dispatching the formatted Daily Care Briefing to daughter Priya's Telegram.

### 2.6 Ambient In-Clinic Doctor Consultation Bridge Modal (`DoctorConsultationModal.tsx`)
Clicking the `[🩺 In-Clinic Doctor Visit]` button in the top navigation bar opens the **Ambient In-Clinic Doctor Consultation Bridge**:
- **Ambient Audio Capture:** Toggle `[🎙️ Start Ambient Transcriber]` or test with one-click realistic clinical presets (e.g., *Dr. Saxena Hypertension & Statin Consultation*).
- **Zero Artificial Diarization:** Ingests the free-flowing consultation room conversation between the doctor, Ramesh Uncle, and daughter Priya without brittle speaker labeling.
- **MedGemma 3-Tier Clinical Extraction:**
  - **Tier 1 (ABDM EHR Clinical Record):** Structured vitals (BP, pulse), formal diagnosis codes, clinical summary, follow-up timelines, and newly detected active molecules (e.g., *Atorvastatin 10mg OD Night*).
  - **Tier 2 (Papa's Hindi Vernacular Guide):** Pure Devanagari simplified explanation with dietary rules and daily dosage schedules. Includes built-in `[🔊 Play Hindi Audio Summary]` TTS synthesis.
  - **Tier 3 (Caregiver Telegram Action Checklist):** High-priority clinical action items and instant `[📱 Send Doctor Consultation Report to Telegram]` button.
- **Automatic Molecule Synchronization:** Tapping `[🔄 Sync to Papa's Active Prescriptions]` immediately injects parsed medicines into `activeMolecules`, updating the AI companion's morning pill reminder prompts in real time.

### 2.7 Live Modular JIT Prompt Inspector (`SystemPromptModal.tsx`)
Clicking the `[📜 System Prompt]` button in the top navigation bar opens the **Modular JIT Prompt Inspector**:
- **Real-Time Module Status Badges:**
  - `[Companion Core: Active]` (Always active: warm persona, Awadhi respect, unscripted sparks)
  - `[Subtle Adherence: Injected / Dormant]` (Injected dynamically at turn $\ge 2$ or routine mentions)
  - `[Clinical Dossier: Injected / Dormant]` (Injected only on joint pain or symptom mentions)
  - `[Fiduciary Refill: Injected / Dormant]` (Injected only on stock, refill, or payment topics)
  - `[Acoustic Tripwire: Injected / Dormant]` (Injected only on fraud or impersonation detection)
- **Papa's Streamed Interest Topics:** Live pill badges showing active topics (e.g., *Northern Railway WDM-2 locos*, *Rohini Japanese Park morning walk*, *Knee care*, *Gardening*) injected into the companion core prompt.
- **Prompt Size Proof:** Demonstrates to judges that the system prompt strictly avoids upfront bloat or clinical escalation, keeping inference latency sub-150ms and token costs minimal.

---

## 3. Right Pane: Judge & Step API Inspector

The Right Pane is the technical proof engine of Project Sambandh, exposing the deterministic microservices and APIs executing under the hood.

### 3.1 Partner Rails Catalog (Top Bar)
Across the top of the inspector, a catalog displays all 6 supported partner rails with clean, modern UI tokens:
- **Logo on Top:** High-contrast SVG/Unicode icon representing the product or institution.
- **Tech Name Below:** Exactly two words specifying the service (e.g., `WhisperFlo Telephony`, `ABDM FHIR`, `Pine Labs`, `Delhivery CMU`, `Telegram Bot`, `Tripwire Guard`).
- **1-Line Purpose Tooltip:** Hovering over any card displays its strict operational role (e.g., *"Executes autonomous ₹840 UPI auto-debit under ₹4,500 mandate"*).

### 3.2 Tool Execution Node Timeline
Every autonomous action taken by Sambandh manifests as a chronological **Tool Execution Node**:
- **Step Index Badge:** Sequential counter tracking the execution chain.
- **Brand Identity & Color Coding:** Visually branded cards for ABDM, Pine Labs, Delhivery, WhisperFlo, and Telegram.
- **Status Codes & Badges:** Real-time HTTP results:
  - `200 OK CAPTURED` (Pine Labs debit verified)
  - `RUNWAY < 5D` (ABDM refill threshold triggered)
  - `200 MANIFESTED` (Delhivery waybill generated)
  - `182ms SEVERED` (Acoustic tripwire line severed)
  - `403 MANDATE HELD` (Fiduciary spending cap enforced)
  - `TOPIC DISCOVERED` (Autonomous interest extraction logged)
- **Microsecond Latency Metrics:** Proves production-readiness with real-world latencies ($84\text{ms}$ for ABDM inventory, $182\text{ms}$ for tripwire sever, $310\text{ms}$ for UPI debit).
- **Collapsible HTTP Request / Response Inspector:** Click any node to expand the full, valid HTTP payload including request headers, JSON bodies, and response payloads.
- **Clinical & Fiduciary Reasoning Snippets:** Explains *why* the agent triggered the rail (e.g., *"[ABDM EVAL]: Pill runway 3 days < 5-day threshold. Pine Labs auto-debit ₹840 approved. Delhivery manifested."*).

### 3.3 Dynamic Node Merging & Acoustic Tripwire Interceptor
- **Dynamic Node Merging:** The Right Pane timeline is fully reactive. Clicking presets in the Recommended Prompts table or speaking custom prompts appends execution nodes dynamically without reloading the page.
- **Real-Time Acoustic Tripwire Interceptor:** If an unverified caller speaks financial solicitation words (e.g., *"GPay"*, *"Google Pay"*, *"fees"*, *"pension"*, *"transfer"*, *"bhej do"*), a red high-priority banner animates instantly:
  - Header: `⚡ Real-Time Acoustic Tripwire Intercepted (182ms Latency)`
  - Action: Telephony SIP carrier severed instantly. Senior financial firewall locked.
  - Action CTA: Direct `[📱 View Telegram Alert]` button linking to the caregiver notification.

---

## 4. Persona Navigation & Command Deck

The console header provides 1-click navigation across the 3 dedicated persona domains:

### 4.1 Persona Tab 1: Elder Companion (Ramesh Chandra)
- **Primary Telephony Interface:** Dual-pane layout featuring Ramesh Uncle's morning call simulation on the left and the real-time Judge & Step API Inspector on the right.
- **Audio Synthesis & Visualizer:** Real-time animated waveform with multi-engine Hindi voice synthesis (Windows SAPI5 / Natural, Web Speech, WhisperFlo).
- **Recommended Prompts Playbook:** 1-click test scenarios across routine adherence, local news opinions, balcony wellness, and emergency tripwires.

### 4.2 Persona Tab 2: Caregiver Hub (Priya Sharma Command Deck)
A unified, accordion-driven Command Deck designed for daughter Priya Sharma (overseeing care from Bengaluru):
1. **Dynamic Elder Profile & Clinical Baseline:**
   - Real-time form fields for Elder Name, Age, Gender, City, Vocation, Baseline Diagnoses, Preferred Address Style (e.g. "अंकल / जी" vs "बाबूजी"), Caregiver Relationship, and Monthly Spending Envelope.
   - **PostgreSQL Live Sync:** Clicking `[Save Profile & Update Sambandh]` executes `PUT /api/seniors/{id}` in the FastAPI backend, updating PostgreSQL and instantly re-calibrating future voice calls without deployment.
2. **Conversation Sparks, Interests & Opinions:**
   - Curate topics for Sambandh to bring up during morning calls (e.g., *Northern Railway Locomotive Lore*, *Rohini Japanese Park Walking Track*).
   - View autonomously extracted topics discovered from call transcripts.
   - Toggle topics active/inactive or add new topics dynamically.
3. **Live Telemetry & DAG Execution Inspector:**
   - Real-time DAG execution tree tracking tool execution status, HTTP status codes, and microsecond latencies.
   - Audit trail of autonomous Pine Labs UPI auto-debits, ABDM inventory queries, and Delhivery courier dispatches.
4. **Caregiver Telegram & Weekly Digest Receptors:**
   - Interactive Telegram MTProto reassurance card delivered within 60s of call completion (`@SambandhCare_Bot`).
   - Sunday Family Digest visualizing longitudinal adherence (98.4%) and 28-day medicine runway buffers.

### 4.3 Persona Tab 3: Youth & Wisdom Bridge (DTU Engineering Students)
Transforms digital healthcare from one-way elder care into an intergenerational mentorship engine:
- **Left Chassis (Elder Mentor Profile):** Privacy-preserved profile of Ramesh Chandra (`R***** C******`) highlighting his 41-year Northern Railway signaling career and mechanical relay expertise.
- **Right Chassis (Student Question Deck & Safety Gate):**
  - **Youth Personas:** Aarav Mehta (3rd Year EE, DTU) and Sneha Rao (4th Year Mech, DTU).
  - **Vetted & Malicious Question Presets:** Pre-designed prompts testing both legitimate engineering questions (mechanical relay interlocking SOP) and exploitative prompts (asking for pension money, OTP, or house keys).
  - **Autonomous LLM Safety Gate:** Questions undergo automated safety evaluation against PII harvesting, financial solicitation, and exploitation.
  - **Visual Safety Status:** Approved questions display a green `[SAFE TO RELAY]` badge and queue into Sambandh's morning call; predatory questions are flagged with a red `[EXPLOITATION / PII HARVESTING DETECTED]` banner and severed.

For complete details on prompt composition, token budgeting, and database column mappings, see **[System Prompt Architecture & JIT Budgeting](file:///d:/lab/projects/project-sambandh/docs/SYSTEM_PROMPT_ARCHITECTURE.md)**.

---

## 5. Judge Evaluation Checklist

When evaluating Project Sambandh during the competition, look for these specific proof points:

- [ ] **Companion-First Pacing:** Does the call open with an unscripted, warm spark (weather, local Rohini park/news, gentle humor) rather than an abrupt clinical audit?
- [ ] **Opinion Elicitation:** Does the agent actively solicit Ramesh Uncle's perspective on local topics, reinforcing elder dignity?
- [ ] **Subtle Adherence Weaving:** Does the agent naturally bridge into morning medication reminders after 2–3 turns without breaking conversational rapport?
- [ ] **Modular JIT Prompting:** Inspect the `[📜 System Prompt]` modal to confirm prompt slices are attached conditionally rather than bloating upfront.
- [ ] **Ambient Doctor Consultation Bridge:** Click `[🩺 In-Clinic Doctor Visit]` to inspect ambient audio capture, MedGemma 3-tier clinical extraction, and live sync to active prescriptions.
- [ ] **Live Telegram Integration:** Check Telegram `@SambandhCare_Bot` to inspect real-time delivery of Morning Care Briefings, HITL Refill Approval Cards, and Doctor Reports.
- [ ] **Authentic Vernacular Fluency:** Does the agent comprehend natural Indic speech (e.g., *"laal wali goli"* $\rightarrow$ *Telmisartan 40mg*)?
- [ ] **Deterministic L3 Limits:** Does the system auto-debit ₹840 without asking, but strictly halt and request 2FA when an order is ₹5,200?
- [ ] **Acoustic Safety SLA:** Does the tripwire sever the telephony carrier line in under 300ms when financial solicitation occurs?
- [ ] **Caregiver Reassurance:** Does the family receive clear, non-anxious transparency via Telegram within 60 seconds of call completion?

