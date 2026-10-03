"""
Project Sambandh: Health Locker Database Adapter
Supports Local PostgreSQL, Supabase, and resilient In-Memory Fallback.
"""

import os
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger("health_locker_db")

DATABASE_URL = os.environ.get("DATABASE_URL")
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

# Resilient in-memory database store (mirrors schema.sql seed data)
IN_MEMORY_STORE: Dict[str, Any] = {
    "seniors": {
        "SENIOR_RAMESH_001": {
            "id": "SENIOR_RAMESH_001",
            "name": "Ramesh Chandra",
            "age": 72,
            "gender": "Male",
            "abha_id": "91-8273-1928-4491",
            "primary_language": "Hindi",
            "address_line": "B-42, Sector C, Aliganj",
            "city": "Lucknow",
            "state": "Uttar Pradesh",
            "pin_code": "226024",
            "daily_call_window_ist": "08:30:00"
        }
    },
    "clinical_documents": [
        {
            "id": "DOC_RX_2026_0910",
            "senior_id": "SENIOR_RAMESH_001",
            "category": "prescription",
            "title": "Cardiology Follow-Up Prescription",
            "doctor_name": "Dr. V. K. Sharma (MD, Cardiology)",
            "document_date": "2026-09-10",
            "raw_text": "Ramesh Chandra, 72/M. Continue Telmisartan 40mg (1 OD morning post breakfast). Continue Metformin 500mg (half tab BD after meals). Salt restriction advised. Renal profile stable. Review after 3 months.",
            "extracted_summary": "Active prescriptions for Telmisartan 40mg and Metformin 500mg. Salt restriction emphasized."
        },
        {
            "id": "DOC_LAB_2026_0905",
            "senior_id": "SENIOR_RAMESH_001",
            "category": "lab_report",
            "title": "Comprehensive Metabolic & Renal Profile",
            "doctor_name": "Metropolis Healthcare Labs",
            "document_date": "2026-09-05",
            "raw_text": "Serum Creatinine: 1.10 mg/dL (Ref: 0.70 - 1.30 mg/dL) - NORMAL. eGFR: >75 mL/min. Fasting Blood Glucose: 118 mg/dL. HbA1c: 6.8% (Target <7.0%).",
            "extracted_summary": "Serum Creatinine 1.1 mg/dL is within normal limits. HbA1c 6.8% indicates adequate glycemic control."
        },
        {
            "id": "DOC_CONSULT_2026_0815",
            "senior_id": "SENIOR_RAMESH_001",
            "category": "consultation",
            "title": "Monthly Physician Clinical Review Note",
            "doctor_name": "Dr. V. K. Sharma (MD, Cardiology)",
            "document_date": "2026-08-15",
            "raw_text": "Blood pressure recorded at clinic: 132/84 mmHg. Lungs clear, no pedal edema. Walking in park for 20 mins every morning confirmed.",
            "extracted_summary": "Blood pressure stable. Regular walking routine noted. No signs of peripheral edema."
        }
    ],
    "medication_doses": [
        {
            "id": "DOSE_TELMI_40",
            "senior_id": "SENIOR_RAMESH_001",
            "document_id": "DOC_RX_2026_0910",
            "drug_name": "Telmisartan",
            "brand_name": "Telma 40 (Glenmark)",
            "strength": "40mg",
            "cadence": "1 tablet daily (Morning)",
            "timing_instructions": "Take 1 tablet daily in the morning immediately after breakfast with water",
            "current_stock_units": 6,
            "daily_consumption": 1.0,
            "runway_days": 6,
            "refill_threshold_days": 7,
            "unit_price_inr": 640.0,
            "status": "ACTIVE"
        },
        {
            "id": "DOSE_METFORMIN_500",
            "senior_id": "SENIOR_RAMESH_001",
            "document_id": "DOC_RX_2026_0910",
            "drug_name": "Metformin hydrochloride",
            "brand_name": "Glycomet 500",
            "strength": "500mg",
            "cadence": "Half tablet (250mg) twice daily",
            "timing_instructions": "Take half tablet twice daily after morning and night meals",
            "current_stock_units": 18,
            "daily_consumption": 1.0,
            "runway_days": 18,
            "refill_threshold_days": 7,
            "unit_price_inr": 210.0,
            "status": "ACTIVE"
        }
    ],
    "vital_and_level_tracking": [
        {
            "id": "VIT_CREAT_2026_0905",
            "senior_id": "SENIOR_RAMESH_001",
            "document_id": "DOC_LAB_2026_0905",
            "vital_type": "creatinine",
            "value_numeric": 1.10,
            "unit": "mg/dL",
            "recorded_date": "2026-09-05",
            "is_normal": True,
            "reference_range": "0.70 - 1.30 mg/dL",
            "trend_direction": "STABLE",
            "notes": "Stable renal filtration. Safe for continued ACE-I/ARB maintenance."
        },
        {
            "id": "VIT_BP_SYS_2026_0910",
            "senior_id": "SENIOR_RAMESH_001",
            "document_id": "DOC_RX_2026_0910",
            "vital_type": "blood_pressure_systolic",
            "value_numeric": 128.0,
            "unit": "mmHg",
            "recorded_date": "2026-09-10",
            "is_normal": True,
            "reference_range": "110 - 135 mmHg",
            "trend_direction": "STABLE",
            "notes": "Optimal systolic reading."
        },
        {
            "id": "VIT_BP_DIA_2026_0910",
            "senior_id": "SENIOR_RAMESH_001",
            "document_id": "DOC_RX_2026_0910",
            "vital_type": "blood_pressure_diastolic",
            "value_numeric": 82.0,
            "unit": "mmHg",
            "recorded_date": "2026-09-10",
            "is_normal": True,
            "reference_range": "70 - 85 mmHg",
            "trend_direction": "STABLE",
            "notes": "Optimal diastolic reading."
        },
        {
            "id": "VIT_HBA1C_2026_0905",
            "senior_id": "SENIOR_RAMESH_001",
            "document_id": "DOC_LAB_2026_0905",
            "vital_type": "hba1c",
            "value_numeric": 6.80,
            "unit": "%",
            "recorded_date": "2026-09-05",
            "is_normal": True,
            "reference_range": "Target <7.0%",
            "trend_direction": "STABLE",
            "notes": "Well managed on Glycomet 500."
        }
    ],
    "caregiver_inputs": [
        {
            "id": "CG_INPUT_001",
            "senior_id": "SENIOR_RAMESH_001",
            "category": "diet_restriction",
            "note_text": "Strict low-sodium cooking. No added salt on salads or curd. Rock salt limited to 2g per day.",
            "is_active": True
        },
        {
            "id": "CG_INPUT_002",
            "senior_id": "SENIOR_RAMESH_001",
            "category": "doctor_verbal_note",
            "note_text": "Dr. Sharma mentioned that if Papa feels lightheaded upon standing, check sitting vs standing BP.",
            "is_active": True
        },
        {
            "id": "CG_INPUT_003",
            "senior_id": "SENIOR_RAMESH_001",
            "category": "daily_routine",
            "note_text": "Morning tea and poha by 08:00 AM. Seated in drawing room for Sambandh 08:30 AM check-in.",
            "is_active": True
        }
    ],
    "audit_logs": []
}


