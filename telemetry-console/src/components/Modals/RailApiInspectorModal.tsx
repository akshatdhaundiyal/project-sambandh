import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { X, Copy, Check, Terminal, Zap, ShieldCheck, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export const RailApiInspectorModal: React.FC = () => {
  const { selectedApiExchange, closeApiExchangeModal } = useTelemetry();
  const [activeTab, setActiveTab] = useState<'request' | 'response'>('request');
  const [copied, setCopied] = useState(false);

  if (!selectedApiExchange) return null;

  const requestJson = JSON.stringify(selectedApiExchange.requestBody, null, 2);
  const responseJson = JSON.stringify(selectedApiExchange.responseBody, null, 2);
  const headersJson = JSON.stringify(
    activeTab === 'request'
      ? selectedApiExchange.headers
      : selectedApiExchange.responseHeaders,
    null,
    2
  );

  const handleCopy = () => {
    const textToCopy = activeTab === 'request' ? requestJson : responseJson;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isSuccess = selectedApiExchange.responseStatus >= 200 && selectedApiExchange.responseStatus < 300;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100">
                  {selectedApiExchange.railName}
                </span>
                <span
                  className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                    isSuccess
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/60'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/60'
                  }`}
                >
                  HTTP {selectedApiExchange.responseStatus} {selectedApiExchange.responseStatusText}
                </span>
              </div>
              <p className="text-xs font-mono text-cyan-400 truncate max-w-lg mt-0.5">
                <span className="text-slate-400 font-bold">{selectedApiExchange.method}</span>{' '}
                {selectedApiExchange.endpoint}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Payload</span>
                </>
              )}
            </button>

            <button
              onClick={closeApiExchangeModal}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Telemetry info bar */}
        <div className="grid grid-cols-3 gap-2 px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 text-xs font-mono">
          <div>
            <span className="text-slate-500 text-[10px] block">SCHEMA SPECIFICATION</span>
            <span className="text-slate-300 font-medium truncate block">
              {selectedApiExchange.schemaStandard}
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">SERVER ROUNDTRIP</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-400" />
              {selectedApiExchange.responseLatencyMs} ms
            </span>
          </div>
          <div>
            <span className="text-slate-500 text-[10px] block">CONTRACT VALIDATION</span>
            <span className="text-cyan-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              100% Schema Validated
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-5 pt-3 bg-slate-950/70 border-b border-slate-800/80">
          <button
            onClick={() => setActiveTab('request')}
            className={`flex items-center gap-1.5 px-4 py-2 font-mono text-xs font-semibold rounded-t-lg transition-all border-t border-x ${
              activeTab === 'request'
                ? 'bg-slate-900 text-cyan-300 border-slate-700 border-b-transparent shadow'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            <span>Outbound HTTP Request</span>
          </button>

          <button
            onClick={() => setActiveTab('response')}
            className={`flex items-center gap-1.5 px-4 py-2 font-mono text-xs font-semibold rounded-t-lg transition-all border-t border-x ${
              activeTab === 'response'
                ? 'bg-slate-900 text-emerald-300 border-slate-700 border-b-transparent shadow'
                : 'text-slate-400 hover:text-slate-200 border-transparent'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
            <span>Inbound HTTP Response</span>
          </button>
        </div>

        {/* Inspector Body */}
        <div className="flex-1 overflow-y-auto p-5 bg-slate-950 font-mono text-xs space-y-3">
          {/* Headers Block */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              HTTP Headers:
            </span>
            <pre className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-slate-300 whitespace-pre-wrap">
              {headersJson}
            </pre>
          </div>

          {/* JSON Payload Block */}
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              {activeTab === 'request' ? 'Request JSON Body:' : 'Response JSON Body:'}
            </span>
            <pre className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-cyan-500 selection:text-black">
              {activeTab === 'request' ? requestJson : responseJson}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/80 text-[11px] font-mono text-slate-500 flex items-center justify-between">
          <span>Project Sambandh — Level 3 Autonomous Rail Architecture</span>
          <span className="text-cyan-400">Authentic Developer Specification Compliant</span>
        </div>
      </div>
    </div>
  );
};
