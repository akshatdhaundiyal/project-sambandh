import React from 'react';
import { PhoneCall, Package, MessageSquare, Clock, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

interface DailyMomentsSectionProps {
  currentLang: 'en' | 'hi';
}

export const DailyMomentsSection: React.FC<DailyMomentsSectionProps> = ({ currentLang }) => {
  const { launchDemoScenario } = useTelemetry();

  return (
    <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Section Title */}
      <div className="max-w-3xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold font-sans">
          <Clock className="w-3.5 h-3.5 text-teal-700" />
          <span>The Daily Care Loop</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          {currentLang === 'hi'
            ? 'दिन के 3 सहज पल, जो परिवार को जोड़ते हैं।'
            : '3 effortless moments that keep your family connected.'}
        </h2>

        <p className="font-sans text-sm sm:text-base text-stone-600 leading-relaxed">
          {currentLang === 'hi'
            ? 'बिना किसी झंझट या तकनीकी कठिनाई के—माता-पिता के लिए सामान्य फोन कॉल, आपके लिए पूरी निश्चिंतता।'
            : 'Zero apps or gadgets for your parents. Total transparency and relief for you.'}
        </p>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {/* Step 1: Morning Voice Call */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E7E2DB] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                08:30 AM
              </span>
              <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900">
                <PhoneCall className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 tracking-tight">
                1. The Morning Chai Call
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                Sambandh dials your parents on their regular phone. They enjoy a 3-minute warm conversation about morning weather, tea, and local news. Medicine adherence is confirmed naturally during conversation without clinical friction.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-stone-200 text-xs text-stone-700">
            <span className="font-bold text-amber-950 block mb-0.5">Spoken in Hindi / Vernacular:</span>
            <p className="italic text-stone-600">"प्रणाम अंकल! नाश्ते के बाद वाली लाल गोली ले ली थी ना आपने?"</p>
          </div>
        </div>

        {/* Step 2: Autonomous Netmeds Refills */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E7E2DB] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-teal-900 bg-teal-50 px-2.5 py-1 rounded-xl border border-teal-200">
                Auto-Triggered
              </span>
              <div className="w-10 h-10 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-900">
                <Package className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 tracking-tight">
                2. Doorstep Netmeds Delivery
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                When medicine stock drops below 5 days, Sambandh autonomously orders the prescription refill via Netmeds within your pre-set monthly budget. Medicines arrive 48 hours before the bottle empties with zero OTPs for parents.
              </p>
            </div>
          </div>

          <div className="p-3 bg-teal-50/70 rounded-2xl border border-teal-100 text-xs text-teal-950">
            <span className="font-bold block mb-0.5">Fiduciary Peace of Mind:</span>
            <p className="text-[11px] text-teal-900">Auto-debits ₹680 under your ₹4,500 limit. Spikes require your 1-tap Telegram approval.</p>
          </div>
        </div>

        {/* Step 3: Caregiver WhatsApp Briefing */}
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#E7E2DB] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-indigo-900 bg-indigo-50 px-2.5 py-1 rounded-xl border border-indigo-200">
                08:34 AM
              </span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-900">
                <MessageSquare className="w-5 h-5" />
              </div>
            </div>

            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 tracking-tight">
                3. 30-Second WhatsApp Digest
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed">
                You get an instant, concise WhatsApp briefing wherever you are in the world. See their mood, confirmed medicines, refill status, and any doctor visit notes at a single glance.
              </p>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950">
            <span className="font-bold block mb-0.5">Zero Cognitive Anxiety:</span>
            <p className="text-[11px] text-emerald-900">No need to call with anxious interrogations. You start your workday with complete relief.</p>
          </div>
        </div>
      </div>

      {/* Interactive Try Live Button */}
      <div className="text-center pt-4">
        <button
          type="button"
          onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Experience the 3 Moments in Live Console ⚡</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
