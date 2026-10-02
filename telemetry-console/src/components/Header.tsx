import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import {
  Heart,
  Columns2,
  Smartphone,
  Settings,
  Radio
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    callStatus,
    callDurationSeconds,
    openSettingsModal
  } = useTelemetry();

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs px-4 py-2.5 transition-colors">
      <div className="max-w-[1920px] mx-auto flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
        {/* Left Section: Clean Brand Name & Identity */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-700 shadow-2xs">
            <Heart className="w-4 h-4 fill-emerald-600/20 stroke-[2.4]" />
          </div>
          <div>
            <span className="font-extrabold text-base tracking-tight text-stone-900 whitespace-nowrap block leading-tight">
              Project Sambandh
            </span>
            <span className="text-[10px] font-medium text-emerald-800 tracking-wide block">
              Autonomous Fiduciary Elder Care
            </span>
          </div>
        </div>

        {/* Center Section: Primary Navigation View Tabs */}
        <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200 shadow-inner">
          <button
            onClick={() => setActiveTab('dual-pane')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'dual-pane'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/60'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dual Pane (Judges)</span>
          </button>
          <button
            onClick={() => setActiveTab('elder-app')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'elder-app'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/60'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-indigo-600" />
            <span>Elder Mobile View</span>
          </button>
          <button
            onClick={() => setActiveTab('medical-records')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'medical-records'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/60'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span className="text-xs">🩺</span>
            <span>Medical & Stock</span>
          </button>
        </div>

        {/* Right Section: Minimal Call Status & Unified Settings Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Subtle Live Call Status Dot (Only visible when call is actively running) */}
          {callStatus === 'active' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-200 shadow-2xs animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="text-xs font-extrabold flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-emerald-600" />
                <span>Live (Jio PSTN)</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-100/80 px-1.5 py-0.5 rounded">
                {formatTime(callDurationSeconds)}
              </span>
            </div>
          )}

          {/* Unified Settings Button */}
          <button
            onClick={() => openSettingsModal('brain')}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-stone-100 hover:bg-stone-200/80 text-stone-800 rounded-xl border border-stone-300 shadow-2xs text-xs font-extrabold transition-all cursor-pointer"
            title="Configure AI Models, Voice Synthesis, Care Wallet & Logistics"
          >
            <Settings className="w-4 h-4 text-stone-700 stroke-[2.2]" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
