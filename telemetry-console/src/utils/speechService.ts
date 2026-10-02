/**
 * Project Sambandh Speech Synthesis & Telephony Service
 * Supports:
 * 1. Chrome Web Speech API (In-Browser, OS-Independent with Google हिन्दी / Chromium Voices)
 * 2. WhisperFlo Neural Telephony API (REST/Audio Stream)
 */

export interface SpeechOptions {
  speaker?: 'senior' | 'agent' | 'mentee' | 'system';
  engine?: 'chrome' | 'whisperflo';
  voiceName?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
}

let activeAudio: HTMLAudioElement | null = null;
let _ttsRecursionGuard = false;

export const stopSpeech = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
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
  // Initial call if voices are already loaded
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
  whisperFloKeyPresent: boolean;
  endpoint: string;
}

export const getVoiceDiagnostics = (): VoiceDiagnostic => {
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

  const apiKey = (import.meta as any).env?.VITE_WHISPERFLO_API_KEY;
  const endpoint = (import.meta as any).env?.VITE_WHISPERFLO_ENDPOINT || 'https://api.whisperflo.ai/v1/audio/speech';

  return {
    isSupported,
    totalVoices: voices.length,
    hindiVoice: hindi ? `${hindi.name} (${hindi.lang})` : null,
    indianEnglishVoice: indianEn ? `${indianEn.name} (${indianEn.lang})` : null,
    whisperFloKeyPresent: Boolean(apiKey),
    endpoint
  };
};

import { prepareTextForHindiTts, isDevanagari } from './hinglishTransliterator';

/**
 * Strips bracketed Hinglish references, markdown, and all punctuation
 * so SpeechSynthesis and Chrome Web Speech never awkwardly speak punctuation names out loud
 * (e.g. "question mark", "exclamation mark", "star", "brackets", "dash").
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

  // 5. Replace question marks, exclamation marks, colons, semicolons, danda, dots with whitespace
  // (Prevents Chrome speech synthesis from saying "क्वेश्चन मार्क" / "विस्मयादिबोधक" / "पूर्णविराम" aloud)
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
  tier: 'tier1-chrome-natural' | 'tier2-local-hindi' | 'none';
  label: string;
}

/**
 * Discovers and selects optimal Hindi voice with character persona matching:
 * Tier 1: Chrome Built-In Natural Hindi Voice (Google हिन्दी / hi-IN)
 * Tier 2: Local System Hindi (Persona matched)
 * Tier 3: None found (triggers seamless WhisperFlo neural stream)
 */
export const findOptimalHindiVoice = (
  speaker: 'senior' | 'agent' | 'mentee' | 'system' = 'agent',
  preferredEngine: 'chrome' | 'whisperflo' = 'chrome'
): HindiVoiceMatch => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return { voice: null, tier: 'none', label: 'Web Speech Not Supported' };
  }

  const voices = window.speechSynthesis.getVoices();
  const isSenior = speaker === 'senior';

  // 1. Prioritize Chrome Built-In Natural Hindi Voice (Google हिन्दी / hi-IN)
  const chromeHindi = voices.find(v => 
    (v.name.includes('Google') || v.name.includes('Chrome')) &&
    v.lang.toLowerCase().startsWith('hi')
  );
  if (chromeHindi) {
    return { voice: chromeHindi, tier: 'tier1-chrome-natural', label: `${chromeHindi.name} (Chrome API)` };
  }

  // 2. Silent Persona-Matched Fallback to any installed system voice
  if (isSenior) {
    const maleVoice = voices.find(v => 
      (v.name.includes('Madhur') || v.name.includes('Ravi') || v.name.includes('Hemant')) &&
      (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('in'))
    );
    if (maleVoice) {
      return { voice: maleVoice, tier: 'tier2-local-hindi', label: maleVoice.name };
    }
  } else {
    const femaleVoice = voices.find(v => 
      (v.name.includes('Swara') || v.name.includes('Kalpana')) &&
      (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('in'))
    );
    if (femaleVoice) {
      return { voice: femaleVoice, tier: 'tier2-local-hindi', label: femaleVoice.name };
    }
  }

  // 3. Any other Hindi voice available
  const anyHindi = voices.find(v => v.lang.toLowerCase().startsWith('hi') || v.name.includes('हिन्दी'));
  if (anyHindi) {
    return { voice: anyHindi, tier: 'tier2-local-hindi', label: anyHindi.name };
  }

  return { voice: null, tier: 'none', label: 'No Local Hindi Voice Found' };
};

/**
 * Returns current active Hindi speech engine details for UI indicators
 */
