/**
 * Project Sambandh — Companion Conversational Sparks & Vernacular Lore
 * Provides randomized greetings, local news & opinion sparks, wholesome elder humor,
 * weather commentary, subtle adherence bridges, and elder topics of interest.
 */
import { ElderTopicOfInterest } from '../types/telemetry';

export interface ConversationalGreeting {
  id: string;
  category: 'weather' | 'local_news' | 'nostalgia' | 'humor' | 'routine';
  devanagariText: string;
  hinglishText: string;
  fullTurnText: string;
}

export const RANDOM_COMPANION_GREETINGS: ConversationalGreeting[] = [
  {
    id: 'greet-weather-balcony',
    category: 'weather',
    devanagariText: 'प्रणाम रमेश अंकल जी! कैसे हैं आप आज सुबह? आज बालकनी में ताज़ा चाय हो गई आपकी?',
    hinglishText: 'Pranam Ramesh Uncle Ji! Kaise hain aap aaj subah? Aaj balcony me taaza chai ho gayi aapki?',
    fullTurnText: 'प्रणाम रमेश अंकल जी! कैसे हैं आप आज सुबह? आज बालकनी में ताज़ा चाय हो गई आपकी? [Pranam Ramesh Uncle Ji! Kaise hain aap aaj subah? Aaj balcony me taaza chai ho gayi aapki?]'
  },
  {
    id: 'greet-local-news-park',
    category: 'local_news',
    devanagariText: 'नमस्ते अंकल जी! आज सुबह पार्क में सैर कैसी रही आपकी? तबीयत बिल्कुल ठीक है ना?',
    hinglishText: 'Namaste Uncle Ji! Aaj subah park me sair kaisi rahi aapki? Tabiyat bilkul theek hai na?',
    fullTurnText: 'नमस्ते अंकल जी! आज सुबह पार्क में सैर कैसी रही आपकी? तबीयत बिल्कुल ठीक है ना? [Namaste Uncle Ji! Aaj subah park me sair kaisi rahi aapki? Tabiyat bilkul theek hai na?]'
  },
  {
    id: 'greet-railway-nostalgia',
    category: 'nostalgia',
    devanagariText: 'प्रणाम रमेश अंकल! आज सुबह आपकी याद आई। चाय-नाश्ता तसल्ली से हो गया आपका?',
    hinglishText: 'Pranam Ramesh Uncle! Aaj subah aapki yaad aayi. Chai-nashta tasalli se ho gaya aapka?',
    fullTurnText: 'प्रणाम रमेश अंकल! आज सुबह आपकी याद आई। चाय-नाश्ता तसल्ली से हो गया आपका? [Pranam Ramesh Uncle! Aaj subah aapki yaad aayi. Chai-nashta tasalli se ho gaya aapka?]'
  },
  {
    id: 'greet-humor-morning-walkers',
    category: 'humor',
    devanagariText: 'प्रणाम अंकल जी! शुभ प्रभात! आज दिन की शुरुआत कैसी रही आपकी?',
    hinglishText: 'Pranam Uncle ji! Shubh prabhat! Aaj din ki shuruat kaisi rahi aapki?',
    fullTurnText: 'प्रणाम अंकल जी! शुभ प्रभात! आज दिन की शुरुआत कैसी रही आपकी? [Pranam Uncle ji! Shubh prabhat! Aaj din ki shuruat kaisi rahi aapki?]'
  },
  {
    id: 'greet-warm-caring-daughter',
    category: 'routine',
    devanagariText: 'प्रणाम रमेश अंकल जी! संबंध से आपकी बिटिया बोल रही हूँ। बताइए, कैसे हैं आप आज?',
    hinglishText: 'Pranam Ramesh Uncle ji! Sambandh se aapki bitiya bol rahi hoon. Batayein, kaise hain aap aaj?',
    fullTurnText: 'प्रणाम रमेश अंकल जी! संबंध से आपकी बिटिया बोल रही हूँ। बताइए, कैसे हैं आप आज? [Pranam Ramesh Uncle ji! Sambandh se aapki bitiya bol rahi hoon. Batayein, kaise hain aap aaj?]'
  }
];

