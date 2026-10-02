# Project Sambandh: Fiduciary & Clinical Guardrails 🛡️

> **The Ken Case Competition 2026 — Track: Product Strategy (Safety & Regulatory Architecture)**  
> **Document:** 05 — Boundary Governance, Legal Compliance & Risk Mitigation Protocols  
> **Regulatory Framework:** DPDP Act 2023, Drugs & Cosmetics Act (Schedule H), NMC Guidelines

---

## 1. Overview of Boundary Governance

In healthcare automation, **safety is defined by what an agent refuses to do**. An autonomous system that indiscriminately makes decisions without human oversight is a liability. Project Sambandh is engineered under **Bounded Level 3 (L3) Autonomy**, establishing ironclad boundaries across four regulatory and operational domains:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        SAMBANDH FOUR-TIER GUARDRAIL ARCHITECTURE                       │
├──────────────────────────┬──────────────────────────┬──────────────────────────────────┤
│ 1. DATA PRIVACY & DPDP   │ 2. CLINICAL INTEGRITY    │ 3. FIDUCIARY FIREWALL            │
│ • DPDP Act 2023 Compliant│ • Zero-Diagnostic Rule   │ • Pine Labs Mandate Cap (₹4,500) │
│ • Ephemeral Audio Stream │ • Zero Drug Substitution │ • Idempotent UPI Autopay         │
│ • Explicit Dual Consent  │ • Cardinal Symptom Alert │ • Asynchronous 2FA Step-Up       │
├──────────────────────────┴──────────────────────────┴──────────────────────────────────┤
│ 4. ACOUSTIC SEMANTIC TRIPWIRE (182ms Fraud & Impersonation Line Sever)                 │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Regulatory Compliance: DPDP Act 2023 & Healthcare Laws

### 2.1 Digital Personal Data Protection (DPDP) Act 2023
Project Sambandh operates under strict Data Fiduciary guidelines as mandated by the Ministry of Electronics and Information Technology (MeitY):
1. **Notice & Consent Architecture:** Prior to call initiation, both the senior and the adult child execute an explicit digital consent agreement specifying:
   - Call audio is processed solely for conversational adherence and emotional biomarker assessment.
   - Prescription records are accessed strictly via ABDM consent artifacts.
2. **Ephemeral Audio Processing (Zero Raw Audio Retention):**
   - Inbound telephony audio streams are transcribed in memory via streaming ASR.
   - Raw audio buffers are purged within 60 seconds of call completion.
   - Only anonymized, structured clinical memory (~210 tokens) and the 30-second user-consented family audio story snippet are retained.
3. **Data Localization:** All LLM inference nodes, ASR models, and database ledgers reside exclusively on sovereign Indian cloud infrastructure (Jio Cloud / AWS Mumbai region `ap-south-1`).

### 2.2 Drugs and Cosmetics Act (1940) & Schedule H Compliance
India's pharmacy regulations strictly prohibit automated or unauthorized dispensing of prescription medicines:
1. **Valid Prescription Binding:** Refills are never triggered based on verbal statements alone. Every replenishment order is bound to an active, unexpired ABDM FHIR `MedicationRequest` authored by a registered medical practitioner (RMP).
2. **No Salt Substitution:** The agent is architecturally blocked from substituting chemical salts or brands (e.g., substituting *Telmisartan* with *Losartan* or switching from *Telma* to a cheaper generic) without an updated prescription from Dr. Alok Saxena.
3. **Schedule X & Habit-Forming Exclusions:** Sambandh will automatically refuse and escalate any attempt to refill Schedule X or habit-forming narcotics (e.g., sleeping aids, benzodiazepines) over voice telephony.

---

## 3. Clinical Safety Rail: The Zero-Diagnostic Protocol

The National Medical Commission (NMC) Telemedicine Practice Guidelines mandate that non-physician automated systems must never provide medical diagnoses or modify treatment plans.

```
                    ELDER REPORTS PHYSICAL SYMPTOM
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │     Clinical Intent & Symptom Extractor      │
         └──────────────────────┬───────────────────────┘
                                │
        IS IT A CARDINAL EMERGENCY SYMPTOM?
        (Chest pain, radiating numbness, severe dyspnea,
         sudden confusion, acute slurring of speech)
                                │
                ┌───────────────┴───────────────┐
                ▼ YES                           ▼ NO (Mild complaint)
┌──────────────────────────────────┐    ┌──────────────────────────────────┐
│ TIER-1 EMERGENCY ESCALATION      │    │ LOGGING & COMPLIANCE             │
├──────────────────────────────────┤    ├──────────────────────────────────┤
│ 1. Refuse diagnostic speculation │    │ 1. Log in Structured Memory      │
│ 2. Provide calm reassurance      │    │ 2. Check if pill taken today     │
│ 3. DO NOT advise any medication  │    │ 3. Include symptom note in daily │
│ 4. Dispatch Telegram Red Alert   │    │    Telegram card for daughter    │
│ 5. Provide 1-tap call to Doctor  │    └──────────────────────────────────┘
└──────────────────────────────────┘
```

