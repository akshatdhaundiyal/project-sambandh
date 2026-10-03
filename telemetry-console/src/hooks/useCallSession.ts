/**
 * useCallSession — Manages call lifecycle state
 * Extracted from TelemetryContext to reduce god-context complexity.
 */
import { useState, useEffect, useRef } from 'react';
import { CallStatus } from '../types/telemetry';
import { stopSpeech } from '../utils/speechService';

export const useCallSession = () => {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [callDurationSeconds, setCallDurationSeconds] = useState<number>(0);
  const pacingTimeoutRef = useRef<any>(null);

  // Call duration clock ticker (ticks every second during active call)
  useEffect(() => {
    if (callStatus !== 'active') return;
    const timer = setInterval(() => {
      setCallDurationSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [callStatus]);

  const beginCall = () => {
    stopSpeech();
    if (pacingTimeoutRef.current) clearTimeout(pacingTimeoutRef.current);
    setCallStatus('active');
    setCallDurationSeconds(0);
  };

  const initiateIncomingCall = () => {
    stopSpeech();
    if (pacingTimeoutRef.current) clearTimeout(pacingTimeoutRef.current);
    setCallStatus('calling');
    setCallDurationSeconds(0);
  };

  const acceptCall = () => {
    stopSpeech();
    if (pacingTimeoutRef.current) clearTimeout(pacingTimeoutRef.current);
    setCallStatus('active');
    setCallDurationSeconds(0);
  };

  const declineCall = () => {
    stopSpeech();
    if (pacingTimeoutRef.current) clearTimeout(pacingTimeoutRef.current);
    setCallStatus('idle');
    setCallDurationSeconds(0);
  };

  const endCall = () => {
    stopSpeech();
    if (pacingTimeoutRef.current) clearTimeout(pacingTimeoutRef.current);
    setCallStatus('ended');
  };

  const resetCallState = () => {
    stopSpeech();
    if (pacingTimeoutRef.current) clearTimeout(pacingTimeoutRef.current);
    setCallStatus('idle');
    setCallDurationSeconds(0);
  };

  return {
    callStatus,
    setCallStatus,
    callDurationSeconds,
    pacingTimeoutRef,
    beginCall,
    initiateIncomingCall,
    acceptCall,
    declineCall,
    endCall,
    resetCallState
  };
};
