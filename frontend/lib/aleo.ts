/**
 * JetrPay Aleo Service Layer
 * Handles all interactions with the Aleo Network and Leo Wallet
 */

// Types for Aleo records and transactions
export interface AleoAccount {
  address: string;
  viewKey?: string;
}

export interface TokenRecord {
  owner: string;
  amount: number;
  _nonce: string;
}

export interface SalaryStreamRecord {
  owner: string;
  issuer: string;
  rate_per_block: number;
  start_block: number;
  last_updated_block: number;
  max_cap: number;
  total_claimed: number;
  unclaimed_balance: number;
  _nonce: string;
}

export interface AleoTransaction {
  id: string;
  type: 'execute' | 'deploy';
  programId: string;
  functionName: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: string;
  blockHeight?: number;
  fee?: number;
}

// Configuration
const ALEO_NETWORK = process.env.NEXT_PUBLIC_ALEO_NETWORK || 'testnet';
const ALEO_API_URL = process.env.NEXT_PUBLIC_ALEO_API_URL || 'https://api.explorer.provable.com/v1';
const PAYROLL_PROGRAM_ID = process.env.NEXT_PUBLIC_PAYROLL_PROGRAM_ID || 'jetrpay_payroll_testnet_v1.aleo';

// Check if window.aleo (Leo Wallet) is available
export const isWalletAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(window as any).aleo;
};

// Get the wallet adapter
const getWallet = () => {
  if (typeof window === 'undefined') return null;
  return (window as any).aleo || null;
};

/**
 * Connect to Leo Wallet
 */
export async function connectWallet(): Promise<AleoAccount | null> {
  const wallet = getWallet();
  
  if (!wallet) {
    console.warn('Leo Wallet not detected. Please install Leo Wallet extension.');
    return null;
  }

  try {
    // Request connection with decrypt and sign permissions
    await wallet.connect('decrypt', 'sign');
    
    // Get account address
    const address = await wallet.account();
    
    return {
      address,
    };
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    throw error;
  }
}

/**
 * Disconnect wallet
 */
export async function disconnectWallet(): Promise<void> {
  const wallet = getWallet();
  if (wallet && wallet.disconnect) {
    await wallet.disconnect();
  }
}

/**
 * Get current block height from Aleo network
 */
export async function getCurrentBlockHeight(): Promise<number> {
  try {
    const response = await fetch(`${ALEO_API_URL}/${ALEO_NETWORK}/latest/height`);
    if (!response.ok) throw new Error('Failed to fetch block height');
    const height = await response.json();
    return typeof height === 'number' ? height : parseInt(height, 10);
  } catch (error) {
    console.error('Error fetching block height:', error);
    // Return a reasonable default for testnet
    return 1000000;
  }
}

/**
 * Execute a program transition via Leo Wallet
 */
export async function executeTransition(
  programId: string,
  functionName: string,
  inputs: string[],
  fee?: number
): Promise<string> {
  const wallet = getWallet();
  
  if (!wallet) {
    throw new Error('Wallet not connected');
  }

  try {
    // Execute the transition
    const txId = await wallet.execute({
      program: programId,
      function: functionName,
      inputs,
      fee: fee || 100000, // Default fee in microcredits
    });

    return txId;
  } catch (error) {
    console.error(`Error executing ${functionName}:`, error);
    throw error;
  }
}

/**
 * Create a salary stream for an employee
 */
export async function createSalaryStream(
  employeeAddress: string,
  ratePerBlock: number,
  maxAmount: number
): Promise<string> {
  const currentHeight = await getCurrentBlockHeight();
  
  const inputs = [
    employeeAddress,
    `${ratePerBlock}u64`,
    `${maxAmount}u64`,
    `${currentHeight}u32`,
  ];

  return executeTransition(PAYROLL_PROGRAM_ID, 'create_stream', inputs);
}

/**
 * Claim salary from a stream
 */
export async function claimSalary(
  streamRecord: string,
  amountToClaim: number
): Promise<string> {
  const currentHeight = await getCurrentBlockHeight();
  
  const inputs = [
    streamRecord,
    `${amountToClaim}u64`,
    `${currentHeight}u32`,
  ];

  return executeTransition(PAYROLL_PROGRAM_ID, 'claim_salary', inputs);
}

