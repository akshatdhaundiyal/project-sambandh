import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  PINE_LABS_SUCCESS_EXCHANGE,
  PINE_LABS_LIMIT_EXCEEDED_EXCHANGE,
  DELHIVERY_SUCCESS_EXCHANGE,
  WHISPERFLO_DIAL_EXCHANGE,
  ABDM_RUNWAY_EXCHANGE,
  TELEGRAM_DISPATCH_EXCHANGE,
  NETMEDS_PHARMACY_ORDER_EXCHANGE,
  HEALTH_LOCKER_QUERY_EXCHANGE,
  MEDGEMMA_ANALYSIS_EXCHANGE
} from '../../data/apiExchanges';
import { HttpApiExchange } from '../../types/telemetry';
import {
  GitBranch,
  CheckCircle2,
  Sparkles,
  Zap,
  Truck,
  Send,
  ShieldAlert,
  AlertTriangle,
  HeartCrack,
  FileCode,
  ArrowRight,
  GitFork,
  HelpCircle,
  Eye,
  Check,
  X,
  Database
} from 'lucide-react';

interface BranchTreeNode {
  id: string;
  title: string;
  category: 'conversation' | 'decision' | 'tool' | 'tripwire' | 'escalation';
  toolName?: string;
  description: string;
  branchLabel?: string;
  branchGroup?: string;
  apiExchange?: HttpApiExchange;
  // Which scenario(s) hit this node
  hitInScenarios: string[];
  // At what step index in each scenario this node is reached
  scenarioStepMap: Record<string, number>;
}

