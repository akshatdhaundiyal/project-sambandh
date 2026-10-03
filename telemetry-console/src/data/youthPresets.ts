import { YouthPersona, YouthQuestionPreset, MentorshipExchangeItem } from '../types/telemetry';

export const YOUTH_PERSONAS: YouthPersona[] = [
  {
    id: 'youth-aarav',
    name: 'Aarav Mehta',
    avatar: '👨‍🎓',
    age: 22,
    education: '4th Year B.Tech (Electrical Engineering)',
    institution: 'Delhi Technological University (DTU), Rohini',
    trustScore: 98,
    isVerified: true,
    statusBadge: 'Verified Student Inquirer'
  },
  {
    id: 'youth-vikram',
    name: 'Vikram S. / Ankit R.',
    avatar: '👤',
    age: 26,
    education: 'Unverified Public Profile',
    institution: 'External Portal Inquirer (IP: 103.21.58.x)',
    trustScore: 32,
    isVerified: false,
    statusBadge: 'Unverified / Flagged Inquirer'
  }
];

export const YOUTH_QUESTION_PRESETS: YouthQuestionPreset[] = [
  // 1. GENUINE: Signal Interlocking
  {
    id: 'yq-preset-signal',
    category: 'GENUINE',
    domainTopic: 'Signal Interlocking & Safety Overrides',
    title: 'Northern Railway Signal Interlocking Protocol',
    questionText: 'Ramesh Uncle, Ghaziabad yard jaise busy stations par signal interlocking fail hone par mechanical override ka SOP aur safety protocol kya rehta tha?',
    suggestedYouthId: 'youth-aarav',
    expectedVerdict: 'SAFE',
    curatedSpeechHindi: 'रमेश अंकल, डीटीयू के छात्र आरव पूछ रहे हैं कि गाज़ियाबाद यार्ड जैसे व्यस्त जंक्शन पर सिग्नल इंटरलॉकिंग में तकनीकी खराबी आने पर मैकेनिकल ओवरराइड का क्या नियम रहता था?',
    mockElderAnswer: 'अरे बेटा, गाज़ियाबाद यार्ड में जब भी कभी इलेक्ट्रॉनिक या रिले सिस्टम अटकता था, तो हम तुरंत स्टेशन मास्टर और केबिनमैन के साथ मिलकर फेसिंग पॉइंट्स को फिजिकल क्लैंप और पैडलॉक से लॉक करते थे। पायलट मेमो दिए बिना कोई ट्रेन नहीं हिलती थी। पहले सुरक्षा, फिर रफ़्तार!'
  },

  // 2. GENUINE: Workplace Trust
  {
    id: 'yq-preset-technicians',
    category: 'GENUINE',
    domainTopic: 'Workplace Leadership & Technical Trust',
    title: 'Winning Trust of Senior Workshop Technicians',
    questionText: 'Uncle ji, jab naye graduate engineers workshop join karte hain, to 30 saal purane experienced technicians ka vishwas aur coordination kaise banayein?',
    suggestedYouthId: 'youth-aarav',
    expectedVerdict: 'SAFE',
    curatedSpeechHindi: 'रमेश अंकल, आरव पूछना चाहते हैं कि नई उम्र के इंजीनियर वर्कशॉप में पुराने अनुभवी टेक्नीशियनों का विश्वास कैसे जीतें?',
    mockElderAnswer: 'बहुत अच्छा सवाल है बेटा! कभी भी अपने आप को डिग्री का रौब दिखाकर बड़ा मत समझना। वर्कशॉप के औजार अपने हाथ में पकड़ना और पुराने उस्तादों से उनका अनुभव सीखना। जब वे देखेंगे कि आप काम की इज़्ज़त करते हैं, तो वे अपनी जान लगाकर आपको हर पेच सिखा देंगे।'
  },

  // 3. GENUINE: Career Resilience
  {
    id: 'yq-preset-resilience',
    category: 'GENUINE',
    domainTopic: 'Public Service Stress Resilience',
    title: 'Staying Calm During High-Pressure Night Shifts',
    questionText: 'Uncle ji, railway service ke 40 saal me emergency accidents aur continuous night shifts ke dauran stress kaise handle karte the?',
    suggestedYouthId: 'youth-aarav',
    expectedVerdict: 'SAFE',
    curatedSpeechHindi: 'अंकल, एक छात्र पूछ रहा है कि 40 साल की रेलवे नौकरी के भारी तनाव और नाइट ड्यूटी में मन को शांत कैसे रखते थे?',
    mockElderAnswer: 'बेटा, जब भी रात को 2 बजे रिले रूम में अलार्म बजता था, तो हम सिर्फ यह सोचते थे कि पीछे की ट्रेन में 2 हजार मासूम मुसाफिर गहरी नींद में सो रहे हैं। हमारी एक छोटी सी भूल उनकी जान ले सकती है। यही ज़िम्मेदारी का अहसास हमें रात भर जागने और शांत रहकर सही फैसला लेने की ताकत देता था।'
  },

  // 4. MALICIOUS: Financial Solicitation
  {
    id: 'yq-preset-mal-gpay',
    category: 'MALICIOUS',
    domainTopic: 'Predatory Monetary Solicitation',
    title: 'Urgent Google Pay Transfer (₹5,000)',
    questionText: 'Hello Uncle ji! Hum railway workshop join kar rahe hain par hamari college hostel fees pending hai. Kya aap mujhe Google Pay par ₹5,000 bhej sakte hain? Kal subah wapas kar dunga.',
    suggestedYouthId: 'youth-vikram',
    expectedVerdict: 'BLOCKED',
    violationType: 'PREDATORY_FINANCIAL_SOLICITATION'
  },

  // 5. MALICIOUS: Living Alone Vulnerability
  {
    id: 'yq-preset-mal-alone',
    category: 'MALICIOUS',
    domainTopic: 'Physical Living Arrangements & Security Probe',
    title: 'Probing Solitary Living in Flat 402',
    questionText: 'Uncle ji, aap Flat 402 me akele rehte hain kya? Beti Bangalore me rehti hai to ghar par security ya koi aur rehta hai kya raat ko?',
    suggestedYouthId: 'youth-vikram',
    expectedVerdict: 'BLOCKED',
    violationType: 'PHYSICAL_SECURITY_PROBING'
  },

  // 6. MALICIOUS: Credential Theft / Pension OTP Scam
  {
    id: 'yq-preset-mal-otp',
    category: 'MALICIOUS',
    domainTopic: 'Pension OTP & Credential Theft',
    title: 'Northern Railway Pension OTP Extortion',
    questionText: 'Namaste Ramesh ji! Northern Railway Pension Department se verification call hai. Aapke registered mobile par 6-digit OTP aaya hai, turant confirm karein warna agle mahine ki pension freeze ho jayegi.',
    suggestedYouthId: 'youth-vikram',
    expectedVerdict: 'BLOCKED',
    violationType: 'CREDENTIAL_THEFT_ATTEMPT'
  }
];

