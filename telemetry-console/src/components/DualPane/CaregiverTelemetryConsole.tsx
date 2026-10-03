import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { JudgeStepApiPane } from './JudgeStepApiPane';
import { ConversationToolTree } from '../ExecutionTree/ConversationToolTree';
import {
  ShieldCheck,
  GitBranch,
  Zap,
  User,
  Sparkles,
  Heart,
  Save,
  Plus,
  CheckCircle2,
  Trash2,
  Newspaper,
  Compass,
  Building,
  DollarSign
} from 'lucide-react';
import { LOCAL_NEWS_AND_OPINIONS } from '../../data/conversationalSparks';
import { DynamicElderProfile } from '../../services/promptBuilder';

export const CaregiverTelemetryConsole: React.FC = () => {
  const {
    seniorProfile,
    updateSeniorProfile,
    elderTopics,
    addElderTopic,
    removeElderTopic,
    toggleElderTopic,
    caregiverConfig,
    updateCaregiverConfig
  } = useTelemetry();

  // Primary Caregiver Deck Active Sub-Section
  const [activeSection, setActiveSection] = useState<'profile' | 'interests' | 'telemetry'>('profile');
  const [telemetrySubView, setTelemetrySubView] = useState<'api' | 'tree'>('api');

  // Form State for Elder Profile
  const [formData, setFormData] = useState<DynamicElderProfile>(seniorProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Topic Input State
  const [newTopicText, setNewTopicText] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState<'GENERAL' | 'RAILWAYS_CAREER' | 'MUSIC_CULTURE' | 'GARDENING_ROUTINE' | 'LOCAL_NEWS'>('GENERAL');

  // Sync formData when seniorProfile updates from backend
  useEffect(() => {
    setFormData(seniorProfile);
  }, [seniorProfile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSeniorProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicText.trim()) return;
    addElderTopic({
      topic: newTopicText.trim(),
      category: newTopicCategory,
      source: 'CAREGIVER_CURATED',
      addedBy: `${seniorProfile.caregiverName || 'Priya Sharma'} (${seniorProfile.caregiverRelationship || 'Daughter'})`,
      enthusiasmLevel: 'HIGH',
      notes: 'Added by caregiver via Caregiver Hub',
      isActive: true
    });
    setNewTopicText('');
  };

  return (
    <div className="flex-1 min-w-0 flex flex-col gap-3 h-full min-h-0 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin">
      {/* Top Header & Navigation Switcher */}
      <div className="flex items-center justify-between px-1 shrink-0 flex-wrap gap-2.5 bg-white border border-[#E7E2DB] p-3 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shadow-2xs">
            <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-base font-bold text-stone-900 tracking-tight">
                Priya's Caregiver Command Deck
              </h2>
              <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                PostgreSQL Live DB
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Primary Caregiver Dossier · Dynamic AI Memory Ledger · Live Fiduciary Telemetry
            </p>
          </div>
        </div>

        {/* 3-Section Navigation Pills */}
        <div className="flex items-center bg-[#EFECE6] p-1 rounded-xl border border-[#DFDAD1] text-xs shadow-2xs gap-1">
          <button
            type="button"
            onClick={() => setActiveSection('profile')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'profile'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-teal-700" />
            <span>Profile & Clinical Baseline</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('interests')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'interests'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Activities & Topics ({elderTopics.filter(t => t.isActive).length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection('telemetry')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeSection === 'telemetry'
                ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5 text-indigo-600" />
            <span>Live Rails & Causal DAG</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: ELDER PROFILE & MEDICAL DOSSIER EDITOR (PostgreSQL Backed) */}
      {activeSection === 'profile' && (
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-3">
          <div className="bg-white border border-[#E7E2DB] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <h3 className="font-serif text-sm font-bold text-stone-900">
                  Papa's Core Profile & Personal Lore (Dynamic AI Prompt Source)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                {saveSuccess && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 animate-fadeIn">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Saved to PostgreSQL!
                  </span>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-3.5 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving to Database...' : 'Save to PostgreSQL'}</span>
                </button>
              </div>
            </div>

            {/* Basic Identity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Elder Full Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Age & Gender</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={formData.age || 72}
                    onChange={e => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-20 text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
                    required
                  />
                  <input
                    type="text"
                    value={formData.gender || 'Male'}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="flex-1 text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Preferred Address Style</label>
                <input
                  type="text"
                  value={formData.preferredAddress || 'अंकल / जी'}
                  onChange={e => setFormData({ ...formData, preferredAddress: e.target.value })}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
                  placeholder="अंकल, जी, या बाबूजी"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">City / Locality</label>
                <input
                  type="text"
                  value={formData.city || 'Delhi'}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-[11px] font-bold text-stone-600 mb-1">Residential Address (For Deliveries)</label>
              <input
                type="text"
                value={formData.addressLine || ''}
                onChange={e => setFormData({ ...formData, addressLine: e.target.value })}
                className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
              />
            </div>

            {/* Vocation Lore (Key to empathetic, non-robotic conversation) */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                <span>Key Vocation, Career Pride & Nostalgia Lore</span>
                <span className="text-[10px] text-stone-400 font-normal">Weaved into spontaneous AI check-in conversations</span>
              </label>
              <textarea
                rows={2}
                value={formData.vocation || ''}
                onChange={e => setFormData({ ...formData, vocation: e.target.value })}
                className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none leading-relaxed"
                placeholder="e.g. Retired Chief Signal Inspector (Northern Railway, 41 years). Proud of mechanical relay safety record at Ghaziabad junction."
              />
            </div>

            {/* Personality Notes */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                <span>Personality, Humor & Conversation Style</span>
                <span className="text-[10px] text-stone-400 font-normal">Shapes AI conversational persona and tone</span>
              </label>
              <textarea
                rows={2}
                value={formData.personalityNotes || ''}
                onChange={e => setFormData({ ...formData, personalityNotes: e.target.value })}
                className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none leading-relaxed"
                placeholder="e.g. Dignified, lucent, nostalgic about railway lore and Talat Mahmood ghazals. Enjoys gentle banter about morning walkers."
              />
            </div>

            {/* Health Baseline */}
            <div>
              <label className="block text-[11px] font-bold text-stone-700 mb-1 flex items-center justify-between">
                <span>Clinical Health Baseline & Prescription Directives</span>
                <span className="text-[10px] text-stone-400 font-normal">Used by MedGemma RAG & subtle adherence reminders</span>
              </label>
              <textarea
                rows={2}
                value={formData.healthBaseline || ''}
                onChange={e => setFormData({ ...formData, healthBaseline: e.target.value })}
                className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none leading-relaxed"
                placeholder="e.g. Stage-1 Essential Hypertension (Telma 40 OD morning post breakfast), Bilateral Knee Osteoarthritis (morning stiffness), controlled Type 2 Diabetes."
              />
            </div>

            {/* Caregiver Relationship & Fiduciary Envelope */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 border-t border-stone-100">
              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Primary Caregiver</label>
                <input
                  type="text"
                  value={formData.caregiverName || 'Priya Sharma'}
                  onChange={e => setFormData({ ...formData, caregiverName: e.target.value })}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Relationship & Location</label>
                <input
                  type="text"
                  value={`${formData.caregiverRelationship || 'Daughter'} (Bengaluru)`}
                  onChange={e => setFormData({ ...formData, caregiverRelationship: e.target.value.split(' ')[0] })}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-600 mb-1">Consulting Physician</label>
                <input
                  type="text"
                  value={formData.doctorName || 'Dr. Arvind Saxena (Cardiology)'}
                  onChange={e => setFormData({ ...formData, doctorName: e.target.value })}
                  className="w-full text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:bg-white focus:border-teal-700 outline-none"
                />
              </div>
            </div>

            {/* Fiduciary Limits Config */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-700 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-amber-950 block">Pine Labs Pre-Authorized Monthly Care Envelope</span>
                  <span className="text-[10px] text-amber-800">Auto-settles Telma-40 refills & pharmacy orders under cap</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-700">₹</span>
                <input
                  type="number"
                  value={caregiverConfig.orderTotalLimitInr}
                  onChange={e => updateCaregiverConfig({ orderTotalLimitInr: Number(e.target.value) })}
                  className="w-24 text-xs font-bold bg-white border border-amber-300 rounded-lg px-2.5 py-1 text-stone-900 text-right outline-none"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* SECTION 2: ACTIVITIES, INTERESTS & OPINION SPARKS */}
      {activeSection === 'interests' && (
        <div className="flex flex-col gap-3">
          {/* Add New Topic Box */}
          <form onSubmit={handleAddTopic} className="bg-white border border-[#E7E2DB] rounded-2xl p-4 shadow-xs flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3 className="font-serif text-sm font-bold text-stone-900">
                  Add Conversation Topic or Papa's Favorite Hobby
                </h3>
              </div>
              <span className="text-[10px] font-mono text-stone-500">Curated by Priya</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newTopicText}
                onChange={e => setNewTopicText(e.target.value)}
                placeholder="e.g. Vintage Gramophone Records & Talat Mahmood or Balcony Gardening"
                className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-stone-900 focus:bg-white focus:border-teal-700 outline-none"
              />
              <select
                value={newTopicCategory}
                onChange={e => setNewTopicCategory(e.target.value as any)}
                className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2 text-stone-800 focus:bg-white outline-none cursor-pointer"
              >
                <option value="GENERAL">General Interest</option>
                <option value="RAILWAYS_CAREER">Railways & Career</option>
                <option value="MUSIC_CULTURE">Music & Culture</option>
                <option value="GARDENING_ROUTINE">Gardening & Routine</option>
                <option value="LOCAL_NEWS">Local News & Transit</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Topic</span>
              </button>
            </div>
          </form>

          {/* List of Active & Discovered Topics */}
          <div className="bg-white border border-[#E7E2DB] rounded-2xl p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-serif text-sm font-bold text-stone-900">
                Active Topics of Interest ({elderTopics.length} Total)
              </h3>
              <span className="text-[10px] font-medium text-stone-500">
                Toggled ON topics are dynamically woven into call prompts
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {elderTopics.map(topic => (
                <div
                  key={topic.id}
                  className={`p-3 rounded-xl border transition-all flex flex-col justify-between gap-2 ${
                    topic.isActive
                      ? 'bg-stone-50/80 border-stone-200 shadow-2xs'
                      : 'bg-stone-100/50 border-stone-200/60 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                          topic.source === 'CAREGIVER_CURATED'
                            ? 'bg-teal-100 text-teal-800 border border-teal-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {topic.source === 'CAREGIVER_CURATED' ? 'Curated by Priya' : 'AI Discovered'}
                        </span>
                        <span className="text-[9px] font-mono text-stone-400">
                          {topic.category}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-stone-900 leading-snug">
                        {topic.topic}
                      </h4>
                      {topic.notes && (
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">
                          {topic.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleElderTopic(topic.id)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ${
                          topic.isActive
                            ? 'bg-emerald-600 text-white shadow-2xs'
                            : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                        }`}
                      >
                        {topic.isActive ? 'Active' : 'Disabled'}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeElderTopic(topic.id)}
                        className="p-1 text-stone-400 hover:text-rose-600 rounded-md transition-colors cursor-pointer"
                        title="Remove topic"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Local News Opinion Sparks */}
          <div className="bg-white border border-[#E7E2DB] rounded-2xl p-4 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-indigo-600" />
                <h3 className="font-serif text-sm font-bold text-stone-900">
                  Local News & Community Opinion Sparks (Rohini & Northern Railway)
                </h3>
              </div>
              <span className="text-[10px] font-medium text-stone-500">
                Spontaneous conversation starters
              </span>
            </div>

            <div className="space-y-2">
              {LOCAL_NEWS_AND_OPINIONS.map(news => (
                <div key={news.id} className="p-3 bg-indigo-50/40 border border-indigo-100 rounded-xl flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-indigo-600" />
                      {news.headline}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-700 bg-indigo-100/70 px-1.5 py-0.5 rounded">
                      {news.locality}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-700 bg-white/80 p-2 rounded-lg border border-indigo-100 font-serif italic">
                    "{news.agentOpinionPrompt}"
                  </p>
                  <span className="text-[10px] text-stone-400">
                    💡 Context: {news.elderContextHint}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: LIVE RAILS & CAUSAL DAG TREE (Consolidated Technical Deck) */}
      {activeSection === 'telemetry' && (
        <div className="flex-1 min-h-0 flex flex-col gap-2.5">
          {/* Sub-View Switcher: Live Rail Payloads vs Causal DAG */}
          <div className="flex items-center justify-between bg-white border border-[#E7E2DB] p-2 rounded-xl shadow-2xs">
            <span className="text-xs font-bold text-stone-700 px-1">
              Select Inspector View:
            </span>
            <div className="flex items-center bg-[#EFECE6] p-1 rounded-lg border border-[#DFDAD1] text-xs">
              <button
                type="button"
                onClick={() => setTelemetrySubView('api')}
                className={`py-1 px-3 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  telemetrySubView === 'api'
                    ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-amber-600" />
                <span>Live Rail Payloads</span>
              </button>
              <button
                type="button"
                onClick={() => setTelemetrySubView('tree')}
                className={`py-1 px-3 rounded-md text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  telemetrySubView === 'tree'
                    ? 'bg-white text-stone-900 shadow-2xs border border-stone-200/80'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <GitBranch className="w-3.5 h-3.5 text-teal-600" />
                <span>Causal DAG Tree</span>
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            {telemetrySubView === 'api' ? (
              <JudgeStepApiPane />
            ) : (
              <div className="bg-white border border-[#E7E2DB] rounded-3xl p-4 h-[650px] overflow-hidden flex flex-col shadow-xs">
                <ConversationToolTree />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
