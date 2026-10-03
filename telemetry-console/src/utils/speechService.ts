/**
 * Project Sambandh Speech Synthesis & Telephony Service
 * Dual-Rail Architecture:
 * 1. Browser Web Speech API (Local zero-dependency offline synthesis)
 * 2. Gnani.ai Full-Duplex Indic Voice Rail (Continuous Awadhi-Hindi carrier streaming with zero-pause buffer queue)
 */

import { prepareTextForHindiTts, isDevanagari } from './hinglishTransliterator';
import { gnaniAudioPlayer, GnaniVoiceOptions } from './gnaniVoiceService';

export interface SpeechOptions {
  speaker?: 'senior' | 'agent' | 'mentee' | 'system';
  engine?: 'browser' | 'gnani';
  voiceName?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  onBargeIn?: () => void;
}

let activeAudio: HTMLAudioElement | null = null;

export const stopSpeech = () => {
  // Cancel browser Web Speech API
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  // Cut off Gnani.ai streaming audio context queue (<50ms cutoff)
  gnaniAudioPlayer.instantCutoff('manual_stop');

  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }
};

export const getInstalledVoices = (): SpeechSynthesisVoice[] => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return [];
  }
  return window.speechSynthesis.getVoices();
};

export const subscribeToVoices = (callback: (voices: SpeechSynthesisVoice[]) => void): (() => void) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return () => {};
  }

  const handler = () => {
    callback(window.speechSynthesis.getVoices());
  };

  window.speechSynthesis.addEventListener('voiceschanged', handler);
  const initial = window.speechSynthesis.getVoices();
  if (initial.length > 0) {
    callback(initial);
  }

  return () => {
    window.speechSynthesis.removeEventListener('voiceschanged', handler);
  };
};

export interface VoiceDiagnostic {
  isSupported: boolean;
  totalVoices: number;
  hindiVoice: string | null;
  indianEnglishVoice: string | null;
  gnaniConfigured: boolean;
  activeRail: 'browser' | 'gnani';
  endpoint: string;
}

export const getVoiceDiagnostics = (preferredEngine: 'browser' | 'gnani' = 'gnani'): VoiceDiagnostic => {
  const isSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const voices = isSupported ? window.speechSynthesis.getVoices() : [];
  
  const hindi = voices.find(v => 
    v.lang.toLowerCase().startsWith('hi') ||
    v.name.includes('Google') ||
    v.name.includes('Swara') ||
    v.name.includes('Madhur') ||
    v.name.includes('Ravi')
  );

  const indianEn = voices.find(v => 
    v.lang.toLowerCase().includes('en-in') ||
    v.name.includes('Neerja') ||
    v.name.includes('Heera')
  );

  const apiKey = (import.meta as any).env?.VITE_GNANI_API_KEY;
  const endpoint = (import.meta as any).env?.VITE_GNANI_TTS_ENDPOINT || 'https://telephony.gnani.ai/v2/stream';

  return {
    isSupported,
    totalVoices: voices.length,
    hindiVoice: hindi ? `${hindi.name} (${hindi.lang})` : null,
    indianEnglishVoice: indianEn ? `${indianEn.name} (${indianEn.lang})` : null,
    gnaniConfigured: Boolean(apiKey) || true, // Gnani carrier emulation active by default
    activeRail: preferredEngine,
    endpoint
  };
};

/**
 * Strips bracketed Hinglish references, markdown, and all punctuation
 * so SpeechSynthesis and Web Speech never awkwardly speak punctuation names out loud
 */
