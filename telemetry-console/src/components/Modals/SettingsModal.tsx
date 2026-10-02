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
  PhoneForwarded
} from 'lucide-react';
import { getOpenRouterApiKey, testOpenRouterConnection } from '../../services/llmService';

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
    updateCaregiverConfig
  } = useTelemetry();

  // Local state for Brain tab
  const [activeProviderTab, setActiveProviderTab] = useState<LlmProvider>(
    selectedModelConfig.provider || 'gemini'
  );
  const [openRouterKey, setOpenRouterKey] = useState<string>(() => getOpenRouterApiKey());
  const [isKeySaved, setIsKeySaved] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  // Local state for Routing tab
  const [formData, setFormData] = useState(caregiverConfig);
  const [isConfigSaved, setIsConfigSaved] = useState(false);

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

  const filteredModels = SUPPORTED_LLM_MODELS.filter(
    (m) => m.provider === activeProviderTab
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-stone-200/90 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-stone-900">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-2xs">
              <Settings className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-stone-900">
                  System & Care Settings
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Active
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Configure AI reasoning models, voice synthesis, care wallet, and caregiver routing
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            title="Close Settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 p-1.5 gap-1.5 shrink-0 overflow-x-auto">
          <button
            onClick={() => setSettingsActiveTab('brain')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              settingsActiveTab === 'brain'
                ? 'bg-white text-indigo-950 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-indigo-600" />
            <span>AI Brain & Models</span>
          </button>

          <button
            onClick={() => setSettingsActiveTab('telephony')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              settingsActiveTab === 'telephony'
                ? 'bg-white text-emerald-950 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Voice & Telephony</span>
          </button>

          <button
            onClick={() => setSettingsActiveTab('wallet')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              settingsActiveTab === 'wallet'
                ? 'bg-white text-amber-950 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Wallet className="w-3.5 h-3.5 text-amber-600" />
            <span>Care Wallet & Cadence</span>
          </button>

          <button
            onClick={() => setSettingsActiveTab('routing')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap ${
              settingsActiveTab === 'routing'
                ? 'bg-white text-sky-950 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-sky-600" />
            <span>Logistics & Limits</span>
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
                {/* Chrome Web Speech */}
                <div
                  onClick={() => setActiveTtsEngine('chrome')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    activeTtsEngine === 'chrome'
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
                          <span>Chrome Web Speech API</span>
                          {activeTtsEngine === 'chrome' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </h4>
                        <span className="text-[10px] font-medium text-emerald-700">OS-Free & Instant</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Zero Cost
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Uses local client browser speech engine (Google hi-IN / Natural Hindi). Zero external network latency, 100% reliable for competitions.
                  </p>
                </div>

                {/* WhisperFlo Neural Telephony */}
                <div
                  onClick={() => setActiveTtsEngine('whisperflo')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    activeTtsEngine === 'whisperflo'
                      ? 'bg-emerald-50/70 border-emerald-500 shadow-xs ring-1 ring-emerald-500'
                      : 'bg-white border-stone-200 hover:border-stone-300 hover:bg-stone-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                        ☁️
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                          <span>WhisperFlo Neural Telephony</span>
                          {activeTtsEngine === 'whisperflo' && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                        </h4>
                        <span className="text-[10px] font-medium text-indigo-700">Studio Grade PSTN</span>
                      </div>
                    </div>
                    <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                      Ultra-Realistic
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Neural streaming telephony pipeline tailored with acoustic warmth for Indian elderly tones and regional Hindi inflection.
                  </p>
                </div>
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
