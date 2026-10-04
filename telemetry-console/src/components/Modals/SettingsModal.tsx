import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { SUPPORTED_LLM_MODELS } from '../../data/models';
import { LlmProvider } from '../../types/telemetry';
import {
  X,
  Brain,
  Sparkles,
  Zap,
  CheckCircle2,
  DollarSign,
  Key,
  Layers,
  ShieldCheck,
  Cpu,
  Info,
  Volume2,
  VolumeX,
  PhoneCall,
  Radio,
  Settings,
  MapPin,
  Building,
  Mail,
  Clock,
  Calendar,
  Wallet,
  Plus,
  AlertCircle,
  RefreshCw,
  Check,
  Save,
  SlidersHorizontal,
  PhoneForwarded,
  FileCode,
  Play,
  Square,
  User,
  Filter,
  Globe,
  Send,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import {
  getOpenRouterApiKey,
  testOpenRouterConnection,
  getGeminiApiKeyPool,
  getActiveGeminiKeyIndex,
  rotateGeminiApiKey
} from '../../services/llmService';
import {
  getTelegramCredentials,
  testTelegramBotConnection,
  sendTelegramMessage
} from '../../services/telegramBotService';
import {
  getActiveHindiVoiceSource,
  speakWithBrowserTts,
  speakWithGnaniStreaming,
  stopSpeech
} from '../../utils/speechService';
import {
  GNANI_VOICE_CATALOG,
  GnaniVoicePersona,
  getGnaniCompanionVoice,
  setGnaniCompanionVoice,
  getGnaniSeniorVoice,
  setGnaniSeniorVoice
} from '../../data/gnaniVoices';
import { playGnaniAudition } from '../../utils/gnaniVoiceService';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    settingsActiveTab,
    setSettingsActiveTab,
    selectedModelId,
    setSelectedModelId,
    selectedModelConfig,
    activeTtsEngine,
    setActiveTtsEngine,
    autoSpeak,
    setAutoSpeak,
    speakSeniorTurns,
    setSpeakSeniorTurns,
    cashWallet,
    topUpCashWallet,
    updateCallFrequency,
    caregiverConfig,
    updateCaregiverConfig,
    setIsSystemPromptModalOpen
  } = useTelemetry();

  const [isTestingSpeech, setIsTestingSpeech] = useState<boolean>(false);

  // Gnani Voice Persona State
  const [companionVoice, setCompanionVoice] = useState<string>(() => getGnaniCompanionVoice());
  const [seniorVoice, setSeniorVoice] = useState<string>(() => getGnaniSeniorVoice());
  const [auditioningVoiceId, setAuditioningVoiceId] = useState<string | null>(null);
  const [voiceLanguageFilter, setVoiceLanguageFilter] = useState<'all' | 'hi-IN' | 'en-IN'>('all');
  const [voiceCategoryFilter, setVoiceCategoryFilter] = useState<'all' | 'companion' | 'senior' | 'clinical'>('all');
  const [voiceRoleTab, setVoiceRoleTab] = useState<'companion' | 'senior'>('companion');

  // Local state for Brain tab
  const [activeProviderTab, setActiveProviderTab] = useState<LlmProvider>(
    selectedModelConfig.provider || 'gemini'
  );
  const [openRouterKey, setOpenRouterKey] = useState<string>(() => getOpenRouterApiKey());
  const [isKeySaved, setIsKeySaved] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Gemini Multi-Key Pool State
  const [geminiKeyIndex, setGeminiKeyIndex] = useState<number>(() => getActiveGeminiKeyIndex());
  const geminiPool = getGeminiApiKeyPool();

  const handleRotateGeminiKey = () => {
    rotateGeminiApiKey();
    setGeminiKeyIndex(getActiveGeminiKeyIndex());
  };

  // Local state for Routing & Telegram tab
  const [formData, setFormData] = useState(caregiverConfig);
  const [isConfigSaved, setIsConfigSaved] = useState(false);
  const telegramCreds = getTelegramCredentials();
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [telegramTestResult, setTelegramTestResult] = useState<{ success: boolean; message: string; botUsername?: string } | null>(null);
  const [isSendingTelegramTestMsg, setIsSendingTelegramTestMsg] = useState(false);
  const [telegramSendFeedback, setTelegramSendFeedback] = useState<string | null>(null);

  const handleTestTelegramConnection = async () => {
    setIsTestingTelegram(true);
    setTelegramTestResult(null);
    const info = await testTelegramBotConnection();
    setIsTestingTelegram(false);
    if (info.success) {
      setTelegramTestResult({
        success: true,
        message: `Connected successfully to ${info.botName || 'Telegram Bot'} (${info.botUsername || `@bot_${info.botId}`})`,
        botUsername: info.botUsername
      });
    } else {
      setTelegramTestResult({
        success: false,
        message: info.error || 'Failed to authenticate with Telegram Bot API'
      });
    }
  };

  const handleSendTelegramTestMsg = async () => {
    setIsSendingTelegramTestMsg(true);
    setTelegramSendFeedback(null);
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const result = await sendTelegramMessage(
      `🔔 <b>Project Sambandh Diagnostic Ping (${now} IST)</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━━\n• <b>Caregiver:</b> Priya Sharma (+91 98765 43210)\n• <b>Senior:</b> Ramesh Chandra (Rohini Circle)\n• <b>Channel:</b> Live Telegram Bot Bridge\n\n✅ <i>Connection verified. High-priority medication refill approvals and daily check-in briefings are linked to this chat.</i>`,
      { parseMode: 'HTML' }
    );
    setIsSendingTelegramTestMsg(false);
    if (result.success) {
      setTelegramSendFeedback(`Test message dispatched! (Message ID: ${result.messageId}, Latency: ${result.latencyMs}ms)`);
    } else {
      setTelegramSendFeedback(`Dispatch failed: ${result.error}`);
    }
    setTimeout(() => setTelegramSendFeedback(null), 5000);
  };

  // Sync formData when caregiverConfig changes
  React.useEffect(() => {
    setFormData(caregiverConfig);
  }, [caregiverConfig]);

  if (!isSettingsModalOpen) return null;

  const handleSaveKey = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sambandh_openrouter_key', openRouterKey);
    setIsKeySaved(true);
    setTimeout(() => setIsKeySaved(false), 2000);
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    const res = await testOpenRouterConnection(openRouterKey);
    setIsTesting(false);
    setTestResult(res);
  };

  const handleSaveRoutingConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateCaregiverConfig(formData);
    setIsConfigSaved(true);
    setTimeout(() => setIsConfigSaved(false), 2200);
  };

  const handleTestSpeech = async () => {
    if (isTestingSpeech) {
      stopSpeech();
      setIsTestingSpeech(false);
      return;
    }
    setIsTestingSpeech(true);
    const testText = "नमस्ते अंकल जी, आपका सुबह का नाश्ता और बीपी की दवाई हो गई?";
    if (activeTtsEngine === 'browser') {
      await speakWithBrowserTts(testText, { speaker: 'agent' });
    } else {
      await speakWithGnaniStreaming(testText, { speaker: 'agent', voiceName: companionVoice });
    }
    setIsTestingSpeech(false);
  };

  const handleAuditionVoice = async (voice: GnaniVoicePersona) => {
    if (auditioningVoiceId === voice.id) {
      stopSpeech();
      setAuditioningVoiceId(null);
      return;
    }
    setAuditioningVoiceId(voice.id);
    try {
      await playGnaniAudition(voice.id, voice.samplePhrase, {
        onEnd: () => setAuditioningVoiceId(null),
        onError: () => setAuditioningVoiceId(null)
      });
    } catch {
      setAuditioningVoiceId(null);
    }
  };

  const handleSelectVoice = (voiceId: string, role: 'companion' | 'senior') => {
    if (role === 'companion') {
      setCompanionVoice(voiceId);
      setGnaniCompanionVoice(voiceId);
    } else {
      setSeniorVoice(voiceId);
      setGnaniSeniorVoice(voiceId);
    }
  };

  const filteredModels = SUPPORTED_LLM_MODELS.filter(
    (m) => m.provider === activeProviderTab
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-stone-200/90 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] sm:max-h-[90vh] text-stone-900">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-2xs shrink-0">
              <Settings className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-lg font-extrabold text-stone-900">
                  System & Care Settings
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Active
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-stone-500 font-medium line-clamp-1">
                Configure AI reasoning models, voice synthesis, care wallet, and caregiver routing
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer shrink-0"
            title="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 p-1 sm:p-1.5 gap-1 sm:gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSettingsActiveTab('brain')}
            className={`flex-1 py-2 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
              settingsActiveTab === 'brain'
                ? 'bg-white text-indigo-950 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
            <span>AI Brain <span className="hidden sm:inline">& Models</span></span>
          </button>

          <button
            onClick={() => setSettingsActiveTab('telephony')}
            className={`flex-1 py-2 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
              settingsActiveTab === 'telephony'
                ? 'bg-white text-emerald-950 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Voice <span className="hidden sm:inline">& Telephony</span></span>
          </button>

          <button
            onClick={() => setSettingsActiveTab('wallet')}
            className={`flex-1 py-2 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
              settingsActiveTab === 'wallet'
                ? 'bg-white text-amber-950 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Wallet <span className="hidden sm:inline">& Cadence</span></span>
          </button>

          <button
            onClick={() => setSettingsActiveTab('routing')}
            className={`flex-1 py-2 px-2.5 sm:px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer whitespace-nowrap ${
              settingsActiveTab === 'routing'
                ? 'bg-white text-sky-950 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>Logistics <span className="hidden sm:inline">& Telegram</span></span>
          </button>
        </div>

        {/* Tab 1: AI Brain & Model Selection */}
        {settingsActiveTab === 'brain' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Provider Pill Switcher */}
            <div className="flex items-center justify-between p-3 bg-stone-50 rounded-2xl border border-stone-200">
              <div className="space-y-0.5">
                <span className="text-xs font-extrabold text-stone-800">Inference Provider</span>
                <p className="text-[11px] text-stone-500">Select model provider for elder conversational reasoning</p>
              </div>
              <div className="flex items-center bg-stone-200/70 p-1 rounded-xl">
                <button
                  onClick={() => setActiveProviderTab('gemini')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeProviderTab === 'gemini'
                      ? 'bg-white text-stone-900 shadow-2xs font-extrabold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  Google Gemini (Built-in)
                </button>
                <button
                  onClick={() => setActiveProviderTab('openrouter')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeProviderTab === 'openrouter'
                      ? 'bg-white text-stone-900 shadow-2xs font-extrabold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  OpenRouter (Multi-LLM)
                </button>
              </div>
            </div>

            {/* Google Gemini Multi-Key Rotation Pool Card */}
            {activeProviderTab === 'gemini' && (
              <div className="bg-gradient-to-br from-emerald-50/70 via-teal-50/40 to-stone-50 border border-emerald-200/90 rounded-2xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      ⚡
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-stone-900 block">
                        Gemini Multi-Key Failover Pool
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">
                        Automatic rotation upon HTTP 429 / Quota Exceeded
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRotateGeminiKey}
                    className="px-2.5 py-1 bg-white border border-emerald-300 hover:bg-emerald-50 text-emerald-800 rounded-xl text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3 text-emerald-600" />
                    <span>Rotate Key</span>
                  </button>
                </div>

                {/* Keys Pool List */}
                <div className="space-y-2">
                  {geminiPool.map((item, idx) => {
                    const isActive = idx === geminiKeyIndex;
                    const maskedKey = item.key
                      ? `${item.key.slice(0, 7)}••••••••${item.key.slice(-6)}`
                      : '(not configured)';

                    return (
                      <div
                        key={item.label}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all ${
                          isActive
                            ? 'bg-white border-emerald-500 shadow-2xs ring-1 ring-emerald-400'
                            : 'bg-stone-50/80 border-stone-200 text-stone-600'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              isActive ? 'bg-emerald-500 animate-pulse' : 'bg-stone-300'
                            }`}
                          />
                          <span className="font-bold text-stone-800 text-[11px] shrink-0">
                            {item.label}:
                          </span>
                          <span className="font-mono text-[10px] text-stone-500 truncate">
                            {maskedKey}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {isActive ? (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                              <Check className="w-2.5 h-2.5 stroke-[3]" /> Active Key
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-stone-100 text-stone-500 border border-stone-200">
                              Standby Backup
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-2.5 bg-emerald-100/50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <span>
                    Zero-Interruption Guarantee: If a live conversation turn hits rate limit, the client seamlessly retries on the next standby key in &lt;100ms.
                  </span>
                </div>
              </div>
            )}

            {/* OpenRouter API Key Setup Card (Only shown if openrouter selected) */}
            {activeProviderTab === 'openrouter' && (
              <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/40 border border-indigo-200/80 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-indigo-700" />
                    <span className="font-extrabold text-xs text-indigo-950">
                      OpenRouter API Key (BYOK)
                    </span>
                  </div>
                  <span className="text-[10px] text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-full font-mono">
                    Stored in browser localStorage
                  </span>
                </div>

                <form onSubmit={handleSaveKey} className="flex gap-2">
                  <input
                    type="password"
                    value={openRouterKey}
                    onChange={(e) => setOpenRouterKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="flex-1 bg-white border border-indigo-200 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                  >
                    {isKeySaved ? <Check className="w-3.5 h-3.5" /> : null}
                    <span>{isKeySaved ? 'Saved!' : 'Save'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={isTesting || !openRouterKey}
                    className="px-3 py-1.5 bg-white border border-indigo-200 hover:bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                    <span>Test Ping</span>
                  </button>
                </form>

                {testResult && (
                  <div
                    className={`text-xs p-2.5 rounded-xl border flex items-center gap-2 ${
                      testResult.success
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border-rose-200'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    )}
                    <span>{testResult.message}</span>
                  </div>
                )}
              </div>
            )}

            {/* Model Selection Grid */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider block">
                Available Models ({activeProviderTab.toUpperCase()})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {filteredModels.map((model) => {
                  const isSelected = model.id === selectedModelId;
                  return (
                    <div
                      key={model.id}
                      onClick={() => setSelectedModelId(model.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-2.5 relative ${
                        isSelected
                          ? 'bg-indigo-50/70 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                          : 'bg-white border-stone-200/90 hover:border-stone-300 hover:bg-stone-50/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-xs text-stone-900 truncate flex items-center gap-1.5">
                            <span>{model.name}</span>
                            {isSelected && (
                              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            )}
                          </h4>
                          <span className="text-[10px] text-stone-400 font-mono truncate block">
                            {model.id}
                          </span>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shrink-0 ${
                            model.costTier === 'Free'
                              ? 'bg-emerald-100 text-emerald-800'
                              : model.costTier === 'Low Cost'
                              ? 'bg-sky-100 text-sky-800'
                              : model.costTier === 'Standard'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}
                        >
                          {model.costTier}
                        </span>
                      </div>

                      <p className="text-[11px] text-stone-600 leading-snug line-clamp-2">
                        {model.description}
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium pt-1 border-t border-stone-100">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3 text-amber-600" />
                          <span className="truncate max-w-[170px]">{model.costDescription}</span>
                        </span>
                        <span className="font-mono">{model.contextWindow}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live System Prompt Trigger Card */}
            <div className="p-3.5 bg-gradient-to-r from-stone-50 to-indigo-50/50 rounded-2xl border border-indigo-100 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                  <FileCode className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-stone-900 block">JIT System Prompt & Clinical Guardrails</span>
                  <span className="text-[11px] text-stone-500">Inspect dynamic assembly of prompt slices, safety tripwires, and memory ledger</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsSettingsModalOpen(false);
                  setIsSystemPromptModalOpen(true);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <span>Inspect Prompt</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Voice & Telephony Engine */}
        {settingsActiveTab === 'telephony' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Primary TTS Engine Selector */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider block">
                Active Speech Synthesis Engine
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Browser Web Speech */}
                <div
                  onClick={() => setActiveTtsEngine('browser')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    activeTtsEngine === 'browser'
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                        🌐
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                          <span>Browser Web Speech API</span>
                          {activeTtsEngine === 'browser' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </h4>
                        <span className="text-[10px] font-medium text-emerald-700">OS-Free & Offline</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Zero Cost
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Uses local client browser speech engine (Google hi-IN / Natural Hindi). Zero external network latency, 100% reliable for offline operation.
                  </p>
                </div>

                {/* Gnani.ai Full-Duplex Indic Carrier Rail */}
                <div
                  onClick={() => setActiveTtsEngine('gnani')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    activeTtsEngine === 'gnani'
                      ? 'bg-indigo-50/70 border-indigo-500 shadow-xs ring-1 ring-indigo-500'
                      : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                        🎙️
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                          <span>Gnani.ai Indic Voice Rail</span>
                          {activeTtsEngine === 'gnani' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                          )}
                        </h4>
                        <span className="text-[10px] font-medium text-indigo-700">Full-Duplex Telephony</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                      Zero-Pause
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Carrier-grade streaming telephony pipeline with Awadhi acoustic models, sample-accurate gapless AudioContext queue, and sub-50ms acoustic barge-in.
                  </p>
                </div>
              </div>
            </div>

            {/* Active Hindi Voice Detection & Test Speech Player */}
            <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="text-xs font-extrabold text-stone-800 block">
                    Active Hindi Acoustic Voice
                  </span>
                  <p className="text-[11px] text-stone-500">
                    Source voice endpoint used for speech synthesis
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleTestSpeech}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                    isTestingSpeech
                      ? 'bg-rose-600 hover:bg-rose-700 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  {isTestingSpeech ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isTestingSpeech ? 'Stop Speech' : 'Audition Sample Voice'}</span>
                </button>
              </div>

              <div className="flex items-center gap-2.5 p-2.5 bg-white rounded-xl border border-stone-200 text-xs">
                {(() => {
                  const voiceInfo = getActiveHindiVoiceSource('agent', activeTtsEngine);
                  return (
                    <>
                      <span className="text-lg">{voiceInfo.source === 'browser' ? '🌐' : '🎙️'}</span>
                      <div className="flex-1 min-w-0">
                        <span className="font-bold text-stone-900 block truncate">{voiceInfo.name}</span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          Dialect: hi-IN (Hindi India) · Style: Warm Companion
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                        Active
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Gnani Voice Persona Directory & Selection Matrix */}
            <div className="space-y-3.5 pt-2 border-t border-stone-200">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-stone-800 uppercase tracking-wider block">
                      Gnani.ai Voice Persona Directory (timbre-v2.5)
                    </span>
                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200">
                      Indic Acoustics
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Select distinct voice personas for Saarthi (Agent) and Papa with live sample auditioning
                  </p>
                </div>
              </div>

              {/* Persona Target Role Switcher (Companion vs Senior) */}
              <div className="grid grid-cols-2 gap-2 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
                <button
                  type="button"
                  onClick={() => setVoiceRoleTab('companion')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    voiceRoleTab === 'companion'
                      ? 'bg-white text-indigo-950 shadow-xs border border-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>👩 Companion Voice:</span>
                  <span className="font-extrabold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200">
                    {companionVoice}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setVoiceRoleTab('senior')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    voiceRoleTab === 'senior'
                      ? 'bg-white text-amber-950 shadow-xs border border-stone-200'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>👴 Senior (Papa) Voice:</span>
                  <span className="font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    {seniorVoice}
                  </span>
                </button>
              </div>

              {/* Filters Toolbar */}
              <div className="flex items-center justify-between flex-wrap gap-2 text-xs bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-stone-400" /> Dialect:
                  </span>
                  {(['all', 'hi-IN', 'en-IN'] as const).map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setVoiceLanguageFilter(lang)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                        voiceLanguageFilter === lang
                          ? 'bg-stone-900 text-white shadow-2xs'
                          : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                      }`}
                    >
                      {lang === 'all' ? 'All Languages' : lang === 'hi-IN' ? 'Hindi (hi-IN)' : 'English / Hinglish (en-IN)'}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-stone-500 flex items-center gap-1">
                    <Filter className="w-3 h-3 text-stone-400" /> Category:
                  </span>
                  {(['all', 'companion', 'senior', 'clinical'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setVoiceCategoryFilter(cat)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer capitalize ${
                        voiceCategoryFilter === cat
                          ? 'bg-indigo-700 text-white shadow-2xs'
                          : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Personas Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {GNANI_VOICE_CATALOG.filter((voice) => {
                  if (voiceLanguageFilter !== 'all' && voice.languageCode !== voiceLanguageFilter) return false;
                  if (voiceCategoryFilter !== 'all' && voice.category !== voiceCategoryFilter) return false;
                  return true;
                }).map((voice) => {
                  const isSelectedForCurrentRole =
                    voiceRoleTab === 'companion'
                      ? companionVoice === voice.id
                      : seniorVoice === voice.id;

                  const isAuditioning = auditioningVoiceId === voice.id;

                  return (
                    <div
                      key={voice.id}
                      className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between gap-2.5 ${
                        isSelectedForCurrentRole
                          ? 'bg-indigo-50/70 border-indigo-500 ring-1 ring-indigo-400 shadow-xs'
                          : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-2xs'
                      }`}
                    >
                      <div>
                        {/* Voice Header */}
                        <div className="flex items-start justify-between gap-1.5 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{voice.gender === 'female' ? '👩' : '👨'}</span>
                            <div>
                              <h5 className="font-extrabold text-xs text-stone-900 leading-tight">
                                {voice.name}
                              </h5>
                              <span className="text-[10px] text-indigo-700 font-semibold">
                                {voice.personaTitle}
                              </span>
                            </div>
                          </div>
                          {isSelectedForCurrentRole && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-0.5 shrink-0">
                              <Check className="w-2.5 h-2.5 stroke-[3]" /> Active
                            </span>
                          )}
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-1.5 flex-wrap mb-2">
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                            {voice.languageLabel}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200 capitalize">
                            {voice.gender}
                          </span>
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200 capitalize">
                            {voice.category}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-[11px] text-stone-600 leading-snug line-clamp-3 mb-2">
                          {voice.description}
                        </p>

                        {/* Sample Phrase Quote */}
                        <div className="p-2 bg-stone-50 rounded-xl border border-stone-200/70 text-[10px] text-stone-700 italic">
                          "{voice.samplePhrase}"
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={() => handleAuditionVoice(voice)}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                            isAuditioning
                              ? 'bg-rose-600 text-white hover:bg-rose-700'
                              : 'bg-stone-100 text-stone-800 hover:bg-stone-200 border border-stone-200'
                          }`}
                        >
                          {isAuditioning ? (
                            <>
                              <Square className="w-2.5 h-2.5 fill-current" />
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-2.5 h-2.5 fill-current text-indigo-600" />
                              <span>Audition Voice</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSelectVoice(voice.id, voiceRoleTab)}
                          disabled={isSelectedForCurrentRole}
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            isSelectedForCurrentRole
                              ? 'bg-indigo-600 text-white cursor-default shadow-xs'
                              : 'bg-stone-900 text-white hover:bg-stone-800 shadow-2xs'
                          }`}
                        >
                          {isSelectedForCurrentRole ? (
                            <>
                              <Check className="w-3 h-3 stroke-[2.5]" />
                              <span>Active Voice</span>
                            </>
                          ) : (
                            <span>Set as {voiceRoleTab === 'companion' ? 'Companion' : 'Senior'}</span>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Speech Toggles */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider block">
                Speech Playback Behavior
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-stone-900 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Auto-Speak Dialogue Turns Aloud</span>
                    </span>
                    <p className="text-[11px] text-stone-500">
                      When Sambandh speaks, audio is synthesized automatically without needing manual play button clicks
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoSpeak(!autoSpeak)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      autoSpeak
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-stone-200 text-stone-600 border-stone-300'
                    }`}
                  >
                    {autoSpeak ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
                  <div className="space-y-0.5">
                    <span className="text-xs font-extrabold text-stone-900 flex items-center gap-1.5">
                      <span>👴</span>
                      <span>Speak Ramesh Uncle's Spoken Turns</span>
                    </span>
                    <p className="text-[11px] text-stone-500">
                      Synthesize elder voice turns to simulate a realistic two-way live telephone conversation
                    </p>
                  </div>
                  <button
                    onClick={() => setSpeakSeniorTurns(!speakSeniorTurns)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      speakSeniorTurns
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                        : 'bg-stone-200 text-stone-600 border-stone-300'
                    }`}
                  >
                    {speakSeniorTurns ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
              </div>
            </div>

            {/* Carrier Telephony Specs */}
            <div className="p-3.5 bg-stone-100/80 rounded-2xl border border-stone-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-stone-800">Telephony Trunk Specification:</span>
                <span className="text-stone-600">Jio PSTN Trunk · OPUS HD Codec · 20ms jitter buffer</span>
              </div>
              <span className="text-[10px] font-mono bg-stone-200 px-2 py-0.5 rounded text-stone-700">
                100% Deterministic
              </span>
            </div>
          </div>
        )}

        {/* Tab 3: Care Wallet & Cadence */}
        {settingsActiveTab === 'wallet' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Wallet Balance Hero Card */}
            <div className="bg-gradient-to-br from-amber-500/10 via-amber-50 to-stone-50 border border-amber-200 rounded-3xl p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center text-2xl shadow-xs">
                    💳
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                      Fiduciary Care Wallet Balance
                    </span>
                    <h3 className="text-2xl font-extrabold text-stone-900">
                      ₹{cashWallet.balanceInr.toLocaleString('en-IN')}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => topUpCashWallet(500)}
                    className="px-3 py-1.5 bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 rounded-xl text-xs font-extrabold shadow-2xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-600" />
                    <span>+₹500</span>
                  </button>
                  <button
                    onClick={() => topUpCashWallet(1000)}
                    className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold shadow-xs transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+₹1,000</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-amber-200/60 text-xs">
                <div>
                  <span className="text-stone-500 block text-[11px]">Low-Balance Alert Threshold</span>
                  <span className="font-extrabold text-stone-800">
                    ₹{cashWallet.lowBalanceThresholdInr.toLocaleString('en-IN')} (Automatic Telegram alert to Priya)
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Last Wallet Activity</span>
                  <span className="font-bold text-stone-700">
                    {cashWallet.lastDeductionReason || 'Wallet initialized with family care stipend'}
                  </span>
                </div>
              </div>
            </div>

            {/* Scheduled Call Frequency Selector */}
            <div className="space-y-3">
              <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider block">
                Daily Check-In Call Frequency
              </span>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => updateCallFrequency(freq)}
                    className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                      cashWallet.callFrequencyPerDay === freq
                        ? 'bg-amber-50/80 border-amber-500 ring-1 ring-amber-500 shadow-xs'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <span className="text-lg font-extrabold text-stone-900 block">{freq}x / Day</span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {freq === 1 ? '08:30 AM Morning' : freq === 2 ? 'Morning + Evening' : 'Morning + Midday + Night'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Logistics Routing & Order Limits */}
        {settingsActiveTab === 'routing' && (
          <form onSubmit={handleSaveRoutingConfig} className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Elder Residence Address */}
            <div className="space-y-2">
              <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                <span>Elder Pre-Fed Home Address (Delhivery & Quick-Commerce Destination)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                <div className="sm:col-span-3">
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={formData.elderHomeAddress}
                    onChange={(e) => setFormData({ ...formData, elderHomeAddress: e.target.value })}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">PIN Code</label>
                  <input
                    type="text"
                    value={formData.elderPinCode}
                    onChange={(e) => setFormData({ ...formData, elderPinCode: e.target.value })}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Nearest Partner Pharmacy Address & Dispatch Email */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                <span>Nearest Partner Pharmacy (Netmeds / Apollo DarkStore)</span>
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Pharmacy Hub Name</label>
                  <input
                    type="text"
                    value={formData.nearestPharmacyName}
                    onChange={(e) => setFormData({ ...formData, nearestPharmacyName: e.target.value })}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Pharmacy Dispatch Email</label>
                  <input
                    type="email"
                    value={formData.nearestPharmacyEmail}
                    onChange={(e) => setFormData({ ...formData, nearestPharmacyEmail: e.target.value })}
                    className="w-full bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-bold text-stone-600 block mb-1">Pharmacy Physical Location & Hub PIN</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.nearestPharmacyAddress}
                      onChange={(e) => setFormData({ ...formData, nearestPharmacyAddress: e.target.value })}
                      className="flex-1 bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
                      required
                    />
                    <input
                      type="text"
                      value={formData.nearestPharmacyPinCode}
                      onChange={(e) => setFormData({ ...formData, nearestPharmacyPinCode: e.target.value })}
                      className="w-24 bg-white border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-2xs"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Single Order Ceiling Limit */}
            <div className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-xs font-extrabold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                <span>Single Order Financial Ceiling (Fiduciary Guardrail)</span>
              </span>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-2 text-stone-400 font-bold text-xs">₹</span>
                  <input
                    type="number"
                    value={formData.orderTotalLimitInr}
                    onChange={(e) => setFormData({ ...formData, orderTotalLimitInr: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-200 rounded-xl pl-7 pr-3 py-2 text-xs font-mono font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
                    required
                  />
                </div>
                <span className="text-[11px] text-stone-500 max-w-xs">
                  Any automated Netmeds refill request exceeding this amount is intercepted and routed to Priya for 1-tap Telegram sign-off.
                </span>
              </div>
            </div>

            {/* Live Telegram Bot Bridge & Diagnostics */}
            <div className="bg-gradient-to-br from-sky-50/80 via-blue-50/40 to-stone-50 border border-sky-200/90 rounded-2xl p-4 space-y-3.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-sky-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    ✈️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-xs text-stone-900">
                        Live Telegram Caregiver Bot Bridge
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        telegramCreds.isConfigured
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-rose-100 text-rose-800 border-rose-300'
                      }`}>
                        {telegramCreds.isConfigured ? 'Live Configured' : 'Missing Token'}
                      </span>
                    </div>
                    <span className="text-[10px] text-stone-500 font-medium">
                      Dispatches 1-tap medication approvals, post-call daily care briefings, and critical alerts
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTestTelegramConnection}
                    disabled={isTestingTelegram || !telegramCreds.botToken}
                    className="px-2.5 py-1.5 bg-white border border-sky-300 hover:bg-sky-50 text-sky-800 rounded-xl text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isTestingTelegram ? (
                      <RefreshCw className="w-3 h-3 animate-spin text-sky-600" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 text-sky-600" />
                    )}
                    <span>Test Bot API</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendTelegramTestMsg}
                    disabled={isSendingTelegramTestMsg || !telegramCreds.isConfigured}
                    className="px-2.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-[11px] font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isSendingTelegramTestMsg ? (
                      <RefreshCw className="w-3 h-3 animate-spin" />
                    ) : (
                      <Send className="w-3 h-3" />
                    )}
                    <span>Send Test Ping</span>
                  </button>
                </div>
              </div>

              {/* Bot Details & Chat ID Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-sky-100">
                  <span className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider">
                    Telegram Bot Token
                  </span>
                  <span className="font-mono text-[11px] text-stone-700 truncate block">
                    {telegramCreds.botToken
                      ? `${telegramCreds.botToken.slice(0, 10)}••••••••${telegramCreds.botToken.slice(-8)}`
                      : 'Not configured in .env'}
                  </span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-sky-100">
                  <span className="text-[10px] font-bold text-stone-400 block uppercase tracking-wider">
                    Caregiver Telegram Chat ID (Priya)
                  </span>
                  <span className="font-mono text-[11px] font-bold text-sky-900">
                    {telegramCreds.chatId || 'Not configured'}
                  </span>
                </div>
              </div>

              {/* Connection Test Result */}
              {telegramTestResult && (
                <div
                  className={`text-xs p-2.5 rounded-xl border flex items-center gap-2 ${
                    telegramTestResult.success
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  {telegramTestResult.success ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  )}
                  <span className="leading-snug">{telegramTestResult.message}</span>
                </div>
              )}

              {/* Send Feedback Message */}
              {telegramSendFeedback && (
                <div className="text-xs p-2.5 rounded-xl border bg-blue-50 text-blue-900 border-blue-200 flex items-center gap-2">
                  <Send className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{telegramSendFeedback}</span>
                </div>
              )}
            </div>

            {/* Form Save Button */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
              {isConfigSaved && (
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Logistics updated & synced!</span>
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Save Logistics Configuration</span>
              </button>
            </div>
          </form>
        )}

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200/80 bg-stone-50/70 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Fiduciary guardrails active · All settings are live</span>
          </span>
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
