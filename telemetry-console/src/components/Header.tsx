import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import {
  Columns2,
  Smartphone,
  ShieldCheck,
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
    <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E7E2DB] shadow-xs px-3 sm:px-4 py-2 sm:py-2.5 transition-colors shrink-0">
      <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
        {/* Top Row on Mobile / Left Section on Desktop */}
        <div className="flex items-center justify-between w-full md:w-auto">
          {/* Brand Identity */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#16233B] text-amber-300 flex items-center justify-center shadow-xs border border-stone-800 shrink-0">
              {/* Bespoke Sambandh Interlocking Ring / Knot SVG */}
              <svg className="w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21a9 9 0 0 0 9-9 9 9 0 0 0-9-9 9 9 0 0 0 9 9Z" stroke="#D97706" opacity="0.4" />
                <path d="M7 12a5 5 0 0 1 5-5c2.76 0 5 2.24 5 5s-2.24 5-5 5" stroke="#FDE68A" />
                <circle cx="12" cy="12" r="2" fill="#10B981" stroke="#10B981" />
              </svg>
            </div>
            <div>
              <span className="font-serif font-bold text-sm sm:text-base tracking-tight text-stone-900 whitespace-nowrap block leading-tight">
                Project Sambandh
              </span>
              <span className="text-[10px] sm:text-[11px] font-medium text-stone-500 tracking-normal hidden lg:block">
                Autonomous Fiduciary Care Console
              </span>
            </div>
          </div>

          {/* Right Section on Mobile View (Settings + Call Status) */}
          <div className="flex md:hidden items-center gap-2 shrink-0">
            {callStatus === 'active' && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-300 shadow-2xs animate-fadeIn">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
                <span className="text-[11px] font-mono font-bold text-emerald-900 bg-emerald-100/90 px-1 py-0.2 rounded">
                  {formatTime(callDurationSeconds)}
                </span>
              </div>
            )}
            <button
              onClick={() => openSettingsModal('brain')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-stone-50 text-stone-800 rounded-xl border border-[#DFDAD1] shadow-2xs text-xs font-semibold transition-all cursor-pointer"
              title="Configure Settings"
            >
              <Settings className="w-3.5 h-3.5 text-stone-600 shrink-0" />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Center Section: Primary Navigation View Tabs (Strict 3-Tab Architecture) */}
        <div className="grid grid-cols-3 md:flex md:items-center bg-[#EFECE6] p-1 rounded-xl border border-[#DFDAD1] shadow-2xs w-full md:w-auto shrink-0 gap-1">
          {/* Tab 1: Elder Companion */}
          <button
            onClick={() => setActiveTab('elder')}
            className={`flex items-center justify-center gap-1.5 px-2.5 md:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'elder' || activeTab === 'elder-app'
                ? 'bg-white text-stone-900 shadow-2xs font-bold border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-stone-700 shrink-0" />
            <span className="hidden lg:inline">Elder Companion</span>
            <span className="lg:hidden">Elder</span>
          </button>

          {/* Tab 2: Caregiver Hub */}
          <button
            onClick={() => setActiveTab('caregiver')}
            className={`flex items-center justify-center gap-1.5 px-2.5 md:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'caregiver' || activeTab === 'caregiver-telegram' || activeTab === 'medical-records'
                ? 'bg-white text-stone-900 shadow-2xs font-bold border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="hidden lg:inline">Caregiver Hub</span>
            <span className="lg:hidden">Caregiver</span>
          </button>

          {/* Tab 3: Judge Telemetry & Rails */}
          <button
            onClick={() => setActiveTab('judge')}
            className={`flex items-center justify-center gap-1.5 px-2.5 md:px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'judge' || activeTab === 'judge-tree' || activeTab === 'dual-pane'
                ? 'bg-white text-stone-900 shadow-2xs font-bold border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Columns2 className="w-3.5 h-3.5 text-stone-700 shrink-0" />
            <span className="hidden lg:inline">Judge Telemetry & Rails</span>
            <span className="lg:hidden">Judges</span>
          </button>
        </div>

        {/* Right Section: Minimal Call Status & Unified Settings Action (Desktop Only) */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {/* Live Call Status Indicator */}
          {callStatus === 'active' && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-300 shadow-2xs animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
              <span className="text-xs font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-700" />
                <span>Live</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-100/90 px-1.5 py-0.5 rounded">
                {formatTime(callDurationSeconds)}
              </span>
            </div>
          )}

          {/* Unified Settings Button */}
          <button
            onClick={() => openSettingsModal('brain')}
            className="flex items-center gap-2 px-3.5 py-1.5 bg-white hover:bg-stone-50 text-stone-800 rounded-xl border border-[#DFDAD1] shadow-2xs text-xs font-semibold transition-all cursor-pointer"
            title="Configure AI Models, Voice Synthesis, Care Wallet & Logistics"
          >
            <Settings className="w-3.5 h-3.5 text-stone-600 shrink-0" />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
};
