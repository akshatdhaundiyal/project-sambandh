import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, ShieldCheck, CheckCircle2, MessageCircle, Sparkles, Activity } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { speakDialogueTurn, stopSpeech } from '../../utils/speechService';
import { GnaniLogo } from '../../data/brandLogos';

interface SampleTurn {
  id: string;
  speaker: 'agent' | 'senior';
  speakerName: string;
  speakerLabelHindi: string;
  voicePersona: string;
  time: string;
  hindiText: string;
  englishText: string;
  acousticWellbeing: {
    tone: string;
    cadence: string;
    moodScore: number;
  };
}

const SAMPLE_TURNS: SampleTurn[] = [
  {
    id: 'turn-1',
    speaker: 'agent',
    speakerName: 'Sambandh (Care Companion)',
    speakerLabelHindi: 'सम्बन्ध साथी',
    voicePersona: 'Gnani Aarohi (Awadhi-Hindi)',
    time: '08:30 AM',
    hindiText: 'प्रणाम रमेश अंकल! आज रोहिणी में हल्की धूप और मीठी ठंड है... बालकनी में अदरक वाली चाय हो गई आपकी?',
    englishText: 'Pranam Ramesh Uncle! Beautiful morning sun in Rohini today... Did you enjoy your ginger tea in the balcony?',
    acousticWellbeing: {
      tone: 'Warm & Respectful',
      cadence: 'Conversational (118 wpm)',
      moodScore: 0.94
    }
  },
  {
    id: 'turn-2',
    speaker: 'senior',
    speakerName: 'Ramesh Chandra (72 yrs)',
    speakerLabelHindi: 'रमेश जी (पिताजी)',
    voicePersona: 'Gnani Deepak (Awadhi-Hindi Senior)',
    time: '08:31 AM',
    hindiText: 'हाँ बेटा, बिल्कुल! अखबार पढ़ते-पढ़ते आज जापानी पार्क के वॉकवे की चर्चा पढ़ रहा था, बढ़िया बन गया है।',
    englishText: 'Yes beta, absolutely! While reading the morning paper I saw the news about the new Japanese Park walkway.',
    acousticWellbeing: {
      tone: 'Cheerful & Clear',
      cadence: 'Lucid (98 wpm)',
      moodScore: 0.92
    }
  },
  {
    id: 'turn-3',
    speaker: 'agent',
    speakerName: 'Sambandh (Care Companion)',
    speakerLabelHindi: 'सम्बन्ध साथी',
    voicePersona: 'Gnani Aarohi (Awadhi-Hindi)',
    time: '08:31 AM',
    hindiText: 'अरे वाह अंकल! और बातों-बातों में ध्यान आया—नाश्ते के बाद वाली लाल गोली (Telma 40) ले ली थी ना आपने?',
    englishText: 'Wonderful Uncle! And just checking in warmly—did you take the red morning tablet (Telma 40) after breakfast?',
    acousticWellbeing: {
      tone: 'Affectionate Nudge',
      cadence: 'Conversational',
      moodScore: 0.95
    }
  },
  {
    id: 'turn-4',
    speaker: 'senior',
    speakerName: 'Ramesh Chandra (72 yrs)',
    speakerLabelHindi: 'रमेश जी (पिताजी)',
    voicePersona: 'Gnani Deepak (Awadhi-Hindi Senior)',
    time: '08:32 AM',
    hindiText: 'हाँ बेटा, पोहा खाकर तुरंत गर्म पानी से ले ली थी। अब तो 4-5 गोलियां ही बची हैं डिब्बी में।',
    englishText: 'Yes beta, took it right after poha with warm water. Only 4-5 tablets left in the bottle now.',
    acousticWellbeing: {
      tone: 'Relaxed & Reassured',
      cadence: 'Calm',
      moodScore: 0.91
    }
  },
  {
    id: 'turn-5',
    speaker: 'agent',
    speakerName: 'Sambandh (Care Companion)',
    speakerLabelHindi: 'सम्बन्ध साथी',
    voicePersona: 'Gnani Aarohi (Awadhi-Hindi)',
    time: '08:32 AM',
    hindiText: 'आप चिंता मत कीजिए अंकल, रोहन बेटा के अप्रूव्ड बजट से नेटमेड्स से नई डिब्बी परसों सुबह तक आपके घर पहुँच जाएगी!',
    englishText: 'Do not worry Uncle! From Rohan’s pre-approved budget, Netmeds will deliver a fresh bottle to your door by day after tomorrow morning.',
    acousticWellbeing: {
      tone: 'Reassuring',
      cadence: 'Smooth',
      moodScore: 0.96
    }
  }
];

