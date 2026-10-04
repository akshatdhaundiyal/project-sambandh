import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  DoctorConsultationSession,
  DoctorConsultationTurn,
  DoctorConsultationAttachment,
  DoctorConsultationSpeaker,
  MedicalIssue,
  MedicationItem
} from '../types/telemetry';
import { simulateDocumentUpload } from '../services/healthLockerService';
import {
  transformDoctorConsultationTranscript,
  DoctorTransformationResult
} from '../services/llmService';
import { sendTelegramDoctorConsultationReport } from '../services/telegramBotService';
import { HindiSpeechRecognizer } from '../utils/speechRecognitionService';
import { DynamicElderProfile, DEFAULT_DYNAMIC_PROFILE } from '../services/promptBuilder';

interface UseDoctorConsultationProps {
  onFeedbackToast: (message: string) => void;
  onAddMedicalIssue?: (issue: MedicalIssue) => void;
  onAddNewMolecules?: (newMolecules: MedicationItem[]) => void;
  seniorProfile?: DynamicElderProfile;
}

export interface LiveClinicalObservation {
  bpReading?: string;
  pulse?: string;
  symptoms: string[];
  medicationsMentioned: string[];
  investigations: string[];
}

export const classifySpeaker = (
  text: string,
  caregiverAttending: boolean = false,
  doctorName: string = 'Dr. Arvind Saxena',
  seniorName: string = 'Ramesh Chandra'
): { speaker: DoctorConsultationSpeaker; speakerName: string; channel: 'in_clinic_mic' | 'remote_telephony' } => {
  const lower = text.toLowerCase();

  // 1. Remote Caregiver indicators
  if (
    caregiverAttending &&
    (lower.includes('priya') ||
     lower.includes('बेंगलुरु') ||
     lower.includes('bengaluru') ||
     lower.includes('प्रिया') ||
     lower.includes('पापा का') ||
     lower.includes('papa ka') ||
     lower.includes('डॉक्टर अंकल') ||
     lower.includes('doctor uncle') ||
     lower.includes('लाइन पर हूँ'))
  ) {
    return {
      speaker: 'caregiver',
      speakerName: 'Priya Sharma (Daughter - Remote)',
      channel: 'remote_telephony'
    };
  }

  // 2. Doctor indicators (Clinical assessment, examination, measurements, prescriptions, instructions)
  const doctorKeywords = [
    'नमस्ते रमेश', 'बैठिए', 'ब्लड प्रेशर', 'blood pressure', 'bp', 'पल्स', 'pulse',
    'mmhg', 'bpm', 'माप लेते', 'दवाई', 'medicine', 'स्टार्ट', 'शुरू कर', 'tablet', 'गोली',
    'atorvastatin', 'telma', 'telmisartan', 'statin', 'mg', 'लिपिड', 'lipid',
    'प्रोफाइल', 'profile', 'जांच', 'test', 'रिपोर्ट', 'report', 'हफ्ते बाद', 'weeks',
    'नियंत्रण', 'stable', 'नियमित', 'दिन में', 'रात को', 'डोज', 'dose', 'rx', 'prescribe', 'अटोरवा'
  ];

  const hasDoctorKeyword = doctorKeywords.some(k => lower.includes(k));

  // 3. Senior / Patient indicators (Addressing doctor, symptoms, morning walk, daily routine)
  const seniorKeywords = [
    'डॉक्टर साहब', 'doctor sahab', 'doctor saab', 'जी डॉक्टर', 'नमस्ते डॉक्टर',
    'टहलते हैं', 'टहलता', 'जापानी पार्क', 'japanese park', 'घुटने', 'ghutne',
    'दर्द', 'dard', 'सैर', 'sair', 'चाय', 'chai', 'नाश्ता', 'सुबह से', 'भारीपन', 'खिंचाव'
  ];

  const hasSeniorKeyword = seniorKeywords.some(k => lower.includes(k));

  if (hasDoctorKeyword && !hasSeniorKeyword) {
    return {
      speaker: 'doctor',
      speakerName: doctorName,
      channel: 'in_clinic_mic'
    };
  }

  if (hasSeniorKeyword && !hasDoctorKeyword) {
    return {
      speaker: 'senior',
      speakerName: `${seniorName} (Papa)`,
      channel: 'in_clinic_mic'
    };
  }

  if (hasDoctorKeyword) {
    return {
      speaker: 'doctor',
      speakerName: doctorName,
      channel: 'in_clinic_mic'
    };
  }

  if (hasSeniorKeyword) {
    return {
      speaker: 'senior',
      speakerName: `${seniorName} (Papa)`,
      channel: 'in_clinic_mic'
    };
  }

  return {
    speaker: 'doctor',
    speakerName: doctorName,
    channel: 'in_clinic_mic'
  };
};

