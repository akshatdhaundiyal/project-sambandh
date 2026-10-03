---
artifact_contract: ce-unified-plan/v1
product_contract_source: ce-plan-bootstrap
execution: code
date: 2026-10-03
title: "refactor: Information Hierarchy Reorganization & Dual-Hub Judicial Telemetry Integration"
---

# Refactor: Information Hierarchy Reorganization & Dual-Hub Judicial Telemetry Integration

## Goal Capsule

- **Objective:** Reorganize the UI information hierarchy in `telemetry-console` so that left mobile chassis become fully self-contained, realistic app screens for both personas (Elder and Caregiver), while the right pane in both hubs provides live conversation intelligence and integrated real-time Judicial Telemetry & Guardrail Rails.
- **Means:** 
  1. Remove pre-call caregiver approval from the Elder screen (Tab 1) and restrict it exclusively to the Caregiver mobile phone (Tab 2).
  2. Embed functional call start/in-call controls directly inside the Elder mobile phone chassis; slim down the right-hand `SeniorCallCard`.
  3. Convert `RecommendedPromptsList` from a vertical-space-consuming inline block into a compact popup/modal trigger button.
  4. Remove redundant `SeniorHealthWidgets` from the right pane of Tab 1 since all vitals, Omron BP, and routines live inside the Elder phone.
  5. Migrate all Caregiver functionality (Health Locker MedGemma search, document ingestion, structured clinical tables, and wallet limits) directly into the Caregiver mobile phone chassis (`CaregiverMobilePhone.tsx`).
  6. Bring the Judge Telemetry & Rails (Causal Decision Tree + Live API Inspector) into the right pane of both the Elder Hub (Tab 1) and Caregiver Hub (Tab 2), allowing real-time auditability alongside persona actions.
- **Authority Hierarchy:** Product Persona Primacy > Fiduciary & Clinical Rails Integrity > Zero UI Redundancy > Web Interface Guidelines (Contrast, A11y, Tabular Nums).
- **Stop Conditions:**
  - Elder screen displays zero caregiver approval banners.
  - Recommended prompts trigger opens cleanly in a lightweight popup/modal.
  - Caregiver mobile phone contains all MedGemma queries, doctor slip uploads, clinical entity tables, and wallet settings.
  - Right pane of both Hubs displays live conversation/actions and the Judicial Telemetry & Rails.
  - `npm run build` succeeds with code 0 and zero regressions.

---

## Product Contract

### Problem Frame
Currently, the right pane of the Elder screen contains duplicate information already rendered on the Elder mobile phone (wellness scores, Omron BP vitals, medication adherence schedule). Furthermore, an approval banner for the caregiver is inappropriately displayed on the elder's screen. The simulation prompts also occupy excessive vertical height, pushing the live conversation stream off-screen. In the Caregiver screen, critical user interactions (MedGemma search, record uploads, table views) were sequestered in the right pane instead of existing natively inside the caregiver's mobile phone interface. Finally, Judicial Telemetry (the core technical innovation of Project Sambandh) was isolated in a third tab rather than being visible as live evidence during elder calls and caregiver workflows.

### Scope Boundaries
- **In-Scope:**
  - Removal of pre-call approval banner from `SeniorCallCard.tsx` (reserved exclusively for Priya in `CaregiverMobilePhone.tsx` / `TelegramReceptor.tsx`).
  - Addition of one-tap call initiation and active call controls directly inside `ElderMobilePhone.tsx`.
  - Slimming `SeniorCallCard.tsx` down to a lightweight audio/turn session header.
  - Conversion of `RecommendedPromptsList.tsx` into a modal dialog/popup trigger.
  - Removal of `SeniorHealthWidgets.tsx` from the Tab 1 right pane.
  - Complete multi-tab mobile application architecture inside `CaregiverMobilePhone.tsx` (Telegram Alerts & Approval Gate, Health Locker & MedGemma Search/Tables, Care Wallet & Scheduling).
  - Embedding Judicial Telemetry & Rails (`ConversationToolTree.tsx` and `JudgeStepApiPane.tsx`) into the right pane of both the Elder Companion and Caregiver Hub tabs.
