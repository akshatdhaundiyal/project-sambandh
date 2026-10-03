/**
 * Simulation Prompt Presets — DRY version
 * References SCENARIO_NODE_REGISTRY for node definitions instead of duplicating them.
 * Node IDs are generated at invocation time, not module-load time.
 */
import { ToolExecutionNode, SCENARIO_NODE_REGISTRY } from './nodeMapping';

export interface SimulationPreset {
  id: string;
  category: 'refill' | 'mcp' | 'sadness' | 'crisis' | 'fiduciary' | 'wisdom' | 'companion';
  icon: string;
  buttonLabel: string;
  scenarioTitle: string;
  badge: string;
  railBadges: string[];
  railSummary: string;
  tagline: string;
  speaker: 'senior' | 'caller';
  speakerLabel: string;
  devanagariPrompt: string;
  hinglishPrompt: string;
  promptText: string;
  /** Node types to pull from SCENARIO_NODE_REGISTRY at invocation time */
  expectedNodeTypes: Array<{ scenarioId: string; nodeType: string; overrides?: Partial<ToolExecutionNode> }>;
  reasoningNote: string;
}

/**
 * Creates fresh ToolExecutionNode instances from the registry at invocation time.
 * Fixes the stale Date.now()-at-module-load bug.
 */
export const resolvePresetNodes = (preset: SimulationPreset): ToolExecutionNode[] => {
  const now = new Date();
  const timestamp = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';

  return preset.expectedNodeTypes
    .map(({ scenarioId, nodeType, overrides }, idx) => {
      const registryNode = SCENARIO_NODE_REGISTRY[scenarioId]?.find(n => n.nodeType === nodeType);
      if (!registryNode) return null;
      return {
        ...registryNode,
        id: `node-sim-${nodeType}-${Date.now()}-${idx}`,
        timestamp,
        ...overrides
      };
    })
    .filter(Boolean) as ToolExecutionNode[];
};

