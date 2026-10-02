import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  Send,
  CheckCheck,
  Bot,
  User,
  ShieldCheck,
  Headphones,
  FileSpreadsheet,
  Zap,
  PhoneCall,
  AlertTriangle
} from 'lucide-react';

export const TelegramReceptor: React.FC = () => {
  const { currentStep, handleTelegramAction, telegramActionFeedback } = useTelemetry();
  const msg = currentStep.telegramMessage;

  const getButtonIcon = (action: string) => {
    switch (action) {
      case 'PLAY_AUDIO':
        return <Headphones className="w-3.5 h-3.5" />;
      case 'VIEW_LEDGER':
      case 'REVIEW_AUDIT':
        return <FileSpreadsheet className="w-3.5 h-3.5" />;
      case 'APPROVE_UPI_5600':
        return <Zap className="w-3.5 h-3.5" />;
      case 'CALL_PAPA':
      case 'CALL_DOCTOR':
        return <PhoneCall className="w-3.5 h-3.5" />;
      case 'LOCK_WHITELIST':
        return <AlertTriangle className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div className="telemetry-card rounded-lg border border-slate-800 bg-slate-900/60 overflow-hidden shadow-md flex-1 flex flex-col min-h-0">
      {/* Telegram Client Header */}
      <div className="px-3.5 py-2.5 bg-gradient-to-r from-sky-950 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Telegram Logo / Avatar */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center text-white shadow-md shadow-sky-500/30">
              <Send className="w-4 h-4 fill-white text-white -rotate-12 translate-x-[-1px]" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-slate-900"></span>
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-xs text-slate-100">
                Sambandh Care Bot
              </span>
              <span className="px-1 py-0.2 text-[9px] font-mono bg-sky-950 text-sky-300 border border-sky-600/40 rounded flex items-center gap-0.5">
                <ShieldCheck className="w-2.5 h-2.5 text-sky-400" />
                bot
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block font-mono">
              Caregiver: Priya Sharma (@priya_sharma_care)
            </span>
          </div>
        </div>

        <span className="text-[10px] font-mono text-sky-400/80 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/40">
          TELEGRAM RECEPTOR
        </span>
      </div>

      {/* Action Feedback Banner */}
      {telegramActionFeedback && (
        <div className="px-3 py-1.5 bg-emerald-950/90 border-b border-emerald-500/40 text-[11px] font-mono text-emerald-300 flex items-center gap-1.5 animate-fadeIn">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{telegramActionFeedback}</span>
        </div>
      )}

      {/* Chat pane */}
      <div className="flex-1 overflow-y-auto p-3 bg-slate-950/90 flex flex-col justify-end space-y-2">
        {!msg ? (
          <div className="h-44 flex flex-col items-center justify-center text-slate-500 text-xs font-mono space-y-2">
            <Bot className="w-6 h-6 text-slate-600 animate-pulse" />
            <span className="text-center px-4">
              Awaiting post-interaction brief trigger...
              <br />
              <span className="text-[10px] text-slate-600">
                (Telegram card dispatches upon call conclusion or safety escalation)
              </span>
            </span>
          </div>
        ) : (
          <div className="space-y-2 animate-fadeIn">
            {/* Telegram Message Bubble */}
            <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-3.5 shadow-lg text-xs font-sans text-slate-200 space-y-2 max-w-full">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-sky-300 flex items-center gap-1.5 text-xs">
                  {msg.headline}
                </span>
                <span className="text-[10px] font-mono text-slate-400">{msg.timestamp}</span>
              </div>

              {/* Body Content */}
              <div className="space-y-1.5 text-[11px] leading-relaxed">
                <div>
                  <span className="text-slate-400 font-semibold">👤 Participants: </span>
                  <span className="text-slate-200">{msg.participants}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold">💡 Summary: </span>
                  <span className="text-slate-300">{msg.topicSummary}</span>
                </div>

                <div>
                  <span className="text-slate-400 font-semibold">💊 Adherence: </span>
                  <span className="text-emerald-300">{msg.adherenceStatus}</span>
                </div>

                {msg.fulfillmentStatus && (
                  <div>
                    <span className="text-slate-400 font-semibold">📦 Logistics & Refill: </span>
                    <span className="text-cyan-300">{msg.fulfillmentStatus}</span>
                  </div>
                )}
              </div>

              {/* Sentiment & Status bar */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 rounded font-mono font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  Sentiment: {msg.sentimentBadge}
                </span>
                <span className="text-sky-400 flex items-center gap-1 font-mono">
                  <CheckCheck className="w-3.5 h-3.5 text-sky-400" /> Delivered
                </span>
              </div>
            </div>

            {/* Interactive Inline Buttons */}
            {msg.buttons && msg.buttons.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block px-1">
                  Telegram Inline Keyboard (Interactive):
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {msg.buttons.map((btn) => {
                    const isPrimary = btn.variant === 'primary';
                    const isDanger = btn.variant === 'danger';

                    return (
                      <button
                        key={btn.id}
                        onClick={() => handleTelegramAction(btn.action)}
                        className={`w-full py-2 px-3 rounded-lg text-xs font-mono font-semibold flex items-center justify-center gap-2 transition-all shadow-sm ${
                          isDanger
                            ? 'bg-rose-950/80 hover:bg-rose-900 border border-rose-600/60 text-rose-200 hover:text-white'
                            : isPrimary
                            ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30'
                            : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        {getButtonIcon(btn.action)}
                        <span>{btn.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
