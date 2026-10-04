export type AgentStateMachinePhase =
  | 'IDLE'
  | 'OUTBOUND_DIALING'
  | 'LANE_1_WISDOM_BOND'
  | 'LANE_2_ADHERENCE_CHECK'
  | 'ABDM_RUNWAY_EVAL'
  | 'PINE_LABS_MANDATE_EXECUTION'
  | 'DELHIVERY_DISPATCH'
  | 'CAREGIVER_TELEGRAM_BRIEF'
  | 'CALL_CONCLUDED'
  | 'INTERMEDIARY_MENTORSHIP'
  | 'FIDUCIARY_STEPUP_REQUIRED'
  | 'CLINICAL_ESCALATION';

export type NavigationTab =
  | 'elder'
  | 'caregiver'
  | 'judge'
  | 'youth'
  | 'dual-pane'
  | 'elder-app'
  | 'medical-records'
  | 'judge-tree'
  | 'caregiver-telegram';

export interface YouthPersona {
  id: string;
  name: string;
  avatar: string;
  age: number;
  education: string;
  institution: string;
  trustScore: number;
  isVerified: boolean;
  statusBadge: string;
}

export interface YouthQuestionPreset {
  id: string;
  category: 'GENUINE' | 'MALICIOUS';
  domainTopic: string;
  title: string;
  questionText: string;
  suggestedYouthId: string;
  expectedVerdict: 'SAFE' | 'BLOCKED';
  violationType?: string;
  curatedSpeechHindi?: string;
  mockElderAnswer?: string;
}

export interface MentorshipExchangeItem {
  id: string;
  seniorId: string;
  youthId: string;
  youthName: string;
  youthAvatar: string;
  youthBio: string;
  questionText: string;
  category: 'GENUINE' | 'MALICIOUS';
  domainTopic: string;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'SAMBANDH_APPROVED_PENDING_CAREGIVER' | 'APPROVED' | 'REJECTED_BY_CAREGIVER' | 'BLOCKED' | 'VOICED_IN_CALL' | 'ANSWERED';
  safetyVerdict?: 'SAFE' | 'BLOCKED';
  safetyConfidence?: number;
  safetyCategory?: string;
  safetyExplanation?: string;
  curatedSpeechHindi?: string;
  caregiverApproved?: boolean;
  caregiverApprovedAt?: string;
  caregiverRejectedAt?: string;
  caregiverFeedback?: string;
  elderAnswerText?: string;
  elderAnswerAudioUrl?: string;
  submittedAt?: string;
  reviewedAt?: string;
  answeredAt?: string;
}

export interface HealthLockerDocument {
  id: string;
  seniorId?: string;
  title: string;
  category: 'prescription' | 'lab_report' | 'consultation' | 'caregiver_note';
  doctorName?: string;
  date: string;
  rawText: string;
  fileUrl?: string;
  summary?: string;
  keyEntities?: {
    drugs?: string[];
    vitals?: Record<string, string>;
    warnings?: string[];
  };
}

export interface HealthLockerMedicationDose {
  id: string;
  seniorId: string;
  documentId?: string;
  drugName: string;
  brandName?: string;
  strength: string;
  cadence: string;
  timingInstructions: string;
  currentStockUnits: number;
  dailyConsumption: number;
  runwayDays: number;
  refillThresholdDays: number;
  unitPriceInr: number;
  status: 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'DISCONTINUED';
}

export interface HealthLockerVitalLevel {
  id: string;
  seniorId: string;
  documentId?: string;
  vitalType: 'creatinine' | 'blood_pressure_systolic' | 'blood_pressure_diastolic' | 'hba1c' | 'fasting_blood_sugar' | 'pulse';
  valueNumeric: number;
  unit: string;
  recordedDate: string;
  isNormal: boolean;
  referenceRange: string;
  trendDirection: 'STABLE' | 'RISING' | 'FALLING' | 'FLUCTUATING';
  notes?: string;
}

export interface HealthLockerQueryRequest {
  query: string;
  seniorId: string;
  callerRole: 'elder' | 'caregiver' | 'judge';
  mode?: 'auto' | 'structured' | 'deep_recall';
}

