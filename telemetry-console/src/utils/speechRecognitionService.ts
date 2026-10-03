/**
 * Cross-Browser Speech-to-Text (STT) Recognition Service
 * First-Class Multi-OS & Multi-Browser Support:
 * - Chrome on Windows & macOS (`webkitSpeechRecognition` / `SpeechRecognition`)
 * - Safari on macOS & iOS (`webkitSpeechRecognition` / `SpeechRecognition` via Apple Dictation)
 * - Microsoft Edge on Windows & macOS
 * - Native Hindi dialect: `hi-IN`
 */

export interface SpeechRecognitionCallbacks {
  onResult: (transcript: string, isFinal: boolean) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

// Declare SpeechRecognition types for TypeScript across Chrome & Safari
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}

export const isSpeechRecognitionSupported = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
};

export const getBrowserEngineInfo = (): { name: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Other'; isSupported: boolean } => {
  if (typeof window === 'undefined') return { name: 'Other', isSupported: false };
  const ua = navigator.userAgent;
  const isChrome = /Chrome/.test(ua) && !/Edge|Edg/.test(ua);
  const isSafari = /Safari/.test(ua) && !/Chrome|Edge|Edg/.test(ua);
  const isEdge = /Edge|Edg/.test(ua);
  const isFirefox = /Firefox/.test(ua);

  let name: 'Chrome' | 'Safari' | 'Firefox' | 'Edge' | 'Other' = 'Other';
  if (isEdge) name = 'Edge';
  else if (isChrome) name = 'Chrome';
  else if (isSafari) name = 'Safari';
  else if (isFirefox) name = 'Firefox';

  return {
    name,
    isSupported: isSpeechRecognitionSupported()
  };
};

export class HindiSpeechRecognizer {
  private recognition: any = null;
  private isListening: boolean = false;
  private explicitlyStopped: boolean = false;
  private callbacks: SpeechRecognitionCallbacks;
  private accumulatedFinalText: string = '';
  private restartTimeout: any = null;

  constructor(callbacks: SpeechRecognitionCallbacks) {
    this.callbacks = callbacks;
    this.init();
  }

  private init() {
    if (!isSpeechRecognitionSupported()) return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRec();

    // Browser-specific tuning: Chrome supports long-lived continuous streams;
    // Safari handles incremental chunks via native dictation bridge.
    try {
      this.recognition.continuous = true;
    } catch {
      this.recognition.continuous = false;
    }
    this.recognition.interimResults = true;
    this.recognition.lang = 'hi-IN'; // Native Hindi (India)

    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let currentSessionFinal = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          currentSessionFinal += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      const fullFinal = (this.accumulatedFinalText + ' ' + currentSessionFinal).trim();
      const activeText = (fullFinal + (interimTranscript ? ' ' + interimTranscript : '')).trim();

      if (activeText) {
        this.callbacks.onResult(activeText, !!fullFinal);
      }
    };

    this.recognition.onerror = (event: any) => {
      // 'no-speech' is a normal conversational pause event in Chrome and Safari; ignore to keep listening
      if (event.error === 'no-speech' && !this.explicitlyStopped) {
        return;
      }
      if (event.error === 'aborted' && !this.explicitlyStopped) {
        return;
      }
      console.warn('[SpeechRecognition Error]:', event.error);
      this.isListening = false;
      this.callbacks.onError?.(event.error);
    };

    this.recognition.onend = () => {
      // In Safari & Chrome: If stream ended due to natural pause but user hasn't tapped stop, auto-reconnect
      if (this.isListening && !this.explicitlyStopped) {
        if (this.restartTimeout) clearTimeout(this.restartTimeout);
        this.restartTimeout = setTimeout(() => {
          if (this.isListening && !this.explicitlyStopped) {
            try {
              this.recognition.start();
              return;
            } catch {
              // Ignore already started error
            }
          }
        }, 150);
        return;
      }
      this.isListening = false;
      this.callbacks.onEnd?.();
    };
  }

  public start(): boolean {
    if (!this.recognition) {
      this.callbacks.onError?.('Speech recognition is not supported in this browser. Please use Chrome or Safari on macOS/Windows.');
      return false;
    }

    this.explicitlyStopped = false;
    this.accumulatedFinalText = '';
    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err: any) {
      // In Safari/Chrome: If already started or resetting, ignore InvalidStateError
      if (err.name === 'InvalidStateError') {
        this.isListening = true;
        return true;
      }
      console.warn('[SpeechRecognition Start Error]:', err);
      return false;
    }
  }

  public stop() {
    this.explicitlyStopped = true;
    this.isListening = false;
    if (this.restartTimeout) {
      clearTimeout(this.restartTimeout);
      this.restartTimeout = null;
    }
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
  }

  public getStatus(): boolean {
    return this.isListening;
  }
}