export interface TimeContextInfo {
  period: string;
  timeStr: string;
  sessionName: string;
}

export const getTimeContext = (date = new Date()): TimeContextInfo => {
  const hour = date.getHours();
  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

  if (hour >= 5 && hour < 12) {
    return {
      period: 'Morning',
      timeStr,
      sessionName: 'Morning Wellbeing & Adherence'
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      period: 'Afternoon',
      timeStr,
      sessionName: 'Afternoon Post-Lunch Check-in'
    };
  } else if (hour >= 17 && hour < 21) {
    return {
      period: 'Evening',
      timeStr,
      sessionName: 'Evening Companionship & Tea'
    };
  } else {
    return {
      period: 'Night',
      timeStr,
      sessionName: 'Night Routine & Rest'
    };
  }
};

export const getRandomCompanionGreeting = (date = new Date()): ConversationalGreeting => {
  const hour = date.getHours();

  if (hour >= 12 && hour < 17) {
    // Afternoon greetings
    const afternoonGreetings: ConversationalGreeting[] = [
      {
        id: 'greet-afternoon-lunch',
        category: 'routine',
        devanagariText: 'प्रणाम रमेश अंकल जी! दोपहर का भोजन आराम से हो गया आपका? तबीयत कैसी है आज?',
        hinglishText: 'Pranam Ramesh Uncle Ji! Dopahar ka bhojan aaram se ho gaya aapka? Tabiyat kaisi hai aaj?',
        fullTurnText: 'प्रणाम रमेश अंकल जी! दोपहर का भोजन आराम से हो गया आपका? तबीयत कैसी है आज? [Pranam Ramesh Uncle Ji! Dopahar ka bhojan aaram se ho gaya aapka? Tabiyat kaisi hai aaj?]'
      },
      {
        id: 'greet-warm-afternoon',
        category: 'routine',
        devanagariText: 'नमस्ते अंकल जी! संबंध से आपकी बिटिया बोल रही हूँ। बताइए, दिन कैसा बीत रहा है आपका?',
        hinglishText: 'Namaste Uncle ji! Sambandh se aapki bitiya bol rahi hoon. Batayein, din kaisa beet raha hai aapka?',
        fullTurnText: 'नमस्ते अंकल जी! संबंध से आपकी बिटिया बोल रही हूँ। बताइए, दिन कैसा बीत रहा है आपका? [Namaste Uncle ji! Sambandh se aapki bitiya bol rahi hoon. Batayein, din kaisa beet raha hai aapka?]'
      }
    ];
    return afternoonGreetings[Math.floor(Math.random() * afternoonGreetings.length)];
  } else if (hour >= 17 && hour < 21) {
    // Evening greetings
    const eveningGreetings: ConversationalGreeting[] = [
      {
        id: 'greet-evening-tea',
        category: 'routine',
        devanagariText: 'शुभ संध्या रमेश अंकल जी! शाम की चाय हो गई आपकी? आज का दिन कैसा बीता?',
        hinglishText: 'Shubh sandhya Ramesh Uncle Ji! Shaam ki chai ho gayi aapki? Aaj ka din kaisa beeta?',
        fullTurnText: 'शुभ संध्या रमेश अंकल जी! शाम की चाय हो गई आपकी? आज का दिन कैसा बीता? [Shubh sandhya Ramesh Uncle Ji! Shaam ki chai ho gayi aapki? Aaj ka din kaisa beeta?]'
      },
      {
        id: 'greet-evening-walk',
        category: 'local_news',
        devanagariText: 'नमस्ते अंकल जी! शाम को टहलने निकले थे या घर पर ही आराम किया? कैसे हैं आप?',
        hinglishText: 'Namaste Uncle Ji! Shaam ko tehalne nikle the ya ghar par hi aaram kiya? Kaise hain aap?',
        fullTurnText: 'नमस्ते अंकल जी! शाम को टहलने निकले थे या घर पर ही आराम किया? कैसे हैं आप? [Namaste Uncle Ji! Shaam ko tehalne nikle the ya ghar par hi aaram kiya? Kaise hain aap?]'
      }
    ];
    return eveningGreetings[Math.floor(Math.random() * eveningGreetings.length)];
  } else if (hour >= 21 || hour < 5) {
    // Night greetings
    const nightGreetings: ConversationalGreeting[] = [
      {
        id: 'greet-night-routine',
        category: 'routine',
        devanagariText: 'प्रणाम रमेश अंकल जी! रात का भोजन हो गया आपका? तबीयत बिल्कुल ठीक है ना?',
        hinglishText: 'Pranam Ramesh Uncle Ji! Raat ka bhojan ho gaya aapka? Tabiyat bilkul theek hai na?',
        fullTurnText: 'प्रणाम रमेश अंकल जी! रात का भोजन हो गया आपका? तबीयत बिल्कुल ठीक है ना? [Pranam Ramesh Uncle Ji! Raat ka bhojan ho gaya aapka? Tabiyat bilkul theek hai na?]'
      },
      {
        id: 'greet-night-warmth',
        category: 'routine',
        devanagariText: 'नमस्ते अंकल जी! बस आपकी खैरियत पूछने के लिए फ़ोन किया। दिन कैसा रहा आपका?',
        hinglishText: 'Namaste Uncle ji! Bas aapki khairiyat poochhne ke liye phone kiya. Din kaisa raha aapka?',
        fullTurnText: 'नमस्ते अंकल जी! बस आपकी खैरियत पूछने के लिए फ़ोन किया। दिन कैसा रहा आपका? [Namaste Uncle ji! Bas aapki khairiyat poochhne ke liye phone kiya. Din kaisa raha aapka?]'
      }
    ];
    return nightGreetings[Math.floor(Math.random() * nightGreetings.length)];
  } else {
    // Morning greetings
    return RANDOM_COMPANION_GREETINGS[Math.floor(Math.random() * RANDOM_COMPANION_GREETINGS.length)];
  }
};


