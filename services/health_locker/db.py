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
    # Seniors Profile (Caregiver Editable)
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
            "address_line": "Flat 402, Block C, Pocket 2, Rohini Sector 8",
            "city": "Delhi",
            "state": "Delhi",
            "pin_code": "110085",
            "daily_call_window_ist": "08:30:00",
            "vocation": "Retired Chief Signal Inspector (Northern Railway, 41 years). Proud of mechanical relay safety record at Ghaziabad junction.",
            "personality_notes": "Dignified, lucent, nostalgic about railway lore and Talat Mahmood ghazals.",
            "health_baseline": "Stage-1 Essential Hypertension (Telma 40 OD morning post breakfast), Bilateral Knee Osteoarthritis (morning stiffness), controlled Type 2 Diabetes (Metformin 500mg evening).",
            "family_context": "Son Rohan Sharma lives in Bengaluru. Very caring; speaks weekly; pre-authorized Pine Labs monthly care budget ₹4,500.",
            "preferred_address": "अंकल / जी",
            "caregiver_name": "Rohan Sharma",
            "caregiver_relationship": "Son",
            "doctor_name": "Dr. Arvind Saxena (MD, Cardiology)",
            "doctor_clinic": "Apollo Clinic Rohini (+91 11 2790 1200)"
        }

    def update_senior(self, senior_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update senior profile fields populated by primary caregiver."""
        if not updates:
            return self.get_senior(senior_id)

        if self.is_connected():
            try:
                set_clauses = []
                params = []
                for k, v in updates.items():
                    set_clauses.append(f"{k} = %s")
                    params.append(v)
                params.append(senior_id)

                sql = f"UPDATE seniors SET {', '.join(set_clauses)}, updated_at = CURRENT_TIMESTAMP WHERE id = %s RETURNING *;"
                import psycopg2.extras
                with self._pg_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    cur.execute(sql, tuple(params))
                    row = cur.fetchone()
                    if row:
                        return dict(row)
            except Exception as e:
                logger.error("Error updating senior in PG: %s", e)

        # In-memory merge fallback
        base = self.get_senior(senior_id)
        base.update(updates)
        return base

    # =========================================================================
    # Senior Activities, Interests & Opinions
    # =========================================================================
    def get_senior_interests(self, senior_id: str = "SENIOR_RAMESH_001") -> List[Dict[str, Any]]:
        if self.is_connected():
            try:
                import psycopg2.extras
                with self._pg_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    cur.execute("""
                        SELECT id, topic, category, source, added_by, enthusiasm_level, notes, is_active
                        FROM senior_interests
                        WHERE senior_id = %s AND is_active = TRUE
                        ORDER BY created_at DESC;
                    """, (senior_id,))
                    return [dict(r) for r in cur.fetchall()]
            except Exception as e:
                logger.error("Error fetching senior interests from PG: %s", e)

        return [
            {
                "id": "topic-railway-mechanics",
                "topic": "Northern Railway Signaling Lore & WDM-2 Diesel Locos",
                "category": "RAILWAYS_CAREER",
                "source": "CAREGIVER_CURATED",
                "added_by": "Rohan Sharma (Son)",
                "enthusiasm_level": "VERY_HIGH",
                "notes": "Father loves discussing interlocking signals and locomotive lore.",
                "is_active": True
            },
            {
                "id": "topic-old-ghazals-rafi",
                "topic": "Mohammed Rafi, Talat Mahmood & Manna Dey Melodies",
                "category": "MUSIC_CULTURE",
                "source": "CAREGIVER_CURATED",
                "added_by": "Rohan Sharma (Son)",
                "enthusiasm_level": "HIGH",
                "notes": "Listens to morning old classics on transistor radio while sipping ginger tea.",
                "is_active": True
            },
            {
                "id": "topic-japanese-park-walks",
                "topic": "Morning Walks & Neem Tree Bench at Japanese Park",
                "category": "GARDENING_ROUTINE",
                "source": "AUTONOMOUSLY_DISCOVERED",
                "added_by": "Sambandh Cognitive Memory",
                "enthusiasm_level": "HIGH",
                "notes": "Ramesh enjoys meeting his walking peers near Sector 11 gate.",
                "is_active": True
            },
            {
                "id": "topic-rohini-balcony-tulsi",
                "topic": "Balcony Gardening: Shyama Tulsi & Winter Marigolds",
                "category": "GARDENING_ROUTINE",
                "source": "AUTONOMOUSLY_DISCOVERED",
                "added_by": "Sambandh Cognitive Memory",
                "enthusiasm_level": "MEDIUM",
                "notes": "Waters plants every morning at 07:45 AM before taking morning tea.",
                "is_active": True
            }
        ]

    def save_senior_interest(self, interest: Dict[str, Any]) -> Dict[str, Any]:
        senior_id = interest.get("senior_id", "SENIOR_RAMESH_001")
        int_id = interest.get("id") or f"topic-{int(datetime.now().timestamp() * 1000)}"
        if self.is_connected():
            try:
                with self._pg_conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO senior_interests (id, senior_id, topic, category, source, added_by, enthusiasm_level, notes, is_active)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (id) DO UPDATE SET
                            topic = EXCLUDED.topic,
                            category = EXCLUDED.category,
                            enthusiasm_level = EXCLUDED.enthusiasm_level,
                            notes = EXCLUDED.notes,
                            is_active = EXCLUDED.is_active;
                    """, (
                        int_id, senior_id, interest.get("topic"), interest.get("category", "GENERAL"),
                        interest.get("source", "AUTONOMOUSLY_DISCOVERED"), interest.get("added_by", "Caregiver"),
                        interest.get("enthusiasm_level", "HIGH"), interest.get("notes", ""), interest.get("is_active", True)
                    ))
            except Exception as e:
                logger.error("Error saving interest to PG: %s", e)

        return {**interest, "id": int_id, "senior_id": senior_id}

    def get_senior_opinions(self, senior_id: str = "SENIOR_RAMESH_001") -> List[Dict[str, Any]]:
        if self.is_connected():
            try:
                import psycopg2.extras
                with self._pg_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    cur.execute("""
                        SELECT id, headline, locality, agent_prompt, elder_context_hint, is_active
                        FROM senior_opinions
                        WHERE senior_id = %s AND is_active = TRUE
                        ORDER BY created_at DESC;
                    """, (senior_id,))
                    return [dict(r) for r in cur.fetchall()]
            except Exception as e:
                logger.error("Error fetching senior opinions from PG: %s", e)

        return [
            {
                "id": "opinion-japanese-park",
                "headline": "Rohini Japanese Park New Musical Fountain & Walking Track",
                "locality": "Rohini Sector 14, Delhi",
                "agent_prompt": "अंकल जी, रोहिणी जापानी पार्क में नया वॉकवे बन गया है। कुछ लोग कहते हैं कि पहले वाला कच्चा ट्रैक पैरों के लिए ज़्यादा आरामदायक था। आपका क्या तजुर्बा है इसपर?",
                "elder_context_hint": "Ramesh has taken morning walks in Japanese Park for 15+ years."
            },
            {
                "id": "opinion-vande-bharat",
                "headline": "Indian Railways Launching New Sleeper Vande Bharat Trains",
                "locality": "Northern Railway / Delhi Division",
                "agent_prompt": "अंकल जी, रेलवे अब नए वंदे भारत स्लीपर कोच ला रहा है। आप तो 40 साल रेलवे में सिग्नल और मैकेनिकल व्यवस्था संभालते रहे हैं—आपको क्या लगता है, पुरानी राजधानी की तुलना में ये कैसे रहेंगे?",
                "elder_context_hint": "Retired Chief Signal Inspector with deep technical pride in railway safety."
            },
            {
                "id": "opinion-metro-phase4",
                "headline": "Delhi Metro Phase 4 Rithala to Narela Line Expansion",
                "locality": "Rohini / Outer Delhi Corridor",
                "agent_prompt": "अंकल जी, रिठाला से आगे नरेला वाली मेट्रो लाइन का काम तेज़ हो रहा है। आपके समय में जब रोहिणी नई-नई बसी थी, तब तो बसें भी मुश्किल से मिलती थीं ना? कितना बदलाव आ गया है!",
                "elder_context_hint": "Witnessed Rohini transform from vacant plots to bustling urban hub since 1985."
            }
        ]

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
                        doc.get("doctor_name", "Dr. Arvind Saxena"), doc.get("document_date", datetime.now().strftime("%Y-%m-%d")),
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
            "caregiver_name": "Rohan Sharma",
            "caregiver_phone": "+91 98765 43210",
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
    # Youth Mentorship & Intergenerational Wisdom
    # =========================================================================
    def get_youth_questions(self, senior_id: str = "SENIOR_RAMESH_001") -> List[Dict[str, Any]]:
        if self.is_connected():
            try:
                import psycopg2.extras
                with self._pg_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    cur.execute("""
                        SELECT id, senior_id, youth_id, youth_name, youth_avatar, youth_bio,
                               question_text, category, domain_topic, status, safety_verdict,
                               safety_confidence, safety_category, safety_explanation,
                               curated_speech_hindi, elder_answer_text, elder_answer_audio_url,
                               submitted_at, reviewed_at, answered_at
                        FROM youth_mentorship_questions
                        WHERE senior_id = %s
                        ORDER BY submitted_at DESC;
                    """, (senior_id,))
                    rows = cur.fetchall()
                    return [dict(r) for r in rows]
            except Exception as e:
                logger.error("Error fetching youth questions: %s", e)
        return []

    def save_youth_question(self, q: Dict[str, Any]) -> Dict[str, Any]:
        if self.is_connected():
            try:
                with self._pg_conn.cursor() as cur:
                    cur.execute("""
                        INSERT INTO youth_mentorship_questions (
                            id, senior_id, youth_id, youth_name, youth_avatar, youth_bio,
                            question_text, category, domain_topic, status, safety_verdict,
                            safety_confidence, safety_category, safety_explanation,
                            curated_speech_hindi, elder_answer_text, elder_answer_audio_url,
                            submitted_at, reviewed_at, answered_at
                        )
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NOW(), %s, %s)
                        ON CONFLICT (id) DO UPDATE SET
                            status = EXCLUDED.status,
                            safety_verdict = EXCLUDED.safety_verdict,
                            safety_confidence = EXCLUDED.safety_confidence,
                            safety_category = EXCLUDED.safety_category,
                            safety_explanation = EXCLUDED.safety_explanation,
                            curated_speech_hindi = EXCLUDED.curated_speech_hindi,
                            elder_answer_text = EXCLUDED.elder_answer_text,
                            elder_answer_audio_url = EXCLUDED.elder_answer_audio_url,
                            reviewed_at = EXCLUDED.reviewed_at,
                            answered_at = EXCLUDED.answered_at;
                    """, (
                        q["id"], q.get("senior_id", "SENIOR_RAMESH_001"), q.get("youth_id", "youth-aarav"),
                        q.get("youth_name", "Aarav Mehta"), q.get("youth_avatar", "👨‍🎓"),
                        q.get("youth_bio", "4th Year B.Tech Electrical Engineering, DTU Delhi"),
                        q["question_text"], q.get("category", "GENUINE"), q.get("domain_topic", "Railway Engineering"),
                        q.get("status", "PENDING_REVIEW"), q.get("safety_verdict"),
                        q.get("safety_confidence", 0.98), q.get("safety_category"),
                        q.get("safety_explanation"), q.get("curated_speech_hindi"),
                        q.get("elder_answer_text"), q.get("elder_answer_audio_url"),
                        q.get("reviewed_at"), q.get("answered_at")
                    ))
                return {"status": "SUCCESS", "id": q["id"]}
            except Exception as e:
                logger.error("Error saving youth question: %s", e)
                return {"status": "ERROR", "message": str(e)}
        return {"status": "SUCCESS", "id": q["id"]}

    def record_elder_answer(self, question_id: str, answer_text: str, audio_url: Optional[str] = None) -> Dict[str, Any]:
        if self.is_connected():
            try:
                with self._pg_conn.cursor() as cur:
                    cur.execute("""
                        UPDATE youth_mentorship_questions
                        SET status = 'ANSWERED',
                            elder_answer_text = %s,
                            elder_answer_audio_url = %s,
                            answered_at = NOW()
                        WHERE id = %s;
                    """, (answer_text, audio_url, question_id))
                return {"status": "SUCCESS", "id": question_id}
            except Exception as e:
                logger.error("Error recording answer: %s", e)
                return {"status": "ERROR", "message": str(e)}
        return {"status": "SUCCESS", "id": question_id}

# Singleton export
db = HealthLockerDB()
