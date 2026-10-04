import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, Sparkles, Heart, Phone, MapPin, User, Globe2, Clock, IndianRupee, ArrowRight } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';

export const SignUpSection: React.FC = () => {
  const { launchDemoScenario } = useTelemetry();
  const [parentName, setParentName] = useState<string>('Ramesh Chandra');
  const [parentCity, setParentCity] = useState<string>('Rohini Sector 8, Delhi');
  const [parentLanguage, setParentLanguage] = useState<string>('Hindi');
  const [parentPhone, setParentPhone] = useState<string>('+91 98101 23456');
  const [callTime, setCallTime] = useState<string>('08:30 AM');
  const [caregiverName, setCaregiverName] = useState<string>('Rohan Sharma');
  const [caregiverPhone, setCaregiverPhone] = useState<string>('+91 98765 43210');
  const [monthlyCap, setMonthlyCap] = useState<number>(4500);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section id="signup-section" className="w-full py-16 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="bg-white rounded-3xl border border-[#E7E2DB] shadow-xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Emotional Context & Trust Pillars */}
          <div className="lg:col-span-5 bg-[#FAF4EC] p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#E7E2DB] flex flex-col justify-between">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs font-bold">
                <Heart className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
                <span>Zero Apps for Papa · 14-Day Free Care</span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight leading-tight">
                  Give your parents the gift of daily warmth and dignity.
                </h3>
                <p className="mt-3 text-sm text-stone-600 leading-relaxed font-sans">
                  No smartwatches to charge, no passwords to remember, and no humiliating reminder beeps. Sambandh calls your parents on their regular phone every morning like a loving family member.
                </p>
              </div>

              {/* What Happens Next Checklist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Instant Activation:</strong> Dials your parents at their chosen morning chai time.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Automated Netmeds Delivery:</strong> Chronic medicines refilled 48 hours before ending.
                  </span>
                </div>
                <div className="flex items-start gap-3 text-xs text-stone-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>30-Second WhatsApp Digest:</strong> You get complete peace of mind wherever you are in the world.
                  </span>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-8 border-t border-amber-200/60 mt-8 flex items-center justify-between text-[11px] text-stone-500 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-700" />
                <span>DPDP Act 2023 Compliant</span>
              </span>
              <span>No Credit Card Required</span>
            </div>
          </div>

          {/* Right Column: Embedded Sign-Up / Enrollment Form */}
          <div className="lg:col-span-7 p-6 sm:p-10 bg-white">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h4 className="font-serif text-xl font-bold text-stone-900 tracking-tight">
                    Start Your Parent's Daily Care Circle
                  </h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Fill in these simple details to schedule their first morning companionship call.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Parent Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-stone-500" />
                      <span>Parent's Full Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057E7] bg-white text-stone-900"
                    />
                  </div>

                  {/* Parent City / Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-500" />
                      <span>City & Neighborhood</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={parentCity}
                      onChange={(e) => setParentCity(e.target.value)}
                      placeholder="e.g. Rohini Sector 8, Delhi"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057E7] bg-white text-stone-900"
                    />
                  </div>

                  {/* Preferred Language */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <Globe2 className="w-3.5 h-3.5 text-stone-500" />
                      <span>Preferred Dialect / Language</span>
                    </label>
                    <select
                      value={parentLanguage}
                      onChange={(e) => setParentLanguage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057E7] bg-white text-stone-900"
                    >
                      <option value="Hindi">Hindi (हिंदी / अवधी / खड़ी बोली)</option>
                      <option value="Hinglish">Hinglish (Conversational)</option>
                      <option value="Marathi">Marathi (मराठी)</option>
                      <option value="Tamil">Tamil (தமிழ்)</option>
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="Bengali">Bengali (বাংলা)</option>
                      <option value="Gujarati">Gujarati (ગુજરાતી)</option>
                      <option value="Punjabi">Punjabi (ਪੰਜਾਬੀ)</option>
                      <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                    </select>
                  </div>

                  {/* Morning Calling Window */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-500" />
                      <span>Morning Call Time</span>
                    </label>
                    <select
                      value={callTime}
                      onChange={(e) => setCallTime(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057E7] bg-white text-stone-900"
                    >
                      <option value="07:30 AM">07:30 AM IST (Early Walk)</option>
                      <option value="08:00 AM">08:00 AM IST</option>
                      <option value="08:30 AM">08:30 AM IST (Chai & Newspaper)</option>
                      <option value="09:00 AM">09:00 AM IST (Post-Breakfast)</option>
                      <option value="09:30 AM">09:30 AM IST</option>
                    </select>
                  </div>

                  {/* Parent Phone Number */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-500" />
                      <span>Parent's Phone (Any Phone / Landline)</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+91 98101 23456"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057E7] bg-white text-stone-900"
                    />
                  </div>

                  {/* Caregiver WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-stone-500" />
                      <span>Your WhatsApp Number (Caregiver)</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={caregiverPhone}
                      onChange={(e) => setCaregiverPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0057E7] bg-white text-stone-900"
                    />
                  </div>
                </div>

                {/* Monthly Medicine Budget Cap */}
                <div className="bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-teal-700" />
                      <span>Monthly Medicine Spending Limit</span>
                    </span>
                    <span className="text-xs font-mono font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded-lg border border-teal-200">
                      ₹{monthlyCap.toLocaleString('en-IN')}/month
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1500"
                    max="10000"
                    step="500"
                    value={monthlyCap}
                    onChange={(e) => setMonthlyCap(Number(e.target.value))}
                    className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
                  />
                  <p className="text-[10px] text-stone-500 leading-tight">
                    Netmeds refills execute automatically only within this cap. Any unusual spike requires your 1-tap Telegram approval.
                  </p>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#0057E7] hover:bg-[#0047C4] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Activate 14-Day Free Care Circle</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Success State */
              <div className="py-6 flex flex-col items-center text-center space-y-5 animate-fadeIn">
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h4 className="font-serif text-2xl font-bold text-stone-900 tracking-tight">
                    {parentName}'s Care Circle is Ready!
                  </h4>
                  <p className="text-xs sm:text-sm text-stone-600 mt-2 max-w-md mx-auto leading-relaxed">
                    First morning companion call scheduled for <strong>{callTime}</strong> in <strong>{parentLanguage}</strong>. Daily summaries will be sent to <strong>{caregiverPhone}</strong>.
                  </p>
                </div>

                {/* Summary Card */}
                <div className="w-full max-w-md bg-[#FAF8F5] p-4 rounded-2xl border border-stone-200 text-left text-xs space-y-2 text-stone-700">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Parent:</span>
                    <span className="font-bold text-stone-900">{parentName} ({parentCity})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Calling Line:</span>
                    <span className="font-mono text-stone-900">{parentPhone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Autonomous Budget:</span>
                    <span className="font-bold text-teal-800">₹{monthlyCap.toLocaleString('en-IN')}/month via Netmeds</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
                  <button
                    type="button"
                    onClick={() => launchDemoScenario('SCENARIO_MORNING_CALL')}
                    className="w-full flex-1 py-3 px-4 rounded-xl bg-[#0057E7] hover:bg-[#0047C4] text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Test Papa's Call Live in Demo Console ⚡</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs border border-stone-200 transition-all cursor-pointer"
                  >
                    Edit Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