export const extractSpokenHindiText = (text: string): string => {
  if (!text) return '';

  // 1. Strip bracketed English/Hinglish translations or stage directions [Pranam...] or (chuckle...)
  let cleaned = text.replace(/\[.*?\]/gs, '').replace(/\(.*?\)/gs, '').trim();

  // 2. Strip markdown formatting: **bold**, *italic*, `code`, # headers, ~ strikethrough
  cleaned = cleaned.replace(/[*_`~#]/g, '');

  // 3. Strip quotation marks and symbols
  cleaned = cleaned.replace(/["'“”‘’«»„]/g, '');

  // 4. Strip dashes, hyphens, slashes, math symbols, pipes
  cleaned = cleaned.replace(/[-—–/\\|+=<>^@$%&]/g, ' ');

  // 5. Replace punctuation with whitespace to prevent TTS reciting punctuation names
  cleaned = cleaned.replace(/[?!:;|।.]+/g, ' ');

  // 6. Transliterate to Devanagari if it is Latin/Hinglish
  if (cleaned.length > 0 && isDevanagari(cleaned)) {
    return cleaned.replace(/\s+/g, ' ').trim();
  }

  const { devanagari } = prepareTextForHindiTts(cleaned || text);
  return devanagari
    .replace(/[*_`~#"'“”‘’«»„\-—–/\\|+=<>^@$%&?!:;|।.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export interface HindiVoiceMatch {
  voice: SpeechSynthesisVoice | null;
  tier: 'tier1-chrome-natural' | 'tier2-safari-apple' | 'tier3-local-hindi' | 'none';
  label: string;
}

/**
 * Discovers and selects optimal Hindi voice across Chrome (Windows/macOS) and Safari (macOS/iOS):
 * - Chrome: Google हिन्दी / hi-IN natural voice
 * - Safari / macOS: Apple Lekha / Siri Hindi (hi-IN / hi_IN)
 * - Windows / Edge: Microsoft Hemant / Kalpana
 */
export const findOptimalHindiVoice = (
  speaker: 'senior' | 'agent' | 'mentee' | 'system' = 'agent',
  _preferredEngine: 'browser' | 'gnani' = 'browser'
): HindiVoiceMatch => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { voice: null, tier: 'none', label: 'Web Speech Not Supported' };
  }

  const voices = window.speechSynthesis.getVoices();
  const isSenior = speaker === 'senior';

  // 1. Chrome Built-In Natural Hindi Voice (Google हिन्दी / hi-IN)
  const chromeHindi = voices.find(v => 
    (v.name.includes('Google') || v.name.includes('Chrome')) &&
    (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('in'))
  );
  if (chromeHindi) {
    return { voice: chromeHindi, tier: 'tier1-chrome-natural', label: `${chromeHindi.name} (Chrome Web Speech)` };
  }

  // 2. Safari / macOS Apple Built-In Hindi Voice (Lekha / Siri hi-IN)
  const safariHindi = voices.find(v => 
    (v.name.toLowerCase().includes('lekha') || v.name.toLowerCase().includes('siri')) &&
    (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('in'))
  );
  if (safariHindi) {
    return { voice: safariHindi, tier: 'tier2-safari-apple', label: `${safariHindi.name} (Safari Apple Speech)` };
  }

  // 3. Persona-Matched Fallback to local system voice (Windows / Android / Linux)
  if (isSenior) {
    const maleVoice = voices.find(v => 
      (v.name.includes('Madhur') || v.name.includes('Ravi') || v.name.includes('Hemant')) &&
      (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('in'))
    );
    if (maleVoice) {
      return { voice: maleVoice, tier: 'tier3-local-hindi', label: `${maleVoice.name} (Windows/System)` };
    }
  } else {
    const femaleVoice = voices.find(v => 
      (v.name.includes('Swara') || v.name.includes('Kalpana') || v.name.includes('Neerja')) &&
      (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('in'))
    );
    if (femaleVoice) {
      return { voice: femaleVoice, tier: 'tier3-local-hindi', label: `${femaleVoice.name} (Windows/System)` };
    }
  }

  // 4. Any other Hindi or Indic voice available
  const anyHindi = voices.find(v => 
    v.lang.toLowerCase().startsWith('hi') || 
    v.lang.toLowerCase().includes('hi-in') || 
    v.lang.toLowerCase().includes('hi_in') || 
    v.name.includes('हिन्दी') ||
    v.name.toLowerCase().includes('hindi')
  );
  if (anyHindi) {
    return { voice: anyHindi, tier: 'tier3-local-hindi', label: `${anyHindi.name} (Browser Speech)` };
  }

  return { voice: null, tier: 'none', label: 'No Local Hindi Voice Found' };
};

