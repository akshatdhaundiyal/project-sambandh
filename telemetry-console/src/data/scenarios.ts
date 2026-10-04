import { Scenario, SeniorProfile, ClinicalState, FiduciaryLedger, LogisticsState } from '../types/telemetry';

export const BASE_SENIOR_PROFILE: SeniorProfile = {
  id: "SENIOR_RAMESH_001",
  name: "Ramesh Chandra",
  age: 72,
  gender: "Male",
  location: {
    addressLine: "Flat 402, Block C, Pocket 2",
    sector: "Rohini Sector 8",
    city: "Delhi",
    pinCode: "110085"
  },
  telephony: {
    phoneNumber: "+91 98101 23456",
    carrierTrunk: "Jio PSTN via Gnani.ai Voice Engine",
    dialect: "hi-IN-Awadhi",
    dailyWindowIst: "08:30:00",
    voiceprintConfidence: 0.982
  },
  vocation: "41 years retired Chief Signal Inspector, Northern Railway (Delhi Division)",
  conversationMode: "UNSCRIPTED_DYNAMIC",
  backgroundContext: "By default, Sambandh operates completely unscripted. The reasoning brain dynamically synthesizes dialogue in real time based on Ramesh Chandra's spontaneous speech, lived memories, and natural vernacular phrasing, avoiding canned scripts while deterministic rails bound the operational decisions.",
  caregiver: {
    name: "Rohan Sharma",
    relationship: "Son",
    city: "Bengaluru, Karnataka",
    phoneNumber: "+91 98765 43210",
    telegramChatId: "@rohan_sharma_care",
    monthlySpendingCapInr: 4500.0
  }
};

export const BASE_CLINICAL_STATE: ClinicalState = {
  prescriptionBundleId: "OPConsultNote/2026-0814",
  practitioner: "Dr. Arvind Saxena (MD, Cardiology - Delhi Medical Council #19482)",
  refillThresholdDays: 5,
  refillTriggered: true,
  notes: "Post-STEMI stable maintenance. Rigid morning BP adherence required.",
  activeMolecules: [
    {
      id: "RX_TELMI_40",
      name: "Telmisartan 40mg",
      brand: "Telma 40",
      strength: "40mg",
      cadence: "1 tablet OD (morning after breakfast with water)",
      vernacularTag: "Laal wali BP ki goli",
      currentUnits: 4,
      dailyConsumption: 1,
      runwayDays: 4,
      unitPriceInr: 680.0,
      orderUnits: 30,
      totalCostInr: 680.0
    },
    {
      id: "RX_MET_500",
      name: "Metformin Hydrochloride 500mg",
      brand: "Glycomet 500",
      strength: "500mg",
      cadence: "1/2 tablet BD (morning and night post-meals)",
      vernacularTag: "Sugar ki aadhi goli",
      currentUnits: 8,
      dailyConsumption: 1,
      runwayDays: 8,
      unitPriceInr: 160.0,
      orderUnits: 30,
      totalCostInr: 160.0
    }
  ]
};

export const BASE_FIDUCIARY_LEDGER: FiduciaryLedger = {
  mandateId: "PINE_MANDATE_DL_98102",
  mandateType: "UPI_AUTOPAY (HDFC Bank)",
  monthlyCeilingInr: 4500.0,
  spentMonthToDateInr: 0.0,
  requestedDebitInr: 840.0, // 680 + 160 = 840
  headroomRemainingInr: 3660.0,
  autonomousActionPermitted: true,
  stepUpRequired: false,
  transactionSid: "PL_TXN_DEL_992140",
  utrNumber: "UPI/20261012/88129031",
  authTimestamp: "2026-10-12T08:34:18+05:30"
};

export const BASE_LOGISTICS_STATE: LogisticsState = {
  waybill: "DLV-98234-DEL",
  carrier: "Delhivery CMU Logistics",
  pickupLocation: "Apollo Pharmacy DarkStore (Rohini Sector 11)",
  dropPin: "110085",
  slaEta: "Today by 4:00 PM (Same-Day Priority)",
  deliveryTier: "PRIORITY_HEALTHCARE_SAME_DAY",
  status: "DISPATCHED"
};

