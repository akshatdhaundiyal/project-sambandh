import React from 'react';
import { CaregiverInterventionStream } from '../CaregiverPortal/CaregiverInterventionStream';
import { JudgeStepApiPane } from './JudgeStepApiPane';

export const CaregiverTelemetryConsole: React.FC = () => {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-3.5 h-full min-h-0 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin">
      {/* Top Section Header */}
      <div className="flex items-baseline justify-between px-1 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="font-serif text-base font-semibold text-stone-900 tracking-tight">
            Priya's Caregiver Sovereignty & Oversight
          </h2>
          <span className="text-[11px] font-medium text-stone-500">
            Live Intervention Stream · Fiduciary Guardrails · Webhooks
          </span>
        </div>
        <span className="text-xs text-stone-400 font-medium">Bengaluru ➔ Rohini Hub</span>
      </div>

      {/* Top Hero Deck: Caregiver Intervention Stream & DAG Toggle */}
      <CaregiverInterventionStream />

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
          <span className="text-xs text-stone-400 font-mono">
            WhisperFlo · ABDM · MedGemma · Pine Labs · Delhivery · Telegram
          </span>
        </div>

        {/* Full-Width Judge Step API Pane matching Elder Care */}
        <JudgeStepApiPane />
      </div>
    </div>
  );
};
