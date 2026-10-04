import React from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { JioLogo } from '../../data/brandLogos';

interface PricingPlansSectionProps {
  currentLang: 'en' | 'hi';
}

export const PricingPlansSection: React.FC<PricingPlansSectionProps> = ({ currentLang }) => {
  const scrollToSignUp = () => {
    const el = document.getElementById('signup-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4EC] border border-[#E7E2DB] text-amber-950 text-xs font-bold font-sans">
            <JioLogo className="w-3.5 h-3.5 rounded-sm shrink-0" />
            <span>Simple, Transparent Pricing</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {currentLang === 'hi'
              ? 'हर भारतीय परिवार के लिए सुलभ और पारदर्शी प्लान।'
              : 'Affordable for every Indian family. No hidden fees.'}
          </h2>

          <p className="font-sans text-sm sm:text-base text-stone-600 leading-relaxed">
            {currentLang === 'hi'
              ? '14 दिनों का निःशुल्क ट्रायल। किसी क्रेडिट कार्ड की आवश्यकता नहीं।'
              : 'Includes a 14-day risk-free trial. Upgrade, pause, or cancel anytime with one click.'}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
          {/* Plan 1: Jio Sambandh Basic */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E2DB] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Jio Bundle</span>
                <h3 className="font-serif text-xl font-bold text-stone-900 mt-1">Sambandh Basic</h3>
                <p className="text-xs text-stone-600 mt-1">
                  Included free with eligible JioFiber & JioPostpaid Family plans.
                </p>
              </div>

              <div className="pt-2 flex items-baseline gap-1">
                <span className="font-serif text-3xl font-bold text-stone-900">₹0</span>
                <span className="text-xs text-stone-500">/ month</span>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-2.5 text-xs text-stone-700">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Daily morning companion check-in call</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Vernacular Indic speech (Hindi & regional)</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Weekly family health summary on WhatsApp</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Works on basic keypad phones & landlines</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToSignUp}
              className="w-full py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs transition-all cursor-pointer"
            >
              Activate with Jio Number
            </button>
          </div>

          {/* Plan 2: Jio Sambandh Family Pro (Featured) */}
          <div className="bg-[#FAF8F5] p-6 sm:p-8 rounded-3xl border-2 border-amber-600 shadow-xl relative flex flex-col justify-between space-y-6 transform lg:-translate-y-2">
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 bg-amber-900 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
              ★ Most Popular Care Choice
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Autonomous Care</span>
                <h3 className="font-serif text-2xl font-bold text-stone-900 mt-1">Sambandh Family Pro</h3>
                <p className="text-xs text-stone-600 mt-1">
                  Complete daily companionship, autonomous refills, and peace of mind.
                </p>
              </div>

              <div className="pt-2 flex items-baseline gap-1">
                <span className="font-serif text-4xl font-bold text-stone-900">₹199</span>
                <span className="text-xs text-stone-500">/ month</span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded ml-2">
                  Save 20% Annual
                </span>
              </div>

              <div className="pt-4 border-t border-amber-200 space-y-2.5 text-xs text-stone-800">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Everything in Basic, plus:</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Autonomous Netmeds Refills</strong> 48h before empty</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Instant 30-Sec WhatsApp Briefings</strong> for caregiver</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>In-Clinic Doctor Consultation Transcriber</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>24/7 Acoustic Emergency Tripwire</strong> security</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToSignUp}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0057E7] hover:bg-[#0047C4] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Start 14-Day Free Care Pro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Plan 3: Jio Sambandh Elder Plus */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E2DB] shadow-xs flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Premium Concierge</span>
                <h3 className="font-serif text-xl font-bold text-stone-900 mt-1">Sambandh Elder Plus</h3>
                <p className="text-xs text-stone-600 mt-1">
                  For complex multi-chronic care with dedicated human coordinator support.
                </p>
              </div>

              <div className="pt-2 flex items-baseline gap-1">
                <span className="font-serif text-3xl font-bold text-stone-900">₹399</span>
                <span className="text-xs text-stone-500">/ month</span>
              </div>

              <div className="pt-4 border-t border-stone-100 space-y-2.5 text-xs text-stone-700">
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Everything in Family Pro, plus:</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Dedicated Geriatric Care Navigator on call</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Priority Specialist Doctor appointment booking</span>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Quarterly Home Blood Sample Collection coordination</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={scrollToSignUp}
              className="w-full py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs transition-all cursor-pointer"
            >
              Get Elder Plus
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
