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
│                       CENTRAL REASONING BRAIN & MEMORY LEDGER                          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Gemini 1.5 Pro / Flash Orchestrator                                                  │
│  ├── Structured Context Ledger (~210 Tokens, Zero-Loss Multi-Turn Memory)             │
│  ├── Intent & Entity Extraction (Colloquial Indic Pill Names ➔ Generic INN Salts)     │
│  ├── Inventory Math & Runway Calculator: (DeliveredUnits - DaysElapsed * DailyDose)    │
│  └── Acoustic Semantic Tripwire Engine (Parallel 182ms N-Gram Fraud Intercept)        │
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
        │ Asynchronous Status Webhooks & Push Notifications
        ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                         CAREGIVER TRANSPARENCY RECEPTOR                                │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Telegram MTProto Bot API / WhatsApp Cloud API                                         │
│  ├── Daily Morning Reassurance Card (Delivered <60s post-call with Mood & Adherence)   │
│  ├── Clickable Inline Action Buttons ([🎧 Audio Clip] [📦 Track] [⚡ 2FA Approve])     │
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

## 7. Caregiver Transparency Rail: Telegram & WhatsApp MTProto

All telemetry, emotional state benchmarks, and operational actions are transmitted to the family via modern messaging receptors.

### 7.1 Daily Morning Reassurance Card
Delivered within 60 seconds of call termination:
- **Header:** 🌿 *Project Sambandh: Daily Reassurance Card*
- **Elder Status:** Ramesh Chandra (Age 72, Rohini)
- **Call Timestamp:** 08:30 – 08:36 IST (Duration: 5m 42s)
- **Tone & Lucidity Score:** High Vitality (0.94 / 1.00), Spirited & Nostalgic
- **Mentorship Topic:** Mentored Aarav (23, Pune) on Northern Railway signaling leadership.
- **Oral Adherence:** Confirmed (Telma 40mg + Metformin 500mg taken with morning tea).
- **Supply Runway:** 3 days remaining (<5d threshold).
- **Autonomous Fulfillment:** ₹840 debited via Pine Labs Plural; Delhivery Waybill `DLV-98234-DEL` arriving today by 4:00 PM.
- **Interactive Inline Buttons:**
  - `[🎧 Listen to Papa's Story (30s)]`
  - `[📦 Track Delhivery Delivery]`
  - `[💳 View Pine Labs Receipt]`
  - `[📞 Call Papa Directly]`

### 7.2 Sunday 7:00 PM Longitudinal Family Digest
Every Sunday evening, Sambandh aggregates the week's data into a macro digest:
- **Weekly Adherence Rate:** 98.4% (7/7 days ground-truthed)
- **Cumulative Monthly Spend:** ₹840.00 / ₹4,500.00 budget ceiling
- **Vocal Biomarkers:** Tremor index stable (<0.02), articulation rate steady (138 wpm)
- **Prescription Runway:** 28 days of buffer secured.

---

## 8. Finite State Machine (FSM) Specification

The system transitions across 9 formal states with 4 governed exception traps:

| State | Name | Trigger / Condition | Autonomous Action | Exception Trap |
| :--- | :--- | :--- | :--- | :--- |
| **S0** | **IDLE** | 08:30 AM cron timer or inbound ring | Prepares profile context & ABDM record | - |
| **S1** | **CALL CONNECT** | SIP gateway handshakes | Validates caller ID and voiceprint | Trunk timeout $\rightarrow$ Redial in 15m |
| **S2** | **LANE 1: WISDOM** | Call answered | Delivers mentorship guidance prompt | **E3 (Acoustic Tripwire):** Money solicitation $\rightarrow$ Sever in 182ms |
| **S3** | **LANE 2: ADHERENCE** | Mentorship concluded | Prompts conversational pill intake | **E1 (Clinical Alarm):** Chest pain $\rightarrow$ Emergency doctor alert |
| **S4** | **RUNWAY EVAL** | Pill recall processed | Compares consumption against ABDM record | Unclear recall $\rightarrow$ Caregiver manual verify |
| **S5** | **SETTLEMENT** | Runway $\le 20\%$ (<5 days) | Checks mandate headroom; debits ₹840 | **E2 (Fiduciary Breach):** Cost >₹4,500 $\rightarrow$ 2FA Telegram card |
| **S6** | **LOGISTICS** | Payment 200 OK | Books Delhivery same-day courier dispatch | Stockout $\rightarrow$ Secondary pharmacy hub routing |
| **S7** | **CAREGIVER BRIEF** | Logistics manifested | Formats and dispatches Telegram Reassurance Card | MTProto retry backoff |
| **S8** | **TERMINATE** | Call concluded | Updates memory ledger and returns to S0 | - |
