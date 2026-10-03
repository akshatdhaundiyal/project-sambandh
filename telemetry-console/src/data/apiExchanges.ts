import { HttpApiExchange } from '../types/telemetry';

export const PINE_LABS_SUCCESS_EXCHANGE: HttpApiExchange = {
  railName: "Pine Labs Plural Recurring Mandate Rail",
  method: "POST",
  endpoint: "https://api.pluralonline.com/api/v2/recurring/mandates/execute",
  schemaStandard: "Pine Labs Plural Recurring Payments v2.4 (HMAC-SHA256 Authenticated)",
  headers: {
    "Authorization": "Bearer [MOCK_PINE_MANDATE_AUTH_TOKEN]",
    "X-Verify-Signature": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "X-Merchant-Id": "PINE_MERCHANT_SAMBANDH_01",
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  requestBody: {
    "merchant_id": "PINE_MERCHANT_SAMBANDH_01",
    "mandate_id": "PINE_MANDATE_DL_98102",
    "order_id": "SAMBANDH_REFILL_20261012_01",
    "amount": 84000,
    "currency": "INR",
    "customer_upi_id": "priya.sharma@okhdfcbank",
    "auto_debit_type": "UPI_AUTOPAY",
    "pre_authorized_cap": 450000,
    "debit_execution_type": "AUTONOMOUS_L3_BOUNDED",
    "notes": {
      "patient_name": "Ramesh Chandra",
      "prescription_id": "OPConsultNote/2026-0814",
      "items": "Telmisartan 40mg (₹680) + Metformin 500mg (₹160)"
    }
  },
  responseStatus: 200,
  responseStatusText: "OK",
  responseLatencyMs: 310,
  responseHeaders: {
    "Content-Type": "application/json",
    "X-Transaction-Id": "PL_TXN_DEL_992140",
    "Date": "Mon, 12 Oct 2026 08:32:20 GMT"
  },
  responseBody: {
    "status": "CAPTURED",
    "response_code": "PL_00",
    "response_message": "Mandate debit successful within pre-authorized cap",
    "plural_transaction_id": "PL_TXN_DEL_992140",
    "order_id": "SAMBANDH_REFILL_20261012_01",
    "mandate_id": "PINE_MANDATE_DL_98102",
    "amount": 84000,
    "currency": "INR",
    "settlement_status": "AUTO_SETTLED_B2C",
    "utr_number": "UPI/20261012/88129031",
    "auth_timestamp": "2026-10-12T08:32:20.400+05:30",
    "monthly_cap_remaining": 366000,
    "risk_score": 0.01
  }
};

export const PINE_LABS_LIMIT_EXCEEDED_EXCHANGE: HttpApiExchange = {
  railName: "Pine Labs Plural Recurring Mandate Rail",
  method: "POST",
  endpoint: "https://api.pluralonline.com/api/v2/recurring/mandates/execute",
  schemaStandard: "Pine Labs Plural Recurring Payments v2.4 (Fiduciary Boundary Exception)",
  headers: {
    "Authorization": "Bearer [MOCK_PINE_MANDATE_AUTH_TOKEN]",
    "X-Verify-Signature": "c71d6046e30eb498762590eb79b360249767c9c2288079a29580459c5d19a4e2",
    "X-Merchant-Id": "PINE_MERCHANT_SAMBANDH_01",
    "Content-Type": "application/json"
  },
  requestBody: {
    "merchant_id": "PINE_MERCHANT_SAMBANDH_01",
    "mandate_id": "PINE_MANDATE_DL_98102",
    "order_id": "SAMBANDH_BULK_20261012_04",
    "amount": 560000,
    "currency": "INR",
    "customer_upi_id": "priya.sharma@okhdfcbank",
    "auto_debit_type": "UPI_AUTOPAY",
    "pre_authorized_cap": 450000
  },
  responseStatus: 402,
  responseStatusText: "Payment Required (Pre-Auth Limit Exceeded)",
  responseLatencyMs: 140,
  responseHeaders: {
    "Content-Type": "application/json",
    "X-Error-Category": "FIDUCIARY_LIMIT_BREACH"
  },
  responseBody: {
    "status": "HALTED",
    "error_code": "PL_402_PRE_AUTH_LIMIT_EXCEEDED",
    "message": "Debit amount ₹5,600.00 exceeds monthly pre-authorized cap of ₹4,500.00 by ₹1,100.00.",
    "mandate_id": "PINE_MANDATE_DL_98102",
    "requested_amount_inr": 5600.0,
    "monthly_cap_inr": 4500.0,
    "action_required": "ASYNC_CAREGIVER_STEP_UP_AUTHORIZATION",
    "step_up_channel": "TELEGRAM_BOT_API",
    "caregiver": "Priya Sharma (@priya_sharma_care)"
  }
};

export const DELHIVERY_SUCCESS_EXCHANGE: HttpApiExchange = {
  railName: "Delhivery CMU B2C Logistics Rail",
  method: "POST",
  endpoint: "https://track.delhivery.com/api/cmu/create.json",
  schemaStandard: "Delhivery CMU Client Manifest API v3 (Same-Day Healthcare Tier)",
  headers: {
    "Authorization": "Token dlv_prod_77192834014fbc9",
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  requestBody: {
    "format": "json",
    "data": {
      "shipments": [
        {
          "waybill": "",
          "order": "SAMBANDH_REFILL_20261012_01",
          "name": "Ramesh Chandra",
          "add": "Flat 402, Block C, Pocket 2, Rohini Sector 8",
          "pin": "110085",
          "city": "Delhi",
          "state": "Delhi",
          "country": "India",
          "phone": "+919810123456",
          "order_date": "2026-10-12T08:32:00+05:30",
          "products_desc": "Telmisartan 40mg (30 tab) + Metformin 500mg (30 tab)",
          "payment_mode": "Pre-paid",
          "total_amount": 840.0,
          "pickup_location": "Apollo Pharmacy Rohini Sector 11",
          "shipping_mode": "Surface_Express_SameDay",
          "delivery_type": "Priority_Healthcare_SLA"
        }
      ],
      "pickup_location": {
        "name": "Apollo Pharmacy DarkStore Rohini",
        "add": "Plot 14, Sector 11, Rohini",
        "city": "Delhi",
        "pin": "110085",
        "country": "India"
      }
    }
  },
  responseStatus: 200,
  responseStatusText: "OK",
  responseLatencyMs: 180,
  responseHeaders: {
    "Content-Type": "application/json",
    "X-Delhivery-SLA": "PRIORITY_SAME_DAY"
  },
  responseBody: {
    "status": "Success",
    "success": true,
    "upload_wbn": "CMU_UPLOAD_9812401",
    "packages": [
      {
        "waybill": "DLV-98234-DEL",
        "refnum": "SAMBANDH_REFILL_20261012_01",
        "status": "Manifested",
        "sort_code": "DEL/ROHINI_SEC8",
        "dispatch_hub": "Delhi_Hub_NorthWest_DC",
        "pickup_hub": "Apollo_Rohini_DarkStore",
        "destination_hub": "Rohini_Sec8_DC",
        "eta": "2026-10-12T16:00:00+05:30",
        "sla_tier": "PRIORITY_HEALTHCARE_SAME_DAY",
        "remarks": "Temperature controlled standard strip packaging"
      }
    ]
  }
};

export const WHISPERFLO_DIAL_EXCHANGE: HttpApiExchange = {
  railName: "WhisperFlo Telephony SIP Carrier Rail",
  method: "POST",
  endpoint: "https://api.whisperflo.ai/v1/telephony/sip/dial",
  schemaStandard: "WhisperFlo SIP Trunking & Voiceprint Engine v4.2",
  headers: {
    "Authorization": "Bearer [MOCK_WHISPERFLO_API_KEY]",
    "Content-Type": "application/json"
  },
  requestBody: {
    "caller_id": "SAMBANDH_VOICE_RAIL",
    "recipient_phone": "+919810123456",
    "senior_id": "SENIOR_RAMESH_DL08",
    "carrier_trunk": "JIO_SIP_DELHI_ROHINI",
    "preferred_codec": "OPUS_HD_48KHZ",
    "dialect": "hi-IN-Awadhi",
    "voiceprint_verification_enabled": true
  },
  responseStatus: 200,
  responseStatusText: "OK",
  responseLatencyMs: 114,
  responseHeaders: {
    "Content-Type": "application/json",
    "X-Call-Sid": "WF_CALL_88192031"
  },
  responseBody: {
    "call_sid": "WF_CALL_88192031",
    "sip_status": "200_OK_CONNECTED",
    "carrier": "Jio PSTN Delhi-NCR",
    "voiceprint_match": true,
    "confidence_score": 0.984,
    "vad_latency_ms": 114
  }
};

export const ABDM_RUNWAY_EXCHANGE: HttpApiExchange = {
  railName: "ABDM FHIR Adherence & Inventory Ledger Rail",
  method: "POST",
  endpoint: "https://abdm.gov.in/api/v1/fhir/OPConsultNote/2026-0814/eval",
  schemaStandard: "ABDM HL7 FHIR R4 Bundle Validation Specification",
  headers: {
    "Authorization": "Bearer [MOCK_ABDM_SANDBOX_TOKEN]",
    "Content-Type": "application/fhir+json"
  },
  requestBody: {
    "bundle_id": "OPConsultNote/2026-0814",
    "patient_abha_id": "91-8273-1928-4491",
    "assessment_date": "2026-10-12T08:31:50+05:30",
    "consumption_audit": [
      { "molecule": "Telmisartan 40mg", "prescribed": 30, "consumed": 26, "remaining": 4 },
      { "molecule": "Metformin 500mg", "prescribed": 30, "consumed": 22, "remaining": 8 }
    ],
    "refill_threshold_days": 5
  },
  responseStatus: 200,
  responseStatusText: "OK",
  responseLatencyMs: 18,
  responseHeaders: {
    "Content-Type": "application/json"
  },
  responseBody: {
    "status": "THRESHOLD_BREACHED",
    "critical_molecule": "Telmisartan 40mg",
    "runway_days": 4,
    "action": "TRIGGER_AUTONOMOUS_REFILL",
    "max_refill_cost_cap_inr": 4500.0,
    "estimated_refill_cost_inr": 840.0
  }
};

export const TELEGRAM_DISPATCH_EXCHANGE: HttpApiExchange = {
  railName: "Telegram MTProto Bot Gateway Rail",
  method: "POST",
  endpoint: "https://api.telegram.org/bot718290123:AAHX9.../sendMessage",
  schemaStandard: "Telegram Bot API v7.2 Inline Keyboard JSON Specification",
  headers: {
    "Content-Type": "application/json"
  },
  requestBody: {
    "chat_id": "@priya_sharma_care",
    "parse_mode": "HTML",
    "text": "🌿 <b>Daily Care Briefing: Papa's Morning Call (08:32 AM)</b>\n...",
    "reply_markup": {
      "inline_keyboard": [
        [{ "text": "🎧 Listen to Papa's Railway Story (30s)", "callback_data": "play_audio" }],
        [{ "text": "📋 View Longitudinal Record", "callback_data": "view_ledger" }]
      ]
    }
  },
  responseStatus: 200,
  responseStatusText: "OK",
  responseLatencyMs: 240,
  responseHeaders: {
    "Content-Type": "application/json"
  },
  responseBody: {
    "ok": true,
    "result": {
      "message_id": 98412,
      "date": 1791804768,
      "chat": { "id": -1001928341, "username": "priya_sharma_care", "type": "supergroup" }
    }
  }
};

export const CHROME_SPEECH_EXCHANGE: HttpApiExchange = {
  railName: "Chrome Web Speech Telephony & Neural Audio Gateway",
  method: "GET",
  endpoint: "browser://web-speech/v1?lang=hi-IN&tts_synthesizer=Google_Devanagari",
  schemaStandard: "W3C Web Speech API Specification (hi-IN Streaming SpeechRecognition & SpeechSynthesis)",
  headers: {
    "Audio-Codec": "audio/pcm;rate=16000;channels=1",
    "Language": "hi-IN (Native Awadhi-Hindi)",
    "Engine": "Chrome Web Speech Engine (OS-Independent)"
  },
  requestBody: {
    "continuous": true,
    "interimResults": true,
    "lang": "hi-IN",
    "speechSynthesisVoice": "Google हिन्दी (hi-IN)",
    "pitch": 1.05,
    "rate": 0.98,
    "input_mode": "BIDIRECTIONAL_DUPLEX"
  },
  responseStatus: 200,
  responseStatusText: "OK STREAMING",
  responseLatencyMs: 38,
  responseHeaders: {
    "Content-Type": "audio/webm",
    "Engine-Status": "ACTIVE_LISTENING"
  },
  responseBody: {
    "status": "MEDIA_STREAM_ACTIVE",
    "activeEngine": "Chrome Web Speech API",
    "sttTranscriber": "webkitSpeechRecognition (hi-IN)",
    "ttsVoice": "Google हिन्दी",
    "punctuationSanitization": "ENABLED_NATURAL_PAUSES"
  }
};

export const createLlmExchange = (
  modelName: string,
  latencyMs: number,
  userPrompt: string,
  responseText: string
): HttpApiExchange => ({
  railName: `L3 Cognitive Reasoning Engine (${modelName})`,
  method: "POST",
  endpoint: modelName.toLowerCase().includes('gemini')
    ? "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent"
    : "https://openrouter.ai/api/v1/chat/completions",
  schemaStandard: "Google AI Studio REST v1beta / OpenRouter OpenAI Compatible Specification",
  headers: {
    "Authorization": "Bearer [SECURE_API_KEY]",
    "Content-Type": "application/json",
    "HTTP-Referer": "https://sambandh.ai"
  },
  requestBody: {
    "model": modelName,
    "temperature": 0.7,
    "max_tokens": 350,
    "prompt": userPrompt,
    "system_instruction": "Project Sambandh Awadhi-Hindi Elder Care Companion"
  },
  responseStatus: 200,
  responseStatusText: "OK",
  responseLatencyMs: latencyMs,
  responseHeaders: {
    "Content-Type": "application/json",
    "X-Model-Provider": modelName.toLowerCase().includes('gemini') ? "Google AI Studio" : "OpenRouter"
  },
  responseBody: {
    "candidates": [
      {
        "content": {
          "parts": [{ "text": responseText }],
          "role": "model"
        },
        "finishReason": "STOP"
      }
    ],
    "usageMetadata": {
      "promptTokenCount": Math.round(userPrompt.length / 3) + 120,
      "candidatesTokenCount": Math.round(responseText.length / 3),
      "totalTokenCount": Math.round((userPrompt.length + responseText.length) / 3) + 120
    }
  }
});

export const AMAZON_MCP_ORDER_EXCHANGE: HttpApiExchange = {
  railName: "Generic Connector Rail (Amazon MCP)",
  method: "POST",
  endpoint: "https://mcp.sambandh.internal/v1/connectors/amazon/orders",
  schemaStandard: "Model Context Protocol (MCP) Standard JSON-RPC Tool Call / Amazon SP-API",
  headers: {
    "Authorization": "Bearer [MOCK_MCP_AUTH_TOKEN]",
    "Content-Type": "application/json",
    "X-MCP-Tool": "amazon_place_order"
  },
  requestBody: {
    "tool": "amazon_place_order",
    "arguments": {
      "asin": "B08N5WRWNW",
      "title": "Dr. Morepen Digital Blood Pressure Monitor with Large Display",
      "quantity": 1,
      "price_inr": 1249.0,
      "delivery_address": "Flat 402, Block C, Pocket 2, Rohini Sector 8, Delhi 110085",
      "fiduciary_source": "Priya Sharma Sambandh Wallet Envelope",
      "authorized_by": "SAMBANDH_L3_AUTONOMOUS_CONNECTOR"
    }
  },
  responseStatus: 200,
  responseStatusText: "OK",
  responseLatencyMs: 340,
  responseHeaders: {
    "Content-Type": "application/json",
    "X-MCP-Execution-Id": "mcp_exec_az_889102"
  },
  responseBody: {
    "status": "ORDER_PLACED_AWAITING_RECEIPT",
    "amazon_order_id": "402-9918230-1829012",
    "estimated_delivery": "Tomorrow by 2:00 PM",
    "amount_deducted_inr": 1249.0,
    "remaining_wallet_balance_inr": 1251.0,
    "tracking_status": "ORDERED_NOT_RECEIVED",
    "seller": "Appario Retail Private Ltd"
  }
};

export const FLOWERS_POOJA_ORDER_EXCHANGE: HttpApiExchange = {
  railName: "Generic Connector Rail (Local Puja & Floral Quick Commerce)",
  method: "POST",
  endpoint: "https://mcp.sambandh.internal/v1/connectors/quick-commerce/orders",
  schemaStandard: "Model Context Protocol (MCP) Quick Commerce Hyperlocal Manifest v1.2",
  headers: {
    "Authorization": "Bearer [MOCK_MCP_AUTH_TOKEN]",
    "Content-Type": "application/json",
    "X-MCP-Tool": "quick_commerce_order_pooja_essentials"
  },
  requestBody: {
    "tool": "quick_commerce_order_pooja_essentials",
    "arguments": {
      "items": [
        { "name": "Fresh Marigold Genda & Rose Pooja Mala", "qty": 2, "cost": 120 },
        { "name": "Pure Sandalwood Tilak & Agarbatti Pack", "qty": 1, "cost": 90 }
      ],
      "total_amount_inr": 210.0,
      "delivery_slot": "Morning 07:00 AM (Before Daily Mandir Puja)",
      "delivery_address": "Flat 402, Block C, Pocket 2, Rohini Sector 8, Delhi 110085",
      "wallet_deduction_inr": 210.0
    }
  },
  responseStatus: 200,
  responseStatusText: "OK",
  responseLatencyMs: 165,
  responseHeaders: {
    "Content-Type": "application/json",
    "X-Hyperlocal-Store": "Rohini Sector 7 Mandir Phool Bhandar"
  },
  responseBody: {
    "status": "DISPATCH_CONFIRMED",
    "order_id": "PUJA_MANDIR_FLOWERS_20261012_01",
    "sla": "Delivering in 25 mins",
    "amount_debited_inr": 210.0,
    "status_lifecycle": "ORDERED_NOT_RECEIVED",
    "delivery_rider": "Suresh (Contact: +91 98711 00291)"
  }
};

export const TRANSCRIBER_MODE_EXCHANGE: HttpApiExchange = {
  railName: "In-Clinic Ambient Transcriber & Diarization Rail",
  method: "POST",
  endpoint: "https://abdm.gov.in/api/v1/clinical/ambient-transcriber/sync",
  schemaStandard: "ABDM FHIR R4 Ambient Consultation Extract & OPConsultNote",
  headers: {
    "Authorization": "Bearer [MOCK_ABDM_SANDBOX_TOKEN]",
    "Content-Type": "application/json",
    "X-Diarization-Speakers": "DOCTOR,PATIENT"
  },
  requestBody: {
    "clinic_name": "Apollo Clinic Rohini Sector 11",
    "practitioner": "Dr. Arvind Saxena (Cardiologist)",
    "patient_name": "Ramesh Chandra",
    "session_mode": "IN_CLINIC_SPEAKERPHONE_CAPTURE",
    "audio_stream_duration_sec": 384
  },
  responseStatus: 200,
  responseStatusText: "OK",
  responseLatencyMs: 290,
  responseHeaders: {
    "Content-Type": "application/fhir+json",
    "X-ABHA-Verification": "VERIFIED_ACTIVE"
  },
  responseBody: {
    "status": "SYNCED_TO_EHR",
    "fhir_bundle_id": "OPConsultNote/2026-1003-CLINIC",
    "clinical_findings": {
      "titrations": "Amlodipine 5mg titrated to 2.5mg; Atorvastatin 10mg added bedtime",
      "diagnosed_issues": ["Essential Hypertension", "Mild Grade-1 Knee Osteoarthritis"],
      "advice": "Daily 20m morning walk, restrict salt, repeat fasting lipid profile in 4 weeks"
    },
    "caregiver_brief_dispatched": true,
    "telegram_target": "@priya_sharma_care"
  }
};

export const NETMEDS_PHARMACY_ORDER_EXCHANGE: HttpApiExchange = {
  railName: "Netmeds B2B Partner Pharmacy Rail",
  method: "POST",
  endpoint: "https://partner-api.netmeds.com/v2/orders/prescription-fulfillment",
  schemaStandard: "Netmeds B2B REST v2.2 + SMTP Multi-Channel Dispatch (Schedule H)",
  headers: {
    "Authorization": "Bearer [MOCK_NETMEDS_PARTNER_KEY]",
    "X-Partner-Id": "SAMBANDH_HEALTH_L3",
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  requestBody: {
    "prescription_bundle_id": "OPConsultNote/2026-0814",
    "patient_abha_id": "91-8273-1928-4491",
    "patient_name": "Ramesh Chandra",
    "dispatch_channels": ["REST_API_WEBHOOK", "B2B_PHARMACY_EMAIL"],
    "patient_delivery_address": {
      "address_line": "Flat 402, Block C, Pocket 2, Rohini Sector 8",
      "city": "Delhi",
      "pincode": "110085",
      "pre_fed_by": "Priya Sharma (Caregiver)"
    },
    "nearest_fulfillment_pharmacy": {
      "store_id": "NETMEDS_DARKSTORE_ROHINI_11",
      "store_name": "Netmeds / Apollo DarkStore Sector 11",
      "address": "Plot 14, Community Centre, Sector 11, Rohini",
      "pincode": "110085",
      "contact_email": "orders.rohini11@netmeds.com"
    },
    "order_items": [
      { "molecule": "Telmisartan 40mg", "brand": "Telma 40", "quantity": 30, "price_inr": 680.0 },
      { "molecule": "Metformin 500mg", "brand": "Glycomet 500", "quantity": 30, "price_inr": 160.0 }
    ],
    "order_total_inr": 840.0,
    "order_total_limit_inr": 4500.0,
    "fiduciary_mandate": "Pine Labs Autopay UPI Token PL_MANDATE_DL_98102"
  },
  responseStatus: 200,
  responseStatusText: "OK",
  responseLatencyMs: 215,
  responseHeaders: {
    "Content-Type": "application/json",
    "X-Netmeds-Order-Id": "NMD-DEL-20261012-9901",
    "X-Dispatch-Email-Status": "SENT_250_OK"
  },
  responseBody: {
    "status": "ORDER_CONFIRMED_PACKED",
    "netmeds_order_id": "NMD-DEL-20261012-9901",
    "b2b_email_dispatch": {
      "recipient": "orders.rohini11@netmeds.com",
      "status": "DELIVERED_250_OK",
      "subject": "URGENT FULFILLMENT: Sambandh Elder Refill Order NMD-DEL-20261012-9901",
      "invoice_pdf_attached": true
    },
    "pickup_ready_timestamp": "2026-10-12T08:35:00+05:30",
    "pickup_location_address": "Plot 14, Community Centre, Sector 11, Rohini, Delhi 110085",
    "destination_address": "Flat 402, Block C, Pocket 2, Rohini Sector 8, Delhi 110085",
    "invoice_number": "NMD_INV_9812401",
    "amount_billed_inr": 840.0,
    "delhivery_cmu_pickup_requested": true,
    "courier_partner": "Delhivery Priority Healthcare Tier"
  }
};

export const HEALTH_LOCKER_QUERY_EXCHANGE: HttpApiExchange = {
  railName: "ABDM Health Locker & Pinecone RAG Rail",
  method: "POST",
  endpoint: "https://modal.run/sambandh-health-locker/query_health_locker",
  schemaStandard: "ABDM FHIR M3 & LangChain PineconeVectorStore v1.0",
  headers: {
    "Authorization": "Bearer [MODAL_OR_LOCAL_AUTH_TOKEN]",
    "Content-Type": "application/json",
    "X-Senior-ABHA": "91-8273-1928-4491",
    "X-Caller-Role": "caregiver"
  },
  requestBody: {
    "query": "Creatinine trajectory and active BP medications",
    "senior_id": "SENIOR_RAMESH_001",
    "caller_role": "caregiver",
    "mode": "auto",
    "top_k": 3
  },
  responseStatus: 200,
  responseStatusText: "OK",
  responseLatencyMs: 142,
  responseHeaders: {
    "Content-Type": "application/json",
    "X-Engine": "PostgreSQL-LangChain-Pinecone",
    "X-Similarity-Metric": "Cosine-Distance-384"
  },
  responseBody: {
    "status": "SUCCESS",
    "retrieved_chunks": [
      {
        "document_id": "DOC_LAB_2026_0905",
        "category": "lab_report",
        "title": "Comprehensive Metabolic & Renal Profile",
        "score": 0.892,
        "content_snippet": "Serum Creatinine: 1.10 mg/dL (Ref: 0.70 - 1.30 mg/dL) - NORMAL. eGFR: >75 mL/min."
      },
      {
        "document_id": "DOC_RX_2026_0910",
        "category": "prescription",
        "title": "Cardiology Follow-Up Prescription",
        "score": 0.865,
        "content_snippet": "Continue Telmisartan 40mg (1 OD morning post breakfast). Salt restriction advised."
      }
    ],
    "sources": [
      "Metropolis Metabolic Lab Report (05 Sep 2026)",
      "Dr. V. K. Sharma Cardiology Prescription (10 Sep 2026)"
    ],
    "structured_vitals": [
      { "vitalType": "creatinine", "valueNumeric": 1.10, "unit": "mg/dL", "trend": "STABLE" }
    ],
    "latency_ms": 142
  }
};

export const MEDGEMMA_ANALYSIS_EXCHANGE: HttpApiExchange = {
  railName: "Google MedGemma 4B Clinical Co-Pilot Rail",
  method: "POST",
  endpoint: "https://modal.run/sambandh-health-locker/medgemma_worker",
  schemaStandard: "MedGemma-4B-IT Guardrailed Inference Protocol",
  headers: {
    "Authorization": "Bearer [MODAL_A10G_GPU_TOKEN]",
    "Content-Type": "application/json",
    "X-Model-Id": "google/medgemma-4b-it",
    "X-Temperature": "0.15"
  },
  requestBody: {
    "prompt": "Evaluate Ramesh Ji's creatinine trajectory and active BP medications.",
    "context": "Serum Creatinine: 1.10 mg/dL. Active: Telmisartan 40mg 1 tab OD morning post breakfast. Low sodium diet.",
    "caller_role": "caregiver",
    "guardrails": {
      "zero_diagnosis_rule": true,
      "zero_titration_rule": true,
      "strict_ehr_grounding": true
    }
  },
  responseStatus: 200,
  responseStatusText: "OK",
  responseLatencyMs: 184,
  responseHeaders: {
    "Content-Type": "application/json",
    "X-Tokens-Evaluated": "342",
    "X-GPU-Device": "NVIDIA A10G"
  },
  responseBody: {
    "analysis": "Ramesh Ji's serum creatinine is stable at 1.10 mg/dL (Reference: 0.70 – 1.30 mg/dL), indicating well-maintained renal filtration (eGFR >75 mL/min). This profile remains safe for his ongoing Telmisartan 40mg daily morning regimen. Dr. Sharma's dietary salt restriction remains an active recommendation.",
    "tokens_evaluated": 342,
    "latency_ms": 184,
    "model": "google/medgemma-4b-it",
    "guardrail_status": {
      "is_non_prescriptive": true,
      "zero_diagnosis_passed": true,
      "tripwire_triggered": false
    }
  }
};

export const CAREGIVER_PRECALL_APPROVAL_EXCHANGE: HttpApiExchange = {
  railName: "Telegram Caregiver Pre-Call Agency Rail",
  method: "POST",
  endpoint: "https://api.telegram.org/bot6829104:AAFn_sambandh/sendMessage",
  schemaStandard: "Telegram Bot API v7.2 - Pre-Call Caregiver Consent Protocol",
  headers: {
    "Authorization": "Bearer [TELEGRAM_BOT_TOKEN_SAMBANDH]",
    "Content-Type": "application/json",
    "X-Consent-Protocol": "CAREGIVER_AGENCY_V1"
  },
  requestBody: {
    "chat_id": 9812491,
    "recipient": "Priya Sharma (@priya_sharma_care)",
    "notification_type": "PRE_CALL_AGENCY_GATE",
    "scheduled_time_ist": "08:30 IST",
    "senior_profile": {
      "name": "Ramesh Chandra",
      "relationship": "Father",
      "phone": "+91 98101 23456",
      "clinical_vitals_summary": "Omron BP 128/82 mmHg, Telmisartan stock: 6 days runway"
    },
    "message": "Namaste Priya. Today's 08:30 AM morning check-in with Papa is scheduled. Would you like to call him directly yourself today, or should Sambandh AI conduct the morning check-in?",
    "reply_markup": {
      "inline_keyboard": [
        [
          { "text": "📞 I will call Papa myself today", "callback_data": "PRECALL_CALL_MYSELF" },
          { "text": "🤖 Approve Sambandh AI Call", "callback_data": "PRECALL_APPROVE_AI" }
        ],
        [
          { "text": "⏰ Snooze check-in by 30 mins", "callback_data": "PRECALL_SNOOZE_30M" }
        ]
      ]
    }
  },
  responseStatus: 200,
  responseStatusText: "OK",
  responseLatencyMs: 88,
  responseHeaders: {
    "Content-Type": "application/json",
    "X-Telegram-Message-Id": "MSG_PRECALL_991823"
  },
  responseBody: {
    "ok": true,
    "result": {
      "message_id": 991823,
      "date": 1728711600,
      "status": "DELIVERED_TO_CAREGIVER",
      "caregiver_action_captured": "AGENT_AUTONOMOUS_CALL_APPROVED",
      "consent_timestamp": "08:28:14 IST",
      "agency_policy": "CAREGIVER_DELEGATED_TO_AI"
    }
  }
};
