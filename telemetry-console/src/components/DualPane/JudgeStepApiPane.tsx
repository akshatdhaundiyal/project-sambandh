import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  NODE_CATALOG_LIST,
  getNodesForScenarioStep,
  SCENARIO_NODE_REGISTRY,
  ToolExecutionNode,
  ToolNodeType
} from '../../data/nodeMapping';
import {
  PineLabsLogo,
  DelhiveryLogo,
  WhisperFloLogo,
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
  Pill
} from 'lucide-react';

export const JudgeStepApiPane: React.FC = () => {
  const {
    currentStep,
    activeScenario,
    currentStepIndex,
    callStatus,
    startCall,
    dynamicExecutionNodes,
    activeTtsEngine,
    clearDynamicNodes
  } = useTelemetry();

  // Nodes dynamically pulled into the chain up to current step (0 if idle)
  const baseNodes = getNodesForScenarioStep(activeScenario.id, currentStepIndex, callStatus);

  // Authoritative real-time execution chain:
  // In a live call session, dynamicExecutionNodes truthfully logs the actual tool and model nodes executed
  const executedNodes = React.useMemo(() => {
    if (callStatus === 'idle') {
      return [];
    }

    if (dynamicExecutionNodes.length > 0) {
      return [...dynamicExecutionNodes];
    }

    return baseNodes;
  }, [baseNodes, dynamicExecutionNodes, callStatus]);

  // Selected node for inline API inspection
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [copiedType, setCopiedType] = useState<string | null>(null);

  // Auto-select the latest executed node when steps advance
  useEffect(() => {
    if (executedNodes.length > 0) {
      setSelectedNodeId(executedNodes[executedNodes.length - 1].id);
    } else {
      setSelectedNodeId(null);
    }
  }, [currentStepIndex, activeScenario.id, callStatus, executedNodes.length]);

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
        return activeTtsEngine === 'chrome' ? (
          <Languages className={`${sizeClass} text-emerald-600`} />
        ) : (
          <WhisperFloLogo className={sizeClass} />
        );
      case 'abdm':
        return <AbdmLogo className={sizeClass} />;
      case 'caregiver':
        return <TelegramLogo className={sizeClass} />;
      case 'generic_mcp':
        return <Sparkles className={`${sizeClass} text-amber-500`} />;
    }
  };

  const isSuccess =
    activeNode &&
    activeNode.apiExchange.responseStatus >= 200 &&
    activeNode.apiExchange.responseStatus < 300;

  return (
    <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs flex flex-col h-full overflow-hidden text-stone-900 transition-all">
      {/* 1. Header Bar: Execution Chain Title & Step Counter */}
      <div className="pb-3 border-b border-stone-200/80 mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-stone-900 text-white flex items-center justify-center text-xs font-mono font-bold shadow-2xs">
            L3
          </div>
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
              <span>Tool Execution Chain & Rail Telemetry</span>
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                LIVE TIMELINE
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                SANDBOX SPECIFICATION
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              Nodes are pulled dynamically as each tool/API call is triggered by the autonomous agent.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-xs font-mono font-bold text-stone-600 block">
            {executedNodes.length} Node{executedNodes.length > 1 ? 's' : ''} Triggered
          </span>
          <span className="text-[10px] text-stone-400 font-mono">
            Active Phase: {currentStep.phase}
          </span>
        </div>
      </div>

      {/* 2. Top Catalog Bar: All Possible Node Types with Logos & Brand Colors */}
      <div className="mb-3.5 bg-stone-50/90 border border-stone-200/80 rounded-2xl p-2.5">
        <div className="flex items-center justify-between mb-1.5 px-1">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-500">
            Node Types Catalog (Partner Rails & Guardrails):
          </span>
          <span className="text-[10px] text-stone-400">Official Brand Contracts</span>
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

      {/* 3. Dynamic Execution Chain (The Live Timeline) */}
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
                Nodes are pulled dynamically as each tool/API call is triggered by the autonomous agent. Click Start Call to trigger Node 1 (WhisperFlo Telephony Session).
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

      {/* 4. Selected Node API Telemetry: Sent Request vs Received Response */}
      {activeNode ? (
        <div className="flex-1 flex flex-col min-h-0 bg-stone-900 text-white rounded-2xl border border-stone-800 p-4 shadow-sm overflow-hidden">
          {/* Header of Selected Node */}
          <div className="pb-3 border-b border-stone-800 mb-3 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-1.5 bg-stone-800 rounded-xl border border-stone-700">
                {renderBrandLogo(activeNode.nodeType, "w-6 h-6")}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs sm:text-sm text-white truncate">
                    {activeNode.title}
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                    {activeNode.toolName}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 block truncate">
                  {activeNode.apiExchange.method} {activeNode.apiExchange.endpoint}
                </span>
              </div>
            </div>

            {/* Status and Latency Pill */}
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full ${
                  isSuccess
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-700'
                    : 'bg-rose-950 text-rose-400 border border-rose-700'
                }`}
              >
                HTTP {activeNode.apiExchange.responseStatus} {activeNode.apiExchange.responseStatusText}
              </span>
              <span className="text-xs font-mono text-stone-400 bg-stone-800 px-2 py-1 rounded-full">
                {activeNode.apiExchange.responseLatencyMs}ms
              </span>
            </div>
          </div>

          {/* Reasoning Context Callout */}
          <div className="bg-stone-950/80 px-3 py-2 rounded-xl border border-stone-800/90 text-xs text-stone-300 mb-3 flex items-start gap-2">
            <span className="text-amber-400 font-bold shrink-0">🧠 Reasoning:</span>
            <span className="text-stone-300">{activeNode.reasoningSnippet}</span>
          </div>

          {/* Dual Column: What We Send (Request) vs What Comes Back (Response) */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3 min-h-0 overflow-hidden">
            {/* Left: What We Send (HTTP Request) */}
            <div className="flex flex-col rounded-xl bg-stone-950 border border-stone-800 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-stone-900 border-b border-stone-800 text-xs font-mono">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <span>➔</span> WHAT WE SEND (HTTP Request)
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(activeNode.apiExchange.requestBody, null, 2), 'req')}
                  className="flex items-center gap-1 text-[11px] text-stone-300 hover:text-white px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 transition-colors"
                >
                  {copiedType === 'req' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'req' ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed space-y-2.5">
                {/* Headers */}
                <div className="pb-2 border-b border-stone-800 text-[10px] text-stone-400">
                  <span className="text-stone-500 uppercase font-bold block mb-1">Auth & Request Headers:</span>
                  {Object.entries(activeNode.apiExchange.headers).map(([k, v]) => (
                    <div key={k} className="truncate">
                      <span className="text-stone-300 font-bold">{k}:</span> <span className="text-stone-400">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Body */}
                <div>
                  <span className="text-stone-500 uppercase font-bold text-[10px] block mb-1">Request Body (JSON):</span>
                  <pre className="text-cyan-200 whitespace-pre-wrap break-all">
                    {JSON.stringify(activeNode.apiExchange.requestBody, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Right: What Comes Back (HTTP Response / Tool Output) */}
            <div className="flex flex-col rounded-xl bg-stone-950 border border-stone-800 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-stone-900 border-b border-stone-800 text-xs font-mono">
                <span className={`font-bold flex items-center gap-1.5 ${isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                  <span>←</span> WHAT COMES BACK (Response Output)
                </span>
                <button
                  onClick={() => handleCopy(JSON.stringify(activeNode.apiExchange.responseBody, null, 2), 'res')}
                  className="flex items-center gap-1 text-[11px] text-stone-300 hover:text-white px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 transition-colors"
                >
                  {copiedType === 'res' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedType === 'res' ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] leading-relaxed space-y-2.5">
                {/* Headers */}
                <div className="pb-2 border-b border-stone-800 text-[10px] text-stone-400">
                  <span className="text-stone-500 uppercase font-bold block mb-1">Response Headers:</span>
                  {Object.entries(activeNode.apiExchange.responseHeaders).map(([k, v]) => (
                    <div key={k} className="truncate">
                      <span className="text-stone-300 font-bold">{k}:</span> <span className="text-stone-400">{v}</span>
                    </div>
                  ))}
                </div>

                {/* Body */}
                <div>
                  <span className="text-stone-500 uppercase font-bold text-[10px] block mb-1">Response Body (JSON):</span>
                  <pre className={`${isSuccess ? 'text-emerald-200' : 'text-rose-200'} whitespace-pre-wrap break-all`}>
                    {JSON.stringify(activeNode.apiExchange.responseBody, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[160px] bg-stone-900 text-stone-400 rounded-2xl border border-stone-800 p-6 text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700 text-stone-300 flex items-center justify-center text-sm font-mono font-bold">
            L3
          </div>
          <p className="text-xs font-bold text-stone-200">
            Awaiting Tool Execution & Rail Telemetry
          </p>
          <p className="text-[11px] text-stone-500 max-w-sm">
            Once the morning call connects, live HTTP Request/Response contracts from partner rails (WhisperFlo, Tripwire, ABDM, Pine Labs, Delhivery, Telegram) will stream here.
          </p>
        </div>
      )}
    </div>
  );
};
