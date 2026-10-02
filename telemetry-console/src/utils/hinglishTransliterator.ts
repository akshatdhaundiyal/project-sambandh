/**
 * Project Sambandh Indic Phonetic Transliteration Engine
 * Converts Romanized Hinglish (Latin alphabet) into Devanagari Hindi script.
 * 
 * Purpose: Standard TTS engines (Microsoft Windows hi-IN, WhisperFlo, Azure, Google)
 * sound robotic or unintelligible when given Romanized Hinglish.
 * When converted to Devanagari, the Hindi voices pronounce words with 100% natural phonetics.
 */

// Detect if text already contains Devanagari characters
export const isDevanagari = (text: string): boolean => {
  return /[\u0900-\u097F]/.test(text);
};

// Curated high-frequency dictionary for conversational Awadhi/Hindi care companion dialogue
const HINGLISH_DICTIONARY: Record<string, string> = {
  // Greetings & Pronouns
  namaste: 'नमस्ते',
  pranam: 'प्रणाम',
  pranaam: 'प्रणाम',
  uncle: 'अंकल',
  ji: 'जी',
  beta: 'बेटा',
  bitiya: 'बिटिया',
  papa: 'पापा',
  bahu: 'बहू',
  didi: 'दीदी',
  bhaiya: 'भैया',
  aap: 'आप',
  aapka: 'आपका',
  aapki: 'आपकी',
  aapke: 'आपके',
  hum: 'हम',
  humara: 'हमारा',
  humari: 'हमारी',
  main: 'मैं',
  mera: 'मेरा',
  meri: 'मेरी',
  mere: 'मेरे',
  tum: 'तुम',
  tumhara: 'तुम्हारा',
  woh: 'वो',
  unka: 'उनका',
  unki: 'उनकी',
  unhe: 'उन्हें',

  // Medical, Health & Vitals
  dawai: 'दवाई',
  dawa: 'दवा',
  dawaiyaan: 'दवाइयां',
  goli: 'गोली',
  goliya: 'गोलियां',
  goliyan: 'गोलियां',
  bp: 'बीपी',
  sugar: 'शुगर',
  dard: 'दर्द',
  seene: 'सीने',
  chhati: 'छाती',
  bhaaripan: 'भारीपन',
  chakkar: 'चक्कर',
  doctor: 'डॉक्टर',
  dr: 'डॉक्टर',
  hospital: 'अस्पताल',
  ambulance: 'एम्बुलेंस',
  report: 'रिपोर्ट',
  tabiyat: 'तबीयत',
  swasthya: 'स्वास्थ्य',
  aram: 'आराम',
  aaram: 'आराम',
  neend: 'नींद',
  saans: 'सांस',

  // Food, Routine & Time
  subah: 'सुबह',
  shaam: 'शाम',
  dopahar: 'दोपहर',
  raat: 'रात',
  aaj: 'आज',
  kal: 'कल',
  parso: 'परसों',
  chai: 'चाय',
  pani: 'पानी',
  nashta: 'नाश्ता',
  khana: 'खाना',
  bhookh: 'भूख',
  doodh: 'दूध',
  minute: 'मिनट',
  ghante: 'घंटे',
  baje: 'बजे',

  // Colors & Attributes
  laal: 'लाल',
  lal: 'लाल',
  neeli: 'नीली',
  nili: 'नीली',
  peeli: 'पीली',
  pili: 'पीली',
  safed: 'सफ़ेद',
  hari: 'हरी',
  chhoti: 'छोटी',
  badi: 'बड़ी',
  naya: 'नया',
  nayi: 'नयी',

  // Common Verbs & Conversational Particles
  haan: 'हाँ',
  han: 'हाँ',
  ha: 'हाँ',
  nahi: 'नहीं',
  nahin: 'नहीं',
  na: 'ना',
  theek: 'ठीक',
  thik: 'ठीक',
  accha: 'अच्छा',
  achha: 'अच्छा',
  sahi: 'सही',
  badhiya: 'बढ़िया',
  kya: 'क्या',
  kaise: 'कैसे',
  kaisa: 'कैसा',
  kaisi: 'कैसी',
  kyun: 'क्यों',
  kyu: 'क्यों',
  kab: 'कब',
  kahan: 'कहाँ',
  le: 'ले',
  li: 'ली',
  liye: 'लिये',
  liya: 'लिया',
  di: 'दी',
  diya: 'दिया',
  diye: 'दिये',
  rakh: 'रख',
  rakha: 'रखा',
  rakhi: 'रखी',
  hai: 'है',
  hain: 'हैं',
  tha: 'था',
  thi: 'थी',
  the: 'थे',
  hoga: 'होगा',
  hogi: 'होगी',
  honge: 'होंगे',
  ho: 'हो',
  gaya: 'गया',
  gayi: 'गयी',
  gaye: 'गये',
  aaya: 'आया',
  aayi: 'आई',
  aaye: 'आए',
  aayega: 'आएगा',
  aayegi: 'आएगी',
  karo: 'करो',
  kijiye: 'कीजिये',
  kariye: 'करिये',
  boliye: 'बोलिये',
  batao: 'बताओ',
  bataye: 'बताइये',
  bataiye: 'बताइये',
  sunaye: 'सुनाइये',
  sunao: 'सुनाओ',
  suno: 'सुनो',
  mat: 'मत',
  chinta: 'चिंता',
  ghabraiye: 'घबराइये',
  bilkul: 'बिल्कुल',
  shukriya: 'शुक्रिया',
  dhanyawad: 'धन्यवाद',
  alvida: 'अलविदा',

  // Logistics, Delivery & Modern Indian Services
  delhivery: 'डिलीवरी',
  delivery: 'डिलीवरी',
  boy: 'बॉय',
  agent: 'एजेंट',
  parcel: 'पार्सल',
  package: 'पैकेज',
  pinelabs: 'पाइन लैब्स',
  otp: 'ओटीपी',
  sms: 'एसएमएस',
  phone: 'फ़ोन',
  call: 'कॉल',
  alert: 'अलर्ट',
  paisa: 'पैसा',
  paise: 'पैसे',
  rupaye: 'रुपये',
  rupees: 'रुपये',
  rs: 'रुपये',
  bank: 'बैंक',
  delhi: 'दिल्ली',
  lucknow: 'लखनऊ',
  kanpur: 'कानपुर',
  varanasi: 'वाराणसी'
};

