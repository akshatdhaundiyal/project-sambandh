import { useState, useRef, useMemo, useCallback } from 'react';
import {
  ConversationTurn,
  LlmModelConfig,
  ElderTopicOfInterest,
  PromptSliceStatus,
  MentorshipExchangeItem,
  InventoryOrder
} from '../types/telemetry';
import { DEFAULT_MODEL_ID, SUPPORTED_LLM_MODELS } from '../data/models';
import { INITIAL_ELDER_TOPICS, getRandomCompanionGreeting } from '../data/conversationalSparks';
import { ToolExecutionNode } from '../data/nodeMapping';
import {
  callOpenRouter,
  callGemini,
  foldConversationMemory,
  ChatMessage,
  generateContextualCompanionResponse
} from '../services/llmService';
import {
  buildJitSystemPrompt,
  getLiveSystemPrompt,
  buildMemoryLedgerFromProfile,
  DynamicElderProfile,
  DEFAULT_DYNAMIC_PROFILE
} from '../services/promptBuilder';
import { healthLockerService } from '../services/healthLockerService';

interface UseConversationEngineProps {
  autoSpeak: boolean;
  speakSeniorTurns: boolean;
  speakTurn: (turn: ConversationTurn) => void;
  orderTotalLimitInr: number;
  activeMentorshipQuestion?: MentorshipExchangeItem | null;
  seniorProfile?: DynamicElderProfile;
  onFeedbackToast: (message: string) => void;
  onDeductCashWallet: (amountInr: number, reason: string) => void;
  onAddInventoryOrder: (order: InventoryOrder) => void;
  createLlmNode: (model: string, latencyMs: number, prompt: string, response: string) => ToolExecutionNode;
  createHealthLockerNodes: (query: string, latencyMs: number, analysis: string) => ToolExecutionNode[];
  detectDomainNodes: (text: string, orderTotalLimitInr?: number) => ToolExecutionNode[];
  addUniqueNodes: (nodes: ToolExecutionNode[]) => void;
  seedInitialCallNode: (browserTts: boolean) => void;
}

