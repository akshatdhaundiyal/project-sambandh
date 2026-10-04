import React from 'react';
import { Stethoscope, Sparkles, Volume2, CheckCircle2, FileText, Lock, ShieldCheck } from 'lucide-react';
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
    <section id="doctor-bridge" className="py-16 sm:py-20 px-4 sm:px-6 bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-2.5">
          <span className="text-xs font-semibold text-purple-950 font-sans">
            In-clinic hospital visit (Flow 4)
          </span>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {currentLang === 'hi'
              ? 'डॉक्टर की सलाह—सहमति के साथ रिकॉर्डिंग, स्पष्ट हिंदी में समझ।'
              : 'Hospital visits with explicit doctor consent and clean transcripts.'}
          </h2>

          <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl mx-auto">
            {currentLang === 'hi'
              ? 'अस्पताल में एजेंट डॉक्टर से पहले अनुमति मांगता है। सहमति मिलने पर MedGemma पर्चे को पढ़कर मेडिकल रिकॉर्ड में दर्ज करता है और परिजनों को समरी भेजता है।'
              : 'The agent asks the doctor for permission before recording. Prescriptions and reports are read by MedGemma directly into the parent\'s medical record.'}
          </p>
        </div>

        {/* Doctor Bridge Card */}
        <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-[#E7E2DB] shadow-sm space-y-6">
          {/* Doctor Consent Step Banner */}
          <div className="bg-[#FAF4EC] p-3.5 sm:p-4 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-purple-800 text-white flex items-center justify-center font-bold text-xs">
                🩺
              </div>
              <div>
                <strong className="text-stone-900 block">Step 1: Doctor Consent First</strong>
                <span className="text-stone-600">
                  "नमस्ते डॉक्टर साहब, क्या मैं परिवार के रिकॉर्ड के लिए यह बातचीत रिकॉर्ड कर सकता हूँ?"
                </span>
              </div>
            </div>

            <span className="text-[11px] font-mono text-purple-900 bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 shrink-0">
              MedGemma Clinical Engine
            </span>
          </div>

          {/* 2 Outputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Papa\'s Hindi Voice Note */}
            <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-amber-200 space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-950 flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-amber-800" />
                    <span>Papa's Spoken Hindi Summary</span>
                  </span>
                  <span className="text-[10px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                    Spoken note
                  </span>
                </div>

                <p className="font-serif text-stone-900 text-xs sm:text-sm leading-relaxed p-2.5 bg-white rounded-xl border border-stone-200">
                  "डॉक्टर साहब ने कहा कि बीपी 138/88 स्थिर है। खाने में नमक कम रखना है और शाम को 20 मिनट टहलना जारी रखें। रात को आधी गोली Glycomet 500 भोजन के बाद लेनी है।"
                </p>
              </div>

              <span className="text-[11px] text-stone-500">Plays on the next morning call</span>
            </div>

            {/* Son\'s Action Checklist */}
            <div className="bg-[#EFEAE2] p-4 rounded-2xl border border-[#D5CFC6] space-y-2.5 flex flex-col justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-900 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-teal-700" />
                    <span>Caregiver Actionable Checklist</span>
                  </span>
                  <span className="text-[10px] font-mono bg-white text-stone-700 px-2 py-0.5 rounded-md border border-stone-300">
                    WhatsApp
                  </span>
                </div>

                <div className="p-2.5 bg-white rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1.5">
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Telma 40:</strong> Continued without change.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
                    <span><strong>Metformin 500:</strong> Halved to 1/2 tablet BD.</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                    <span><strong>Lipid Profile Lab:</strong> Due in 3 weeks.</span>
                  </div>
                </div>
              </div>

              <span className="text-[11px] text-stone-600">Saved to parent's medical record</span>
            </div>
          </div>

          {/* Test in Console Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-stone-200">
            <span className="text-xs text-stone-600">
              If the doctor refuses recording, the agent notes down what the parent remembers after the visit.
            </span>

            <button
              type="button"
              onClick={handleOpenDoctorDemo}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0057E7] hover:bg-[#0047C4] text-white font-medium text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Test doctor bridge modal</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
