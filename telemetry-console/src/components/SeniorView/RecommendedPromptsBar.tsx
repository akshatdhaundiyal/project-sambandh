import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { SIMULATION_PRESETS, SimulationPreset } from '../../data/simulationPrompts';
import { Sparkles, Play, ShieldCheck, Zap } from 'lucide-react';

export const RecommendedPromptsBar: React.FC = () => {
  const { triggerSimulationPreset, setIsMentorshipModalOpen, startCall, callStatus } = useTelemetry();

  const handleRunPreset = (preset: SimulationPreset) => {
    if (callStatus === 'idle') {
      startCall();
    }
    triggerSimulationPreset(preset.id);
  };

  const getBadgeStyle = (badgeName: string) => {
    const lower = badgeName.toLowerCase();
    if (lower.includes('health') || lower.includes('abdm')) return 'bg-teal-50 text-teal-800 border-teal-200';
    if (lower.includes('medgemma')) return 'bg-purple-50 text-purple-800 border-purple-200 font-semibold';
    if (lower.includes('pine') || lower.includes('₹')) return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (lower.includes('delhivery')) return 'bg-rose-50 text-rose-800 border-rose-200';
    if (lower.includes('mcp')) return 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
    if (lower.includes('sadness')) return 'bg-indigo-50 text-indigo-800 border-indigo-200 font-semibold';
    return 'bg-stone-100 text-stone-700 border-stone-200';
  };

  return (
    <div className="bg-white border border-[#E7E2DB] rounded-3xl p-3.5 sm:p-4 shadow-xs text-stone-900 space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
          <h3 className="font-serif font-bold text-xs sm:text-sm text-stone-900">
            Recommended Simulation Scenarios (1-Click Test Turns)
          </h3>
          <span className="text-[10px] font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.2 rounded-full border border-emerald-200">
            {SIMULATION_PRESETS.length} Presets
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsMentorshipModalOpen(true)}
          className="text-[11px] text-amber-800 hover:text-amber-900 font-medium underline flex items-center gap-1 cursor-pointer"
        >
          <span>🎓 Mentorship Gate</span>
        </button>
      </div>

      {/* Horizontal Scrollable Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {SIMULATION_PRESETS.map((preset) => (
          <button
            key={preset.id}
            type="button"
            onClick={() => handleRunPreset(preset)}
            className="p-2.5 rounded-2xl bg-[#FAF8F5] border border-[#E7E2DB] hover:border-amber-400 hover:bg-[#F5EFE6] transition-all text-left flex flex-col justify-between group cursor-pointer shadow-2xs active:scale-[0.98]"
            title={`${preset.scenarioTitle} — ${preset.railSummary}`}
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-base group-hover:scale-110 transition-transform">{preset.icon}</span>
                <span className={`text-[8px] font-mono px-1 py-0.2 rounded border ${getBadgeStyle(preset.badge)}`}>
                  {preset.category}
                </span>
              </div>
              <p className="text-[11px] font-serif font-bold text-stone-900 line-clamp-1 group-hover:text-amber-900">
                {preset.buttonLabel}
              </p>
              <p className="text-[10px] text-stone-500 italic line-clamp-1">
                "{preset.hinglishPrompt}"
              </p>
            </div>

            <div className="pt-2 mt-1 border-t border-stone-200/60 flex items-center justify-between text-[9px] text-stone-400 font-medium">
              <span>Run Turn</span>
              <Play className="w-2.5 h-2.5 fill-current text-stone-600 group-hover:text-amber-800" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
