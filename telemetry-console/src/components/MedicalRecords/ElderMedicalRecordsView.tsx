import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  Activity,
  Heart,
  Pill,
  Clock,
  AlertCircle,
  CheckCircle2,
  Stethoscope,
  Mic,
  MicOff,
  ShoppingBag,
  Truck,
  Wallet,
  ArrowUpRight,
  Sparkles,
  Calendar,
  User,
  Plus,
  ChevronRight,
  FileText,
  Volume2,
  MapPin,
  Building,
  Mail,
  Edit3
} from 'lucide-react';
import { MedicalIssue, InventoryOrder } from '../../types/telemetry';

export const ElderMedicalRecordsView: React.FC = () => {
  const {
    activeScenario,
    medicalIssues,
    inventoryOrders,
    cashWallet,
    caregiverConfig,
    updateCaregiverConfig,
    updateCallFrequency,
    deductCashWallet,
    addInventoryOrder,
    startTranscriberMode,
    isTranscriberActive,
    transcriberTranscript,
    stopTranscriberMode,
    syncTranscriberToEhr,
    allTurnsSoFar
  } = useTelemetry();

  const profile = activeScenario.initialSeniorProfile;
  const clinical = activeScenario.initialClinicalState;

  // Local state for mock new order trigger
  const [selectedMcpService, setSelectedMcpService] = useState<'amazon' | 'pooja' | 'medicine'>('pooja');
  const [isOrdering, setIsOrdering] = useState(false);

  // Local state for editing Caregiver Config (Addresses, Partner Pharmacy & Limit)
  const [isEditingConfig, setIsEditingConfig] = useState(false);
  const [tempConfig, setTempConfig] = useState(caregiverConfig);

  const handleSaveConfig = () => {
    updateCaregiverConfig(tempConfig);
    setIsEditingConfig(false);
  };

  const handleQuickMcpOrder = () => {
    setIsOrdering(true);
    if (selectedMcpService === 'pooja') {
      const orderAmount = 210;
      deductCashWallet(orderAmount, 'Hyperlocal Pooja Flowers & Sandalwood Pack');
      addInventoryOrder({
        id: `ord-pooja-${Date.now()}`,
        itemName: 'Fresh Marigold Mala & Sandalwood Tilak',
        category: 'POOJA_FLOWERS',
        orderDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        units: 1,
        amountInr: orderAmount,
        vendor: 'Rohini Mandir Phool Bhandar (Quick Commerce)',
        status: 'ORDERED_NOT_RECEIVED',
        trackingWaybill: `QC-HYPER-${Date.now().toString().slice(-6)}`,
        eta: 'Today by 07:00 AM'
      });
    } else if (selectedMcpService === 'amazon') {
      const orderAmount = 1249;
      deductCashWallet(orderAmount, 'Amazon: Dr. Morepen Digital BP Monitor');
      addInventoryOrder({
        id: `ord-amazon-${Date.now()}`,
        itemName: 'Dr. Morepen Digital BP Monitor (Large LED)',
        category: 'AMAZON_GENERAL',
        orderDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        units: 1,
        amountInr: orderAmount,
        vendor: 'Amazon.in (Appario Retail)',
        status: 'ORDERED_NOT_RECEIVED',
        trackingWaybill: `AZ-IN-${Date.now().toString().slice(-7)}`,
        eta: 'Tomorrow by 2:00 PM'
      });
    } else {
      const orderAmount = 840;
      deductCashWallet(orderAmount, 'Apollo Pharmacy: Telmisartan 40mg + Metformin 500mg');
      addInventoryOrder({
        id: `ord-med-${Date.now()}`,
        itemName: 'Telmisartan 40mg (30 Tab) Strip Refill',
        category: 'MEDICATION',
        orderDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        units: 30,
        amountInr: orderAmount,
        vendor: 'Apollo Pharmacy DarkStore Sector 11',
        status: 'ORDERED_NOT_RECEIVED',
        trackingWaybill: `DLV-98234-DEL`,
        eta: 'Today by 4:00 PM'
      });
    }

    setTimeout(() => {
      setIsOrdering(false);
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner: Elder Identity, Fiduciary Envelope & Daily Check-in Cadence */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-3xl shadow-xs">
            👴
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-stone-900">
                {profile.name} — Clinical Health Dossier & Medication Stock
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                ABHA ID: 91-8273-1928-4491
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Live Health Records & Inventory Ledger · Referenced dynamically by Sambandh LLM during conversation
            </p>
          </div>
        </div>

        {/* Fiduciary Cash Envelope & Call Frequency Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* In-Memory Cash Wallet Pill */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
              cashWallet.balanceInr < cashWallet.lowBalanceThresholdInr
                ? 'bg-rose-100 text-rose-700 animate-pulse'
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Care Cash Balance
                </span>
                {cashWallet.balanceInr < cashWallet.lowBalanceThresholdInr && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500 text-white animate-bounce">
                    LOW ALERT
                  </span>
                )}
              </div>
              <div className="text-base font-black text-stone-900">
                ₹{cashWallet.balanceInr.toLocaleString('en-IN')}
                <span className="text-xs font-normal text-stone-500 ml-1">
                  (Cap: ₹{profile.caregiver.monthlySpendingCapInr.toLocaleString('en-IN')})
                </span>
              </div>
            </div>
          </div>

          {/* Call Frequency Selector */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                Call Schedule
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                {[1, 2, 3].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => updateCallFrequency(freq)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      cashWallet.callFrequencyPerDay === freq
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                    }`}
                  >
                    {freq}x / day
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Fed Logistics & Order Limit Configuration Card (Caregiver Settings) */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-stone-900">
                  Caregiver Pre-Fed Logistics & Fiduciary Configuration
                </h3>
                <span className="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                  Pre-Fed by Priya
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Determines API request payload for Netmeds pharmacy orders & Delhivery pickup/delivery locations
              </p>
            </div>
          </div>

          {!isEditingConfig ? (
            <button
              onClick={() => {
                setTempConfig(caregiverConfig);
                setIsEditingConfig(true);
              }}
              className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Routing & Limit</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditingConfig(false)}
                className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveConfig}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Save Pre-Fed Config</span>
              </button>
            </div>
          )}
        </div>

        {/* View / Edit Mode Form */}
        {!isEditingConfig ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* 1. Elder Home Address (Delhivery Drop) */}
            <div className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-1.5">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block flex items-center gap-1">
                <MapPin className="w-3 h-3 text-stone-500" /> Elder Doorstep (Delhivery Drop)
              </span>
              <p className="font-bold text-stone-900 leading-snug">{caregiverConfig.elderHomeAddress}</p>
              <span className="font-mono text-stone-500 text-[11px] block">PIN: {caregiverConfig.elderPinCode}</span>
            </div>

            {/* 2. Nearest Partner Pharmacy (Delhivery Pickup & Netmeds Order) */}
            <div className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/80 space-y-1.5">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block flex items-center gap-1">
                <Building className="w-3 h-3 text-emerald-600" /> Nearest Pharmacy (Netmeds Order & Pickup)
              </span>
              <p className="font-bold text-stone-900 leading-snug">{caregiverConfig.nearestPharmacyName}</p>
              <p className="text-stone-600 text-[11px]">{caregiverConfig.nearestPharmacyAddress} (PIN: {caregiverConfig.nearestPharmacyPinCode})</p>
              <span className="text-emerald-700 text-[11px] flex items-center gap-1">
                <Mail className="w-3 h-3" /> {caregiverConfig.nearestPharmacyEmail}
              </span>
            </div>

            {/* 3. Configurable Order Total Limit */}
            <div className="p-3.5 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-1.5">
              <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                <Wallet className="w-3 h-3 text-amber-600" /> Pre-Authorized Order Total Limit
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-black text-stone-900">
                  ₹{caregiverConfig.orderTotalLimitInr.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-500">per order ceiling</span>
              </div>
              <p className="text-[11px] text-stone-600 leading-snug">
                Orders beyond this limit halt autonomously and trigger Telegram step-up approval to Priya.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Edit 1: Elder Address */}
            <div className="space-y-2 p-3 rounded-2xl border border-stone-200 bg-stone-50">
              <label className="text-[11px] font-bold text-stone-700 block">Elder Home Address</label>
              <textarea
                value={tempConfig.elderHomeAddress}
                onChange={e => setTempConfig({ ...tempConfig, elderHomeAddress: e.target.value })}
                rows={2}
                className="w-full text-xs p-2 rounded-xl border border-stone-300 bg-white"
              />
              <div className="flex items-center gap-2">
                <label className="text-[10px] font-semibold text-stone-600">PIN Code:</label>
                <input
                  type="text"
                  value={tempConfig.elderPinCode}
                  onChange={e => setTempConfig({ ...tempConfig, elderPinCode: e.target.value })}
                  className="w-24 text-xs p-1 px-2 rounded-lg border border-stone-300 bg-white font-mono"
                />
              </div>
            </div>

            {/* Edit 2: Nearest Pharmacy Details */}
            <div className="space-y-2 p-3 rounded-2xl border border-stone-200 bg-stone-50">
              <label className="text-[11px] font-bold text-stone-700 block">Nearest Partner Pharmacy</label>
              <input
                type="text"
                value={tempConfig.nearestPharmacyName}
                onChange={e => setTempConfig({ ...tempConfig, nearestPharmacyName: e.target.value })}
                className="w-full text-xs p-1.5 px-2 rounded-lg border border-stone-300 bg-white"
                placeholder="Pharmacy / DarkStore Name"
              />
              <input
                type="text"
                value={tempConfig.nearestPharmacyAddress}
                onChange={e => setTempConfig({ ...tempConfig, nearestPharmacyAddress: e.target.value })}
                className="w-full text-xs p-1.5 px-2 rounded-lg border border-stone-300 bg-white"
                placeholder="Pharmacy Street Address"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={tempConfig.nearestPharmacyPinCode}
                  onChange={e => setTempConfig({ ...tempConfig, nearestPharmacyPinCode: e.target.value })}
                  className="w-full text-xs p-1 px-2 rounded-lg border border-stone-300 bg-white font-mono"
                  placeholder="PIN"
                />
                <input
                  type="email"
                  value={tempConfig.nearestPharmacyEmail}
                  onChange={e => setTempConfig({ ...tempConfig, nearestPharmacyEmail: e.target.value })}
                  className="w-full text-xs p-1 px-2 rounded-lg border border-stone-300 bg-white"
                  placeholder="Pharmacy Email"
                />
              </div>
            </div>

            {/* Edit 3: Order Total Limit */}
            <div className="space-y-2 p-3 rounded-2xl border border-amber-200 bg-amber-50/40">
              <label className="text-[11px] font-bold text-amber-900 block">Configurable Order Limit (₹)</label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 text-stone-500 font-bold text-xs">₹</span>
                <input
                  type="number"
                  value={tempConfig.orderTotalLimitInr}
                  onChange={e => setTempConfig({ ...tempConfig, orderTotalLimitInr: Number(e.target.value) })}
                  className="w-full text-sm font-bold pl-6 p-1.5 rounded-lg border border-stone-300 bg-white"
                  step={500}
                />
              </div>
              <p className="text-[10px] text-stone-500">
                Ceiling limit for automatic medicine refill dispatch without requesting Telegram step-up.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Chronic Issues (Left) + Medication Stock & Pending Orders (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (1/3): Active Medical Issues / EHR Chronic Diagnoses */}
        <div className="space-y-6">
          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Active Chronic Health Issues
                  </h3>
                  <p className="text-[11px] text-stone-500">Injected into LLM system prompt context</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-stone-100 text-stone-700">
                {medicalIssues.length} Conditions
              </span>
            </div>

            {/* List of Chronic Medical Conditions */}
            <div className="space-y-3">
              {medicalIssues.map((issue: MedicalIssue) => (
                <div
                  key={issue.id}
                  className="p-3.5 rounded-2xl border border-stone-200/80 bg-stone-50/60 hover:bg-stone-50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-stone-900">
                      {issue.condition}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      issue.severity === 'HIGH'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : issue.severity === 'CHRONIC'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    }`}>
                      {issue.severity}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {issue.notes}
                  </p>

                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                    <span className="flex items-center gap-1 font-medium">
                      <Stethoscope className="w-3 h-3 text-cyan-600" />
                      {issue.treatingDoctor}
                    </span>
                    <span>Diagnosed: {issue.diagnosedDate}</span>
                  </div>

                  {/* Active Symptoms Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {issue.activeSymptoms.map((symp, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-600 font-medium"
                      >
                        ● {symp}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Order Connector / MCP Trigger */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Generic MCP Tool Order
              </span>
              <span className="text-[11px] text-stone-500">Live API Node Test</span>
            </div>

            <h4 className="font-extrabold text-sm text-stone-900">
              Trigger Arbitrary Vendor Order
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed">
              Order items requested during voice calls. Automatically debits the Care Wallet and lists in "Ordered but not received".
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                onClick={() => setSelectedMcpService('pooja')}
                className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  selectedMcpService === 'pooja'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                🌸 Puja Flowers (₹210)
              </button>
              <button
                onClick={() => setSelectedMcpService('amazon')}
                className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  selectedMcpService === 'amazon'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                📦 Amazon BP (₹1,249)
              </button>
              <button
                onClick={() => setSelectedMcpService('medicine')}
                className={`p-2 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                  selectedMcpService === 'medicine'
                    ? 'bg-amber-500 text-white border-amber-600 shadow-2xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                💊 Dawa Refill (₹840)
              </button>
            </div>

            <button
              onClick={handleQuickMcpOrder}
              disabled={isOrdering}
              className="w-full mt-2 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-extrabold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
              <span>{isOrdering ? 'Placing Order...' : 'Dispatch MCP Order & Deduct Wallet'}</span>
            </button>
          </div>
        </div>

        {/* Right Columns (2/3): Live Medicine Stock + Pending Orders + Transcriber Mode */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Active Medicine Stock & Depletion Runway */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-600">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Cabinet Medicine Stock & Pill Runway
                  </h3>
                  <p className="text-[11px] text-stone-500">Autonomous refill triggers when runway drops below 5 days</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                ABDM Sync Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {clinical.activeMolecules.map((med) => {
                const isLow = med.runwayDays <= 5;
                return (
                  <div
                    key={med.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isLow
                        ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                        : 'bg-stone-50/80 border-stone-200/90 text-stone-900'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-extrabold text-sm">{med.brand} ({med.strength})</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isLow
                          ? 'bg-rose-500 text-white border-rose-600'
                          : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                      }`}>
                        {med.runwayDays} Days Runway
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 space-y-1">
                      <div className="flex justify-between">
                        <span>Vernacular Name:</span>
                        <strong className="text-stone-800">{med.vernacularTag}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Stock:</span>
                        <span className="font-mono font-bold text-stone-900">{med.currentUnits} tablets</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Daily Dose:</span>
                        <span>{med.cadence} ({med.dailyConsumption}/day)</span>
                      </div>
                    </div>

                    {/* Visual Runway Bar */}
                    <div className="mt-3">
                      <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isLow ? 'bg-rose-500' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${Math.min(100, (med.runwayDays / 30) * 100)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                        <span>0 days</span>
                        <span>Threshold: 5 days</span>
                        <span>30 days pack</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: PENDING ORDERS ("Ordered but not received") */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-stone-900">
                    Live Pending Orders (Ordered — Not Received)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Items dispatched via Delhivery / Quick Commerce / Amazon awaiting doorstep arrival
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300">
                {inventoryOrders.filter(o => o.status === 'ORDERED_NOT_RECEIVED').length} Pending Delivery
              </span>
            </div>

            {inventoryOrders.length === 0 ? (
              <div className="p-6 text-center text-stone-400 text-xs">
                No open orders in transit.
              </div>
            ) : (
              <div className="space-y-3">
                {inventoryOrders.map((order: InventoryOrder) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl border border-amber-200/90 bg-amber-50/40 flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shrink-0">
                        {order.category === 'POOJA_FLOWERS' ? '🌸' : order.category === 'AMAZON_GENERAL' ? '📦' : '💊'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-sm text-stone-900">
                            {order.itemName}
                          </span>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 border border-amber-300">
                            ORDERED — NOT RECEIVED
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Vendor: <strong>{order.vendor}</strong> · Expected: <strong className="text-emerald-700">{order.eta}</strong>
                        </p>
                        <span className="text-[11px] font-mono text-stone-500 block mt-0.5">
                          Waybill: {order.trackingWaybill} · Ordered: {order.orderDate}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-black text-sm text-stone-900 block">
                        ₹{order.amountInr.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 inline-block mt-0.5">
                        ✓ Wallet Paid
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: In-Clinic Transcriber Mode Console */}
          <div className="bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 text-white rounded-3xl p-5 shadow-lg space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-700 text-cyan-400 flex items-center justify-center text-xl">
                  🩺
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm text-white">
                      In-Clinic Transcriber Mode (Doctor Visit Capture)
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-900 text-cyan-300 border border-cyan-700">
                      ABDM FHIR R4
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">
                    Dual-speaker clinic audio recording & automatic extraction into medical records
                  </p>
                </div>
              </div>

              {/* Start / Stop Transcriber Toggle */}
              {!isTranscriberActive ? (
                <button
                  onClick={startTranscriberMode}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-stone-950 font-black text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Mic className="w-4 h-4 fill-current" />
                  <span>Start Doctor Consultation Capture</span>
                </button>
              ) : (
                <button
                  onClick={stopTranscriberMode}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer animate-pulse"
                >
                  <MicOff className="w-4 h-4 fill-current" />
                  <span>Stop & Extract Consultation</span>
                </button>
              )}
            </div>

            {/* Transcriber Audio Visualizer & Diarization Feed */}
            {isTranscriberActive ? (
              <div className="bg-stone-950/80 rounded-2xl p-4 border border-stone-800 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-cyan-400 font-mono">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                    <span>DIARIZATION ACTIVE: Apollo Clinic Rohini · Dr. Arvind Saxena</span>
                  </span>
                  <span>OPUS 48kHz HD</span>
                </div>

                {/* Animated Audio Waveform */}
                <div className="flex items-center gap-1.5 h-10 px-3 bg-stone-900 rounded-xl border border-stone-800">
                  {[45, 90, 60, 100, 75, 40, 85, 95, 50, 70, 80, 65, 90, 100, 55, 35].map((h, i) => (
                    <span
                      key={i}
                      className="w-1.5 rounded-full bg-cyan-400 animate-pulse flex-1"
                      style={{ height: `${h}%`, animationDuration: `${0.4 + (i % 6) * 0.15}s` }}
                    />
                  ))}
                </div>

                {/* Diarized Transcript Stream */}
                <div className="space-y-2 text-xs">
                  <div className="bg-stone-900 p-2.5 rounded-xl border border-cyan-900/60">
                    <strong className="text-cyan-400 block mb-0.5">👨‍⚕️ Dr. Arvind Saxena:</strong>
                    <span className="text-stone-200">
                      "Ramesh Ji, blood pressure 130/85 is much better than last month. We will reduce Amlodipine from 5mg to 2.5mg, and add Atorvastatin 10mg at night for cholesterol."
                    </span>
                  </div>
                  <div className="bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                    <strong className="text-amber-300 block mb-0.5">👴 Ramesh Chandra:</strong>
                    <span className="text-stone-200">
                      "Doctor saab, subah ghutne me halki jaddan rehti hai, kya walk jaana theek hai?"
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={syncTranscriberToEhr}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Extract Titrations & Sync to Medical Dossier</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-stone-950/60 rounded-2xl border border-stone-800 text-xs text-stone-400 flex items-center justify-between">
                <span>
                  Consultation audio capture is currently idle. When visiting Dr. Saxena, tap <strong>"Start Doctor Consultation Capture"</strong> to transcribe titrations and sync to Priya on Telegram.
                </span>
                <span className="text-lg ml-2">🎧</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
