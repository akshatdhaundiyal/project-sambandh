import { HttpApiExchange } from '../types/telemetry';
import {
  PINE_LABS_SUCCESS_EXCHANGE,
  PINE_LABS_LIMIT_EXCEEDED_EXCHANGE,
  DELHIVERY_SUCCESS_EXCHANGE,
  WHISPERFLO_DIAL_EXCHANGE,
  ABDM_RUNWAY_EXCHANGE,
  TELEGRAM_DISPATCH_EXCHANGE,
  NETMEDS_PHARMACY_ORDER_EXCHANGE,
  HEALTH_LOCKER_QUERY_EXCHANGE,
  MEDGEMMA_ANALYSIS_EXCHANGE
} from './apiExchanges';

export type ToolNodeType =
  | 'telephony'
  | 'llm'
  | 'generic_mcp'
  | 'abdm'
  | 'pharmacy'
  | 'fiduciary'
  | 'logistics'
  | 'caregiver'
  | 'health_locker_query'
  | 'medgemma_analysis';

export interface CatalogNodeType {
  type: ToolNodeType;
  title: string;
  brandName: string;
  shortName: string;
  tagline: string;
  brandColor: string;
  accentBg: string;
  borderClass: string;
}

export const NODE_CATALOG_LIST: CatalogNodeType[] = [
  {
    type: 'health_locker_query',
    title: 'ABDM Health Locker & Pinecone RAG',
    brandName: 'PostgreSQL / Pinecone VectorStore',
    shortName: 'Health Locker',
    tagline: 'Top-3 semantic clinical chunk retrieval filtered by senior ABHA identifier',
    brandColor: '#0D9488',
    accentBg: 'bg-teal-50 text-teal-900',
    borderClass: 'border-teal-200'
  },
  {
    type: 'medgemma_analysis',
    title: 'Google MedGemma 4B Clinical Co-Pilot',
    brandName: 'Google MedGemma-4B-IT',
    shortName: 'MedGemma Co-Pilot',
    tagline: 'Analytical clinical co-pilot strictly enforcing Zero-Diagnosis & Non-Prescriptive rules',
    brandColor: '#7E22CE',
    accentBg: 'bg-purple-50 text-purple-900',
    borderClass: 'border-purple-200'
  },
  {
    type: 'llm',
    title: 'L3 Cognitive Reasoning Engine',
    brandName: 'Google Gemini & OpenRouter',
    shortName: 'Cognitive LLM',
    tagline: 'Multi-turn clinical intention parsing, safety guardrails & empathetic Awadhi synthesis',
    brandColor: '#9333EA',
    accentBg: 'bg-purple-50 text-purple-900',
    borderClass: 'border-purple-200'
  },
  {
    type: 'telephony',
    title: 'Telephony & Neural Voice',
    brandName: 'Chrome Web Speech / WhisperFlo',
    shortName: 'Voice Gateway',
    tagline: 'Duplex streaming speech recognition and character-tuned Hindi synthesis',
    brandColor: '#10B981',
    accentBg: 'bg-emerald-50 text-emerald-900',
    borderClass: 'border-emerald-200'
  },
  {
    type: 'generic_mcp',
    title: 'Generic API & MCP Connector',
    brandName: 'Model Context Protocol (MCP)',
    shortName: 'MCP Connector',
    tagline: 'Arbitrary vendor order routing for Amazon, Quick Commerce, and Pooja essentials',
    brandColor: '#F59E0B',
    accentBg: 'bg-amber-50 text-amber-900',
    borderClass: 'border-amber-200'
  },
  {
    type: 'abdm',
    title: 'Clinical & FHIR Runway',
    brandName: 'ABDM Health Authority',
    shortName: 'ABDM Health',
    tagline: 'Government digital health prescription & pill runway audit',
    brandColor: '#0D9488',
    accentBg: 'bg-teal-50 text-teal-900',
    borderClass: 'border-teal-200'
  },
  {
    type: 'pharmacy',
    title: 'Partner Pharmacy B2B Rail',
    brandName: 'Netmeds / Apollo B2B Partner Rail',
    shortName: 'Netmeds Rail',
    tagline: 'Prescription verification, inventory reservation & invoice generation at nearest pharmacy',
    brandColor: '#059669',
    accentBg: 'bg-emerald-50 text-emerald-900',
    borderClass: 'border-emerald-200'
  },
  {
    type: 'fiduciary',
    title: 'Fiduciary Payment Mandate',
    brandName: 'Pine Labs Plural',
    shortName: 'Pine Labs',
    tagline: 'HMAC-SHA256 authenticated UPI mandate auto-debit',
    brandColor: '#007A3D',
    accentBg: 'bg-emerald-50 text-emerald-900',
    borderClass: 'border-emerald-200'
  },
  {
    type: 'logistics',
    title: 'Express Delivery Logistics',
    brandName: 'Delhivery CMU',
    shortName: 'Delhivery CMU',
    tagline: 'Apollo DarkStore courier booking & same-day SLA tracking',
    brandColor: '#E41C38',
    accentBg: 'bg-red-50 text-red-900',
    borderClass: 'border-red-200'
  },
  {
    type: 'caregiver',
    title: 'Caregiver Concierge',
    brandName: 'Telegram MTProto Bot',
    shortName: 'Telegram Bot',
    tagline: 'Family briefing, audio wisdom story & 1-tap consent cards',
    brandColor: '#24A1DE',
    accentBg: 'bg-sky-50 text-sky-900',
    borderClass: 'border-sky-200'
  }
];