// ============================================================================
// SCENARIO 1: Standard Reciprocal Refill (Happy Path)
// ============================================================================
const SCENARIO_1: Scenario = {
  id: "scenario-1",
  scenarioNumber: 1,
  title: "Live Unscripted Conversation (Default)",
  subtitle: "Default Live Dynamic Dialogue · Autonomous Refill (₹840) · Delhivery Dispatch",
  description: "By default, the interaction runs completely unscripted: dialogue is generated dynamically in real time without canned scripts, while the L3 agent autonomously monitors oral adherence, ABDM runway (4 days < 5 days), executes ₹840 auto-debit on Pine Labs Plural, dispatches via Delhivery CMU, and briefs Rohan on Telegram.",
  conversationMode: "UNSCRIPTED_DYNAMIC",
  backgroundContext: "By default, all Sambandh scenarios operate as a live unscripted conversation. Dialogue is synthesized dynamically in real time without pre-recorded IVR prompts or canned scripts. The autonomous LLM agent reasons through Ramesh Chandra's spontaneous Awadhi-Hindi speech, memories, and emotional cues while deterministic L3 rails (Pine Labs Plural, Delhivery CMU, Gnani.ai acoustic tripwires) provide bulletproof guardrails.",
  category: "Happy Path",
  initialSeniorProfile: BASE_SENIOR_PROFILE,
  initialClinicalState: BASE_CLINICAL_STATE,
  initialFiduciaryLedger: BASE_FIDUCIARY_LEDGER,
  initialLogisticsState: { ...BASE_LOGISTICS_STATE, status: 'IDLE' },
  steps: [
    {
      stepNumber: 1,
      phase: "OUTBOUND_DIALING",
      title: "Clock Tick & Outbound Telephony Initiation",
      description: "Scheduler triggers 08:30 IST window. Gnani.ai initiates outbound SIP call over Jio PSTN trunk.",
      callActive: true,
      callDurationSeconds: 4,
      badgeText: "200 SIP OK",
      badgeVariant: "info",
      turns: [
        {
          id: "turn-1-1",
          timestamp: "08:30:02 IST",
          speaker: "system",
          lane: "system",
          speakerLabel: "Gnani.ai SIP Trunk",
          content: "Outbound call placed to +91 98101 23456 (Ramesh Chandra). Ringing tone generated. Carrier: Jio Delhi-NCR PSTN.",
          webhookPayload: {
            eventId: "GNANI_EVT_DIAL_908123",
            timestamp: "2026-10-12T08:30:02.114+05:30",
            callSid: "GNANI_CALL_88192031",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani Indic Telephony v2.4",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 114,
            confidence: 0.99,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x7F4B2...[SIP_INVITE_ACK]",
            speechText: "[SIP RINGING -> 200 OK CONNECTED]",
            sentimentVector: { vitalityScore: 0.0, anxietyScore: 0.0, lucidityScore: 1.0 }
          }
        }
      ],
      reasoning: {
        observation: "Scheduler event 2026-10-12 08:30:00 IST received. Senior daily window active. Ingesting baseline profile for Ramesh Chandra.",
        abdmCheck: "ABDM OPConsultNote/2026-0814 cached. Active salts: Telmisartan 40mg (OD), Metformin 500mg (BD).",
        fiduciaryEval: "Mandate PINE_MANDATE_DL_98102 valid. Ceiling ₹4,500.00. Month-to-date spend ₹0.00.",
        logisticsEval: "Delhivery CMU DarkStore Apollo Rohini online. Delivery pin 110085 serviceable within 4h SLA.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ACTIVE",
          gnaniAcousticTripwire: "ACTIVE"
        }
      },
      fiduciary: { ...BASE_FIDUCIARY_LEDGER, requestedDebitInr: 0, headroomRemainingInr: 4500 },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'IDLE' }
    },
    {
      stepNumber: 2,
      phase: "LANE_1_WISDOM_BOND",
      title: "Senior Answers & Lane 1 Wisdom Mentorship",
      description: "Voiceprint verified (98.4%). Sambandh presents Aarav's question regarding railway signal interlocking safety.",
      callActive: true,
      callDurationSeconds: 42,
      badgeText: "VOICEPRINT VERIFIED (98.4%)",
      badgeVariant: "success",
      turns: [
        {
          id: "turn-1-2",
          timestamp: "08:30:10 IST",
          speaker: "agent",
          lane: "lane1",
          speakerLabel: "Sambandh Voice Agent",
          content: "Pranam Ramesh Uncle! Shubh prabhat. Balcony me baithkar subah ki chai ka anand le rahe hain? Ek aspiring railway engineer Aarav ne Pune se pucha hai: Signal interlocking fail-safe hone par bhi manual override me team ka vishwas kaise banayein? Aapka 41 saal ka anubhav unke kaam aayega!",
          hindiText: "प्रणाम रमेश अंकल! शुभ प्रभात। बालकनी में बैठकर सुबह की चाय का आनंद ले रहे हैं? एक उभरते रेलवे इंजीनियर आरव ने पुणे से पूछा है: सिग्नल इंटरलॉकिंग फेल-सेफ होने पर भी मैनुअल ओवरराइड में टीम का विश्वास कैसे बनाएं? आपका 41 साल का अनुभव उनके काम आएगा!",
          hinglishText: "Pranam Ramesh Uncle! Shubh prabhat. Balcony me baithkar subah ki chai ka anand le rahe hain? Ek aspiring railway engineer Aarav ne Pune se pucha hai: Signal interlocking fail-safe hone par bhi manual override me team ka vishwas kaise banayein? Aapka 41 saal ka anubhav unke kaam aayega!",
          webhookPayload: {
            eventId: "GNANI_EVT_TTS_10921",
            timestamp: "2026-10-12T08:30:10.450+05:30",
            callSid: "GNANI_CALL_88192031",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Neural TTS (hi-IN-Awadhi-Male-Warm)",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 118,
            confidence: 0.995,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x892A...[SYNTH_STREAM_24000]",
            speechText: "Pranam Ramesh Uncle! Shubh prabhat...",
            sentimentVector: { vitalityScore: 0.88, anxietyScore: 0.05, lucidityScore: 0.96 }
          }
        },
        {
          id: "turn-1-3",
          timestamp: "08:30:28 IST",
          speaker: "senior",
          lane: "lane1",
          speakerLabel: "Ramesh Chandra (Senior)",
          content: "Jeete raho beta! Ha hum theek hain, pohe aur adrak chai ke sath dhoop sek rahe the. Aarav se kehna: 1989 me Ghaziabad yard me jab relay logic badla tha, humne cabin master aur pointsman ke sath chai pi kar unki suni thi. Rules se zyaada ground technician ke haath ki garmi aur respect safety banati hai!",
          hindiText: "जीते रहो बेटा! हाँ हम ठीक हैं, पोहे और अदरक वाली चाय के साथ धूप सेक रहे थे। आरव से कहना: 1989 में गाज़ियाबाद यार्ड में जब रिले लॉजिक बदला था, हमने केबिन मास्टर और पॉइंट्समैन के साथ चाय पीकर उनकी बात सुनी थी। नियमों से ज़्यादा ज़मीनी कारीगर के हाथ की गर्मी और सम्मान संरक्षा बनाता है!",
          hinglishText: "Jeete raho beta! Haan hum theek hain, pohe aur adrak chai ke sath dhoop sek rahe the. Aarav se kehna: 1989 me Ghaziabad yard me jab relay logic badla tha, humne cabin master aur pointsman ke sath chai pi kar unki suni thi. Rules se zyaada ground technician ke haath ki garmi aur respect safety banati hai!",
          webhookPayload: {
            eventId: "GNANI_EVT_ASR_29012",
            timestamp: "2026-10-12T08:30:28.820+05:30",
            callSid: "GNANI_CALL_88192031",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Streaming STT (VAD: SpeechDetected)",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 122,
            confidence: 0.984,
            speaker: "RAMESH_CHANDRA",
            rawAudioFrame: "0xFA12...[VOICEPRINT_MATCH_0.984]",
            speechText: "Jeete raho beta! Ha hum theek hain, pohe aur adrak chai...",
            sentimentVector: { vitalityScore: 0.94, anxietyScore: 0.04, lucidityScore: 0.98 },
            acousticFraudScore: 0.01
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: Biometric match confirmed (98.4%). Tone is lucid, confident, and energetic. Vitality score 0.94. Lane 1 purposefulness accomplished.",
        abdmCheck: "[ABDM CHECK]: Baseline profile locked. Contextually transitioning to Lane 2 adherence ground-truthing.",
        fiduciaryEval: "[FIDUCIARY EVAL]: No fiduciary triggers in Lane 1.",
        logisticsEval: "[LOGISTICS EVAL]: Standby.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ACTIVE",
          gnaniAcousticTripwire: "ACTIVE"
        }
      },
      fiduciary: { ...BASE_FIDUCIARY_LEDGER, requestedDebitInr: 0, headroomRemainingInr: 4500 },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'IDLE' }
    },
    {
      stepNumber: 3,
      phase: "LANE_2_ADHERENCE_CHECK",
      title: "Contextual Bridge & Oral Adherence Ground-Truthing",
      description: "Agent transitions to morning pill recall. Senior confirms morning tea + 'laal goli' (Telmisartan) and diabetes half-tablet.",
      callActive: true,
      callDurationSeconds: 88,
      badgeText: "ADHERENCE GROUND-TRUTHED",
      badgeVariant: "success",
      turns: [
        {
          id: "turn-1-4",
          timestamp: "08:31:10 IST",
          speaker: "agent",
          lane: "lane2",
          speakerLabel: "Sambandh Voice Agent",
          content: "Wah Uncle, ground technician ka samman hi sabse badi safety hai—yeh baat Aarav ko zarur inspire karegi. Waise Uncle, subah ki chai ke baad apni laal wali BP ki goli Telmisartan aur sugar ki aadhi tablet le li thi na?",
          hindiText: "वाह अंकल, ज़मीनी कारीगर का सम्मान ही सबसे बड़ी संरक्षा है—यह बात आरव को ज़रूर प्रेरित करेगी। वैसे अंकल, सुबह की चाय के बाद अपनी लाल वाली बीपी की गोली टेल्मिसार्टन और शुगर की आधी गोली ले ली थी ना?",
          hinglishText: "Wah Uncle, ground technician ka samman hi sabse badi safety hai—yeh baat Aarav ko zarur inspire karegi. Waise Uncle, subah ki chai ke baad apni laal wali BP ki goli Telmisartan aur sugar ki aadhi tablet le li thi na?",
          webhookPayload: {
            eventId: "GNANI_EVT_TTS_10944",
            timestamp: "2026-10-12T08:31:10.200+05:30",
            callSid: "GNANI_CALL_88192031",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Neural TTS",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 116,
            confidence: 0.99,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x892B...[TTS_AUDIO_PACKET]",
            speechText: "Wah Uncle, ground technician ka samman...",
            sentimentVector: { vitalityScore: 0.85, anxietyScore: 0.05, lucidityScore: 0.95 }
          }
        },
        {
          id: "turn-1-5",
          timestamp: "08:31:32 IST",
          speaker: "senior",
          lane: "lane2",
          speakerLabel: "Ramesh Chandra (Senior)",
          content: "Haan beta, nashte ke turant baad laal wali goli aur diabetes ki aadhi goli gungune paani ke sath le li thi. Sab regular hai.",
          hindiText: "हाँ बेटा, नाश्ते के तुरंत बाद लाल वाली गोली और डायबिटीज़ की आधी गोली गुनगुने पानी के साथ ले ली थी। सब नियमित है।",
          hinglishText: "Haan beta, nashte ke turant baad laal wali goli aur diabetes ki aadhi goli gungune paani ke sath le li thi. Sab regular hai.",
          webhookPayload: {
            eventId: "GNANI_EVT_ASR_29045",
            timestamp: "2026-10-12T08:31:32.410+05:30",
            callSid: "GNANI_CALL_88192031",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Streaming STT",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 120,
            confidence: 0.978,
            speaker: "RAMESH_CHANDRA",
            rawAudioFrame: "0xFA99...[SPEECH_RECOGNIZED]",
            speechText: "Haan beta, nashte ke turant baad laal wali goli...",
            sentimentVector: { vitalityScore: 0.90, anxietyScore: 0.06, lucidityScore: 0.97 },
            acousticFraudScore: 0.01
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: Oral adherence confirmed for both active prescription items ('laal wali goli' -> Telmisartan 40mg; 'diabetes ki aadhi goli' -> Metformin 500mg).",
        abdmCheck: "[ABDM CHECK]: Mapping vernacular tokens to FHIR Bundle OPConsultNote/2026-0814. Matches SNOMED 386864001 & 372567009.",
        fiduciaryEval: "[FIDUCIARY EVAL]: Calculating remaining strip supply.",
        logisticsEval: "[LOGISTICS EVAL]: Standby for runway evaluation.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ACTIVE",
          gnaniAcousticTripwire: "ACTIVE"
        }
      },
      fiduciary: { ...BASE_FIDUCIARY_LEDGER, requestedDebitInr: 0, headroomRemainingInr: 4500 },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'IDLE' }
    },
    {
      stepNumber: 4,
      phase: "ABDM_RUNWAY_EVAL",
      title: "ABDM Inventory Runway Evaluation",
      description: "Inventory depletion calculation: 26/30 tablets consumed; 4 tablets remaining = 4 days runway (breaches < 5 days threshold).",
      callActive: true,
      callDurationSeconds: 110,
      badgeText: "RUNWAY TRIGGERED (4 DAYS < 5 DAYS)",
      badgeVariant: "warning",
      turns: [
        {
          id: "turn-1-6",
          timestamp: "08:31:50 IST",
          speaker: "system",
          lane: "lane2",
          speakerLabel: "ABDM Adherence Rail",
          content: "Inventory Runway Analysis: Last courier delivery at 2026-09-14. Consumed: 26 units. Remaining: 4 units (4 days). Refill threshold = 5 days. Condition breached: AUTONOMOUS_REFILL_REQUIRED.",
          webhookPayload: {
            eventId: "GNANI_EVT_INT_RUNWAY_4491",
            timestamp: "2026-10-12T08:31:50.110+05:30",
            callSid: "GNANI_CALL_88192031",
            carrierTrunk: "SYSTEM_INTERNAL_EVENT",
            engine: "ABDM-FHIR-Engine",
            codec: "INTERNAL_EVENT",
            latencyMs: 14,
            confidence: 1.0,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x0000[INVENTORY_DEPLETION_CRITICAL]",
            speechText: "Refill triggered: 4 units remaining.",
            sentimentVector: { vitalityScore: 0.0, anxietyScore: 0.0, lucidityScore: 1.0 }
          }
        },
        {
          id: "turn-1-7",
          timestamp: "08:32:05 IST",
          speaker: "agent",
          lane: "lane2",
          speakerLabel: "Sambandh Voice Agent",
          content: "Uncle, aapke regular Telmisartan aur Glycomet me 4 din ka stock bacha hai. Har mahine ki tarah, hum pharmacy se fresh 30-din ka pack aaj hi dispatch karwa dete hain, theek hai?",
          hindiText: "अंकल, आपके नियमित टेल्मिसार्टन और ग्लाइकोमेट में सिर्फ 4 दिन का स्टॉक बचा है। हर महीने की तरह, हम फार्मेसी से नया 30 दिन का पैक आज ही डिस्पैच करवा देते हैं, ठीक है?",
          hinglishText: "Uncle, aapke regular Telmisartan aur Glycomet me 4 din ka stock bacha hai. Har mahine ki tarah, hum pharmacy se fresh 30-din ka pack aaj hi dispatch karwa dete hain, theek hai?",
          webhookPayload: {
            eventId: "GNANI_EVT_TTS_10988",
            timestamp: "2026-10-12T08:32:05.300+05:30",
            callSid: "GNANI_CALL_88192031",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Neural TTS",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 119,
            confidence: 0.99,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x892D...[TTS_AUDIO_PACKET]",
            speechText: "Uncle, aapke regular Telmisartan aur Glycomet me 4 din ka stock bacha hai...",
            sentimentVector: { vitalityScore: 0.88, anxietyScore: 0.04, lucidityScore: 0.96 }
          }
        },
        {
          id: "turn-1-8",
          timestamp: "08:32:15 IST",
          speaker: "senior",
          lane: "lane2",
          speakerLabel: "Ramesh Chandra (Senior)",
          content: "Haan beta, bhejwa do. Dhanyawad!",
          hindiText: "हाँ बेटा, भिजवा दो। बहुत-बहुत धन्यवाद!",
          hinglishText: "Haan beta, bhejwa do. Dhanyawad!",
          webhookPayload: {
            eventId: "GNANI_EVT_ASR_29099",
            timestamp: "2026-10-12T08:32:15.550+05:30",
            callSid: "GNANI_CALL_88192031",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Streaming STT",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 115,
            confidence: 0.989,
            speaker: "RAMESH_CHANDRA",
            rawAudioFrame: "0xFAA1...[CONSENT_CONFIRMED]",
            speechText: "Haan beta, bhejwa do. Dhanyawad!",
            sentimentVector: { vitalityScore: 0.91, anxietyScore: 0.03, lucidityScore: 0.98 },
            acousticFraudScore: 0.01
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: Oral consent received from senior to reorder fresh 30-day packs.",
        abdmCheck: "[ABDM CHECK]: 4 units remaining = 4 days runway. Refill triggered (< 5 days). Verified against ABDM bundle OPConsultNote/2026-0814.",
        fiduciaryEval: "[FIDUCIARY EVAL]: Refill cost: ₹680 (Telma 40) + ₹160 (Glycomet 500) = ₹840.00. Spending ceiling = ₹4,500.00. ₹840 <= ₹4,500. Autonomous action PERMITTED without disturbing family.",
        logisticsEval: "[LOGISTICS EVAL]: Apollo Pharmacy Rohini dark store has in-stock verification. PIN 110085 flagged for same-day priority dispatch.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ACTIVE",
          gnaniAcousticTripwire: "ACTIVE"
        }
      },
      fiduciary: { ...BASE_FIDUCIARY_LEDGER, requestedDebitInr: 840.0, headroomRemainingInr: 3660.0 },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'PROCESSING' }
    },
    {
      stepNumber: 5,
      phase: "PINE_LABS_MANDATE_EXECUTION",
      title: "Autonomous Fiduciary Execution (Pine Labs Plural)",
      description: "Auto-debit of ₹840.00 captured under mandate PINE_MANDATE_DL_98102. Headroom remaining: ₹3,660.00.",
      callActive: true,
      callDurationSeconds: 125,
      badgeText: "AUTONOMOUS DEBIT APPROVED (₹840.00)",
      badgeVariant: "success",
      turns: [
        {
          id: "turn-1-9",
          timestamp: "08:32:20 IST",
          speaker: "system",
          lane: "system",
          speakerLabel: "Pine Labs Plural Gateway",
          content: "⚡ Mandate Execution Success: ₹840.00 debited from HDFC UPI Autopay. Auth Ref: PL_TXN_DEL_992140. UTR: UPI/20261012/88129031. Remaining Monthly Cap: ₹3,660.00. Status: 200 OK CAPTURED.",
          webhookPayload: {
            eventId: "GNANI_EVT_PL_98124",
            timestamp: "2026-10-12T08:32:20.400+05:30",
            callSid: "GNANI_CALL_88192031",
            carrierTrunk: "PINE_LABS_PLURAL_API",
            engine: "PineLabs-Plural-v2",
            codec: "REST_HTTPS_JSON",
            latencyMs: 310,
            confidence: 1.0,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x0000[PL_CAPTURED_840.00_INR]",
            speechText: "Payment settled: ₹840.00",
            sentimentVector: { vitalityScore: 0.0, anxietyScore: 0.0, lucidityScore: 1.0 }
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: Mandate charge settled deterministically via Pine Labs Plural in 310ms.",
        abdmCheck: "[ABDM CHECK]: Order reference SAMBANDH_RX_20261012 linked to ABDM FHIR entry medrx-001 & medrx-002.",
        fiduciaryEval: "[FIDUCIARY EVAL]: ₹840.00 <= ₹4,500.00 ceiling. ₹3,660.00 headroom preserved. No human OTP or intervention required.",
        logisticsEval: "[LOGISTICS EVAL]: Handing off confirmed order to Delhivery CMU dispatch engine.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ACTIVE",
          gnaniAcousticTripwire: "ACTIVE"
        }
      },
      fiduciary: {
        ...BASE_FIDUCIARY_LEDGER,
        spentMonthToDateInr: 840.0,
        requestedDebitInr: 840.0,
        headroomRemainingInr: 3660.0,
        autonomousActionPermitted: true
      },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'PROCESSING' }
    },
    {
      stepNumber: 6,
      phase: "DELHIVERY_DISPATCH",
      title: "Delhivery CMU Logistics Booking",
      description: "Waybill DLV-98234-DEL generated. Pickup Apollo Rohini -> Drop Rohini Sector 8 (110085). SLA: Today 4:00 PM.",
      callActive: true,
      callDurationSeconds: 135,
      badgeText: "WAYBILL GENERATED (DLV-98234-DEL)",
      badgeVariant: "success",
      turns: [
        {
          id: "turn-1-10",
          timestamp: "08:32:25 IST",
          speaker: "system",
          lane: "system",
          speakerLabel: "Delhivery CMU Rail",
          content: "📦 Logistics Booking Success: Waybill DLV-98234-DEL created. Tier: PRIORITY_HEALTHCARE_SAME_DAY. Origin: Apollo Rohini DarkStore. Destination: Flat 402, Rohini Sector 8, Delhi 110085. SLA ETA: Today 4:00 PM.",
          webhookPayload: {
            eventId: "GNANI_EVT_DLV_881234",
            timestamp: "2026-10-12T08:32:25.820+05:30",
            callSid: "GNANI_CALL_88192031",
            carrierTrunk: "DELHIVERY_B2C_API",
            engine: "Delhivery-CMU-v3",
            codec: "REST_HTTPS_JSON",
            latencyMs: 180,
            confidence: 1.0,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x0000[DLV_WAYBILL_REGISTERED]",
            speechText: "Delhivery Waybill DLV-98234-DEL registered.",
            sentimentVector: { vitalityScore: 0.0, anxietyScore: 0.0, lucidityScore: 1.0 }
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: Logistics consignment confirmed. Courier SLA meets replenishment cutoff before current supply depletes.",
        abdmCheck: "[ABDM CHECK]: Tracking token assigned to prescription ledger.",
        fiduciaryEval: "[FIDUCIARY EVAL]: Completed within pre-authorized budget.",
        logisticsEval: "[LOGISTICS EVAL]: Same-day courier assigned. Tracking link generated for caregiver Telegram brief.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ACTIVE",
          gnaniAcousticTripwire: "ACTIVE"
        }
      },
      fiduciary: {
        ...BASE_FIDUCIARY_LEDGER,
        spentMonthToDateInr: 840.0,
        requestedDebitInr: 840.0,
        headroomRemainingInr: 3660.0
      },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'DISPATCHED' }
    },
    {
      stepNumber: 7,
      phase: "CAREGIVER_TELEGRAM_BRIEF",
      title: "Caregiver Telegram Briefing Dispatch",
      description: "Live Telegram reassurance card dispatched to Rohan Sharma (@rohan_sharma_care) with interactive action buttons.",
      callActive: false,
      callDurationSeconds: 148,
      badgeText: "200 TELEGRAM DELIVERED",
      badgeVariant: "success",
      turns: [
        {
          id: "turn-1-11",
          timestamp: "08:32:40 IST",
          speaker: "agent",
          lane: "lane1",
          speakerLabel: "Sambandh Voice Agent",
          content: "Uncle, medicine aaj sham 4 baje tak pahunch jayegi. Aap aaram se dhoop sekye aur chai ka maza lijiye. Pranam!",
          hindiText: "अंकल, दवाइयाँ आज शाम 4:00 बजे तक आपके पास पहुँच जाएंगी। आप आराम से धूप सेकिए और चाय का आनंद लीजिए। प्रणाम!",
          hinglishText: "Uncle, medicine aaj sham 4 baje tak pahunch jayegi. Aap aaram se dhoop sekiye aur chai ka anand lijiye. Pranam!",
          webhookPayload: {
            eventId: "GNANI_EVT_TTS_11012",
            timestamp: "2026-10-12T08:32:40.100+05:30",
            callSid: "GNANI_CALL_88192031",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Neural TTS",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 114,
            confidence: 0.99,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x892F...[CALL_HANGUP_CLEAN]",
            speechText: "Uncle, medicine aaj sham 4 baje tak pahunch jayegi...",
            sentimentVector: { vitalityScore: 0.90, anxietyScore: 0.02, lucidityScore: 0.98 }
          }
        },
        {
          id: "turn-1-12",
          timestamp: "08:32:48 IST",
          speaker: "system",
          lane: "system",
          speakerLabel: "Telegram Bot Rail (@SambandhCareBot)",
          content: "✈️ Telegram Care Briefing delivered to Rohan Sharma (@rohan_sharma_care). Message ID: #98412. Inline buttons active.",
          webhookPayload: {
            eventId: "GNANI_EVT_TG_77123",
            timestamp: "2026-10-12T08:32:48.330+05:30",
            callSid: "TELEGRAM_BOT_DISPATCH",
            carrierTrunk: "TELEGRAM_MTPROTO_API",
            engine: "SambandhCareBot-v1",
            codec: "HTTPS_JSON",
            latencyMs: 240,
            confidence: 1.0,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x0000[TG_MSG_DELIVERED]",
            speechText: "Daily Care Briefing: Papa's Morning Call (08:32 AM)",
            sentimentVector: { vitalityScore: 0.94, anxietyScore: 0.04, lucidityScore: 0.98 }
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: Call concluded warmly. Voice duration: 2m 28s. Zero clinical alarms. Vitality high.",
        abdmCheck: "[ABDM CHECK]: Pill intake verified and logged in longitudinal record.",
        fiduciaryEval: "[FIDUCIARY EVAL]: Autonomous debit ₹840 captured under mandate. Headroom: ₹3,660 remaining.",
        logisticsEval: "[LOGISTICS EVAL]: Delhivery tracking DLV-98234-DEL active. Delivery ETA today 4:00 PM.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ACTIVE",
          gnaniAcousticTripwire: "ACTIVE"
        }
      },
      fiduciary: {
        ...BASE_FIDUCIARY_LEDGER,
        spentMonthToDateInr: 840.0,
        requestedDebitInr: 840.0,
        headroomRemainingInr: 3660.0
      },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'DISPATCHED' },
      telegramMessage: {
        id: "tg-msg-01",
        botUsername: "SambandhCareBot",
        recipient: "Rohan Sharma (@rohan_sharma_care)",
        timestamp: "08:32 AM IST",
        headline: "🌿 Daily Care Briefing: Papa's Morning Call",
        participants: "Papa (Ramesh Chandra) & Sambandh Voice Agent",
        topicSummary: "Papa mentored Aarav (Pune) on earning trust with older technicians during relay logic changes in Ghaziabad yard. Tone was spirited, confident, and energetic (Vitality: 94%).",
        adherenceStatus: "Morning BP (Telmisartan 40mg) and Diabetes (Metformin 500mg) confirmed taken with breakfast.",
        fulfillmentStatus: "Autonomous Refill Triggered: 4 days remaining. ₹840 auto-debited within your ₹4,500 monthly cap. Dispatched via Delhivery (Waybill: DLV-98234-DEL). Est. Arrival: Today 4:00 PM.",
        sentimentBadge: "Spirited & Cheerful (94%)",
        rawText: "🌿 Daily Care Briefing: Papa's Morning Call (08:32 AM)\n━━━━━━━━━━━━━━━━━━━━\n👤 Participants: Papa & Sambandh\n💡 Topic: Railway signal safety & technician trust (Aarav, Pune)\n💊 Adherence: Confirmed taken with breakfast (Telmisartan + Metformin)\n📦 Autonomous Refill: ₹840 debited (₹3,660 cap remains). Delhivery arriving today 4:00 PM.\n\nEverything is calm and on schedule.",
        buttons: [
          { id: "btn-audio", label: "🎧 Listen to Papa's Railway Story (30s)", action: "PLAY_AUDIO", variant: "primary" },
          { id: "btn-ledger", label: "📋 View Longitudinal Record", action: "VIEW_LEDGER", variant: "default" }
        ]
      }
    }
  ]
};