export interface HealthLockerQueryResponse {
  analysis: string;
  retrieved_chunks: Array<{
    document_id?: string;
    title?: string;
    date?: string;
    content?: string;
    metadata?: Record<string, any>;
    score?: number;
    source?: string;
    count?: number;
  }>;
  sources: string[];
  structured_doses?: HealthLockerMedicationDose[];
  structured_vitals?: HealthLockerVitalLevel[];
  latency_ms: number;
  tokens_evaluated: number;
  data_source: string;
  guardrail_status: {
    is_non_prescriptive: boolean;
    zero_diagnosis_passed: boolean;
    tripwire_triggered: boolean;
  };
}

export interface MedicalIssue {
  id: string;
  condition: string;
  diagnosedDate: string;
  severity: 'MILD' | 'MODERATE' | 'CHRONIC' | 'HIGH';
  notes: string;
  treatingDoctor: string;
  activeSymptoms: string[];
}

export interface InventoryOrder {
  id: string;
  itemName: string;
  category: 'MEDICATION' | 'AMAZON_GENERAL' | 'POOJA_FLOWERS';
  orderDate: string;
  units: number;
  amountInr: number;
  vendor: string;
  status: 'ORDERED_NOT_RECEIVED' | 'IN_TRANSIT' | 'DELIVERED';
  trackingWaybill: string;
  eta: string;
}

export type PreCallAgencyStatus =
  | 'idle'
  | 'awaiting_approval'
  | 'caregiver_calling'
  | 'agent_approved'
  | 'snoozed';

export interface PreCallAgencyRequest {
  id: string;
  timestamp: string;
  seniorName: string;
  seniorPhone: string;
  scheduledTimeIst: string;
  status: PreCallAgencyStatus;
  caregiverName: string;
  caregiverDecision?: 'caregiver_direct' | 'agent_approved' | 'snooze_30m';
  caregiverNotes?: string;
  clinicalBriefingSnippet: string;
}

export interface CaregiverConfig {
  elderHomeAddress: string;
  elderPinCode: string;
  nearestPharmacyName: string;
  nearestPharmacyAddress: string;
  nearestPharmacyPinCode: string;
  nearestPharmacyEmail: string;
  orderTotalLimitInr: number;
  preCallAgencyMode?: 'always_ask' | 'auto_call';
}

export interface ElderTopicOfInterest {
  id: string;
  topic: string;
  category: 'RAILWAYS_CAREER' | 'LOCAL_NEWS' | 'MUSIC_CULTURE' | 'GARDENING_ROUTINE' | 'FAMILY_NOSTALGIA' | 'WEATHER_NATURE' | 'GENERAL';
  source: 'CAREGIVER_CURATED' | 'AUTONOMOUSLY_DISCOVERED';
  addedBy: string;
  enthusiasmLevel: 'HIGH' | 'MEDIUM' | 'VERY_HIGH';
  lastDiscussed?: string;
  sampleQuestions?: string[];
  notes?: string;
  isActive: boolean;
}

export interface PromptSliceStatus {
  coreCompanion: boolean;
  subtleAdherence: boolean;
  clinicalDossier: boolean;
  fiduciaryMandate: boolean;
  acousticTripwire: boolean;
  intergenerationalWisdom?: boolean;
}

export interface CashWalletState {
  balanceInr: number;
  lowBalanceThresholdInr: number;
  callFrequencyPerDay: number;
  lastDeductionReason?: string;
  lastDeductionAmount?: number;
}

export interface MoodCallEntry {
  callId: string;
  callDate: string;
  callTime: string;
  sentimentScore: number;
  primaryEmotion: 'CHEERFUL' | 'CALM' | 'ANXIOUS' | 'SAD';
  notes: string;
}

export interface SeniorProfile {
  id: string;
  name: string;
  age: number;
  gender: string;
  location: {
    addressLine: string;
    sector: string;
    city: string;
    pinCode: string;
  };
  telephony: {
    phoneNumber: string;
    carrierTrunk: string;
    dialect: string;
    dailyWindowIst: string;
    voiceprintConfidence: number;
  };
  vocation: string;
  personalityNotes?: string;
  healthBaseline?: string;
  familyContext?: string;
  preferredAddress?: string;
  doctorName?: string;
  doctorClinic?: string;
  conversationMode?: 'UNSCRIPTED_DYNAMIC' | 'SCRIPTED_BENCHMARK';
  backgroundContext?: string;
  caregiver: {
    name: string;
    relationship: string;
    city: string;
    phoneNumber: string;
    telegramChatId: string;
    monthlySpendingCapInr: number;
  };
}

export interface ElderOpinionTopic {
  id: string;
  headline: string;
  locality: string;
  agentPrompt: string;
  elderContextHint?: string;
  isActive?: boolean;
}

