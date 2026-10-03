import React, { useState } from 'react';
import { TelemetryProvider, useTelemetry } from './context/TelemetryContext';
import { Header } from './components/Header';
import { SeniorCallCard } from './components/SeniorView/SeniorCallCard';
import { SeniorConversationStream } from './components/SeniorView/SeniorConversationStream';
import { ElderMobilePhone } from './components/ElderAppView/ElderMobilePhone';
import { CaregiverMobilePhone } from './components/CaregiverPortal/CaregiverMobilePhone';
import { ConversationToolTree } from './components/ExecutionTree/ConversationToolTree';
import { JudgeStepApiPane } from './components/DualPane/JudgeStepApiPane';
import { RailApiInspectorModal } from './components/Modals/RailApiInspectorModal';
import { WebhookModal } from './components/Column1Voice/WebhookModal';
import { FullStateDrawer } from './components/Modals/FullStateDrawer';
import { AudioSnippetModal } from './components/Modals/AudioSnippetModal';
import { IntermediaryMentorshipModal } from './components/Modals/IntermediaryMentorshipModal';
import { SettingsModal } from './components/Modals/SettingsModal';

export const AppContent: React.FC = () => {
  const { activeTab } = useTelemetry();

  // Mobile sub-view toggles for small screens (< lg)
  const [elderMobileView, setElderMobileView] = useState<'phone' | 'stream'>('stream');
  const [caregiverMobileView, setCaregiverMobileView] = useState<'phone' | 'telemetry'>('telemetry');
  const [judgeMobileView, setJudgeMobileView] = useState<'tree' | 'api'>('api');

  // Check active tab (including backward compatibility with legacy tab IDs)
  const isElderTab = activeTab === 'elder' || activeTab === 'elder-app';
  const isCaregiverTab =
    activeTab === 'caregiver' ||
    activeTab === 'caregiver-telegram' ||
    activeTab === 'medical-records';
  const isJudgeTab =
    activeTab === 'judge' ||
    activeTab === 'judge-tree' ||
    activeTab === 'dual-pane';

  return (
    <div className="h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-teal-700 selection:text-white antialiased transition-colors overflow-hidden">
      {/* Top Clean Senior-Friendly Header */}
      <Header />

      {/* Main Tabbed Views */}
      <main className="flex-1 w-full overflow-hidden flex flex-col min-h-0">
        {/* ========================================================================= */}
        {/* TAB 1: ELDER COMPANION (Split Layout: Phone on Left, Stream on Right)     */}
        {/* ========================================================================= */}
        {isElderTab && (
          <div className="flex-1 p-2 sm:p-4 max-w-[1920px] w-full mx-auto flex flex-col lg:flex-row gap-4 h-full min-h-0 overflow-hidden">
            {/* Mobile View Switcher (< lg screens) */}
            <div className="lg:hidden flex items-center bg-[#EFECE6] p-1 rounded-2xl border border-[#DFDAD1] shadow-2xs mb-1 shrink-0">
              <button
                type="button"
                onClick={() => setElderMobileView('stream')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  elderMobileView === 'stream'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>🎙️</span>
                <span>Live Call & Stream</span>
              </button>
              <button
                type="button"
                onClick={() => setElderMobileView('phone')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  elderMobileView === 'phone'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>📱</span>
                <span>Elder Mobile Screen</span>
              </button>
            </div>

            {/* Left Column: Fixed-Width Elder Mobile Phone Chassis (Fixed Toward Top) */}
            <div
              className={`w-full lg:w-[390px] xl:w-[410px] shrink-0 self-start lg:sticky lg:top-0 flex items-start justify-center overflow-visible z-10 ${
                elderMobileView === 'phone' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <ElderMobilePhone standalonePhoneOnly={true} />
            </div>

            {/* Right Column: Live Conversation Stream & Call Controls (Flexible & Scrollable) */}
            <section
              className={`flex-1 min-w-0 flex-col gap-3.5 h-full min-h-0 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin ${
                elderMobileView === 'stream' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <div className="flex items-baseline justify-between px-1 shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-base font-semibold text-stone-900 tracking-tight">
                    Ramesh Ji's Morning Companion
                  </h2>
                  <span className="text-[11px] font-medium text-stone-500">
                    Live Telephony Turn Audio & Dialogue
                  </span>
                </div>
                <span className="text-xs text-stone-400 font-medium">Rohini Sector 8, Delhi</span>
              </div>

              <SeniorCallCard />
              <SeniorConversationStream />

              {/* Real-time Fiduciary & Clinical Guardrail Telemetry Strip */}
              <div className="pt-2 flex flex-col gap-2 shrink-0">
                <div className="flex items-baseline justify-between px-1 shrink-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-sm font-semibold text-stone-900 tracking-tight">
                      Fiduciary & Clinical Guardrail Telemetry
                    </h3>
                    <span className="text-[10px] font-mono font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      Live Rails
                    </span>
                  </div>
                  <span className="text-xs text-stone-400 font-mono">ABDM · MedGemma · Pine Labs · Delhivery</span>
                </div>
                <JudgeStepApiPane />
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CAREGIVER HUB (Chassis on Left, Causal Tree & Guardrails on Right)  */}
        {/* ========================================================================= */}
        {isCaregiverTab && (
          <div className="flex-1 p-2 sm:p-4 max-w-[1920px] w-full mx-auto flex flex-col lg:flex-row gap-4 h-full min-h-0 overflow-hidden">
            {/* Mobile View Switcher (< lg screens) */}
            <div className="lg:hidden flex items-center bg-[#EFECE6] p-1 rounded-2xl border border-[#DFDAD1] shadow-2xs mb-1 shrink-0">
              <button
                type="button"
                onClick={() => setCaregiverMobileView('telemetry')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  caregiverMobileView === 'telemetry'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>⚡</span>
                <span>Audit & Telemetry Rails</span>
              </button>
              <button
                type="button"
                onClick={() => setCaregiverMobileView('phone')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  caregiverMobileView === 'phone'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>📱</span>
                <span>Caregiver Mobile Phone</span>
              </button>
            </div>

            {/* Left Column: Fixed-Width Caregiver Mobile Phone Chassis (Fixed Toward Top) */}
            <div
              className={`w-full lg:w-[390px] xl:w-[410px] shrink-0 self-start lg:sticky lg:top-0 flex items-start justify-center overflow-visible z-10 ${
                caregiverMobileView === 'phone' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <CaregiverMobilePhone />
            </div>

            {/* Right Column: Dual Causal Tool Tree & Guardrail Rails */}
            <section
              className={`flex-1 min-w-0 flex-col gap-3 h-full min-h-0 overflow-hidden ${
                caregiverMobileView === 'telemetry' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <div className="flex items-baseline justify-between px-1 shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-base font-semibold text-stone-900 tracking-tight">
                    Caregiver Causal Telemetry & Verification Rails
                  </h2>
                  <span className="text-[11px] font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Deterministic Guardrails
                  </span>
                </div>
                <span className="text-xs text-stone-400 font-mono">Live DAG & Contract Payloads</span>
              </div>

              <div className="flex-1 min-h-0 grid grid-cols-1 xl:grid-cols-2 gap-3.5 overflow-hidden">
                {/* Left Card: Causal Tree */}
                <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 overflow-hidden flex flex-col shadow-xs min-h-0">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F5EFE6] shrink-0">
                    <span className="text-xs font-serif font-bold text-stone-900">
                      Autonomous Causal Decision & Tool Tree
                    </span>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-medium">
                      Active DAG
                    </span>
                  </div>
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <ConversationToolTree />
                  </div>
                </div>

                {/* Right Card: Guardrail Rails & Step API Inspector */}
                <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 overflow-hidden flex flex-col shadow-xs min-h-0">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#F5EFE6] shrink-0">
                    <span className="text-xs font-serif font-bold text-stone-900">
                      Fiduciary & Clinical Rail Payloads
                    </span>
                    <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 font-medium">
                      HTTP Step Inspector
                    </span>
                  </div>
                  <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin">
                    <JudgeStepApiPane />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: JUDGE TELEMETRY & RAILS (50/50 Dual Pane: Tool Tree + API Inspector) */}
        {/* ========================================================================= */}
        {isJudgeTab && (
          <div className="flex-1 p-2.5 sm:p-4 max-w-[1920px] w-full mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-3 sm:gap-4 h-full min-h-0 overflow-hidden">
            {/* Mobile View Switcher (< lg screens) */}
            <div className="lg:hidden flex items-center bg-[#EFECE6] p-1 rounded-2xl border border-[#DFDAD1] shadow-2xs mb-1 shrink-0">
              <button
                type="button"
                onClick={() => setJudgeMobileView('tree')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  judgeMobileView === 'tree'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>🌳</span>
                <span>Conversation & Tool Tree</span>
              </button>
              <button
                type="button"
                onClick={() => setJudgeMobileView('api')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  judgeMobileView === 'api'
                    ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>⚡</span>
                <span>Rail APIs & Telemetry</span>
              </button>
            </div>

            {/* Left Column (50%): Conversation & Causal Tool Tree */}
            <section
              className={`flex-col h-full overflow-hidden ${
                judgeMobileView === 'tree' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <div className="flex items-baseline justify-between px-1 mb-2 shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-base font-semibold text-stone-900 tracking-tight">
                    Autonomous Causal Decision & Tool Tree
                  </h2>
                  <span className="text-[11px] font-mono font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    Live Graph
                  </span>
                </div>
                <span className="text-xs text-stone-400 font-mono">DAG Execution</span>
              </div>

              <div className="flex-1 bg-white border border-[#E7E2DB] rounded-3xl p-4 overflow-hidden flex flex-col shadow-xs">
                <ConversationToolTree />
              </div>
            </section>

            {/* Right Column (50%): Live Current Step API / Vector & Guardrail Inspector */}
            <section
              className={`flex-col h-full min-h-[500px] overflow-hidden ${
                judgeMobileView === 'api' ? 'flex' : 'hidden lg:flex'
              }`}
            >
              <div className="flex items-baseline justify-between px-1 mb-2 shrink-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-base font-semibold text-stone-900 tracking-tight">
                    Fiduciary Rail Telemetry & API Inspector
                  </h2>
                  <span className="text-[11px] font-mono font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    L3 Autonomous
                  </span>
                </div>
                <span className="text-xs text-stone-400 font-mono">ABDM · MedGemma · Pine Labs · Delhivery</span>
              </div>

              <JudgeStepApiPane />
            </section>
          </div>
        )}
      </main>

      {/* Shared Modals & Inspectors */}
      <RailApiInspectorModal />
      <WebhookModal />
      <FullStateDrawer />
      <AudioSnippetModal />
      <IntermediaryMentorshipModal />
      <SettingsModal />
    </div>
  );
};

export default function App() {
  return (
    <TelemetryProvider>
      <AppContent />
    </TelemetryProvider>
  );
}