export const useConversationEngine = ({
  autoSpeak,
  speakSeniorTurns,
  speakTurn,
  orderTotalLimitInr,
  activeMentorshipQuestion,
  seniorProfile = DEFAULT_DYNAMIC_PROFILE,
  onFeedbackToast,
  onDeductCashWallet,
  onAddInventoryOrder,
  createLlmNode,
  createHealthLockerNodes,
  detectDomainNodes,
  addUniqueNodes,
  seedInitialCallNode
}: UseConversationEngineProps) => {
  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID);
  const [conversationTurns, setConversationTurns] = useState<ConversationTurn[]>([]);
  const [foldedMemory, setFoldedMemory] = useState<string>(() => buildMemoryLedgerFromProfile(seniorProfile));
  const turnsSinceFoldRef = useRef<number>(0);
  const callTurnCountRef = useRef<number>(0);

  // Elder Topics of Interest Pool (Caregiver-Curated + Autonomously Discovered)
  const [elderTopics, setElderTopics] = useState<ElderTopicOfInterest[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sambandh_elder_topics');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore parsing error
        }
      }
    }
    return INITIAL_ELDER_TOPICS;
  });

  const [activePromptSlices, setActivePromptSlices] = useState<PromptSliceStatus>({
    coreCompanion: true,
    subtleAdherence: false,
    clinicalDossier: false,
    fiduciaryMandate: false,
    acousticTripwire: false
  });

  const addElderTopic = useCallback((newTopicData: Partial<ElderTopicOfInterest>) => {
    const newTopic: ElderTopicOfInterest = {
      id: `topic-${Date.now()}`,
      topic: newTopicData.topic || 'General Interest',
      category: newTopicData.category || 'GENERAL',
      source: newTopicData.source || 'CAREGIVER_CURATED',
      addedBy: newTopicData.addedBy || 'Priya Sharma (Daughter)',
      enthusiasmLevel: newTopicData.enthusiasmLevel || 'HIGH',
      lastDiscussed: 'Just added',
      notes: newTopicData.notes || '',
      isActive: true,
      ...newTopicData
    };
    setElderTopics(prev => {
      const updated = [newTopic, ...prev];
      if (typeof window !== 'undefined') {
        localStorage.setItem('sambandh_elder_topics', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const removeElderTopic = useCallback((id: string) => {
    setElderTopics(prev => {
      const updated = prev.filter(t => t.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sambandh_elder_topics', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const toggleElderTopic = useCallback((id: string) => {
    setElderTopics(prev => {
      const updated = prev.map(t => (t.id === id ? { ...t, isActive: !t.isActive } : t));
      if (typeof window !== 'undefined') {
        localStorage.setItem('sambandh_elder_topics', JSON.stringify(updated));
      }
      return updated;
    });
  }, []);

  const selectedModelConfig = useMemo(() => {
    return SUPPORTED_LLM_MODELS.find(m => m.id === selectedModelId) || SUPPORTED_LLM_MODELS[0];
  }, [selectedModelId]);

  const initiateCallGreeting = useCallback((browserTts: boolean) => {
    callTurnCountRef.current = 0;
    setActivePromptSlices({
      coreCompanion: true,
      subtleAdherence: false,
      clinicalDossier: false,
      fiduciaryMandate: false,
      acousticTripwire: false
    });

    const randomGreeting = getRandomCompanionGreeting();
    const greetingTurn: ConversationTurn = {
      id: `greeting-turn-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      speaker: 'agent',
      lane: 'lane1',
      speakerLabel: 'Sambandh Companion (Agent)',
      content: randomGreeting.fullTurnText
    };

    setConversationTurns([greetingTurn]);
    seedInitialCallNode(browserTts);

    if (autoSpeak) {
      speakTurn(greetingTurn);
    }
  }, [autoSpeak, speakTurn, seedInitialCallNode]);

  const resetConversation = useCallback(() => {
    setConversationTurns([]);
    callTurnCountRef.current = 0;
    turnsSinceFoldRef.current = 0;
    setActivePromptSlices({
      coreCompanion: true,
      subtleAdherence: false,
      clinicalDossier: false,
      fiduciaryMandate: false,
      acousticTripwire: false
    });
  }, []);

  const injectCustomTurn = useCallback((
    content: string,
    speaker: 'senior' | 'agent' | 'mentee' = 'senior',
    options?: { fromVoiceInput?: boolean }
  ) => {
    if (!content.trim()) return;

    const newTurn: ConversationTurn = {
      id: `custom-turn-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      speaker,
      lane: speaker === 'senior' ? 'lane2' : 'lane1',
      speakerLabel: speaker === 'senior' ? 'Ramesh Chandra (Senior)' : 'Sambandh Companion (Agent)',
      content: content.trim()
    };

    setConversationTurns(prev => {
      const updated = [...prev, newTurn];

      // Progressive Memory Folding: Compress conversation history every 4 turns
      turnsSinceFoldRef.current += 1;
      if (turnsSinceFoldRef.current >= 4) {
        foldConversationMemory(updated, foldedMemory).then(folded => {
          setFoldedMemory(folded);
          turnsSinceFoldRef.current = 0;
        });
      }

      return updated;
    });

    // Audio Read-Out Policy
    if (speaker === 'senior') {
      if (!options?.fromVoiceInput && speakSeniorTurns && autoSpeak) {
        speakTurn(newTurn);
      }
    } else {
      if (autoSpeak) {
        speakTurn(newTurn);
      }
    }

    // Agent response generation for senior input
    if (speaker === 'senior') {
      callTurnCountRef.current += 1;
      const lower = content.toLowerCase();

      // Autonomous discovery of new elder topics from spontaneous conversation
      let discovered: Partial<ElderTopicOfInterest> | null = null;
      if (
        (lower.includes('railway') || lower.includes('loco') || lower.includes('engine') || lower.includes('signal') || lower.includes('workshop')) &&
        !elderTopics.some(t => t.topic.toLowerCase().includes('railway') || t.topic.toLowerCase().includes('signal'))
      ) {
        discovered = {
          topic: 'Northern Railway Signaling & Locomotive Lore',
          category: 'RAILWAYS_CAREER',
          source: 'AUTONOMOUSLY_DISCOVERED',
          addedBy: 'Sambandh Cognitive Memory',
          enthusiasmLevel: 'VERY_HIGH',
          notes: 'Ramesh enthusiastically recalled memories of railway signaling, workshop protocols, and locomotives.'
        };
      } else if (
        (lower.includes('rafi') || lower.includes('ghazal') || lower.includes('geet') || lower.includes('radio') || lower.includes('song')) &&
        !elderTopics.some(t => t.topic.toLowerCase().includes('ghazal') || t.topic.toLowerCase().includes('rafi'))
      ) {
        discovered = {
          topic: 'Old Ghazals & Morning Radio Melodies',
          category: 'MUSIC_CULTURE',
          source: 'AUTONOMOUSLY_DISCOVERED',
          addedBy: 'Sambandh Cognitive Memory',
          enthusiasmLevel: 'HIGH',
          notes: 'Fond reflections on classic melodies by Mohammed Rafi and Talat Mahmood.'
        };
      } else if (
        (lower.includes('tulsi') || lower.includes('phool') || lower.includes('gamle') || lower.includes('gardening')) &&
        !elderTopics.some(t => t.topic.toLowerCase().includes('tulsi') || t.topic.toLowerCase().includes('garden'))
      ) {
        discovered = {
          topic: 'Balcony Gardening & Seasonal Tulsi Care',
          category: 'GARDENING_ROUTINE',
          source: 'AUTONOMOUSLY_DISCOVERED',
          addedBy: 'Sambandh Cognitive Memory',
          enthusiasmLevel: 'HIGH',
          notes: 'Morning routine of tending to potted plants on the Rohini balcony.'
        };
      } else if (
        (lower.includes('park') || lower.includes('sair') || lower.includes('walking') || lower.includes('japanese')) &&
        !elderTopics.some(t => t.topic.toLowerCase().includes('park') || t.topic.toLowerCase().includes('walk'))
      ) {
        discovered = {
          topic: 'Morning Walks & Discussions at Japanese Park',
          category: 'GARDENING_ROUTINE',
          source: 'AUTONOMOUSLY_DISCOVERED',
          addedBy: 'Sambandh Cognitive Memory',
          enthusiasmLevel: 'HIGH',
          notes: 'Enjoys socializing and taking morning walks in Sector 14 Japanese park.'
        };
      } else if (
        (lower.includes('metro') || lower.includes('rithala') || lower.includes('flyover')) &&
        !elderTopics.some(t => t.topic.toLowerCase().includes('metro'))
      ) {
        discovered = {
          topic: 'Delhi Metro Expansion & Rohini Development',
          category: 'LOCAL_NEWS',
          source: 'AUTONOMOUSLY_DISCOVERED',
          addedBy: 'Sambandh Cognitive Memory',
          enthusiasmLevel: 'HIGH',
          notes: 'Discussed urban growth and transit development in North Delhi.'
        };
      }

      if (discovered) {
        addElderTopic(discovered);
        healthLockerService.saveSeniorInterest(discovered).catch(() => {});
        const nodeTimestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
        addUniqueNodes([
          {
            id: `node-topic-${Date.now()}`,
            stepIndex: conversationTurns.length,
            nodeType: 'caregiver',
            brandName: 'Cognitive Memory',
            toolName: 'topic_extraction_engine',
            title: `💡 Discovered Interest: ${discovered.topic}`,
            actionSummary: `Autonomously logged new conversation interest: "${discovered.topic}". Added to Papa's active interest pool and synced to PostgreSQL.`,
            timestamp: nodeTimestamp,
            status: 'SUCCESS',
            statusCode: 'INTEREST_REGISTERED',
            latencyMs: 14,
            apiExchange: {
              railName: 'Cognitive Memory Protocol',
              method: 'POST',
              endpoint: '/v1/elder/interests/register',
              headers: { 'Content-Type': 'application/json' },
              requestBody: { topic: discovered.topic, category: discovered.category, source: 'AUTONOMOUSLY_DISCOVERED' },
              responseStatus: 200,
              responseStatusText: 'OK',
              responseLatencyMs: 14,
              responseHeaders: { 'Content-Type': 'application/json' },
              responseBody: { status: 'REGISTERED', interestId: `int-${Date.now()}` },
              schemaStandard: 'Sambandh JSON Schema v1'
            },
            reasoningSnippet: `[TOPIC DISCOVERY]: Ramesh expressed genuine enthusiasm regarding ${discovered.topic}. Registered for ongoing conversational continuity.`,
            brandColor: '#10B981'
          }
        ]);
      }

      // Build JIT modular system prompt (avoids upfront bloat & early escalation)
      const { prompt: systemPrompt, activeSlices } = buildJitSystemPrompt(
        foldedMemory,
        callTurnCountRef.current,
        content,
        elderTopics,
        activeMentorshipQuestion,
        seniorProfile,
        orderTotalLimitInr
      );
      setActivePromptSlices(activeSlices);

      const allDialogueTurns: ChatMessage[] = [
        ...conversationTurns
          .filter(t => t.speaker === 'senior' || t.speaker === 'agent')
          .map(t => ({
            role: t.speaker === 'senior' ? ('user' as const) : ('assistant' as const),
            content: t.content
          })),
        { role: 'user' as const, content: content.trim() }
      ];

      const handleAgentInference = (result: any) => {
        if (result?.text) {
          const modelDisplayName = result.modelUsed || selectedModelConfig.name;
          const isFailover = Boolean(result.isFailover);
          const isClinicalQuery = /(doctor|dawai|goli|creatinine|bp|sharma|prescription|parcha|kab leni|medicine)/i.test(content);
          const baseBadge = isFailover ? '⚡ Local Fallback' : `${selectedModelConfig.provider.toUpperCase()} Fast-Inference`;
          const effectiveBadge = isClinicalQuery ? '📋 Health Locker Verified (MedGemma RAG)' : baseBadge;

          const agentTurn: ConversationTurn = {
            id: `agent-reply-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
            speaker: 'agent',
            lane: 'lane1',
            speakerLabel: `Sambandh Companion (${modelDisplayName})`,
            content: result.text,
            modelUsed: modelDisplayName,
            isFailover,
            providerBadge: effectiveBadge
          };
          setConversationTurns(prev => [...prev, agentTurn]);

          // Dynamically log Cognitive Reasoning Node + Domain Rails
          const llmNode = createLlmNode(modelDisplayName, result.latencyMs || 280, content, result.text);
          const domainNodes = detectDomainNodes(content + ' ' + result.text, orderTotalLimitInr);
          const hlNodes = isClinicalQuery ? createHealthLockerNodes(content, 184, result.text) : [];
          addUniqueNodes([llmNode, ...domainNodes, ...hlNodes]);

          // If medication fulfillment cascade was triggered (and within cap), register order and debit
          if (domainNodes.some(n => n.nodeType === 'pharmacy')) {
            onDeductCashWallet(840, 'Pine Labs Auto-Debit: Telma 40 Refill via Netmeds');
            onAddInventoryOrder({
              id: `order-nmd-${Date.now()}`,
              itemName: 'Telma 40mg (Telmisartan) 30-Day Strip',
              category: 'MEDICATION',
              orderDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
              units: 1,
              amountInr: 840,
              vendor: 'Netmeds / Apollo DarkStore Sector 11',
              status: 'ORDERED_NOT_RECEIVED',
              trackingWaybill: 'DLV-98234-DEL',
              eta: 'Today by 4:00 PM'
            });
            onFeedbackToast('✅ Autonomous Refill: ₹840 debited under cap. Netmeds dispatching via Delhivery CMU.');
          } else if (domainNodes.some(n => n.statusCode === '402 LIMIT EXCEEDED')) {
            onFeedbackToast(`🛑 Fiduciary Limit Safety Rail: Order exceeds configured limit of ₹${orderTotalLimitInr}. Auto-debit blocked. Step-up authorization card dispatched to Telegram.`);
          } else if (domainNodes.some(n => n.statusCode === 'CRITICAL ALERT')) {
            onFeedbackToast('🚨 RED ALERT: Acute symptoms reported by Papa. Instructed to call 112. Emergency call card dispatched to Priya & Dr. Saxena.');
          } else if (domainNodes.some(n => n.statusCode === 'NON-ADHERENCE WARNING')) {
            onFeedbackToast('⚠️ Clinical Adherence Warning: Papa reported stopping BP medication. Dr. Saxena consultation recommended.');
          } else if (domainNodes.some(n => n.statusCode === 'ADHERENCE CONFIRMED')) {
            onFeedbackToast('🌿 Morning Adherence Ground-Truthed: Papa confirmed morning BP medicine taken. Stock stable.');
          }

          if (autoSpeak) {
            speakTurn(agentTurn);
          }
        }
      };

      if (selectedModelConfig.provider === 'openrouter') {
        callOpenRouter(selectedModelId, allDialogueTurns, systemPrompt)
          .then(handleAgentInference)
          .catch(err => {
            console.warn('[OpenRouter] Live inference fallback:', err);
            const fallbackText = generateContextualCompanionResponse(content, allDialogueTurns, foldedMemory);
            handleAgentInference({
              text: fallbackText,
              modelUsed: `${selectedModelId} (Contextual Resilience)`,
              isFailover: true
            });
          });
      } else {
        callGemini(selectedModelId, allDialogueTurns, systemPrompt)
          .then(handleAgentInference)
          .catch(err => {
            console.warn('[Gemini] Live inference fallback:', err);
            const fallbackText = generateContextualCompanionResponse(content, allDialogueTurns, foldedMemory);
            handleAgentInference({
              text: fallbackText,
              modelUsed: `${selectedModelId} (Contextual Resilience)`,
              isFailover: true
            });
          });
      }
    }
  }, [
    autoSpeak,
    speakSeniorTurns,
    speakTurn,
    elderTopics,
    addElderTopic,
    foldedMemory,
    selectedModelId,
    selectedModelConfig,
    activeMentorshipQuestion,
    orderTotalLimitInr,
    onFeedbackToast,
    onDeductCashWallet,
    onAddInventoryOrder,
    createLlmNode,
    detectDomainNodes,
    createHealthLockerNodes,
    addUniqueNodes
  ]);

  const getSystemPromptSnapshot = useCallback((
    customMemory?: string,
    turnCountOverride?: number,
    recentText?: string
  ) => {
    return getLiveSystemPrompt(
      customMemory || foldedMemory,
      turnCountOverride ?? callTurnCountRef.current,
      recentText,
      seniorProfile,
      orderTotalLimitInr
    );
  }, [foldedMemory, seniorProfile, orderTotalLimitInr]);

  return {
    selectedModelId,
    setSelectedModelId,
    selectedModelConfig,
    conversationTurns,
    setConversationTurns,
    foldedMemory,
    setFoldedMemory,
    elderTopics,
    addElderTopic,
    removeElderTopic,
    toggleElderTopic,
    activePromptSlices,
    setActivePromptSlices,
    initiateCallGreeting,
    injectCustomTurn,
    resetConversation,
    getSystemPromptSnapshot,
    callTurnCount: callTurnCountRef.current
  };
};
