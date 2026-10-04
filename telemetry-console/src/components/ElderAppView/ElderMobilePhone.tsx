import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  Bell,
  Search,
  Heart,
  Activity,
  Calendar,
  Phone,
  PhoneOff,
  PhoneCall,
  Mic,
  MicOff,
  Volume2,
  Video,
  Home,
  MessageCircle,
  Settings,
  Sparkles,
  ShieldCheck,
  MapPin,
  Clock,
  ArrowRight,
  X,
  CheckCircle,
  Stethoscope,
  Users,
  Plus,
  User
} from 'lucide-react';

interface ElderMobilePhoneProps {
  standalonePhoneOnly?: boolean;
}

export const ElderMobilePhone: React.FC<ElderMobilePhoneProps> = ({ standalonePhoneOnly = false }) => {
  const {
    currentStep,
    activeScenario,
    allTurnsSoFar,
    callStatus,
    startCall,
    acceptCall,
    declineCall,
    endCall,
    callDurationSeconds,
    activeTtsEngine,
    consultationSession,
    openConsultationModal,
    startDoctorConsultation
  } = useTelemetry();
  const profile = activeScenario.initialSeniorProfile;
  const [activeScreen, setActiveScreen] = useState<'dashboard' | 'incoming_call' | 'call'>('dashboard');
  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [isDoctorPromptOpen, setIsDoctorPromptOpen] = useState(false);

  // Call retry counter, quick notes, and search state
  const [declineRetryCount, setDeclineRetryCount] = useState<number>(0);
  const [isQuickNoteModalOpen, setIsQuickNoteModalOpen] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<{ message: string; type?: 'info' | 'success' | 'warn' } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const showToast = (message: string, type: 'info' | 'success' | 'warn' = 'info') => {
    setActiveToast({ message, type });
    setTimeout(() => setActiveToast(null), 4000);
  };

  const handleDeclineCall = () => {
    const nextRetry = declineRetryCount + 1;
    setDeclineRetryCount(nextRetry);
    declineCall();
    setActiveScreen('dashboard');
    if (nextRetry < 3) {
      showToast(`Call declined. Retry ${nextRetry}/3 scheduled in 15m. Priya alerted.`, 'warn');
    } else {
      showToast(`3 consecutive calls declined. High-priority alert sent to Priya.`, 'warn');
    }
  };

  const handleRemind10m = () => {
    declineCall();
    setActiveScreen('dashboard');
    showToast('⏰ Reminder set for 10 minutes. Sambandh AI will call at 08:45 AM. Priya notified.', 'info');
  };

  const handleSendQuickNote = (noteText: string) => {
    setIsQuickNoteModalOpen(false);
    declineCall();
    setActiveScreen('dashboard');
    showToast(`Quick note sent to Priya: "${noteText}"`, 'success');
  };

  // Sync activeScreen with live callStatus
  React.useEffect(() => {
    if (callStatus === 'calling') {
      setActiveScreen('incoming_call');
    } else if (callStatus === 'active') {
      setActiveScreen('call');
    } else if (callStatus === 'idle') {
      setActiveScreen('dashboard');
    }
  }, [callStatus]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const daysOfWeek = [
    { day: 'Thu', date: '01', status: 'done', isToday: false },
    { day: 'Fri', date: '02', status: 'active', isToday: true },
    { day: 'Sat', date: '03', status: 'upcoming', isToday: false },
    { day: 'Sun', date: '04', status: 'upcoming', isToday: false },
    { day: 'Mon', date: '05', status: 'upcoming', isToday: false }
  ];

  const conversationTurns = allTurnsSoFar.filter(t => t.speaker !== 'system');
  const latestTurn = conversationTurns[conversationTurns.length - 1];

  return (
    <div className={standalonePhoneOnly ? "flex justify-center items-start w-full pt-0 pb-2 px-1" : "flex flex-col lg:flex-row items-start justify-center gap-6 pt-0 pb-3 px-1 sm:px-2 max-w-6xl mx-auto"}>
      {/* Mobile Device Frame (iPhone 16 Pro Style) */}
      <div className="w-full max-w-[390px] h-[740px] sm:h-[780px] max-h-[calc(100vh-5.5rem)] bg-stone-900 rounded-[40px] sm:rounded-[48px] p-2.5 sm:p-3 shadow-2xl ring-1 ring-stone-800 relative flex flex-col shrink-0 select-none">
        {/* Dynamic Island / Earpiece */}
        <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 w-32 h-5 sm:h-6 bg-black rounded-full z-50 flex items-center justify-between px-2.5">
          <span className={`w-2 h-2 rounded-full ${callStatus === 'calling' ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold tabular-nums">
            {callStatus === 'calling' ? 'RINGING...' : callStatus === 'active' ? formatTime(callDurationSeconds) : '08:30'}
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-stone-800"></span>
        </div>

        {/* Screen Bezel Content */}
        <div className="w-full h-full bg-[#FAF8F5] rounded-[32px] sm:rounded-[44px] overflow-hidden flex flex-col relative text-stone-900">
          {/* iOS Status Bar */}
          <div className="pt-3 px-7 pb-2 flex items-center justify-between text-xs font-semibold text-stone-800">
            <span>9:41</span>
            <div className="flex items-center gap-1.5 text-stone-800 text-[11px]">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* Screen Content Switcher: Dashboard vs Call View */}
          {activeScreen === 'dashboard' ? (
            <div className="flex-1 overflow-y-auto px-5 pt-3 pb-24 space-y-4 scrollbar-thin">
              {/* Header Greeting */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-[#F5EFE6] border border-[#E2D7C5] flex items-center justify-center text-xl shadow-2xs">
                    👴🏼
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 block leading-tight font-medium">
                      Namaste, Welcome Back!
                    </span>
                    <span className="text-sm font-serif font-bold text-stone-900 block leading-tight mt-0.5">
                      Ramesh Chandra Ji
                    </span>
                  </div>
                </div>

                <div className="w-9 h-9 rounded-full bg-white border border-[#DFDAD1] flex items-center justify-center text-stone-700 shadow-2xs relative">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                </div>
              </div>

              {/* Floating Status Notification Toast */}
              {activeToast && (
                <div className={`p-3 rounded-2xl text-xs font-semibold shadow-lg flex items-center justify-between gap-2 animate-in slide-in-from-top-2 duration-300 border ${
                  activeToast.type === 'warn'
                    ? 'bg-amber-900/90 text-amber-100 border-amber-600/50'
                    : activeToast.type === 'success'
                    ? 'bg-emerald-900/90 text-emerald-100 border-emerald-600/50'
                    : 'bg-stone-900/90 text-stone-100 border-stone-700/50'
                }`}>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{activeToast.message}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveToast(null)}
                    className="p-1 hover:bg-white/10 rounded-full text-stone-300 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Floating Incoming Call Popup Banner (visible if on dashboard while ringing) */}
              {callStatus === 'calling' && (
                <div
                  onClick={() => setActiveScreen('incoming_call')}
                  className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border border-emerald-500/40 text-white p-3 rounded-2xl shadow-xl flex items-center justify-between gap-2.5 cursor-pointer animate-in slide-in-from-top-2 duration-300"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-xl shrink-0 shadow-md ring-2 ring-emerald-400/30 animate-pulse">
                      🌿
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif font-bold text-xs text-white truncate">
                          Sambandh AI Calling...
                        </span>
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950 px-1.5 py-0.2 rounded border border-emerald-700">
                          Jio PSTN
                        </span>
                      </div>
                      <span className="text-[11px] text-emerald-200 block truncate">
                        Tap to Answer / बात करें
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={handleDeclineCall}
                      className="w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-md active:scale-95 transition-all cursor-pointer"
                      title="Decline Call"
                    >
                      <PhoneOff className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        acceptCall();
                        setActiveScreen('call');
                      }}
                      className="w-8 h-8 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white shadow-md active:scale-95 transition-all cursor-pointer animate-bounce"
                      title="Accept Call"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Main Question Header */}
              <div className="pt-1">
                <h1 className="text-2xl font-serif font-bold text-stone-900 leading-snug tracking-tight">
                  How are you feeling right now today?
                </h1>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="bg-white rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 border border-stone-200/80 shadow-xs text-xs focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
                  <Search className="w-4 h-4 text-stone-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search daily vitals, medicines, advice..."
                    className="w-full bg-transparent text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-0.5 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {searchQuery.trim().length > 0 && (
                  <div className="mt-1.5 p-2 bg-emerald-50/90 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-center justify-between">
                    <span>Filtering for: <strong>"{searchQuery}"</strong></span>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-[10px] font-bold underline text-emerald-700 cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                )}
              </div>

              {/* Row 1: Vitals Widgets (Blood Pressure & Blood Glucose) */}
              <div className="grid grid-cols-2 gap-3">
                {/* Blood Pressure Card */}
                <div className="bg-stone-900 text-white rounded-3xl p-4 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-stone-300 text-xs font-semibold">
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                      <span>Blood Pressure</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Good
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-black tracking-tight block">112/80</span>
                    <span className="text-[10px] text-stone-400">Normal healthy range</span>
                  </div>
                </div>

                {/* Blood Glucose Card */}
                <div className="bg-white text-stone-900 rounded-3xl p-4 shadow-xs border border-stone-200/80 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-stone-600 text-xs font-semibold">
                      <Activity className="w-3.5 h-3.5 text-amber-500" />
                      <span>Blood Glucose</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Good
                    </span>
                  </div>
                  <div className="mt-3">
                    <span className="text-2xl font-black tracking-tight block">90-120</span>
                    <span className="text-[10px] text-stone-500">Post-breakfast normal</span>
                  </div>
                </div>
              </div>

              {/* Weekly Pill Routine Card with Bars */}
              <div className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-700">Daily Pill Adherence</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Good
                  </span>
                </div>

                <div className="flex items-end justify-between gap-1 pt-2">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                    <div key={day} className="flex flex-col items-center gap-1.5 flex-1">
                      <div
                        className={`w-4 rounded-full transition-all ${
                          i < 4
                            ? 'h-9 bg-emerald-100'
                            : i === 4
                            ? 'h-14 bg-rose-500 shadow-xs ring-2 ring-rose-200'
                            : 'h-6 bg-stone-100'
                        }`}
                      />
                      <span className={`text-[10px] font-bold ${i === 4 ? 'text-rose-600' : 'text-stone-400'}`}>
                        {day}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Morning Companion Call Action Card */}
              {callStatus === 'idle' ? (
                <div className="bg-gradient-to-tr from-stone-900 via-stone-800 to-stone-900 text-white rounded-3xl p-4 shadow-lg border border-stone-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span className="text-xs font-serif font-bold text-stone-100">
                        Morning Companion Check-in
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded-full border border-emerald-800/80">
                      08:30 IST Ready
                    </span>
                  </div>

                  <p className="text-xs text-stone-300 leading-relaxed">
                    Sambandh AI is ready to check in on your morning vitals, breakfast, and today's railway stories.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      startCall();
                      setActiveScreen('call');
                    }}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                  >
                    <Phone className="w-4 h-4 fill-current" />
                    <span>Connect Morning Call with Sambandh AI</span>
                  </button>
                </div>
              ) : (
                <div className="bg-gradient-to-tr from-emerald-900 to-emerald-950 text-white rounded-3xl p-4 shadow-md border border-emerald-700/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Morning Call in Progress</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-300 tabular-nums">
                      {formatTime(callDurationSeconds)}
                    </span>
                  </div>

                  <p className="text-xs text-emerald-100 line-clamp-2 italic">
                    "{latestTurn ? latestTurn.content : 'Namaste Ramesh Uncle, aaj subah ka chai-nashta ho gaya?'}"
                  </p>

                  <button
                    type="button"
                    onClick={() => setActiveScreen('call')}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 text-xs font-extrabold rounded-2xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 fill-current" />
                    <span>Open In-Call Screen</span>
                  </button>
                </div>
              )}

              {/* Connected Specialists Row */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold text-stone-900 block">
                  Your Primary Care Circle
                </span>

                {/* In-Clinic Doctor Consultation Bridge Card */}
                <div className="bg-gradient-to-br from-white via-white to-emerald-50/70 rounded-3xl p-3.5 border border-emerald-200/90 shadow-2xs space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm shadow-2xs">
                        🩺
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-serif font-bold text-stone-900">
                            Dr. Arvind Saxena
                          </span>
                          <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200">
                            Apollo Clinic
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-500 block">
                          Cardiologist Consultation · Multi-Speaker Transcriber
                        </span>
                      </div>
                    </div>

                    {consultationSession.status === 'in_progress' ? (
                      <span className="text-[9px] font-mono font-bold text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        <span>ACTIVE</span>
                      </span>
                    ) : consultationSession.status === 'completed' ? (
                      <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        SYNCED
                      </span>
                    ) : null}
                  </div>

                  {consultationSession.status === 'in_progress' ? (
                    <button
                      type="button"
                      onClick={openConsultationModal}
                      className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Open Live Consultation Screen ({consultationSession.turns.length} turns)</span>
                    </button>
                  ) : consultationSession.status === 'completed' ? (
                    <div className="space-y-1.5">
                      <div className="p-2 bg-emerald-50/80 rounded-xl border border-emerald-200 text-[10px] text-emerald-900 flex items-center justify-between">
                        <span>✅ Last Visit Synced: Atorvastatin 10mg Added</span>
                        <button
                          type="button"
                          onClick={openConsultationModal}
                          className="font-bold underline text-emerald-800 cursor-pointer"
                        >
                          View Transcript
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsDoctorPromptOpen(true)}
                        className="w-full py-1.5 bg-[#FAF8F5] hover:bg-stone-100 text-stone-800 border border-stone-200 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-emerald-700" />
                        <span>Start New Doctor Consultation</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsDoctorPromptOpen(true)}
                      className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                    >
                      <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Start Doctor Visit Session (परामर्श शुरू करें)</span>
                    </button>
                  )}

                  {/* Attendance Prompt Dialog */}
                  {isDoctorPromptOpen && (
                    <div className="p-3 bg-stone-900 text-white rounded-2xl space-y-2 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-stone-100 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Add Priya (Daughter) to consultation?</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsDoctorPromptOpen(false)}
                          className="text-stone-400 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-[10px] text-stone-300 leading-snug">
                        Would you like to bridge Priya on live telephony, or conduct a solo consultation with Dr. Saxena?
                      </p>
                      <div className="grid grid-cols-2 gap-1.5 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setIsDoctorPromptOpen(false);
                            startDoctorConsultation('senior', true);
                          }}
                          className="py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Bridge Priya Live</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsDoctorPromptOpen(false);
                            startDoctorConsultation('senior', false);
                          }}
                          className="py-1.5 px-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <User className="w-3 h-3" />
                          <span>Solo (Auto-Send)</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-base">
                      👩‍💼
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-stone-900 block leading-tight">
                        Priya Sharma
                      </span>
                      <span className="text-[10px] text-stone-500">Daughter (Bengaluru)</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Connected
                  </span>
                </div>
              </div>
            </div>
          ) : activeScreen === 'incoming_call' ? (
            /* Incoming Call Screen (Triggered by Caregiver Approval or Agent Dialing) */
            <div className="flex-1 bg-gradient-to-b from-[#0F1E36] via-[#0A1324] to-stone-950 text-white flex flex-col justify-between p-5 sm:p-6 relative overflow-hidden select-none animate-in fade-in duration-300">
              {/* Top Caller Information */}
              <div className="pt-6 sm:pt-8 text-center space-y-2 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Incoming Caregiver Check-In</span>
                </span>

                <div>
                  <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight pt-1">
                    Saarthi · सारथी
                  </h2>
                  <p className="text-xs text-stone-300 font-medium mt-0.5">
                    Sambandh AI Eldercare Companion
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-mono text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>Jio PSTN +91 98101 23456 · Verified</span>
                </div>
              </div>

              {/* Pulsing Avatar in Center with Sound Wave Rings */}
              <div className="relative flex flex-col items-center justify-center my-auto z-10 py-4">
                {/* Expanding pulse wave rings */}
                <div className="absolute w-52 h-52 rounded-full bg-emerald-500/10 animate-ping duration-1000"></div>
                <div className="absolute w-40 h-40 rounded-full bg-emerald-500/15 animate-pulse"></div>

                {/* Central High-Resolution Companion Avatar */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-500 flex items-center justify-center text-4xl sm:text-5xl shadow-2xl ring-4 ring-emerald-400/30 z-10">
                  🌿
                </div>

                {/* Live Greeting Preview */}
                <div className="mt-4 px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 text-center max-w-[260px]">
                  <p className="text-xs font-serif text-emerald-200 italic leading-snug">
                    "नमस्ते रमेश जी, आज की चाय-नाश्ता हो गया?..."
                  </p>
                </div>
              </div>

              {/* Caregiver Pre-Authorization Note */}
              <div className="z-10 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Authorized by Priya Sharma (Daughter)</span>
                </div>
                <p className="text-[11px] text-stone-300 leading-snug">
                  Routine morning vitals check-in & Awadhi companionship
                </p>
              </div>

              {/* Quick Action Pill Row */}
              <div className="flex items-center justify-center gap-3 pt-3 z-10">
                <button
                  type="button"
                  onClick={() => setIsQuickNoteModalOpen(true)}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-stone-300 text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-3 h-3 text-cyan-300" />
                  <span>Send Quick Note</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemind10m}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 border border-white/15 text-stone-300 text-[11px] font-medium flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
                >
                  <Clock className="w-3 h-3 text-amber-300" />
                  <span>Remind in 10m</span>
                </button>
              </div>

              {/* Primary Call Accept / Decline Action Buttons with High-Quality Tactile Icons */}
              <div className="pt-3 pb-3 flex items-center justify-around gap-6 z-10">
                {/* Decline Button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={handleDeclineCall}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-rose-500 hover:from-rose-600 hover:to-rose-400 active:scale-90 flex items-center justify-center text-white shadow-xl shadow-rose-950/60 transition-all cursor-pointer ring-4 ring-rose-500/25"
                    title="Decline Call / अस्वीकार करें"
                  >
                    <PhoneOff className="w-7 h-7 text-white stroke-[2.2]" />
                  </button>
                  <div className="text-center">
                    <span className="text-xs font-semibold text-rose-300 block">
                      Decline {declineRetryCount > 0 ? `(${declineRetryCount}/3)` : ''}
                    </span>
                    <span className="text-[10px] text-stone-400 font-hindi">
                      अभी नहीं
                    </span>
                  </div>
                </div>

                {/* Accept Button */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      acceptCall();
                      setActiveScreen('call');
                    }}
                    className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 hover:from-emerald-500 hover:to-teal-300 active:scale-90 flex items-center justify-center text-white shadow-2xl shadow-emerald-950/80 transition-all cursor-pointer ring-4 ring-emerald-400/40 animate-bounce duration-1000"
                    title="Accept Call / बात करें"
                  >
                    <PhoneCall className="w-7 h-7 text-white stroke-[2.5]" />
                  </button>
                  <div className="text-center">
                    <span className="text-xs font-bold text-emerald-300 block">
                      Accept
                    </span>
                    <span className="text-[10px] text-emerald-400 font-hindi font-semibold">
                      बात करें
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Note Selection Sheet Overlay */}
              {isQuickNoteModalOpen && (
                <div className="absolute inset-x-3 bottom-4 z-30 bg-stone-900/95 border border-stone-700/80 rounded-3xl p-4 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200 space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Send Quick Note to Priya</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsQuickNoteModalOpen(false)}
                      className="p-1 text-stone-400 hover:text-white rounded-lg cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { emoji: '🥣', text: 'अभी नाश्ता कर रहा हूँ (Having breakfast)' },
                      { emoji: '🌳', text: 'पार्क में वॉक कर रहा हूँ (Morning walk)' },
                      { emoji: '🩺', text: 'क्लीनिक में हूँ (At clinic with doctor)' },
                      { emoji: '😴', text: 'थोड़ा आराम कर रहा हूँ (Resting now)' }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSendQuickNote(item.text)}
                        className="w-full text-left p-2.5 rounded-xl bg-stone-800/80 hover:bg-stone-700 active:scale-[0.98] text-stone-200 text-xs font-medium transition-all flex items-center gap-2.5 cursor-pointer border border-stone-700/50"
                      >
                        <span className="text-base">{item.emoji}</span>
                        <span className="truncate">{item.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Live Call View */
            <div className="flex-1 bg-stone-950 text-white flex flex-col justify-between p-6 relative overflow-hidden">
              {/* Top Call Info */}
              <div className="flex items-center justify-between z-10 pt-4">
                <button
                  onClick={() => setActiveScreen('dashboard')}
                  className="w-10 h-10 rounded-full bg-stone-900/80 border border-stone-700 flex items-center justify-center text-stone-300 hover:text-white transition-colors cursor-pointer"
                  title="Minimize Call"
                >
                  ←
                </button>
                <div className="text-center">
                  <span className="text-xs font-mono text-emerald-400 font-bold block">
                    ● {formatTime(currentStep.callDurationSeconds)}
                  </span>
                  <span className="text-xs text-stone-400 font-serif">Awadhi-Hindi Voice</span>
                </div>
                <div className="w-10 h-10"></div>
              </div>

              {/* Center Voice Avatar & Waveform */}
              <div className="flex flex-col items-center justify-center z-10 space-y-4 my-auto">
                <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-600 to-cyan-500 p-1 shadow-2xl animate-pulse">
                  <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center text-5xl">
                    👴
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <h2 className="text-xl font-serif font-bold text-white">Ramesh Chandra Ji</h2>
                  <p className="text-xs text-emerald-400 font-medium">
                    {activeTtsEngine === 'browser' ? 'Browser Web Speech Active' : 'Gnani.ai Indic Voice Rail Active'}
                  </p>
                </div>

                {/* Subtitle of active turn */}
                <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-3xl max-w-xs text-center text-xs text-stone-200 leading-relaxed shadow-lg">
                  {latestTurn ? latestTurn.content : 'Listening to Papa...'}
                </div>
              </div>

              {/* Bottom Call Action Buttons with High-Quality Tactile Controls */}
              <div className="flex items-center justify-center gap-4 pb-8 z-10">
                {/* Mute Button */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                      isMuted ? 'bg-amber-400 text-stone-950' : 'bg-stone-800 text-white hover:bg-stone-700'
                    }`}
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <span className="text-[10px] text-stone-400 font-medium">
                    {isMuted ? 'Muted' : 'Mute'}
                  </span>
                </div>

                {/* Speaker Button */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    onClick={() => setSpeakerOn(!speakerOn)}
                    className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                      speakerOn ? 'bg-emerald-500 text-stone-950 font-bold' : 'bg-stone-800 text-white hover:bg-stone-700'
                    }`}
                    title="Toggle Speaker"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                  <span className="text-[10px] text-stone-400 font-medium">Speaker</span>
                </div>

                {/* End Call Button */}
                <div className="flex flex-col items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      endCall();
                      setActiveScreen('dashboard');
                    }}
                    className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-500 flex items-center justify-center text-white shadow-xl transition-all cursor-pointer active:scale-95 ring-4 ring-rose-500/20"
                    title="End Call"
                  >
                    <PhoneOff className="w-6 h-6 stroke-[2.2]" />
                  </button>
                  <span className="text-[10px] text-rose-300 font-medium">End Call</span>
                </div>
              </div>
            </div>
          )}

          {/* Floating Bottom Navigation Dock (Inspired directly by reference image) */}
          {activeScreen === 'dashboard' && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full border border-stone-200/90 shadow-lg flex items-center gap-6 text-stone-400">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 text-white text-xs font-bold shadow-xs">
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>
              <button className="hover:text-stone-900 transition-colors">
                <Calendar className="w-4 h-4" />
              </button>
              <button className="hover:text-stone-900 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </button>
              <button className="hover:text-stone-900 transition-colors">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Live Peripheral Telemetry & Caregiver Sync Bridge (Only in full view) */}
      {!standalonePhoneOnly && (
        <div className="max-w-md w-full space-y-4 text-stone-800">
          <div className="bg-white border border-[#E7E2DB] rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DB]">
              <div>
                <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  LIVE TELEMETRY BRIDGE
                </span>
                <h2 className="font-serif font-bold text-lg text-stone-900 mt-1">
                  Elder State & Peripheral Sync
                </h2>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Telemetry sync active"></span>
            </div>

            <div className="space-y-3 text-xs">
              {/* BLE Hardware Devices */}
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E7E2DB] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-700" />
                    <span>Paired Health Peripherals</span>
                  </span>
                  <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    BLE Active
                  </span>
                </div>
                <div className="space-y-1 text-stone-600 text-[11px]">
                  <div className="flex justify-between">
                    <span>Omron HEM-7120 BP Monitor:</span>
                    <strong className="text-stone-800 font-mono">112/80 mmHg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Accu-Chek Active Glucose:</span>
                    <strong className="text-stone-800 font-mono">104 mg/dL</strong>
                  </div>
                </div>
              </div>

              {/* National Stack Bridge */}
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E7E2DB] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>National Health Stack (ABDM)</span>
                  </span>
                  <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    M2/M3 Synced
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Health Locker ID: <strong className="font-mono text-stone-800">ramesh.chandra@abdm</strong>. Encrypted consent artifacts are automatically maintained for Dr. Saxena.
                </p>
              </div>

              {/* Caregiver Link */}
              <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-[#E7E2DB] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <Heart className="w-4 h-4 text-amber-700" />
                    <span>Caregiver Tunnel (Priya)</span>
                  </span>
                  <span className="text-[10px] font-mono font-medium text-stone-600 bg-white px-1.5 py-0.2 rounded border border-stone-200">
                    Telegram Verified
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">
                  Fiduciary auto-refills below ₹4,500 execute autonomously. Any unusual requests trigger step-up authorization cards directly to Bengaluru.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
