import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { TelegramReceptor } from '../Column3Rails/TelegramReceptor';
import { Send, ShieldCheck, Heart, User, Clock, Bell, Sparkles, Plus, Trash2, CheckCircle2, MessageSquare } from 'lucide-react';

export const CaregiverTelegramView: React.FC = () => {
  const {
    activeScenario,
    caregiverConfig,
    elderTopics,
    addElderTopic,
    removeElderTopic,
    toggleElderTopic
  } = useTelemetry();
  const profile = activeScenario.initialSeniorProfile;

  const [newTopicText, setNewTopicText] = useState('');
  const [topicCategory, setTopicCategory] = useState<'RAILWAYS_CAREER' | 'LOCAL_NEWS' | 'MUSIC_CULTURE' | 'GARDENING_ROUTINE' | 'GENERAL'>('GENERAL');
  const [addedNotice, setAddedNotice] = useState(false);

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicText.trim()) return;

    addElderTopic({
      topic: newTopicText.trim(),
      category: topicCategory,
      source: 'CAREGIVER_CURATED',
      addedBy: 'Priya Sharma (Daughter)',
      enthusiasmLevel: 'HIGH',
      notes: 'Added via Priya\'s Caregiver Telegram portal for upcoming morning call.'
    });

    setNewTopicText('');
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 flex flex-col gap-5 py-6">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200/90 rounded-3xl p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-600 shadow-2xs">
            <Send className="w-6 h-6 stroke-[2.2] -rotate-12 translate-x-[-1px]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-stone-900">
                Priya Sharma's Caregiver Telegram Portal
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-sky-50 text-sky-800 border border-sky-200">
                @SambandhCareBot
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Zero noise, maximum peace of mind. Daily morning summaries, audio wisdom stories & 1-tap emergency/fiduciary actions.
            </p>
          </div>
        </div>

        {/* Daughter's Profile Pill */}
        <div className="flex items-center gap-3 bg-stone-50 p-2.5 rounded-2xl border border-stone-200/80">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-lg">
            👩‍💼
          </div>
          <div className="text-xs">
            <span className="font-extrabold text-stone-900 block">{profile.caregiver.name}</span>
            <span className="text-[11px] text-stone-500">Monthly Spending Cap: ₹{profile.caregiver.monthlySpendingCapInr.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Main Telegram Client Container */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 min-h-[580px] flex flex-col">
          <TelegramReceptor />
        </div>

        {/* Caregiver Guide Sidebar */}
        <div className="space-y-4">
          {/* Caregiver Routing & Order Limit Card */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                PRE-FED ROUTING & CEILINGS
              </span>
              <span className="text-[10px] text-stone-500 font-mono">Priya's Config</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="text-[10px] font-bold uppercase text-stone-500 block">Elder Drop Location</span>
                <span className="font-extrabold text-stone-900 block">{caregiverConfig.elderHomeAddress}</span>
                <span className="text-[10px] text-stone-500 font-mono">PIN: {caregiverConfig.elderPinCode}</span>
              </div>

              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="text-[10px] font-bold uppercase text-stone-500 block">Nearest Partner Pharmacy</span>
                <span className="font-extrabold text-stone-900 block">{caregiverConfig.nearestPharmacyName}</span>
                <span className="text-[11px] text-stone-600 block">{caregiverConfig.nearestPharmacyAddress}</span>
                <span className="text-[10px] text-emerald-700 block font-mono mt-0.5">{caregiverConfig.nearestPharmacyEmail}</span>
              </div>

              <div className="p-2.5 bg-amber-50/70 rounded-xl border border-amber-200">
                <span className="text-[10px] font-bold uppercase text-amber-800 block">Refill Order Limit</span>
                <span className="text-base font-black text-stone-900 block">
                  ₹{caregiverConfig.orderTotalLimitInr.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-stone-600 block">
                  Orders over this cap halt and trigger 1-tap Telegram approval.
                </span>
              </div>
            </div>
          </div>

          {/* Papa's Topics of Interest & Conversation Starters Hub */}
          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-bold text-indigo-900 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span>PAPA'S TOPICS & INTERESTS</span>
              </span>
              <span className="text-[10px] text-stone-500 font-mono">Curated + Discovered</span>
            </div>

            <p className="text-[11px] text-stone-600 leading-relaxed">
              Sambandh chats like a genuine companion. Below are topics discovered during calls or added by you for Sambandh to bring up.
            </p>

            {/* Topic List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {elderTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={`p-2.5 rounded-xl border transition-all text-xs flex items-start justify-between gap-2 ${
                    topic.isActive
                      ? 'bg-stone-50 border-stone-200'
                      : 'bg-stone-100/50 border-stone-200/60 opacity-50'
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-extrabold text-stone-900 truncate block">
                        {topic.topic}
                      </span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                        topic.source === 'CAREGIVER_CURATED'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}>
                        {topic.source === 'CAREGIVER_CURATED' ? 'By Priya' : 'Discovered'}
                      </span>
                    </div>
                    {topic.notes && (
                      <p className="text-[10px] text-stone-500 line-clamp-1">{topic.notes}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      onClick={() => toggleElderTopic(topic.id)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-colors cursor-pointer ${
                        topic.isActive
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-stone-200 text-stone-600 border-stone-300'
                      }`}
                      title={topic.isActive ? 'Active in upcoming calls' : 'Paused'}
                    >
                      {topic.isActive ? 'Active' : 'Paused'}
                    </button>
                    <button
                      onClick={() => removeElderTopic(topic.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                      title="Remove Topic"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Topic Input */}
            <form onSubmit={handleAddTopic} className="space-y-2 pt-2 border-t border-stone-100">
              <span className="text-[10px] font-extrabold text-stone-700 block uppercase">
                + Suggest a Topic for Sambandh to Chat About
              </span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newTopicText}
                  onChange={(e) => setNewTopicText(e.target.value)}
                  placeholder="e.g. Ask Papa about his 1980s workshop memories..."
                  className="flex-1 px-3 py-1.5 rounded-xl border border-stone-300 bg-white text-xs text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newTopicText.trim()}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
              {addedNotice && (
                <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 animate-fadeIn">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Topic added! Sambandh will bring this up naturally on Papa's next call.</span>
                </div>
              )}
            </form>
          </div>

          <div className="bg-white border border-stone-200/90 rounded-3xl p-5 shadow-xs space-y-3">
            <span className="text-xs font-bold text-sky-800 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200 inline-block">
              CAREGIVER CONCIERGE
            </span>
            <h3 className="font-black text-stone-900 text-sm">
              Why Telegram for Family Care?
            </h3>
            <ul className="text-xs text-stone-600 space-y-2 leading-relaxed list-disc list-inside">
              <li><strong>Zero Elder Friction:</strong> Papa speaks naturally over a regular phone call. All technology runs behind the scenes.</li>
              <li><strong>Intermediary Mentorship:</strong> Sambandh mediates wisdom exchanges safely without exposing the senior to unverified live caller lines.</li>
              <li><strong>Emotional Drift Alerts:</strong> If Papa feels low or lonely across 3+ consecutive calls, Priya receives an automatic proactive advisory to call him.</li>
              <li><strong>Care Wallet & Low Balance:</strong> Item orders (medicines, flowers, Amazon) auto-debit with alerts whenever the balance dips below ₹500.</li>
              <li><strong>Doctor Transcriptions:</strong> Ambient audio capture at the clinic syncs titrations directly into Papa's EHR dossier.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
