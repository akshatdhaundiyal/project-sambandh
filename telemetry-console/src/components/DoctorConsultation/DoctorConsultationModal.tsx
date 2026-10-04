import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  Stethoscope,
  Phone,
  User,
  CheckCircle2,
  FileUp,
  FileText,
  Send,
  Sparkles,
  X,
  Pill,
  Share2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Building,
  Heart,
  Activity,
  ArrowRight,
  Loader2,
  Check
} from 'lucide-react';
import { speakHindiDevanagari, stopSpeech } from '../../utils/speechService';

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
    isListeningConsultation,
    isTransformingConsultation,
    liveSpokenSnippetConsultation,
    liveObservationsConsultation,
    simulateNextConsultationTurn,
    startLiveListeningConsultation,
    stopLiveListeningConsultation,
    addDoctorConsultationTurn,
    toggleCaregiverAttendance,
    attachDocumentToConsultation,
    completeDoctorConsultation,
    resetDoctorConsultation,
    startDoctorConsultation
  } = useTelemetry();

  const [customText, setCustomText] = useState('');
  const [isAttachOpen, setIsAttachOpen] = useState(false);
  const [attTitle, setAttTitle] = useState('');
  const [attText, setAttText] = useState('');
  const [isPlayingHindiAudio, setIsPlayingHindiAudio] = useState(false);
  const [activeTransformationTab, setActiveTransformationTab] = useState<'ehr' | 'elder' | 'caregiver'>('elder');

  if (!isOpen) return null;

  const isOngoing = consultationSession.status === 'in_progress';
  const isCompleted = consultationSession.status === 'completed';
  const isIdle = consultationSession.status === 'idle';

  const handleSendTurn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    addDoctorConsultationTurn('ambient', customText.trim());
    setCustomText('');
  };

  const handleAttachPreset = (preset: 'rx' | 'lab' | 'diet') => {
    if (preset === 'rx') {
      attachDocumentToConsultation({
        type: 'prescription',
        title: 'Dr. Saxena Review Slip & Statin Protocol',
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

  const handlePlayElderInstructions = (instructions: string[]) => {
    if (isPlayingHindiAudio) {
      stopSpeech();
      setIsPlayingHindiAudio(false);
      return;
    }
    const combinedHindi = instructions.join(' ');
    setIsPlayingHindiAudio(true);
    speakHindiDevanagari(combinedHindi, () => setIsPlayingHindiAudio(false));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-[32px] max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-stone-200 overflow-hidden text-stone-900 select-none">
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shadow-xs">
                <Stethoscope className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-sm sm:text-base font-bold text-white tracking-tight">
                    In-Clinic Consultation Transcriber
                  </h3>
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      isOngoing
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-stone-500/20 text-stone-300 border-stone-500/40'
                    }`}
                  >
                    {isOngoing ? '● AMBIENT MIC ACTIVE' : isCompleted ? '3-TIER TRANSFORMED & SYNCED' : 'STANDBY'}
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
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-500/30 font-semibold flex items-center gap-1">
                <span>👨‍⚕️</span>
                <span>Dr. Saxena</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-500/30 font-semibold flex items-center gap-1">
                <span>👴🏼</span>
                <span>Ramesh (Patient)</span>
              </span>
            </div>

            {/* Caregiver Attendance Switch */}
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1 border ${
                  consultationSession.caregiverAttending
                    ? 'bg-sky-500/20 text-sky-200 border-sky-500/40'
                    : 'bg-stone-700/60 text-stone-300 border-stone-600'
                }`}
              >
                <span>👩‍💼</span>
                <span>
                  {consultationSession.caregiverAttending
                    ? 'Priya (Remote Live Stream)'
                    : 'Priya (Async Telegram Briefing)'}
                </span>
              </span>

              {isOngoing && (
                <button
                  type="button"
                  onClick={toggleCaregiverAttendance}
                  className="px-2 py-0.5 bg-white/15 hover:bg-white/25 text-white rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                  title="Toggle Caregiver remote live attendance"
                >
                  {consultationSession.caregiverAttending ? 'Drop Remote Stream' : '+ Bridge Priya'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Modal Body / Dialogue Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin bg-[#FAF8F5]">
          {/* Initial Clean Standby Screen when Idle */}
          {isIdle && (
            <div className="p-6 bg-white rounded-3xl border border-stone-200 text-center space-y-4 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-3xl mx-auto shadow-xs">
                🩺
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-stone-900 text-base">
                  In-Clinic Consultation Live Transcriber
                </h4>
                <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                  Place the phone on the doctor's desk. The system continuously captures live ambient speech, segregates speakers (Doctor, Senior & Caregiver), extracts clinical observations in real time, and allows scanning prescription slips on the fly.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => startDoctorConsultation(viewerRole, true)}
                  className="py-2.5 px-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Start with Priya Bridged</span>
                </button>

                <button
                  type="button"
                  onClick={() => startDoctorConsultation(viewerRole, false)}
                  className="py-2.5 px-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer active:scale-95"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Start Solo (Auto-Brief Priya)</span>
                </button>
              </div>
            </div>
          )}

          {/* Ongoing Ambient Audio Controls & Turns Stream */}
          {isOngoing && (
            <div className="space-y-3">
              {/* Live Ambient Speech Capture Banner */}
              <div className="p-3 bg-white rounded-2xl border border-emerald-200/80 shadow-2xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isListeningConsultation
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    <Mic className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold text-stone-900 block truncate">
                      {isListeningConsultation
                        ? 'Capturing Ambient Clinic Speech...'
                        : 'Transcriber Standby'}
                    </span>
                    <p className="text-[10px] text-stone-500 truncate">
                      {liveSpokenSnippetConsultation || 'Speak naturally or use interactive step-by-step turns below'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={
                      isListeningConsultation
                        ? stopLiveListeningConsultation
                        : startLiveListeningConsultation
                    }
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                      isListeningConsultation
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                    }`}
                  >
                    {isListeningConsultation ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    <span>{isListeningConsultation ? 'Pause Mic' : 'Start Mic'}</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Live Ambient Clinical Observations Panel */}
              <div className="p-3 bg-gradient-to-r from-emerald-50/70 to-teal-50/70 rounded-2xl border border-emerald-200/80 shadow-2xs space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-serif font-bold text-emerald-950 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Real-Time Clinical Observations (Extracted as Doctor Speaks)</span>
                  </span>
                  <span className="text-[9px] font-mono text-emerald-800 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                    Gnani Indic NLP
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-xs">
                  <div className="p-2 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                    <span className="text-[9px] text-stone-500 block">Measured BP</span>
                    <span className="font-mono font-bold text-xs text-emerald-950">
                      {liveObservationsConsultation.bpReading || '—'}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                    <span className="text-[9px] text-stone-500 block">Pulse</span>
                    <span className="font-mono font-bold text-xs text-emerald-950">
                      {liveObservationsConsultation.pulse || '—'}
                    </span>
                  </div>
                  <div className="p-2 bg-white rounded-xl border border-emerald-100 shadow-2xs col-span-2">
                    <span className="text-[9px] text-stone-500 block">Medications Mentioned</span>
                    <span className="font-semibold text-[10px] text-emerald-950 truncate block">
                      {liveObservationsConsultation.medicationsMentioned.length > 0
                        ? liveObservationsConsultation.medicationsMentioned.join(', ')
                        : '—'}
                    </span>
                  </div>
                </div>

                {liveObservationsConsultation.symptoms.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap pt-0.5">
                    <span className="text-[9px] font-bold text-stone-500">Symptoms:</span>
                    {liveObservationsConsultation.symptoms.map((s, idx) => (
                      <span key={idx} className="text-[9px] bg-amber-100/80 text-amber-900 px-1.5 py-0.5 rounded-md border border-amber-200">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Progressive 1-Tap Simulation Bar */}
              <div className="p-2.5 bg-stone-100/90 rounded-2xl border border-stone-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="text-[11px] font-bold text-stone-800 truncate">
                    Interactive Live Simulation Flow:
                  </span>
                </div>
                <button
                  type="button"
                  onClick={simulateNextConsultationTurn}
                  className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shrink-0 shadow-2xs flex items-center gap-1"
                >
                  <span>+ Transcribe Next Live Step</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Ambient Notes Stream */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-stone-500 pb-1 border-b border-stone-200">
                  <span className="font-serif font-bold text-stone-800 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Live Transcript & Speaker Diarization ({consultationSession.turns.length} turns)</span>
                  </span>
                  <span className="font-mono text-[10px] text-emerald-800">Auto-Segregated</span>
                </div>

                {consultationSession.turns.length === 0 ? (
                  <div className="p-6 bg-white rounded-2xl border border-dashed border-stone-300 text-center text-xs text-stone-400 space-y-1">
                    <p>🎙️ Waiting for clinic speech... Speak via microphone or click "+ Transcribe Next Live Step".</p>
                  </div>
                ) : (
                  consultationSession.turns.map(turn => {
                    const isDoctor = turn.speaker === 'doctor';
                    const isSenior = turn.speaker === 'senior';
                    const isCaregiver = turn.speaker === 'caregiver';

                    return (
                      <div
                        key={turn.id}
                        className={`p-3 rounded-2xl border shadow-2xs text-xs space-y-1 transition-colors ${
                          isDoctor
                            ? 'bg-emerald-50/40 border-emerald-200/90 hover:border-emerald-300'
                            : isSenior
                            ? 'bg-amber-50/40 border-amber-200/90 hover:border-amber-300'
                            : isCaregiver
                            ? 'bg-sky-50/40 border-sky-200/90 hover:border-sky-300'
                            : 'bg-white border-stone-200/90'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px]">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span>{isDoctor ? '👨‍⚕️' : isSenior ? '👴🏼' : isCaregiver ? '👩‍💼' : '🎙️'}</span>
                            <span
                              className={
                                isDoctor
                                  ? 'text-emerald-950 font-serif'
                                  : isSenior
                                  ? 'text-amber-950'
                                  : isCaregiver
                                  ? 'text-sky-950'
                                  : 'text-stone-700'
                              }
                            >
                              {turn.speakerName || 'Clinic Audio'}
                            </span>
                            {isCaregiver && (
                              <span className="text-[8px] font-mono bg-sky-100 text-sky-800 px-1 rounded">
                                Remote Telephony
                              </span>
                            )}
                          </div>
                          <span className="font-mono font-medium text-stone-400">{turn.timestamp} IST</span>
                        </div>
                        <p className="text-stone-800 leading-relaxed font-sans text-xs pt-0.5">
                          {turn.content}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Attached Doctor's Notes & Prescriptions (Empty until attached!) */}
          {(isOngoing || isCompleted) && (
            <div className="p-3 bg-white rounded-2xl border border-stone-200 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-teal-700" />
                  <span>Attached Doctor's Slips & Prescriptions ({consultationSession.attachments.length})</span>
                </span>
                {consultationSession.attachments.length === 0 && (
                  <span className="text-[10px] text-stone-400 italic">None attached yet</span>
                )}
              </div>

              {consultationSession.attachments.length === 0 ? (
                <div className="p-3 rounded-xl bg-stone-50 border border-dashed border-stone-300 text-center text-xs text-stone-500">
                  <span>Prescription slips appear here once scanned or uploaded during the call.</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {consultationSession.attachments.map(att => (
                    <div
                      key={att.id}
                      className="p-2.5 rounded-xl bg-[#FAF8F5] border border-stone-200/80 text-xs space-y-1 animate-in fade-in"
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
              )}
            </div>
          )}

          {/* Completed 3-Tier Clinical Transformation View */}
          {isCompleted && consultationSession.clinicalSummary && (
            <div className="space-y-3">
              {/* Segmented Tier Tabs */}
              <div className="flex items-center bg-[#EFECE6] p-1 rounded-2xl border border-[#DFDAD1] text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTransformationTab('elder')}
                  className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTransformationTab === 'elder'
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>👴🏼 Papa's Hindi Guide</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTransformationTab('ehr')}
                  className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTransformationTab === 'ehr'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>👨‍⚕️ Clinical EHR & Vitals</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTransformationTab('caregiver')}
                  className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    activeTransformationTab === 'caregiver'
                      ? 'bg-sky-700 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <span>📱 Telegram Card (Priya)</span>
                </button>
              </div>

              {/* Tier 2: Papa's Vernacular Guide */}
              {activeTransformationTab === 'elder' && (
                <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-50 via-white to-amber-50 border border-amber-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-950 font-serif font-bold text-sm">
                      <span>👴🏼</span>
                      <span>रमेश जी के लिए सरल निर्देश (Elder Guide)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        handlePlayElderInstructions(
                          consultationSession.clinicalSummary?.elderVernacularInstructions || []
                        )
                      }
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                        isPlayingHindiAudio
                          ? 'bg-amber-700 text-white animate-pulse'
                          : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                      }`}
                    >
                      {isPlayingHindiAudio ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                      <span>{isPlayingHindiAudio ? 'रोकें (Stop)' : 'सुनें (Listen)'}</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {consultationSession.clinicalSummary.elderVernacularInstructions.map((inst, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-xl bg-white border border-amber-200/80 text-xs text-stone-900 flex items-start gap-2 shadow-2xs font-sans leading-relaxed"
                      >
                        <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <p className="flex-1 font-medium">{inst}</p>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-amber-900/80 italic pt-1 border-t border-amber-200/60">
                    💡 यह निर्देश AI साथी के अगले चेक-इन कॉल में भी अपने आप याद दिलाए जाएंगे।
                  </p>
                </div>
              )}

              {/* Tier 1: Structured Clinical EHR & Vitals */}
              {activeTransformationTab === 'ehr' && (
                <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-emerald-950 font-serif font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Structured Clinical Records (MedGemma EHR)</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      ABDM FHIR Encrypted
                    </span>
                  </div>

                  {/* Vitals Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2.5 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                      <span className="text-[10px] text-stone-500 block">Measured Blood Pressure</span>
                      <span className="font-mono font-bold text-sm text-emerald-950">
                        {consultationSession.clinicalSummary.bpReading || '130/82 mmHg'}
                      </span>
                    </div>
                    <div className="p-2.5 bg-white rounded-xl border border-emerald-100 shadow-2xs">
                      <span className="text-[10px] text-stone-500 block">Heart Rate</span>
                      <span className="font-mono font-bold text-sm text-emerald-950">
                        {consultationSession.clinicalSummary.pulse || '72 bpm'}
                      </span>
                    </div>
                  </div>

                  {/* Clinical Assessment */}
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-100 shadow-2xs space-y-1">
                    <span className="text-[10px] font-bold text-stone-500 block">Physician Assessment:</span>
                    <p className="text-xs text-stone-800 leading-relaxed font-sans">
                      {consultationSession.clinicalSummary.clinicalAssessment}
                    </p>
                  </div>

                  {/* Medication Changes */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-stone-800 block text-[11px]">Medication Adjustments:</span>
                    {consultationSession.clinicalSummary.medicationChanges.map((med, idx) => (
                      <div
                        key={idx}
                        className="p-2 bg-emerald-100/50 rounded-lg text-emerald-950 text-[11px] font-medium flex items-center gap-1.5 border border-emerald-200/60"
                      >
                        <Pill className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span>{med}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tier 3: Caregiver Telegram Dispatch */}
              {activeTransformationTab === 'caregiver' && (
                <div className="p-4 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-sky-50 border border-sky-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sky-950 font-serif font-bold text-xs">
                      <Share2 className="w-4 h-4 text-sky-600" />
                      <span>Telegram Dispatch Briefing (Priya Sharma)</span>
                    </div>
                    <span className="text-[9px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Check className="w-3 h-3" /> Delivered
                    </span>
                  </div>

                  {/* Action Checklist */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-sky-950 block text-[11px]">Caregiver Action Checklist:</span>
                    {consultationSession.clinicalSummary.caregiverActionItems.map((act, i) => (
                      <div
                        key={i}
                        className="p-2 rounded-xl bg-white border border-sky-200 text-xs text-stone-900 flex items-start gap-2 shadow-2xs font-sans leading-relaxed"
                      >
                        <span className="w-4 h-4 rounded-full bg-sky-100 text-sky-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          ✓
                        </span>
                        <p className="flex-1 font-medium">{act}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 bg-sky-100/60 rounded-xl text-[10px] text-sky-900 font-mono">
                    Next Follow-up Review: {consultationSession.clinicalSummary.followUpDate || '4 weeks'}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* In-Call Simulation Presets & Complete Controls (When Ongoing) */}
        {isOngoing && (
          <div className="p-3 bg-white border-t border-stone-200 space-y-2 shrink-0">
            {/* Custom Spoken Text Box */}
            <form onSubmit={handleSendTurn} className="flex items-center gap-1.5">
              <input
                type="text"
                value={customText}
                onChange={e => setCustomText(e.target.value)}
                placeholder="Dictate or type clinic speech (auto-detects Doctor vs Patient)..."
                className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:bg-white focus:border-teal-700 outline-none"
              />

              <button
                type="submit"
                disabled={!customText.trim()}
                className="w-9 h-9 rounded-xl bg-teal-800 hover:bg-teal-900 text-white flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-40"
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
                <span>{isAttachOpen ? 'Hide Slips' : '+ Scan / Attach Doctor\'s Rx Slip'}</span>
              </button>

              <button
                type="button"
                disabled={isTransformingConsultation || consultationSession.turns.length === 0}
                onClick={completeDoctorConsultation}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {isTransformingConsultation ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>MedGemma Transforming...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete & Transform</span>
                  </>
                )}
              </button>
            </div>

            {/* Expandable Attachment Presets & Custom Note */}
            {isAttachOpen && (
              <div className="p-2.5 bg-stone-50 rounded-2xl border border-stone-200 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-800">
                    Scan / Attach Doctor's Prescription Slip:
                  </span>
                  <span className="text-[9px] text-stone-500 font-mono">MedGemma 4B RAG</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAttachPreset('rx')}
                    className="px-2.5 py-1 bg-white hover:bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>📷 Dr. Saxena Review Slip (Atorvastatin 10mg)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAttachPreset('lab')}
                    className="px-2.5 py-1 bg-white hover:bg-purple-50 text-purple-900 border border-purple-200 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>🧪 Lipid Profile Lab Order</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAttachPreset('diet')}
                    className="px-2.5 py-1 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-[10px] font-bold cursor-pointer flex items-center gap-1 shadow-2xs"
                  >
                    <span>📄 Knee Exercise Note</span>
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
              Synced to ABDM Health Locker & Caregiver Telegram
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
