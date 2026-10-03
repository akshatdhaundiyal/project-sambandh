import { useState, useCallback } from 'react';
import {
  DoctorConsultationSession,
  DoctorConsultationTurn,
  DoctorConsultationAttachment,
  DoctorConsultationSpeaker,
  MedicalIssue
} from '../types/telemetry';
import { simulateDocumentUpload } from '../services/healthLockerService';

interface UseDoctorConsultationProps {
  onFeedbackToast: (message: string) => void;
  onAddMedicalIssue?: (issue: MedicalIssue) => void;
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
  onAddMedicalIssue
}: UseDoctorConsultationProps) => {
  const [consultationSession, setConsultationSession] = useState<DoctorConsultationSession>(
    INITIAL_CONSULTATION_STATE
  );
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

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
          `🩺 Doctor Consultation Started: 3-Way Bridge Active (Doctor + Senior in clinic, Caregiver connected live via telephony).`
        );
      } else {
        onFeedbackToast(
          `🩺 Doctor Consultation Started: Solo In-Clinic Mode active (Caregiver absent · Auto-briefing & transcript will be dispatched to Priya).`
        );
      }
    },
    [onFeedbackToast]
  );

  // Add Turn with Multi-Speaker Tagging
  const addDoctorConsultationTurn = useCallback(
    (speaker: DoctorConsultationSpeaker, content: string, hindiText?: string) => {
      const now = new Date().toTimeString().split(' ')[0];
      const speakerName =
        speaker === 'doctor'
          ? consultationSession.doctorName
          : speaker === 'senior'
          ? `${consultationSession.seniorName} (Papa)`
          : speaker === 'caregiver'
          ? `${consultationSession.caregiverName} (${consultationSession.caregiverRelationship})`
          : 'Sambandh AI System';

      const channel =
        speaker === 'caregiver'
          ? 'remote_telephony'
          : speaker === 'system'
          ? 'system'
          : 'in_clinic_mic';

      const newTurn: DoctorConsultationTurn = {
        id: `turn-${Date.now()}`,
        timestamp: now,
        speaker,
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

      onFeedbackToast(`📄 Attached to Consultation: "${attachment.title}" parsed by MedGemma 4B into Health Locker.`);
    },
    [consultationSession.seniorId, onFeedbackToast]
  );

  // Complete Consultation & Sync to EHR
  const completeDoctorConsultation = useCallback(async () => {
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';

    const summary = {
      bpReading: '130/82 mmHg',
      pulse: '72 bpm',
      clinicalAssessment:
        'Hypertension well-managed on Telma-40. Added Atorvastatin 10mg HS for cardiovascular prophylaxis and mild lipid elevation. Advised regular walks & salt restriction.',
      medicationChanges: [
        'Added: Atorvastatin 10mg once daily post-dinner (bedtime)',
        'Tapered: Amlodipine reduced to 2.5mg PRN',
        'Maintained: Telmisartan 40mg OD post-breakfast'
      ],
      actionItems: [
        'Repeat Fasting Lipid Profile & Serum Creatinine in 4 weeks',
        'Daily morning walk with knee-support shoes; warm compress for stiffness'
      ],
      followUpDate: '01 Nov 2026'
    };

    setConsultationSession(prev => ({
      ...prev,
      status: 'completed',
      endedAt: now,
      clinicalSummary: summary,
      syncedToEhr: true,
      caregiverBriefingSent: true
    }));

    if (onAddMedicalIssue) {
      onAddMedicalIssue({
        id: `issue-${Date.now()}`,
        condition: 'Hyperlipidemia / Statin Titration',
        diagnosedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        severity: 'MILD',
        notes: `Dr. Arvind Saxena added Atorvastatin 10mg HS. BP confirmed 130/82 mmHg. Review in 4 weeks.`,
        treatingDoctor: 'Dr. Arvind Saxena (Apollo Clinic)',
        activeSymptoms: ['Cardiovascular prophylaxis']
      });
    }

    onFeedbackToast(
      '✅ Doctor Consultation Completed: Synced to PostgreSQL & ABDM. Full briefing & transcript sent to Priya Sharma.'
    );
  }, [onAddMedicalIssue, onFeedbackToast]);

  // Reset Consultation
  const resetDoctorConsultation = useCallback(() => {
    setConsultationSession({
      ...INITIAL_CONSULTATION_STATE,
      status: 'idle',
      syncedToEhr: false,
      caregiverBriefingSent: false
    });
    setIsConsultationModalOpen(false);
  }, []);

  return {
    consultationSession,
    isConsultationModalOpen,
    setIsConsultationModalOpen,
    openConsultationModal: () => setIsConsultationModalOpen(true),
    closeConsultationModal: () => setIsConsultationModalOpen(false),
    startDoctorConsultation,
    addDoctorConsultationTurn,
    toggleCaregiverAttendance,
    attachDocumentToConsultation,
    completeDoctorConsultation,
    resetDoctorConsultation
  };
};
