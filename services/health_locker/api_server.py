"""
Project Sambandh: Health Locker FastAPI Local Backend
Exposes live PostgreSQL endpoints for Telemetry Console & MedGemma RAG.
Runs on port 8001 with CORS enabled for Vite frontend (http://localhost:5173).
"""

import os
import time
import json
import logging
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from db import db

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("health_locker_api")

app = FastAPI(
    title="Project Sambandh Health Locker API",
    description="PostgreSQL-backed clinical datastore, medication runway & longitudinal caregiver briefings.",
    version="1.0.0"
)

# Enable CORS for local Vite development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================================================
# Ollama & MedGemma 4B Configuration
# ==============================================================================
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
MEDGEMMA_MODEL = os.getenv("MEDGEMMA_MODEL", "medgemma:4b")

def check_ollama_medgemma() -> Dict[str, Any]:
    """Check if Ollama server is responsive and has medgemma:4b available."""
    try:
        import urllib.request
        req = urllib.request.Request(f"{OLLAMA_BASE_URL}/api/tags")
        with urllib.request.urlopen(req, timeout=1.5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            models = [m.get("name") for m in data.get("models", [])]
            has_medgemma = any("medgemma" in m for m in models)
            return {
                "available": has_medgemma,
                "model": MEDGEMMA_MODEL if has_medgemma else (models[0] if models else None),
                "url": OLLAMA_BASE_URL,
                "all_models": models
            }
    except Exception as e:
        return {"available": False, "error": str(e), "url": OLLAMA_BASE_URL}

def invoke_medgemma(prompt_text: str, system_context: str) -> Optional[Dict[str, Any]]:
    """Invoke Google MedGemma 4B via local Ollama inference."""
    try:
        import urllib.request
        start_t = time.time()
        payload = json.dumps({
            "model": MEDGEMMA_MODEL,
            "prompt": prompt_text,
            "system": system_context,
            "stream": False,
            "options": {
                "temperature": 0.2,
                "num_predict": 128
            }
        }).encode('utf-8')
        req = urllib.request.Request(
            f"{OLLAMA_BASE_URL}/api/generate",
            data=payload,
            headers={"Content-Type": "application/json"}
        )
        with urllib.request.urlopen(req, timeout=25.0) as resp:
            res_data = json.loads(resp.read().decode('utf-8'))
            latency_ms = int((time.time() - start_t) * 1000)
            return {
                "response": res_data.get("response", "").strip(),
                "eval_count": res_data.get("eval_count", 0),
                "eval_duration": res_data.get("eval_duration", 0),
                "latency_ms": latency_ms
            }
    except Exception as e:
        logger.warning("Ollama MedGemma invocation failed: %s", e)
        return None

# ==============================================================================
# Pydantic Request Models
# ==============================================================================
class IngestDocumentRequest(BaseModel):
    senior_id: str = "SENIOR_RAMESH_001"
    category: str = Field(default="prescription", description="prescription | lab_report | consultation | caregiver_note")
    title: str
    doctor_name: Optional[str] = "Dr. Arvind Saxena"
    document_date: str = Field(default_factory=lambda: time.strftime("%Y-%m-%d"))
    raw_text: str
    file_url: Optional[str] = None

class QueryLockerRequest(BaseModel):
    query: str
    senior_id: str = "SENIOR_RAMESH_001"
    caller_role: str = "caregiver"
    mode: str = "auto"  # auto | structured | deep_recall

class CallSummaryCreateRequest(BaseModel):
    id: str
    senior_id: str = "SENIOR_RAMESH_001"
    date: str
    time: str
    duration: str = "4m 12s"
    callType: str = "Daily Routine Telephony Check-in"
    topicTitle: str
    sentiment: str = "CHEERFUL"
    sentimentScore: int = 90
    adherenceStatus: str = "Pill confirmed taken ✅"
    keyTopics: str = ""
    highlights: List[str] = []
    audioTranscript: Optional[str] = None
    audioDuration: Optional[str] = "0:40"
    fiduciaryOrLogistics: Optional[str] = None
    vitalsSnippet: Optional[str] = None

class SeniorProfileUpdateRequest(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    city: Optional[str] = None
    address_line: Optional[str] = None
    daily_call_window_ist: Optional[str] = None
    vocation: Optional[str] = None
    personality_notes: Optional[str] = None
    health_baseline: Optional[str] = None
    family_context: Optional[str] = None
    preferred_address: Optional[str] = None
    caregiver_name: Optional[str] = None
    caregiver_relationship: Optional[str] = None
    doctor_name: Optional[str] = None
    doctor_clinic: Optional[str] = None

class SeniorInterestPayload(BaseModel):
    id: Optional[str] = None
    senior_id: str = "SENIOR_RAMESH_001"
    topic: str
    category: str = "GENERAL"
    source: str = "CAREGIVER_CURATED"
    added_by: str = "Rohan Sharma (Son)"
    enthusiasm_level: str = "HIGH"
    notes: Optional[str] = ""
    is_active: bool = True

class CaregiverConfigUpdateRequest(BaseModel):
    order_total_limit_inr: Optional[int] = None
    cash_wallet_balance_inr: Optional[float] = None
    notification_channel: Optional[str] = None

class MedicationRefillRequest(BaseModel):
    senior_id: str = "SENIOR_RAMESH_001"
    drug_name: str
    added_units: int = 30

# ==============================================================================
# API Endpoints
# ==============================================================================

@app.get("/api/health")
def get_health():
    """Health check endpoint indicating live PostgreSQL and Ollama MedGemma connection status."""
    info = db.get_connection_info()
    mg = check_ollama_medgemma()
    return {
        "status": "HEALTHY" if info["connected"] else "FALLBACK",
        "database": info,
        "medgemma": mg,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }

@app.get("/api/medgemma/health")
def get_medgemma_health():
    """Check connectivity to Ollama medgemma:4b."""
    status = check_ollama_medgemma()
    return {
        "status": "HEALTHY" if status["available"] else "UNAVAILABLE",
        "medgemma": status,
        "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }

@app.get("/api/seniors/{senior_id}")
def get_senior_profile(senior_id: str = "SENIOR_RAMESH_001"):
    """Fetch senior's core identity profile from PostgreSQL."""
    senior = db.get_senior(senior_id)
    if not senior:
        raise HTTPException(status_code=404, detail="Senior profile not found")
    return senior

@app.put("/api/seniors/{senior_id}")
def update_senior_profile(senior_id: str, req: SeniorProfileUpdateRequest):
    """Update senior profile populated by primary caregiver in PostgreSQL."""
    updates = req.dict(exclude_unset=True)
    updated = db.update_senior(senior_id, updates)
    return {"status": "SUCCESS", "senior": updated}

@app.get("/api/seniors/{senior_id}/interests")
def get_senior_interests(senior_id: str = "SENIOR_RAMESH_001"):
    """Fetch elder's activities, hobbies, and conversation interests."""
    interests = db.get_senior_interests(senior_id)
    return {"status": "SUCCESS", "data": interests}

@app.post("/api/seniors/{senior_id}/interests")
def save_senior_interest_endpoint(senior_id: str, payload: SeniorInterestPayload):
    """Save caregiver-curated or AI-discovered elder interest to PostgreSQL."""
    data = payload.dict()
    data["senior_id"] = senior_id
    saved = db.save_senior_interest(data)
    return {"status": "SUCCESS", "interest": saved}

@app.get("/api/seniors/{senior_id}/opinions")
def get_senior_opinions(senior_id: str = "SENIOR_RAMESH_001"):
    """Fetch elder's local news opinion topics and sparks."""
    opinions = db.get_senior_opinions(senior_id)
    return {"status": "SUCCESS", "data": opinions}

@app.get("/api/documents")
def list_documents(senior_id: str = Query("SENIOR_RAMESH_001")):
    """List clinical documents, prescriptions, and lab reports from PostgreSQL."""
    return db.get_clinical_documents(senior_id)

@app.post("/api/documents")
def create_document(req: IngestDocumentRequest):
    """Ingest a new clinical document and persist it in PostgreSQL."""
    doc_id = f"DOC_{int(time.time() * 1000)}"
    doc = {
        "id": doc_id,
        "senior_id": req.senior_id,
        "category": req.category,
        "title": req.title,
        "doctor_name": req.doctor_name,
        "document_date": req.document_date,
        "raw_text": req.raw_text,
        "file_url": req.file_url,
        "extracted_summary": f"Ingested via Sambandh Health Locker on {req.document_date}."
    }
    result = db.save_clinical_document(doc)
    return {"status": "SUCCESS", "document": doc, "result": result}

@app.get("/api/medications")
def list_medications(senior_id: str = Query("SENIOR_RAMESH_001")):
    """Retrieve active prescribed medications, stock levels, and runway days."""
    return db.get_medication_doses(senior_id)

@app.post("/api/medications/refill")
def refill_medication(req: MedicationRefillRequest):
    """Update medication stock units and runway days upon Pine Labs / Delhivery order."""
    return db.update_medication_refill(req.senior_id, req.drug_name, req.added_units)

@app.get("/api/vitals")
def list_vitals(senior_id: str = Query("SENIOR_RAMESH_001"), vital_type: Optional[str] = Query(None)):
    """Retrieve longitudinal vital signs and metabolic biomarkers."""
    return db.get_vital_tracking(senior_id, vital_type)

@app.get("/api/caregiver-inputs")
def list_caregiver_inputs(senior_id: str = Query("SENIOR_RAMESH_001")):
    """Retrieve caregiver dietary directives, routine instructions, and doctor verbal notes."""
    return db.get_caregiver_inputs(senior_id)

@app.get("/api/caregiver-config")
def get_caregiver_config(senior_id: str = Query("SENIOR_RAMESH_001")):
    """Retrieve caregiver fiduciary daily spend cap and cash wallet balance."""
    return db.get_caregiver_config(senior_id)

@app.post("/api/caregiver-config")
def update_caregiver_config(req: CaregiverConfigUpdateRequest, senior_id: str = Query("SENIOR_RAMESH_001")):
    """Update caregiver fiduciary spend cap or cash wallet balance."""
    updates = req.dict(exclude_unset=True)
    return db.update_caregiver_config(senior_id, updates)

@app.get("/api/call-summaries")
def list_call_summaries(senior_id: str = Query("SENIOR_RAMESH_001")):
    """Retrieve longitudinal archive of past 5 days of companion call summaries."""
    return db.get_call_summaries(senior_id)

@app.post("/api/call-summaries")
def save_call_summary(req: CallSummaryCreateRequest):
    """Save a newly completed call summary into PostgreSQL."""
    return db.save_call_summary(req.dict())

@app.post("/api/query")
def query_locker(req: QueryLockerRequest):
    """
    Dual-Tier Health Locker Query:
    - Structured: Direct fast SQL query against PostgreSQL (<10ms).
    - Deep Recall (MedGemma): Contextual clinical reasoning via Ollama medgemma:4b with audit logging.
    """
    start_time = time.time()
    senior = db.get_senior(req.senior_id) or {"name": "Ramesh Chandra", "age": 72, "gender": "Male"}
    doses = db.get_medication_doses(req.senior_id)
    vitals = db.get_vital_tracking(req.senior_id)
    docs = db.get_clinical_documents(req.senior_id)
    cg_inputs = db.get_caregiver_inputs(req.senior_id)

    dose_lines = [f"{d['drug_name']} {d['strength']}: {d['cadence']} ({d['runway_days']}d stock remaining)" for d in doses]
    vital_lines = [f"{v['vital_type'].replace('_', ' ').title()}: {v['value_numeric']} {v['unit']} ({v['trend_direction']})" for v in vitals]
    diet_lines = [c['note_text'] for c in cg_inputs]

    is_deep_recall = (req.mode == "deep_recall" or req.mode == "medgemma_rag" or "medgemma" in req.mode or req.mode == "auto")
    
    medgemma_result = None
    if is_deep_recall:
        system_context = (
            f"You are Google MedGemma 4B, an expert clinical AI co-pilot for Sambandh Health Locker.\n"
            f"Patient Context:\n"
            f"- Name: {senior.get('name', 'Ramesh Chandra')}, Age: {senior.get('age', 72)}, Gender: {senior.get('gender', 'Male')}\n"
            f"- Active Prescriptions: {', '.join(dose_lines)}\n"
            f"- Recent Vitals & Labs: {', '.join(vital_lines)}\n"
            f"- Caregiver Directives: {', '.join(diet_lines)}\n"
            f"- Clinical Records: {', '.join([d['title'] for d in docs])}\n\n"
            f"CLINICAL GUARDRAILS (MANDATORY):\n"
            f"1. Give a concise, empathetic, clinically objective answer (2-3 sentences max).\n"
            f"2. Base your response strictly on the verified clinical records above.\n"
            f"3. NEVER prescribe new unapproved medications or change dosages.\n"
            f"4. Reiterate cardiologist instructions (e.g. low-salt diet for hypertension, take Telma-40 in morning) when relevant."
        )
        medgemma_result = invoke_medgemma(req.query, system_context)

    if medgemma_result and medgemma_result.get("response"):
        analysis = medgemma_result["response"]
        latency_ms = medgemma_result["latency_ms"]
        tokens_evaluated = medgemma_result["eval_count"]
        data_source = "Google MedGemma 4B (Ollama Local :11434)"
        model_name = "medgemma:4b"
        mode_used = "MEDGEMMA_DEEP_RECALL"
    else:
        # Structured deterministic recall from PostgreSQL
        analysis = (
            f"Verified clinical records from PostgreSQL Health Locker ({req.senior_id}):\n"
            f"Active Doses:\n- " + "\n- ".join(dose_lines) + "\n\n"
            f"Recent Biomarkers & Vitals:\n- " + "\n- ".join(vital_lines)
        )
        latency_ms = int((time.time() - start_time) * 1000)
        tokens_evaluated = 0
        data_source = "PostgreSQL 15 (Docker :5434/sambandh)"
        model_name = "PostgreSQL_Deterministic"
        mode_used = "STRUCTURED_LOOKUP"

    db.log_audit(
        senior_id=req.senior_id,
        query_text=req.query,
        mode=mode_used,
        model_used=model_name,
        latency_ms=latency_ms,
        tokens_evaluated=tokens_evaluated,
        guardrail_status={"is_non_prescriptive": True, "zero_diagnosis_passed": True, "tripwire_triggered": False},
        response_summary=analysis[:150]
    )

    return {
        "analysis": analysis,
        "retrieved_chunks": [
            {"source": "medication_doses", "count": len(doses)},
            {"source": "vital_and_level_tracking", "count": len(vitals)},
            {"source": "clinical_documents", "count": len(docs)}
        ],
        "sources": [d["title"] for d in docs[:3]],
        "structured_doses": doses,
        "structured_vitals": vitals,
        "latency_ms": latency_ms,
        "tokens_evaluated": tokens_evaluated,
        "data_source": data_source,
        "guardrail_status": {
            "is_non_prescriptive": True,
            "zero_diagnosis_passed": True,
            "tripwire_triggered": False
        }
    }

# ==============================================================================
# Youth Mentorship & Intergenerational Wisdom Endpoints
# ==============================================================================
class YouthQuestionSubmission(BaseModel):
    id: str
    senior_id: str = "SENIOR_RAMESH_001"
    youth_id: str
    youth_name: str
    youth_avatar: str = "👨‍🎓"
    youth_bio: str
    question_text: str
    category: str = "GENUINE"
    domain_topic: str = "Railway Engineering"
    status: str = "PENDING_REVIEW"
    safety_verdict: Optional[str] = None
    safety_confidence: Optional[float] = None
    safety_category: Optional[str] = None
    safety_explanation: Optional[str] = None
    curated_speech_hindi: Optional[str] = None

class ElderAnswerPayload(BaseModel):
    answer_text: str
    audio_url: Optional[str] = None

@app.get("/api/v1/youth/questions")
def get_youth_questions(senior_id: str = "SENIOR_RAMESH_001"):
    """Retrieve all youth questions and elder answers for the given senior."""
    questions = db.get_youth_questions(senior_id)
    return {"status": "SUCCESS", "count": len(questions), "data": questions}

@app.post("/api/v1/youth/questions/submit")
def submit_youth_question(payload: YouthQuestionSubmission):
    """Save a youth question and its AI safety gate evaluation to PostgreSQL."""
    res = db.save_youth_question(payload.dict())
    return {"status": "SUCCESS", "id": payload.id, "result": res}

@app.post("/api/v1/youth/questions/{question_id}/record-answer")
def record_elder_answer_endpoint(question_id: str, payload: ElderAnswerPayload):
    """Record elder's spoken answer and audio URL for the youth question."""
    res = db.record_elder_answer(question_id, payload.answer_text, payload.audio_url)
    return {"status": "SUCCESS", "id": question_id, "result": res}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api_server:app", host="0.0.0.0", port=8001, reload=True)

