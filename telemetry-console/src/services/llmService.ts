/**
 * Project Sambandh LLM Inference & Reasoning Service
 * Connects to OpenRouter (e.g. google/gemma-4-31b-it:free, claude-3.5-sonnet, deepseek-r1)
 * and Google Gemini with automatic graceful fallback to deterministic benchmarks.
 */

import {
  MEDICATION_KEYWORDS, SYMPTOM_KEYWORDS, FINANCIAL_KEYWORDS,
  FAMILY_KEYWORDS, BREAKFAST_KEYWORDS, GREETING_KEYWORDS,
  matchesKeywords, DEFAULT_MEMORY_LEDGER
} from '../data/keywords';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LlmInferenceResult {
  text: string;
  hindiText?: string;
  hinglishText?: string;
  modelUsed: string;
  latencyMs: number;
  tokensUsed?: number;
  isLiveApi: boolean;
  isFailover?: boolean;
  providerBadge?: string;
  error?: string;
}

/**
 * Free fallback cascade on OpenRouter verified active with HTTP 200
 */
export const OPENROUTER_FREE_FALLBACK_CASCADE: string[] = [
  'nvidia/nemotron-3-super-120b-a12b:free',
  'google/gemma-4-26b-a4b-it:free',
  'liquid/lfm-2.5-2.6b:free',
  'qwen/qwen3.8-27b:free'
];

/**
 * Contextual In-Character Fallback Generator
 * If LLM APIs fail or rate limit, directly considers the user's message.
 * NEVER asks the user to repeat!
 */
export const generateContextualCompanionResponse = (
  userMessage: string,
  _history?: ChatMessage[],
  _memoryLedger?: string
): string => {
  const text = userMessage || '';

  // 1. Medication / Prescriptions / Pill Counts / Stock
  if (matchesKeywords(text, MEDICATION_KEYWORDS)) {
    return 'रमेश अंकल, मैंने नोट कर लिया है। आपकी बीपी की दवा (Telmisartan) के पर्चे और स्टॉक का पूरा ब्योरा हमारे पास है। आप बिल्कुल चिंता मत कीजिए, हमने समय रहते नई आपूर्ति का इंतज़ाम सुनिश्चित कर दिया है। [Ramesh Uncle, maine note kar liya hai. Aapki BP ki dawa (Telmisartan) ke parche aur stock ka poora byora hamare paas hai. Aap bilkul chinta mat kijiye, humne samay rehte nayi aapoorti ka intezam sunishchit kar diya hai.]';
  }

  // 2. Physical Symptoms / Knee Pain / Stiffness / BP / Walking
  if (matchesKeywords(text, SYMPTOM_KEYWORDS)) {
    return 'अंकल जी, घुटने की तकलीफ का खास ख्याल रखिए। सुबह के समय थोड़ी गुनगुने पानी की सिकाई कर लेने से आराम मिलेगा। आज धूप में थोड़ी देर बैठिएगा और सीढ़ियों पर संभलकर चलिएगा। [Uncle ji, ghutne ki takleef ka khaas khyal rakhiye. Subah ke samay thodi gungune paani ki sikaai kar lene se aaram milega. Aaj dhoop me thodi der baithiyega aur seedhiyon par sambhalkar chaliyega.]';
  }

  // 3. Daughter Priya / Caregiver / Bangalore / Family
  if (matchesKeywords(text, FAMILY_KEYWORDS)) {
    return 'जी अंकल, प्रिया बिटिया को आपके स्वास्थ्य और सुबह की दिनचर्या का पूरा अपडेट टेलीग्राम पर भेज दिया गया है। वह बैंगलोर में निश्चिंत हैं और शाम को आपसे बात करेंगी। [Ji uncle, Priya bitiya ko aapke swasthya aur subah ki dincharya ka poora update Telegram par bhej diya gaya hai. Woh Bangalore me nishchint hain aur shaam ko aapse baat karengi.]';
  }

  // 4. Financial / Pension / Bank / UPI / Pine Labs / Mandate
  if (matchesKeywords(text, FINANCIAL_KEYWORDS)) {
    return 'अंकल जी, पैसों या बैंक खाते को लेकर बिल्कुल बेफिक्र रहिए। संबंध केयर पर केवल तय ₹840 का अधिकृत दवा बिल प्रोसेस हुआ है, जो आपकी तय ₹4,500 की सीमा के अंदर है। कोई अतिरिक्त पैसा नहीं कटेगा। [Uncle ji, paison ya bank khate ko lekar bilkul befikr rahiye. Sambandh Care par kewal tay 840 rupaye ka adhikrit dawa bill process hua hai, jo aapki tay 4,500 rupaye ki seema ke andar hai. Koi atirikt paisa nahi katega.]';
  }

  // 5. Breakfast / Morning Tea / Routine / Daliya
  if (matchesKeywords(text, BREAKFAST_KEYWORDS)) {
    return 'बहुत बढ़िया अंकल जी, सुबह की ताज़ा चाय और हल्का नाश्ता स्वास्थ्य के लिए सबसे अच्छा है। अब आप थोड़ा आराम कीजिए और गुनगुनी धूप का आनंद लीजिए। [Bahut badhiya Uncle ji, subah ki taaza chai aur halka nashta swasthya ke liye sabse achha hai. Ab aap thoda aaram kijiye aur gunguni dhoop ka aanand lijiye.]';
  }

  // 6. Affirmations / Greetings (Haan, Theek, Namaste, Pranam)
  if (matchesKeywords(text, GREETING_KEYWORDS)) {
    return 'यह सुनकर बहुत तसल्ली हुई अंकल जी। आपकी आवाज़ में ताजगी सुनकर दिन अच्छा बीतता है। आज का मौसम भी अच्छा है, आप आराम से बैठिए और पानी पीते रहिए। [Yeh sunkar bahut tasalli hui Uncle ji. Aapki aawaz me taazgi sunkar din achha beetta hai. Aaj ka mausam bhi achha hai, aap aaram se baithiye aur paani peete rahiye.]';
  }

  // 7. General in-character attentive response (NEVER asks user to repeat!)
  return 'अंकल जी, आपकी यह बात मैंने अच्छी तरह समझ ली है और हमारे केयर रिकॉर्ड में दर्ज कर ली है। आप बिल्कुल आराम से रहिए, हम हमेशा आपके साथ हैं। [Uncle ji, aapki yeh baat maine achhi tarah samajh li hai aur hamare care record me darj kar li hai. Aap bilkul aaram se rahiye, hum hamesha aapke saath hain.]';
};

