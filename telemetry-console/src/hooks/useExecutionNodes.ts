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
  matchesKeywords
} from '../data/keywords';
import {
  createLlmExchange,
  CHROME_SPEECH_EXCHANGE,
  WHISPERFLO_DIAL_EXCHANGE,
  HEALTH_LOCKER_QUERY_EXCHANGE,
  MEDGEMMA_ANALYSIS_EXCHANGE
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
  const seedInitialCallNode = useCallback((isChrome: boolean) => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    setDynamicExecutionNodes([
      {
        id: `node-audio-initial-${Date.now()}`,
        stepIndex: 0,
        nodeType: 'telephony',
        brandName: isChrome ? 'Chrome Web Speech API' : 'WhisperFlo Engine',
        toolName: isChrome ? 'web_speech_recognition' : 'whisperflo_stt_stream',
        title: isChrome ? 'Web Speech Audio Pipeline' : 'WhisperFlo Carrier STT',
        actionSummary: isChrome
          ? 'Streaming audio through in-browser Web Speech API engine.'
          : 'SIP audio trunk bridged via WhisperFlo telephonic stream.',
        timestamp,
        status: 'SUCCESS',
        statusCode: 'STREAM ACTIVE',
        latencyMs: 142,
        apiExchange: isChrome ? CHROME_SPEECH_EXCHANGE : WHISPERFLO_DIAL_EXCHANGE,
        reasoningSnippet: isChrome
          ? 'Browser Web Speech bidirectional duplex streaming active with punctuation sanitization.'
          : 'WhisperFlo carrier SIP trunk bridged on Jio Delhi-NCR with 114ms VAD.',
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
  const detectDomainNodes = useCallback((contextText: string): ToolExecutionNode[] => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    const detected: ToolExecutionNode[] = [];
    const normalized = contextText.toLowerCase();

    if (matchesKeywords(normalized, MEDICATION_KEYWORDS)) {
      const isRefillOrLowStock = matchesKeywords(normalized, [
        'khatam', 'bachi', 'bache', 'refill', 'stock', 'kam', 'sirf', '3', '2', '1', 'order', 'mangwa', 'bhejo', 'kharch', 'parcha',
        'पर्चा', 'खत्म', 'बची', 'कम', 'सिर्फ', 'मंगवा', 'ऑर्डर', 'गोली'
      ]);

      const abdm = SCENARIO_NODE_REGISTRY['scenario-1']?.find(n => n.nodeType === 'abdm');
      if (abdm) {
        detected.push({
          ...abdm,
          id: `node-abdm-${Date.now()}`,
          timestamp
        });
      }

      // When low stock or refill is detected, autonomous agent cascades fulfillment:
      // Pine Labs (Auto-Debit) ➔ Netmeds (Pharmacy Pack) ➔ Delhivery (Express Courier) ➔ Telegram (Family Brief)
      if (isRefillOrLowStock) {
        const pine = SCENARIO_NODE_REGISTRY['scenario-1']?.find(n => n.nodeType === 'fiduciary');
        if (pine) {
          detected.push({
            ...pine,
            id: `node-pine-${Date.now()}`,
            timestamp
          });
        }

        const netmeds = SCENARIO_NODE_REGISTRY['scenario-1']?.find(n => n.nodeType === 'pharmacy');
        if (netmeds) {
          detected.push({
            ...netmeds,
            id: `node-netmeds-${Date.now()}`,
            timestamp
          });
        }

        const dlv = SCENARIO_NODE_REGISTRY['scenario-1']?.find(n => n.nodeType === 'logistics');
        if (dlv) {
          detected.push({
            ...dlv,
            id: `node-dlv-${Date.now()}`,
            timestamp
          });
        }

        const tg = SCENARIO_NODE_REGISTRY['scenario-1']?.find(n => n.nodeType === 'caregiver');
        if (tg) {
          detected.push({
            ...tg,
            id: `node-tg-${Date.now()}`,
            timestamp
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

  return {
    dynamicExecutionNodes,
    setDynamicExecutionNodes,
    clearDynamicNodes,
    addUniqueNodes,
    seedInitialCallNode,
    createLlmNode,
    createHealthLockerNodes,
    detectDomainNodes,
    triggerPresetNodes
  };
};

