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
  YouthPersona
} from '../types/telemetry';
import { healthLockerService } from '../services/healthLockerService';
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
import { useDoctorConsultation } from '../hooks/useDoctorConsultation';
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
  submitYouthQuestion: (
    youth: YouthPersona,
    questionText: string,
    category: 'GENUINE' | 'MALICIOUS',
    domainTopic: string,
    presetMetadata?: { curatedSpeechHindi?: string; mockElderAnswer?: string }
  ) => Promise<MentorshipExchangeItem>;
  evaluateMentorshipQuestion: (questionId: string) => Promise<void>;
  simulateElderAnswerVoice: (questionId: string) => Promise<void>;

  // In-Clinic Doctor Consultation Bridge & Multi-Speaker Diarization
  consultationSession: DoctorConsultationSession;
  isConsultationModalOpen: boolean;
  setIsConsultationModalOpen: (open: boolean) => void;
  openConsultationModal: () => void;
  closeConsultationModal: () => void;
  startDoctorConsultation: (initiatedBy: 'senior' | 'caregiver', caregiverAttending: boolean) => void;
  addDoctorConsultationTurn: (speaker: DoctorConsultationSpeaker, content: string, hindiText?: string) => void;
  toggleCaregiverAttendance: () => void;
  attachDocumentToConsultation: (attachment: Omit<DoctorConsultationAttachment, 'id' | 'uploadedAt'>) => void;
  completeDoctorConsultation: () => void;
  resetDoctorConsultation: () => void;
}

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
  const [selectedWebhook, setSelectedWebhook] = useState<GnaniVoiceWebhook | null>(null);
  const [selectedApiExchange, setSelectedApiExchange] = useState<HttpApiExchange | null>(null);
  const [isStateDrawerOpen, setIsStateDrawerOpen] = useState<boolean>(false);
  const [isAudioSnippetOpen, setIsAudioSnippetOpen] = useState<boolean>(false);
  const [telegramActionFeedback, setTelegramActionFeedback] = useState<string | null>(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [settingsActiveTab, setSettingsActiveTab] = useState<'brain' | 'telephony' | 'wallet' | 'routing'>('brain');
  const [isSystemPromptModalOpen, setIsSystemPromptModalOpen] = useState<boolean>(false);

  // Feedback toast notification helper
  const showFeedbackToast = useCallback((msg: string) => {
    setTelegramActionFeedback(msg);
    setTimeout(() => setTelegramActionFeedback(null), 3500);
  }, []);

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
    submitYouthQuestion,
    evaluateMentorshipQuestion,
    simulateElderAnswerVoice
  } = useYouthMentorship({
    activeTtsEngine,
    handleTelegramAction: showFeedbackToast
  });

  // In-Clinic Doctor Consultation Bridge & Diarization - Isolated Domain Hook
  const {
    consultationSession,
    isConsultationModalOpen,
    setIsConsultationModalOpen,
    openConsultationModal,
    closeConsultationModal,
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
    }, [setMedicalIssues])
  });

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
    getSystemPromptSnapshot
  } = useConversationEngine({
    autoSpeak,
    speakSeniorTurns,
    speakTurn,
    orderTotalLimitInr: caregiverConfig.orderTotalLimitInr,
    activeMentorshipQuestion,
    seniorProfile,
    onFeedbackToast: showFeedbackToast,
    onDeductCashWallet: deductCashWallet,
    onAddInventoryOrder: addInventoryOrder,
    createLlmNode,
    createHealthLockerNodes,
    detectDomainNodes,
    addUniqueNodes,
    seedInitialCallNode
  });

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

  const endCall = useCallback(() => {
    stopActiveSpeech();
    endCallSession();
  }, [stopActiveSpeech, endCallSession]);

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
        caregiverNotes: customNote || "Priya: 'I will call Papa myself today. Automated AI call suspended.'"
      }));
      showFeedbackToast("📞 Direct Call Mode: Priya is speaking with Papa directly (+91 98101 23456). AI dialing suspended.");
    } else if (decision === 'agent_approved') {
      setPreCallAgency(prev => ({
        ...prev,
        status: 'agent_approved',
        caregiverDecision: decision,
        caregiverNotes: customNote || "Priya: 'Approved Sambandh AI morning companionship call.'"
      }));
      showFeedbackToast("🤖 Pre-Call Consent Captured: Priya approved Sambandh AI check-in. Ringing Ramesh Ji's phone over Jio PSTN...");
      initiateIncomingCall();
    } else if (decision === 'snooze_30m') {
      setPreCallAgency(prev => ({
        ...prev,
        status: 'snoozed',
        caregiverDecision: decision,
        caregiverNotes: customNote || "Priya requested a 30-minute delay."
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
      showFeedbackToast("⚡ 1-Tap UPI Authorization Captured: ₹5,600 mandate charge approved by Priya Sharma.");
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
        submitYouthQuestion,
        evaluateMentorshipQuestion,
        simulateElderAnswerVoice,

        // In-Clinic Doctor Consultation Bridge & Diarization
        consultationSession,
        isConsultationModalOpen,
        setIsConsultationModalOpen,
        openConsultationModal,
        closeConsultationModal,
        startDoctorConsultation,
        addDoctorConsultationTurn,
        toggleCaregiverAttendance,
        attachDocumentToConsultation,
        completeDoctorConsultation,
        resetDoctorConsultation
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