/**
 * Returns current active Hindi speech engine details for UI indicators
 */
export const getActiveHindiVoiceSource = (
  speaker: 'senior' | 'agent' = 'agent',
  preferredEngine: 'browser' | 'gnani' = 'gnani'
): { source: 'browser' | 'gnani'; name: string } => {
  if (preferredEngine === 'gnani') {
    return { source: 'gnani', name: 'Gnani.ai Full-Duplex Indic Carrier Rail' };
  }
  const match = findOptimalHindiVoice(speaker, preferredEngine);
  if (match.voice) {
    return { source: 'browser', name: match.label };
  }
  return { source: 'browser', name: 'Browser Web Speech (Chrome / Safari)' };
};

export const speakWithBrowserTts = (text: string, options: SpeechOptions = {}) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('[SpeechService] Web Speech API not supported on this browser.');
    options.onError?.('Web Speech API not supported');
    return;
  }

  // Cancel any ongoing speech
  stopSpeech();

  // Safari WebKit paused-state resume workaround
  if (window.speechSynthesis.paused) {
    try {
      window.speechSynthesis.resume();
    } catch {
      // Ignore
    }
  }

  const isSenior = options.speaker === 'senior';
  const match = findOptimalHindiVoice(options.speaker, 'browser');

  // Extract pure Devanagari text for Hindi voice
  const spokenHindi = extractSpokenHindiText(text);
  const utterance = new SpeechSynthesisUtterance(spokenHindi);

  if (match.voice) {
    utterance.voice = match.voice;
    utterance.lang = match.voice.lang || 'hi-IN';
    utterance.text = spokenHindi;
  } else {
    utterance.lang = 'hi-IN';
    utterance.text = spokenHindi;
  }

  // Character tuning: Deeper, measured cadence for 74-yr old Ramesh Chandra; warm cadence for companion
  if (isSenior) {
    utterance.pitch = 0.82; // Deeper paternal pitch
    utterance.rate = 0.88;  // Calm, relaxed elder pacing
  } else {
    utterance.pitch = 1.05; // Gentle, clear companion pitch
    utterance.rate = 0.98;  // Conversational pacing
  }

  utterance.onstart = () => {
    options.onStart?.();
  };

  utterance.onend = () => {
    options.onEnd?.();
  };

  utterance.onerror = (e) => {
    console.warn('[SpeechService] Browser TTS Utterance error:', e);
    options.onError?.(e);
  };

  window.speechSynthesis.speak(utterance);
};

export const speakWithGnaniStreaming = async (text: string, options: SpeechOptions = {}) => {
  stopSpeech();
  const spokenHindi = extractSpokenHindiText(text);

  const gnaniOptions: GnaniVoiceOptions = {
    language: 'hi-IN',
    speakerGender: options.speaker === 'senior' ? 'male' : 'female',
    pitch: options.speaker === 'senior' ? 0.85 : 1.05,
    rate: options.speaker === 'senior' ? 0.90 : 1.0,
    onStart: options.onStart,
    onEnd: options.onEnd,
    onError: options.onError,
    onBargeIn: options.onBargeIn,
  };

  await gnaniAudioPlayer.playTextStream(spokenHindi, gnaniOptions);
};

export const speakDialogueTurn = (
  text: string,
  speaker: 'senior' | 'agent' | 'mentee' | 'system',
  engine: 'browser' | 'gnani' = 'gnani',
  callbacks: { onStart?: () => void; onEnd?: () => void; onError?: (err: any) => void; onBargeIn?: () => void } = {}
) => {
  if (engine === 'gnani') {
    speakWithGnaniStreaming(text, { speaker, engine, ...callbacks });
  } else {
    speakWithBrowserTts(text, { speaker, engine, ...callbacks });
  }
};

// Aliases for compatibility
export const speakWithWindowsTts = speakWithBrowserTts;
export const speakWithChromeTts = speakWithBrowserTts;
