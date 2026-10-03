import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { CallSummaryHistorySheet } from './CallSummaryHistorySheet';
import { getTimeContext } from '../../data/conversationalSparks';
import {
  queryHealthLocker,
  getLockerDocuments,
  getMedicationDoses,
  getVitalLevels,
  fetchLockerDocuments,
  fetchMedicationDoses,
  fetchVitalLevels,
  checkDatabaseHealth,
  simulateDocumentUpload
} from '../../services/healthLockerService';
import {
  HealthLockerDocument,
  HealthLockerMedicationDose,
  HealthLockerVitalLevel,
  HealthLockerQueryResponse
} from '../../types/telemetry';
import {
  Bell,
  Heart,
  Activity,
  Phone,
  MessageSquare,
  ShieldCheck,
  FileUp,
  Clock,
  Sparkles,
  ChevronRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Search,
  Pill,
  Wallet,
  Settings,
  Plus,
  Mic,
  MicOff,
  Check,
  Cpu,
  Layers,
  FileText,
  AlertCircle,
  Play,
  Volume2,
  VolumeX,
  Truck,
  Calendar,
  Database
} from 'lucide-react';

interface CaregiverMobilePhoneProps {
  onUploadClick?: () => void;
}

export const CaregiverMobilePhone: React.FC<CaregiverMobilePhoneProps> = ({ onUploadClick }) => {
  const timeCtx = getTimeContext();
  const {
    currentStep,
    activeScenario,
    caregiverConfig,
    updateCaregiverConfig,
    preCallAgency,
    resolvePreCallAgency,
    requestPreCallApproval,
    cashWallet,
    topUpCashWallet,
    callStatus,
    speakTurn,
    isTranscriberActive,
    transcriberTranscript,
    startTranscriberMode,
    stopTranscriberMode,
    syncTranscriberToEhr
  } = useTelemetry();

  const profile = activeScenario.initialSeniorProfile;
  const [activeTab, setActiveTab] = useState<'stream' | 'locker' | 'guardrails'>('stream');
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false);
  const [isPlayingSummaryAudio, setIsPlayingSummaryAudio] = useState(false);

  const handlePlaySummaryAudio = () => {
    if (isPlayingSummaryAudio) {
      window.speechSynthesis?.cancel();
      setIsPlayingSummaryAudio(false);
    } else {
      setIsPlayingSummaryAudio(true);
      speakTurn({
        id: 'caregiver-summary-audio',
        timestamp: '08:34 IST',
        speaker: 'senior',
        lane: 'lane1',
        speakerLabel: 'Ramesh Chandra (Papa)',
        content: 'बेटा, 1982 में जब हम दिल्ली डिवीजन में सिग्नल इंस्पेक्टर थे... उस समय मैकेनिकल लीवर फ्रेम हुआ करता था। हाथ से खींचना पड़ता था भारी लीवर।'
      });
      setTimeout(() => {
        setIsPlayingSummaryAudio(false);
      }, 8000);
    }
  };

  // Health Locker State
  const [searchQuery, setSearchQuery] = useState('');
  const [queryMode, setQueryMode] = useState<'instant_db' | 'medgemma_rag'>('instant_db');
  const [isSearching, setIsSearching] = useState(false);
  const [queryResult, setQueryResult] = useState<HealthLockerQueryResponse | null>(null);
  const [documents, setDocuments] = useState<HealthLockerDocument[]>([]);
  const [medications, setMedications] = useState<HealthLockerMedicationDose[]>([]);
  const [vitals, setVitals] = useState<HealthLockerVitalLevel[]>([]);

  // In-app upload sheet state
  const [isUploadSheetOpen, setIsUploadSheetOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<'prescription' | 'lab_report' | 'caregiver_note'>('prescription');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDoctor, setUploadDoctor] = useState('');
  const [uploadText, setUploadText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');

  // Fiduciary Cap editing
  const [isEditingLimit, setIsEditingLimit] = useState(false);
  const [limitInput, setLimitInput] = useState(caregiverConfig.orderTotalLimitInr.toString());

  // Database Connection Health State
  const [dbHealth, setDbHealth] = useState<{ connected: boolean; engine: string; tables_count: number; host: string } | null>(null);

  useEffect(() => {
    refreshLockerData();
  }, []);

  const refreshLockerData = async () => {
    // 1. Initial cached seed view
    setDocuments(getLockerDocuments());
    setMedications(getMedicationDoses());
    setVitals(getVitalLevels());

    // 2. Hydrate from live PostgreSQL backend
    try {
      const [docs, meds, vitalsRes, health] = await Promise.all([
        fetchLockerDocuments(),
        fetchMedicationDoses(),
        fetchVitalLevels(),
        checkDatabaseHealth()
      ]);
      if (docs && docs.length > 0) setDocuments(docs);
      if (meds && meds.length > 0) setMedications(meds);
      if (vitalsRes && vitalsRes.length > 0) setVitals(vitalsRes);
      if (health) setDbHealth(health);
    } catch (err) {
      console.debug('Failed to hydrate from PostgreSQL backend:', err);
    }
  };

  const handleSearch = async (queryText?: string) => {
    const q = queryText || searchQuery;
    if (!q.trim()) return;

    setIsSearching(true);
    try {
      const res = await queryHealthLocker({
        query: q,
        seniorId: 'SENIOR_RAMESH_001',
        callerRole: 'caregiver',
        mode: queryMode === 'instant_db' ? 'structured' : 'deep_recall'
      });
      setQueryResult(res);
    } catch (err) {
      console.error('Failed to query locker:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleUploadPreset = (preset: 'rx' | 'lab' | 'diet') => {
    if (preset === 'rx') {
      setUploadCategory('prescription');
      setUploadTitle('Dr. Saxena Review Slip (Oct 2026)');
      setUploadDoctor('Dr. P. N. Saxena (MD, Cardiology)');
      setUploadText(
        'Rx: Ramesh Chandra, 72/M. BP reading 138/86 in clinic. Continue Telmisartan 40mg OD. Add Amlodipine 5mg at night if evening systolic stays above 135 mmHg. Re-check Serum Creatinine in 6 weeks.'
      );
    } else if (preset === 'lab') {
      setUploadCategory('lab_report');
      setUploadTitle('Dr. Lal PathLabs - Serum Creatinine & eGFR');
      setUploadDoctor('Dr. Lal PathLabs Rohini');
      setUploadText(
        'Serum Creatinine: 1.14 mg/dL. Estimated GFR: 72 mL/min/1.73m2. Urine Albumin/Creatinine Ratio: 24 mg/g (Normal < 30). Glycated Hemoglobin (HbA1c): 6.7%.'
      );
    } else {
      setUploadCategory('caregiver_note');
      setUploadTitle("Priya's Kitchen Diet Protocol (Low Salt)");
      setUploadDoctor('Priya Sharma (Primary Caregiver)');
      setUploadText(
        'Caregiver Protocol: Morning oats with unsalted almonds. No pickle or papad. Potassium-rich fruits like papaya allowed in moderate portions.'
      );
    }
  };

  const handleSimulateUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadText.trim()) return;

    setIsUploading(true);
    try {
      await simulateDocumentUpload({
        seniorId: 'SENIOR_RAMESH_001',
        category: uploadCategory,
        title: uploadTitle,
        doctorName: uploadDoctor || 'Primary Care Provider',
        rawText: uploadText
      });

      refreshLockerData();
      setUploadSuccessMsg('Document successfully ingested and parsed by MedGemma into clinical tables!');
      setTimeout(() => {
        setIsUploadSheetOpen(false);
        setUploadSuccessMsg('');
        setUploadTitle('');
        setUploadDoctor('');
        setUploadText('');
      }, 1800);
    } catch (err) {
      console.error('Failed to ingest document:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveLimit = () => {
    const parsed = parseInt(limitInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      updateCaregiverConfig({ orderTotalLimitInr: parsed });
      setIsEditingLimit(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start pt-0 pb-2 px-1 w-full">
      {/* Mobile Device Frame (iPhone 16 Pro Style) */}
      <div className="w-full max-w-[390px] h-[740px] sm:h-[780px] max-h-[calc(100vh-5.5rem)] bg-stone-900 rounded-[40px] sm:rounded-[48px] p-2.5 sm:p-3 shadow-2xl ring-1 ring-stone-800 relative flex flex-col shrink-0 select-none">
        {/* Dynamic Island */}
        <div className="absolute top-4 sm:top-6 left-1/2 -translate-x-1/2 w-28 h-5 sm:h-6 bg-black rounded-full z-50 flex items-center justify-between px-2.5">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse"></span>
          <span className="text-[10px] font-mono text-sky-400 font-bold tabular-nums">09:41</span>
          <span className="w-2.5 h-2.5 rounded-full bg-stone-800"></span>
        </div>

        {/* Screen Bezel Content */}
        <div className="w-full h-full bg-[#FAF8F5] rounded-[32px] sm:rounded-[44px] overflow-hidden flex flex-col relative text-stone-900">
          {/* iOS Status Bar */}
          <div className="pt-3 px-7 pb-1.5 flex items-center justify-between text-xs font-semibold text-stone-800 shrink-0">
            <span className="tabular-nums">9:41</span>
            <div className="flex items-center gap-1.5 text-stone-800 text-[11px]">
              <span className="text-[10px] font-mono font-bold">5G</span>
              <span className="tabular-nums">100%</span>
            </div>
          </div>

          {/* Caregiver Profile Header */}
          <div className="px-3.5 py-2 bg-white border-b border-[#E7E2DB] flex items-center justify-between shrink-0 shadow-2xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-xs shrink-0">
                PS
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-serif font-bold text-stone-900 truncate">
                    Priya Sharma
                  </span>
                  <span className="text-[9px] font-mono font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded border border-sky-200">
                    Caregiver
                  </span>
                </div>
                <span className="text-[10px] text-stone-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                  <span className="truncate">Caring for Papa ({profile.name})</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <div 
                title={dbHealth?.connected ? `Connected to PostgreSQL (${dbHealth.engine} on ${dbHealth.host})` : 'PostgreSQL Database Synchronized'}
                className="flex items-center gap-1 text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200"
              >
                <Database className="w-2.5 h-2.5 text-emerald-700" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>PGSQL :5434</span>
              </div>
              <button
                type="button"
                aria-label="Caregiver notifications"
                className="w-7 h-7 rounded-full bg-[#F5EFE6] border border-[#DFDAD1] flex items-center justify-center text-stone-700 hover:text-stone-900 transition-colors shrink-0"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3-Tab Navigation Bar */}
          <div className="flex items-center bg-[#EFECE6] p-1 mx-2.5 my-1.5 rounded-xl border border-[#DFDAD1] shrink-0 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('stream')}
              className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === 'stream'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🏠</span>
              <span>Dashboard</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('locker')}
              className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === 'locker'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>🌿</span>
              <span>Health Locker</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guardrails')}
              className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all text-center cursor-pointer flex items-center justify-center gap-1 ${
                activeTab === 'guardrails'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <span>⚙️</span>
              <span>Guardrails</span>
            </button>
          </div>

          {/* Body Content Area */}
          <div className="flex-1 overflow-y-auto px-2.5 pb-3 scrollbar-thin">
            {/* ========================================================================= */}
            {/* SUB-TAB 1: AGENCY & TELEGRAM BOT                                          */}
            {/* ========================================================================= */}
            {activeTab === 'stream' && (
              <div className="space-y-2.5 pt-0.5">
                {/* Pre-Call Caregiver Agency Gate */}
                {preCallAgency && (
                  <div className="p-2.5 rounded-2xl bg-white border border-[#DFDAD1] space-y-2 shadow-2xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-stone-900 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        <span>Pre-Call Agency Gate ({timeCtx.period})</span>
                      </span>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                          preCallAgency.status === 'awaiting_approval'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : preCallAgency.status === 'caregiver_calling'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-sky-50 text-sky-800 border-sky-200'
                        }`}
                      >
                        {preCallAgency.status === 'awaiting_approval'
                          ? 'DECISION PENDING'
                          : preCallAgency.status === 'caregiver_calling'
                          ? 'CALLING DIRECT'
                          : 'AI DELEGATED'}
                      </span>
                    </div>

                    {preCallAgency.status === 'awaiting_approval' ? (
                      <div className="space-y-2 pt-0.5">
                        <p className="text-[11px] text-stone-600 leading-snug">
                          Pari is ready to check in on Papa. Would you like to call him directly yourself today, or delegate to Pari?
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => resolvePreCallAgency('caregiver_direct')}
                            className="py-1.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Phone className="w-3 h-3" />
                            <span>I'll Call Papa</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => resolvePreCallAgency('agent_approved')}
                            className="py-1.5 px-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-[10px] flex items-center justify-center gap-1 cursor-pointer transition-colors shadow-2xs"
                          >
                            <Sparkles className="w-3 h-3" />
                            <span>Let Pari Call</span>
                          </button>
                        </div>
                      </div>
                    ) : preCallAgency.status === 'caregiver_calling' ? (
                      <div className="flex items-center justify-between text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded-xl border border-emerald-200">
                        <span className="font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>You are calling Papa directly today</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => requestPreCallApproval()}
                          className="underline text-stone-500 hover:text-stone-900 font-bold cursor-pointer text-[10px]"
                        >
                          Reset
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] text-sky-800 bg-sky-50/80 p-2 rounded-xl border border-sky-200">
                        <span className="font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                          <span>Pari authorized for {timeCtx.period.toLowerCase()} check-in</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => requestPreCallApproval()}
                          className="underline text-stone-500 hover:text-stone-900 font-bold cursor-pointer text-[10px]"
                        >
                          Change
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* 2. Daily Call Summary & Family Briefing Card (Click to open History Archive) */}
                <div
                  onClick={() => setIsHistorySheetOpen(true)}
                  className="p-3.5 rounded-2xl bg-gradient-to-br from-white via-white to-amber-50/50 border border-[#DFDAD1] space-y-2.5 shadow-2xs hover:shadow-xs hover:border-amber-300 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span className="w-6 h-6 rounded-lg bg-amber-100/80 text-amber-900 flex items-center justify-center text-xs">
                        📻
                      </span>
                      <span className="font-serif font-bold text-stone-900 text-xs">
                        Daily Call Summary
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                          callStatus === 'ended'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : callStatus === 'active'
                            ? 'bg-sky-50 text-sky-800 border-sky-300 animate-pulse'
                            : 'bg-stone-50 text-stone-600 border-stone-200'
                        }`}
                      >
                        {callStatus === 'ended'
                          ? 'FRESH DISPATCH (08:34)'
                          : callStatus === 'active'
                          ? 'IN PROGRESS...'
                          : 'YESTERDAY (08:31)'}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Summary Content Body */}
                  {callStatus === 'ended' ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900 leading-tight">
                          Railway Signal Lore & Telma-40 Adherence
                        </span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          🌿 Cheerful (94%)
                        </span>
                      </div>

                      <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
                        "Papa was in high spirits sitting in the balcony with morning tea, sharing memories from his 1982 railway signal interlocking days. Telma-40 confirmed taken with water."
                      </p>

                      {/* Interactive Audio Story Preview Snippet */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlaySummaryAudio();
                        }}
                        className="p-2 rounded-xl bg-amber-50/90 border border-amber-200 flex items-center justify-between gap-2 hover:bg-amber-100/80 transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            type="button"
                            className="w-6 h-6 rounded-full bg-amber-700 text-white flex items-center justify-center shrink-0 shadow-2xs"
                          >
                            {isPlayingSummaryAudio ? (
                              <VolumeX className="w-3 h-3" />
                            ) : (
                              <Play className="w-3 h-3 fill-current ml-0.5" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-amber-950 block truncate">
                              Play Papa's Voice Story (0:42)
                            </span>
                            <span className="text-[9px] text-amber-800/80 truncate block">
                              "बेटा, 1982 में जब हम दिल्ली डिवीजन में..."
                            </span>
                          </div>
                        </div>
                        <span className="text-[9px] font-mono text-amber-700 bg-amber-100 px-1 py-0.2 rounded font-bold shrink-0">
                          Awadhi
                        </span>
                      </div>
                    </div>
                  ) : callStatus === 'active' || callStatus === 'calling' ? (
                    <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-sky-900 font-bold">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping"></span>
                          <span>Telephony Session Active</span>
                        </span>
                        <span className="font-mono text-sky-700">Jio PSTN +91 98101 23456</span>
                      </div>
                      <p className="text-[11px] text-sky-800 leading-snug">
                        Companion checking in on morning tea, BP pill adherence, and railway nostalgia...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-800 leading-tight">
                          Gandhi Jayanti Walk & Knee Stiffness Review
                        </span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                          ☕ Calm (88%)
                        </span>
                      </div>

                      <p className="text-[11px] text-stone-600 leading-relaxed font-sans">
                        "Papa completed a 25-minute gentle walk in Japanese Park with Sharma Ji. Reported mild knee stiffness; warm water compress advised. Full BP pill compliance."
                      </p>
                    </div>
                  )}

                  {/* Call-to-action prompt */}
                  <div className="pt-1.5 border-t border-stone-100 flex items-center justify-between text-[10px]">
                    <span className="text-teal-700 font-bold group-hover:underline flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>View Past 5 Call Summaries Archive</span>
                    </span>
                    <span className="text-stone-400 font-mono">100% Adherence Trend</span>
                  </div>
                </div>

                {/* 3. Papa's Live Health & Pill Adherence Runway */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#DFDAD1] space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span>Papa's Vitals & Pill Runway</span>
                    </span>
                    <span className="text-[9px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      Omron BLE Synced
                    </span>
                  </div>

                  {/* Vitals Grid: Blood Pressure & Glucose */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-stone-500">
                        <span>Blood Pressure</span>
                        <span className="text-emerald-700 font-bold">Good</span>
                      </div>
                      <span className="text-base font-black text-stone-900 font-mono tracking-tight block">
                        112/80
                      </span>
                      <span className="text-[9px] text-stone-400">mmHg · 08:15 AM IST</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-0.5">
                      <div className="flex items-center justify-between text-[10px] text-stone-500">
                        <span>Blood Glucose</span>
                        <span className="text-emerald-700 font-bold">Normal</span>
                      </div>
                      <span className="text-base font-black text-stone-900 font-mono tracking-tight block">
                        104
                      </span>
                      <span className="text-[9px] text-stone-400">mg/dL · Post-tea normal</span>
                    </div>
                  </div>

                  {/* Pill Runway Progress Bars */}
                  <div className="space-y-2 pt-1 border-t border-stone-100">
                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-bold text-stone-800">Telmisartan 40mg (BP)</span>
                        <span className="font-mono text-amber-700 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                          ⚠️ 4 Days (Refill Active)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full w-[16%]"></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-bold text-stone-800">Metformin 500mg (Sugar)</span>
                        <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          ✅ 22 Days (Safe)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full w-[73%]"></div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('locker')}
                    className="w-full py-1.5 bg-[#FAF8F5] hover:bg-stone-100 border border-stone-200 rounded-xl text-[10px] font-bold text-stone-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <span>Inspect ABDM Prescriptions & Labs</span>
                    <ChevronRight className="w-3 h-3 text-stone-400" />
                  </button>
                </div>

                {/* 4. Care Budget & Active Delivery Tracking */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#DFDAD1] space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5 text-teal-600" />
                      <span>Fiduciary Care Budget & Orders</span>
                    </span>
                    <span className="text-[10px] font-mono text-teal-800 font-bold">
                      Pine Labs · ₹4,500 Cap
                    </span>
                  </div>

                  {/* Monthly Budget Spend Bar */}
                  <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-stone-200/80 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-stone-500">Monthly Auto-Refill Spending:</span>
                      <span className="font-mono font-bold text-stone-900">
                        ₹840.00 / ₹4,500.00
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-stone-200 overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full w-[19%]"></div>
                    </div>
                    <span className="text-[9px] text-stone-500 block">
                      ₹3,660.00 pre-approved headroom available without disturbing Priya
                    </span>
                  </div>

                  {/* Active Delivery Status */}
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200/90 flex items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
                        <Truck className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[11px] font-bold text-stone-900 block truncate">
                          Telmisartan 40mg (30 Tablets)
                        </span>
                        <span className="text-[9px] font-mono text-stone-500 truncate block">
                          Delhivery CMU DLV-98234-DEL · Today 4:00 PM
                        </span>
                      </div>
                    </div>

                    <span className="text-[9px] font-mono font-bold text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 shrink-0 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                      <span>IN TRANSIT</span>
                    </span>
                  </div>
                </div>

                {/* 5. Primary Care Circle & Quick Dial */}
                <div className="p-3.5 rounded-2xl bg-white border border-[#DFDAD1] space-y-2.5 shadow-2xs">
                  <span className="text-xs font-serif font-bold text-stone-900 block">
                    Primary Care Circle
                  </span>

                  <div className="space-y-1.5">
                    {/* Papa Direct Dial */}
                    <div className="p-2 rounded-xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">👴🏼</span>
                        <div>
                          <span className="text-xs font-bold text-stone-900 block leading-tight">
                            Ramesh Chandra (Papa)
                          </span>
                          <span className="text-[9px] text-stone-500 font-mono">+91 98101 23456</span>
                        </div>
                      </div>
                      <a
                        href="tel:+919810123456"
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold shadow-2xs flex items-center gap-1 transition-colors"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call Papa</span>
                      </a>
                    </div>

                    {/* Dr. Arvind Saxena */}
                    <div className="p-2 rounded-xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">👨‍⚕️</span>
                        <div>
                          <span className="text-xs font-bold text-stone-900 block leading-tight">
                            Dr. Arvind Saxena
                          </span>
                          <span className="text-[9px] text-stone-500">Cardiology Specialist · Apollo Rohini</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Online
                      </span>
                    </div>

                    {/* Apollo DarkStore */}
                    <div className="p-2 rounded-xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">💊</span>
                        <div>
                          <span className="text-xs font-bold text-stone-900 block leading-tight">
                            Apollo Pharmacy DarkStore
                          </span>
                          <span className="text-[9px] text-stone-500">Sector 11 Rohini · Partner Rail</span>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-teal-700 font-bold bg-teal-50 px-1.5 py-0.5 rounded border border-teal-200">
                        Active SLA
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SUB-TAB 2: HEALTH LOCKER & MEDGEMMA                                       */}
            {/* ========================================================================= */}
            {activeTab === 'locker' && (
              <div className="space-y-3 pt-1">
                {/* Live PostgreSQL Database Status Strip */}
                <div className="p-2.5 rounded-2xl bg-emerald-50/90 border border-emerald-200/90 flex items-center justify-between text-[11px] shadow-2xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-2xs">
                      <Database className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold text-emerald-950 block truncate">
                        PostgreSQL 15 Connected
                      </span>
                      <span className="text-[9px] text-emerald-700/90 font-mono block truncate">
                        Docker :5434/sambandh · 8 Core Tables
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-emerald-800 bg-white px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
                    Live SQL Sync
                  </span>
                </div>

                {/* Search Bar & Mode Toggle */}
                <div className="p-3 bg-white rounded-2xl border border-[#DFDAD1] space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-purple-700" />
                      <span>MedGemma Clinical Search</span>
                    </span>
                    {/* Mode Toggle */}
                    <div className="flex items-center bg-[#F5EFE6] p-0.5 rounded-lg border border-[#DFDAD1] text-[10px]">
                      <button
                        type="button"
                        onClick={() => setQueryMode('instant_db')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                          queryMode === 'instant_db'
                            ? 'bg-white text-stone-900 shadow-2xs'
                            : 'text-stone-500'
                        }`}
                      >
                        DB
                      </button>
                      <button
                        type="button"
                        onClick={() => setQueryMode('medgemma_rag')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all cursor-pointer ${
                          queryMode === 'medgemma_rag'
                            ? 'bg-purple-700 text-white shadow-2xs'
                            : 'text-stone-500'
                        }`}
                      >
                        MedGemma
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Ask about doses, BP, renal safety..."
                      className="w-full pl-8 pr-16 py-2 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:border-stone-400"
                    />
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => handleSearch()}
                      disabled={isSearching || !searchQuery.trim()}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-stone-900 text-white rounded-lg text-[10px] font-semibold hover:bg-stone-800 disabled:opacity-40 cursor-pointer"
                    >
                      {isSearching ? '...' : 'Ask'}
                    </button>
                  </div>

                  {/* Query Preset Chips */}
                  <div className="flex flex-wrap gap-1">
                    {[
                      'Telmisartan 40mg with dinner?',
                      'Dr. Saxena low-salt rules',
                      'Recent BP trend'
                    ].map((chip, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSearchQuery(chip);
                          handleSearch(chip);
                        }}
                        className="text-[10px] text-stone-600 bg-[#FAF8F5] hover:bg-stone-100 px-2 py-1 rounded-lg border border-stone-200/80 transition-colors cursor-pointer"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>

                  {/* MedGemma Answer Card */}
                  {queryResult && (
                    <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-purple-950 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-700" />
                          <span>MedGemma Clinical Synthesis</span>
                        </span>
                        <span className="font-mono text-purple-700 font-semibold">
                          {queryResult.latency_ms}ms · {queryResult.data_source.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-[11px] text-purple-950 leading-relaxed font-sans">
                        {queryResult.analysis}
                      </p>
                      {queryResult.sources.length > 0 && (
                        <div className="pt-1 border-t border-purple-200/60 flex items-center gap-1 text-[9px] text-purple-800">
                          <FileText className="w-3 h-3 text-purple-600 shrink-0" />
                          <span className="truncate">Source: {queryResult.sources[0]}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Upload Doctor Slip Action Card */}
                <div className="p-3 bg-white rounded-2xl border border-[#DFDAD1] space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-serif font-bold text-stone-900 block">
                        Ingest Prescription or Report
                      </span>
                      <span className="text-[10px] text-stone-500">
                        Parses clinical entities into Supabase & Vector store
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsUploadSheetOpen(!isUploadSheetOpen)}
                      className="px-2.5 py-1 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer shadow-2xs"
                    >
                      <FileUp className="w-3.5 h-3.5" />
                      <span>{isUploadSheetOpen ? 'Cancel' : 'Upload'}</span>
                    </button>
                  </div>

                  {/* Expandable Upload Form */}
                  {isUploadSheetOpen && (
                    <form onSubmit={handleSimulateUpload} className="pt-2 border-t border-[#F5EFE6] space-y-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] text-stone-500 font-medium">Quick Presets:</span>
                        <button
                          type="button"
                          onClick={() => handleUploadPreset('rx')}
                          className="text-[9px] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-700 hover:bg-stone-100"
                        >
                          Dr. Saxena Rx
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUploadPreset('lab')}
                          className="text-[9px] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-700 hover:bg-stone-100"
                        >
                          Dr. Lal Labs
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUploadPreset('diet')}
                          className="text-[9px] bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-stone-200 text-stone-700 hover:bg-stone-100"
                        >
                          Low Salt Diet
                        </button>
                      </div>

                      <input
                        type="text"
                        value={uploadTitle}
                        onChange={(e) => setUploadTitle(e.target.value)}
                        placeholder="Document Title (e.g. Dr. Saxena Review)"
                        required
                        className="w-full px-2.5 py-1.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs text-stone-900"
                      />

                      <textarea
                        rows={3}
                        value={uploadText}
                        onChange={(e) => setUploadText(e.target.value)}
                        placeholder="Paste prescription clinical notes or report..."
                        required
                        className="w-full px-2.5 py-1.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs text-stone-900 resize-none"
                      />

                      {uploadSuccessMsg && (
                        <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-800 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{uploadSuccessMsg}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isUploading || !uploadTitle.trim() || !uploadText.trim()}
                        className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-40 cursor-pointer"
                      >
                        <FileUp className="w-3.5 h-3.5" />
                        <span>{isUploading ? 'Parsing via MedGemma...' : 'Ingest & Store in Tables'}</span>
                      </button>
                    </form>
                  )}
                </div>

                {/* Active Medication Doses */}
                <div className="p-3 bg-white rounded-2xl border border-[#DFDAD1] space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
                      <Pill className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Active Medication Doses</span>
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                      {medications.length} Prescribed
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {medications.slice(0, 3).map((med) => (
                      <div
                        key={med.id}
                        className="p-2 rounded-xl bg-[#FAF8F5] border border-stone-200/80 flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-stone-900">{med.drugName}</span>
                            <span className="text-[9px] font-mono text-stone-500 bg-white px-1 rounded border border-stone-200">
                              {med.strength}
                            </span>
                          </div>
                          <span className="text-[10px] text-stone-500 block">
                            {med.timingInstructions} · {med.cadence}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            {med.runwayDays}d left
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Vitals Level Tracking */}
                <div className="p-3 bg-white rounded-2xl border border-[#DFDAD1] space-y-2 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-rose-600" />
                      <span>Vital & Metabolic Levels</span>
                    </span>
                    <span className="text-[10px] text-stone-500">Omron + Labs</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-xl bg-[#FAF8F5] border border-stone-200/80">
                      <span className="text-[10px] text-stone-500 block">Blood Pressure:</span>
                      <span className="font-mono font-bold text-sm text-stone-900">128/82 mmHg</span>
                      <span className="text-[9px] text-emerald-700 block mt-0.5">● In Target Range</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF8F5] border border-stone-200/80">
                      <span className="text-[10px] text-stone-500 block">Serum Creatinine:</span>
                      <span className="font-mono font-bold text-sm text-stone-900">1.10 mg/dL</span>
                      <span className="text-[9px] text-emerald-700 block mt-0.5">● Normal (&lt;1.30)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* SUB-TAB 3: GUARDRAILS & WALLET                                            */}
            {/* ========================================================================= */}
            {activeTab === 'guardrails' && (
              <div className="space-y-3 pt-1">
                {/* Fiduciary Limits Card */}
                <div className="p-3 bg-white rounded-2xl border border-[#DFDAD1] space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Fiduciary Daily Spend Cap</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsEditingLimit(!isEditingLimit)}
                      className="text-[10px] font-semibold text-stone-600 hover:text-stone-900 underline cursor-pointer"
                    >
                      {isEditingLimit ? 'Cancel' : 'Edit Cap'}
                    </button>
                  </div>

                  {isEditingLimit ? (
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-stone-700">₹</span>
                        <input
                          type="number"
                          value={limitInput}
                          onChange={(e) => setLimitInput(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 bg-[#FAF8F5] border border-stone-300 rounded-xl text-xs font-mono font-bold text-stone-900"
                        />
                        <button
                          type="button"
                          onClick={handleSaveLimit}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                      <p className="text-[10px] text-stone-500">
                        Any order above ₹{limitInput} will require your explicit 2FA approval on Telegram.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-bold font-mono text-stone-900">
                          ₹{caregiverConfig.orderTotalLimitInr.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">
                          Active Limit
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1 leading-relaxed">
                        Orders below this are fulfilled autonomously via Pine Labs UPI & Delhivery CMU.
                      </p>
                    </div>
                  )}
                </div>

                {/* Cash Care Wallet & Top Up */}
                <div className="p-3 bg-white rounded-2xl border border-[#DFDAD1] space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
                      <Wallet className="w-3.5 h-3.5 text-stone-700" />
                      <span>Care Cash Wallet</span>
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">Pine Labs Auto-Debit</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-[#FAF8F5] rounded-xl border border-stone-200/80">
                    <div>
                      <span className="text-[10px] text-stone-500 block">Available Balance:</span>
                      <span className="text-lg font-bold font-mono text-stone-900">
                        ₹{cashWallet.balanceInr.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => topUpCashWallet(500)}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors shadow-2xs"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+₹500 Top Up</span>
                    </button>
                  </div>
                </div>

                {/* In-Clinic Doctor Transcriber Mode */}
                <div className="p-3 bg-white rounded-2xl border border-[#DFDAD1] space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-indigo-700" />
                      <span>In-Clinic Doctor Transcriber</span>
                    </span>
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${
                        isTranscriberActive
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-stone-50 text-stone-500 border-stone-200'
                      }`}
                    >
                      {isTranscriberActive ? 'RECORDING' : 'IDLE'}
                    </span>
                  </div>

                  <p className="text-[10px] text-stone-500 leading-relaxed">
                    Activate during Dr. Saxena's physical consultation to transcribe verbal instructions directly into Ramesh Ji's Health Locker.
                  </p>

                  <div className="flex items-center gap-2">
                    {isTranscriberActive ? (
                      <button
                        type="button"
                        onClick={stopTranscriberMode}
                        className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <MicOff className="w-3.5 h-3.5" />
                        <span>Stop Recording</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={startTranscriberMode}
                        className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Start Recording</span>
                      </button>
                    )}

                    {transcriberTranscript.length > 0 && (
                      <button
                        type="button"
                        onClick={syncTranscriberToEhr}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        title="Sync to EHR"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Sync EHR</span>
                      </button>
                    )}
                  </div>

                  {transcriberTranscript.length > 0 && (
                    <div className="p-2 rounded-xl bg-indigo-50/70 border border-indigo-200 text-[10px] text-indigo-950 font-mono max-h-24 overflow-y-auto">
                      {transcriberTranscript[transcriberTranscript.length - 1]}
                    </div>
                  )}
                </div>

                {/* Routine Morning Window */}
                <div className="p-3 bg-white rounded-2xl border border-[#DFDAD1] flex items-center justify-between shadow-2xs">
                  <div>
                    <span className="text-xs font-serif font-bold text-stone-900 block">
                      Scheduled Daily Check-In Window
                    </span>
                    <span className="text-[10px] text-stone-500">
                      Pari companion check-in ({timeCtx.period})
                    </span>
                  </div>
                  <span className="font-mono font-bold text-xs text-stone-800 bg-[#FAF8F5] px-2.5 py-1 rounded-xl border border-stone-200">
                    10:00 AM IST
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Call Summary History Sheet Modal (Within phone bezel) */}
          <CallSummaryHistorySheet
            isOpen={isHistorySheetOpen}
            onClose={() => setIsHistorySheetOpen(false)}
          />
        </div>
      </div>
    </div>
  );
};
