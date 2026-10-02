/**
 * TelemetryContext — Composed Application State Provider
 * Cleanly delegates to focused custom hooks:
 * - useCallSession: Call lifecycle, status, and duration
 * - useScenarioPlayback: Scenario stepping, pacing, and navigation
 * - useTripwireGuard: Acoustic tripwire safety rail and scam interception
 * - useExecutionNodes: Dynamic node graph, deduplication, and domain rail detection
 */
import React, { createContext, useContext, useState, useRef, useMemo, ReactNode } from 'react';
import {
  Scenario,
  ScenarioStep,
  ConversationTurn,
  WhisperFloWebhook,
  HttpApiExchange,
  NavigationTab,
  CallStatus,
  LlmModelConfig,
  MedicalIssue,
  InventoryOrder,
  CashWalletState,
  MoodCallEntry,
  CaregiverConfig
} from '../types/telemetry';
import { DEFAULT_MODEL_ID, SUPPORTED_LLM_MODELS } from '../data/models';
import { speakDialogueTurn, stopSpeech } from '../utils/speechService';
import {
  callOpenRouter,
  callGemini,
  foldConversationMemory,
  ChatMessage,
  generateContextualCompanionResponse
} from '../services/llmService';
import { ToolExecutionNode } from '../data/nodeMapping';
import { SIMULATION_PRESETS } from '../data/simulationPrompts';
import { DEFAULT_MEMORY_LEDGER } from '../data/keywords';
import {
  useCallSession,
  useExecutionNodes,
  useScenarioPlayback,
  PacingOption,
  getStepApiExchange
} from '../hooks';

export type { PacingOption };
export { getStepApiExchange };

interface TelemetryContextType {
  scenarios: Scenario[];
  activeScenario: Scenario;
  currentStepIndex: number;
  currentStep: ScenarioStep;
  allTurnsSoFar: ConversationTurn[];
  isPlaying: boolean;
  pacing: PacingOption;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  currentStepApiExchange: HttpApiExchange;
  selectedWebhook: WhisperFloWebhook | null;
  selectedApiExchange: HttpApiExchange | null;
  isStateDrawerOpen: boolean;
  isAudioSnippetOpen: boolean;
  telegramActionFeedback: string | null;
  activeTtsEngine: 'chrome' | 'whisperflo';
  setActiveTtsEngine: (engine: 'chrome' | 'whisperflo') => void;
  currentlySpeakingTurnId: string | null;
  speakTurn: (turn: ConversationTurn) => void;
  injectCustomTurn: (
    content: string,
    speaker?: 'senior' | 'agent' | 'mentee',
    options?: { fromVoiceInput?: boolean }
  ) => void;
  speakSeniorTurns: boolean;
  setSpeakSeniorTurns: (val: boolean) => void;
  setScenarioById: (scenarioId: string) => void;
  stepNext: () => void;
  stepPrev: () => void;
  resetScenario: () => void;
  togglePlay: () => void;
  setPacing: (pacing: PacingOption) => void;
  openWebhookModal: (webhook: WhisperFloWebhook) => void;
  closeWebhookModal: () => void;
  openApiExchangeModal: (exchange: HttpApiExchange) => void;
  closeApiExchangeModal: () => void;
  setIsStateDrawerOpen: (open: boolean) => void;
  setIsAudioSnippetOpen: (open: boolean) => void;
  handleTelegramAction: (action: string) => void;
  getConsolidatedStateJson: () => string;

  // 6-Point Workflow State & Functions
  callStatus: CallStatus;
  startCall: () => void;
  endCall: () => void;
  callDurationSeconds: number;
  autoSpeak: boolean;
  setAutoSpeak: (val: boolean) => void;
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
  selectedModelConfig: LlmModelConfig;
  isLlmModalOpen: boolean;
  setIsLlmModalOpen: (open: boolean) => void;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  settingsActiveTab: 'brain' | 'telephony' | 'wallet' | 'routing';
  setSettingsActiveTab: (tab: 'brain' | 'telephony' | 'wallet' | 'routing') => void;
  openSettingsModal: (tab?: 'brain' | 'telephony' | 'wallet' | 'routing') => void;
  topUpCashWallet: (amountInr: number) => void;
  isSystemPromptModalOpen: boolean;
  setIsSystemPromptModalOpen: (open: boolean) => void;
  isMentorshipModalOpen: boolean;
  setIsMentorshipModalOpen: (open: boolean) => void;
  getLiveSystemPrompt: () => string;
  foldedMemory: string;
  dynamicExecutionNodes: ToolExecutionNode[];
  triggerSimulationPreset: (presetId: string) => void;
  clearDynamicNodes: () => void;

