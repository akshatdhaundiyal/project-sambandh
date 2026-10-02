# Project Sambandh: Unit Economics & Scalability Analysis 📈

> **The Ken Case Competition 2026 — Track: Product Strategy (Financial Viability & Unit Economics)**  
> **Document:** 06 — Unit Economics, Cost of Goods Sold (COGS), Margins & Go-to-Market Scale  
> **Strategic Parent:** Reliance Jio Healthcare Ecosystem (Jio, Netmeds, JioPay)

---

## 1. Executive Financial Summary

Project Sambandh operates with exceptional unit economics because it requires **zero proprietary hardware** (e.g., smart pill dispensers, wearable trackers, or tablets). By running entirely over standard PSTN/VoLTE voice telephony and existing consumer smartphones, Sambandh achieves:
- **Cost of Goods Sold (COGS):** **₹124.50 per elder / month**
- **Direct Caregiver Subscription Fee:** **₹499.00 / month** (75.0% Gross Margin)
- **Pharmacy Wholesale Commission (Netmeds Integration):** **₹210.00 / month** (25% on ₹840 GMV)
- **Total Blended Monthly Revenue per Elder:** **₹709.00 / month**
- **Blended Gross Margin:** **82.4%**
- **Payback Period:** **< 1.0 month** (via Jio Postpaid distribution)

---

## 2. Monthly Unit Cost Breakdown (COGS per Active Elder)

The operational cost of maintaining daily autonomous engagement, telephony, AI reasoning, and transaction rails is detailed below:

```
┌────────────────────────────────────────────────────────────────────────┐
│             MONTHLY COGS BREAKDOWN PER SENIOR (30 DAILY CALLS)         │
├───────────────────────────────────┬──────────────┬─────────────────────┤
│ Cost Component                    │ Monthly Cost │ Percentage of Total │
├───────────────────────────────────┼──────────────┼─────────────────────┤
│ 1. Telephony Ingress (Jio PSTN)   │ ₹37.50       │ 30.1%               │
│ 2. Indic Speech Stack (STT + TTS) │ ₹24.00       │ 19.3%               │
│ 3. LLM Inference & Memory Ledger  │ ₹18.00       │ 14.5%               │
│ 4. Messaging & Receptors (Telegram)│ ₹0.00       │ 0.0% (MTProto Free) │
│ 5. Payment Gateway (Pine Labs)    │ ₹4.20        │ 3.4% (0.5% of ₹840) │
│ 6. Dark Store Pick & Pack Ops     │ ₹40.80       │ 32.7%               │
├───────────────────────────────────┼──────────────┼─────────────────────┤
│ TOTAL MONTHLY COGS PER ELDER      │ ₹124.50      │ 100.0%              │
└───────────────────────────────────┴──────────────┴─────────────────────┘
```

### Detailed Cost Line Items:
1. **Carrier Telephony Ingress (Jio PSTN / SIP Trunk):**
   - Average call duration: 5.0 minutes / day $\times$ 30 days = 150 minutes / month.
   - Bulk telecom carrier rate: ₹0.25 / minute.
   - Monthly cost: **₹37.50**.
2. **Indic Speech Stack (WhisperFlo Streaming STT & TTS):**
   - 150 minutes of bidirectional streaming ASR + TTS synthesis.
   - Optimized with local SAPI5 and cached prompt templates.
   - Blended cost: **₹24.00**.
3. **LLM Inference Brain (Gemini 1.5 Flash + Structured Memory):**
   - Memory compaction reduces context to ~210 tokens per call.
   - Input: 210 tokens $\times$ 30 calls = 6,300 tokens / month.
   - Output: 350 tokens $\times$ 30 calls = 10,500 tokens / month.
   - Blended inference cost under Gemini Flash batch pricing: **₹18.00**.
4. **Caregiver Transparency Receptors (Telegram MTProto):**
   - Telegram Bot API provides unlimited free MTProto messaging.
   - Monthly cost: **₹0.00** (WhatsApp Cloud API fallback costs ₹0.40/conversation).
5. **Fiduciary Transaction Processing (Pine Labs Plural):**
   - UPI Autopay mandate charge: 0.50% on ₹840.00 chronic refill.
   - Monthly cost: **₹4.20**.
6. **Logistics & Pharmacy Dark Store Handling:**
   - Incremental packaging and automated picking fee at Netmeds hub.
   - Courier delivery is bundled into retail medicine margins.
   - Allocated handling cost: **₹40.80**.

---

## 3. Revenue Models & Margin Expansion

