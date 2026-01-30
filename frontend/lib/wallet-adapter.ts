/**
 * JetrPay Wallet Adapter
 * Supports Leo Wallet, Puzzle Wallet, and Demo Mode for Aleo
 */

export interface WalletAdapter {
  name: string;
  icon: string;
  installed: boolean;
  isDemo?: boolean;
  connect: () => Promise<string>;
  disconnect: () => Promise<void>;
  signTransaction: (tx: any) => Promise<string>;
  requestRecords: (program: string) => Promise<any[]>;
}

export interface ConnectedWallet {
  address: string;
  walletName: string;
  adapter: WalletAdapter;
  isDemo?: boolean;
}

// Demo Wallet Adapter (for hackathon/testing)
export const demoWalletAdapter: WalletAdapter = {
  name: 'Demo Wallet',
  icon: '/wallets/demo.svg',
  installed: true,
  isDemo: true,
  
  async connect(): Promise<string> {
    // Generate a realistic-looking Aleo address for demo
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let address = 'aleo1';
    for (let i = 0; i < 58; i++) {
      address += chars[Math.floor(Math.random() * chars.length)]
    }
    return address;
  },
  
  async disconnect(): Promise<void> {
    // No-op for demo
  },
  
  async signTransaction(tx: any): Promise<string> {
    // Return mock transaction ID
    return 'at1demo' + Math.random().toString(36).slice(2, 15);
  },
  
  async requestRecords(program: string): Promise<any[]> {
    return [];
  }
};

// Declare the Leo Wallet type
declare global {
  interface Window {
    leoWallet?: {
      connect: () => Promise<{ address: string } | string>;
      disconnect: () => Promise<void>;
      requestRecords: (program: string) => Promise<any[]>;
      signMessage: (message: string) => Promise<string>;
      requestTransaction: (tx: any) => Promise<string>;
      publicKey?: string;
      address?: string;
    };
    aleo?: any;
    puzzle?: any;
  }
}

// Check for Leo Wallet - check multiple possible globals
export function isLeoWalletInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  // Leo Wallet typically exposes window.leoWallet
  return !!window.leoWallet;
}

// Check for Puzzle Wallet  
export function isPuzzleWalletInstalled(): boolean {
  if (typeof window === 'undefined') return false;
  return !!window.puzzle;
}

// Get Leo Wallet object
function getLeoWallet(): Window['leoWallet'] | null {
  if (typeof window === 'undefined') return null;
  return window.leoWallet || null;
}

// Get Puzzle Wallet adapter
function getPuzzleWallet(): any {
  if (typeof window === 'undefined') return null;
  return window.puzzle || null;
}

// Leo Wallet Adapter
export const leoWalletAdapter: WalletAdapter = {
  name: 'Leo Wallet',
  icon: '/wallets/leo.svg',
  get installed() {
    return isLeoWalletInstalled();
  },
  
  async connect(): Promise<string> {
    const wallet = getLeoWallet();
    if (!wallet) {
      throw new Error('Leo Wallet not installed. Please install it from leo.app');
    }
    
    console.log('[JetrPay] Leo Wallet object found:', wallet);
    console.log('[JetrPay] Available methods:', Object.keys(wallet));
    
    try {
      // Leo Wallet v2+ uses connect() method
      if (typeof wallet.connect === 'function') {
        console.log('[JetrPay] Calling leoWallet.connect()...');
        const result = await wallet.connect();
        console.log('[JetrPay] Connect result:', result);
        
        // Handle different response formats
        if (typeof result === 'string' && result.startsWith('aleo1')) {
          return result;
        }
        if (result && typeof result === 'object' && 'address' in result) {
          return result.address;
        }
      }
      
      // Check if already connected
      if (wallet.publicKey) {
        console.log('[JetrPay] Already connected, publicKey:', wallet.publicKey);
        return wallet.publicKey;
      }
      
      if (wallet.address) {
        console.log('[JetrPay] Already connected, address:', wallet.address);
        return wallet.address;
      }
      
      throw new Error('Could not get wallet address. Please make sure Leo Wallet is unlocked.');
    } catch (error: any) {
      console.error('[JetrPay] Leo Wallet connection error:', error);
      
      // User-friendly error messages
      if (error.message?.includes('reject') || error.message?.includes('denied') || error.message?.includes('cancel')) {
        throw new Error('Connection cancelled. Please approve the connection in Leo Wallet.');
      }
      if (error.message?.includes('locked')) {
        throw new Error('Wallet is locked. Please unlock Leo Wallet first.');
      }
      
      throw new Error(error.message || 'Failed to connect. Please try again.');
    }
  },
  
  async disconnect(): Promise<void> {
    const wallet = getLeoWallet();
    if (wallet?.disconnect) {
      await wallet.disconnect();
    }
  },
  
  async signTransaction(tx: any): Promise<string> {
    const wallet = getLeoWallet();
    if (!wallet) throw new Error('Wallet not connected');
    
    if (wallet.signTransaction) {
      return wallet.signTransaction(tx);
    }
    if (wallet.execute) {
      return wallet.execute(tx);
    }
    throw new Error('Transaction signing not supported');
  },
  
  async requestRecords(program: string): Promise<any[]> {
    const wallet = getLeoWallet();
    if (!wallet) throw new Error('Wallet not connected');
    
    if (wallet.requestRecords) {
      return wallet.requestRecords(program);
    }
    return [];
  }
};