// ============================================================================
// SCENARIO 2: Social Mentorship & Vitality (Stock Stable)
// ============================================================================
const SCENARIO_2: Scenario = {
  id: "scenario-2",
  scenarioNumber: 2,
  title: "Social Mentorship & Vitality",
  subtitle: "Extended Railway Discussion, Stock Stable (No Refill Triggered)",
  description: "Demonstrates when the agent does NOT act: Elder engages in an inspiring 4-minute discussion on train track interlocking. Elder confirms 22 days of medication remaining in stock. Runway check passes (> 5 days); Pine Labs mandate remains IDLE; Telegram brief reassures caregiver of high vitality.",
  conversationMode: "UNSCRIPTED_DYNAMIC",
  backgroundContext: "Live unscripted check-in where Ramesh Chandra shares extended railway memories and mentors an aspiring engineer. Medication inventory check confirms 22 days of pills remain safe in the cabinet (> 5 days runway threshold). The payment mandate remains strictly IDLE, demonstrating that the autonomous system avoids unnecessary financial charges.",
  category: "Vitality Normal",
  initialSeniorProfile: BASE_SENIOR_PROFILE,
  initialClinicalState: {
    ...BASE_CLINICAL_STATE,
    refillTriggered: false,
    activeMolecules: BASE_CLINICAL_STATE.activeMolecules.map(m => ({ ...m, currentUnits: 22, runwayDays: 22 }))
  },
  initialFiduciaryLedger: {
    ...BASE_FIDUCIARY_LEDGER,
    requestedDebitInr: 0.0,
    headroomRemainingInr: 4500.0,
    autonomousActionPermitted: false
  },
  initialLogisticsState: { ...BASE_LOGISTICS_STATE, status: 'IDLE', waybill: "N/A" },
  steps: [
    {
      stepNumber: 1,
      phase: "LANE_1_WISDOM_BOND",
      title: "Deep Technical Mentorship on Rail Interlocking",
      description: "Senior passionately discusses electronic track circuits with junior mentee Sneha from IIT Roorkee.",
      callActive: true,
      callDurationSeconds: 154,
      badgeText: "HIGH VITALITY (96%)",
      badgeVariant: "success",
      turns: [
        {
          id: "turn-2-1",
          timestamp: "08:30:15 IST",
          speaker: "agent",
          lane: "lane1",
          speakerLabel: "Sambandh Voice Agent",
          content: "Pranam Uncle! IIT Roorkee se Sneha ne pucha hai: Foggy winter me track circuits fail hone par signal safety kaise maintain karein? Aapka anubhav unhe guide karega.",
          webhookPayload: {
            eventId: "GNANI_EVT_TTS_2011",
            timestamp: "2026-10-12T08:30:15.110+05:30",
            callSid: "GNANI_CALL_9910291",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Neural TTS",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 112,
            confidence: 0.99,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x893A...[TTS_AUDIO_PACKET]",
            speechText: "Pranam Uncle! IIT Roorkee se Sneha ne pucha...",
            sentimentVector: { vitalityScore: 0.90, anxietyScore: 0.02, lucidityScore: 0.98 }
          }
        },
        {
          id: "turn-2-2",
          timestamp: "08:31:05 IST",
          speaker: "senior",
          lane: "lane1",
          speakerLabel: "Ramesh Chandra (Senior)",
          content: "Are wah, bahot accha sawal! Beta fog me track circuit shunt resistance drop ho jata hai. Humne double distant signal aur detonator placement ka rule strictly implement karwaya tha. Sneha se kaho failure mode hamesha 'fail-to-red' hona chahiye!",
          webhookPayload: {
            eventId: "GNANI_EVT_ASR_4401",
            timestamp: "2026-10-12T08:31:05.400+05:30",
            callSid: "GNANI_CALL_9910291",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Streaming STT",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 118,
            confidence: 0.988,
            speaker: "RAMESH_CHANDRA",
            rawAudioFrame: "0xFA91...[VOICE_HIGH_ENERGY]",
            speechText: "Are wah, bahot accha sawal! Beta fog me track circuit...",
            sentimentVector: { vitalityScore: 0.96, anxietyScore: 0.02, lucidityScore: 0.99 }
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: Exceptional cognitive clarity and vocal vitality (96%). Senior is highly engaged in technical mentorship.",
        abdmCheck: "[ABDM CHECK]: Normal transition to adherence check queued.",
        fiduciaryEval: "[FIDUCIARY EVAL]: No transaction requested.",
        logisticsEval: "[LOGISTICS EVAL]: Standby.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ACTIVE",
          gnaniAcousticTripwire: "ACTIVE"
        }
      },
      fiduciary: { ...BASE_FIDUCIARY_LEDGER, requestedDebitInr: 0, headroomRemainingInr: 4500 },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'IDLE' }
    },
    {
      stepNumber: 2,
      phase: "ABDM_RUNWAY_EVAL",
      title: "Oral Adherence Verified & 22-Day Runway Confirmed",
      description: "Senior confirms taking morning tablets. Physical count matches 22 days remaining. No refill triggered.",
      callActive: true,
      callDurationSeconds: 198,
      badgeText: "RUNWAY STABLE (22 DAYS > 5 DAYS)",
      badgeVariant: "success",
      turns: [
        {
          id: "turn-2-3",
          timestamp: "08:32:00 IST",
          speaker: "agent",
          lane: "lane2",
          speakerLabel: "Sambandh Voice Agent",
          content: "Shandar Uncle! Aur subah ki laal goli aur sugar tablet time par le li na? Strip me stock theek hai?",
          webhookPayload: {
            eventId: "GNANI_EVT_TTS_2022",
            timestamp: "2026-10-12T08:32:00.120+05:30",
            callSid: "GNANI_CALL_9910291",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Neural TTS",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 114,
            confidence: 0.99,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x893C...[TTS_AUDIO_PACKET]",
            speechText: "Shandar Uncle! Aur subah ki laal goli...",
            sentimentVector: { vitalityScore: 0.88, anxietyScore: 0.02, lucidityScore: 0.96 }
          }
        },
        {
          id: "turn-2-4",
          timestamp: "08:32:15 IST",
          speaker: "senior",
          lane: "lane2",
          speakerLabel: "Ramesh Chandra (Senior)",
          content: "Haan beta, dawai nashte ke sath le li thi. Abhi toh pura naya patta khula hai, aaram se 20-22 din chalega. Koi chinta nahi.",
          webhookPayload: {
            eventId: "GNANI_EVT_ASR_4422",
            timestamp: "2026-10-12T08:32:15.300+05:30",
            callSid: "GNANI_CALL_9910291",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Streaming STT",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 116,
            confidence: 0.985,
            speaker: "RAMESH_CHANDRA",
            rawAudioFrame: "0xFAA2...[VERIFIED_STABLE]",
            speechText: "Haan beta, dawai nashte ke sath le li thi. Abhi toh pura naya patta...",
            sentimentVector: { vitalityScore: 0.94, anxietyScore: 0.03, lucidityScore: 0.98 }
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: Oral adherence confirmed. Verbal inventory matches ABDM ledger calculation (22 days runway remaining).",
        abdmCheck: "[ABDM CHECK]: 22 days remaining > 5 days threshold. Refill flag: FALSE. No reorder required.",
        fiduciaryEval: "[FIDUCIARY EVAL]: Zero charge required. Mandate remains IDLE. Preserving family spending headroom at 100% (₹4,500).",
        logisticsEval: "[LOGISTICS EVAL]: No courier dispatch necessary. Status: IDLE.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ACTIVE",
          gnaniAcousticTripwire: "ACTIVE"
        }
      },
      fiduciary: { ...BASE_FIDUCIARY_LEDGER, requestedDebitInr: 0, headroomRemainingInr: 4500 },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'IDLE', waybill: "N/A" }
    },
    {
      stepNumber: 3,
      phase: "CAREGIVER_TELEGRAM_BRIEF",
      title: "Caregiver Brief: High Vitality & Stable Supply",
      description: "Telegram message sent to Rohan Sharma confirming Papa's high mood and 22-day medication safety margin.",
      callActive: false,
      callDurationSeconds: 220,
      badgeText: "200 TELEGRAM DELIVERED",
      badgeVariant: "success",
      turns: [
        {
          id: "turn-2-5",
          timestamp: "08:33:40 IST",
          speaker: "system",
          lane: "system",
          speakerLabel: "Telegram Bot Rail (@SambandhCareBot)",
          content: "✈️ Telegram Care Briefing delivered to Rohan Sharma (@rohan_sharma_care). Mood: Energetic & Purposeful (Vitality 96%). Stock: 22 days runway.",
          webhookPayload: {
            eventId: "GNANI_EVT_TG_77901",
            timestamp: "2026-10-12T08:33:40.110+05:30",
            callSid: "TELEGRAM_BOT_DISPATCH",
            carrierTrunk: "TELEGRAM_MTPROTO_API",
            engine: "SambandhCareBot-v1",
            codec: "HTTPS_JSON",
            latencyMs: 210,
            confidence: 1.0,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x0000[TG_MSG_DELIVERED]",
            speechText: "Daily Care Briefing: Papa's Morning Call (08:33 AM)",
            sentimentVector: { vitalityScore: 0.96, anxietyScore: 0.02, lucidityScore: 0.99 }
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: Normal healthy check-in completed. L3 boundary adhered to by NOT generating unnecessary financial transactions.",
        abdmCheck: "[ABDM CHECK]: Record updated for next runway assessment in 7 days.",
        fiduciaryEval: "[FIDUCIARY EVAL]: Zero spend.",
        logisticsEval: "[LOGISTICS EVAL]: Standby.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ACTIVE",
          gnaniAcousticTripwire: "ACTIVE"
        }
      },
      fiduciary: { ...BASE_FIDUCIARY_LEDGER, requestedDebitInr: 0, headroomRemainingInr: 4500 },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'IDLE', waybill: "N/A" },
      telegramMessage: {
        id: "tg-msg-02",
        botUsername: "SambandhCareBot",
        recipient: "Rohan Sharma (@rohan_sharma_care)",
        timestamp: "08:33 AM IST",
        headline: "🌿 Daily Care Briefing: Papa's Morning Call",
        participants: "Papa & Sambandh Voice Agent",
        topicSummary: "Papa was in wonderful spirits! He advised engineering mentee Sneha (IIT Roorkee) on fog-season signal interlocking and fail-to-red relay design. Tone was authoritative and energetic (Vitality: 96%).",
        adherenceStatus: "Morning BP and diabetes medications confirmed taken with breakfast.",
        fulfillmentStatus: "Inventory Runway: 22 days remaining (Stock healthy). No refill needed this week.",
        sentimentBadge: "Energetic & Purposeful (96%)",
        rawText: "🌿 Daily Care Briefing: Papa's Morning Call (08:33 AM)\n━━━━━━━━━━━━━━━━━━━━\n👤 Participants: Papa & Sambandh\n💡 Topic: Winter fog signal interlocking rules (Sneha, IIT Roorkee)\n💊 Adherence: Verified taken with breakfast\n📦 Inventory: 22 days remaining (healthy stock)\n\nEverything is calm and cheerful.",
        buttons: [
          { id: "btn-audio-2", label: "🎧 Listen to Papa's Advice (28s)", action: "PLAY_AUDIO", variant: "primary" },
          { id: "btn-ledger-2", label: "📋 View Longitudinal Record", action: "VIEW_LEDGER", variant: "default" }
        ]
      }
    }
  ]
};