export interface ToolExecutionNode {
  id: string;
  stepIndex: number;
  nodeType: ToolNodeType;
  brandName: string;
  toolName: string;
  title: string;
  actionSummary: string;
  timestamp: string;
  status: 'SUCCESS' | 'ACTIVE' | 'BLOCKED' | 'TERMINATED';
  statusCode: string;
  latencyMs: number;
  apiExchange: HttpApiExchange;
  reasoningSnippet: string;
  brandColor: string;
}

// Master node repository mapped by scenario
export const SCENARIO_NODE_REGISTRY: Record<string, ToolExecutionNode[]> = {
  'scenario-1': [
    {
      id: 'node-s1-1',
      stepIndex: 0,
      nodeType: 'telephony',
      brandName: 'WhisperFlo Engine',
      toolName: 'whisperflo_telephony_dial',
      title: 'Outbound SIP Dial Initiation',
      actionSummary: 'Placed call to +91 98101 23456 over Jio PSTN trunk. Biometric match: 98.2%.',
      timestamp: '08:30:02 IST',
      status: 'SUCCESS',
      statusCode: '200 SIP OK',
      latencyMs: 114,
      apiExchange: WHISPERFLO_DIAL_EXCHANGE,
      reasoningSnippet: 'Scheduler 08:30 IST window active. Ingesting baseline profile for Ramesh Chandra.',
      brandColor: '#4F46E5'
    },
    {
      id: 'node-s1-2',
      stepIndex: 1,
      nodeType: 'telephony',
      brandName: 'WhisperFlo Engine',
      toolName: 'whisperflo_stt_stream',
      title: 'Lane 1: Mentorship Speech Processing',
      actionSummary: 'Streaming audio processed in Awadhi-Hindi. Elder shared railway interlocking advice.',
      timestamp: '08:30:45 IST',
      status: 'SUCCESS',
      statusCode: 'STREAMING HD',
      latencyMs: 118,
      apiExchange: WHISPERFLO_DIAL_EXCHANGE,
      reasoningSnippet: 'Social vitality verified: 94% positive sentiment. Contextual bridge established.',
      brandColor: '#4F46E5'
    },
    {
      id: 'node-s1-3',
      stepIndex: 2,
      nodeType: 'telephony',
      brandName: 'WhisperFlo Engine',
      toolName: 'whisperflo_stt_stream',
      title: 'Lane 2: Oral Adherence Recall',
      actionSummary: 'Speech parsed: confirmed morning BP pill (Telma 40) taken with breakfast.',
      timestamp: '08:31:30 IST',
      status: 'SUCCESS',
      statusCode: 'VERIFIED',
      latencyMs: 122,
      apiExchange: WHISPERFLO_DIAL_EXCHANGE,
      reasoningSnippet: 'Medication recall verified. Ingesting ABDM digital health runway.',
      brandColor: '#4F46E5'
    },
    {
      id: 'node-s1-4',
      stepIndex: 3,
      nodeType: 'abdm',
      brandName: 'ABDM Health Authority',
      toolName: 'abdm_inventory_eval',
      title: 'FHIR Prescription Inventory Audit',
      actionSummary: 'Verified 4 units remaining (4 days runway). Reorder triggered (< 5 day threshold).',
      timestamp: '08:32:05 IST',
      status: 'SUCCESS',
      statusCode: 'RUNWAY < 5D',
      latencyMs: 84,
      apiExchange: ABDM_RUNWAY_EXCHANGE,
      reasoningSnippet: 'ABDM OPConsultNote/2026-0814 checked. Refill cost ₹840 <= ₹4,500 ceiling.',
      brandColor: '#0D9488'
    },
    {
      id: 'node-s1-5',
      stepIndex: 4,
      nodeType: 'fiduciary',
      brandName: 'Pine Labs Plural',
      toolName: 'pine_labs_mandate_debit',
      title: 'Autonomous Payment Capture (₹840.00)',
      actionSummary: 'Auto-debit of ₹840.00 captured under mandate PINE_MANDATE_DL_98102. Headroom: ₹3,660.00.',
      timestamp: '08:32:20 IST',
      status: 'SUCCESS',
      statusCode: '200 OK CAPTURED',
      latencyMs: 310,
      apiExchange: PINE_LABS_SUCCESS_EXCHANGE,
      reasoningSnippet: 'Mandate settled in 310ms. Headroom preserved. Zero elder or family friction.',
      brandColor: '#007A3D'
    },
    {
      id: 'node-s1-5b',
      stepIndex: 5,
      nodeType: 'pharmacy',
      brandName: 'Netmeds / Apollo B2B Rail',
      toolName: 'netmeds_order_dispatch',
      title: 'Nearest Partner Pharmacy Order Placed',
      actionSummary: 'Dispatched electronic prescription & order to Netmeds DarkStore Sector 11 (Plot 14, Rohini). Packed & ready for courier.',
      timestamp: '08:32:28 IST',
      status: 'SUCCESS',
      statusCode: '200 ORDER PACKED',
      latencyMs: 215,
      apiExchange: NETMEDS_PHARMACY_ORDER_EXCHANGE,
      reasoningSnippet: 'Pre-fed nearest pharmacy location selected by caregiver Priya Sharma. Auto-generates invoice NMD_INV_9812401.',
      brandColor: '#059669'
    },
    {
      id: 'node-s1-6',
      stepIndex: 5,
      nodeType: 'logistics',
      brandName: 'Delhivery CMU',
      toolName: 'delhivery_cmu_dispatch',
      title: 'Express Doorstep Courier Booking',
      actionSummary: 'Booked pickup at Netmeds DarkStore Sector 11 ➔ drop to Flat 402, Rohini Sector 8. Waybill: DLV-98234-DEL. ETA: Today 4:00 PM.',
      timestamp: '08:32:35 IST',
      status: 'SUCCESS',
      statusCode: '200 MANIFESTED',
      latencyMs: 195,
      apiExchange: DELHIVERY_SUCCESS_EXCHANGE,
      reasoningSnippet: 'Pickup location matched to Netmeds DarkStore; delivery drop matched to pre-fed elder home address.',
      brandColor: '#E41C38'
    },
    {
      id: 'node-s1-7',
      stepIndex: 5,
      nodeType: 'caregiver',
      brandName: 'Telegram MTProto Bot',
      toolName: 'telegram_caregiver_brief',
      title: 'Family Briefing & Audio Story Card',
      actionSummary: 'Telegram summary delivered to Priya with 30s audio story snippet and live order tracking.',
      timestamp: '08:32:48 IST',
      status: 'SUCCESS',
      statusCode: 'DELIVERED',
      latencyMs: 240,
      apiExchange: TELEGRAM_DISPATCH_EXCHANGE,
      reasoningSnippet: 'Priya reassured on high vitality, verified adherence, and doorstep delivery.',
      brandColor: '#24A1DE'
    },
    {
      id: 'node-s1-hl',
      stepIndex: 3,
      nodeType: 'health_locker_query',
      brandName: 'ABDM Health Locker & Pinecone RAG',
      toolName: 'pinecone_vector_search',
      title: 'Health Locker Semantic Chunk Retrieval',
      actionSummary: 'Retrieved top-3 clinical chunks from Dr. V. K. Sharma cardiology record and Metropolis lab report.',
      timestamp: '08:32:10 IST',
      status: 'SUCCESS',
      statusCode: '200 OK (142ms)',
      latencyMs: 142,
      apiExchange: HEALTH_LOCKER_QUERY_EXCHANGE,
      reasoningSnippet: 'Queried vector store filtered by senior_id: SENIOR_RAMESH_001. Top score: 0.892 (Metropolis Renal Profile).',
      brandColor: '#0D9488'
    },
    {
      id: 'node-s1-mg',
      stepIndex: 3,
      nodeType: 'medgemma_analysis',
      brandName: 'Google MedGemma 4B',
      toolName: 'medgemma_clinical_copilot',
      title: 'MedGemma 4B Clinical Co-Pilot Reasoning',
      actionSummary: 'Synthesized plain-language adherence and dietary guidance. Zero-Diagnosis & Non-Prescriptive rules passed.',
      timestamp: '08:32:15 IST',
      status: 'SUCCESS',
      statusCode: '200 OK (184ms)',
      latencyMs: 184,
      apiExchange: MEDGEMMA_ANALYSIS_EXCHANGE,
      reasoningSnippet: 'Non-prescriptive explanation of Telmisartan 40mg morning timing and low-sodium restrictions.',
      brandColor: '#7E22CE'
    }
  ],

  'scenario-2': [
    {
      id: 'node-s2-1',
      stepIndex: 0,
      nodeType: 'telephony',
      brandName: 'WhisperFlo Engine',
      toolName: 'whisperflo_telephony_dial',
      title: 'Outbound Check-In Call Placed',
      actionSummary: 'Connected to Ramesh Chandra (+91 98101 23456). Carrier: Jio Delhi PSTN.',
      timestamp: '08:30:02 IST',
      status: 'SUCCESS',
      statusCode: '200 SIP OK',
      latencyMs: 114,
      apiExchange: WHISPERFLO_DIAL_EXCHANGE,
      reasoningSnippet: 'Daily call initiated on schedule. Vitality baseline active.',
      brandColor: '#4F46E5'
    },
    {
      id: 'node-s2-2',
      stepIndex: 1,
      nodeType: 'abdm',
      brandName: 'ABDM Health Authority',
      toolName: 'abdm_inventory_eval',
      title: 'Inventory Runway Evaluation: 22 Days',
      actionSummary: 'Elder confirms 22 days of medication safe in cabinet. Runway > 5 days.',
      timestamp: '08:31:50 IST',
      status: 'SUCCESS',
      statusCode: 'STOCK SAFE (>5D)',
      latencyMs: 82,
      apiExchange: ABDM_RUNWAY_EXCHANGE,
      reasoningSnippet: 'Refill criteria NOT met. Payment mandate remains strictly IDLE.',
      brandColor: '#0D9488'
    },
    {
      id: 'node-s2-3',
      stepIndex: 2,
      nodeType: 'caregiver',
      brandName: 'Telegram MTProto Bot',
      toolName: 'telegram_caregiver_brief',
      title: 'Vitality Reassurance Briefing',
      actionSummary: 'Priya notified: Papa in spirited mood (Vitality: 96%). Medicine cabinet safe.',
      timestamp: '08:33:05 IST',
      status: 'SUCCESS',
      statusCode: 'DELIVERED',
      latencyMs: 210,
      apiExchange: TELEGRAM_DISPATCH_EXCHANGE,
      reasoningSnippet: 'Transparent reassurance delivered. Zero charges made.',
      brandColor: '#24A1DE'
    }
  ],

  'scenario-3': [
    {
      id: 'node-s3-1',
      stepIndex: 0,
      nodeType: 'telephony',
      brandName: 'WhisperFlo Engine',
      toolName: 'whisperflo_telephony_dial',
      title: 'Mentorship Bridge Connected',
      actionSummary: 'Sambandh asynchronous mentorship prompt delivered to elder. Papa shared 4-minute railway wisdom story.',
      timestamp: '08:30:02 IST',
      status: 'SUCCESS',
      statusCode: '200 CONNECTED',
      latencyMs: 114,
      apiExchange: WHISPERFLO_DIAL_EXCHANGE,
      reasoningSnippet: 'Sambandh application acts as secure intermediary between youth and senior.',
      brandColor: '#4F46E5'
    },
    {
      id: 'node-s3-2',
      stepIndex: 1,
      nodeType: 'llm',
      brandName: 'Google Gemini & OpenRouter',
      toolName: 'mentorship_summarizer',
      title: 'Intergenerational Wisdom Synthesis',
      actionSummary: 'Synthesized Papa\'s 4-minute story into mentorship archive for youth mentee in Pune.',
      timestamp: '08:30:45 IST',
      status: 'SUCCESS',
      statusCode: '200 SYNTHESIZED',
      latencyMs: 240,
      apiExchange: TELEGRAM_DISPATCH_EXCHANGE,
      reasoningSnippet: 'Intermediary architecture eliminates need for live caller filters while preserving elder dignity.',
      brandColor: '#9333EA'
    },
    {
      id: 'node-s3-3',
      stepIndex: 2,
      nodeType: 'caregiver',
      brandName: 'Telegram MTProto Bot',
      toolName: 'telegram_mentorship_card',
      title: 'Caregiver Daily Story & Vitality Digest',
      actionSummary: 'Delivered 30s audio wisdom snippet to Priya on Telegram. Papa\'s mood: spirited & cheerful.',
      timestamp: '08:31:05 IST',
      status: 'SUCCESS',
      statusCode: 'DELIVERED',
      latencyMs: 190,
      apiExchange: TELEGRAM_DISPATCH_EXCHANGE,
      reasoningSnippet: 'Daughter receives daily warm touchpoint without intrusive clinical monitoring.',
      brandColor: '#24A1DE'
    }
  ],

  'scenario-4': [
    {
      id: 'node-s4-1',
      stepIndex: 0,
      nodeType: 'abdm',
      brandName: 'ABDM Health Authority',
      toolName: 'abdm_inventory_eval',
      title: '90-Day Bulk Refill Price Ingestion',
      actionSummary: 'Pharmacy returned quarterly pack quote of ₹5,600.00 for Telma 40 + Glycomet 500.',
      timestamp: '08:31:40 IST',
      status: 'SUCCESS',
      statusCode: 'QUOTE ₹5,600',
      latencyMs: 90,
      apiExchange: ABDM_RUNWAY_EXCHANGE,
      reasoningSnippet: 'Quote exceeds pre-authorized monthly spending cap of ₹4,500.00 by ₹1,100.00.',
      brandColor: '#0D9488'
    },
    {
      id: 'node-s4-2',
      stepIndex: 1,
      nodeType: 'fiduciary',
      brandName: 'Pine Labs Plural',
      toolName: 'pine_labs_mandate_debit',
      title: 'Fiduciary Rail Safety Intercept',
      actionSummary: 'Auto-debit HALTED under L3 spending rules. Mandate returned 402 Limit Exceeded.',
      timestamp: '08:31:48 IST',
      status: 'BLOCKED',
      statusCode: '402 LIMIT EXCEEDED',
      latencyMs: 280,
      apiExchange: PINE_LABS_LIMIT_EXCEEDED_EXCHANGE,
      reasoningSnippet: 'Hard fiduciary ceiling enforced. Autonomous debit forbidden without human consent.',
      brandColor: '#007A3D'
    },
    {
      id: 'node-s4-3',
      stepIndex: 1,
      nodeType: 'caregiver',
      brandName: 'Telegram MTProto Bot',
      toolName: 'telegram_stepup_brief',
      title: '1-Tap UPI Mandate Authorization Card',
      actionSummary: 'Interactive approval card routed to Priya on Telegram to approve ₹5,600 or fallback to 30-day.',
      timestamp: '08:31:55 IST',
      status: 'ACTIVE',
      statusCode: 'ACTION REQUIRED',
      latencyMs: 220,
      apiExchange: TELEGRAM_DISPATCH_EXCHANGE,
      reasoningSnippet: 'Fiduciary sovereignty preserved for family with 1-tap consent buttons.',
      brandColor: '#24A1DE'
    }
  ],

  'scenario-5': [
    {
      id: 'node-s5-1',
      stepIndex: 0,
      nodeType: 'telephony',
      brandName: 'WhisperFlo Engine',
      toolName: 'whisperflo_telephony_dial',
      title: 'Morning Call Check Connected',
      actionSummary: 'Call connected to Ramesh Chandra (+91 98101 23456).',
      timestamp: '08:30:02 IST',
      status: 'SUCCESS',
      statusCode: '200 OK',
      latencyMs: 114,
      apiExchange: WHISPERFLO_DIAL_EXCHANGE,
      reasoningSnippet: 'Routine check-in window active.',
      brandColor: '#4F46E5'
    },
    {
      id: 'node-s5-2',
      stepIndex: 1,
      nodeType: 'abdm',
      brandName: 'ABDM Health Authority',
      toolName: 'clinical_escalation_rail',
      title: 'No-Medical-Advice Safety Protocol',
      actionSummary: 'Elder reported chest tightness & sweating. System refrains from prescribing; comforts elder.',
      timestamp: '08:30:58 IST',
      status: 'ACTIVE',
      statusCode: 'PROTOCOL ACTIVE',
      latencyMs: 95,
      apiExchange: ABDM_RUNWAY_EXCHANGE,
      reasoningSnippet: 'Zero diagnostic speculation. Emergency escalation triggered instantly.',
      brandColor: '#0D9488'
    },
    {
      id: 'node-s5-3',
      stepIndex: 2,
      nodeType: 'caregiver',
      brandName: 'Telegram MTProto Bot',
      toolName: 'telegram_emergency_alert',
      title: 'Urgent Red Alert with 1-Tap Call',
      actionSummary: 'Emergency alert dispatched to Priya with 1-tap direct call to Papa and Dr. Saxena.',
      timestamp: '08:31:15 IST',
      status: 'SUCCESS',
      statusCode: 'CRITICAL ALERT',
      latencyMs: 190,
      apiExchange: TELEGRAM_DISPATCH_EXCHANGE,
      reasoningSnippet: 'Immediate family connection prioritized over all automated tasks.',
      brandColor: '#24A1DE'
    }
  ]
};

// Returns chronological list of nodes pulled into the chain up to current step
export const getNodesForScenarioStep = (
  scenarioId: string,
  stepIndex: number,
  callStatus: 'idle' | 'calling' | 'active' | 'ended' = 'active'
): ToolExecutionNode[] => {
  // The initial node should be generated ONLY when call is initiated (Point 5)
  if (callStatus === 'idle') {
    return [];
  }
  const nodes = SCENARIO_NODE_REGISTRY[scenarioId] || SCENARIO_NODE_REGISTRY['scenario-1'];
  return nodes.filter(n => n.stepIndex <= stepIndex);
};
