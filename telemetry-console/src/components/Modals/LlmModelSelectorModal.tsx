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
  Info
} from 'lucide-react';

import { getOpenRouterApiKey, testOpenRouterConnection } from '../../services/llmService';

export const LlmModelSelectorModal: React.FC = () => {
  const {
    selectedModelId,
    setSelectedModelId,
    selectedModelConfig,
    isLlmModalOpen,
    setIsLlmModalOpen
  } = useTelemetry();

  const [activeProviderTab, setActiveProviderTab] = useState<LlmProvider>(
    selectedModelConfig.provider || 'openrouter'
  );
  const [openRouterKey, setOpenRouterKey] = useState<string>(() => getOpenRouterApiKey());
  const [isKeySaved, setIsKeySaved] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  if (!isLlmModalOpen) return null;

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

  const filteredModels = SUPPORTED_LLM_MODELS.filter(
    (m) => m.provider === activeProviderTab
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-stone-200/90 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-stone-900">
        {/* Header */}
        <div className="p-5 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-indigo-100/70 border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-2xs">
              <Brain className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-stone-900">
                  LLM Reasoning Brain & Budget Switcher
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  HYBRID MODE
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Switch between Google Gemini and OpenRouter models based on latency and budget
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsLlmModalOpen(false)}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Provider Tabs */}
        <div className="flex border-b border-stone-200 bg-stone-100/70 p-1.5 gap-1.5 shrink-0">
          <button
            onClick={() => setActiveProviderTab('gemini')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeProviderTab === 'gemini'
                ? 'bg-white text-indigo-950 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>Google Gemini</span>
            <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              Active Key
            </span>
          </button>

          <button
            onClick={() => setActiveProviderTab('openrouter')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeProviderTab === 'openrouter'
                ? 'bg-white text-indigo-950 shadow-xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-amber-600" />
            <span>OpenRouter Multi-Model</span>
            <span className="text-[10px] font-medium text-stone-500 bg-stone-100 px-1.5 py-0.2 rounded border border-stone-200">
              Claude / Llama / DeepSeek
            </span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Active Model Status Pill */}
          <div className="bg-stone-50 border border-stone-200/90 rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Currently Selected Model:
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-extrabold text-sm text-stone-900">
                  {selectedModelConfig.name}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {selectedModelConfig.costTier} ({selectedModelConfig.costDescription})
                </span>
              </div>
            </div>

            <span className="text-[11px] font-mono text-stone-500 bg-white px-2.5 py-1 rounded-xl border border-stone-200">
              Context: {selectedModelConfig.contextWindow}
            </span>
          </div>

          {/* OpenRouter API Key Input Bar (Only visible when OpenRouter tab is active) */}
          {activeProviderTab === 'openrouter' && (
            <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                  <Key className="w-3.5 h-3.5 text-amber-700" />
                  <span>Configure OpenRouter API Key</span>
                </div>
                <span className="text-[10px] text-amber-700">Optional · Saved locally</span>
              </div>

              <form onSubmit={handleSaveKey} className="flex gap-2">
                <input
                  type="password"
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  placeholder="sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
                >
                  {isKeySaved ? '✓ Saved!' : 'Save Key'}
                </button>
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-stone-100 rounded-xl font-bold text-xs transition-colors shrink-0 shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isTesting ? 'Testing...' : 'Test Connection'}
                </button>
              </form>

              {testResult && (
                <div
                  className={`text-[11px] p-2 rounded-xl border flex items-center gap-2 ${
                    testResult.success
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-rose-50 text-rose-800 border-rose-300'
                  }`}
                >
                  <span>{testResult.success ? '✓' : '⚠️'}</span>
                  <span>{testResult.message}</span>
                </div>
              )}

              <p className="text-[10px] text-stone-500">
                Loaded from <code className="bg-white px-1 rounded border">.env</code> (<code className="bg-white px-1 rounded border">OPENROUTER_API</code>). Ready for live inference with <code className="bg-white px-1 rounded border text-indigo-700 font-bold">google/gemma-4-31b-it:free</code>.
              </p>
            </div>
          )}

          {/* Model Selection Cards List */}
          <div className="space-y-2.5">
            <span className="font-bold text-stone-800 text-xs block">
              Available Models ({filteredModels.length}):
            </span>

            {filteredModels.map((model) => {
              const isSelected = selectedModelId === model.id;

              return (
                <div
                  key={model.id}
                  onClick={() => setSelectedModelId(model.id)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-500/20 shadow-xs'
                      : 'bg-white hover:bg-stone-50 border-stone-200/90 shadow-2xs'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-extrabold text-xs sm:text-sm text-stone-900">
                        {model.name}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          model.costTier === 'Free'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : model.costTier === 'Low Cost'
                            ? 'bg-sky-100 text-sky-800 border border-sky-300'
                            : model.costTier === 'Standard'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-purple-100 text-purple-800 border border-purple-300'
                        }`}
                      >
                        {model.costTier} · {model.costDescription}
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {model.contextWindow}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 leading-relaxed">
                      {model.description}
                    </p>
                  </div>

                  <div className="shrink-0 pt-0.5">
                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shadow-2xs font-bold">
                        ✓
                      </span>
                    ) : (
                      <span className="w-5 h-5 rounded-full border border-stone-300 bg-white"></span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hybrid Mode Guarantee */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3 text-[11px] text-stone-600 space-y-1">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              Hybrid Resilience Guarantee
            </span>
            <p>
              During your live presentation, live calls are made to {selectedModelConfig.name}. If the network or budget limits are reached, the console automatically falls back to deterministic benchmarks, ensuring your demo never breaks on stage!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-stone-500">
            <Info className="w-3.5 h-3.5 text-stone-400" />
            <span>Active Model: <strong>{selectedModelConfig.name}</strong></span>
          </div>

          <button
            onClick={() => setIsLlmModalOpen(false)}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