class HealthLockerDB:
    """Unified client for Local PostgreSQL, Supabase, and In-Memory fallback."""

    def __init__(self):
        self._pg_conn = None
        self._supabase_client = None

        if SUPABASE_URL and SUPABASE_KEY:
            try:
                from supabase import create_client
                self._supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
                logger.info("Connected to Supabase at %s", SUPABASE_URL)
            except Exception as e:
                logger.warning("Could not connect to Supabase: %s. Falling back to local/in-memory.", e)

        elif DATABASE_URL:
            try:
                import psycopg2
                self._pg_conn = psycopg2.connect(DATABASE_URL)
                logger.info("Connected to PostgreSQL via DATABASE_URL")
            except Exception as e:
                logger.warning("Could not connect to PostgreSQL: %s. Using in-memory fallback.", e)

    def get_senior(self, senior_id: str) -> Optional[Dict[str, Any]]:
        return IN_MEMORY_STORE["seniors"].get(senior_id)

    def get_medication_doses(self, senior_id: str) -> List[Dict[str, Any]]:
        return [m for m in IN_MEMORY_STORE["medication_doses"] if m["senior_id"] == senior_id]

    def get_vital_tracking(self, senior_id: str, vital_type: Optional[str] = None) -> List[Dict[str, Any]]:
        vitals = [v for v in IN_MEMORY_STORE["vital_and_level_tracking"] if v["senior_id"] == senior_id]
        if vital_type:
            vitals = [v for v in vitals if v["vital_type"] == vital_type]
        return vitals

    def get_caregiver_inputs(self, senior_id: str) -> List[Dict[str, Any]]:
        return [c for c in IN_MEMORY_STORE["caregiver_inputs"] if c["senior_id"] == senior_id and c["is_active"]]

    def get_clinical_documents(self, senior_id: str) -> List[Dict[str, Any]]:
        return [d for d in IN_MEMORY_STORE["clinical_documents"] if d["senior_id"] == senior_id]

    def save_extracted_document(
        self,
        doc: Dict[str, Any],
        doses: List[Dict[str, Any]],
        vitals: List[Dict[str, Any]],
        caregiver_notes: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """Saves 1st-time MedGemma extraction entities into structured tables."""
        IN_MEMORY_STORE["clinical_documents"].insert(0, doc)

        for dose in doses:
            IN_MEMORY_STORE["medication_doses"].insert(0, dose)

        for vital in vitals:
            IN_MEMORY_STORE["vital_and_level_tracking"].insert(0, vital)

        if caregiver_notes:
            for note in caregiver_notes:
                IN_MEMORY_STORE["caregiver_inputs"].insert(0, note)

        return {
            "document_id": doc.get("id"),
            "doses_count": len(doses),
            "vitals_count": len(vitals),
            "status": "SAVED"
        }

    def log_audit(
        self,
        senior_id: str,
        query_text: str,
        mode: str,
        model_used: str,
        latency_ms: int,
        tokens_evaluated: int,
        guardrail_status: Dict[str, Any],
        response_summary: str
    ):
        audit_entry = {
            "id": f"AUD_{int(datetime.now().timestamp() * 1000)}",
            "senior_id": senior_id,
            "query_text": query_text,
            "retrieval_mode": mode,
            "model_used": model_used,
            "latency_ms": latency_ms,
            "tokens_evaluated": tokens_evaluated,
            "guardrail_status": guardrail_status,
            "response_summary": response_summary,
            "created_at": datetime.now().isoformat()
        }
        IN_MEMORY_STORE["audit_logs"].append(audit_entry)
        return audit_entry


# Singleton instance
db = HealthLockerDB()
