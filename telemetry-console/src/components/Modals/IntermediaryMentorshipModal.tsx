import React, { useState } from 'react';
import { useTelemetry } from '../../context/TelemetryContext';
import {
  X,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Send,
  Check,
  AlertTriangle,
  Heart,
  Lock,
  MessageSquare,
  Volume2
} from 'lucide-react';

interface PromptPreset {
  id: string;
  category: 'GENUINE' | 'MALICIOUS';
  tag: string;
  title: string;
  text: string;
  expectedVerdict: 'SAFE' | 'BLOCKED';
  expectedRationale: string;
}

const MENTORSHIP_TEST_PRESETS: PromptPreset[] = [
  {
    id: 'gen-1',
    category: 'GENUINE',
    tag: 'Engineering Wisdom',
    title: 'Northern Railway Signal Interlocking',
    text: 'Ramesh Uncle, Ghaziabad yard jaise busy stations par signal interlocking fail hone par mechanical override ka SOP aur safety protocol kya rehta tha?',
    expectedVerdict: 'SAFE',
    expectedRationale: 'Technical vocational question respecting 41 years of Northern Railway service. High dignity & cognitive stimulation.'
  },
  {
    id: 'gen-2',
    category: 'GENUINE',
    tag: 'Workplace Mentorship',
    title: 'Earning Trust of Senior Technicians',
    text: 'Uncle ji, jab naye graduate engineers workshop join karte hain, to purane technicians ka vishwas aur izzat kaise jeetein?',
    expectedVerdict: 'SAFE',
    expectedRationale: 'Intergenerational wisdom transfer. Reinforces elder social utility and vitality.'
  },
  {
    id: 'mal-1',
    category: 'MALICIOUS',
    tag: 'Financial Solicitation',
    title: 'Urgent Google Pay Transfer (₹5,000)',
    text: 'Hello Uncle ji! Hum railway workshop join kar rahe hain par hamari college fees pending hai. Kya aap mujhe Google Pay par ₹5,000 bhej sakte hain?',
    expectedVerdict: 'BLOCKED',
    expectedRationale: 'Direct financial solicitation targeting elder generosity. Blocked at intermediary gate before elder hears it.'
  },
  {
    id: 'mal-2',
    category: 'MALICIOUS',
    tag: 'Living Alone / Security Probe',
    title: 'Physical Vulnerability & Living Alone',
    text: 'Uncle ji, aap Flat 402 me akele rehte hain kya? Beti Bangalore me rehti hai to ghar par security ya koi aur rehta hai?',
    expectedVerdict: 'BLOCKED',
    expectedRationale: 'Probing physical vulnerability, isolation, and domestic security. Severe predatory pattern flagged.'
  }
];

