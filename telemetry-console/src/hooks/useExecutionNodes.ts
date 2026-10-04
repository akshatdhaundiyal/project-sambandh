/**
 * useExecutionNodes — Manages dynamic tool execution graph and domain rail detection.
 * Extracted from TelemetryContext to isolate node lifecycle and deduplication.
 */
import { useState, useCallback } from 'react';
import { ToolExecutionNode, SCENARIO_NODE_REGISTRY } from '../data/nodeMapping';
import { SimulationPreset, resolvePresetNodes } from '../data/simulationPrompts';
import {
  MEDICATION_KEYWORDS,
  FINANCIAL_KEYWORDS,
  LOGISTICS_KEYWORDS,
  FAMILY_KEYWORDS,
  CRITICAL_EMERGENCY_KEYWORDS,
  FALL_KEYWORDS,
  MEDICATION_STOP_KEYWORDS,
  ADHERENCE_CONFIRMATION_KEYWORDS,
  matchesKeywords
} from '../data/keywords';
import {
  createLlmExchange,
  CHROME_SPEECH_EXCHANGE,
  GNANI_TELEPHONY_EXCHANGE,
  HEALTH_LOCKER_QUERY_EXCHANGE,
  MEDGEMMA_ANALYSIS_EXCHANGE,
  CAREGIVER_PRECALL_APPROVAL_EXCHANGE,
  ABDM_RUNWAY_EXCHANGE
} from '../data/apiExchanges';

