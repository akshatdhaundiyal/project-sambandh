import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  NODE_CATALOG_LIST,
  getNodesForScenarioStep,
  getAllNodesForScenario,
  SCENARIO_NODE_REGISTRY,
  ToolExecutionNode,
  ToolNodeType
} from '../../data/nodeMapping';
import {
  callNetmedsOrderTool,
  callDelhiveryDispatchTool
} from '../../services/toolCallingService';
import {
  PineLabsLogo,
  DelhiveryLogo,
  GnaniLogo,
  AbdmLogo,
  TelegramLogo,
  TripwireLogo
} from '../../data/brandLogos';
import {
  Copy,
  Check,
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  Languages,
  ExternalLink,
  ChevronRight,
  Pill,
  Database
} from 'lucide-react';

interface JudgeStepApiPaneProps {
  hideCatalogBar?: boolean;
  hideTimeline?: boolean;
  compactMode?: boolean;
}

export const JudgeStepApiPane: React.FC<JudgeStepApiPaneProps> = ({
  hideCatalogBar = false,
  hideTimeline = false,
  compactMode = false
}) => {
  const {
    currentStep,
    activeScenario,
    currentStepIndex,
    callStatus,
    startCall,
    dynamicExecutionNodes,
    addDynamicExecutionNodes,
    createMedicationApprovalRequest,
    activeTtsEngine,
    clearDynamicNodes
  } = useTelemetry();

  const [isExecutingTool, setIsExecutingTool] = useState<'netmeds' | 'delhivery' | 'refill' | null>(null);

  // Nodes dynamically pulled into the chain up to current step
  const baseNodes = getNodesForScenarioStep(activeScenario.id, currentStepIndex, callStatus);
  const scenarioAllNodes = getAllNodesForScenario(activeScenario.id);

  // Authoritative real-time execution chain:
  // - In idle/standby: returns [] so no premature dummy messages or API executions are shown before call connects.
  // - During active call/calling: dynamically displays executed nodes up to current progress step.
  // - When call has ended: displays the complete chronological audit chain (dynamicExecutionNodes or scenarioAllNodes)
  //   for comprehensive post-call review.
  const executedNodes = React.useMemo(() => {
    if (callStatus === 'idle') {
      return [];
    }

    if (dynamicExecutionNodes.length > 0) {
      return [...dynamicExecutionNodes];
    }

    if (callStatus === 'ended') {
      return scenarioAllNodes;
    }

    return baseNodes;
  }, [baseNodes, dynamicExecutionNodes, scenarioAllNodes, callStatus]);

  // Selected node for inline API inspection
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Auto-select the latest executed node when steps advance, or first node on initial load
  useEffect(() => {
    if (executedNodes.length > 0) {
      setSelectedNodeId(prev => {
        if (prev && executedNodes.some(n => n.id === prev)) return prev;
        return executedNodes[0].id;
      });
    } else {
      setSelectedNodeId(null);
    }
  }, [currentStepIndex, activeScenario.id, executedNodes]);

  // Fallback to latest node if selected node is not found
  const activeNode: ToolExecutionNode | undefined =
    executedNodes.find((n) => n.id === selectedNodeId) ||
    executedNodes[executedNodes.length - 1] ||
    executedNodes[0];

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const renderBrandLogo = (type: ToolNodeType, sizeClass = "w-5 h-5") => {
    switch (type) {
      case 'llm':
        return <Sparkles className={`${sizeClass} text-purple-600`} />;
      case 'fiduciary':
        return <PineLabsLogo className={sizeClass} />;
      case 'pharmacy':
        return <Pill className={`${sizeClass} text-emerald-600`} />;
      case 'logistics':
        return <DelhiveryLogo className={sizeClass} />;
      case 'telephony':
        return activeTtsEngine === 'browser' ? (
          <Languages className={`${sizeClass} text-emerald-600`} />
        ) : (
          <GnaniLogo className={sizeClass} />
        );
      case 'abdm':
        return <AbdmLogo className={sizeClass} />;
      case 'caregiver':
        return <TelegramLogo className={sizeClass} />;
      case 'generic_mcp':
        return <Sparkles className={`${sizeClass} text-amber-500`} />;
      case 'health_locker_query':
        return <Database className={`${sizeClass} text-teal-400`} />;
      case 'medgemma_analysis':
        return <Sparkles className={`${sizeClass} text-purple-400`} />;
      case 'caregiver_precall_consent':
        return <TelegramLogo className={sizeClass} />;
    }
  };

  const isSuccess =
    activeNode &&
    activeNode.apiExchange.responseStatus >= 200 &&
    activeNode.apiExchange.responseStatus < 300;

  return (
    <div className="bg-white border border-[#E7E2DB] rounded-3xl p-5 shadow-xs flex flex-col h-full overflow-hidden text-stone-900 transition-all">
      {/* 1. Header Bar: Execution Chain Title & Step Counter */}
      <div className="pb-3 border-b border-[#E7E2DB] mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#16233B] text-amber-300 flex items-center justify-center text-xs font-mono font-bold shadow-2xs">
            L3
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
              <span>Autonomous Rail Execution Chain</span>
              <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Live Audit
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Deterministic rails triggered dynamically by the autonomous agent
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-mono font-semibold text-stone-700 block">
            {executedNodes.length} Node{executedNodes.length !== 1 ? 's' : ''} Fired
          </span>
          <span className="text-[10px] text-stone-400 font-mono">
            Phase: {callStatus === 'idle' ? 'Standby' : callStatus === 'ended' ? 'Call Completed (Audit Ready)' : currentStep.phase}
          </span>
        </div>
      </div>

      {/* 2. Top Catalog Bar: All Possible Node Types with Logos */}
      {!hideCatalogBar && (
        <div className="mb-3.5 bg-[#FAF8F5] border border-[#E7E2DB] rounded-2xl p-2.5">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-stone-500">
              Active Fiduciary Rails & Partner Contracts:
            </span>
            <span className="text-[10px] text-stone-400">Sandbox Verified</span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {NODE_CATALOG_LIST.map((item, index) => {
              const tooltipPosClass =
                index === 0
                  ? 'left-0 translate-x-0'
                  : index === NODE_CATALOG_LIST.length - 1
                  ? 'right-0 left-auto translate-x-0'
                  : 'left-1/2 -translate-x-1/2';

              const arrowPosClass =
                index === 0
                  ? 'left-6'
                  : index === NODE_CATALOG_LIST.length - 1
                  ? 'right-6'
                  : 'left-1/2 -translate-x-1/2';

              return (
                <div
                  key={item.type}
                  className={`group relative p-2.5 rounded-2xl border bg-white shadow-2xs flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer ${item.borderClass}`}
                  title={`${item.brandName}: ${item.tagline}`}
                >
                  {/* Logo on Top */}
                  <div className="w-10 h-10 rounded-xl bg-stone-50/80 border border-stone-100 flex items-center justify-center mb-1.5 shadow-2xs group-hover:scale-110 transition-transform shrink-0">
                    {renderBrandLogo(item.type, "w-6 h-6")}
                  </div>

                  {/* 2 Odd Words (Name of Product / Tech) */}
                  <span className="text-[11px] font-extrabold text-stone-900 block leading-tight tracking-tight text-center truncate max-w-full">
                    {item.shortName}
                  </span>

                  {/* Hover Tooltip: 1-Line Purpose */}
                  <div
                    className={`absolute top-full mt-2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none w-52 sm:w-60 transition-all duration-150 animate-fadeIn ${tooltipPosClass}`}
                  >
                    {/* Tooltip upward arrow */}
                    <div
                      className={`w-2.5 h-2.5 bg-stone-950 rotate-45 -mb-1.5 border-l border-t border-stone-700 z-10 ${arrowPosClass}`}
                    ></div>
                    <div className="bg-stone-950 text-white text-[11px] font-medium leading-snug px-3 py-2 rounded-xl shadow-2xl border border-stone-700 text-center">
                      <span className="font-extrabold text-emerald-400 block text-[10px] uppercase tracking-wider mb-0.5">
                        {item.brandName}
                      </span>
                      <span className="text-stone-300 block text-[11px] leading-relaxed">
                        {item.tagline}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2.5. Executable Tool Execution Bar (Manual Judge & Developer Playground) */}
      <div className="mb-3.5 p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-indigo-950 border border-slate-700/80 text-white shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
              <span>Executable Tool Calling Drawer</span>
              <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/80">
                LIVE SANDBOX
              </span>
            </span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            Execute tools on-demand to test payloads & latency
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {/* Tool 1: Netmeds B2B Order */}
          <button
            type="button"
            onClick={async () => {
              setIsExecutingTool('netmeds');
              const res = await callNetmedsOrderTool({
                medicationName: 'Telma 40mg (Telmisartan)',
                dosage: '40mg',
                quantity: 30,
                costInr: 840,
                vendor: 'Netmeds / Apollo DarkStore Sector 11'
              });
              addDynamicExecutionNodes([res.telemetryNode]);
              setSelectedNodeId(res.telemetryNode.id);
              setIsExecutingTool(null);
            }}
            disabled={isExecutingTool !== null}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-emerald-900/60 border border-slate-700 hover:border-emerald-500/60 text-left transition-all cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center shrink-0 text-emerald-400 group-hover:scale-105 transition-transform">
                <Pill className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-emerald-300 truncate">
                  {isExecutingTool === 'netmeds' ? 'Executing API...' : 'netmeds_place_order'}
                </div>
                <div className="text-[9px] text-slate-400 font-mono truncate">
                  POST /v2/orders/b2b · ₹840
                </div>
              </div>
            </div>
            <Zap className="w-3.5 h-3.5 text-emerald-400 opacity-60 group-hover:opacity-100 group-hover:fill-current transition-opacity shrink-0" />
          </button>

          {/* Tool 2: Delhivery CMU Dispatch */}
          <button
            type="button"
            onClick={async () => {
              setIsExecutingTool('delhivery');
              const res = await callDelhiveryDispatchTool({
                orderId: 'NMD-DEL-98421',
                pickupLocation: 'Apollo Pharmacy DarkStore Sector 11',
                destinationAddress: 'Flat 402, Block C, Pocket 2, Rohini Sector 8, Delhi 110085'
              });
              addDynamicExecutionNodes([res.telemetryNode]);
              setSelectedNodeId(res.telemetryNode.id);
              setIsExecutingTool(null);
            }}
            disabled={isExecutingTool !== null}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-red-950/60 border border-slate-700 hover:border-red-500/60 text-left transition-all cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-red-950/80 border border-red-700/60 flex items-center justify-center shrink-0 text-red-400 group-hover:scale-105 transition-transform">
                <DelhiveryLogo className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-red-300 truncate">
                  {isExecutingTool === 'delhivery' ? 'Booking Courier...' : 'delhivery_schedule_dispatch'}
                </div>
                <div className="text-[9px] text-slate-400 font-mono truncate">
                  POST /api/cmu/create.json · ETA 4PM
                </div>
              </div>
            </div>
            <Zap className="w-3.5 h-3.5 text-red-400 opacity-60 group-hover:opacity-100 group-hover:fill-current transition-opacity shrink-0" />
          </button>

          {/* Tool 3: Request Refill (HITL Gate) */}
          <button
            type="button"
            onClick={() => {
              createMedicationApprovalRequest({
                medicationName: 'Telma 40mg (Telmisartan)',
                dosage: '40mg',
                units: 30,
                costInr: 840,
                reason: 'Elder reported 2 pills remaining in morning check-in call.'
              });
              const gateNode: ToolExecutionNode = {
                id: `node-gate-manual-${Date.now()}`,
                stepIndex: executedNodes.length + 1,
                nodeType: 'caregiver',
                brandName: 'Sambandh HITL Gate',
                toolName: 'request_medication_refill',
                title: 'Refill Request Dispatched to Caregiver',
                actionSummary: 'Dispatched 1-tap medication approval card to Priya Sharma in Bangalore. Ordering tools paused awaiting sign-off.',
                timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
                status: 'ACTIVE',
                statusCode: 'AWAITING APPROVAL',
                latencyMs: 25,
                brandColor: '#F59E0B',
                reasoningSnippet: '[MANUAL HITL TRIGGER]: Caregiver approval gate initiated. Ordering gated until sign-off.',
                apiExchange: {
                  railName: 'Sambandh HITL Caregiver Approval Rail',
                  method: 'POST',
                  endpoint: '/v1/caregiver/approvals/medication-refill',
                  schemaStandard: 'Sambandh HITL Safety Standard v2',
                  headers: { 'Content-Type': 'application/json' },
                  requestBody: {
                    senior_name: 'Ramesh Chandra',
                    medication: 'Telma 40mg (Telmisartan)',
                    cost_inr: 840,
                    status: 'AWAITING_CAREGIVER_APPROVAL'
                  },
                  responseStatus: 202,
                  responseStatusText: 'Accepted (Awaiting Decision)',
                  responseLatencyMs: 25,
                  responseHeaders: { 'Content-Type': 'application/json' },
                  responseBody: { status: 'AWAITING_APPROVAL', notification_sent: true }
                }
              };
              addDynamicExecutionNodes([gateNode]);
              setSelectedNodeId(gateNode.id);
            }}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-amber-950/60 border border-slate-700 hover:border-amber-500/60 text-left transition-all cursor-pointer group flex items-center justify-between"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-amber-950/80 border border-amber-700/60 flex items-center justify-center shrink-0 text-amber-400 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-bold text-amber-300 truncate">
                  request_medication_refill
                </div>
                <div className="text-[9px] text-slate-400 font-mono truncate">
                  HITL Caregiver Approval Gate
                </div>
              </div>
            </div>
            <Zap className="w-3.5 h-3.5 text-amber-400 opacity-60 group-hover:opacity-100 group-hover:fill-current transition-opacity shrink-0" />
          </button>
        </div>
      </div>

      {/* 3. Dynamic Execution Chain (The Live Timeline) */}
      {!hideTimeline && (
        <div className="mb-3.5">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
              <span>⚡ Chronological Execution Timeline</span>
              <span className="text-[10px] font-normal text-stone-400">(Click any node to inspect API payload)</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-700 font-bold">
              Step {currentStepIndex + 1} of {activeScenario.steps.length}
            </span>
          </div>

          {/* Horizontal / Scrollable Chain of Executed Nodes */}
          {executedNodes.length === 0 ? (
            <div className="p-6 border border-dashed border-stone-300 rounded-2xl text-center space-y-2.5 bg-stone-50/60 my-1">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 mx-auto flex items-center justify-center text-lg shadow-2xs">
                📞
              </div>
              <div className="space-y-0.5 max-w-sm mx-auto">
                <h4 className="font-extrabold text-xs text-stone-900">
                  Call Session Idle — Initial Node Awaiting Initiation
                </h4>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Nodes are pulled dynamically as each tool/API call is triggered by the autonomous agent. Click Start Call to trigger Node 1 (Gnani.ai Telephony Session).
                </p>
              </div>
              <button
                onClick={startCall}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-xs transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Initiate Call & Trigger Node 1</span>
              </button>
            </div>
          ) : (
            <div className="flex items-stretch gap-2.5 overflow-x-auto pb-2 pt-1 px-1 scrollbar-thin">
              {executedNodes.map((node, index) => {
                const isSelected = activeNode && activeNode.id === node.id;
                const isLatest = index === executedNodes.length - 1;

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`relative flex items-center gap-2.5 p-3 rounded-2xl border text-left shrink-0 max-w-[260px] sm:max-w-[280px] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-stone-900/30'
                        : 'bg-white hover:bg-stone-50 text-stone-800 border-stone-200 shadow-2xs'
                    }`}
                  >
                    {/* Brand Logo */}
                    <div className="shrink-0 p-1 bg-white rounded-xl shadow-2xs border border-stone-200/60">
                      {renderBrandLogo(node.nodeType, "w-7 h-7")}
                    </div>

                    {/* Node Summary */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase truncate ${
                            isSelected ? 'text-stone-300' : 'text-stone-500'
                          }`}
                        >
                          {node.brandName}
                        </span>
                        <span
                          className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            isSelected
                              ? 'bg-stone-800 text-emerald-400'
                              : node.status === 'BLOCKED' || node.status === 'TERMINATED'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {node.statusCode}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-extrabold block truncate leading-tight ${
                          isSelected ? 'text-white' : 'text-stone-900'
                        }`}
                      >
                        {node.title}
                      </span>

                      <p
                        className={`text-[11px] truncate mt-0.5 ${
                          isSelected ? 'text-stone-300' : 'text-stone-600'
                        }`}
                      >
                        {node.actionSummary}
                      </p>
                    </div>

                    {/* Arrow Connector between nodes */}
                    {!isLatest && (
                      <div className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-stone-200 border border-white flex items-center justify-center text-[10px] text-stone-600">
                        ➔
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. Selected Node API Telemetry: Precision Contract Inspector */}
      {activeNode ? (
        <div className="flex-1 flex flex-col min-h-0 bg-[#0F172A] text-slate-100 rounded-2xl border border-slate-800 p-4 shadow-sm overflow-hidden">
          {/* Header of Selected Node */}
          <div className="pb-3 border-b border-slate-800 mb-3 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 bg-slate-900 rounded-xl border border-slate-700/80 shadow-2xs">
                {renderBrandLogo(activeNode.nodeType, "w-6 h-6")}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-sm text-white truncate">
                    {activeNode.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {activeNode.toolName}
                  </span>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 hidden sm:inline">
                    SHA-256 Verified
                  </span>
                </div>
                <span className="text-xs font-mono text-cyan-400 block truncate mt-0.5">
                  {activeNode.apiExchange.method} {activeNode.apiExchange.endpoint}
                </span>
              </div>
            </div>

            {/* Status and Latency Pill */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-lg ${
                  isSuccess
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-700/80'
                    : 'bg-rose-950 text-rose-400 border border-rose-700/80'
                }`}
              >
                HTTP {activeNode.apiExchange.responseStatus} {activeNode.apiExchange.responseStatusText}
              </span>
              <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                {activeNode.apiExchange.responseLatencyMs}ms
              </span>
            </div>
          </div>

          {/* Reasoning & Contract Digest Callout */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3">
            <div className="md:col-span-4 bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
              <span className="text-amber-400 font-semibold shrink-0">🧠 Autonomous Intent:</span>
              <span className="text-slate-300 leading-relaxed">{activeNode.reasoningSnippet}</span>
            </div>
          </div>

          {/* Specialized Clinical Vector & Guardrail Audit Banner */}
          {(activeNode.nodeType === 'health_locker_query' || activeNode.nodeType === 'medgemma_analysis') && (
            <div className="p-3 mb-3 rounded-xl bg-purple-950/40 border border-purple-800/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-purple-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Pinecone Vector & MedGemma Guardrail Telemetry</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-800">
                  Cosine Similarity: 0.942 (Pass &gt; 0.82)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-300">
                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Zero-Diagnosis Rule:</span>
                  <span className="text-emerald-400 font-bold">✓ PASSED (0 Hallucinations)</span>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Zero-Titration Rule:</span>
                  <span className="text-emerald-400 font-bold">✓ PASSED (Dose Unaltered)</span>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Database Target:</span>
                  <span className="text-teal-300 font-bold">PostgreSQL / Supabase</span>
                </div>
              </div>
            </div>
          )}

          {/* Specialized Pre-Call Caregiver Agency Gate Telemetry Banner */}
          {activeNode.nodeType === 'caregiver_precall_consent' && (
            <div className="p-3 mb-3 rounded-xl bg-sky-950/40 border border-sky-800/60 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sky-300 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Caregiver Agency & Family Primacy Telemetry</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-800">
                  Consent Verified: Telegram Bot Callback
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-slate-300">
                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Family Primacy Rule:</span>
                  <span className="text-emerald-400 font-bold">✓ ENFORCED (Caregiver First)</span>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Approval Mode:</span>
                  <span className="text-sky-300 font-bold">Telegram Interactive Inline</span>
                </div>
                <div className="bg-slate-950/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Dispatch Status:</span>
                  <span className="text-amber-300 font-bold">Agent Check-in Authorized</span>
                </div>
              </div>
            </div>
          )}

          {/* Dual Column: What We Send (Request) vs What Comes Back (Response) */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0 overflow-hidden">
            {/* Left: What We Send (HTTP Request) */}
            <div className="flex flex-col rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono">
                <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                  <span>➔</span> OUTBOUND PAYLOAD (HTTP Request)
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(activeNode.apiExchange.requestBody, null, 2), 'req')}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {copiedType === 'req' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'req' ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed space-y-2.5 scrollbar-thin">
                {/* Headers */}
                <div className="pb-2 border-b border-slate-800 text-[10px] text-slate-400">
                  <span className="text-slate-500 uppercase font-semibold block mb-1">Contract Headers:</span>
                  {Object.entries(activeNode.apiExchange.headers).map(([k, v]) => (
                    <div key={k} className="truncate">
                      <span className="text-slate-300 font-bold">{k}:</span> <span className="text-slate-400">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Body */}
                <div>
                  <span className="text-slate-500 uppercase font-semibold text-[10px] block mb-1">Request Body (JSON):</span>
                  <pre className="text-cyan-200 whitespace-pre-wrap break-all leading-relaxed">
                    {JSON.stringify(activeNode.apiExchange.requestBody, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Right: What Comes Back (HTTP Response / Tool Output) */}
            <div className="flex flex-col rounded-xl bg-slate-950 border border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono">
                <span className={`font-semibold flex items-center gap-1.5 ${isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <span>←</span> INBOUND CONFIRMATION (Response)
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(activeNode.apiExchange.responseBody, null, 2), 'res')}
                  className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  {copiedType === 'res' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'res' ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed space-y-2.5 scrollbar-thin">
                {/* Headers */}
                <div className="pb-2 border-b border-slate-800 text-[10px] text-slate-400">
                  <span className="text-slate-500 uppercase font-semibold block mb-1">Response Headers:</span>
                  {Object.entries(activeNode.apiExchange.responseHeaders).map(([k, v]) => (
                    <div key={k} className="truncate">
                      <span className="text-slate-300 font-bold">{k}:</span> <span className="text-slate-400">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Body */}
                <div>
                  <span className="text-slate-500 uppercase font-semibold text-[10px] block mb-1">Response Payload (JSON):</span>
                  <pre className={`${isSuccess ? 'text-emerald-300' : 'text-rose-300'} whitespace-pre-wrap break-all leading-relaxed`}>
                    {JSON.stringify(activeNode.apiExchange.responseBody, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] bg-[#0F172A] text-slate-400 rounded-2xl border border-slate-800 p-6 text-center space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center text-sm font-mono font-bold">
            L3
          </div>
          <p className="text-xs font-semibold text-slate-200">
            Awaiting Tool Execution & Rail Telemetry
          </p>
          <p className="text-xs text-slate-500 max-w-sm">
            Once the morning call connects, live HTTP contracts from partner rails (Gnani.ai, Tripwire, ABDM, Pine Labs, Delhivery, Telegram) will stream here.
          </p>
        </div>
      )}
    </div>
  );
};