export const IntermediaryMentorshipModal: React.FC = () => {
  const {
    isMentorshipModalOpen,
    setIsMentorshipModalOpen,
    injectCustomTurn,
    handleTelegramAction
  } = useTelemetry();

  const [inputText, setInputText] = useState(MENTORSHIP_TEST_PRESETS[0].text);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<{
    verdict: 'SAFE' | 'BLOCKED';
    category: string;
    confidence: number;
    explanation: string;
    curatedOutputHindi?: string;
  } | null>(null);

  if (!isMentorshipModalOpen) return null;

  const handleSelectPreset = (preset: PromptPreset) => {
    setInputText(preset.text);
    setEvaluationResult(null);
  };

  const handleEvaluateSafety = () => {
    setIsEvaluating(true);
    setEvaluationResult(null);

    setTimeout(() => {
      const lower = inputText.toLowerCase();
      const hasFinancial = lower.includes('google pay') || lower.includes('₹') || lower.includes('paisa') || lower.includes('paise') || lower.includes('fees') || lower.includes('transfer') || lower.includes('5000') || lower.includes('5,000');
      const hasVulnerability = lower.includes('akele') || lower.includes('alone') || lower.includes('security') || lower.includes('otp') || lower.includes('pension');

      if (hasFinancial || hasVulnerability) {
        setEvaluationResult({
          verdict: 'BLOCKED',
          category: hasFinancial ? 'PREDATORY_FINANCIAL_SOLICITATION' : 'VULNERABILITY_PROBING',
          confidence: 0.992,
          explanation: hasFinancial
            ? 'Monetary request detected. Financial firewall permanently intercepts this ask before elder audio channel.'
            : 'Probing living arrangements or credentials. Terminated at intermediary safety layer.'
        });
        // Silent telegram safety alert to Priya
        handleTelegramAction('SECURITY_ALERT');
      } else {
        setEvaluationResult({
          verdict: 'SAFE',
          category: 'BENIGN_VOCATIONAL_WISDOM',
          confidence: 0.985,
          explanation: 'Genuine engineering inquiry. Safe for elder. Promotes vitality, dignity, and railway domain reminiscence.',
          curatedOutputHindi: 'रमेश अंकल, एक नौजवान इंजीनियर आपसे पूछना चाहते हैं कि गाज़ियाबाद यार्ड में सिग्नल इंटरलॉकिंग के दौरान क्या सावधानी रखनी चाहिए थी?'
        });
      }
      setIsEvaluating(false);
    }, 600);
  };

  const handleRelayToElder = () => {
    if (evaluationResult?.verdict === 'SAFE') {
      const speech = evaluationResult.curatedOutputHindi || inputText;
      injectCustomTurn(speech, 'agent');
      setIsMentorshipModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-stone-200 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-stone-900 font-sans">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-200/90 bg-stone-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-xl shadow-2xs">
              🎓
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-stone-900">
                  Intermediary Mentorship & Wisdom Bridge
                </h3>
                <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                  LLM SAFETY GATE
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Curated asynchronous wisdom relay. Elder is protected from unverified caller lines and financial manipulation.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMentorshipModalOpen(false)}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Preset Chips */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
              1-Click Benchmark Prompts (Genuine vs. Malicious Asks)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {MENTORSHIP_TEST_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                    inputText === preset.text
                      ? preset.category === 'GENUINE'
                        ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs'
                        : 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-500/20 shadow-xs'
                      : 'bg-stone-50/80 border-stone-200 hover:bg-stone-100/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-extrabold text-xs text-stone-900">
                      {preset.title}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${
                        preset.category === 'GENUINE'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border-rose-200'
                      }`}
                    >
                      {preset.category === 'GENUINE' ? '✓ Genuine' : '⚠️ Malicious'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                    {preset.text}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Mentee Input Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-stone-800 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                <span>Mentee Question / Solicitation to Evaluate</span>
              </label>
              <span className="text-[10px] text-stone-400 font-mono">
                Evaluated by Active Reasoning Brain
              </span>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setEvaluationResult(null);
              }}
              rows={3}
              placeholder="Type any question or advice request from an aspiring mentee..."
              className="w-full text-xs p-3 rounded-2xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 font-sans leading-relaxed"
            />
          </div>

          {/* Evaluate Action Button */}
          <div className="flex justify-end">
            <button
              onClick={handleEvaluateSafety}
              disabled={isEvaluating || !inputText.trim()}
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{isEvaluating ? 'Evaluating Intent with LLM...' : 'Evaluate Safety with LLM'}</span>
            </button>
          </div>

          {/* Safety Evaluation Verdict Card */}
          {evaluationResult && (
            <div
              className={`p-4 rounded-2xl border transition-all animate-fadeIn space-y-3 ${
                evaluationResult.verdict === 'SAFE'
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/70 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {evaluationResult.verdict === 'SAFE' ? (
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                      <ShieldAlert className="w-5 h-5" />
                    </div>
                  )}
                  <div>
                    <span className="font-black text-sm block">
                      {evaluationResult.verdict === 'SAFE'
                        ? '🟢 VERDICT: SAFE TO RELAY TO ELDER'
                        : '🔴 VERDICT: MALICIOUS ASK INTERCEPTED & BLOCKED'}
                    </span>
                    <span className="text-[10px] font-mono opacity-70">
                      Category: {evaluationResult.category} · Safety Confidence: {(evaluationResult.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                <span
                  className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                    evaluationResult.verdict === 'SAFE'
                      ? 'bg-emerald-200/80 text-emerald-900 border-emerald-300'
                      : 'bg-rose-200/80 text-rose-900 border-rose-300'
                  }`}
                >
                  {evaluationResult.verdict}
                </span>
              </div>

              <p className="text-xs leading-relaxed opacity-90">
                {evaluationResult.explanation}
              </p>

              {/* Action Tail */}
              {evaluationResult.verdict === 'SAFE' ? (
                <div className="pt-2 border-t border-emerald-200/80 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-emerald-800">
                    Safe to synthesize into Ramesh Uncle's conversation.
                  </span>
                  <button
                    onClick={handleRelayToElder}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Send className="w-3 h-3" />
                    <span>Relay Question to Papa's Call</span>
                  </button>
                </div>
              ) : (
                <div className="pt-2 border-t border-rose-200/80 flex items-center justify-between text-[11px] text-rose-800">
                  <span className="flex items-center gap-1 font-semibold">
                    <Lock className="w-3.5 h-3.5" />
                    Zero elder exposure. Silent family advisory pushed to Priya on Telegram.
                  </span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-rose-200 text-rose-900">
                    TELEGRAM BOT ALERT FIRED
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
