/**
 * TelemetryContext — Composed Application State Provider
 * Cleanly delegates to focused custom hooks:
 * - useCallSession: Call lifecycle, status, and duration
 * - useScenarioPlayback: Scenario stepping, pacing, and navigation
 * - useTripwireGuard: Acoustic tripwire safety rail and scam interception
 * - useExecutionNodes: Dynamic node graph, deduplication, and domain rail detection
 */
import React, { createContext, useContext, useState, useRef, useMemo, useCallback, ReactNode } from 'react';
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
  CaregiverConfig,
  ElderTopicOfInterest,
  PromptSliceStatus,
  PreCallAgencyRequest,
  PreCallAgencyStatus
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
import { healthLockerService } from '../services/healthLockerService';
import { ToolExecutionNode } from '../data/nodeMapping';
import { SIMULATION_PRESETS } from '../data/simulationPrompts';
import {
  DEFAULT_MEMORY_LEDGER,
  MEDICATION_KEYWORDS,
  SYMPTOM_KEYWORDS,
  FINANCIAL_KEYWORDS,
  BREAKFAST_KEYWORDS,
  NEWS_KEYWORDS,
  WEATHER_KEYWORDS,
  JOKE_KEYWORDS,
  INTEREST_KEYWORDS,
  matchesKeywords
} from '../data/keywords';
import {
  RANDOM_COMPANION_GREETINGS,
  INITIAL_ELDER_TOPICS
} from '../data/conversationalSparks';
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
  initiateIncomingCall: () => void;
  acceptCall: () => void;
  declineCall: () => void;
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
  getLiveSystemPrompt: (memoryLedger?: string, turnCountOverride?: number, recentText?: string) => string;
  activePromptSlices: PromptSliceStatus;
  elderTopics: ElderTopicOfInterest[];
  addElderTopic: (topic: Partial<ElderTopicOfInterest>) => void;
  removeElderTopic: (id: string) => void;
  toggleElderTopic: (id: string) => void;
  foldedMemory: string;
  dynamicExecutionNodes: ToolExecutionNode[];
  triggerSimulationPreset: (presetId: string) => void;
  clearDynamicNodes: () => void;
  triggerHealthLockerRAG: (query: string, role?: 'elder' | 'caregiver') => Promise<string>;
  openApiDrawerForCurrentStep: () => void;

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

  // Caregiver Pre-Call Agency & Direct Dialing Gate
  preCallAgency: PreCallAgencyRequest;
  requestPreCallApproval: () => void;
  resolvePreCallAgency: (decision: 'caregiver_direct' | 'agent_approved' | 'snooze_30m', customNote?: string) => void;
}

/**
 * Just-In-Time (JIT) Modular System Prompt Builder
 * Prevents prompt bloat and early escalation.
 * Keeps a warm, lean companion core and conditionally attaches modular slices as required.
 */
