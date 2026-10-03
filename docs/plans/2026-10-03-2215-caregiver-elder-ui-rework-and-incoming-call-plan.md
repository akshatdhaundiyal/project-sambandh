# Technical Plan: Caregiver Telemetry Consolidation, Elder Stream Restoration, and Incoming Call Acceptance Flow

**Document Path**: `docs/plans/2026-10-03-2215-caregiver-elder-ui-rework-and-incoming-call-plan.md`  
**Date**: October 3, 2026  
**Status**: Proposed for User Review  

---

## 1. Executive Summary & Problem Formulation

### 1.1 Problems Identified
1. **Caregiver Hub Right Pane Incoherence & Repetition**:
   - The right pane currently renders both `<ConversationToolTree />` and `<JudgeStepApiPane />` side-by-side. Both components display the same execution nodes, leading to heavy visual duplication.
   - The "Active Fiduciary Rails & Partner Contracts" section currently consumes an entire 6-card grid with oversized icons, pushing critical telemetry out of view.
2. **Elder Companion Tab Disorientation**:
   - The live conversation stream appeared "hidden" or pushed off-screen due to an oversized API pane below it and an empty placeholder when idle.
   - The 6 benchmark simulation prompts (*"Doctor ne kya bola?"*, *"Dawa refill"*, *"Amazon pooja"*, *"Sadness"*, *"Crisis"*, *"2FA limit"*) were tucked away in a modal, making them invisible and inaccessible from the main screen.
3. **Missing Incoming Call & Elder Acceptance Step**:
   - When Caregiver Priya clicked "Let Pari Call", the system abruptly forced the call into `active` state.
   - In real-world eldercare telephony, when the AI agent dials Ramesh Ji after caregiver authorization, **Ramesh Ji's phone must ring with an incoming call screen**, requiring him to tap **"Accept Call"** before the conversation and speech synthesis begin.

---

## 2. Architectural Blueprint

```
+----------------------------------------------------------------------------------------------------+
|                                     PROJECT SAMBANDH TELEMETRY                                     |
+----------------------------------------------------------------------------------------------------+
| [Elder Companion Hub]                  [Caregiver Hub]                  [Judge Telemetry & Rails]  |
+----------------------------------------------------------------------------------------------------+

======================================================================================================
TAB 1: ELDER COMPANION HUB
======================================================================================================
+-----------------------------------+  +-------------------------------------------------------------+
| Left: Papa's Mobile Phone         |  | Right: Morning Companion Conversation & Live Rails          |
|                                   |  |                                                             |
| [1] Idle State:                   |  | [1] Sleek Status Strip: Jio PSTN +91 98101 23456            |
|     - Vitals & Pill Routine       |  |                                                             |
|     - "📞 Connect Morning Call"   |  | [2] Live Conversation Stream (Hero Component):             |
|                                   |  |     - Idle: Warm pre-call preview card ("Pari is ready")    |
| [2] Ringing State (Incoming Call):|  |     - Ringing: "Ringing Papa's phone... Waiting to answer"  |
|     - Caller: Pari (Companion)    |  |     - Active: Streaming speech turns + audio waveforms      |
|     - 🟢 ACCEPT  |  🔴 DECLINE    |  |                                                             |
|                                   |  | [3] 1-Click Benchmark Prompts Tray (Restored on page):      |
| [3] Active Call State:            |  |     [🩺 Doctor Advice] [💊 Refill] [🌸 Pooja] [🚨 Crisis]   |
|     - Live speech wave visualizer |  |                                                             |
|     - End Call button             |  | [4] Compact Guardrail Status Bar (Non-intrusive):           |
|                                   |  |     - Highlights active rails in real time + [Inspect ↗]    |
+-----------------------------------+  +-------------------------------------------------------------+

======================================================================================================
TAB 2: CAREGIVER HUB
======================================================================================================
+-----------------------------------+  +-------------------------------------------------------------+
| Left: Priya's Mobile Phone        |  | Right: Caregiver Causal Telemetry & Verification Rails      |
|                                   |  |                                                             |
| [1] 💬 Agency & Telegram Feed     |  | [1] Compact Partner Contracts Ribbon:                       |
|     - "Should Pari call Papa?"    |  |     [🌲 Pine Labs] [📦 Delhivery] [🩺 ABDM]                 |
|     - [📞 I'll Call] [✨ Let AI]  |  |     [🧠 MedGemma] [📶 Jio PSTN] [✈️ Telegram]               |
|                                   |  |     (Single slim row with authentic logos & verified dot)   |
| [2] 🌿 Clinical Health Locker     |  |                                                             |
|     - MedGemma RAG Search         |  | [2] Unified Master-Detail Telemetry:                        |
|     - Ingest Prescription Slip    |  |     +----------------------------+-----------------------+  |
|     - Active Doses & Vitals       |  |     | Master: Causal Graph (DAG) | Detail: Step Contract |  |
|                                   |  |     | - WhisperFlo Session       | - Endpoint URL        |  |
| [3] ⚙️ Guardrails & Wallet        |  |     | - ABDM Profile             | - Status: 200 OK      |  |
|     - Fiduciary Spend Cap (₹1.5k) |  |     | - MedGemma Cosine Match    | - Request Body        |  |
|     - Care Cash Wallet (+₹500)    |  |     | - Pine Labs UPI Mandate    | - Response Body       |  |
|     - Doctor Transcriber Toggle   |  |     | (Click node to inspect)    | - Guardrail Verdict   |  |
+-----------------------------------+  +-------------------------------------------------------------+
```

