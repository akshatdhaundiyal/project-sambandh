import React, { useState } from 'react';
import { TelemetryProvider, useTelemetry } from './context/TelemetryContext';
import { Header } from './components/Header';
import { SeniorConversationStream } from './components/SeniorView/SeniorConversationStream';
import { ElderMobilePhone } from './components/ElderAppView/ElderMobilePhone';
import { CaregiverMobilePhone } from './components/CaregiverPortal/CaregiverMobilePhone';
import { CaregiverTelemetryConsole } from './components/DualPane/CaregiverTelemetryConsole';
import { ConversationToolTree } from './components/ExecutionTree/ConversationToolTree';
import { JudgeStepApiPane } from './components/DualPane/JudgeStepApiPane';
import { RailApiInspectorModal } from './components/Modals/RailApiInspectorModal';
import { WebhookModal } from './components/Modals/WebhookModal';
import { FullStateDrawer } from './components/Modals/FullStateDrawer';
import { AudioSnippetModal } from './components/Modals/AudioSnippetModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { SystemPromptModal } from './components/Modals/SystemPromptModal';
import { DoctorConsultationModal } from './components/DoctorConsultation/DoctorConsultationModal';
import { YouthWisdomPortal } from './components/YouthView/YouthWisdomPortal';
import { LandingPage } from './components/LandingPage/LandingPage';

export const AppContent: React.FC = () => {
  const {
    activeTab,
    isSystemPromptModalOpen,
    setIsSystemPromptModalOpen,
    isConsultationModalOpen,
    closeConsultationModal
  } = useTelemetry();

  // Mobile sub-view toggles for small screens (< lg)
  const [elderMobileView, setElderMobileView] = useState<'phone' | 'stream'>('stream');
  const [caregiverMobileView, setCaregiverMobileView] = useState<'phone' | 'telemetry'>('telemetry');
  // Check active tab (including backward compatibility with legacy tab IDs)
  const isElderTab = activeTab === 'elder' || activeTab === 'elder-app';
  const isCaregiverTab =
    activeTab === 'caregiver' ||
    activeTab === 'caregiver-telegram' ||
    activeTab === 'medical-records' ||
    activeTab === 'judge';
  const isYouthTab = activeTab === 'youth';

  return (
    <div className="h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-teal-700 selection:text-white antialiased transition-colors overflow-hidden">
      {/* Top Clean Senior-Friendly Header */}
      <Header />

      {/* Main Tabbed Views - Kept persistently mounted to preserve active call & streaming state */}
      <main className="flex-1 w-full overflow-hidden flex flex-col min-h-0">
        {/* ========================================================================= */}
        {/* TAB 1: ELDER COMPANION (Split Layout: Phone on Left, Stream on Right)     */}
        {/* ========================================================================= */}
        <div className={isElderTab ? "flex-1 p-2 sm:p-4 max-w-[1920px] w-full mx-auto flex flex-col lg:flex-row gap-4 h-full min-h-0 overflow-hidden" : "hidden"}>
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
              <span>📞</span>
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

          {/* Right Column: Live Conversation Stream & Judge Telemetry Deck (Flexible & Scrollable) */}
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

            {/* Live Morning Dialogue Stream with 1-Click Simulation Popup (Hero Element) */}
            <SeniorConversationStream />

            {/* Judge Telemetry & Fiduciary Rails (Live API Flow & Contract Payloads) */}
            <div className="pt-1 flex flex-col gap-2 shrink-0">
              <div className="flex items-baseline justify-between px-1 shrink-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-sm font-semibold text-stone-900 tracking-tight">
                    Judge Telemetry & Rails
                  </h3>
                  <span className="text-[10px] font-mono font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    Live Rail Payloads
                  </span>
                </div>
                <span className="text-xs text-stone-400 font-mono">Gnani.ai · ABDM · MedGemma · Pine Labs · Delhivery</span>
              </div>
              <JudgeStepApiPane />
            </div>
          </section>
        </div>

        {/* ========================================================================= */}
        {/* TAB 2: CAREGIVER HUB (Chassis on Left, Structured Telemetry & Rails on Right) */}
        {/* ========================================================================= */}
        <div className={isCaregiverTab ? "flex-1 p-2 sm:p-4 max-w-[1920px] w-full mx-auto flex flex-col lg:flex-row gap-4 h-full min-h-0 overflow-hidden" : "hidden"}>
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

          {/* Right Column: Structured Caregiver Telemetry Console */}
          <section
            className={`flex-1 min-w-0 flex-col h-full min-h-0 overflow-hidden ${
              caregiverMobileView === 'telemetry' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            <CaregiverTelemetryConsole />
          </section>
        </div>

        {/* ========================================================================= */}
        {/* TAB 3: YOUTH & WISDOM BRIDGE (Intergenerational Mentorship & Safety Gate) */}
        {/* ========================================================================= */}
        <div className={isYouthTab ? "flex-1 w-full h-full min-h-0 overflow-hidden flex flex-col" : "hidden"}>
          <YouthWisdomPortal />
        </div>
      </main>

      {/* Shared Modals & Inspectors */}
      <RailApiInspectorModal />
      <WebhookModal />
      <FullStateDrawer />
      <AudioSnippetModal />
      <SettingsModal />
      <SystemPromptModal
        isOpen={isSystemPromptModalOpen}
        onClose={() => setIsSystemPromptModalOpen(false)}
      />
      <DoctorConsultationModal
        isOpen={isConsultationModalOpen}
        onClose={closeConsultationModal}
        viewerRole={isCaregiverTab ? 'caregiver' : 'senior'}
      />
    </div>
  );
};

export const MainRouter: React.FC = () => {
  const { currentView } = useTelemetry();

  return (
    <>
      {currentView === 'landing' ? (
        <LandingPage />
      ) : (
        <AppContent />
      )}
    </>
  );
};

export default function App() {
  return (
    <TelemetryProvider>
      <MainRouter />
    </TelemetryProvider>
  );
}
