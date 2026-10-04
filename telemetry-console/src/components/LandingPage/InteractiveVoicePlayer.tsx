import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, ShieldCheck, CheckCircle2, MessageCircle, Sparkles, PhoneCall } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

interface SampleTurn {
  id: string;
  speaker: 'agent' | 'elder';
  speakerName: string;
  speakerLabelHindi: string;
  time: string;
  hindiText: string;
  englishText: string;
  durationMs: number;
}

const SAMPLE_TURNS: SampleTurn[] = [
  {
    id: 'turn-1',
    speaker: 'agent',
    speakerName: 'Sambandh (Care Companion)',
    speakerLabelHindi: 'सम्बन्ध साथी',
    time: '08:30 AM',
    hindiText: 'प्रणाम रमेश अंकल! आज रोहिणी में हल्की धूप और मीठी ठंड है... बालकनी में अदरक वाली चाय हो गई आपकी?',
    englishText: 'Pranam Ramesh Uncle! Beautiful morning sun in Rohini today... Did you enjoy your ginger tea in the balcony?',
    durationMs: 4500
  },
  {
    id: 'turn-2',
    speaker: 'elder',
    speakerName: 'Ramesh Chandra (72 yrs)',
    speakerLabelHindi: 'रमेश जी (पिताजी)',
    time: '08:31 AM',
    hindiText: 'हाँ बेटा, बिल्कुल! अखबार पढ़ते-पढ़ते आज जापानी पार्क के वॉकवे की चर्चा पढ़ रहा था, बढ़िया बन गया है।',
    englishText: 'Yes beta, absolutely! While reading the morning paper I saw the news about the new Japanese Park walkway.',
    durationMs: 4800
  },
  {
    id: 'turn-3',
    speaker: 'agent',
    speakerName: 'Sambandh (Care Companion)',
    speakerLabelHindi: 'सम्बन्ध साथी',
    time: '08:31 AM',
    hindiText: 'अरे वाह अंकल! और बातों-बातों में ध्यान आया—नाश्ते के बाद वाली लाल गोली (Telma 40) ले ली थी ना आपने?',
    englishText: 'Wonderful Uncle! And just checking in warmly—did you take the red morning tablet (Telma 40) after breakfast?',
    durationMs: 4200
  },
  {
    id: 'turn-4',
    speaker: 'elder',
    speakerName: 'Ramesh Chandra (72 yrs)',
    speakerLabelHindi: 'रमेश जी (पिताजी)',
    time: '08:32 AM',
    hindiText: 'हाँ बेटा, पोहा खाकर तुरंत गर्म पानी से ले ली थी। अब तो 4-5 गोलियां ही बची हैं डिब्बी में।',
    englishText: 'Yes beta, took it right after poha with warm water. Only 4-5 tablets left in the bottle now.',
    durationMs: 4400
  },
  {
    id: 'turn-5',
    speaker: 'agent',
    speakerName: 'Sambandh (Care Companion)',
    speakerLabelHindi: 'सम्बन्ध साथी',
    time: '08:32 AM',
    hindiText: 'आप चिंता मत कीजिए अंकल, रोहन बेटा के प्री-अप्रूव्ड बजट से नेटमेड्स से नई डिब्बी परसों सुबह तक आपके घर पहुँच जाएगी!',
    englishText: 'Do not worry Uncle! From Rohan’s pre-approved budget, Netmeds will deliver a fresh bottle to your door by day after tomorrow morning.',
    durationMs: 5000
  }
];

