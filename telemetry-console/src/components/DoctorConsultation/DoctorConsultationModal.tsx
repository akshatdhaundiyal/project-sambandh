import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  DoctorConsultationSpeaker
} from '../../types/telemetry';
import {
  Stethoscope,
  Phone,
  PhoneOff,
  User,
  CheckCircle2,
  FileUp,
  FileText,
  Plus,
  Send,
  Sparkles,
  Clock,
  X,
  Pill,
  Share2,
  Mic,
  AlertCircle,
  Building
} from 'lucide-react';

interface DoctorConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewerRole?: 'senior' | 'caregiver';
}

export const DoctorConsultationModal: React.FC<DoctorConsultationModalProps> = ({
  isOpen,
  onClose,
  viewerRole = 'senior'
}) => {
  const {
    consultationSession,
    addDoctorConsultationTurn,
    toggleCaregiverAttendance,
    attachDocumentToConsultation,
    completeDoctorConsultation,
    resetDoctorConsultation,
    startDoctorConsultation
  } = useTelemetry();

  // Custom Turn Form State
  const [selectedSpeaker, setSelectedSpeaker] = useState<DoctorConsultationSpeaker>('doctor');
  const [customText, setCustomText] = useState('');

  // Attachment Sheet State
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [attTitle, setAttTitle] = useState('');
  const [attText, setAttText] = useState('');

  if (!isOpen) return null;

  const isOngoing = consultationSession.status === 'in_progress';
  const isCompleted = consultationSession.status === 'completed';
  const isIdle = consultationSession.status === 'idle';

  const handleSendTurn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    addDoctorConsultationTurn(selectedSpeaker, customText.trim());
    setCustomText('');
  };

  const handleAttachPreset = (preset: 'rx' | 'lab' | 'diet') => {
    if (preset === 'rx') {
      attachDocumentToConsultation({
        type: 'prescription',
        title: 'Dr. Saxena Review Slip (Statin Protocol)',
        doctorName: 'Dr. Arvind Saxena (Cardiology)',
        rawText:
          'Rx: Ramesh Chandra, 72/M. BP 130/82. Continue Telmisartan 40mg OD. Add Atorvastatin 10mg HS post-dinner. Repeat Lipid Profile in 4 weeks.',
        medGemmaEntitiesExtracted: ['Telmisartan 40mg OD', 'Atorvastatin 10mg HS post-dinner', 'Lipid Panel 4w']
      });
    } else if (preset === 'lab') {
      attachDocumentToConsultation({
        type: 'lab_order',
        title: 'Apollo Diagnostic Lab Order (Lipid & Renal)',
        doctorName: 'Apollo Diagnostics Rohini',
        rawText:
          'Investigation Order: Fasting Lipid Profile (Total Cholesterol, Triglycerides, LDL, HDL) + Serum Creatinine & eGFR.',
        medGemmaEntitiesExtracted: ['Lipid Profile', 'Serum Creatinine', 'eGFR']
      });
    } else {
      attachDocumentToConsultation({
        type: 'doctor_note',
        title: 'Knee Osteoarthritis & Walking Advice',
        doctorName: 'Dr. Arvind Saxena',
        rawText:
          'Clinical Note: Mild morning bilateral knee stiffness. Continue 25-minute gentle walking on soft park track with knee-support shoes. Warm water compress twice daily.',
        medGemmaEntitiesExtracted: ['Morning walking 25m', 'Warm compress', 'Knee stiffness']
      });
    }
    setIsAttachOpen(false);
  };

  const handleCustomAttach = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attTitle.trim() || !attText.trim()) return;
    attachDocumentToConsultation({
      type: 'prescription',
      title: attTitle.trim(),
      doctorName: consultationSession.doctorName,
      rawText: attText.trim(),
      medGemmaEntitiesExtracted: ['Extracted via MedGemma 4B']
    });
    setAttTitle('');
    setAttText('');
    setIsAttachOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden text-stone-900 select-none">
        {/* Top Header */}
        <div className="p-3.5 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-xs">
                <Stethoscope className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-sm font-bold text-white tracking-tight">
                    In-Clinic Doctor Consultation Bridge
                  </h3>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                      isOngoing
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-stone-500/20 text-stone-300 border-stone-500/40'
                    }`}
                  >
                    {isOngoing ? '● LIVE DIARIZATION' : isCompleted ? 'COMPLETED & SYNCED' : 'IDLE'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-300">
                  {consultationSession.doctorName} · {consultationSession.clinicName}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Participant Presence & Attendance Bar */}
          <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] flex-wrap gap-1.5">
            <div className="flex items-center gap-1.5">
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-semibold flex items-center gap-1">
                <span>👨‍⚕️</span>
                <span>Dr. Saxena (Clinic)</span>
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold flex items-center gap-1">
                <span>👴🏼</span>
                <span>Ramesh (Patient)</span>
              </span>
            </div>

            {/* Caregiver Attendance Switch */}
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 border ${
                  consultationSession.caregiverAttending
                    ? 'bg-sky-500/20 text-sky-200 border-sky-500/40'
                    : 'bg-stone-700/60 text-stone-300 border-stone-600'
                }`}
              >
                <span>👩‍💼</span>
                <span>
                  {consultationSession.caregiverAttending
                    ? 'Priya (Remote Live)'
                    : 'Priya (Absent · Async Mode)'}
                </span>
              </span>

              {isOngoing && (
                <button
                  type="button"
                  onClick={toggleCaregiverAttendance}
                  className="px-2 py-0.5 bg-white/15 hover:bg-white/25 text-white rounded-md text-[9px] font-bold cursor-pointer transition-colors"
                  title="Toggle Caregiver remote live attendance"
                >
                  {consultationSession.caregiverAttending ? 'Drop Call' : '+ Bridge Priya'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body / Dialogue Stream */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-3 scrollbar-thin bg-[#FAF8F5]">
          {/* Initial Prompt when Idle */}
          {isIdle && (
            <div className="p-4 bg-white rounded-2xl border border-stone-200 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mx-auto shadow-xs">
                🩺
              </div>
              <div>
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  Ready to Start Consultation with Dr. Arvind Saxena
                </h4>
                <p className="text-xs text-stone-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  Both in-clinic speech (Doctor & Ramesh) and remote speech (Priya in Bengaluru) will be transcribed and separated in real-time.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-w-sm mx-auto">
                <button
                  type="button"
                  onClick={() => startDoctorConsultation(viewerRole, true)}
                  className="py-2.5 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Bridge Priya Live</span>
                </button>

                <button
                  type="button"
                  onClick={() => startDoctorConsultation(viewerRole, false)}
                  className="py-2.5 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Start Solo (Async Briefing)</span>
                </button>
              </div>
            </div>
          )}

          {/* Diarized Turns Stream */}
          {(isOngoing || isCompleted) && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] text-stone-500 pb-1 border-b border-stone-200">
                <span className="font-serif font-bold text-stone-800 flex items-center gap-1">
                  <Mic className="w-3 h-3 text-rose-500 animate-pulse" />
                  <span>Dual-Channel Acoustic Diarization Stream</span>
                </span>
                <span className="font-mono text-[10px]">
                  {consultationSession.turns.length} utterances recorded
                </span>
              </div>

              {consultationSession.turns.map(turn => {
                const isDoctor = turn.speaker === 'doctor';
                const isSenior = turn.speaker === 'senior';
                const isCaregiver = turn.speaker === 'caregiver';

                return (
                  <div
                    key={turn.id}
                    className={`p-3 rounded-2xl border transition-all text-xs space-y-1 ${
                      isDoctor
                        ? 'bg-emerald-50/90 border-emerald-200/90'
                        : isSenior
                        ? 'bg-white border-amber-200/80 shadow-2xs'
                        : 'bg-sky-50/90 border-sky-200/90'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <div className="flex items-center gap-1.5 font-bold">
                        <span>{isDoctor ? '👨‍⚕️' : isSenior ? '👴🏼' : '👩‍💼'}</span>
                        <span
                          className={
                            isDoctor
                              ? 'text-emerald-900'
                              : isSenior
                              ? 'text-stone-900'
                              : 'text-sky-900'
                          }
                        >
                          {turn.speakerName}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-normal px-1 py-0.2 rounded border ${
                            turn.channel === 'in_clinic_mic'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                              : 'bg-sky-100 text-sky-800 border-sky-200'
                          }`}
                        >
                          {turn.channel === 'in_clinic_mic' ? 'In-Clinic Mic' : 'Remote Telephony'}
                        </span>
                      </div>
                      <span className="font-mono text-stone-400 text-[9px]">{turn.timestamp}</span>
                    </div>

                    <p className="text-stone-800 leading-relaxed font-sans text-xs">
                      {turn.content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Attached Doctor's Notes & Prescriptions */}
          {(isOngoing || isCompleted) && consultationSession.attachments.length > 0 && (
            <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-2 shadow-2xs">
              <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-teal-700" />
                <span>Attached Doctor's Notes & Prescriptions ({consultationSession.attachments.length})</span>
              </span>

              <div className="space-y-1.5">
                {consultationSession.attachments.map(att => (
                  <div
                    key={att.id}
                    className="p-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-stone-900 flex items-center gap-1">
                        <Pill className="w-3 h-3 text-teal-700" />
                        <span>{att.title}</span>
                      </span>
                      <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                        MedGemma Extracted
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 font-mono bg-white p-2 rounded-lg border border-stone-200 leading-relaxed">
                      {att.rawText}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Summary Banner & Next Actions */}
          {isCompleted && consultationSession.clinicalSummary && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-200 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-emerald-900 font-serif font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Consultation Summarized & Synced to Health Locker</span>
                </div>
                <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                  ABDM FHIR Encrypted
                </span>
              </div>

              {/* Vitals & Assessment */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-stone-500 block">Clinic Blood Pressure</span>
                  <span className="font-mono font-bold text-sm text-stone-900">
                    {consultationSession.clinicalSummary.bpReading || '130/82 mmHg'}
                  </span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="text-[10px] text-stone-500 block">Heart Rate</span>
                  <span className="font-mono font-bold text-sm text-stone-900">
                    {consultationSession.clinicalSummary.pulse || '72 bpm'}
                  </span>
                </div>
              </div>

              {/* Medication Changes */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-stone-800 block text-[11px]">Medication Adjustments:</span>
                {consultationSession.clinicalSummary.medicationChanges.map((med, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-stone-700 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{med}</span>
                  </div>
                ))}
              </div>

              {/* Caregiver Dispatch Notification */}
              <div className="p-2 bg-sky-50 border border-sky-200 rounded-xl text-[11px] text-sky-900 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-sky-700 shrink-0" />
                  <span>
                    {consultationSession.caregiverAttending
                      ? 'Transcript archived in Priya\'s Caregiver App'
                      : 'Full clinical briefing & prescription dispatched to Priya in Bengaluru'}
                  </span>
                </div>
                <span className="text-[9px] font-mono font-bold text-sky-800">Delivered</span>
              </div>
            </div>
          )}
        </div>

        {/* In-Call Quick Simulation & Attachment Controls (When Ongoing) */}
        {isOngoing && (
          <div className="p-3 bg-white border-t border-stone-200 space-y-2 shrink-0">
            {/* 1-Click Simulation Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-thin">
              <span className="text-[10px] text-stone-500 font-bold shrink-0">Simulate:</span>
              <button
                type="button"
                onClick={() =>
                  addDoctorConsultationTurn(
                    'doctor',
                    'रमेश जी, बीपी 130/82 बहुत स्थिर है। लिपिड के लिए रात को Atorvastatin 10mg शुरू करें, और 4 हफ्ते बाद लिपिड प्रोफाइल कराएं।'
                  )
                }
                className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-semibold border border-emerald-200 shrink-0 transition-colors cursor-pointer text-[10px]"
              >
                + Dr. Saxena Turn
              </button>
              <button
                type="button"
                onClick={() =>
                  addDoctorConsultationTurn(
                    'senior',
                    'डॉक्टर साहब, जापानी पार्क में रोज़ सुबह 25 मिनट टहलते हैं। सीने में कोई दर्द या भारीपन नहीं है।'
                  )
                }
                className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold border border-amber-200 shrink-0 transition-colors cursor-pointer text-[10px]"
              >
                + Ramesh Papa Turn
              </button>
              {consultationSession.caregiverAttending && (
                <button
                  type="button"
                  onClick={() =>
                    addDoctorConsultationTurn(
                      'caregiver',
                      'डॉक्टर अंकल, क्या पापा Atorvastatin रात के खाने के बाद ताज़े पानी से ले सकते हैं?'
                    )
                  }
                  className="px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 font-semibold border border-sky-200 shrink-0 transition-colors cursor-pointer text-[10px]"
                >
                  + Priya Remote Turn
                </button>
              )}
            </div>

            {/* Custom Speech Input Row */}
            <form onSubmit={handleSendTurn} className="flex items-center gap-1.5">
              <select
                value={selectedSpeaker}
                onChange={e => setSelectedSpeaker(e.target.value as any)}
                className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-2 py-1.5 text-stone-800 focus:bg-white outline-none cursor-pointer shrink-0"
              >
                <option value="doctor">👨‍⚕️ Doctor</option>
                <option value="senior">👴🏼 Senior</option>
                {consultationSession.caregiverAttending && <option value="caregiver">👩‍💼 Caregiver</option>}
              </select>

              <input
                type="text"
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="Type spoken dialogue turn..."
                className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-900 focus:bg-white focus:border-teal-700 outline-none"
              />

              <button
                type="submit"
                disabled={!customText.trim()}
                className="w-8 h-8 rounded-xl bg-teal-800 hover:bg-teal-900 text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Bottom Actions: Attach Prescriptions & Complete */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setIsAttachOpen(!isAttachOpen)}
                className="px-3 py-1.5 bg-[#FAF8F5] hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileUp className="w-3.5 h-3.5 text-teal-700" />
                <span>{isAttachOpen ? 'Hide Attachments' : '+ Attach Doctor\'s Note / Rx'}</span>
              </button>

              <button
                type="button"
                onClick={completeDoctorConsultation}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Complete Consultation & Sync</span>
              </button>
            </div>

            {/* Expandable Attachment Presets & Custom Note */}
            {isAttachOpen && (
              <div className="p-2.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-800">
                    Quick Prescription Presets:
                  </span>
                  <span className="text-[9px] text-stone-500 font-mono">MedGemma 4B</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAttachPreset('rx')}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Dr. Saxena Rx Slip (Atorvastatin 10mg)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAttachPreset('lab')}
                    className="px-2.5 py-1 bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Lipid Profile Lab Order
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAttachPreset('diet')}
                    className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[10px] font-bold cursor-pointer"
                  >
                    Knee Exercise Note
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Completed Footer */}
        {isCompleted && (
          <div className="p-3 bg-white border-t border-stone-200 flex items-center justify-between shrink-0">
            <span className="text-xs text-stone-500">
              Session archived in Health Locker & SQLite/PostgreSQL
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={resetDoctorConsultation}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Reset Session
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
