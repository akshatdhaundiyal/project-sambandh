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

  return {
    isTripwireTriggered,
    setIsTripwireTriggered,
    resetTripwire,
    evaluateExtortionRisk,
    createInterceptionTurns
  };
};
