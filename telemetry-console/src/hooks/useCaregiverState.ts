import { useState, useCallback, useEffect } from 'react';
import {
  PreCallAgencyRequest,
  MoodCallEntry,
  MedicalIssue
} from '../types/telemetry';
import {
  DynamicElderProfile,
  DEFAULT_DYNAMIC_PROFILE
} from '../services/promptBuilder';
import { healthLockerService } from '../services/healthLockerService';

interface UseCaregiverStateProps {
  onFeedbackToast: (message: string) => void;
  onAddMedicalIssue: (issue: MedicalIssue) => void;
}

export const useCaregiverState = ({
  onFeedbackToast,
  onAddMedicalIssue
}: UseCaregiverStateProps) => {
  // Live Database-Driven Senior Profile (Editable by Primary Caregiver)
  const [seniorProfile, setSeniorProfile] = useState<DynamicElderProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sambandh_senior_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // ignore parsing error
        }
      }
    }
    return DEFAULT_DYNAMIC_PROFILE;
  });

  // Fetch latest profile from PostgreSQL on mount
  useEffect(() => {
    healthLockerService.fetchSeniorProfile('SENIOR_RAMESH_001').then(data => {
      if (data && data.name) {
        setSeniorProfile(prev => {
          const updated: DynamicElderProfile = {
            ...prev,
            name: data.name || prev.name,
            age: data.age || prev.age,
            gender: data.gender || prev.gender,
            city: data.city || prev.city,
            addressLine: data.address_line || prev.addressLine,
            vocation: data.vocation || prev.vocation,
            personalityNotes: data.personality_notes || prev.personalityNotes,
            healthBaseline: data.health_baseline || prev.healthBaseline,
            familyContext: data.family_context || prev.familyContext,
            preferredAddress: data.preferred_address || prev.preferredAddress,
            caregiverName: data.caregiver_name || prev.caregiverName,
            caregiverRelationship: data.caregiver_relationship || prev.caregiverRelationship,
            doctorName: data.doctor_name || prev.doctorName,
            doctorClinic: data.doctor_clinic || prev.doctorClinic
          };
          if (typeof window !== 'undefined') {
            localStorage.setItem('sambandh_senior_profile', JSON.stringify(updated));
          }
          return updated;
        });
      }
    });
  }, []);

  const updateSeniorProfile = useCallback(async (updates: Partial<DynamicElderProfile>) => {
    setSeniorProfile(prev => {
      const updated = { ...prev, ...updates };
      if (typeof window !== 'undefined') {
        localStorage.setItem('sambandh_senior_profile', JSON.stringify(updated));
      }
      return updated;
    });

    // Map to backend snake_case format and persist to PostgreSQL
    const backendPayload: any = {};
    if (updates.name !== undefined) backendPayload.name = updates.name;
    if (updates.age !== undefined) backendPayload.age = updates.age;
    if (updates.gender !== undefined) backendPayload.gender = updates.gender;
    if (updates.city !== undefined) backendPayload.city = updates.city;
    if (updates.addressLine !== undefined) backendPayload.address_line = updates.addressLine;
    if (updates.vocation !== undefined) backendPayload.vocation = updates.vocation;
    if (updates.personalityNotes !== undefined) backendPayload.personality_notes = updates.personalityNotes;
    if (updates.healthBaseline !== undefined) backendPayload.health_baseline = updates.healthBaseline;
    if (updates.familyContext !== undefined) backendPayload.family_context = updates.familyContext;
    if (updates.preferredAddress !== undefined) backendPayload.preferred_address = updates.preferredAddress;
    if (updates.caregiverName !== undefined) backendPayload.caregiver_name = updates.caregiverName;
    if (updates.caregiverRelationship !== undefined) backendPayload.caregiver_relationship = updates.caregiverRelationship;
    if (updates.doctorName !== undefined) backendPayload.doctor_name = updates.doctorName;
    if (updates.doctorClinic !== undefined) backendPayload.doctor_clinic = updates.doctorClinic;

    await healthLockerService.updateSeniorProfile('SENIOR_RAMESH_001', backendPayload);
    onFeedbackToast(`✅ Profile Saved to Database: Updated elder dossier & dynamic AI prompts for ${updates.name || seniorProfile.name}.`);
  }, [seniorProfile.name, onFeedbackToast]);

  // Pre-Call Caregiver Agency & Consent State
  const [preCallAgency, setPreCallAgency] = useState<PreCallAgencyRequest>({
    id: 'precall-req-001',
    timestamp: '08:20 AM IST',
    seniorName: 'Ramesh Chandra (Papa)',
    seniorPhone: '+91 98101 23456',
    scheduledTimeIst: '08:30 AM IST',
    status: 'awaiting_approval',
    caregiverName: 'Priya Sharma (Daughter)',
    clinicalBriefingSnippet: 'Omron BP 128/82 mmHg · Telmisartan 40mg (6 days stock runway) · High vitality'
  });

  const requestPreCallApproval = useCallback(() => {
    setPreCallAgency(prev => ({
      ...prev,
      id: `precall-req-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
      status: 'awaiting_approval',
      caregiverDecision: undefined,
      caregiverNotes: undefined
    }));
    onFeedbackToast('🔔 Pre-Call Agency Prompt Dispatched to Priya (@priya_sharma_care). Awaiting choice: Direct Call vs AI Delegated.');
  }, [onFeedbackToast]);

  // Longitudinal Emotional Memory Across 3-4 Subsequent Calls
  const [moodHistory, setMoodHistory] = useState<MoodCallEntry[]>([
    {
      callId: 'call-oct-01',
      callDate: '01 Oct 2026',
      callTime: '08:30 AM',
      sentimentScore: 0.85,
      primaryEmotion: 'CHEERFUL',
      notes: 'Papa was very energetic; shared Northern Railway story with high lucidity.'
    },
    {
      callId: 'call-oct-02',
      callDate: '02 Oct 2026',
      callTime: '08:31 AM',
      sentimentScore: -0.65,
      primaryEmotion: 'SAD',
      notes: 'Ramesh Uncle reported feeling lonely and missing family in Bangalore.'
    },
    {
      callId: 'call-oct-03',
      callDate: '03 Oct 2026',
      callTime: '08:30 AM',
      sentimentScore: -0.72,
      primaryEmotion: 'SAD',
      notes: 'Reported quietness in flat 402, quiet tone, low verbal engagement.'
    }
  ]);

  const recordCallMood = useCallback((emotion: 'CHEERFUL' | 'CALM' | 'ANXIOUS' | 'SAD', notes: string) => {
    const newEntry: MoodCallEntry = {
      callId: `call-${Date.now()}`,
      callDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      callTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      sentimentScore: emotion === 'CHEERFUL' ? 0.8 : emotion === 'CALM' ? 0.3 : emotion === 'ANXIOUS' ? -0.4 : -0.75,
      primaryEmotion: emotion,
      notes
    };

    setMoodHistory(prev => {
      const updated = [newEntry, ...prev.slice(0, 3)];
      const sadCount = updated.filter(m => m.primaryEmotion === 'SAD').length;
      if (sadCount >= 2) {
        onFeedbackToast('🌧️ Longitudinal Care Alert: Papa reported low mood across consecutive calls. Proactive advisory dispatched to Priya on Telegram.');
      }
      return updated;
    });
  }, [onFeedbackToast]);

  // In-Clinic Transcriber Mode State
  const [isTranscriberActive, setIsTranscriberActive] = useState<boolean>(false);
  const [transcriberTranscript, setTranscriberTranscript] = useState<string[]>([
    'Dr. Arvind Saxena: "Namaste Ramesh Ji, BP is 130/85 today. Very stable."',
    'Dr. Arvind Saxena: "We are tapering Amlodipine to 2.5mg, and starting Atorvastatin 10mg at bedtime."',
    'Ramesh Chandra: "Doctor saab, morning walk continues daily."'
  ]);

  const startTranscriberMode = useCallback(() => {
    setIsTranscriberActive(true);
    onFeedbackToast('🩺 In-Clinic Transcriber Mode Started: Dual-speaker audio capture active at Apollo Clinic.');
  }, [onFeedbackToast]);

  const stopTranscriberMode = useCallback(() => {
    setIsTranscriberActive(false);
    onFeedbackToast('✅ In-Clinic Transcriber Stopped: Extracted clinical consultation notes.');
  }, [onFeedbackToast]);

  const syncTranscriberToEhr = useCallback(() => {
    setIsTranscriberActive(false);
    onAddMedicalIssue({
      id: `issue-${Date.now()}`,
      condition: 'Hyperlipidemia / Cholesterol Titration',
      diagnosedDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      severity: 'MILD',
      notes: 'Dr. Arvind Saxena added Atorvastatin 10mg bedtime; reduced Amlodipine to 2.5mg. Review in 4 weeks.',
      treatingDoctor: 'Dr. Arvind Saxena (Cardiologist)',
      activeSymptoms: ['Lipid profile monitoring']
    });
    onFeedbackToast('🏥 Synced to Medical Dossier: Titrations updated & clinical summary pushed to Priya on Telegram.');
  }, [onAddMedicalIssue, onFeedbackToast]);

  return {
    seniorProfile,
    updateSeniorProfile,
    preCallAgency,
    setPreCallAgency,
    requestPreCallApproval,
    moodHistory,
    recordCallMood,
    isTranscriberActive,
    transcriberTranscript,
    startTranscriberMode,
    stopTranscriberMode,
    syncTranscriberToEhr
  };
};