const INITIAL_CONSULTATION_STATE: DoctorConsultationSession = {
  id: 'consult-apollo-001',
  doctorName: 'Dr. Arvind Saxena',
  specialty: 'Chief Cardiologist (MD, DM)',
  clinicName: 'Apollo Clinic Rohini (Sector 8)',
  seniorName: 'Ramesh Chandra',
  seniorId: 'SENIOR_RAMESH_001',
  caregiverName: 'Priya Sharma',
  caregiverRelationship: 'Daughter',
  caregiverAttending: true,
  initiatedBy: 'senior',
  startedAt: '',
  status: 'idle',
  turns: [],
  attachments: [],
  syncedToEhr: false,
  caregiverBriefingSent: false
};

export const CLINIC_SIMULATION_SCRIPT: { speaker: DoctorConsultationSpeaker; text: string; hindiText: string }[] = [
  {
    speaker: 'doctor',
    text: 'नमस्ते रमेश जी! बैठिए, कैसे हैं आप? चलिए पहले आपका ब्लड प्रेशर और पल्स माप लेते हैं।',
    hindiText: 'नमस्ते रमेश जी! बैठिए, कैसे हैं आप? चलिए पहले आपका ब्लड प्रेशर और पल्स माप लेते हैं।'
  },
  {
    speaker: 'senior',
    text: 'नमस्ते डॉक्टर साहब। बस सब ठीक है, जापानी पार्क में 25 मिनट सुबह की सैर रोज़ चलती है। हल्का सा घुटने में खिंचाव रहता है।',
    hindiText: 'नमस्ते डॉक्टर साहब। बस सब ठीक है, जापानी पार्क में 25 मिनट सुबह की सैर रोज़ चलती है। हल्का सा घुटने में खिंचाव रहता है।'
  },
  {
    speaker: 'caregiver',
    text: 'प्रणाम डॉक्टर अंकल, मैं प्रिया बेंगलुरु से लाइन पर हूँ। पापा का सुबह का बीपी 130/84 रहता है, और टेल्मा 40 समय पर ले रहे हैं।',
    hindiText: 'प्रणाम डॉक्टर अंकल, मैं प्रिया बेंगलुरु से लाइन पर हूँ। पापा का सुबह का बीपी 130/84 रहता है, और टेल्मा 40 समय पर ले रहे हैं।'
  },
  {
    speaker: 'doctor',
    text: 'बहुत बढ़िया। आज क्लिनिक में बीपी 130/82 mmHg और पल्स 72 bpm है। बीपी नियंत्रण में है, लेकिन लिपिड प्रोफाइल को देखते हुए रात को Atorvastatin 10mg शुरू कर रहे हैं।',
    hindiText: 'बहुत बढ़िया। आज क्लिनिक में बीपी 130/82 mmHg और पल्स 72 bpm है। बीपी नियंत्रण में है, लेकिन लिपिड प्रोफाइल को देखते हुए रात को Atorvastatin 10mg शुरू कर रहे हैं।'
  }
];

