import React from 'react';
import { XCircle, CheckCircle2, HeartHandshake, ShieldAlert, Sparkles, Smile } from 'lucide-react';

interface DignityGapSectionProps {
  currentLang: 'en' | 'hi';
}

export const DignityGapSection: React.FC<DignityGapSectionProps> = ({ currentLang }) => {
  return (
    <section id="dignity-gap" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F5F2EC] border-y border-[#E7E2DB]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-950 text-xs font-bold font-sans">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
            <span>The Dignity Gap</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {currentLang === 'hi'
              ? 'बुज़ुर्गों को दवा का अलार्म नहीं, अपनेपन और सम्मान की जरूरत है।'
              : 'Parents don’t reject medicines. They reject feeling like patients.'}
          </h2>

          <p className="font-sans text-sm sm:text-base text-stone-600 leading-relaxed">
            {currentLang === 'hi'
              ? 'डिजिटल स्वास्थ्य ऐप्स इसलिए असफल होते हैं क्योंकि वे 70 वर्षीय माता-पिता को बच्चों की तरह ट्रीट करते हैं। सम्बन्ध इस सोच को बदलता है।'
              : 'Traditional health apps fail because they treat 70-year-old respected patriarchs and matriarchs like helpless children. Jio Sambandh inverts this completely.'}
          </p>
        </div>

        {/* Side-by-Side Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {/* Left Column: Old Nanny-Ware Apps */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-200 shadow-sm relative space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Traditional "Nanny-Ware" Apps</h3>
                <span className="text-xs text-rose-700 font-medium">Why 75% of elders abandon them</span>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <span className="text-rose-600 font-bold text-base shrink-0 mt-0.5">✕</span>
                <div>
                  <strong className="text-stone-900">Humiliating Alarms & Gadgets:</strong> Smart pill dispensers that beep annoyingly make parents feel monitored and infantalized.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-rose-600 font-bold text-base shrink-0 mt-0.5">✕</span>
                <div>
                  <strong className="text-stone-900">App Fatigue & Screen Clutter:</strong> 12 confusing screens, forgotten passwords, and tiny fonts that cause frustration.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-rose-600 font-bold text-base shrink-0 mt-0.5">✕</span>
                <div>
                  <strong className="text-stone-900">The Daily Interrogation Call:</strong> Calling everyday with <em>"Papa did you take medicine?"</em> triggers guilt, defensiveness, and false compliance.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-rose-600 font-bold text-base shrink-0 mt-0.5">✕</span>
                <div>
                  <strong className="text-stone-900">Zero Emotional Value:</strong> Ignores the real root problem—isolation, loneliness, and loss of purpose.
                </div>
              </div>
            </div>

            <div className="p-3 bg-rose-50/70 rounded-2xl border border-rose-100 text-xs text-rose-900 italic">
              "When my son calls just to ask about pills, it feels like I am only an errand on his to-do list."
            </div>
          </div>

          {/* Right Column: The Jio Sambandh Way */}
          <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border-2 border-emerald-300 shadow-md relative space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-800">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">The Jio Sambandh Promise</h3>
                  <span className="text-xs text-emerald-800 font-bold">Companion First · Health Ambiently</span>
                </div>
              </div>

              <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                Zero Friction
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-stone-700">
              <div className="flex items-start gap-3">
                <span className="text-emerald-700 font-bold text-base shrink-0 mt-0.5">✓</span>
                <div>
                  <strong className="text-stone-900">100% Voice on Regular Phone:</strong> Works over ordinary phone lines on any phone (JioPhone, basic keypad, landline, smartphone).
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-emerald-700 font-bold text-base shrink-0 mt-0.5">✓</span>
                <div>
                  <strong className="text-stone-900">Morning Chai & Life Banter:</strong> Opens with local news, morning sunshine, and asking for their lifetime advice and mentorship.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-emerald-700 font-bold text-base shrink-0 mt-0.5">✓</span>
                <div>
                  <strong className="text-stone-900">Dignity-Preserving Health Check:</strong> Medication adherence is confirmed organically during tea conversation without clinical pressure.
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-emerald-700 font-bold text-base shrink-0 mt-0.5">✓</span>
                <div>
                  <strong className="text-stone-900">Automated Caregiver Reassurance:</strong> Refills arrive at doorstep automatically; child receives a 30-second WhatsApp digest.
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-medium">
              "It feels like a loving daughter calling every morning to ask how my day is going."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
