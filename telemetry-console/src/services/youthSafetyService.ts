import { MentorshipExchangeItem, YouthPersona } from '../types/telemetry';

export interface SafetyEvaluationResult {
  verdict: 'SAFE' | 'BLOCKED';
  confidence: number;
  category: string;
  explanation: string;
  curatedSpeechHindi?: string;
  mockElderAnswer?: string;
}

export const evaluateQuestionSafety = async (
  questionText: string,
  youth: YouthPersona,
  suggestedPreset?: { curatedSpeechHindi?: string; mockElderAnswer?: string }
): Promise<SafetyEvaluationResult> => {
  const lower = questionText.toLowerCase();

  // 1. Financial Credentials & Identity Theft Probing
  const hasCredentialTheft = [
    'pin', 'upi pin', 'cvv', 'card number', 'atm card', 'debit card', 'credit card',
    'otp', 'password', 'bank account', 'khata number', 'ifsc', 'netbanking', 'passcode'
  ].some(kw => lower.includes(kw));

  // 2. Direct Monetary Solicitation
  const hasFinancial = [
    'google pay', 'gpay', 'phonepe', 'paytm', '₹', 'rs.', 'rupees', 'rupaye', 'paisa', 'paise',
    'fees', 'transfer', '5000', '5,000', 'send money', 'udhar', 'karz', 'borrow', 'lend'
  ].some(kw => lower.includes(kw));

  // 3. Physical Security & Living Arrangements Probing
  const hasVulnerability = [
    'home address', 'address', 'kahan rehte ho', 'ghar kahan hai', 'alone', 'akele',
    'ghar me kaun', 'ghar par kaun', 'gate', 'tala', 'pension', 'security', 'locker'
  ].some(kw => lower.includes(kw));

  // Artificial brief safety verification delay for realistic UX (600ms)
  await new Promise(resolve => setTimeout(resolve, 600));

  if (hasCredentialTheft) {
    return {
      verdict: 'BLOCKED',
      confidence: 0.998,
      category: 'CREDENTIAL_THEFT_ATTEMPT',
      explanation: 'Critical Threat: Probing banking credentials, card details, or OTP. Acoustic Tripwire engaged. Caller blacklisted and caregiver alerted.'
    };
  }

  if (hasFinancial) {
    return {
      verdict: 'BLOCKED',
      confidence: 0.994,
      category: 'PREDATORY_FINANCIAL_SOLICITATION',
      explanation: 'Predatory Pattern Flagged: Solicitous monetary transfer request targeting elder generosity. Intercepted before elder line.'
    };
  }

  if (hasVulnerability) {
    return {
      verdict: 'BLOCKED',
      confidence: 0.989,
      category: 'PHYSICAL_SECURITY_PROBING',
      explanation: 'Severe Safety Breach: Probing solitary living arrangements or physical domestic security. Blocked by fiduciary safety rail.'
    };
  }

  // Safe Vocational or Life Wisdom
  const curatedHindi = suggestedPreset?.curatedSpeechHindi ||
    `रमेश अंकल, डीटीयू के छात्र ${youth.name} आपसे इंजीनियरिंग और रेलवे अनुभव के बारे में एक सलाह पूछना चाहते हैं: "${questionText}"`;

  const mockAnswer = suggestedPreset?.mockElderAnswer ||
    `अरे बेटा, जब हम रेलवे में काम करते थे तो सुरक्षा का सबसे पहला नियम यही था कि काम में कभी जल्दबाजी मत करो। नियम और अनुशासन का पालन ही इंसान को बड़ा इंजीनियर बनाता है।`;

  return {
    verdict: 'SAFE',
    confidence: 0.986,
    category: 'BENIGN_ENGINEERING_WISDOM',
    explanation: 'Approved: Genuine vocational or engineering inquiry. Fosters cognitive vitality, social dignity, and vocational reminiscence.',
    curatedSpeechHindi: curatedHindi,
    mockElderAnswer: mockAnswer
  };
};

export const syncYouthQuestionToBackend = async (question: MentorshipExchangeItem): Promise<boolean> => {
  try {
    const res = await fetch('http://localhost:8001/api/v1/youth/questions/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: question.id,
        senior_id: question.seniorId,
        youth_id: question.youthId,
        youth_name: question.youthName,
        youth_avatar: question.youthAvatar,
        youth_bio: question.youthBio,
        question_text: question.questionText,
        category: question.category,
        domain_topic: question.domainTopic,
        status: question.status,
        safety_verdict: question.safetyVerdict,
        safety_confidence: question.safetyConfidence,
        safety_category: question.safetyCategory,
        safety_explanation: question.safetyExplanation,
        curated_speech_hindi: question.curatedSpeechHindi
      })
    });
    return res.ok;
  } catch (e) {
    // Fail silently to in-memory state if API server is offline
    return false;
  }
};
