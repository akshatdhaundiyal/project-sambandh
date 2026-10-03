import { useState, useRef, useCallback, useEffect } from 'react';
import { ConversationTurn, CallStatus } from '../types/telemetry';
import { speakDialogueTurn, stopSpeech } from '../utils/speechService';

interface UseAudioPipelineProps {
  isPlaying: boolean;
  callStatus: CallStatus;
  onPlaybackAdvance?: () => void;
}

export const useAudioPipeline = ({
  isPlaying,
  callStatus,
  onPlaybackAdvance
}: UseAudioPipelineProps) => {
  const [activeTtsEngine, setActiveTtsEngine] = useState<'browser' | 'gnani'>('gnani');
  const [currentlySpeakingTurnId, setCurrentlySpeakingTurnId] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState<boolean>(true);
  const [speakSeniorTurns, setSpeakSeniorTurns] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sambandh_speak_senior_turns');
      if (saved !== null) return saved === 'true';
    }
    return true;
  });

  const speechAdvanceTimeoutRef = useRef<any>(null);

  const handleSetSpeakSeniorTurns = useCallback((val: boolean) => {
    setSpeakSeniorTurns(val);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sambandh_speak_senior_turns', String(val));
    }
  }, []);

  const speakTurn = useCallback((turn: ConversationTurn) => {
    setCurrentlySpeakingTurnId(turn.id);
    speakDialogueTurn(turn.content, turn.speaker, activeTtsEngine, {
      onEnd: () => {
        setCurrentlySpeakingTurnId(null);
        // Only auto-advance if explicitly running a scripted scenario playback demo (never during active live calls!)
        if (isPlaying && callStatus !== 'active' && autoSpeak && onPlaybackAdvance) {
          if (speechAdvanceTimeoutRef.current) clearTimeout(speechAdvanceTimeoutRef.current);
          speechAdvanceTimeoutRef.current = setTimeout(() => {
            onPlaybackAdvance();
          }, 300);
        }
      },
      onError: () => setCurrentlySpeakingTurnId(null)
    });
  }, [activeTtsEngine, autoSpeak, isPlaying, callStatus, onPlaybackAdvance]);

  const stopActiveSpeech = useCallback(() => {
    stopSpeech();
    setCurrentlySpeakingTurnId(null);
    if (speechAdvanceTimeoutRef.current) clearTimeout(speechAdvanceTimeoutRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (speechAdvanceTimeoutRef.current) clearTimeout(speechAdvanceTimeoutRef.current);
    };
  }, []);

  return {
    activeTtsEngine,
    setActiveTtsEngine,
    currentlySpeakingTurnId,
    setCurrentlySpeakingTurnId,
    autoSpeak,
    setAutoSpeak,
    speakSeniorTurns,
    handleSetSpeakSeniorTurns,
    speakTurn,
    stopActiveSpeech
  };
};
