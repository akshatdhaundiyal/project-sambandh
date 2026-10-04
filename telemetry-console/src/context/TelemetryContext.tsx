/**
 * TelemetryContext — Composed Application State Provider
 * Cleanly delegates to focused custom hooks and services:
 * - useCallSession: Call lifecycle, status, and duration
 * - useScenarioPlayback: Scenario stepping, pacing, and navigation
 * - useExecutionNodes: Dynamic node graph, deduplication, and domain rail detection
 * - useAudioPipeline: Active TTS engine, speech synthesis, and auto-playback
 * - useConversationEngine: LLM inference, conversational memory folding, and topic discovery
 * - useFiduciaryLedger: Pine Labs wallet, medication replenishment, and caregiver limits
 * - useCaregiverState: Pre-call agency consent, longitudinal emotional memory, and in-clinic transcriber
 * - useYouthMentorship: Intergenerational wisdom portal, question safety gating, and speech synthesis
 */
import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import {
  Scenario,
  ScenarioStep,
  ConversationTurn,
  GnaniVoiceWebhook,
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
  MentorshipExchangeItem,
  YouthPersona,
  MedicationApprovalRequest,
  DoctorAppointmentApprovalRequest,
  MedicationItem
} from '../types/telemetry';
import { healthLockerService, saveCallSummary } from '../services/healthLockerService';
import { executeApprovedMedicationOrder } from '../services/toolCallingService';
import {
  sendTelegramMedicationApprovalCard,
  sendTelegramDoctorAppointmentApprovalCard,
  sendTelegramDoctorAppointmentBookingMessage,
  sendTelegramDailyCareBriefing,
  sendTelegramMissedCallAlert,
  testTelegramBotConnection
} from '../services/telegramBotService';
import { generatePostCallSummary, GeneratedCallSummary } from '../services/llmService';
import { ToolExecutionNode } from '../data/nodeMapping';
import { SIMULATION_PRESETS } from '../data/simulationPrompts';
import {
  useCallSession,
  useExecutionNodes,
  useScenarioPlayback,
  useYouthMentorship,
  useFiduciaryLedger,
  useCaregiverState,
  useAudioPipeline,
  useConversationEngine,
  PacingOption,
  getStepApiExchange
} from '../hooks';
import { useDoctorConsultation, LiveClinicalObservation } from '../hooks/useDoctorConsultation';
import {
  DoctorConsultationSession,
  DoctorConsultationSpeaker,
  DoctorConsultationAttachment
} from '../types/telemetry';
import {
  buildJitSystemPrompt,
  getLiveSystemPrompt,
  getConcatenatedFullSystemPrompt,
  DEFAULT_MEMORY_LEDGER,
  DynamicElderProfile
} from '../services/promptBuilder';

export { buildJitSystemPrompt, getLiveSystemPrompt, getConcatenatedFullSystemPrompt, DEFAULT_MEMORY_LEDGER };
export type { PacingOption };
export { getStepApiExchange };

interface TelemetryContextType {
  seniorProfile: DynamicElderProfile;
  updateSeniorProfile: (updates: Partial<DynamicElderProfile>) => Promise<void>;
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
  selectedWebhook: GnaniVoiceWebhook | null;
  selectedApiExchange: HttpApiExchange | null;
  isStateDrawerOpen: boolean;
  isAudioSnippetOpen: boolean;
  telegramActionFeedback: string | null;
  activeTtsEngine: 'browser' | 'gnani';
  setActiveTtsEngine: (engine: 'browser' | 'gnani') => void;
  currentlySpeakingTurnId: string | null;
  isAgentGenerating: boolean;
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
  openWebhookModal: (webhook: GnaniVoiceWebhook) => void;
  closeWebhookModal: () => void;
  openApiExchangeModal: (exchange: HttpApiExchange) => void;
  closeApiExchangeModal: () => void;
  setIsStateDrawerOpen: (open: boolean) => void;
  setIsAudioSnippetOpen: (open: boolean) => void;
  handleTelegramAction: (action: string) => void;
  getConsolidatedStateJson: () => string;

  // 6-Point Workflow State & Functions
  callStatus: CallStatus;
  callAttempt: number;
  isWaitingForRetry: boolean;
  retryCountdownSeconds: number;
  ringSecondsLeft: number;
  lastMissedCallAt: string | null;
  fastForwardRetry: () => void;
  handleCallUnanswered: () => void;
  startCall: () => void;
  initiateIncomingCall: (attemptNumber?: number) => void;
  acceptCall: () => void;
  declineCall: () => void;
  endCall: () => void;
  callDurationSeconds: number;
  autoSpeak: boolean;
  setAutoSpeak: (val: boolean) => void;
  selectedModelId: string;
  setSelectedModelId: (id: string) => void;
  selectedModelConfig: LlmModelConfig;
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  settingsActiveTab: 'brain' | 'telephony' | 'wallet' | 'routing';
  setSettingsActiveTab: (tab: 'brain' | 'telephony' | 'wallet' | 'routing') => void;
  openSettingsModal: (tab?: 'brain' | 'telephony' | 'wallet' | 'routing') => void;
  topUpCashWallet: (amountInr: number) => void;
  isSystemPromptModalOpen: boolean;
  setIsSystemPromptModalOpen: (open: boolean) => void;
  getLiveSystemPrompt: (memoryLedger?: string, turnCountOverride?: number, recentText?: string) => string;
  activePromptSlices: PromptSliceStatus;
  elderTopics: ElderTopicOfInterest[];
  addElderTopic: (topic: Partial<ElderTopicOfInterest>) => void;
  removeElderTopic: (id: string) => void;
  toggleElderTopic: (id: string) => void;
  foldedMemory: string;
  dynamicExecutionNodes: ToolExecutionNode[];
  addDynamicExecutionNodes: (nodes: ToolExecutionNode[]) => void;
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

