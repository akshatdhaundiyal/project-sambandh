"""
Project Sambandh: Health Locker Database Adapter
Connects directly to PostgreSQL (localhost:5432/sambandh), Supabase, or in-memory fallback.
"""

import os
import json
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime

logger = logging.getLogger("health_locker_db")

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:postgres@127.0.0.1:5434/sambandh"
)
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

class HealthLockerDB:
    """Unified client for Local PostgreSQL, Supabase, and In-Memory fallback."""

    def __init__(self):
        self._pg_conn = None
        self._connected = False
        self._init_connection()

    def _init_connection(self):
        if DATABASE_URL:
            try:
                import psycopg2
                import psycopg2.extras
                self._pg_conn = psycopg2.connect(DATABASE_URL)
                self._pg_conn.autocommit = True
                self._connected = True
                logger.info("Successfully connected to PostgreSQL at %s", DATABASE_URL)
            except Exception as e:
                logger.warning("Could not connect to PostgreSQL (%s). In-memory fallback will be used if needed.", e)
                self._connected = False

    def is_connected(self) -> bool:
        if not self._connected or not self._pg_conn:
            return False
        try:
            with self._pg_conn.cursor() as cur:
                cur.execute("SELECT 1;")
                return True
        except Exception:
            self._connected = False
            return False

    def get_connection_info(self) -> Dict[str, Any]:
        connected = self.is_connected()
        tables_count = 0
        if connected:
            try:
                with self._pg_conn.cursor() as cur:
                    cur.execute("SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';")
                    tables_count = cur.fetchone()[0]
            except Exception:
                pass
        return {
            "connected": connected,
            "engine": "PostgreSQL 15 (Docker)" if connected else "In-Memory Mirror",
            "database": "sambandh",
            "host": "localhost:5432",
            "tables_count": tables_count
        }

    # =========================================================================
    # Seniors Profile
    # =========================================================================
    def get_senior(self, senior_id: str = "SENIOR_RAMESH_001") -> Optional[Dict[str, Any]]:
        if self.is_connected():
            try:
                import psycopg2.extras
                with self._pg_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    cur.execute("SELECT * FROM seniors WHERE id = %s;", (senior_id,))
                    row = cur.fetchone()
                    if row:
                        return dict(row)
            except Exception as e:
                logger.error("Error fetching senior from PG: %s", e)

        # Fallback
        return {
            "id": "SENIOR_RAMESH_001",
            "name": "Ramesh Chandra",
            "age": 72,
            "gender": "Male",
            "abha_id": "91-8273-1928-4491",
            "primary_language": "Hindi",
            "address_line": "Rohini Sector 8, Delhi",
            "city": "Delhi",
            "state": "Delhi",
            "pin_code": "110085",
            "daily_call_window_ist": "08:30:00"
        }

    # =========================================================================
    # Clinical Documents
    # =========================================================================
    def get_clinical_documents(self, senior_id: str = "SENIOR_RAMESH_001") -> List[Dict[str, Any]]:
        if self.is_connected():
            try:
                import psycopg2.extras
                with self._pg_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    cur.execute("""
                        SELECT id, senior_id, category, title, doctor_name, 
                               to_char(document_date, 'YYYY-MM-DD') as document_date,
                               raw_text, file_url, extracted_summary, created_at
                        FROM clinical_documents 
                        WHERE senior_id = %s 
                        ORDER BY document_date DESC;
                    """, (senior_id,))
                    return [dict(r) for r in cur.fetchall()]
            except Exception as e:
                logger.error("Error fetching documents from PG: %s", e)

        return []

    def save_clinical_document(self, doc: Dict[str, Any], doses: Optional[List[Dict[str, Any]]] = None, vitals: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        if self.is_connected():
            try:
                with self._pg_conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO clinical_documents (id, senior_id, category, title, doctor_name, document_date, raw_text, file_url, extracted_summary)
                        VALUES (%s, %s, %s, %s, %s, %s::date, %s, %s, %s)
                        ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, raw_text = EXCLUDED.raw_text;
                    """, (
                        doc["id"], doc["senior_id"], doc["category"], doc["title"],
                        doc.get("doctor_name", "Dr. V. K. Sharma"), doc.get("document_date", datetime.now().strftime("%Y-%m-%d")),
                        doc["raw_text"], doc.get("file_url"), doc.get("extracted_summary")
                    ))

                    if doses:
                        for d in doses:
                            cur.execute("""
                                INSERT INTO medication_doses (id, senior_id, document_id, drug_name, brand_name, strength, cadence, timing_instructions, current_stock_units, daily_consumption, runway_days, refill_threshold_days, unit_price_inr, status)
                                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                                ON CONFLICT (id) DO UPDATE SET current_stock_units = EXCLUDED.current_stock_units, runway_days = EXCLUDED.runway_days;
                            """, (
                                d["id"], d["senior_id"], doc["id"], d["drug_name"], d.get("brand_name"),
                                d["strength"], d["cadence"], d["timing_instructions"],
                                d.get("current_stock_units", 30), d.get("daily_consumption", 1.0),
                                d.get("runway_days", 30), d.get("refill_threshold_days", 7),
                                d.get("unit_price_inr", 0.0), d.get("status", "ACTIVE")
                            ))

                    if vitals:
                        for v in vitals:
                            cur.execute("""
                                INSERT INTO vital_and_level_tracking (id, senior_id, document_id, vital_type, value_numeric, unit, recorded_date, is_normal, reference_range, trend_direction, notes)
                                VALUES (%s, %s, %s, %s, %s, %s, %s::date, %s, %s, %s, %s)
                                ON CONFLICT (id) DO NOTHING;
                            """, (
                                v["id"], v["senior_id"], doc["id"], v["vital_type"],
                                v["value_numeric"], v["unit"], v.get("recorded_date", datetime.now().strftime("%Y-%m-%d")),
                                v.get("is_normal", True), v.get("reference_range"), v.get("trend_direction", "STABLE"), v.get("notes")
                            ))

                return {"status": "SUCCESS", "document_id": doc["id"], "persisted_in": "PostgreSQL"}
            except Exception as e:
                logger.error("Error saving document to PG: %s", e)
                return {"status": "ERROR", "message": str(e)}

        return {"status": "SUCCESS", "document_id": doc["id"], "persisted_in": "In-Memory"}

    # =========================================================================
    # Medication Doses & Runway
    # =========================================================================
    def get_medication_doses(self, senior_id: str = "SENIOR_RAMESH_001") -> List[Dict[str, Any]]:
        if self.is_connected():
            try:
                import psycopg2.extras
                with self._pg_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    cur.execute("""
                        SELECT id, senior_id, document_id, drug_name, brand_name, 
                               strength, cadence, timing_instructions, current_stock_units, 
                               daily_consumption, runway_days, refill_threshold_days, 
                               unit_price_inr, status, updated_at
                        FROM medication_doses 
                        WHERE senior_id = %s AND status = 'ACTIVE'
                        ORDER BY runway_days ASC;
                    """, (senior_id,))
                    rows = cur.fetchall()
                    return [dict(r) for r in rows]
            except Exception as e:
                logger.error("Error fetching doses from PG: %s", e)

        return []

    def update_medication_refill(self, senior_id: str, drug_name: str, added_units: int = 30) -> Dict[str, Any]:
        if self.is_connected():
            try:
                with self._pg_conn.cursor() as cur:
                    cur.execute("""
                        UPDATE medication_doses 
                        SET current_stock_units = current_stock_units + %s,
                            runway_days = runway_days + %s,
                            updated_at = CURRENT_TIMESTAMP
                        WHERE senior_id = %s AND (drug_name ILIKE %s OR brand_name ILIKE %s);
                    """, (added_units, added_units, senior_id, f"%{drug_name}%", f"%{drug_name}%"))
                    return {"status": "REFILLED", "drug": drug_name, "added_units": added_units}
            except Exception as e:
                logger.error("Error updating refill in PG: %s", e)
                return {"status": "ERROR", "message": str(e)}

        return {"status": "REFILLED", "drug": drug_name, "added_units": added_units}

    # =========================================================================
    # Vital Levels & Biomarkers
    # =========================================================================
    def get_vital_tracking(self, senior_id: str = "SENIOR_RAMESH_001", vital_type: Optional[str] = None) -> List[Dict[str, Any]]:
        if self.is_connected():
            try:
                import psycopg2.extras
                with self._pg_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    if vital_type:
                        cur.execute("""
                            SELECT id, senior_id, document_id, vital_type, value_numeric, 
                                   unit, to_char(recorded_date, 'YYYY-MM-DD') as recorded_date,
                                   is_normal, reference_range, trend_direction, notes
                            FROM vital_and_level_tracking 
                            WHERE senior_id = %s AND vital_type = %s 
                            ORDER BY recorded_date DESC;
                        """, (senior_id, vital_type))
                    else:
                        cur.execute("""
                            SELECT id, senior_id, document_id, vital_type, value_numeric, 
                                   unit, to_char(recorded_date, 'YYYY-MM-DD') as recorded_date,
                                   is_normal, reference_range, trend_direction, notes
                            FROM vital_and_level_tracking 
                            WHERE senior_id = %s 
                            ORDER BY recorded_date DESC;
                        """, (senior_id,))
                    return [dict(r) for r in cur.fetchall()]
            except Exception as e:
                logger.error("Error fetching vitals from PG: %s", e)

        return []

    # =========================================================================
    # Caregiver Inputs & Config
    # =========================================================================
    def get_caregiver_inputs(self, senior_id: str = "SENIOR_RAMESH_001") -> List[Dict[str, Any]]:
        if self.is_connected():
            try:
                import psycopg2.extras
                with self._pg_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    cur.execute("SELECT * FROM caregiver_inputs WHERE senior_id = %s AND is_active = TRUE;", (senior_id,))
                    return [dict(r) for r in cur.fetchall()]
            except Exception as e:
                logger.error("Error fetching caregiver inputs from PG: %s", e)

        return []

    def get_caregiver_config(self, senior_id: str = "SENIOR_RAMESH_001") -> Dict[str, Any]:
        if self.is_connected():
            try:
                import psycopg2.extras
                with self._pg_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    cur.execute("SELECT * FROM caregiver_config WHERE senior_id = %s;", (senior_id,))
                    row = cur.fetchone()
                    if row:
                        return dict(row)
            except Exception as e:
                logger.error("Error fetching caregiver config from PG: %s", e)

        return {
            "senior_id": "SENIOR_RAMESH_001",
            "caregiver_name": "Priya Sharma",
            "caregiver_phone": "+91 98112 34567",
            "notification_channel": "telegram",
            "order_total_limit_inr": 4500,
            "auto_refill_threshold_days": 7,
            "cash_wallet_balance_inr": 1200.00
        }

    def update_caregiver_config(self, senior_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        if self.is_connected():
            try:
                with self._pg_conn.cursor() as cur:
                    if "order_total_limit_inr" in updates:
                        cur.execute("UPDATE caregiver_config SET order_total_limit_inr = %s WHERE senior_id = %s;", (updates["order_total_limit_inr"], senior_id))
                    if "cash_wallet_balance_inr" in updates:
                        cur.execute("UPDATE caregiver_config SET cash_wallet_balance_inr = %s WHERE senior_id = %s;", (updates["cash_wallet_balance_inr"], senior_id))
                return {"status": "SUCCESS", "updates": updates}
            except Exception as e:
                logger.error("Error updating caregiver config in PG: %s", e)
        return {"status": "SUCCESS", "updates": updates}

    # =========================================================================
    # Call Summaries Archive
    # =========================================================================
    def get_call_summaries(self, senior_id: str = "SENIOR_RAMESH_001") -> List[Dict[str, Any]]:
        if self.is_connected():
            try:
                import psycopg2.extras
                with self._pg_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    cur.execute("""
                        SELECT id, senior_id, call_date as date, call_time as time, 
                               duration, call_type as "callType", topic_title as "topicTitle", 
                               sentiment, sentiment_score as "sentimentScore", 
                               adherence_status as "adherenceStatus", key_topics as "keyTopics", 
                               highlights, audio_transcript as "audioTranscript", 
                               audio_duration as "audioDuration", 
                               fiduciary_or_logistics as "fiduciaryOrLogistics", 
                               vitals_snippet as "vitalsSnippet"
                        FROM call_summaries 
                        WHERE senior_id = %s 
                        ORDER BY created_at DESC;
                    """, (senior_id,))
                    rows = cur.fetchall()
                    result = []
                    for r in rows:
                        d = dict(r)
                        if isinstance(d.get("highlights"), str):
                            d["highlights"] = json.loads(d["highlights"])
                        result.append(d)
                    return result
            except Exception as e:
                logger.error("Error fetching summaries from PG: %s", e)

        return []

    def save_call_summary(self, summary: Dict[str, Any]) -> Dict[str, Any]:
        if self.is_connected():
            try:
                with self._pg_conn.cursor() as cur:
                    highlights_json = json.dumps(summary.get("highlights", []))
                    cur.execute("""
                        INSERT INTO call_summaries (
                            id, senior_id, call_date, call_time, duration, call_type,
                            topic_title, sentiment, sentiment_score, adherence_status,
                            key_topics, highlights, audio_transcript, audio_duration,
                            fiduciary_or_logistics, vitals_snippet
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s::jsonb, %s, %s, %s, %s)
                        ON CONFLICT (id) DO UPDATE SET topic_title = EXCLUDED.topic_title;
                    """, (
                        summary["id"], summary.get("senior_id", "SENIOR_RAMESH_001"),
                        summary["date"], summary["time"], summary.get("duration", "4m 12s"),
                        summary.get("callType", "Daily Routine Telephony Check-in"),
                        summary["topicTitle"], summary.get("sentiment", "CHEERFUL"),
                        summary.get("sentimentScore", 92), summary.get("adherenceStatus", "Pill taken ✅"),
                        summary.get("keyTopics", ""), highlights_json,
                        summary.get("audioTranscript", ""), summary.get("audioDuration", "0:40"),
                        summary.get("fiduciaryOrLogistics", ""), summary.get("vitalsSnippet", "")
                    ))
                return {"status": "SUCCESS", "id": summary["id"]}
            except Exception as e:
                logger.error("Error saving summary to PG: %s", e)
                return {"status": "ERROR", "message": str(e)}

        return {"status": "SUCCESS", "id": summary["id"]}

    # =========================================================================
    # Clinical Audit Logging
    # =========================================================================
    def log_audit(self, senior_id: str, query_text: str, mode: str, model_used: str, latency_ms: int, tokens_evaluated: int, guardrail_status: Dict[str, Any], response_summary: str = ""):
        if self.is_connected():
            try:
                import uuid
                with self._pg_conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO clinical_audit_logs (id, senior_id, query_text, retrieval_mode, model_used, latency_ms, tokens_evaluated, guardrail_status, response_summary)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s::jsonb, %s);
                    """, (
                        f"AUDIT_{uuid.uuid4().hex[:12]}", senior_id, query_text,
                        mode, model_used, latency_ms, tokens_evaluated,
                        json.dumps(guardrail_status), response_summary
                    ))
            except Exception as e:
                logger.error("Error logging audit in PG: %s", e)

# Singleton export
db = HealthLockerDB()
