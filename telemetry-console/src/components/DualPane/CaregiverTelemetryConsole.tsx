import React from 'react';
import { ConversationToolTree } from '../ExecutionTree/ConversationToolTree';
import { JudgeStepApiPane } from './JudgeStepApiPane';
import { PartnerContractRibbon } from './PartnerContractRibbon';
import { ShieldCheck, GitBranch, Cpu } from 'lucide-react';

export const CaregiverTelemetryConsole: React.FC = () => {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-3.5 h-full min-h-0 overflow-hidden">
      {/* 1. Compact Partner Contract & Fiduciary Rail Ribbon */}
      <div className="shrink-0">
        <PartnerContractRibbon />
      </div>

      {/* 2. Structured Dual-Pane: Autonomous Causal Graph (Left) + Precision Contract Inspector (Right) */}
      <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-2 gap-3.5 overflow-hidden">
        {/* Left Column: Causal Decision & Tool Graph */}
        <div className="bg-white border border-[#E7E2DB] rounded-3xl p-3.5 sm:p-4 overflow-hidden flex flex-col shadow-xs min-h-0">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F5EFE6] shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center">
                <GitBranch className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-serif font-bold text-stone-900 leading-tight">
                  Autonomous Causal Decision Graph
                </h3>
                <span className="text-[10px] text-stone-400 font-mono">
                  State Machine & Branch Evaluation
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-semibold">
              Live DAG
            </span>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden">
            <ConversationToolTree />
          </div>
        </div>

        {/* Right Column: Precision HTTP Payload & Security Contract Inspector */}
        <div className="bg-white border border-[#E7E2DB] rounded-3xl p-3.5 sm:p-4 overflow-hidden flex flex-col shadow-xs min-h-0">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F5EFE6] shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xs font-serif font-bold text-stone-900 leading-tight">
                  Cryptographic Contract & Payload Inspector
                </h3>
                <span className="text-[10px] text-stone-400 font-mono">
                  SHA-256 HMAC · Fiduciary Guardrails
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200 font-semibold flex items-center gap-1">
                <Cpu className="w-3 h-3 text-teal-600" />
                Zero-Leakage
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <JudgeStepApiPane
              hideCatalogBar={true}
              hideTimeline={true}
              compactMode={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