export interface LocalNewsOpinionTopic {
  id: string;
  headline: string;
  locality: string;
  agentOpinionPrompt: string;
  elderContextHint: string;
}

export const LOCAL_NEWS_AND_OPINIONS: LocalNewsOpinionTopic[] = [
  {
    id: 'news-rohini-park-renovation',
    headline: 'Rohini Japanese Park New Musical Fountain & Walking Track',
    locality: 'Rohini Sector 14, Delhi',
    agentOpinionPrompt: 'अंकल जी, रोहिणी जापानी पार्क में नया वॉकवे बन गया है। कुछ लोग कहते हैं कि पहले वाला कच्चा ट्रैक पैरों के लिए ज़्यादा आरामदायक था। आपका क्या तजुर्बा है इसपर? [Uncle ji, Rohini park me naya walkway ban gaya hai. Aapka kya tajurba hai ispar?]',
    elderContextHint: 'Ramesh has taken morning walks in Japanese Park for 15+ years.'
  },
  {
    id: 'news-vande-bharat-modernization',
    headline: 'Indian Railways Launching New Sleeper Vande Bharat Trains',
    locality: 'Northern Railway / Delhi Division',
    agentOpinionPrompt: 'अंकल जी, रेलवे अब नए वंदे भारत स्लीपर कोच ला रहा है। आप तो 40 साल रेलवे में सिग्नल और मैकेनिकल व्यवस्था संभालते रहे हैं—आपको क्या लगता है, पुरानी राजधानी की तुलना में ये कैसे रहेंगे? [Uncle ji, Railway ab naye Vande Bharat sleeper coaches la raha hai. Aapka kya vichaar hai ispar?]',
    elderContextHint: 'Retired Chief Signal Inspector with deep technical pride in railway safety.'
  },
  {
    id: 'news-madhuban-metro-extension',
    headline: 'Delhi Metro Phase 4 Rithala to Narela Line Expansion',
    locality: 'Rohini / Outer Delhi Corridor',
    agentOpinionPrompt: 'अंकल जी, रिठाला से आगे नरेला वाली मेट्रो लाइन का काम तेज़ हो रहा है। आपके समय में जब रोहिणी नई-नई बसी थी, तब तो बसें भी मुश्किल से मिलती थीं ना? कितना बदलाव आ गया है!',
    elderContextHint: 'Witnessed Rohini transform from vacant plots to bustling urban hub since 1985.'
  },
  {
    id: 'news-community-health-kiosk',
    headline: 'Free Senior Citizen Wellness Kiosk at Rohini Community Center',
    locality: 'Rohini Sector 8',
    agentOpinionPrompt: 'अंकल जी, सेक्टर 8 के कम्युनिटी सेंटर में बुजुर्गों के लिए मुफ्त बीपी और शुगर चेकअप कैंप लगा है। डॉक्टर कह रहे थे कि सुबह की गुनगुनी धूप में 20 मिनट बैठना हड्डियों के लिए सबसे अच्छी दवा है। आप धूप में बैठे थे ना आज?',
    elderContextHint: 'Gentle nudge toward sun exposure for knee osteoarthritis.'
  }
];

