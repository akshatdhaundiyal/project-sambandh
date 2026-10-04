import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  X,
  FileCode,
  Copy,
  Check,
  BrainCircuit,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  HeartPulse,
  CreditCard,
  UserCheck,
  AlertTriangle,
  Lock,
  PhoneCall
} from 'lucide-react';

import { getConcatenatedFullSystemPrompt } from '../../services/promptBuilder';

interface SystemPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ClinicalGuardrail {
  id: string;
  category: 'emergency' | 'clinical' | 'fiduciary' | 'caregiver';
  title: string;
  rule: string;
  fallbackOrAction: string;
  severity: 'CRITICAL' | 'HIGH' | 'STRICT';
}

const NINETEEN_CLINICAL_GUARDRAILS: ClinicalGuardrail[] = [
  // Category 1: Emergency & Red Alerts (5)
  {
    id: 'CG-01',
    category: 'emergency',
    title: 'Severe Chest Pain / Angina Triage',
    rule: 'If elder reports chest pain, pressure, radiating arm/jaw pain, or cardiac distress, halt standard conversation immediately.',
    fallbackOrAction: 'Immediately instruct calling 112, stay calmly on the line, and trigger high-priority Red Alert to caregiver Rohan and Dr. Arvind Saxena.',
    severity: 'CRITICAL'
  },
  {
    id: 'CG-02',
    category: 'emergency',
    title: 'Elder Fall & Immobility Protocol',
    rule: 'If elder reports falling (bathroom, bedroom, park) or being unable to get up, prevent dangerous self-recovery attempts.',
    fallbackOrAction: 'Advise staying completely still to avoid spinal/fracture aggravation, keep voice link active, and fire instant SOS Alert with GPS coordinates.',
    severity: 'CRITICAL'
  },
  {
    id: 'CG-03',
    category: 'emergency',
    title: 'Acute Breathlessness / Dyspnea',
    rule: 'Sudden shortness of breath or inability to complete sentences triggers instant clinical escalation.',
    fallbackOrAction: 'Direct elder to sit upright, breathe slowly, and connect emergency line while alerting primary caregiver.',
    severity: 'CRITICAL'
  },
  {
    id: 'CG-04',
    category: 'emergency',
    title: 'Continuous Stay-On-Line Guarantee',
    rule: 'During any acute medical tripwire or distress, agent must never disconnect the SIP trunk or voice bridge prematurely.',
    fallbackOrAction: 'Maintain live calming Awadhi voice link until caregiver or emergency contact explicitly assumes voice control.',
    severity: 'CRITICAL'
  },
  {
    id: 'CG-05',
    category: 'emergency',
    title: 'Acoustic Distress & Despair Interception',
    rule: 'Severe emotional crisis, grief, profound helplessness, or expressions of self-harm.',
    fallbackOrAction: 'Switch to warm, deeply empathetic de-escalation, disarm interrogative prompts, and bridge family contact.',
    severity: 'CRITICAL'
  },

  // Category 2: Clinical Prudence & MedGemma Co-Pilot (6)
  {
    id: 'CG-06',
    category: 'clinical',
    title: 'Zero Autonomous Dosage Modification',
    rule: 'AI agent is strictly barred from suggesting dosage changes, stopping prescribed medications, or introducing new pharmacological regimens.',
    fallbackOrAction: 'Always redirect dosage questions to Dr. Arvind Saxena and retrieve ABDM prescription dosage verbatim.',
    severity: 'STRICT'
  },
  {
    id: 'CG-07',
    category: 'clinical',
    title: 'Physician Primacy & FHIR Validation',
    rule: 'All clinical advice must anchor directly to Dr. Arvind Saxena’s verified ABDM FHIR bundle (#OPConsultNote/2026-0814).',
    fallbackOrAction: 'Synthesize MedGemma 4B clinical RAG responses purely as explanations of doctor’s written advice, never novel directives.',
    severity: 'HIGH'
  },
  {
    id: 'CG-08',
    category: 'clinical',
    title: 'Adherence Confirmation vs. Refill Gating',
    rule: 'Confirming having taken pills ("subah ki goli le li") must NEVER trigger pharmacy reorder or Pine Labs auto-debit.',
    fallbackOrAction: 'Log positive adherence in EHR, warmly affirm elder, and suppress procurement nodes completely.',
    severity: 'HIGH'
  },
  {
    id: 'CG-09',
    category: 'clinical',
    title: 'Unprescribed Medication Stoppage Warning',
    rule: 'If elder reports unilaterally stopping or skipping essential drugs (e.g. Telma 40 due to dizziness).',
    fallbackOrAction: 'Warn against stopping without doctor oversight, explain rebound hypertension risks, and notify Dr. Saxena & Rohan.',
    severity: 'HIGH'
  },
  {
    id: 'CG-10',
    category: 'clinical',
    title: 'Dietary & Low-Sodium Boundary',
    rule: 'Remind elder of cardiologist’s dietary directives (low sodium, morning fresh water with Telma 40).',
    fallbackOrAction: 'Casually remind during morning tea banter without lecturing or scolding.',
    severity: 'HIGH'
  },
  {
    id: 'CG-11',
    category: 'clinical',
    title: 'Grade-1 Knee Osteoarthritis Palliative Care',
    rule: 'For reported knee stiffness or joint ache, provide non-pharmacological comfort measures only.',
    fallbackOrAction: 'Advise gentle warm compresses, morning sun exposure in balcony, and avoid prescribing NSAIDs without consultation.',
    severity: 'HIGH'
  },

  // Category 3: Fiduciary Autonomy & Safety Boundaries (5)
  {
    id: 'CG-12',
    category: 'fiduciary',
    title: 'Pine Labs ₹4,500 Monthly Spending Ceiling',
    rule: 'Autonomous wallet debits across all pharmacy and grocery fulfillments cannot exceed Rohan’s ₹4,500 monthly limit.',
    fallbackOrAction: 'Halt debit immediately with PL_402_LIMIT_EXCEEDED if cumulative spend breaches envelope.',
    severity: 'STRICT'
  },
  {
    id: 'CG-13',
    category: 'fiduciary',
    title: 'Per-Order Dynamic Cap & Step-Up Card',
    rule: 'If a single refill exceeds caregiver pre-set limit (e.g. ₹1,500 default or configured order cap).',
    fallbackOrAction: 'Do not auto-charge elder; instantly route interactive 1-Tap Authorization Card to Rohan Sharma on Telegram.',
    severity: 'STRICT'
  },
  {
    id: 'CG-14',
    category: 'fiduciary',
    title: 'Acoustic Tripwire Extortion Severance',
    rule: 'Unverified third-party callers or mentees attempting to solicit money, transfer funds, or pressure elder.',
    fallbackOrAction: 'Acoustic Tripwire fires in <200ms: SIP trunk muted, external caller severed, protective override engaged.',
    severity: 'CRITICAL'
  },
  {
    id: 'CG-15',
    category: 'fiduciary',
    title: 'Credential Leak Lockdown (Zero-Knowledge)',
    rule: 'Elder or caller attempting to recite or request UPI PIN, CVV, ATM card number, banking OTP, or passwords.',
    fallbackOrAction: 'Masked at acoustic level, tripwire logs breach event, caregiver alerted, no financial tokens exposed.',
    severity: 'CRITICAL'
  },
  {
    id: 'CG-16',
    category: 'fiduciary',
    title: 'Logistics Courier SLA & Verified Darkstore',
    rule: 'Deliveries must route through verified hyperlocal healthcare logistics (Delhivery Same-Day / Apollo Rohini).',
    fallbackOrAction: 'Provide real-time tracking waybill, consignee verification, and rider contact without elder out-of-pocket payment.',
    severity: 'HIGH'
  },

  // Category 4: Caregiver Primacy & Governance (3)
  {
    id: 'CG-17',
    category: 'caregiver',
    title: 'Pre-Call Caregiver Agency Gate',
    rule: 'Before morning check-in call initiates, caregiver Rohan receives pre-call agency notification.',
    fallbackOrAction: 'Rohan can choose to call Papa directly himself, delegate call to Sambandh AI, or snooze for 30 minutes.',
    severity: 'HIGH'
  },
  {
    id: 'CG-18',
    category: 'caregiver',
    title: 'Daily End-of-Day Structured Telegram Dossier',
    rule: 'Every evening, Rohan receives a structured clinical & conversational audit recap.',
    fallbackOrAction: 'Summarizes vital trends (BP 112/80), mood score, medicine adherence, and delivers 30s audio story snippet.',
    severity: 'HIGH'
  },
  {
    id: 'CG-19',
    category: 'caregiver',
    title: 'Missed Call 3-Tier Escalation Ladder',
    rule: 'If elder declines or misses morning companion call.',
    fallbackOrAction: 'Retry 1 queued in 15m; Retry 2 in 30m; after 3 missed attempts, high-priority alert sent to Rohan with last known status.',
    severity: 'HIGH'
  }
];

