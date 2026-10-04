# Project Sambandh: System Architecture & Partner Rails 🏛️

> **The Ken Case Competition 2026 — Track: Product Strategy & Systems Architecture**  
> **Document:** 02 — Technical System Architecture, FSM & Partner Rail Integrations  
> **Target Autonomy:** Level 3 (Bounded Fiduciary & Operational Execution)

---

## 1. High-Level System Architecture

Project Sambandh operates as an event-driven, microservices-orchestrated autonomous care platform designed for high reliability, low-latency vernacular telephony, and deterministic execution of real-world financial and logistics transactions.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                TELEPHONY & INGRESS LAYER                               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Elder Handset (Feature Phone / Landline / Smartphone)                                │
│       ▲                                                                                │
│       │ G.711 / OPUS HD 8kHz/16kHz PCM Stream                                          │
│       ▼                                                                                │
│  Jio PSTN / SIP Telephony Gateway ──► WhisperFlo Streaming STT / TTS Subsystem        │
│       │                                 (Awadhi, Khariboli, Pure Hindi, Hinglish)      │
└───────┼────────────────────────────────────────────────────────────────────────────────┘
        │ Bidirectional Dialogue Stream (Audio + ASR Transcripts)
        ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                 CENTRAL REASONING BRAIN, JIT PROMPTS & MEMORY LEDGER                   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Gemini 1.5 Pro / Flash Orchestrator                                                  │