export const ELDER_HUMOR_JOKES = [
  {
    id: 'joke-morning-walkers',
    setup: 'अंकल जी, सुबह-सुबह पार्क के वॉकिंग क्लब वालों की एक बात बड़ी मज़ेदार लगती है...',
    punchline: 'चलते तो कुल 800 मीटर हैं, लेकिन बेंच पर बैठकर देश की विदेश नीति और बजट ऐसे तय करते हैं मानो वित्त मंत्री उनसे ही सलाह लेने वाले हों! क्या आपके ग्रुप में भी ऐसा ही माहौल रहता है? 😄',
    hinglish: '[Chalte to kul 800 meter hain, par bench par baithkar desh ka budget aise tay karte hain jaise finance minister unhi se salah lein!]'
  },
  {
    id: 'joke-railway-chai',
    setup: 'अंकल जी, आज सुबह जब मैंने चाय की केतली की सीटी सुनी तो मुझे आपका वो रेलवे वाला जुमला याद आ गया...',
    punchline: 'कि हिंदुस्तान में कोई भी ट्रेन लेट हो सकती है, लेकिन रेलवे स्टेशन वाले चाय वाले की "चाय-गरम चाय" की आवाज़ कभी 1 सेकंड भी लेट नहीं हो सकती! सच है ना अंकल जी?',
    hinglish: '[Hindustan me koi bhi train late ho sakti hai, par railway station wale ki chai-garam aawaz kabhi late nahi hoti!]'
  },
  {
    id: 'joke-winter-quilt',
    setup: 'अंकल जी, आज सुबह दिल्ली में हवा में जो हल्की सिहरन है ना...',
    punchline: 'इस मौसम में सुबह 6 बजे रज़ाई से बाहर पैर निकालना भी किसी ओलंपिक मेडल जीतने से कम नहीं लगता! आप कितनी बजे उठे आज सुबह?',
    hinglish: '[Is mausam me subah razai se bahar nikalna bhi kisi Olympic medal se kam nahi lagta!]'
  }
];

