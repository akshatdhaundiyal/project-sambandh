import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Sparkles, ShieldCheck, ArrowUp } from 'lucide-react';
import { JioLogo, GnaniLogo, PineLabsLogo, DelhiveryLogo } from '../../data/brandLogos';

export const LandingFooter: React.FC = () => {
  const { launchDemoScenario, openConsultationModal } = useTelemetry();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1917] text-stone-300 pt-14 pb-10 px-4 sm:px-6 border-t border-stone-800">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Top Split Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-stone-800">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <JioLogo className="w-7 h-7 rounded-xl shrink-0" />
              <img
                src="/favicon.svg"
                alt="Sambandh Emblem"
                className="w-7 h-7 object-contain rounded-xl bg-stone-800 border border-stone-700 p-0.5 shrink-0"
              />
              <div>
                <span className="font-serif font-bold text-base text-white block leading-none">
                  Jio × Sambandh
                </span>
                <span className="text-[10px] text-amber-400 block mt-0.5 font-sans">
                  The Extended Arm for Indian Families
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              A voice agent that works as the busy child's extended arm. It calls your elderly parent when you can't, keeps them good company, looks after medicines, and keeps you in the loop.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => launchDemoScenario()}
                className="px-4 py-2 rounded-xl bg-[#0057E7] hover:bg-[#0047C4] text-white font-medium text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Open Live Evaluation Console</span>
              </button>
            </div>
          </div>

          {/* Scenarios Links for Evaluators */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-semibold text-white">
              The 6 Evaluation Flows
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL', 'elder')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Flow 1: Daily Check-In Call
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => launchDemoScenario('SCENARIO_ROUTINE_REFILL', 'caregiver')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Flow 2: Medicine Reorder
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    launchDemoScenario('SCENARIO_MORNING_CALL', 'elder');
                    openConsultationModal();
                  }}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Flow 4: In-Clinic Hospital Visit
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL', 'youth')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  Flow 5: Elder Wisdom for Youth
                </button>
              </li>
            </ul>
          </div>

          {/* Safety Rules & Governance */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-semibold text-white">
              Safety Guardrails & Governance
            </h4>
            <ul className="space-y-1.5 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>3 to 5 Unanswered Call Escalation</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Rupee Spend Limit Protection via Pine Labs</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>Doctor Consent Required Before Recording</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Emergency 112 Protocol & Fall Alerting</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-500">
          <span>© 2026 Jio × Sambandh · The Ken Case Competition</span>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};
