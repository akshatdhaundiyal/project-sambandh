import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { DynamicElderProfile } from '../../services/promptBuilder';
import {
  Heart,
  Save,
  CheckCircle2,
  User,
  Briefcase,
  Sparkles,
  DollarSign,
  Building
} from 'lucide-react';

export const CaregiverProfileTab: React.FC = () => {
  const { seniorProfile, updateSeniorProfile, caregiverConfig, updateCaregiverConfig } = useTelemetry();

  const [formData, setFormData] = useState<DynamicElderProfile>(seniorProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setFormData(seniorProfile);
  }, [seniorProfile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSeniorProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save elder profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-3 pt-0.5 pb-4">
      {/* Top Banner with 1-Click PostgreSQL Save Button */}
      <div className="p-3 rounded-2xl bg-white border border-[#DFDAD1] flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
            <User className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-serif font-bold text-stone-900 truncate">
              Papa's Core Dossier
            </h3>
            <span className="text-[10px] text-stone-500 block truncate">
              Live PostgreSQL AI Prompt Source
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {saveSuccess && (
            <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1 animate-fadeIn">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Saved!</span>
            </span>
          )}
          <button
            type="submit"
            disabled={isSaving}
            className="px-2.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3 h-3" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* 1. Basic Demographics & Preferred Dialect */}
      <div className="p-3 rounded-2xl bg-white border border-[#DFDAD1] space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
          <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-stone-600" />
            <span>Demographics & Address Style</span>
          </span>
          <span className="text-[9px] font-mono text-stone-400">ID: SENIOR_001</span>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Full Name</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="w-full text-xs font-medium bg-[#FAF8F5] border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Age</label>
              <input
                type="number"
                value={formData.age || 72}
                onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                className="w-full text-xs font-medium bg-[#FAF8F5] border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Gender</label>
              <input
                type="text"
                value={formData.gender || 'Male'}
                onChange={e => setFormData({ ...formData, gender: e.target.value })}
                className="w-full text-xs font-medium bg-[#FAF8F5] border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-600 mb-0.5 flex items-center justify-between">
              <span>Preferred Address (Respect Honorific)</span>
              <span className="text-[9px] text-teal-700 font-normal">Shapes AI Greeting</span>
            </label>
            <input
              type="text"
              value={formData.preferredAddress || 'अंकल / जी'}
              onChange={e => setFormData({ ...formData, preferredAddress: e.target.value })}
              className="w-full text-xs font-medium bg-[#FAF8F5] border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
              placeholder="e.g. अंकल / जी or बाबूजी"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-600 mb-0.5">City & Neighborhood</label>
            <input
              type="text"
              value={formData.city || 'Delhi'}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
              className="w-full text-xs font-medium bg-[#FAF8F5] border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Delivery Address (Delhivery CMU)</label>
            <input
              type="text"
              value={formData.addressLine || ''}
              onChange={e => setFormData({ ...formData, addressLine: e.target.value })}
              className="w-full text-xs font-medium bg-[#FAF8F5] border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
              placeholder="Flat 402, Block C, Pocket 2, Rohini Sector 8"
            />
          </div>
        </div>
      </div>

      {/* 2. Vocation Pride & Nostalgia Lore */}
      <div className="p-3 rounded-2xl bg-white border border-[#DFDAD1] space-y-2 shadow-2xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
          <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-amber-600" />
            <span>Vocation, Career Pride & Lore</span>
          </span>
          <span className="text-[9px] font-mono text-amber-700 bg-amber-50 px-1 py-0.2 rounded border border-amber-200">
            AI Nostalgia
          </span>
        </div>
        <p className="text-[10px] text-stone-500 leading-snug">
          Weaved into spontaneous AI check-in conversations to spark joy and reminiscing.
        </p>
        <textarea
          rows={3}
          value={formData.vocation || ''}
          onChange={e => setFormData({ ...formData, vocation: e.target.value })}
          className="w-full text-xs font-medium bg-[#FAF8F5] border border-stone-200 rounded-xl p-2 text-stone-800 focus:bg-white focus:border-teal-700 outline-none leading-relaxed resize-none"
          placeholder="e.g. Retired Chief Signal Inspector (Northern Railway, 41 years). Proud of mechanical relay safety record at Ghaziabad junction."
        />
      </div>

      {/* 3. Personality, Humor & Tone */}
      <div className="p-3 rounded-2xl bg-white border border-[#DFDAD1] space-y-2 shadow-2xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
          <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Personality & Conversational Style</span>
          </span>
          <span className="text-[9px] font-mono text-indigo-700 bg-indigo-50 px-1 py-0.2 rounded border border-indigo-200">
            Acoustic Tone
          </span>
        </div>
        <textarea
          rows={2}
          value={formData.personalityNotes || ''}
          onChange={e => setFormData({ ...formData, personalityNotes: e.target.value })}
          className="w-full text-xs font-medium bg-[#FAF8F5] border border-stone-200 rounded-xl p-2 text-stone-800 focus:bg-white focus:border-teal-700 outline-none leading-relaxed resize-none"
          placeholder="e.g. Dignified, lucent, nostalgic about railway lore and Talat Mahmood ghazals. Enjoys gentle banter about morning walkers."
        />
      </div>

      {/* 4. Clinical Baseline & Medical Directives */}
      <div className="p-3 rounded-2xl bg-white border border-[#DFDAD1] space-y-2 shadow-2xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
          <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-600" />
            <span>Clinical Health Baseline</span>
          </span>
          <span className="text-[9px] font-mono text-rose-700 bg-rose-50 px-1 py-0.2 rounded border border-rose-200">
            MedGemma RAG
          </span>
        </div>
        <p className="text-[10px] text-stone-500 leading-snug">
          Chronic conditions and doctor-prescribed directives used for adherence verification.
        </p>
        <textarea
          rows={3}
          value={formData.healthBaseline || ''}
          onChange={e => setFormData({ ...formData, healthBaseline: e.target.value })}
          className="w-full text-xs font-medium bg-[#FAF8F5] border border-stone-200 rounded-xl p-2 text-stone-800 focus:bg-white focus:border-teal-700 outline-none leading-relaxed resize-none"
          placeholder="e.g. Stage-1 Essential Hypertension (Telma 40 OD morning post breakfast), Bilateral Knee Osteoarthritis (morning stiffness), controlled Type 2 Diabetes."
        />
      </div>

      {/* 5. Caregiver & Doctor Circle */}
      <div className="p-3 rounded-2xl bg-white border border-[#DFDAD1] space-y-2.5 shadow-2xs">
        <span className="text-xs font-serif font-bold text-stone-900 flex items-center gap-1.5 border-b border-stone-100 pb-1.5">
          <Building className="w-3.5 h-3.5 text-stone-600" />
          <span>Care Circle & Physician Contacts</span>
        </span>

        <div className="space-y-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Primary Caregiver Name</label>
            <input
              type="text"
              value={formData.caregiverName || 'Priya Sharma'}
              onChange={e => setFormData({ ...formData, caregiverName: e.target.value })}
              className="w-full text-xs font-medium bg-[#FAF8F5] border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Relationship</label>
              <input
                type="text"
                value={formData.caregiverRelationship || 'Daughter'}
                onChange={e => setFormData({ ...formData, caregiverRelationship: e.target.value })}
                className="w-full text-xs font-medium bg-[#FAF8F5] border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Location</label>
              <input
                type="text"
                defaultValue="Bengaluru"
                disabled
                className="w-full text-xs font-medium bg-stone-100 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-600 mb-0.5">Consulting Physician</label>
            <input
              type="text"
              value={formData.doctorName || 'Dr. Arvind Saxena (Cardiology)'}
              onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
              className="w-full text-xs font-medium bg-[#FAF8F5] border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
            />
          </div>
        </div>
      </div>

      {/* 6. Pine Labs Monthly Envelope */}
      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2 min-w-0">
          <DollarSign className="w-4 h-4 text-amber-700 shrink-0" />
          <div className="min-w-0">
            <span className="text-xs font-bold text-amber-950 block truncate">
              Pine Labs Care Envelope
            </span>
            <span className="text-[10px] text-amber-800 block truncate">
              Auto-settles Telma-40 refills under cap
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <span className="text-xs font-bold text-stone-700">₹</span>
          <input
            type="number"
            value={caregiverConfig.orderTotalLimitInr}
            onChange={e => updateCaregiverConfig({ orderTotalLimitInr: Number(e.target.value) })}
            className="w-20 text-xs font-bold bg-white border border-amber-300 rounded-xl px-2 py-1 text-stone-900 text-right outline-none"
          />
        </div>
      </div>

      {/* Bottom Sticky Save Action */}
      <button
        type="submit"
        disabled={isSaving}
        className="w-full py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
      >
        <Save className="w-3.5 h-3.5" />
        <span>{isSaving ? 'Saving to Database...' : 'Save Profile to PostgreSQL'}</span>
      </button>
    </form>
  );
};