  // Youth Mentorship & Intergenerational Wisdom (Tab 4)
  activeMentorshipQuestion: MentorshipExchangeItem | null;
  mentorshipHistory: MentorshipExchangeItem[];
  pendingCaregiverMentorshipQuestions: MentorshipExchangeItem[];
  approvedMentorshipQuestions: MentorshipExchangeItem[];
  submitYouthQuestion: (
    youth: YouthPersona,
    questionText: string,
    category: 'GENUINE' | 'MALICIOUS',
    domainTopic: string,
    presetMetadata?: { curatedSpeechHindi?: string; mockElderAnswer?: string }
  ) => Promise<MentorshipExchangeItem>;
  evaluateMentorshipQuestion: (questionId: string) => Promise<void>;
  approveMentorshipQuestion: (questionId: string) => Promise<void>;
  rejectMentorshipQuestion: (questionId: string, reason?: string) => Promise<void>;
  simulateElderAnswerVoice: (questionId: string) => Promise<void>;

  // In-Clinic Doctor Consultation Bridge & Ambient Transformation
  consultationSession: DoctorConsultationSession;
  isConsultationModalOpen: boolean;
  setIsConsultationModalOpen: (open: boolean) => void;
  openConsultationModal: () => void;
  closeConsultationModal: () => void;
  isListeningConsultation: boolean;
  isTransformingConsultation: boolean;
  liveSpokenSnippetConsultation: string;
  liveObservationsConsultation: LiveClinicalObservation;
  simulateNextConsultationTurn: () => void;
  startLiveListeningConsultation: () => void;
  stopLiveListeningConsultation: () => void;
  startDoctorConsultation: (initiatedBy: 'senior' | 'caregiver', caregiverAttending: boolean) => void;
  addDoctorConsultationTurn: (speaker: DoctorConsultationSpeaker | 'ambient', content: string, hindiText?: string) => void;
  toggleCaregiverAttendance: () => void;
  attachDocumentToConsultation: (attachment: Omit<DoctorConsultationAttachment, 'id' | 'uploadedAt'>) => void;
  completeDoctorConsultation: () => void;
  resetDoctorConsultation: () => void;

  // Caregiver Medication Refill Approval Gate (Human-in-the-Loop)
  pendingMedicationApproval: MedicationApprovalRequest | null;
  createMedicationApprovalRequest: (req?: Partial<MedicationApprovalRequest>) => MedicationApprovalRequest;
  approveMedicationOrder: (approvalId?: string) => Promise<void>;
  declineMedicationOrder: (approvalId?: string) => void;
  resetMedicationApproval: () => void;

  // Caregiver Doctor Appointment Approval Gate (Human-in-the-Loop)
  pendingDoctorAppointment: DoctorAppointmentApprovalRequest | null;
  createDoctorAppointmentApprovalRequest: (req?: Partial<DoctorAppointmentApprovalRequest>) => DoctorAppointmentApprovalRequest;
  approveDoctorAppointment: (approvalId?: string) => Promise<void>;
  declineDoctorAppointment: (approvalId?: string) => void;
  resetDoctorAppointmentApproval: () => void;

  // Live Telegram Bot Integration
  dispatchTelegramCareBriefing: (summaryOverride?: string) => Promise<any>;

  // Dynamic Post-Call Summary State
  latestCallSummary: GeneratedCallSummary | null;
  isGeneratingSummary: boolean;
  setLatestCallSummary: (summary: GeneratedCallSummary | null) => void;
}

const TelemetryContext = createContext<TelemetryContextType | undefined>(undefined);

