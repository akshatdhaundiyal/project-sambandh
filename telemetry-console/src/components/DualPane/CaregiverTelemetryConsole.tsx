import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { JudgeStepApiPane } from './JudgeStepApiPane';
import { ConversationToolTree } from '../ExecutionTree/ConversationToolTree';
import { getConcatenatedFullSystemPrompt } from '../../services/promptBuilder';
import {
  ShieldCheck,
  GitBranch,
  Zap,
  FileCode,
  Copy,
  Check,
  Database,
  Sparkles,
  Terminal,
  Activity,
  CheckCircle2,
  Clock,
  Layers,
  Lock,
  HeartPulse,
  Stethoscope
} from 'lucide-react';

export const CaregiverTelemetryConsole: React.FC = () => {
  const {
    seniorProfile,
    elderTopics,
    caregiverConfig,
    getLiveSystemPrompt,
    allTurnsSoFar,
    callStatus,
    activePromptSlices,
    consultationSession
  } = useTelemetry();

  // Active Deck Tab
  const [activeTab, setActiveTab] = useState<'api' | 'tree' | 'prompt' | 'ledger'>('api');

  // Prompt View Mode inside 'prompt' tab
  const [promptMode, setPromptMode] = useState<'jit' | 'full'>('jit');
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  // Compute live prompts
  const jitPrompt = getLiveSystemPrompt();
  const fullPrompt = getConcatenatedFullSystemPrompt(
    seniorProfile,
    elderTopics,
    caregiverConfig.orderTotalLimitInr
  );
  const activePromptText = promptMode === 'jit' ? jitPrompt : fullPrompt;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(activePromptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const activeTopicsCount = elderTopics.filter(t => t.isActive).length;

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-3 h-full min-h-0 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin">
      {/* Top Header & 4-View Technical Navigation */}
      <div className="flex items-center justify-between px-1 shrink-0 flex-wrap gap-2.5 bg-white border border-[#E7E2DB] p-3 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-800 shadow-2xs">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-base font-bold text-stone-900 tracking-tight">
                Fiduciary Telemetry & System Oversight
              </h2>
              <span className="text-[10px] font-mono font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                Live Rails Sync
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Contract Payloads · Causal DAG Reasoning · JIT Dynamic Prompt Engine · Fiduciary Ledger
            </p>
          </div>
        </div>

        {/* 4-Section Navigation Pills */}
        <div className="flex items-center bg-[#EFECE6] p-1 rounded-xl border border-[#DFDAD1] text-xs shadow-2xs gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab('api')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'api'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Live Rail Payloads</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tree')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tree'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-teal-600" />
            <span>Causal DAG Tree</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'prompt'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-purple-600" />
            <span>Dynamic System Prompt</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('ledger')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ledger'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audit Ledger</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: LIVE RAIL PAYLOADS (JudgeStepApiPane) */}
      {activeTab === 'api' && (
        <div className="flex-1 min-h-0 flex flex-col gap-2">
          <JudgeStepApiPane />
        </div>
      )}

      {/* VIEW 2: CAUSAL DAG EXECUTION TREE (ConversationToolTree) */}
      {activeTab === 'tree' && (
        <div className="flex-1 min-h-0 bg-white border border-[#E7E2DB] rounded-3xl p-4 h-[720px] overflow-hidden flex flex-col shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 shrink-0 mb-2">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-teal-700" />
              <h3 className="font-serif text-sm font-bold text-stone-900">
                Turn-by-Turn Causal Tool Execution DAG
              </h3>
            </div>
            <span className="text-[10px] font-mono text-stone-500">
              Interactive Nodes · Guardrail Checkpoints · Tool Verifications
            </span>
          </div>
          <div className="flex-1 min-h-0">
            <ConversationToolTree />
          </div>
        </div>
      )}

      {/* VIEW 3: LIVE JIT DYNAMIC SYSTEM PROMPT ENGINE */}
      {activeTab === 'prompt' && (
        <div className="flex-1 min-h-0 flex flex-col gap-3">
          {/* Prompt Architecture Summary Card */}
          <div className="p-4 bg-white border border-[#E7E2DB] rounded-2xl shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <div>
                  <h3 className="font-serif text-sm font-bold text-stone-900">
                    Live JIT Dynamic Prompt Compiler
                  </h3>
                  <span className="text-[10px] text-stone-500">
                    Recompiled in real-time from PostgreSQL Profile & Topics in the left mini-app
                  </span>
                </div>
              </div>

              {/* Mode Toggle & Copy Button */}
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-[#EFECE6] p-1 rounded-xl border border-[#DFDAD1] text-xs">
                  <button
                    type="button"
                    onClick={() => setPromptMode('jit')}
                    className={`py-1 px-2.5 rounded-lg font-bold transition-all cursor-pointer ${
                      promptMode === 'jit'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Live JIT (~320w)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPromptMode('full')}
                    className={`py-1 px-2.5 rounded-lg font-bold transition-all cursor-pointer ${
                      promptMode === 'full'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-500 hover:text-stone-900'
                    }`}
                  >
                    Full Modular Architecture
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                >
                  {copiedPrompt ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedPrompt ? 'Copied!' : 'Copy Prompt'}</span>
                </button>
              </div>
            </div>

            {/* Active Slice Pills */}
            <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-200 font-bold">
                ● Senior: {seniorProfile.name} ({seniorProfile.preferredAddress})
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-bold">
                ● Lore: Northern Railway 41y
              </span>
              <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200 font-bold">
                ● Clinical: Telma-40 & Diabetes
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-800 border border-purple-200 font-bold">
                ● Active Topics: {activeTopicsCount} curated
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold">
                ● Pine Labs Cap: ₹{caregiverConfig.orderTotalLimitInr}
              </span>
            </div>
          </div>

          {/* Prompt Code Viewer */}
          <div className="flex-1 min-h-[460px] bg-stone-900 rounded-2xl p-4 border border-stone-800 shadow-md flex flex-col font-mono text-xs overflow-hidden">
            <div className="flex items-center justify-between pb-2 border-b border-stone-800 text-stone-400 text-[11px] shrink-0 mb-2">
              <span className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-stone-300 font-semibold">Active LLM Prompt Payload</span>
              </span>
              <span className="text-emerald-400 text-[10px]">
                {activePromptText.length} characters · ~{Math.round(activePromptText.length / 4)} tokens
              </span>
            </div>

            <pre className="flex-1 overflow-y-auto text-stone-200 leading-relaxed whitespace-pre-wrap font-sans text-xs scrollbar-thin select-text">
              {activePromptText}
            </pre>
          </div>
        </div>
      )}

      {/* VIEW 4: FIDUCIARY AUDIT LEDGER */}
      {activeTab === 'ledger' && (
        <div className="flex-1 min-h-0 bg-white border border-[#E7E2DB] rounded-3xl p-5 shadow-xs flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 shrink-0">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-700" />
              <div>
                <h3 className="font-serif text-sm font-bold text-stone-900">
                  Fiduciary Audit Ledger & Compliance Event Timeline
                </h3>
                <span className="text-[10px] text-stone-500">
                  Immutable record of database transactions, consent receipts, and autonomous settlements
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              AUDIT VERIFIED
            </span>
          </div>

          {/* Audit Event Timeline */}
          <div className="space-y-3 overflow-y-auto pr-1">
            {/* In-Clinic Doctor Consultation Bridge Event */}
            <div className={`p-3 rounded-xl border flex items-start gap-3 ${
              consultationSession.status === 'in_progress'
                ? 'bg-rose-50/70 border-rose-200'
                : 'bg-emerald-50/70 border-emerald-200'
            }`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                consultationSession.status === 'in_progress'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              }`}>
                <Stethoscope className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">
                    In-Clinic Doctor Consultation Bridge ({consultationSession.doctorName})
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                    consultationSession.status === 'in_progress'
                      ? 'bg-rose-100 text-rose-800 border-rose-300 animate-pulse'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                  }`}>
                    {consultationSession.status === 'in_progress' ? 'DIARIZING' : 'ARCHIVED'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Dual-channel acoustic capture active at Apollo Clinic. Participants: Dr. Arvind Saxena & Ramesh Chandra in clinic; Priya Sharma {consultationSession.caregiverAttending ? '(Attending live)' : '(Async briefing mode)'}. {consultationSession.turns.length} turns recorded.
                </p>
                <div className="flex gap-2 mt-1 text-[9px] font-mono text-emerald-800 flex-wrap">
                  <span>CHANNEL: IN_CLINIC_MIC + SIP_TRUNK</span>
                  <span>·</span>
                  <span>DIARIZATION: 2 SIDES / 3 ROLES</span>
                  <span>·</span>
                  <span>FHIR: #OPConsultNote/2026</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0 mt-0.5">
                <Database className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">
                    PostgreSQL Record Commit (Senior ID: SENIOR_RAMESH_001)
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">08:34:12 IST</span>
                </div>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Dossier synchronized with active database. Preferred address set to "{seniorProfile.preferredAddress}", vocation pride confirmed.
                </p>
                <div className="flex gap-2 mt-1 text-[9px] font-mono text-teal-700">
                  <span>TX: 0x89f2a7</span>
                  <span>·</span>
                  <span>TABLE: seniors</span>
                  <span>·</span>
                  <span>MUTATION: UPDATE</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">
                    Pine Labs Pre-Authorization Token Issued
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">08:33:55 IST</span>
                </div>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Monthly care envelope approved up to ₹{caregiverConfig.orderTotalLimitInr.toLocaleString('en-IN')}. Autonomous settlement verified against caregiver limit.
                </p>
                <div className="flex gap-2 mt-1 text-[9px] font-mono text-amber-700">
                  <span>TOKEN: PL_PREAUTH_882910</span>
                  <span>·</span>
                  <span>MERCHANT: Apollo Pharmacy CMU</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-800 shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">
                    MedGemma 4B Clinical Vector Ingestion
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">08:30:19 IST</span>
                </div>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Ingested Dr. Arvind Saxena's prescription slip. Extracted: Telmisartan 40mg OD, Metformin 500mg, normal eGFR clearance.
                </p>
                <div className="flex gap-2 mt-1 text-[9px] font-mono text-purple-700">
                  <span>EMBEDDINGS: 384-dim</span>
                  <span>·</span>
                  <span>DOC: Rx-DrSaxena-2026.pdf</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">
                    ABDM Consent Artifact Validated (#OPConsultNote/2026-0814)
                  </span>
                  <span className="text-[10px] font-mono text-stone-400">08:29:40 IST</span>
                </div>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Signed HIP consent token verified with National Health Authority sandbox. Primary caregiver Priya Sharma designated consent manager.
                </p>
                <div className="flex gap-2 mt-1 text-[9px] font-mono text-emerald-700">
                  <span>ABDM ID: ramesh.chandra@abdm</span>
                  <span>·</span>
                  <span>CONSENT: ACTIVE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
