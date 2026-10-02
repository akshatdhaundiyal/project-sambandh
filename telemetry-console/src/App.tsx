import React from 'react';
import { TelemetryProvider, useTelemetry } from './context/TelemetryContext';
import { Header } from './components/Header';
import { SeniorCallCard } from './components/SeniorView/SeniorCallCard';
import { SeniorConversationStream } from './components/SeniorView/SeniorConversationStream';
import { RecommendedPromptsList } from './components/SeniorView/RecommendedPromptsList';
import { SeniorHealthWidgets } from './components/SeniorView/SeniorHealthWidgets';
import { JudgeStepApiPane } from './components/DualPane/JudgeStepApiPane';
import { ElderMobilePhone } from './components/ElderAppView/ElderMobilePhone';
import { JudgeDeepDiveView } from './components/JudgeDeepDive/JudgeDeepDiveView';
import { CaregiverTelegramView } from './components/CaregiverPortal/CaregiverTelegramView';
import { ElderMedicalRecordsView } from './components/MedicalRecords/ElderMedicalRecordsView';
import { RailApiInspectorModal } from './components/Modals/RailApiInspectorModal';
import { WebhookModal } from './components/Column1Voice/WebhookModal';
import { FullStateDrawer } from './components/Modals/FullStateDrawer';
import { AudioSnippetModal } from './components/Modals/AudioSnippetModal';
import { IntermediaryMentorshipModal } from './components/Modals/IntermediaryMentorshipModal';
import { SettingsModal } from './components/Modals/SettingsModal';

export const AppContent: React.FC = () => {
  const { activeTab } = useTelemetry();

  return (
    <div className="min-h-screen bg-[#F5F7F2] text-stone-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white antialiased transition-colors">
      {/* Top Clean Senior-Friendly Header */}
      <Header />

      {/* Main Tabbed Views */}
      <main className="flex-1 w-full overflow-hidden flex flex-col">
        {/* VIEW 1: Dual Pane (50/50 Split for Competition Judges) */}
        {activeTab === 'dual-pane' && (
          <div className="flex-1 p-3 sm:p-4 max-w-[1920px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-4 overflow-hidden">
            {/* Left Side (50%): Senior Care Experience (Warm, Human, Calm) */}
            <section className="flex flex-col gap-3.5 h-full overflow-y-auto pr-1">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <span>👴</span>
                  <span>Papa's Morning Care Experience (Human Dignity)</span>
                </span>
                <span className="text-xs text-stone-500 font-medium">Accessible, Calm & Unscripted</span>
              </div>

              <SeniorCallCard />
              <SeniorConversationStream />
              <RecommendedPromptsList />
              <SeniorHealthWidgets />
            </section>

            {/* Right Side (50%): Live Current Step API / JSON Inspector (For Judges) */}
            <section className="flex flex-col gap-3.5 h-full min-h-[600px] overflow-hidden">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>Active Step Rails & API Payload Inspector (Judges Console)</span>
                </span>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  100% Transparent
                </span>
              </div>

              <JudgeStepApiPane />
            </section>
          </div>
        )}

        {/* VIEW 2: Dedicated Elder Mobile App (Matching Reference Design) */}
        {activeTab === 'elder-app' && (
          <div className="flex-1 p-4 overflow-y-auto">
            <ElderMobilePhone />
          </div>
        )}

        {/* VIEW 3: Dedicated Clinical Health Dossier, Stock & Transcriber Mode */}
        {activeTab === 'medical-records' && (
          <div className="flex-1 p-4 overflow-y-auto">
            <ElderMedicalRecordsView />
          </div>
        )}

        {/* VIEW 4: Causal Execution Tree & Rail APIs Library */}
        {activeTab === 'judge-tree' && (
          <div className="flex-1 overflow-hidden">
            <JudgeDeepDiveView />
          </div>
        )}

        {/* VIEW 5: Priya's Caregiver Telegram Portal */}
        {activeTab === 'caregiver-telegram' && (
          <div className="flex-1 p-4 overflow-y-auto">
            <CaregiverTelegramView />
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
