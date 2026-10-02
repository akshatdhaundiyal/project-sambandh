import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { X, Play, Pause, Headphones, Volume2, ShieldCheck } from 'lucide-react';

export const AudioSnippetModal: React.FC = () => {
  const { isAudioSnippetOpen, setIsAudioSnippetOpen } = useTelemetry();
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isAudioSnippetOpen) {
      setProgress(0);
      return;
    }

    setIsPlaying(true);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return prev + 3.33; // 30 seconds total
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAudioSnippetOpen]);

  if (!isAudioSnippetOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Headphones className="w-5 h-5 text-sky-400" />
            <div>
              <h3 className="text-sm font-mono font-bold text-slate-100">
                Papa's Railway Story Snippet (30s)
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                WhisperFlo Hi-Fi Acoustic Diarization Stream
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsAudioSnippetOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Visualizer & Player */}
        <div className="py-4 space-y-4">
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-slate-300">
              <span className="text-sky-300 font-semibold">Ramesh Chandra (Voiceprint 98.4%)</span>
              <span>
                00:{Math.floor((progress * 0.3)).toString().padStart(2, '0')} / 00:30
              </span>
            </div>

            {/* Waveform graphic */}
            <div className="flex items-center justify-center gap-1.5 h-12 px-2 bg-slate-900/60 rounded border border-slate-800/80">
              {[40, 70, 95, 60, 85, 45, 90, 100, 65, 80, 50, 75, 90, 60, 40, 85, 95, 70, 50, 65].map(
                (h, i) => (
                  <span
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-200 ${
                      isPlaying
                        ? 'bg-gradient-to-t from-sky-500 to-emerald-400 animate-pulse'
                        : 'bg-slate-700'
                    }`}
                    style={{ height: `${h}%` }}
                  />
                )
              )}
            </div>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-400 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-mono font-semibold"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                <Volume2 className="w-4 h-4" />
                <span>Audio Clarity: 48 kHz Lossless</span>
              </div>
            </div>
          </div>

          {/* Transcript Quote */}
          <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-lg text-xs font-sans text-slate-300 italic leading-relaxed">
            "Rules se zyaada ground technician ke haath ki garmi aur respect safety banati hai... unke sath chai piyo aur unka vishwas jeeto."
          </div>
        </div>
      </div>
    </div>
  );
};
