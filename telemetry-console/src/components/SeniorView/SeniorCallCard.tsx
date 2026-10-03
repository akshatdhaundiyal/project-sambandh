import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  PhoneCall,
  PhoneOff,
  Heart,
  Clock,
  Radio,
  Sparkles,
  MapPin,
  User,
  Volume2,
  VolumeX,
  Mic,
  RotateCcw,
  Send,
  CheckCircle2,
  Brain,
  Activity,
  Pill,
  Zap,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Layers,
  Bot,
  ShieldCheck
} from 'lucide-react';
import { getActiveHindiVoiceSource } from '../../utils/speechService';
import { SIMULATION_PRESETS } from '../../data/simulationPrompts';

export const SeniorCallCard: React.FC = () => {
  const {
    scenarios,
    activeScenario,
    setScenarioById,
    currentStep,
    callStatus,
    startCall,
    endCall,
    callDurationSeconds,
    activeTtsEngine,
    resetScenario,
    setActiveTab,
    foldedMemory,
    triggerSimulationPreset,
    openApiDrawerForCurrentStep,
    preCallAgency,
    requestPreCallApproval,
    resolvePreCallAgency
  } = useTelemetry();

  const [isMemoryExpanded, setIsMemoryExpanded] = React.useState<boolean>(false);
  const [copiedMemory, setCopiedMemory] = React.useState<boolean>(false);

  const handleCopyMemory = () => {
    navigator.clipboard.writeText(foldedMemory);
    setCopiedMemory(true);
    setTimeout(() => setCopiedMemory(false), 2000);
  };

  const parsedCategories = React.useMemo(() => {
    const lines = foldedMemory.split('\n').filter(l => l.trim().length > 0);
    return lines.map(line => {
      const match = line.match(/^•\s*\[(.*?)\]:\s*(.*)$/);
      if (match) {
        return { title: match[1], content: match[2] };
      }
      return { title: 'Consolidated Context', content: line.replace(/^•\s*/, '') };
    });
  }, [foldedMemory]);

  const profile = activeScenario.initialSeniorProfile;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white border border-[#E7E2DB] rounded-3xl p-3.5 sm:p-5 shadow-xs text-stone-900 transition-all space-y-3 sm:space-y-4">
      {/* Top Profile Banner: Elder Identity */}
      <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-3 sm:gap-3.5">
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-2xl bg-[#F5EFE6] border border-[#E2D7C5] flex items-center justify-center text-xl sm:text-2xl shadow-2xs shrink-0">
            👴🏼
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 sm:px-2.5 py-0.5 rounded-full border border-stone-200">
                Morning Routine · 08:30 IST
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-serif font-bold text-stone-900 leading-snug mt-0.5">
              Ramesh Chandra Ji
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 flex items-center gap-1.5 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>Age {profile.age} · Rohini Sector 8, Delhi</span>
            </p>
          </div>
        </div>

        {/* Right Section: Live Rail API Peek Button + Call State Indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={openApiDrawerForCurrentStep}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#FAF8F5] hover:bg-stone-100 border border-[#E7E2DB] text-stone-800 rounded-2xl shadow-2xs text-xs font-bold transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-emerald-600"
            title="Inspect live underlying rail API exchange (WhisperFlo, ABDM, Pine Labs, Delhivery, MedGemma)"
            aria-label="View live rail API payload"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span className="hidden sm:inline">Live Rail API</span>
            <span className="sm:hidden">API</span>
          </button>

          {/* Call State Indicator */}
          {callStatus === 'idle' ? (
            <div className="bg-[#FAF8F5] px-3.5 py-2 rounded-2xl border border-[#E7E2DB] text-right shrink-0">
              <div className="text-[11px] font-semibold text-stone-500 flex items-center justify-end gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Awaiting Call</span>
              </div>
              <span className="text-xs font-medium text-stone-700 mt-0.5 block">
                Jio Trunk Standby
              </span>
            </div>
          ) : callStatus === 'active' ? (
            <div className="bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-300 text-right shrink-0 shadow-2xs">
              <div className="text-[11px] font-bold text-emerald-800 flex items-center justify-end gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
                <span>Call in Progress</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5 justify-end">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span className="text-base sm:text-lg font-mono font-bold text-emerald-950">
                  {formatTime(callDurationSeconds)}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-stone-100 px-4 py-2 rounded-2xl border border-stone-200 text-right shrink-0">
              <span className="text-[11px] font-semibold text-stone-500 block">
                Call Completed
              </span>
              <span className="text-sm font-mono font-bold text-stone-700 mt-0.5 block">
                {formatTime(callDurationSeconds)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* CALL STATUS BANNER (SLIMMED DOWN) */}
      {callStatus === 'idle' ? (
        <div className="bg-[#FAF8F5] border border-[#E7E2DB] rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="font-serif font-bold text-stone-900">
              08:30 IST Scheduled Check-In Session
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Ready
            </span>
          </div>
          <div className="flex items-center gap-2 text-stone-500 text-[11px]">
            <span>Connect via Elder Phone on left</span>
            <button
              type="button"
              onClick={startCall}
              className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3 h-3 fill-current" />
              <span>Connect</span>
            </button>
          </div>
        </div>
      ) : callStatus === 'active' ? (
        /* ACTIVE STATE: Ongoing Call Animation Banner */
        <div className="bg-emerald-900 text-white rounded-2xl p-4 shadow-sm space-y-3 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {/* Animated Sound Waveform Bars */}
              <div className="flex items-center gap-1 h-8 px-2 bg-emerald-950/60 rounded-xl border border-emerald-700/60">
                {[40, 75, 100, 60, 85, 45, 90, 65, 80, 50, 70, 95].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-emerald-400 animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDuration: `${0.6 + (i % 5) * 0.2}s`
                    }}
                  />
                ))}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-emerald-100">
                    Live Telephony Session Active
                  </span>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-mono font-bold bg-emerald-700/60 text-emerald-200 border border-emerald-500/40">
                    {formatTime(callDurationSeconds)}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[11px] text-emerald-300 font-mono">
                    Jio PSTN Trunk · OPUS HD
                  </span>
                  {(() => {
                    const voiceInfo = getActiveHindiVoiceSource('agent', activeTtsEngine);
                    return (
                      <span className="text-[10px] font-medium bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-700/80 text-emerald-200 flex items-center gap-1">
                        <span>{voiceInfo.source === 'chrome' ? '🌐' : '☁️'}</span>
                        <span className="truncate max-w-[190px]">{voiceInfo.name}</span>
                      </span>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Mid-Call Action: End Call */}
            <div className="flex items-center gap-2">
              <button
                onClick={endCall}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Conclude call session"
              >
                <PhoneOff className="w-3.5 h-3.5 fill-current" />
                <span>End Call</span>
              </button>
            </div>
          </div>

          {/* Folded Context Memory Inspection Strip & Expandable Ledger */}
          <div className="bg-emerald-950/80 border border-emerald-700/70 rounded-xl overflow-hidden text-[11px] transition-all">
            <div className="px-3 py-2 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <Brain className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-extrabold text-emerald-100 shrink-0">
                  Structured Memory Ledger:
                </span>
                <span className="text-[10px] font-bold bg-emerald-900/90 text-emerald-300 border border-emerald-700 px-2 py-0.5 rounded-full shrink-0">
                  5 Categories Active
                </span>
                <span className="text-emerald-300/80 text-[10px] hidden sm:inline truncate max-w-xs" title={foldedMemory}>
                  {parsedCategories[0]?.content || 'Memory consolidated'}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-900/90 px-2 py-0.5 rounded-md border border-emerald-700">
                  ~210 Tokens · 0% Context Loss
                </span>
                <button
                  onClick={() => setIsMemoryExpanded(!isMemoryExpanded)}
                  className="px-2.5 py-1 bg-emerald-800/80 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer border border-emerald-600/60"
                  title="Expand or collapse structured memory categories"
                >
                  <span>{isMemoryExpanded ? 'Hide Ledger' : 'Inspect Ledger'}</span>
                  {isMemoryExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>
            </div>

            {/* Expandable Multi-Category Ledger Details */}
            {isMemoryExpanded && (
              <div className="border-t border-emerald-800/80 bg-stone-950/90 p-3 space-y-2.5 animate-fadeIn font-sans">
                <div className="flex items-center justify-between pb-1 border-b border-stone-800">
                  <div className="flex items-center gap-1.5 text-stone-300 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-extrabold text-white">Full Clinical & Conversational Memory Ledger</span>
                    <span className="text-[10px] text-stone-400">(Preserved across unlimited turns)</span>
                  </div>
                  <button
                    onClick={handleCopyMemory}
                    className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    {copiedMemory ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedMemory ? 'Copied' : 'Copy Ledger'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                  {parsedCategories.map((cat, idx) => {
                    const isClinical = cat.title.toLowerCase().includes('clinical') || cat.title.toLowerCase().includes('symptom');
                    const isMed = cat.title.toLowerCase().includes('medication') || cat.title.toLowerCase().includes('adherence');
                    const isEmo = cat.title.toLowerCase().includes('emotional') || cat.title.toLowerCase().includes('psycho');
                    const isRails = cat.title.toLowerCase().includes('rail') || cat.title.toLowerCase().includes('action');

                    const colorClass = isClinical
                      ? 'border-emerald-700/60 bg-emerald-950/40 text-emerald-200'
                      : isMed
                      ? 'border-amber-700/60 bg-amber-950/40 text-amber-200'
                      : isEmo
                      ? 'border-rose-700/60 bg-rose-950/40 text-rose-200'
                      : isRails
                      ? 'border-sky-700/60 bg-sky-950/40 text-sky-200'
                      : 'border-purple-700/60 bg-purple-950/40 text-purple-200';

                    const icon = isClinical ? (
                      <Activity className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    ) : isMed ? (
                      <Pill className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    ) : isEmo ? (
                      <Heart className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    ) : isRails ? (
                      <Zap className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                    ) : (
                      <MessageSquare className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    );

                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-lg border ${colorClass} ${
                          idx === parsedCategories.length - 1 && parsedCategories.length % 2 !== 0 ? 'md:col-span-2' : ''
                        }`}
                      >
                        <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] mb-1">
                          {icon}
                          <span>{cat.title}</span>
                        </div>
                        <p className="text-stone-300 leading-relaxed text-[11px] font-normal">
                          {cat.content}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ENDED STATE: Call Completed Summary Banner with Caregiver Telegram CTA */
        <div className="bg-gradient-to-r from-emerald-50/80 via-stone-50 to-stone-50 border border-emerald-300 rounded-2xl p-4 space-y-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-700 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-xs sm:text-sm text-stone-900">
                    Morning Call Completed ({formatTime(callDurationSeconds)})
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                    Closed-Loop Verified
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  Oral adherence ground-truthed, ABDM refill processed (₹840), and caregiver reassurance brief sent to Priya.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setIsMemoryExpanded(!isMemoryExpanded)}
                className="px-3 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-xl font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Review full consolidated memory ledger"
              >
                <Brain className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isMemoryExpanded ? 'Hide Ledger' : 'Review Memory Ledger'}</span>
              </button>
              <button
                onClick={() => setActiveTab('caregiver-telegram')}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                title="Inspect caregiver notification sent via Telegram bot"
              >
                <Send className="w-3.5 h-3.5" />
                <span>View Caregiver Telegram Brief</span>
              </button>
              <button
                onClick={resetScenario}
                className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Ended State Expandable Memory Ledger */}
          {isMemoryExpanded && (
            <div className="border border-stone-200 bg-stone-900 text-stone-100 rounded-xl p-3.5 space-y-2.5 animate-fadeIn">
              <div className="flex items-center justify-between pb-1 border-b border-stone-800">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                  <Brain className="w-4 h-4" />
                  <span>Consolidated Session Memory Ledger (Ground-Truthed)</span>
                </div>
                <button
                  onClick={handleCopyMemory}
                  className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] font-mono flex items-center gap-1 cursor-pointer"
                >
                  {copiedMemory ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMemory ? 'Copied' : 'Copy Ledger'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {parsedCategories.map((cat, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-stone-800 bg-stone-950/70">
                    <span className="font-bold text-[10px] text-stone-400 uppercase tracking-wider block mb-1">
                      {cat.title}
                    </span>
                    <p className="text-stone-200 text-xs leading-relaxed">{cat.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Senior Details Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E7E2DB] text-stone-700">
        <div>
          <span className="text-stone-400 text-[11px] block font-medium">Spoken Dialect</span>
          <span className="font-semibold text-stone-800">Awadhi-Hindi (Native)</span>
        </div>
        <div>
          <span className="text-stone-400 text-[11px] block font-medium">Caregiver on Record</span>
          <span className="font-semibold text-stone-800">Priya Sharma (Daughter)</span>
        </div>
        <div className="col-span-2 sm:col-span-1">
          <span className="text-stone-400 text-[11px] block font-medium">Life Vocation</span>
          <span className="font-semibold text-stone-800 truncate block" title={profile.vocation}>
            Chief Signal Inspector (Northern Rly Retd.)
          </span>
        </div>
      </div>
    </div>
  );
};
