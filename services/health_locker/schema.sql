-- ==============================================================================
-- Project Sambandh: Health Locker & Clinical Datastore Schema
-- Compatible with local PostgreSQL (14+) and Supabase
-- ==============================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Optional pgvector extension for local vector similarity search
-- (Uncomment when running in an environment with pgvector installed)
-- CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Seniors Master Profile Table
CREATE TABLE IF NOT EXISTS seniors (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(32) NOT NULL,
    abha_id VARCHAR(64) UNIQUE,
    primary_language VARCHAR(64) DEFAULT 'Hindi',
    address_line TEXT,
    city VARCHAR(128) DEFAULT 'Lucknow',
    state VARCHAR(128) DEFAULT 'Uttar Pradesh',
    pin_code VARCHAR(16) DEFAULT '226024',
    daily_call_window_ist VARCHAR(32) DEFAULT '08:30:00',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Clinical Documents & Diagnostic Vault
CREATE TABLE IF NOT EXISTS clinical_documents (
    id VARCHAR(64) PRIMARY KEY,
    senior_id VARCHAR(64) NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    category VARCHAR(64) NOT NULL CHECK (category IN ('prescription', 'lab_report', 'consultation', 'caregiver_note')),
    title VARCHAR(255) NOT NULL,
    doctor_name VARCHAR(255),
    document_date DATE NOT NULL,
    raw_text TEXT NOT NULL,
    file_url TEXT,
    extracted_summary TEXT,
    -- vector_embedding vector(384), -- Optional: pgvector column for BAAI/bge-small-en-v1.5
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_docs_senior_date ON clinical_documents(senior_id, document_date DESC);
CREATE INDEX IF NOT EXISTS idx_docs_category ON clinical_documents(category);

-- 3. Medication Doses & Pharmacy Runway
CREATE TABLE IF NOT EXISTS medication_doses (
    id VARCHAR(64) PRIMARY KEY,
    senior_id VARCHAR(64) NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    document_id VARCHAR(64) REFERENCES clinical_documents(id) ON DELETE SET NULL,
    drug_name VARCHAR(255) NOT NULL,
    brand_name VARCHAR(255),
    strength VARCHAR(64) NOT NULL,
    cadence VARCHAR(128) NOT NULL,
    timing_instructions TEXT NOT NULL,
    current_stock_units INT NOT NULL DEFAULT 30,
    daily_consumption NUMERIC(4, 2) NOT NULL DEFAULT 1.0,
    runway_days INT NOT NULL DEFAULT 30,
    refill_threshold_days INT NOT NULL DEFAULT 7,
    unit_price_inr NUMERIC(10, 2) DEFAULT 0.0,
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'COMPLETED', 'DISCONTINUED')),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_meds_senior_status ON medication_doses(senior_id, status);

-- 4. Longitudinal Vitals & Biomarker Tracking
CREATE TABLE IF NOT EXISTS vital_and_level_tracking (
    id VARCHAR(64) PRIMARY KEY,
    senior_id VARCHAR(64) NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    document_id VARCHAR(64) REFERENCES clinical_documents(id) ON DELETE SET NULL,
    vital_type VARCHAR(64) NOT NULL CHECK (vital_type IN (
        'creatinine', 
        'blood_pressure_systolic', 
        'blood_pressure_diastolic', 
        'hba1c', 
        'fasting_blood_sugar', 
        'serum_potassium',
        'pulse'
    )),
    value_numeric NUMERIC(8, 2) NOT NULL,
    unit VARCHAR(32) NOT NULL,
    recorded_date DATE NOT NULL,
    is_normal BOOLEAN DEFAULT TRUE,
    reference_range VARCHAR(64),
    trend_direction VARCHAR(32) DEFAULT 'STABLE' CHECK (trend_direction IN ('STABLE', 'RISING', 'FALLING', 'FLUCTUATING')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vitals_senior_type_date ON vital_and_level_tracking(senior_id, vital_type, recorded_date DESC);

-- 5. Caregiver Inputs, Directives & Verbal Observations
CREATE TABLE IF NOT EXISTS caregiver_inputs (
    id VARCHAR(64) PRIMARY KEY,
    senior_id VARCHAR(64) NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    category VARCHAR(64) NOT NULL CHECK (category IN ('diet_restriction', 'doctor_verbal_note', 'daily_routine', 'emergency_contact')),
    note_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_caregiver_inputs_senior ON caregiver_inputs(senior_id, is_active);

-- 6. Clinical & Guardrail Audit Logs
CREATE TABLE IF NOT EXISTS clinical_audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    senior_id VARCHAR(64) NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    query_text TEXT NOT NULL,
    retrieval_mode VARCHAR(32) NOT NULL CHECK (retrieval_mode IN ('STRUCTURED_LOOKUP', 'MEDGEMMA_DEEP_RECALL', 'INGESTION_EXTRACTION')),
    model_used VARCHAR(64) NOT NULL,
    latency_ms INT NOT NULL,
    tokens_evaluated INT DEFAULT 0,
    guardrail_status JSONB NOT NULL,
    response_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- Seed Data for Ramesh Chandra (SENIOR_RAMESH_001)
-- ==============================================================================

INSERT INTO seniors (id, name, age, gender, abha_id, primary_language, address_line, city, state, pin_code, daily_call_window_ist)
VALUES (
    'SENIOR_RAMESH_001',
    'Ramesh Chandra',
    72,
    'Male',
    '91-8273-1928-4491',
    'Hindi',
    'B-42, Sector C, Aliganj',
    'Lucknow',
    'Uttar Pradesh',
    '226024',
    '08:30:00'
) ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO clinical_documents (id, senior_id, category, title, doctor_name, document_date, raw_text, extracted_summary)
VALUES 
(
    'DOC_RX_2026_0910',
    'SENIOR_RAMESH_001',
    'prescription',
    'Cardiology Follow-Up Prescription',
    'Dr. V. K. Sharma (MD, Cardiology)',
    '2026-09-10',
    'Ramesh Chandra, 72/M. Hypertension & Type 2 Diabetes stable. Continue Telmisartan 40mg (1 OD morning post breakfast). Continue Metformin 500mg (half tab BD after meals). Salt restriction advised. Renal profile stable. Review after 3 months.',
    'Active prescriptions for Telmisartan 40mg and Metformin 500mg. Salt restriction emphasized. Renal profile reported stable.'
),
(
    'DOC_LAB_2026_0905',
    'SENIOR_RAMESH_001',
    'lab_report',
    'Comprehensive Metabolic & Renal Profile',
    'Metropolis Healthcare Labs',
    '2026-09-05',
    'Serum Creatinine: 1.10 mg/dL (Ref: 0.70 - 1.30 mg/dL) - NORMAL. eGFR: >75 mL/min. Fasting Blood Glucose: 118 mg/dL. HbA1c: 6.8% (Target <7.0%). Serum Potassium: 4.4 mmol/L.',
    'Serum Creatinine 1.1 mg/dL is within normal limits. HbA1c 6.8% indicates adequate glycemic control.'
),
(
    'DOC_CONSULT_2026_0815',
    'SENIOR_RAMESH_001',
    'consultation',
    'Monthly Physician Clinical Review Note',
    'Dr. V. K. Sharma (MD, Cardiology)',
    '2026-08-15',
    'Blood pressure recorded at clinic: 132/84 mmHg. Lungs clear, no pedal edema. Ramesh Ji reports walking in the neighborhood park for 20 mins every morning. Adherence to morning BP medicine confirmed.',
    'Blood pressure stable. Regular walking routine noted. No signs of peripheral edema.'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO medication_doses (id, senior_id, document_id, drug_name, brand_name, strength, cadence, timing_instructions, current_stock_units, daily_consumption, runway_days, refill_threshold_days, unit_price_inr, status)
VALUES
(
    'DOSE_TELMI_40',
    'SENIOR_RAMESH_001',
    'DOC_RX_2026_0910',
    'Telmisartan',
    'Telma 40 (Glenmark)',
    '40mg',
    '1 tablet daily (Morning)',
    'Take 1 tablet daily in the morning immediately after breakfast with water',
    6,
    1.0,
    6,
    7,
    640.00,
    'ACTIVE'
),
(
    'DOSE_METFORMIN_500',
    'SENIOR_RAMESH_001',
    'DOC_RX_2026_0910',
    'Metformin hydrochloride',
    'Glycomet 500',
    '500mg',
    'Half tablet (250mg) twice daily',
    'Take half tablet twice daily after morning and night meals',
    18,
    1.0,
    18,
    7,
    210.00,
    'ACTIVE'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO vital_and_level_tracking (id, senior_id, document_id, vital_type, value_numeric, unit, recorded_date, is_normal, reference_range, trend_direction, notes)
VALUES
(
    'VIT_CREAT_2026_0905',
    'SENIOR_RAMESH_001',
    'DOC_LAB_2026_0905',
    'creatinine',
    1.10,
    'mg/dL',
    '2026-09-05',
    TRUE,
    '0.70 - 1.30 mg/dL',
    'STABLE',
    'Stable renal filtration. Safe for continued ACE-I/ARB maintenance.'
),
(
    'VIT_BP_SYS_2026_0910',
    'SENIOR_RAMESH_001',
    'DOC_RX_2026_0910',
    'blood_pressure_systolic',
    128.00,
    'mmHg',
    '2026-09-10',
    TRUE,
    '110 - 135 mmHg',
    'STABLE',
    'Optimal systolic reading.'
),
(
    'VIT_BP_DIA_2026_0910',
    'SENIOR_RAMESH_001',
    'DOC_RX_2026_0910',
    'blood_pressure_diastolic',
    82.00,
    'mmHg',
    '2026-09-10',
    TRUE,
    '70 - 85 mmHg',
    'STABLE',
    'Optimal diastolic reading.'
),
(
    'VIT_HBA1C_2026_0905',
    'SENIOR_RAMESH_001',
    'DOC_LAB_2026_0905',
    'hba1c',
    6.80,
    '%',
    '2026-09-05',
    TRUE,
    '4.0 - 5.6% (Target <7.0% for seniors)',
    'STABLE',
    'Well managed on Glycomet 500.'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO caregiver_inputs (id, senior_id, category, note_text, is_active)
VALUES
(
    'CG_INPUT_001',
    'SENIOR_RAMESH_001',
    'diet_restriction',
    'Strict low-sodium cooking. No added salt on salads or curd. Rock salt strictly limited to 2g per day.',
    TRUE
),
(
    'CG_INPUT_002',
    'SENIOR_RAMESH_001',
    'doctor_verbal_note',
    'Dr. Sharma mentioned in July that if Papa feels lightheaded upon standing up quickly, check sitting vs standing BP.',
    TRUE
),
(
    'CG_INPUT_003',
    'SENIOR_RAMESH_001',
    'daily_routine',
    'Morning tea and poha by 08:00 AM. Seated in the drawing room with phone on loud for Sambandh 08:30 AM check-in.',
    TRUE
)
ON CONFLICT (id) DO NOTHING;

-- 7. Caregiver Autonomous & Fiduciary Configuration
CREATE TABLE IF NOT EXISTS caregiver_config (
    senior_id VARCHAR(64) PRIMARY KEY REFERENCES seniors(id) ON DELETE CASCADE,
    caregiver_name VARCHAR(128) NOT NULL DEFAULT 'Priya Sharma',
    caregiver_phone VARCHAR(32) NOT NULL DEFAULT '+91 98112 34567',
    caregiver_email VARCHAR(128) DEFAULT 'priya.sharma@gmail.com',
    notification_channel VARCHAR(32) NOT NULL DEFAULT 'telegram',
    order_total_limit_inr INT NOT NULL DEFAULT 4500,
    auto_refill_threshold_days INT NOT NULL DEFAULT 7,
    cash_wallet_balance_inr NUMERIC(10, 2) DEFAULT 1200.00,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO caregiver_config (senior_id, caregiver_name, caregiver_phone, caregiver_email, notification_channel, order_total_limit_inr, auto_refill_threshold_days, cash_wallet_balance_inr)
VALUES (
    'SENIOR_RAMESH_001',
    'Priya Sharma',
    '+91 98112 34567',
    'priya.sharma@gmail.com',
    'telegram',
    4500,
    7,
    1200.00
) ON CONFLICT (senior_id) DO NOTHING;

-- 8. Longitudinal Call Summaries & Family Briefing Archive
CREATE TABLE IF NOT EXISTS call_summaries (
    id VARCHAR(64) PRIMARY KEY,
    senior_id VARCHAR(64) NOT NULL REFERENCES seniors(id) ON DELETE CASCADE,
    call_date VARCHAR(64) NOT NULL,
    call_time VARCHAR(32) NOT NULL,
    duration VARCHAR(32) NOT NULL,
    call_type VARCHAR(128) NOT NULL,
    topic_title VARCHAR(255) NOT NULL,
    sentiment VARCHAR(32) NOT NULL,
    sentiment_score INT NOT NULL,
    adherence_status TEXT NOT NULL,
    key_topics TEXT,
    highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
    audio_transcript TEXT,
    audio_duration VARCHAR(16),
    fiduciary_or_logistics TEXT,
    vitals_snippet TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_summaries_senior_created ON call_summaries(senior_id, created_at DESC);

INSERT INTO call_summaries (id, senior_id, call_date, call_time, duration, call_type, topic_title, sentiment, sentiment_score, adherence_status, key_topics, highlights, audio_transcript, audio_duration, fiduciary_or_logistics, vitals_snippet)
VALUES
(
    'summary-today',
    'SENIOR_RAMESH_001',
    'Today, Oct 03, 2026',
    '08:34 AM IST',
    '4m 12s',
    'Daily Routine Telephony Check-in',
    'Railway Signal Lore & Telma-40 Adherence',
    'CHEERFUL',
    94,
    'Telma-40 Taken with fresh water ✅',
    'Northern Railway 1982 mechanical interlocking memories, tea in balcony, pill stock check',
    '["Confirmed taking morning BP medication (Telma-40) post-breakfast.", "Reminisced about Delhi Division mechanical lever interlocking days.", "Pill runway low (4 days left): Pine Labs auto-debit of ₹840 executed.", "Delhivery CMU delivery DLV-98234-DEL scheduled for Today 4:00 PM."]'::jsonb,
    'बेटा, 1982 में जब हम दिल्ली डिवीजन में सिग्नल इंस्पेक्टर थे... उस समय मैकेनिकल लीवर फ्रेम हुआ करता था। हाथ से खींचना पड़ता था भारी लीवर।',
    '0:42',
    'Pine Labs ₹840 debited · Delhivery ETA 4:00 PM',
    'BP: 112/80 mmHg · Glucose: 104 mg/dL'
),
(
    'summary-oct02',
    'SENIOR_RAMESH_001',
    'Yesterday, Oct 02, 2026',
    '08:31 AM IST',
    '3m 48s',
    'Daily Routine Telephony Check-in',
    'Gandhi Jayanti Walk & Knee Stiffness Review',
    'CALM',
    88,
    'Telma-40 confirmed taken; Glycomet taken at night',
    'Morning walk in Japanese Park with Sharma Ji, knee joint stiffness, warm water compress',
    '["Papa completed 25-minute gentle walk in Sector 8 Japanese Park.", "Reported mild bilateral knee stiffness; Sambandh suggested warm compress.", "No emergency or chest heaviness; appetite reported normal."]'::jsonb,
    'आज गांधी जयंती पर जापानी पार्क में काफी रौनक थी। थोड़ा घुटने में भारीपन था तो बेंच पर बैठ गए थे थोड़ी देर।',
    '0:35',
    NULL,
    'BP: 118/82 mmHg · Pulse: 72 bpm'
),
(
    'summary-oct01',
    'SENIOR_RAMESH_001',
    'Wednesday, Oct 01, 2026',
    '08:30 AM IST',
    '5m 05s',
    'Daily Routine Telephony Check-in',
    'Pooja Preparations & Mohammed Rafi Ghazals',
    'CHEERFUL',
    96,
    'Full adherence confirmed across all doses',
    'Talat Mahmood and Rafi songs on Vividh Bharati, fresh marigold flowers delivered',
    '["Listening to old radio broadcast; expressed deep joy and nostalgia.", "Quick commerce marigold pooja flowers confirmed received at 07:00 AM.", "Blood sugar stable post-breakfast."]'::jsonb,
    'विविध भारती पर आज तलत महमूद का गाना आ रहा था... "जलते हैं जिसके लिए"। मन एकदम खुश हो गया सुबह-सुबह।',
    '0:48',
    'Pooja Basket ₹210 auto-settled via Pine Labs',
    'BP: 114/78 mmHg · Sugar: 110 mg/dL'
),
(
    'summary-sep30',
    'SENIOR_RAMESH_001',
    'Tuesday, Sep 30, 2026',
    '08:35 AM IST',
    '3m 15s',
    'Daily Routine Telephony Check-in',
    'Rohini Weather & Low-Salt Diet Compliance',
    'CALM',
    85,
    'Morning BP dose confirmed taken with fresh water',
    'Autumn breeze in Delhi, avoiding salty pickle as advised by Dr. Saxena',
    '["Confirmed staying away from pickle and papad as per low-salt protocol.", "Slept soundly for 6.5 hours; waking up rested.", "Reminded to drink warm water throughout the day."]'::jsonb,
    'आजकल सुबह-सुबह बालकनी में अच्छी हवा चलती है। अचार तो हमने बिल्कुल छोड़ दिया है जैसा डॉक्टर साहब ने कहा था।',
    '0:30',
    NULL,
    'BP: 116/80 mmHg · Creatinine: 1.10 mg/dL'
),
(
    'summary-sep29',
    'SENIOR_RAMESH_001',
    'Monday, Sep 29, 2026',
    '08:32 AM IST',
    '4m 20s',
    'Daily Routine Telephony Check-in',
    'Weekly Prescription Runway & Doctor Consultation',
    'STABLE',
    90,
    'Weekly pill box loaded and verified',
    'Dr. Saxena clinic review slip, pill runway count, pension credit',
    '["Dr. Saxena review slip verified on ABDM Health Locker.", "Northern Railway pension credit confirmed in SBI Rohini branch.", "Priya notified on Telegram of stable weekly trajectory."]'::jsonb,
    'पेंशन खाते में समय से आ गई है बेटा। कोई चिंता की बात नहीं है, सब बढ़िया चल रहा है।',
    '0:38',
    NULL,
    'BP: 110/78 mmHg · Glucose: 102 mg/dL'
)
ON CONFLICT (id) DO NOTHING;

