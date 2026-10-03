# Project Sambandh: Health Locker & MedGemma RAG Service 🌿

Autonomous clinical document intelligence, entity extraction, and non-prescriptive RAG service for Project Sambandh eldercare.

---

## Architecture Overview

```
Raw Clinical Slips / Lab PDFs / Doctor Audio
                    │
                    ▼ (1st-Time Ingestion)
     ┌──────────────────────────────┐
     │  MedGemma 4B-IT (GPU / Local)│
     └──────────────┬───────────────┘
                    │
                    ├─────────────────────────────────────────────────┐
                    ▼ (Structured Entity Extraction)                  ▼ (Embeddings)
     ┌──────────────────────────────┐                  ┌──────────────────────────────┐
     │ PostgreSQL / Supabase Tables │                  │ Pinecone / Vector Store      │
     │ • medication_doses           │                  │ • BAAI/bge-small-en-v1.5     │
     │ • vital_and_level_tracking   │                  │ • Top-3 Semantic Chunks      │
     │ • clinical_documents         │                  └──────────────┬───────────────┘
     │ • caregiver_inputs           │                                 │
     └──────────────┬───────────────┘                                 │
                    │                                                 │
                    │ (Default Instant Read: <10ms)                   │ (On-Demand Deep Recall)
                    ▼                                                 ▼
     ┌────────────────────────────────────────────────────────────────────────┐
     │                     Caregiver & Elder UI Consoles                      │
     │               (Zero-Diagnosis & Fiduciary Guardrails)                  │
     └────────────────────────────────────────────────────────────────────────┘
```

---

## Local Testing Guide

### 1. Database Setup (Local PostgreSQL -> Supabase Ready)
To run with local PostgreSQL:
```bash
# Connect to PostgreSQL and execute the schema:
psql -U postgres -d postgres -f schema.sql
```
Set the environment variable in `.env`:
```bash
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sambandh_health_locker
```
To shift to Supabase later, simply provide:
```bash
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_KEY=<your-service-or-anon-key>
```
*Note: If no database URL is set, the service automatically falls back to the in-memory clinical database.*

### 2. Local MedGemma Integration
To connect your local MedGemma deployment:
```bash
export LOCAL_MEDGEMMA_URL=http://localhost:8000
export USE_LOCAL_MEDGEMMA=1
```
The client forwards extraction and generation requests to your local MedGemma endpoint.

### 3. Ingesting Clinical Bundles
Run the dry-run CLI to verify parsing and chunking:
```bash
python services/health_locker/ingest.py --dry-run
```
To upsert into Pinecone with active keys:
```bash
export PINECONE_API_KEY=your_key
python services/health_locker/ingest.py
```

### 4. Deploying to Modal
```bash
modal deploy services/health_locker/modal_app.py
```
This deploys the `sambandh-health-locker` app and outputs your web endpoint URL, which you can paste into `telemetry-console/.env` as `VITE_MODAL_HEALTH_LOCKER_URL`.
