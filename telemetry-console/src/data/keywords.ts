/**
 * Shared Hindi/Hinglish Keyword Dictionaries
 * Single source of truth for domain keyword detection used across:
 * - LLM contextual fallback responses (llmService.ts)
 * - Dynamic execution node tagging (TelemetryContext.tsx)
 * - Tripwire fraud detection (TelemetryContext.tsx)
 */

export const MEDICATION_KEYWORDS = [
  'dawa', 'dawai', 'goli', 'pill', 'medicine', 'telmisartan',
  'parcha', 'parchi', 'khatam', 'bachi', 'refill', 'stock',
  'दवा', 'दवाई', 'गोली', 'पर्चा', 'पर्ची', 'खत्म',
  'बची', 'खुराक', 'बीपी की गोली'
];

export const SYMPTOM_KEYWORDS = [
  'dard', 'ghutna', 'ghutne', 'pain', 'knee', 'stiff',
  'jakdan', 'sair', 'walk', 'chakkar', 'tabiyat', 'sujan',
  'sir dard', 'headache', 'dizziness', 'weakness',
  'दर्द', 'घुटना', 'घुटने', 'जकड़न', 'सैर', 'तबीयत', 'चक्कर', 'कमर'
];

export const FINANCIAL_KEYWORDS = [
  'paise', 'paisa', 'pension', 'bank', 'account', 'khata',
  'debit', 'mandate', 'pine labs', 'upi', 'rupaye', 'bill',
  '840', 'payment',
  'पैसे', 'पेंशन', 'बैंक', 'खाता', 'रुपये', 'ओटीपी'
];

export const FAMILY_KEYWORDS = [
  'priya', 'beti', 'bitiya', 'daughter', 'bangalore', 'family',
  'bachhe', 'caregiver', 'telegram',
  'प्रिया', 'बिटिया', 'बेटी', 'बंगलौर', 'परिवार'
];

export const LOGISTICS_KEYWORDS = [
  'delivery', 'courier', 'dispatch', 'darkstore', 'bhej',
  'पहुंच'
];

export const BREAKFAST_KEYWORDS = [
  'nashta', 'chai', 'tea', 'breakfast', 'daliya', 'khana',
  'doodh',
  'नाश्ता', 'चाय', 'दलिया', 'दूध', 'रोटी', 'खाना'
];

export const GENERIC_ORDER_KEYWORDS = [
  'flower', 'phool', 'puja', 'pooja', 'mala', 'prasad', 'amazon',
  'mcp', 'order', 'manga', 'bhejo', 'mangalwariya', 'mandir',
  'फूल', 'पूजा', 'माला', 'प्रसाद', 'अमेज़न', 'मंगवा', 'ऑर्डर'
];

export const SADNESS_KEYWORDS = [
  'sad', 'udas', 'udaas', 'akele', 'akela', 'rona', 'man nahi',
  'mann nahi lag raha', 'depressed', 'low', 'unhappy', 'dil nahi lag raha',
  'उदास', 'अकेला', 'रोना', 'मन नहीं लग रहा', 'दिल नहीं लग रहा'
];

export const GREETING_KEYWORDS = [
  'haan', 'theek', 'accha', 'namaste', 'pranam', 'shukriya',
  'dhanyawad', 'hello',
  'हाँ', 'हाँजी', 'ठीक', 'अच्छा', 'नमस्ते', 'प्रणाम', 'धन्यवाद'
];

/**
 * Tests whether the given text contains any keyword from the provided list.
 * Case-insensitive matching.
 */
export const matchesKeywords = (text: string, keywords: string[]): boolean => {
  const lower = text.toLowerCase();
  return keywords.some(kw => lower.includes(kw));
};

/**
 * Default structured memory ledger — single source of truth
 * Used as initial state in TelemetryContext and as fallback in foldConversationMemory.
 */
export const DEFAULT_MEMORY_LEDGER = `• [Patient Profile]: Ramesh Chandra (74, Rohini, Delhi); retired Northern Railway supervisor.
• [Primary Caregiver]: Daughter Priya Sharma (Bangalore); linked to daily care summary.
• [Clinical Baseline]: Hypertension (Telma 40 OD), Type 2 Diabetes (Metformin 500 BD); ABDM record active.
• [Fiduciary Boundary]: Autonomous refill pre-authorization active up to ₹4,500 monthly limit.
• [Session State]: Morning check-in active; listening attentively to elder's morning report.`;