Project Sambandh operates on a dual-engine monetization model combining software-as-a-service (SaaS) peace-of-mind subscription with high-margin pharmaceutical commerce:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   DUAL-ENGINE REVENUE ARCHITECTURE                     │
├───────────────────────────────────┬────────────────────────────────────┤
│ ENGINE 1: CAREGIVER PEACE-OF-MIND │ ENGINE 2: INTEGRATED PHARMACY GMV  │
├───────────────────────────────────┼────────────────────────────────────┤
│ • Paid by working adult child     │ • Captured via Netmeds integration │
│ • ₹499 / month flat subscription  │ • 25% gross margin on ₹840 GMV     │
│ • Daily morning reassurance cards │ • ₹210.00 / month gross commission │
│ • 182ms acoustic tripwire security│ • Zero customer leakage or dropout │
│ • Sunday longitudinal health digest│• 100% recurring monthly loyalty   │
└───────────────────────────────────┴────────────────────────────────────┘
```

### Blended Monthly P&L per Active Senior:

$$\text{Gross Revenue} = ₹499.00 \text{ (Subscription)} + ₹210.00 \text{ (Pharmacy Margin)} = ₹709.00$$

$$\text{Total COGS} = ₹124.50$$

$$\text{Monthly Contribution Margin} = ₹709.00 - ₹124.50 = \mathbf{₹584.50 \text{ (82.4\% Gross Margin)}}$$

$$\text{Annual Contribution Margin per Senior} = ₹584.50 \times 12 = \mathbf{₹7,014.00 / \text{year}}$$

---

## 4. Customer Acquisition Cost (CAC) & Distribution Strategy

Acquiring healthcare consumers individually is notoriously expensive (industry average CAC: ₹1,500 – ₹2,500). Project Sambandh achieves an extraordinarily low CAC by distributing through **Reliance Jio’s existing family infrastructure**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                  RELIANCE JIO ZERO-CAC DISTRIBUTION FUNNEL             │
├────────────────────────────────────────────────────────────────────────┤
│ 1. JioPostpaid Plus Family Plans:                                      │
│    • Adult child already pays for family mobile connections on one bill│
│    • 1-click add-on: "Add Sambandh Elder Care to Papa's number"        │
│ 2. Netmeds Chronic Refill Base:                                        │
│    • 12M+ existing chronic medicine buyers in Tier 1 & Tier 2 cities   │
│    • In-app prompt: "Automate Papa's refills with conversational care"  │
│ 3. Blended Customer Acquisition Cost (CAC): < ₹220.00                 │
│ 4. Churn Rate: < 1.2% / month (High stickiness due to elder attachment)│
│ 5. 36-Month Lifetime Value (LTV): ₹21,042.00                           │
│ 6. LTV / CAC Ratio: > 95x                                              │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Three-Year Scalability Projections

Leveraging Reliance Jio's reach across India's urban and semi-urban elderly population:

| Metric | Year 1 (Delhi-NCR & Pune) | Year 2 (Top 15 Metros) | Year 3 (Pan-India 100 Cities) |
| :--- | :--- | :--- | :--- |
| **Active Enrolled Seniors** | 25,000 | 180,000 | 850,000 |
| **Annual Subscription Revenue** | ₹14.97 Cr | ₹107.78 Cr | ₹508.98 Cr |
| **Annual Pharmacy GMV Processed**| ₹25.20 Cr | ₹181.44 Cr | ₹856.80 Cr |
| **Net Pharmacy Commission (25%)**| ₹6.30 Cr | ₹45.36 Cr | ₹214.20 Cr |
| **Total Annual Gross Revenue** | **₹21.27 Cr** | **₹153.14 Cr** | **₹723.18 Cr** |
| **Total Annual COGS** | ₹3.74 Cr | ₹26.89 Cr | ₹126.99 Cr |
| **Annual Gross Profit** | **₹17.53 Cr** | **₹126.25 Cr** | **₹596.19 Cr** |
| **Blended Gross Margin %** | **82.4%** | **82.4%** | **82.4%** |

---

## 6. Strategic Takeaways for The Ken Case Competition Judges

1. **Asset-Light Scalability:** No smart pillboxes to manufacture, ship, or repair. Software and telephony scale with near-zero marginal infrastructure overhead.
2. **Immediate Revenue Generation:** Unlike pure research AI models, Sambandh drives immediate transactional cash flow through prescription refills on Day One.
3. **High Defensive Moat:** The intergenerational emotional bond created in Lane 1 makes Sambandh irreplaceable. Seniors form a genuine emotional attachment to the morning call, resulting in near-zero churn (<1.2%).
