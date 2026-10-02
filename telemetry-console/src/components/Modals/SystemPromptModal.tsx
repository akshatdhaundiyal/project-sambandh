import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  X,
  FileCode,
  Copy,
  Check,
  BrainCircuit,
  Sparkles,
  HeartPulse,
  CreditCard,
  Languages
} from 'lucide-react';

interface SystemPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SystemPromptModal: React.FC<SystemPromptModalProps> = ({
  isOpen,
  onClose
}) => {
  const {
    getLiveSystemPrompt,
    selectedModelConfig,
    activePromptSlices,
    elderTopics,
    foldedMemory
  } = useTelemetry();

  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const livePrompt = getLiveSystemPrompt();

  const handleCopy = () => {
    navigator.clipboard.writeText(livePrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-stone-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-stone-200/90 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-stone-900">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200/80 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100/80 border border-indigo-200 flex items-center justify-center text-indigo-700 shadow-2xs">
              <FileCode className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-stone-900">
                  Live LLM System Prompt & JIT Slices
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-bold border border-indigo-200">
                  {selectedModelConfig.name}
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Just-In-Time modular slices attach conditionally without upfront prompt bloat or early escalation
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs text-stone-700 leading-relaxed scrollbar-thin">
          {/* JIT Modular Prompt Inspector */}
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/90 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-[11px] text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Just-In-Time Modular Prompt Slices:</span>
              </span>
              <span className="text-[10px] text-stone-500 font-mono">Dynamic Injection</span>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="px-2.5 py-1 rounded-xl text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>Companion Core: Active</span>
              </span>

              <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1 ${
                activePromptSlices?.subtleAdherence
                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                  : 'bg-stone-100 text-stone-500 border-stone-200 opacity-60'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activePromptSlices?.subtleAdherence ? 'bg-amber-600' : 'bg-stone-400'}`}></span>
                <span>Subtle Adherence: {activePromptSlices?.subtleAdherence ? 'Injected' : 'Dormant'}</span>
              </span>

              <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1 ${
                activePromptSlices?.clinicalDossier
                  ? 'bg-rose-100 text-rose-900 border-rose-300'
                  : 'bg-stone-100 text-stone-500 border-stone-200 opacity-60'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activePromptSlices?.clinicalDossier ? 'bg-rose-600' : 'bg-stone-400'}`}></span>
                <span>Clinical Dossier: {activePromptSlices?.clinicalDossier ? 'Injected' : 'Dormant'}</span>
              </span>

              <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1 ${
                activePromptSlices?.fiduciaryMandate
                  ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                  : 'bg-stone-100 text-stone-500 border-stone-200 opacity-60'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activePromptSlices?.fiduciaryMandate ? 'bg-indigo-600' : 'bg-stone-400'}`}></span>
                <span>Fiduciary ₹4.5k: {activePromptSlices?.fiduciaryMandate ? 'Injected' : 'Dormant'}</span>
              </span>

              <span className={`px-2.5 py-1 rounded-xl text-[11px] font-bold border flex items-center gap-1 ${
                activePromptSlices?.acousticTripwire
                  ? 'bg-purple-100 text-purple-900 border-purple-300'
                  : 'bg-stone-100 text-stone-500 border-stone-200 opacity-60'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${activePromptSlices?.acousticTripwire ? 'bg-purple-600' : 'bg-stone-400'}`}></span>
                <span>Acoustic Tripwire: {activePromptSlices?.acousticTripwire ? 'Injected' : 'Dormant'}</span>
              </span>
            </div>

            {/* Active Topics injected */}
            <div className="pt-2 border-t border-stone-200/80 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-bold text-stone-600">Active Topics Streamed:</span>
              {(elderTopics || []).filter(t => t.isActive).map(t => (
                <span key={t.id} className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-white text-stone-700 border border-stone-200 shadow-2xs">
                  {t.topic}
                </span>
              ))}
            </div>
          </div>

          {/* Raw System Prompt Code Box */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-stone-800 text-xs flex items-center gap-1.5">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
                <span>Live System Prompt Payload (Streamed to Model API):</span>
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-[11px] transition-colors cursor-pointer border border-stone-200"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied to Clipboard</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-600" />
                    <span>Copy Full Prompt</span>
                  </>
                )}
              </button>
            </div>

            <pre className="bg-stone-900 text-stone-100 p-4 rounded-2xl font-mono text-[11px] leading-relaxed overflow-x-auto whitespace-pre-wrap border border-stone-800 shadow-inner">
              {livePrompt}
            </pre>
          </div>

          {/* Dynamic Injected Memory Ledger Detail */}
          <div className="p-3.5 bg-indigo-50/60 border border-indigo-200/80 rounded-2xl space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Dynamic Injected Memory Ledger State:</span>
              </span>
              <span className="text-[10px] text-indigo-700 font-mono font-bold bg-indigo-100 px-2 py-0.5 rounded-full">
                Progressive Folding: Every 4 Turns
              </span>
            </div>
            <p className="text-[11px] text-stone-600 leading-relaxed font-mono whitespace-pre-wrap bg-white/80 p-2.5 rounded-xl border border-indigo-100">
              {foldedMemory}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-stone-200 bg-stone-50/70 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            Provider: <strong className="text-stone-700">{selectedModelConfig.provider.toUpperCase()}</strong> · Token Limit: <strong className="text-stone-700">350 Max</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
