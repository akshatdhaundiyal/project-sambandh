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
  ArrowRight
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
    endCall,
    callDurationSeconds
  } = useTelemetry();
  const profile = activeScenario.initialSeniorProfile;
  const [activeScreen, setActiveScreen] = useState<'dashboard' | 'call'>('dashboard');
  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);

  // Sync activeScreen with live callStatus
  React.useEffect(() => {
    if (callStatus === 'active') {
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
        <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 w-28 h-5 sm:h-6 bg-black rounded-full z-50 flex items-center justify-between px-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold">08:30</span>
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

              {/* Main Question Header */}
              <div className="pt-1">
                <h1 className="text-2xl font-serif font-bold text-stone-900 leading-snug tracking-tight">
                  How are you feeling right now today?
                </h1>
              </div>

              {/* Search Bar */}
              <div className="bg-white rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 border border-stone-200/80 shadow-xs text-stone-400 text-xs">
                <Search className="w-4 h-4 text-stone-400" />
                <span>Search daily vitals, medicines, advice...</span>
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
                    Pari is ready to check in on your morning vitals, breakfast, and today's railway stories.
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
                    <span>Connect Morning Call with Pari</span>
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

                <div className="bg-white rounded-2xl p-3 border border-stone-200/80 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-cyan-100 flex items-center justify-center text-base">
                      👨‍⚕️
                    </div>
                    <div>
                      <span className="text-xs font-extrabold text-stone-900 block leading-tight">
                        Dr. Arvind Saxena
                      </span>
                      <span className="text-[10px] text-stone-500">Cardiology Specialist</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Online
                  </span>
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
          ) : (
            /* Live Call View (Right screen in reference image) */
            <div className="flex-1 bg-stone-950 text-white flex flex-col justify-between p-6 relative overflow-hidden">
              {/* Top Call Info */}
              <div className="flex items-center justify-between z-10 pt-4">
                <button
                  onClick={() => setActiveScreen('dashboard')}
                  className="w-10 h-10 rounded-full bg-stone-900/80 border border-stone-700 flex items-center justify-center text-stone-300"
                >
                  ←
                </button>
                <div className="text-center">
                  <span className="text-xs font-mono text-emerald-400 font-bold block">
                    ● {formatTime(currentStep.callDurationSeconds)}
                  </span>
                  <span className="text-xs text-stone-400">Awadhi-Hindi Call</span>
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
                  <h2 className="text-xl font-black text-white">Ramesh Chandra Ji</h2>
                  <p className="text-xs text-emerald-400 font-medium">WhisperFlo Neural Telephony Active</p>
                </div>

                {/* Subtitle of active turn */}
                <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-3xl max-w-xs text-center text-xs text-stone-200 leading-relaxed shadow-lg">
                  {latestTurn ? latestTurn.content : 'Listening to Papa...'}
                </div>
              </div>

              {/* Bottom Call Action Buttons (Directly from reference image) */}
              <div className="flex items-center justify-center gap-4 pb-8 z-10">
                {/* Mute Button */}
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`w-13 h-13 rounded-full flex items-center justify-center text-stone-900 transition-all ${
                    isMuted ? 'bg-amber-400' : 'bg-white'
                  }`}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                {/* Video Button */}
                <button
                  className="w-13 h-13 rounded-full bg-white flex items-center justify-center text-stone-900"
                >
                  <Video className="w-5 h-5" />
                </button>

                {/* Speaker Button */}
                <button
                  onClick={() => setSpeakerOn(!speakerOn)}
                  className={`w-13 h-13 rounded-full flex items-center justify-center text-stone-900 transition-all ${
                    speakerOn ? 'bg-emerald-400' : 'bg-white'
                  }`}
                >
                  <Volume2 className="w-5 h-5" />
                </button>

                {/* End Call Button in Soft Coral/Red */}
                <button
                  type="button"
                  onClick={() => {
                    endCall();
                    setActiveScreen('dashboard');
                  }}
                  className="w-13 h-13 rounded-full bg-rose-600 hover:bg-rose-700 flex items-center justify-center text-white shadow-lg transition-colors cursor-pointer active:scale-95"
                  title="End Call"
                >
                  <PhoneOff className="w-5 h-5" />
                </button>
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