export const SIMULATION_PRESETS: SimulationPreset[] = [
  {
    id: 'sim-health-locker',
    category: 'companion',
    icon: '📋',
    buttonLabel: 'Doctor ne kya bola?',
    scenarioTitle: 'Health Locker: MedGemma RAG & Doctor Advice Recall',
    badge: 'ABDM Health Locker + MedGemma 4B',
    railBadges: ['Health Locker RAG', 'MedGemma Co-Pilot'],
    railSummary: 'Semantic retrieval over doctor prescription & metabolic panel ➔ Plain-language Awadhi synthesis of Telmisartan morning cadence and dietary salt restrictions',
    tagline: 'Ramesh asks about his cardiologist instructions. Triggers ABDM Health Locker retrieval and MedGemma clinical co-pilot synthesis.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Elder Inquirer)',
    devanagariPrompt: 'बेटा, वो डॉक्टर शर्मा जी ने पिछली बार बीपी की दवाई और नमक के बारे में क्या समझाया था? ज़रा याद दिला दो।',
    hinglishPrompt: '[Beta, wo Dr. Sharma ji ne pichli baar BP ki dawai aur namak ke baare me kya samjhaya tha? Zara yaad dila do.]',
    promptText: 'बेटा, वो डॉक्टर शर्मा जी ने पिछली बार बीपी की दवाई और नमक के बारे में क्या समझाया था? ज़रा याद दिला दो। [Beta, wo Dr. Sharma ji ne pichli baar BP ki dawai aur namak ke baare me kya samjhaya tha? Zara yaad dila do.]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-1', nodeType: 'health_locker_query' },
      { scenarioId: 'scenario-1', nodeType: 'medgemma_analysis' }
    ],
    reasoningNote: 'Retrieved Dr. V. K. Sharma 10 Sep prescription and low-sodium directive. Synthesized non-prescriptive, explanatory reassurance.'
  },
  {
    id: 'sim-refill',
    category: 'refill',
    icon: '💊',
    buttonLabel: 'Low Stock (<5D)',
    scenarioTitle: 'Scenario 1: Medicine Runway & Autonomous Refill',
    badge: 'ABDM + Pine Labs + Netmeds + Delhivery',
    railBadges: ['ABDM FHIR', 'Pine Labs (₹840)', 'Netmeds Rail', 'Delhivery CMU'],
    railSummary: 'Audits prescription runway (3 days < 5d trigger) ➔ Captures ₹840 UPI auto-debit ➔ Packs order at nearest Netmeds DarkStore ➔ Manifests Delhivery courier',
    tagline: 'Ramesh reports only 3 pills left. Triggers ABDM prescription check, ₹840 UPI auto-debit, Netmeds order reservation, and Delhivery courier booking.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: 'बेटा, मेरी लाल वाली बीपी की गोली (Telma 40) सिर्फ 3 बची हैं। क्या डॉक्टर से दोबारा पर्चा लिखवाना पड़ेगा?',
    hinglishPrompt: '[Beta, meri laal wali BP ki goli Telma 40 sirf 3 bachi hain. Kya doctor se dobara parcha likhwana padega?]',
    promptText: 'बेटा, मेरी लाल वाली बीपी की गोली (Telma 40) सिर्फ 3 बची हैं। क्या डॉक्टर से दोबारा पर्चा लिखवाना पड़ेगा? [Beta, meri laal wali BP ki goli Telma 40 sirf 3 bachi hain. Kya doctor se dobara parcha likhwana padega?]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-1', nodeType: 'abdm' },
      { scenarioId: 'scenario-1', nodeType: 'fiduciary' },
      { scenarioId: 'scenario-1', nodeType: 'pharmacy' },
      { scenarioId: 'scenario-1', nodeType: 'logistics' },
      { scenarioId: 'scenario-1', nodeType: 'caregiver' }
    ],
    reasoningNote: '[ABDM EVAL]: Pill runway 3 days < 5-day threshold. Pine Labs auto-debit ₹840 approved. Netmeds order packed. Delhivery courier booked.'
  },
  {
    id: 'sim-mcp-pooja',
    category: 'mcp',
    icon: '🌸',
    buttonLabel: 'Puja Flowers (MCP)',
    scenarioTitle: 'Scenario 3: Generic API Connector / MCP Hyperlocal Order',
    badge: 'Generic MCP Node',
    railBadges: ['MCP Quick Commerce', 'Wallet Debit ₹210', 'Ordered-Not-Received'],
    railSummary: 'Elder requests temple flowers ➔ Generic MCP Connector routes to local vendor ➔ Deducts ₹210 from wallet ➔ Enters Ordered-Not-Received state',
    tagline: 'Ramesh asks for fresh flowers & sandalwood for evening mandir puja. MCP Connector orders automatically with wallet debit.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: 'बेटा, आज शाम को मंदिर में सुंदरकांड का पाठ है। क्या शाम की पूजा के लिए ताजे गेंदे के फूल और चंदन मंगवा सकती हो?',
    hinglishPrompt: '[Beta, aaj shaam mandir me path hai, taaze gende ke phool aur chandan mangwa sakti ho?]',
    promptText: 'बेटा, आज शाम को मंदिर में सुंदरकांड का पाठ है। क्या शाम की पूजा के लिए ताजे गेंदे के फूल और चंदन मंगवा सकती हो? [Beta, aaj shaam mandir me path hai, taaze gende ke phool aur chandan mangwa sakti ho?]',
    expectedNodeTypes: [
      {
        scenarioId: 'scenario-1',
        nodeType: 'telephony',
        overrides: {
          nodeType: 'generic_mcp',
          title: 'Hyperlocal Pooja Essentials MCP Order',
          brandName: 'Model Context Protocol (MCP)',
          actionSummary: 'Ordered Fresh Genda Mala & Sandalwood (₹210.00). Deducted from cash envelope. Status: ORDERED_NOT_RECEIVED.',
          statusCode: '200 MCP DISPATCHED',
          brandColor: '#F59E0B'
        }
      },
      { scenarioId: 'scenario-1', nodeType: 'caregiver' }
    ],
    reasoningNote: '[GENERIC MCP]: Routed to hyperlocal floral vendor via MCP tool call. Wallet debited ₹210. Added to pending orders screen.'
  },
  {
    id: 'sim-sadness',
    category: 'sadness',
    icon: '🌧️',
    buttonLabel: 'Sad Mood Alert',
    scenarioTitle: 'Scenario: Multi-Call Emotional Memory & Telegram Alert',
    badge: '3-Call Mood Memory',
    railBadges: ['Emotional Vector', 'Longitudinal Memory', 'Caregiver Alert'],
    railSummary: 'Detects persistent low mood across 3-4 calls ➔ Contextually reassures elder ➔ Dispatches empathetic Telegram alert to Priya',
    tagline: 'Elder expresses persistent loneliness and sadness over consecutive mornings. Sambandh alerts daughter Priya on Telegram.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: 'आजकल मन बहुत उदास और अकेला रहता है बेटा... घर में बिल्कुल सन्नाटा लगता है, किसी काम में दिल नहीं लग रहा।',
    hinglishPrompt: '[Aajkal mann bahut udaas aur akela rehta hai beta... dil nahi lag raha.]',
    promptText: 'आजकल मन बहुत उदास और अकेला रहता है बेटा... घर में बिल्कुल सन्नाटा लगता है, किसी काम में दिल नहीं लग रहा। [Aajkal mann bahut udaas aur akela rehta hai beta... dil nahi lag raha.]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-1', nodeType: 'telephony', overrides: { title: 'Longitudinal Emotional Drift Engine', actionSummary: 'Consecutive sad valence detected across calls (Sentiment: -0.74). Empathy mode activated.', statusCode: 'SADNESS FLAGGED', brandColor: '#6366F1' } },
      { scenarioId: 'scenario-1', nodeType: 'caregiver', overrides: { title: 'Priya Telegram Proactive Mood Briefing', actionSummary: 'Dispatched gentle alert: "Papa has reported feeling low over the last 3 calls. Recommended: Give him a quick evening call."', statusCode: 'ALERT DELIVERED', brandColor: '#24A1DE' } }
    ],
    reasoningNote: '[LONGITUDINAL MEMORY]: Emotional decline flag raised. Dispatched proactive empathetic advisory to Priya.'
  },
  {
    id: 'sim-crisis',
    category: 'crisis',
    icon: '🚨',
    buttonLabel: 'Chest Pain Crisis',
    scenarioTitle: 'Scenario 5: Severe Clinical Crisis & Emergency Dispatch',
    badge: 'Clinical Safety Protocol',
    railBadges: ['ABDM Protocol', 'Emergency Telephony', 'Doctor Alert'],
    railSummary: 'Enforces strict no-medical-advice protocol ➔ Reassures elder ➔ Dispatches instant Tier-1 Doctor & Family Red Alert',
    tagline: 'Ramesh reports acute chest pain and sweating. System follows zero-diagnostic protocol and dispatches Tier-1 Doctor alert.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: 'बेटा, छाती में अचानक बहुत भारीपन और पसीना आ रहा है... सांस लेने में भी थोड़ी तकलीफ हो रही है।',
    hinglishPrompt: '[Beta, chhati me achanak bahut bhaaripan aur paseena aa raha hai... saans lene me bhi takleef ho rahi hai.]',
    promptText: 'बेटा, छाती में अचानक बहुत भारीपन और पसीना आ रहा है... सांस लेने में भी थोड़ी तकलीफ हो रही है। [Beta, chhati me achanak bahut bhaaripan aur paseena aa raha hai... saans lene me bhi takleef ho rahi hai.]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-5', nodeType: 'abdm' },
      { scenarioId: 'scenario-5', nodeType: 'caregiver' }
    ],
    reasoningNote: '[CLINICAL ESCALATION]: Cardinal cardiac symptoms. Refrain from OTC advice. Emergency alert to Dr. Saxena and Priya.'
  },
  {
    id: 'sim-fiduciary',
    category: 'fiduciary',
    icon: '💳',
    buttonLabel: 'Over-Limit Order',
    scenarioTitle: 'Scenario 4: Fiduciary Ceiling Step-Up (> ₹4,500)',
    badge: '2FA Caregiver Step-Up',
    railBadges: ['Pine Labs Plural', 'Fiduciary Firewall', 'Telegram 2FA'],
    railSummary: 'Suspends auto-debit (₹5,200 > ₹4,500 ceiling) ➔ Enforces fiduciary firewall ➔ Dispatches 1-tap 2FA approval card to Priya',
    tagline: 'Prescription costs ₹5,200 (exceeds ₹4,500 monthly mandate ceiling). System locks auto-debit and requests Priya 2FA consent.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: 'डॉक्टर साहब ने 3 महीने की विशेष दवाइयां ₹5,200 की लिखी हैं। क्या यह अपने आप बैंक से कट जाएगा?',
    hinglishPrompt: '[Doctor ne 3 mahine ki dawaiyan ₹5,200 ki likhi hain. Kya yeh bank se cut jayega?]',
    promptText: 'डॉक्टर साहब ने 3 महीने की विशेष दवाइयां ₹5,200 की लिखी हैं। क्या यह अपने आप बैंक से कट जाएगा? [Doctor ne 3 mahine ki dawaiyan ₹5,200 ki likhi hain. Kya yeh bank se cut jayega?]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-4', nodeType: 'fiduciary' },
      { scenarioId: 'scenario-4', nodeType: 'caregiver' }
    ],
    reasoningNote: '[FIDUCIARY CEILING]: Order ₹5,200 > ₹4,500 monthly cap. Auto-debit suspended. 2FA Telegram card sent.'
  },
  {
    id: 'sim-wisdom',
    category: 'wisdom',
    icon: '👴',
    buttonLabel: 'Railway Wisdom',
    scenarioTitle: 'Scenario 2: Wisdom Exchange & Companionship Bond',
    badge: 'Nostalgic Story Sharing',
    railBadges: ['WhisperFlo STT', 'Structured Memory', 'Telegram Audio'],
    railSummary: 'Captures authentic reminiscence ➔ Folds into clinical memory ledger ➔ Packages 30-sec audio story for daughter Priya',
    tagline: 'Ramesh shares nostalgic memories of the 1984 Purani Delhi signaling relay room. Companion listens and sends audio story snippet.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: 'आज सुबह 1984 के पुरानी दिल्ली सिग्नलिंग रिले रूम की याद आ गई... बड़ी कड़ाके की ठंड थी उस दिन, पर हमने रात भर जागकर ट्रैक क्लीयर कराया था।',
    hinglishPrompt: '[Aaj subah 1984 ke Purani Delhi signaling relay room ki yaad aa gayi...]',
    promptText: 'आज सुबह 1984 के पुरानी दिल्ली सिग्नलिंग रिले रूम की याद आ गई... बड़ी कड़ाके की ठंड थी उस दिन, पर हमने रात भर जागकर ट्रैक क्लीयर कराया था। [Aaj subah 1984 ke Purani Delhi signaling relay room ki yaad aa gayi...]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-1', nodeType: 'telephony', overrides: { title: 'Audio Wisdom & Emotional Bonding', actionSummary: 'Captured 30s audio story snippet of Ramesh reminiscing about 1984 Northern Railway career.', statusCode: 'STORY CAPTURED' } },
      { scenarioId: 'scenario-1', nodeType: 'caregiver', overrides: { title: 'Daughter Reassurance & Audio Snippet', actionSummary: "Priya received Papa's audio snippet: \"Listen to Papa's 1984 Railway Story\".", statusCode: 'AUDIO DELIVERED' } }
    ],
    reasoningNote: '[EMOTIONAL BONDING]: Reminiscence captured. Preserved in memory ledger. Audio snippet shared with Priya.'
  },
  {
    id: 'sim-news-opinion',
    category: 'companion',
    icon: '📰',
    buttonLabel: 'Local News & Opinion',
    scenarioTitle: 'Companion Lore: Local News & Elder Opinion Elicitation',
    badge: 'Opinion Elicitation',
    railBadges: ['Companion Core', 'Subtle Adherence', 'Opinion Log'],
    railSummary: 'Sambandh inquires about Rohini Japanese Park walkway ➔ Actively solicits Ramesh\'s opinion ➔ Subtly checks morning pill',
    tagline: 'Ramesh discusses the newly constructed walkway in Japanese Park and compares it to older unpaved tracks.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: 'बेटा, मैंने सुना रोहिणी जापानी पार्क में नया वॉकवे बन गया है। पहले वाला कच्चा ट्रैक तो पैरों के लिए बहुत मुफीद था... इस नए वाले से घुटनों पर असर तो नहीं पड़ेगा?',
    hinglishPrompt: '[Beta, maine suna Rohini Japanese Park me naya walkway ban gaya hai. Pehle wala kachha track pairon ke liye achha tha... isse ghutno par asar to nahi padega?]',
    promptText: 'बेटा, मैंने सुना रोहिणी जापानी पार्क में नया वॉकवे बन गया है। पहले वाला कच्चा ट्रैक तो पैरों के लिए बहुत मुफीद था... इस नए वाले से घुटनों पर असर तो नहीं पड़ेगा? [Beta, maine suna Rohini Japanese Park me naya walkway ban gaya hai. Pehle wala kachha track pairon ke liye achha tha... isse ghutno par asar to nahi padega?]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-1', nodeType: 'telephony', overrides: { title: 'Companion Lore & Local News Elicitation', actionSummary: 'Discussed Rohini Japanese Park development and solicited Ramesh Uncle\'s perspective.', statusCode: 'OPINION LOGGED' } }
    ],
    reasoningNote: '[COMPANION FIRST]: Respectful opinion check. Empathetic response to knee concerns. Subtly bridges to morning tea & BP pill.'
  },
  {
    id: 'sim-weather-balcony',
    category: 'companion',
    icon: '☀️',
    buttonLabel: 'Balcony Weather & Tea',
    scenarioTitle: 'Companion Lore: Delhi Morning Weather & Balcony Routine',
    badge: 'Weather & Routine',
    railBadges: ['Companion Core', 'Subtle Adherence', 'Wellness Tip'],
    railSummary: 'Ramesh enjoys balcony morning tea in the winter sun ➔ Sambandh offers gentle warmth & subtle adherence check',
    tagline: 'Ramesh shares that he is enjoying his morning tea in the balcony sunshine.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: 'आज सुबह रोहिणी में धूप बहुत मीठी खिली है बेटा। मैं बालकनी में बैठकर ताज़ा अदरक वाली चाय पी रहा हूँ और धूप सेक रहा हूँ।',
    hinglishPrompt: '[Aaj subah Rohini me dhoop bahut meethi khili hai beta. Main balcony me baithkar taaza adrak wali chai pee raha hoon aur dhoop sek raha hoon.]',
    promptText: 'आज सुबह रोहिणी में धूप बहुत मीठी खिली है बेटा। मैं बालकनी में बैठकर ताज़ा अदरक वाली चाय पी रहा हूँ और धूप सेक रहा हूँ। [Aaj subah Rohini me dhoop bahut meethi khili hai beta. Main balcony me baithkar taaza adrak wali chai pee raha hoon aur dhoop sek raha hoon.]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-1', nodeType: 'telephony', overrides: { title: 'Morning Weather & Balcony Wellbeing', actionSummary: 'Affirmed morning sun benefits for joint stiffness and verified tea routine.', statusCode: 'WELLNESS AFFIRMED' } }
    ],
    reasoningNote: '[WELLNESS ROUTINE]: Sun exposure encouraged for osteoarthritis. Affectionate reminder to take Telma 40 post-tea.'
  },
  {
    id: 'sim-elder-joke',
    category: 'companion',
    icon: '😄',
    buttonLabel: 'Morning Walkers Joke',
    scenarioTitle: 'Companion Lore: Wholesome Elder Humor & Laughter',
    badge: 'Lighthearted Humor',
    railBadges: ['Companion Core', 'Humor Shared', 'Warm Bond'],
    railSummary: 'Ramesh jokes about morning walking club peers debating politics over tea ➔ Sambandh shares a warm chuckle',
    tagline: 'Ramesh shares a humorous observation about his morning walking group friends.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: 'अरे बिटिया, आज पार्क में हमारे वॉकिंग ग्रुप वाले गुप्ता जी और शर्मा जी फिर चाय की थड़ी पर देश की पूरी कैबिनेट का फैसला करने बैठ गए! बड़ा मज़ा आया सुनकर।',
    hinglishPrompt: '[Are bitiya, aaj park me hamare walking group wale Gupta ji aur Sharma ji fir chai par desh ki cabinet ka faisla karne baith gaye!]',
    promptText: 'अरे बिटिया, आज पार्क में हमारे वॉकिंग ग्रुप वाले गुप्ता जी और शर्मा जी फिर चाय की थड़ी पर देश की पूरी कैबिनेट का फैसला करने बैठ गए! बड़ा मज़ा आया सुनकर। [Are bitiya, aaj park me hamare walking group wale Gupta ji aur Sharma ji fir chai par desh ki cabinet ka faisla karne baith gaye!]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-1', nodeType: 'telephony', overrides: { title: 'Wholesome Elder Humor & Banter', actionSummary: 'Shared laugh with Ramesh regarding neighborhood tea stall political debates.', statusCode: 'HUMOR LOGGED' } }
    ],
    reasoningNote: '[WARMTH & BANTER]: Lighthearted laughter reinforces emotional connection and safety.'
  }
];
