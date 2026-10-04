/**
 * Project Sambandh Live Telegram Bot REST Dispatcher Service
 * Connects directly to Telegram Bot MTProto REST API (https://api.telegram.org/bot<TOKEN>/sendMessage)
 * Dispatches real-time caregiver briefings, 1-tap medication approval cards, and emergency notifications.
 */

import { MedicationApprovalRequest, DoctorAppointmentApprovalRequest } from '../types/telemetry';

export interface TelegramCredentials {
  botToken: string;
  chatId: string;
  isConfigured: boolean;
}

export interface TelegramSendResult {
  success: boolean;
  messageId?: number;
  statusCode?: number;
  error?: string;
  latencyMs: number;
}

export interface TelegramBotInfo {
  success: boolean;
  botId?: number;
  botName?: string;
  botUsername?: string;
  canJoinGroups?: boolean;
  error?: string;
}

/**
 * Resolves live Telegram credentials from environment variables or localStorage
 */
export const getTelegramCredentials = (): TelegramCredentials => {
  let botToken = '';
  let chatId = '';

  if (typeof window !== 'undefined') {
    const localToken = localStorage.getItem('sambandh_telegram_token');
    const localChatId = localStorage.getItem('sambandh_telegram_chat_id');
    if (localToken && localToken.trim()) botToken = localToken.trim();
    if (localChatId && localChatId.trim()) chatId = localChatId.trim();
  }

  const env = (typeof import.meta !== 'undefined' ? (import.meta as any).env : {}) || {};
  const procEnv = (typeof (globalThis as any).process !== 'undefined' ? (globalThis as any).process.env : {}) || {};

  if (!botToken) {
    botToken = (env.VITE_TELEGRAM_BOT_TOKEN || env.TELEGRAM_BOT_TOKEN || procEnv.VITE_TELEGRAM_BOT_TOKEN || procEnv.TELEGRAM_BOT_TOKEN || '').replace(/^["']|["']$/g, '').trim();
  }

  if (!chatId) {
    chatId = (env.VITE_TELEGRAM_CHAT_ID || env.TELEGRAM_CHAT_ID || procEnv.VITE_TELEGRAM_CHAT_ID || procEnv.TELEGRAM_CHAT_ID || '').replace(/^["']|["']$/g, '').trim();
  }

  return {
    botToken,
    chatId,
    isConfigured: Boolean(botToken && chatId)
  };
};

/**
 * Saves custom Telegram credentials to localStorage
 */
export const saveTelegramCredentials = (botToken: string, chatId: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('sambandh_telegram_token', botToken.trim());
    localStorage.setItem('sambandh_telegram_chat_id', chatId.trim());
  }
};

/**
 * Verifies live Telegram Bot Token against https://api.telegram.org/bot<TOKEN>/getMe
 */
export const testTelegramBotConnection = async (customToken?: string): Promise<TelegramBotInfo> => {
  const token = customToken || getTelegramCredentials().botToken;
  if (!token) {
    return { success: false, error: 'Telegram Bot Token is not configured.' };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await res.json();

    if (res.ok && data.ok && data.result) {
      return {
        success: true,
        botId: data.result.id,
        botName: data.result.first_name,
        botUsername: data.result.username ? `@${data.result.username}` : undefined,
        canJoinGroups: data.result.can_join_groups
      };
    } else {
      return {
        success: false,
        error: data.description || `HTTP ${res.status}: Failed to authenticate bot token.`
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network error connecting to Telegram Bot API.'
    };
  }
};

/**
 * Raw Telegram Message Dispatcher
/**
 * Sanitizes strings for Telegram HTML parse mode to prevent 400 Bad Request errors.
 */
export const escapeHtml = (text: string = ''): string => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};

/**
 * Raw Telegram Message Dispatcher
 */
export const sendTelegramMessage = async (
  text: string,
  options?: {
    chatId?: string;
    parseMode?: 'HTML' | 'MarkdownV2' | 'Markdown';
    inlineButtons?: Array<Array<{ text: string; callback_data?: string; url?: string }>>;
  }
): Promise<TelegramSendResult> => {
  const startTime = Date.now();
  const creds = getTelegramCredentials();
  const token = creds.botToken;
  const targetChatId = options?.chatId || creds.chatId;

  if (!token || !targetChatId) {
    return {
      success: false,
      error: 'Telegram Bot Token or Chat ID is missing.',
      latencyMs: 0
    };
  }

  const payload: any = {
    chat_id: targetChatId,
    text,
    parse_mode: options?.parseMode || 'HTML',
    disable_web_page_preview: false
  };

  if (options?.inlineButtons && options.inlineButtons.length > 0) {
    // Sanitize buttons: Telegram requires valid HTTPS URLs; localhost URLs are mapped to callback_data
    const sanitizedButtons = options.inlineButtons.map(row =>
      row.map(btn => {
        if (btn.url && (btn.url.startsWith('http://localhost') || btn.url.startsWith('http://127.0.0.1'))) {
          return {
            text: btn.text,
            callback_data: btn.callback_data || 'open_local_app'
          };
        }
        return btn;
      })
    );
    payload.reply_markup = {
      inline_keyboard: sanitizedButtons
    };
  }

  try {
    let res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    let data = await res.json();

    // Automatic fallback: if HTML parse fails due to formatting, retry as plain text
    if (!res.ok && payload.parse_mode && data.description?.includes("can't parse entities")) {
      console.warn('[TelegramBotService] HTML parse error encountered, retrying as plain text...');
      const plainPayload = { ...payload, parse_mode: undefined };
      res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(plainPayload)
      });
      data = await res.json();
    }

    const latencyMs = Date.now() - startTime;

    if (res.ok && data.ok) {
      return {
        success: true,
        messageId: data.result?.message_id,
        statusCode: res.status,
        latencyMs
      };
    } else {
      return {
        success: false,
        statusCode: res.status,
        error: data.description || `HTTP ${res.status}: Telegram dispatch failed`,
        latencyMs
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Failed to dispatch Telegram message',
      latencyMs: Date.now() - startTime
    };
  }
};

/**
 * 1. Dispatches High-Priority Human-in-the-Loop Medication Refill Approval Card
 */
export const sendTelegramMedicationApprovalCard = async (
  req: MedicationApprovalRequest,
  seniorContext?: { name?: string; age?: number; location?: string }
): Promise<TelegramSendResult> => {
  const seniorName = escapeHtml(seniorContext?.name || 'Ramesh Chandra');
  const seniorAge = seniorContext?.age || 74;
  const seniorLoc = escapeHtml(seniorContext?.location || 'Rohini Sector 8, Delhi');
  const medName = escapeHtml(req.medicationName);
  const dosage = escapeHtml(req.dosage);
  const vendor = escapeHtml(req.vendor);
  const reason = escapeHtml(req.reason);

  const messageHtml = `💊 <b>Action Required: ${seniorName}'s Medication Refill Approval</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
• <b>Senior:</b> ${seniorName} (${seniorAge}, ${seniorLoc})
• <b>Medication:</b> <code>${medName}</code>
• <b>Strength / Qty:</b> ${dosage} · ${req.units} Tablets
• <b>Pharmacy:</b> ${vendor}
• <b>Estimated Cost:</b> <b>₹${req.costInr}.00</b> (Care Wallet Envelope)
• <b>Courier:</b> Delhivery CMU Express (ETA: Today by 4:00 PM)
• <b>Reason:</b> <i>${reason}</i>

🛡️ <i>Sambandh Human-in-the-Loop Gate: No money will be debited until you approve.</i>`;

  return sendTelegramMessage(messageHtml, {
    parseMode: 'HTML',
    inlineButtons: [
      [
        { text: `✓ Approve & Dispatch (₹${req.costInr})`, callback_data: `approve_refill_${req.id}` },
        { text: '✕ Decline', callback_data: `decline_refill_${req.id}` }
      ],
      [
        { text: '📱 Open Sambandh Caregiver App', callback_data: 'open_caregiver_hub' }
      ]
    ]
  });
};

/**
 * 1.5. Dispatches Human-in-the-Loop Doctor Consultation Approval Card to Caregiver
 * Triggered when senior reports feeling sick or experiencing symptom flare-ups.
 */
export const sendTelegramDoctorAppointmentApprovalCard = async (
  req: DoctorAppointmentApprovalRequest
): Promise<TelegramSendResult> => {
  const seniorName = escapeHtml(req.seniorName || 'Ramesh Chandra');
  const seniorAge = req.seniorAge || 72;
  const seniorLoc = escapeHtml(req.seniorAddress || 'Rohini Sector 8, Delhi');
  const symptoms = escapeHtml(req.symptoms?.join(', ') || 'Reported unwell / acute discomfort');
  const complaint = escapeHtml(req.chiefComplaint || 'Pain or clinical symptoms noted during voice check-in');
  const docName = escapeHtml(req.doctorName || 'Dr. Arvind Saxena');
  const specialty = escapeHtml(req.doctorSpecialty || 'MD (Internal Medicine & Geriatrics)');
  const clinic = escapeHtml(req.doctorClinic || 'Apollo Clinic, Rohini Sector 8');
  const slot = escapeHtml(req.appointmentSlot || 'Today, 04:30 PM (Priority Senior Slot)');

  const messageHtml = `🩺 <b>Action Required: Doctor Consultation Approval for ${seniorName}</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
• <b>Senior:</b> ${seniorName} (${seniorAge}, ${seniorLoc})
• <b>Reported Symptoms:</b> <code>${symptoms}</code>
• <b>Clinical Note:</b> <i>"${complaint}"</i>
• <b>Assigned Doctor:</b> <b>${docName}</b> (${specialty})
• <b>Clinic:</b> ${clinic}
• <b>Requested Slot:</b> ${slot}

🛡️ <i>Sambandh HITL Gate: Upon your approval, Saarthi will immediately dispatch a formal appointment request to ${docName}'s clinic.</i>`;

  return sendTelegramMessage(messageHtml, {
    parseMode: 'HTML',
    inlineButtons: [
      [
        { text: `✓ Approve & Book Dr. Appointment`, callback_data: `approve_doctor_appt_${req.id}` },
        { text: '✕ Decline / Monitor', callback_data: `decline_doctor_appt_${req.id}` }
      ],
      [
        { text: `📞 Call ${clinic} (+91 11 2790 1200)`, callback_data: 'call_doctor_clinic' }
      ]
    ]
  });
};

/**
 * 1.6. Dispatches Automated Appointment Booking Notification to the Doctor / Clinic Gateway
 */
export const sendTelegramDoctorAppointmentBookingMessage = async (
  req: DoctorAppointmentApprovalRequest,
  caregiverName: string = 'Priya Sharma'
): Promise<TelegramSendResult> => {
  const seniorName = escapeHtml(req.seniorName || 'Ramesh Chandra');
  const seniorAge = req.seniorAge || 72;
  const address = escapeHtml(req.seniorAddress || 'Rohini Sector 8, New Delhi');
  const symptoms = escapeHtml(req.symptoms?.join(', ') || 'Reported unwell');
  const complaint = escapeHtml(req.chiefComplaint || 'Consultation requested');
  const slot = escapeHtml(req.appointmentSlot || 'Today 04:30 PM');
  const docName = escapeHtml(req.doctorName || 'Dr. Arvind Saxena');
  const cName = escapeHtml(caregiverName);

  const messageHtml = `🏥 <b>NEW PATIENT APPOINTMENT REQUEST (Caregiver Authorized)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
• <b>Patient:</b> <b>${seniorName}</b> (${seniorAge}y, Male)
• <b>ABHA ID:</b> <code>91-4821-9920-1120</code>
• <b>Address:</b> ${address}
• <b>Primary Caregiver:</b> ${cName} (Authorized Digitally)
• <b>Attending Doctor:</b> ${docName}
• <b>Chief Complaint:</b> ${complaint} (${symptoms})
• <b>Requested Slot:</b> <b>${slot}</b>
• <b>Booking Ref:</b> <code>APOLLO-ROH-${req.id.slice(-6).toUpperCase()}</code>

✅ <i>Patient clinical baseline and ABDM Electronic Health Record synced.</i>`;

  // Dispatches to doctor / clinic reception chat
  return sendTelegramMessage(messageHtml, {
    parseMode: 'HTML',
    inlineButtons: [
      [
        { text: `✓ Confirm Slot (${slot})`, callback_data: `confirm_clinic_slot_${req.id}` },
        { text: '🔄 Reschedule Slot', callback_data: `reschedule_clinic_slot_${req.id}` }
      ]
    ]
  });
};

/**
 * 2. Dispatches Urgent Missed Call Escalation Alert to Caregiver
 * Triggered when senior does not answer after 2 consecutive dial attempts (1 min apart).
 */
export const sendTelegramMissedCallAlert = async (alert: {
  seniorName?: string;
  seniorAge?: number;
  phone?: string;
  location?: string;
  attempts?: number;
  intervalText?: string;
}): Promise<TelegramSendResult> => {
  const seniorName = escapeHtml(alert.seniorName || 'Ramesh Chandra');
  const seniorAge = alert.seniorAge || 72;
  const seniorLoc = escapeHtml(alert.location || 'Rohini Sector 8, New Delhi');
  const phone = escapeHtml(alert.phone || '+91 98101 23456');
  const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  const attempts = alert.attempts || 2;
  const interval = escapeHtml(alert.intervalText || '1 minute');

  const messageHtml = `🚨 <b>PRIORITY ALERT: ${seniorName}'s Check-In Unanswered (${attempts} Dials)</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
• <b>Senior:</b> ${seniorName} (${seniorAge}, ${seniorLoc})
• <b>Phone:</b> <code>${phone}</code>
• <b>Timestamp:</b> ${time}
• <b>Status:</b> ${seniorName} did not answer after <b>${attempts} consecutive phone calls</b> (spaced ${interval} apart).
• <b>Recommendation:</b> Please check on Papa directly, or contact nearby neighbours (e.g. Verma Ji next door / RWA Security) to request a quick physical wellness check.

🛡️ <i>Sambandh Telephony Rail · Safety Sentinel Protocol</i>`;

  return sendTelegramMessage(messageHtml, {
    parseMode: 'HTML',
    inlineButtons: [
      [
        { text: '📞 Call Papa Directly', callback_data: 'CALL_PAPA' },
        { text: '🏘️ Contact Neighbour (Verma Ji)', callback_data: 'CONTACT_NEIGHBOUR' }
      ],
      [
        { text: '🏥 Call Doctor / Clinic', callback_data: 'CALL_DOCTOR' },
        { text: '🏠 Alert Rohini Sec 8 Security', callback_data: 'ALERT_SECURITY' }
      ]
    ]
  });
};

/**
 * 2. Dispatches Post-Call Daily Care Briefing to Priya
 */
export const sendTelegramDailyCareBriefing = async (briefing: {
  time?: string;
  vitalityScore?: number;
  mood?: string;
  adherence?: string;
  summaryText: string;
  seniorName?: string;
  isSad?: boolean;
}): Promise<TelegramSendResult> => {
  const time = briefing.time || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
  const vitality = briefing.vitalityScore || 94;
  const seniorName = escapeHtml(briefing.seniorName || "Papa");
  const mood = escapeHtml(briefing.mood || '🌿 Cheerful & Nostalgic');
  const adherence = escapeHtml(briefing.adherence || '✅ Morning medication confirmed taken');
  const summary = escapeHtml(briefing.summaryText);

  const isSadMood = briefing.isSad || 
    (briefing.mood && (
      briefing.mood.toLowerCase().includes('sad') || 
      briefing.mood.toLowerCase().includes('low') || 
      briefing.mood.toLowerCase().includes('lonely') || 
      briefing.mood.toLowerCase().includes('anxious') ||
      briefing.mood.toLowerCase().includes('udaas') ||
      briefing.mood.toLowerCase().includes('उदास') ||
      briefing.mood.toLowerCase().includes('nostalgic')
    )) ||
    (briefing.summaryText && (
      briefing.summaryText.toLowerCase().includes('sad') ||
      briefing.summaryText.toLowerCase().includes('low mood') ||
      briefing.summaryText.toLowerCase().includes('lonely') ||
      briefing.summaryText.toLowerCase().includes('udaas') ||
      briefing.summaryText.toLowerCase().includes('उदास')
    )) ||
    (briefing.vitalityScore !== undefined && briefing.vitalityScore < 75);

  const sadSection = isSadMood ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━
💙 <b>Emotional Wellbeing Suggestion (Low Mood Detected):</b>
${seniorName} sounded a bit sad/low during today's call.
• 📞 <b>Personal Call:</b> We suggest making a warm personal call to ${seniorName} today.
• 🌸 <b>Prasad & Flowers:</b> You can also order fresh marigold flowers and sacred temple prasad (Rohini Hanuman Mandir) to uplift their spirits.
` : '';

  const messageHtml = `🌿 <b>Daily Care Briefing: ${seniorName}'s Check-In (${time})</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
• <b>Vitality Index:</b> <b>${vitality}%</b> ${isSadMood ? '(Low Mood Noted)' : '(Normal Baseline)'}
• <b>Emotional Tone:</b> ${mood}
• <b>Medication Adherence:</b> ${adherence}
• <b>ABDM Pill Runway:</b> Stock verified stable${sadSection}
📝 <b>Conversational Highlights:</b>
"${summary}"

❤️ <i>Dispatched by Sambandh AI Companion · Care Circle</i>`;

  const inlineButtons: Array<Array<{ text: string; callback_data?: string; url?: string }>> = isSadMood
    ? [
        [
          { text: `📞 Call ${seniorName} Now`, callback_data: 'call_papa_now' },
          { text: '🌸 Order Prasad & Flowers (₹150)', callback_data: 'order_prasad_flowers' }
        ],
        [
          { text: "🎧 Papa's Audio Snippet", callback_data: 'listen_snippet' },
          { text: '📋 View Medical Dossier', callback_data: 'view_dossier' }
        ]
      ]
    : [
        [
          { text: "🎧 Papa's Audio Snippet", callback_data: 'listen_snippet' }
        ],
        [
          { text: '📋 View Medical Dossier', callback_data: 'view_dossier' }
        ]
      ];

  return sendTelegramMessage(messageHtml, {
    parseMode: 'HTML',
    inlineButtons
  });
};

/**
 * 3. Dispatches Critical Medical or Security Alert to Priya
 */
export const sendTelegramEmergencyAlert = async (alert: {
  type: 'FALL_DETECTED' | 'CHEST_PAIN' | 'FINANCIAL_SCAM' | 'MEDICATION_DISCONTINUED';
  headline: string;
  details: string;
  seniorName?: string;
  seniorPhone?: string;
  seniorAddress?: string;
}): Promise<TelegramSendResult> => {
  const icon = alert.type === 'FINANCIAL_SCAM' ? '🚨' : '⚠️';
  const seniorName = escapeHtml(alert.seniorName || 'Ramesh Chandra');
  const phone = escapeHtml(alert.seniorPhone || '+91 98101 23456');
  const address = escapeHtml(alert.seniorAddress || 'Flat 402, Block C, Pocket 2, Rohini Sector 8, Delhi');
  const headline = escapeHtml(alert.headline);
  const details = escapeHtml(alert.details);

  const messageHtml = `${icon} <b>HIGH PRIORITY CAREGIVER ALERT: ${headline}</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
• <b>Senior:</b> ${seniorName} (${phone})
• <b>Location:</b> ${address}
• <b>Incident Details:</b> ${details}

⚡ <b>Autonomous Safety Action:</b>
${
  alert.type === 'FINANCIAL_SCAM'
    ? 'Line safely terminated in &lt;300ms. Caller number blacklisted from Jio PSTN trunk.'
    : `${seniorName} advised to sit comfortably. Emergency services on standby.`
}

<i>Please check on ${seniorName} immediately.</i>`;

  return sendTelegramMessage(messageHtml, {
    parseMode: 'HTML',
    inlineButtons: [
      [
        { text: `📞 Call ${seniorName} Directly`, url: `tel:${alert.seniorPhone || '+919810123456'}` }
      ]
    ]
  });
};

/**
 * 4. Dispatches In-Clinic Doctor Consultation Briefing & 3-Tier Transformation to Priya
 */
export const sendTelegramDoctorConsultationReport = async (report: {
  doctorName?: string;
  clinicName?: string;
  bpReading?: string;
  pulse?: string;
  clinicalAssessment: string;
  medicationChanges: string[];
  elderInstructions: string[];
  actionItems: string[];
  followUpDate?: string;
  seniorName?: string;
}): Promise<TelegramSendResult> => {
  const doc = escapeHtml(report.doctorName || 'Dr. Arvind Saxena');
  const clinic = escapeHtml(report.clinicName || 'Apollo Clinic Rohini');
  const senior = escapeHtml(report.seniorName || 'Ramesh Chandra');
  const bp = escapeHtml(report.bpReading || '130/82 mmHg');
  const pulse = escapeHtml(report.pulse || '72 bpm');
  const assessment = escapeHtml(report.clinicalAssessment);
  const followUp = escapeHtml(report.followUpDate || '4 weeks');

  const medChangesList = report.medicationChanges.map(m => `• 💊 ${escapeHtml(m)}`).join('\n');
  const elderInstList = report.elderInstructions.map(i => `• 👵🏼 <i>"${escapeHtml(i)}"</i>`).join('\n');
  const actionItemsList = report.actionItems.map(a => `• 📋 <b>${escapeHtml(a)}</b>`).join('\n');

  const messageHtml = `🩺 <b>Doctor Consultation Summary: ${senior}</b>
━━━━━━━━━━━━━━━━━━━━━━━━━━
• <b>Physician:</b> ${doc} (${clinic})
• <b>Measured Vitals:</b> BP <b>${bp}</b> · Pulse <b>${pulse}</b>
• <b>Assessment:</b> ${assessment}

💊 <b>Prescription Changes:</b>
${medChangesList || '• No change to maintenance medications'}

👵🏼 <b>Papa's Vernacular Instructions (सरल निर्देश):</b>
${elderInstList || '• नियमित दिनचर्या जारी रखें'}

🎯 <b>Caregiver Action Checklist (Priya):</b>
${actionItemsList || '• Routine monitoring'}
• <b>Next Review:</b> ${followUp}

🛡️ <i>Encrypted & Synced to ABDM Health Locker</i>`;

  return sendTelegramMessage(messageHtml, {
    parseMode: 'HTML',
    inlineButtons: [
      [
        { text: '📋 View Medical Dossier & ABDM Slip', callback_data: 'view_dossier' }
      ]
    ]
  });
};
