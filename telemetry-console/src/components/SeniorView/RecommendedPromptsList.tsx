import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { SIMULATION_PRESETS, SimulationPreset } from '../../data/simulationPrompts';
import {
  Sparkles,
  Play,
  Copy,
  Check,
  Zap,
  Volume2,
  ShieldCheck,
  ChevronRight,
  GraduationCap
} from 'lucide-react';

export const RecommendedPromptsList: React.FC = () => {
  const { triggerSimulationPreset, autoSpeak, setIsMentorshipModalOpen } = useTelemetry();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All', icon: '✨' },
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

  const getRailBadgeStyle = (badgeName: string) => {
    const lower = badgeName.toLowerCase();
    if (lower.includes('abdm') || lower.includes('fhir')) {
      return 'bg-teal-50 text-teal-800 border-teal-200/80';
    }
    if (lower.includes('pine') || lower.includes('₹') || lower.includes('fiduciary')) {
      return 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    }
    if (lower.includes('delhivery') || lower.includes('cmu') || lower.includes('logistics')) {
      return 'bg-rose-50 text-rose-800 border-rose-200/80';
    }
    if (lower.includes('mcp') || lower.includes('wallet') || lower.includes('pooja') || lower.includes('amazon')) {
      return 'bg-amber-50 text-amber-800 border-amber-300 font-bold';
    }
    if (lower.includes('sadness') || lower.includes('drift') || lower.includes('emotional')) {
      return 'bg-indigo-50 text-indigo-800 border-indigo-200 font-bold';
    }
    if (lower.includes('telegram') || lower.includes('alert') || lower.includes('2fa')) {
      return 'bg-sky-50 text-sky-800 border-sky-200/80';
    }
    return 'bg-stone-100 text-stone-700 border-stone-200';
  };

  return (
    <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 shadow-xs text-stone-900 transition-all space-y-3">
      {/* Header: Title + Category Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-[#E7E2DB]">
        <div>
          <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 flex items-center gap-2">
            <span>Autonomous Rail Benchmarks</span>
            <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              1-Click
            </span>
          </h3>
          <p className="text-xs text-stone-500">Trigger test scenarios and inspect fiduciary actions</p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 transition-all cursor-pointer border flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white border-stone-900 shadow-2xs font-bold'
                  : 'bg-white text-stone-600 border-[#DFDAD1] hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Card: Intermediary Mentorship & Wisdom Archiving Gate */}
      <div
        onClick={() => setIsMentorshipModalOpen(true)}
        className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E2D7C5] hover:border-amber-400 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
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
                LLM Safety Gate
              </span>
            </div>
            <p className="text-xs text-stone-500 truncate mt-0.5">
              Curates questions from junior railway engineers, filtering extractive asks before reaching Ramesh Ji.
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMentorshipModalOpen(true);
          }}
          className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>Evaluate Prompt</span>
          <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
        </button>
      </div>

      {/* Compact Scrollable Presets Viewport (max-h-[300px]) */}
      <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {filteredPresets.map((preset) => {
          return (
            <div
              key={preset.id}
              onClick={() => triggerSimulationPreset(preset.id)}
              className="p-3 rounded-xl border border-[#E7E2DB] bg-white hover:bg-[#FAF8F5] hover:border-emerald-600/60 shadow-2xs hover:shadow-xs transition-all cursor-pointer group space-y-1.5"
            >
              {/* Row 1: Icon, Title, Target Rails, Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm shrink-0">
                    {preset.icon}
                  </span>
                  <span className="font-semibold text-xs sm:text-sm text-stone-900 truncate">
                    {preset.scenarioTitle}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                  <button
                    onClick={(e) => handleCopyPrompt(preset, e)}
                    className="p-1 rounded-md border border-[#DFDAD1] bg-white hover:bg-stone-50 text-stone-500 transition-colors"
                    title="Copy prompt text"
                  >
                    {copiedId === preset.id ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      triggerSimulationPreset(preset.id);
                    }}
                    className="px-2.5 py-1 rounded-lg font-bold text-[10px] transition-all flex items-center gap-1 cursor-pointer bg-emerald-700 hover:bg-emerald-800 text-white"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Run</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Prompt Text Preview */}
              <p className="text-xs text-stone-800 font-medium leading-relaxed font-sans line-clamp-2">
                "{preset.devanagariPrompt}"
              </p>

              {/* Row 3: Rail Outcome */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100 text-[10px]">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {preset.railBadges.map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      className="px-1.5 py-0.2 rounded-md font-mono text-[9px] font-semibold bg-stone-100 text-stone-700 border border-stone-200"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <span className="text-stone-500 font-sans truncate max-w-[200px]">
                  {preset.railSummary}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

