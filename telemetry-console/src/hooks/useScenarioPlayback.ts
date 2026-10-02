/**
 * useScenarioPlayback — Manages scripted scenario navigation, stepping, pacing, and timers.
 * Extracted from TelemetryContext to isolate scripted demonstration controls.
 */
import { useState, useMemo, useEffect, useCallback } from 'react';
import { Scenario, ScenarioStep, HttpApiExchange } from '../types/telemetry';
import { ALL_SCENARIOS } from '../data/scenarios';
import {
  PINE_LABS_SUCCESS_EXCHANGE,
  PINE_LABS_LIMIT_EXCEEDED_EXCHANGE,
  DELHIVERY_SUCCESS_EXCHANGE,
  WHISPERFLO_DIAL_EXCHANGE,
  ABDM_RUNWAY_EXCHANGE,
  TELEGRAM_DISPATCH_EXCHANGE
} from '../data/apiExchanges';

export type PacingOption = '1x' | '2x' | 'manual';

export const getStepApiExchange = (
  phase: string,
  scenarioId: string
): HttpApiExchange => {
  if (phase === 'PINE_LABS_MANDATE_EXECUTION' || phase === 'FIDUCIARY_STEPUP_REQUIRED') {
    return scenarioId === 'scenario-4'
      ? PINE_LABS_LIMIT_EXCEEDED_EXCHANGE
      : PINE_LABS_SUCCESS_EXCHANGE;
  }
  if (phase === 'DELHIVERY_DISPATCH') {
    return DELHIVERY_SUCCESS_EXCHANGE;
  }
  if (phase === 'ABDM_RUNWAY_EVAL') {
    return ABDM_RUNWAY_EXCHANGE;
  }
  if (
    phase === 'CAREGIVER_TELEGRAM_BRIEF' ||
    phase === 'FRAUD_INTERCEPTED' ||
    phase === 'CLINICAL_ESCALATION'
  ) {
    return TELEGRAM_DISPATCH_EXCHANGE;
  }
  return WHISPERFLO_DIAL_EXCHANGE;
};

export const useScenarioPlayback = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(ALL_SCENARIOS[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [pacing, setPacing] = useState<PacingOption>('1x');

  const activeScenario = useMemo<Scenario>(() => {
    return ALL_SCENARIOS.find(s => s.id === activeScenarioId) || ALL_SCENARIOS[0];
  }, [activeScenarioId]);

  const currentStep = useMemo<ScenarioStep>(() => {
    const idx = Math.min(currentStepIndex, activeScenario.steps.length - 1);
    return activeScenario.steps[idx];
  }, [activeScenario, currentStepIndex]);

  const currentStepApiExchange = useMemo<HttpApiExchange>(() => {
    return getStepApiExchange(currentStep.phase, activeScenario.id);
  }, [currentStep.phase, activeScenario.id]);

  const stepNext = useCallback(() => {
    setCurrentStepIndex(prev => {
      if (prev < activeScenario.steps.length - 1) {
        return prev + 1;
      }
      setIsPlaying(false);
      return prev;
    });
  }, [activeScenario.steps.length]);

  const stepPrev = useCallback(() => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => {
      const next = !prev;
      if (next && currentStepIndex >= activeScenario.steps.length - 1) {
        setCurrentStepIndex(0);
      }
      return next;
    });
  }, [currentStepIndex, activeScenario.steps.length]);

  const setScenarioById = useCallback((id: string) => {
    setActiveScenarioId(id);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, []);

  const resetPlayback = useCallback(() => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  }, []);

  // Scripted scenario autoplay timer (ticks when isPlaying is true and pacing is not manual)
  useEffect(() => {
    if (!isPlaying || pacing === 'manual') return;

    const intervalMs = pacing === '2x' ? 3000 : 6000;
    const timer = setInterval(() => {
      setCurrentStepIndex(prev => {
        if (prev < activeScenario.steps.length - 1) {
          return prev + 1;
        } else {
          setIsPlaying(false);
          return prev;
        }
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isPlaying, pacing, activeScenario.steps.length]);

  return {
    scenarios: ALL_SCENARIOS,
    activeScenarioId,
    activeScenario,
    currentStepIndex,
    setCurrentStepIndex,
    currentStep,
    currentStepApiExchange,
    isPlaying,
    setIsPlaying,
    pacing,
    setPacing,
    stepNext,
    stepPrev,
    togglePlay,
    setScenarioById,
    resetPlayback
  };
};
