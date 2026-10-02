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
    <div className="bg-white border border-stone-200/90 rounded-3xl p-3.5 shadow-xs text-stone-900 transition-all space-y-2.5">
      {/* Header: Title + Category Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center text-xs shrink-0">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="font-extrabold text-xs sm:text-sm text-stone-900 flex items-center gap-1.5">
              <span>Simulation Presets & Autonomous Rails</span>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-200">
                1-CLICK
              </span>
            </h3>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 transition-all cursor-pointer border flex items-center gap-1 ${
                selectedCategory === cat.id
                  ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                  : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900'
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
        className="p-2.5 rounded-2xl bg-gradient-to-r from-amber-50/90 via-stone-50 to-emerald-50/70 border border-amber-200/90 hover:border-amber-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between gap-3 group"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-100 border border-amber-200 text-amber-900 flex items-center justify-center text-base shrink-0 group-hover:scale-105 transition-transform">
            🎓
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xs text-stone-900">
                Intermediary Mentorship & Wisdom Bridge
              </span>
              <span className="text-[9px] font-mono font-bold bg-amber-200/80 text-amber-950 px-1.5 py-0.2 rounded-full border border-amber-300">
                LLM SAFETY GATE
              </span>
            </div>
            <p className="text-[10px] text-stone-500 truncate">
              Test questions from young engineers: LLM classifies genuine vocational advice vs. predatory asks.
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMentorshipModalOpen(true);
          }}
          className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-[10px] font-bold shadow-2xs transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>Open Safety Gate</span>
          <ChevronRight className="w-3 h-3 text-amber-400" />
        </button>
      </div>

      {/* Compact Scrollable Presets Viewport (max-h-[280px]) */}
      <div className="max-h-[280px] overflow-y-auto space-y-1.5 pr-1.5 scrollbar-thin">
        {filteredPresets.map((preset) => {
          return (
            <div
              key={preset.id}
              onClick={() => triggerSimulationPreset(preset.id)}
              className="p-2 rounded-xl border border-stone-200/80 bg-stone-50/60 hover:bg-amber-50/40 hover:border-amber-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer group space-y-1"
            >
              {/* Row 1: Icon, Title, Target Rails, Action Buttons */}
              <div className="flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-sm shrink-0 p-0.5 bg-white rounded-md border border-stone-200/80">
                    {preset.icon}
                  </span>
                  <span className="font-extrabold text-xs text-stone-900 truncate">
                    {preset.buttonLabel}
                  </span>
                  <span className="text-[9px] text-stone-400 font-sans hidden sm:inline truncate max-w-[120px]">
                    {preset.badge}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-auto">
                  <button
                    onClick={(e) => handleCopyPrompt(preset, e)}
                    className="p-1 rounded-md border border-stone-200 bg-white hover:bg-stone-100 text-stone-600 transition-colors shadow-2xs"
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
                    className="px-2 py-1 rounded-lg font-bold text-[10px] shadow-2xs transition-all flex items-center gap-1 cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Play className="w-2.5 h-2.5 fill-current" />
                    <span>Fire</span>
                  </button>
                </div>
              </div>

              {/* Row 2: Compact 1-Line Text Preview */}
              <p className="text-[11px] text-stone-700 font-medium truncate font-sans pl-1">
                {preset.devanagariPrompt}
              </p>

              {/* Row 3: Micro Rail Badges */}
              <div className="flex items-center justify-between gap-1 text-[9px] pl-1">
                <div className="flex items-center gap-1 flex-wrap">
                  {preset.railBadges.map((badge, bIdx) => (
                    <span
                      key={bIdx}
                      className={`px-1 py-0.2 rounded font-mono font-bold border ${getRailBadgeStyle(badge)}`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
                <span className="text-stone-400 font-sans truncate max-w-[180px] hidden md:inline">
                  {preset.railSummary}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info Strip */}
      <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
        <span className="flex items-center gap-1">
          <Volume2 className="w-3 h-3 text-stone-400" />
          <span>Auto-Speak: <strong className="text-stone-700 font-bold">{autoSpeak ? 'ENABLED' : 'MUTED'}</strong></span>
        </span>
        <span className="font-mono text-stone-400 text-[9px]">
          {filteredPresets.length} Presets Available · Scrollable
        </span>
      </div>
    </div>
  );
};