// Common character mappings for fallback phonetic transliteration
const CONSONANTS: Record<string, string> = {
  k: 'क', kh: 'ख', g: 'ग', gh: 'घ',
  ch: 'च', chh: 'छ', j: 'ज', jh: 'झ',
  t: 'त', th: 'थ', d: 'द', dh: 'ध', n: 'न',
  p: 'प', ph: 'फ', f: 'फ', b: 'ब', bh: 'भ', m: 'म',
  y: 'य', r: 'र', l: 'ल', v: 'व', w: 'व',
  sh: 'श', s: 'स', h: 'ह', z: 'ज़'
};

const VOWEL_MATRAS: Record<string, string> = {
  aa: 'ा', a: '', i: 'ि', ee: 'ी', u: 'ु', oo: 'ू', e: 'े', ai: 'ै', o: 'ो', au: 'ौ'
};

const INITIAL_VOWELS: Record<string, string> = {
  aa: 'आ', a: 'अ', i: 'इ', ee: 'ई', u: 'उ', oo: 'ऊ', e: 'ए', ai: 'ऐ', o: 'ओ', au: 'औ'
};

/**
 * Phonetically transliterate a single Romanized Hinglish word into Devanagari
 */
export const transliterateWord = (rawWord: string): string => {
  // Strip punctuation around word
  const match = rawWord.match(/^([^a-zA-Z0-9]*)([a-zA-Z0-9]+)([^a-zA-Z0-9]*)$/);
  if (!match) return rawWord;

  const [, leadingPunct, coreWord, trailingPunct] = match;
  const lowerCore = coreWord.toLowerCase();

  // 1. Direct dictionary match
  if (HINGLISH_DICTIONARY[lowerCore]) {
    return `${leadingPunct}${HINGLISH_DICTIONARY[lowerCore]}${trailingPunct}`;
  }

  // 2. If it's a number, preserve digits
  if (/^\d+$/.test(coreWord)) {
    return rawWord;
  }

  // 3. Fallback rule-based phonetic transliteration
  let result = '';
  let i = 0;
  const len = lowerCore.length;
  let isStartOfWord = true;

  while (i < len) {
    // Check 3-char, 2-char, 1-char combinations
    const char3 = lowerCore.substring(i, i + 3);
    const char2 = lowerCore.substring(i, i + 2);
    const char1 = lowerCore.substring(i, i + 1);

    if (isStartOfWord) {
      if (INITIAL_VOWELS[char2]) {
        result += INITIAL_VOWELS[char2];
        i += 2;
        isStartOfWord = false;
        continue;
      } else if (INITIAL_VOWELS[char1]) {
        result += INITIAL_VOWELS[char1];
        i += 1;
        isStartOfWord = false;
        continue;
      }
    }

    // Check consonant digraphs
    if (CONSONANTS[char3]) {
      result += CONSONANTS[char3];
      i += 3;
      isStartOfWord = false;
      continue;
    } else if (CONSONANTS[char2]) {
      result += CONSONANTS[char2];
      i += 2;
      isStartOfWord = false;
      continue;
    } else if (CONSONANTS[char1]) {
      result += CONSONANTS[char1];
      i += 1;
      isStartOfWord = false;
      continue;
    }

    // Check vowel matras following consonant
    if (VOWEL_MATRAS[char2]) {
      result += VOWEL_MATRAS[char2];
      i += 2;
      continue;
    } else if (VOWEL_MATRAS[char1] !== undefined) {
      result += VOWEL_MATRAS[char1];
      i += 1;
      continue;
    }

    // If nothing matched, carry forward char
    result += char1;
    i += 1;
  }

  return `${leadingPunct}${result || coreWord}${trailingPunct}`;
};

/**
 * Converts a full sentence from Hinglish (or mixed) into fluent Devanagari Hindi.
 * If the sentence is already in Devanagari, it is returned untouched.
 */
export const hinglishToDevanagari = (text: string): string => {
  if (!text || !text.trim()) return '';

  // If text is primarily Devanagari already, preserve it!
  const devanagariMatches = text.match(/[\u0900-\u097F]/g);
  if (devanagariMatches && devanagariMatches.length > text.length * 0.4) {
    return text;
  }

  // Tokenize preserving spaces and newlines
  const words = text.split(/(\s+)/);
  return words
    .map(token => {
      if (/^\s+$/.test(token)) return token;
      return transliterateWord(token);
    })
    .join('');
};

/**
 * Normalizes input text into Devanagari so Hindi TTS sounds 100% authentic
 */
export const prepareTextForHindiTts = (text: string): {
  original: string;
  devanagari: string;
  isTransliterated: boolean;
} => {
  const isAlreadyHindi = isDevanagari(text);
  const devanagari = isAlreadyHindi ? text : hinglishToDevanagari(text);
  return {
    original: text,
    devanagari,
    isTransliterated: !isAlreadyHindi
  };
};
