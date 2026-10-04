import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  Heart,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Pill,
  Truck,
  CreditCard,
  Smile,
  ShieldCheck,
  Play,
  Database
} from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { fetchCallSummaries } from '../../services/healthLockerService';

interface CallSummaryItem {
  id: string;
  date: string;
  time: string;
  duration: string;
  callType: string;
  topicTitle: string;
  sentiment: 'CHEERFUL' | 'CALM' | 'ANXIOUS' | 'STABLE';
  sentimentScore: number;
  adherenceStatus: string;
  keyTopics: string;
  highlights: string[];
  audioTranscript?: string;
  audioDuration?: string;
  fiduciaryOrLogistics?: string;
  vitalsSnippet?: string;
}

interface CallSummaryHistorySheetProps {
  isOpen: boolean;
  onClose: () => void;
  onPlayAudioSnippet?: (text: string) => void;
}

const FALLBACK_SUMMARIES: CallSummaryItem[] = [
    {
      id: 'summary-today',
      date: 'Today, Oct 03, 2026',
      time: '08:34 AM IST',
      duration: '4m 12s',
      callType: 'Morning Routine Telephony Check-in',
      topicTitle: 'Railway Signal Lore & Telma-40 Adherence',
      sentiment: 'CHEERFUL',
      sentimentScore: 94,
      adherenceStatus: 'Telma-40 Taken with fresh water ✅',
      keyTopics: 'Northern Railway 1982 mechanical interlocking memories, tea in balcony, pill stock check',
      highlights: [
        'Confirmed taking morning BP medication (Telma-40) post-breakfast.',
        'Reminisced about Delhi Division mechanical lever interlocking days.',
        'Pill runway low (4 days left): Pine Labs auto-debit of ₹840 executed.',
        'Delhivery CMU delivery DLV-98234-DEL scheduled for Today 4:00 PM.'
      ],
      audioTranscript:
        'बेटा, 1982 में जब हम दिल्ली डिवीजन में सिग्नल इंस्पेक्टर थे... उस समय मैकेनिकल लीवर फ्रेम हुआ करता था। हाथ से खींचना पड़ता था भारी लीवर।',
      audioDuration: '0:42',
      fiduciaryOrLogistics: 'Pine Labs ₹840 debited · Delhivery ETA 4:00 PM',
      vitalsSnippet: 'BP: 112/80 mmHg · Glucose: 104 mg/dL'
    },
    {
      id: 'summary-oct02',
      date: 'Yesterday, Oct 02, 2026',
      time: '08:31 AM IST',
      duration: '3m 48s',
      callType: 'Morning Routine Telephony Check-in',
      topicTitle: 'Gandhi Jayanti Walk & Knee Stiffness Review',
      sentiment: 'CALM',
      sentimentScore: 88,
      adherenceStatus: 'Telma-40 confirmed taken; Glycomet taken at night',
      keyTopics: 'Morning walk in Japanese Park with Sharma Ji, knee joint stiffness, warm water compress',
      highlights: [
        'Papa completed 25-minute gentle walk in Sector 8 Japanese Park.',
        'Reported mild bilateral knee stiffness; Sambandh suggested warm compress.',
        'No emergency or chest heaviness; appetite reported normal.'
      ],
      audioTranscript:
        'आज गांधी जयंती पर जापानी पार्क में काफी रौनक थी। थोड़ा घुटने में भारीपन था तो बेंच पर बैठ गए थे थोड़ी देर।',
      audioDuration: '0:35',
      vitalsSnippet: 'BP: 118/82 mmHg · Pulse: 72 bpm'
    },
    {
      id: 'summary-oct01',
      date: 'Wednesday, Oct 01, 2026',
      time: '08:30 AM IST',
      duration: '5m 05s',
      callType: 'Morning Routine Telephony Check-in',
      topicTitle: 'Pooja Preparations & Mohammed Rafi Ghazals',
      sentiment: 'CHEERFUL',
      sentimentScore: 96,
      adherenceStatus: 'Full adherence confirmed across all doses',
      keyTopics: 'Talat Mahmood and Rafi songs on Vividh Bharati, fresh marigold flowers delivered',
      highlights: [
        'Listening to old radio broadcast; expressed deep joy and nostalgia.',
        'Quick commerce marigold pooja flowers confirmed received at 07:00 AM.',
        'Blood sugar stable post-breakfast.'
      ],
      audioTranscript:
        'विविध भारती पर आज तलत महमूद का गाना आ रहा था... "जलते हैं जिसके लिए"। मन एकदम खुश हो गया सुबह-सुबह।',
      audioDuration: '0:48',
      fiduciaryOrLogistics: 'Pooja Basket ₹210 auto-settled via Plural',
      vitalsSnippet: 'BP: 114/78 mmHg · Sugar: 110 mg/dL'
    },
    {
      id: 'summary-sep30',
      date: 'Tuesday, Sep 30, 2026',
      time: '08:35 AM IST',
      duration: '3m 15s',
      callType: 'Morning Routine Telephony Check-in',
      topicTitle: 'Rohini Weather & Low-Salt Diet Compliance',
      sentiment: 'CALM',
      sentimentScore: 85,
      adherenceStatus: 'Morning BP dose confirmed taken with fresh water',
      keyTopics: 'Autumn breeze in Delhi, avoiding salty pickle as advised by Dr. Saxena',
      highlights: [
        'Confirmed staying away from pickle and papad as per low-salt protocol.',
        'Slept soundly for 6.5 hours; waking up rested.',
        'Reminded to drink warm water throughout the day.'
      ],
      audioTranscript:
        'आजकल सुबह-सुबह बालकनी में अच्छी हवा चलती है। अचार तो हमने बिल्कुल छोड़ दिया है जैसा डॉक्टर साहब ने कहा था।',
      audioDuration: '0:30',
      vitalsSnippet: 'BP: 116/80 mmHg · Creatinine: 1.10 mg/dL'
    },
    {
      id: 'summary-sep29',
      date: 'Monday, Sep 29, 2026',
      time: '08:32 AM IST',
      duration: '4m 20s',
      callType: 'Morning Routine Telephony Check-in',
      topicTitle: 'Weekly Prescription Runway & Doctor Consultation',
      sentiment: 'STABLE',
      sentimentScore: 90,
      adherenceStatus: 'Weekly pill box loaded and verified',
      keyTopics: 'Dr. Saxena clinic review slip, pill runway count, pension credit',
      highlights: [
        'Dr. Saxena review slip verified on ABDM Health Locker.',
        'Northern Railway pension credit confirmed in SBI Rohini branch.',
        'Rohan notified on Telegram of stable weekly trajectory.'
      ],
      audioTranscript:
        'पेंशन खाते में समय से आ गई है बेटा। कोई चिंता की बात नहीं है, सब बढ़िया चल रहा है।',
      audioDuration: '0:38',
      vitalsSnippet: 'BP: 110/78 mmHg · Glucose: 102 mg/dL'
    }
];

