/**
 * Shared Hindi/Hinglish Keyword Dictionaries
 * Single source of truth for domain keyword detection used across:
 * - LLM contextual fallback responses (llmService.ts)
 * - Dynamic execution node tagging (TelemetryContext.tsx)
 * - Tripwire fraud detection (TelemetryContext.tsx)
 */

export const CRITICAL_EMERGENCY_KEYWORDS = [
  'seene me dard', 'seene mein dard', 'chest pain', 'saans phool', 'saans lene me',
  'chhati me dard', 'heart attack', 'seena bhaari', 'सीने में दर्द', 'सांस फूल', 'साँस फूल', 'छाती में दर्द'
];

export const FALL_KEYWORDS = [
  'gir gaya', 'gir gaye', 'bathroom me gir', 'bathroom mein gir', 'uth nahi pa raha',
  'uth nahi pa rahe', 'gira hua', 'fars par gir', 'chot lag gayi', 'गिर गया', 'फर्श पर गिर', 'उठ नहीं पा रहा', 'चोट लग गई'
];

export const MEDICATION_STOP_KEYWORDS = [
  'band kar di', 'dawai band', 'dawa band', 'goli band', 'chhod di', 'nahi le raha',
  'rok di', 'दवा बंद', 'दवाई बंद', 'गोली बंद', 'छोड़ दी', 'रोक दी'
];

export const ADHERENCE_CONFIRMATION_KEYWORDS = [
  'le li', 'kha li', 'le li thi', 'kha li thi', 'goli le li', 'dawa le li', 'dawai le li',
  'subah ki goli', 'le chuka', 'kha chuka', 'ले ली', 'खा ली', 'ले ली थी', 'खा ली थी'
];

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
  'rohan', 'beta', 'son', 'bangalore', 'family',
  'bachhe', 'caregiver', 'telegram',
  'रोहन', 'बेटा', 'बंगलौर', 'परिवार'
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

export const NEWS_KEYWORDS = [
  'khabar', 'news', 'park', 'metro', 'vande bharat', 'railway', 'train',
  'fountain', 'track', 'akhbar', 'development', 'opinion', 'vichaar',
  'खबर', 'अखबार', 'पार्क', 'मेट्रो', 'ट्रेन', 'रेलवे', 'विचार'
];

export const WEATHER_KEYWORDS = [
  'mausam', 'weather', 'dhoop', 'thand', 'fog', 'hawa', 'barish', 'balcony',
  'मौसम', 'धूप', 'ठंड', 'हवा', 'बारिश', 'बालकनी'
];

export const JOKE_KEYWORDS = [
  'joke', 'chutkula', 'hansi', 'mazaak', 'haso', 'hasna',
  'चुटकुला', 'मज़ाक', 'हंसी', 'हँसना'
];

export const INTEREST_KEYWORDS = [
  'hobby', 'interest', 'locomotive', 'engine', 'signal', 'rafi', 'ghazal',
  'gaana', 'shauk', 'gardening', 'tulsi', 'swarn jayanti', 'workshop',
  'शौक', 'गाना', 'ग़ज़ल', 'इंजन', 'सिग्नल', 'वर्कशॉप', 'बागवानी'
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
export const DEFAULT_MEMORY_LEDGER = `• [Patient Profile]: Ramesh Chandra (72, Rohini, Delhi); retired Northern Railway supervisor.
• [Primary Caregiver]: Son Rohan Sharma (Bengaluru); linked to daily care summary.
• [Clinical Baseline]: Hypertension (Telma 40 OD), Type 2 Diabetes (Metformin 500 BD); ABDM record active.
• [Fiduciary Boundary]: Autonomous refill pre-authorization active up to ₹4,500 monthly limit.
• [Session State]: Morning check-in active; listening attentively to elder's morning report.`;
