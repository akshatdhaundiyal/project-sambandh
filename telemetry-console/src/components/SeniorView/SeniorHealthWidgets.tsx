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
    <div className="space-y-3.5">
      {/* Question prompt inspired by reference image */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider block mb-0.5">
            Daily Vitality & Routine Check
          </span>
          <h3 className="text-base sm:text-lg font-extrabold text-stone-900">
            How are you feeling this morning, Ramesh Ji?
          </h3>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          Good & Peaceful
        </span>
      </div>

      {/* Row 1: Vitals Cards (BP, Glucose & Weekly Adherence) - Directly from reference design */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Blood Pressure Card */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                <Heart className="w-4 h-4 fill-rose-500/20" />
              </div>
              <span className="text-xs font-bold text-stone-600">Blood Pressure</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Good
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 tracking-tight">
              120/80 <span className="text-xs font-normal text-stone-400">mmHg</span>
            </div>
            <span className="text-[11px] text-stone-500">Telmisartan 40mg active</span>
          </div>
        </div>

        {/* Blood Glucose Card */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-600">Blood Glucose</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Good
            </span>
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 tracking-tight">
              95-115 <span className="text-xs font-normal text-stone-400">mg/dL</span>
            </div>
            <span className="text-[11px] text-stone-500">Fasting morning normal</span>
          </div>
        </div>

        {/* Weekly Adherence Consistency Card */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-4 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Pill className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-stone-600">7-Day Routine</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
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
                      ? 'h-10 bg-emerald-600 shadow-xs ring-2 ring-emerald-300'
                      : 'h-6 bg-stone-100'
                  }`}
                />
                <span
                  className={`text-[10px] font-bold ${
                    d.isToday ? 'text-emerald-700' : 'text-stone-400'
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
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-stone-900">
                Doorstep Delivery & Family Peace of Mind
              </h4>
              <p className="text-xs text-stone-500">Autonomous pharmacy fulfillment with zero elder friction</p>
            </div>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
            Zero Elder Burden
          </span>
        </div>

        {isDispatched ? (
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/70 space-y-2.5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center text-lg shrink-0">
                📦
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="font-extrabold text-sm text-stone-900">
                    Fresh 30-Day Medication Pack Dispatched
                  </span>
                  <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-100/70 px-2 py-0.5 rounded-md">
                    Delhivery CMU
                  </span>
                </div>
                <p className="text-xs text-stone-600 mt-0.5">
                  Arriving <strong className="text-emerald-700 font-extrabold">{logistics.slaEta}</strong> directly to Flat 402, Rohini Sector 8, Delhi.
                </p>
              </div>
            </div>

            <div className="pt-2.5 border-t border-stone-200/70 flex items-center justify-between text-xs text-stone-600 flex-wrap gap-2">
              <span className="flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Pre-authorized & Paid by Priya (₹840.00)
              </span>
              <span className="text-[11px] font-mono text-stone-500">
                Waybill: {logistics.waybill}
              </span>
            </div>
          </div>
        ) : isNormalStock ? (
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200/70 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg shrink-0">
              🌱
            </div>
            <div>
              <span className="font-extrabold text-sm text-emerald-900 block">
                22 Days of Medication Safe in Cabinet
              </span>
              <p className="text-xs text-emerald-800/80">
                Your strips are well stocked. No courier delivery needed this week. Mandate is idle.
              </p>
            </div>
          </div>
        ) : isHeld ? (
          <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 flex items-center gap-3.5 text-amber-900">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-lg shrink-0">
              💳
            </div>
            <div>
              <span className="font-extrabold text-sm text-amber-900 block">
                Order Routing to Priya for 1-Tap Confirmation
              </span>
              <p className="text-xs text-amber-800/80">
                Bulk 90-day pack exceeds normal ₹4,500 monthly limit. Safe approval card sent to Telegram.
              </p>
            </div>
          </div>
        ) : isEmergency ? (
          <div className="bg-rose-50 p-4 rounded-2xl border border-rose-200 flex items-center gap-3.5 text-rose-950">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center text-lg shrink-0">
              🚨
            </div>
            <div>
              <span className="font-extrabold text-sm text-rose-900 block">
                Priya & Doctor Alerted Immediately
              </span>
              <p className="text-xs text-rose-800">
                Emergency protocol triggered: rest on the sofa and drink water. Family has been notified.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/70 flex items-center gap-3 text-stone-500 text-xs">
            <span className="text-lg">🛡️</span>
            <p>
              Autonomous refill will auto-trigger when current medicine supply falls below 5 days.
            </p>
          </div>
        )}
      </div>

      {/* Row 3: Connected Care Team (Doctor & Daughter) directly from reference image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Doctor Card */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-xl shrink-0">
            👨‍⚕️
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs sm:text-sm text-stone-900 truncate">
                Dr. Arvind Saxena
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Online
              </span>
            </div>
            <p className="text-[11px] text-stone-500 truncate">Cardiologist · Apollo Clinic Rohini</p>
          </div>
        </div>

        {/* Caregiver Card */}
        <div className="bg-white border border-stone-200/90 rounded-3xl p-4 shadow-xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl shrink-0">
            👩‍💼
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-xs sm:text-sm text-stone-900 truncate">
                Priya Sharma
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Connected
              </span>
            </div>
            <p className="text-[11px] text-stone-500 truncate">Daughter & Primary Caregiver · Bengaluru</p>
          </div>
        </div>
      </div>
    </div>
  );
};
