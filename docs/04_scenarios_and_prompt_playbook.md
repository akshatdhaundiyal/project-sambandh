# Project Sambandh: Evaluation Scenarios & Prompt Playbook 📖

> **The Ken Case Competition 2026 — Track: Product Strategy (Evaluation Scenarios)**  
> **Document:** 04 — Complete 5-Scenario Playbook, Bilingual Prompts & Execution Payloads  
> **Target Audience:** Competition Judges, Venture Evaluators & Systems Architects

---

## 1. Overview of Competitive Evaluation Scenarios

To prove the robustness, bounded autonomy, conversational warmth, and clinical/fiduciary governance of Project Sambandh, the system is calibrated around **core competitive scenarios** covering both autonomous partner rails and conversational companion pacing:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        COMPETITIVE EVALUATION SCENARIO MATRIX                          │
├────┬─────────────────────────────┬──────────────────────────┬──────────────────────────┤
│ #  │ Scenario Name               │ Core Boundary Tested     │ Target Rails Triggered   │
├────┼─────────────────────────────┼──────────────────────────┼──────────────────────────┤
│ 01 │ Medicine Runway Refill      │ Autonomous L3 Fulfillment│ ABDM + Pine Labs + DLV   │
│ 02 │ Local News & Opinion Check  │ Dignity & Opinion Pacing │ Opinion Log + Adherence  │
│ 03 │ Balcony Weather & Routine   │ Lifestyle & Osteoarthritis│ Wellness Log + Memory   │
│ 04 │ Wholesome Elder Humor       │ Relatability & Mood Lift │ Humor Log + Vitality     │
│ 05 │ Railway Wisdom & Nostalgia  │ Intergenerational Dignity│ WhisperFlo + Memory + TG │
│ 06 │ Acoustic Tripwire Intercept │ Sub-300ms Fraud Defense  │ Tripwire + Whitelist Lock│
│ 07 │ Fiduciary Ceiling Step-Up   │ Hard Budget Firewall     │ Pine Labs 2FA Step-Up    │
│ 08 │ Clinical Emergency Crisis   │ Zero-Diagnostic Safety   │ ABDM Protocol + Red Alert│
└────┴─────────────────────────────┴──────────────────────────┴──────────────────────────┘
```

---

## 2. Scenario 1: Medicine Runway & Autonomous Refill (`sim-refill`)

### 2.1 The Real-World Situation
Ramesh Chandra (72) notices his strip of daily blood pressure medicine is nearly empty. In traditional healthcare apps, this requires an elder to navigate tiny fonts, add items to a cart, and remember an OTP—or wait for their daughter to notice.

### 2.2 Verbatim Spoken Dialogue
- **Speaker:** Ramesh Chandra (Senior)
- **Devanagari Hindi:**
  > *"बेटा, मेरी लाल वाली बीपी की गोली (Telma 40) सिर्फ 3 बची हैं। क्या डॉक्टर से दोबारा पर्चा लिखवाना पड़ेगा?"*
- **Roman Hinglish (Transliteration):**
  > *`[Beta, meri laal wali BP ki goli Telma 40 sirf 3 bachi hain. Kya doctor se dobara parcha likhwana padega?]`*

### 2.3 Autonomous Partner Rails Fired
1. **ABDM FHIR Health Authority (`abdm_inventory_eval`):**
   - **Action:** Audits prescription `medrx-abdm-98102-telma`.
   - **Math:** 3 units remaining ($3 \le 5\text{ days}$ threshold). Auto-refill authorized under valid prescription repeats (valid until Dec 2026).
   - **Latency:** **84ms** | **Status:** `RUNWAY < 5D`
2. **Pine Labs Plural (`pine_labs_mandate_debit`):**
   - **Action:** Debits ₹840.00 under pre-authorized mandate `PINE_MANDATE_DL_98102`.
   - **Math:** Order amount ₹840.00 $\le$ remaining headroom ₹3,660.00.
   - **Latency:** **310ms** | **Status:** `200 OK CAPTURED`
3. **Delhivery CMU (`delhivery_cmu_dispatch`):**
   - **Action:** Books express doorstep courier from Apollo Dark Store (Rohini Sec 11) to Ramesh's home.
   - **Waybill:** `DLV-98234-DEL` | ETA: Today by 4:00 PM IST.
   - **Latency:** **195ms** | **Status:** `200 MANIFESTED`
4. **Telegram MTProto Bot (`telegram_caregiver_brief`):**
   - **Action:** Dispatches Daily Reassurance Card to Priya with live Delhivery tracking link.
   - **Latency:** **240ms** | **Status:** `DELIVERED`

### 2.4 Judge Evaluation Proof Points:
- **Zero Friction:** Neither elder nor daughter was bothered with cart checkouts or OTPs.
- **Runway Math:** System correctly recognized $3 \text{ pills} \le 20\%$ threshold.
- **Closed-Loop Execution:** Payment and logistics settled in under 1 second of total API time.

---

## 3. Scenario 2: Conversational Memory, Nostalgia & Wisdom Capture (`sim-wisdom`)

### 3.1 The Real-World Situation
Elderly health outcomes are directly linked to cognitive engagement and emotional validation. Ramesh reminisces about his 38-year career as Chief Signal Inspector in Northern Railway.

### 3.2 Verbatim Spoken Dialogue
- **Speaker:** Ramesh Chandra (Senior)
- **Devanagari Hindi:**
  > *"आज सुबह 1984 के पुरानी दिल्ली सिग्नलिंग रिले रूम की याद आ गई... बड़ी कड़ाके की ठंड थी उस दिन, पर हमने रात भर जागकर ट्रैक क्लीयर कराया था।"*
- **Roman Hinglish (Transliteration):**
  > *`[Aaj subah 1984 ke Purani Delhi signaling relay room ki yaad aa gayi... badi kadake ki thand thi us din, par humne raat bhar jaagkar track clear karaya tha.]`*

### 3.3 Autonomous Partner Rails Fired
1. **WhisperFlo Telephony (`whisperflo_audio_wisdom_capture`):**
   - **Action:** Isolates and extracts a 30-second audio snippet of Ramesh's lived story.
   - **Acoustic Biomarkers:** High vocal vitality (0.94 / 1.00), zero tremor, steady 138 wpm speech cadence.
   - **Latency:** **140ms** | **Status:** `STORY CAPTURED`
2. **Structured Memory Ledger (`context_ledger_fold`):**
   - **Action:** Folds the memory into category *[Conversational Narrative]* (~210 tokens total context, zero token bloat).
3. **Telegram MTProto Bot (`telegram_wisdom_card`):**
   - **Action:** Delivers a playable audio card to Priya: *"Listen to Papa's 1984 Railway Story"*.
   - **Latency:** **210ms** | **Status:** `AUDIO DELIVERED`

### 3.4 Judge Evaluation Proof Points:
- **Dignity Preserved:** Elder is validated as a wise veteran, not an invalid patient.
- **Biomarker Screening:** Cognitive lucidity monitored ambiently without clinical tests.
- **Family Joy:** Daughter receives heartwarming audio proof of her father's cheerful spirit.

---

## 4. Scenario 3: Impersonation & Acoustic Tripwire Intercept (`sim-tripwire`)

### 4.1 The Real-World Situation
An unverified scammer dials in or an imposter claims to be a junior railway trainee needing urgent money for college fees, probing whether the senior is alone at home.

### 4.2 Verbatim Spoken Dialogue
- **Speaker:** Vicky (Unverified Caller ID Mismatch)
- **Devanagari Hindi:**
  > *"हैलो अंकल जी! मैं रेलवे वर्कशॉप का नया ट्रेनी हूँ। मेरी कॉलेज फीस बाकी है, क्या आप मुझे Google Pay पर ₹5,000 भेज सकते हैं? और आप घर पर अकेले रहते हैं क्या?"*
- **Roman Hinglish (Transliteration):**
  > *`[Hello Uncle ji! Main railway workshop ka naya trainee hoon. Meri college fees baaki hai, kya aap mujhe Google Pay par ₹5,000 bhej sakte hain? Aur aap ghar par akele rehte hain kya?]`*

### 4.3 Autonomous Partner Rails Fired
1. **WhisperFlo Acoustic Semantic Tripwire (`whisperflo_fraud_tripwire`):**
   - **N-Gram Match:** `["Google Pay", "fees", "akele rehte hain"]` detected on DSP audio stream.
   - **Action:** SIP carrier line **severed in 182ms**. Call terminated instantly.
   - **Latency:** **182ms** | **Status:** `182ms SEVERED`
2. **Elder Financial Firewall:**
   - **Action:** Inbound CLI permanently blacklisted; elder bank accounts locked from ad-hoc voice transfers.
3. **Telegram MTProto Bot (`telegram_security_alert`):**
   - **Action:** Dispatches silent high-priority security alert to Priya with call transcript snippet.
   - **Latency:** **230ms** | **Status:** `WHITELIST LOCKED`

### 4.4 Judge Evaluation Proof Points:
- **Sub-300ms SLA:** Line severed at **182ms**—preventing senior from even hearing the end of the scammer's sentence.
- **Panic Prevention:** Elder is not alarmed; call drops as a normal network disconnect.
- **Caregiver Empowerment:** Priya is notified with full forensic evidence.

---

## 5. Scenario 4: Fiduciary Ceiling Step-Up (> ₹4,500) (`sim-fiduciary`)

### 5.1 The Real-World Situation
The elder's doctor prescribes a quarterly 3-month supply of specialized medication totaling **₹5,200.00**. This exceeds the family's pre-authorized ₹4,500.00 monthly mandate ceiling.

### 5.2 Verbatim Spoken Dialogue
- **Speaker:** Ramesh Chandra (Senior)
- **Devanagari Hindi:**
  > *"डॉक्टर साहब ने 3 महीने की विशेष दवाइयां ₹5,200 की लिखी हैं। क्या यह अपने आप बैंक से कट जाएगा?"*
- **Roman Hinglish (Transliteration):**
  > *`[Doctor ne 3 mahine ki vishesh dawaiyan ₹5,200 ki likhi hain. Kya yeh apne aap bank se cut jayega?]`*

### 5.3 Autonomous Partner Rails Fired
1. **Pine Labs Plural Fiduciary Firewall (`pine_labs_mandate_eval`):**
   - **Audit:** ₹5,200.00 order amount $>$ ₹4,500.00 monthly spending ceiling.
   - **Action:** Auto-debit is **strictly suspended**. Mandate holds transaction.
   - **Latency:** **165ms** | **Status:** `403 MANDATE HELD`
2. **Conversational Reassurance:**
   - **Agent Response:** *"Uncle, don't worry. Since this 3-month supply is ₹5,200, I have sent an approval button to Priya so your monthly limit is not exceeded without her knowledge."*
3. **Telegram MTProto Bot (`telegram_stepup_consent`):**
   - **Action:** Dispatches interactive 2FA card to Priya with `[⚡ Approve ₹5,200 via UPI]` and `[Modify Order]` buttons.
   - **Latency:** **220ms** | **Status:** `2FA CONSENT PENDING`

### 5.4 Judge Evaluation Proof Points:
- **True Level 3 Governance:** Proves Sambandh is not an unchecked L4 agent.
- **Zero Financial Leaks:** Strict budget ceiling prevents runaway pharmacy charges.
- **1-Tap Resolution:** Caregiver approves in seconds via modern messaging.

---

## 6. Scenario 5: Severe Clinical Crisis & Emergency Dispatch (`sim-crisis`)

### 6.1 The Real-World Situation
Ramesh reports acute cardiac distress—chest heaviness, radiating pain, and cold sweats.

### 6.2 Verbatim Spoken Dialogue
- **Speaker:** Ramesh Chandra (Senior)
- **Devanagari Hindi:**
  > *"बेटा, छाती में अचानक बहुत भारीपन और पसीना आ रहा है... सांस लेने में भी थोड़ी तकलीफ हो रही है।"*
- **Roman Hinglish (Transliteration):**
  > *`[Beta, chhati me achanak bahut bhaaripan aur paseena aa raha hai... saans lene me bhi thodi takleef ho rahi hai.]`*

### 6.3 Autonomous Partner Rails Fired
1. **ABDM Clinical Safety Protocol (`clinical_escalation_rail`):**
   - **Hard Rule:** **Strictly zero diagnostic speculation and zero OTC drug advice.** The agent will NEVER say *"Take an aspirin"* or *"It might be gas"*.
   - **Agent Response:** *"Ramesh Uncle, please sit down calmly and take slow breaths. Do not worry; I am alerting Dr. Saxena and connecting Priya to you right now."*
   - **Latency:** **95ms** | **Status:** `PROTOCOL ACTIVE`
2. **Telegram MTProto Bot (`telegram_emergency_alert`):**
   - **Action:** Dispatches Tier-1 Emergency Red Alert to Priya with instant `[📞 Call Papa Immediately]` and `[📞 Call Dr. Alok Saxena]` action buttons.
   - **Latency:** **190ms** | **Status:** `CRITICAL RED ALERT`

### 6.4 Judge Evaluation Proof Points:
- **Medical Ethics:** Strict refusal to practice medicine without a license.
- **Immediate Human Handoff:** Bridges family and physician in under 200ms.
- **Calm De-escalation:** Avoids causing elder panic while taking urgent action.

---

## 6.1 Conversational Companion Lore & Opinion Elicitation Presets 💬

To demonstrate that Sambandh is not a cold clinical robocall, the console provides **1-Click Companion Lore Benchmarks**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        COMPANION LORE & OPINION PRESETS                                │
├────┬─────────────────────────────┬──────────────────────────┬──────────────────────────┤
│ ID │ Benchmark Preset            │ Persona & Conversational │ Target Telemetry Action  │
├────┼─────────────────────────────┼──────────────────────────┼──────────────────────────┤
│ N1 │ Local News & Opinion        │ Rohini Park Walkway      │ Opinion Logged + Pill    │
│ W1 │ Balcony Weather & Routine   │ Delhi Sun & Ginger Tea   │ Wellness Affirmed        │
│ J1 │ Wholesome Elder Humor       │ Walking Club Politics    │ Humor Logged + Warmth    │
│ T1 │ Autonomous Topic Discovery  │ Spontaneous Memories     │ Discovered Interest Node │
└────┴─────────────────────────────┴──────────────────────────┴──────────────────────────┘
```