export const getActiveHindiVoiceSource = (
  speaker: 'senior' | 'agent' = 'agent',
  preferredEngine: 'chrome' | 'whisperflo' = 'chrome'
): { source: 'chrome' | 'whisperflo'; name: string } => {
  if (preferredEngine === 'whisperflo') {
    return { source: 'whisperflo', name: 'WhisperFlo Neural Telephony (Cloud Fallback)' };
  }
  const match = findOptimalHindiVoice(speaker, preferredEngine);
  if (match.voice) {
    return { source: 'chrome', name: match.label };
  }
  return { source: 'whisperflo', name: 'WhisperFlo Neural Telephony (Cloud Fallback)' };
};

export const speakWithBrowserTts = (text: string, options: SpeechOptions = {}) => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('[SpeechService] Web Speech API not supported on this browser. Falling back to WhisperFlo.');
    if (!_ttsRecursionGuard) {
      _ttsRecursionGuard = true;
      speakWithWhisperFloApi(text, options);
      _ttsRecursionGuard = false;
    }
    return;
  }

  // Cancel any ongoing speech
  stopSpeech();

  const isSenior = options.speaker === 'senior';
  const match = findOptimalHindiVoice(options.speaker, options.engine);

  // If NO local Hindi voice is installed, seamlessly route to WhisperFlo Neural Telephony
  if (match.tier === 'none' && !match.voice) {
    console.info('[SpeechService] No local Hindi voice installed. Seamlessly auto-routing to WhisperFlo Neural API.');
    speakWithWhisperFloApi(text, options);
    return;
  }

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
    console.warn('[SpeechService] TTS Utterance error, falling back to WhisperFlo:', e);
    // Guarded fallback to WhisperFlo audio (prevents circular recursion)
    if (!_ttsRecursionGuard) {
      _ttsRecursionGuard = true;
      speakWithWhisperFloApi(text, options);
      _ttsRecursionGuard = false;
    }
  };

  window.speechSynthesis.speak(utterance);
};

export const speakWithWhisperFloApi = async (text: string, options: SpeechOptions = {}) => {
  const apiKey = (import.meta as any).env?.VITE_WHISPERFLO_API_KEY;
  const endpoint = (import.meta as any).env?.VITE_WHISPERFLO_ENDPOINT || 'https://api.whisperflo.ai/v1/audio/speech';

  // If live WhisperFlo credentials are not configured, gracefully fall back to Browser Web Speech API
  if (!apiKey) {
    console.info('[SpeechService] No VITE_WHISPERFLO_API_KEY found in .env. Emulating WhisperFlo via Chrome Web Speech API.');
    if (!_ttsRecursionGuard) {
      _ttsRecursionGuard = true;
      speakWithBrowserTts(text, options);
      _ttsRecursionGuard = false;
    }
    return;
  }

  try {
    options.onStart?.();
    stopSpeech();

    const voice = options.speaker === 'senior' ? 'hi-IN-awadhi-elder' : 'hi-IN-care-companion';
    const spokenHindi = extractSpokenHindiText(text);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'whisperflo-v4.2-turbo',
        voice,
        input: spokenHindi,
        response_format: 'mp3',
        speed: options.speaker === 'senior' ? 0.9 : 1.0
      })
    });

    if (!response.ok) {
      throw new Error(`WhisperFlo API returned HTTP ${response.status}`);
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    const audio = new Audio(audioUrl);
    activeAudio = audio;

    audio.onended = () => {
      activeAudio = null;
      options.onEnd?.();
    };

    audio.onerror = (e) => {
      console.warn('[SpeechService] WhisperFlo audio playback error:', e);
      options.onError?.(e);
      // Fallback
      speakWithBrowserTts(text, options);
    };

    await audio.play();
  } catch (err) {
    console.warn('[SpeechService] WhisperFlo fetch failed, falling back to Browser Web Speech API:', err);
    if (!_ttsRecursionGuard) {
      _ttsRecursionGuard = true;
      speakWithBrowserTts(text, options);
      _ttsRecursionGuard = false;
    }
  }
};

export const speakDialogueTurn = (
  text: string,
  speaker: 'senior' | 'agent' | 'mentee' | 'system',
  engine: 'chrome' | 'whisperflo' = 'chrome',
  callbacks: { onStart?: () => void; onEnd?: () => void; onError?: (err: any) => void } = {}
) => {
  if (engine === 'whisperflo') {
    speakWithWhisperFloApi(text, { speaker, engine, ...callbacks });
  } else {
    speakWithBrowserTts(text, { speaker, engine, ...callbacks });
  }
};

// Backward-compatibility alias
export const speakWithWindowsTts = speakWithBrowserTts;
