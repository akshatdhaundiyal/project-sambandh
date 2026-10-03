import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { ShieldCheck, ExternalLink, Activity, Sparkles, CheckCircle2 } from 'lucide-react';

export const SeniorLiveRailStrip: React.FC = () => {
  const { currentStep, callStatus, openApiDrawerForCurrentStep } = useTelemetry();

  return (
    <div className="bg-white border border-[#E7E2DB] rounded-2xl p-3 shadow-xs text-stone-900 flex flex-wrap items-center justify-between gap-2.5 transition-all">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1.5 pr-2 border-r border-stone-200">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span className="font-serif font-bold text-xs text-stone-900">
            Active Guardrails:
          </span>
        </div>

        {/* Guardrail Chips */}
        <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
          <span className="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-800 border border-teal-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-600"></span>
            <span>MedGemma 4B RAG</span>
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span>Pine Labs UPI &lt;₹1.5k</span>
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
            <span>Delhivery Rohini Dispatch</span>
          </span>
          <span className="px-2 py-0.5 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600"></span>
            <span>Voiceprint 98.4%</span>
          </span>
        </div>
      </div>

      {/* 1-Click Inspect Contract Drawer */}
      <button
        type="button"
        onClick={openApiDrawerForCurrentStep}
        className="px-2.5 py-1 text-[11px] font-medium text-stone-700 hover:text-stone-900 bg-[#FAF8F5] hover:bg-[#F5EFE6] border border-[#DFDAD1] rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-2xs"
        title="Open full JSON API exchanges and payloads drawer"
      >
        <span>Inspect Rail Contract</span>
        <ExternalLink className="w-3 h-3 text-stone-500" />
      </button>
    </div>
  );
};
