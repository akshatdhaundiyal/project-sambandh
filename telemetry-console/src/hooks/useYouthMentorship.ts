import { useState, useEffect, useCallback } from 'react';
import {
  YouthPersona,
  MentorshipExchangeItem
} from '../types/telemetry';
import { INITIAL_ANSWERED_WISDOM_FEED } from '../data/youthPresets';
import {
  evaluateQuestionSafety,
  syncYouthQuestionToBackend
} from '../services/youthSafetyService';
import { speakDialogueTurn } from '../utils/speechService';

interface UseYouthMentorshipProps {
  activeTtsEngine: 'browser' | 'gnani';
  handleTelegramAction: (action: string) => void;
}

export const useYouthMentorship = ({
  activeTtsEngine,
  handleTelegramAction
}: UseYouthMentorshipProps) => {
  const [mentorshipHistory, setMentorshipHistory] = useState<MentorshipExchangeItem[]>(INITIAL_ANSWERED_WISDOM_FEED);
  const [activeMentorshipQuestion, setActiveMentorshipQuestion] = useState<MentorshipExchangeItem | null>(null);

  // Sync initial questions from PostgreSQL backend on mount
  useEffect(() => {
    const fetchPgQuestions = async () => {
      try {
        const res = await fetch('http://localhost:8001/api/v1/youth/questions?senior_id=SENIOR_RAMESH_001');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            const mapped: MentorshipExchangeItem[] = data.map((d: any) => ({
              id: d.id,
              seniorId: d.senior_id,
              youthId: d.youth_id,
              youthName: d.youth_name,
              youthAvatar: d.youth_avatar || '👨‍🎓',
              youthBio: d.youth_bio || 'Student Inquirer',
              questionText: d.question_text,
              category: d.category || 'GENUINE',
              domainTopic: d.domain_topic || 'Engineering & Public Service',
              status: d.status || 'ANSWERED',
              safetyVerdict: d.safety_verdict,
              safetyConfidence: d.safety_confidence,
              safetyCategory: d.safety_category,
              safetyExplanation: d.safety_explanation,
              curatedSpeechHindi: d.curated_speech_hindi,
              elderAnswerText: d.elder_answer_text,
              elderAnswerAudioUrl: d.elder_answer_audio_url,
              submittedAt: d.submitted_at ? new Date(d.submitted_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST' : undefined,
              reviewedAt: d.reviewed_at ? new Date(d.reviewed_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST' : undefined,
              answeredAt: d.answered_at ? new Date(d.answered_at).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST' : undefined
            }));
            setMentorshipHistory(mapped);
          }
        }
      } catch (e) {
        // use fallback initial seed
      }
    };
    fetchPgQuestions();
  }, []);

  const submitYouthQuestion = useCallback(async (
    youth: YouthPersona,
    questionText: string,
    category: 'GENUINE' | 'MALICIOUS',
    domainTopic: string,
    presetMetadata?: { curatedSpeechHindi?: string; mockElderAnswer?: string }
  ): Promise<MentorshipExchangeItem> => {
    const newItem: MentorshipExchangeItem = {
      id: `yq-${Date.now()}`,
      seniorId: 'SENIOR_RAMESH_001',
      youthId: youth.id,
      youthName: youth.name,
      youthAvatar: youth.avatar,
      youthBio: youth.institution,
      questionText,
      category,
      domainTopic,
      status: 'PENDING_REVIEW',
      submittedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
    };

    setActiveMentorshipQuestion(newItem);
    setMentorshipHistory(prev => [newItem, ...prev.filter(q => q.id !== newItem.id)]);

    // Trigger AI Safety Gate Evaluation
    setTimeout(async () => {
      const result = await evaluateQuestionSafety(questionText, youth, presetMetadata);
      const evaluatedItem: MentorshipExchangeItem = {
        ...newItem,
        status: result.verdict === 'SAFE' ? 'APPROVED' : 'BLOCKED',
        safetyVerdict: result.verdict,
        safetyConfidence: result.confidence,
        safetyCategory: result.category,
        safetyExplanation: result.explanation,
        curatedSpeechHindi: result.curatedSpeechHindi,
        elderAnswerText: result.mockElderAnswer,
        reviewedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
      };

      setActiveMentorshipQuestion(evaluatedItem);
      setMentorshipHistory(prev => prev.map(q => q.id === newItem.id ? evaluatedItem : q));

      // Persist to Postgres
      await syncYouthQuestionToBackend(evaluatedItem);

      if (result.verdict === 'BLOCKED') {
        handleTelegramAction('SECURITY_ALERT');
      }
    }, 500);

    return newItem;
  }, [handleTelegramAction]);

  const evaluateMentorshipQuestion = useCallback(async (questionId: string) => {
    const item = activeMentorshipQuestion?.id === questionId ? activeMentorshipQuestion : mentorshipHistory.find(q => q.id === questionId);
    if (!item) return;
    const dummyYouth: YouthPersona = {
      id: item.youthId,
      name: item.youthName,
      avatar: item.youthAvatar,
      age: 22,
      education: 'Student',
      institution: item.youthBio,
      trustScore: 95,
      isVerified: true,
      statusBadge: 'Student'
    };
    const result = await evaluateQuestionSafety(item.questionText, dummyYouth);
    const updated: MentorshipExchangeItem = {
      ...item,
      status: result.verdict === 'SAFE' ? 'APPROVED' : 'BLOCKED',
      safetyVerdict: result.verdict,
      safetyConfidence: result.confidence,
      safetyCategory: result.category,
      safetyExplanation: result.explanation,
      curatedSpeechHindi: result.curatedSpeechHindi,
      reviewedAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
    };
    setActiveMentorshipQuestion(updated);
    setMentorshipHistory(prev => prev.map(q => q.id === questionId ? updated : q));
  }, [activeMentorshipQuestion, mentorshipHistory]);

  const simulateElderAnswerVoice = useCallback(async (questionId: string) => {
    const item = activeMentorshipQuestion?.id === questionId ? activeMentorshipQuestion : mentorshipHistory.find(q => q.id === questionId);
    if (!item) return;

    const answerText = item.elderAnswerText ||
      `अरे बेटा, गाज़ियाबाद यार्ड में जब भी रिले या सिग्नल में कोई खराबी आती थी, तो हम तुरंत स्टेशन मास्टर के साथ मिलकर फेसिंग पॉइंट्स को फिजिकल क्लैंप और पैडलॉक से लॉक करते थे। अनुशासन ही सबसे बड़ी सुरक्षा थी!`;

    const answeredItem: MentorshipExchangeItem = {
      ...item,
      status: 'ANSWERED',
      elderAnswerText: answerText,
      elderAnswerAudioUrl: 'https://assets.sambandh.ai/audio/wisdom-live-answer.mp3',
      answeredAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
    };

    setActiveMentorshipQuestion(answeredItem);
    setMentorshipHistory(prev => prev.map(q => q.id === questionId ? answeredItem : q));

    // Persist answer to PostgreSQL
    try {
      await fetch(`http://localhost:8001/api/v1/youth/questions/${questionId}/record-answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer_text: answerText, audio_url: answeredItem.elderAnswerAudioUrl })
      });
    } catch (e) {
      // offline fallback
    }

    // Voice dialogue turn through speech service
    speakDialogueTurn(
      answerText,
      'senior',
      activeTtsEngine,
      {}
    );

    // Notify Priya on Telegram with proud summary
    handleTelegramAction('MEDICATION_REASSURANCE_PING');
  }, [activeMentorshipQuestion, mentorshipHistory, activeTtsEngine, handleTelegramAction]);

  return {
    activeMentorshipQuestion,
    mentorshipHistory,
    submitYouthQuestion,
    evaluateMentorshipQuestion,
    simulateElderAnswerVoice
  };
};