- **Outside This Product's Identity (Non-Goals):**
  - Modifying backend PostgreSQL schema or Modal serverless endpoints (these remain untouched and fully functioning).
  - Removing Tab 3 ("Judge Telemetry & Rails") — Tab 3 remains available as a full-screen 50/50 forensic deep-dive view.

---

## Planning Contract

### Key Technical Decisions (KTDs)

- **KTD1 (session-settled: user-directed — remove approval from Elder):** Pre-call caregiver approval gate must not render on `SeniorCallCard.tsx` or the Elder screen. The elder is the recipient of dignified companionship, not an administrative gatekeeper. Approval lives exclusively on Priya's Caregiver Mobile Phone / Telegram Receptor.
- **KTD2 (session-settled: user-directed — functional call inside Left Phone):** `ElderMobilePhone.tsx` shall contain a large, accessible "📞 Start Morning Check-in" action card in the dashboard view, and live call controls (Mute, Speaker, End Call) in the active call view.
- **KTD3 (session-settled: user-directed — prompts as popup):** Replace inline `RecommendedPromptsList.tsx` with a compact `RecommendedPromptsModal.tsx` triggered by a sticky pill button ("💡 6 Test Scenarios / Prompts"), preserving 100% vertical viewport for live dialogue and judicial telemetry.
- **KTD4 (session-settled: user-directed — 3-tab caregiver mobile architecture):** Expand `CaregiverMobilePhone.tsx` into a complete, self-contained mobile application with 3 clear sub-views:
  - *Tab 1: 💬 Telegram & Agency*: Real-time chat with Sambandh Care Bot, Pre-Call Caregiver Agency Gate (`[📞 I Will Call Papa Myself Today]`, `[🤖 Sambandh AI Can Call Papa]`, `[⏰ Snooze 30 Mins]`), 1-Tap UPI mandate approvals, and audio note playback.
  - *Tab 2: 🌿 Clinical Health Locker*: Combined MedGemma search bar ("Ask MedGemma about Papa's health..."), one-tap clinical presets, document upload simulator button (`[+ Ingest Doctor Slip / Lab PDF]`), parsed medication doses (Telma 40mg, Glycomet 500mg), and vital tracking levels (Omron BP 128/82 mmHg, Creatinine 1.10 mg/dL, eGFR >75).
  - *Tab 3: ⚙️ Guardrails & Wallet*: Daily fiduciary spend cap (₹1,500), cash wallet balance (₹8,400) with 1-tap top-up, call scheduling interval (daily morning check-in), emergency contact whitelist, and in-clinic doctor transcriber toggle.
- **KTD5 (session-settled: user-directed — judicial telemetry in both hubs):**
  - In Tab 1 (Elder): Right pane renders Live Dialogue Stream + Integrated Judicial Execution Chain (`JudgeStepApiPane.tsx`) so judges and family can watch the causal deterministic rails fire in real time as speech happens.
  - In Tab 2 (Caregiver): Right pane renders the Judicial Telemetry & Rails (`ConversationToolTree.tsx` + `JudgeStepApiPane.tsx`), providing instant verification of Pine Labs UPI, MedGemma RAG cosine similarity, and Telegram callbacks.