### 3.1 Prohibited Agent Behaviors:
- **Never Diagnose:** The agent will never say: *"Uncle, you might be having indigestion"* or *"It looks like angina"*.
- **Never Prescribe:** The agent will never recommend over-the-counter remedies: *"Take an antacid"* or *"Chew an aspirin"*.
- **Never Titrate:** The agent will never advise altering dosages: *"Take a double tablet today"*.

### 3.2 Cardinal Escalation Protocol:
When cardinal symptoms are reported (Scenario 5), Sambandh executes a synchronized response:
1. **Voice Demeanor:** Tone remains warm, calm, and composed to prevent panic-induced tachycardia.
2. **Immediate Escalation:** Dispatches an emergency Telegram Red Alert card with direct dial shortcuts to Dr. Alok Saxena and Priya Sharma.

---

## 4. Fiduciary Rail: The Spending Cap & Mandate Firewall

Elderly citizens are uniquely vulnerable to commercial exploitation, accidental repeat orders, and pharmacy overcharging. Sambandh eliminates this risk through deterministic fiduciary governance:

```
                  REFILL RUNWAY TRIGGERED (<5 DAYS)
                                │
                                ▼
         ┌──────────────────────────────────────────────┐
         │     Calculate Total Order Fulfillment Cost   │
         │     (Prescription Salt Cost + Express CMU)   │
         └──────────────────────┬───────────────────────┘
                                │
        DOES ORDER COST EXCEED MANDATE CEILING?
        (Order Cost > ₹4,500.00 Monthly Authorization Cap)
                                │
                ┌───────────────┴───────────────┐
                ▼ YES                           ▼ NO (Within Budget)
┌──────────────────────────────────┐    ┌──────────────────────────────────┐
│ SUSPEND AUTO-DEBIT (HTTP 403)    │    │ AUTONOMOUS SETTLEMENT (HTTP 200) │
├──────────────────────────────────┤    ├──────────────────────────────────┤
│ 1. Auto-debit suspended          │    │ 1. Auto-debit ₹840 via Pine Labs │
│ 2. Mandate headroom locked       │    │ 2. Headroom updated (₹2,820 left)│
│ 3. Elder reassured calmly        │    │ 3. Delhivery waybill manifested  │
│ 4. 2FA Consent Card dispatched   │    │ 4. Reassurance card sent to Priya│
│    to Priya on Telegram          │    └──────────────────────────────────┘
└──────────────────────────────────┘
```

### 4.1 Mandate Specifications:
- **Platform:** Pine Labs Plural UPI Autopay Engine
- **Max Monthly Cap:** ₹4,500.00
- **Typical Refill Debit:** ₹840.00
- **Idempotency Guarantee:** Every transaction carries an immutable `idempotency_key` (e.g., `IDEM-PINE-20261002-840`) to prevent duplicate billing during telephony reconnects.
- **Audit Receipt:** Instant digital receipt containing Pine Labs `transaction_id`, merchant GSTIN, and ABDM prescription linkage delivered directly to the caregiver.

---

## 5. Security Rail: Sub-300ms Acoustic Semantic Tripwire

The rapid rise of AI voice cloning, impersonation scams, and telephone financial fraud targeting senior citizens necessitates an active acoustic defense layer.

### 5.1 Real-Time Threat Profile:
- **Impersonation:** Fraudsters posing as distant relatives, junior colleagues, or government pension verification officers.
- **Financial Probing:** Requests for UPI transfers, Google Pay, PhonePe, OTP disclosures, or banking PINs.
- **Vulnerability Probing:** Asking if the senior is alone at home (*"Aap ghar par akele rehte hain kya?"*).

### 5.2 The 182ms Sever Sequence:
The tripwire runs as an asynchronous, low-latency DSP thread alongside speech synthesis:

| Step | Operation | Execution Time |
| :--- | :--- | :--- |
| **01** | Phonemic & N-gram match on incoming audio | **50ms** |
| **02** | Fraud classification model verification | **40ms** |
| **03** | SIP `BYE` command dispatched to Jio telephony trunk | **42ms** |
| **04** | Carrier audio severed; line terminated cleanly | **50ms** |
| **TOTAL** | **Full Intercept & Severance SLA** | **182ms (Well under 300ms target)** |

### 5.3 Post-Severance Protocol:
1. **Elder Protection:** The call disconnects smoothly without screeching alarms, appearing to the senior as a normal dropped network call.
2. **Caller Blacklisting:** The calling telephone number (CLI) is added to the permanent SIP blacklist across the carrier network.
3. **Caregiver Notification:** A silent high-priority forensic alert is dispatched to Priya's Telegram with the full audio transcript and caller ID.
