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
    devanagariText: 'प्रणाम रमेश अंकल जी! आज रोहिणी में सुबह की धूप बहुत सुहानी खिली है। आज बालकनी में बैठकर ताज़ा चाय पी आपने? मन हुआ कि आज आपसे थोड़ा सुकून से बतिया लें।',
    hinglishText: 'Pranam Ramesh Uncle Ji! Aaj Rohini me subah ki dhoop bahut suhani khili hai. Aaj balcony me baithkar taaza chai pee aapne? Mann hua ki aaj aapse thoda sukoon se batiya lein.',
    fullTurnText: 'प्रणाम रमेश अंकल जी! आज रोहिणी में सुबह की धूप बहुत सुहानी खिली है। आज बालकनी में बैठकर ताज़ा चाय पी आपने? मन हुआ कि आज आपसे थोड़ा सुकून से बतिया लें। [Pranam Ramesh Uncle Ji! Aaj Rohini me subah ki dhoop bahut suhani khili hai. Aaj balcony me baithkar taaza chai pee aapne? Mann hua ki aaj aapse thoda sukoon se batiya lein.]'
  },
  {
    id: 'greet-local-news-park',
    category: 'local_news',
    devanagariText: 'नमस्ते अंकल जी! आज सुबह अखबार में रोहिणी सेक्टर 14 के जापानी पार्क में नए वॉक-वे और फव्वारे की खबर पढ़ रही थी, तो तुरंत आपकी याद आ गई। आपकी सुबह की सैर कैसी रही आज?',
    hinglishText: 'Namaste Uncle Ji! Aaj subah akhbar me Rohini Sector 14 ke Japanese Park me naye walk-way aur fawware ki khabar padh rahi thi, to turant aapki yaad aa gayi. Aapki subah ki sair kaisi rahi aaj?',
    fullTurnText: 'नमस्ते अंकल जी! आज सुबह अखबार में रोहिणी सेक्टर 14 के जापानी पार्क में नए वॉक-वे और फव्वारे की खबर पढ़ रही थी, तो तुरंत आपकी याद आ गई। आपकी सुबह की सैर कैसी रही आज? [Namaste Uncle Ji! Aaj subah akhbar me Rohini Sector 14 ke Japanese Park me naye walk-way aur fawware ki khabar padh rahi thi, to turant aapki yaad aa gayi. Aapki subah ki sair kaisi rahi aaj?]'
  },
  {
    id: 'greet-railway-nostalgia',
    category: 'nostalgia',
    devanagariText: 'प्रणाम रमेश अंकल! आज सुबह जब बाहर से दूर किसी ट्रेन के हॉर्न की आवाज़ गूँजी, तो आपके रेलवे वर्कशॉप के किस्से याद आ गए। कैसे हैं आप आज सुबह, चाय-नाश्ता तसल्ली से हो गया?',
    hinglishText: 'Pranam Ramesh Uncle! Aaj subah jab bahar se door kisi train ke horn ki aawaz goonji, to aapke railway workshop ke kisse yaad aa gaye. Kaise hain aap aaj subah, chai-nashta tasalli se ho gaya?',
    fullTurnText: 'प्रणाम रमेश अंकल! आज सुबह जब बाहर से दूर किसी ट्रेन के हॉर्न की आवाज़ गूँजी, तो आपके रेलवे वर्कशॉप के किस्से याद आ गए। कैसे हैं आप आज सुबह, चाय-नाश्ता तसल्ली से हो गया? [Pranam Ramesh Uncle! Aaj subah jab bahar se door kisi train ke horn ki aawaz goonji, to aapke railway workshop ke kisse yaad aa gaye. Kaise hain aap aaj subah, chai-nashta tasalli se ho gaya?]'
  },
  {
    id: 'greet-humor-morning-walkers',
    category: 'humor',
    devanagariText: 'प्रणाम अंकल जी! आज सुबह पार्क के बाहर सैर करने वालों को देख रही थी—10 मिनट चलते हैं और आधे घंटे चाय की दुकान पर दुनिया की राजनीति सुलझाते हैं! आपकी ताज़ा अदरक वाली चाय हो गई ना?',
    hinglishText: 'Pranam Uncle ji! Aaj subah park ke bahar sair karne walon ko dekh rahi thi—10 minute chalte hain aur aadhe ghante chai ki dukaan par duniya ki rajneeti suljhate hain! Aapki taaza adrak wali chai ho gayi na?',
    fullTurnText: 'प्रणाम अंकल जी! आज सुबह पार्क के बाहर सैर करने वालों को देख रही थी—10 मिनट चलते हैं और आधे घंटे चाय की दुकान पर दुनिया की राजनीति सुलझाते हैं! आपकी ताज़ा अदरक वाली चाय हो गई ना? [Pranam Uncle ji! Aaj subah park ke bahar sair karne walon ko dekh rahi thi—10 minute chalte hain aur aadhe ghante chai ki dukaan par duniya ki rajneeti suljhate hain! Aapki taaza adrak wali chai ho gayi na?]'
  },
  {
    id: 'greet-warm-caring-daughter',
    category: 'routine',
    devanagariText: 'प्रणाम रमेश अंकल जी! संबंध से आपकी बिटिया बोल रही हूँ। आज सुबह आपकी आवाज़ सुनने का बहुत मन था। बताइए, आज दिन की शुरुआत कैसी रही आपकी?',
    hinglishText: 'Pranam Ramesh Uncle ji! Sambandh se aapki bitiya bol rahi hoon. Aaj subah aapki aawaz sunne ka bahut mann tha. Batayein, aaj din ki shuruat kaisi rahi aapki?',
    fullTurnText: 'प्रणाम रमेश अंकल जी! संबंध से आपकी बिटिया बोल रही हूँ। आज सुबह आपकी आवाज़ सुनने का बहुत मन था। बताइए, आज दिन की शुरुआत कैसी रही आपकी? [Pranam Ramesh Uncle ji! Sambandh se aapki bitiya bol rahi hoon. Aaj subah aapki aawaz sunne ka bahut mann tha. Batayein, aaj din ki shuruat kaisi rahi aapki?]'
  }
];