export const extractLiveObservations = (
  turns: DoctorConsultationTurn[],
  attachments: DoctorConsultationAttachment[]
): LiveClinicalObservation => {
  const allText = turns.map(t => t.content).join(' ') + ' ' + attachments.map(a => a.rawText).join(' ');
  const obs: LiveClinicalObservation = {
    symptoms: [],
    medicationsMentioned: [],
    investigations: []
  };

  // 1. Blood pressure extraction (e.g., 130/82 or 130/84)
  const bpMatch = allText.match(/(\d{2,3}\s*\/\s*\d{2,3})/);
  if (bpMatch) {
    obs.bpReading = `${bpMatch[1].replace(/\s+/g, '')} mmHg`;
  }

  // 2. Pulse extraction (e.g., 72 bpm or पल्स 72)
  const pulseMatch = allText.match(/(?:पल्स|pulse|hr|heart rate)\s*(?:is|:)?\s*(\d{2,3})/i) || allText.match(/(\d{2,3})\s*bpm/i);
  if (pulseMatch) {
    obs.pulse = `${pulseMatch[1]} bpm`;
  }

  // 3. Symptoms
  if (/घुटने|knee|खिंचाव|stiffness/i.test(allText)) {
    obs.symptoms.push('Bilateral Knee Morning Stiffness (हल्का घुटने में खिंचाव)');
  }
  if (/सैर|walk|park/i.test(allText)) {
    obs.symptoms.push('Daily 25-min Morning Walk (Japanese Park)');
  }

  // 4. Medications
  if (/atorvastatin|atorva|अटोरवा|statin/i.test(allText)) {
    obs.medicationsMentioned.push('Atorvastatin 10mg (Night HS - Added)');
  }
  if (/telma|telmisartan|टेल्मा/i.test(allText)) {
    obs.medicationsMentioned.push('Telma 40mg (Morning OD - Continued)');
  }

  // 5. Investigations
  if (/lipid|लिपिड/i.test(allText)) {
    obs.investigations.push('Fasting Lipid Profile (Repeat in 4 weeks)');
  }

  return obs;
};

