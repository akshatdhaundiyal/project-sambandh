#!/usr/bin/env python3
"""
Project Sambandh — Agent Simulation Runner (Round 3 Wizard of Oz)
================================================================
Demonstrates L3 Autonomous Decision-Making:
1. Clock tick triggers scheduled telephony check-in.
2. Lane 1: Reciprocal intergenerational mentorship prompt.
3. Lane 2: Conversational adherence ground-truthing.
4. Autonomous evaluation of medication runway and pre-authorized spend cap.
5. Deterministic payment (Pine Labs) & courier dispatch (Delhivery) tool calls.
6. Live dispatch of WhatsApp Reassurance Card to adult child.
"""

import os
import sys
import time
import json
from pathlib import Path
from typing import Dict, Any
from dotenv import load_dotenv

# Ensure UTF-8 output on Windows terminals
if sys.platform == "win32":
    try:
        if sys.stdout.encoding.lower() != "utf-8":
            sys.stdout.reconfigure(encoding="utf-8")
        if sys.stderr.encoding.lower() != "utf-8":
            sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

# Load environment variables
load_dotenv()

# Base project path
PROJECT_ROOT = Path(__file__).resolve().parent
DATA_DIR = PROJECT_ROOT / "data"

# Helper to load JSON datasets
def load_json_file(filename: str) -> Dict[str, Any]:
    file_path = DATA_DIR / filename
    if file_path.exists():
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"  [Notice] Could not parse {filename}: {e}")
    return {}

MOCK_RESPONSES = load_json_file("mock_external_responses.json")
SENIOR_PROFILE = load_json_file("senior_profile.json")
PRESCRIPTION_BUNDLE = load_json_file("prescription_bundle.json")

# Check for Google GenAI SDK
try:
    from google import genai
    from google.genai import types
except ImportError:
    print("\n[!] Error: 'google-genai' package is required.")
    print("    Run: uv sync\n")
    sys.exit(1)

# Third-party HTTP requests (Twilio / Meta API)
import requests


# ============================================================================
# 01. TOOL DEFINITIONS (Deterministic Rails + External Acts)
# ============================================================================

def gnani_telephony_dial(phone_number: str, caller_id: str, prompt_audio_id: str) -> Dict[str, Any]:
    """Initiates an outbound SIP telephony call to the senior's phone line."""
    print(f"\n  [Gnani Voice Rail] 📞 Dialing {phone_number} via SIP Trunk...")
    time.sleep(0.5)
    mock = MOCK_RESPONSES.get("gnani_telephony_dial", {})
    return {
        "call_sid": mock.get("call_sid", "GN_CALL_9081234891"),
        "status": mock.get("status", "CONNECTED"),
        "voiceprint_match": mock.get("voiceprint_match", True),
        "confidence": mock.get("confidence", 0.96),
        "caller_id": caller_id
    }

def check_inventory_runway(last_delivery_timestamp: str, units_prescribed: int, daily_cadence: int) -> Dict[str, Any]:
    """Calculates active medication supply runway based on last courier drop."""
    print(f"\n  [Adherence Rail] 🧮 Calculating inventory depletion from drop at {last_delivery_timestamp}...")
    time.sleep(0.5)
    mock = MOCK_RESPONSES.get("inventory_runway_assessment", {})
    return {
        "days_remaining": mock.get("days_remaining", 6),
        "runway_percentage": mock.get("runway_percentage", 0.20),
        "refill_sku": mock.get("refill_sku", "TELMI_40_30TAB"),
        "cost_inr": mock.get("cost_inr", 640.00),
        "pre_authorized_cap_inr": mock.get("pre_authorized_cap_inr", 4500.00),
        "threshold_breached": mock.get("threshold_breached", True)
    }

def execute_pine_labs_debit(mandate_id: str, amount_inr: float, merchant_order_id: str) -> Dict[str, Any]:
    """Executes an auto-debit charge under an active UPI Autopay / e-NACH mandate."""
    print(f"\n  [Pine Labs Plural] ⚡ Debiting ₹{amount_inr} under mandate {mandate_id} (Ref: {merchant_order_id})...")
    time.sleep(0.5)
    mock = MOCK_RESPONSES.get("pine_labs_plural_debit", {})
    return {
        "plural_transaction_id": mock.get("plural_transaction_id", "PL_TXN_88192301"),
        "order_reference": merchant_order_id,
        "mandate_id": mandate_id,
        "status": mock.get("status", "CAPTURED"),
        "amount": amount_inr,
        "remaining_monthly_cap_inr": mock.get("remaining_monthly_cap_inr", 4500.00 - amount_inr)
    }

