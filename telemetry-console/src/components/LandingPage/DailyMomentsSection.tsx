import React from 'react';
import { PhoneCall, Package, PhoneIncoming, Stethoscope, GraduationCap, Flower2, Sparkles } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

interface DailyMomentsSectionProps {
  currentLang: 'en' | 'hi';
}

export const DailyMomentsSection: React.FC<DailyMomentsSectionProps> = ({ currentLang }) => {
  const { launchDemoScenario, openConsultationModal } = useTelemetry();

  const flows = [
    {
      id: 'flow-1',
      number: 'Flow 1',
      title: 'Daily Check-In Call',
      icon: PhoneCall,
      color: 'bg-amber-100 text-amber-900 border-amber-200',
      description:
        'Opens with weather, a joke, or local news, then has a real conversation. In the second half, it gently checks on any medicine not yet taken. Listens to voice tone and pauses for mood. Caregiver gets a concise WhatsApp update.',
      meta: 'Scheduled morning window',
      action: () => launchDemoScenario('SCENARIO_MORNING_CALL', 'elder')
    },
    {
      id: 'flow-2',
      number: 'Flow 2 (Core)',
      title: 'Medicine Reorder',
      icon: Package,
      color: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      description:
        'Reminds caregiver 1 week before a medicine runs out. Checks the order against the caregiver\'s rupee limit, pays through Pine Labs, and Delhivery delivers to the doorstep. Caregiver gets positive reinforcement: "Because of you, Maa won\'t miss a single dose this month."',
      meta: 'Pine Labs + Delhivery Rail',
      action: () => launchDemoScenario('SCENARIO_ROUTINE_REFILL', 'caregiver')
    },
    {
      id: 'flow-3',
      number: 'Flow 3',
      title: 'Parent Dials In Anytime',
      icon: PhoneIncoming,
      color: 'bg-blue-100 text-blue-900 border-blue-200',
      description:
        'The parent calls the agent\'s number whenever they like to chat, share a memory, or request an over-the-counter medicine. Medicine requests within the limit trigger the standard fulfillment flow.',
      meta: '24/7 dedicated telephone line',
      action: () => launchDemoScenario('SCENARIO_MORNING_CALL', 'elder')
    },
    {
      id: 'flow-4',
      number: 'Flow 4',
      title: 'In-Clinic Hospital Visit',
      icon: Stethoscope,
      color: 'bg-purple-100 text-purple-900 border-purple-200',
      description:
        'During the doctor visit, the agent on speaker asks the doctor for consent first before recording. Prescriptions and lab reports are processed by MedGemma into the medical record, and the caregiver gets the full transcript and follow-up checklist.',
      meta: 'Doctor consent required',
      action: () => {
        launchDemoScenario('SCENARIO_MORNING_CALL', 'elder');
        openConsultationModal();
      }
    },
    {
      id: 'flow-5',
      number: 'Flow 5',
      title: 'Elder Wisdom for Young People',
      icon: GraduationCap,
      color: 'bg-indigo-100 text-indigo-900 border-indigo-200',
      description:
        'Questions collected from young people are matched to the elder\'s retired career expertise. On the call, the elder answers in their own words, which is transcribed back to the youth, making the caregiver feel proud.',
      meta: 'Intergenerational mentorship',
      action: () => launchDemoScenario('SCENARIO_MORNING_CALL', 'youth')
    },
    {
      id: 'flow-6',
      number: 'Flow 6',
      title: 'Mood Lifter (Flowers & Prasadam)',
      icon: Flower2,
      color: 'bg-rose-100 text-rose-900 border-rose-200',
      description:
        'When the agent senses the parent is feeling low over a few days, it asks the caregiver whether to send fresh flowers or temple prasadam today. On caregiver approval, it pays via Pine Labs and Delhivery delivers.',
      meta: 'Caregiver approval required',
      action: () => launchDemoScenario('SCENARIO_ROUTINE_REFILL', 'caregiver')
    }
  ];

  return (
    <section id="six-flows" className="py-16 sm:py-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-2.5">
        <span className="text-xs font-semibold text-amber-950 font-sans">
          The 6 core care journeys
        </span>

        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          {currentLang === 'hi'
            ? '6 प्रमुख यात्राएं जब सब कुछ सही तरीके से काम करता है।'
            : 'Six journeys designed for everyday family life.'}
        </h2>

        <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed max-w-xl mx-auto">
          {currentLang === 'hi'
            ? 'दवाओं की पुनः आपूर्ति से लेकर डॉक्टर विजिट और मन बहलाने तक—हर कदम देखभाल करने वाले के नियमों के दायरे में।'
            : 'From daily morning check-ins and automatic medicine refills to in-clinic doctor transcription and youth mentorship.'}
        </p>
      </div>

      {/* 6 Flows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {flows.map((flow) => {
          const IconComp = flow.icon;
          return (
            <div
              key={flow.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-[#E7E2DB] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-full border ${flow.color}`}>
                    {flow.number}
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-stone-100 flex items-center justify-center text-stone-700">
                    <IconComp className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    {flow.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1.5 leading-relaxed font-sans">
                    {flow.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="text-stone-500 font-sans">{flow.meta}</span>
                <button
                  type="button"
                  onClick={flow.action}
                  className="text-[#0057E7] hover:text-[#0047C4] font-semibold cursor-pointer"
                >
                  Test in console
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Console Launcher Note */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Launch interactive scenario runner in console</span>
        </button>
      </div>
    </section>
  );
};
