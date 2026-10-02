import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  getVoiceDiagnostics,
  subscribeToVoices,
  speakWithBrowserTts,
  speakWithWhisperFloApi,
  stopSpeech,
  VoiceDiagnostic
} from '../../utils/speechService';
import {
  HindiSpeechRecognizer,
  isSpeechRecognitionSupported
} from '../../utils/speechRecognitionService';
import {
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Layers,
  Terminal,
  CheckCircle2,
  Info,
  Radio,
  ExternalLink,
  Copy,
  Check,
  Languages,
  Mic,
  MicOff,
  Globe
} from 'lucide-react';
import { hinglishToDevanagari, isDevanagari } from '../../utils/hinglishTransliterator';

interface VoiceAudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VoiceAudioIntegrationModal: React.FC<VoiceAudioModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    activeTtsEngine,
    setActiveTtsEngine,
    injectCustomTurn,
    speakSeniorTurns,
    setSpeakSeniorTurns
  } = useTelemetry();

  const [activeTab, setActiveTab] = useState<'chrome' | 'whisperflo' | 'custom' | 'hinglish'>('chrome');
  const [diagnostics, setDiagnostics] = useState<VoiceDiagnostic>(getVoiceDiagnostics());
  const [isTestingSpeech, setIsTestingSpeech] = useState(false);
  const [isTestingMic, setIsTestingMic] = useState(false);
  const [micTranscript, setMicTranscript] = useState('');
  const [micError, setMicError] = useState<string | null>(null);
  const [recognizer, setRecognizer] = useState<HindiSpeechRecognizer | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [hinglishTestText, setHinglishTestText] = useState('namaste uncle ji, subah ki lal goli le li?');

  useEffect(() => {
    if (!isOpen) return;

    // Refresh diagnostics
    setDiagnostics(getVoiceDiagnostics());

    // Subscribe to browser voice updates
    const unsubscribe = subscribeToVoices(() => {
      setDiagnostics(getVoiceDiagnostics());
    });

    return () => {
      unsubscribe();
      if (recognizer) {
        recognizer.stop();
      }
    };
  }, [isOpen, recognizer]);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const toggleMicTest = () => {
    if (isTestingMic) {
      recognizer?.stop();
      setIsTestingMic(false);
      return;
    }

    if (!isSpeechRecognitionSupported()) {
      setMicError('Speech recognition is not supported in this browser. Please use Chrome/Edge.');
      return;
    }

    setMicError(null);
    setMicTranscript('');
    const rec = new HindiSpeechRecognizer({
      onStart: () => setIsTestingMic(true),
      onResult: (text) => setMicTranscript(text),
      onEnd: () => setIsTestingMic(false),
      onError: (err) => {
        setMicError(err);
        setIsTestingMic(false);
      }
    });

    const started = rec.start();
    if (started) {
      setRecognizer(rec);
    }
  };

  const testVoice = (type: 'senior' | 'agent') => {
    setIsTestingSpeech(true);
    const testPhrase =
      type === 'senior'
        ? "अरे बिटिया, आज सुबह की बीपी वाली गोली खा ली है और चाय भी पी ली।"
        : "नमस्ते अंकल जी, डिलीवरी एजेंट 10 मिनट में पहुँचेगा। आपका दिन मंगलमय हो।";

    if (activeTtsEngine === 'whisperflo') {
      speakWithWhisperFloApi(testPhrase, {
        speaker: type,
        onEnd: () => setIsTestingSpeech(false),
        onError: () => setIsTestingSpeech(false)
      });
    } else {
      speakWithBrowserTts(testPhrase, {
        speaker: type,
        onEnd: () => setIsTestingSpeech(false),
        onError: () => setIsTestingSpeech(false)
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-stone-200/90 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-stone-900">
        {/* Header */}
        <div className="p-5 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-2xs">
              <Volume2 className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-stone-900">
                Speech & Telephony Integration (OS-Independent)
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Chrome Web Speech API (In-Browser), WhisperFlo Cloud API, or Custom Text Injection
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeech();
              if (recognizer) recognizer.stop();
              onClose();
            }}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 4 Options Tabs Bar */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 p-1.5 gap-1.5 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('chrome')}
            className={`py-2 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'chrome'
                ? 'bg-white text-emerald-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>1. Chrome API (OS-Free)</span>
            {activeTtsEngine === 'chrome' && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('whisperflo')}
            className={`py-2 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'whisperflo'
                ? 'bg-white text-indigo-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>☁️</span>
            <span>2. WhisperFlo API</span>
            {activeTtsEngine === 'whisperflo' && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`py-2 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-white text-amber-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>✍️</span>
            <span>3. Custom Input</span>
          </button>

          <button
            onClick={() => setActiveTab('hinglish')}
            className={`py-2 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer ${
              activeTab === 'hinglish'
                ? 'bg-white text-rose-900 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Languages className="w-3.5 h-3.5 text-rose-600" />
            <span>4. Hinglish → Hindi TTS</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-stone-700 leading-relaxed">
          {/* TAB 1: CHROME WEB SPEECH API */}
          {activeTab === 'chrome' && (
            <div className="space-y-4">
              {/* Quick Status Card */}
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span className="font-extrabold text-stone-900 text-sm">
                      Zero Setup — Chrome Web Speech API (OS-Independent)
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTtsEngine('chrome')}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      activeTtsEngine === 'chrome'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                    }`}
                  >
                    {activeTtsEngine === 'chrome' ? '✓ Currently Active' : 'Set as Active'}
                  </button>
                </div>
                <p className="text-stone-600 text-[11px]">
                  Runs natively inside the browser via standard{' '}
                  <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 font-mono text-emerald-900">
                    window.speechSynthesis
                  </code>{' '}
                  and{' '}
                  <code className="bg-white px-1.5 py-0.5 rounded border border-emerald-200 font-mono text-emerald-900">
                    webkitSpeechRecognition
                  </code>{' '}
                  (Hindi <code className="font-mono text-emerald-800">hi-IN</code>). Fully cross-platform across macOS, Linux, Windows, and Android with zero plugins required.
                </p>

                {/* Detected Voices */}
                <div className="pt-2 border-t border-emerald-200/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100">
                    <span className="text-stone-400 font-medium block">Detected Hindi Voice:</span>
                    <span className="font-bold text-stone-900 truncate block">
                      {diagnostics.hindiVoice || 'Google हिन्दी (hi-IN) / System Default'}
                    </span>
                  </div>
                  <div className="bg-white/80 rounded-xl p-2.5 border border-emerald-100">
                    <span className="text-stone-400 font-medium block">Indian English Voice:</span>
                    <span className="font-bold text-stone-900 truncate block">
                      {diagnostics.indianEnglishVoice || 'Google English (India) / System Default'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dual TTS + STT Test Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. TTS Test */}
                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                  <span className="font-bold text-stone-800 block text-xs flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>1. Test Text-to-Speech (TTS):</span>
                  </span>
                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => testVoice('senior')}
                      disabled={isTestingSpeech}
                      className="w-full bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold py-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                    >
                      <span>🔊 Papa (Awadhi Cadence, 0.82 Pitch)</span>
                    </button>
                    <button
                      onClick={() => testVoice('agent')}
                      disabled={isTestingSpeech}
                      className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold py-1.5 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-[11px]"
                    >
                      <span>🔊 Sambandh Companion Voice</span>
                    </button>
                  </div>
                </div>

                {/* 2. STT Test */}
                <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-2xl space-y-2">
                  <span className="font-bold text-stone-800 block text-xs flex items-center gap-1.5">
                    <Mic className="w-3.5 h-3.5 text-rose-600" />
                    <span>2. Test Hindi Recognition (STT):</span>
                  </span>
                  <button
                    onClick={toggleMicTest}
                    className={`w-full py-1.5 px-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer text-[11px] ${
                      isTestingMic
                        ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                        : 'bg-rose-50 hover:bg-rose-100 border border-rose-300 text-rose-900'
                    }`}
                  >
                    {isTestingMic ? (
                      <>
                        <MicOff className="w-3.5 h-3.5" />
                        <span>🔴 Listening... (बोलिए, Click to Stop)</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-3.5 h-3.5 text-rose-600" />
                        <span>🎙️ Start Hindi Speech Recognition</span>
                      </>
                    )}
                  </button>

                  <div className="min-h-[34px] px-2.5 py-1 bg-white rounded-lg border border-stone-200 text-[11px] text-stone-700 flex items-center">
                    {micTranscript ? (
                      <span className="font-semibold text-emerald-800">"{micTranscript}"</span>
                    ) : isTestingMic ? (
                      <span className="text-rose-500 italic">Listening for Hindi speech...</span>
                    ) : micError ? (
                      <span className="text-amber-600">{micError}</span>
                    ) : (
                      <span className="text-stone-400 italic">Click mic above and speak in Hindi</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Compact Code Snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800 text-xs">
                    Integration Code (<code className="font-mono text-emerald-700">src/utils/speechService.ts</code>):
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `// 1. Text-to-Speech (hi-IN)\nconst utterance = new SpeechSynthesisUtterance("अरे बेटा, सुबह की गोली खा ली है।");\nutterance.lang = "hi-IN";\nutterance.pitch = 0.82;\nwindow.speechSynthesis.speak(utterance);\n\n// 2. Speech-to-Text (hi-IN)\nconst rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();\nrec.lang = "hi-IN";\nrec.onresult = (e) => console.log(e.results[0][0].transcript);\nrec.start();`,
                        'code-browser'
                      )
                    }
                    className="flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    {copiedSnippet === 'code-browser' ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedSnippet === 'code-browser' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <pre className="bg-stone-900 text-stone-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
{`// 1. Text-to-Speech (hi-IN)
const utterance = new SpeechSynthesisUtterance("नमस्ते अंकल जी");
utterance.lang = 'hi-IN';
window.speechSynthesis.speak(utterance);

// 2. Speech-to-Text (hi-IN)
const rec = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
rec.lang = 'hi-IN';
rec.onresult = (e) => console.log(e.results[0][0].transcript);
rec.start();`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: WHISPERFLO API */}
          {activeTab === 'whisperflo' && (
            <div className="space-y-4">
              {/* Status Banner */}
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-indigo-700 animate-pulse" />
                    <span className="font-extrabold text-stone-900 text-sm">
                      WhisperFlo Neural Telephony Voice Stream
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveTtsEngine('whisperflo')}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                      activeTtsEngine === 'whisperflo'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-indigo-300 text-indigo-800 hover:bg-indigo-100'
                    }`}
                  >
                    {activeTtsEngine === 'whisperflo' ? '✓ Currently Active' : 'Set as Active'}
                  </button>
                </div>
                <p className="text-stone-600 text-[11px]">
                  Real-time neural bi-directional telephony API for inbound PSTN calls and streaming voice diarization.
                  Supports custom regional dialect acoustic weights for Awadhi-Hindi.
                </p>

                <div className="pt-2 border-t border-indigo-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-stone-500">API Key Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full ${
                      diagnostics.whisperFloKeyPresent
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {diagnostics.whisperFloKeyPresent
                      ? '✓ Live Key Detected'
                      : 'Emulating via Chrome Web Speech API (Offline Safe)'}
                  </span>
                </div>
              </div>

              {/* How to configure .env */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-800 text-xs">
                    Configuration in <code className="font-mono text-indigo-700">telemetry-console/.env</code>:
                  </span>
                  <button
                    onClick={() =>
                      handleCopy(
                        `VITE_WHISPERFLO_API_KEY=your_whisperflo_api_key_here\nVITE_WHISPERFLO_ENDPOINT=https://api.whisperflo.ai/v1/audio/speech`,
                        'code-env'
                      )
                    }
                    className="flex items-center gap-1 text-[11px] font-bold text-stone-500 hover:text-stone-800 cursor-pointer"
                  >
                    {copiedSnippet === 'code-env' ? (
                      <Check className="w-3.5 h-3.5 text-indigo-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedSnippet === 'code-env' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <pre className="bg-stone-900 text-stone-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
{`# Add this to telemetry-console/.env
VITE_WHISPERFLO_API_KEY="your_whisperflo_api_key_here"
VITE_WHISPERFLO_ENDPOINT="https://api.whisperflo.ai/v1/audio/speech"`}
                </pre>
              </div>

              {/* Webhook & Audio Dispatch Architecture */}
              <div className="space-y-2">
                <span className="font-bold text-stone-800 text-xs">
                  Dispatch Function (<code className="font-mono text-indigo-700">src/utils/speechService.ts</code>):
                </span>

                <pre className="bg-stone-900 text-stone-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
{`const response = await fetch("https://api.whisperflo.ai/v1/audio/speech", {
  method: "POST",
  headers: {
    "Authorization": \`Bearer \${import.meta.env.VITE_WHISPERFLO_API_KEY}\`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "whisperflo-v4.2-turbo",
    voice: speaker === "senior" ? "hi-IN-awadhi-elder" : "hi-IN-care-companion",
    input: text,
    speed: speaker === "senior" ? 0.9 : 1.0
  })
});

const audioBlob = await response.blob();
const audio = new Audio(URL.createObjectURL(audioBlob));
audio.play();`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOM TEXT INPUT & INJECTION */}
          {activeTab === 'custom' && (
            <div className="space-y-4">
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span className="font-extrabold text-stone-900 text-sm">
                    Interactive Dialogue & Speech Injector
                  </span>
                </div>
                <p className="text-stone-600 text-[11px]">
                  Allows judges or operators to type any custom sentence in Awadhi, Hindi, or English.
                  The sentence is dynamically appended to the conversation turns and spoken aloud immediately!
                </p>
              </div>

              {/* Papa's Speech Read-Out Policy Setting Card */}
              <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-3.5 flex items-center justify-between gap-3">
                <div className="space-y-0.5 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-stone-900">
                      👴 Papa's Typed Speech Audio Playback
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full border ${
                      speakSeniorTurns
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-stone-200 text-stone-600 border-stone-300'
                    }`}>
                      {speakSeniorTurns ? 'ENABLED' : 'MUTED'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    When enabled, typed messages and recommended prompts speak aloud in Ramesh Uncle's voice. When using the microphone (STT), Papa's speech is automatically muted to prevent audio echo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSpeakSeniorTurns(!speakSeniorTurns)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                    speakSeniorTurns
                      ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-700 shadow-2xs'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-300 shadow-2xs'
                  }`}
                >
                  {speakSeniorTurns ? 'Senior Voice: ON' : 'Senior Voice: OFF'}
                </button>
              </div>

              {/* Preset Quick-Test Prompts */}
              <div className="space-y-2">
                <span className="font-bold text-stone-800 text-xs">
                  ⚡ 1-Click Competition Demo Presets:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      injectCustomTurn(
                        "अरे बेटा, सुबह की बीपी वाली लाल गोली खा ली थी चाय के बाद।",
                        'senior'
                      );
                      onClose();
                    }}
                    className="p-3 bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-amber-900 text-[11px]">👴 Papa: Medication Taken</span>
                      <span className="text-[10px] text-amber-700 group-hover:underline">Inject & Speak →</span>
                    </div>
                    <p className="text-stone-600 text-[11px] italic">
                      "अरे बेटा, सुबह की बीपी वाली लाल गोली खा ली थी चाय के बाद।"
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      injectCustomTurn(
                        "अंकल जी, आज शाम को डॉक्टर वर्मा से वीडियो कॉल पर बीपी रिपोर्ट शेयर कर देंगे।",
                        'agent'
                      );
                      onClose();
                    }}
                    className="p-3 bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-900 text-[11px]">🌿 Agent: Doctor Follow-up</span>
                      <span className="text-[10px] text-emerald-700 group-hover:underline">Inject & Speak →</span>
                    </div>
                    <p className="text-stone-600 text-[11px] italic">
                      "अंकल जी, आज शाम को डॉक्टर वर्मा से वीडियो कॉल पर बीपी रिपोर्ट शेयर कर देंगे।"
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      injectCustomTurn(
                        "अरे बिटिया, आज सीने में हल्का भारीपन लग रहा है...",
                        'senior'
                      );
                      onClose();
                    }}
                    className="p-3 bg-rose-50/60 hover:bg-rose-100/80 border border-rose-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-rose-900 text-[11px]">⚠️ Papa: Chest Pain Escalation</span>
                      <span className="text-[10px] text-rose-700 group-hover:underline">Inject & Speak →</span>
                    </div>
                    <p className="text-stone-600 text-[11px] italic">
                      "अरे बिटिया, आज सीने में हल्का भारीपन लग रहा है..."
                    </p>
                  </button>

                  <button
                    onClick={() => {
                      injectCustomTurn(
                        "अंकल जी, बिल्कुल घबराइए मत। मैंने डॉक्टर वर्मा और आपकी बेटी मीनाक्षी को तुरंत अलर्ट भेज दिया है।",
                        'agent'
                      );
                      onClose();
                    }}
                    className="p-3 bg-indigo-50/60 hover:bg-indigo-100/80 border border-indigo-200 rounded-xl text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-indigo-900 text-[11px]">🚨 Agent: Emergency Triage</span>
                      <span className="text-[10px] text-indigo-700 group-hover:underline">Inject & Speak →</span>
                    </div>
                    <p className="text-stone-600 text-[11px] italic">
                      "अंकल जी, बिल्कुल घबराइए मत। मैंने डॉक्टर और बेटी को तुरंत अलर्ट भेज दिया है।"
                    </p>
                  </button>
                </div>
              </div>

              {/* Bottom Instructions */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600">
                You can also use the bottom input bar in the main conversation card at any time to type free-form sentences and speak them aloud!
              </div>
            </div>
          )}

          {/* TAB 4: HINGLISH TO HINDI TTS ENGINE */}
          {activeTab === 'hinglish' && (
            <div className="space-y-4">
              {/* Problem & Solution Card */}
              <div className="bg-rose-50/70 border border-rose-200 rounded-2xl p-4 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-rose-700" />
                  <span className="font-extrabold text-stone-900 text-sm">
                    How Hinglish & Hindi to Hindi Speech Works
                  </span>
                </div>
                <p className="text-stone-700 text-[11px] leading-relaxed">
                  <strong>The Core Problem:</strong> Standard TTS engines (like English voices) attempt to pronounce Romanized Hinglish (e.g. <em>"haan beta dawai le li"</em>) using English phonetics, resulting in mangled, robotic speech.
                </p>
                <p className="text-stone-700 text-[11px] leading-relaxed">
                  <strong>Sambandh's Built-In Solution:</strong> We created an automatic Indic phonetic transliterator (
                  <code className="bg-white px-1.5 py-0.5 rounded border border-rose-200 font-mono text-rose-900">
                    src/utils/hinglishTransliterator.ts
                  </code>
                  ). It detects Romanized text, phonetically maps it to Devanagari Hindi (
                  <em>"हाँ बेटा दवाई ले ली"</em>
                  ), and feeds it to our native Hindi acoustic voice (
                  <strong>Microsoft Swara / Madhur</strong> or <strong>WhisperFlo</strong>).
                </p>
              </div>

              {/* Interactive Live Hinglish Tester */}
              <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-4 space-y-3">
                <span className="font-bold text-stone-900 text-xs block">
                  🧪 Try Live Hinglish → Hindi Voice Conversion:
                </span>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-stone-500 font-bold uppercase tracking-wider block">
                    Type Hinglish (Roman Script):
                  </label>
                  <input
                    type="text"
                    value={hinglishTestText}
                    onChange={(e) => setHinglishTestText(e.target.value)}
                    placeholder="e.g. 'namaste uncle ji, subah ka nashta kar liya?'"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-sans focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                {/* Transliterated Output Box */}
                <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-extrabold text-amber-800 flex items-center gap-1">
                      <Languages className="w-3 h-3 text-amber-600" />
                      Devanagari Transliterated (Sent to Hindi Voice):
                    </span>
                    <span className="text-stone-400">Authentic Hindi Phonetics</span>
                  </div>
                  <p className="text-sm font-bold text-stone-900">
                    {hinglishToDevanagari(hinglishTestText) || '(Type something above...)'}
                  </p>
                </div>

                {/* Test Speech Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setIsTestingSpeech(true);
                      speakWithBrowserTts(hinglishTestText, {
                        speaker: 'senior',
                        onEnd: () => setIsTestingSpeech(false),
                        onError: () => setIsTestingSpeech(false)
                      });
                    }}
                    disabled={isTestingSpeech || !hinglishTestText.trim()}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs shadow-xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>🔊 Speak as Papa (Elder Voice)</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsTestingSpeech(true);
                      speakWithBrowserTts(hinglishTestText, {
                        speaker: 'agent',
                        onEnd: () => setIsTestingSpeech(false),
                        onError: () => setIsTestingSpeech(false)
                      });
                    }}
                    disabled={isTestingSpeech || !hinglishTestText.trim()}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs shadow-xs"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>🔊 Speak as Agent (Care Companion)</span>
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="pt-2 border-t border-stone-200 flex flex-wrap gap-1.5 text-[10px]">
                  <span className="text-stone-400 font-bold self-center">Try Samples:</span>
                  <button
                    onClick={() => setHinglishTestText('haan beta, subah ki bp wali lal goli kha li thi')}
                    className="px-2 py-0.5 bg-white border border-stone-200 rounded-lg text-stone-700 hover:bg-stone-100"
                  >
                    "haan beta, subah ki bp..."
                  </button>
                  <button
                    onClick={() => setHinglishTestText('bahu aayi thi delhi se, usne nayi dawai rakh di hai')}
                    className="px-2 py-0.5 bg-white border border-stone-200 rounded-lg text-stone-700 hover:bg-stone-100"
                  >
                    "bahu aayi thi delhi se..."
                  </button>
                  <button
                    onClick={() => setHinglishTestText('delhivery boy 10 minute me aayega, otp taiyar rakhiye')}
                    className="px-2 py-0.5 bg-white border border-stone-200 rounded-lg text-stone-700 hover:bg-stone-100"
                  >
                    "delhivery boy 10 min..."
                  </button>
                </div>
              </div>

              {/* Dedicated Indian Ecosystem Models Guide */}
              <div className="space-y-2">
                <span className="font-bold text-stone-900 text-xs block">
                  🇮🇳 Specialized Indic Voice Models You Can Link:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
                  <div className="bg-white border border-stone-200 rounded-xl p-3 space-y-1">
                    <span className="font-bold text-stone-900 block">1. Sarvam AI (Bulbul)</span>
                    <p className="text-stone-500 text-[10px]">
                      Trained in India specifically for code-mixed Hinglish and regional dialects. Direct text-to-speech with natural cadence.
                    </p>
                    <span className="text-[10px] font-bold text-indigo-600 block">REST API: api.sarvam.ai</span>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-xl p-3 space-y-1">
                    <span className="font-bold text-stone-900 block">2. Bhashini / AI4Bharat</span>
                    <p className="text-stone-500 text-[10px]">
                      Government of India National Language Translation Mission (NLTM). Open-source Indic-TTS models for all 22 scheduled languages.
                    </p>
                    <span className="text-[10px] font-bold text-emerald-600 block">bhashini.gov.in</span>
                  </div>

                  <div className="bg-white border border-stone-200 rounded-xl p-3 space-y-1">
                    <span className="font-bold text-stone-900 block">3. Chrome Web Speech API</span>
                    <p className="text-stone-500 text-[10px]">
                      Built into standard Chromium browsers with zero latency. Works offline and speaks natural Hindi when given Devanagari phonemes.
                    </p>
                    <span className="text-[10px] font-bold text-rose-600 block">Active in Sambandh</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-stone-500">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Active Audio Engine: <strong>{activeTtsEngine === 'chrome' ? 'Chrome Web Speech API (OS-Independent)' : 'WhisperFlo Neural API'}</strong></span>
          </div>

          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