def schedule_delhivery_dispatch(patient_address: str, pin_code: str, sku_list: str) -> Dict[str, Any]:
    """Books a 48-hour courier dispatch from partner dark store to patient address."""
    print(f"\n  [Delhivery Logistics] 📦 Booking doorstep replenishment to {pin_code}...")
    time.sleep(0.5)
    mock = MOCK_RESPONSES.get("delhivery_logistics_dispatch", {})
    return {
        "status": mock.get("status", "Success"),
        "waybill": mock.get("waybill", "988120391203"),
        "sort_code": mock.get("sort_code", "LKO/ALGN"),
        "pickup_location": mock.get("pickup_location", "Netmeds_DarkStore_Lucknow_East"),
        "estimated_delivery_date": mock.get("estimated_delivery_date", "Tomorrow by 04:00 PM")
    }

def send_whatsapp_caregiver_brief(child_phone: str, brief_payload: str) -> Dict[str, Any]:
    """Sends the daily post-interaction reassurance brief to the caregiver's WhatsApp."""
    print(f"\n  [Caregiver Rail] 💬 Dispatching WhatsApp card to {child_phone}...")
    
    twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
    twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
    from_whatsapp = os.getenv("TWILIO_WHATSAPP_NUMBER", "whatsapp:+14155238886")
    to_whatsapp = os.getenv("CAREGIVER_WHATSAPP_NUMBER", child_phone)

    if twilio_sid and twilio_token and not twilio_sid.startswith("your_"):
        try:
            url = f"https://api.twilio.com/2010-04-01/Accounts/{twilio_sid}/Messages.json"
            resp = requests.post(
                url,
                data={
                    "From": from_whatsapp,
                    "To": to_whatsapp,
                    "Body": brief_payload
                },
                auth=(twilio_sid, twilio_token)
            )
            result = resp.json()
            return {"status": "DELIVERED", "sid": result.get("sid")}
        except Exception as exc:
            return {"status": "FAILED_NETWORK", "error": str(exc)}
    else:
        # Fallback: Print formatted card to console
        print("\n" + "="*56)
        print("  📱 SIMULATED WHATSAPP MESSAGE RECEIVED ON PHONE")
        print("="*56)
        print(brief_payload)
        print("="*56 + "\n")
        return {"status": "DELIVERED_CONSOLE_MOCK", "note": "Twilio keys not set; displayed locally."}


# ============================================================================
# 02. SYSTEM PROMPT (The Mind of Sambandh)
# ============================================================================

SAMBANDH_SYSTEM_PROMPT = """
You are Sambandh, an L3 autonomous care agent operating in India.
Your mission is to manage chronic health adherence while nurturing the family bond—ensuring an aging parent feels valued and cared for, while an adult child feels informed and at peace.

CORE OPERATIONAL BOUNDARIES (L3 AUTONOMY):
1. You operate autonomously INSIDE pre-set limits established by the adult child and physician.
2. The most consequential thing you do autonomously: Trigger prescription refills and auto-debit payments via Pine Labs and Delhivery when inventory runway is <= 20% AND cost <= child's monthly spending limit (₹4,500).
3. You NEVER diagnose, alter pharmaceutical salts, titrate dosages, or interpret ambiguous clinical symptoms. If an elder reports severe distress or disorientation, comfort them and route an immediate exception card to the adult child.
4. You converse across two distinct lanes during scheduled morning calls:
   - LANE 1 (Wisdom & Social Utility): Engage the senior with a curated question from an aspiring young mentee suited to the elder's background. Let them feel purposeful.
   - LANE 2 (Adherence & Verification): Warmly bridge context to check oral intake of active medications. Map informal vernacular descriptions ("pink BP tablet", "sugar half-tablet") to ABDM prescriptions.
5. If inventory runway falls <= 20%:
   - Verify cost against pre_authorized_monthly_cap.
   - If cost <= cap: Call execute_pine_labs_debit and schedule_delhivery_dispatch autonomously.
   - If cost > cap: Trigger route_whatsapp_exception to child for 1-tap UPI step-up authorization.
6. Following every interaction, generate an empathetic post-interaction summary card for the child's WhatsApp detailing participants, tone/mood, adherence confirmation, and inventory runway.

AVAILABLE TOOLS:
- gnani_telephony_dial
- check_inventory_runway
- execute_pine_labs_debit
- schedule_delhivery_dispatch
- send_whatsapp_caregiver_brief

Always provide your step-by-step internal reasoning:
Thought -> Decision -> Action/Tool Call.
"""


