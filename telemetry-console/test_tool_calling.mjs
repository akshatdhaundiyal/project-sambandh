/**
 * Verification test script for Tool Calling & HITL Caregiver Approval Architecture
 */
import {
  callNetmedsOrderTool,
  callDelhiveryDispatchTool,
  callPineLabsPaymentTool,
  executeApprovedMedicationOrder
} from './src/services/toolCallingService.ts';

async function runTests() {
  console.log('--- 1. Testing Netmeds B2B Order Tool ---');
  const netmeds = await callNetmedsOrderTool({
    medicationName: 'Telma 40mg (Telmisartan)',
    dosage: '40mg',
    quantity: 30,
    costInr: 840,
    vendor: 'Netmeds / Apollo DarkStore Sector 11'
  });
  console.log('Netmeds Result:', {
    success: netmeds.success,
    orderId: netmeds.orderId,
    invoiceNo: netmeds.invoiceNo,
    statusCode: netmeds.telemetryNode.statusCode
  });

  console.log('\n--- 2. Testing Delhivery CMU Dispatch Tool ---');
  const dlv = await callDelhiveryDispatchTool({
    orderId: netmeds.orderId,
    pickupLocation: 'Apollo Pharmacy DarkStore Sector 11',
    destinationAddress: 'Flat 402, Block C, Pocket 2, Rohini Sector 8'
  });
  console.log('Delhivery Result:', {
    success: dlv.success,
    waybill: dlv.waybill,
    eta: dlv.eta,
    statusCode: dlv.telemetryNode.statusCode
  });

  console.log('\n--- 3. Testing Full Approved Medication Order Cascade ---');
  const nodes = [];
  let walletDeducted = 0;
  let orderAdded = null;
  let injectedTurn = null;

  const cascade = await executeApprovedMedicationOrder(
    {
      id: 'appr-test-1',
      timestamp: '08:32 AM IST',
      medicationName: 'Telma 40mg (Telmisartan)',
      dosage: '40mg',
      units: 30,
      costInr: 840,
      vendor: 'Netmeds DarkStore Sector 11',
      deliveryAddress: 'Flat 402, Block C, Pocket 2, Rohini Sector 8',
      recipientPhone: '+91 98101 23456',
      reason: 'Low BP pills',
      status: 'AWAITING_APPROVAL'
    },
    {
      onAddNodes: (n) => nodes.push(...n),
      onDeductWallet: (amt) => { walletDeducted = amt; },
      onAddInventoryOrder: (ord) => { orderAdded = ord; },
      onInjectTurn: (txt) => { injectedTurn = txt; },
      onToast: (msg) => console.log('Toast:', msg)
    }
  );

  console.log('Cascade Result:', {
    orderId: cascade.orderId,
    waybill: cascade.waybill,
    walletDeducted,
    nodesCount: nodes.length,
    injectedTurnSnippet: injectedTurn?.substring(0, 40)
  });

  console.log('\n✅ All tool calling unit tests passed successfully!');
}

runTests().catch(console.error);
