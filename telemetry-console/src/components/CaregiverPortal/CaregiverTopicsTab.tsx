import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import { LOCAL_NEWS_AND_OPINIONS } from '../../data/conversationalSparks';
import {
  Sparkles,
  Plus,
  Trash2,
  Newspaper,
  Compass,
  MessageSquare
} from 'lucide-react';

export const CaregiverTopicsTab: React.FC = () => {
  const {
    seniorProfile,
    elderTopics,
    addElderTopic,
    removeElderTopic,
    toggleElderTopic
  } = useTelemetry();

  const [newTopicText, setNewTopicText] = useState('');
  const [newTopicCategory, setNewTopicCategory] = useState<
    'GENERAL' | 'RAILWAYS_CAREER' | 'MUSIC_CULTURE' | 'GARDENING_ROUTINE' | 'LOCAL_NEWS'
  >('GENERAL');

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicText.trim()) return;
    addElderTopic({
      topic: newTopicText.trim(),
      category: newTopicCategory,
      source: 'CAREGIVER_CURATED',
      addedBy: `${seniorProfile.caregiverName || 'Priya Sharma'} (${seniorProfile.caregiverRelationship || 'Daughter'})`,
      enthusiasmLevel: 'HIGH',
      notes: 'Added by caregiver via Caregiver App',
      isActive: true
    });
    setNewTopicText('');
  };

  const activeCount = elderTopics.filter(t => t.isActive).length;

  return (
    <div className="space-y-3 pt-0.5 pb-4">
      {/* 1. Add New Topic Box */}
      <form onSubmit={handleAddTopic} className="p-3 bg-white rounded-2xl border border-[#DFDAD1] space-y-2 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-xs font-serif font-bold text-stone-900">
              Add Topic or Papa's Hobby
            </span>
          </div>
          <span className="text-[9px] font-mono text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200">
            Curated by Priya
          </span>
        </div>

        <div className="space-y-1.5">
          <input
            type="text"
            value={newTopicText}
            onChange={e => setNewTopicText(e.target.value)}
            placeholder="e.g. Talat Mahmood Ghazals or Balcony Gardening"
            className="w-full text-xs font-medium bg-[#FAF8F5] border border-stone-200 rounded-xl px-2.5 py-2 text-stone-800 placeholder:text-stone-400 focus:bg-white focus:border-teal-700 outline-none"
          />

          <div className="flex gap-1.5">
            <select
              value={newTopicCategory}
              onChange={e => setNewTopicCategory(e.target.value as any)}
              className="flex-1 text-xs bg-[#FAF8F5] border border-stone-200 rounded-xl px-2 py-1.5 text-stone-800 focus:bg-white outline-none cursor-pointer"
            >
              <option value="GENERAL">General Interest</option>
              <option value="RAILWAYS_CAREER">Railways & Career</option>
              <option value="MUSIC_CULTURE">Music & Culture</option>
              <option value="GARDENING_ROUTINE">Gardening & Routine</option>
              <option value="LOCAL_NEWS">Local News & Transit</option>
            </select>

            <button
              type="submit"
              disabled={!newTopicText.trim()}
              className="px-3 py-1.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer disabled:opacity-40 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </form>

      {/* 2. Active Curated & Discovered Topics */}
      <div className="p-3 bg-white rounded-2xl border border-[#DFDAD1] space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
          <div>
            <span className="text-xs font-serif font-bold text-stone-900 block">
              Active Topics ({activeCount}/{elderTopics.length} Active)
            </span>
            <span className="text-[10px] text-stone-500 block">
              Toggled ON topics are woven into AI call check-ins
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {elderTopics.map(topic => (
            <div
              key={topic.id}
              className={`p-2.5 rounded-xl border transition-all space-y-1.5 ${
                topic.isActive
                  ? 'bg-[#FAF8F5] border-stone-200 shadow-2xs'
                  : 'bg-stone-100/60 border-stone-200/60 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-1.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                        topic.source === 'CAREGIVER_CURATED'
                          ? 'bg-teal-50 text-teal-800 border border-teal-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
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
                    <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-2 leading-relaxed">
                      {topic.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => toggleElderTopic(topic.id)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                      topic.isActive
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                    }`}
                  >
                    {topic.isActive ? 'Active' : 'Off'}
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

      {/* 3. Local News & Community Opinion Sparks */}
      <div className="p-3 bg-white rounded-2xl border border-[#DFDAD1] space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
          <div className="flex items-center gap-1.5">
            <Newspaper className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-xs font-serif font-bold text-stone-900">
              Local News & Sparks
            </span>
          </div>
          <span className="text-[9px] font-mono text-stone-400">Rohini & Rail</span>
        </div>

        <div className="space-y-2">
          {LOCAL_NEWS_AND_OPINIONS.map(news => (
            <div
              key={news.id}
              className="p-2.5 bg-indigo-50/40 border border-indigo-100 rounded-xl space-y-1"
            >
              <div className="flex items-center justify-between gap-1">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1 leading-tight">
                  <Compass className="w-3 h-3 text-indigo-600 shrink-0" />
                  <span className="truncate">{news.headline}</span>
                </span>
                <span className="text-[9px] font-mono text-indigo-700 bg-indigo-100/70 px-1 py-0.2 rounded shrink-0">
                  {news.locality}
                </span>
              </div>
              <p className="text-[10px] text-stone-700 bg-white/90 p-1.5 rounded-lg border border-indigo-100 font-serif italic leading-snug">
                "{news.agentOpinionPrompt}"
              </p>
              <span className="text-[9px] text-stone-400 block truncate">
                💡 Context: {news.elderContextHint}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
