import React, { useState, useEffect } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  YOUTH_PERSONAS,
  YOUTH_QUESTION_PRESETS,
  INITIAL_ANSWERED_WISDOM_FEED
} from '../../data/youthPresets';
import { YouthPersona, YouthQuestionPreset, MentorshipExchangeItem } from '../../types/telemetry';
import {
  GraduationCap,
  ShieldCheck,
  ShieldAlert,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  Volume2,
  Lock,
  Send,
  Sparkles,
  Award,
  Train,
  Clock,
  UserCheck,
  UserX,
  FileText,
  CornerDownRight,
  Radio,
  ChevronRight,
  RefreshCw,
  MessageSquareQuote
} from 'lucide-react';

export const YouthWisdomPortal: React.FC = () => {
  const {
    activeMentorshipQuestion,
    mentorshipHistory,
    submitYouthQuestion,
    simulateElderAnswerVoice,
    activeTtsEngine
  } = useTelemetry();

  // Mobile layout switcher
  const [mobileSubTab, setMobileSubTab] = useState<'profile' | 'studio'>('studio');

  // Selected Youth Persona & Preset
  const [selectedYouth, setSelectedYouth] = useState<YouthPersona>(YOUTH_PERSONAS[0]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(YOUTH_QUESTION_PRESETS[0].id);
  const [customQuestionText, setCustomQuestionText] = useState<string>(YOUTH_QUESTION_PRESETS[0].questionText);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Audio Playback State for Spoken Answers
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // When preset changes, update text and suggested youth
  const handleSelectPreset = (preset: YouthQuestionPreset) => {
    setSelectedPresetId(preset.id);
    setIsCustomMode(false);
    setCustomQuestionText(preset.questionText);
    const matchedYouth = YOUTH_PERSONAS.find(p => p.id === preset.suggestedYouthId);
    if (matchedYouth) {
      setSelectedYouth(matchedYouth);
    }
  };

  const handleSelectCustom = () => {
    setIsCustomMode(true);
    setSelectedPresetId('custom');
    setCustomQuestionText('');
  };

  const currentPreset = YOUTH_QUESTION_PRESETS.find(p => p.id === selectedPresetId);

  // Handle Send for Review
  const handleSendForReview = async () => {
    if (!customQuestionText.trim() || isSubmitting) return;
    setIsSubmitting(true);

    const category = currentPreset?.category || (
      customQuestionText.toLowerCase().includes('₹') ||
      customQuestionText.toLowerCase().includes('gpay') ||
      customQuestionText.toLowerCase().includes('otp') ||
      customQuestionText.toLowerCase().includes('alone')
        ? 'MALICIOUS'
        : 'GENUINE'
    );

    const domainTopic = currentPreset?.domainTopic || 'Engineering & Public Service Mentorship';

    try {
      await submitYouthQuestion(
        selectedYouth,
        customQuestionText.trim(),
        category,
        domainTopic,
        currentPreset ? {
          curatedSpeechHindi: currentPreset.curatedSpeechHindi,
          mockElderAnswer: currentPreset.mockElderAnswer
        } : undefined
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Audio Playback simulation using speech synthesis or audio element
  const togglePlayAudio = (id: string, textToSpeak?: string) => {
    if (playingAudioId === id) {
      window.speechSynthesis?.cancel();
      setPlayingAudioId(null);
      return;
    }

    window.speechSynthesis?.cancel();
    setPlayingAudioId(id);

    if (textToSpeak && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'hi-IN';
      utterance.rate = 0.92;
      utterance.pitch = 0.95;
      utterance.onend = () => setPlayingAudioId(null);
      utterance.onerror = () => setPlayingAudioId(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        setPlayingAudioId(null);
      }, 7000);
    }
  };

  // Stop speech when unmounting
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  // Combine initial feed + dynamic history for display in profile
  const allAnsweredItems = [
    ...(activeMentorshipQuestion && activeMentorshipQuestion.status === 'ANSWERED' ? [activeMentorshipQuestion] : []),
    ...mentorshipHistory.filter(h => h.status === 'ANSWERED' && h.id !== activeMentorshipQuestion?.id),
    ...INITIAL_ANSWERED_WISDOM_FEED
  ];

  return (
    <div className="flex-1 p-2 sm:p-4 max-w-[1920px] w-full mx-auto flex flex-col h-full min-h-0 overflow-hidden">
      {/* Top Banner: Product Flow 5 & DPDP Anonymization Notice */}
      <div className="bg-gradient-to-r from-indigo-900 via-stone-900 to-amber-950 text-white rounded-2xl px-4 py-2.5 mb-3 flex flex-wrap items-center justify-between gap-3 shadow-sm border border-stone-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center border border-indigo-400/30 shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm tracking-tight text-white">
                Flow 5: Elder Wisdom for Young People
              </span>
              <span className="text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40">
                Intergenerational Mentorship Bridge
              </span>
            </div>
            <p className="text-[11px] text-stone-300 hidden sm:block">
              Connecting young engineers with retired veteran master craftsmen while enforcing DPDP privacy hashing and zero-trust safety gates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/80 text-emerald-300 rounded-lg border border-emerald-500/30 text-[11px]">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>DPDP 2023 Identity Anonymization Active</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 bg-stone-800/80 text-stone-300 rounded-lg border border-stone-700 text-[11px]">
            <ShieldCheck className="w-3 h-3 text-indigo-400" />
            <span>Gemini 1.5 Flash Safety Gate</span>
          </span>
        </div>
      </div>

      {/* Mobile Sub-View Toggle (< lg) */}
      <div className="lg:hidden flex items-center bg-[#EFECE6] p-1 rounded-2xl border border-[#DFDAD1] shadow-2xs mb-2 shrink-0">
        <button
          type="button"
          onClick={() => setMobileSubTab('studio')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileSubTab === 'studio'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5 text-indigo-700" />
          <span>Youth Mentorship Studio</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileSubTab('profile')}
          className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            mobileSubTab === 'profile'
              ? 'bg-white text-stone-900 shadow-xs border border-stone-200'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Lock className="w-3.5 h-3.5 text-amber-700" />
          <span>Anonymized Elder Profile</span>
        </button>
      </div>

      {/* Main Split Grid */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 h-full min-h-0 overflow-hidden">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: ANONYMIZED ELDER PROFILE PHONE CHASSIS (Fixed Width)        */}
        {/* ========================================================================= */}
        <div
          className={`w-full lg:w-[410px] xl:w-[430px] shrink-0 self-start lg:sticky lg:top-0 flex items-start justify-center overflow-visible z-10 ${
            mobileSubTab === 'profile' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* iPhone 16 Style Chassis */}
          <div className="w-full max-w-[400px] h-[750px] sm:h-[790px] max-h-[calc(100vh-6.5rem)] bg-stone-900 rounded-[44px] p-2.5 sm:p-3 shadow-2xl ring-1 ring-stone-800 relative flex flex-col shrink-0 select-none">
            {/* Dynamic Island Pill */}
            <div className="absolute top-4 sm:top-5 left-1/2 -translate-x-1/2 w-32 h-5 sm:h-6 bg-black rounded-full z-50 flex items-center justify-between px-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold tabular-nums">
                DPDP MASKED
              </span>
              <span className="w-2 h-2 rounded-full bg-stone-700"></span>
            </div>

            {/* Screen Bezel Content */}
            <div className="w-full h-full bg-[#FAF8F5] rounded-[34px] sm:rounded-[38px] overflow-hidden flex flex-col relative text-stone-900 border border-stone-200">
              {/* iOS Status Bar */}
              <div className="pt-3 px-6 pb-2 flex items-center justify-between text-xs font-semibold text-stone-800 shrink-0">
                <span className="text-[11px] font-bold">08:30</span>
                <div className="flex items-center gap-1.5 text-[10px]">
                  <span>5G</span>
                  <div className="w-4 h-2.5 border border-stone-800 rounded-sm p-0.5 flex items-center">
                    <div className="w-full h-full bg-stone-800 rounded-xs"></div>
                  </div>
                </div>
              </div>

              {/* Chassis Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3.5 scrollbar-thin">
                {/* DPDP Identity Privacy Banner */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-amber-900">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-900">
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      DPDP Hashed Senior Profile
                    </span>
                    <span className="font-mono text-[10px] bg-amber-100/90 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300 font-bold">
                      #DL-88192-PRIV
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-800 mt-1 leading-snug">
                    Raw name, residential address (Rohini Sector 8), and telephone numbers are securely hashed to prevent external targeting or social engineering.
                  </p>
                </div>

                {/* Profile Avatar & Title */}
                <div className="bg-white rounded-2xl p-4 border border-[#E7E2DB] shadow-xs text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-100 via-amber-50 to-transparent -mr-6 -mt-6 rounded-full opacity-60"></div>
                  
                  <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-stone-800 to-indigo-950 text-white flex items-center justify-center mx-auto shadow-md border-2 border-white text-2xl font-bold font-serif mb-2 relative">
                    <span>RC</span>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white">
                      ✓
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <h3 className="font-serif font-bold text-base text-stone-900">
                        R**** C******
                      </h3>
                      <span className="text-[10px] font-mono bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded font-medium">
                        72 / M
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-indigo-900">
                      Chief Signal Inspector (Retd.)
                    </p>
                    <p className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
                      <Train className="w-3 h-3 text-stone-400" />
                      Northern Railway (Delhi Division, Zone 8)
                    </p>
                  </div>

                  {/* Badges of Service */}
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-stone-100 text-left">
                    <div className="bg-stone-50 rounded-xl p-2 border border-stone-200/60">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-stone-600">
                        <Clock className="w-3 h-3 text-indigo-600" />
                        EXPERIENCE
                      </div>
                      <span className="text-xs font-bold text-stone-900 block mt-0.5">
                        41 Years Active
                      </span>
                      <span className="text-[9px] text-stone-500">Retired 2012</span>
                    </div>

                    <div className="bg-stone-50 rounded-xl p-2 border border-stone-200/60">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-stone-600">
                        <Award className="w-3 h-3 text-amber-600" />
                        SAFETY RECORD
                      </div>
                      <span className="text-xs font-bold text-stone-900 block mt-0.5">
                        Zero-Accident
                      </span>
                      <span className="text-[9px] text-stone-500">Ghaziabad Yard Citation</span>
                    </div>
                  </div>
                </div>

                {/* Core Domains of Wisdom */}
                <div className="bg-white rounded-2xl p-3.5 border border-[#E7E2DB] shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold font-serif text-stone-900">
                      Domains of Mentorship
                    </span>
                    <span className="text-[9px] font-mono text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">
                      Open to Youth
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Mechanical Interlocking',
                      'Signal Relay Circuits',
                      'Night Fog Protocols',
                      'Workshop Team Trust',
                      'Public Service Ethics',
                      'Crisis Calmness'
                    ].map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] bg-stone-100 text-stone-700 px-2 py-0.8 rounded-lg font-medium border border-stone-200/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-[10px] text-stone-500 pt-1 border-t border-stone-100 leading-relaxed italic">
                    "41 years keeping trains moving safely through North India's busiest junctions. Mentoring young electrical and mechanical engineers on safety protocols and calm under crisis."
                  </p>
                </div>

                {/* Completed Wisdom Feed (Past Answered Inquiries) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold font-serif text-stone-900">
                      Past Answered Wisdom ({allAnsweredItems.length})
                    </span>
                    <span className="text-[9px] text-stone-500 font-mono">
                      Spoken Audio Verified
                    </span>
                  </div>

                  {allAnsweredItems.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className="bg-white rounded-2xl p-3 border border-[#E7E2DB] shadow-xs space-y-2"
                    >
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-stone-800 flex items-center gap-1">
                          <span>{item.youthAvatar || '👨‍🎓'}</span>
                          <span>{item.youthName}</span>
                        </span>
                        <span className="text-stone-400 font-mono text-[9px]">
                          {item.answeredAt || 'Completed'}
                        </span>
                      </div>

                      <p className="text-[11px] font-medium text-stone-700 bg-stone-50 p-2 rounded-xl border border-stone-200/60 leading-snug">
                        "{item.questionText}"
                      </p>

                      {/* Ramesh's Answer + Spoken Audio Button */}
                      {item.elderAnswerText && (
                        <div className="bg-amber-50/70 rounded-xl p-2 border border-amber-200/70 space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] text-amber-900 font-semibold">
                            <span className="flex items-center gap-1">
                              <MessageSquareQuote className="w-3 h-3 text-amber-700" />
                              Ramesh Chandra's Spoken Advice:
                            </span>
                            <button
                              type="button"
                              onClick={() => togglePlayAudio(item.id, item.elderAnswerText)}
                              className="flex items-center gap-1 px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded-full font-bold text-[9px] transition-colors cursor-pointer"
                            >
                              {playingAudioId === item.id ? (
                                <>
                                  <Pause className="w-2.5 h-2.5" />
                                  <span>Pause</span>
                                </>
                              ) : (
                                <>
                                  <Play className="w-2.5 h-2.5 fill-current" />
                                  <span>Play Voice</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-[10px] text-stone-800 leading-relaxed font-sans">
                            {item.elderAnswerText}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: INTERACTIVE YOUTH MENTORSHIP STUDIO & GEMINI SAFETY GATE   */}
        {/* ========================================================================= */}
        <section
          className={`flex-1 min-w-0 flex-col gap-3.5 h-full min-h-0 overflow-y-auto pr-1 sm:pr-2 scrollbar-thin ${
            mobileSubTab === 'studio' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Header Bar */}
          <div className="flex items-baseline justify-between px-1 shrink-0">
            <div>
              <h2 className="font-serif text-lg font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <span>Interactive Youth Mentorship Studio</span>
                <span className="text-xs font-normal font-sans text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                  Step 1 → Select Youth & Question
                </span>
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Test both genuine engineering questions and predatory malicious questions against the Gemini 1.5 Flash Safety Gate.
              </p>
            </div>
            <span className="text-xs text-stone-400 font-mono hidden sm:inline">
              L3 Autonomous Protection
            </span>
          </div>

          {/* STEP 1: Youth Persona Selector */}
          <div className="bg-white rounded-2xl p-4 border border-[#E7E2DB] shadow-xs space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-serif text-stone-900 uppercase tracking-wider text-[11px] text-stone-500">
                1. Select Youth Inquirer Persona
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                Simulating Youth Identity & Trust Metadata
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {YOUTH_PERSONAS.map(persona => {
                const isSelected = selectedYouth.id === persona.id;
                return (
                  <div
                    key={persona.id}
                    onClick={() => setSelectedYouth(persona)}
                    className={`p-3 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-3 relative ${
                      isSelected
                        ? persona.isVerified
                          ? 'bg-indigo-50/60 border-indigo-600 shadow-xs'
                          : 'bg-rose-50/60 border-rose-600 shadow-xs'
                        : 'bg-stone-50/70 border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="text-2xl p-1 bg-white rounded-xl border border-stone-200 shadow-2xs shrink-0">
                      {persona.avatar}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-xs text-stone-900 truncate">
                          {persona.name}
                        </span>
                        {persona.isVerified ? (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded-full border border-emerald-300 shrink-0">
                            <UserCheck className="w-2.5 h-2.5" />
                            Verified DTU
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-rose-700 bg-rose-100/90 px-1.5 py-0.5 rounded-full border border-rose-300 shrink-0">
                            <UserX className="w-2.5 h-2.5" />
                            Unverified Profile
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-stone-600 font-medium truncate mt-0.5">
                        {persona.education}
                      </p>
                      <p className="text-[10px] text-stone-500 truncate">
                        {persona.institution}
                      </p>

                      <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-stone-200/60 text-[10px]">
                        <span className="text-stone-500 font-medium">Trust Score:</span>
                        <span className={`font-mono font-bold ${persona.trustScore > 70 ? 'text-emerald-700' : 'text-rose-700'}`}>
                          {persona.trustScore}/100
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: Question Selector (Presets divided into Genuine vs Malicious) */}
          <div className="bg-white rounded-2xl p-4 border border-[#E7E2DB] shadow-xs space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold font-serif text-stone-900 uppercase tracking-wider text-[11px] text-stone-500">
                2. Choose or Type Question for Senior
              </span>
              <button
                type="button"
                onClick={handleSelectCustom}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  isCustomMode
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                }`}
              >
                ✏️ Custom Question
              </button>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Left Column: Genuine Questions */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Genuine Vocational Questions (Safe)</span>
                </div>

                {YOUTH_QUESTION_PRESETS.filter(p => p.category === 'GENUINE').map(preset => {
                  const isSelected = selectedPresetId === preset.id && !isCustomMode;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-emerald-50/80 border-emerald-600 shadow-2xs'
                          : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">
                          {preset.title}
                        </span>
                        <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                          BENIGN
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 line-clamp-2 mt-1 leading-snug">
                        "{preset.questionText}"
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Malicious Trap Questions */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Malicious & Predatory Exploitations (Trap)</span>
                </div>

                {YOUTH_QUESTION_PRESETS.filter(p => p.category === 'MALICIOUS').map(preset => {
                  const isSelected = selectedPresetId === preset.id && !isCustomMode;
                  return (
                    <div
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-rose-50/80 border-rose-600 shadow-2xs'
                          : 'bg-stone-50 hover:bg-stone-100/80 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-900">
                          {preset.title}
                        </span>
                        <span className="text-[9px] font-mono bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded font-bold">
                          TRAP
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 line-clamp-2 mt-1 leading-snug">
                        "{preset.questionText}"
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Editable Question Box & Send Action */}
            <div className="pt-2 border-t border-stone-200/80 space-y-2">
              <label className="block text-xs font-semibold text-stone-700">
                Inquirer Question Payload:
              </label>
              <textarea
                value={customQuestionText}
                onChange={e => {
                  setCustomQuestionText(e.target.value);
                  setIsCustomMode(true);
                  setSelectedPresetId('custom');
                }}
                rows={3}
                placeholder="Type any engineering question or exploit test to evaluate against the safety gate..."
                className="w-full text-xs font-medium p-3 rounded-xl border border-stone-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 bg-stone-50/50 resize-none font-sans"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-1">
                <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-stone-400" />
                  <span>
                    Simulating inquiry from: <strong>{selectedYouth.name}</strong> ({selectedYouth.isVerified ? 'Verified DTU' : 'Unverified IP'})
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleSendForReview}
                  disabled={!customQuestionText.trim() || isSubmitting}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-stone-900 to-indigo-950 hover:from-black hover:to-indigo-900 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Sending to Review Gate...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Question for Review</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* STEP 3: GEMINI SAFETY REVIEW GATE & VERDICT CARD */}
          {activeMentorshipQuestion && (
            <div className="space-y-3.5">
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold font-serif text-stone-900 uppercase tracking-wider text-[11px] text-stone-500">
                  3. Gemini 1.5 Flash Safety Gate Telemetry
                </span>
                <span className="text-[10px] font-mono text-stone-400">
                  Reviewed At: {activeMentorshipQuestion.reviewedAt || 'Evaluating...'}
                </span>
              </div>

              {/* Evaluation State Card */}
              {activeMentorshipQuestion.status === 'PENDING_REVIEW' && (
                <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 shadow-xs flex items-center gap-4 animate-pulse">
                  <div className="w-10 h-10 rounded-2xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-amber-900">
                      Sent for Safety Review. Evaluating via Gemini Safety Rail...
                    </h4>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Checking for PII extraction, monetary/UPI solicitation, home vulnerability probing, and emotional blackmail vectors.
                    </p>
                  </div>
                </div>
              )}

              {/* APPROVED / ACCEPTED FLOW */}
              {activeMentorshipQuestion.status === 'APPROVED' && (
                <div className="bg-white border-2 border-emerald-500 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full -mr-10 -mt-10 opacity-40"></div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-emerald-950">
                            VERDICT: SAFE & APPROVED
                          </h4>
                          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                            Confidence: {Math.round((activeMentorshipQuestion.safetyConfidence || 0.98) * 100)}%
                          </span>
                        </div>
                        <p className="text-[11px] text-emerald-800">
                          Category: <strong>{activeMentorshipQuestion.safetyCategory}</strong> · Dignity Preserving
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-stone-100 text-stone-700 px-2 py-1 rounded-lg border border-stone-200">
                        PII Risk: <strong>0.01</strong>
                      </span>
                      <span className="text-[10px] font-mono bg-stone-100 text-stone-700 px-2 py-1 rounded-lg border border-stone-200">
                        Financial Threat: <strong>0.00</strong>
                      </span>
                    </div>
                  </div>

                  {/* Safety Explanation */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-stone-700 block">
                      Safety Rationale:
                    </span>
                    <p className="text-xs text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200/80 leading-relaxed font-sans">
                      {activeMentorshipQuestion.safetyExplanation}
                    </p>
                  </div>

                  {/* Curated Voice Prompt for Sambandh */}
                  {activeMentorshipQuestion.curatedSpeechHindi && (
                    <div className="bg-indigo-50/70 border border-indigo-200 rounded-xl p-3 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Curated Voice Question for Morning Companion Call:</span>
                      </div>
                      <p className="text-xs font-serif text-indigo-950 italic">
                        "{activeMentorshipQuestion.curatedSpeechHindi}"
                      </p>
                    </div>
                  )}

                  {/* Call Queue Status & Voice Answer Trigger */}
                  <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Radio className="w-4 h-4 text-emerald-600 animate-pulse shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-emerald-950 block">
                          Queued for Morning Companion Call (08:30 AM)
                        </span>
                        <span className="text-[10px] text-emerald-800">
                          Sambandh AI will voice this to Ramesh Uncle in Awadhi/Hindi during breakfast check-in.
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => simulateElderAnswerVoice(activeMentorshipQuestion.id)}
                      className="flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Simulate Elder Spoken Response</span>
                    </button>
                  </div>
                </div>
              )}

              {/* REJECTED / BLOCKED FLOW */}
              {activeMentorshipQuestion.status === 'BLOCKED' && (
                <div className="bg-white border-2 border-rose-500 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100 rounded-full -mr-10 -mt-10 opacity-40"></div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-rose-950">
                            VERDICT: HIGH-RISK THREAT BLOCKED
                          </h4>
                          <span className="text-[10px] font-mono font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full border border-rose-300">
                            Confidence: {Math.round((activeMentorshipQuestion.safetyConfidence || 0.99) * 100)}%
                          </span>
                        </div>
                        <p className="text-[11px] text-rose-800">
                          Violation Category: <strong>{activeMentorshipQuestion.safetyCategory}</strong>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono bg-rose-100 text-rose-900 px-2 py-1 rounded-lg border border-rose-200 font-bold">
                        Threat Level: CRITICAL
                      </span>
                    </div>
                  </div>

                  {/* Safety Explanation */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-rose-900 block">
                      Block Rationale:
                    </span>
                    <p className="text-xs text-rose-900 bg-rose-50 p-2.5 rounded-xl border border-rose-200/80 leading-relaxed font-sans">
                      {activeMentorshipQuestion.safetyExplanation}
                    </p>
                  </div>

                  {/* Threat Containment Proof */}
                  <div className="bg-stone-900 text-stone-200 rounded-xl p-3 text-xs space-y-1.5 font-mono">
                    <div className="flex items-center justify-between text-stone-400 text-[10px]">
                      <span>🛡️ TELEMETRY CONTAINMENT LOG</span>
                      <span>INTERCEPT: ACTIVE</span>
                    </div>
                    <p className="text-[11px] text-stone-300">
                      • Question payload dropped at gateway boundary.
                      <br />
                      • Zero telephony relay: Senior citizen's telephone will <strong>NOT</strong> receive this inquiry.
                      <br />
                      • Security incident logged and silent notification dispatched to Caregiver Priya on Telegram.
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 4: ANSWERED VOICE PLAYBACK & TELEGRAM LOOP (When simulated or answered) */}
              {activeMentorshipQuestion.status === 'ANSWERED' && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                        RC
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif font-bold text-sm text-amber-950">
                            Ramesh Chandra's Authentic Spoken Answer
                          </h4>
                          <span className="text-[10px] font-mono font-bold bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                            Recorded in Morning Companion Call
                          </span>
                        </div>
                        <p className="text-[11px] text-amber-800">
                          Transcribed via Gnani Hindi/Awadhi ASR · Audio snippet generated
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => togglePlayAudio(activeMentorshipQuestion.id, activeMentorshipQuestion.elderAnswerText)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer shrink-0"
                    >
                      {playingAudioId === activeMentorshipQuestion.id ? (
                        <>
                          <Pause className="w-3.5 h-3.5" />
                          <span>Pause Audio Note</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Play Ramesh's Voice Note (0:24)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Spoken Hindi Transcript */}
                  <div className="bg-white/90 rounded-xl p-3 border border-amber-200/80 space-y-1.5">
                    <span className="text-[11px] font-bold text-stone-700 block">
                      Spoken Hindi Audio Transcript:
                    </span>
                    <p className="text-xs text-stone-900 font-serif leading-relaxed italic">
                      "{activeMentorshipQuestion.elderAnswerText}"
                    </p>
                  </div>

                  {/* English Translation */}
                  <div className="bg-white/60 rounded-xl p-2.5 border border-stone-200 text-stone-700 text-xs leading-relaxed">
                    <strong className="text-stone-900">English Translation:</strong> "Ah son, in Ghaziabad yard whenever there was a relay or signal malfunction, we immediately coordinated with the Station Master to physically clamp and padlock the facing points. Discipline was the greatest safety!"
                  </div>

                  {/* Delivery Loop to Priya on Telegram */}
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-teal-950">
                    <div className="flex items-center gap-2">
                      <span className="text-base">📱</span>
                      <span>
                        Delivered to Priya's Telegram: <em>"Papa shared his 1988 Ghaziabad yard wisdom with student Aarav Mehta (DTU)"</em>
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded border border-teal-300">
                      SENT
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
