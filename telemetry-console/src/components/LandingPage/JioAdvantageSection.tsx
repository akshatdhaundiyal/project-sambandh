import React from 'react';
import { GnaniLogo, PineLabsLogo, DelhiveryLogo, JioLogo, MedGemmaLogo, AbdmLogo } from '../../data/brandLogos';

interface JioAdvantageSectionProps {
  currentLang: 'en' | 'hi';
}

export const JioAdvantageSection: React.FC<JioAdvantageSectionProps> = ({ currentLang }) => {
  return (
    <section id="partner-rails" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#F5F2EC] border-y border-[#E7E2DB]">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-2.5">
          <span className="text-xs font-semibold text-stone-800 font-sans">
            How the three competition rails fit
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {currentLang === 'hi'
              ? 'तीन मजबूत रेल्स, जो हर कॉल, पेमेंट और डिलीवरी को संभालते हैं।'
              : 'The three partner rails behind every action.'}
          </h2>

          <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl mx-auto">
            {currentLang === 'hi'
              ? 'प्रत्येक पार्टनर का एक स्पष्ट कार्य है—ज्ञानि वॉयस के लिए, पाइन लैब्स भुगतान के लिए, और डेलीवरी घर तक डिलीवरी के लिए।'
              : 'Each competition rail has a clear job. The agent coordinates them strictly within the caregiver\'s rules.'}
          </p>
        </div>

        {/* 3 Rails Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {/* Rail 1: Gnani.ai */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E7E2DB] shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <GnaniLogo className="w-8 h-8 rounded-xl shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Gnani (Voice Layer)</h3>
                  <span className="text-[11px] text-stone-500">Places & takes every call</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Turns spoken Hindi and regional languages into text and replies back with authentic Indic speech cadence. Tracks tone, pauses, and background sounds over time for wellbeing and mood sensing.
              </p>
            </div>

            <div className="p-2.5 bg-stone-50 rounded-xl text-[11px] text-stone-600 border border-stone-200">
              Flows: <strong>Flow 1 to Flow 6 (All Calls)</strong>
            </div>
          </div>

          {/* Rail 2: Pine Labs */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E7E2DB] shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <PineLabsLogo className="w-8 h-8 rounded-xl shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Pine Labs (Payments)</h3>
                  <span className="text-[11px] text-stone-500">Capped at rupee limit</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Executes automated payments for prescription reorders, OTC medicines, flowers, and prasadam strictly within the caregiver's rupee limit. Any order above the limit pauses for explicit 1-tap approval.
              </p>
            </div>

            <div className="p-2.5 bg-stone-50 rounded-xl text-[11px] text-stone-600 border border-stone-200">
              Flows: <strong>Flow 2 (Refills), Flow 3, Flow 6</strong>
            </div>
          </div>

          {/* Rail 3: Delhivery */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E7E2DB] shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <DelhiveryLogo className="w-8 h-8 rounded-xl shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Delhivery (Doorstep Delivery)</h3>
                  <span className="text-[11px] text-stone-500">Ships medicines & gifts</span>
                </div>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Delivers prescription medicines from Netmeds, as well as flowers and prasadam to the parent's home with tracking updates. Also acts as a doorstep wellbeing alert if a delivery goes unanswered.
              </p>
            </div>

            <div className="p-2.5 bg-stone-50 rounded-xl text-[11px] text-stone-600 border border-stone-200">
              Flows: <strong>Flow 2 (Delivery), Flow 3, Flow 6</strong>
            </div>
          </div>
        </div>

        {/* Other Partners Bar */}
        <div className="max-w-5xl mx-auto bg-white p-4 rounded-2xl border border-stone-200 flex flex-wrap items-center justify-around gap-4 text-xs text-stone-700">
          <div className="flex items-center gap-2">
            <JioLogo className="w-5 h-5 rounded-md" />
            <span className="font-semibold">Reliance Jio 4G/5G VoLTE</span>
          </div>
          <div className="flex items-center gap-2">
            <MedGemmaLogo className="w-5 h-5 rounded-md" />
            <span>MedGemma Clinical Prescription Reader</span>
          </div>
          <div className="flex items-center gap-2">
            <AbdmLogo className="w-5 h-5 rounded-md" />
            <span>ABDM ABHA Health Records</span>
          </div>
        </div>
      </div>
    </section>
  );
};
