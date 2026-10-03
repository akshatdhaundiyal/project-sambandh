import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { SIMULATION_PRESETS, SimulationPreset } from '../../data/simulationPrompts';
import {
  Sparkles,
  Play,
  Copy,
  Check,
  X,
  GraduationCap,
  Layers,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface RecommendedPromptsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecommendedPromptsModal: React.FC<RecommendedPromptsModalProps> = ({
  isOpen,
  onClose
}) => {
  const { triggerSimulationPreset, setIsMentorshipModalOpen } = useTelemetry();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All', icon: '✨' },
    { id: 'companion', label: 'Companion & News', icon: '💬' },
    { id: 'refill', label: 'Refill', icon: '💊' },
    { id: 'mcp', label: 'MCP Orders', icon: '🌸' },
    { id: 'sadness', label: 'Sad Mood', icon: '🌧️' },
    { id: 'crisis', label: 'Crisis', icon: '🚨' },
    { id: 'fiduciary', label: '2FA Limit', icon: '💳' },
  ];

  const filteredPresets = selectedCategory === 'all'
    ? SIMULATION_PRESETS
    : SIMULATION_PRESETS.filter(p => p.category === selectedCategory);

  const handleCopyPrompt = (preset: SimulationPreset, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${preset.devanagariPrompt}\n${preset.hinglishPrompt}`);
    setCopiedId(preset.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunPreset = (preset: SimulationPreset) => {
    triggerSimulationPreset(preset.id);
    onClose();
  };

  const getRailBadgeStyle = (badgeName: string) => {
    const lower = badgeName.toLowerCase();
    if (lower.includes('health locker') || lower.includes('abdm') || lower.includes('fhir')) {
      return 'bg-teal-50 text-teal-800 border-teal-200';
    }
    if (lower.includes('medgemma')) {
      return 'bg-purple-50 text-purple-800 border-purple-200 font-semibold';
    }
    if (lower.includes('pine') || lower.includes('₹') || lower.includes('fiduciary')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    }
    if (lower.includes('delhivery') || lower.includes('cmu') || lower.includes('logistics')) {
      return 'bg-rose-50 text-rose-800 border-rose-200';
    }
    if (lower.includes('mcp') || lower.includes('wallet') || lower.includes('pooja') || lower.includes('amazon')) {
      return 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
    }
    if (lower.includes('sadness') || lower.includes('drift') || lower.includes('emotional')) {
      return 'bg-indigo-50 text-indigo-800 border-indigo-200 font-semibold';
    }
    if (lower.includes('telegram') || lower.includes('alert') || lower.includes('2fa')) {
      return 'bg-sky-50 text-sky-800 border-sky-200';
    }
    return 'bg-stone-100 text-stone-700 border-stone-200';
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF8F5] border border-[#E7E2DB] rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-white border-b border-[#E7E2DB] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900">
                Simulation Scenarios & Benchmark Turns
              </h3>
              <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {filteredPresets.length} Turns
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Select a benchmark dialogue turn to trigger deterministic clinical, fiduciary, and emotional rails.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="px-5 py-2.5 bg-[#F5EFE6] border-b border-[#DFDAD1] flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-xl text-xs font-medium shrink-0 transition-all cursor-pointer border flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white border-stone-900 shadow-2xs font-semibold'
                  : 'bg-white text-stone-600 border-[#DFDAD1] hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Body List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 scrollbar-thin">
          {/* Featured Gate: Mentorship Bridge */}
          <div
            onClick={() => {
              onClose();
              setIsMentorshipModalOpen(true);
            }}
            className="p-3.5 rounded-2xl bg-white border border-[#E2D7C5] hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-[#F5EFE6] border border-[#DFDAD1] text-amber-900 flex items-center justify-center text-lg shrink-0">
                🎓
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-xs sm:text-sm text-stone-900">
                    Intermediary Mentorship & Wisdom Bridge
                  </span>
                  <span className="text-[9px] font-mono font-semibold bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-md border border-amber-200">
                    Safety Gate
                  </span>
                </div>
                <p className="text-xs text-stone-500 truncate mt-0.5">
                  Filters questions from junior railway engineers before reaching Ramesh Ji to protect cognitive well-being.
                </p>
              </div>
            </div>
            <button
              type="button"
              className="px-2.5 py-1 text-xs font-semibold text-amber-800 bg-amber-50 group-hover:bg-amber-100 rounded-lg transition-colors shrink-0"
            >
              Inspect Gate
            </button>
          </div>

          {/* Preset Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredPresets.map((preset) => (
              <div
                key={preset.id}
                className="bg-white border border-[#E7E2DB] hover:border-stone-400 rounded-2xl p-3.5 flex flex-col justify-between transition-all shadow-2xs group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{preset.icon}</span>
                      <span className="font-serif font-bold text-xs sm:text-sm text-stone-900">
                        {preset.scenarioTitle}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono font-semibold text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 shrink-0">
                      {preset.badge}
                    </span>
                  </div>

                  {/* Turn Text: Devanagari & Hinglish */}
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EFECE6] space-y-1">
                    <p className="text-xs font-medium text-stone-900 leading-snug">
                      "{preset.devanagariPrompt}"
                    </p>
                    <p className="text-[11px] text-stone-500 italic">
                      "{preset.hinglishPrompt}"
                    </p>
                  </div>

                  {/* Rail badges */}
                  <div className="flex flex-wrap gap-1 pt-0.5">
                    {preset.railBadges.map((badge, bIdx) => (
                      <span
                        key={bIdx}
                        className={`text-[9px] px-1.5 py-0.5 rounded border ${getRailBadgeStyle(badge)}`}
                      >
                        {badge}
                      </span>
                    ))}
                  </div>

                  <p className="text-[11px] text-stone-500 line-clamp-2">
                    {preset.railSummary}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-3 mt-2 border-t border-[#F5EFE6]">
                  <button
                    type="button"
                    onClick={(e) => handleCopyPrompt(preset, e)}
                    className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                    title="Copy prompt text"
                  >
                    {copiedId === preset.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRunPreset(preset)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-all active:scale-[0.98]"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run Scenario</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