export const SystemPromptModal: React.FC<SystemPromptModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    getLiveSystemPrompt,
    selectedModelConfig,
    activePromptSlices,
    elderTopics,
    foldedMemory,
    caregiverConfig,
    seniorProfile
  } = useTelemetry();

  const [activeTab, setActiveTab] = useState<'prompt' | 'guardrails' | 'policy'>('prompt');
  const [promptViewMode, setPromptViewMode] = useState<'live_jit' | 'concatenated_full'>('live_jit');
  const [copied, setCopied] = useState(false);
  const [guardrailFilter, setGuardrailFilter] = useState<'all' | 'emergency' | 'clinical' | 'fiduciary' | 'caregiver'>('all');

  if (!isOpen) return null;

  const livePrompt = getLiveSystemPrompt();
  const fullPrompt = getConcatenatedFullSystemPrompt(
    seniorProfile,
    elderTopics,
    caregiverConfig.orderTotalLimitInr
  );
  const displayedPrompt = promptViewMode === 'live_jit' ? livePrompt : fullPrompt;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredGuardrails = NINETEEN_CLINICAL_GUARDRAILS.filter(
    (g) => guardrailFilter === 'all' || g.category === guardrailFilter
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-stone-200/90 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] text-stone-900">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100/80 border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-2xs">
              <BrainCircuit className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-stone-900">
                  Live System Prompt & 19 Clinical Guardrails
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
                  {selectedModelConfig.name}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Gemini 3.5 Flash-Lite reasoning brain · Just-In-Time modular slices · Caregiver primacy boundaries
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-stone-200 bg-stone-50/40">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'prompt'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Live JIT System Prompt</span>
          </button>
          <button
            onClick={() => setActiveTab('guardrails')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'guardrails'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
            <span>19 Clinical Guardrails Matrix</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-100 text-rose-800 font-mono">19</span>
          </button>
          <button
            onClick={() => setActiveTab('policy')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'policy'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fiduciary & Caregiver Boundaries</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-stone-700 leading-relaxed scrollbar-thin">
          {/* TAB 1: LIVE PROMPT & JIT SLICES */}
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              {/* JIT Modular Prompt Slices Bar */}
              <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-[11px] text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>Just-In-Time Modular Prompt Slices:</span>
                  </span>
                  <span className="text-[10px] text-stone-500 font-mono">Dynamic Injection (Anti-Bloat)</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                    <span>Companion Core: Always Active</span>
                  </span>

                  <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1 ${
                    activePromptSlices?.subtleAdherence
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-stone-100 text-stone-500 border-stone-200 opacity-60'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${activePromptSlices?.subtleAdherence ? 'bg-amber-600' : 'bg-stone-400'}`}></span>
                    <span>Subtle Adherence: {activePromptSlices?.subtleAdherence ? 'Injected' : 'Dormant'}</span>
                  </span>

                  <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1 ${
                    activePromptSlices?.clinicalDossier
                      ? 'bg-rose-100 text-rose-900 border-rose-300'
                      : 'bg-stone-100 text-stone-500 border-stone-200 opacity-60'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${activePromptSlices?.clinicalDossier ? 'bg-rose-600' : 'bg-stone-400'}`}></span>
                    <span>Clinical Dossier: {activePromptSlices?.clinicalDossier ? 'Injected' : 'Dormant'}</span>
                  </span>

                  <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1 ${
                    activePromptSlices?.fiduciaryMandate
                      ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                      : 'bg-stone-100 text-stone-500 border-stone-200 opacity-60'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${activePromptSlices?.fiduciaryMandate ? 'bg-indigo-600' : 'bg-stone-400'}`}></span>
                    <span>Fiduciary Limit: {activePromptSlices?.fiduciaryMandate ? 'Injected' : 'Dormant'}</span>
                  </span>

                  <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1 ${
                    activePromptSlices?.acousticTripwire
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : 'bg-stone-100 text-stone-500 border-stone-200 opacity-60'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${activePromptSlices?.acousticTripwire ? 'bg-purple-600' : 'bg-stone-400'}`}></span>
                    <span>Acoustic Tripwire: {activePromptSlices?.acousticTripwire ? 'Injected' : 'Dormant'}</span>
                  </span>
                </div>

                {/* Active Topics injected */}
                <div className="pt-2 border-t border-stone-200/80 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-stone-600">Active Topics of Interest:</span>
                  {(elderTopics || []).filter(t => t.isActive).map(t => (
                    <span key={t.id} className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-white text-stone-700 border border-stone-200 shadow-2xs">
                      {t.topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Raw System Prompt Code Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-stone-800 text-xs flex items-center gap-1.5">
                      <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
                      <span>System Prompt Payload:</span>
                    </span>

                    <div className="flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-[10px]">
                      <button
                        type="button"
                        onClick={() => setPromptViewMode('live_jit')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                          promptViewMode === 'live_jit'
                            ? 'bg-white text-indigo-800 shadow-2xs'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        Live JIT (Turn-Optimized)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPromptViewMode('concatenated_full')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                          promptViewMode === 'concatenated_full'
                            ? 'bg-white text-indigo-800 shadow-2xs'
                            : 'text-stone-500 hover:text-stone-800'
                        }`}
                      >
                        Full Concatenated Architecture
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[11px] transition-colors cursor-pointer border border-stone-200"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied to Clipboard</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-stone-600" />
                        <span>Copy {promptViewMode === 'live_jit' ? 'Live Prompt' : 'Concatenated Prompt'}</span>
                      </>
                    )}
                  </button>
                </div>

                <pre className="bg-stone-900 text-stone-100 p-4 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap border border-stone-800 shadow-inner max-h-[340px] scrollbar-thin">
                  {displayedPrompt}
                </pre>
              </div>

              {/* Dynamic Injected Memory Ledger Detail */}
              <div className="p-3.5 bg-indigo-50/60 border border-indigo-200/80 rounded-2xl space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Dynamic Injected Memory Ledger State:</span>
                  </span>
                  <span className="text-[10px] text-indigo-700 font-mono font-bold bg-indigo-100 px-2 py-0.5 rounded-full">
                    Progressive Folding: Every 4 Turns
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed font-mono whitespace-pre-wrap bg-white/80 p-2.5 rounded-xl border border-indigo-100">
                  {foldedMemory}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: 19 CLINICAL GUARDRAILS MATRIX */}
          {activeTab === 'guardrails' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {(['all', 'emergency', 'clinical', 'fiduciary', 'caregiver'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setGuardrailFilter(cat)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      guardrailFilter === cat
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {cat === 'all' ? 'All 19 Rails' : cat}
                  </button>
                ))}
              </div>

              {/* Guardrails Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredGuardrails.map(rail => (
                  <div
                    key={rail.id}
                    className="p-3.5 bg-white border border-stone-200 rounded-2xl shadow-2xs space-y-2 hover:border-indigo-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                          {rail.id}
                        </span>
                        <h4 className="font-bold text-stone-900 text-xs">
                          {rail.title}
                        </h4>
                      </div>
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        rail.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : rail.severity === 'STRICT'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {rail.severity}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 font-medium">
                      <strong className="text-stone-800">Rule: </strong>
                      {rail.rule}
                    </p>

                    <div className="p-2 rounded-xl bg-stone-50 border border-stone-100 text-[10px] text-stone-700">
                      <span className="font-bold text-emerald-800 block">Deterministic Enforcement:</span>
                      {rail.fallbackOrAction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FIDUCIARY & CAREGIVER BOUNDARIES */}
          {activeTab === 'policy' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Policy 1: Autonomous Wallet Envelope */}
                <div className="p-4 bg-emerald-50/50 border border-emerald-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-emerald-700" />
                    <h3 className="font-bold text-stone-900 text-xs">Fiduciary Autonomy Limits</h3>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-stone-600">
                    <li>• <strong>Monthly Pre-Authorized Cap:</strong> ₹4,500.00 (Pine Labs UPI AutoPay)</li>
                    <li>• <strong>Per-Order Max Limit:</strong> ₹{caregiverConfig.orderTotalLimitInr.toLocaleString('en-IN')} (Configurable in Settings)</li>
                    <li>• <strong>Step-Up Policy:</strong> Orders exceeding ₹{caregiverConfig.orderTotalLimitInr} require Rohan’s 1-tap Telegram sign-off.</li>
                    <li>• <strong>Payment Mode:</strong> 100% cashless; senior Ramesh is never asked for OTP, PIN, cash, or card CVV.</li>
                  </ul>
                </div>

                {/* Policy 2: Caregiver Escalation Policy */}
                <div className="p-4 bg-indigo-50/50 border border-indigo-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-indigo-700" />
                    <h3 className="font-bold text-stone-900 text-xs">Caregiver Primacy Tier</h3>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-stone-600">
                    <li>• <strong>Designated Caregiver:</strong> Rohan Sharma (Son, Bengaluru)</li>
                    <li>• <strong>Pre-Call Gate:</strong> 08:15 AM agency prompt (Call directly vs. Delegate to Sambandh AI)</li>
                    <li>• <strong>Urgent Alerts:</strong> Chest pain / fall / missed meds trigger immediate Telegram Red Alert.</li>
                    <li>• <strong>Daily Digest:</strong> Delivered at 08:00 PM with voice story snippet & vitals recap.</li>
                  </ul>
                </div>

                {/* Policy 3: Clinical Hierarchy */}
                <div className="p-4 bg-rose-50/50 border border-rose-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-700" />
                    <h3 className="font-bold text-stone-900 text-xs">Clinical Hierarchy</h3>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-stone-600">
                    <li>• <strong>Attending Physician:</strong> Dr. Arvind Saxena (Cardiology, DMC #19482)</li>
                    <li>• <strong>ABDM Health Locker:</strong> Verified FHIR consultation bundle OPConsultNote/2026-0814.</li>
                    <li>• <strong>MedGemma Co-Pilot:</strong> Local 4B model performs RAG retrieval on prescriptions only.</li>
                    <li>• <strong>Red Lines:</strong> No medication titrations, no diagnostic claims, no self-treatment advice.</li>
                  </ul>
                </div>

                {/* Policy 4: Logistics & Darkstore SLA */}
                <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-amber-700" />
                    <h3 className="font-bold text-stone-900 text-xs">Hyperlocal Logistics SLA</h3>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-stone-600">
                    <li>• <strong>Fulfillment DarkStore:</strong> Apollo Pharmacy Rohini Sector 11 (1.8 km)</li>
                    <li>• <strong>Courier Partner:</strong> Delhivery Priority Healthcare SLA</li>
                    <li>• <strong>Delivery Window:</strong> Same-day dispatch (delivered within 4 hours)</li>
                    <li>• <strong>Audit Receipt:</strong> Waybill generated and synced to Caregiver portal automatically.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Provider: <strong className="text-stone-700">{selectedModelConfig.provider.toUpperCase()}</strong> · Token Limit: <strong className="text-stone-700">350 Max</strong> · Clinical Version: <strong className="text-stone-700">v2.4-Production</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