export const buildJitSystemPrompt = (
  memoryLedger: string,
  turnCount: number = 0,
  recentUserText: string = '',
  topics: ElderTopicOfInterest[] = []
): { prompt: string; activeSlices: PromptSliceStatus } => {
  const activeTopicsList = topics.length > 0 ? topics : INITIAL_ELDER_TOPICS;
  const activeTopicsText = activeTopicsList
    .filter(t => t.isActive)
    .map(t => `• ${t.topic} (${t.source === 'CAREGIVER_CURATED' ? 'Suggested by daughter Priya' : 'Autonomously Discovered in calls'})`)
    .join('\n');

  let prompt = `You are Sambandh, a warm, affectionate, and respectful AI healthcare voice companion for 74-year-old Indian elder Ramesh Chandra in Rohini, Delhi.
Address him respectfully as अंकल, जी, or प्रणाम. Speak like a loving family member or niece who genuinely enjoys listening and talking with him.

[CORE COMPANION DIRECTIVE - ALWAYS ACTIVE]:
- You are a genuine companion FIRST, and a health monitor SECOND.
- Never interrogate or rush into a clinical checklist!
- Converse naturally and warmly about daily life, reminisce about his railway days, or share observations.
- Frequently discuss Delhi/Rohini local news, modern changes, and actively ask for his opinion/take (e.g. "अंकल जी, आपका क्या मानना है इसपर?").
- Mention the pleasant morning weather in Rohini, sitting in the balcony, or share a lighthearted wholesome elder joke.
- Make Ramesh Uncle feel that you genuinely want to talk with him, not just checking boxes.

[PAPA'S TOPICS OF INTEREST]:
${activeTopicsText || '• Northern Railway Locomotive Lore & Mechanical Signals\n• Old Mohammed Rafi & Talat Mahmood Ghazals\n• Morning Walks in Japanese Park'}

[STRUCTURED CONVERSATION MEMORY LEDGER]:
${memoryLedger}
`;

  const activeSlices: PromptSliceStatus = {
    coreCompanion: true,
    subtleAdherence: false,
    clinicalDossier: false,
    fiduciaryMandate: false,
    acousticTripwire: false
  };

  const hasHealthMention = matchesKeywords(recentUserText, [...BREAKFAST_KEYWORDS, ...MEDICATION_KEYWORDS, ...SYMPTOM_KEYWORDS]);

  // Slice A: Subtle Health & Medication Bridge (Attached around turn >= 2 or if health is mentioned)
  if (turnCount >= 2 || hasHealthMention) {
    activeSlices.subtleAdherence = true;
    prompt += `
[SUBTLE ADHERENCE REMINDER BRIDGE - ACTIVE]:
- After engaging in friendly banter, casually and affectionately check if he had his morning tea/breakfast and took his morning BP pill (Telma 40 with fresh water).
- Weave this in naturally without abruptly disrupting the mood: e.g. "वैसे रमेश अंकल, बातों-बातों में... सुबह की लाल वाली बीपी की गोली ताज़े पानी से ले ली थी ना आपने?"
- If confirmed taken, affirm warmly. If pending, gently remind him to take it after eating.
`;
  }

  // Slice B: Clinical Empathy & Observation (Injected only if symptom or pain is mentioned)
  if (matchesKeywords(recentUserText, SYMPTOM_KEYWORDS) || recentUserText.toLowerCase().includes('dard') || recentUserText.toLowerCase().includes('ghutna')) {
    activeSlices.clinicalDossier = true;
    prompt += `
[CLINICAL OBSERVATION & EMPATHY SLICE - ACTIVE]:
- Background: Essential Hypertension (Telma 40 OD), Grade-1 Knee Osteoarthritis, Mild Insomnia.
- Ramesh has reported pain or discomfort. Immediately express warm concern and gentle empathy.
- Ask gently where it hurts, recommend warm water compresses or morning sun, and never dismiss his discomfort.
`;
  }

  // Slice C: Fiduciary Refill Autonomy (Injected only if low stock / refill / financial mandate is mentioned)
  if (matchesKeywords(recentUserText, [...MEDICATION_KEYWORDS, ...FINANCIAL_KEYWORDS]) && 
      (recentUserText.toLowerCase().includes('khatam') || recentUserText.toLowerCase().includes('bachi') || recentUserText.toLowerCase().includes('refill') || recentUserText.toLowerCase().includes('order') || recentUserText.toLowerCase().includes('paisa'))) {
    activeSlices.fiduciaryMandate = true;
    prompt += `
[FIDUCIARY REFILL AUTONOMY SLICE - ACTIVE]:
- Pre-authorized envelope: Pine Labs ₹4,500 monthly cap.
- Reassure Ramesh that Sambandh and Priya have his medicine stock and delivery completely covered without any out-of-pocket stress.
`;
  }

  // Slice D: Acoustic Tripwire (If scam / suspicious caller pattern detected)
  if (recentUserText.toLowerCase().includes('otp') || recentUserText.toLowerCase().includes('cvv') || recentUserText.toLowerCase().includes('lottery') || recentUserText.toLowerCase().includes('police')) {
    activeSlices.acousticTripwire = true;
    prompt += `
[ACOUSTIC TRIPWIRE SAFETY SLICE - ACTIVE]:
- Potential financial scam attempt detected. Reassure Ramesh, advise never to share OTP/bank credentials, and confirm Sambandh protects his care envelope.
`;
  }

  prompt += `
TONE & FORMAT:
- Reply in 1-2 natural, spoken Hindi sentences in Devanagari script.
- Follow with [Hinglish in brackets] for readable reference.
- Speak like an affectionate family member, NOT a robotic script or medical lecturer.`;

  return { prompt, activeSlices };
};