export const useExecutionNodes = () => {
  const [dynamicExecutionNodes, setDynamicExecutionNodes] = useState<ToolExecutionNode[]>([]);

  const clearDynamicNodes = useCallback(() => {
    setDynamicExecutionNodes([]);
  }, []);

  const addUniqueNodes = useCallback((newNodes: ToolExecutionNode[]) => {
    setDynamicExecutionNodes(prev => {
      const existingTitles = new Set(prev.map(n => n.title));
      const fresh = newNodes.filter(n => !existingTitles.has(n.title));
      return [...prev, ...fresh];
    });
  }, []);

  /**
   * Seeds the initial Telephony audio node when a live call connects.
   */
  const seedInitialCallNode = useCallback((isBrowser: boolean) => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    setDynamicExecutionNodes([
      {
        id: `node-audio-initial-${Date.now()}`,
        stepIndex: 0,
        nodeType: 'telephony',
        brandName: isBrowser ? 'Browser Web Speech API' : 'Gnani.ai Indic Voice Rail',
        toolName: isBrowser ? 'web_speech_recognition' : 'gnani_telephony_full_duplex',
        title: isBrowser ? 'Browser Audio Pipeline' : 'Gnani.ai Carrier STT/TTS',
        actionSummary: isBrowser
          ? 'Streaming audio through in-browser Web Speech API engine.'
          : 'SIP audio trunk bridged via Gnani.ai Awadhi full-duplex stream.',
        timestamp,
        status: 'SUCCESS',
        statusCode: 'STREAM ACTIVE',
        latencyMs: 114,
        apiExchange: isBrowser ? CHROME_SPEECH_EXCHANGE : GNANI_TELEPHONY_EXCHANGE,
        reasoningSnippet: isBrowser
          ? 'Browser Web Speech bidirectional duplex streaming active with punctuation sanitization.'
          : 'Gnani.ai carrier SIP trunk bridged on Jio Delhi-NCR with 114ms VAD and instant barge-in.',
        brandColor: '#0EA5E9'
      }
    ]);
  }, []);

  /**
   * Creates an L3 Cognitive Reasoning Node for an LLM inference result.
   */
  const createLlmNode = useCallback((
    modelDisplayName: string,
    latencyMs: number,
    prompt: string,
    response: string
  ): ToolExecutionNode => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    return {
      id: `node-llm-${Date.now()}`,
      stepIndex: 1,
      nodeType: 'llm',
      brandName: modelDisplayName,
      toolName: modelDisplayName.toLowerCase().includes('gemini') ? 'gemini_intent_reasoning' : 'openrouter_chat_completion',
      title: `L3 Cognitive Reasoning (${modelDisplayName})`,
      actionSummary: `Evaluated clinical intent against ABDM runway, fiduciary limit, and Awadhi empathy in ${latencyMs}ms.`,
      timestamp,
      status: 'SUCCESS',
      statusCode: `200 OK (${latencyMs}ms)`,
      latencyMs,
      apiExchange: createLlmExchange(modelDisplayName, latencyMs, prompt, response),
      reasoningSnippet: 'Multi-turn context parsed. Clinical boundaries confirmed. Empathetic elder phrasing synthesized.',
      brandColor: '#9333EA'
    };
  }, []);

  /**
   * Detects domain rail nodes (ABDM, Pine Labs, Delhivery, Caregiver Telegram)
   * from full conversation context using shared keyword sets.
   */
  /**
   * Detects domain rail nodes (ABDM, Pine Labs, Delhivery, Caregiver Telegram)
   * from full conversation context using shared keyword sets and clinical safety rules.
   */
  const detectDomainNodes = useCallback((contextText: string, spendingCapInr: number = 4500): ToolExecutionNode[] => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    const detected: ToolExecutionNode[] = [];
    const normalized = contextText.toLowerCase();

    // 1. CRITICAL MEDICAL EMERGENCY & FALL DETECTION (Highest Priority)
    if (matchesKeywords(normalized, CRITICAL_EMERGENCY_KEYWORDS) || matchesKeywords(normalized, FALL_KEYWORDS)) {
      const emergencyAbdm = SCENARIO_NODE_REGISTRY['scenario-5']?.find(n => n.nodeType === 'abdm');
      if (emergencyAbdm) {
        detected.push({
          ...emergencyAbdm,
          id: `node-emergency-protocol-${Date.now()}`,
          timestamp
        });
      }
      const emergencyTg = SCENARIO_NODE_REGISTRY['scenario-5']?.find(n => n.nodeType === 'caregiver');
      if (emergencyTg) {
        detected.push({
          ...emergencyTg,
          id: `node-emergency-alert-${Date.now()}`,
          timestamp
        });
      }
      return detected;
    }

    // 2. MEDICATION STOPPAGE / NON-ADHERENCE ALERT
    if (matchesKeywords(normalized, MEDICATION_STOP_KEYWORDS)) {
      detected.push({
        id: `node-adherence-alert-${Date.now()}`,
        stepIndex: 1,
        nodeType: 'abdm',
        brandName: 'ABDM Clinical Safety Rail',
        toolName: 'clinical_adherence_interceptor',
        title: 'Medication Discontinuation Safety Rail',
        actionSummary: 'Elder reported discontinuing BP medication. Autonomous system enforces no unapproved titration rule and alerts Dr. Saxena & Rohan.',
        timestamp,
        status: 'BLOCKED',
        statusCode: 'NON-ADHERENCE WARNING',
        latencyMs: 82,
        brandColor: '#E11D48',
        reasoningSnippet: 'Elder reported dizziness/stoppage. Prescribing/titration forbidden. Cardiologist review dispatched.',
        apiExchange: ABDM_RUNWAY_EXCHANGE
      });
      const tgAlert = SCENARIO_NODE_REGISTRY['scenario-5']?.find(n => n.nodeType === 'caregiver');
      if (tgAlert) {
        detected.push({
          ...tgAlert,
          id: `node-tg-adherence-${Date.now()}`,
          title: 'Adherence Warning Dispatched to Rohan',
          actionSummary: 'Urgent Telegram notification sent: Papa stopped BP meds due to dizziness. Recommended Dr. Saxena follow-up.',
          timestamp
        });
      }
      return detected;
    }

    // 3. ROUTINE ADHERENCE CONFIRMATION (Taking pill is good news, NOT low stock!)
    const isAdherenceConfirmation = matchesKeywords(normalized, ADHERENCE_CONFIRMATION_KEYWORDS);

    if (isAdherenceConfirmation) {
      detected.push({
        id: `node-adherence-confirmed-${Date.now()}`,
        stepIndex: 1,
        nodeType: 'abdm',
        brandName: 'ABDM Health Authority',
        toolName: 'oral_adherence_audit',
        title: 'Oral Adherence Verified (Telma-40 Taken)',
        actionSummary: 'Ramesh confirmed taking morning BP medication post-breakfast with water. Stock inventory unaffected.',
        timestamp,
        status: 'SUCCESS',
        statusCode: 'ADHERENCE CONFIRMED',
        latencyMs: 64,
        brandColor: '#059669',
        reasoningSnippet: 'Daily BP adherence ground-truthed. Fiduciary rails remain idle.',
        apiExchange: ABDM_RUNWAY_EXCHANGE
      });
      return detected;
    }

    // 4. LOW STOCK / REFILL TRIGGER
    if (matchesKeywords(normalized, MEDICATION_KEYWORDS)) {
      const isRefillOrLowStock = matchesKeywords(normalized, [
        'khatam', 'bachi', 'bache', 'refill', 'stock', 'kam pad', 'sirf 3', 'sirf 2', 'sirf 1', '3 bachi', '2 bachi', '1 bachi',
        'order kar', 'mangwa do', 'bhej do', 'parcha khatam', 'dawa khatam', 'goli khatam',
        'पर्चा खत्म', 'खत्म हो', 'बची हैं', 'कम हैं', 'सिर्फ 3', 'सिर्फ 2', 'मंगवा दो', 'ऑर्डर कर'
      ]);

      const abdm = SCENARIO_NODE_REGISTRY['scenario-1']?.find(n => n.nodeType === 'abdm');
      if (abdm) {
        detected.push({
          ...abdm,
          id: `node-abdm-${Date.now()}`,
          timestamp
        });
      }

      if (isRefillOrLowStock) {
        const refillCost = 840;
        const capExceeded = refillCost > spendingCapInr;

        if (capExceeded) {
          // Exceeds caregiver's configured cap -> HALT and request step-up approval!
          const haltNode = SCENARIO_NODE_REGISTRY['scenario-4']?.find(n => n.nodeType === 'fiduciary');
          if (haltNode) {
            detected.push({
              ...haltNode,
              id: `node-pine-cap-${Date.now()}`,
              actionSummary: `Auto-debit HALTED: ₹${refillCost} exceeds Rohan's configured cap of ₹${spendingCapInr}. Mandate returned 402 Limit Exceeded.`,
              timestamp
            });
          }
          const stepUpCard = SCENARIO_NODE_REGISTRY['scenario-4']?.find(n => n.nodeType === 'caregiver');
          if (stepUpCard) {
            detected.push({
              ...stepUpCard,
              id: `node-tg-stepup-${Date.now()}`,
              timestamp
            });
          }
        } else {
          // HITL Mandate: Even within cap, autonomous ordering requires caregiver approval first!
          detected.push({
            id: `node-refill-gate-${Date.now()}`,
            stepIndex: 2,
            nodeType: 'caregiver',
            brandName: 'HITL Caregiver Gate',
            toolName: 'request_medication_refill',
            title: 'Caregiver Approval Required (₹840 Refill)',
            actionSummary: 'Low stock reported for Telma 40mg. Ordering paused. High-priority approval card dispatched to Rohan Sharma (Bangalore).',
            timestamp,
            status: 'ACTIVE',
            statusCode: 'AWAITING APPROVAL',
            latencyMs: 35,
            brandColor: '#F59E0B',
            reasoningSnippet: '[HITL GATE ENFORCED]: Autonomous medication ordering requires caregiver sign-off. Tools (Netmeds/Delhivery/PineLabs) will execute upon approval.',
            apiExchange: {
              railName: 'HITL Caregiver Refill Approval Rail',
              method: 'POST',
              endpoint: 'https://api.sambandh.ai/v1/caregiver/approvals/refill-request',
              schemaStandard: 'Sambandh HITL Safety Rail v2',
              headers: { 'Content-Type': 'application/json' },
              requestBody: {
                senior_name: 'Ramesh Chandra',
                medication: 'Telma 40mg (Telmisartan)',
                quantity: 30,
                estimated_cost_inr: 840,
                vendor: 'Netmeds DarkStore Sector 11',
                courier: 'Delhivery CMU',
                status: 'AWAITING_CAREGIVER_APPROVAL'
              },
              responseStatus: 202,
              responseStatusText: 'Accepted (Awaiting Decision)',
              responseLatencyMs: 35,
              responseHeaders: { 'Content-Type': 'application/json' },
              responseBody: {
                approval_id: `apr-${Date.now()}`,
                status: 'AWAITING_APPROVAL',
                notified_channels: ['CAREGIVER_MOBILE_APP', 'TELEGRAM_BOT_API']
              }
            }
          });
        }
      }
    } else {
      if (matchesKeywords(normalized, FINANCIAL_KEYWORDS)) {
        const pine = SCENARIO_NODE_REGISTRY['scenario-1']?.find(n => n.nodeType === 'fiduciary');
        if (pine) {
          detected.push({
            ...pine,
            id: `node-pine-${Date.now()}`,
            timestamp
          });
        }
      }

      if (matchesKeywords(normalized, LOGISTICS_KEYWORDS)) {
        const dlv = SCENARIO_NODE_REGISTRY['scenario-1']?.find(n => n.nodeType === 'logistics');
        if (dlv) {
          detected.push({
            ...dlv,
            id: `node-dlv-${Date.now()}`,
            timestamp
          });
        }
      }

      if (matchesKeywords(normalized, FAMILY_KEYWORDS)) {
        const tg = SCENARIO_NODE_REGISTRY['scenario-1']?.find(n => n.nodeType === 'caregiver');
        if (tg) {
          detected.push({
            ...tg,
            id: `node-tg-${Date.now()}`,
            timestamp
          });
        }
      }
    }

    return detected;
  }, []);

  /**
   * Appends fresh execution nodes for a simulation preset without duplicating existing ones.
   */
  const triggerPresetNodes = useCallback((preset: SimulationPreset) => {
    const freshNodes = resolvePresetNodes(preset);
    addUniqueNodes(freshNodes);
  }, [addUniqueNodes]);

  /**
   * Creates Execution Nodes for an ABDM Health Locker & MedGemma RAG query.
   */
  const createHealthLockerNodes = useCallback((
    query: string,
    latencyMs: number,
    analysisSnippet: string
  ): ToolExecutionNode[] => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    const now = Date.now();
    return [
      {
        id: `node-hl-${now}`,
        stepIndex: 1,
        nodeType: 'health_locker_query',
        brandName: 'ABDM Health Locker & Pinecone RAG',
        toolName: 'pinecone_vector_search',
        title: 'ABDM Health Locker Semantic Retrieval',
        actionSummary: `Retrieved top-3 clinical chunks from ABDM dossier matching: "${query}".`,
        timestamp,
        status: 'SUCCESS',
        statusCode: `200 OK (${latencyMs}ms)`,
        latencyMs: Math.round(latencyMs * 0.4),
        apiExchange: HEALTH_LOCKER_QUERY_EXCHANGE,
        reasoningSnippet: 'Senior query matched active FHIR medication records and metropolis renal panel.',
        brandColor: '#0D9488'
      },
      {
        id: `node-mg-${now}`,
        stepIndex: 1,
        nodeType: 'medgemma_analysis',
        brandName: 'Google MedGemma 4B',
        toolName: 'medgemma_clinical_copilot',
        title: 'MedGemma 4B Clinical Co-Pilot Reasoning',
        actionSummary: `Synthesized clinical guidance in ${latencyMs}ms. Zero-Diagnosis & Non-Prescriptive rules verified.`,
        timestamp,
        status: 'SUCCESS',
        statusCode: `200 OK (${latencyMs}ms)`,
        latencyMs: Math.round(latencyMs * 0.6),
        apiExchange: MEDGEMMA_ANALYSIS_EXCHANGE,
        reasoningSnippet: analysisSnippet.slice(0, 120) + '...',
        brandColor: '#7E22CE'
      }
    ];
  }, []);

  /**
   * Creates Execution Node when caregiver acts on the Pre-Call Agency gate.
   */
  const createPreCallApprovalNode = useCallback((
    decision: 'caregiver_direct' | 'agent_approved' | 'snooze_30m'
  ): ToolExecutionNode => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    const isDirect = decision === 'caregiver_direct';
    const isSnooze = decision === 'snooze_30m';
    return {
      id: `node-precall-${Date.now()}`,
      stepIndex: 0,
      nodeType: 'caregiver_precall_consent',
      brandName: 'Telegram Caregiver Agency Rail',
      toolName: 'caregiver_agency_dispatch',
      title: isDirect
        ? 'Caregiver Direct Call Initiated'
        : isSnooze
        ? 'Caregiver Snoozed Call (30m)'
        : 'Caregiver Delegated Check-In to AI',
      actionSummary: isDirect
        ? 'Rohan elected to call Papa directly (+91 98101 23456). AI dialing suspended.'
        : isSnooze
        ? 'Rohan requested 30-minute delay. Next check-in scheduled for 09:00 IST.'
        : 'Rohan verified morning briefing and pre-approved Sambandh AI companion call.',
      timestamp,
      status: 'SUCCESS',
      statusCode: '200 OK (88ms)',
      latencyMs: 88,
      apiExchange: CAREGIVER_PRECALL_APPROVAL_EXCHANGE,
      reasoningSnippet: 'Caregiver Agency Protocol enforces human-first primacy: Child is asked prior to any automated elder dialing.',
      brandColor: '#0284C7'
    };
  }, []);

  return {
    dynamicExecutionNodes,
    setDynamicExecutionNodes,
    clearDynamicNodes,
    addUniqueNodes,
    seedInitialCallNode,
    createLlmNode,
    createHealthLockerNodes,
    createPreCallApprovalNode,
    detectDomainNodes,
    triggerPresetNodes
  };
};

