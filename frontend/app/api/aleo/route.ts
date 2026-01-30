/**
 * JetrPay Aleo API Routes
 * Backend endpoints for Aleo blockchain interactions
 */

import { NextRequest, NextResponse } from 'next/server';

const ALEO_API_URL = 'https://api.explorer.provable.com/v1';
const PROGRAM_ID = 'jetrpay_payroll_testnet_v1.aleo';

// Cache for block height (refresh every 15 seconds)
let blockHeightCache: { value: number; timestamp: number } | null = null;
const CACHE_TTL = 15000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action');

  try {
    switch (action) {
      case 'block-height':
        return await getBlockHeight();
      
      case 'program':
        return await getProgramInfo();
      
      case 'mappings':
        const mapping = searchParams.get('mapping');
        const key = searchParams.get('key');
        return await getMappingValue(mapping!, key!);
      
      case 'transactions':
        const address = searchParams.get('address');
        return await getTransactions(address!);
      
      case 'records':
        const recordAddress = searchParams.get('address');
        return await getRecords(recordAddress!);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Aleo API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getBlockHeight() {
  // Check cache
  if (blockHeightCache && Date.now() - blockHeightCache.timestamp < CACHE_TTL) {
    return NextResponse.json({ 
      blockHeight: blockHeightCache.value,
      cached: true 
    });
  }

  const response = await fetch(`${ALEO_API_URL}/testnet/latest/height`, {
    headers: { 'Accept': 'application/json' },
    next: { revalidate: 15 }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch block height');
  }

  const blockHeight = await response.json();
  
  // Update cache
  blockHeightCache = { value: blockHeight, timestamp: Date.now() };

  return NextResponse.json({ blockHeight, cached: false });
}

async function getProgramInfo() {
  const response = await fetch(`${ALEO_API_URL}/testnet/program/${PROGRAM_ID}`, {
    headers: { 'Accept': 'application/json' },
  });

  if (response.status === 404) {
    return NextResponse.json({ 
      deployed: false, 
      programId: PROGRAM_ID,
      message: 'Program not yet deployed to testnet'
    });
  }

  if (!response.ok) {
    throw new Error('Failed to fetch program info');
  }

  const program = await response.json();
  return NextResponse.json({ 
    deployed: true, 
    programId: PROGRAM_ID,
    program 
  });
}

async function getMappingValue(mapping: string, key: string) {
  if (!mapping || !key) {
    return NextResponse.json({ error: 'Missing mapping or key' }, { status: 400 });
  }

  const response = await fetch(
    `${ALEO_API_URL}/testnet/program/${PROGRAM_ID}/mapping/${mapping}/${key}`,
    { headers: { 'Accept': 'application/json' } }
  );

  if (response.status === 404) {
    return NextResponse.json({ value: null, exists: false });
  }

  if (!response.ok) {
    throw new Error('Failed to fetch mapping value');
  }

  const value = await response.json();
  return NextResponse.json({ value, exists: true });
}

async function getTransactions(address: string) {
  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }

  // Try to fetch transactions for this address
  try {
    // Note: Aleo explorer API might have different endpoints for transactions
    // This is a best-effort implementation
    const response = await fetch(
      `${ALEO_API_URL}/testnet/address/${address}/transactions`,
      { headers: { 'Accept': 'application/json' } }
    );

    if (response.status === 404) {
      return NextResponse.json({ transactions: [], count: 0 });
    }

    if (!response.ok) {
      // Return empty if endpoint doesn't exist
      return NextResponse.json({ transactions: [], count: 0 });
    }

    const transactions = await response.json();
    return NextResponse.json({ 
      transactions: Array.isArray(transactions) ? transactions : [], 
      count: Array.isArray(transactions) ? transactions.length : 0 
    });
  } catch (error) {
    // Return empty on error
    return NextResponse.json({ transactions: [], count: 0 });
  }
}

async function getRecords(address: string) {
  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 });
  }

  // Records are private in Aleo and need to be queried through the wallet
  // This endpoint provides a placeholder for future implementation
  return NextResponse.json({ 
    records: [],
    note: 'Records must be queried through wallet for privacy'
  });
}

// POST handler for transactions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case 'broadcast':
        return await broadcastTransaction(body);
      
      case 'estimate-fee':
        return await estimateFee(body);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Aleo POST API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

async function broadcastTransaction(body: any) {
  const { transaction } = body;
  
  if (!transaction) {
    return NextResponse.json({ error: 'Missing transaction' }, { status: 400 });
  }

  const response = await fetch(`${ALEO_API_URL}/testnet/transaction/broadcast`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json' 
    },
    body: JSON.stringify(transaction),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to broadcast: ${error}`);
  }

  const result = await response.json();
  return NextResponse.json({ success: true, txId: result });
}

async function estimateFee(body: any) {
  const { programId, functionName, inputs } = body;
  
  // Estimate based on function complexity
  // These are rough estimates - actual fees depend on the network
  const baseFee = 100000; // 0.0001 credits in microcredits
  const functionFees: Record<string, number> = {
    'create_salary_stream': 500000,
    'claim_salary': 300000,
    'cancel_stream': 200000,
    'pause_stream': 150000,
    'resume_stream': 150000,
    'update_stream_rate': 250000,
  };

  const fee = functionFees[functionName] || baseFee;
  
  return NextResponse.json({ 
    estimatedFee: fee,
    feeCredits: fee / 1000000000, // Convert to credits
    note: 'Estimated fee, actual may vary'
  });
}