# ============================================================================
# 03. SIMULATION WORKFLOW RUNNER
# ============================================================================

def run_mock_dry_run():
    """Runs a simulated offline trajectory showing the exact L3 execution steps."""
    print("\n  [INFO] Running in Deterministic Offline Simulation Mode...")
    print("  (To run live with Gemini 1.5 Pro, add your GEMINI_API_KEY to .env)\n")

    time.sleep(0.4)
    print("\n" + "-"*65)
    print(">> STEP 1: SYSTEM CLOCK TICK (08:30:00 AM IST)")
    print("-"*65)
    print("Input Event:\n[CLOCK TICK: 2026-10-12 08:30:00 IST] - Target Senior: Ramesh Chandra (+919415012345). Initiate scheduled daily interaction.\n")
    print("Sambandh Reasoning: 08:30 AM calibrated window reached. Initiating outbound SIP voice check-in.")
    gnani_telephony_dial("+919415012345", "SAMBANDH_VOICE_RAIL", "PROMPT_AARAV_PUNE_1982")

    time.sleep(0.6)
    print("\n" + "-"*65)
    print(">> STEP 2: ELDER ANSWERS CALL & LANE 1 WISDOM EXCHANGE")
    print("-"*65)
    transcript_lane1 = (
        "[GNANI VOICE STT TRANSCRIPT]: 'Pranam beta! Ha hum theek hain, pohe ka nashta kar rahe the. "
        "Aarav ke sawal par: 1982 me railway workshop me humne hamesha senior technicians ke hunar ki respect ki, "
        "kabhi afsari nahi dikhayi. Unke sath baith kar chai piyo aur unka vishwas jeeto.' "
        "Now ask him naturally about his morning tablets."
    )
    print(f"Input Event:\n{transcript_lane1}\n")
    print("Sambandh Reasoning: Ramesh Chandra engaged spiritedly on Lane 1 mentorship. Vitality is high. Contextually transitioning to Lane 2 oral adherence verification.")
    print("Agent Utterance: 'Uncle, that is wonderful guidance for Aarav! By the way, while having your morning tea, did you take your pink BP tablet and the sugar half-tablet after breakfast?'")

    time.sleep(0.6)
    print("\n" + "-"*65)
    print(">> STEP 3: LANE 2 MEDICATION CONFIRMATION & AUTONOMOUS REFILL TRIGGER")
    print("-"*65)
    transcript_lane2 = (
        "[GNANI VOICE STT TRANSCRIPT]: 'Haan beta, nashte ke turant baad laal wali BP ki goli "
        "Telmisartan aur diabetes ki aadhi goli le li thi. Ab sab regular hai.'"
    )
    print(f"Input Event:\n{transcript_lane2}\n")
    print("Sambandh Reasoning: Verbal confirmation received. Mapping 'laal wali BP ki goli' to ABDM FHIR Prescription: Telmisartan 40mg (TELMI_40_30TAB). Evaluating active inventory runway.")
    
    runway = check_inventory_runway("2026-09-12T16:30:00+05:30", 30, 1)
    if runway.get("threshold_breached") and runway.get("cost_inr", 0) <= runway.get("pre_authorized_cap_inr", 4500.0):
        print("Sambandh Fiduciary Decision: Runway <= 20% (6 days remaining) and cost Rs.640 <= monthly cap Rs.4500. Executing autonomous payment and dispatch.")
        execute_pine_labs_debit("PINE_MANDATE_UP_882910", 640.0, "SAMBANDH_REFILL_20261012_01")
        schedule_delhivery_dispatch("B-42, Sector C, Aliganj, Lucknow", "226024", "TELMI_40_30TAB")
    
    # Caregiver Reassurance Card
    brief_body = (
        "Daily Care Briefing: Papa's Morning Call (08:35 AM)\n"
        "========================================================\n"
        "Participants: Papa & Sambandh Voice Agent\n"
        "Mentorship Topic: Aarav (Pune) asked about earning respect from older technicians. Papa shared a spirited 4-minute railway story on working alongside senior technicians.\n"
        "Medication Adherence: Confirmed taken after breakfast (Telmisartan 40mg + Metformin half-tablet).\n"
        "Autonomous Refill: 6 days remaining (20% runway). Fresh Telmisartan pack dispatched via Delhivery (Rs.640 debited under pre-set Rs.4,500 limit). Est. arrival: Tomorrow 4 PM.\n\n"
        "Everything is calm and on schedule."
    )
    send_whatsapp_caregiver_brief("whatsapp:+919876543210", brief_body)


