import { useState, useCallback } from 'react';
import {
  MedicalIssue,
  InventoryOrder,
  CashWalletState,
  CaregiverConfig
} from '../types/telemetry';

interface UseFiduciaryLedgerProps {
  onFeedbackToast: (message: string) => void;
}

export const useFiduciaryLedger = ({ onFeedbackToast }: UseFiduciaryLedgerProps) => {
  // Medical Dossier State
  const [medicalIssues, setMedicalIssues] = useState<MedicalIssue[]>([
    {
      id: 'issue-1',
      condition: 'Essential Hypertension (Stage-1)',
      diagnosedDate: '14 Feb 2021',
      severity: 'CHRONIC',
      notes: 'Controlled on Telmisartan (Telma) 40mg OD morning post breakfast. Baseline BP: 128/82 mmHg. Target: <130/80 mmHg.',
      treatingDoctor: 'Dr. Arvind Saxena (Cardiologist)',
      activeSymptoms: ['Occasional morning occipital heaviness', 'Mild pedal edema in summer']
    },
    {
      id: 'issue-2',
      condition: 'Type 2 Diabetes Mellitus',
      diagnosedDate: '10 Nov 2019',
      severity: 'MODERATE',
      notes: 'Controlled fasting glucose (95-115 mg/dL). Regimen: Metformin (Glycomet) 500mg evening post-dinner.',
      treatingDoctor: 'Dr. Neha Verma (Diabetologist)',
      activeSymptoms: ['Post-lunch lethargy', 'Thirst during warm weather']
    },
    {
      id: 'issue-3',
      condition: 'Bilateral Knee Osteoarthritis (Grade-1)',
      diagnosedDate: '08 Mar 2023',
      severity: 'MILD',
      notes: 'Age-related joint stiffness in early mornings. Doctor advised warm water compresses and avoiding steep staircases.',
      treatingDoctor: 'Dr. Arvind Saxena',
      activeSymptoms: ['Morning joint stiffness (ghutne me jakdan)', 'Difficulty standing from floor']
    },
    {
      id: 'issue-4',
      condition: 'Mild Sleep-Onset Insomnia',
      diagnosedDate: '12 Jan 2025',
      severity: 'MILD',
      notes: 'Reports light sleep; early 05:00 AM awakenings. Non-pharmacological management: warm milk and routine calm.',
      treatingDoctor: 'Dr. Arvind Saxena',
      activeSymptoms: ['Waking up at 5:00 AM', 'Mind running on old memories']
    }
  ]);

  // Pending Orders State ("Ordered but not received")
  const [inventoryOrders, setInventoryOrders] = useState<InventoryOrder[]>([
    {
      id: 'ord-med-prev-01',
      itemName: 'Telmisartan 40mg (30 Tablets Strip)',
      category: 'MEDICATION',
      orderDate: 'Today, 08:32 AM',
      units: 30,
      amountInr: 680,
      vendor: 'Apollo Pharmacy DarkStore Sector 11',
      status: 'ORDERED_NOT_RECEIVED',
      trackingWaybill: 'DLV-98234-DEL',
      eta: 'Today by 4:00 PM'
    },
    {
      id: 'ord-pooja-init',
      itemName: 'Fresh Marigold Genda Mala & Pure Chandan',
      category: 'POOJA_FLOWERS',
      orderDate: 'Today, 08:30 AM',
      units: 2,
      amountInr: 210,
      vendor: 'Rohini Mandir Phool Bhandar (Quick Commerce)',
      status: 'ORDERED_NOT_RECEIVED',
      trackingWaybill: 'QC-DEL-881920',
      eta: 'Today by 07:00 AM'
    }
  ]);

  const addInventoryOrder = useCallback((order: InventoryOrder) => {
    setInventoryOrders(prev => [order, ...prev]);
  }, []);

  // In-Memory Cash Wallet & Call Scheduling State
  const [cashWallet, setCashWallet] = useState<CashWalletState>({
    balanceInr: 2500,
    lowBalanceThresholdInr: 500,
    callFrequencyPerDay: 1,
    lastDeductionReason: undefined,
    lastDeductionAmount: undefined
  });

  const deductCashWallet = useCallback((amountInr: number, reason: string) => {
    setCashWallet(prev => {
      const newBal = Math.max(0, prev.balanceInr - amountInr);
      const isNowLow = newBal < prev.lowBalanceThresholdInr;
      if (isNowLow) {
        onFeedbackToast(`⚠️ Low Cash Balance Alert: Care wallet dropped to ₹${newBal.toLocaleString('en-IN')}. Dispatched alert to Rohan.`);
      }
      return {
        ...prev,
        balanceInr: newBal,
        lastDeductionReason: reason,
        lastDeductionAmount: amountInr
      };
    });
  }, [onFeedbackToast]);

  const updateCallFrequency = useCallback((freq: number) => {
    setCashWallet(prev => ({ ...prev, callFrequencyPerDay: freq }));
    onFeedbackToast(`🗓️ Call Frequency updated to ${freq}x per day. Daily schedule synced with carrier.`);
  }, [onFeedbackToast]);

  const topUpCashWallet = useCallback((amountInr: number) => {
    setCashWallet(prev => {
      const newBal = prev.balanceInr + amountInr;
      onFeedbackToast(`💳 Fiduciary Care Wallet credited with ₹${amountInr.toLocaleString('en-IN')}. New balance: ₹${newBal.toLocaleString('en-IN')}.`);
      return {
        ...prev,
        balanceInr: newBal
      };
    });
  }, [onFeedbackToast]);

  // Pre-Fed Caregiver Configuration State (Elder & Nearest Pharmacy Locations, Limit)
  const [caregiverConfig, setCaregiverConfig] = useState<CaregiverConfig>({
    elderHomeAddress: 'Flat 402, Block C, Pocket 2, Rohini Sector 8, Delhi',
    elderPinCode: '110085',
    nearestPharmacyName: 'Netmeds / Apollo DarkStore Sector 11',
    nearestPharmacyAddress: 'Plot 14, Community Centre, Sector 11, Rohini',
    nearestPharmacyPinCode: '110085',
    nearestPharmacyEmail: 'orders.rohini11@netmeds.com',
    orderTotalLimitInr: 4500
  });

  const updateCaregiverConfig = useCallback((newConfig: Partial<CaregiverConfig>) => {
    setCaregiverConfig(prev => {
      const updated = { ...prev, ...newConfig };
      onFeedbackToast(`📍 Caregiver settings updated: Limit ₹${updated.orderTotalLimitInr.toLocaleString('en-IN')}, Pickup at ${updated.nearestPharmacyName}.`);
      return updated;
    });
  }, [onFeedbackToast]);

  return {
    medicalIssues,
    setMedicalIssues,
    inventoryOrders,
    setInventoryOrders,
    addInventoryOrder,
    cashWallet,
    deductCashWallet,
    updateCallFrequency,
    topUpCashWallet,
    caregiverConfig,
    updateCaregiverConfig
  };
};