---

## 3. Detailed Implementation Units

### Unit 1: Incoming Call Ringing & Acceptance State Machine (`U1`)
- **Files Affected**:
  - `telemetry-console/src/hooks/useCallSession.ts`
  - `telemetry-console/src/context/TelemetryContext.tsx`
  - `telemetry-console/src/components/ElderAppView/ElderMobilePhone.tsx`
  - `telemetry-console/src/components/SeniorView/SeniorCallCard.tsx`
- **Actions**:
  1. Add call lifecycle actions in `useCallSession.ts`:
     - `initiateIncomingCall()`: Sets `callStatus = 'calling'`.
     - `acceptCall()`: Transitions `calling -> active`, resets timer, triggers first turn.
     - `declineCall()`: Transitions `calling -> idle`, stops audio.
  2. Wire `resolvePreCallAgency('agent_approved')` in `TelemetryContext.tsx`:
     - Instead of immediately forcing `startCall()`, invoke `initiateIncomingCall()`.
  3. In `ElderMobilePhone.tsx`:
     - Add `activeScreen: 'dashboard' | 'incoming_call' | 'call'`.
     - When `callStatus === 'calling'`, render an **Incoming Call Screen**:
       - Caller: **Pari (Elder Companion)**
       - Dialect/Line: *Jio PSTN Telephony · Rohini Sector 8*
       - Animated ringing waves / audio pulse.
       - Accessible large buttons: 🟢 **Accept Call** (`acceptCall()`) and 🔴 **Decline** (`declineCall()`).
  4. In `SeniorCallCard.tsx`:
     - When `callStatus === 'calling'`, display: *"📞 Ringing Papa's phone... Waiting for Ramesh Ji to accept on his phone"*.

---

### Unit 2: Elder Companion Stream & 1-Click Benchmark Prompts Restoration (`U2`)
- **Files Affected**:
  - `telemetry-console/src/components/SeniorView/SeniorConversationStream.tsx`
  - `telemetry-console/src/components/SeniorView/RecommendedPromptsBar.tsx` (new component)
  - `telemetry-console/src/components/SeniorView/SeniorLiveRailStrip.tsx` (new compact component)
  - `telemetry-console/src/App.tsx`
- **Actions**:
  1. Create `RecommendedPromptsBar.tsx`:
     - Renders a clean, compact horizontal tray with the 6 benchmark scenarios directly visible on the page.
     - 1-click execution triggers the scenario turn and initiates conversation.
  2. Redesign idle state in `SeniorConversationStream.tsx`:
     - Replace the blank empty box with a warm, welcoming **Pre-Call Companion Card**:
       - Avatar of Pari with soft pulse: *"Pari is ready for Ramesh Ji's morning conversation."*
       - Scheduled window: *"08:30 AM IST (Jio PSTN Telephony)"*.
       - Opening dialogue preview: *"नमस्ते रमेश जी, आज सुबह की चाय-नाश्ता हो गया?"*
  3. Create `SeniorLiveRailStrip.tsx`:
     - Replaces the heavy 600px `JudgeStepApiPane` in Tab 1 with a slim, elegant rail monitor.
     - Shows real-time indicators for MedGemma RAG, Pine Labs Mandate, Delhivery CMU, and WhisperFlo Voiceprint.
     - Includes an `[Inspect Rail Contract ↗]` link that opens `RailApiInspectorModal`.

---

