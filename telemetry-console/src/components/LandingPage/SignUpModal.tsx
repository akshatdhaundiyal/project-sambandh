import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, User, MapPin, Globe2, Clock, Phone, IndianRupee, Sparkles } from 'lucide-react';
import { useTelemetry } from '../../context/TelemetryContext';
import { JioLogo } from '../../data/brandLogos';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const handleLaunchDemo = () => {
    onClose();
    launchDemoScenario('SCENARIO_MORNING_CALL');
  };

  const handleReset = () => {
    setIsSubmitted(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-xl rounded-3xl border border-[#E7E2DB] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#FAF4EC] px-5 py-4 border-b border-[#E7E2DB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <JioLogo className="w-6 h-6 rounded-lg" />
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900 leading-tight">
                Sign Up for Jio × Sambandh
              </h3>
              <span className="text-[11px] text-stone-500 font-sans">
                Set up your parent's daily voice care circle
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-500 hover:text-stone-900 rounded-xl hover:bg-stone-200/60 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Enter your parent's details. The agent calls their existing phone number at the scheduled time. No apps or internet connection required on their side.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {/* Parent Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>Parent's Full Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Ramesh Chandra"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0057E7] bg-white text-stone-900"
                  />
                </div>

                {/* Parent City */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    <span>City & Neighborhood</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={parentCity}
                    onChange={(e) => setParentCity(e.target.value)}
                    placeholder="e.g. Rohini Sector 8, Delhi"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0057E7] bg-white text-stone-900"
                  />
                </div>

                {/* Language */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <Globe2 className="w-3.5 h-3.5 text-stone-400" />
                    <span>Preferred Language</span>
                  </label>
                  <select
                    value={parentLanguage}
                    onChange={(e) => setParentLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0057E7] bg-white text-stone-900"
                  >
                    <option value="Hindi">Hindi / Awadhi (हिंदी)</option>
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

                {/* Calling Window */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>Morning Call Time</span>
                  </label>
                  <select
                    value={callTime}
                    onChange={(e) => setCallTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0057E7] bg-white text-stone-900"
                  >
                    <option value="07:30 AM">07:30 AM IST</option>
                    <option value="08:00 AM">08:00 AM IST</option>
                    <option value="08:30 AM">08:30 AM IST (Chai & Newspaper)</option>
                    <option value="09:00 AM">09:00 AM IST (Post-Breakfast)</option>
                    <option value="09:30 AM">09:30 AM IST</option>
                  </select>
                </div>

                {/* Parent Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>Parent's Phone (Any Phone / Landline)</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+91 98101 23456"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0057E7] bg-white text-stone-900"
                  />
                </div>

                {/* Caregiver WhatsApp */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <span>Your WhatsApp (For Daily Updates)</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={caregiverPhone}
                    onChange={(e) => setCaregiverPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0057E7] bg-white text-stone-900"
                  />
                </div>
              </div>

              {/* Monthly Spending Cap */}
              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-teal-700" />
                    <span>Monthly Rupee Spending Limit</span>
                  </span>
                  <span className="font-mono font-bold text-teal-900 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                    ₹{monthlyCap.toLocaleString('en-IN')}/mo
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
                <p className="text-[11px] text-stone-500 leading-tight">
                  Pine Labs payments for prescription refills and flowers/prasadam execute within this limit. Higher amounts always pause for your approval.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-2xl bg-[#0057E7] hover:bg-[#0047C4] text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
                >
                  Create Care Circle
                </button>
              </div>
            </form>
          ) : (
            /* Success Confirmation State */
            <div className="py-4 text-center space-y-4 animate-fadeIn">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div>
                <h4 className="font-serif text-xl font-bold text-stone-900">
                  {parentName}'s Care Circle is Active
                </h4>
                <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  Calls scheduled for <strong>{callTime}</strong> in <strong>{parentLanguage}</strong>. Daily briefings and approval cards will be sent to <strong>{caregiverPhone}</strong>.
                </p>
              </div>

              <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-stone-200 text-left text-xs space-y-1.5 text-stone-700">
                <div className="flex justify-between">
                  <span className="text-stone-500">Parent:</span>
                  <span className="font-medium text-stone-900">{parentName} ({parentCity})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Calling Line:</span>
                  <span className="font-mono text-stone-900">{parentPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Spend Limit:</span>
                  <span className="font-medium text-teal-800">₹{monthlyCap.toLocaleString('en-IN')}/mo (Pine Labs Rail)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleLaunchDemo}
                  className="w-full flex-1 py-2.5 px-4 rounded-xl bg-[#0057E7] hover:bg-[#0047C4] text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Open in Live Demo Console</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-xs border border-stone-200 transition-all cursor-pointer"
                >
                  Edit Information
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="bg-[#FAF8F5] px-5 py-3 border-t border-[#E7E2DB] flex items-center justify-between text-[11px] text-stone-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
            <span>DPDP Act 2023 Compliant</span>
          </span>
          <span>Calls never replace your own</span>
        </div>
      </div>
    </div>
  );
};
