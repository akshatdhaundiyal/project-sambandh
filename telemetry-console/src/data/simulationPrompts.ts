/**
 * Simulation Prompt Presets — DRY version
 * References SCENARIO_NODE_REGISTRY for node definitions instead of duplicating them.
 * Node IDs are generated at invocation time, not module-load time.
 */
import { ToolExecutionNode, SCENARIO_NODE_REGISTRY } from './nodeMapping';

export interface SimulationPreset {
  id: string;
  category: 'refill' | 'mcp' | 'sadness' | 'crisis' | 'fiduciary' | 'wisdom';
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
  }
];
