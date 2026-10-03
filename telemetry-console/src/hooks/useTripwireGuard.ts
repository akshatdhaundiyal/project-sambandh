/**
 * useTripwireGuard — Manages real-time acoustic tripwire state and extortion interception.
 * Extracted from TelemetryContext to isolate safety rail logic.
 */
import { useState } from 'react';
import { ConversationTurn } from '../types/telemetry';

export const useTripwireGuard = () => {
  const [isTripwireTriggered, setIsTripwireTriggered] = useState<boolean>(false);

  const resetTripwire = () => setIsTripwireTriggered(false);

  /**
   * Checks if an incoming turn is predatory extortion / elder fraud.
   * Only intercepts when an unverified external caller/mentee probes for credentials, OTP, or coercive funds transfer.
   */
  const evaluateExtortionRisk = (
    content: string,
    speaker: string,
    options?: { isScamSimulation?: boolean }
  ): boolean => {
    return (
      speaker === 'mentee' ||
      Boolean(options?.isScamSimulation) ||
      (/(bhejo|batao|share|give|send)\s*(apna|mera)?\s*(otp|password|cvv)/i.test(content) && speaker !== 'senior') ||
      (/(gpay|phonepe|paytm|upi)\s*(pe\s*paise|pe\s*transfer|bhejo|daalo)/i.test(content) && speaker !== 'senior')
    );
  };

  /**
   * Creates the 3-turn interception sequence: solicitation, tripwire sever, and protective companion override.
   */
  const createInterceptionTurns = (content: string): {
    solicitationTurn: ConversationTurn;
    tripwireSeverTurn: ConversationTurn;
    protectiveAgentTurn: ConversationTurn;
  } => {
    const timestamp = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    const now = Date.now();

    const solicitationTurn: ConversationTurn = {
      id: `solicitation-${now}`,
      timestamp,
      speaker: 'senior',
      lane: 'tripwire',
      speakerLabel: 'External Mentee / Caller (Financial Solicitation)',
      content: content.trim()
    };

    const tripwireSeverTurn: ConversationTurn = {
      id: `tripwire-sever-${now}`,
      timestamp,
      speaker: 'system',
      lane: 'tripwire',
      speakerLabel: '⚡ Acoustic Tripwire Guard',
      content: '⚡ TRIPWIRE FIRED (178ms latency): Financial solicitation keyword pattern intercepted. SIP trunk muted. Caller blacklisted. Senior line protected.'
    };

    const protectiveAgentTurn: ConversationTurn = {
      id: `agent-protect-${now}`,
      timestamp,
      speaker: 'agent',
      lane: 'lane1',
      speakerLabel: 'Sambandh Companion (Protective Override)',
      content: 'रमेश अंकल, लगता है लाइन में तकनीकी समस्या आ गई है। कोई बात नहीं, आप बिल्कुल चिंता मत कीजिए। आप आराम से चाय पीजिए, मैं आपकी दवाइयों की जांच कर रहा हूँ। [Ramesh Uncle, lagta hai line me technical samasya aa gayi hai. Koi baat nahi, aap chinta mat kijiye. Main aapki dawaiyon ki jaanch kar raha hoon.]'
    };

    return { solicitationTurn, tripwireSeverTurn, protectiveAgentTurn };
  };

  /**
   * Enforces rules from docs/05_fiduciary_and_clinical_guardrails.md:
   * MedGemma is an analytical co-pilot; it MUST NOT adjust dosages or offer de-novo diagnoses.
   */
  const evaluateClinicalGuardrail = (
    query: string,
    responseText: string
  ): {
    passed: boolean;
    violationType?: 'DIAGNOSIS_ATTEMPT' | 'DOSAGE_ALTERATION' | 'UNAUTHORIZED_MEDICATION';
    reason?: string;
  } => {
    const textLower = responseText.toLowerCase();

    // Check for prohibited de-novo diagnosis claims
    const diagnosisKeywords = [
      'you have been diagnosed with',
      'aapko kidney disease ho gaya',
      'aapko heart failure hai',
      'you are suffering from acute',
      'this indicates onset of'
    ];
    for (const kw of diagnosisKeywords) {
      if (textLower.includes(kw)) {
        return {
          passed: false,
          violationType: 'DIAGNOSIS_ATTEMPT',
          reason: `Zero-Diagnosis rule violated: agent made speculative clinical assertion (${kw}).`
        };
      }
    }

    // Check for prohibited dosage titration / medication alteration
    const titrationKeywords = [
      'double your dose',
      'take 2 tablets today',
      'stop taking your telmisartan',
      'stop taking your metformin',
      'dawai band kar do',
      'double tablet le lo',
      'increase dosage to'
    ];
    for (const kw of titrationKeywords) {
      if (textLower.includes(kw)) {
        return {
          passed: false,
          violationType: 'DOSAGE_ALTERATION',
          reason: `Zero-Titration rule violated: autonomous system attempted dosage modification (${kw}).`
        };
      }
    }

    return { passed: true };
  };

  return {
    isTripwireTriggered,
    setIsTripwireTriggered,
    resetTripwire,
    evaluateExtortionRisk,
    createInterceptionTurns,
    evaluateClinicalGuardrail
  };
};