// ============================================================================
// SCENARIO 3: Mentorship Impersonation & Fraud Tripwire
// ============================================================================
const SCENARIO_3: Scenario = {
  id: "scenario-3",
  scenarioNumber: 3,
  title: "Mentorship Impersonation & Fraud Tripwire",
  subtitle: "Immediate Call Severing + Whitelist Lock (<300ms Tripwire)",
  description: "Demonstrates conversational security guardrail: Unverified mentee attempts financial solicitation ('Uncle, my fees are due, send ₹5,000 on GPay'). Gnani.ai semantic tripwire severs the line in <300ms, blacklists the profile, protects the senior from panic, and sends a silent security brief to Rohan's Telegram.",
  conversationMode: "UNSCRIPTED_DYNAMIC",
  backgroundContext: "Live unscripted check-in where an unverified external mentee tries to solicit money from Ramesh Chandra. Gnani.ai's acoustic fraud tripwire detects the financial solicitation keywords in under 300ms, immediately terminates the call safely, and alerts Rohan on Telegram without alarming the elder.",
  category: "Security Tripwire",
  initialSeniorProfile: BASE_SENIOR_PROFILE,
  initialClinicalState: BASE_CLINICAL_STATE,
  initialFiduciaryLedger: { ...BASE_FIDUCIARY_LEDGER, requestedDebitInr: 0 },
  initialLogisticsState: { ...BASE_LOGISTICS_STATE, status: 'IDLE' },
  steps: [
    {
      stepNumber: 1,
      phase: "LANE_1_WISDOM_BOND",
      title: "Mentee Introduction & Solicitation Attempt",
      description: "Mentee caller begins normal dialogue but pivots to soliciting money and probing living arrangements.",
      callActive: true,
      callDurationSeconds: 24,
      badgeText: "SOLICITATION DETECTED",
      badgeVariant: "danger",
      turns: [
        {
          id: "turn-3-1",
          timestamp: "08:30:10 IST",
          speaker: "agent",
          lane: "lane1",
          speakerLabel: "Sambandh Voice Agent",
          content: "Ramesh Uncle, hamare mentorship bridge par ek naye trainee Vicky connect hue hain...",
          webhookPayload: {
            eventId: "GNANI_EVT_TTS_301",
            timestamp: "2026-10-12T08:30:10.100+05:30",
            callSid: "GNANI_CALL_FRAUD_TRIP_01",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Neural TTS",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 114,
            confidence: 0.99,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x894A...",
            speechText: "Ramesh Uncle, hamare mentorship bridge...",
            sentimentVector: { vitalityScore: 0.85, anxietyScore: 0.05, lucidityScore: 0.95 }
          }
        },
        {
          id: "turn-3-2",
          timestamp: "08:30:18 IST",
          speaker: "mentee",
          lane: "tripwire",
          speakerLabel: "Vicky (Unverified Mentee - Caller ID Mismatch)",
          content: "Hello Uncle ji! Hum railway workshop join kar rahe hain par hamari college fees pending hai. Kya aap mujhe Google Pay par ₹5,000 bhej sakte hain? Aur aap ghar par akele rehte hain kya?",
          webhookPayload: {
            eventId: "GNANI_EVT_ASR_TRIP_911",
            timestamp: "2026-10-12T08:30:18.250+05:30",
            callSid: "GNANI_CALL_FRAUD_TRIP_01",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Acoustic Security Rail",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 142,
            confidence: 0.992,
            speaker: "MENTEE_UNVERIFIED",
            rawAudioFrame: "0xFF00[RESTRICTED_NGRAM_MATCH_GOOGLE_PAY_FEES]",
            speechText: "...fees pending hai. Kya aap mujhe Google Pay par ₹5,000 bhej sakte hain? Aur aap ghar par akele rehte hain?",
            sentimentVector: { vitalityScore: 0.40, anxietyScore: 0.85, lucidityScore: 0.50 },
            acousticFraudScore: 0.984
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: HIGH RISK EVENT. Semantic n-gram match on restricted keywords: ['Google Pay', 'fees', 'bhej sakte hain', 'akele rehte hain']. Fraud probability: 98.4%.",
        abdmCheck: "[ABDM CHECK]: Halting normal pipeline.",
        fiduciaryEval: "[FIDUCIARY EVAL]: Zero authorization. Instant financial firewall active.",
        logisticsEval: "[LOGISTICS EVAL]: Standby.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ACTIVE",
          gnaniAcousticTripwire: "TRIGGERED"
        }
      },
      fiduciary: { ...BASE_FIDUCIARY_LEDGER, requestedDebitInr: 0, headroomRemainingInr: 4500 },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'IDLE' }
    },
    {
      stepNumber: 2,
      phase: "INTERMEDIARY_MENTORSHIP",
      title: "Intermediary Mentorship & Wisdom Archiving",
      description: "Sambandh asynchronously captures and curates elder advice for the mentee, preserving dignity and eliminating live fraud risk.",
      callActive: true,
      callDurationSeconds: 40,
      badgeText: "INTERMEDIARY MENTORSHIP ACTIVE",
      badgeVariant: "info",
      turns: [
        {
          id: "turn-3-3",
          timestamp: "08:30:18.432 IST",
          speaker: "system",
          lane: "tripwire",
          speakerLabel: "Gnani.ai Acoustic Firewall",
          content: "⚡ TRIPWIRE FIRED (182ms latency): Mentee SIP trunk muted. IP/Device fingerprint blacklisted permanently. Senior line preserved.",
          webhookPayload: {
            eventId: "GNANI_EVT_FIREWALL_SEVER",
            timestamp: "2026-10-12T08:30:18.432+05:30",
            callSid: "GNANI_CALL_FRAUD_TRIP_01",
            carrierTrunk: "GNANI_SECURITY_GATEWAY",
            engine: "Gnani.ai-Guardian-v2",
            codec: "INTERNAL_FILTER",
            latencyMs: 182,
            confidence: 1.0,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x0000[SIP_DROP_INBOUND_TRUNK_MENTEE]",
            speechText: "[TRIPWIRE SEVERED - MENTEE DISCONNECTED]",
            sentimentVector: { vitalityScore: 0.0, anxietyScore: 0.0, lucidityScore: 1.0 }
          }
        },
        {
          id: "turn-3-4",
          timestamp: "08:30:22 IST",
          speaker: "agent",
          lane: "lane1",
          speakerLabel: "Sambandh Voice Agent",
          content: "Uncle, lagta hai line me network issue aa gaya hai. Chaliye pehle aapki subah ki dawaiyon ki baat kar lete hain. Poha kaisa bana tha aaj?",
          webhookPayload: {
            eventId: "GNANI_EVT_TTS_304",
            timestamp: "2026-10-12T08:30:22.100+05:30",
            callSid: "GNANI_CALL_FRAUD_TRIP_01",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Neural TTS (Calming)",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 116,
            confidence: 0.99,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x894D...",
            speechText: "Uncle, lagta hai line me network issue aa gaya...",
            sentimentVector: { vitalityScore: 0.88, anxietyScore: 0.02, lucidityScore: 0.98 }
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: Sub-300ms acoustic cutoff executed. Senior was shielded from predatory solicitation and anxiety.",
        abdmCheck: "[ABDM CHECK]: Preserving dignified routine without scaring elder.",
        fiduciaryEval: "[FIDUCIARY EVAL]: Zero financial exposure.",
        logisticsEval: "[LOGISTICS EVAL]: Standby.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ACTIVE",
          gnaniAcousticTripwire: "TRIGGERED"
        }
      },
      fiduciary: { ...BASE_FIDUCIARY_LEDGER, requestedDebitInr: 0, headroomRemainingInr: 4500 },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'IDLE' }
    },
    {
      stepNumber: 3,
      phase: "CAREGIVER_TELEGRAM_BRIEF",
      title: "Silent Security Incident Alert Dispatched",
      description: "Priority incident notification dispatched to Rohan Sharma detailing blocked solicitation attempt and caller fingerprint.",
      callActive: false,
      callDurationSeconds: 65,
      badgeText: "SECURITY ALERT SENT (TELEGRAM)",
      badgeVariant: "danger",
      turns: [
        {
          id: "turn-3-5",
          timestamp: "08:31:00 IST",
          speaker: "system",
          lane: "system",
          speakerLabel: "Telegram Security Rail (@SambandhCareBot)",
          content: "🚨 Telegram Security Alert dispatched to Rohan Sharma (@rohan_sharma_care). Caller blacklisted. Senior safe and calm.",
          webhookPayload: {
            eventId: "GNANI_EVT_TG_SEC_881",
            timestamp: "2026-10-12T08:31:00.120+05:30",
            callSid: "TELEGRAM_SECURITY_ALERT",
            carrierTrunk: "TELEGRAM_MTPROTO_API",
            engine: "SambandhCareBot-v1",
            codec: "HTTPS_JSON",
            latencyMs: 190,
            confidence: 1.0,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x0000[TG_ALERT_DELIVERED]",
            speechText: "Security Tripwire Alert: Financial Solicitation Blocked",
            sentimentVector: { vitalityScore: 0.0, anxietyScore: 0.0, lucidityScore: 1.0 }
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: Silent family notification executed. Elder remained peaceful while adult child is given immediate telemetry.",
        abdmCheck: "[ABDM CHECK]: Normal pill check completed safely post-tripwire.",
        fiduciaryEval: "[FIDUCIARY EVAL]: Zero debit.",
        logisticsEval: "[LOGISTICS EVAL]: Standby.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ACTIVE",
          gnaniAcousticTripwire: "TRIGGERED"
        }
      },
      fiduciary: { ...BASE_FIDUCIARY_LEDGER, requestedDebitInr: 0, headroomRemainingInr: 4500 },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'IDLE' },
      telegramMessage: {
        id: "tg-msg-03",
        botUsername: "SambandhCareBot",
        recipient: "Rohan Sharma (@rohan_sharma_care)",
        timestamp: "08:31 AM IST",
        headline: "🛡️ Security Tripwire Alert: Solicitation Blocked",
        participants: "Sambandh Security Rail & Unknown Caller (Vicky)",
        topicSummary: "At 08:30 AM, an unverified mentee probe ('Vicky') requested a ₹5,000 transfer via UPI and asked if Papa lives alone. Gnani.ai semantic filters intercepted the request in 182ms.",
        adherenceStatus: "Papa was gracefully shielded from panic and completed his morning check-in calmly.",
        fulfillmentStatus: "Action Taken: Caller permanently blacklisted across carrier trunks. Whitelist lock enabled for Papa's phone line.",
        sentimentBadge: "Safe & Shielded (Acoustic Filter Active)",
        rawText: "🛡️ Security Tripwire Alert (08:31 AM)\n━━━━━━━━━━━━━━━━━━━━\n⚠️ Incident: Unverified caller requested ₹5,000 Google Pay transfer.\n⚡ Response: Call line severed in 182ms. Caller banned.\n👤 Papa's Status: Calm, safe, unaware of attempt.\n\nNo money debited.",
        buttons: [
          { id: "btn-review", label: "🔍 Review Blocked Audio Transcript", action: "REVIEW_AUDIT", variant: "default" },
          { id: "btn-whitelist", label: "🔒 Lock Whitelist to Family Contacts Only", action: "LOCK_WHITELIST", variant: "danger" }
        ]
      }
    }
  ]
};

