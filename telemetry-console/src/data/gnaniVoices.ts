/**
 * Gnani.ai Vachana Voice Persona Catalog (timbre-v2.5)
 * Comprehensive directory of Indic voice personas with rich clinical/companion descriptions.
 */

export interface GnaniVoicePersona {
  id: string; // The exact voice parameter expected by api.vachana.ai (e.g. 'Aarohi', 'Deepak')
  name: string;
  gender: 'female' | 'male';
  languageCode: string; // 'hi-IN', 'awa-IN', 'en-IN', 'ta-IN', etc.
  languageLabel: string;
  category: 'companion' | 'senior' | 'clinical' | 'all';
  personaTitle: string;
  description: string;
  samplePhrase: string;
  isRecommendedCompanion?: boolean;
  isRecommendedSenior?: boolean;
}

export const GNANI_VOICE_CATALOG: GnaniVoicePersona[] = [
  // ==========================================
  // COMPANION FEMALE VOICES (Primary & Secondary)
  // ==========================================
  {
    id: 'Aarohi',
    name: 'Aarohi (आरोही)',
    gender: 'female',
    languageCode: 'hi-IN',
    languageLabel: 'Hindi / Awadhi (hi-IN)',
    category: 'companion',
    personaTitle: 'Warm Elder Companion & Affectionate Niece',
    description: 'Natural, warm, and highly expressive young-adult female voice with authentic Awadhi-Hindi cadence. Perfect for affectionate daily check-ins, laughing at lighthearted jokes, and gentle medicine reminders.',
    samplePhrase: 'प्रणाम रमेश अंकल! सुबह की ताज़ा अदरक वाली चाय और दवाई हो गई आपकी?',
    isRecommendedCompanion: true
  },
  {
    id: 'Gauri',
    name: 'Gauri (गौरी)',
    gender: 'female',
    languageCode: 'hi-IN',
    languageLabel: 'Hindi (hi-IN)',
    category: 'companion',
    personaTitle: 'Gentle Caregiver & Empathy Specialist',
    description: 'Soft-spoken, deeply soothing, and patient tone. Specially tuned for elderly health check-ups, acknowledging pain or stiffness, and offering calm reassurance.',
    samplePhrase: 'नमस्ते अंकल जी, घुटने की तकलीफ का खास ख्याल रखिएगा। गुनगुने पानी की सिकाई कर लीजिए।',
  },
  {
    id: 'Radhika',
    name: 'Radhika (राधिका)',
    gender: 'female',
    languageCode: 'hi-IN',
    languageLabel: 'Hindi / Hinglish (hi-IN)',
    category: 'companion',
    personaTitle: 'Cheerful & Respectful Family Voice',
    description: 'Upbeat, respectful, and vibrant cadence. Enthusiastically brings up morning news, park walks, and old memories of Northern Railway.',
    samplePhrase: 'अंकल जी, आज रोहिणी में धूप बहुत खिली हुई है! बालकनी में थोड़ी देर बैठिएगा।',
  },
  {
    id: 'Janaki',
    name: 'Janaki (जानकी)',
    gender: 'female',
    languageCode: 'hi-IN',
    languageLabel: 'Hindi (hi-IN)',
    category: 'clinical',
    personaTitle: 'Calm Clinical Healthcare Coordinator',
    description: 'Clear, reassuring, and articulate voice with clinical precision. Ideal for reviewing doctor prescriptions, lab orders, and vitals tracking.',
    samplePhrase: 'रमेश जी, डॉक्टर अरविंद सक्सेना जी के नए पर्चे के अनुसार आपकी दवा समय से ले ली गई है।',
  },
  {
    id: 'Nalini',
    name: 'Nalini (नलिनी)',
    gender: 'female',
    languageCode: 'hi-IN',
    languageLabel: 'Hindi / Awadhi (hi-IN)',
    category: 'companion',
    personaTitle: 'Dignified Matriarch & Storyteller',
    description: 'Mature, dignified, and comforting maternal voice. Brings nostalgic warmth when listening to senior stories and classic ghazals.',
    samplePhrase: 'अरे वाह! मुझे आपके पुराने रेलवे के किस्से और रफी साहब के गीतों की बातें सुनना बहुत पसंद है।',
  },
  {
    id: 'Chitra',
    name: 'Chitra (चित्रा)',
    gender: 'female',
    languageCode: 'hi-IN',
    languageLabel: 'Hindi (hi-IN)',
    category: 'companion',
    personaTitle: 'Sweet-Toned Traditional Companion',
    description: 'Gentle and melodious Indian tone with respectful honorifics like "प्रणाम अंकल जी".',
    samplePhrase: 'प्रणाम अंकल, प्रिया बिटिया ने बैंगलोर से आपके स्वास्थ्य का हालचाल पूछा है।',
  },
  {
    id: 'Kaveri',
    name: 'Kaveri (कावेरी)',
    gender: 'female',
    languageCode: 'en-IN',
    languageLabel: 'Indian English / Hinglish',
    category: 'companion',
    personaTitle: 'Bilingual Care Telephony Specialist',
    description: 'Polished Indian English and Hinglish cadence with crisp phonetics for bilingual households.',
    samplePhrase: 'Good morning Ramesh Uncle! Just checking in to confirm your morning breakfast and Telma 40.',
  },

  // ==========================================
  // SENIOR MALE VOICES (Papa / Senior Playback)
  // ==========================================
  {
    id: 'Deepak',
    name: 'Deepak (दीपक)',
    gender: 'male',
    languageCode: 'hi-IN',
    languageLabel: 'Hindi / Awadhi (hi-IN)',
    category: 'senior',
    personaTitle: 'Respectful Senior Veteran & Papa',
    description: 'Warm, mature, grounded Indian male voice with natural pause cadence. Represents 74-year-old retired railway inspector Ramesh Chandra authentically.',
    samplePhrase: 'हाँ बेटा, सुबह वाली नाश्ते के बाद की लाल गोली मैंने ताज़े पानी से ले ली है।',
    isRecommendedSenior: true
  },
  {
    id: 'Vikrant',
    name: 'Vikrant (विक्रांत)',
    gender: 'male',
    languageCode: 'hi-IN',
    languageLabel: 'Hindi (hi-IN)',
    category: 'companion',
    personaTitle: 'Caring Son & Attentive Escort',
    description: 'Dependable, warm, and affectionate male voice. Great for senior check-ins when preferring a male companion persona.',
    samplePhrase: 'प्रणाम पापा जी! बताइए आज जापानी पार्क में टहलने का कैसा रहा?',
  },
  {
    id: 'Omkar',
    name: 'Omkar (ओंकार)',
    gender: 'male',
    languageCode: 'hi-IN',
    languageLabel: 'Hindi (hi-IN)',
    category: 'senior',
    personaTitle: 'Wise Elder Colleague',
    description: 'Deep, resonant, and experienced elder male timbre. Reflects veteran seniority with warmth and presence.',
    samplePhrase: 'अरे 40 साल रेलवे में सिग्नल और इंजन देखा है हमने! आज की व्यवस्था भी बढ़िया है।',
  },
  {
    id: 'Farhan',
    name: 'Farhan (फरहान)',
    gender: 'male',
    languageCode: 'hi-IN',
    languageLabel: 'Hinglish / Hindi',
    category: 'companion',
    personaTitle: 'Friendly Youth Mentee & Guide',
    description: 'Energetic, polite, and respectful tone of an enthusiastic student learning from Papa’s engineering wisdom.',
    samplePhrase: 'नमस्ते अंकल, मैं रेलवे लोकोमोटिव मेंटेनेंस के बारे में आपकी सलाह जानना चाहता था।',
  },
  {
    id: 'Gaurav',
    name: 'Gaurav (गौरव)',
    gender: 'male',
    languageCode: 'hi-IN',
    languageLabel: 'Hindi (hi-IN)',
    category: 'companion',
    personaTitle: 'Helpful Community Volunteer',
    description: 'Bright and respectful young male voice assisting with local pharmacy orders and delivery alerts.',
    samplePhrase: 'अंकल जी, अपोलो सेक्टर 11 से आपकी बीपी की दवा का पैकेट आज दोपहर तक आ जाएगा।',
  }
];

export const DEFAULT_COMPANION_VOICE = 'Aarohi';
export const DEFAULT_SENIOR_VOICE = 'Deepak';

export const getGnaniCompanionVoice = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sambandh_gnani_companion_voice');
    if (saved && GNANI_VOICE_CATALOG.some(v => v.id === saved)) {
      return saved;
    }
  }
  return DEFAULT_COMPANION_VOICE;
};

export const setGnaniCompanionVoice = (voiceId: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sambandh_gnani_companion_voice', voiceId);
  }
};

export const getGnaniSeniorVoice = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('sambandh_gnani_senior_voice');
    if (saved && GNANI_VOICE_CATALOG.some(v => v.id === saved)) {
      return saved;
    }
  }
  return DEFAULT_SENIOR_VOICE;
};

export const setGnaniSeniorVoice = (voiceId: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sambandh_gnani_senior_voice', voiceId);
  }
};