export interface MedicationItem {
  id: string;
  name: string;
  brand: string;
  strength: string;
  cadence: string;
  vernacularTag: string;
  currentUnits: number;
  dailyConsumption: number;
  runwayDays: number;
  unitPriceInr: number;
  orderUnits: number;
  totalCostInr: number;
}

export interface ClinicalState {
  prescriptionBundleId: string;
  practitioner: string;
  activeMolecules: MedicationItem[];
  refillThresholdDays: number;
  refillTriggered: boolean;
  notes: string;
}

export interface FiduciaryLedger {
  mandateId: string;
  mandateType: string;
  monthlyCeilingInr: number;
  spentMonthToDateInr: number;
  requestedDebitInr: number;
  headroomRemainingInr: number;
  autonomousActionPermitted: boolean;
  stepUpRequired: boolean;
  transactionSid?: string;
  utrNumber?: string;
  authTimestamp?: string;
}

export interface LogisticsState {
  waybill: string;
  carrier: string;
  pickupLocation: string;
  dropPin: string;
  slaEta: string;
  deliveryTier: string;
  status: 'IDLE' | 'PROCESSING' | 'DISPATCHED' | 'HELD';
}

export interface GnaniVoiceWebhook {
  eventId: string;
  timestamp: string;
  callSid: string;
  carrierTrunk: string;
  engine: string;
  codec: string;
  latencyMs: number;
  confidence: number;
  speaker: 'RAMESH_CHANDRA' | 'SAMBANDH_AGENT' | 'MENTEE_UNVERIFIED';
  rawAudioFrame: string;
  speechText: string;
  sentimentVector: {
    vitalityScore: number;
    anxietyScore: number;
    lucidityScore: number;
  };
  acousticFraudScore?: number;
}

export type CallStatus = 'idle' | 'calling' | 'active' | 'ended';

export type LlmProvider = 'gemini' | 'openrouter';

export interface LlmModelConfig {
  id: string;
  name: string;
  provider: LlmProvider;
  costTier: 'Free' | 'Low Cost' | 'Standard' | 'Premium';
  costDescription: string;
  description: string;
  contextWindow: string;
}

export interface ConversationTurn {
  id: string;
  timestamp: string;
  speaker: 'senior' | 'agent' | 'mentee' | 'system';
  lane: 'lane1' | 'lane2' | 'tripwire' | 'system';
  speakerLabel: string;
  content: string;
  hindiText?: string;
  hinglishText?: string;
  webhookPayload?: GnaniVoiceWebhook;
  modelUsed?: string;
  isFailover?: boolean;
  providerBadge?: string;
}

export interface GuardrailStatus {
  fiduciaryCeiling: 'ACTIVE' | 'WARNING' | 'BREACHED';
  abdmPrescriptionLocking: 'ACTIVE' | 'WARNING';
  noMedicalAdviceProtocol: 'ACTIVE' | 'ESCALATED';
  gnaniAcousticTripwire: 'ACTIVE' | 'TRIGGERED';
}

export interface ReasoningStep {
  observation: string;
  abdmCheck: string;
  fiduciaryEval: string;
  logisticsEval: string;
  guardrails: GuardrailStatus;
}

export interface TelegramButton {
  id: string;
  label: string;
  action: string;
  variant?: 'primary' | 'danger' | 'default';
}

export interface TelegramMessage {
  id: string;
  botUsername: string;
  recipient: string;
  timestamp: string;
  headline: string;
  participants: string;
  topicSummary: string;
  adherenceStatus: string;
  fulfillmentStatus?: string;
  sentimentBadge: string;
  rawText: string;
  buttons: TelegramButton[];
}

export interface HttpApiExchange {
  railName: string;
  method: 'POST' | 'GET';
  endpoint: string;
  headers: Record<string, string>;
  requestBody: Record<string, any>;
  responseStatus: number;
  responseStatusText: string;
  responseLatencyMs: number;
  responseHeaders: Record<string, string>;
  responseBody: Record<string, any>;
  schemaStandard: string;
}

export interface ExecutionTreeNode {
  id: string;
  stepIndex: number;
  title: string;
  type: 'conversation' | 'tool' | 'tripwire' | 'decision' | 'health_locker_query' | 'medgemma_analysis';
  lane?: 'lane1' | 'lane2' | 'system' | 'tripwire';
  toolName?: string;
  statusText?: string;
  apiExchange?: HttpApiExchange;
}