def run_simulation():
    print("\n" + "="*65)
    print("  PROJECT SAMBANDH -- WIZARD OF OZ AUTONOMOUS AGENT SIMULATION")
    print("="*65)
    print("  Target Senior: Ramesh Chandra (Lucknow, UP)")
    print("  Target Caregiver: Priya Sharma (Bengaluru, KA)")
    print("  Autonomy Level: Level 3 (Bounded Autonomous Fiduciary & Operational)")
    print("="*65 + "\n")

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key.startswith("your_"):
        run_mock_dry_run()
        print("\n" + "="*65)
        print("  SIMULATION COMPLETE: All rails executed within L3 boundaries.")
        print("  Tip: Add your GEMINI_API_KEY to .env to run with live Gemini 1.5 Pro!")
        print("="*65 + "\n")
        return

    print("  [Live Mode] Initializing Gemini 1.5 Pro Client with Tool Calling...")
    client = genai.Client(api_key=api_key)

    tools_list = [
        gnani_telephony_dial,
        check_inventory_runway,
        execute_pine_labs_debit,
        schedule_delhivery_dispatch,
        send_whatsapp_caregiver_brief
    ]

    # Initialize chat session
    chat = client.chats.create(
        model="gemini-1.5-pro",
        config=types.GenerateContentConfig(
            system_instruction=SAMBANDH_SYSTEM_PROMPT,
            tools=tools_list,
            temperature=0.2
        )
    )

    timeline_steps = [
        {
            "step": 1,
            "title": "SYSTEM CLOCK TICK (08:30:00 AM IST)",
            "input": "[CLOCK TICK: 2026-10-12 08:30:00 IST] - Target Senior: Ramesh Chandra (+919415012345). Initiate scheduled daily interaction."
        },
        {
            "step": 2,
            "title": "ELDER ANSWERS CALL & LANE 1 WISDOM EXCHANGE",
            "input": (
                "[GNANI VOICE STT TRANSCRIPT]: 'Pranam beta! Ha hum theek hain, pohe ka nashta kar rahe the. "
                "Aarav ke sawal par: 1982 me railway workshop me humne hamesha senior technicians ke hunar ki respect ki, "
                "kabhi afsari nahi dikhayi. Unke sath baith kar chai piyo aur unka vishwas jeeto.' "
                "Now ask him naturally about his morning tablets."
            )
        },
        {
            "step": 3,
            "title": "LANE 2 MEDICATION CONFIRMATION (GROUND TRUTHING)",
            "input": (
                "[GNANI VOICE STT TRANSCRIPT]: 'Haan beta, nashte ke turant baad laal wali BP ki goli "
                "Telmisartan aur diabetes ki aadhi goli le li thi. Ab sab regular hai.'"
            )
        }
    ]

    for item in timeline_steps:
        print(f"\n{'-'*65}")
        print(f">> STEP {item['step']}: {item['title']}")
        print(f"{'-'*65}")
        print(f"Input Event:\n{item['input']}\n")

        print("Sambandh Agent Thinking & Executing...")
        response = chat.send_message(item['input'])

        # Print reasoning or text output
        if response.text:
            print(f"\nAgent Response / Utterance:\n{response.text}\n")

        time.sleep(1.0)

    print("\n" + "="*65)
    print("  SIMULATION COMPLETE: All rails executed within L3 boundaries.")
    print("="*65 + "\n")


if __name__ == "__main__":
    run_simulation()