import React from 'react';
import { useTelemetry } from '../context/TelemetryContext';
import {
  ArrowLeft,
  Columns2,
  Smartphone,
  ShieldCheck,
  Settings,
  Radio,
  GraduationCap
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setCurrentView,
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
          {/* Brand Identity & Return to Overview */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setCurrentView('landing')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-[#FAF4EC] hover:bg-[#F3EDE2] text-amber-950 font-semibold text-xs rounded-xl border border-amber-200/90 shadow-2xs transition-all cursor-pointer shrink-0 group"
              title="Return to Public Landing Page & Pitch Overview"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-800 transition-transform group-hover:-translate-x-0.5" />
              <span>Overview</span>
            </button>

            <div className="flex items-center gap-2 sm:gap-2.5">
              <img
                src="/favicon.svg"
                alt="Sambandh Emblem"
                className="w-7 h-7 sm:w-8 sm:h-8 object-contain rounded-xl shadow-2xs border border-[#E7E2DB] bg-[#FAF4EC] shrink-0"
              />
              <div>
                <span className="font-serif font-bold text-sm sm:text-base tracking-tight text-stone-900 block leading-tight">
                  Sambandh
                </span>
                <span className="text-[10px] text-amber-900/80 font-medium tracking-normal hidden sm:block leading-none mt-0.5">
                  Closer today. Always.
                </span>
              </div>
            </div>
            <div className="hidden xl:block pl-2.5 border-l border-stone-300/70">
              <span className="text-[11px] font-semibold text-stone-700 tracking-tight block leading-tight">
                Autonomous Fiduciary Care
              </span>
              <span className="text-[9px] font-mono font-bold text-amber-800 uppercase tracking-wide block">
                Safety & Voice Rail
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

        {/* Center Section: Primary Navigation View Tabs (3-Persona Architecture) */}
        <div className="grid grid-cols-3 md:flex md:items-center bg-[#EFECE6] p-1 rounded-xl border border-[#DFDAD1] shadow-2xs w-full md:w-auto shrink-0 gap-1">
          {/* Tab 1: Elder Companion */}
          <button
            onClick={() => setActiveTab('elder')}
            className={`flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'elder' || activeTab === 'elder-app'
                ? 'bg-white text-stone-900 shadow-2xs font-bold border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-stone-700 shrink-0" />
            <span className="hidden sm:inline">Elder Companion</span>
            <span className="sm:hidden">Elder</span>
          </button>

          {/* Tab 2: Caregiver Hub */}
          <button
            onClick={() => setActiveTab('caregiver')}
            className={`flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'caregiver' || activeTab === 'caregiver-telegram' || activeTab === 'medical-records'
                ? 'bg-white text-stone-900 shadow-2xs font-bold border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700 shrink-0" />
            <span className="hidden sm:inline">Caregiver Hub</span>
            <span className="sm:hidden">Caregiver</span>
          </button>

          {/* Tab 3: Youth & Wisdom Bridge */}
          <button
            onClick={() => setActiveTab('youth')}
            className={`flex items-center justify-center gap-1.5 px-3 md:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'youth'
                ? 'bg-white text-stone-900 shadow-2xs font-bold border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
            <span className="hidden sm:inline">Youth & Wisdom Bridge</span>
            <span className="sm:hidden">Youth Bridge</span>
          </button>
        </div>

        {/* Right Section: Minimal Call Status & Unified Settings Action (Desktop Only) */}
        <div className="hidden md:flex items-center gap-2.5 shrink-0">
          {/* Live Call Status Indicator (Clickable to jump to call) */}
          {callStatus === 'active' && (
            <button
              type="button"
              onClick={() => setActiveTab('elder')}
              className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 rounded-xl border border-emerald-300 shadow-2xs animate-fadeIn cursor-pointer transition-all"
              title="Jump to Live Call Screen"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
              <span className="text-xs font-bold flex items-center gap-1">
                <Radio className="w-3 h-3 text-emerald-700" />
                <span>Live</span>
              </span>
              <span className="text-xs font-mono font-bold text-emerald-900 bg-emerald-100/90 px-1.5 py-0.5 rounded">
                {formatTime(callDurationSeconds)}
              </span>
            </button>
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
