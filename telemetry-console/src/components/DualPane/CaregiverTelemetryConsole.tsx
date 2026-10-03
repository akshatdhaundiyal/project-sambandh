import React, { useState } from 'react';
import { JudgeStepApiPane } from './JudgeStepApiPane';
import { ConversationToolTree } from '../ExecutionTree/ConversationToolTree';
import { ShieldCheck, GitBranch, Zap } from 'lucide-react';

export const CaregiverTelemetryConsole: React.FC = () => {
  const [viewMode, setViewMode] = useState<'api' | 'tree'>('api');

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-3 h-full min-h-0 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin">
      {/* Top Section Header: Judge Telemetry & Rails */}
      <div className="flex items-baseline justify-between px-1 shrink-0 flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shadow-2xs">
            <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-base font-bold text-stone-900 tracking-tight">
                Judge Telemetry & Rails
              </h2>
              <span className="text-[10px] font-mono font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                Live Rail Payloads
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono font-semibold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                L3 Autonomous
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Live Partner Contracts · Cryptographic HMAC Payloads · Fiduciary Execution
            </p>
          </div>
        </div>

        {/* View Switcher: Live Rail Payloads vs Causal DAG */}
        <div className="flex items-center bg-[#EFECE6] p-1 rounded-xl border border-[#DFDAD1] shrink-0 text-xs shadow-2xs">
          <button
            type="button"
            onClick={() => setViewMode('api')}
            className={`py-1 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'api'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-600" />
            <span>Live Rail Payloads</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('tree')}
            className={`py-1 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'tree'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-teal-600" />
            <span>Causal DAG Tree</span>
          </button>
        </div>
      </div>

      {/* Main Content: Either Full-Width JudgeStepApiPane or Causal Tool Tree */}
      <div className="flex-1 min-h-0">
        {viewMode === 'api' ? (
          <JudgeStepApiPane />
        ) : (
          <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 h-[650px] overflow-hidden flex flex-col shadow-xs">
            <ConversationToolTree />
          </div>
        )}
      </div>
    </div>
  );
};