export const CallSummaryHistorySheet: React.FC<CallSummaryHistorySheetProps> = ({
  isOpen,
  onClose,
  onPlayAudioSnippet
}) => {
  const { speakTurn, latestCallSummary } = useTelemetry();
  const [selectedSummaryId, setSelectedSummaryId] = useState<string>('summary-today');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [summaries, setSummaries] = useState<CallSummaryItem[]>(FALLBACK_SUMMARIES);
  const [isFromPostgres, setIsFromPostgres] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetchCallSummaries('SENIOR_RAMESH_001')
        .then((rows) => {
          if (rows && rows.length > 0) {
            const list = latestCallSummary
              ? [latestCallSummary as CallSummaryItem, ...rows.filter((r: any) => r.id !== latestCallSummary.id)]
              : (rows as CallSummaryItem[]);
            setSummaries(list);
            setIsFromPostgres(true);
          } else if (latestCallSummary) {
            setSummaries([latestCallSummary as CallSummaryItem, ...FALLBACK_SUMMARIES.filter(s => s.id !== latestCallSummary.id)]);
          }
        })
        .catch((err) => {
          console.debug('Failed to fetch call summaries from PostgreSQL:', err);
          if (latestCallSummary) {
            setSummaries([latestCallSummary as CallSummaryItem, ...FALLBACK_SUMMARIES.filter(s => s.id !== latestCallSummary.id)]);
          }
        });
    }
  }, [isOpen, latestCallSummary]);

  if (!isOpen) return null;

  const handlePlayAudio = (summary: CallSummaryItem) => {
    if (playingId === summary.id) {
      window.speechSynthesis?.cancel();
      setPlayingId(null);
    } else {
      setPlayingId(summary.id);
      if (summary.audioTranscript) {
        speakTurn({
          id: `history-audio-${summary.id}`,
          timestamp: summary.time,
          speaker: 'senior',
          lane: 'lane1',
          speakerLabel: 'Ramesh Chandra (Papa)',
          content: summary.audioTranscript
        });
      }
      setTimeout(() => {
        setPlayingId(null);
      }, 7000);
    }
  };

  const getSentimentPill = (sentiment: CallSummaryItem['sentiment'], score: number) => {
    switch (sentiment) {
      case 'CHEERFUL':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
            <span>🌿</span>
            <span>Cheerful ({score}%)</span>
          </span>
        );
      case 'CALM':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1">
            <span>☕</span>
            <span>Calm ({score}%)</span>
          </span>
        );
      case 'ANXIOUS':
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
            <span>⚠️</span>
            <span>Anxious ({score}%)</span>
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200 flex items-center gap-1">
            <span>⚖️</span>
            <span>Stable ({score}%)</span>
          </span>
        );
    }
  };

  return (
    <div className="absolute inset-0 z-50 bg-[#FAF8F5] flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
      {/* Top Header Bar */}
      <div className="pt-3 px-4 pb-2.5 bg-white border-b border-[#E7E2DB] flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800">
            <Calendar className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-xs sm:text-sm text-stone-900 leading-tight">
              Call Summaries & Emotional History
            </h3>
            <p className="text-[10px] text-stone-500 font-mono flex items-center gap-1.5">
              <span>Ramesh Chandra Ji · 5-Day Archive</span>
              {isFromPostgres && (
                <span className="text-[9px] text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200 font-bold flex items-center gap-0.5">
                  <Database className="w-2.5 h-2.5" />
                  <span>PGSQL Live</span>
                </span>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors cursor-pointer"
          title="Close Call Summaries History"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Sub-Header Notice */}
      <div className="px-4 py-2 bg-[#F5EFE6] border-b border-[#E7E2DB] flex items-center justify-between text-[11px] text-stone-700 shrink-0">
        <span className="flex items-center gap-1 font-medium">
          <Clock className="w-3.5 h-3.5 text-stone-500" />
          <span>Past 5 Telephony Check-Ins</span>
        </span>
        <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          100% Adherence Trend
        </span>
      </div>

      {/* Scrollable List of Historical Call Summaries */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
        {summaries.map((item, index) => {
          const isSelected = selectedSummaryId === item.id;
          const isPlaying = playingId === item.id;
          const isToday = index === 0;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedSummaryId(item.id)}
              className={`rounded-2xl p-3.5 border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-teal-500 shadow-sm ring-2 ring-teal-500/20'
                  : 'bg-white hover:bg-stone-50/80 border-stone-200 shadow-2xs'
              }`}
            >
              {/* Date, Time & Sentiment Row */}
              <div className="flex items-center justify-between pb-2 border-b border-stone-100 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-xs text-stone-900">
                    {item.date}
                  </span>
                  {isToday && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-teal-100 text-teal-900 border border-teal-300">
                      LATEST
                    </span>
                  )}
                </div>
                {getSentimentPill(item.sentiment, item.sentimentScore)}
              </div>

              {/* Title & Duration */}
              <div className="space-y-1 mb-2">
                <h4 className="font-serif font-bold text-xs text-stone-900 leading-snug">
                  {item.topicTitle}
                </h4>
                <div className="flex items-center gap-2 text-[10px] text-stone-500 font-mono">
                  <span>⏰ {item.time}</span>
                  <span>·</span>
                  <span>⏱️ {item.duration}</span>
                  <span>·</span>
                  <span className="text-teal-700 font-medium">Jio PSTN</span>
                </div>
              </div>

              {/* Medication Adherence Pill */}
              <div className="bg-[#FAF8F5] p-2 rounded-xl border border-stone-200/80 text-[11px] text-stone-800 space-y-1 mb-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-stone-900 flex items-center gap-1">
                    <Pill className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Adherence:</span>
                  </span>
                  <span className="text-[10px] text-emerald-800 font-bold">
                    VERIFIED
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
                  {item.adherenceStatus}
                </p>
              </div>

              {/* Expanded Details when selected */}
              {isSelected && (
                <div className="pt-2 border-t border-stone-100 space-y-2.5 animate-fadeIn">
                  {/* Highlights Bullet List */}
                  <div>
                    <span className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-wider block mb-1">
                      Key Conversational Highlights:
                    </span>
                    <ul className="space-y-1 text-[11px] text-stone-700 list-disc list-inside leading-relaxed font-sans">
                      {item.highlights.map((h, i) => (
                        <li key={i}>{h}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Audio Voice Story Snippet Player */}
                  {item.audioTranscript && (
                    <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-serif">
                        <span className="font-bold text-amber-950 flex items-center gap-1">
                          <span>📻</span>
                          <span>Papa's Audio Story Snippet</span>
                        </span>
                        <span className="font-mono text-amber-800 font-bold">
                          {item.audioDuration} · Awadhi
                        </span>
                      </div>
                      <p className="text-[11px] text-amber-900/80 italic leading-snug">
                        "{item.audioTranscript}"
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlayAudio(item);
                        }}
                        className="px-2.5 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-[10px] font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        {isPlaying ? (
                          <>
                            <VolumeX className="w-3 h-3" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Play Papa's Voice</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Vitals & Logistics Metadata */}
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-stone-600 pt-0.5">
                    {item.vitalsSnippet && (
                      <div className="bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                        <span className="text-stone-400 block text-[9px]">Vitals:</span>
                        <span className="text-stone-800 font-bold">{item.vitalsSnippet}</span>
                      </div>
                    )}
                    {item.fiduciaryOrLogistics && (
                      <div className="bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                        <span className="text-stone-400 block text-[9px]">Fulfillment:</span>
                        <span className="text-teal-800 font-bold truncate block">{item.fiduciaryOrLogistics}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Bottom tap prompt */}
              <div className="mt-2 flex items-center justify-between text-[10px] text-teal-700 font-semibold pt-1">
                <span>{isSelected ? '● Viewing Full Call Digest' : 'Tap to expand call digest & audio'}</span>
                <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Done Button */}
      <div className="p-3 bg-white border-t border-[#E7E2DB] shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          Done & Return to Dashboard
        </button>
      </div>
    </div>
  );
};
