import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { ConversationToolTree } from '../ExecutionTree/ConversationToolTree';
import { RecommendedPromptsModal } from '../SeniorView/RecommendedPromptsModal';
import {
  ShieldCheck,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  Clock,
  CheckCircle2,
  GitBranch,
  Phone,
  ArrowRight,
  RefreshCw,
  Play,
  FileText,
  AlertTriangle,
  Radio,
  Lock,
  MessageSquare,
  Truck,
  Heart,
  CheckCheck
} from 'lucide-react';

export const CaregiverInterventionStream: React.FC = () => {
  const {
    currentStep,
    activeScenario,
    preCallAgency,
    resolvePreCallAgency,
    requestPreCallApproval,
    handleTelegramAction,
    caregiverConfig,
    cashWallet,
    callStatus,
    startCall,
    speakTurn,
    dynamicExecutionNodes,
    allTurnsSoFar
  } = useTelemetry();

  const [viewMode, setViewMode] = useState<'stream' | 'tree'>('stream');
  const [isPromptsModalOpen, setIsPromptsModalOpen] = useState(false);
  const [isPlayingAudioSnippet, setIsPlayingAudioSnippet] = useState(false);
  const [quickPingFeedback, setQuickPingFeedback] = useState<string | null>(null);

  const msg = currentStep.telegramMessage;

  const handlePlayAudioSnippet = () => {
    if (isPlayingAudioSnippet) {
      window.speechSynthesis?.cancel();
      setIsPlayingAudioSnippet(false);
    } else {
      setIsPlayingAudioSnippet(true);
      const textToSpeak =
        "बेटा, 1982 में जब हम दिल्ली डिवीजन में सिग्नल इंस्पेक्टर थे... उस समय मैकेनिकल लीवर फ्रेम हुआ करता था। हाथ से खींचना पड़ता था भारी लीवर।";
      
      speakTurn({
        id: 'caregiver-story-snippet',
        timestamp: '08:34 IST',
        speaker: 'senior',
        lane: 'lane1',
        speakerLabel: 'Ramesh Chandra (Papa)',
        content: textToSpeak
      });

      // Reset after speech ends
      setTimeout(() => {
        setIsPlayingAudioSnippet(false);
      }, 9000);
    }
  };

  const handleQuickPing = (actionName: string) => {
    setQuickPingFeedback(`Dispatched ${actionName} to Papa via Jio PSTN`);
    setTimeout(() => setQuickPingFeedback(null), 3000);
  };

  return (
    <>
      <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 sm:p-5 shadow-xs h-[520px] sm:h-[550px] min-h-[460px] flex flex-col min-h-0 overflow-hidden text-stone-900 transition-all">
        {/* Top Header: Title, View Switcher & Actions */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E7E2DB] mb-3 flex-wrap gap-2 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shadow-2xs">
              <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 leading-tight">
                Caregiver Intervention & Audit Stream
              </h3>
              <p className="text-xs text-stone-500">
                Telegram MTProto Bot · Fiduciary Guardrails · Agency Rail
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* View Mode Segmented Switcher: Live Feed vs Causal Tree */}
            <div className="flex items-center bg-[#EFECE6] p-0.5 rounded-xl border border-[#DFDAD1] text-xs">
              <button
                type="button"
                onClick={() => setViewMode('stream')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'stream'
                    ? 'bg-white text-stone-900 font-bold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>📡</span>
                <span>Live Feed</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('tree')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === 'tree'
                    ? 'bg-white text-stone-900 font-bold shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>🌳</span>
                <span>Causal Tree (DAG)</span>
              </button>
            </div>

            {/* Test Simulation Scenarios Trigger */}
            <button
              type="button"
              onClick={() => setIsPromptsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs transition-all cursor-pointer active:scale-95"
              title="Open Benchmark Scenarios Modal"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>⚡ Scenarios (6)</span>
            </button>

            {/* Call State Pill */}
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border flex items-center gap-1 shadow-2xs ${
                callStatus === 'active'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : callStatus === 'calling'
                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                  : callStatus === 'ended'
                  ? 'bg-teal-50 text-teal-800 border-teal-300'
                  : 'bg-stone-50 text-stone-500 border-[#DFDAD1]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  callStatus === 'active'
                    ? 'bg-emerald-600 animate-pulse'
                    : callStatus === 'calling'
                    ? 'bg-amber-500 animate-ping'
                    : callStatus === 'ended'
                    ? 'bg-teal-600'
                    : 'bg-stone-400'
                }`}
              ></span>
              {callStatus === 'active'
                ? 'LIVE SESSION'
                : callStatus === 'calling'
                ? 'RINGING'
                : callStatus === 'ended'
                ? 'CALL AUDITED'
                : 'STANDBY'}
            </span>
          </div>
        </div>

        {/* Dynamic Body: Live Feed Stream vs Full Causal Tree */}
        {viewMode === 'tree' ? (
          <div className="flex-1 min-h-0 overflow-hidden">
            <ConversationToolTree />
          </div>
        ) : (
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin">
            {/* 1. Pre-Call Caregiver Agency Gate Card (Family Primacy Protocol) */}
            <div className="bg-[#FAF8F5] border border-[#E7E2DB] rounded-2xl p-3.5 shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-sky-100 border border-sky-300 text-sky-900 flex items-center justify-center font-bold text-xs">
                    🛡️
                  </div>
                  <div>
                    <span className="text-xs font-serif font-bold text-stone-900 block leading-tight">
                      Pre-Call Caregiver Agency Protocol
                    </span>
                    <span className="text-[10px] text-stone-500 font-mono">
                      Family Primacy Gate · Prior to Outbound Dialing
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border ${
                    preCallAgency.status === 'agent_approved'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : preCallAgency.status === 'caregiver_calling'
                      ? 'bg-sky-50 text-sky-800 border-sky-300'
                      : preCallAgency.status === 'snoozed'
                      ? 'bg-amber-50 text-amber-800 border-amber-300'
                      : 'bg-stone-50 text-stone-600 border-stone-200'
                  }`}
                >
                  {preCallAgency.status === 'agent_approved'
                    ? '✓ AI Check-In Approved'
                    : preCallAgency.status === 'caregiver_calling'
                    ? '📞 Direct Call Delegated'
                    : preCallAgency.status === 'snoozed'
                    ? '⏰ Snoozed (30m)'
                    : '⏳ Awaiting Consent'}
                </span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                Sambandh asks Priya Sharma (Daughter, Bengaluru) on Telegram before initiating the morning check-in, giving her sovereignty to call Papa herself or delegate to the AI companion.
              </p>

              {/* Action Buttons for Pre-Call Approval */}
              {preCallAgency.status === 'awaiting_approval' || preCallAgency.status === 'idle' ? (
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => resolvePreCallAgency('caregiver_direct')}
                    className="flex-1 py-1.5 px-2.5 bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 rounded-xl text-xs font-semibold shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span>I'll Call Papa Directly</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => resolvePreCallAgency('agent_approved')}
                    className="flex-1 py-1.5 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve AI Check-In</span>
                  </button>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-white border border-stone-200/80 flex items-center justify-between text-xs text-stone-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-[11px]">
                      {preCallAgency.status === 'agent_approved'
                        ? 'Priya verified briefing and authorized Sambandh companion call.'
                        : 'Priya elected to call directly. Outbound automated dialing paused.'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => requestPreCallApproval()}
                    className="text-[10px] text-teal-700 font-semibold hover:underline cursor-pointer"
                  >
                    Reset Gate
                  </button>
                </div>
              )}
            </div>

            {/* 2. Telegram Dispatch & Real-Time Family Briefing Card */}
            {msg ? (
              <div className="bg-[#FAF8F5] border border-[#E7E2DB] rounded-2xl p-3.5 shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                      ✈️
                    </div>
                    <div>
                      <span className="text-xs font-serif font-bold text-stone-900 block leading-tight">
                        Telegram MTProto Caregiver Briefing
                      </span>
                      <span className="text-[10px] text-stone-500 font-mono">
                        Recipient: Priya Sharma ({msg.recipient || '@priya_care'}) · Instant Dispatch
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-sky-800 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200 font-semibold">
                    Delivered
                  </span>
                </div>

                {/* Telegram Card Payload Box */}
                <div className="bg-white rounded-xl p-3.5 border border-[#DFDAD1] space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-stone-100">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <span>{msg.headline}</span>
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-stone-700 leading-relaxed font-sans text-xs">
                    <div>
                      <span className="text-stone-400 font-semibold">👤 Participants: </span>
                      <span className="text-stone-800">{msg.participants}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 font-semibold">💡 Summary: </span>
                      <span className="text-stone-800">{msg.topicSummary}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 font-semibold">💊 Adherence: </span>
                      <span className="text-emerald-700 font-medium">{msg.adherenceStatus}</span>
                    </div>

                    {msg.fulfillmentStatus && (
                      <div>
                        <span className="text-stone-400 font-semibold">📦 Logistics & Refill: </span>
                        <span className="text-teal-700 font-medium">{msg.fulfillmentStatus}</span>
                      </div>
                    )}
                  </div>

                  {/* Audio Story Snippet Player (Papa's voice memories) */}
                  <div className="mt-2.5 p-3 rounded-xl bg-amber-50/80 border border-amber-200/90 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5 font-serif">
                        <span>📻</span>
                        <span>Railway Signal Lore Audio Briefing</span>
                      </span>
                      <span className="text-[10px] font-mono text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded font-bold">
                        0:42 · Awadhi Dialect
                      </span>
                    </div>

                    <p className="text-[11px] text-amber-900/80 italic leading-snug">
                      "बेटा, 1982 में जब हम दिल्ली डिवीजन में सिग्नल इंस्पेक्टर थे... उस समय मैकेनिकल लीवर फ्रेम हुआ करता था।"
                    </p>

                    <div className="pt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handlePlayAudioSnippet}
                        className="px-3 py-1 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-bold shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        {isPlayingAudioSnippet ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>Stop Audio</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            <span>Play Audio Story</span>
                          </>
                        )}
                      </button>
                      <span className="text-[10px] text-stone-500">
                        Preserves emotional connection across cities
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons Delivered in Telegram */}
                  {msg.buttons && msg.buttons.length > 0 && (
                    <div className="pt-2 flex items-center gap-2 flex-wrap">
                      {msg.buttons.map((btn) => (
                        <button
                          key={btn.id}
                          type="button"
                          onClick={() => handleTelegramAction(btn.action)}
                          className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Send className="w-3 h-3 text-sky-600" />
                          <span>{btn.label}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Sentiment & Status Bar */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 rounded font-mono font-medium bg-stone-100 text-stone-600 border border-stone-200">
                      Sentiment: {msg.sentimentBadge}
                    </span>
                    <span className="text-sky-700 flex items-center gap-1 font-mono font-medium">
                      <CheckCheck className="w-3.5 h-3.5 text-sky-600" /> Delivered
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-dashed border-[#DFDAD1] text-center space-y-1.5">
                <div className="w-8 h-8 rounded-full bg-sky-50 text-sky-700 mx-auto flex items-center justify-center text-sm">
                  ✈️
                </div>
                <h4 className="text-xs font-bold text-stone-800">
                  Telegram Caregiver Receptor: Standby
                </h4>
                <p className="text-[11px] text-stone-500 max-w-sm mx-auto">
                  Once the morning telephony turn concludes or an adherence event occurs, Priya's Telegram card and Papa's audio story will stream here in real time.
                </p>
              </div>
            )}

            {/* 3. Fiduciary Safety & Guardrails Status Deck */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Fiduciary Envelope */}
              <div className="bg-white p-3 rounded-2xl border border-[#E7E2DB] shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-stone-500 text-[10px] font-mono font-bold uppercase">
                  <span>Fiduciary Cap</span>
                  <span className="text-emerald-700">Pine Labs</span>
                </div>
                <span className="text-base font-extrabold text-stone-900 block font-mono">
                  ₹{cashWallet.balanceInr.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-500 block">
                  Limit: ₹{caregiverConfig.orderTotalLimitInr.toLocaleString('en-IN')}/mo
                </span>
              </div>

              {/* Courier Delivery SLA */}
              <div className="bg-white p-3 rounded-2xl border border-[#E7E2DB] shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-stone-500 text-[10px] font-mono font-bold uppercase">
                  <span>Logistics SLA</span>
                  <span className="text-rose-700">Delhivery</span>
                </div>
                <span className="text-base font-extrabold text-stone-900 block font-mono">
                  Today 4:00 PM
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  Apollo DarkStore ➔ Rohini
                </span>
              </div>

              {/* National Stack Bridge */}
              <div className="bg-white p-3 rounded-2xl border border-[#E7E2DB] shadow-2xs space-y-1">
                <div className="flex items-center justify-between text-stone-500 text-[10px] font-mono font-bold uppercase">
                  <span>ABHA Runway</span>
                  <span className="text-teal-700">ABDM M3</span>
                </div>
                <span className="text-base font-extrabold text-stone-900 block font-mono">
                  4 Days (Telma)
                </span>
                <span className="text-[10px] text-stone-500 block truncate">
                  Dr. Saxena Consent Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Interactive Command Bar */}
        <div className="pt-2.5 border-t border-[#E7E2DB] mt-2 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-mono text-stone-500 font-bold uppercase">
              Caregiver Action:
            </span>
            <button
              type="button"
              onClick={() => handleQuickPing('Medication Reassurance Ping')}
              className="px-2 py-1 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-lg text-[11px] font-medium shadow-2xs cursor-pointer"
            >
              💊 Reassurance Ping
            </button>
            <button
              type="button"
              onClick={() => handleQuickPing('Low-Salt Breakfast Reminder')}
              className="px-2 py-1 bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 rounded-lg text-[11px] font-medium shadow-2xs cursor-pointer"
            >
              🥗 Low-Salt Diet Note
            </button>
            {quickPingFeedback && (
              <span className="text-[11px] text-emerald-700 font-medium animate-fadeIn">
                ✓ {quickPingFeedback}
              </span>
            )}
          </div>

          <span className="text-[10px] font-mono text-stone-400">
            Telegram Webhook: Active · 88ms latency
          </span>
        </div>
      </div>

      {/* Pop-up Simulation Benchmarks & Prompts Modal */}
      <RecommendedPromptsModal
        isOpen={isPromptsModalOpen}
        onClose={() => setIsPromptsModalOpen(false)}
      />
    </>
  );
};