### High-Level Architecture & Layout Flow

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       HEADER BAR                                            │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ TAB 1: ELDER COMPANION                                                                      │
│ ┌──────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │
│ │ LEFT: Elder Mobile Phone (Fixed Top) │ │ RIGHT: Live Dialogue & Judicial Telemetry      │ │
│ │ • Dashboard: Vitals, Routine Glance  │ │ • Live Dialogue Stream (Audio + Hindi/English) │ │
│ │ • Functional Call Trigger Button     │ │ • [💡 Simulation Prompts Popup Trigger]        │ │
│ │ • Active In-Call Chassis (Mute/End)  │ │ • Autonomous Rail Execution Chain (Live Audit) │ │
│ │ • NO CAREGIVER APPROVAL SECTION      │ │ • Real-Time HTTP API Contract Inspector        │ │
│ └──────────────────────────────────────┘ └────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ TAB 2: CAREGIVER HUB                                                                        │
│ ┌──────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │
│ │ LEFT: Caregiver Mobile Phone (Fixed) │ │ RIGHT: Judicial Telemetry & Guardrail Rails    │ │
│ │ • Tab 1: 💬 Telegram & Agency        │ │ • Autonomous Causal Decision & Tool Tree (DAG) │ │
│ │ • Tab 2: 🌿 Clinical Health Locker   │ │ • Live Contract Inspector (Pine Labs / MedGemma│ │
│ │   (MedGemma Search + Doses + Vitals) │ │ • Cosine Similarity & Guardrail Telemetry      │ │
│ │ • Tab 3: ⚙️ Guardrails & Wallet      │ │ • Real-Time Audit Verification Ledger          │ │
│ └──────────────────────────────────────┘ └────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ TAB 3: JUDGE TELEMETRY & RAILS (Full-Screen Dedicated Forensic Console)                    │
│ ┌──────────────────────────────────────┐ ┌────────────────────────────────────────────────┐ │
│ │ 50% Causal Decision Tree (DAG)       │ │ 50% Precision Contract & Guardrail Inspector   │ │
│ └──────────────────────────────────────┘ └────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Implementation Units

### U1. Elder Screen Clean-Up & Call Button in Left Phone
- **Goal:** Remove caregiver approval from the Elder screen, move call start/end controls directly into `ElderMobilePhone.tsx`, and slim down `SeniorCallCard.tsx`.
- **Requirements:** KTD1, KTD2.
- **Dependencies:** None.
- **Files:**
  - `telemetry-console/src/components/SeniorView/SeniorCallCard.tsx`
  - `telemetry-console/src/components/ElderAppView/ElderMobilePhone.tsx`
- **Approach:**
  1. In `SeniorCallCard.tsx`: Remove the entire `Pre-Call Caregiver Agency Consent Banner` and redundant massive call initiation cards. Keep a compact, high-elegance session summary card (status pill, timer, turn counter, and folded memory accordion).
  2. In `ElderMobilePhone.tsx`:
     - In dashboard view: Render a prominent, friendly call action button: `[📞 Connect Morning Call with Sambandh AI]`, with status indicators (Idle, Calling, Active).
     - When clicked, invokes `startCall()`.
     - In call view: Render active in-call audio waves, mute toggle, and an end call button invoking `endCall()`.
- **Test Scenarios:**
  - Verify zero references to "Priya", "Caregiver Agency Gate", or "Approval" in `SeniorCallCard.tsx`.
  - Verify clicking the green call button inside `ElderMobilePhone` starts the call, increments call timer, and transitions to the live dialogue stream.
  - Verify clicking "End Call" inside `ElderMobilePhone` gracefully terminates the session.

### U2. Convert Recommended Prompts to Compact Popup Dialog
- **Goal:** Free up vertical screen real estate in Tab 1 by converting the large inline simulation scenario list into an accessible modal popup.
- **Requirements:** KTD3.
- **Dependencies:** U1.
- **Files:**
  - `telemetry-console/src/components/SeniorView/RecommendedPromptsModal.tsx` (new)
  - `telemetry-console/src/components/SeniorView/RecommendedPromptsList.tsx` (deprecated or refactored)
  - `telemetry-console/src/components/SeniorView/SeniorConversationStream.tsx`
  - `telemetry-console/src/App.tsx`
- **Approach:**
  1. Create `RecommendedPromptsModal.tsx` which renders a dialog containing the 6 curated simulation scenarios (`sim-mentorship`, `sim-refill`, `sim-fraud-intercept`, `sim-health-locker`, etc.) with scenario badges, domain indicators, and one-click injection.
  2. In `SeniorConversationStream.tsx` header (or Tab 1 right pane header), add a neat action trigger: `[💡 Test Scenarios & Prompts (6)]`.
  3. Clicking this button toggles `isPromptsModalOpen`. Selecting a preset triggers the simulation and automatically closes the modal with a toast.
  4. Remove `RecommendedPromptsList` from the main flow of `App.tsx`.
- **Test Scenarios:**
  - Verify clicking "Test Scenarios & Prompts" opens the modal cleanly with high-contrast backdrop and accessible close button (Esc / X).
  - Verify selecting a scenario triggers `triggerSimulationPreset()`, injects dialogue turn, and closes modal.

### U3. Remove Redundant Health Widgets from Elder Right Pane
- **Goal:** Eliminate duplicate widgets (wellness index, Omron BP, medication adherence) from Tab 1 right pane.
- **Requirements:** KTD1, KTD2.
- **Dependencies:** U1, U2.
- **Files:**
  - `telemetry-console/src/App.tsx`
- **Approach:**
  1. In `App.tsx` Tab 1 right pane, remove `<SeniorHealthWidgets />`.
  2. All relevant senior health information (Omron BP 128/82 mmHg, adherence 94%, daily routine) is already prominently displayed inside `ElderMobilePhone.tsx` on the left.
- **Test Scenarios:**
  - Verify Tab 1 right pane no longer renders `SeniorHealthWidgets`.
  - Verify right pane is clean and dedicated to live dialogue and judicial telemetry.

### U4. Comprehensive Caregiver Mobile Phone Hub (All Features Inside Phone)
- **Goal:** Migrate all caregiver functionality (Health Locker MedGemma queries, doctor slip ingestion, clinical entity tables, and wallet limits) into `CaregiverMobilePhone.tsx`.
- **Requirements:** KTD4.
- **Dependencies:** None.
- **Files:**
  - `telemetry-console/src/components/CaregiverPortal/CaregiverMobilePhone.tsx`
  - `telemetry-console/src/components/CaregiverPortal/CaregiverLockerQueryPanel.tsx` (reusable sub-components)
- **Approach:**
  1. Inside `CaregiverMobilePhone.tsx`, design a sleek 3-tab iOS-style bottom or sub-header navigation bar:
     - **Tab 1: 💬 Telegram & Primacy** (`stream`): Real-time chat with Sambandh Care Bot, Pre-Call Agency Gate (`[📞 I Will Call Papa]`, `[🤖 Approve AI Call]`, `[⏰ Snooze]`), 1-Tap UPI approval cards, and audio playback.
     - **Tab 2: 🧠 MedGemma & Locker** (`locker`):
       - Search bar: "Ask MedGemma about Papa's health..." with one-tap query presets (Telmisartan dosage, Creatinine levels, Salt restriction).
       - Query response card showing zero-diagnosis passed, tokens, latency, and clinical answer.
       - Document upload button triggering the ABDM ingestion simulation.
       - Scrollable micro-cards for Medication Doses (Telma 40mg, Glycomet 500mg) and Vital Tracking Levels (Omron BP, Creatinine 1.10 mg/dL, eGFR >75).
     - **Tab 3: 🛡️ Limits & Wallet** (`guardrails`):
       - Daily fiduciary spend cap (₹1,500), cash wallet balance (₹8,400), 1-tap ₹500 top-up button.
       - Call frequency setting (daily morning check-in), emergency routing whitelist.
  2. Ensure all actions correctly interact with `TelemetryContext` (`queryHealthLocker`, `resolvePreCallAgency`, `handleTelegramAction`, `topUpCashWallet`).
- **Test Scenarios:**
  - Verify switching between Telegram, MedGemma Locker, and Limits tabs inside `CaregiverMobilePhone` works smoothly.
  - Verify submitting a MedGemma query inside the mobile phone returns clinical answer and logs the event.
  - Verify pre-call agency approvals (`I will call Papa` / `Approve AI call`) function seamlessly from the mobile phone.

### U5. Integrate Judge Telemetry & Rails in Right Pane of Both Hubs
- **Goal:** Display the live Judicial Telemetry & Rails directly in the right pane of both the Elder Hub (Tab 1) and Caregiver Hub (Tab 2).
- **Requirements:** KTD5.
- **Dependencies:** U1, U3, U4.
- **Files:**
  - `telemetry-console/src/App.tsx`
  - `telemetry-console/src/components/DualPane/JudgeStepApiPane.tsx`
  - `telemetry-console/src/components/ExecutionTree/ConversationToolTree.tsx`
- **Approach:**
  1. **Tab 1 (Elder Companion Right Pane):**
     - Top section: Slim `SeniorCallCard` + `SeniorConversationStream` (Dialogue turns with TTS audio and scenario modal trigger).
     - Bottom section: Integrated **Autonomous Rail Execution Chain & API Inspector** (`JudgeStepApiPane.tsx`), showing live tool nodes, Pine Labs UPI checks, Delhivery logistics, and Telegram bot callbacks as the elder conversation progresses.
  2. **Tab 2 (Caregiver Hub Right Pane):**
     - Replace `CaregiverLockerQueryPanel` with the full **Judicial Telemetry & Rails**:
       - Left column or split pane: Causal Decision & Tool Tree (`ConversationToolTree.tsx`).
       - Right column or bottom: Live API Contract & Guardrail Inspector (`JudgeStepApiPane.tsx`) with specialized MedGemma Cosine Similarity and Caregiver Agency telemetry banners.
  3. Ensure both panes are flexible, independently scrollable, and respect dark/light theme tokens and tabular numbers.
- **Test Scenarios:**
  - In Tab 1: Advance turns or simulate refill order; verify the judicial execution chain updates live in the right pane below conversation.
  - In Tab 2: Approve a pre-call check or query MedGemma inside the phone; verify the right pane instantly inspects the HTTP contract and displays latency/guardrail status.

### U6. Verification, Responsiveness & Build Audit
- **Goal:** Verify seamless responsiveness across desktop and mobile, keyboard accessibility, and clean compilation.
- **Requirements:** Web Interface Guidelines, Clean TypeScript compilation.
- **Dependencies:** U1 through U5.
- **Files:**
  - `telemetry-console/src/App.tsx`
- **Approach:**
  1. Run `npm run build` to verify 0 type errors and 0 lint warnings.
  2. Verify mobile view switchers (< lg) still allow toggling between phone and right pane.
  3. Verify left phone remains pinned toward top with independent right-pane scrolling.
- **Test Scenarios:**
  - `npm run build` exits with code 0.
  - Visual and functional inspection across Tab 1, Tab 2, and Tab 3.

---

## Verification Contract

- **Type Check & Build:**
  ```bash
  cd telemetry-console
  npm run build
  ```
- **Functional Checks:**
  1. Tab 1 (Elder Companion):
     - Left: Elder phone has call trigger and in-call controls. Zero approval banners.
     - Right: Live conversation stream + Prompts popup trigger + JudgeStepApiPane execution chain.
  2. Tab 2 (Caregiver Hub):
     - Left: Caregiver phone has Telegram stream, pre-call approval buttons, MedGemma query search, doctor slip upload, clinical doses, and wallet limits.
     - Right: ConversationToolTree (DAG) + JudgeStepApiPane (HTTP contracts).
  3. Tab 3 (Judge Telemetry):
     - Remains full 50/50 forensic dual pane for dedicated inspection.

---

## Definition of Done

- [ ] Zero caregiver approval UI on Elder screen; approval is solely on Caregiver phone.
- [ ] Elder phone contains functional call start and in-call controls.
- [ ] Simulation prompts are housed in an elegant modal popup instead of taking vertical space in Tab 1.
- [ ] Redundant `SeniorHealthWidgets` removed from Tab 1 right pane.
- [ ] All caregiver features (MedGemma search, slip ingestion, doses table, vitals levels, wallet limits) are interactive inside `CaregiverMobilePhone.tsx`.
- [ ] Right pane of both Elder Hub and Caregiver Hub displays live Judicial Telemetry & Guardrail Rails.
- [ ] Clean build: `npm run build` completes with code 0.
