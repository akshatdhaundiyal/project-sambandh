import React from 'react';
import { Sparkles, ShieldCheck, Heart } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

interface LandingCTASectionProps {
  onOpenSignUp: () => void;
  currentLang: 'en' | 'hi';
}

export const LandingCTASection: React.FC<LandingCTASectionProps> = ({ onOpenSignUp, currentLang }) => {
  const { launchDemoScenario } = useTelemetry();

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="bg-[#FAF4EC] rounded-3xl border border-[#E7E2DB] p-8 sm:p-12 shadow-xs flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Text */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/90 text-amber-950 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-amber-800 fill-amber-800" />
            <span>{currentLang === 'hi' ? 'अपनों का सच्चा साथ' : 'Your Extended Arm'}</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-tight">
            {currentLang === 'hi'
              ? 'नियम आप तय करें। माता-पिता को दें अपनापन और खुद को निश्चिंतता।'
              : 'Set the rules once. Give your parents daily warmth and yourself peace of mind.'}
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
            {currentLang === 'hi'
              ? 'सम्बन्ध परिवार के कॉल्स की जगह नहीं लेता, बल्कि उस कमी को पूरा करता है जब आप व्यस्त होते हैं। बिना किसी ऐप या गैजेट के माता-पिता से बात और दवाओं की देखरेख।'
              : 'The agent fills gaps in the family\'s own calls and never replaces them. No complicated apps or devices for your parents—just genuine conversation over regular phone lines.'}
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-700" />
              <span>Caregiver sets spend limits</span>
            </span>
            <span>·</span>
            <span>What parent confides stays private</span>
            <span>·</span>
            <span>Works on any telephone line</span>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
          <button
            type="button"
            onClick={onOpenSignUp}
            className="w-full px-6 py-3.5 rounded-2xl bg-[#0057E7] hover:bg-[#0047C4] text-white font-semibold text-sm shadow-sm transition-all text-center cursor-pointer"
          >
            {currentLang === 'hi' ? 'साइन अप करें' : 'Sign Up for Jio × Sambandh'}
          </button>

          <button
            type="button"
            onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL')}
            className="w-full px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm border border-stone-300 shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-700" />
            <span>Open Live Demo Console</span>
          </button>
        </div>
      </div>
    </section>
  );
};