// Puzzle Wallet Adapter
export const puzzleWalletAdapter: WalletAdapter = {
  name: 'Puzzle Wallet',
  icon: '/wallets/puzzle.svg',
  get installed() {
    return isPuzzleWalletInstalled();
  },
  
  async connect(): Promise<string> {
    const wallet = getPuzzleWallet();
    if (!wallet) {
      throw new Error('Puzzle Wallet not installed');
    }
    
    try {
      const result = await wallet.connect();
      return result.address || result;
    } catch (error: any) {
      console.error('Puzzle Wallet connection error:', error);
      throw new Error(error.message || 'Failed to connect Puzzle Wallet');
    }
  },
  
  async disconnect(): Promise<void> {
    const wallet = getPuzzleWallet();
    if (wallet?.disconnect) {
      await wallet.disconnect();
    }
  },
  
  async signTransaction(tx: any): Promise<string> {
    const wallet = getPuzzleWallet();
    if (!wallet) throw new Error('Wallet not connected');
    return wallet.signTransaction(tx);
  },
  
  async requestRecords(program: string): Promise<any[]> {
    const wallet = getPuzzleWallet();
    if (!wallet) throw new Error('Wallet not connected');
    
    if (wallet.requestRecords) {
      return wallet.requestRecords(program);
    }
    return [];
  }
};

// Get all available wallet adapters
export function getAvailableWallets(): WalletAdapter[] {
  const wallets: WalletAdapter[] = [];
  
  if (leoWalletAdapter.installed) {
    wallets.push(leoWalletAdapter);
  }
  
  if (puzzleWalletAdapter.installed) {
    wallets.push(puzzleWalletAdapter);
  }
  
  return wallets;
}

// Get all supported wallets (installed or not)
export function getSupportedWallets(): { adapter: WalletAdapter; installUrl: string }[] {
  return [
    { 
      adapter: leoWalletAdapter, 
      installUrl: 'https://www.leo.app/' 
    },
    { 
      adapter: puzzleWalletAdapter, 
      installUrl: 'https://puzzle.online/' 
    },
  ];
}

// Get demo wallet adapter
export function getDemoWallet(): WalletAdapter {
  return demoWalletAdapter;
}

// Check if any wallet is installed
export function isAnyWalletInstalled(): boolean {
  return isLeoWalletInstalled() || isPuzzleWalletInstalled();
}

// Auto-connect to first available wallet
export async function autoConnect(): Promise<ConnectedWallet | null> {
  const wallets = getAvailableWallets();
  
  for (const adapter of wallets) {
    try {
      const address = await adapter.connect();
      return {
        address,
        walletName: adapter.name,
        adapter,
      };
    } catch (error) {
      console.log(`Failed to auto-connect to ${adapter.name}`);
    }
  }
  
  return null;
}