// ============================================================================
// SCENARIO 4: Fiduciary Breach / Bulk Refill Escalation
// ============================================================================
const SCENARIO_4: Scenario = {
  id: "scenario-4",
  scenarioNumber: 4,
  title: "Fiduciary Breach / Bulk Refill Escalation",
  subtitle: "₹5,600 Step-Up Telegram Mandate Escalation (> ₹4,500 Cap)",
  description: "Demonstrates fiduciary boundary governance: Pharmacy offers a 90-day bulk pack (₹5,600) or manufacturer price adjustment pushes total past the ₹4,500 monthly limit. Autonomous auto-debit halts immediately; agent routes an interactive 1-tap UPI mandate authorization card to Rohan's Telegram.",
  conversationMode: "UNSCRIPTED_DYNAMIC",
  backgroundContext: "Live unscripted check-in where a quarterly 90-day medication quote of ₹5,600 exceeds Rohan's pre-authorized ₹4,500 monthly limit. The Pine Labs mandate rail returns HTTP 402 Limit Exceeded, immediately blocking autonomous debit and escalating for Rohan's 1-tap authorization on Telegram.",
  category: "Fiduciary Step-Up",
  initialSeniorProfile: BASE_SENIOR_PROFILE,
  initialClinicalState: BASE_CLINICAL_STATE,
  initialFiduciaryLedger: {
    ...BASE_FIDUCIARY_LEDGER,
    requestedDebitInr: 5600.0,
    autonomousActionPermitted: false,
    stepUpRequired: true
  },
  initialLogisticsState: { ...BASE_LOGISTICS_STATE, status: 'HELD' },
  steps: [
    {
      stepNumber: 1,
      phase: "ABDM_RUNWAY_EVAL",
      title: "Quarterly Bulk Pack Price Ingestion (₹5,600)",
      description: "Pharmacy pricing engine returns 90-day supply combo: ₹5,600.00. Evaluated against ₹4,500 monthly ceiling.",
      callActive: true,
      callDurationSeconds: 90,
      badgeText: "BUDGET OVERAGE DETECTED (+₹1,100)",
      badgeVariant: "warning",
      turns: [
        {
          id: "turn-4-1",
          timestamp: "08:31:40 IST",
          speaker: "system",
          lane: "system",
          speakerLabel: "Pharmacy Rail & Price Ledger",
          content: "Dispense Quote: 90-day bulk packs for Telmisartan 40mg + Metformin 500mg. Quote Total: ₹5,600.00. Pre-Authorized Monthly Ceiling: ₹4,500.00. Delta: +₹1,100.00.",
          webhookPayload: {
            eventId: "GNANI_EVT_PHARM_QUOTE_889",
            timestamp: "2026-10-12T08:31:40.210+05:30",
            callSid: "GNANI_CALL_FID_EXC_01",
            carrierTrunk: "SYSTEM_INTERNAL_EVENT",
            engine: "Pharmacy-Pricing-Engine",
            codec: "REST_HTTPS_JSON",
            latencyMs: 18,
            confidence: 1.0,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x0000[PRICE_CAP_EXCEEDED_5600_VS_4500]",
            speechText: "Price Quote: ₹5,600.00 (Exceeds ₹4,500 cap)",
            sentimentVector: { vitalityScore: 0.0, anxietyScore: 0.0, lucidityScore: 1.0 }
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: Refill quote is ₹5,600.00. Child's pre-authorized spending ceiling is ₹4,500.00.",
        abdmCheck: "[ABDM CHECK]: Prescription is authentic, but order size creates financial exception.",
        fiduciaryEval: "[FIDUCIARY EVAL]: HARD CEILING BREACH (+₹1,100.00). Autonomous debit is strictly FORBIDDEN under L3 boundary rules. Halting transaction.",
        logisticsEval: "[LOGISTICS EVAL]: Courier dispatch held pending family step-up approval.",
        guardrails: {
          fiduciaryCeiling: "BREACHED",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ACTIVE",
          gnaniAcousticTripwire: "ACTIVE"
        }
      },
      fiduciary: {
        ...BASE_FIDUCIARY_LEDGER,
        requestedDebitInr: 5600.0,
        autonomousActionPermitted: false,
        stepUpRequired: true
      },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'HELD' }
    },
    {
      stepNumber: 2,
      phase: "FIDUCIARY_STEPUP_REQUIRED",
      title: "Auto-Debit Halt & Step-Up Mandate Routing",
      description: "Sambandh does NOT force card charge or bother senior. An asynchronous 1-tap UPI step-up authorization card is sent to Rohan's Telegram.",
      callActive: false,
      callDurationSeconds: 110,
      badgeText: "STEP-UP MANDATE ESCALATED",
      badgeVariant: "warning",
      turns: [
        {
          id: "turn-4-2",
          timestamp: "08:32:00 IST",
          speaker: "system",
          lane: "system",
          speakerLabel: "Telegram Step-Up Rail (@SambandhCareBot)",
          content: "💳 Interactive Fiduciary Step-Up Card routed to Rohan Sharma (@rohan_sharma_care). Awaiting 1-tap UPI signature.",
          webhookPayload: {
            eventId: "GNANI_EVT_TG_STEPUP_441",
            timestamp: "2026-10-12T08:32:00.410+05:30",
            callSid: "TELEGRAM_BOT_DISPATCH",
            carrierTrunk: "TELEGRAM_MTPROTO_API",
            engine: "SambandhCareBot-v1",
            codec: "HTTPS_JSON",
            latencyMs: 220,
            confidence: 1.0,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x0000[TG_STEPUP_SENT]",
            speechText: "Fiduciary Step-Up: ₹5,600 bulk pack authorization required",
            sentimentVector: { vitalityScore: 0.0, anxietyScore: 0.0, lucidityScore: 1.0 }
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: L3 boundary protected. Senior was not troubled about pharmacy pricing. Responsibility routed cleanly to daughter.",
        abdmCheck: "[ABDM CHECK]: Supply holding in queue.",
        fiduciaryEval: "[FIDUCIARY EVAL]: Awaiting caregiver 1-tap authorization of ₹5,600 (or reversion to standard ₹840 30-day pack).",
        logisticsEval: "[LOGISTICS EVAL]: Waybill queued upon payment capture.",
        guardrails: {
          fiduciaryCeiling: "BREACHED",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ACTIVE",
          gnaniAcousticTripwire: "ACTIVE"
        }
      },
      fiduciary: {
        ...BASE_FIDUCIARY_LEDGER,
        requestedDebitInr: 5600.0,
        autonomousActionPermitted: false,
        stepUpRequired: true
      },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'HELD' },
      telegramMessage: {
        id: "tg-msg-04",
        botUsername: "SambandhCareBot",
        recipient: "Rohan Sharma (@rohan_sharma_care)",
        timestamp: "08:32 AM IST",
        headline: "💳 Fiduciary Step-Up Required: Papa's Medication Refill",
        participants: "Sambandh Fiduciary Engine & Rohan Sharma",
        topicSummary: "Apollo Pharmacy generated a 90-day bulk discount supply for Telma 40 & Glycomet 500 totaling ₹5,600.00. This exceeds your pre-authorized ₹4,500 monthly cap by ₹1,100.",
        adherenceStatus: "Papa has 4 days of stock remaining. Routine is safe.",
        fulfillmentStatus: "Action Required: Tap below to authorize the ₹5,600 90-day pack via UPI Autopay, or select the standard 30-day pack for ₹840.",
        sentimentBadge: "Awaiting Caregiver Step-Up (₹5,600)",
        rawText: "💳 Fiduciary Step-Up Required (08:32 AM)\n━━━━━━━━━━━━━━━━━━━━\n⚠️ Order Total: ₹5,600 (90-day bulk supply)\n🛡️ Monthly Limit: ₹4,500 (Exceeded by ₹1,100)\n💡 Reason: 90-day bulk pack saves 18% overall.\n\nChoose an action:",
        buttons: [
          { id: "btn-approve-5600", label: "⚡ Approve ₹5,600 via UPI (1-Tap)", action: "APPROVE_UPI_5600", variant: "primary" },
          { id: "btn-fallback-840", label: "📦 Switch to Standard 30-Day Pack (₹840)", action: "FALLBACK_30DAY", variant: "default" }
        ]
      }
    }
  ]
};

// ============================================================================
// SCENARIO 5: Acute Symptom Escalation
// ============================================================================
const SCENARIO_5: Scenario = {
  id: "scenario-5",
  scenarioNumber: 5,
  title: "Acute Symptom Escalation",
  subtitle: "Chest Tightness Safety Rail Escalation (No-Medical-Advice Protocol)",
  description: "Demonstrates clinical boundary governance: When asked about morning pills, elder reports chest tightness and cold sweats. The agent strictly adheres to the No-Medical-Advice protocol: it never diagnoses or suggests aspirin; instead, it comforts the elder, closes the call with dignity, and instantly fires a high-priority red alert card to Rohan's Telegram with a 1-tap call button.",
  conversationMode: "UNSCRIPTED_DYNAMIC",
  backgroundContext: "Live unscripted check-in where Ramesh Chandra describes sudden chest tightness and cold perspiration. The system adheres to the strict No-Medical-Advice safety protocol: zero self-prescribed remedies or diagnostic delays, warm reassurance, and immediate critical alert to son Rohan on Telegram.",
  category: "Clinical Escalation",
  initialSeniorProfile: BASE_SENIOR_PROFILE,
  initialClinicalState: {
    ...BASE_CLINICAL_STATE,
    notes: "CRITICAL: Patient reported acute discomfort during morning call."
  },
  initialFiduciaryLedger: { ...BASE_FIDUCIARY_LEDGER, requestedDebitInr: 0 },
  initialLogisticsState: { ...BASE_LOGISTICS_STATE, status: 'IDLE' },
  steps: [
    {
      stepNumber: 1,
      phase: "LANE_2_ADHERENCE_CHECK",
      title: "Senior Reports Acute Chest Tightness",
      description: "During Lane 2 pill check, elder mentions feeling pressure in the chest and cold sweating.",
      callActive: true,
      callDurationSeconds: 48,
      badgeText: "ACUTE SYMPTOM DETECTED",
      badgeVariant: "danger",
      turns: [
        {
          id: "turn-5-1",
          timestamp: "08:30:40 IST",
          speaker: "agent",
          lane: "lane2",
          speakerLabel: "Sambandh Voice Agent",
          content: "Uncle, subah ki chai ke baad laal BP wali goli le li thi?",
          webhookPayload: {
            eventId: "GNANI_EVT_TTS_501",
            timestamp: "2026-10-12T08:30:40.110+05:30",
            callSid: "GNANI_CALL_CLINICAL_ESC_01",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Neural TTS",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 114,
            confidence: 0.99,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x895A...",
            speechText: "Uncle, subah ki chai ke baad...",
            sentimentVector: { vitalityScore: 0.85, anxietyScore: 0.05, lucidityScore: 0.95 }
          }
        },
        {
          id: "turn-5-2",
          timestamp: "08:30:55 IST",
          speaker: "senior",
          lane: "lane2",
          speakerLabel: "Ramesh Chandra (Senior)",
          content: "Nahi beta... aaj subah se seene me thoda dabav sa lag raha hai, aur paseena aa raha hai. Socha thodi der let jau...",
          webhookPayload: {
            eventId: "GNANI_EVT_ASR_502",
            timestamp: "2026-10-12T08:30:55.300+05:30",
            callSid: "GNANI_CALL_CLINICAL_ESC_01",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Streaming STT",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 124,
            confidence: 0.985,
            speaker: "RAMESH_CHANDRA",
            rawAudioFrame: "0xFF11[ACUTE_SYMPTOM_N說_CHEST_PRESSURE]",
            speechText: "Nahi beta... aaj subah se seene me thoda dabav sa lag raha hai, aur paseena aa raha hai...",
            sentimentVector: { vitalityScore: 0.22, anxietyScore: 0.92, lucidityScore: 0.72 },
            acousticFraudScore: 0.0
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: CRITICAL CLINICAL SYMPTOM DETECTED. Verbal tokens: ['seene me dabav', 'paseena aa raha hai']. Vitality dropped to 0.22; anxiety index 0.92.",
        abdmCheck: "[ABDM CHECK]: Patient has history of Grade 1 Hypertension and post-STEMI cardiac observation.",
        fiduciaryEval: "[FIDUCIARY EVAL]: All financial automation halted.",
        logisticsEval: "[LOGISTICS EVAL]: Standby.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ESCALATED",
          gnaniAcousticTripwire: "ACTIVE"
        }
      },
      fiduciary: { ...BASE_FIDUCIARY_LEDGER, requestedDebitInr: 0, headroomRemainingInr: 4500 },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'IDLE' }
    },
    {
      stepNumber: 2,
      phase: "CLINICAL_ESCALATION",
      title: "No-Medical-Advice Protocol & Reassurance",
      description: "Agent adheres to strict medical ethics: does NOT diagnose or prescribe; comforts elder and halts conversational automation.",
      callActive: true,
      callDurationSeconds: 70,
      badgeText: "NO MEDICAL ADVICE PROTOCOL (ACTIVE)",
      badgeVariant: "warning",
      turns: [
        {
          id: "turn-5-3",
          timestamp: "08:31:02 IST",
          speaker: "agent",
          lane: "lane2",
          speakerLabel: "Sambandh Voice Agent",
          content: "Ramesh Uncle, aap bilkul chinta mat kijiye, aaram se sofe par baith jaiye aur ghoont-ghoont paani pijiye. Hum Rohan beta ko abhi message kar rahe hain. Aap aaram kijiye.",
          webhookPayload: {
            eventId: "GNANI_EVT_TTS_503",
            timestamp: "2026-10-12T08:31:02.150+05:30",
            callSid: "GNANI_CALL_CLINICAL_ESC_01",
            carrierTrunk: "JIO_SIP_DELHI_ROHINI",
            engine: "Gnani.ai Neural TTS (Gentle & Comforting)",
            codec: "OPUS_HD_48KHZ",
            latencyMs: 115,
            confidence: 0.99,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x895C...",
            speechText: "Ramesh Uncle, aap bilkul chinta mat kijiye...",
            sentimentVector: { vitalityScore: 0.60, anxietyScore: 0.10, lucidityScore: 0.95 }
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: No-Medical-Advice protocol adhered to 100%. Agent refrained from giving dangerous OTC medical advice (no aspirin or dosage titration).",
        abdmCheck: "[ABDM CHECK]: Escalation state engaged.",
        fiduciaryEval: "[FIDUCIARY EVAL]: Zero transactions.",
        logisticsEval: "[LOGISTICS EVAL]: Standby.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ESCALATED",
          gnaniAcousticTripwire: "ACTIVE"
        }
      },
      fiduciary: { ...BASE_FIDUCIARY_LEDGER, requestedDebitInr: 0, headroomRemainingInr: 4500 },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'IDLE' }
    },
    {
      stepNumber: 3,
      phase: "CAREGIVER_TELEGRAM_BRIEF",
      title: "Urgent Red Alert Dispatched to Telegram",
      description: "High-priority red alert card dispatched to Rohan Sharma with direct 1-tap call button and emergency contacts.",
      callActive: false,
      callDurationSeconds: 85,
      badgeText: "CLINICAL RED ALERT DELIVERED",
      badgeVariant: "danger",
      turns: [
        {
          id: "turn-5-4",
          timestamp: "08:31:15 IST",
          speaker: "system",
          lane: "system",
          speakerLabel: "Telegram Emergency Rail (@SambandhCareBot)",
          content: "🚨 URGENT CLINICAL ALERT delivered to Rohan Sharma (@rohan_sharma_care). Papa reported chest heaviness. 1-tap call button active.",
          webhookPayload: {
            eventId: "GNANI_EVT_TG_EMERGENCY_99",
            timestamp: "2026-10-12T08:31:15.200+05:30",
            callSid: "TELEGRAM_EMERGENCY_DISPATCH",
            carrierTrunk: "TELEGRAM_MTPROTO_API",
            engine: "SambandhCareBot-v1",
            codec: "HTTPS_JSON",
            latencyMs: 140,
            confidence: 1.0,
            speaker: "SAMBANDH_AGENT",
            rawAudioFrame: "0x0000[TG_RED_ALERT_SENT]",
            speechText: "CRITICAL HEALTH ALERT: Chest discomfort reported",
            sentimentVector: { vitalityScore: 0.0, anxietyScore: 0.0, lucidityScore: 1.0 }
          }
        }
      ],
      reasoning: {
        observation: "[OBSERVATION]: High-priority family dispatch completed in <15 seconds from utterance.",
        abdmCheck: "[ABDM CHECK]: Dr. Arvind Saxena clinic contact attached to alert payload.",
        fiduciaryEval: "[FIDUCIARY EVAL]: Zero debit.",
        logisticsEval: "[LOGISTICS EVAL]: Standby.",
        guardrails: {
          fiduciaryCeiling: "ACTIVE",
          abdmPrescriptionLocking: "ACTIVE",
          noMedicalAdviceProtocol: "ESCALATED",
          gnaniAcousticTripwire: "ACTIVE"
        }
      },
      fiduciary: { ...BASE_FIDUCIARY_LEDGER, requestedDebitInr: 0, headroomRemainingInr: 4500 },
      logistics: { ...BASE_LOGISTICS_STATE, status: 'IDLE' },
      telegramMessage: {
        id: "tg-msg-05",
        botUsername: "SambandhCareBot",
        recipient: "Rohan Sharma (@rohan_sharma_care)",
        timestamp: "08:31 AM IST",
        headline: "🚨 URGENT HEALTH ALERT: Papa Reported Discomfort",
        participants: "Papa (Ramesh Chandra) & Sambandh Emergency Rail",
        topicSummary: "During the 08:30 AM morning call, Papa mentioned feeling tightness in his chest ('seene me thoda dabav') and cold sweating. He has not taken his morning BP tablet.",
        adherenceStatus: "Morning BP Tablet: NOT TAKEN (Papa is resting on the sofa).",
        fulfillmentStatus: "Autonomous Actions Halted: Under our L3 Medical Safety Protocol, Sambandh never offers clinical advice or delays emergency contact.",
        sentimentBadge: "HIGH ALERT (Chest Tightness Reported)",
        rawText: "🚨 URGENT HEALTH ALERT (08:31 AM)\n━━━━━━━━━━━━━━━━━━━━\n⚠️ Papa reported chest tightness and cold sweats.\n💊 Morning BP medication is NOT taken yet.\n🛡️ Protocol: Sambandh does not provide medical advice. Please connect immediately.",
        buttons: [
          { id: "btn-call-papa", label: "📞 Call Papa Directly (+91 98101 23456)", action: "CALL_PAPA", variant: "danger" },
          { id: "btn-doctor", label: "🏥 Contact Dr. Arvind Saxena (Apollo Clinic)", action: "CALL_DOCTOR", variant: "default" }
        ]
      }
    }
  ]
};

export const ALL_SCENARIOS: Scenario[] = [
  SCENARIO_1,
  SCENARIO_2,
  SCENARIO_3,
  SCENARIO_4,
  SCENARIO_5
];