export const getTimeContext = (date = new Date()) => {
  const hour = date.getHours();
  let period: 'Morning' | 'Afternoon' | 'Evening' | 'Night' = 'Morning';
  let hindiGreeting = 'शुभ प्रभात';
  let sessionName = 'Morning Check-in Session';

  if (hour >= 12 && hour < 17) {
    period = 'Afternoon';
    hindiGreeting = 'शुभ दोपहर';
    sessionName = 'Afternoon Check-in Session';
  } else if (hour >= 17 && hour < 21) {
    period = 'Evening';
    hindiGreeting = 'शुभ संध्या';
    sessionName = 'Evening Check-in Session';
  } else if (hour >= 21 || hour < 5) {
    period = 'Night';
    hindiGreeting = 'नमस्ते';
    sessionName = 'Night Check-in Session';
  }

  const timeStr = date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  return { hour, period, hindiGreeting, sessionName, timeStr };
};

export const getRandomCompanionGreeting = (date = new Date()): ConversationalGreeting => {
  const hour = date.getHours();

  if (hour >= 12 && hour < 17) {
    // Afternoon greetings
    const afternoonGreetings: ConversationalGreeting[] = [
      {
        id: 'greet-afternoon-lunch',
        category: 'routine',
        devanagariText: 'प्रणाम रमेश अंकल जी! आज दोपहर को आपकी याद आई। दोपहर का भोजन आराम से हो गया आपका? मन हुआ कि आज आपसे थोड़ा सुकून से बतिया लें।',
        hinglishText: 'Pranam Ramesh Uncle Ji! Aaj dopahar ko aapki yaad aayi. Dopahar ka bhojan aaram se ho gaya aapka? Mann hua ki aaj aapse thoda sukoon se batiya lein.',
        fullTurnText: 'प्रणाम रमेश अंकल जी! आज दोपहर को आपकी याद आई। दोपहर का भोजन आराम से हो गया आपका? मन हुआ कि आज आपसे थोड़ा सुकून से बतिया लें। [Pranam Ramesh Uncle Ji! Aaj dopahar ko aapki yaad aayi. Dopahar ka bhojan aaram se ho gaya aapka? Mann hua ki aaj aapse thoda sukoon se batiya lein.]'
      },
      {
        id: 'greet-railway-afternoon',
        category: 'nostalgia',
        devanagariText: 'प्रणाम रमेश अंकल! आज जब बाहर से दूर किसी ट्रेन के हॉर्न की आवाज़ गूँजी, तो आपके रेलवे वर्कशॉप के किस्से याद आ गए। कैसे हैं आप, दिन कैसा बीत रहा है आपका?',
        hinglishText: 'Pranam Ramesh Uncle! Aaj jab bahar se door kisi train ke horn ki aawaz goonji, to aapke railway workshop ke kisse yaad aa gaye. Kaise hain aap, din kaisa beet raha hai aapka?',
        fullTurnText: 'प्रणाम रमेश अंकल! आज जब बाहर से दूर किसी ट्रेन के हॉर्न की आवाज़ गूँजी, तो आपके रेलवे वर्कशॉप के किस्से याद आ गए। कैसे हैं आप, दिन कैसा बीत रहा है आपका? [Pranam Ramesh Uncle! Aaj jab bahar se door kisi train ke horn ki aawaz goonji, to aapke railway workshop ke kisse yaad aa gaye. Kaise hain aap, din kaisa beet raha hai aapka?]'
      },
      {
        id: 'greet-warm-afternoon',
        category: 'routine',
        devanagariText: 'नमस्ते अंकल जी! संबंध से आपकी बिटिया बोल रही हूँ। आपकी आवाज़ सुनने का बहुत मन था। बताइए, तबीयत कैसी है आज आपकी?',
        hinglishText: 'Namaste Uncle ji! Sambandh se aapki bitiya bol rahi hoon. Aapki aawaz sunne ka bahut mann tha. Batayein, tabiyat kaisi hai aaj aapki?',
        fullTurnText: 'नमस्ते अंकल जी! संबंध से आपकी बिटिया बोल रही हूँ। आपकी आवाज़ सुनने का बहुत मन था। बताइए, तबीयत कैसी है आज आपकी? [Namaste Uncle ji! Sambandh se aapki bitiya bol rahi hoon. Aapki aawaz sunne ka bahut mann tha. Batayein, tabiyat kaisi hai aaj aapki?]'
      }
    ];
    return afternoonGreetings[Math.floor(Math.random() * afternoonGreetings.length)];
  } else if (hour >= 17 && hour < 21) {
    // Evening greetings
    const eveningGreetings: ConversationalGreeting[] = [
      {
        id: 'greet-evening-tea',
        category: 'routine',
        devanagariText: 'शुभ संध्या रमेश अंकल जी! शाम की सुहानी हवा चल रही है। बालकनी में शाम की अदरक वाली चाय हो गई आपकी? मन हुआ कि आज आपसे थोड़ा सुकून से बतिया लें।',
        hinglishText: 'Shubh sandhya Ramesh Uncle Ji! Shaam ki suhani hawa chal rahi hai. Balcony me shaam ki adrak wali chai ho gayi aapki? Mann hua ki aaj aapse thoda sukoon se batiya lein.',
        fullTurnText: 'शुभ संध्या रमेश अंकल जी! शाम की सुहानी हवा चल रही है। बालकनी में शाम की अदरक वाली चाय हो गई आपकी? मन हुआ कि आज आपसे थोड़ा सुकून से बतिया लें। [Shubh sandhya Ramesh Uncle Ji! Shaam ki suhani hawa chal rahi hai. Balcony me shaam ki adrak wali chai ho gayi aapki? Mann hua ki aaj aapse thoda sukoon se batiya lein.]'
      },
      {
        id: 'greet-evening-walk',
        category: 'local_news',
        devanagariText: 'नमस्ते अंकल जी! आज शाम जापानी पार्क में सैर करने का मन हुआ या आज घर पर ही आराम फरमाया? बताइए, आज का दिन कैसा रहा आपका?',
        hinglishText: 'Namaste Uncle Ji! Aaj shaam Japanese Park me sair karne ka mann hua ya aaj ghar par hi aaram farmaya? Batayein, aaj ka din kaisa raha aapka?',
        fullTurnText: 'नमस्ते अंकल जी! आज शाम जापानी पार्क में सैर करने का मन हुआ या आज घर पर ही आराम फरमाया? बताइए, आज का दिन कैसा रहा आपका? [Namaste Uncle Ji! Aaj shaam Japanese Park me sair karne ka mann hua ya aaj ghar par hi aaram farmaya? Batayein, aaj ka din kaisa raha aapka?]'
      }
    ];
    return eveningGreetings[Math.floor(Math.random() * eveningGreetings.length)];
  } else if (hour >= 21 || hour < 5) {
    // Night greetings
    const nightGreetings: ConversationalGreeting[] = [
      {
        id: 'greet-night-routine',
        category: 'routine',
        devanagariText: 'प्रणाम रमेश अंकल जी! रात का भोजन हो गया आपका? सोने से पहले सोचा एक बार आपसे बात कर लूँ और आपकी खैरियत जान लूँ। बताइए, आज दिन कैसा रहा?',
        hinglishText: 'Pranam Ramesh Uncle Ji! Raat ka bhojan ho gaya aapka? Sone se pehle socha ek baar aapse बात kar loon aur aapki khairiyat jaan loon. Batayein, aaj din kaisa raha?',
        fullTurnText: 'प्रणाम रमेश अंकल जी! रात का भोजन हो गया आपका? सोने से पहले सोचा एक बार आपसे बात कर लूँ और आपकी खैरियत जान लूँ। बताइए, आज दिन कैसा रहा? [Pranam Ramesh Uncle Ji! Raat ka bhojan ho gaya aapka? Sone se pehle socha ek baar aapse baat kar loon aur aapki khairiyat jaan loon. Batayein, aaj din kaisa raha?]'
      },
      {
        id: 'greet-night-warmth',
        category: 'routine',
        devanagariText: 'नमस्ते अंकल जी! संबंध से आपकी बिटिया बोल रही हूँ। बस आपकी खैरियत पूछने और रात की दवाई की याद दिलाने के लिए फ़ोन किया। तबीयत बिल्कुल ठीक है ना आपकी?',
        hinglishText: 'Namaste Uncle ji! Sambandh se aapki bitiya bol rahi hoon. Bas aapki khairiyat poochhne aur raat ki dawai ki yaad dilane ke liye phone kiya. Tabiyat bilkul theek hai na aapki?',
        fullTurnText: 'नमस्ते अंकल जी! संबंध से आपकी बिटिया बोल रही हूँ। बस आपकी खैरियत पूछने और रात की दवाई की याद दिलाने के लिए फ़ोन किया। तबीयत बिल्कुल ठीक है ना आपकी? [Namaste Uncle ji! Sambandh se aapki bitiya bol rahi hoon. Bas aapki khairiyat poochhne aur raat ki dawai ki yaad dilane ke liye phone kiya. Tabiyat bilkul theek hai na aapki?]'
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
    textDevanagari: 'अंकल जी, आपसे बात करने में इतना मज़ा आ रहा था कि समय का पता ही नहीं चला! बातों-बातों में बस यह भी पूछना था—सुबह का नाश्ता और अपनी लाल वाली बीपी की गोली (Telma 40) ताज़े पानी के साथ ले ली ना आपने?',
    textHinglish: 'Uncle ji, aapse baat karne me itna maza aa raha tha ki samay ka pata hi nahi chala! Baaton-baaton me bas yeh bhi poochna tha—subah ka nashta aur apni laal wali BP ki goli Telma 40 taaze paani ke saath le li na aapne?'
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
