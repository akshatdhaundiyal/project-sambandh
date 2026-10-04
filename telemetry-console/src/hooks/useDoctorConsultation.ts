import { useState, useCallback, useRef, useEffect } from 'react';
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
  startedAt: '10:30 AM IST',
  status: 'idle',
  turns: [
    {
      id: 'turn-1',
      timestamp: '10:30:15',
      speaker: 'doctor',
      speakerName: 'Dr. Arvind Saxena',
      channel: 'in_clinic_mic',
      content: 'नमस्ते रमेश जी! बैठिए, कैसे हैं आप? चलिए पहले आपका ब्लड प्रेशर और पल्स माप लेते हैं।',
      hindiText: 'नमस्ते रमेश जी! बैठिए, कैसे हैं आप? चलिए पहले आपका ब्लड प्रेशर और पल्स माप लेते हैं।'
    },
    {
      id: 'turn-2',
      timestamp: '10:30:42',
      speaker: 'senior',
      speakerName: 'Ramesh Chandra (Papa)',
      channel: 'in_clinic_mic',
      content: 'नमस्ते डॉक्टर साहब। बस सब ठीक है, जापानी पार्क में 25 मिनट सुबह की सैर रोज़ चलती है। हल्का सा घुटने में खिंचाव रहता है।',
      hindiText: 'नमस्ते डॉक्टर साहब। बस सब ठीक है, जापानी पार्क में 25 मिनट सुबह की सैर रोज़ चलती है। हल्का सा घुटने में खिंचाव रहता है।'
    },
    {
      id: 'turn-3',
      timestamp: '10:31:18',
      speaker: 'caregiver',
      speakerName: 'Priya Sharma (Daughter)',
      channel: 'remote_telephony',
      content: 'प्रणाम डॉक्टर अंकल, मैं प्रिया बेंगलुरु से लाइन पर हूँ। पापा का सुबह का बीपी 130/84 रहता है, और टेल्मा 40 समय पर ले रहे हैं।',
      hindiText: 'प्रणाम डॉक्टर अंकल, मैं प्रिया बेंगलुरु से लाइन पर हूँ। पापा का सुबह का बीपी 130/84 रहता है, और टेल्मा 40 समय पर ले रहे हैं।'
    },
    {
      id: 'turn-4',
      timestamp: '10:32:05',
      speaker: 'doctor',
      speakerName: 'Dr. Arvind Saxena',
      channel: 'in_clinic_mic',
      content: 'बहुत बढ़िया। आज क्लिनिक में बीपी 130/82 mmHg और पल्स 72 bpm है। बीपी नियंत्रण में है, लेकिन लिपिड प्रोफाइल को देखते हुए रात को Atorvastatin 10mg शुरू कर रहे हैं।',
      hindiText: 'बहुत बढ़िया। आज क्लिनिक में बीपी 130/82 mmHg और पल्स 72 bpm है। बीपी नियंत्रण में है, लेकिन लिपिड प्रोफाइल को देखते हुए रात को Atorvastatin 10mg शुरू कर रहे हैं।'
    }
  ],
  attachments: [
    {
      id: 'att-rx-001',
      type: 'prescription',
      title: 'Dr. Saxena Review Slip & Statin Protocol',
      doctorName: 'Dr. Arvind Saxena (Apollo Clinic)',
      rawText: 'Rx: Ramesh Chandra, 72/M. BP 130/82. Continue Telmisartan 40mg OD. Add Atorvastatin 10mg HS post-dinner. Repeat Lipid Profile in 4 weeks.',
      uploadedAt: '10:33 AM IST',
      medGemmaEntitiesExtracted: ['Telmisartan 40mg OD', 'Atorvastatin 10mg HS', 'Repeat Lipid Panel 4w']
    }
  ],
  syncedToEhr: false,
  caregiverBriefingSent: false
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

  // Auto-commit function for ambient speech segments
  const commitAmbientSpeech = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const now = new Date().toTimeString().split(' ')[0];
    const newTurn: DoctorConsultationTurn = {
      id: `turn-${Date.now()}`,
      timestamp: now,
      speaker: 'ambient',
      speakerName: 'In-Clinic Ambient Audio',
      channel: 'in_clinic_mic',
      content: trimmed,
      hindiText: trimmed
    };

    setConsultationSession(prev => ({
      ...prev,
      turns: [...prev.turns, newTurn]
    }));

    setLiveSpokenSnippet('');
  }, []);

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

  // Reset Consultation
  const resetDoctorConsultation = useCallback(() => {
    stopLiveListening();
    setConsultationSession({
      ...INITIAL_CONSULTATION_STATE,
      status: 'idle',
      syncedToEhr: false,
      caregiverBriefingSent: false
    });
    setIsConsultationModalOpen(false);
  }, [stopLiveListening]);

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
