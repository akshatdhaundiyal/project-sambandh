/**
 * useCallSession — Manages call lifecycle, 20s ring timeout, 1-min retry cycle & Telegram escalation
 * Extracted from TelemetryContext to reduce god-context complexity.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { CallStatus } from '../types/telemetry';
import { stopSpeech } from '../utils/speechService';

interface UseCallSessionProps {
  onEscalateMissedCall?: (attemptCount: number) => void;
  onToast?: (message: string) => void;
}

export const useCallSession = (props?: UseCallSessionProps) => {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [callDurationSeconds, setCallDurationSeconds] = useState<number>(0);
  const [callAttempt, setCallAttempt] = useState<number>(1);
  const [isWaitingForRetry, setIsWaitingForRetry] = useState<boolean>(false);
  const [retryCountdownSeconds, setRetryCountdownSeconds] = useState<number>(60);
  const [ringSecondsLeft, setRingSecondsLeft] = useState<number>(20);
  const [lastMissedCallAt, setLastMissedCallAt] = useState<string | null>(null);

  const pacingTimeoutRef = useRef<any>(null);
  const ringTimerRef = useRef<any>(null);
  const retryTimerRef = useRef<any>(null);

  // Call duration clock ticker (ticks every second during active call)
  useEffect(() => {
    if (callStatus !== 'active') return;
    const timer = setInterval(() => {
      setCallDurationSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [callStatus]);

  // Handle 20s Ringing Timeout
  useEffect(() => {
    if (callStatus !== 'calling') {
      if (ringTimerRef.current) clearInterval(ringTimerRef.current);
      return;
    }

    setRingSecondsLeft(20);
    ringTimerRef.current = setInterval(() => {
      setRingSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(ringTimerRef.current);
          handleCallUnanswered();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (ringTimerRef.current) clearInterval(ringTimerRef.current);
    };
  }, [callStatus]);

  // Handle 60s (1 min) Retry Countdown Ticker
  useEffect(() => {
    if (!isWaitingForRetry) {
      if (retryTimerRef.current) clearInterval(retryTimerRef.current);
      return;
    }

    retryTimerRef.current = setInterval(() => {
      setRetryCountdownSeconds(prev => {
        if (prev <= 1) {
          clearInterval(retryTimerRef.current);
          setIsWaitingForRetry(false);
          // Automatically place 2nd call attempt
          setCallAttempt(2);
          setCallStatus('calling');
          setRingSecondsLeft(20);
          props?.onToast?.("🔄 Safety Protocol: Redialing Ramesh Ji (Attempt 2/2)...");
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (retryTimerRef.current) clearInterval(retryTimerRef.current);
    };
  }, [isWaitingForRetry]);

  // Core handler when a call is unanswered or declined
  const handleCallUnanswered = useCallback(() => {
    stopSpeech();
    if (ringTimerRef.current) clearInterval(ringTimerRef.current);

    setCallAttempt(currentAttempt => {
      if (currentAttempt === 1) {
        // Attempt 1 missed: enter 60s waiting state before retry #2
        setCallStatus('idle');
        setIsWaitingForRetry(true);
        setRetryCountdownSeconds(60);
        props?.onToast?.("⚠️ Call #1 unanswered. Waiting 1 minute before automatic retry #2 (Safety protocol)...");
        return 1;
      } else {
        // Attempt 2 missed: escalate to Telegram alert
        setCallStatus('idle');
        setIsWaitingForRetry(false);
        const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
        setLastMissedCallAt(timeStr);
        props?.onEscalateMissedCall?.(2);
        props?.onToast?.("🚨 Escalation: 2nd check-in call missed. Telegram priority alert dispatched to Rohan Sharma.");
        return 2;
      }
    });
  }, [props]);

  const fastForwardRetry = useCallback(() => {
    if (!isWaitingForRetry) return;
    if (retryTimerRef.current) clearInterval(retryTimerRef.current);
    setIsWaitingForRetry(false);
    setCallAttempt(2);
    setCallStatus('calling');
    setRingSecondsLeft(20);
    props?.onToast?.("⚡ Fast-Forward: Redialing Ramesh Ji now (Attempt 2/2)...");
  }, [isWaitingForRetry, props]);

  const beginCall = () => {
    stopSpeech();
    if (pacingTimeoutRef.current) clearTimeout(pacingTimeoutRef.current);
    if (ringTimerRef.current) clearInterval(ringTimerRef.current);
    if (retryTimerRef.current) clearInterval(retryTimerRef.current);
    setIsWaitingForRetry(false);
    setCallStatus('active');
    setCallDurationSeconds(0);
  };

  const initiateIncomingCall = (attemptNumber = 1) => {
    stopSpeech();
    if (pacingTimeoutRef.current) clearTimeout(pacingTimeoutRef.current);
    if (ringTimerRef.current) clearInterval(ringTimerRef.current);
    if (retryTimerRef.current) clearInterval(retryTimerRef.current);
    setIsWaitingForRetry(false);
    setCallAttempt(attemptNumber);
    setRingSecondsLeft(20);
    setCallStatus('calling');
    setCallDurationSeconds(0);
  };

  const acceptCall = () => {
    stopSpeech();
    if (pacingTimeoutRef.current) clearTimeout(pacingTimeoutRef.current);
    if (ringTimerRef.current) clearInterval(ringTimerRef.current);
    if (retryTimerRef.current) clearInterval(retryTimerRef.current);
    setIsWaitingForRetry(false);
    setCallStatus('active');
    setCallDurationSeconds(0);
  };

  const declineCall = () => {
    handleCallUnanswered();
  };

  const endCall = () => {
    stopSpeech();
    if (pacingTimeoutRef.current) clearTimeout(pacingTimeoutRef.current);
    if (ringTimerRef.current) clearInterval(ringTimerRef.current);
    if (retryTimerRef.current) clearInterval(retryTimerRef.current);
    setIsWaitingForRetry(false);
    setCallStatus('ended');
  };

  const resetCallState = () => {
    stopSpeech();
    if (pacingTimeoutRef.current) clearTimeout(pacingTimeoutRef.current);
    if (ringTimerRef.current) clearInterval(ringTimerRef.current);
    if (retryTimerRef.current) clearInterval(retryTimerRef.current);
    setIsWaitingForRetry(false);
    setCallAttempt(1);
    setRetryCountdownSeconds(60);
    setRingSecondsLeft(20);
    setCallStatus('idle');
    setCallDurationSeconds(0);
    setLastMissedCallAt(null);
  };

  return {
    callStatus,
    setCallStatus,
    callDurationSeconds,
    callAttempt,
    isWaitingForRetry,
    retryCountdownSeconds,
    ringSecondsLeft,
    lastMissedCallAt,
    pacingTimeoutRef,
    beginCall,
    initiateIncomingCall,
    acceptCall,
    declineCall,
    endCall,
    resetCallState,
    fastForwardRetry,
    handleCallUnanswered
  };
};
