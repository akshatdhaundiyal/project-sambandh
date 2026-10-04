import React from 'react';
import { Stethoscope, Sparkles, Volume2, CheckCircle2, FileText, ArrowRight, Play } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

interface DoctorBridgeSectionProps {
  currentLang: 'en' | 'hi';
}

export const DoctorBridgeSection: React.FC<DoctorBridgeSectionProps> = ({ currentLang }) => {
  const { openConsultationModal, launchDemoScenario } = useTelemetry();

  const handleOpenDoctorDemo = () => {
    launchDemoScenario('SCENARIO_MORNING_CALL', 'elder');
    openConsultationModal();
  };

  return (
    <section id="doctor-bridge" className="py-16 sm:py-24 px-4 sm:px-6 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-950 text-xs font-bold font-sans">
            <Stethoscope className="w-3.5 h-3.5 text-purple-700" />
            <span>In-Clinic Doctor Consultation Bridge</span>
          </div>

          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-stone-900 tracking-tight">
            {currentLang === 'hi'
              ? 'डॉक्टर की हर बात—पिताजी के लिए सरल हिंदी में, आपके लिए स्पष्ट चेकलिस्ट में।'
              : 'Translating confusing doctor visits into crystal-clear family care.'}
          </h2>

          <p className="font-sans text-sm sm:text-base text-stone-600 leading-relaxed">
            {currentLang === 'hi'
              ? 'क्लिनिक में बुज़ुर्ग डॉक्टर की बात सुनकर हाँ कह देते हैं, पर बाहर आकर भूल जाते हैं। सम्बन्ध का एम्बिएंट ट्रांसक्राइबर हर निर्देश को सुरक्षित करता है।'
              : 'Elders often nod politely during busy clinic visits but forget complex prescription changes. Sambandh listens ambiently and translates the visit into two simple outputs.'}
          </p>
        </div>

        {/* Transformation Flow Showcase */}
        <div className="max-w-5xl mx-auto bg-white p-6 sm:p-10 rounded-3xl border border-[#E7E2DB] shadow-lg space-y-8">
          {/* Top Banner: In-Room Capture */}
          <div className="bg-[#FAF4EC] p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-800 text-white flex items-center justify-center font-bold">
                🩺
              </div>
              <div>
                <strong className="text-stone-900 block">Ambient In-Room Consultation Capture</strong>
                <span>Dr. Arvind Saxena (Cardiology) with Ramesh Uncle</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-stone-500">MedGemma 4B Clinical Transformer</span>
            </div>
          </div>

          {/* 2-Output Split: Left = Papa\'s Hindi Voice Guide, Right = Son\'s WhatsApp Action Checklist */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Output 1: Papa's Hindi Audio Guide */}
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-amber-200/80 space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 text-amber-800" />
                    <span>1. Papa's Hindi Voice Guide (Devanagari)</span>
                  </span>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                    Spoken Audio Note
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2 text-xs">
                  <p className="font-serif text-stone-900 leading-relaxed text-sm">
                    "डॉक्टर साहब ने कहा कि बीपी 138/88 बिल्कुल सामान्य है। खाने में नमक थोड़ा कम रखना है और शाम को पार्क में 20 मिनट टहलना जारी रखें। रात को आधी गोली Glycomet 500 भोजन के बाद लेनी है।"
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-500">
                <span>Plays automatically on Papa's morning call</span>
                <span className="text-emerald-700 font-bold">✓ Zero Medical Jargon</span>
              </div>
            </div>

            {/* Output 2: Son's WhatsApp Action Checklist */}
            <div className="bg-[#EFEAE2] p-5 rounded-2xl border border-[#D5CFC6] space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-teal-700" />
                    <span>2. Son's Actionable WhatsApp Checklist</span>
                  </span>
                  <span className="text-[10px] font-mono bg-white text-stone-700 px-2 py-0.5 rounded-full font-bold border border-stone-300">
                    Instant Telegram/WA
                  </span>
                </div>

                <div className="p-3 bg-white rounded-xl border border-stone-200 space-y-2 text-xs text-stone-700">
                  <div className="flex items-center justify-between font-bold text-stone-900 border-b border-stone-100 pb-1">
                    <span>OPD Visit Summary: Dr. Saxena</span>
                    <span className="text-emerald-700">Stable</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px]">
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span><strong>Prescription Update:</strong> Telma 40 continued; Metformin 500mg halved.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                      <span><strong>Lab Scheduled:</strong> Lipid Profile test due in 3 weeks (Auto-booked).</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-stone-600">
                <span>EHR synced to ABHA Health Locker</span>
                <span className="font-bold text-teal-900">Rohan Approved</span>
              </div>
            </div>
          </div>

          {/* Interactive Launcher */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200">
            <p className="text-xs text-stone-600">
              Try the live ambient listener with real clinical transcripts in the evaluation console.
            </p>

            <button
              type="button"
              onClick={handleOpenDoctorDemo}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#0057E7] hover:bg-[#0047C4] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Try In-Clinic Transcriber Live ⚡</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
