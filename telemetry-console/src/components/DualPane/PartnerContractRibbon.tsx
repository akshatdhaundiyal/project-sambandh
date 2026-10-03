import React from 'react';
import {
  PineLabsLogo,
  DelhiveryLogo,
  AbdmLogo,
  TelegramLogo,
  MedGemmaLogo,
  JioLogo
} from '../../data/brandLogos';
import { ShieldCheck } from 'lucide-react';

interface PartnerItem {
  id: string;
  name: string;
  role: string;
  statusText: string;
  statusColor: string;
  logo: React.ReactNode;
  sla: string;
  endpoint: string;
}

export const PartnerContractRibbon: React.FC = () => {
  const partners: PartnerItem[] = [
    {
      id: 'pine_labs',
      name: 'Pine Labs',
      role: 'UPI Auto-Debit & Mandates',
      statusText: 'Verified',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      logo: <PineLabsLogo className="w-4 h-4 rounded-sm shrink-0" />,
      sla: '142ms latency · NPCI Certified',
      endpoint: 'api.pinelabs.com/v1/mandates'
    },
    {
      id: 'delhivery',
      name: 'Delhivery',
      role: 'CMU Pharmacy Logistics',
      statusText: 'Active',
      statusColor: 'text-rose-700 bg-rose-50 border-rose-200',
      logo: <DelhiveryLogo className="w-4 h-4 rounded-sm shrink-0" />,
      sla: 'Rohini Hub dispatch · Geo-fenced',
      endpoint: 'api.delhivery.com/cmu/v2/dispatch'
    },
    {
      id: 'abdm',
      name: 'ABDM',
      role: 'Health Locker & Ayushman Bharat',
      statusText: 'Linked',
      statusColor: 'text-teal-700 bg-teal-50 border-teal-200',
      logo: <AbdmLogo className="w-4 h-4 rounded-sm shrink-0" />,
      sla: 'ABHA 91-8822-1049-3321 · Consent Validated',
      endpoint: 'gateway.abdm.gov.in/v0.5/consent'
    },
    {
      id: 'medgemma',
      name: 'MedGemma 4B',
      role: 'Clinical Co-Pilot & RAG',
      statusText: 'Enforced',
      statusColor: 'text-purple-700 bg-purple-50 border-purple-200',
      logo: <MedGemmaLogo className="w-4 h-4 rounded-sm shrink-0" />,
      sla: 'Zero-diagnosis guardrail · LangChain Vector RAG',
      endpoint: 'modal.com/apps/project-sambandh/medgemma-rag'
    },
    {
      id: 'jio',
      name: 'Jio PSTN',
      role: 'Low-Latency PSTN Trunk',
      statusText: '100% Trunk',
      statusColor: 'text-sky-700 bg-sky-50 border-sky-200',
      logo: <JioLogo className="w-4 h-4 rounded-sm shrink-0" />,
      sla: 'Voiceprint match 98.4% · Awadhi dialect SIP',
      endpoint: 'sip.jio.com/pstn/v1/session'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      role: 'Caregiver 2FA & Agency',
      statusText: 'Connected',
      statusColor: 'text-sky-700 bg-sky-50 border-sky-200',
      logo: <TelegramLogo className="w-4 h-4 rounded-sm shrink-0" />,
      sla: 'Priya Sharma (@priya_care) · Bot Webhook Active',
      endpoint: 'api.telegram.org/bot/webhook'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] border border-[#E7E2DB] rounded-2xl px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar shrink-0 shadow-2xs">
      <div className="flex items-center gap-1.5 pr-2 border-r border-[#E7E2DB] shrink-0">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-stone-600">
          Partner Contracts:
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {partners.map((p) => (
          <div
            key={p.id}
            className="group relative flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-stone-50 border border-stone-200/90 rounded-xl transition-all shadow-2xs cursor-pointer shrink-0"
          >
            {p.logo}
            <span className="text-xs font-semibold text-stone-900 whitespace-nowrap">
              {p.name}
            </span>
            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border whitespace-nowrap ${p.statusColor}`}>
              {p.statusText}
            </span>

            {/* Hover Tooltip */}
            <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none w-52 transition-all duration-150 animate-fadeIn">
              <div className="w-2 h-2 bg-stone-950 rotate-45 -mb-1 border-l border-t border-stone-700 z-10"></div>
              <div className="bg-stone-950 text-white text-[10px] font-medium leading-tight p-2 rounded-xl shadow-2xl border border-stone-700 text-center w-full">
                <span className="font-bold text-emerald-400 block mb-0.5">
                  {p.role}
                </span>
                <span className="text-stone-300 block mb-1">
                  {p.sla}
                </span>
                <span className="text-[9px] font-mono text-stone-400 truncate block border-t border-stone-800 pt-1">
                  {p.endpoint}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