/**
 * Mint private tokens (for testing/demo)
 */
export async function mintPrivateTokens(
  receiverAddress: string,
  amount: number
): Promise<string> {
  const inputs = [
    receiverAddress,
    `${amount}u64`,
  ];

  return executeTransition(PAYROLL_PROGRAM_ID, 'mint_private', inputs);
}

/**
 * Get transaction status from Aleo network
 */
export async function getTransactionStatus(txId: string): Promise<'pending' | 'confirmed' | 'failed'> {
  try {
    const response = await fetch(`${ALEO_API_URL}/${ALEO_NETWORK}/transaction/${txId}`);
    if (!response.ok) {
      return 'pending';
    }
    const tx = await response.json();
    return tx.status === 'accepted' ? 'confirmed' : 'failed';
  } catch (error) {
    return 'pending';
  }
}

/**
 * Get recent transactions for an address
 */
export async function getTransactionHistory(address: string, limit: number = 20): Promise<AleoTransaction[]> {
  try {
    // Note: This API endpoint may vary based on the explorer being used
    const response = await fetch(
      `${ALEO_API_URL}/${ALEO_NETWORK}/address/${address}/transactions?limit=${limit}`
    );
    
    if (!response.ok) {
      console.warn('Transaction history API not available');
      return [];
    }
    
    const transactions = await response.json();
    return transactions.map((tx: any) => ({
      id: tx.id || tx.transaction_id,
      type: tx.type || 'execute',
      programId: tx.program_id || PAYROLL_PROGRAM_ID,
      functionName: tx.function_name || 'unknown',
      status: tx.status === 'accepted' ? 'confirmed' : tx.status,
      timestamp: tx.timestamp || new Date().toISOString(),
      blockHeight: tx.block_height,
      fee: tx.fee,
    }));
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
}

/**
 * Calculate accrued balance for a stream
 */
export function calculateAccruedBalance(
  ratePerBlock: number,
  startBlock: number,
  lastUpdatedBlock: number,
  currentBlock: number,
  unclaimedBalance: number,
  maxCap: number,
  totalClaimed: number
): number {
  const deltaBlocks = currentBlock - lastUpdatedBlock;
  const newlyAccrued = deltaBlocks * ratePerBlock;
  const totalAvailable = unclaimedBalance + newlyAccrued;
  const remainingCap = maxCap - totalClaimed;
  
  return Math.min(totalAvailable, remainingCap);
}

/**
 * Format Aleo address for display
 */
export function formatAddress(address: string, startChars: number = 6, endChars: number = 4): string {
  if (!address || address.length < startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/**
 * Convert microcredits to credits
 */
export function microCreditsToCredits(microCredits: number): number {
  return microCredits / 1_000_000;
}

/**
 * Convert credits to microcredits
 */
export function creditsToMicroCredits(credits: number): number {
  return Math.floor(credits * 1_000_000);
}

/**
 * Parse a record string from Leo output
 */
export function parseRecordFromOutput(output: string): Record<string, any> | null {
  try {
    // Find the record block in the output
    const match = output.match(/\{[\s\S]*?owner:[\s\S]*?\}/);
    if (!match) return null;
    
    const recordStr = match[0];
    const record: Record<string, any> = {};
    
    // Parse each field
    const fieldMatches = recordStr.matchAll(/(\w+):\s*([^,}]+)/g);
    for (const fieldMatch of fieldMatches) {
      const key = fieldMatch[1];
      let value = fieldMatch[2].trim();
      
      // Remove type suffixes like .private, .public, u64, u32, etc.
      value = value.replace(/\.(private|public)/, '');
      value = value.replace(/(u64|u32|u128|i64|i32|group|field|address)$/, '');
      
      // Try to parse numbers
      if (/^\d+$/.test(value)) {
        record[key] = parseInt(value, 10);
      } else {
        record[key] = value;
      }
    }
    
    return record;
  } catch (error) {
    console.error('Error parsing record:', error);
    return null;
  }
}

// Export config for use elsewhere
export const aleoConfig = {
  network: ALEO_NETWORK,
  apiUrl: ALEO_API_URL,
  payrollProgramId: PAYROLL_PROGRAM_ID,
};
