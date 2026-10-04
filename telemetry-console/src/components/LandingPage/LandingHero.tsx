import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { InteractiveVoicePlayer } from './InteractiveVoicePlayer';
import { Sparkles, CheckCircle, ShieldCheck, Heart } from 'lucide-react';
import { JioLogo } from '../../data/brandLogos';

interface LandingHeroProps {
  currentLang: 'en' | 'hi';
  onOpenSignUp: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ currentLang, onOpenSignUp }) => {
  const { launchDemoScenario, openConsultationModal } = useTelemetry();

  return (
    <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Top Centered Emotional Content */}
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5">
          {/* Partnership Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF4EC] border border-[#E7E2DB] text-stone-800 text-xs font-medium font-sans">
            <JioLogo className="w-4 h-4 rounded-md shrink-0" />
            <span>
              {currentLang === 'hi'
                ? 'जियो 4G/5G नेटवर्क पर वॉयस केयर · बिना किसी ऐप के'
                : 'Jio × Sambandh · The voice agent for aging parents'}
            </span>
          </div>

          {/* Main Headline (Document thesis) */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.15]">
            {currentLang === 'hi' ? (
              'माता-पिता का ख्याल, जब आप व्यस्त हों। आपका अपना आत्मीय साथी।'
            ) : (
              'Your extended arm when you can’t be there.'
            )}
          </h1>

          {/* Plain, grounded prose directly from reference document */}
          <p className="font-sans text-sm sm:text-base lg:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            {currentLang === 'hi' ? (
              'यह वॉयस एजेंट व्यस्त बेटे या बेटी की तरह काम करता है। जब आप कॉल नहीं कर पाते, तब यह माता-पिता से बात करता है, उनका मन बहलाता है, दवाओं का ध्यान रखता है और आपके तय किए गए नियमों के अनुसार आपको अपडेट देता है। यह परिवार के कॉल्स की जगह नहीं लेता, बस दूर रहने के अपराधबोध को कम करता है।'
            ) : (
              'A voice agent that works as the busy son or daughter’s extended arm. It calls your elderly parent when you can’t, keeps them good company, looks after medicines, and keeps you in the loop—all within the rules and spend limits you set. It fills gaps in the family’s own calls and never replaces them.'
            )}
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenSignUp}
              className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-[#0057E7] hover:bg-[#0047C4] text-white font-semibold text-sm shadow-xs transition-all cursor-pointer"
            >
              {currentLang === 'hi' ? 'साइन अप करें' : 'Sign Up for Jio × Sambandh'}
            </button>

            <button
              type="button"
              onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-sm border border-[#DFDAD1] shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>{currentLang === 'hi' ? 'लाइव डेमो कंसोल खोलें' : 'Open live demo console'}</span>
            </button>
          </div>

          {/* Key Facts Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-3 text-xs text-stone-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Works on any keypad phone or landline</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Pine Labs payments within your rupee limit</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>What parent confides stays private</span>
            </span>
          </div>
        </div>

        {/* Interactive Voice Player Hero Card with Gnani Integration */}
        <div className="max-w-4xl mx-auto">
          <InteractiveVoicePlayer />
        </div>

        {/* Scenario Quick-Launch Row */}
        <div className="max-w-4xl mx-auto bg-[#FAF4EC] p-3 sm:p-4 rounded-2xl border border-[#E7E2DB] flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-800 shrink-0">
            <Sparkles className="w-4 h-4 text-amber-800" />
            <span>Test scenarios in console:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5">
            <button
              type="button"
              onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL', 'elder')}
              className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 text-[11px] font-medium rounded-xl border border-stone-200 transition-all cursor-pointer"
            >
              Flow 1: Morning Check-in Call
            </button>
            <button
              type="button"
              onClick={() => launchDemoScenario('SCENARIO_ROUTINE_REFILL', 'caregiver')}
              className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 text-[11px] font-medium rounded-xl border border-stone-200 transition-all cursor-pointer"
            >
              Flow 2: Medicine Reorder
            </button>
            <button
              type="button"
              onClick={() => {
                launchDemoScenario('SCENARIO_MORNING_CALL', 'elder');
                openConsultationModal();
              }}
              className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 text-[11px] font-medium rounded-xl border border-stone-200 transition-all cursor-pointer"
            >
              Flow 4: Doctor Visit Bridge
            </button>
            <button
              type="button"
              onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL', 'youth')}
              className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 text-[11px] font-medium rounded-xl border border-stone-200 transition-all cursor-pointer"
            >
              Flow 5: Youth Wisdom
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