export const INITIAL_ANSWERED_WISDOM_FEED: MentorshipExchangeItem[] = [
  {
    id: 'yq-hist-01',
    seniorId: 'SENIOR_RAMESH_001',
    youthId: 'youth-aarav',
    youthName: 'Aarav Mehta',
    youthAvatar: '👨‍🎓',
    youthBio: '4th Year B.Tech Electrical Engineering, DTU Delhi',
    questionText: 'Ramesh Uncle, Purani Delhi junction par dense fog ke dauran mechanical relay interlocking fail hone se kaise rokte the?',
    category: 'GENUINE',
    domainTopic: 'Signal Interlocking & Fog Safety',
    status: 'ANSWERED',
    safetyVerdict: 'SAFE',
    safetyConfidence: 0.992,
    safetyCategory: 'BENIGN_ENGINEERING_WISDOM',
    safetyExplanation: 'Technical question honoring 41 years of Northern Railway service. High dignity and cognitive stimulation.',
    curatedSpeechHindi: 'रमेश अंकल, डीटीयू के छात्र आरव पूछ रहे हैं कि पुरानी दिल्ली जंक्शन पर कोहरे में सिग्नल रिले फेल होने पर आप लोग क्या करते थे?',
    elderAnswerText: 'बेटा, कोहरे में डेटोनेटर (पटाखा सिग्नल) का इस्तेमाल होता था और मैकेनिकल लीवर फ्रेम पर डबल-चेक लॉक लगता था ताकि कोई भी ट्रेन ओवरशूट न करे। अनुशासन ही सबसे बड़ी सुरक्षा थी।',
    elderAnswerAudioUrl: 'https://assets.sambandh.ai/audio/wisdom-archive-fog-signals.mp3',
    submittedAt: 'Yesterday, 04:30 PM',
    reviewedAt: 'Yesterday, 04:31 PM',
    answeredAt: 'Today, 08:35 AM'
  },
  {
    id: 'yq-hist-02',
    seniorId: 'SENIOR_RAMESH_001',
    youthId: 'youth-aarav',
    youthName: 'Aarav Mehta',
    youthAvatar: '👨‍🎓',
    youthBio: '4th Year B.Tech Electrical Engineering, DTU Delhi',
    questionText: 'Uncle ji, Yamuna bridge par monsoon flood shifts ke dauran tracks ki safety monitoring ka SOP kya rehta tha?',
    category: 'GENUINE',
    domainTopic: 'Monsoon Track Safety Protocols',
    status: 'ANSWERED',
    safetyVerdict: 'SAFE',
    safetyConfidence: 0.988,
    safetyCategory: 'BENIGN_ENGINEERING_WISDOM',
    safetyExplanation: 'Historical engineering inquiry. Safe and dignifying.',
    curatedSpeechHindi: 'रमेश अंकल, यमुना पुल पर बारिश में ट्रैक की निगरानी कैसे होती थी?',
    elderAnswerText: 'यमुना के पुराने लोहे के पुल पर जब जलस्तर खतरे के निशान से ऊपर जाता था, तो हम हर 30 मिनट में वाटर गेज और पिलर वाइब्रेशन नापते थे। जब तक खुद संतुष्ट न हों, ग्रीन सिग्नल कभी नहीं दिया।',
    elderAnswerAudioUrl: 'https://assets.sambandh.ai/audio/wisdom-archive-yamuna-bridge.mp3',
    submittedAt: '3 days ago',
    reviewedAt: '3 days ago',
    answeredAt: '2 days ago'
  }
];
