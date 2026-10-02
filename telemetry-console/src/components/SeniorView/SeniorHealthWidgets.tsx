import React from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  Heart,
  Activity,
  Pill,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  UserCheck,
  Stethoscope
} from 'lucide-react';

export const SeniorHealthWidgets: React.FC = () => {
  const { currentStep, activeScenario } = useTelemetry();
  const { logistics, fiduciary } = currentStep;
  const clinical = activeScenario.initialClinicalState;

  const isDispatched = logistics.status === 'DISPATCHED';
  const isHeld = logistics.status === 'HELD';
  const isNormalStock = activeScenario.id === 'scenario-2';
  const isEmergency = currentStep.phase === 'CLINICAL_ESCALATION';

  const daysOfWeek = [
    { day: 'Mon', status: 'taken', isToday: false },
    { day: 'Tue', status: 'taken', isToday: false },
    { day: 'Wed', status: 'taken', isToday: false },
    { day: 'Thu', status: 'taken', isToday: false },
    { day: 'Fri', status: 'active', isToday: true },
    { day: 'Sat', status: 'pending', isToday: false },
    { day: 'Sun', status: 'pending', isToday: false }
  ];

  return (
    <div className="space-y-3">
      {/* Question prompt */}
      <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-stone-500 block mb-0.5">
            Daily Vitality & Routine Check
          </span>
          <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">
            How are you feeling this morning, Ramesh Ji?
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          Good & Peaceful
        </span>
      </div>

      {/* Row 1: Vitals Cards (BP, Glucose & Weekly Adherence) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Blood Pressure Card */}
        <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Heart className="w-4 h-4 fill-rose-500/20" />
              </div>
              <span className="text-xs font-semibold text-stone-600">Blood Pressure</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              Optimal
            </span>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
              120/80 <span className="text-xs font-sans font-normal text-stone-400">mmHg</span>
            </div>
            <span className="text-[11px] text-stone-500">Telmisartan 40mg active</span>
          </div>
        </div>

        {/* Blood Glucose Card */}
        <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-stone-600">Blood Glucose</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              Optimal
            </span>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-stone-900 tracking-tight">
              95–115 <span className="text-xs font-sans font-normal text-stone-400">mg/dL</span>
            </div>
            <span className="text-[11px] text-stone-500">Fasting morning normal</span>
          </div>
        </div>

        {/* Weekly Adherence Consistency Card */}
        <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Pill className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-stone-600">7-Day Adherence</span>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
              100%
            </span>
          </div>

          <div className="flex items-end justify-between gap-1 pt-1">
            {daysOfWeek.map((d) => (
              <div key={d.day} className="flex flex-col items-center gap-1">
                <div
                  className={`w-5 rounded-full transition-all ${
                    d.status === 'taken'
                      ? 'h-8 bg-emerald-200'
                      : d.status === 'active'
                      ? 'h-10 bg-emerald-700 shadow-2xs'
                      : 'h-6 bg-stone-100'
                  }`}
                />
                <span
                  className={`text-[10px] font-semibold ${
                    d.isToday ? 'text-emerald-800 font-bold' : 'text-stone-400'
                  }`}
                >
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Doorstep Courier & Family Peace of Mind */}
      <div className="bg-white border border-[#E7E2DB] rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#E7E2DB]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FAF8F5] border border-[#DFDAD1] flex items-center justify-center text-stone-700">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-sm text-stone-900">
                Doorstep Fulfillment & Caregiver Peace of Mind
              </h4>
              <p className="text-xs text-stone-500">Autonomous pharmacy fulfillment with zero elder burden</p>
            </div>
          </div>
          <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Zero Friction
          </span>
        </div>

        {isDispatched ? (
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E7E2DB] space-y-2.5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#DFDAD1] text-stone-900 flex items-center justify-center text-lg shrink-0 shadow-2xs">
                📦
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-semibold text-sm text-stone-900">
                    Fresh 30-Day Medication Pack Dispatched
                  </span>
                  <span className="text-xs font-mono font-medium text-stone-700 bg-white px-2 py-0.5 rounded-md border border-stone-200">
                    Delhivery CMU
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  Arriving <strong className="text-emerald-800 font-bold">{logistics.slaEta}</strong> directly to Flat 402, Rohini Sector 8, Delhi.
                </p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-[#E7E2DB] flex items-center justify-between text-xs text-stone-600 flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-emerald-900 font-medium bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Pre-authorized & Auto-debited (₹840.00)
              </span>
              <span className="text-[11px] font-mono text-stone-400">
                Waybill: {logistics.waybill}
              </span>
            </div>
          </div>
        ) : isNormalStock ? (
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-[#E7E2DB] flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#DFDAD1] text-emerald-700 flex items-center justify-center text-lg shrink-0">
              🌱
            </div>
            <div>
              <span className="font-semibold text-sm text-stone-900 block">
                22 Days of Medication Safe in Cabinet
              </span>
              <p className="text-xs text-stone-500">
                Strips are well stocked. No courier delivery required this week.
              </p>
            </div>
          </div>
        ) : isHeld ? (
          <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-amber-300 flex items-center gap-3.5 text-amber-950">
            <div className="w-10 h-10 rounded-xl bg-white border border-amber-300 text-amber-800 flex items-center justify-center text-lg shrink-0">
              💳
            </div>
            <div>
              <span className="font-semibold text-sm text-stone-900 block">
                Routing to Priya for 1-Tap Authorization
              </span>
              <p className="text-xs text-stone-600">
                Order exceeds normal ₹4,500 monthly threshold. Confirmation prompt dispatched to Telegram.
              </p>
            </div>
          </div>
        ) : isEmergency ? (
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 flex items-center gap-3.5 text-rose-950">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center text-lg shrink-0">
              🚨
            </div>
            <div>
              <span className="font-semibold text-sm text-rose-900 block">
                Priya & Doctor Alerted Immediately
              </span>
              <p className="text-xs text-rose-800">
                Emergency protocol triggered. Rest seated and drink water while care team connects.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#E7E2DB] flex items-center gap-3 text-stone-500 text-xs">
            <span className="text-base">🛡️</span>
            <p>
              Autonomous refill will auto-trigger when current medicine supply falls below 5 days.
            </p>
          </div>
        )}
      </div>

      {/* Row 3: Connected Care Team (Doctor & Daughter) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Doctor Card */}
        <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#DFDAD1] flex items-center justify-center text-xl shrink-0">
            👨‍⚕️
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-stone-900 truncate">
                Dr. Arvind Saxena
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Online
              </span>
            </div>
            <p className="text-xs text-stone-500 truncate">Cardiology Specialist · Apollo Rohini</p>
          </div>
        </div>

        {/* Caregiver Card */}
        <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] border border-[#DFDAD1] flex items-center justify-center text-xl shrink-0">
            👩‍💼
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-stone-900 truncate">
                Priya Sharma
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Connected
              </span>
            </div>
            <p className="text-xs text-stone-500 truncate">Daughter & Primary Caregiver · Bengaluru</p>
          </div>
        </div>
      </div>
    </div>
  );
};
