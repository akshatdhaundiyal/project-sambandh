import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { ConversationToolTree } from '../ExecutionTree/ConversationToolTree';
import {
  PINE_LABS_SUCCESS_EXCHANGE,
  PINE_LABS_LIMIT_EXCEEDED_EXCHANGE,
  DELHIVERY_SUCCESS_EXCHANGE,
  WHISPERFLO_DIAL_EXCHANGE,
  ABDM_RUNWAY_EXCHANGE,
  TELEGRAM_DISPATCH_EXCHANGE
} from '../../data/apiExchanges';
import { GitFork, FileCode, Code2, ShieldCheck, Database, Layers } from 'lucide-react';

export const JudgeDeepDiveView: React.FC = () => {
  const { openApiExchangeModal, setIsStateDrawerOpen, activeScenario } = useTelemetry();

  return (
    <div className="max-w-[1920px] mx-auto p-4 flex flex-col gap-4 h-[calc(100vh-80px)]">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-2xs">
            <GitFork className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-stone-900">
                L3 Causal Decision Tree & API Payload Library
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                JUDGE EVALUATOR CONSOLE
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Traces live unscripted Awadhi-Hindi speech turns into deterministic tool execution nodes with authentic HTTP contracts.
            </p>
          </div>
        </div>

        {/* API Payloads Quick Launch Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono font-bold text-stone-400">INSPECT RAILS:</span>
          <button
            onClick={() => openApiExchangeModal(PINE_LABS_SUCCESS_EXCHANGE)}
            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-mono font-bold border border-emerald-300 transition-colors shadow-2xs"
          >
            Pine Labs (₹840)
          </button>
          <button
            onClick={() => openApiExchangeModal(DELHIVERY_SUCCESS_EXCHANGE)}
            className="px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 text-xs font-mono font-bold border border-cyan-300 transition-colors shadow-2xs"
          >
            Delhivery CMU
          </button>
          <button
            onClick={() => openApiExchangeModal(WHISPERFLO_DIAL_EXCHANGE)}
            className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 text-xs font-mono font-bold border border-indigo-300 transition-colors shadow-2xs"
          >
            WhisperFlo SIP
          </button>
          <button
            onClick={() => openApiExchangeModal(ABDM_RUNWAY_EXCHANGE)}
            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-mono font-bold border border-purple-300 transition-colors shadow-2xs"
          >
            ABDM Runway
          </button>
          <button
            onClick={() => openApiExchangeModal(TELEGRAM_DISPATCH_EXCHANGE)}
            className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-mono font-bold border border-blue-300 transition-colors shadow-2xs"
          >
            Telegram Bot
          </button>
          <button
            onClick={() => setIsStateDrawerOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-mono font-bold transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Code2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>State JSON</span>
          </button>
        </div>
      </div>

      {/* Main Causal Tree */}
      <div className="flex-1 min-h-0 bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs overflow-hidden flex flex-col">
        <ConversationToolTree />
      </div>
    </div>
  );
};
