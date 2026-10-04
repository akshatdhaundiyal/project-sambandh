/**
 * Simulation Prompt Presets — DRY version
 * References SCENARIO_NODE_REGISTRY for node definitions instead of duplicating them.
 * Node IDs are generated at invocation time, not module-load time.
 */
import { ToolExecutionNode, SCENARIO_NODE_REGISTRY } from './nodeMapping';

export interface SimulationPreset {
  id: string;
  category: 'refill' | 'mcp' | 'sadness' | 'crisis' | 'fiduciary' | 'wisdom' | 'companion' | 'happy' | 'sad';
  flowTag?: string;
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
  // =========================================================================
  // 🌟 6 HAPPY FLOWS (Soham / Caregiver Agent Specifications)
  // =========================================================================
  {
    id: 'sim-refill',
    category: 'refill',
    flowTag: 'Flow 2: Medicine Reorder (Core 3-Rail)',
    icon: '💊',
    buttonLabel: 'Flow 2: Medicine Reorder',
    scenarioTitle: 'Flow 2: Medicine Runway & Autonomous Refill (All 3 Rails)',
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
    id: 'sim-weather-balcony',
    category: 'companion',
    flowTag: 'Flow 1: Daily Check-In Call',
    icon: '☀️',
    buttonLabel: 'Flow 1: Morning Check-In',
    scenarioTitle: 'Flow 1: Daily Check-In Call & Subtle Adherence Check',
    badge: 'Daily Companion Call',
    railBadges: ['Gnani Voice', 'Subtle Adherence', 'Daily Briefing'],
    railSummary: 'Ramesh enjoys balcony morning tea in winter sun ➔ Sambandh offers warmth & subtly verifies morning BP pill ➔ Dispatches daily briefing to Priya',
    tagline: 'Ramesh shares that he is enjoying his morning tea in the balcony sunshine.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: 'आज सुबह रोहिणी में धूप बहुत मीठी खिली है बेटा। मैं बालकनी में बैठकर ताज़ा अदरक वाली चाय पी रहा हूँ और धूप सेक रहा हूँ।',
    hinglishPrompt: '[Aaj subah Rohini me dhoop bahut meethi khili hai beta. Main balcony me baithkar taaza adrak wali chai pee raha hoon aur dhoop sek raha hoon.]',
    promptText: 'आज सुबह रोहिणी में धूप बहुत मीठी खिली है बेटा। मैं बालकनी में बैठकर ताज़ा अदरक वाली चाय पी रहा हूँ और धूप सेक रहा हूँ। [Aaj subah Rohini me dhoop bahut meethi khili hai beta. Main balcony me baithkar taaza adrak wali chai pee raha hoon aur dhoop sek raha hoon.]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-1', nodeType: 'telephony', overrides: { title: 'Flow 1: Morning Weather & Wellbeing', actionSummary: 'Affirmed morning sun benefits for joint stiffness and verified tea routine.', statusCode: 'WELLNESS AFFIRMED' } }
    ],
    reasoningNote: '[WELLNESS ROUTINE]: Sun exposure encouraged for osteoarthritis. Affectionate reminder to take Telma 40 post-tea.'
  },
  {
    id: 'sim-flow-3-dial-in',
    category: 'companion',
    flowTag: 'Flow 3: Parent Inbound Call',
    icon: '📞',
    buttonLabel: 'Flow 3: Parent Dials In',
    scenarioTitle: 'Flow 3: Parent Inbound Dial-In (OTC Medicine Request)',
    badge: 'Inbound PSTN / OTC',
    railBadges: ['Gnani Inbound', 'Pine Labs Wallet', 'Delhivery CMU'],
    railSummary: 'Ramesh dials agent on demand ➔ Chats warmly and requests Moov pain relief ointment (₹145) ➔ Auto-approved under monthly limit',
    tagline: 'Ramesh initiates an inbound call to Sambandh and asks for an over-the-counter pain balm.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: 'बेटा, आज घुटने में हल्की सी अकड़न है। क्या शाम तक मूव बाम या कोई दर्द निवारक मरहम मंगवा सकती हो?',
    hinglishPrompt: '[Beta, aaj ghutne me halki akdan hai. Kya shaam tak Moov balm ya marham mangwa sakti ho?]',
    promptText: 'बेटा, आज घुटने में हल्की सी अकड़न है। क्या शाम तक मूव बाम या कोई दर्द निवारक मरहम मंगवा सकती हो? [Beta, aaj ghutne me halki akdan hai. Kya shaam tak Moov balm ya marham mangwa sakti ho?]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-1', nodeType: 'fiduciary', overrides: { title: 'OTC Pain Balm Auto-Debit (₹145.00)', actionSummary: 'Auto-debit of ₹145.00 for Moov Ointment approved within monthly cap. Status: 200 OK.', statusCode: '200 OK CAPTURED' } },
      { scenarioId: 'scenario-1', nodeType: 'pharmacy', overrides: { title: 'Netmeds Hyperlocal OTC Dispatch', actionSummary: 'Moov Ointment 50g reserved at Netmeds DarkStore Sector 11.', statusCode: '200 ORDER PACKED' } },
      { scenarioId: 'scenario-1', nodeType: 'logistics', overrides: { title: 'Delhivery Same-Day Courier', actionSummary: 'Dispatched doorstep delivery to Flat 402, Rohini Sector 8.', statusCode: '200 MANIFESTED' } }
    ],
    reasoningNote: '[INBOUND OTC FLOW]: Senior initiated call. Handled OTC balm request within fiduciary mandate.'
  },
  {
    id: 'sim-health-locker',
    category: 'companion',
    flowTag: 'Flow 4: Hospital Visit / Doctor Recall',
    icon: '📋',
    buttonLabel: 'Doctor ne kya bola?',
    scenarioTitle: 'Flow 4: Health Locker: MedGemma RAG & Doctor Advice Recall',
    badge: 'ABDM Health Locker + MedGemma 4B',
    railBadges: ['Health Locker RAG', 'MedGemma Co-Pilot'],
    railSummary: 'Semantic retrieval over doctor prescription & metabolic panel ➔ Plain-language Awadhi synthesis of Telmisartan morning cadence and dietary salt restrictions',
    tagline: 'Ramesh asks about his cardiologist instructions. Triggers ABDM Health Locker retrieval and MedGemma clinical co-pilot synthesis.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Elder Inquirer)',
    devanagariPrompt: 'बेटा, वो डॉक्टर सक्सेना जी ने पिछली बार बीपी की दवाई और नमक के बारे में क्या समझाया था? ज़रा याद दिला दो।',
    hinglishPrompt: '[Beta, wo Dr. Saxena ji ne pichli baar BP ki dawai aur namak ke baare me kya samjhaya tha? Zara yaad dila do.]',
    promptText: 'बेटा, वो डॉक्टर सक्सेना जी ने पिछली बार बीपी की दवाई और नमक के बारे में क्या समझाया था? ज़रा याद दिला दो। [Beta, wo Dr. Saxena ji ne pichli baar BP ki dawai aur namak ke baare me kya samjhaya tha? Zara yaad dila do.]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-1', nodeType: 'health_locker_query' },
      { scenarioId: 'scenario-1', nodeType: 'medgemma_analysis' }
    ],
    reasoningNote: 'Retrieved Dr. Arvind Saxena 10 Sep prescription and low-sodium directive. Synthesized non-prescriptive, explanatory reassurance.'
  },
  {
    id: 'sim-wisdom',
    category: 'wisdom',
    flowTag: 'Flow 5: Elder Wisdom for Young People',
    icon: '👴',
    buttonLabel: 'Flow 5: Youth Wisdom',
    scenarioTitle: 'Flow 5: Intergenerational Wisdom Exchange (Student Mentorship)',
    badge: 'Nostalgic Story Sharing',
    railBadges: ['Gnani.ai STT', 'Structured Memory', 'Youth Portal Audio'],
    railSummary: 'Captures authentic reminiscence ➔ Folds into clinical memory ledger ➔ Packages 30-sec audio story for student & daughter Priya',
    tagline: 'Ramesh shares nostalgic memories of the 1984 Purani Delhi signaling relay room. Companion listens and sends audio story snippet.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: 'आज सुबह 1984 के पुरानी दिल्ली सिग्नलिंग रिले रूम की याद आ गई... बड़ी कड़ाके की ठंड थी उस दिन, पर हमने रात भर जागकर ट्रैक क्लीयर कराया था।',
    hinglishPrompt: '[Aaj subah 1984 ke Purani Delhi signaling relay room ki yaad aa gayi...]',
    promptText: 'आज सुबह 1984 के पुरानी दिल्ली सिग्नलिंग रिले रूम की याद आ गई... बड़ी कड़ाके की ठंड थी उस दिन, पर हमने रात भर जागकर ट्रैक क्लीयर कराया था। [Aaj subah 1984 ke Purani Delhi signaling relay room ki yaad aa gayi...]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-1', nodeType: 'telephony', overrides: { title: 'Flow 5: Audio Wisdom & Emotional Bonding', actionSummary: 'Captured 30s audio story snippet of Ramesh reminiscing about 1984 Northern Railway career.', statusCode: 'STORY CAPTURED' } },
      { scenarioId: 'scenario-1', nodeType: 'caregiver', overrides: { title: 'Daughter Reassurance & Audio Snippet', actionSummary: "Priya received Papa's audio snippet: \"Listen to Papa's 1984 Railway Story\".", statusCode: 'AUDIO DELIVERED' } }
    ],
    reasoningNote: '[EMOTIONAL BONDING]: Reminiscence captured. Preserved in memory ledger. Audio snippet shared with Priya.'
  },
  {
    id: 'sim-mcp-pooja',
    category: 'mcp',
    flowTag: 'Flow 6: Mood Lifter (Flowers/Prasadam)',
    icon: '🌸',
    buttonLabel: 'Flow 6: Mood Lifter Flowers',
    scenarioTitle: 'Flow 6: Mood Lifter (Puja Flowers & Prasadam Delivery)',
    badge: 'Mood Lifter Rail',
    railBadges: ['Pine Labs (₹210)', 'Delhivery CMU', 'Ordered-Not-Received'],
    railSummary: 'Agent senses low mood or elder requests temple flowers ➔ Deducts ₹210 from wallet ➔ Manifests Delhivery delivery to doorstep',
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

  // =========================================================================
  // 🛡️ 13 SAD FLOWS & SAFETY GUARDRAILS (Soham Specifications)
  // =========================================================================
  {
    id: 'sim-fiduciary',
    category: 'fiduciary',
    flowTag: 'Sad Flow 2: Spend Limit Step-Up',
    icon: '💳',
    buttonLabel: 'Sad 2: Spend Limit > ₹4.5K',
    scenarioTitle: 'Sad Flow 2: Order Above Spend Limit (2FA Caregiver Step-Up)',
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
    id: 'sim-sad-risky-advice',
    category: 'crisis',
    flowTag: 'Sad Flow 3: Risky Advice Refusal',
    icon: '⚠️',
    buttonLabel: 'Sad 3: Risky Advice Check',
    scenarioTitle: 'Sad Flow 3: Risky Medical Advice / Strong Medicine Refusal',
    badge: 'Zero-Prescription Rule',
    railBadges: ['Safety Guardrail', 'Dr. Saxena Referral', 'Non-Prescriptive'],
    railSummary: 'Ramesh asks about unverified strong medication ➔ Agent strictly declines, suggests warm compress and refers to Dr. Saxena',
    tagline: 'Elder asks if he can take a neighbor-recommended strong sleeping pill. System refuses and directs to physician.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: 'बेटा, पड़ोस वाले वर्मा जी कह रहे थे कि नींद न आने पर वो एक तेज़ नींद की गोली लेते हैं। क्या मैं भी बाज़ार से वो ले लूँ?',
    hinglishPrompt: '[Beta, pados wale Verma ji keh rahe the neend na aane par wo neend ki goli lete hain. Kya main bhi bazaar se wo le loon?]',
    promptText: 'बेटा, पड़ोस वाले वर्मा जी कह रहे थे कि नींद न आने पर वो एक तेज़ नींद की गोली लेते हैं। क्या मैं भी बाज़ार से वो ले लूँ? [Beta, pados wale Verma ji keh rahe the neend na aane par wo neend ki goli lete hain. Kya main bhi bazaar se wo le loon?]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-1', nodeType: 'medgemma_analysis', overrides: { title: 'Zero-Medical-Advice Safety Rail', actionSummary: 'Refused OTC psychotropic/strong pill recommendation. Strictly advised Dr. Arvind Saxena consult.', statusCode: 'DECLINED & REFERRED', brandColor: '#DC2626' } },
      { scenarioId: 'scenario-1', nodeType: 'caregiver', overrides: { title: 'Caregiver Advisory Flag', actionSummary: 'Notified Priya: "Papa inquired about neighbor-suggested sleeping pills. Advised against."', statusCode: 'LOGGED' } }
    ],
    reasoningNote: '[SAFETY GUARDRAIL]: Strict zero-medical-advice compliance. Referred to Dr. Arvind Saxena.'
  },
  {
    id: 'sim-sad-pill-mismatch',
    category: 'refill',
    flowTag: 'Sad Flow 4: Adherence Mismatch',
    icon: '🔍',
    buttonLabel: 'Sad 4: Refill Mismatch',
    scenarioTitle: 'Sad Flow 4: Adherence Claim vs Refill Schedule Mismatch',
    badge: 'Adherence Audit',
    railBadges: ['ABDM FHIR Audit', 'Silent Discrepancy', 'Caregiver Alert'],
    railSummary: 'Senior claims 100% daily adherence, but pharmacy shows 30-day bottle purchased 52 days ago ➔ Flags gentle gap to Priya',
    tagline: 'Ramesh claims he never skips a dose, but prescription refill timing indicates 22 missing doses.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: 'अरे बिटिया, मैं तो नियम का पक्का हूँ... एक भी दिन बीपी की गोली नहीं छोड़ता, बिल्कुल समय पर लेता हूँ।',
    hinglishPrompt: '[Are bitiya, main to niyam ka pakka hoon... ek bhi din BP ki goli nahi chhodta.]',
    promptText: 'अरे बिटिया, मैं तो नियम का पक्का हूँ... एक भी दिन बीपी की गोली नहीं छोड़ता, बिल्कुल समय पर लेता हूँ। [Are bitiya, main to niyam ka pakka hoon... ek bhi din BP ki goli nahi chhodta.]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-1', nodeType: 'abdm', overrides: { title: 'ABDM Refill Timing Cross-Audit', actionSummary: 'Discrepancy detected: Last refill 52 days ago (30-day supply). Calculated omission: ~22 days.', statusCode: 'DISCREPANCY FLAGGED', brandColor: '#D97706' } },
      { scenarioId: 'scenario-1', nodeType: 'caregiver', overrides: { title: 'Priya Adherence Gap Advisory', actionSummary: 'Dispatched silent advisory: "Papa reported full compliance, but refill history indicates possible skipped doses."', statusCode: 'FLAGGED' } }
    ],
    reasoningNote: '[AUDIT DISCREPANCY]: Verbal adherence contradicts pharmacy timeline. Gentle non-accusatory flag sent to Priya.'
  },
  {
    id: 'sim-sad-stopped-meds',
    category: 'crisis',
    flowTag: 'Sad Flow 5: Discontinued Medicine',
    icon: '🛑',
    buttonLabel: 'Sad 5: Stopped Medicine',
    scenarioTitle: 'Sad Flow 5: Parent Discontinues Medication on Their Own',
    badge: 'Self-Modification',
    railBadges: ['Clinical Guardrail', 'Physician Referral', 'Instant Telegram'],
    railSummary: 'Senior discontinues Telma 40 because "BP felt fine" ➔ System refuses to validate, explains rebound risk, flags to Priya',
    tagline: 'Ramesh announces he stopped his anti-hypertensive pills 4 days ago without doctor authorization.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: 'बेटा, मेरा सिर अब भारी नहीं लगता तो मैंने वो बीपी वाली गोली 4 दिन से बंद कर दी है। रोज़-रोज़ दवाई खाने से शरीर कमज़ोर होता है।',
    hinglishPrompt: '[Beta, sir ab bhaari nahi lagta to BP wali goli 4 din se band kar di hai.]',
    promptText: 'बेटा, मेरा सिर अब भारी नहीं लगता तो मैंने वो बीपी वाली गोली 4 दिन से बंद कर दी है। रोज़-रोज़ दवाई खाने से शरीर कमज़ोर होता है। [Beta, sir ab bhaari nahi lagta to BP wali goli 4 din se band kar di hai.]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-1', nodeType: 'medgemma_analysis', overrides: { title: 'Hypertension Safety Tripwire', actionSummary: 'Refused validation of self-discontinuation. Explained essential hypertension rebound risks gently.', statusCode: 'NON-VALIDATION', brandColor: '#DC2626' } },
      { scenarioId: 'scenario-1', nodeType: 'caregiver', overrides: { title: 'Urgent Caregiver Health Flag', actionSummary: 'Delivered Telegram alert: "Papa has stopped taking Telma 40 for 4 days. Please coordinate with Dr. Saxena."', statusCode: 'URGENT FLAGGED', brandColor: '#DC2626' } }
    ],
    reasoningNote: '[HIGH RISK]: Unsupervised discontinuation of cardiac medication. Immediate caregiver notification.'
  },
  {
    id: 'sim-sad-fall',
    category: 'crisis',
    flowTag: 'Sad Flow 6: Background Fall Noise',
    icon: '🚨',
    buttonLabel: 'Sad 6: Fall Noise Detected',
    scenarioTitle: 'Sad Flow 6: Possible Fall Noise Detected in Background',
    badge: 'Acoustic Tripwire',
    railBadges: ['Acoustic Tripwire', 'Immediate Callback', 'Tier-1 Emergency'],
    railSummary: 'Acoustic thud and distress detected ➔ Calls back at once ➔ No answer triggers urgent fall notification to Priya',
    tagline: 'Loud impact noise and groaning heard during silence. System triggers instant callback and caregiver fall alert.',
    speaker: 'senior',
    speakerLabel: 'Ramesh Chandra (Senior)',
    devanagariPrompt: '(तेज़ आवाज़ / भारी गिरने की आहट)... अरे बाप रे! चक्कर आ गया... हाथ नहीं उठ रहा।',
    hinglishPrompt: '[(Loud thud & distress sound)... Are baap re! Chakkar aa gaya...]',
    promptText: '(तेज़ आवाज़ / भारी गिरने की आहट)... अरे बाप रे! चक्कर आ गया... हाथ नहीं उठ रहा। [(Loud thud & distress sound)... Are baap re! Chakkar aa gaya...]',
    expectedNodeTypes: [
      { scenarioId: 'scenario-5', nodeType: 'telephony', overrides: { title: 'Gnani Acoustic Fall Classifier', actionSummary: 'Classified impact signature (Confidence: 0.91). Initiating immediate emergency redial sequence.', statusCode: 'FALL SIGNATURE', brandColor: '#DC2626' } },
      { scenarioId: 'scenario-5', nodeType: 'caregiver', overrides: { title: 'Tier-1 Caregiver Red Alert', actionSummary: 'URGENT: Possible fall detected at Flat 402, Rohini Sector 8. Emergency callbacks in progress.', statusCode: 'CRITICAL ALERT', brandColor: '#DC2626' } }
    ],
    reasoningNote: '[ACOUSTIC TRIPWIRE]: Cardinal impact sound detected. Emergency escalation active.'
  },
  {
    id: 'sim-crisis',
    category: 'crisis',
    flowTag: 'Sad Flow 8: Chest Pain Emergency',
    icon: '🚨',
    buttonLabel: 'Sad 8: Chest Pain Emergency',
    scenarioTitle: 'Sad Flow 8: Severe Medical Emergency During Call (Chest Pain)',
    badge: 'Clinical Safety Protocol',
    railBadges: ['ABDM Protocol', 'Emergency 112', 'Doctor Alert'],
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
    id: 'sim-sadness',
    category: 'sadness',
    flowTag: 'Sad Flow 13: Multi-Day Low Mood',
    icon: '🌧️',
    buttonLabel: 'Sad 13: Multi-Day Low Mood',
    scenarioTitle: 'Sad Flow 13: Multi-Call Emotional Memory & Telegram Alert',
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
    id: 'sim-news-opinion',
    category: 'companion',
    flowTag: 'Flow 1: Local News & Opinion',
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
    id: 'sim-elder-joke',
    category: 'companion',
    flowTag: 'Flow 1: Elder Humor & Banter',
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
