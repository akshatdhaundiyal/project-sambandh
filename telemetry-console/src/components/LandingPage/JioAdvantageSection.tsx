import React from 'react';
import { Smartphone, Truck, ShieldCheck, Database, Zap, Lock, Award } from 'lucide-react';
import { JioLogo, PineLabsLogo, DelhiveryLogo, AbdmLogo } from '../../data/brandLogos';

interface JioAdvantageSectionProps {
  currentLang: 'en' | 'hi';
}

export const JioAdvantageSection: React.FC<JioAdvantageSectionProps> = ({ currentLang }) => {
  return (
    <section id="jio-advantage" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#F5F2EC] border-y border-[#E7E2DB]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF4EC] border border-[#E7E2DB] text-amber-950 text-xs font-bold font-sans">
            <JioLogo className="w-3.5 h-3.5 rounded-sm shrink-0" />
            <span>The Reliance Jio Strategic Ecosystem</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {currentLang === 'hi'
              ? '45 करोड़ भारतीयों का भरोसा, शून्य हार्डवेयर का खर्च।'
              : 'Built on India’s largest digital infrastructure. Zero hardware cost.'}
          </h2>

          <p className="font-sans text-sm sm:text-base text-stone-600 leading-relaxed">
            {currentLang === 'hi'
              ? 'किसी महंगे स्मार्टवॉच या जटिल गैजेट की जरूरत नहीं। जियो के 4G/5G नेटवर्क, नेटमेड्स और जियो-पे के साथ हर भारतीय परिवार के लिए सुलभ।'
              : 'No ₹25,000 smartwatches. No complicated charging docks. Powered by Jio’s nationwide VoLTE telephony trunk, Netmeds fulfillment, and Pine Labs UPI rails.'}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Pillar 1: Zero Hardware / Any Phone */}
          <div className="bg-white p-6 rounded-3xl border border-[#E7E2DB] shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-[#0057E7]/10 flex items-center justify-center text-[#0057E7]">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900">
              Works on Any Phone
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Functions seamlessly on a ₹1,200 JioPhone, keypad phone, basic landline, or smartphone. No internet connection or app required for elders.
            </p>
            <div className="pt-2 text-[11px] font-bold text-amber-900 border-t border-stone-100">
              ₹0 Hardware Expense
            </div>
          </div>

          {/* Pillar 2: Netmeds Pharmacy Spine */}
          <div className="bg-white p-6 rounded-3xl border border-[#E7E2DB] shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
              <Truck className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900">
              Netmeds 1,000+ Cities
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Reliance Netmeds dark-store network guarantees 24–48 hr doorstep delivery of authentic medicines before strips run out.
            </p>
            <div className="pt-2 text-[11px] font-bold text-emerald-800 border-t border-stone-100">
              100% Genuine Pharmacy Salts
            </div>
          </div>

          {/* Pillar 3: JioPay & Pine Labs UPI */}
          <div className="bg-white p-6 rounded-3xl border border-[#E7E2DB] shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-700">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900">
              Safe UPI Autopay
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Pine Labs & JioPay recurring mandates allow autonomous refills strictly within your caregiver limit (e.g. ₹4,500/mo). No surprise charges.
            </p>
            <div className="pt-2 text-[11px] font-bold text-teal-900 border-t border-stone-100">
              1-Tap 2FA Protection
            </div>
          </div>

          {/* Pillar 4: ABDM & DPDP Act 2023 */}
          <div className="bg-white p-6 rounded-3xl border border-[#E7E2DB] shadow-xs hover:shadow-md transition-all space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-base font-bold text-stone-900">
              ABDM & ABHA Compliant
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Interoperable Ayushman Bharat Digital Mission (ABHA) records with end-to-end encryption under India’s DPDP Act 2023.
            </p>
            <div className="pt-2 text-[11px] font-bold text-indigo-900 border-t border-stone-100">
              Fiduciary Privacy Standard
            </div>
          </div>
        </div>

        {/* Partner Rails Row */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E7E2DB] flex flex-wrap items-center justify-around gap-6">
          <div className="flex items-center gap-2">
            <JioLogo className="w-5 h-5 rounded-md" />
            <span className="text-xs font-bold text-stone-800">Reliance Jio 4G/5G PSTN</span>
          </div>
          <div className="flex items-center gap-2">
            <PineLabsLogo className="w-5 h-5 rounded-md" />
            <span className="text-xs font-bold text-stone-800">Pine Labs Plural UPI</span>
          </div>
          <div className="flex items-center gap-2">
            <DelhiveryLogo className="w-5 h-5 rounded-md" />
            <span className="text-xs font-bold text-stone-800">Delhivery Express CMU</span>
          </div>
          <div className="flex items-center gap-2">
            <AbdmLogo className="w-5 h-5 rounded-md" />
            <span className="text-xs font-bold text-stone-800">ABDM FHIR R4 Health Vault</span>
          </div>
        </div>
      </div>
    </section>
  );
};