│  ├── 💬 CONVERSATIONAL COMPANION LAYER (Tier 1)                                       │
│  │   ├── Randomized Morning Spoken Sparks (Delhi Weather, Rohini Park/Metro News)     │
│  │   ├── Wholesome Elder Humor & Walking Club Banter (Laughs With Elder, Not At)       │
│  │   └── Opinion Elicitation Engine ("Uncle Ji, what is your view on this?")           │
│  ├── 🧩 JUST-IN-TIME (JIT) MODULAR PROMPT ENGINE (Tier 3)                             │
│  │   ├── Lean Companion Core Prompt (~180 tokens, strictly avoids upfront bloat)       │
│  │   ├── Conditional Slices: [+Subtle Adherence] [+Clinical Dossier] [+Refill]        │
│  │   └── Hybrid Topic Knowledge Pool (Priya's Portal Starters + Voice Entity Mining)   │
│  ├── 🌉 SUBTLE ADHERENCE BRIDGE & RUNWAY ENGINE (Tier 2)                               │
│  │   ├── Casual Weaving at Turn >= 2 ("Baaton-baaton mein... did you take Telma 40?") │
│  │   ├── Indic Salt Mapping (Colloquial "laal goli" ➔ Telmisartan 40mg FHIR Rx)       │
│  │   └── Deterministic Runway Math: (DeliveredUnits - DaysElapsed * DailyDose) <= 5D  │
│  ├── 🧠 STRUCTURED CONTEXT LEDGER (~210 Tokens, Zero-Loss Memory Fold)                │
│  └── 🛡️ ACOUSTIC SEMANTIC TRIPWIRE ENGINE (Parallel 182ms N-Gram Fraud Intercept)     │
└───────┼────────────────────────────────────────────────────────────────────────────────┘
        │ Structured Tool Calls (JSON Function Calling)
        ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        DETERMINISTIC PARTNER RAILS EXECUTION                           │
├───────────────────────────────────┬────────────────────────────────────────────────────┤
│ 🩺 CLINICAL RAIL: ABDM FHIR       │ 💳 FIDUCIARY RAIL: PINE LABS PLURAL                │
│ • FHIR R4 MedicationRequest       │ • UPI Autopay Pre-Approved Mandate (₹4,500 Cap)    │
│ • ABHA ID: ramesh.chandra@abdm    │ • Auto-Debit Execution (₹840.00 Refill Charge)     │
│ • Prescription Runway Validation  │ • 2FA Caregiver Step-Up on Budget Breach (>₹4,500) │
├───────────────────────────────────┼────────────────────────────────────────────────────┤
│ 📦 LOGISTICS RAIL: DELHIVERY CMU  │ 🛡️ SECURITY RAIL: WHISPERFLO TRIPWIRE             │
│ • Dark Store Pickup (Apollo/Net)  │ • Real-time Regex & Phoneme Matching on SIP Trunk  │
│ • Waybill Manifest (DLV-98234-DEL)│ • Hard Line Sever in 182ms on Fraud/Impersonation  │
│ • Priority 4h Doorstep SLA        │ • Automatic Whitelist Lock & Caller Blacklisting   │
└───────────────────────────────────┴────────────────────────────────────────────────────┘
        │ Asynchronous Status Webhooks & Bidirectional Topic Sync
        ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                   CAREGIVER TRANSPARENCY & CONVERSATION CONTROL RECEPTOR               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Telegram MTProto Bot API / WhatsApp Cloud API                                         │
│  ├── Daily Morning Reassurance Card (Delivered <60s post-call with Mood & Adherence)   │
│  ├── Clickable Inline Action Buttons ([🎧 Audio Clip] [📦 Track] [⚡ 2FA Approve])     │
│  ├── 💡 Papa's Topics Hub: Add/Toggle conversation starters (Gardening, Northern Rly)  │
│  └── Weekly Sunday 7:00 PM Longitudinal Family Digest (Vitals, Trends, Refill Status) │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Telephony & Indic Speech Layer (WhisperFlo Subsystem)

To ensure universal accessibility across India's diverse demographic landscape, Sambandh operates entirely without requiring smartphone apps or broadband internet on the elder's end:

1. **Carrier Telephony Ingress:** Calls terminate over standard telecom channels (Jio VoLTE, Airtel, Vi, BSNL) into a SIP trunk managed by WhisperFlo / Gnani.ai telephony gateways.
2. **Codec Handling:** Incoming audio is ingested as G.711 $\mu$-law or OPUS HD (8 kHz to 16 kHz sample rate).
3. **Multi-Engine Speech-to-Text (STT):**
   - Tuned for North Indian elder dialects (Awadhi-Hindi, Bhojpuri-Hindi, Khariboli, and urban Hinglish).
   - Real-time streaming transcription with word-level confidence scoring.
   - Preserves colloquial phonetic transcriptions (e.g., *"laal wali goli"*, *"sugar wali aadhi tablet"*).
4. **Zero-Latency Text-to-Speech (TTS) Hierarchy:**
   - **Primary Engine:** WhisperFlo Cloud Neural TTS (high naturalness, authentic Indian elder cadence, respectful honorifics like *"Ji"*, *"Uncle"*).
   - **Local SAPI5 Fallback:** Microsoft Windows Local Speech API (`hi-IN` voices: Hemant, Kalpana, Swara) providing 0-latency offline synthesis.
   - **Browser Web Speech API Fallback:** Native Google Chrome / Edge `hi-IN` speech synthesis.

---

## 2.1 Just-In-Time (JIT) Modular Prompt Architecture & Conversational Pacing 💬

Traditional voice bots fail elderly care by getting down to business too quickly—interrogating seniors with rapid clinical checklists (*"Did you take your pills? What are your vitals?"*) that cause defensiveness, anxiety, and robotic fatigue.

Sambandh implements a **Companion-First, JIT Modular Architecture**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         JUST-IN-TIME (JIT) PROMPT ENGINE                               │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [1. LEAN COMPANION CORE - ALWAYS ACTIVE]                                              │
│  • Respectful niece persona (अंकल, जी, प्रणाम); warm family warmth                     │
│  • Natural conversational sparks (weather, local Delhi/Rohini news, wholesome jokes)    │
│  • Papa's Active Topics of Interest (Hybrid: Priya's list + Autonomously Discovered)   │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [2. CONDITIONAL MODULAR SLICES - INJECTED JUST-IN-TIME]                               │
│  ├─ Turn Count >= 2 OR Routine Mention: + [SUBTLE HEALTH & ADHERENCE BRIDGE]          │
│  │   • Casually weaves in Telma 40 reminder without disrupting conversational flow     │
│  ├─ Physical Symptom / Pain Mention: + [CLINICAL CARE & OBSERVATION SLICE]             │
│  │   • Tender concern for knee osteoarthritis, warm compresses, avoid steep stairs     │
│  ├─ Low Stock / Refill / Payment Mention: + [FIDUCIARY AUTONOMY & REFILL SLICE]        │
│  │   • Pine Labs ₹4,500 mandate bounds, ABDM repeat validity, Delhivery tracking       │
│  └─ Suspicious Caller / Impersonation: + [ACOUSTIC TRIPWIRE DEFENSE SLICE]             │
│      • 182ms phoneme match, line isolation, caregiver alert                            │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Key Principles of the Conversational Companion:
1. **Unscripted & Randomized Openers:** Every morning call opens with a fresh, natural spark (e.g. today's pleasant morning sunshine in Rohini, a local park development update, or a gentle laugh about morning walkers), actively asking for Ramesh Uncle's perspective (*"अंकल जी, आपका क्या मानना है इसपर?"*).
2. **Subtle Health Weaving:** The agent does not open with a clinical checklist. After establishing rapport over 2–3 turns of natural banter, it casually checks in on breakfast and medications:
   > *"वैसे रमेश अंकल, आपसे बातों-बातों में ध्यान आया... सुबह की ताज़ा चाय तो बढ़िया हो गई, लाल वाली बीपी की गोली (Telma 40) भी ले ली थी ना आपने?"*
3. **Hybrid Interest Knowledge Pool:**
   - **Autonomously Discovered:** Inferences from natural speech (e.g., mentions of Northern Railway signaling, WDM-2 locos, old Mohammed Rafi songs, gardening) are automatically extracted, logged to persistent state, and emitted as execution tree nodes.
   - **Caregiver-Curated:** Daughter Priya can pre-populate and toggle conversation starters directly via the Caregiver Telegram Portal.
4. **Telemetry Visibility:** The System Prompt Modal exposes a live **Modular Prompt Inspector** with status badges (`[Companion Core: Active]`, `[Subtle Adherence: Injected]`, `[Clinical Dossier: Dormant]`), proving to judges that prompt size and cognitive load are dynamically bounded.

---

## 3. Clinical Data Rail: ABDM (Ayushman Bharat Digital Mission)

Project Sambandh natively interfaces with India's national health stack via the **Ayushman Bharat Digital Mission (ABDM)** protocols.

### 3.1 Patient ABHA Identity
- **Patient Name:** Ramesh Chandra
- **ABHA Number:** `91-8273-1920-4491`
- **ABHA Address:** `ramesh.chandra@abdm`
- **Primary Care Physician:** Dr. Alok Saxena (Registration: `DMC-29104`, Max Super Speciality Hospital)

### 3.2 FHIR R4 Resource Mapping
Sambandh queries and validates active digital prescriptions via the ABDM Health Information Exchange (HIE-CM). When the senior mentions their medications, the colloquial terms are mapped to formal clinical codes:

```json
{
  "resourceType": "MedicationRequest",
  "id": "medrx-abdm-98102-telma",
  "status": "active",
  "intent": "order",
  "medicationCodeableConcept": {
    "coding": [
      {
        "system": "http://snomed.info/sct",
        "code": "319861009",
        "display": "Telmisartan 40 mg oral tablet"
      }
    ],
    "text": "Telma 40mg (Pink BP Tablet)"
  },
  "subject": {
    "reference": "Patient/ramesh-chandra-918273",
    "display": "Ramesh Chandra"
  },
  "dosageInstruction": [
    {
      "text": "1 tablet once daily in the morning after breakfast",
      "timing": {
        "repeat": { "frequency": 1, "period": 1, "periodUnit": "d" }
      }
    }
  ],
  "dispenseRequest": {
    "validityPeriod": {
      "start": "2026-09-01T00:00:00Z",
      "end": "2026-12-01T00:00:00Z"
    },
    "numberOfRepeatsAllowed": 3,
    "quantity": { "value": 30, "unit": "tablets" }
  }
}
```

### 3.3 Inventory Depletion Formula
The autonomous replenishment engine computes remaining runway using the verified delivery timestamp $T_{\text{last\_delivery}}$ and the daily dosage frequency $F$:

$$\text{Days Elapsed} = \lfloor \frac{T_{\text{current}} - T_{\text{last\_delivery}}}{86400} \rfloor$$

$$\text{Current Pill Runway} = \text{Initial Units Delivered} - (\text{Days Elapsed} \times F)$$

$$\text{Runway Ratio} = \frac{\text{Current Pill Runway}}{\text{Initial Units Delivered}}$$

$$\text{Autonomous Trigger Condition: } \text{Runway Ratio} \le 0.20 \quad (\le 5 \text{ days})$$

---

## 4. Fiduciary Rail: Pine Labs Plural UPI Autopay

To remove cognitive overhead from the family while maintaining strict financial safety, Sambandh executes recurring payments via **Pine Labs Plural UPI Autopay Mandates**.

### 4.1 Mandate Specifications
- **Mandate Identifier:** `PINE_MANDATE_DL_98102`
- **Authorized Payer:** Priya Sharma (Daughter / Caregiver on Record)
- **Settlement Beneficiary:** Netmeds Healthcare Private Limited
- **Monthly Mandate Cap:** **₹4,500.00**
- **Headroom Remaining:** **₹3,660.00**
- **Routine Refill Charge:** **₹840.00** (Telma 40mg 30 tabs + Metformin 500mg 30 tabs)

### 4.2 Autonomous Settlement Sequence
Because ₹840.00 is strictly $\le$ ₹3,660.00 headroom, the settlement executes autonomously:

```http
POST /v1/mandates/PINE_MANDATE_DL_98102/execute_debit HTTP/1.1
Host: api.pluralonline.com
Authorization: Bearer [MOCK_PINE_MANDATE_AUTH_TOKEN]
Content-Type: application/json

{
  "amount": 840.00,
  "currency": "INR",
  "beneficiary_id": "NETMEDS_ROHINI_HUB_01",
  "patient_ref": "ramesh.chandra@abdm",
  "prescription_id": "medrx-abdm-98102-telma",
  "settlement_type": "AUTONOMOUS_HEALTHCARE_REFILL",
  "idempotency_key": "IDEM-PINE-20261002-840"
}

HTTP/1.1 200 OK
Content-Type: application/json

{
  "transaction_id": "TXN_PINE_88291039",
  "status": "CAPTURED",
  "amount_debited": 840.00,
  "remaining_mandate_headroom": 2820.00,
  "latency_ms": 310,
  "settled_at": "2026-10-02T08:34:12Z"
}
```

### 4.3 Fiduciary Firewall Exception Flow
If a quarterly 3-month specialty order totaling **₹5,200.00** is requested:
1. The engine checks: $\text{Order Cost } (₹5,200) > \text{Monthly Ceiling } (₹4,500)$.
2. The transaction is **instantly suspended** with HTTP `403 FORBIDDEN (MANDATE_CEILING_BREACH)`.
3. The elder is told with conversational dignity: *"Uncle, I have requested Priya's approval for the full 3-month supply so your bank account is not deducted unexpectedly."*
4. A high-priority interactive 2FA card with an `[⚡ Approve ₹5,200 via UPI]` button is dispatched to Priya's Telegram.

---

## 5. Logistics Rail: Delhivery CMU Healthcare Express

Once payment is settled, Sambandh dispatches prescription delivery through **Delhivery Courier Management Unit (CMU)**.

### 5.1 Service Level Agreement (SLA)
- **Origin:** Apollo / Netmeds Dark Store, Rohini Sector 11 Hub
- **Destination:** Flat 402, Block C-3, Rohini Sector 8, New Delhi 110085
- **Priority Tier:** Healthcare Cold-Chain / Ambient Priority SLA (Same-Day / 24-Hour Delivery)

### 5.2 Courier Dispatch API Exchange

```http
POST /cmu/v3/consignments/manifest HTTP/1.1
Host: express.delhivery.com
Authorization: Token [MOCK_DELHIVERY_PARTNER_TOKEN]
Content-Type: application/json

{
  "pickup_location": "NETMEDS_DARKSTORE_DL_110085",
  "consignee": {
    "name": "Ramesh Chandra",
    "phone": "+919810234567",
    "address_line1": "Flat 402, Block C-3",
    "locality": "Rohini Sector 8",
    "city": "New Delhi",
    "pincode": "110085"
  },
  "package_details": {
    "weight_grams": 180,
    "category": "PRESCRIPTION_MEDICATION",
    "is_fragile": true,
    "temperature_control": "AMBIENT_STABLE"
  }
}

HTTP/1.1 200 OK
Content-Type: application/json

{
  "waybill": "DLV-98234-DEL",
  "status": "MANIFESTED",
  "eta_timestamp": "2026-10-02T16:00:00+05:30",
  "service_tier": "HEALTHCARE_SAME_DAY",
  "pickup_scheduled": "10:30 AM",
  "live_tracking_url": "https://delhivery.com/track/DLV-98234-DEL"
}
```

---

## 6. Security Rail: WhisperFlo Acoustic Tripwire Intercept

In elderly care, financial fraud, impersonation by fake relatives, and pension verification scams represent acute threats. Sambandh embeds a sub-second **Acoustic Semantic Tripwire** directly into the telephony DSP audio stream.

```
                      INCOMING AUDIO STREAM
                                │
                                ▼
        ┌───────────────────────────────────────────────┐
        │  Continuous Acoustic & Phonemic DSP Engine   │
        └───────────────────────┬───────────────────────┘
                                │
                                ▼
        ┌───────────────────────────────────────────────┐
        │   Semantic N-Gram Matcher (Parallel Thread)   │
        │   Patterns:                                   │
        │   • Google Pay / PhonePe / Paytm / UPI        │
        │   • "College fees" / "Pension verification"   │
        │   • "Ghar par akele rehte hain" (Living alone)│
        │   • Urgent money transfers                    │
        └───────────────────────┬───────────────────────┘
                                │
                  MATCH DETECTED? (Fraud Threat)
                                │
                ┌───────────────┴───────────────┐
                ▼ YES                           ▼ NO
┌──────────────────────────────────┐    ┌───────────────────────────┐
│ SEVER TELEPHONY LINE (182ms SLA) │    │ Continue Normal Dialogue  │
├──────────────────────────────────┤    └───────────────────────────┘
│ • Issue SIP BYE command          │
│ • Blacklist Inbound CLI          │
│ • Lock Elder Financial Firewall  │
│ • Silent Red Alert to Caregiver  │
└──────────────────────────────────┘
```

### SLA Performance Benchmark:
- N-gram detection window: **50ms**
- SIP Trunk Severance: **132ms**
- Total Time to Terminate Call: **182ms** (Well below the 300ms fraud cutoff target)
- Result: The senior hears a clean click as if the call dropped naturally; the fraudster is permanently blacklisted, and Priya receives an instant audit transcript on Telegram.

---

## 6.5 Ambient In-Clinic Doctor Consultation Transcriber & MedGemma 3-Tier Clinical Transformation 🩺🎙️

Elderly outpatient clinic visits in India present severe comprehension and continuity gaps: consultations are conducted in high-speed Hinglish/Medical jargon, doctors give rapid verbal instructions, and prescriptions change without being seamlessly updated in the senior's routine.

Project Sambandh solves this with an **Ambient In-Clinic Transcriber & 3-Tier Transformation Engine**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│               AMBIENT CLINIC AUDIO INGRESS (NO RIGID SPEAKER TAGGING)                 │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  In-Room Microphone (Consultation Room: Doctor + Senior Ramesh Uncle + Caregiver Priya)│
│       ▲                                                                                │
│       │ Real-time Web Speech / Gnani Ambient Audio Capture (Hindi + English + Hinglish)│
│       ▼                                                                                │
│  Raw Unpartitioned Consultation Transcript Stream                                      │
└───────┬────────────────────────────────────────────────────────────────────────────────┘
        │
        ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│            MEDGEMMA / GEMINI 1.5 PRO CLINICAL REASONING & 3-TIER EXTRACTION            │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Multi-Turn Clinical LLM Pipeline:                                                     │
│  Extracts: Chief Complaints, Vitals, Diagnoses, Prescription Changes, Diet, Follow-up │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ▼ TIER 1: ABDM FHIR EHR CLINICAL DOSSIER                                              │
│  • Structured Clinical Summary & Doctor Notes                                          │
│  • New / Adjusted Active Molecules (e.g., Atorvastatin 10mg OD Night, Telma 40mg OD)  │
│  • Vitals Captured (e.g., BP 138/86 mmHg, Pulse 74 bpm) & Follow-up Date               │
│  • 🔄 Real-Time Sync: Directly injects into activeMolecules & PostgreSQL Health Locker │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ▼ TIER 2: PAPA'S HINDI VERNACULAR PATIENT GUIDE (DEVNAGARI + ZERO-LATENCY AUDIO)      │
│  • 100% Conversational Devanagari Hindi translation ("डॉक्टर साहब ने क्या समझाया")     │
│  • Simple, respectful medicine schedule ("रात को खाना खाने के बाद")                    │
│  • Lifestyle & Dietary warnings ("नमक और तली चीज़ें कम करनी हैं")                      │
│  • 🔊 Built-in Vernacular TTS: 1-tap read-aloud via Hindi Web Speech / SAPI5           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  ▼ TIER 3: CAREGIVER TELEGRAM ACTION CHECKLIST & MTPROTO PUSH CARD                     │
│  • High-priority clinical action items dispatched directly to Daughter Priya           │
│  • Instant 1-Click Telegram Push Card via @SambandhCare_Bot                            │
│  • Pharmacy Refill Prompts for newly prescribed medications                            │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Key Technical Innovations of the In-Clinic Bridge:
1. **Zero Artificial Speaker Tagging:** In real-world clinics, family members chime in, doctors speak over patients, and rigid speaker diarization frequently misattributes statements. Sambandh ingests the raw acoustic dialogue stream and relies on MedGemma's semantic reasoning to attribute clinical facts, patient symptoms, and doctor instructions.
2. **Autonomous Medication State Synchronization:** When the doctor prescribes a new medication (e.g. *Atorvastatin 10mg*), the extraction engine parses the molecule, brand name, dosage, timing, and meal relation, automatically appending it to `activeMolecules`. This immediately updates Sambandh's morning phone call prompts without manual caregiver data entry.
3. **Multi-Modal Vernacular Playback:** Seniors can listen to their doctor's advice in warm, familiar Hindi speech anytime by tapping the `[🔊 Hindi Audio Summary]` button in the consultation modal.

---

## 7. Caregiver Transparency Rail: Live Telegram & WhatsApp MTProto

All telemetry, emotional state benchmarks, clinical consultations, and operational actions are transmitted to the family via live Telegram MTProto Bot integration (`@SambandhCare_Bot`).

### 7.1 Telegram Bot Integration Architecture
- **Bot Handle:** `@SambandhCare_Bot`
- **Protocol:** Telegram Bot API HTTPS REST Endpoints (`/sendMessage`)
- **Parse Mode:** Structured HTML with automatic HTML entity escaping (`escapeHtml`) to prevent formatting breakage.
- **Button URL Sanitizer:** Automatically sanitizes deep links to conform with Telegram's HTTPS URL schema requirements.
- **Resilient Fallback:** Automatically retries with plain text formatting if HTML parsing encounters edge-case syntax rejections.

### 7.2 Message Card Types

#### 1. Daily Morning Care Briefing (Delivered <60s post-call)
- **Vitality Score & Mood:** Real-time vitality gauge (e.g., `96/100 · 🌿 Cheerful & Energetic`).
- **Adherence Ground-Truth:** Dynamic confirmation of morning medications (e.g., `✅ Morning Telma-40 confirmed taken with fresh water`).
- **Call Summary:** 2-line conversational recap of topics discussed (e.g., morning tea on balcony, railway memories).
- **Inline Action Buttons:** `[📊 Open Telemetry Console]`, `[📞 Call Papa Directly]`.

#### 2. Human-in-the-Loop (HITL) Medication Refill Approval Card
- **Trigger:** Initiated when pill runway drops below 5 days or senior mentions running low on medicines.
- **Financial Headroom:** Displays proposed debit vs. Pine Labs monthly mandate ceiling (`₹840 / ₹4,500`).
- **Pharmacy & Logistics:** Netmeds partner fulfillment, Delhivery 4-hour doorstep SLA.
- **Interactive Inline Buttons:** `[✅ Approve Refill (₹840)]`, `[❌ Deny / Edit Refill]`.

#### 3. In-Clinic Doctor Consultation Summary Card
- **Trigger:** Dispatched immediately upon conclusion of an in-clinic doctor visit.
- **Doctor & Hospital:** Dr. Alok Saxena (Max Super Speciality Hospital).
- **Diagnoses & Vitals:** BP 138/86 mmHg, mild hypertensive fluctuation.
- **Prescription Changes:** Newly prescribed Atorvastatin 10mg (OD Night).
- **Caregiver Action Items:** Order new cholesterol medication, schedule follow-up in 4 weeks.

#### 4. Acoustic Fraud Tripwire Emergency Alert
- **Trigger:** Sub-second line severance on financial exploitation keyword detection.
- **Threat Type:** Impersonation / Fake pension verification scam.
- **Mitigation:** Telephony trunk severed in 182ms; elder financial envelope locked.

---

## 8. Finite State Machine (FSM) Specification

The system transitions across 10 formal states with 4 governed exception traps:

| State | Name | Trigger / Condition | Autonomous Action | Exception Trap |
| :--- | :--- | :--- | :--- | :--- |
| **S0** | **IDLE** | 08:30 AM cron timer or inbound ring | Prepares profile context & ABDM record | - |
| **S1** | **CALL CONNECT** | SIP gateway handshakes | Validates caller ID and voiceprint | Trunk timeout $\rightarrow$ Redial in 15m |
| **S2** | **LANE 1: WISDOM & BANTER** | Call answered | Natural 30s opening spark (weather, humor, news) | **E3 (Acoustic Tripwire):** Money solicitation $\rightarrow$ Sever in 182ms |
| **S3** | **LANE 2: ADHERENCE** | Turn $\ge 2$ or health mention | Casually weaves in clock-based medicine check | **E1 (Clinical Alarm):** Chest pain $\rightarrow$ Emergency doctor alert |
| **S4** | **RUNWAY EVAL** | Pill recall processed | Compares consumption against ABDM record | Unclear recall $\rightarrow$ Caregiver manual verify |
| **S5** | **HITL APPROVAL GATE** | Runway $\le 20\%$ (<5 days) | Dispatches Telegram approval card to caregiver | Caregiver Deny $\rightarrow$ Abort transaction |
| **S6** | **SETTLEMENT** | Caregiver approves / Auto-cap OK | Checks mandate headroom; debits ₹840 via Pine Labs | **E2 (Fiduciary Breach):** Cost >₹4,500 $\rightarrow$ 2FA Telegram card |
| **S7** | **LOGISTICS** | Payment 200 OK | Books Delhivery same-day courier dispatch | Stockout $\rightarrow$ Secondary pharmacy hub routing |
| **S8** | **CAREGIVER BRIEF** | Call ended / Logistics manifested | Formats and dispatches Telegram Morning Briefing | MTProto retry backoff |
| **S9** | **DOCTOR BRIDGE** | Consultation audio captured | Executes 3-tier clinical transformation & sync | Unparseable audio $\rightarrow$ Caregiver review flag |

---

## 9. Relational Data Layer: PostgreSQL (`sambandh-postgres`)

To eradicate static constants and ensure zero hardcoded senior profiles, Sambandh uses a relational PostgreSQL persistence engine (`services/health_locker/schema.sql`):

- **`seniors` Table:** Stores senior identity, age, city, vocation, clinical baseline, preferred address style, caregiver details, and Pine Labs spending ceilings.
- **`senior_interests` Table:** Tracks caregiver-curated and autonomously call-extracted conversation topics with active/inactive boolean flags.
- **`senior_opinions` Table:** Stores topical local news sparks (infrastructure, parks, metro expansions) used to stimulate elder opinions and combat cognitive decline.
- **`prescriptions` & `medication_intakes` Tables:** Powers deterministic pill runway calculations and adherence timelines.
- **`doctor_consultations` Table:** Stores structured in-clinic transcripts, clinical notes, EHR FHIR payloads, and vernacular summaries.

FastAPI endpoints (`services/health_locker/api_server.py`) expose CRUD operations (`PUT /api/seniors/{id}`, `GET/POST /api/seniors/{id}/interests`, `GET /api/seniors/{id}/opinions`, `POST /api/consultations`), enabling daughter Priya to adjust Ramesh Uncle's profile at runtime via the Caregiver Hub.

---

## 10. Frontend Architecture: Single-Responsibility Hooks

The Telemetry Console (`telemetry-console/src/`) avoids monolithic context anti-patterns by decomposing state into 9 focused hooks coordinated by a thin `TelemetryContext`:

1. `useAudioPipeline`: Multi-engine Hindi voice synthesis (SAPI5/Natural, Web Speech), live audio context, and animated waveform bars.
2. `useConversationEngine`: JIT modular prompt assembly, dynamic clock-based medication resolution, Gemini LLM invocations, and auto-discovery of new interests.
3. `useDoctorConsultation`: Ambient in-clinic microphone capture, MedGemma 3-tier clinical extraction, Devanagari Hindi TTS playback, and live sync to `activeMolecules`.
4. `useCaregiverState`: PostgreSQL senior profile sync, active conversation sparks, and opinion topic updates.
5. `useFiduciaryLedger`: Pine Labs wallet balances, UPI transaction entries, HITL refill approvals, and 2FA step-up limits.
6. `useYouthMentorship`: Intergenerational engineering student questions, LLM safety gate reviews, and asynchronous voice relays.
7. `useCallSession`: Telephony call lifecycle states (IDLE, CONNECTING, ACTIVE, ENDED), "End Call" trigger, and duration timers.
8. `useExecutionNodes`: Partner rail execution timeline, HTTP request/response payloads, and latency tracking.
9. `useScenarioPlayback`: 1-click test execution of the 5 competition preset scenarios.

For the exhaustive specification of the dynamic prompt construction and token savings, consult **[System Prompt Architecture & JIT Budgeting](file:///d:/lab/projects/project-sambandh/docs/SYSTEM_PROMPT_ARCHITECTURE.md)**.

