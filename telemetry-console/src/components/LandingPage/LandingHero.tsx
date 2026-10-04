import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { InteractiveVoicePlayer } from './InteractiveVoicePlayer';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Phone, CheckCircle } from 'lucide-react';
import { JioLogo } from '../../data/brandLogos';

interface LandingHeroProps {
  currentLang: 'en' | 'hi';
}

export const LandingHero: React.FC<LandingHeroProps> = ({ currentLang }) => {
  const { launchDemoScenario, openConsultationModal } = useTelemetry();

  const scrollToSignUp = () => {
    const el = document.getElementById('signup-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 px-4 sm:px-6">
      {/* Background Soft Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-[#FAF4EC] via-[#FAF8F5]/60 to-transparent pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Top Centered Emotional Content */}
        <div className="max-w-3xl mx-auto text-center space-y-4 sm:space-y-5">
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF4EC] border border-[#E7E2DB] shadow-2xs text-amber-950 text-xs font-bold font-sans">
            <JioLogo className="w-4 h-4 rounded-md shrink-0" />
            <span>
              {currentLang === 'hi'
                ? 'जियो 4G/5G नेटवर्क पर भारत का पहला वॉयस केयर इंजन'
                : 'Powered by Reliance Jio · Zero Hardware & Zero Apps for Parents'}
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.15]">
            {currentLang === 'hi' ? (
              <>
                सुबह का वह फोन कॉल, जिसका पिताजी को{' '}
                <span className="text-amber-900 italic underline decoration-amber-300 decoration-wavy underline-offset-8">
                  सच्चा इंतज़ार
                </span>{' '}
                रहता है।
              </>
            ) : (
              <>
                The morning phone call Papa{' '}
                <span className="text-amber-900 italic underline decoration-amber-300 decoration-wavy underline-offset-8">
                  actually looks forward
                </span>{' '}
                to.
              </>
            )}
          </h1>

          {/* Subheading */}
          <p className="font-sans text-sm sm:text-base lg:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
            {currentLang === 'hi' ? (
              'आप दूर शहर में उनकी बीपी की गोली और अकेलेपन को लेकर चिंतित रहते हैं। माता-पिता को ऐप के अलार्म से मरीज जैसा महसूस होना पसंद नहीं। सम्बन्ध हर सुबह उनके सामान्य फोन पर एक आत्मीय रिश्तेदार की तरह बात करता है—सम्मान के साथ दवा की पुष्टि, नेटमेड्स से ऑटो-रिफिल, और आपको 30 सेकंड में पूरी तसल्ली।'
            ) : (
              'You worry about their daily medicines and loneliness. They hate feeling like patients with beeping gadgets. Jio Sambandh calls your parents on their regular phone every morning like a loving family member—checking on their health with dignity, auto-refilling medicines, and giving you complete peace of mind in 30 seconds.'
            )}
          </p>

          {/* Dual CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={scrollToSignUp}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#0057E7] hover:bg-[#0047C4] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>{currentLang === 'hi' ? '14 दिन का फ्री ट्रायल शुरू करें' : 'Start 14-Day Free Care'}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              type="button"
              onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-900 font-bold text-sm border border-[#DFDAD1] shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-700" />
              <span>{currentLang === 'hi' ? 'लाइव डेमो कंसोल खोलें ⚡' : 'Launch Live Demo Console ⚡'}</span>
            </button>
          </div>

          {/* Quick Value Metrics */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 pt-4 text-xs font-semibold text-stone-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Works on any keypad or landline</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Netmeds 48-hr auto doorstep delivery</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>100% DPDP Act 2023 private</span>
            </span>
          </div>
        </div>

        {/* The Interactive Voice Player Hero Card */}
        <div className="max-w-4xl mx-auto">
          <InteractiveVoicePlayer />
        </div>

        {/* Demo Quick-Launch Scenario Bar for Evaluators / Judges */}
        <div className="max-w-4xl mx-auto bg-[#FAF4EC]/80 p-3 sm:p-4 rounded-2xl border border-[#E7E2DB] shadow-2xs">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-stone-900 shrink-0">
              <Sparkles className="w-4 h-4 text-amber-800" />
              <span>Interactive Scenarios:</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-1.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL', 'elder')}
                className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-800 text-[11px] font-semibold rounded-xl border border-stone-200 shadow-2xs transition-all cursor-pointer"
              >
                📞 Morning Voice Call
              </button>
              <button
                type="button"
                onClick={() => launchDemoScenario('SCENARIO_ROUTINE_REFILL', 'caregiver')}
                className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-800 text-[11px] font-semibold rounded-xl border border-stone-200 shadow-2xs transition-all cursor-pointer"
              >
                📦 Netmeds Auto-Refill
              </button>
              <button
                type="button"
                onClick={() => {
                  launchDemoScenario('SCENARIO_MORNING_CALL', 'elder');
                  openConsultationModal();
                }}
                className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-800 text-[11px] font-semibold rounded-xl border border-stone-200 shadow-2xs transition-all cursor-pointer"
              >
                🩺 In-Clinic Doctor Bridge
              </button>
              <button
                type="button"
                onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL', 'youth')}
                className="px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-800 text-[11px] font-semibold rounded-xl border border-stone-200 shadow-2xs transition-all cursor-pointer"
              >
                🎓 Youth Wisdom Bridge
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