export const TelemetryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
  const [selectedWebhook, setSelectedWebhook] = useState<GnaniVoiceWebhook | null>(null);
  const [selectedApiExchange, setSelectedApiExchange] = useState<HttpApiExchange | null>(null);
  const [isStateDrawerOpen, setIsStateDrawerOpen] = useState<boolean>(false);
  const [isAudioSnippetOpen, setIsAudioSnippetOpen] = useState<boolean>(false);
  const [telegramActionFeedback, setTelegramActionFeedback] = useState<string | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [settingsActiveTab, setSettingsActiveTab] = useState<'brain' | 'telephony' | 'wallet' | 'routing'>('brain');
  const [isSystemPromptModalOpen, setIsSystemPromptModalOpen] = useState<boolean>(false);
  const [latestCallSummary, setLatestCallSummary] = useState<GeneratedCallSummary | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState<boolean>(false);

  // Feedback toast notification helper
  const showFeedbackToast = useCallback((msg: string) => {
    setTelegramActionFeedback(msg);
    setTimeout(() => setTelegramActionFeedback(null), 3500);
  }, []);

  // Missed Call Safety Escalation Dispatcher (2-tier failure -> Telegram alert + Telemetry DAG)
  const handleMissedCallEscalation = useCallback((attempts: number) => {
    // 1. Send live Telegram Alert to Rohan
    sendTelegramMissedCallAlert({
      seniorName: 'Ramesh Chandra',
      seniorAge: 72,
      phone: '+91 98101 23456',
      location: 'Rohini Sector 8, New Delhi',
      attempts,
      intervalText: '1 minute'
    }).catch(err => console.warn('[Telegram Missed Call Alert Error]:', err));

    // 2. Attach escalation telemetry node
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    addUniqueNodes([
      {
        id: `node-missed-call-escalation-${Date.now()}`,
        stepIndex: 1,
        nodeType: 'telephony',
        brandName: 'Gnani.ai Jio PSTN Rail',
        toolName: 'telephony_safety_escalation',
        title: `🚨 Emergency Escalation: 2 Unanswered Calls`,
        actionSummary: `Ramesh Uncle did not answer 2 consecutive morning check-in calls (1 min apart). Priority Telegram alert dispatched to Rohan Sharma suggesting neighbour (Verma Ji) physical check.`,
        timestamp: timeStr,
        status: 'TERMINATED',
        statusCode: '408 REQUEST TIMEOUT (ESCALATED)',
        latencyMs: 140,
        brandColor: '#E11D48',
        reasoningSnippet: `[SAFETY SENTINEL ESCALATION]: Both dial attempt 1 and attempt 2 (after 1m pause) timed out after 20s. Telegram alert pushed to @rohan_sharma_care suggesting contact with Papa or neighbours (Verma Ji).`,
        apiExchange: {
          railName: 'Telegram MTProto Bot Gateway Rail',
          method: 'POST',
          endpoint: 'https://api.telegram.org/bot[TOKEN]/sendMessage',
          schemaStandard: 'Telegram Bot API v7.2 Urgent Safety Alert Protocol',
          headers: { 'Content-Type': 'application/json' },
          requestBody: {
            chat_id: '@rohan_sharma_care',
            notification_type: 'URGENT_UNANSWERED_CHECKIN',
            senior_name: 'Ramesh Chandra',
            attempts: 2,
            interval: '1 minute'
          },
          responseStatus: 200,
          responseStatusText: 'OK',
          responseLatencyMs: 120,
          responseHeaders: { 'Content-Type': 'application/json' },
          responseBody: { ok: true, result: { message_id: 994821, status: 'DELIVERED_TO_CAREGIVER' } }
        }
      }
    ]);
  }, [addUniqueNodes]);

  // Composed Sub-Hooks
  const {
    callStatus,
    callDurationSeconds,
    callAttempt,
    isWaitingForRetry,
    retryCountdownSeconds,
    ringSecondsLeft,
    lastMissedCallAt,
    beginCall,
    initiateIncomingCall,
    endCall: endCallSession,
    resetCallState,
    fastForwardRetry,
    handleCallUnanswered
  } = useCallSession({
    onEscalateMissedCall: handleMissedCallEscalation,
    onToast: showFeedbackToast
  });

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

  const openSettingsModal = useCallback((tab: 'brain' | 'telephony' | 'wallet' | 'routing' = 'brain') => {
    setSettingsActiveTab(tab);
    setIsSettingsModalOpen(true);
  }, []);

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

  // Audio / Speech Pipeline - Isolated Domain Hook
  const {
    activeTtsEngine,
    setActiveTtsEngine,
    currentlySpeakingTurnId,
    autoSpeak,
    setAutoSpeak,
    speakSeniorTurns,
    handleSetSpeakSeniorTurns,
    speakTurn,
    stopActiveSpeech
  } = useAudioPipeline({
    isPlaying,
    callStatus,
    onPlaybackAdvance: stepNext
  });

  // Fiduciary Wallet & Medication Orders - Isolated Domain Hook
  const {
    medicalIssues,
    setMedicalIssues,
    inventoryOrders,
    setInventoryOrders,
    addInventoryOrder,
    cashWallet,
    deductCashWallet,
    updateCallFrequency,
    topUpCashWallet,
    caregiverConfig,
    updateCaregiverConfig
  } = useFiduciaryLedger({
    onFeedbackToast: showFeedbackToast
  });

  // Longitudinal Memory, Pre-Call Agency & In-Clinic Transcriber - Isolated Domain Hook
  const {
    seniorProfile,
    updateSeniorProfile,
    preCallAgency,
    setPreCallAgency,
    requestPreCallApproval,
    moodHistory,
    recordCallMood,
    isTranscriberActive,
    transcriberTranscript,
    startTranscriberMode,
    stopTranscriberMode,
    syncTranscriberToEhr
  } = useCaregiverState({
    onFeedbackToast: showFeedbackToast,
    onAddMedicalIssue: useCallback((newIssue: MedicalIssue) => {
      setMedicalIssues(prev => [newIssue, ...prev]);
    }, [setMedicalIssues])
  });

  // Youth Mentorship (Tab 4) - Isolated Domain Hook (referenced before useConversationEngine for JIT slices)
  const {
    activeMentorshipQuestion,
    mentorshipHistory,
    pendingCaregiverQuestions,
    approvedQuestions,
    submitYouthQuestion,
    evaluateMentorshipQuestion,
    approveMentorshipQuestion,
    rejectMentorshipQuestion,
    simulateElderAnswerVoice
  } = useYouthMentorship({
    activeTtsEngine,
    handleTelegramAction: showFeedbackToast
  });

  // Dynamic Molecules State (Updated by In-Clinic Doctor Consultations & Refills)
  const [customMolecules, setCustomMolecules] = useState<MedicationItem[]>([]);

  const effectiveMolecules = useMemo<MedicationItem[]>(() => {
    const base = activeScenario.initialClinicalState.activeMolecules;
    if (customMolecules.length === 0) return base;
    const filtered = base.filter(m => !customMolecules.some(c => c.id === m.id || c.name === m.name));
    return [...filtered, ...customMolecules];
  }, [activeScenario, customMolecules]);

  // In-Clinic Doctor Consultation Bridge & Ambient Transformation - Isolated Domain Hook
  const {
    consultationSession,
    isConsultationModalOpen,
    setIsConsultationModalOpen,
    openConsultationModal,
    closeConsultationModal,
    isListening: isListeningConsultation,
    isTransforming: isTransformingConsultation,
    liveSpokenSnippet: liveSpokenSnippetConsultation,
    liveObservations: liveObservationsConsultation,
    simulateNextConsultationTurn,
    startLiveListening: startLiveListeningConsultation,
    stopLiveListening: stopLiveListeningConsultation,
    startDoctorConsultation,
    addDoctorConsultationTurn,
    toggleCaregiverAttendance,
    attachDocumentToConsultation,
    completeDoctorConsultation,
    resetDoctorConsultation
  } = useDoctorConsultation({
    onFeedbackToast: showFeedbackToast,
    onAddMedicalIssue: useCallback((newIssue: MedicalIssue) => {
      setMedicalIssues(prev => [newIssue, ...prev]);
    }, [setMedicalIssues]),
    onAddNewMolecules: useCallback((newMolecules: MedicationItem[]) => {
      setCustomMolecules(prev => {
        const filtered = prev.filter(m => !newMolecules.some(n => n.id === m.id || n.name === m.name));
        return [...filtered, ...newMolecules];
      });
      showFeedbackToast(`💊 Active Prescriptions Updated: Added ${newMolecules.map(m => m.brand).join(', ')} to clinical profile!`);
    }, [showFeedbackToast]),
    seniorProfile
  });

  // Caregiver Medication Refill Approval Gate (HITL)
  const [pendingMedicationApproval, setPendingMedicationApproval] = useState<MedicationApprovalRequest | null>(null);

  const createMedicationApprovalRequest = useCallback((req?: Partial<MedicationApprovalRequest>): MedicationApprovalRequest => {
    const defaultAddress = caregiverConfig.elderHomeAddress || 'Flat 402, Block C, Pocket 2, Rohini Sector 8, New Delhi 110085';
    const defaultVendor = caregiverConfig.nearestPharmacyName || 'Netmeds / Apollo DarkStore Sector 11';
    const newRequest: MedicationApprovalRequest = {
      id: `approval-refill-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      medicationName: req?.medicationName || 'Telma 40mg (Telmisartan)',
      dosage: req?.dosage || '40mg',
      units: req?.units || 30,
      costInr: req?.costInr || 840,
      vendor: req?.vendor || defaultVendor,
      deliveryAddress: req?.deliveryAddress || defaultAddress,
      recipientPhone: req?.recipientPhone || '+91 98101 23456',
      reason: req?.reason || "Papa reported only 2 days of BP medication remaining in morning check-in call.",
      status: 'AWAITING_APPROVAL'
    };
    setPendingMedicationApproval(newRequest);

    // Asynchronously dispatch live Telegram approval card to Rohan's real phone
    sendTelegramMedicationApprovalCard(newRequest)
      .then(res => {
        if (res.success) {
          showFeedbackToast("✈️ Dispatched live approval alert card to Rohan's Telegram!");
        }
      })
      .catch(err => {
        console.warn('[Telegram Dispatch Warning]:', err);
      });

    return newRequest;
  }, [caregiverConfig, showFeedbackToast]);

  const dispatchTelegramCareBriefing = useCallback(async (summaryOverride?: string) => {
    const summary = summaryOverride || latestCallSummary?.summaryText || "Papa completed his check-in with high spirits. Prescribed medications confirmed taken with water.";
    const vitality = latestCallSummary?.sentimentScore || 94;
    const mood = latestCallSummary?.sentiment === 'CHEERFUL' ? '🌿 Cheerful & Nostalgic' : '😊 Calm & Stable';
    const adherence = latestCallSummary?.adherenceStatus || '✅ Morning prescribed medication confirmed taken with fresh water';

    const res = await sendTelegramDailyCareBriefing({
      summaryText: summary,
      vitalityScore: vitality,
      mood,
      adherence
    });
    if (res.success) {
      showFeedbackToast("✈️ Live Care Briefing sent to Rohan's Telegram chat!");
    } else {
      showFeedbackToast(`⚠️ Telegram Push: ${res.error || 'Failed'}`);
    }
    return res;
  }, [latestCallSummary, showFeedbackToast]);

  // Conversation & LLM Inference Engine - Isolated Domain Hook
  const {
    selectedModelId,
    setSelectedModelId,
    selectedModelConfig,
    conversationTurns,
    foldedMemory,
    elderTopics,
    addElderTopic,
    removeElderTopic,
    toggleElderTopic,
    activePromptSlices,
    initiateCallGreeting,
    injectCustomTurn,
    resetConversation,
    getSystemPromptSnapshot,
    isAgentGenerating
  } = useConversationEngine({
    autoSpeak,
    speakSeniorTurns,
    speakTurn,
    stopActiveSpeech,
    currentlySpeakingTurnId,
    orderTotalLimitInr: caregiverConfig.orderTotalLimitInr,
    activeMentorshipQuestion,
    seniorProfile,
    activeMolecules: effectiveMolecules,
    onFeedbackToast: showFeedbackToast,
    onDeductCashWallet: deductCashWallet,
    onAddInventoryOrder: addInventoryOrder,
    onRequestMedicationApproval: createMedicationApprovalRequest,
    onRequestDoctorAppointmentApproval: (req) => {
      createDoctorAppointmentApprovalRequest(req);
    },
    createLlmNode,
    createHealthLockerNodes,
    detectDomainNodes,
    addUniqueNodes,
    seedInitialCallNode
  });

  const approveMedicationOrder = useCallback(async (approvalId?: string) => {
    const target = pendingMedicationApproval;
    if (!target) return;

    try {
      const result = await executeApprovedMedicationOrder(target, {
        onAddNodes: addUniqueNodes,
        onDeductWallet: deductCashWallet,
        onAddInventoryOrder: addInventoryOrder,
        onInjectTurn: (content, speaker) => {
          injectCustomTurn(content, speaker);
        },
        onToast: showFeedbackToast
      });

      setPendingMedicationApproval(prev => prev ? {
        ...prev,
        status: 'APPROVED',
        approvedAt: result.approvedAt,
        orderId: result.orderId,
        trackingWaybill: result.waybill,
        deliveryEta: result.eta
      } : null);
    } catch (err: any) {
      console.error('[ApproveMedicationOrder Error]:', err);
      showFeedbackToast(`❌ Failed to execute order: ${err.message}`);
    }
  }, [pendingMedicationApproval, addUniqueNodes, deductCashWallet, addInventoryOrder, injectCustomTurn, showFeedbackToast]);

  const declineMedicationOrder = useCallback((approvalId?: string) => {
    setPendingMedicationApproval(prev => prev ? {
      ...prev,
      status: 'DECLINED',
      declinedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
    } : null);

    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    addUniqueNodes([
      {
        id: `node-declined-${Date.now()}`,
        stepIndex: 2,
        nodeType: 'caregiver',
        brandName: 'Caregiver Human Gate',
        toolName: 'decline_medication_refill',
        title: 'Medication Refill Declined by Rohan',
        actionSummary: 'Caregiver Rohan Sharma clicked [Decline Refill]. Order cancelled, zero wallet debit.',
        timestamp,
        status: 'BLOCKED',
        statusCode: 'REFILL_DECLINED',
        latencyMs: 20,
        brandColor: '#6B7280',
        reasoningSnippet: '[CAREGIVER SIGN-OFF]: Rohan declined medication refill. No B2B order placed; fiduciary wallet remains untouched.',
        apiExchange: {
          railName: 'Sambandh HITL Caregiver Approval Rail',
          method: 'POST',
          endpoint: '/v1/caregiver/approvals/refill-decline',
          schemaStandard: 'Sambandh HITL Safety Rail v2',
          headers: { 'Content-Type': 'application/json' },
          requestBody: { status: 'DECLINED', reason: 'Caregiver review' },
          responseStatus: 200,
          responseStatusText: 'OK (Refusal Recorded)',
          responseLatencyMs: 20,
          responseHeaders: { 'Content-Type': 'application/json' },
          responseBody: { status: 'CANCELLED_BY_CAREGIVER', wallet_debit_inr: 0 }
        }
      }
    ]);
    showFeedbackToast('🛑 Refill Declined: Caregiver Rohan declined the refill request. Zero money debited.');
  }, [addUniqueNodes, showFeedbackToast]);

  const resetMedicationApproval = useCallback(() => {
    setPendingMedicationApproval(null);
  }, []);

  // Caregiver Doctor Appointment Approval Gate (HITL)
  const [pendingDoctorAppointment, setPendingDoctorAppointment] = useState<DoctorAppointmentApprovalRequest | null>(null);

  const createDoctorAppointmentApprovalRequest = useCallback((req?: Partial<DoctorAppointmentApprovalRequest>): DoctorAppointmentApprovalRequest => {
    const docName = seniorProfile.doctorName || 'Dr. Arvind Saxena';
    const clinicName = seniorProfile.doctorClinic || 'Apollo Clinic, Rohini Sector 8 (+91 11 2790 1200)';
    const newRequest: DoctorAppointmentApprovalRequest = {
      id: `approval-doc-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      seniorName: seniorProfile.name,
      seniorAge: seniorProfile.age,
      seniorAddress: caregiverConfig.elderHomeAddress || 'Flat 402, Block C, Pocket 2, Rohini Sector 8, New Delhi',
      symptoms: req?.symptoms || ['Discomfort / symptoms reported during check-in call'],
      chiefComplaint: req?.chiefComplaint || 'Papa reported feeling unwell during morning voice check-in.',
      doctorName: docName,
      doctorSpecialty: 'MD (Internal Medicine & Geriatrics)',
      doctorClinic: clinicName,
      doctorPhone: '+91 11 2790 1200',
      appointmentSlot: req?.appointmentSlot || 'Today, 04:30 PM (Priority Senior Slot)',
      status: 'AWAITING_APPROVAL'
    };
    setPendingDoctorAppointment(newRequest);

    // Asynchronously dispatch live Telegram approval card to Rohan's Telegram
    sendTelegramDoctorAppointmentApprovalCard(newRequest)
      .then(res => {
        if (res.success) {
          showFeedbackToast("🩺 Dispatched Doctor Consultation approval card to Rohan's Telegram!");
        }
      })
      .catch(err => {
        console.warn('[Telegram Doctor Approval Warning]:', err);
      });

    return newRequest;
  }, [seniorProfile, caregiverConfig, showFeedbackToast]);

  const approveDoctorAppointment = useCallback(async (approvalId?: string) => {
    const target = pendingDoctorAppointment;
    if (!target) return;

    try {
      const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
      const bookingRef = `APOLLO-ROH-${target.id.slice(-6).toUpperCase()}`;

      // 1. Dispatch automated booking message to the Doctor's clinic gateway
      await sendTelegramDoctorAppointmentBookingMessage(target, 'Rohan Sharma');

      // 2. Commit Clinical Telemetry DAG Node
      addUniqueNodes([
        {
          id: `node-doc-booking-${Date.now()}`,
          stepIndex: 2,
          nodeType: 'abdm',
          brandName: 'Apollo Clinical Gateway',
          toolName: 'book_doctor_appointment',
          title: `🏥 Consultation Booked: ${target.doctorName}`,
          actionSummary: `Caregiver authorized consultation for ${target.seniorName} at ${target.doctorClinic}. Confirmed slot: ${target.appointmentSlot}. Booking Ref: ${bookingRef}.`,
          timestamp,
          status: 'SUCCESS',
          statusCode: '200 OK (CONFIRMED)',
          latencyMs: 160,
          brandColor: '#0284C7',
          reasoningSnippet: `[CLINICAL APPOINTMENT GATEWAY]: Rohan authorized doctor consultation after Papa reported symptoms. Official booking dispatched to ${target.doctorClinic} reception rail.`,
          apiExchange: {
            railName: 'Apollo Hospitals Clinical Scheduling Gateway Rail',
            method: 'POST',
            endpoint: 'https://api.apollohospitals.com/v2/appointments/geriatrics/book',
            schemaStandard: 'ABDM HL7 FHIR Appointment Resource v4.0.1',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer AP_AUTH_TOKEN_ROHINI_SEC8',
              'X-Caregiver-Consent': 'DIGITALLY_SIGNED_ROHAN_SHARMA'
            },
            requestBody: {
              patient_name: target.seniorName,
              abha_id: '91-4821-9920-1120',
              doctor_name: target.doctorName,
              clinic: target.doctorClinic,
              slot: target.appointmentSlot,
              chief_complaint: target.chiefComplaint,
              symptoms: target.symptoms
            },
            responseStatus: 200,
            responseStatusText: 'OK (Slot Confirmed)',
            responseLatencyMs: 160,
            responseHeaders: { 'Content-Type': 'application/json' },
            responseBody: {
              booking_id: bookingRef,
              status: 'CONFIRMED',
              consultation_mode: 'IN_PERSON_CLINIC',
              patient_token: 14,
              reporting_time: '04:15 PM'
            }
          }
        }
      ]);

      // 3. Inject reassuring agent confirmation in voice stream
      injectCustomTurn(`प्रिया बेटा ने डॉक्टर अरविंद सक्सेना जी के अपोलो क्लिनिक में आज शाम 4:30 बजे का समय पक्का कर दिया है अंकल जी। आप बिल्कुल चिंता मत कीजिए।`, 'agent');

      setPendingDoctorAppointment(prev => prev ? {
        ...prev,
        status: 'APPROVED',
        approvedAt: timestamp,
        bookingRefId: bookingRef,
        bookingStatus: 'CONFIRMED'
      } : null);

      showFeedbackToast(`🏥 Doctor Appointment Confirmed: Booking notification dispatched to ${target.doctorName}'s clinic!`);
    } catch (err: any) {
      console.error('[ApproveDoctorAppointment Error]:', err);
      showFeedbackToast(`❌ Failed to book appointment: ${err.message}`);
    }
  }, [pendingDoctorAppointment, addUniqueNodes, injectCustomTurn, showFeedbackToast]);

  const declineDoctorAppointment = useCallback((approvalId?: string) => {
    setPendingDoctorAppointment(prev => prev ? {
      ...prev,
      status: 'DECLINED',
      declinedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
    } : null);

    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    addUniqueNodes([
      {
        id: `node-doc-declined-${Date.now()}`,
        stepIndex: 2,
        nodeType: 'caregiver',
        brandName: 'Caregiver Human Gate',
        toolName: 'decline_doctor_appointment',
        title: 'Doctor Appointment Declined by Rohan',
        actionSummary: 'Caregiver Rohan Sharma clicked [Decline / Monitor]. Clinical consultation request paused for home monitoring.',
        timestamp,
        status: 'BLOCKED',
        statusCode: 'APPOINTMENT_DECLINED',
        latencyMs: 18,
        brandColor: '#6B7280',
        reasoningSnippet: '[CAREGIVER SIGN-OFF]: Rohan declined doctor booking at this time. Family will monitor symptoms at home.',
        apiExchange: {
          railName: 'Sambandh HITL Caregiver Approval Rail',
          method: 'POST',
          endpoint: '/v1/caregiver/approvals/appointment-decline',
          schemaStandard: 'Sambandh HITL Safety Rail v2',
          headers: { 'Content-Type': 'application/json' },
          requestBody: { status: 'DECLINED', reason: 'Home monitoring preferred by family' },
          responseStatus: 200,
          responseStatusText: 'OK (Refusal Recorded)',
          responseLatencyMs: 18,
          responseHeaders: { 'Content-Type': 'application/json' },
          responseBody: { status: 'CANCELLED_BY_CAREGIVER' }
        }
      }
    ]);
    showFeedbackToast('🛑 Appointment Declined: Rohan elected to monitor symptoms at home.');
  }, [addUniqueNodes, showFeedbackToast]);

  const resetDoctorAppointmentApproval = useCallback(() => {
    setPendingDoctorAppointment(null);
  }, []);

  const startCall = useCallback(() => {
    stopActiveSpeech();
    beginCall();
    setCurrentStepIndex(0);
    initiateCallGreeting(activeTtsEngine === 'browser');
  }, [stopActiveSpeech, beginCall, setCurrentStepIndex, initiateCallGreeting, activeTtsEngine]);

  const acceptCall = useCallback(() => {
    startCall();
  }, [startCall]);

  const declineCall = useCallback(() => {
    stopActiveSpeech();
    resetCallState();
    showFeedbackToast("📴 Call Declined: Ramesh Ji was unable to take the call. Next check-in scheduled in 30 mins.");
  }, [stopActiveSpeech, resetCallState, showFeedbackToast]);

  const endCall = useCallback(async () => {
    stopActiveSpeech();
    endCallSession();

    // Fallback across live turns and scenario turns so summary always triggers
    let turns = conversationTurns;
    if (!turns || turns.length === 0) {
      const collected: ConversationTurn[] = [];
      for (let i = 0; i <= currentStepIndex && i < activeScenario.steps.length; i++) {
        collected.push(...activeScenario.steps[i].turns);
      }
      turns = collected;
    }

    if (turns.length > 0) {
      setIsGeneratingSummary(true);
      showFeedbackToast("⏳ Synthesizing AI Care Briefing & dispatching to Telegram...");
      try {
        const summary = await generatePostCallSummary(
          turns,
          seniorProfile,
          effectiveMolecules,
          callDurationSeconds || 180
        );
        setLatestCallSummary(summary);
        saveCallSummary(summary).catch(() => {});

        const res = await sendTelegramDailyCareBriefing({
          summaryText: summary.summaryText,
          vitalityScore: summary.sentimentScore,
          mood: summary.sentiment === 'CHEERFUL' ? '🌿 Cheerful & Nostalgic' : '😊 Calm & Stable',
          adherence: summary.adherenceStatus,
          seniorName: seniorProfile.name
        });

        if (res.success) {
          showFeedbackToast(`✈️ Post-Call Briefing automatically delivered to ${seniorProfile.caregiverName || 'Caregiver'}'s Telegram!`);
        } else {
          showFeedbackToast(`📝 Call Summary ready in Caregiver App (${res.error || 'Telegram offline'})`);
        }
      } catch (err: any) {
        console.warn('[TelemetryContext] Failed to generate post-call summary:', err);
      } finally {
        setIsGeneratingSummary(false);
      }
    }
  }, [
    stopActiveSpeech,
    endCallSession,
    conversationTurns,
    currentStepIndex,
    activeScenario,
    seniorProfile,
    callDurationSeconds,
    showFeedbackToast
  ]);

  const resetScenario = useCallback(() => {
    stopActiveSpeech();
    resetCallState();
    resetPlayback();
    clearDynamicNodes();
    resetConversation();
    setTelegramActionFeedback(null);
  }, [stopActiveSpeech, resetCallState, resetPlayback, clearDynamicNodes, resetConversation]);

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
        caregiverNotes: customNote || "Rohan: 'I will call Papa myself today. Automated AI call suspended.'"
      }));
      showFeedbackToast("📞 Direct Call Mode: Rohan is speaking with Papa directly (+91 98101 23456). AI dialing suspended.");
    } else if (decision === 'agent_approved') {
      setPreCallAgency(prev => ({
        ...prev,
        status: 'agent_approved',
        caregiverDecision: decision,
        caregiverNotes: customNote || "Rohan: 'Approved Sambandh AI morning companionship call.'"
      }));
      showFeedbackToast("🤖 Pre-Call Consent Captured: Rohan approved Sambandh AI check-in. Ringing Ramesh Ji's phone over Jio PSTN...");
      initiateIncomingCall();
    } else if (decision === 'snooze_30m') {
      setPreCallAgency(prev => ({
        ...prev,
        status: 'snoozed',
        caregiverDecision: decision,
        caregiverNotes: customNote || "Rohan requested a 30-minute delay."
      }));
      showFeedbackToast("⏰ Check-In Postponed: Snoozed by 30 minutes. Next notification scheduled for 09:00 AM IST.");
    }
  }, [createPreCallApprovalNode, addUniqueNodes, setPreCallAgency, showFeedbackToast, initiateIncomingCall]);

  const setScenarioById = useCallback((id: string) => {
    stopActiveSpeech();
    setScenarioPlaybackId(id);
  }, [stopActiveSpeech, setScenarioPlaybackId]);

  const triggerSimulationPreset = useCallback((presetId: string) => {
    const preset = SIMULATION_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    if (callStatus === 'idle') {
      startCall();
    }

    injectCustomTurn(preset.promptText, 'senior');
    triggerPresetNodes(preset);

    if (preset.id === 'sim-mcp-pooja') {
      addInventoryOrder({
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
      });
      deductCashWallet(210, 'MCP Quick Commerce: Evening Pooja Essentials');
    }
  }, [callStatus, startCall, injectCustomTurn, triggerPresetNodes, addInventoryOrder, deductCashWallet]);

  const openWebhookModal = useCallback((webhook: GnaniVoiceWebhook) => setSelectedWebhook(webhook), []);
  const closeWebhookModal = useCallback(() => setSelectedWebhook(null), []);
  const openApiExchangeModal = useCallback((exchange: HttpApiExchange) => setSelectedApiExchange(exchange), []);
  const closeApiExchangeModal = useCallback(() => setSelectedApiExchange(null), []);

  const handleTelegramAction = useCallback((action: string) => {
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
      showFeedbackToast("🎧 Playing Papa's 30s Railway Wisdom snippet...");
    } else if (action === 'APPROVE_UPI_5600') {
      showFeedbackToast("⚡ 1-Tap UPI Authorization Captured: ₹5,600 mandate charge approved by Rohan Sharma.");
    } else if (action === 'FALLBACK_30DAY') {
      showFeedbackToast("📦 Reverted to Standard 30-Day Refill: ₹840 debited under normal cap.");
    } else if (action === 'CALL_PAPA') {
      showFeedbackToast("📞 Connecting direct SIP call to Papa (+91 98101 23456)...");
    } else if (action === 'CALL_DOCTOR') {
      showFeedbackToast("🏥 Calling Dr. Arvind Saxena's clinic (Apollo Rohini: +91 11 2790 1200)...");
    } else if (action === 'LOCK_WHITELIST') {
      showFeedbackToast("🔒 Carrier Whitelist Locked: Only verified family numbers can reach Papa.");
    } else {
      showFeedbackToast(`Action executed: ${action}`);
    }
  }, [resolvePreCallAgency, showFeedbackToast]);

  const getConsolidatedStateJson = useCallback((): string => {
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
  }, [
    callStatus,
    currentStep,
    activeScenario,
    currentStepIndex,
    medicalIssues,
    inventoryOrders,
    cashWallet,
    moodHistory,
    callDurationSeconds,
    conversationTurns.length,
    dynamicExecutionNodes
  ]);

  // Accumulate turns from scenario steps up to currentStepIndex
  const scenarioTurnsSoFar = useMemo(() => {
    const turns: ConversationTurn[] = [];
    for (let i = 0; i <= currentStepIndex && i < activeScenario.steps.length; i++) {
      turns.push(...activeScenario.steps[i].turns);
    }
    return turns;
  }, [activeScenario, currentStepIndex]);

  // Effective turns: live conversation turns stream in real time once call is answered or injected.
  const effectiveTurns = useMemo(() => {
    if (conversationTurns.length > 0) {
      return conversationTurns;
    }
    if (callStatus === 'active' || callStatus === 'ended' || isPlaying) {
      return scenarioTurnsSoFar;
    }
    return [];
  }, [conversationTurns, callStatus, isPlaying, scenarioTurnsSoFar]);

  return (
    <TelemetryContext.Provider
      value={{
        seniorProfile,
        updateSeniorProfile,
        scenarios,
        activeScenario,
        currentStepIndex,
        currentStep,
        allTurnsSoFar: effectiveTurns,
        isPlaying,
        pacing,
        activeTab,
        setActiveTab,
        currentStepApiExchange,
        activeTtsEngine,
        setActiveTtsEngine,
        currentlySpeakingTurnId,
        isAgentGenerating,
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
        callAttempt,
        isWaitingForRetry,
        retryCountdownSeconds,
        ringSecondsLeft,
        lastMissedCallAt,
        fastForwardRetry,
        handleCallUnanswered,
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
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        settingsActiveTab,
        setSettingsActiveTab,
        openSettingsModal,
        topUpCashWallet,
        isSystemPromptModalOpen,
        setIsSystemPromptModalOpen,
        getLiveSystemPrompt: getSystemPromptSnapshot,
        activePromptSlices,
        elderTopics,
        addElderTopic,
        removeElderTopic,
        toggleElderTopic,
        foldedMemory,
        dynamicExecutionNodes,
        addDynamicExecutionNodes: addUniqueNodes,
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
        resolvePreCallAgency,

        // Youth Mentorship & Intergenerational Wisdom (Tab 4)
        activeMentorshipQuestion,
        mentorshipHistory,
        pendingCaregiverMentorshipQuestions: pendingCaregiverQuestions,
        approvedMentorshipQuestions: approvedQuestions,
        submitYouthQuestion,
        evaluateMentorshipQuestion,
        approveMentorshipQuestion,
        rejectMentorshipQuestion,
        simulateElderAnswerVoice,

        // In-Clinic Doctor Consultation Bridge & Ambient Transformation
        consultationSession,
        isConsultationModalOpen,
        setIsConsultationModalOpen,
        openConsultationModal,
        closeConsultationModal,
        isListeningConsultation,
        isTransformingConsultation,
        liveSpokenSnippetConsultation,
        liveObservationsConsultation,
        simulateNextConsultationTurn,
        startLiveListeningConsultation,
        stopLiveListeningConsultation,
        startDoctorConsultation,
        addDoctorConsultationTurn,
        toggleCaregiverAttendance,
        attachDocumentToConsultation,
        completeDoctorConsultation,
        resetDoctorConsultation,

        // Caregiver Medication Refill Approval Gate (HITL)
        pendingMedicationApproval,
        createMedicationApprovalRequest,
        approveMedicationOrder,
        declineMedicationOrder,
        resetMedicationApproval,

        // Caregiver Doctor Appointment Approval Gate (HITL)
        pendingDoctorAppointment,
        createDoctorAppointmentApprovalRequest,
        approveDoctorAppointment,
        declineDoctorAppointment,
        resetDoctorAppointmentApproval,

        // Live Telegram Bot Integration
        dispatchTelegramCareBriefing,

        // Dynamic Post-Call Summary State
        latestCallSummary,
        isGeneratingSummary,
        setLatestCallSummary
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
