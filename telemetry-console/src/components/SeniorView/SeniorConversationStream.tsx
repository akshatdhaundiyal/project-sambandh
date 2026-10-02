import React, { useRef, useEffect, useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { stopSpeech } from '../../utils/speechService';
import { hinglishToDevanagari, isDevanagari } from '../../utils/hinglishTransliterator';
import { Heart, Volume2, VolumeX, Send, Radio, Sparkles, Settings2, Languages, Mic, MicOff, FileCode } from 'lucide-react';
import type { ConversationTurn } from '../../types/telemetry';
import { VoiceAudioIntegrationModal } from '../Modals/VoiceAudioIntegrationModal';
import { SystemPromptModal } from '../Modals/SystemPromptModal';
import { SIMULATION_PRESETS } from '../../data/simulationPrompts';
import { HindiSpeechRecognizer, isSpeechRecognitionSupported } from '../../utils/speechRecognitionService';

export const SeniorConversationStream: React.FC = () => {
  const {
    allTurnsSoFar,
    activeTtsEngine,
    setActiveTtsEngine,
    currentlySpeakingTurnId,
    speakTurn,
    injectCustomTurn,
    callStatus,
    autoSpeak,
    setAutoSpeak,
    speakSeniorTurns,
    setSpeakSeniorTurns,
    triggerSimulationPreset,
    isSystemPromptModalOpen,
    setIsSystemPromptModalOpen
  } = useTelemetry();

  const [customInputText, setCustomInputText] = useState('');
  const [customSpeaker, setCustomSpeaker] = useState<'senior' | 'agent'>('senior');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [wasVoiceInput, setWasVoiceInput] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const initialLoadRef = useRef(true);
  const recognizerRef = useRef<HindiSpeechRecognizer | null>(null);

  useEffect(() => {
    recognizerRef.current = new HindiSpeechRecognizer({
      onStart: () => {
        setIsListening(true);
        setWasVoiceInput(true);
        setSpeechError(null);
      },
      onResult: (transcript) => {
        setCustomInputText(transcript);
        setWasVoiceInput(true);
      },
      onEnd: () => {
        setIsListening(false);
      },
      onError: (err) => {
        setIsListening(false);
        if (err === 'not-allowed') {
          setSpeechError('Microphone permission blocked. Please enable mic access.');
        } else if (err === 'no-speech') {
          setSpeechError('No speech detected. Please speak clearly into your mic.');
        } else {
          setSpeechError(`Speech recognition: ${err}`);
        }
        setTimeout(() => setSpeechError(null), 4000);
      }
    });

    return () => {
      recognizerRef.current?.stop();
    };
  }, []);

  // Automatically pause microphone recognition while TTS is actively speaking so mic does not hear speaker output
  useEffect(() => {
    if (currentlySpeakingTurnId && isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
    }
  }, [currentlySpeakingTurnId, isListening]);

  const handleToggleListen = () => {
    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
    } else {
      stopSpeech(); // Stop TTS from playing audio into mic
      const started = recognizerRef.current?.start();
      if (started) {
        setWasVoiceInput(true);
      } else if (!isSpeechRecognitionSupported()) {
        setSpeechError('Speech recognition is not available in this browser. Please type or use WhisperFlo API.');
        setTimeout(() => setSpeechError(null), 4000);
      }
    }
  };

  const handleVoiceDone = () => {
    recognizerRef.current?.stop();
    setIsListening(false);
    if (customInputText.trim()) {
      injectCustomTurn(customInputText, customSpeaker, { fromVoiceInput: true });
      setCustomInputText('');
      setWasVoiceInput(false);
    }
  };

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

  const handleCustomSubmit = (e: React.FormEvent) => {
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

  const handlePresetClick = (text: string, speaker: 'senior' | 'agent') => {
    injectCustomTurn(text, speaker, { fromVoiceInput: false });
  };

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
      <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 sm:p-5 shadow-xs h-[460px] sm:h-[490px] flex flex-col min-h-0 overflow-hidden text-stone-900 transition-all">
        {/* Title & Engine Status */}
        <div className="flex items-center justify-between pb-3.5 border-b border-[#E7E2DB] mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#F5EFE6] border border-[#E2D7C5] flex items-center justify-center text-amber-800">
              <Heart className="w-4 h-4 fill-amber-700/20 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900">
                Morning Dialogue Stream
              </h3>
              <p className="text-xs text-stone-500">Awadhi-Hindi Companion Telephony</p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Auto-Speak Toggle */}
            <button
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                autoSpeak
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300 shadow-2xs'
                  : 'bg-stone-50 text-stone-600 border-[#DFDAD1]'
              }`}
              title="Toggle automatic speech on new incoming turns"
            >
              <Volume2 className="w-3 h-3 text-emerald-700" />
              <span>Voice: {autoSpeak ? 'On' : 'Muted'}</span>
            </button>

            {/* Engine Selector */}
            <div className="flex items-center bg-[#EFECE6] p-0.5 rounded-lg border border-[#DFDAD1] text-xs">
              <button
                onClick={() => setActiveTtsEngine('chrome')}
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                  activeTtsEngine === 'chrome'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Chrome Web Speech API (OS-Independent)"
              >
                Browser STT/TTS
              </button>
              <button
                onClick={() => setActiveTtsEngine('whisperflo')}
                className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold transition-all cursor-pointer ${
                  activeTtsEngine === 'whisperflo'
                    ? 'bg-white text-stone-900 shadow-2xs font-bold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="WhisperFlo Neural Telephony API"
              >
                WhisperFlo API
              </button>
            </div>

            {/* System Prompt Inspector Button */}
            <button
              onClick={() => setIsSystemPromptModalOpen(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-white hover:bg-stone-50 text-stone-700 border border-[#DFDAD1] shadow-2xs transition-colors cursor-pointer"
              title="View live LLM system prompt, clinical dossier, and progressive memory ledger"
            >
              <FileCode className="w-3 h-3 text-stone-500" />
              <span className="hidden sm:inline">System Prompt</span>
            </button>

            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border flex items-center gap-1 shadow-2xs ${
                callStatus === 'active'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-stone-50 text-stone-500 border-[#DFDAD1]'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  callStatus === 'active' ? 'bg-emerald-600 animate-pulse' : 'bg-stone-400'
                }`}
              ></span>
              {callStatus === 'active' ? 'LIVE' : 'IDLE'}
            </span>
          </div>
        </div>

        {/* Conversation Bubbles Stream */}
        <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto space-y-3.5 pr-1.5 scrollbar-thin">
          {conversationTurns.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center text-stone-400 text-sm space-y-2 text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center text-2xl">
                ☕
              </div>
              <p className="font-bold text-stone-700">
                {callStatus === 'idle'
                  ? 'Waiting for 08:30 AM morning call to begin...'
                  : 'Connecting with Ramesh Chandra over Jio PSTN...'}
              </p>
              <p className="text-xs text-stone-500 max-w-sm">
                {callStatus === 'idle'
                  ? 'Click [📞 Start Morning Call] above to connect and trigger the conversation!'
                  : 'Dialing +91 98101 23456...'}
              </p>
            </div>
          ) : (
            conversationTurns.map((turn) => {
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
                          title={isSpeakingThis ? "Stop speech" : `Read aloud via ${activeTtsEngine === 'chrome' ? 'Chrome Web Speech' : 'WhisperFlo'}`}
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
            })
          )}
        </div>

        {/* Quick Suggestion Chips for 1-Click Competition Audio Testing */}
        <div className="pt-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0 text-[10px]">
          <span className="text-stone-500 font-semibold shrink-0">Quick Rail Triggers:</span>
          {SIMULATION_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => triggerSimulationPreset(preset.id)}
              className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-white text-stone-800 border border-[#E7E2DB] shrink-0 font-medium transition-colors cursor-pointer flex items-center gap-1 shadow-2xs hover:border-emerald-500"
              title={`${preset.scenarioTitle}: ${preset.devanagariPrompt}`}
            >
              <span>{preset.icon}</span>
              <span className="font-semibold">{preset.buttonLabel}</span>
            </button>
          ))}
        </div>

        {/* Interactive Speech & Text Injection Bar */}
        <div className="pt-2.5 border-t border-[#E7E2DB] mt-1.5 space-y-1.5 shrink-0">
          <form onSubmit={handleCustomSubmit} className="flex items-center gap-2">
            {/* Speaker Toggle */}
            <div className="flex items-center bg-[#EFECE6] p-0.5 rounded-xl border border-[#DFDAD1] text-xs shrink-0">
              <button
                type="button"
                onClick={() => setCustomSpeaker('senior')}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                  customSpeaker === 'senior' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                }`}
              >
                👴🏼 Ramesh Ji
              </button>
              <button
                type="button"
                onClick={() => setCustomSpeaker('agent')}
                className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
                  customSpeaker === 'agent' ? 'bg-white text-stone-900 font-bold shadow-2xs' : 'text-stone-600'
                }`}
              >
                🌿 Companion
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
                  ? "Type Papa's speech (e.g. 'Haan beta, laal wali BP ki goli le li...')..."
                  : "Type Companion speech (e.g. 'Uncle, subah ka nashta ho gaya?')..."
              }
              className="flex-1 bg-[#FAF8F5] border border-[#DFDAD1] rounded-xl px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-sans"
            />

            {/* Live Hindi Voice Input Mic Button */}
            <button
              type="button"
              onClick={handleToggleListen}
              className={`p-2 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-2xs ${
                isListening
                  ? 'bg-rose-600 text-white border-rose-700 animate-pulse'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-[#DFDAD1]'
              }`}
              title={
                isListening
                  ? 'Listening in Hindi... Click to stop'
                  : 'Click to speak in Hindi (Web Speech STT)'
              }
            >
              <Mic className={`w-4 h-4 ${isListening ? 'text-white' : 'text-stone-600'}`} />
            </button>

            {/* Speak & Inject Button */}
            <button
              type="submit"
              disabled={!customInputText.trim()}
              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              title="Inject dialogue turn and speak aloud"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send & Speak</span>
            </button>
          </form>

          {/* Real-Time Listening Indicator */}
          {isListening && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 animate-fadeIn shadow-2xs">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
              <span className="font-extrabold text-xs">Listening in Hindi (बोलिए...)...</span>
              <span className="text-[11px] text-rose-600 font-mono hidden sm:inline">Uninterrupted: speaks continuously through pauses</span>
              <button
                type="button"
                onClick={handleVoiceDone}
                className="ml-auto px-2.5 py-0.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-bold shadow-xs cursor-pointer flex items-center gap-1"
                title="Finish speaking and submit dialogue turn"
              >
                <Send className="w-3 h-3" />
                <span>Done & Send</span>
              </button>
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

          <div className="flex items-center justify-between text-[10px] text-stone-400 px-1">
            <span>Supports Roman Hinglish ("namaste uncle") & Devanagari Hindi ("नमस्ते अंकल")</span>
            <span>
              Active: {
                activeTtsEngine === 'chrome'
                  ? '🌐 Chrome Web Speech API (OS-Independent hi-IN)'
                  : '☁️ WhisperFlo Neural API'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Voice & Audio Setup Modal */}
      <VoiceAudioIntegrationModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
      />

      {/* System Prompt & Guardrails Modal */}
      <SystemPromptModal
        isOpen={isSystemPromptModalOpen}
        onClose={() => setIsSystemPromptModalOpen(false)}
      />
    </>
  );
};