### Unit 3: Caregiver Hub Compact Partner Contract Ribbon (`U3`)
- **Files Affected**:
  - `telemetry-console/src/data/brandLogos.tsx`
  - `telemetry-console/src/components/DualPane/PartnerContractRibbon.tsx` (new component)
- **Actions**:
  1. Enhance `brandLogos.tsx` with authentic brand marks:
     - **Pine Labs**: Official green emblem with Plural orange accent.
     - **Delhivery**: Official red logistics parcel mark.
     - **ABDM**: Official National Health Authority (NHA) / Ayushman Bharat Digital Mission cross emblem.
     - **MedGemma**: Google DeepMind / Gemma gradient star emblem.
     - **Reliance Jio**: Official Jio PSTN blue circular mark.
     - **Telegram**: Official paper plane emblem.
  2. Build `PartnerContractRibbon.tsx`:
     - Single horizontal ribbon (height 40px, rounded-2xl, border `#E7E2DB`, background `#FAF8F5`).
     - Renders each partner as a compact pill: Logo (20x20) + Name + `● Active / Verified` dot.
     - Hover tooltip reveals contract details (Sandbox Verified, Latency SLA < 200ms, Webhook URL).

---

### Unit 4: Caregiver Hub Causal Telemetry Consolidation (`U4`)
- **Files Affected**:
  - `telemetry-console/src/components/DualPane/CaregiverTelemetryConsole.tsx` (new component)
  - `telemetry-console/src/components/DualPane/JudgeStepApiPane.tsx`
  - `telemetry-console/src/App.tsx`
- **Actions**:
  1. Build `CaregiverTelemetryConsole.tsx`:
     - Top: `<PartnerContractRibbon />` (Unit 3).
     - Bottom: Cohesive Master-Detail Grid (`grid grid-cols-1 xl:grid-cols-2 gap-3.5`):
       - **Left (Master)**: `<ConversationToolTree />` with active causal DAG nodes.
       - **Right (Detail)**: Compact `<JudgeStepApiPane compactMode={true} />` focused strictly on the selected node's HTTP contract payload, eliminating duplicate timelines and duplicate catalog bars.
  2. Connect selection state:
     - Selecting a node in the DAG tree immediately highlights and inspects its exact HTTP contract in the right inspector.

---

### Unit 5: End-to-End Build & Functional Verification (`U5`)
- **Files Affected**: All modified files.
- **Actions**:
  1. Run `npm run build` in `telemetry-console/` (ensure code 0, 0 TypeScript errors).
  2. Verify full multi-screen flow:
     - Step A: In Tab 2, Caregiver Priya approves morning call (`Let Pari Call`).
     - Step B: In Tab 1, Ramesh Ji's phone rings with the new incoming call screen.
     - Step C: Ramesh Ji taps 🟢 **Accept Call**.
     - Step D: Call connects to active, live dialogue streams, waveforms animate.
     - Step E: In Tab 2 right pane, partner ribbon and DAG tree + HTTP contract inspector synchronize seamlessly without duplication.

---

## 4. Verification & Testing Matrix

| Flow / Component | Expected Behavior | Verification Check |
|---|---|---|
| **Caregiver Agency Approval** | Priya taps "Let Pari Call" in Caregiver Phone. | `callStatus` becomes `'calling'`. Telegram status shows pre-call consent captured. |
| **Elder Incoming Call UI** | Ramesh Ji's phone displays ringing screen with 🟢 Accept / 🔴 Decline. | Screen shows Pari identity, animated ring pulse, audio chime prompt. |
| **Elder Call Acceptance** | Ramesh Ji taps 🟢 Accept Call. | `callStatus` becomes `'active'`, call timer ticks, conversation stream turns speak aloud. |
| **Restored Prompts Tray** | 6 benchmark prompts visible directly below conversation stream. | 1-click executes scenario turn without opening any modal. |
| **Elder Stream Idle State** | Chat window displays warm pre-call companion preview card. | No blank space or missing chat container. |
| **Partner Contracts Ribbon** | Single slim row with authentic logos across top of Caregiver right pane. | No heavy 6-card grid; compact height ~40px. |
| **Caregiver Telemetry Master-Detail** | Causal DAG Tree on left, HTTP payload inspector on right. | Zero duplicate node bars; clicking tree node inspects contract payload. |
| **TypeScript / Vite Build** | Clean build with zero errors. | `npm run build` exits with code 0. |

---

## 5. Next Steps

Upon your approval of this plan, we will execute Units U1 through U5 in order, test the live telephony and telemetry synchronization, and build the verified production bundle.