export interface ScenarioStep {
  stepNumber: number;
  phase: AgentStateMachinePhase;
  title: string;
  description: string;
  callActive: boolean;
  callDurationSeconds: number;
  turns: ConversationTurn[];
  reasoning: ReasoningStep;
  fiduciary: FiduciaryLedger;
  logistics: LogisticsState;
  telegramMessage?: TelegramMessage;
  treeNodes?: ExecutionTreeNode[];
  badgeText: string;
  badgeVariant: 'success' | 'warning' | 'danger' | 'info';
}

export interface Scenario {
  id: string;
  scenarioNumber: number;
  title: string;
  subtitle: string;
  description: string;
  conversationMode?: 'UNSCRIPTED_DYNAMIC' | 'SCRIPTED_BENCHMARK';
  backgroundContext?: string;
  category: 'Happy Path' | 'Vitality Normal' | 'Security Tripwire' | 'Fiduciary Step-Up' | 'Clinical Escalation';
  initialSeniorProfile: SeniorProfile;
  initialClinicalState: ClinicalState;
  initialFiduciaryLedger: FiduciaryLedger;
  initialLogisticsState: LogisticsState;
  steps: ScenarioStep[];
}

// ============================================================================
// IN-CLINIC DOCTOR CONSULTATION BRIDGE & MULTI-SPEAKER DIARIZATION TYPES
// ============================================================================

export type DoctorConsultationSpeaker = 'doctor' | 'senior' | 'caregiver' | 'system';

export interface DoctorConsultationTurn {
  id: string;
  timestamp: string;
  speaker?: DoctorConsultationSpeaker | 'ambient';
  speakerName?: string;
  channel?: 'in_clinic_mic' | 'remote_telephony' | 'system' | 'ambient';
  content: string;
  hindiText?: string;
}

export interface DoctorConsultationAttachment {
  id: string;
  type: 'prescription' | 'doctor_note' | 'lab_order';
  title: string;
  doctorName: string;
  rawText: string;
  uploadedAt: string;
  medGemmaEntitiesExtracted?: string[];
}

export type DoctorConsultationStatus = 'idle' | 'in_progress' | 'completed';

export interface DoctorConsultationClinicalSummary {
  bpReading?: string;
  pulse?: string;
  clinicalAssessment: string;
  medicationChanges: string[];
  elderVernacularInstructions: string[]; // Tier 2: Simple Hindi instructions for Ramesh Ji
  caregiverActionItems: string[];       // Tier 3: Caregiver actionable tasks
  followUpDate?: string;
  newMoleculesToAdd?: MedicationItem[];
}

export interface DoctorConsultationSession {
  id: string;
  doctorName: string;
  specialty: string;
  clinicName: string;
  seniorName: string;
  seniorId: string;
  caregiverName: string;
  caregiverRelationship: string;
  caregiverAttending: boolean; // true if Rohan is connected live; false if elder is solo
  initiatedBy: 'senior' | 'caregiver';
  startedAt: string;
  endedAt?: string;
  status: DoctorConsultationStatus;
  turns: DoctorConsultationTurn[];
  attachments: DoctorConsultationAttachment[];
  clinicalSummary?: DoctorConsultationClinicalSummary;
  syncedToEhr: boolean;
  caregiverBriefingSent: boolean;
}

// ============================================================================
// HUMAN-IN-THE-LOOP CAREGIVER MEDICATION APPROVAL GATE TYPES
// ============================================================================

export interface MedicationApprovalRequest {
  id: string;
  timestamp: string;
  medicationName: string;
  dosage: string;
  units: number;
  costInr: number;
  vendor: string;
  deliveryAddress: string;
  recipientPhone: string;
  reason: string;
  status: 'AWAITING_APPROVAL' | 'APPROVED' | 'DECLINED';
  approvedAt?: string;
  declinedAt?: string;
  orderId?: string;
  trackingWaybill?: string;
  deliveryEta?: string;
}

export interface DoctorAppointmentApprovalRequest {
  id: string;
  timestamp: string;
  seniorName: string;
  seniorAge: number;
  seniorAddress: string;
  symptoms: string[];
  chiefComplaint: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorClinic: string;
  doctorPhone: string;
  appointmentSlot: string;
  status: 'AWAITING_APPROVAL' | 'APPROVED' | 'DECLINED';
  approvedAt?: string;
  declinedAt?: string;
  bookingRefId?: string;
  bookingStatus?: string;
}


