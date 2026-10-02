/**
 * Speech to Text (STT) Recognition Service
 * Supports:
 * 1. Chrome Web Speech API (SpeechRecognition / webkitSpeechRecognition) with hi-IN (Hindi)
 * 2. Fallback to manual text input / WhisperFlo API
 */

export interface SpeechRecognitionCallbacks {
  onResult: (transcript: string, isFinal: boolean) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

// Declare SpeechRecognition types for TypeScript
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

export class HindiSpeechRecognizer {
  private recognition: any = null;
  private isListening: boolean = false;
  private explicitlyStopped: boolean = false;
  private callbacks: SpeechRecognitionCallbacks;
  private accumulatedFinalText: string = '';

  constructor(callbacks: SpeechRecognitionCallbacks) {
    this.callbacks = callbacks;
    this.init();
  }

  private init() {
    if (!isSpeechRecognitionSupported()) return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = new SpeechRec();
    this.recognition.continuous = true; // Uninterrupted continuous listening across pauses
    this.recognition.interimResults = true;
    this.recognition.lang = 'hi-IN'; // Native Hindi (India)

    this.recognition.onstart = () => {
      this.isListening = true;
      this.callbacks.onStart?.();
    };

    this.recognition.onresult = (event: any) => {
      let currentSessionFinal = '';
      let interimTranscript = '';

      for (let i = 0; i < event.results.length; ++i) {
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
      console.warn('[SpeechRecognition Error]:', event.error);
      // 'no-speech' is a normal event during conversational pauses; don't terminate listening
      if (event.error === 'no-speech' && !this.explicitlyStopped) {
        return;
      }
      this.isListening = false;
      this.callbacks.onError?.(event.error);
    };

    this.recognition.onend = () => {
      // If browser ended connection during brief silence but user hasn't clicked stop/done, keep alive
      if (this.isListening && !this.explicitlyStopped) {
        try {
          this.recognition.start();
          return;
        } catch (e) {
          // fall through
        }
      }
      this.isListening = false;
      this.callbacks.onEnd?.();
    };
  }

  public start(): boolean {
    if (!this.recognition) {
      this.callbacks.onError?.('Speech recognition is not supported in this browser. Please use Chrome/Edge or manual input.');
      return false;
    }

    this.explicitlyStopped = false;
    this.accumulatedFinalText = '';
    try {
      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (err: any) {
      console.warn('[SpeechRecognition Start Error]:', err);
      return false;
    }
  }

  public stop() {
    this.explicitlyStopped = true;
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (err) {
        // ignore
      }
    }
  }

  public getStatus(): boolean {
    return this.isListening;
  }
}