export const ConversationToolTree: React.FC = () => {
  const { currentStepIndex, activeScenario, openApiExchangeModal } = useTelemetry();
  const [filterMode, setFilterMode] = useState<'all' | 'active'>('all');

  // Master definition of the complete Project Sambandh Decision & Tool Execution Tree
  const MASTER_TREE_NODES: BranchTreeNode[] = [
    // 01. ROOT TRUNK
    {
      id: 'root-dial',
      title: '08:30 IST Scheduled Check-In Initiation',
      category: 'conversation',
      toolName: 'whisperflo_telephony_dial',
      description: 'Outbound telephony initiated over Jio PSTN trunk. Biometric voiceprint matched at 98.4%.',
      apiExchange: WHISPERFLO_DIAL_EXCHANGE,
      hitInScenarios: ['scenario-1', 'scenario-2', 'scenario-3', 'scenario-4', 'scenario-5'],
      scenarioStepMap: {
        'scenario-1': 0,
        'scenario-2': 0,
        'scenario-3': 0,
        'scenario-4': 0,
        'scenario-5': 0
      }
    },

    // 02. LANE 1
    {
      id: 'lane1-wisdom',
      title: 'Lane 1: Railway Wisdom Mentorship',
      category: 'conversation',
      toolName: 'whisperflo_stt_stream',
      description: 'Senior mentors aspiring engineer on railway signal interlocking. Vitality & social utility verified.',
      hitInScenarios: ['scenario-1', 'scenario-2', 'scenario-3', 'scenario-4', 'scenario-5'],
      scenarioStepMap: {
        'scenario-1': 1,
        'scenario-2': 0,
        'scenario-3': 0,
        'scenario-4': 0,
        'scenario-5': 0
      }
    },

    // ── FORK 1: INTERMEDIARY MENTORSHIP & SAFETY GATE (Scenario 3) ────
    {
      id: 'fork1-fraud-tripwire',
      title: 'Intermediary Mentorship Gate: Predatory Ask Intercepted',
      category: 'tripwire',
      branchLabel: 'BRANCH: FINANCIAL SOLICITATION DETECTED',
      branchGroup: 'Mentorship Safety Rail',
      toolName: 'whisperflo_fraud_tripwire',
      description: 'Unverified ask for ₹5,000 transfer intercepted before audio relay. Senior line and peace of mind protected.',
      hitInScenarios: ['scenario-3'],
      scenarioStepMap: { 'scenario-3': 1 }
    },
    {
      id: 'fork1-fraud-alert',
      title: 'Silent Family Security Advisory Dispatched',
      category: 'tool',
      branchLabel: 'BRANCH: SECURITY TERMINATION',
      branchGroup: 'Mentorship Safety Rail',
      toolName: 'telegram_security_alert',
      description: 'Priya notified silently on Telegram with caller metadata. Zero elder panic or vulnerability exposure.',
      apiExchange: TELEGRAM_DISPATCH_EXCHANGE,
      hitInScenarios: ['scenario-3'],
      scenarioStepMap: { 'scenario-3': 2 }
    },

    // 03. LANE 2 (Normal rapport path)
    {
      id: 'lane2-adherence',
      title: 'Lane 2: Oral Adherence Ground-Truthing',
      category: 'conversation',
      branchLabel: 'BRANCH: NORMAL RAPPORT ➔ ADHERENCE CHECK',
      toolName: 'whisperflo_stt_stream',
      description: 'Contextual bridge to morning medication recall: "Laal wali BP ki goli" & Metformin.',
      hitInScenarios: ['scenario-1', 'scenario-2', 'scenario-4', 'scenario-5'],
      scenarioStepMap: {
        'scenario-1': 2,
        'scenario-2': 1,
        'scenario-4': 0,
        'scenario-5': 0
      }
    },

    // ── FORK 2: ACUTE CLINICAL DISTRESS (Scenario 5 only) ──────────────
    {
      id: 'fork2-clinical-escalate',
      title: 'No-Medical-Advice Safety Protocol Triggered',
      category: 'escalation',
      branchLabel: 'BRANCH: ACUTE CHEST TIGHTNESS REPORTED',
      branchGroup: 'Clinical Safety Rail',
      toolName: 'clinical_escalation_rail',
      description: 'Elder reported chest heaviness and cold sweats. Agent refrains from medical advice; comforts elder.',
      hitInScenarios: ['scenario-5'],
      scenarioStepMap: { 'scenario-5': 1 }
    },
    {
      id: 'fork2-clinical-alert',
      title: 'Urgent Clinical Red Alert to Family (1-Tap Call)',
      category: 'tool',
      branchLabel: 'BRANCH: CLINICAL EMERGENCY',
      branchGroup: 'Clinical Safety Rail',
      toolName: 'telegram_emergency_alert',
      description: 'Immediate high-priority Telegram alert sent to Priya with 1-tap direct call button.',
      apiExchange: TELEGRAM_DISPATCH_EXCHANGE,
      hitInScenarios: ['scenario-5'],
      scenarioStepMap: { 'scenario-5': 2 }
    },

    // 04. ABDM RUNWAY EVALUATION
    {
      id: 'abdm-eval',
      title: 'ABDM Inventory Runway Calculation',
      category: 'decision',
      branchLabel: 'BRANCH: ADHERENCE CONFIRMED ➔ RUNWAY AUDIT',
      toolName: 'abdm_inventory_eval',
      description: 'Cross-references consumed units against last courier drop timestamp.',
      apiExchange: ABDM_RUNWAY_EXCHANGE,
      hitInScenarios: ['scenario-1', 'scenario-2', 'scenario-4'],
      scenarioStepMap: {
        'scenario-1': 3,
        'scenario-2': 1,
        'scenario-4': 0
      }
    },

    // 04B. HEALTH LOCKER & MEDGEMMA RAG PIPELINE
    {
      id: 'health-locker-query-node',
      title: 'Health Locker RAG: Active Prescriptions & Lab Recall',
      category: 'tool',
      branchLabel: 'BRANCH: CLINICAL RECALL ➔ POSTGRESQL / VECTOR RAG',
      branchGroup: 'Clinical Guardrail Rail',
      toolName: 'health_locker_query',
      description: 'Recalls structured dosage, renal trajectory (Creatinine 1.10 mg/dL), and salt rules from PostgreSQL / Pinecone.',
      apiExchange: HEALTH_LOCKER_QUERY_EXCHANGE,
      hitInScenarios: ['scenario-1', 'scenario-2', 'scenario-4'],
      scenarioStepMap: {
        'scenario-1': 3,
        'scenario-2': 1,
        'scenario-4': 0
      }
    },
    {
      id: 'medgemma-analysis-node',
      title: 'MedGemma 4B Clinical Verification & Guardrail Check',
      category: 'decision',
      branchLabel: 'BRANCH: ZERO-DIAGNOSIS GUARDRAIL EVALUATION',
      branchGroup: 'Clinical Guardrail Rail',
      toolName: 'medgemma_analysis',
      description: 'Validates Zero-Diagnosis and Zero-Titration rules over extracted clinical chunks before synthesized response.',
      apiExchange: MEDGEMMA_ANALYSIS_EXCHANGE,
      hitInScenarios: ['scenario-1', 'scenario-4'],
      scenarioStepMap: {
        'scenario-1': 3,
        'scenario-4': 0
      }
    },

    // ── FORK 3: STOCK HEALTHY (Scenario 2 only) ────────────────────────
    {
      id: 'fork3-stock-healthy',
      title: 'Stock Healthy: 22 Days Supply Safe',
      category: 'decision',
      branchLabel: 'BRANCH: RUNWAY > 5 DAYS (NO REFILL NEEDED)',
      branchGroup: 'Stock Healthy Path',
      description: 'Runway is healthy (22 days remaining). Payment mandate remains strictly IDLE.',
      hitInScenarios: ['scenario-2'],
      scenarioStepMap: { 'scenario-2': 1 }
    },
    {
      id: 'fork3-stock-brief',
      title: 'Vitality & Stability Briefing Dispatched',
      category: 'tool',
      branchLabel: 'BRANCH: HEALTHY REASSURANCE',
      branchGroup: 'Stock Healthy Path',
      toolName: 'telegram_caregiver_brief',
      description: 'Telegram card confirms Papa in high spirits with safe medicine inventory. Zero charges.',
      apiExchange: TELEGRAM_DISPATCH_EXCHANGE,
      hitInScenarios: ['scenario-2'],
      scenarioStepMap: { 'scenario-2': 2 }
    },

    // 05. FIDUCIARY LIMIT EVALUATION (Refill needed: Runway < 5 days)
    {
      id: 'fiduciary-eval',
      title: 'Fiduciary Spending Ceiling Audit (₹4,500)',
      category: 'decision',
      branchLabel: 'BRANCH: RUNWAY < 5 DAYS ➔ REFILL TRIGGERED',
      description: 'Evaluates replenishment cost against child’s pre-authorized ₹4,500 monthly cap.',
      hitInScenarios: ['scenario-1', 'scenario-4'],
      scenarioStepMap: {
        'scenario-1': 3,
        'scenario-4': 0
      }
    },

    // ── FORK 4A: AUTONOMOUS REFILL WITHIN CAP (Scenario 1 Happy Path) ───
    {
      id: 'fork4a-pinelabs',
      title: 'Autonomous Payment Capture: ₹840 (Pine Labs)',
      category: 'tool',
      branchLabel: 'BRANCH: COST <= ₹4,500 CEILING (AUTONOMOUS)',
      branchGroup: 'Autonomous Refill Rail',
      toolName: 'pine_labs_mandate_debit',
      description: 'Auto-debit of ₹840.00 settled under UPI mandate. ₹3,660.00 headroom preserved.',
      apiExchange: PINE_LABS_SUCCESS_EXCHANGE,
      hitInScenarios: ['scenario-1'],
      scenarioStepMap: { 'scenario-1': 4 }
    },
    {
      id: 'fork4a-netmeds',
      title: 'Partner Pharmacy Order Placed: Netmeds DarkStore',
      category: 'tool',
      branchLabel: 'BRANCH: PARTNER PHARMACY ORDER DISPATCH',
      branchGroup: 'Autonomous Refill Rail',
      toolName: 'netmeds_order_dispatch',
      description: 'Prescription & order auto-dispatched to nearest pre-fed pharmacy (Plot 14, Sector 11, Rohini). Packed for pickup.',
      apiExchange: NETMEDS_PHARMACY_ORDER_EXCHANGE,
      hitInScenarios: ['scenario-1'],
      scenarioStepMap: { 'scenario-1': 5 }
    },
    {
      id: 'fork4a-delhivery',
      title: 'Same-Day Courier Booking: Apollo ➔ Rohini Sec 8',
      category: 'tool',
      branchLabel: 'BRANCH: LOGISTICS CMU BOOKING',
      branchGroup: 'Autonomous Refill Rail',
      toolName: 'delhivery_cmu_dispatch',
      description: 'Waybill DLV-98234-DEL booked from Apollo DarkStore. SLA arrival: Today 4:00 PM.',
      apiExchange: DELHIVERY_SUCCESS_EXCHANGE,
      hitInScenarios: ['scenario-1'],
      scenarioStepMap: { 'scenario-1': 5 }
    },
    {
      id: 'fork4a-tg-brief',
      title: 'Caregiver Briefing with Audio Story Snippet',
      category: 'tool',
      branchLabel: 'BRANCH: POST-INTERACTION TRANSPARENCY',
      branchGroup: 'Autonomous Refill Rail',
      toolName: 'telegram_caregiver_brief',
      description: 'Reassurance card delivered to Priya on Telegram with interactive story playback.',
      apiExchange: TELEGRAM_DISPATCH_EXCHANGE,
      hitInScenarios: ['scenario-1'],
      scenarioStepMap: { 'scenario-1': 6 }
    },

    // ── FORK 4B: FIDUCIARY STEP-UP EXCEPTION (Scenario 4) ───────────────
    {
      id: 'fork4b-stepup-halt',
      title: 'Auto-Debit Halted: Cap Exceeded (₹5,600 > ₹4,500)',
      category: 'escalation',
      branchLabel: 'BRANCH: COST > ₹4,500 CEILING (STEP-UP REQUIRED)',
      branchGroup: 'Fiduciary Step-Up Rail',
      toolName: 'pine_labs_mandate_debit',
      description: 'Pine Labs rail blocks payment over cap with 402 Limit Exceeded. Preserves L3 safety.',
      apiExchange: PINE_LABS_LIMIT_EXCEEDED_EXCHANGE,
      hitInScenarios: ['scenario-4'],
      scenarioStepMap: { 'scenario-4': 1 }
    },
    {
      id: 'fork4b-stepup-card',
      title: '1-Tap UPI Mandate Authorization Card to Priya',
      category: 'tool',
      branchLabel: 'BRANCH: CAREGIVER STEP-UP AUTHORIZATION',
      branchGroup: 'Fiduciary Step-Up Rail',
      toolName: 'telegram_stepup_brief',
      description: 'Interactive Telegram card allows Priya to approve ₹5,600 bulk pack or switch to 30-day.',
      apiExchange: TELEGRAM_DISPATCH_EXCHANGE,
      hitInScenarios: ['scenario-4'],
      scenarioStepMap: { 'scenario-4': 1 }
    }
  ];

  // Helper to determine node status for active scenario
  const getNodeState = (node: BranchTreeNode) => {
    const isHitInThisScenario = node.hitInScenarios.includes(activeScenario.id);

    if (!isHitInThisScenario) {
      return 'unhit'; // Node is on an unchosen branch
    }

    const targetStep = node.scenarioStepMap[activeScenario.id];
    if (currentStepIndex > targetStep) {
      return 'completed';
    }
    if (currentStepIndex === targetStep) {
      return 'active';
    }
    return 'pending';
  };

  // Filter nodes if user chooses 'active path only'
  const displayNodes = filterMode === 'active'
    ? MASTER_TREE_NODES.filter(n => n.hitInScenarios.includes(activeScenario.id))
    : MASTER_TREE_NODES;

  return (
    <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-4 sm:p-5 shadow-sm flex flex-col h-full overflow-hidden text-slate-100">
      {/* Top Header */}
      <div className="pb-3 border-b border-slate-800 mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <GitFork className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
              <span>L3 Agent Decision & Tool Execution Tree</span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-700">
                CAUSAL GRAPH
              </span>
              <span className="hidden xl:inline-block text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-600/40">
                UNSCRIPTED TO DETERMINISTIC RAILS
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Traces live unscripted conversational turns into deterministic tool execution nodes. Active path glows, unhit branches remain dimmed.
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filterMode === 'all'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Branches
          </button>
          <button
            onClick={() => setFilterMode('active')}
            className={`px-2.5 py-1 rounded-lg transition-all ${
              filterMode === 'active'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Path Only
          </button>
        </div>
      </div>

      {/* Legend Bar */}
      <div className="flex items-center gap-3 text-[11px] font-mono bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 mb-3 overflow-x-auto scrollbar-none">
        <span className="text-slate-500 uppercase text-[10px] font-bold">LEGEND:</span>
        <span className="flex items-center gap-1 text-cyan-300">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          Active Step
        </span>
        <span className="flex items-center gap-1 text-emerald-400">
          <Check className="w-3.5 h-3.5" />
          Completed
        </span>
        <span className="flex items-center gap-1 text-slate-400">
          <span className="w-2 h-2 rounded-full bg-slate-600"></span>
          Pending
        </span>
        <span className="flex items-center gap-1 text-slate-600">
          <X className="w-3 h-3 text-slate-600" />
          Unhit Branch
        </span>
        <span className="flex items-center gap-1 text-amber-300 ml-auto">
          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
          Click [Inspect API] for Payloads
        </span>
      </div>

      {/* Visual Tree Body */}
      <div className="flex-1 overflow-y-auto relative pr-2 space-y-3 font-sans">
        {displayNodes.map((node, idx) => {
          const state = getNodeState(node);
          const isCompleted = state === 'completed';
          const isActive = state === 'active';
          const isPending = state === 'pending';
          const isUnhit = state === 'unhit';
          const hasApi = !!node.apiExchange;

          const isTool = node.category === 'tool';
          const isTripwire = node.category === 'tripwire';
          const isEscalation = node.category === 'escalation';

          return (
            <div
              key={node.id}
              className={`relative transition-all duration-300 ${
                isUnhit ? 'opacity-40 grayscale-[40%]' : 'opacity-100'
              }`}
            >
              {/* Branch Tag Header if node starts or belongs to a fork */}
              {node.branchLabel && (
                <div className="flex items-center gap-2 mb-1.5 ml-4">
                  <span className="text-slate-600 font-mono text-xs">└──</span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                      isUnhit
                        ? 'bg-slate-900 border-slate-800 text-slate-500'
                        : isTripwire || isEscalation
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : 'bg-cyan-950 text-cyan-300 border-cyan-800'
                    }`}
                  >
                    {node.branchLabel}
                  </span>
                </div>
              )}

              {/* Node Card */}
              <div
                className={`rounded-2xl p-3.5 border transition-all ${
                  isActive
                    ? 'bg-slate-950 border-cyan-400 shadow-xl shadow-cyan-950/50 ring-2 ring-cyan-500/40'
                    : isCompleted
                    ? 'bg-slate-950/90 border-emerald-500/40 text-slate-200'
                    : isUnhit
                    ? 'bg-slate-950/30 border-dashed border-slate-800'
                    : 'bg-slate-950/60 border-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2">
                    {/* Node status icon */}
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isActive
                          ? 'bg-cyan-400 text-slate-950 animate-pulse'
                          : isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : isUnhit
                          ? 'bg-slate-900 text-slate-600 border border-slate-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isCompleted ? (
                        <Check className="w-4 h-4 stroke-[3]" />
                      ) : isActive ? (
                        <span className="text-sm">✦</span>
                      ) : isUnhit ? (
                        <span className="text-[10px]">✕</span>
                      ) : (
                        <span>{idx + 1}</span>
                      )}
                    </div>

                    <div>
                      <span
                        className={`text-xs sm:text-sm font-bold ${
                          isActive
                            ? 'text-cyan-300'
                            : isCompleted
                            ? 'text-slate-100'
                            : isUnhit
                            ? 'text-slate-500'
                            : 'text-slate-300'
                        }`}
                      >
                        {node.title}
                      </span>

                      {node.toolName && (
                        <span
                          className={`ml-2 text-[10px] font-mono px-2 py-0.5 rounded border inline-block ${
                            isUnhit
                              ? 'bg-slate-900 border-slate-800 text-slate-600'
                              : node.toolName === 'health_locker_query'
                              ? 'bg-teal-950 text-teal-300 border-teal-800'
                              : node.toolName === 'medgemma_analysis'
                              ? 'bg-purple-950 text-purple-300 border-purple-800'
                              : isTripwire || isEscalation
                              ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                              : isTool
                              ? 'bg-cyan-950 text-cyan-300 border-cyan-800'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {node.toolName}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Branch state badge */}
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                      isActive
                        ? 'bg-cyan-400 text-slate-950 font-bold'
                        : isCompleted
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : isUnhit
                        ? 'bg-slate-900 text-slate-600'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isUnhit ? 'Branch Bypassed' : state}
                  </span>
                </div>

                <p
                  className={`text-xs leading-relaxed pl-9 mb-2 ${
                    isUnhit ? 'text-slate-600' : 'text-slate-300'
                  }`}
                >
                  {node.description}
                </p>

                {/* API Payload Inspector Trigger Button */}
                {hasApi && (
                  <div className="pt-2 pl-9 border-t border-slate-900/80 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 truncate max-w-xs">
                      {node.apiExchange?.railName}
                    </span>

                    <button
                      onClick={() => openApiExchangeModal(node.apiExchange!)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all shadow ${
                        isActive
                          ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
                          : isUnhit
                          ? 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                          : 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Inspect API Payloads</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
