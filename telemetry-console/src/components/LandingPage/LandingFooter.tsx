import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { Sparkles, ShieldCheck, Heart, ExternalLink, ArrowUp } from 'lucide-react';
import { JioLogo, AbdmLogo, PineLabsLogo, DelhiveryLogo } from '../../data/brandLogos';

export const LandingFooter: React.FC = () => {
  const { launchDemoScenario, openConsultationModal } = useTelemetry();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1917] text-stone-300 pt-16 pb-12 px-4 sm:px-6 border-t border-stone-800">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Top Split Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-stone-800">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <JioLogo className="w-8 h-8 rounded-xl shrink-0" />
              <img
                src="/favicon.svg"
                alt="Sambandh Emblem"
                className="w-8 h-8 object-contain rounded-xl bg-stone-800 border border-stone-700 p-0.5 shrink-0"
              />
              <div>
                <span className="font-serif font-bold text-lg text-white block leading-none">
                  Jio Sambandh
                </span>
                <span className="text-[10px] font-mono text-amber-400 block mt-0.5">
                  The Reciprocal Care Engine
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Engineered for India's 347M seniors and their children. Autonomous, bounded fiduciary care operating companion-first on Reliance Jio's voice and fulfillment network.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => launchDemoScenario()}
                className="px-4 py-2.5 rounded-xl bg-[#0057E7] hover:bg-[#0047C4] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Launch Live Evaluation Console ⚡</span>
              </button>
            </div>
          </div>

          {/* Scenarios Links for Judges */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Live Scenarios (Judge Guide)
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  type="button"
                  onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL', 'elder')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  📞 Scenario 1: Morning Voice Check-In
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => launchDemoScenario('SCENARIO_ROUTINE_REFILL', 'caregiver')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  📦 Scenario 2: Autonomous Netmeds Refill
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
                  🩺 Scenario 3: In-Clinic Doctor Transcriber
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL', 'youth')}
                  className="hover:text-amber-400 transition-colors text-left cursor-pointer"
                >
                  🎓 Scenario 4: Youth Wisdom Bridge
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Rails */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Governance & Partner Rails
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>DPDP Act 2023 Fiduciary Consent Framework</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Drugs & Cosmetics Act Schedule H Compliant</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>ABDM FHIR R4 Health Data Interoperability</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Pine Labs & JioPay Recurring UPI Autopay</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <span>© 2026 Jio Sambandh · The Ken Case Competition (Opening 04)</span>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer text-xs"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
