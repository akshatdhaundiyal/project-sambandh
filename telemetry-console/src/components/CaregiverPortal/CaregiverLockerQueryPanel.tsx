import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  queryHealthLocker,
  getLockerDocuments,
  getMedicationDoses,
  getVitalLevels,
  simulateDocumentUpload
} from '../../services/healthLockerService';
import {
  HealthLockerDocument,
  HealthLockerMedicationDose,
  HealthLockerVitalLevel,
  HealthLockerQueryResponse
} from '../../types/telemetry';
import {
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  FileText,
  Pill,
  Activity,
  Truck,
  Mic,
  Settings,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Database,
  ExternalLink,
  ChevronRight,
  UploadCloud,
  FileCheck,
  RefreshCw,
  X,
  TrendingUp,
  Cpu
} from 'lucide-react';

interface CaregiverLockerQueryPanelProps {
  onOpenUploadModal?: () => void;
}

export const CaregiverLockerQueryPanel: React.FC<CaregiverLockerQueryPanelProps> = () => {
  const {
    openApiDrawerForCurrentStep,
    setActiveTab,
    activeScenario,
    cashWallet,
    caregiverConfig,
    updateCaregiverConfig,
    inventoryOrders,
    addInventoryOrder,
    deductCashWallet,
    isTranscriberActive,
    transcriberTranscript,
    startTranscriberMode,
    stopTranscriberMode,
    syncTranscriberToEhr
  } = useTelemetry();

  const profile = activeScenario.initialSeniorProfile;

  // Sub-tabs in the dossier
  const [activeSubTab, setActiveSubTab] = useState<
    'documents' | 'prescriptions' | 'vitals' | 'logistics' | 'transcriber' | 'settings'
  >('documents');

  // Query State
  const [searchQuery, setSearchQuery] = useState('');
  const [queryMode, setQueryMode] = useState<'instant_db' | 'medgemma_rag'>('instant_db');
  const [isSearching, setIsSearching] = useState(false);
  const [queryResult, setQueryResult] = useState<HealthLockerQueryResponse | null>(null);

  // Data states
  const [documents, setDocuments] = useState<HealthLockerDocument[]>([]);
  const [medications, setMedications] = useState<HealthLockerMedicationDose[]>([]);
  const [vitals, setVitals] = useState<HealthLockerVitalLevel[]>([]);

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<'prescription' | 'lab_report' | 'caregiver_note'>('prescription');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDoctor, setUploadDoctor] = useState('');
  const [uploadText, setUploadText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatusMsg, setUploadStatusMsg] = useState('');

  // Settings editing state
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [tempLimit, setTempLimit] = useState(caregiverConfig.orderTotalLimitInr);

  // Initial load
  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setDocuments(getLockerDocuments());
    setMedications(getMedicationDoses());
    setVitals(getVitalLevels());
  };

  const handleRunQuery = async (queryOverride?: string) => {
    const q = queryOverride || searchQuery;
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
      console.error('Failed to query health locker:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleChipClick = (chipText: string) => {
    setSearchQuery(chipText);
    handleRunQuery(chipText);
  };

  const handlePresetSelect = (preset: 'rx' | 'lab' | 'diet') => {
    if (preset === 'rx') {
      setUploadCategory('prescription');
      setUploadTitle('Dr. Saxena Review Slip (Oct 2026)');
      setUploadDoctor('Dr. P. N. Saxena (MD, Senior Consultant)');
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
      setUploadTitle('Priya\'s Kitchen Diet Protocol (Low Salt)');
      setUploadDoctor('Priya Sharma (Primary Caregiver)');
      setUploadText(
        'Caregiver Protocol: Morning oats with unsalted almonds. No pickle or papad. Potassium-rich fruits like papaya allowed in moderate portions. Emergency contact list pinned on fridge.'
      );
    }
  };

  const handleSimulateUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadText.trim()) return;

    setIsUploading(true);
    setUploadStatusMsg('MedGemma Multimodal Ingestion: Parsing clinical entities & generating vector embeddings...');

    try {
      const result = await simulateDocumentUpload({
        seniorId: 'SENIOR_RAMESH_001',
        category: uploadCategory,
        title: uploadTitle,
        doctorName: uploadDoctor || 'Attending Physician',
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        rawText: uploadText,
        summary: `MedGemma processed document: ${uploadTitle}. Extracted entities written into PostgreSQL tables.`,
        keyEntities: {
          vitals: { Status: 'Parsed and indexed into Health Locker' },
          warnings: ['Verified under Zero-Diagnosis Guardrail']
        }
      });

      setUploadStatusMsg(`✓ Ingestion Complete! Extracted and stored into PostgreSQL / Supabase.`);
      setTimeout(() => {
        setIsUploading(false);
        setIsUploadOpen(false);
        setUploadStatusMsg('');
        setUploadTitle('');
        setUploadDoctor('');
        setUploadText('');
        refreshData();
      }, 1400);
    } catch (err) {
      console.error('Upload failed:', err);
      setIsUploading(false);
      setUploadStatusMsg('Upload simulation failed.');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#FAF8F5] overflow-y-auto px-2 sm:px-4 py-3 space-y-4 scrollbar-thin">
      {/* Top Banner: Status & Quick Live Rail API Inspector */}
      <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 sm:p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700 shadow-2xs">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-base sm:text-lg text-stone-900 tracking-tight">
                Health Locker & MedGemma RAG Console
              </h2>
              <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                PostgreSQL · Supabase Ready
              </span>
            </div>
            <p className="text-xs text-stone-500">
              1st-time ingestion extracts structured clinical tables · On-demand MedGemma RAG recall with zero hallucination.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Live Rail API Drawer Trigger */}
          <button
            type="button"
            onClick={openApiDrawerForCurrentStep}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl border border-amber-300 text-xs font-bold transition-all shadow-2xs cursor-pointer group"
            title="Inspect active HTTP exchange in slide-out drawer"
          >
            <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-400 group-hover:scale-110 transition-transform" />
            <span>⚡ Live Rail API</span>
          </button>

          {/* Upload Doctor Slip Trigger */}
          <button
            type="button"
            onClick={() => {
              setIsUploadOpen(true);
              handlePresetSelect('rx');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ingest New Record</span>
          </button>
        </div>
      </div>

      {/* MedGemma Query Bar */}
      <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="font-serif font-bold text-sm text-stone-900">
              Ask MedGemma Clinical Intelligence
            </span>
            <span className="text-[10px] font-mono font-medium text-stone-500 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
              4B Multimodal + Pinecone
            </span>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center bg-[#EFECE6] p-0.5 rounded-xl border border-[#DFDAD1] text-xs">
            <button
              type="button"
              onClick={() => setQueryMode('instant_db')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                queryMode === 'instant_db'
                  ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Zap className="w-3 h-3 text-amber-600" />
              <span>Instant DB (&lt;10ms)</span>
            </button>
            <button
              type="button"
              onClick={() => setQueryMode('medgemma_rag')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                queryMode === 'medgemma_rag'
                  ? 'bg-white text-purple-900 shadow-2xs border border-purple-200'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Cpu className="w-3 h-3 text-purple-600" />
              <span>MedGemma Synthesis</span>
            </button>
          </div>
        </div>

        {/* Input box */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleRunQuery()}
              placeholder="Query Ramesh Ji's medications, creatinine trajectory, or dietary salt limits..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#DFDAD1] rounded-2xl text-xs sm:text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white transition-all shadow-inner"
            />
          </div>

          <button
            type="button"
            onClick={() => handleRunQuery()}
            disabled={isSearching || !searchQuery.trim()}
            className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
          >
            {isSearching ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>Recall</span>
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] font-semibold text-stone-500 mr-1">Quick prompts:</span>
          {[
            'Creatinine trajectory',
            'Active BP meds & morning routine',
            'Salt & dietary limits',
            'Dr. Sharma latest advice'
          ].map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="px-2.5 py-1 rounded-xl bg-[#FAF8F5] hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 text-stone-700 text-xs font-medium border border-[#E7E2DB] transition-all cursor-pointer"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* MedGemma Synthesis Output Card */}
        {queryResult && (
          <div className="mt-3 p-4 rounded-2xl bg-gradient-to-br from-purple-50/70 via-stone-50 to-teal-50/50 border border-purple-200/80 shadow-xs space-y-3 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-purple-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>MedGemma Clinical Synthesis</span>
                </span>
                <span className="text-[10px] font-mono text-purple-800 bg-purple-100/80 px-2 py-0.5 rounded-full border border-purple-200">
                  {queryResult.latency_ms}ms · {queryResult.data_source}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  <span>Zero-Diagnosis Verified</span>
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('judge')}
                  className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 underline flex items-center gap-0.5"
                >
                  <span>Inspect in Judge Telemetry</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Answer Narrative */}
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed font-sans font-medium whitespace-pre-line">
              {queryResult.analysis}
            </p>

            {/* Grounding Citations */}
            {queryResult.sources.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-stone-600 block">
                  Grounding Evidence & Citations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {queryResult.sources.map((src, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-800 shadow-2xs"
                    >
                      📑 {src}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Retrieved Chunks Preview */}
            {queryResult.retrieved_chunks && queryResult.retrieved_chunks.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {queryResult.retrieved_chunks.map((chk, idx) => (
                  <div
                    key={chk.document_id || idx}
                    className="p-2.5 rounded-xl bg-white border border-stone-200 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 truncate">
                        {chk.title || chk.document_id || 'Clinical Evidence Chunk'}
                      </span>
                      {chk.score !== undefined && (
                        <span className="text-[10px] font-mono text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 tabular-nums">
                          {Math.round(chk.score * 100)}% match
                        </span>
                      )}
                    </div>
                    {chk.content && (
                      <p className="text-[11px] text-stone-600 line-clamp-2 italic">
                        "{chk.content}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Segmented Sub-tabs */}
      <div className="bg-[#EFECE6] p-1 rounded-2xl border border-[#DFDAD1] flex flex-wrap gap-1 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveSubTab('documents')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'documents'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-teal-700" />
          <span>Document Vault ({documents.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('prescriptions')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'prescriptions'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Pill className="w-3.5 h-3.5 text-emerald-700" />
          <span>Prescriptions & Doses ({medications.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('vitals')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'vitals'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-indigo-700" />
          <span>Vitals & Lab Trajectory ({vitals.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('logistics')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'logistics'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-amber-700" />
          <span>Care Logistics & Orders ({inventoryOrders.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('transcriber')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'transcriber'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Mic className="w-3.5 h-3.5 text-cyan-700" />
          <span>In-Clinic Transcriber</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('settings')}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'settings'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Settings className="w-3.5 h-3.5 text-stone-700" />
          <span>Caregiver Guardrails</span>
        </button>
      </div>

      {/* Tab 1: Document Vault */}
      {activeSubTab === 'documents' && (
        <div className="space-y-3 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-[#E7E2DB] rounded-3xl p-4 shadow-xs space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#E7E2DB]">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 uppercase">
                        {doc.category.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-stone-400 font-mono">{doc.date}</span>
                    </div>
                    <span className="text-[10px] font-mono text-stone-400">{doc.id}</span>
                  </div>

                  <h3 className="font-serif font-bold text-sm text-stone-900 mt-2">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-medium">{doc.doctorName}</p>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed bg-[#FAF8F5] p-2.5 rounded-xl border border-[#DFDAD1]">
                    {doc.summary}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
                  <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Indexed in PostgreSQL & Pinecone</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery(`What does ${doc.title} say?`);
                      handleRunQuery(`What does ${doc.title} say?`);
                    }}
                    className="font-bold text-teal-800 hover:text-teal-900 underline cursor-pointer"
                  >
                    Query Doc
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Prescriptions & Doses */}
      {activeSubTab === 'prescriptions' && (
        <div className="bg-white border border-[#E7E2DB] rounded-3xl p-5 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DB]">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Active Medication Doses & Refill Runway
              </h3>
              <p className="text-xs text-stone-500">
                Mirrored from PostgreSQL table <code className="font-mono text-stone-700">medication_doses</code>
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Autonomous Fiduciary Guardrail Active
            </span>
          </div>

          <div className="space-y-3">
            {medications.map((med) => (
              <div
                key={med.id}
                className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7E2DB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-100/70 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
                    <Pill className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-stone-900">
                        {med.drugName} {med.strength}
                      </span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-white text-stone-700 border border-stone-200">
                        {med.cadence}
                      </span>
                    </div>
                    <span className="text-xs text-stone-500 block">
                      Instructions: {med.timingInstructions}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <div className="text-right">
                    <span className="text-xs font-bold text-stone-900 block tabular-nums">
                      {med.currentStockUnits} pills remaining
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                        med.runwayDays <= 5
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {med.runwayDays} days runway
                    </span>
                  </div>

                  {med.runwayDays <= 5 && (
                    <button
                      type="button"
                      onClick={() => {
                        deductCashWallet(420, `Auto-Refill: ${med.drugName}`);
                        addInventoryOrder({
                          id: `ord-refill-${Date.now()}`,
                          itemName: `${med.drugName} ${med.strength} (Strip of 15)`,
                          category: 'MEDICATION',
                          orderDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
                          units: 1,
                          amountInr: 420,
                          vendor: 'Apollo Pharmacy Rohini',
                          status: 'ORDERED_NOT_RECEIVED',
                          trackingWaybill: `APOLLO-${Date.now().toString().slice(-6)}`,
                          eta: 'Tomorrow by 11:00 AM'
                        });
                      }}
                      className="px-2.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-2xs"
                    >
                      Refill Now
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Vitals & Lab Trajectory */}
      {activeSubTab === 'vitals' && (
        <div className="bg-white border border-[#E7E2DB] rounded-3xl p-5 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DB]">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Senior Chronic Biomarkers & Vitals Tracking
              </h3>
              <p className="text-xs text-stone-500">
                Mirrored from PostgreSQL table <code className="font-mono text-stone-700">vital_and_level_tracking</code>
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
              ABDM Certified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {vitals.map((v) => (
              <div
                key={v.id}
                className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2DB] space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-stone-900">
                    {v.vitalType.replace(/_/g, ' ').toUpperCase()}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      v.isNormal
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                    }`}
                  >
                    {v.isNormal ? 'OPTIMAL' : 'MONITOR'}
                  </span>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <span className="text-xl font-bold font-mono text-stone-900 tabular-nums">
                    {v.valueNumeric}
                  </span>
                  <span className="text-xs text-stone-500">{v.unit}</span>
                </div>

                <div className="text-[11px] text-stone-500 space-y-0.5 pt-1 border-t border-[#E7E2DB]">
                  <div>Ref Range: <span className="font-mono">{v.referenceRange || 'Standard'}</span></div>
                  <div>Measured: <span>{v.recordedDate}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Logistics */}
      {activeSubTab === 'logistics' && (
        <div className="bg-white border border-[#E7E2DB] rounded-3xl p-5 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DB]">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Care Wallet & Delivery Dispatch Pipeline
              </h3>
              <p className="text-xs text-stone-500">Autonomous MCP tooling orders dispatched on elder voice request</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Wallet Balance:</span>
              <span className="font-mono font-bold text-stone-900 tabular-nums bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                ₹{cashWallet.balanceInr.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {inventoryOrders.map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#E7E2DB] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100/70 border border-amber-200 flex items-center justify-center text-amber-800">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-serif font-bold text-sm text-stone-900 block">
                      {ord.itemName}
                    </span>
                    <span className="text-xs text-stone-500">
                      {ord.vendor} · ETA: <strong className="text-emerald-700">{ord.eta}</strong>
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-sm text-stone-900 block tabular-nums">
                    ₹{ord.amountInr}
                  </span>
                  <span className="text-[10px] font-mono text-stone-500">
                    {ord.trackingWaybill}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: In-Clinic Transcriber */}
      {activeSubTab === 'transcriber' && (
        <div className="bg-white border border-[#E7E2DB] rounded-3xl p-5 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DB]">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                In-Clinic Doctor Consultation Transcriber
              </h3>
              <p className="text-xs text-stone-500">
                Captures audio during doctor visits, translates Hinglish, and extracts FHIR R4 resources
              </p>
            </div>

            <button
              type="button"
              onClick={isTranscriberActive ? stopTranscriberMode : startTranscriberMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isTranscriberActive
                  ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                  : 'bg-cyan-700 hover:bg-cyan-800 text-white'
              }`}
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{isTranscriberActive ? 'Stop Recording' : 'Start Capture'}</span>
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2DB] min-h-[140px] text-xs text-stone-700 leading-relaxed font-mono">
            {transcriberTranscript || (
              <span className="text-stone-400 italic">
                Press "Start Capture" when Ramesh Ji is with Dr. Saxena to begin real-time speech-to-FHIR transcription...
              </span>
            )}
          </div>

          {transcriberTranscript && (
            <button
              type="button"
              onClick={() => syncTranscriberToEhr()}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer transition-all"
            >
              Sync to Health Locker & Extract Entities
            </button>
          )}
        </div>
      )}

      {/* Tab 6: Caregiver Settings */}
      {activeSubTab === 'settings' && (
        <div className="bg-white border border-[#E7E2DB] rounded-3xl p-5 shadow-xs space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DB]">
            <div>
              <h3 className="font-serif font-bold text-base text-stone-900">
                Caregiver Spending & Fiduciary Thresholds
              </h3>
              <p className="text-xs text-stone-500">
                Configured by Priya Sharma (Daughter). Enforced by Sambandh autonomous rail tripwires.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isEditingSettings) {
                  updateCaregiverConfig({ orderTotalLimitInr: tempLimit });
                  setIsEditingSettings(false);
                } else {
                  setIsEditingSettings(true);
                }
              }}
              className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
            >
              {isEditingSettings ? 'Save Limits' : 'Edit Limits'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2DB] space-y-2">
              <span className="font-bold text-stone-900 block">Single Order Auto-Approve Ceiling</span>
              {isEditingSettings ? (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">₹</span>
                  <input
                    type="number"
                    value={tempLimit}
                    onChange={(e) => setTempLimit(Number(e.target.value))}
                    className="p-1.5 border border-stone-300 rounded-lg font-mono text-sm w-32"
                  />
                </div>
              ) : (
                <span className="font-mono font-bold text-lg text-emerald-700 tabular-nums">
                  ₹{caregiverConfig.orderTotalLimitInr.toLocaleString('en-IN')}
                </span>
              )}
              <p className="text-stone-500 text-[11px]">
                Orders under this threshold execute autonomously. Higher amounts require 1-tap Telegram sign-off.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E7E2DB] space-y-2">
              <span className="font-bold text-stone-900 block">Monthly Care Spending Cap</span>
              <span className="font-mono font-bold text-lg text-stone-800 tabular-nums">
                ₹{profile.caregiver.monthlySpendingCapInr.toLocaleString('en-IN')}
              </span>
              <p className="text-stone-500 text-[11px]">
                Parental budget for medicine refills, lab tests, and groceries.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document / Doctor Slip Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E2DB]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-700">
                  <UploadCloud className="w-4 h-4" />
                </div>
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Ingest Clinical Document to Health Locker
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-stone-600 block">
                Load Sample Record:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePresetSelect('rx')}
                  className="p-2 rounded-xl text-[11px] font-bold border border-[#DFDAD1] bg-[#FAF8F5] hover:bg-teal-50 hover:border-teal-300 text-stone-800 text-left transition-all cursor-pointer"
                >
                  Dr. Saxena Slip (Oct '26)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('lab')}
                  className="p-2 rounded-xl text-[11px] font-bold border border-[#DFDAD1] bg-[#FAF8F5] hover:bg-teal-50 hover:border-teal-300 text-stone-800 text-left transition-all cursor-pointer"
                >
                  Renal Lab PDF
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetSelect('diet')}
                  className="p-2 rounded-xl text-[11px] font-bold border border-[#DFDAD1] bg-[#FAF8F5] hover:bg-teal-50 hover:border-teal-300 text-stone-800 text-left transition-all cursor-pointer"
                >
                  Diet Protocol Note
                </button>
              </div>
            </div>

            <form onSubmit={handleSimulateUpload} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Document Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Cardiology OPD Follow-Up"
                  required
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#DFDAD1] rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Doctor / Diagnostic Center</label>
                <input
                  type="text"
                  value={uploadDoctor}
                  onChange={(e) => setUploadDoctor(e.target.value)}
                  placeholder="e.g. Dr. P. N. Saxena"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#DFDAD1] rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Clinical Text / Prescription Slip Content</label>
                <textarea
                  rows={4}
                  value={uploadText}
                  onChange={(e) => setUploadText(e.target.value)}
                  placeholder="Doctor's notes, medications prescribed, dosage intervals, blood test findings..."
                  required
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#DFDAD1] rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              {uploadStatusMsg && (
                <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-medium animate-fadeIn">
                  {uploadStatusMsg}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-stone-600 hover:text-stone-900 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 disabled:opacity-50 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {isUploading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FileCheck className="w-3.5 h-3.5 text-teal-200" />
                  )}
                  <span>Run MedGemma Extraction</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