export const getLiveSystemPrompt = (
  memoryLedger: string = DEFAULT_MEMORY_LEDGER,
  turnCountOverride: number = 0,
  recentText: string = ''
): string => {
  return buildJitSystemPrompt(memoryLedger, turnCountOverride, recentText).prompt;
};

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Composed Sub-Hooks
  const {
    callStatus,
    callDurationSeconds,
    beginCall,
    initiateIncomingCall,
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
    createHealthLockerNodes,
    createPreCallApprovalNode,
    detectDomainNodes,
    triggerPresetNodes
  } = useExecutionNodes();

  // Navigation & Modals (Defaults to Tab 1: Elder Screen)
  const [activeTab, setActiveTab] = useState<NavigationTab>('elder');
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

  const triggerHealthLockerRAG = useCallback(async (query: string, role: 'elder' | 'caregiver' = 'elder'): Promise<string> => {
    const res = await healthLockerService.queryHealthLocker({
      query,
      seniorId: 'SENIOR_RAMESH_001',
      callerRole: role,
      mode: 'auto'
    });
    const nodes = createHealthLockerNodes(query, res.latency_ms, res.analysis);
    addUniqueNodes(nodes);
    return res.analysis;
  }, [createHealthLockerNodes, addUniqueNodes]);

  const openApiDrawerForCurrentStep = useCallback(() => {
    if (currentStepApiExchange) {
      setSelectedApiExchange(currentStepApiExchange);
    }
  }, [currentStepApiExchange]);

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

  // Pre-Call Caregiver Agency & Consent State
  const [preCallAgency, setPreCallAgency] = useState<PreCallAgencyRequest>({
    id: 'precall-req-001',
    timestamp: '08:20 AM IST',
    seniorName: 'Ramesh Chandra (Papa)',
    seniorPhone: '+91 98101 23456',
    scheduledTimeIst: '08:30 AM IST',
    status: 'awaiting_approval',
    caregiverName: 'Priya Sharma (Daughter)',
    clinicalBriefingSnippet: 'Omron BP 128/82 mmHg · Telmisartan 40mg (6 days stock runway) · High vitality'
  });

  const requestPreCallApproval = useCallback(() => {
    setPreCallAgency(prev => ({
      ...prev,
      id: `precall-req-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      status: 'awaiting_approval',
      caregiverDecision: undefined,
      caregiverNotes: undefined
    }));
    setTelegramActionFeedback('🔔 Pre-Call Agency Prompt Dispatched to Priya (@priya_sharma_care). Awaiting choice: Direct Call vs AI Delegated.');
    setTimeout(() => setTelegramActionFeedback(null), 4500);
  }, []);

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

  const addElderTopic = (newTopicData: Partial<ElderTopicOfInterest>) => {
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
  };

  const removeElderTopic = (id: string) => {
    setElderTopics(prev => {
      const updated = prev.filter(t => t.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sambandh_elder_topics', JSON.stringify(updated));
      }
      return updated;
    });
  };

  const toggleElderTopic = (id: string) => {
    setElderTopics(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, isActive: !t.isActive } : t);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sambandh_elder_topics', JSON.stringify(updated));
      }
      return updated;
    });
  };

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
      callTurnCountRef.current += 1;
      const lower = content.toLowerCase();

      // Autonomous discovery of new elder topics from spontaneous conversation
      let discovered: Partial<ElderTopicOfInterest> | null = null;
      if ((lower.includes('railway') || lower.includes('loco') || lower.includes('engine') || lower.includes('signal') || lower.includes('workshop')) && 
          !elderTopics.some(t => t.topic.toLowerCase().includes('railway') || t.topic.toLowerCase().includes('signal'))) {
        discovered = {
          topic: 'Northern Railway Signaling & Locomotive Lore',
          category: 'RAILWAYS_CAREER',
          source: 'AUTONOMOUSLY_DISCOVERED',
          addedBy: 'Sambandh Cognitive Memory',
          enthusiasmLevel: 'VERY_HIGH',
          notes: 'Ramesh enthusiastically recalled memories of railway signaling, workshop protocols, and locomotives.'
        };
      } else if ((lower.includes('rafi') || lower.includes('ghazal') || lower.includes('geet') || lower.includes('radio') || lower.includes('song')) && 
                 !elderTopics.some(t => t.topic.toLowerCase().includes('ghazal') || t.topic.toLowerCase().includes('rafi'))) {
        discovered = {
          topic: 'Old Ghazals & Morning Radio Melodies',
          category: 'MUSIC_CULTURE',
          source: 'AUTONOMOUSLY_DISCOVERED',
          addedBy: 'Sambandh Cognitive Memory',
          enthusiasmLevel: 'HIGH',
          notes: 'Fond reflections on classic melodies by Mohammed Rafi and Talat Mahmood.'
        };
      } else if ((lower.includes('tulsi') || lower.includes('phool') || lower.includes('gamle') || lower.includes('gardening')) && 
                 !elderTopics.some(t => t.topic.toLowerCase().includes('tulsi') || t.topic.toLowerCase().includes('garden'))) {
        discovered = {
          topic: 'Balcony Gardening & Seasonal Tulsi Care',
          category: 'GARDENING_ROUTINE',
          source: 'AUTONOMOUSLY_DISCOVERED',
          addedBy: 'Sambandh Cognitive Memory',
          enthusiasmLevel: 'HIGH',
          notes: 'Morning routine of tending to potted plants on the Rohini balcony.'
        };
      } else if ((lower.includes('park') || lower.includes('sair') || lower.includes('walking') || lower.includes('japanese')) && 
                 !elderTopics.some(t => t.topic.toLowerCase().includes('park') || t.topic.toLowerCase().includes('walk'))) {
        discovered = {
          topic: 'Morning Walks & Discussions at Japanese Park',
          category: 'GARDENING_ROUTINE',
          source: 'AUTONOMOUSLY_DISCOVERED',
          addedBy: 'Sambandh Cognitive Memory',
          enthusiasmLevel: 'HIGH',
          notes: 'Enjoys socializing and taking morning walks in Sector 14 Japanese park.'
        };
      } else if ((lower.includes('metro') || lower.includes('rithala') || lower.includes('flyover')) && 
                 !elderTopics.some(t => t.topic.toLowerCase().includes('metro'))) {
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
        const nodeTimestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
        addUniqueNodes([{
          id: `node-topic-${Date.now()}`,
          stepIndex: conversationTurns.length,
          nodeType: 'caregiver',
          brandName: 'Cognitive Memory',
          toolName: 'topic_extraction_engine',
          title: `💡 Discovered Interest: ${discovered.topic}`,
          actionSummary: `Autonomously logged new conversation interest: "${discovered.topic}". Added to Papa's active interest pool.`,
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
        }]);
      }

      // Build JIT modular system prompt (avoids upfront bloat & early escalation)
      const { prompt: systemPrompt, activeSlices } = buildJitSystemPrompt(
        foldedMemory,
        callTurnCountRef.current,
        content,
        elderTopics
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
          const llmNode = createLlmNode(
            modelDisplayName,
            result.latencyMs || 280,
            content,
            result.text
          );
          const domainNodes = detectDomainNodes(content + ' ' + result.text);
          const hlNodes = isClinicalQuery ? createHealthLockerNodes(content, 184, result.text) : [];
          addUniqueNodes([llmNode, ...domainNodes, ...hlNodes]);

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
    callTurnCountRef.current = 0;

    setActivePromptSlices({
      coreCompanion: true,
      subtleAdherence: false,
      clinicalDossier: false,
      fiduciaryMandate: false,
      acousticTripwire: false
    });

    // Random companion greeting from curated authentic pool
    const randomGreeting = RANDOM_COMPANION_GREETINGS[Math.floor(Math.random() * RANDOM_COMPANION_GREETINGS.length)];

    const greetingTurn: ConversationTurn = {
      id: `greeting-turn-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      speaker: 'agent',
      lane: 'lane1',
      speakerLabel: 'Sambandh Companion (Agent)',
      content: randomGreeting.fullTurnText
    };

    setConversationTurns([greetingTurn]);
    seedInitialCallNode(activeTtsEngine === 'chrome');

    if (autoSpeak) {
      setTimeout(() => {
        speakTurn(greetingTurn);
      }, 300);
    }
  };

  const acceptCall = () => {
    startCall();
  };

  const declineCall = () => {
    stopSpeech();
    if (speechAdvanceTimeoutRef.current) clearTimeout(speechAdvanceTimeoutRef.current);
    resetCallState();
    setTelegramActionFeedback("📴 Call Declined: Ramesh Ji was unable to take the call. Next check-in scheduled in 30 mins.");
    setTimeout(() => setTelegramActionFeedback(null), 4000);
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

  const resolvePreCallAgency = useCallback((
    decision: 'caregiver_direct' | 'agent_approved' | 'snooze_30m',
    customNote?: string
  ) => {
    const node = createPreCallApprovalNode(decision);
    addUniqueNodes([node]);

    if (decision === 'caregiver_direct') {
      setPreCallAgency(prev => ({
        ...prev,
        status: 'caregiver_calling',
        caregiverDecision: decision,
        caregiverNotes: customNote || "Priya: 'I will call Papa myself today. Automated AI call suspended.'"
      }));
      setTelegramActionFeedback("📞 Direct Call Mode: Priya is speaking with Papa directly (+91 98101 23456). AI dialing suspended.");
    } else if (decision === 'agent_approved') {
      setPreCallAgency(prev => ({
        ...prev,
        status: 'agent_approved',
        caregiverDecision: decision,
        caregiverNotes: customNote || "Priya: 'Approved Sambandh AI morning companionship call.'"
      }));
      setTelegramActionFeedback("🤖 Pre-Call Consent Captured: Priya approved Sambandh AI check-in. Ringing Ramesh Ji's phone over Jio PSTN...");
      // Trigger incoming call ringing on elder's phone
      initiateIncomingCall();
    } else if (decision === 'snooze_30m') {
      setPreCallAgency(prev => ({
        ...prev,
        status: 'snoozed',
        caregiverDecision: decision,
        caregiverNotes: customNote || "Priya requested a 30-minute delay."
      }));
      setTelegramActionFeedback("⏰ Check-In Postponed: Snoozed by 30 minutes. Next notification scheduled for 09:00 AM IST.");
    }

    setTimeout(() => setTelegramActionFeedback(null), 4500);
  }, [createPreCallApprovalNode, addUniqueNodes, initiateIncomingCall]);

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
    if (action === 'PRECALL_CALL_MYSELF') {
      resolvePreCallAgency('caregiver_direct');
      return;
    } else if (action === 'PRECALL_APPROVE_AI') {
      resolvePreCallAgency('agent_approved');
      return;
    } else if (action === 'PRECALL_SNOOZE_30M') {
      resolvePreCallAgency('snooze_30m');
      return;
    } else if (action === 'PLAY_AUDIO') {
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
        initiateIncomingCall,
        acceptCall,
        declineCall,
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
        getLiveSystemPrompt: (customMemory?: string, turnCountOverride?: number, recentText?: string) => 
          getLiveSystemPrompt(customMemory || foldedMemory, turnCountOverride ?? callTurnCountRef.current, recentText),
        activePromptSlices,
        elderTopics,
        addElderTopic,
        removeElderTopic,
        toggleElderTopic,
        foldedMemory,
        dynamicExecutionNodes,
        triggerSimulationPreset,
        clearDynamicNodes,
        triggerHealthLockerRAG,
        openApiDrawerForCurrentStep,

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
        updateCaregiverConfig,

        // Caregiver Pre-Call Agency & Direct Dialing Gate
        preCallAgency,
        requestPreCallApproval,
        resolvePreCallAgency
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