export const InteractiveVoicePlayer: React.FC = () => {
  const { launchDemoScenario } = useTelemetry();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTurnIndex, setActiveTurnIndex] = useState<number>(0);
  const [showEnglishTranslation, setShowEnglishTranslation] = useState<boolean>(false);
  const [notificationDispatched, setNotificationDispatched] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Play audio turns via Web Speech API or simulated timer
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      return;
    }

    const currentTurn = SAMPLE_TURNS[activeTurnIndex];
    if (!currentTurn) {
      setIsPlaying(false);
      return;
    }

    // Trigger WhatsApp notification at turn 3+
    if (activeTurnIndex >= 3) {
      setNotificationDispatched(true);
    }

    // Try Hindi Speech Synthesis if available in browser
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentTurn.hindiText);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.95;
      utterance.pitch = currentTurn.speaker === 'agent' ? 1.05 : 0.85;

      const voices = window.speechSynthesis.getVoices();
      const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Hindi') || v.name.includes('India'));
      if (hindiVoice) {
        utterance.voice = hindiVoice;
      }

      utterance.onend = () => {
        if (activeTurnIndex < SAMPLE_TURNS.length - 1) {
          timerRef.current = setTimeout(() => {
            setActiveTurnIndex(prev => prev + 1);
          }, 400);
        } else {
          setIsPlaying(false);
        }
      };

      utterance.onerror = () => {
        // Fallback timer if speech synthesis fails or is blocked
        timerRef.current = setTimeout(() => {
          if (activeTurnIndex < SAMPLE_TURNS.length - 1) {
            setActiveTurnIndex(prev => prev + 1);
          } else {
            setIsPlaying(false);
          }
        }, currentTurn.durationMs);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback timer
      timerRef.current = setTimeout(() => {
        if (activeTurnIndex < SAMPLE_TURNS.length - 1) {
          setActiveTurnIndex(prev => prev + 1);
        } else {
          setIsPlaying(false);
        }
      }, currentTurn.durationMs);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, activeTurnIndex]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      if (activeTurnIndex >= SAMPLE_TURNS.length - 1) {
        setActiveTurnIndex(0);
        setNotificationDispatched(false);
      }
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setActiveTurnIndex(0);
    setNotificationDispatched(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const currentTurn = SAMPLE_TURNS[activeTurnIndex];

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E7E2DB] shadow-lg overflow-hidden transition-all">
      {/* Top Banner: Voice Player Header */}
      <div className="bg-[#FAF4EC] px-4 sm:px-6 py-3 border-b border-[#E7E2DB] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-amber-950 uppercase tracking-wider font-sans">
            Live Voice Interaction Preview
          </span>
          <span className="text-[11px] text-stone-500 font-medium hidden sm:inline">
            · 08:30 AM Scheduled PSTN Call
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowEnglishTranslation(!showEnglishTranslation)}
            className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200 transition-all cursor-pointer"
          >
            {showEnglishTranslation ? 'Show Hindi Only' : 'English Subtitles'}
          </button>
        </div>
      </div>

      {/* Main Split Grid: Left = Spoken Dialogue & Waveform, Right = Son\'s WhatsApp Briefing */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Spoken Hindi Dialogue with Audio Waveform */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Active Speaker Card */}
          <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#E7E2DB] relative">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shadow-xs ${
                    currentTurn.speaker === 'agent'
                      ? 'bg-amber-800 text-white'
                      : 'bg-teal-800 text-white'
                  }`}
                >
                  {currentTurn.speaker === 'agent' ? 'स' : 'र'}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-stone-900 leading-tight flex items-center gap-1.5">
                    <span>{currentTurn.speakerName}</span>
                    <span className="text-xs font-normal text-stone-500">({currentTurn.speakerLabelHindi})</span>
                  </h4>
                  <span className="text-[11px] text-stone-500">{currentTurn.time} · Rohini Sector 8</span>
                </div>
              </div>

              {/* Spoken Turn Indicator */}
              <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                Turn {activeTurnIndex + 1} of {SAMPLE_TURNS.length}
              </span>
            </div>

            {/* Hindi Spoken Dialogue */}
            <p className="font-serif text-base sm:text-lg font-medium text-stone-900 leading-relaxed tracking-tight min-h-[58px]">
              "{currentTurn.hindiText}"
            </p>

            {/* Optional English Subtitle */}
            {showEnglishTranslation && (
              <p className="mt-2 text-xs sm:text-sm text-stone-600 italic border-t border-stone-200/80 pt-2">
                Translation: "{currentTurn.englishText}"
              </p>
            )}

            {/* Dynamic Sound Wave Animation */}
            <div className="mt-4 pt-3 border-t border-[#E7E2DB] flex items-center justify-between">
              <div className="flex items-center gap-1.5 h-6">
                {[12, 24, 16, 32, 20, 28, 14, 22, 30, 18, 26, 12, 20, 28, 15].map((height, i) => (
                  <span
                    key={i}
                    className={`w-1 rounded-full transition-all duration-200 ${
                      isPlaying
                        ? 'bg-amber-700 animate-wave'
                        : 'bg-stone-300'
                    }`}
                    style={{
                      height: isPlaying ? `${Math.max(6, (height * (1 + (i % 3) * 0.3)))}px` : '6px',
                      animationDelay: `${(i * 0.08)}s`
                    }}
                  />
                ))}
              </div>
              <span className="text-xs font-mono font-medium text-stone-500 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-amber-800" />
                <span>{isPlaying ? 'Indic Voice Live' : 'Paused'}</span>
              </span>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm shadow-sm transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-900 hover:bg-amber-950 text-white'
                  : 'bg-[#0057E7] hover:bg-[#0047C4] text-white shadow-md'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? 'Pause Sample Call' : 'Listen to Papa’s Morning Call'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-all cursor-pointer"
              title="Replay from start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl bg-white hover:bg-stone-50 text-stone-900 border border-[#DFDAD1] font-semibold text-xs transition-all cursor-pointer ml-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Open in Live Telemetry Console ⚡</span>
            </button>
          </div>
        </div>

        {/* Right Column: Live Caregiver WhatsApp Briefing Mockup */}
        <div className="lg:col-span-5 bg-[#EFEAE2] p-4 rounded-2xl border border-[#D5CFC6] flex flex-col justify-between relative shadow-inner">
          <div>
            {/* WhatsApp Header Mock */}
            <div className="flex items-center gap-2 pb-2.5 border-b border-[#D5CFC6] mb-3">
              <div className="w-7 h-7 rounded-full bg-[#25D366] flex items-center justify-center text-white text-xs font-bold shadow-2xs">
                <MessageCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-stone-900 truncate">Jio Sambandh Care Bot</h5>
                <span className="text-[10px] text-stone-600 block">Instant Family Briefing for Rohan (Son)</span>
              </div>
              <span className="text-[10px] font-mono text-stone-500">08:33 AM</span>
            </div>

            {/* WhatsApp Message Bubble */}
            <div className="bg-white p-3.5 rounded-2xl rounded-tl-xs shadow-xs border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                <span className="font-bold text-teal-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span>Morning Check-in Complete</span>
                </span>
                <span className="text-[10px] text-stone-400">08:33 AM</span>
              </div>

              <div className="space-y-1.5 text-stone-700 text-[11px] leading-relaxed">
                <p>
                  <strong>👴 Ramesh Chandra:</strong> Cheerful & active. Enjoying morning sun in Rohini balcony.
                </p>
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Pill Confirmed:</strong> Telma 40 (Red tablet) taken with water post-breakfast.
                  </span>
                </div>
                <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                  <p className="font-semibold">📦 Autonomous Refill Alert:</p>
                  <p className="text-[10px] text-amber-900 mt-0.5">
                    4 days stock remaining. Netmeds order (₹680) auto-dispatched under your pre-set ₹4,500 limit.
                  </p>
                </div>
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px] text-stone-400">
                <span>DPDP Act 2023 Encrypted</span>
                <span className="text-emerald-700 font-semibold">✓✓ Read by Rohan</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#D5CFC6] flex items-center justify-between text-[11px] text-stone-600">
            <span>No app required for Ramesh Uncle</span>
            <span className="font-bold text-amber-950">100% Peace of Mind</span>
          </div>
        </div>
      </div>
    </div>
  );
};