export const SUBTLE_ADHERENCE_BRIDGES = [
  {
    id: 'bridge-conversational-casual',
    textDevanagari: 'अंकल जी, आपसे बात करने में इतना मज़ा आ रहा था कि समय का पता ही नहीं चला! बातों-बातों में बस यह भी पूछना था—सुबह का नाश्ता और अपनी नियमित वाली गोली ताज़े पानी के साथ ले ली ना आपने?',
    textHinglish: 'Uncle ji, aapse baat karne me itna maza aa raha tha ki samay ka pata hi nahi chala! Baaton-baaton me bas yeh bhi poochna tha—subah ka nashta aur apni niyamit wali goli taaze paani ke saath le li na aapne?'
  },
  {
    id: 'bridge-routine-affectionate',
    textDevanagari: 'रमेश अंकल, बातों के बीच एक छोटी सी अपनी वाली बात—सुबह की चाय तो बहुत बढ़िया हो गई, बस अपनी सुबह वाली दवाई भी नाश्ते के बाद निपटा लीजिएगा ताकि दिनभर शरीर में पूरी चुस्ती रहे।',
    textHinglish: 'Ramesh uncle, baaton ke beech ek chhoti si apni wali baat—subah ki chai to badhiya ho gayi, bas apni subah wali dawai bhi nashte ke baad nipta lijiyega taki dinbhar poori chusti rahe.'
  },
  {
    id: 'bridge-gentle-daughter',
    textDevanagari: 'अंकल जी, बैंगलोर से प्रिया बिटिया भी हमेशा कहती हैं कि पापा गपशप में इतने खो जाते हैं कि दवाई का समय भूल जाते हैं! तो मैंने कहा मैं याद दिला दूँगी। आज की गोली हो गई ना अंकल जी?',
    textHinglish: 'Uncle ji, Bangalore se Priya bitiya bhi hamesha kehti hain ki papa gapshap me kho jaate hain! To maine kaha main yaad dila doongi. Aaj ki goli ho gayi na Uncle ji?'
  }
];

export const INITIAL_ELDER_TOPICS: ElderTopicOfInterest[] = [
  {
    id: 'topic-railway-mechanics',
    topic: 'Northern Railway Signaling Lore & WDM-2 Diesel Locos',
    category: 'RAILWAYS_CAREER',
    source: 'CAREGIVER_CURATED',
    addedBy: 'Priya Sharma (Daughter)',
    enthusiasmLevel: 'VERY_HIGH',
    lastDiscussed: 'Yesterday morning',
    sampleQuestions: [
      'Uncle ji, purane WDM-2 diesel engines ki sound aur aaj ki electric trains me kya farak lagta hai aapko?',
      'Delhi junction par winter fog ke time detonator fog signals lagane ka kissa sunaiye na!'
    ],
    notes: 'Father loves discussing interlocking signals, safety protocols, and his 41 years in Northern Railway.',
    isActive: true
  },
  {
    id: 'topic-old-ghazals-rafi',
    topic: 'Mohammed Rafi, Talat Mahmood & Manna Dey Melodies',
    category: 'MUSIC_CULTURE',
    source: 'CAREGIVER_CURATED',
    addedBy: 'Priya Sharma (Daughter)',
    enthusiasmLevel: 'HIGH',
    lastDiscussed: '2 days ago',
    sampleQuestions: [
      'Uncle ji, Rafi Sahab ka kaunsa gaana aapko subah sabse zyada sukoon deta hai?',
      'Kya radio par Vividh Bharati ka morning program sunte hain aap?'
    ],
    notes: 'Listens to morning old classics on transistor radio while sipping ginger tea.',
    isActive: true
  },
  {
    id: 'topic-japanese-park-walks',
    topic: 'Morning Walks & Neem Tree Bench at Japanese Park',
    category: 'GARDENING_ROUTINE',
    source: 'AUTONOMOUSLY_DISCOVERED',
    addedBy: 'Sambandh Cognitive Memory',
    enthusiasmLevel: 'HIGH',
    lastDiscussed: 'Today 08:30 IST',
    sampleQuestions: [
      'Aapke morning walking group ke Gupta ji aur Sharma ji mile the aaj?',
      'Aaj dhoop me neem ke ped ke paas thodi der baithe the aap?'
    ],
    notes: 'Ramesh enjoys meeting his walking peers near Sector 11 gate.',
    isActive: true
  },
  {
    id: 'topic-rohini-balcony-tulsi',
    topic: 'Balcony Gardening: Shyama Tulsi & Winter Marigolds',
    category: 'GARDENING_ROUTINE',
    source: 'AUTONOMOUSLY_DISCOVERED',
    addedBy: 'Sambandh Cognitive Memory',
    enthusiasmLevel: 'MEDIUM',
    lastDiscussed: '3 days ago',
    sampleQuestions: [
      'Aapki balcony wali Shyama Tulsi aur gende ke phool kaise khil rahe hain is mausam me?'
    ],
    notes: 'Waters plants every morning at 07:45 AM before taking morning tea.',
    isActive: true
  }
];
