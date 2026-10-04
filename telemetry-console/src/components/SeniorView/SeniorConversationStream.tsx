import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { stopSpeech } from '../../utils/speechService';
import { hinglishToDevanagari, isDevanagari } from '../../utils/hinglishTransliterator';
import {
  Heart,
  Volume2,
  VolumeX,
  Send,
  Radio,
  Sparkles,
  Settings2,
  Languages,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  ChevronDown,
  ChevronUp,
  Loader2,
  Activity
} from 'lucide-react';
import type { ConversationTurn } from '../../types/telemetry';
import { HindiSpeechRecognizer, isSpeechRecognitionSupported } from '../../utils/speechRecognitionService';
import { RecommendedPromptsModal } from './RecommendedPromptsModal';
import { getTimeContext } from '../../data/conversationalSparks';
import { SIMULATION_PRESETS } from '../../data/simulationPrompts';

export const SeniorConversationStream: React.FC = () => {
  const timeCtx = getTimeContext();
  const {
    allTurnsSoFar,
    activeTtsEngine,
    setActiveTtsEngine,
    currentlySpeakingTurnId,
    isAgentGenerating,
    speakTurn,
    injectCustomTurn,
    callStatus,
    startCall,
    endCall,
    openSettingsModal
  } = useTelemetry();

  const [customInputText, setCustomInputText] = useState('');
  const [customSpeaker, setCustomSpeaker] = useState<'senior' | 'agent'>('senior');
  const [isPromptsModalOpen, setIsPromptsModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [liveSpokenText, setLiveSpokenText] = useState('');
  const [isContinuousVoiceMuted, setIsContinuousVoiceMuted] = useState(false);
  const [isTextOverrideOpen, setIsTextOverrideOpen] = useState(false);
  const [wasVoiceInput, setWasVoiceInput] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(true);
  const recognizerRef = useRef<HindiSpeechRecognizer | null>(null);
  const vadTimerRef = useRef<any>(null);

  // Synchronous refs to prevent stale closure bugs in VAD timers and speech callbacks
  const activeTtsEngineRef = useRef(activeTtsEngine);
  activeTtsEngineRef.current = activeTtsEngine;
  const liveSpokenTextRef = useRef(liveSpokenText);
  liveSpokenTextRef.current = liveSpokenText;
  const isContinuousVoiceMutedRef = useRef(isContinuousVoiceMuted);
  isContinuousVoiceMutedRef.current = isContinuousVoiceMuted;
  const callStatusRef = useRef(callStatus);
  callStatusRef.current = callStatus;
  const currentlySpeakingTurnIdRef = useRef(currentlySpeakingTurnId);
  currentlySpeakingTurnIdRef.current = currentlySpeakingTurnId;
  const isAgentGeneratingRef = useRef(isAgentGenerating);
  isAgentGeneratingRef.current = isAgentGenerating;

  // Auto-commit function when user pauses speaking in continuous Gnani mode (VAD 1.3s)
  const triggerVadCommit = useCallback((textToCommit: string) => {
    const trimmed = textToCommit.trim();
    if (!trimmed) return;

    // Temporarily stop recognizer so it doesn't self-echo during submission
    recognizerRef.current?.stop();
    setIsListening(false);
    setLiveSpokenText('');
    liveSpokenTextRef.current = '';

    injectCustomTurn(trimmed, 'senior', { fromVoiceInput: true });
  }, [injectCustomTurn]);

  // Initialize Speech Recognizer once
  useEffect(() => {
    recognizerRef.current = new HindiSpeechRecognizer({
      onStart: () => {
        setIsListening(true);
        setSpeechError(null);
      },
      onResult: (transcript) => {
        if (activeTtsEngineRef.current === 'gnani') {
          setLiveSpokenText(transcript);
          liveSpokenTextRef.current = transcript;

          // Conversational VAD silence endpointing: Reset timer on every syllable detected
          if (vadTimerRef.current) {
            clearTimeout(vadTimerRef.current);
          }

          // When silence exceeds 1,300ms, auto-commit the turn hands-free!
          vadTimerRef.current = setTimeout(() => {
            if (activeTtsEngineRef.current === 'gnani' && liveSpokenTextRef.current.trim()) {
              triggerVadCommit(liveSpokenTextRef.current);
            }
          }, 1300);
        } else {
          // Browser Push-to-Talk mode: dictates directly into the input text box
          setCustomInputText(transcript);
          setWasVoiceInput(true);
        }
      },
      onEnd: () => {
        setIsListening(false);
      },
      onError: (err) => {
        setIsListening(false);
        if (err === 'not-allowed') {
          setSpeechError('Microphone permission blocked. Please enable mic access.');
        } else if (err === 'no-speech') {
          // In continuous Gnani mode, conversational pause is normal; only alert in browser push-to-talk
          if (activeTtsEngineRef.current !== 'gnani') {
            setSpeechError('No speech detected. Please speak clearly into your mic.');
          }
        } else {
          setSpeechError(`Speech recognition: ${err}`);
        }
        setTimeout(() => setSpeechError(null), 4000);
      }
    });

    return () => {
      if (vadTimerRef.current) clearTimeout(vadTimerRef.current);
      recognizerRef.current?.stop();
    };
  }, [triggerVadCommit]);

  // Pause microphone recognition while Companion is thinking (Gemini) or speaking aloud (TTS)
  useEffect(() => {
    if ((currentlySpeakingTurnId || isAgentGenerating) && isListening) {
      if (vadTimerRef.current) clearTimeout(vadTimerRef.current);
      recognizerRef.current?.stop();
      setIsListening(false);
    }
  }, [currentlySpeakingTurnId, isAgentGenerating, isListening]);

  // Turn-Taking Loop: When Companion finishes speaking aloud in Gnani mode, auto-resume listening to Ramesh Ji
  useEffect(() => {
    if (
      activeTtsEngine === 'gnani' &&
      callStatus === 'active' &&
      !currentlySpeakingTurnId &&
      !isAgentGenerating &&
      !isContinuousVoiceMuted
    ) {
      const resumeTimer = setTimeout(() => {
        if (
          activeTtsEngineRef.current === 'gnani' &&
          callStatusRef.current === 'active' &&
          !currentlySpeakingTurnIdRef.current &&
          !isAgentGeneratingRef.current &&
          !isContinuousVoiceMutedRef.current
        ) {
          if (!recognizerRef.current?.getStatus()) {
            stopSpeech();
            recognizerRef.current?.start();
          }
        }
      }, 350);

      return () => clearTimeout(resumeTimer);
    }
  }, [activeTtsEngine, callStatus, currentlySpeakingTurnId, isAgentGenerating, isContinuousVoiceMuted]);

  // Switch TTS / Audio pipeline engine
  const handleSelectEngine = (engine: 'browser' | 'gnani') => {
    if (engine === activeTtsEngine) return;

    if (vadTimerRef.current) clearTimeout(vadTimerRef.current);
    recognizerRef.current?.stop();
    setIsListening(false);
    setLiveSpokenText('');

    setActiveTtsEngine(engine);

    if (engine === 'gnani') {
      setIsContinuousVoiceMuted(false);
      isContinuousVoiceMutedRef.current = false;
      if (callStatus === 'active' && !currentlySpeakingTurnId && !isAgentGenerating) {
        setTimeout(() => {
          stopSpeech();
          recognizerRef.current?.start();
        }, 200);
      }
    }
  };

  // Gnani Continuous Mute / Resume toggle
  const handleToggleContinuousMute = () => {
    if (isContinuousVoiceMuted) {
      setIsContinuousVoiceMuted(false);
      isContinuousVoiceMutedRef.current = false;
      if (callStatus === 'active' && !currentlySpeakingTurnId && !isAgentGenerating) {
        stopSpeech();
        recognizerRef.current?.start();
      }
    } else {
      setIsContinuousVoiceMuted(true);
      isContinuousVoiceMutedRef.current = true;
      if (vadTimerRef.current) clearTimeout(vadTimerRef.current);
      recognizerRef.current?.stop();
      setIsListening(false);
      setLiveSpokenText('');
    }
  };

  // Browser Mode Push-to-Talk Mic Toggle
  const handleBrowserToggleListen = () => {
    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
    } else {
      stopSpeech();
      const started = recognizerRef.current?.start();
      if (started) {
        setWasVoiceInput(true);
      } else if (!isSpeechRecognitionSupported()) {
        setSpeechError('Speech recognition is not available in this browser. Please type text instead.');
        setTimeout(() => setSpeechError(null), 4000);
      }
    }
  };

  // Browser Mode Form Submit (Single Send button)
  const handleBrowserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputText.trim()) return;

    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
    }

    injectCustomTurn(customInputText, customSpeaker, { fromVoiceInput: wasVoiceInput });
    setCustomInputText('');
    setWasVoiceInput(false);
  };

  // Gnani Mode Text Injection Drawer Submit
  const handleGnaniTextOverrideSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInputText.trim()) return;

    if (vadTimerRef.current) clearTimeout(vadTimerRef.current);
    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
    }
    setLiveSpokenText('');

    injectCustomTurn(customInputText, customSpeaker, { fromVoiceInput: false });
    setCustomInputText('');
  };

  // Auto-scroll on new turns
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      return;
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [allTurnsSoFar.length]);

  // Filter out system diagnostic messages from the senior conversation view
  const conversationTurns = allTurnsSoFar.filter(t => t.speaker !== 'system');

  // Helper to split turn into primary Devanagari Hindi and bracketed Hinglish reference
  const splitTurnContent = (turn: ConversationTurn) => {
    if (turn.hindiText && turn.hinglishText) {
      return { hindi: turn.hindiText, hinglish: turn.hinglishText };
    }

    const bracketMatch = turn.content.match(/^([\s\S]*?)\[([\s\S]*?)\]\s*$/);
    if (bracketMatch) {
      return {
        hindi: bracketMatch[1].trim() || turn.content,
        hinglish: bracketMatch[2].trim()
      };
    }

    if (isDevanagari(turn.content)) {
      return {
        hindi: turn.content,
        hinglish: null
      };
    }

    return {
      hindi: hinglishToDevanagari(turn.content),
      hinglish: turn.content
    };
  };

  return (
    <>
      <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 sm:p-5 shadow-xs h-[520px] sm:h-[550px] min-h-[460px] flex flex-col min-h-0 overflow-hidden text-stone-900 transition-all">
        {/* Title & Engine Mode Segmented Control Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E7E2DB] mb-3 flex-wrap gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5EFE6] border border-[#E2D7C5] flex items-center justify-center text-amber-800">
              <Heart className="w-4 h-4 fill-amber-700/20 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900">
                  Live Dialogue Stream
                </h3>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 shadow-2xs ${
                    callStatus === 'active'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-stone-50 text-stone-500 border-[#DFDAD1]'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      callStatus === 'active' ? 'bg-emerald-600 animate-pulse' : 'bg-stone-400'
                    }`}
                  />
                  {callStatus === 'active' ? 'CALL CONNECTED' : 'STANDBY'}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Awadhi-Hindi Telephony · {timeCtx.period} Session ({timeCtx.timeStr})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* 2-Way Engine Segmented Control */}
            <div className="flex items-center bg-[#EFECE6] p-0.5 rounded-xl border border-[#DFDAD1] text-xs">
              <button
                type="button"
                onClick={() => handleSelectEngine('gnani')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTtsEngine === 'gnani'
                    ? 'bg-purple-700 text-white shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Continuous hands-free duplex voice stream via Gnani.ai"
              >
                <Radio className={`w-3.5 h-3.5 ${activeTtsEngine === 'gnani' ? 'animate-pulse' : ''}`} />
                <span>🎙️ Gnani Continuous</span>
              </button>
              <button
                type="button"
                onClick={() => handleSelectEngine('browser')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTtsEngine === 'browser'
                    ? 'bg-emerald-700 text-white shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Browser Web Speech push-to-talk dictation"
              >
                <span>🌐 Browser Push-to-Talk</span>
              </button>
            </div>

            {/* Simulation Scenarios Popup Trigger */}
            <button
              type="button"
              onClick={() => setIsPromptsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs transition-all cursor-pointer ring-2 ring-amber-400/20 active:scale-95"
              title="Open Simulation Scenarios & Benchmark Prompts Modal"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
              <span>⚡ Test Scenarios ({SIMULATION_PRESETS.length})</span>
            </button>

            {/* Active Call Hang Up Button */}
            {callStatus === 'active' && (
              <button
                type="button"
                onClick={() => endCall()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition-all cursor-pointer active:scale-95 animate-pulse"
                title="End Call and Dispatch Post-Call Summary to Telegram"
              >
                <PhoneOff className="w-3.5 h-3.5" />
                <span>कॉल समाप्त करें (End Call)</span>
              </button>
            )}

            {/* Audio Settings Shortcut */}
            <button
              onClick={() => openSettingsModal('telephony')}
              className="p-1.5 rounded-xl text-stone-600 hover:bg-stone-100 border border-[#DFDAD1] shadow-2xs transition-all cursor-pointer"
              title="Configure Voice & Telephony Settings"
            >
              <Settings2 className="w-4 h-4 text-stone-600" />
            </button>
          </div>
        </div>

        {/* Conversation Bubbles Stream */}
        <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin">
          {conversationTurns.length === 0 ? (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-800 shadow-2xs">
                <Phone className="w-7 h-7 stroke-[1.8] text-amber-700 animate-pulse" />
              </div>

              <div className="space-y-1.5 max-w-sm">
                <span className="text-[10px] font-mono font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200 shadow-2xs inline-block mb-1">
                  {timeCtx.timeStr} IST · {timeCtx.sessionName}
                </span>
                <h4 className="font-serif font-bold text-base text-stone-900">
                  Telephony Session Standby
                </h4>
                <p className="text-xs text-stone-500 leading-relaxed font-sans">
                  The companion call with Ramesh Ji has not started yet. When the call connects, live bilingual conversation turns and speech will stream here in real time.
                </p>
              </div>

              {/* Waiting on Phone Pickup Indicator */}
              <div className="w-full max-w-md p-3 rounded-2xl bg-amber-50/80 border border-amber-200/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-amber-950">
                <div className="flex items-center gap-2 text-left">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                  <span className="font-medium text-[11px]">
                    Waiting for call pickup on Ramesh Ji's phone on the left...
                  </span>
                </div>
                <button
                  type="button"
                  onClick={startCall}
                  className="w-full sm:w-auto px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 fill-current" />
                  <span>Connect Now</span>
                </button>
              </div>

              {/* 1-Click Simulation Scenario Trigger */}
              <button
                type="button"
                onClick={() => setIsPromptsModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-amber-900 bg-amber-100/60 hover:bg-amber-100 border border-amber-200/80 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span>Or Select a 1-Click Simulation Scenario (6)</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3.5">
              {/* Session Time Badge */}
              <div className="flex items-center justify-center my-1">
                <span className="text-[10px] font-mono font-medium text-stone-500 bg-stone-100 px-3 py-1 rounded-full border border-stone-200 shadow-2xs">
                  {timeCtx.timeStr} IST · {timeCtx.sessionName}
                </span>
              </div>
              {conversationTurns.map((turn) => {
                const isPapa = turn.speaker === 'senior';
                const isAgent = turn.speaker === 'agent';
                const isSpeakingThis = currentlySpeakingTurnId === turn.id;
                const parsed = splitTurnContent(turn);

                return (
                  <div
                    key={turn.id}
                    className={`flex gap-2.5 ${
                      isPapa ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center font-bold text-xs shadow-2xs ${
                        isPapa
                          ? 'bg-amber-100 border border-amber-300 text-amber-900'
                          : isAgent
                          ? 'bg-emerald-100 border border-emerald-300 text-emerald-900'
                          : 'bg-rose-100 border border-rose-300 text-rose-900'
                      }`}
                    >
                      {isPapa ? '👴🏼' : isAgent ? '🌿' : '⚠️'}
                    </div>

                    {/* Speech Bubble */}
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 shadow-2xs text-xs leading-relaxed transition-all ${
                        isSpeakingThis
                          ? 'ring-2 ring-emerald-600 shadow-sm'
                          : ''
                      } ${
                        isPapa
                          ? 'bg-[#FCFAF7] border border-[#E8E2D7] text-stone-900'
                          : isAgent
                          ? 'bg-[#F4F9F6] border border-[#D5EADB] text-stone-900'
                          : 'bg-rose-50 border border-rose-200 text-rose-950'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2.5 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-xs font-semibold ${
                              isPapa
                                ? 'text-amber-900 font-serif'
                                : isAgent
                                ? 'text-emerald-900 font-serif'
                                : 'text-rose-900'
                            }`}
                          >
                            {turn.speakerLabel}
                          </span>
                          {turn.providerBadge && (
                            <span
                              className="px-1.5 py-0.2 rounded-md text-[9px] font-mono font-medium bg-stone-100 text-stone-700 border border-stone-200"
                              title="Cross-Provider Resilience: Served via Google AI Studio API"
                            >
                              {turn.providerBadge}
                            </span>
                          )}
                        </div>

                        {/* Listen Aloud Button & Timestamp */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-stone-400 font-mono">{turn.timestamp}</span>

                          <button
                            onClick={() => {
                              if (isSpeakingThis) {
                                stopSpeech();
                              } else {
                                speakTurn(turn);
                              }
                            }}
                            className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                              isSpeakingThis
                                ? 'bg-emerald-700 text-white'
                                : 'bg-white hover:bg-stone-50 text-stone-700 border border-stone-200'
                            }`}
                            title={isSpeakingThis ? "Stop speech" : `Read aloud via ${activeTtsEngine === 'browser' ? 'Browser Web Speech' : 'Gnani.ai'}`}
                          >
                            {isSpeakingThis ? (
                              <>
                                <VolumeX className="w-2.5 h-2.5" />
                                <span>Stop</span>
                              </>
                            ) : (
                              <>
                                <Volume2 className="w-2.5 h-2.5 text-stone-600" />
                                <span>Listen</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Primary Devanagari Hindi Text */}
                      <p className="font-medium text-stone-900 text-sm leading-relaxed">
                        {parsed.hindi}
                      </p>

                      {/* Hinglish Reference Translation */}
                      {parsed.hinglish && (
                        <p className="mt-1.5 pt-1.5 border-t border-stone-200/60 text-[11px] text-stone-500 font-sans italic">
                          {parsed.hinglish}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Audio Pipeline Control & Dialogue Injection Area */}
        <div className="pt-2.5 border-t border-[#E7E2DB] mt-1.5 space-y-2 shrink-0">
          {/* ============================================================== */}
          {/* MODE A: GNANI CONTINUOUS VOICE STREAM (Hands-Free Duplex Loop) */}
          {/* ============================================================== */}
          {activeTtsEngine === 'gnani' ? (
            <div className="space-y-2">
              {/* Hands-Free Duplex Call Bar */}
              <div
                className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-2xs ${
                  currentlySpeakingTurnId
                    ? 'bg-purple-50/90 border-purple-200 text-purple-950'
                    : isAgentGenerating
                    ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                    : isListening
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                    : 'bg-stone-50 border-[#DFDAD1] text-stone-700'
                }`}
              >
                {/* Visual Audio Wave & Real-Time Status */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0 flex items-center justify-center">
                    {currentlySpeakingTurnId ? (
                      <div className="w-7 h-7 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                        <Volume2 className="w-4 h-4 animate-bounce" />
                      </div>
                    ) : isAgentGenerating ? (
                      <div className="w-7 h-7 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                        <Loader2 className="w-4 h-4 animate-spin" />
                      </div>
                    ) : isListening ? (
                      <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                        <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-xl bg-stone-300 text-stone-600 flex items-center justify-center">
                        <MicOff className="w-3.5 h-3.5 text-stone-500" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs">
                        {currentlySpeakingTurnId
                          ? 'Gnani.ai Indic Voice Speaking Aloud...'
                          : isAgentGenerating
                          ? 'Companion Reasoning (Gemini 2.5)...'
                          : isListening
                          ? 'Listening to Ramesh Ji (बोलिए...)'
                          : isContinuousVoiceMuted
                          ? 'Continuous Mic Paused'
                          : 'Telephony Standby'}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 truncate">
                      {currentlySpeakingTurnId
                        ? 'Synthesizing natural Awadhi-Hindi speech output'
                        : isAgentGenerating
                        ? 'Synthesizing empathetic clinical response'
                        : isListening
                        ? 'Hands-free: 1.3s pause auto-triggers companion response'
                        : isContinuousVoiceMuted
                        ? 'Click Resume Mic to unpause hands-free conversation'
                        : 'Connect call to start hands-free voice dialogue'}
                    </p>
                  </div>
                </div>

                {/* Controls: Mute/Resume & Text Injection Toggle */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Mute/Resume Toggle */}
                  <button
                    type="button"
                    onClick={handleToggleContinuousMute}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs ${
                      isContinuousVoiceMuted || !isListening
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold'
                        : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-300'
                    }`}
                    title={isContinuousVoiceMuted ? 'Resume continuous mic' : 'Temporarily mute mic'}
                  >
                    {isContinuousVoiceMuted || !isListening ? (
                      <>
                        <Mic className="w-3.5 h-3.5" />
                        <span>Resume Mic</span>
                      </>
                    ) : (
                      <>
                        <MicOff className="w-3.5 h-3.5 text-stone-500" />
                        <span>Mute Mic</span>
                      </>
                    )}
                  </button>

                  {/* Text Override Drawer Toggle */}
                  <button
                    type="button"
                    onClick={() => setIsTextOverrideOpen(!isTextOverrideOpen)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white hover:bg-stone-50 text-stone-700 border border-[#DFDAD1] shadow-2xs flex items-center gap-1 cursor-pointer transition-all"
                    title="Toggle manual text injection override"
                  >
                    <span>✏️ Manual Text</span>
                    {isTextOverrideOpen ? (
                      <ChevronUp className="w-3 h-3 text-stone-500" />
                    ) : (
                      <ChevronDown className="w-3 h-3 text-stone-500" />
                    )}
                  </button>
                </div>
              </div>

              {/* Real-time Spoken Transcript Preview Bubble (while Ramesh Ji speaks) */}
              {liveSpokenText && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 animate-fadeIn shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                  <span className="font-extrabold text-xs shrink-0">👴🏼 Ramesh Ji:</span>
                  <span className="font-medium truncate text-emerald-900">"{liveSpokenText}"</span>
                  <span className="ml-auto text-[10px] text-emerald-700 shrink-0 font-mono">
                    ⏳ Auto-sending on pause...
                  </span>
                </div>
              )}

              {/* Collapsible Manual Text Override Drawer */}
              {isTextOverrideOpen && (
                <form
                  onSubmit={handleGnaniTextOverrideSubmit}
                  className="flex items-center gap-2 p-2 bg-[#FAF8F5] border border-[#DFDAD1] rounded-2xl text-xs animate-fadeIn shadow-2xs"
                >
                  <div className="flex items-center bg-[#EFECE6] p-0.5 rounded-xl border border-[#DFDAD1] text-xs shrink-0">
                    <button
                      type="button"
                      onClick={() => setCustomSpeaker('senior')}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                        customSpeaker === 'senior' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                      }`}
                    >
                      👴🏼 Ramesh Ji
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomSpeaker('agent')}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold transition-all ${
                        customSpeaker === 'agent' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                      }`}
                    >
                      🌿 Companion
                    </button>
                  </div>

                  <input
                    type="text"
                    value={customInputText}
                    onChange={(e) => setCustomInputText(e.target.value)}
                    placeholder="Type manual text injection override (e.g. 'Maine dava le li hai')..."
                    className="flex-1 min-w-0 bg-white border border-[#DFDAD1] rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-purple-600 font-sans"
                  />

                  <button
                    type="submit"
                    disabled={!customInputText.trim()}
                    className="px-3 py-1.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Inject Turn</span>
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* ============================================================== */
            /* MODE B: BROWSER WEB SPEECH PUSH-TO-TALK (1 Mic + 1 Send)       */
            /* ============================================================== */
            <div className="space-y-1.5">
              <form onSubmit={handleBrowserSubmit} className="flex items-center gap-2">
                {/* Speaker Toggle */}
                <div className="flex items-center bg-[#EFECE6] p-0.5 rounded-xl border border-[#DFDAD1] text-xs shrink-0">
                  <button
                    type="button"
                    onClick={() => setCustomSpeaker('senior')}
                    className={`px-1.5 sm:px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                      customSpeaker === 'senior' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                    }`}
                    title="Ramesh Ji (Senior)"
                  >
                    <span>👴🏼</span>
                    <span className="hidden sm:inline ml-1">Ramesh Ji</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomSpeaker('agent')}
                    className={`px-1.5 sm:px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                      customSpeaker === 'agent' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                    }`}
                    title="Companion Agent"
                  >
                    <span>🌿</span>
                    <span className="hidden sm:inline ml-1">Companion</span>
                  </button>
                </div>

                {/* Text Input */}
                <input
                  type="text"
                  value={customInputText}
                  onChange={(e) => {
                    setCustomInputText(e.target.value);
                    setWasVoiceInput(false);
                  }}
                  placeholder={
                    customSpeaker === 'senior'
                      ? "Type Papa's speech or click Mic to dictate (e.g. 'Haan beta, BP ki dava le li')..."
                      : "Type Companion speech or click Mic (e.g. 'Uncle, subah ka nashta ho gaya?')..."
                  }
                  className="flex-1 min-w-0 bg-[#FAF8F5] border border-[#DFDAD1] rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-sans"
                />

                {/* Single Mic Dictation Button */}
                <button
                  type="button"
                  onClick={handleBrowserToggleListen}
                  className={`p-2 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-2xs ${
                    isListening
                      ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                      : 'bg-white hover:bg-stone-50 text-stone-700 border-[#DFDAD1]'
                  }`}
                  title={
                    isListening
                      ? 'Listening in Hindi... Click to pause dictation'
                      : 'Click to dictate in Hindi (Web Speech)'
                  }
                >
                  <Mic className={`w-4 h-4 ${isListening ? 'text-white' : 'text-stone-600'}`} />
                </button>

                {/* Single Send Button */}
                <button
                  type="submit"
                  disabled={!customInputText.trim()}
                  className="px-3 sm:px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  title="Send turn and speak aloud"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>

              {/* Real-Time Listening Indicator for Browser Push-to-Talk */}
              {isListening && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 animate-fadeIn shadow-2xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span className="font-extrabold text-xs">Dictating in Hindi (बोलिए...)...</span>
                  <span className="text-[11px] text-rose-600 font-mono truncate">
                    Speech fills text box. Click Mic again or Send when ready.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Speech Error Banner (Falls back cleanly) */}
          {speechError && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 animate-fadeIn shadow-2xs">
              <span>⚠️</span>
              <span>{speechError}</span>
            </div>
          )}

          {/* Live Hinglish to Hindi Transliteration Pill */}
          {customInputText.trim() && !isDevanagari(customInputText) && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50/90 border border-amber-200/90 rounded-xl text-[11px] text-amber-900 shadow-2xs">
              <Languages className="w-3 h-3 text-amber-700 shrink-0" />
              <span className="font-extrabold text-amber-800 shrink-0">Hinglish → Hindi:</span>
              <span className="font-medium text-stone-800 truncate">
                "{hinglishToDevanagari(customInputText)}"
              </span>
              <span className="text-[10px] text-amber-700 ml-auto shrink-0 font-medium">
                (Synthesizes as native Hindi speech)
              </span>
            </div>
          )}

          {/* Clean Footer Telephony Status Line */}
          <div className="flex items-center justify-between text-[10px] text-stone-400 px-1 pt-0.5">
            <span>
              {activeTtsEngine === 'gnani'
                ? '🎙️ Gnani Hands-Free Voice: Conversational pause (~1.3s) automatically triggers Gemini reasoning & speech'
                : '🌐 Browser Push-to-Talk: Dictate via mic or type in Roman Hinglish / Hindi and click Send'}
            </span>
            <button
              type="button"
              onClick={() => openSettingsModal('telephony')}
              className="hover:text-stone-600 transition-colors cursor-pointer flex items-center gap-1 shrink-0 ml-2"
            >
              <span>Audio Settings</span>
              <Settings2 className="w-2.5 h-2.5 text-stone-400" />
            </button>
          </div>
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