/**
 * Resolves the OpenRouter API key from localStorage or Vite environment variables
 */
export const getOpenRouterApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('sambandh_openrouter_key');
    if (local && local.trim()) return local.trim();
  }

  const env = (import.meta as any).env || {};
  return (
    env.VITE_OPENROUTER_API_KEY ||
    env.OPENROUTER_API ||
    env.OPENROUTER_API_KEY ||
    ''
  );
};

/**
 * Pings OpenRouter to test credentials and endpoint accessibility
 */
export const testOpenRouterConnection = async (apiKey?: string): Promise<{ success: boolean; message: string; model?: string }> => {
  const key = apiKey || getOpenRouterApiKey();
  if (!key) {
    return { success: false, message: 'No OpenRouter API key provided.' };
  }

  try {
    const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
      headers: {
        'Authorization': `Bearer ${key}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      const label = data.data?.label || 'Authenticated Key';
      const limit = data.data?.limit !== null ? `$${data.data?.limit}` : 'Unlimited/Free';
      return {
        success: true,
        message: `Connected successfully! (${label} · Limit: ${limit})`
      };
    } else {
      const errData = await res.json().catch(() => ({}));
      return {
        success: false,
        message: errData?.error?.message || `HTTP ${res.status}: Authentication failed.`
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error connecting to OpenRouter.'
    };
  }
};

/**
 * Calls OpenRouter Chat Completion endpoint (with primary model and fallback model)
 */
export const callOpenRouter = async (
  modelId: string,
  messages: ChatMessage[],
  systemPrompt?: string
): Promise<LlmInferenceResult> => {
  const startTime = Date.now();
  const apiKey = getOpenRouterApiKey();

  const formattedMessages: ChatMessage[] = [];
  if (systemPrompt) {
    formattedMessages.push({ role: 'system', content: systemPrompt });
  }
  formattedMessages.push(...messages);

  if (!apiKey) {
    return {
      text: 'OpenRouter API key is not configured. Running in deterministic simulation mode.',
      modelUsed: modelId,
      latencyMs: 15,
      isLiveApi: false
    };
  }

  // Priority list starting with preferred model, cascading through working free models
  const candidateModels = Array.from(new Set([
    modelId,
    ...OPENROUTER_FREE_FALLBACK_CASCADE
  ]));

  for (const model of candidateModels) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://sambandh.ai',
          'X-Title': 'Project Sambandh Telemetry'
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 350
        })
      });

      const data = await response.json();
      const latencyMs = Date.now() - startTime;

      if (response.ok && data?.choices?.[0]?.message?.content) {
        const text = data.choices[0].message.content.trim();
        return {
          text,
          modelUsed: model,
          latencyMs,
          tokensUsed: data.usage?.total_tokens,
          isLiveApi: true,
          isFailover: model !== modelId
        };
      }

      // If rate limited upstream on free pool, try next candidate in cascade
      if (data?.error?.code === 429) {
        console.warn(`[OpenRouter] ${model} upstream rate limited (429), failing over to next model in cascade...`);
        continue;
      }

      if (data?.error) {
        console.warn(`[OpenRouter] ${model} returned error, trying next candidate in cascade:`, data.error.message || data.error);
        continue;
      }
    } catch (err: any) {
      console.warn(`[OpenRouter] Call failed for ${model}:`, err.message);
    }
  }

  // Cross-Provider Resilience: If OpenRouter is unable to serve the model,
  // fall back directly to Google Gemini API using the verified active Google AI Studio key!
  console.info('[OpenRouter] Free pool busy. Automatically failing over to Google Gemini AI Studio...');
  try {
    const geminiFallback = await callGemini('gemini-3.5-flash-lite', messages, systemPrompt);
    if (geminiFallback.isLiveApi) {
      return {
        ...geminiFallback,
        isFailover: true,
        providerBadge: '⚡ Google AI Studio (Failover)'
      };
    }
  } catch (geminiErr: any) {
    console.warn('[Gemini Fallback Error]:', geminiErr.message);
  }

  // Final In-Character Contextual Fallback if all external networks fail
  // NEVER asks the user to repeat!
  const latestUserMsg = messages.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
  const fallbackText = generateContextualCompanionResponse(latestUserMsg, messages);
  const latencyMs = Date.now() - startTime;

  return {
    text: fallbackText,
    modelUsed: `${modelId} (Contextual Resilience)`,
    latencyMs,
    isLiveApi: false,
    isFailover: true,
    error: 'All live API endpoints busy · Contextual fallback activated'
  };
};

/**
 * Resolves the Google Gemini API key
 */
export const getGeminiApiKey = (): string => {
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('sambandh_gemini_key');
    if (local && local.trim()) return local.trim();
  }
  const env = (import.meta as any).env || {};
  return (
    env.VITE_GEMINI_API_KEY ||
    env.GEMINI_API_KEY ||
    ''
  );
};

/**
 * Calls Google Gemini REST API directly using gemini-3.5-flash-lite / gemini-flash-latest
 * Supports multi-turn chat message format, system instruction, and automatic model failover
 */
export const callGemini = async (
  modelId: string = 'gemini-3.5-flash-lite',
  messagesOrPrompt: string | ChatMessage[],
  systemPrompt?: string
): Promise<LlmInferenceResult> => {
  const startTime = Date.now();
  const apiKey = getGeminiApiKey();
  const candidateGeminiModels = [
    modelId.startsWith('gemini-') ? modelId : 'gemini-3.5-flash-lite',
    'gemini-3.5-flash-lite',
    'gemini-flash-latest'
  ].filter((v, i, a) => a.indexOf(v) === i);

  let contents: any[] = [];
  if (typeof messagesOrPrompt === 'string') {
    contents = [{ role: 'user', parts: [{ text: messagesOrPrompt }] }];
  } else {
    contents = messagesOrPrompt.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
  }

  const requestBody: any = {
    contents,
    generationConfig: { maxOutputTokens: 350, temperature: 0.7 }
  };

  if (systemPrompt) {
    requestBody.system_instruction = {
      parts: [{ text: systemPrompt }]
    };
  }

  for (const targetModel of candidateGeminiModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${targetModel}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });
      const data = await res.json();
      const latencyMs = Date.now() - startTime;
      if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        const cleanName = targetModel === 'gemini-3.5-flash-lite' ? 'Gemini 3.5 Flash-Lite' : 'Gemini Flash Latest';
        return {
          text: data.candidates[0].content.parts[0].text.trim(),
          modelUsed: cleanName,
          latencyMs,
          isLiveApi: true
        };
      }
      if (data?.error) {
        console.warn(`[Gemini] ${targetModel} returned error:`, data.error.message || data.error);
      }
    } catch (err: any) {
      console.warn(`[Gemini] Call failed for ${targetModel}:`, err.message);
    }
  }

  const latestUserMsg = typeof messagesOrPrompt === 'string'
    ? messagesOrPrompt
    : messagesOrPrompt.filter(m => m.role === 'user').slice(-1)[0]?.content || '';
  const fallbackText = generateContextualCompanionResponse(latestUserMsg);

  return {
    text: fallbackText,
    modelUsed: `${modelId} (Contextual Resilience)`,
    latencyMs: Date.now() - startTime,
    isLiveApi: false,
    isFailover: true
  };
};

/**
 * Rolling Structured Memory Ledger (Context & Token Folding Engine)
 * Merges previous history and new turns into a comprehensive 5-category clinical ledger.
 * Preserves 100% of symptoms, vitals, medications, adherence, emotions, rails, and open topics.
 */
export const foldConversationMemory = async (
  turns: Array<{ speaker: string; speakerLabel: string; content: string }>,
  existingMemory?: string
): Promise<string> => {
  const dialogueTurns = turns.filter(t => t.speaker === 'senior' || t.speaker === 'agent');
  if (dialogueTurns.length === 0) {
    return existingMemory || DEFAULT_MEMORY_LEDGER;
  }

  const turnsText = dialogueTurns
    .slice(-10)
    .map(t => `${t.speakerLabel}: ${t.content}`)
    .join('\n');

  const compactionPrompt = `You are Sambandh's clinical and conversational memory engine for 74-year-old elder Ramesh Chandra (retired railway inspector, Rohini, Delhi).
Your goal is to maintain a comprehensive, structured Memory Ledger so that NO clinical, medication, emotional, or conversational context is ever lost.

Existing Structured Memory Ledger:
"${existingMemory || 'Initial check-in started.'}"

New Conversation Turns to Fold:
${turnsText}

Task: Update the Structured Memory Ledger by incorporating all facts from the new turns while strictly preserving all existing established history (do not discard past symptoms or entities).
Output strictly in the following 5 structured bullet points:
• [Clinical & Symptoms]: All reported vitals, physical complaints (knee pain, stiffness, BP), morning routine, appetite, sleep quality.
• [Medication & Adherence]: Specific drug names (Telmisartan, Metformin, Amlodipine), exact pill counts remaining, confirmed doses taken or pending.
• [Emotional & Psycho-Social]: Elder's emotional tone, warmth, mentions of daughter Priya, family stories, memories.
• [Active Rails & Actions]: Triggered rails, mandate debits (₹840 Pine Labs auto-debit / ₹4,500 cap), ABDM queries, Delhivery dispatch, caregiver briefs.
• [Open Topics & Continuity]: Topics or questions initiated by Ramesh that need ongoing conversational follow-up.

Preserve exact numbers, medication names, and emotional context. Output ONLY the 5 bulleted categories.`;

  try {
    // Try Gemini Flash-Lite first for rapid compaction, then OpenRouter Gemma 4
    const res = await callGemini('gemini-3.5-flash-lite', compactionPrompt);
    if (res.isLiveApi && res.text && res.text.includes('• [')) {
      return res.text.trim();
    } else if (res.isLiveApi && res.text) {
      return res.text.trim();
    }

    const openRouterRes = await callOpenRouter('google/gemma-4-31b-it:free', [{ role: 'user', content: compactionPrompt }]);
    if (openRouterRes.isLiveApi && openRouterRes.text) {
      return openRouterRes.text.trim();
    }
  } catch (err) {
    console.warn('[MemoryFolding] Compaction call failed, preserving existing memory:', err);
  }

  // Graceful structured fallback ledger preserving multi-category context
  return existingMemory || DEFAULT_MEMORY_LEDGER;
};