export const InteractiveVoicePlayer: React.FC = () => {
  const { launchDemoScenario } = useTelemetry();
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeTurnIndex, setActiveTurnIndex] = useState<number>(0);
  const [showEnglishTranslation, setShowEnglishTranslation] = useState<boolean>(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Play audio turns via Gnani Speech Synthesis Service
  useEffect(() => {
    if (!isPlaying) {
      stopSpeech();
      if (timerRef.current) clearTimeout(timerRef.current);
      return;
    }

    const currentTurn = SAMPLE_TURNS[activeTurnIndex];
    if (!currentTurn) {
      setIsPlaying(false);
      return;
    }

    // Trigger speech via Gnani Indic voice rail
    speakDialogueTurn(currentTurn.hindiText, currentTurn.speaker, 'gnani', {
      onEnd: () => {
        if (activeTurnIndex < SAMPLE_TURNS.length - 1) {
          timerRef.current = setTimeout(() => {
            setActiveTurnIndex((prev) => prev + 1);
          }, 350);
        } else {
          setIsPlaying(false);
        }
      },
      onError: () => {
        // Safe fallback timer
        timerRef.current = setTimeout(() => {
          if (activeTurnIndex < SAMPLE_TURNS.length - 1) {
            setActiveTurnIndex((prev) => prev + 1);
          } else {
            setIsPlaying(false);
          }
        }, 4500);
      }
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, activeTurnIndex]);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeech();
    } else {
      if (activeTurnIndex >= SAMPLE_TURNS.length - 1) {
        setActiveTurnIndex(0);
      }
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    stopSpeech();
    setActiveTurnIndex(0);
  };

  const currentTurn = SAMPLE_TURNS[activeTurnIndex];

  return (
    <div className="w-full bg-white rounded-3xl border border-[#E7E2DB] shadow-md overflow-hidden transition-all">
      {/* Top Banner: Voice Player Header */}
      <div className="bg-[#FAF4EC] px-4 sm:px-6 py-3 border-b border-[#E7E2DB] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <GnaniLogo className="w-4 h-4 rounded-md" />
          <span className="text-xs font-semibold text-stone-800 font-sans">
            Gnani.ai Indic Voice Rail · Awadhi-Hindi
          </span>
          <span className="text-[11px] text-stone-500 font-normal hidden sm:inline">
            · 08:30 AM Morning Companion Call
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowEnglishTranslation(!showEnglishTranslation)}
            className="text-[11px] font-medium text-stone-600 hover:text-stone-900 bg-white px-2.5 py-1 rounded-lg border border-stone-200 transition-all cursor-pointer"
          >
            {showEnglishTranslation ? 'Hindi only' : 'English translation'}
          </button>
        </div>
      </div>

      {/* Main Split Grid: Left = Spoken Dialogue & Waveform, Right = Caregiver WhatsApp Update */}
      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Spoken Hindi Dialogue with Audio Waveform */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {/* Active Speaker Card */}
          <div className="bg-[#FAF8F5] p-4 sm:p-5 rounded-2xl border border-[#E7E2DB] relative space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold shadow-2xs ${
                    currentTurn.speaker === 'agent'
                      ? 'bg-amber-800 text-white'
                      : 'bg-teal-800 text-white'
                  }`}
                >
                  {currentTurn.speaker === 'agent' ? 'स' : 'र'}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-stone-900 leading-tight">
                    {currentTurn.speakerName}{' '}
                    <span className="text-xs font-normal text-stone-500">({currentTurn.speakerLabelHindi})</span>
                  </h4>
                  <span className="text-[11px] text-stone-500 font-mono">
                    Model: {currentTurn.voicePersona}
                  </span>
                </div>
              </div>

              {/* Turn Step */}
              <span className="text-[11px] font-mono text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                Turn {activeTurnIndex + 1} / {SAMPLE_TURNS.length}
              </span>
            </div>

            {/* Hindi Spoken Dialogue */}
            <p className="font-serif text-base sm:text-lg text-stone-900 leading-relaxed min-h-[58px]">
              "{currentTurn.hindiText}"
            </p>

            {/* English Translation Subtitle */}
            {showEnglishTranslation && (
              <p className="text-xs sm:text-sm text-stone-600 italic border-t border-stone-200 pt-2">
                "{currentTurn.englishText}"
              </p>
            )}

            {/* Gnani Acoustic Wellbeing & Sound Wave Indicator */}
            <div className="pt-3 border-t border-[#E7E2DB] flex flex-wrap items-center justify-between gap-2">
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
                      height: isPlaying ? `${Math.max(6, height * (1 + (i % 3) * 0.3))}px` : '6px',
                      animationDelay: `${i * 0.08}s`
                    }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-2 text-[11px] text-stone-600">
                <span className="flex items-center gap-1 font-medium">
                  <Activity className="w-3.5 h-3.5 text-teal-700" />
                  <span>Tone: {currentTurn.acousticWellbeing.tone}</span>
                </span>
                <span className="text-stone-300">·</span>
                <span>Mood: {Math.round(currentTurn.acousticWellbeing.moodScore * 100)}%</span>
              </div>
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={handleTogglePlay}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm shadow-xs transition-all cursor-pointer ${
                isPlaying
                  ? 'bg-amber-900 hover:bg-amber-950 text-white'
                  : 'bg-[#0057E7] hover:bg-[#0047C4] text-white'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isPlaying ? 'Pause conversation' : 'Listen to morning call'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition-all cursor-pointer"
              title="Replay from start"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL')}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 font-medium text-xs transition-all cursor-pointer ml-auto"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Open in live console</span>
            </button>
          </div>
        </div>

        {/* Right Column: Caregiver WhatsApp Update with Positive Reinforcement */}
        <div className="lg:col-span-5 bg-[#EFEAE2] p-4 rounded-2xl border border-[#D5CFC6] flex flex-col justify-between relative shadow-inner">
          <div className="space-y-2.5">
            {/* WhatsApp Header Mock */}
            <div className="flex items-center gap-2 pb-2 border-b border-[#D5CFC6]">
              <div className="w-6 h-6 rounded-full bg-[#25D366] flex items-center justify-center text-white text-xs font-bold">
                <MessageCircle className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="text-xs font-semibold text-stone-900 truncate">Jio × Sambandh Care</h5>
                <span className="text-[10px] text-stone-600 block">Daily briefing for Rohan (Son)</span>
              </div>
              <span className="text-[10px] font-mono text-stone-500">08:33 AM</span>
            </div>

            {/* WhatsApp Message Bubble */}
            <div className="bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between border-b border-stone-100 pb-1">
                <span className="font-semibold text-teal-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
                  <span>Morning check-in complete</span>
                </span>
                <span className="text-[10px] text-stone-400">08:33 AM</span>
              </div>

              <div className="space-y-1.5 text-stone-700 text-[11px] leading-relaxed">
                <p>
                  <strong>Ramesh Chandra (Papa):</strong> Cheerful mood. Enjoyed ginger tea in Rohini balcony, read about the new park walkway.
                </p>

                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    <strong>Medicine Confirmed:</strong> Telma 40 taken with warm water post-breakfast.
                  </span>
                </div>

                <div className="p-2 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                  <p className="font-medium">Medicine Reorder (4 days left):</p>
                  <p className="text-[10px] text-amber-900 mt-0.5">
                    Netmeds refill (₹680) scheduled via Pine Labs under your ₹4,500 monthly limit. Delhivery arrives in 48h.
                  </p>
                </div>
              </div>

              {/* Positive Reinforcement Line directly from document */}
              <div className="p-2 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-700 italic">
                "Because of you, Papa won't miss a single dose this month."
              </div>

              <div className="pt-1 flex items-center justify-between text-[10px] text-stone-400">
                <span>Confided secrets stay private</span>
                <span className="text-emerald-700 font-semibold">✓✓ Delivered</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-[#D5CFC6] flex items-center justify-between text-[11px] text-stone-600">
            <span>Fills gaps in family calls</span>
            <span className="font-semibold text-stone-900">Never replaces them</span>
          </div>
        </div>
      </div>
    </div>
  );
};