  // Medical Dossier, Live Inventory & Orders State
  medicalIssues: MedicalIssue[];
  inventoryOrders: InventoryOrder[];
  addInventoryOrder: (order: InventoryOrder) => void;

  // Fiduciary Cash Wallet & Call Scheduling
  cashWallet: CashWalletState;
  deductCashWallet: (amountInr: number, reason: string) => void;
  updateCallFrequency: (freq: number) => void;

  // Caregiver Pre-Fed Configuration (Routing, Address & Limits)
  caregiverConfig: CaregiverConfig;
  updateCaregiverConfig: (newConfig: Partial<CaregiverConfig>) => void;

  // Multi-Call Emotional Memory & In-Clinic Transcriber Mode
  moodHistory: MoodCallEntry[];
  recordCallMood: (emotion: 'CHEERFUL' | 'CALM' | 'ANXIOUS' | 'SAD', notes: string) => void;
  isTranscriberActive: boolean;
  transcriberTranscript: string[];
  startTranscriberMode: () => void;
  stopTranscriberMode: () => void;
  syncTranscriberToEhr: () => void;
}

export const getLiveSystemPrompt = (memoryLedger: string): string => {
  return `You are Sambandh, a warm, affectionate, and respectful AI healthcare voice companion for 74-year old Indian elder Ramesh Chandra in Rohini, Delhi.
Address him respectfully as अंकल, जी, or प्रणाम.

[BACKGROUND CLINICAL DOSSIER & MEDICAL ISSUES - REFERENCE ONLY. NEVER BLURT OUT UNLESS RELEVANT]:
- Health: Essential Hypertension (Telma 40 morning), Type 2 Diabetes (Metformin 500 evening), Grade-1 Knee Osteoarthritis (morning stiffness in knees), Mild early-wake insomnia.
- Caregiver: Daughter Priya Sharma in Bangalore (receives daily automated care briefs and Telegram summaries).
- Financial Envelope: In-memory Care Wallet with ₹2,500 balance; Pine Labs ₹4,500 monthly pre-authorized ceiling.
- Pending Deliveries: Hyperlocal pooja essentials and medicine strips currently in "Ordered — Not Received" state.
- Generic MCP Orders: If Ramesh asks for flowers, temple puja items, or Amazon supplies, reassure him that Sambandh has placed the order and debited his care envelope seamlessly.

[STRUCTURED CONVERSATION MEMORY LEDGER]:
${memoryLedger}

CORE CONVERSATIONAL PRINCIPLES:
1. ALWAYS listen first and directly address what Ramesh Uncle JUST said in his latest message.
2. If he expresses sadness, loneliness, or depression (e.g. mann nahi lag raha, udas, akele):
   - Respond with profound warmth, filial affection, and gentle reassurance.
   - Mention that you are always here every morning to talk with him, and that bitiya Priya in Bangalore loves him deeply.
3. If he mentions pain, discomfort, sickness, or symptoms (e.g. dard, sir dard, headache, dizziness, knee stiffness):
   - Immediately express warm concern and gentle empathy.
   - Ask where it is hurting (e.g. सिर में दर्द है या कहीं और?) and gently ask if he had morning water, tea, or breakfast.
   - NEVER bring up unrelated topics when he is reporting pain or distress!
3. If he explicitly asks about medicines, refill, or says pills are running out:
   - Reassure him that his doctor's prescription and delivery are taken care of under his pre-approved plan without any stress.
4. If he mentions family or his daughter Priya:
   - Reassure him that Priya is updated on Telegram.
5. Tone & Format:
   - Reply in 1-2 natural, spoken Hindi sentences in Devanagari script.
   - Follow with [Hinglish in brackets] for readable reference.
   - Speak like an affectionate family member, NOT a robotic script or medical lecturer.`;
};

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Composed Sub-Hooks
  const {
    callStatus,
    callDurationSeconds,
    beginCall,
    endCall: endCallSession,
    resetCallState
  } = useCallSession();

  const {
    scenarios,
    activeScenario,
    currentStepIndex,
    setCurrentStepIndex,
    currentStep,
    currentStepApiExchange,
    isPlaying,
    pacing,
    setPacing,
    stepNext,
    stepPrev,
    togglePlay,
    setScenarioById: setScenarioPlaybackId,
    resetPlayback
  } = useScenarioPlayback();

  const {
    dynamicExecutionNodes,
    clearDynamicNodes,
    addUniqueNodes,
    seedInitialCallNode,
    createLlmNode,
    detectDomainNodes,
    triggerPresetNodes
  } = useExecutionNodes();

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState<NavigationTab>('dual-pane');
  const [selectedWebhook, setSelectedWebhook] = useState<WhisperFloWebhook | null>(null);
  const [selectedApiExchange, setSelectedApiExchange] = useState<HttpApiExchange | null>(null);
  const [isStateDrawerOpen, setIsStateDrawerOpen] = useState<boolean>(false);
  const [isAudioSnippetOpen, setIsAudioSnippetOpen] = useState<boolean>(false);
  const [telegramActionFeedback, setTelegramActionFeedback] = useState<string | null>(null);
  const [isLlmModalOpen, setIsLlmModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [settingsActiveTab, setSettingsActiveTab] = useState<'brain' | 'telephony' | 'wallet' | 'routing'>('brain');
  const [isSystemPromptModalOpen, setIsSystemPromptModalOpen] = useState<boolean>(false);
  const [isMentorshipModalOpen, setIsMentorshipModalOpen] = useState<boolean>(false);

  const openSettingsModal = (tab: 'brain' | 'telephony' | 'wallet' | 'routing' = 'brain') => {
    setSettingsActiveTab(tab);
    setIsSettingsModalOpen(true);
  };

  // Medical Dossier State
  const [medicalIssues, setMedicalIssues] = useState<MedicalIssue[]>([
    {
      id: 'issue-1',
      condition: 'Essential Hypertension (Stage-1)',
      diagnosedDate: '14 Feb 2021',
      severity: 'CHRONIC',
      notes: 'Blood pressure calibrated around 120-135 mmHg systolic. Controlled via Telmisartan 40mg OD post-breakfast.',
      treatingDoctor: 'Dr. Arvind Saxena (Apollo Clinic Rohini)',
      activeSymptoms: ['Occasional morning heaviness', 'Mild post-exertion fatigue']
    },
    {
      id: 'issue-2',
      condition: 'Type 2 Diabetes Mellitus',
      diagnosedDate: '10 Nov 2019',
      severity: 'MODERATE',
      notes: 'Controlled fasting glucose (95-115 mg/dL). Regimen: Metformin (Glycomet) 500mg evening post-dinner.',
      treatingDoctor: 'Dr. Neha Verma (Diabetologist)',
      activeSymptoms: ['Post-lunch lethargy', 'Thirst during warm weather']
    },
    {
      id: 'issue-3',
      condition: 'Bilateral Knee Osteoarthritis (Grade-1)',
      diagnosedDate: '08 Mar 2023',
      severity: 'MILD',
      notes: 'Age-related joint stiffness in early mornings. Doctor advised warm water compresses and avoiding steep staircases.',
      treatingDoctor: 'Dr. Arvind Saxena',
      activeSymptoms: ['Morning joint stiffness (ghutne me jakdan)', 'Difficulty standing from floor']
    },
    {
      id: 'issue-4',
      condition: 'Mild Sleep-Onset Insomnia',
      diagnosedDate: '12 Jan 2025',
      severity: 'MILD',
      notes: 'Reports light sleep; early 05:00 AM awakenings. Non-pharmacological management: warm milk and routine calm.',
      treatingDoctor: 'Dr. Arvind Saxena',
      activeSymptoms: ['Waking up at 5:00 AM', 'Mind running on old memories']
    }
  ]);

  // Pending Orders State ("Ordered but not received")
  const [inventoryOrders, setInventoryOrders] = useState<InventoryOrder[]>([
    {
      id: 'ord-med-prev-01',
      itemName: 'Telmisartan 40mg (30 Tablets Strip)',
      category: 'MEDICATION',
      orderDate: 'Today, 08:32 AM',
      units: 30,
      amountInr: 680,
      vendor: 'Apollo Pharmacy DarkStore Sector 11',
      status: 'ORDERED_NOT_RECEIVED',
      trackingWaybill: 'DLV-98234-DEL',
      eta: 'Today by 4:00 PM'
    },
    {
      id: 'ord-pooja-init',
      itemName: 'Fresh Marigold Genda Mala & Pure Chandan',
      category: 'POOJA_FLOWERS',
      orderDate: 'Today, 08:30 AM',
      units: 2,
      amountInr: 210,
      vendor: 'Rohini Mandir Phool Bhandar (Quick Commerce)',
      status: 'ORDERED_NOT_RECEIVED',
      trackingWaybill: 'QC-DEL-881920',
      eta: 'Today by 07:00 AM'
    }
  ]);

  const addInventoryOrder = (order: InventoryOrder) => {
    setInventoryOrders(prev => [order, ...prev]);
  };

  // In-Memory Cash Wallet & Call Scheduling State
  const [cashWallet, setCashWallet] = useState<CashWalletState>({
    balanceInr: 2500,
    lowBalanceThresholdInr: 500,
    callFrequencyPerDay: 1,
    lastDeductionReason: undefined,
    lastDeductionAmount: undefined
  });

  const deductCashWallet = (amountInr: number, reason: string) => {
    setCashWallet(prev => {
      const newBal = Math.max(0, prev.balanceInr - amountInr);
      const isNowLow = newBal < prev.lowBalanceThresholdInr;
      if (isNowLow) {
        setTelegramActionFeedback(`⚠️ Low Cash Balance Alert: Care wallet dropped to ₹${newBal.toLocaleString('en-IN')}. Dispatched alert to Priya.`);
      }
      return {
        ...prev,
        balanceInr: newBal,
        lastDeductionReason: reason,
        lastDeductionAmount: amountInr
      };
    });
  };

  const updateCallFrequency = (freq: number) => {
    setCashWallet(prev => ({ ...prev, callFrequencyPerDay: freq }));
    setTelegramActionFeedback(`🗓️ Call Frequency updated to ${freq}x per day. Daily schedule synced with carrier.`);
    setTimeout(() => setTelegramActionFeedback(null), 3500);
  };

  const topUpCashWallet = (amountInr: number) => {
    setCashWallet(prev => {
      const newBal = prev.balanceInr + amountInr;
      setTelegramActionFeedback(`💳 Fiduciary Care Wallet credited with ₹${amountInr.toLocaleString('en-IN')}. New balance: ₹${newBal.toLocaleString('en-IN')}.`);
      setTimeout(() => setTelegramActionFeedback(null), 3500);
      return {
        ...prev,
        balanceInr: newBal
      };
    });
  };

  // Pre-Fed Caregiver Configuration State (Elder & Nearest Pharmacy Locations, Limit)
  const [caregiverConfig, setCaregiverConfig] = useState<CaregiverConfig>({
    elderHomeAddress: "Flat 402, Block C, Pocket 2, Rohini Sector 8, Delhi",
    elderPinCode: "110085",
    nearestPharmacyName: "Netmeds / Apollo DarkStore Sector 11",
    nearestPharmacyAddress: "Plot 14, Community Centre, Sector 11, Rohini",
    nearestPharmacyPinCode: "110085",
    nearestPharmacyEmail: "orders.rohini11@netmeds.com",
    orderTotalLimitInr: 4500
  });

  const updateCaregiverConfig = (newConfig: Partial<CaregiverConfig>) => {
    setCaregiverConfig(prev => {
      const updated = { ...prev, ...newConfig };
      setTelegramActionFeedback(`📍 Caregiver settings updated: Limit ₹${updated.orderTotalLimitInr.toLocaleString('en-IN')}, Pickup at ${updated.nearestPharmacyName}.`);
      setTimeout(() => setTelegramActionFeedback(null), 3500);
      return updated;
    });
  };

  // Longitudinal Emotional Memory Across 3-4 Subsequent Calls
  const [moodHistory, setMoodHistory] = useState<MoodCallEntry[]>([
    {
      callId: 'call-oct-01',
      callDate: '01 Oct 2026',
      callTime: '08:30 AM',
      sentimentScore: 0.85,
      primaryEmotion: 'CHEERFUL',
      notes: 'Papa was very energetic; shared Northern Railway story with high lucidity.'
    },
    {
      callId: 'call-oct-02',
      callDate: '02 Oct 2026',
      callTime: '08:31 AM',
      sentimentScore: -0.65,
      primaryEmotion: 'SAD',
      notes: 'Ramesh Uncle reported feeling lonely and missing family in Bangalore.'
    },
    {
      callId: 'call-oct-03',
      callDate: '03 Oct 2026',
      callTime: '08:30 AM',
      sentimentScore: -0.72,
      primaryEmotion: 'SAD',
      notes: 'Reported quietness in flat 402, quiet tone, low verbal engagement.'
    }
  ]);

  const recordCallMood = (emotion: 'CHEERFUL' | 'CALM' | 'ANXIOUS' | 'SAD', notes: string) => {
    const newEntry: MoodCallEntry = {
      callId: `call-${Date.now()}`,
      callDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      callTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      sentimentScore: emotion === 'CHEERFUL' ? 0.8 : emotion === 'CALM' ? 0.3 : emotion === 'ANXIOUS' ? -0.4 : -0.75,
      primaryEmotion: emotion,
      notes
    };

    setMoodHistory(prev => {
      const updated = [newEntry, ...prev.slice(0, 3)];
      const sadCount = updated.filter(m => m.primaryEmotion === 'SAD').length;
      if (sadCount >= 2) {
        setTelegramActionFeedback('🌧️ Longitudinal Care Alert: Papa reported low mood across consecutive calls. Proactive advisory dispatched to Priya on Telegram.');
      }
      return updated;
    });
  };

  // In-Clinic Transcriber Mode State
  const [isTranscriberActive, setIsTranscriberActive] = useState<boolean>(false);
  const [transcriberTranscript, setTranscriberTranscript] = useState<string[]>([
    'Dr. Arvind Saxena: "Namaste Ramesh Ji, BP is 130/85 today. Very stable."',
    'Dr. Arvind Saxena: "We are tapering Amlodipine to 2.5mg, and starting Atorvastatin 10mg at bedtime."',
    'Ramesh Chandra: "Doctor saab, morning walk continues daily."'
  ]);

  const startTranscriberMode = () => {
    setIsTranscriberActive(true);
    setTelegramActionFeedback('🩺 In-Clinic Transcriber Mode Started: Dual-speaker audio capture active at Apollo Clinic.');
  };

  const stopTranscriberMode = () => {
    setIsTranscriberActive(false);
    setTelegramActionFeedback('✅ In-Clinic Transcriber Stopped: Extracted clinical consultation notes.');
  };

  const syncTranscriberToEhr = () => {
    setIsTranscriberActive(false);
    setMedicalIssues(prev => [
      {
        id: `issue-${Date.now()}`,
        condition: 'Hyperlipidemia / Cholesterol Titration',
        diagnosedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        severity: 'MILD',
        notes: 'Dr. Arvind Saxena added Atorvastatin 10mg bedtime; reduced Amlodipine to 2.5mg. Review in 4 weeks.',
        treatingDoctor: 'Dr. Arvind Saxena (Cardiologist)',
        activeSymptoms: ['Lipid profile monitoring']
      },
      ...prev
    ]);
    setTelegramActionFeedback('🏥 Synced to Medical Dossier: Titrations updated & clinical summary pushed to Priya on Telegram.');
  };

  // Audio / Speech State
  const [activeTtsEngine, setActiveTtsEngine] = useState<'chrome' | 'whisperflo'>('chrome');
  const [currentlySpeakingTurnId, setCurrentlySpeakingTurnId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [speakSeniorTurns, setSpeakSeniorTurns] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sambandh_speak_senior_turns');
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  const handleSetSpeakSeniorTurns = (val: boolean) => {
    setSpeakSeniorTurns(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sambandh_speak_senior_turns', String(val));
    }
  };

  // LLM Configuration & Conversation Memory
  const [selectedModelId, setSelectedModelId] = useState<string>(DEFAULT_MODEL_ID);
  const [conversationTurns, setConversationTurns] = useState<ConversationTurn[]>([]);
  const [foldedMemory, setFoldedMemory] = useState<string>(DEFAULT_MEMORY_LEDGER);
  const turnsSinceFoldRef = useRef<number>(0);
  const speechAdvanceTimeoutRef = useRef<any>(null);

  const selectedModelConfig = useMemo(() => {
    return SUPPORTED_LLM_MODELS.find(m => m.id === selectedModelId) || SUPPORTED_LLM_MODELS[0];
  }, [selectedModelId]);

  const speakTurn = (turn: ConversationTurn) => {
    setCurrentlySpeakingTurnId(turn.id);
    speakDialogueTurn(turn.content, turn.speaker, activeTtsEngine, {
      onEnd: () => {
        setCurrentlySpeakingTurnId(null);
        // Only auto-advance if explicitly running a scripted scenario playback demo (never during active live calls!)
        if (isPlaying && callStatus !== 'active' && autoSpeak) {
          if (speechAdvanceTimeoutRef.current) clearTimeout(speechAdvanceTimeoutRef.current);
          speechAdvanceTimeoutRef.current = setTimeout(() => {
            stepNext();
          }, 1200);
        }
      },
      onError: () => setCurrentlySpeakingTurnId(null)
    });
  };

  const injectCustomTurn = (
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
      const allDialogueTurns: ChatMessage[] = [
        ...conversationTurns
          .filter(t => t.speaker === 'senior' || t.speaker === 'agent')
          .map(t => ({
            role: t.speaker === 'senior' ? ('user' as const) : ('assistant' as const),
            content: t.content
          })),
        { role: 'user' as const, content: content.trim() }
      ];

      const systemPrompt = getLiveSystemPrompt(foldedMemory);

      const handleAgentInference = (result: any) => {
        if (result?.text) {
          const modelDisplayName = result.modelUsed || selectedModelConfig.name;
          const isFailover = Boolean(result.isFailover);
          const providerBadge = result.providerBadge;
          const agentTurn: ConversationTurn = {
            id: `agent-reply-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
            speaker: 'agent',
            lane: 'lane1',
            speakerLabel: `Sambandh Companion (${modelDisplayName})`,
            content: result.text,
            modelUsed: modelDisplayName,
            isFailover,
            providerBadge
          };
          setConversationTurns(prev => [...prev, agentTurn]);

          // Dynamically log Cognitive Reasoning Node + Domain Rails
          const llmNode = createLlmNode(
            modelDisplayName,
            result.latencyMs || 280,
            content,
            result.text
          );
          const domainNodes = detectDomainNodes(content + ' ' + result.text);
          addUniqueNodes([llmNode, ...domainNodes]);

          // If medication fulfillment cascade was triggered, register the active order
          if (domainNodes.some(n => n.nodeType === 'pharmacy')) {
            setInventoryOrders(prev => {
              if (prev.some(o => o.itemName.includes('Telma 40'))) return prev;
              return [
                {
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
                },
                ...prev
              ];
            });
            deductCashWallet(840, 'Pine Labs Auto-Debit: Telma 40 Refill via Netmeds');
          }

          if (autoSpeak) {
            setTimeout(() => {
              speakTurn(agentTurn);
            }, 500);
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
  };

  const startCall = () => {
    stopSpeech();
    if (speechAdvanceTimeoutRef.current) clearTimeout(speechAdvanceTimeoutRef.current);
    beginCall();
    setCurrentStepIndex(0);

    const greetingTurn: ConversationTurn = {
      id: `greeting-turn-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      speaker: 'agent',
      lane: 'lane1',
      speakerLabel: 'Sambandh Companion (Agent)',
      content: 'प्रणाम रमेश अंकल जी! संबंध केयर से बोल रही हूँ। आप कैसे हैं आज सुबह? नाश्ता और चाय हो गई आपकी? [Pranam Ramesh Uncle Ji! Sambandh Care se bol rahi hoon. Aap kaise hain aaj subah? Nashta aur chai ho gayi aapki?]'
    };

    setConversationTurns([greetingTurn]);
    seedInitialCallNode(activeTtsEngine === 'chrome');

    if (autoSpeak) {
      setTimeout(() => {
        speakTurn(greetingTurn);
      }, 300);
    }
  };

  const endCall = () => {
    stopSpeech();
    if (speechAdvanceTimeoutRef.current) clearTimeout(speechAdvanceTimeoutRef.current);
    endCallSession();
  };

  const resetScenario = () => {
    stopSpeech();
    if (speechAdvanceTimeoutRef.current) clearTimeout(speechAdvanceTimeoutRef.current);
    resetCallState();
    resetPlayback();
    clearDynamicNodes();
    setConversationTurns([]);
    setCurrentlySpeakingTurnId(null);
    setTelegramActionFeedback(null);
  };

  const setScenarioById = (id: string) => {
    stopSpeech();
    if (speechAdvanceTimeoutRef.current) clearTimeout(speechAdvanceTimeoutRef.current);
    setScenarioPlaybackId(id);
  };

  const triggerSimulationPreset = (presetId: string) => {
    const preset = SIMULATION_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    if (callStatus === 'idle') {
      startCall();
    }

    injectCustomTurn(preset.promptText, 'senior');
    triggerPresetNodes(preset);

    if (preset.id === 'sim-refill') {
      setInventoryOrders(prev => {
        if (prev.some(o => o.itemName.includes('Telma 40'))) return prev;
        return [
          {
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
          },
          ...prev
        ];
      });
      deductCashWallet(840, 'Pine Labs Auto-Debit: Telma 40 Refill via Netmeds');
    } else if (preset.id === 'sim-mcp-pooja') {
      setInventoryOrders(prev => {
        if (prev.some(o => o.category === 'POOJA_FLOWERS')) return prev;
        return [
          {
            id: `order-pooja-${Date.now()}`,
            itemName: 'Fresh Marigold Flowers (Pooja Mala) & Sandalwood',
            category: 'POOJA_FLOWERS',
            orderDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
            units: 2,
            amountInr: 210,
            vendor: 'Quick Commerce / Local Vendor (MCP)',
            status: 'ORDERED_NOT_RECEIVED',
            trackingWaybill: 'MCP-QCOM-7781',
            eta: 'Today by 5:30 PM'
          },
          ...prev
        ];
      });
      deductCashWallet(210, 'MCP Quick Commerce: Evening Pooja Essentials');
    }
  };

  const openWebhookModal = (webhook: WhisperFloWebhook) => setSelectedWebhook(webhook);
  const closeWebhookModal = () => setSelectedWebhook(null);
  const openApiExchangeModal = (exchange: HttpApiExchange) => setSelectedApiExchange(exchange);
  const closeApiExchangeModal = () => setSelectedApiExchange(null);

  const handleTelegramAction = (action: string) => {
    if (action === 'PLAY_AUDIO') {
      setIsAudioSnippetOpen(true);
      setTelegramActionFeedback("🎧 Playing Papa's 30s Railway Wisdom snippet...");
    } else if (action === 'APPROVE_UPI_5600') {
      setTelegramActionFeedback("⚡ 1-Tap UPI Authorization Captured: ₹5,600 mandate charge approved by Priya Sharma.");
    } else if (action === 'FALLBACK_30DAY') {
      setTelegramActionFeedback("📦 Reverted to Standard 30-Day Refill: ₹840 debited under normal cap.");
    } else if (action === 'CALL_PAPA') {
      setTelegramActionFeedback("📞 Connecting direct SIP call to Papa (+91 98101 23456)...");
    } else if (action === 'CALL_DOCTOR') {
      setTelegramActionFeedback("🏥 Calling Dr. Arvind Saxena's clinic (Apollo Rohini: +91 11 2790 1200)...");
    } else if (action === 'LOCK_WHITELIST') {
      setTelegramActionFeedback("🔒 Carrier Whitelist Locked: Only verified family numbers can reach Papa.");
    } else {
      setTelegramActionFeedback(`Action executed: ${action}`);
    }

    setTimeout(() => {
      setTelegramActionFeedback(null);
    }, 4500);
  };

  const getConsolidatedStateJson = (): string => {
    const isLive = callStatus === 'active';
    const fullState = {
      timestamp: new Date().toISOString(),
      agentState: isLive ? 'LIVE_CALL_IN_PROGRESS' : currentStep.phase,
      scenario: {
        id: activeScenario.id,
        number: activeScenario.scenarioNumber,
        title: activeScenario.title,
        category: activeScenario.category,
        conversationMode: isLive ? "UNSCRIPTED_DYNAMIC" : (activeScenario.conversationMode || "UNSCRIPTED_DYNAMIC"),
        backgroundContext: activeScenario.backgroundContext || activeScenario.initialSeniorProfile.backgroundContext,
        stepIndex: currentStepIndex + 1,
        totalSteps: activeScenario.steps.length
      },
      seniorProfile: activeScenario.initialSeniorProfile,
      clinicalState: activeScenario.initialClinicalState,
      medicalIssues,
      inventoryOrders,
      cashWallet,
      moodHistory,
      fiduciaryLedger: currentStep.fiduciary,
      logisticsState: currentStep.logistics,
      callSession: {
        active: isLive,
        durationSeconds: isLive ? callDurationSeconds : currentStep.callDurationSeconds,
        carrierTrunk: activeScenario.initialSeniorProfile.telephony.carrierTrunk,
        dialect: activeScenario.initialSeniorProfile.telephony.dialect,
        turnsCount: conversationTurns.length
      },
      reasoningChain: currentStep.reasoning,
      activeGuardrails: {
        ...currentStep.reasoning.guardrails
      },
      dynamicNodesActive: dynamicExecutionNodes.map(n => ({
        id: n.id,
        nodeType: n.nodeType,
        title: n.title,
        status: n.status
      })),
      telegramReceptor: currentStep.telegramMessage || null
    };

    return JSON.stringify(fullState, null, 2);
  };

  return (
    <TelemetryContext.Provider
      value={{
        scenarios,
        activeScenario,
        currentStepIndex,
        currentStep,
        allTurnsSoFar: conversationTurns,
        isPlaying,
        pacing,
        activeTab,
        setActiveTab,
        currentStepApiExchange,
        activeTtsEngine,
        setActiveTtsEngine,
        currentlySpeakingTurnId,
        speakTurn,
        injectCustomTurn,
        speakSeniorTurns,
        setSpeakSeniorTurns: handleSetSpeakSeniorTurns,
        selectedWebhook,
        selectedApiExchange,
        isStateDrawerOpen,
        isAudioSnippetOpen,
        telegramActionFeedback,
        setScenarioById,
        stepNext,
        stepPrev,
        resetScenario,
        togglePlay,
        setPacing,
        openWebhookModal,
        closeWebhookModal,
        openApiExchangeModal,
        closeApiExchangeModal,
        setIsStateDrawerOpen,
        setIsAudioSnippetOpen,
        handleTelegramAction,
        getConsolidatedStateJson,

        // 6-Point Workflow State & Functions
        callStatus,
        startCall,
        endCall,
        callDurationSeconds,
        autoSpeak,
        setAutoSpeak,
        selectedModelId,
        setSelectedModelId,
        selectedModelConfig,
        isLlmModalOpen,
        setIsLlmModalOpen,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        settingsActiveTab,
        setSettingsActiveTab,
        openSettingsModal,
        topUpCashWallet,
        isSystemPromptModalOpen,
        setIsSystemPromptModalOpen,
        isMentorshipModalOpen,
        setIsMentorshipModalOpen,
        getLiveSystemPrompt: () => getLiveSystemPrompt(foldedMemory),
        foldedMemory,
        dynamicExecutionNodes,
        triggerSimulationPreset,
        clearDynamicNodes,

        // Medical Dossier, Live Inventory & Orders State
        medicalIssues,
        inventoryOrders,
        addInventoryOrder,

        // Fiduciary Cash Wallet & Call Scheduling
        cashWallet,
        deductCashWallet,
        updateCallFrequency,

        // Multi-Call Emotional Memory & In-Clinic Transcriber Mode
        moodHistory,
        recordCallMood,
        isTranscriberActive,
        transcriberTranscript,
        startTranscriberMode,
        stopTranscriberMode,
        syncTranscriberToEhr,

        // Caregiver Pre-Fed Configuration (Routing, Address & Limits)
        caregiverConfig,
        updateCaregiverConfig
      }}
    >
      {children}
    </TelemetryContext.Provider>
  );
};

export const useTelemetry = (): TelemetryContextType => {
  const context = useContext(TelemetryContext);
  if (!context) {
    throw new Error('useTelemetry must be used within a TelemetryProvider');
  }
  return context;
};
