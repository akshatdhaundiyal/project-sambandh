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
    devanagariText: 'प्रणाम रमेश अंकल जी! कैसे हैं आप आज सुबह? बालकनी में ताज़ा चाय हो गई आपकी?',
    hinglishText: 'Pranam Ramesh Uncle Ji! Kaise hain aap aaj subah? Balcony me taaza chai ho gayi aapki?',
    fullTurnText: 'प्रणाम रमेश अंकल जी! कैसे हैं आप आज सुबह? बालकनी में ताज़ा चाय हो गई आपकी?'
  },
  {
    id: 'greet-local-news-park',
    category: 'local_news',
    devanagariText: 'नमस्ते अंकल जी! आज सुबह पार्क में हल्की सैर कैसी रही आपकी? मौसम कैसा लग रहा है?',
    hinglishText: 'Namaste Uncle Ji! Aaj subah park me halki sair kaisi rahi aapki? Mausam kaisa lag raha hai?',
    fullTurnText: 'नमस्ते अंकल जी! आज सुबह पार्क में हल्की सैर कैसी रही आपकी? मौसम कैसा लग रहा है?'
  },
  {
    id: 'greet-railway-nostalgia',
    category: 'nostalgia',
    devanagariText: 'प्रणाम रमेश अंकल! आज सुबह आपकी याद आई। चाय-नाश्ता तसल्ली से हो गया आपका?',
    hinglishText: 'Pranam Ramesh Uncle! Aaj subah aapki yaad aayi. Chai-nashta tasalli se ho gaya aapka?',
    fullTurnText: 'प्रणाम रमेश अंकल! आज सुबह आपकी याद आई। चाय-नाश्ता तसल्ली से हो गया आपका?'
  },
  {
    id: 'greet-humor-morning-walkers',
    category: 'humor',
    devanagariText: 'प्रणाम अंकल जी! शुभ प्रभात! आज दिन की शुरुआत कैसी रही आपकी?',
    hinglishText: 'Pranam Uncle ji! Shubh prabhat! Aaj din ki shuruat kaisi rahi aapki?',
    fullTurnText: 'प्रणाम अंकल जी! शुभ प्रभात! आज दिन की शुरुआत कैसी रही आपकी?'
  },
  {
    id: 'greet-warm-caring-daughter',
    category: 'routine',
    devanagariText: 'प्रणाम रमेश अंकल जी! संबंध से आपकी बिटिया बोल रही हूँ। बताइए, कैसे हैं आप आज?',
    hinglishText: 'Pranam Ramesh Uncle ji! Sambandh se aapki bitiya bol rahi hoon. Batayein, kaise hain aap aaj?',
    fullTurnText: 'प्रणाम रमेश अंकल जी! संबंध से आपकी बिटिया बोल रही हूँ। बताइए, कैसे हैं आप आज?'
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
        devanagariText: 'प्रणाम रमेश अंकल जी! दोपहर का भोजन आराम से हो गया आपका? आज का दिन कैसा बीत रहा है?',
        hinglishText: 'Pranam Ramesh Uncle Ji! Dopahar ka bhojan aaram se ho gaya aapka? Aaj ka din kaisa beet raha hai?',
        fullTurnText: 'प्रणाम रमेश अंकल जी! दोपहर का भोजन आराम से हो गया आपका? आज का दिन कैसा बीत रहा है?'
      },
      {
        id: 'greet-warm-afternoon',
        category: 'routine',
        devanagariText: 'नमस्ते अंकल जी! संबंध से आपकी बिटिया बोल रही हूँ। बताइए, क्या चल रहा है दोपहर में?',
        hinglishText: 'Namaste Uncle ji! Sambandh se aapki bitiya bol rahi hoon. Batayein, kya chal raha hai dopahar me?',
        fullTurnText: 'नमस्ते अंकल जी! संबंध से आपकी बिटिया बोल रही हूँ। बताइए, क्या चल रहा है दोपहर में?'
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
        fullTurnText: 'शुभ संध्या रमेश अंकल जी! शाम की चाय हो गई आपकी? आज का दिन कैसा बीता?'
      },
      {
        id: 'greet-evening-walk',
        category: 'local_news',
        devanagariText: 'नमस्ते अंकल जी! शाम को बालकनी में टहल रहे थे या आराम कर रहे थे? कैसा रहा आज का दिन?',
        hinglishText: 'Namaste Uncle Ji! Shaam ko balcony me tehal rahe the ya aaram kar rahe the? Kaisa raha aaj ka din?',
        fullTurnText: 'नमस्ते अंकल जी! शाम को बालकनी में टहल रहे थे या आराम कर रहे थे? कैसा रहा आज का दिन?'
      }
    ];
    return eveningGreetings[Math.floor(Math.random() * eveningGreetings.length)];
  } else if (hour >= 21 || hour < 5) {
    // Night greetings
    const nightGreetings: ConversationalGreeting[] = [
      {
        id: 'greet-night-routine',
        category: 'routine',
        devanagariText: 'प्रणाम रमेश अंकल जी! रात का भोजन आराम से हो गया आपका? आज का दिन कैसा रहा?',
        hinglishText: 'Pranam Ramesh Uncle Ji! Raat ka bhojan aaram se ho gaya aapka? Aaj ka din kaisa raha?',
        fullTurnText: 'प्रणाम रमेश अंकल जी! रात का भोजन आराम से हो गया आपका? आज का दिन कैसा रहा?'
      },
      {
        id: 'greet-night-warmth',
        category: 'routine',
        devanagariText: 'नमस्ते अंकल जी! बस आपकी खैरियत पूछने के लिए फ़ोन किया। दिन कैसा बीता आपका?',
        hinglishText: 'Namaste Uncle ji! Bas aapki khairiyat poochhne ke liye phone kiya. Din kaisa beeta aapka?',
        fullTurnText: 'नमस्ते अंकल जी! बस आपकी खैरियत पूछने के लिए फ़ोन किया। दिन कैसा बीता आपका?'
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
    agentOpinionPrompt: 'अंकल जी, रोहिणी जापानी पार्क में नया वॉकवे बन गया है। कुछ लोग कहते हैं कि पहले वाला कच्चा ट्रैक पैरों के लिए ज़्यादा आरामदायक था। आपका क्या तजुर्बा है इसपर?',
    elderContextHint: 'Ramesh has taken morning walks in Japanese Park for 15+ years.'
  },
  {
    id: 'news-vande-bharat-modernization',
    headline: 'Indian Railways Launching New Sleeper Vande Bharat Trains',
    locality: 'Northern Railway / Delhi Division',
    agentOpinionPrompt: 'अंकल जी, रेलवे अब नए वंदे भारत स्लीपर कोच ला रहा है। आप तो 40 साल रेलवे में सिग्नल और मैकेनिकल व्यवस्था संभालते रहे हैं—आपको क्या लगता है, पुरानी राजधानी की तुलना में ये कैसे रहेंगे?',
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
    punchline: 'चलते कुल 800 मीटर हैं, पर बेंच पर बैठकर पूरे देश का बजट ऐसे तय करते हैं मानो वित्त मंत्री उनसे ही सलाह लेने वाले हों! 😄',
    spokenHindi: 'हाहाहा, अंकल जी सुनिए! पार्क के मॉर्निंग वॉकिंग क्लब वाले चलते कुल 800 मीटर हैं, पर बेंच पर बैठकर पूरे देश का बजट ऐसे तय करते हैं मानो वित्त मंत्री उनसे ही सलाह लेने वाले हों!'
  },
  {
    id: 'joke-railway-chai',
    setup: 'अंकल जी, रेलवे का एक सच्चा किस्सा याद आ गया...',
    punchline: 'ट्रेन चाहे जितनी लेट हो जाए, पर स्टेशन वाले की "चाय गरम चाय" की आवाज़ कभी एक सेकंड भी लेट नहीं हो सकती! सच है ना अंकल जी?',
    spokenHindi: 'अंकल जी, रेलवे का एक सच्चा किस्सा याद आ गया—ट्रेन चाहे जितनी लेट हो जाए, पर स्टेशन वाले की "चाय गरम चाय" की आवाज़ कभी एक सेकंड भी लेट नहीं हो सकती! सच है ना अंकल जी?'
  },
  {
    id: 'joke-winter-blanket',
    setup: 'अंकल जी, आज सुबह मौसम देखकर एक बात याद आई...',
    punchline: 'इस मौसम में सुबह-सुबह रज़ाई से बाहर पैर निकालना भी किसी ओलंपिक मेडल जीतने से कम नहीं लगता!',
    spokenHindi: 'अंकल जी, इस मौसम में सुबह-सुबह रज़ाई से बाहर पैर निकालना भी किसी ओलंपिक मेडल जीतने से कम नहीं लगता! आप कितनी बजे उठे आज सुबह?'
  }
];

export const INITIAL_ELDER_TOPICS: ElderTopicOfInterest[] = [
  {
    id: 'topic-railway-interlocking',
    topic: 'Northern Railway Locomotive Lore & Mechanical Signals',
    category: 'RAILWAYS_CAREER',
    source: 'CAREGIVER_CURATED',
    addedBy: 'Rohan Sharma (Son)',
    enthusiasmLevel: 'VERY_HIGH',
    lastDiscussed: '2 days ago',
    notes: 'Father loves reminiscing about the mechanical relay interlock safety systems at Ghaziabad junction.',
    isActive: true
  },
  {
    id: 'topic-old-ghazals',
    topic: 'Old Mohammed Rafi & Talat Mahmood Ghazals',
    category: 'MUSIC_CULTURE',
    source: 'CAREGIVER_CURATED',
    addedBy: 'Rohan Sharma (Son)',
    enthusiasmLevel: 'HIGH',
    lastDiscussed: 'Yesterday',
    notes: 'Likes discussing classic All India Radio morning broadcast songs and 1960s melody compositions.',
    isActive: true
  },
  {
    id: 'topic-japanese-park-walks',
    topic: 'Morning Walks in Japanese Park, Rohini Sector 14',
    category: 'WEATHER_NATURE',
    source: 'AUTONOMOUSLY_DISCOVERED',
    addedBy: 'Autonomous Conversation Engine',
    enthusiasmLevel: 'HIGH',
    lastDiscussed: 'Today',
    notes: 'Enjoys talking about his 25-minute walk routine and observing morning birds by the park lake.',
    isActive: true
  },
  {
    id: 'topic-balcony-gardening',
    topic: 'Balcony Tulsi, Money Plant & Adrak Chai Routine',
    category: 'GARDENING_ROUTINE',
    source: 'CAREGIVER_CURATED',
    addedBy: 'Rohan Sharma (Son)',
    enthusiasmLevel: 'MEDIUM',
    lastDiscussed: '3 days ago',
    notes: 'Waters his tulsi pot every morning at 7:30 AM before reading the morning newspaper.',
    isActive: true
  }
];