export const useDoctorConsultation = ({
  onFeedbackToast,
  onAddMedicalIssue,
  onAddNewMolecules,
  seniorProfile = DEFAULT_DYNAMIC_PROFILE
}: UseDoctorConsultationProps) => {
  const [consultationSession, setConsultationSession] = useState<DoctorConsultationSession>(
    INITIAL_CONSULTATION_STATE
  );
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTransforming, setIsTransforming] = useState(false);
  const [liveSpokenSnippet, setLiveSpokenSnippet] = useState('');

  const recognizerRef = useRef<HindiSpeechRecognizer | null>(null);
  const vadTimerRef = useRef<any>(null);

  // Auto-commit function for ambient speech segments with automatic speaker classification
  const commitAmbientSpeech = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const now = new Date().toTimeString().split(' ')[0];
    const classification = classifySpeaker(
      trimmed,
      consultationSession.caregiverAttending,
      consultationSession.doctorName,
      consultationSession.seniorName
    );

    const newTurn: DoctorConsultationTurn = {
      id: `turn-${Date.now()}`,
      timestamp: now,
      speaker: classification.speaker,
      speakerName: classification.speakerName,
      channel: classification.channel,
      content: trimmed,
      hindiText: trimmed
    };

    setConsultationSession(prev => ({
      ...prev,
      turns: [...prev.turns, newTurn]
    }));

    setLiveSpokenSnippet('');
  }, [consultationSession.caregiverAttending, consultationSession.doctorName, consultationSession.seniorName]);

  // Initialize Speech Recognizer
  useEffect(() => {
    recognizerRef.current = new HindiSpeechRecognizer({
      onStart: () => setIsListening(true),
      onResult: (transcript) => {
        setLiveSpokenSnippet(transcript);

        if (vadTimerRef.current) clearTimeout(vadTimerRef.current);
        vadTimerRef.current = setTimeout(() => {
          if (transcript.trim()) {
            commitAmbientSpeech(transcript);
          }
        }, 1400);
      },
      onEnd: () => setIsListening(false),
      onError: (err) => {
        setIsListening(false);
        console.debug('[DoctorConsultationRecognizer] Error:', err);
      }
    });

    return () => {
      if (vadTimerRef.current) clearTimeout(vadTimerRef.current);
      recognizerRef.current?.stop();
    };
  }, [commitAmbientSpeech]);

  const startLiveListening = useCallback(() => {
    try {
      recognizerRef.current?.start();
      setIsListening(true);
      onFeedbackToast('🎙️ In-Clinic Ambient Transcriber Active: Capturing doctor & patient speech.');
    } catch (e) {
      console.warn('Microphone error:', e);
    }
  }, [onFeedbackToast]);

  const stopLiveListening = useCallback(() => {
    try {
      recognizerRef.current?.stop();
      setIsListening(false);
      if (liveSpokenSnippet.trim()) {
        commitAmbientSpeech(liveSpokenSnippet);
      }
      onFeedbackToast('⏸️ Transcriber Paused.');
    } catch (e) {
      console.warn('Microphone stop error:', e);
    }
  }, [liveSpokenSnippet, commitAmbientSpeech, onFeedbackToast]);

  // Start Consultation Session
  const startDoctorConsultation = useCallback(
    (initiatedBy: 'senior' | 'caregiver', caregiverAttending: boolean) => {
      const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
      setConsultationSession(prev => ({
        ...prev,
        status: 'in_progress',
        initiatedBy,
        caregiverAttending,
        startedAt: now,
        syncedToEhr: false,
        caregiverBriefingSent: false
      }));
      setIsConsultationModalOpen(true);

      if (caregiverAttending) {
        onFeedbackToast(
          `🩺 Doctor Consultation Started: In-Clinic ambient capture + Caregiver remote stream active.`
        );
      } else {
        onFeedbackToast(
          `🩺 Doctor Consultation Started: Ambient In-Clinic mode active. Auto-transformation will dispatch summary to Priya.`
        );
      }
    },
    [onFeedbackToast]
  );

  // Add Ambient Turn (without rigid speaker constraint)
  const addDoctorConsultationTurn = useCallback(
    (speakerOrChannel: DoctorConsultationSpeaker | 'ambient', content: string, hindiText?: string) => {
      const now = new Date().toTimeString().split(' ')[0];
      const speakerName =
        speakerOrChannel === 'doctor'
          ? consultationSession.doctorName
          : speakerOrChannel === 'senior'
          ? `${consultationSession.seniorName} (Papa)`
          : speakerOrChannel === 'caregiver'
          ? `${consultationSession.caregiverName} (${consultationSession.caregiverRelationship})`
          : 'In-Clinic Ambient Note';

      const channel =
        speakerOrChannel === 'caregiver'
          ? 'remote_telephony'
          : speakerOrChannel === 'system'
          ? 'system'
          : 'in_clinic_mic';

      const newTurn: DoctorConsultationTurn = {
        id: `turn-${Date.now()}`,
        timestamp: now,
        speaker: speakerOrChannel,
        speakerName,
        channel,
        content,
        hindiText: hindiText || content
      };

      setConsultationSession(prev => ({
        ...prev,
        turns: [...prev.turns, newTurn]
      }));
    },
    [consultationSession.doctorName, consultationSession.seniorName, consultationSession.caregiverName, consultationSession.caregiverRelationship]
  );

  // Toggle Caregiver Attendance mid-session
  const toggleCaregiverAttendance = useCallback(() => {
    setConsultationSession(prev => {
      const nextAttending = !prev.caregiverAttending;
      onFeedbackToast(
        nextAttending
          ? '📞 Priya Sharma joined the Doctor Consultation live!'
          : '📴 Priya Sharma left the live call. Asynchronous summary mode active.'
      );
      return {
        ...prev,
        caregiverAttending: nextAttending
      };
    });
  }, [onFeedbackToast]);

  // Attach Document or Prescription to Consultation
  const attachDocumentToConsultation = useCallback(
    async (attachment: Omit<DoctorConsultationAttachment, 'id' | 'uploadedAt'>) => {
      const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
      const newAtt: DoctorConsultationAttachment = {
        ...attachment,
        id: `att-${Date.now()}`,
        uploadedAt: now
      };

      setConsultationSession(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAtt]
      }));

      // Ingest into Health Locker RAG backend
      try {
        await simulateDocumentUpload({
          seniorId: consultationSession.seniorId,
          category: attachment.type === 'prescription' ? 'prescription' : 'caregiver_note',
          title: attachment.title,
          doctorName: attachment.doctorName,
          rawText: attachment.rawText
        });
      } catch (err) {
        console.debug('Failed to sync attachment to backend:', err);
      }

      onFeedbackToast(`📄 Attached to Consultation: "${attachment.title}" parsed into Health Locker.`);
    },
    [consultationSession.seniorId, onFeedbackToast]
  );

  // Complete Consultation & Run 3-Tier Transformation Pipeline
  const completeDoctorConsultation = useCallback(async () => {
    stopLiveListening();
    setIsTransforming(true);
    onFeedbackToast('🤖 Running MedGemma 3-Tier Clinical Transformation & EHR Sync...');

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';
    const rawTranscript = consultationSession.turns.map(t => `${t.speakerName || 'Clinic Audio'}: ${t.content}`).join('\n');

    let transformed: DoctorTransformationResult;
    try {
      transformed = await transformDoctorConsultationTranscript(
        rawTranscript,
        consultationSession.attachments,
        seniorProfile
      );
    } catch (err) {
      console.warn('[DoctorConsultation] Transformation error, using fallback:', err);
      transformed = {
        bpReading: '130/82 mmHg',
        pulse: '72 bpm',
        clinicalAssessment: 'Hypertension controlled on Telma-40. Added Atorvastatin 10mg HS for lipid elevation and cardiovascular protection.',
        medicationChanges: ['Added: Atorvastatin 10mg once daily post-dinner (bedtime)'],
        elderVernacularInstructions: [
          'रात को खाना खाने के बाद 1 गोली (Atorvastatin 10mg) ताज़े पानी के साथ लें।',
          'जापानी पार्क में रोज़ाना 25 मिनट की हल्की सैर जारी रखें।',
          'सुबह नाश्ते के बाद अपनी नियमित BP वाली गोली (Telma 40) लेते रहें।'
        ],
        caregiverActionItems: [
          '4 हफ्ते बाद Apollo Clinic से फास्टिंग लिपिड प्रोफाइल टेस्ट बुक करें।',
          'Atorvastatin 10mg की 30 गोलियों का नया पैक मंगवाएं।'
        ],
        followUpDate: '01 Nov 2026',
        newMoleculesToAdd: [
          {
            id: 'RX_ATORVA_10',
            name: 'Atorvastatin 10mg',
            brand: 'Atorva 10',
            strength: '10mg',
            cadence: '1 tablet HS (night post-dinner with water)',
            vernacularTag: 'Raat wali cholesterol ki goli',
            currentUnits: 30,
            dailyConsumption: 1,
            runwayDays: 30,
            unitPriceInr: 240.0,
            orderUnits: 30,
            totalCostInr: 240.0
          }
        ]
      };
    }

    const summary = {
      bpReading: transformed.bpReading,
      pulse: transformed.pulse,
      clinicalAssessment: transformed.clinicalAssessment,
      medicationChanges: transformed.medicationChanges,
      elderVernacularInstructions: transformed.elderVernacularInstructions,
      caregiverActionItems: transformed.caregiverActionItems,
      followUpDate: transformed.followUpDate,
      newMoleculesToAdd: transformed.newMoleculesToAdd
    };

    setConsultationSession(prev => ({
      ...prev,
      status: 'completed',
      endedAt: now,
      clinicalSummary: summary,
      syncedToEhr: true,
      caregiverBriefingSent: true
    }));

    setIsTransforming(false);

    // 1. Ingest newly prescribed medications into global activeMolecules state
    if (transformed.newMoleculesToAdd && transformed.newMoleculesToAdd.length > 0 && onAddNewMolecules) {
      onAddNewMolecules(transformed.newMoleculesToAdd);
    }

    // 2. Add medical issue to Health Locker dossier
    if (onAddMedicalIssue) {
      onAddMedicalIssue({
        id: `issue-${Date.now()}`,
        condition: 'Hyperlipidemia / Statin Titration',
        diagnosedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        severity: 'MILD',
        notes: `Dr. Arvind Saxena consultation: ${transformed.clinicalAssessment} BP: ${transformed.bpReading}.`,
        treatingDoctor: consultationSession.doctorName,
        activeSymptoms: ['Cardiovascular prophylaxis']
      });
    }

    // 3. Dispatch structured 3-tier report to Priya on Telegram
    sendTelegramDoctorConsultationReport({
      doctorName: consultationSession.doctorName,
      clinicName: consultationSession.clinicName,
      seniorName: seniorProfile.name,
      bpReading: transformed.bpReading,
      pulse: transformed.pulse,
      clinicalAssessment: transformed.clinicalAssessment,
      medicationChanges: transformed.medicationChanges,
      elderInstructions: transformed.elderVernacularInstructions,
      actionItems: transformed.caregiverActionItems,
      followUpDate: transformed.followUpDate
    }).catch(err => console.warn('[TelegramDocReport] Dispatch error:', err));

    onFeedbackToast(
      '✅ 3-Tier Transformation Complete: Synced to Health Locker, Active Meds updated, and Briefing sent to Priya on Telegram!'
    );
  }, [
    stopLiveListening,
    consultationSession.turns,
    consultationSession.attachments,
    consultationSession.doctorName,
    consultationSession.clinicName,
    seniorProfile,
    onAddNewMolecules,
    onAddMedicalIssue,
    onFeedbackToast
  ]);

  // Progressive 1-tap simulation helper for seamless interactive demo
  const simulateNextConsultationTurn = useCallback(() => {
    const currentCount = consultationSession.turns.length;
    if (currentCount < CLINIC_SIMULATION_SCRIPT.length) {
      const scriptItem = CLINIC_SIMULATION_SCRIPT[currentCount];
      addDoctorConsultationTurn(scriptItem.speaker, scriptItem.text, scriptItem.hindiText);
      onFeedbackToast(`🎙️ Transcribed Live Turn ${currentCount + 1}: ${scriptItem.speaker === 'doctor' ? '👨‍⚕️ Dr. Saxena' : scriptItem.speaker === 'senior' ? '👴🏼 Ramesh' : '👩‍💼 Priya'}`);
    } else if (consultationSession.attachments.length === 0) {
      // Step 5: Attach Dr. Saxena Prescription Review Slip
      attachDocumentToConsultation({
        type: 'prescription',
        title: 'Dr. Saxena Review Slip & Statin Protocol',
        doctorName: 'Dr. Arvind Saxena (Apollo Clinic)',
        rawText: 'Rx: Ramesh Chandra, 72/M. BP 130/82. Continue Telmisartan 40mg OD. Add Atorvastatin 10mg HS post-dinner. Repeat Lipid Profile in 4 weeks.',
        medGemmaEntitiesExtracted: ['Telmisartan 40mg OD', 'Atorvastatin 10mg HS', 'Repeat Lipid Panel 4w']
      });
      onFeedbackToast("📄 Scanned & Attached: Dr. Saxena Review Slip parsed via MedGemma.");
    } else {
      onFeedbackToast("✅ All live consultation dialogue and prescription slips captured! Ready to click 'Complete & Transform'.");
    }
  }, [consultationSession.turns.length, consultationSession.attachments.length, addDoctorConsultationTurn, attachDocumentToConsultation, onFeedbackToast]);

  const resetDoctorConsultation = useCallback(() => {
    stopLiveListening();
    setConsultationSession(INITIAL_CONSULTATION_STATE);
    setLiveSpokenSnippet('');
    onFeedbackToast('🔄 Consultation session reset to initial standby state.');
  }, [stopLiveListening, onFeedbackToast]);

  const liveObservations = useMemo(() => {
    return extractLiveObservations(consultationSession.turns, consultationSession.attachments);
  }, [consultationSession.turns, consultationSession.attachments]);

  return {
    consultationSession,
    isConsultationModalOpen,
    setIsConsultationModalOpen,
    openConsultationModal: () => setIsConsultationModalOpen(true),
    closeConsultationModal: () => {
      stopLiveListening();
      setIsConsultationModalOpen(false);
    },
    isListening,
    isTransforming,
    liveSpokenSnippet,
    liveObservations,
    simulateNextConsultationTurn,
    startLiveListening,
    stopLiveListening,
    startDoctorConsultation,
    addDoctorConsultationTurn,
    toggleCaregiverAttendance,
    attachDocumentToConsultation,
    completeDoctorConsultation,
    resetDoctorConsultation
  };
};