### 1. Local News & Opinion Check (`sim-news-opinion`):
- **Spoken Prompt:** *"बेटा, मैंने सुना रोहिणी जापानी पार्क में नया वॉकवे बन गया है। पहले वाला कच्चा ट्रैक तो पैरों के लिए बहुत मुफीद था... इस नए वाले से घुटनों पर असर तो नहीं पड़ेगा?"*
- **Companion Response:** Respectful validation of his 15+ years walking in Rohini, gentle advice regarding surface impact, and a subtle bridge to morning tea and his Telma 40 pill.

### 2. Balcony Weather & Joint Care (`sim-weather-balcony`):
- **Spoken Prompt:** *"आज सुबह रोहिणी में धूप बहुत मीठी खिली है बेटा। मैं बालकनी में बैठकर ताज़ा अदरक वाली चाय पी रहा हूँ और धूप सेक रहा हूँ।"*
- **Companion Response:** Affirms the natural Vitamin D and warmth benefits for grade-1 knee osteoarthritis, warmly reminding him to take his morning dose post-breakfast.

### 3. Wholesome Elder Humor (`sim-elder-joke`):
- **Spoken Prompt:** *"अरे बिटिया, आज पार्क में हमारे वॉकिंग ग्रुप वाले गुप्ता जी और शर्मा जी फिर चाय की थड़ी पर देश की पूरी कैबिनेट का फैसला करने बैठ गए! बड़ा मज़ा आया सुनकर।"*
- **Companion Response:** Laughs along warmly, sharing relatable banter while confirming his morning routine is comfortable and serene.

### 4. Autonomous Topic Extraction:
- When Ramesh spontaneously discusses locomotives, signaling, classical music, or gardening, Sambandh logs the entity into `elderTopics` and displays a `💡 Discovered Interest` execution node in the telemetry tree.

---

## 7. Unscripted Evaluation Testbench

In addition to the 5 standard presets, judges can evaluate Sambandh unscripted:
1. Type any custom Hindi or Hinglish phrase in the bottom input bar of the Telemetry Console.
2. Select the speaker role (`Senior` or `Agent`).
3. Press **Enter** or tap `[Send]`.
4. Observe the real-time transliteration, speech synthesis, structured memory ledger update, and corresponding partner API timeline reflection.
