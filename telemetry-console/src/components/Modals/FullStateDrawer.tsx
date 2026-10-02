import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { X, Copy, Check, Code2, Database } from 'lucide-react';

export const FullStateDrawer: React.FC = () => {
  const { isStateDrawerOpen, setIsStateDrawerOpen, getConsolidatedStateJson, currentStep } = useTelemetry();
  const [copied, setCopied] = useState(false);

  if (!isStateDrawerOpen) return null;

  const jsonString = getConsolidatedStateJson();

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border-l border-slate-700 flex flex-col h-full shadow-2xl animate-slideLeft">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <div>
              <h2 className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wide">
                Consolidated Agent State Tree
              </h2>
              <span className="text-[11px] font-mono text-cyan-400">
                Phase: {currentStep.phase}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-950 hover:bg-cyan-900 border border-cyan-600/50 text-cyan-300 text-xs font-mono font-semibold rounded-md shadow transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy State JSON</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsStateDrawerOpen(false)}
              className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            100% Transparent Reactive State Store
          </span>
          <span>Zero Black Boxes</span>
        </div>

        {/* JSON Code Viewer */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed">
          <pre className="whitespace-pre-wrap break-all selection:bg-cyan-500 selection:text-black">
            {jsonString}
          </pre>
        </div>
      </div>
    </div>
  );
};
