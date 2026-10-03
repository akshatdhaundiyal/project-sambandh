import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { X, Copy, Check, Terminal, Zap } from 'lucide-react';

export const WebhookModal: React.FC = () => {
  const { selectedWebhook, closeWebhookModal } = useTelemetry();
  const [copied, setCopied] = useState(false);

  if (!selectedWebhook) return null;

  const jsonString = JSON.stringify(selectedWebhook, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-mono text-xs font-bold text-slate-200 uppercase tracking-wider">
              Gnani.ai Telephony Webhook Payload
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              {selectedWebhook.eventId}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700 cursor-pointer"
              title="Copy JSON Payload"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={closeWebhookModal}
              className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Telemetry pill bar */}
        <div className="grid grid-cols-4 gap-2 p-3 bg-slate-950/40 border-b border-slate-800/80 text-[11px] font-mono">
          <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800">
            <span className="text-slate-500 block text-[9px]">ENGINE</span>
            <span className="text-cyan-400 font-semibold truncate block">{selectedWebhook.engine}</span>
          </div>
          <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800">
            <span className="text-slate-500 block text-[9px]">LATENCY</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {selectedWebhook.latencyMs}ms
            </span>
          </div>
          <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800">
            <span className="text-slate-500 block text-[9px]">SPEAKER</span>
            <span className="text-purple-300 font-semibold truncate block">{selectedWebhook.speaker}</span>
          </div>
          <div className="bg-slate-950/80 p-1.5 rounded border border-slate-800">
            <span className="text-slate-500 block text-[9px]">CONFIDENCE</span>
            <span className="text-slate-200 font-semibold">{(selectedWebhook.confidence * 100).toFixed(1)}%</span>
          </div>
        </div>

        {/* JSON Code Viewer */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed">
          <pre className="whitespace-pre-wrap break-all selection:bg-cyan-500 selection:text-black">
            {jsonString}
          </pre>
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/80 text-[10px] font-mono text-slate-500 flex justify-between">
          <span>Carrier: {selectedWebhook.carrierTrunk}</span>
          <span>Timestamp: {selectedWebhook.timestamp}</span>
        </div>
      </div>
    </div>
  );
};
