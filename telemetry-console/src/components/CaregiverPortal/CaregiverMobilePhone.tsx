import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { TelegramReceptor } from '../Column3Rails/TelegramReceptor';
import {
  Bell,
  Heart,
  Activity,
  Phone,
  MessageSquare,
  ShieldCheck,
  FileUp,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface CaregiverMobilePhoneProps {
  onUploadClick?: () => void;
}

export const CaregiverMobilePhone: React.FC<CaregiverMobilePhoneProps> = ({ onUploadClick }) => {
  const {
    currentStep,
    activeScenario,
    caregiverConfig,
    preCallAgency,
    resolvePreCallAgency,
    requestPreCallApproval
  } = useTelemetry();
  const profile = activeScenario.initialSeniorProfile;
  const [activeTab, setActiveTab] = useState<'stream' | 'overview'>('stream');

  return (
    <div className="flex flex-col items-center justify-start pt-0 pb-2 px-1 w-full">
      {/* Mobile Device Frame (iPhone 16 Pro Style) */}
      <div className="w-full max-w-[390px] h-[740px] sm:h-[780px] max-h-[calc(100vh-5.5rem)] bg-stone-900 rounded-[40px] sm:rounded-[48px] p-2.5 sm:p-3 shadow-2xl ring-1 ring-stone-800 relative flex flex-col shrink-0 select-none">
        {/* Dynamic Island */}
        <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 w-28 h-5 sm:h-6 bg-black rounded-full z-50 flex items-center justify-between px-2.5">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
          <span className="text-[10px] font-mono text-sky-400 font-bold tabular-nums">09:41</span>
          <span className="w-2.5 h-2.5 rounded-full bg-stone-800"></span>
        </div>

        {/* Screen Bezel Content */}
        <div className="w-full h-full bg-[#FAF8F5] rounded-[32px] sm:rounded-[44px] overflow-hidden flex flex-col relative text-stone-900">
          {/* iOS Status Bar */}
          <div className="pt-3 px-7 pb-1.5 flex items-center justify-between text-xs font-semibold text-stone-800 shrink-0">
            <span className="tabular-nums">9:41</span>
            <div className="flex items-center gap-1.5 text-stone-800 text-[11px]">
              <span className="text-[10px] font-mono font-bold">5G</span>
              <span className="tabular-nums">100%</span>
            </div>
          </div>

          {/* Caregiver Profile Header */}
          <div className="px-4 py-2.5 bg-white border-b border-[#E7E2DB] flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white text-sm font-bold shadow-xs shrink-0">
                PS
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-serif font-bold text-stone-900 truncate">
                    Priya Sharma
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                    Caregiver
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                  <span className="truncate">Bengaluru · Remote Link</span>
                </span>
              </div>
            </div>

            <button
              type="button"
              aria-label="Caregiver notifications"
              className="w-8 h-8 rounded-full bg-[#F5EFE6] border border-[#DFDAD1] flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors shrink-0"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Senior Quick Health Status Capsule */}
          <div className="p-3 bg-white/70 border-b border-[#E7E2DB] shrink-0">
            <div className="p-2.5 rounded-2xl bg-[#F7F5F0] border border-[#E7E2DB] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">👴🏼</span>
                  <div>
                    <span className="text-xs font-serif font-bold text-stone-900 block leading-tight">
                      {profile.name} (72y)
                    </span>
                    <span className="text-[10px] text-stone-500">Rohini Sector 8, Delhi</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <TrendingUp className="w-3 h-3 text-emerald-600" />
                  <span className="tabular-nums">94%</span> Adherence
                </div>
              </div>

              {/* Vitals micro-bar */}
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                <div className="bg-white p-2 rounded-xl border border-[#DFDAD1]">
                  <span className="text-stone-500 block text-[10px]">Omron BP:</span>
                  <span className="font-mono font-bold text-stone-900 tabular-nums">128/82 mmHg</span>
                </div>
                <div className="bg-white p-2 rounded-xl border border-[#DFDAD1]">
                  <span className="text-stone-500 block text-[10px]">Care Wallet:</span>
                  <span className="font-mono font-bold text-stone-900 tabular-nums">
                    ₹{caregiverConfig.orderTotalLimitInr.toLocaleString('en-IN')} Cap
                  </span>
                </div>
              </div>

              {/* Pre-Call Caregiver Agency Gate Capsule */}
              {preCallAgency && (
                <div className="mt-1.5 p-2 rounded-xl bg-white border border-[#DFDAD1] space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                      <span>Morning Call Agency Gate</span>
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                      preCallAgency.status === 'awaiting_approval'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : preCallAgency.status === 'caregiver_calling'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-sky-50 text-sky-800 border-sky-200'
                    }`}>
                      {preCallAgency.status === 'awaiting_approval'
                        ? 'DECISION PENDING'
                        : preCallAgency.status === 'caregiver_calling'
                        ? 'CALLING DIRECT'
                        : 'AI DELEGATED'}
                    </span>
                  </div>

                  {preCallAgency.status === 'awaiting_approval' ? (
                    <div className="space-y-1.5 pt-0.5">
                      <p className="text-[10px] text-stone-600 leading-tight">
                        Do you want to speak with Papa yourself today, or should Sambandh AI make the call?
                      </p>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => resolvePreCallAgency('caregiver_direct')}
                          className="py-1 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Phone className="w-3 h-3" />
                          <span>I'll Call Papa</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => resolvePreCallAgency('agent_approved')}
                          className="py-1 px-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-semibold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Let AI Call</span>
                        </button>
                      </div>
                    </div>
                  ) : preCallAgency.status === 'caregiver_calling' ? (
                    <div className="flex items-center justify-between text-[10px] text-emerald-800 bg-emerald-50/80 p-1.5 rounded-lg border border-emerald-200">
                      <span className="font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>You are calling Papa directly</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => requestPreCallApproval()}
                        className="underline text-stone-500 hover:text-stone-900 font-bold cursor-pointer"
                      >
                        Reset
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-[10px] text-sky-800 bg-sky-50/80 p-1.5 rounded-lg border border-sky-200">
                      <span className="font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-sky-600 shrink-0" />
                        <span>AI check-in authorized by you</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => requestPreCallApproval()}
                        className="underline text-stone-500 hover:text-stone-900 font-bold cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Upload Doctor Slip Quick Action Button */}
              {onUploadClick && (
                <button
                  type="button"
                  onClick={onUploadClick}
                  className="w-full mt-1.5 flex items-center justify-center gap-2 py-2 px-3 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer group"
                >
                  <FileUp className="w-3.5 h-3.5 text-teal-200 group-hover:scale-110 transition-transform" />
                  <span>Upload Doctor Slip / Lab PDF</span>
                </button>
              )}
            </div>
          </div>

          {/* Sub-view switcher for Mobile Phone */}
          <div className="flex items-center bg-[#EFECE6] p-1 mx-3 my-2 rounded-xl border border-[#DFDAD1] shrink-0 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('stream')}
              className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
                activeTab === 'stream'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Telegram Stream
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-1 px-2 rounded-lg font-bold transition-all text-center cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Guardrail Limits
            </button>
          </div>

          {/* Body Content */}
          <div className="flex-1 overflow-y-auto px-3 pb-4 scrollbar-thin">
            {activeTab === 'stream' ? (
              <div className="h-full flex flex-col">
                <TelegramReceptor />
              </div>
            ) : (
              <div className="space-y-3 pt-1 text-xs">
                <div className="p-3 bg-white rounded-2xl border border-[#E7E2DB] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Fiduciary Limits</span>
                    </span>
                    <span className="text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      Active
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Auto-approved daily expenses are locked at <strong>₹{caregiverConfig.orderTotalLimitInr}</strong>.
                    Any single transaction exceeding this sends an instant 2-step verification card to Telegram.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-[#E7E2DB] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-700" />
                      <span>MedGemma Guardrails</span>
                    </span>
                    <span className="text-[10px] font-mono font-medium text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                      Enforced
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    1st-time ingestion parses clinical entities into local tables. Zero diagnosis or dose alterations permitted without Dr. Saxena's wet-signature ABDM artifact.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
