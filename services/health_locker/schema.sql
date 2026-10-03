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
