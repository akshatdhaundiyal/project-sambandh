import React from 'react';
import { ShieldCheck, Heart, User, Sparkles, MessageCircle, Lock } from 'lucide-react';

interface DignityGapSectionProps {
  currentLang: 'en' | 'hi';
}

export const DignityGapSection: React.FC<DignityGapSectionProps> = ({ currentLang }) => {
  return (
    <section id="how-it-fits" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#F5F2EC] border-y border-[#E7E2DB]">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Title */}
        <div className="max-w-3xl mx-auto text-center space-y-2.5">
          <span className="text-xs font-semibold text-amber-950 font-sans">
            How it fits together
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {currentLang === 'hi'
              ? 'व्यस्त बेटे-बेटी और माता-पिता के बीच का आत्मीय सेतु।'
              : 'The agent sits between a busy caregiver and their parent.'}
          </h2>

          <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl mx-auto">
            {currentLang === 'hi'
              ? 'देखभाल करने वाले नियम तय करते हैं और माता-पिता सामान्य रूप से बात करते हैं। एजेंट केवल आपकी सहमति से ही कदम उठाता है।'
              : 'The caregiver sets the rules and the parent simply talks; the agent does everything else by calling its partners, only on the caregiver\'s approval.'}
          </p>
        </div>

        {/* 3-Pillar Architectural Diagram from Document */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto items-stretch">
          {/* Box 1: Caregiver (The Customer) */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E7E2DB] shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-900 font-bold text-xs">
                  1
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">Caregiver (Son / Daughter)</h3>
                  <span className="text-[11px] text-stone-500">Sets rules, approves spends, gets updates</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">·</span>
                  <span>Sets call times, frequency, and rupee limits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">·</span>
                  <span>Approves medicine reorders, flowers, and prasadam</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-700 font-bold">·</span>
                  <span>Receives daily updates, alerts, and visit transcripts</span>
                </li>
              </ul>
            </div>

            <div className="p-2.5 bg-stone-50 rounded-xl text-[11px] text-stone-600 border border-stone-200">
              Meets agent via: <strong>Caregiver Telegram / WhatsApp</strong>
            </div>
          </div>

          {/* Box 2: Voice Agent (The Extended Arm) */}
          <div className="bg-[#FAF8F5] p-5 sm:p-6 rounded-3xl border-2 border-amber-300 shadow-sm space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-800 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <h3 className="text-sm font-bold text-stone-900">Jio × Sambandh Voice Agent</h3>
                  <span className="text-[11px] text-amber-950 font-medium">Obeys rules & guardrails</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-stone-800 pt-2 border-t border-amber-200/80">
                <li className="flex items-start gap-2">
                  <span className="text-amber-800 font-bold">·</span>
                  <span>Strict guardrails on advice (never diagnoses)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-800 font-bold">·</span>
                  <span>Tone & wellbeing sensing for mood and lucidity</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-800 font-bold">·</span>
                  <span>Maintains memory: profile, medicines, reports, life archive</span>
                </li>
              </ul>
            </div>

            <div className="p-2.5 bg-amber-100/70 rounded-xl text-[11px] text-amber-950 border border-amber-200">
              Zero apps required for parents: <strong>PSTN / VoLTE Phone</strong>
            </div>
          </div>

          {/* Box 3: Elderly Parent */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E7E2DB] shadow-2xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center text-teal-900 font-bold text-xs">
                  3
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">Elderly Parent</h3>
                  <span className="text-[11px] text-stone-500">The person the agent talks to</span>
                </div>
              </div>

              <ul className="space-y-2 text-xs text-stone-700 pt-2 border-t border-stone-100">
                <li className="flex items-start gap-2">
                  <span className="text-teal-700 font-bold">·</span>
                  <span>Gets warm check-in calls in native Hindi / vernacular</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-700 font-bold">·</span>
                  <span>Dials in anytime to chat or request OTC medicine</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-700 font-bold">·</span>
                  <span>Answers questions from young people on retired career</span>
                </li>
              </ul>
            </div>

            <div className="p-2.5 bg-stone-50 rounded-xl text-[11px] text-stone-600 border border-stone-200">
              Meets agent via: <strong>Regular Incoming Phone Calls</strong>
            </div>
          </div>
        </div>

        {/* Privacy & Human Contact Guarantee */}
        <div className="max-w-3xl mx-auto bg-white p-4 rounded-2xl border border-stone-200 text-center text-xs text-stone-700 flex flex-col sm:flex-row items-center justify-around gap-3">
          <span className="flex items-center gap-1.5 font-medium">
            <Heart className="w-4 h-4 text-amber-800" />
            <span>Human contact first: never replaces family calls</span>
          </span>
          <span className="text-stone-300 hidden sm:inline">|</span>
          <span className="flex items-center gap-1.5 font-medium">
            <Lock className="w-4 h-4 text-teal-700" />
            <span>What parent confides stays private</span>
          </span>
        </div>
      </div>
    </section>
  );
};
