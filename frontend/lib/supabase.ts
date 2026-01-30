/**
 * JetrPay Supabase Client
 * Handles data persistence for employees, streams, and transactions
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Types for database tables
export interface DbEmployee {
  id: string;
  company_id: string;
  name: string;
  role: string;
  status: 'Active' | 'Paused';
  salary: number;
  rate_per_block: number;
  wallet_address: string;
  stream_record?: string;
  created_at: string;
  updated_at: string;
}

export interface DbStream {
  id: string;
  employee_id: string;
  company_id: string;
  owner_address: string;
  issuer_address: string;
  rate_per_block: number;
  start_block: number;
  max_cap: number;
  total_claimed: number;
  status: 'active' | 'paused' | 'completed';
  record_data?: string;
  created_at: string;
  updated_at: string;
}

export interface DbTransaction {
  id: string;
  tx_id: string;
  company_id?: string;
  employee_id?: string;
  type: 'stream_create' | 'claim' | 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  block_height?: number;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface DbCompany {
  id: string;
  name: string;
  wallet_address: string;
  vault_balance: number;
  created_at: string;
  updated_at: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabase: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Using local storage fallback.');
    return null;
  }

  if (!supabase) {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabase;
}

// Local Storage Fallback for when Supabase is not configured
const STORAGE_KEYS = {
  employees: 'jetrpay_employees',
  streams: 'jetrpay_streams',
  transactions: 'jetrpay_transactions',
  company: 'jetrpay_company',
  user: 'jetrpay_user',
};

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Employee Operations
export async function getEmployees(companyId: string): Promise<DbEmployee[]> {
  const client = getSupabaseClient();
  
  if (client) {
    const { data, error } = await client
      .from('employees')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching employees:', error);
      return getFromStorage(STORAGE_KEYS.employees, []);
    }
    return data || [];
  }
  
  return getFromStorage(STORAGE_KEYS.employees, []);
}

export async function createEmployee(employee: Omit<DbEmployee, 'id' | 'created_at' | 'updated_at'>): Promise<DbEmployee | null> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();
  
  const newEmployee: DbEmployee = {
    ...employee,
    id: `emp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    created_at: now,
    updated_at: now,
  };
  
  if (client) {
    const { data, error } = await client
      .from('employees')
      .insert(newEmployee)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating employee:', error);
      // Fallback to local storage
      const employees = getFromStorage<DbEmployee[]>(STORAGE_KEYS.employees, []);
      employees.push(newEmployee);
      saveToStorage(STORAGE_KEYS.employees, employees);
      return newEmployee;
    }
    return data;
  }
  
  // Local storage fallback
  const employees = getFromStorage<DbEmployee[]>(STORAGE_KEYS.employees, []);
  employees.push(newEmployee);
  saveToStorage(STORAGE_KEYS.employees, employees);
  return newEmployee;
}

export async function updateEmployee(id: string, updates: Partial<DbEmployee>): Promise<DbEmployee | null> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();
  
  if (client) {
    const { data, error } = await client
      .from('employees')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating employee:', error);
    }
    return data;
  }
  
  // Local storage fallback
  const employees = getFromStorage<DbEmployee[]>(STORAGE_KEYS.employees, []);
  const index = employees.findIndex(e => e.id === id);
  if (index !== -1) {
    employees[index] = { ...employees[index], ...updates, updated_at: now };
    saveToStorage(STORAGE_KEYS.employees, employees);
    return employees[index];
  }
  return null;
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const client = getSupabaseClient();
  
  if (client) {
    const { error } = await client
      .from('employees')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting employee:', error);
      return false;
    }
    return true;
  }
  
  // Local storage fallback
  const employees = getFromStorage<DbEmployee[]>(STORAGE_KEYS.employees, []);
  const filtered = employees.filter(e => e.id !== id);
  saveToStorage(STORAGE_KEYS.employees, filtered);
  return true;
}

// Stream Operations
export async function getStreams(companyId: string): Promise<DbStream[]> {
  const client = getSupabaseClient();
  
  if (client) {
    const { data, error } = await client
      .from('streams')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching streams:', error);
      return getFromStorage(STORAGE_KEYS.streams, []);
    }
    return data || [];
  }
  
  return getFromStorage(STORAGE_KEYS.streams, []);
}

export async function createStream(stream: Omit<DbStream, 'id' | 'created_at' | 'updated_at'>): Promise<DbStream | null> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();
  
  const newStream: DbStream = {
    ...stream,
    id: `stream-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    created_at: now,
    updated_at: now,
  };
  
  if (client) {
    const { data, error } = await client
      .from('streams')
      .insert(newStream)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating stream:', error);
      const streams = getFromStorage<DbStream[]>(STORAGE_KEYS.streams, []);
      streams.push(newStream);
      saveToStorage(STORAGE_KEYS.streams, streams);
      return newStream;
    }
    return data;
  }
  
  const streams = getFromStorage<DbStream[]>(STORAGE_KEYS.streams, []);
  streams.push(newStream);
  saveToStorage(STORAGE_KEYS.streams, streams);
  return newStream;
}

export async function updateStream(id: string, updates: Partial<DbStream>): Promise<DbStream | null> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();
  
  if (client) {
    const { data, error } = await client
      .from('streams')
      .update({ ...updates, updated_at: now })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating stream:', error);
    }
    return data;
  }
  
  const streams = getFromStorage<DbStream[]>(STORAGE_KEYS.streams, []);
  const index = streams.findIndex(s => s.id === id);
  if (index !== -1) {
    streams[index] = { ...streams[index], ...updates, updated_at: now };
    saveToStorage(STORAGE_KEYS.streams, streams);
    return streams[index];
  }
  return null;
}

// Transaction Operations
export async function getTransactions(filters?: { 
  companyId?: string; 
  employeeId?: string;
  limit?: number;
}): Promise<DbTransaction[]> {
  const client = getSupabaseClient();
  
  if (client) {
    let query = client
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (filters?.companyId) {
      query = query.eq('company_id', filters.companyId);
    }
    if (filters?.employeeId) {
      query = query.eq('employee_id', filters.employeeId);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching transactions:', error);
      return getFromStorage(STORAGE_KEYS.transactions, []);
    }
    return data || [];
  }
  
  return getFromStorage(STORAGE_KEYS.transactions, []);
}

export async function createTransaction(tx: Omit<DbTransaction, 'id' | 'created_at'>): Promise<DbTransaction | null> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();
  
  const newTx: DbTransaction = {
    ...tx,
    id: `tx-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    created_at: now,
  };
  
  if (client) {
    const { data, error } = await client
      .from('transactions')
      .insert(newTx)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating transaction:', error);
      const txs = getFromStorage<DbTransaction[]>(STORAGE_KEYS.transactions, []);
      txs.unshift(newTx);
      saveToStorage(STORAGE_KEYS.transactions, txs);
      return newTx;
    }
    return data;
  }
  
  const txs = getFromStorage<DbTransaction[]>(STORAGE_KEYS.transactions, []);
  txs.unshift(newTx);
  saveToStorage(STORAGE_KEYS.transactions, txs);
  return newTx;
}

export async function updateTransactionStatus(
  txId: string, 
  status: 'pending' | 'confirmed' | 'failed',
  blockHeight?: number
): Promise<boolean> {
  const client = getSupabaseClient();
  
  if (client) {
    const { error } = await client
      .from('transactions')
      .update({ status, block_height: blockHeight })
      .eq('tx_id', txId);
    
    if (error) {
      console.error('Error updating transaction:', error);
      return false;
    }
    return true;
  }
  
  const txs = getFromStorage<DbTransaction[]>(STORAGE_KEYS.transactions, []);
  const index = txs.findIndex(t => t.tx_id === txId);
  if (index !== -1) {
    txs[index].status = status;
    if (blockHeight) txs[index].block_height = blockHeight;
    saveToStorage(STORAGE_KEYS.transactions, txs);
  }
  return true;
}

// Company Operations
export async function getCompany(walletAddress: string): Promise<DbCompany | null> {
  const client = getSupabaseClient();
  
  if (client) {
    const { data, error } = await client
      .from('companies')
      .select('*')
      .eq('wallet_address', walletAddress)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching company:', error);
    }
    return data;
  }
  
  return getFromStorage<DbCompany | null>(STORAGE_KEYS.company, null);
}

export async function createOrUpdateCompany(company: Partial<DbCompany> & { wallet_address: string }): Promise<DbCompany | null> {
  const client = getSupabaseClient();
  const now = new Date().toISOString();
  
  if (client) {
    const { data, error } = await client
      .from('companies')
      .upsert({
        ...company,
        updated_at: now,
        created_at: company.created_at || now,
      }, {
        onConflict: 'wallet_address',
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error upserting company:', error);
    }
    return data;
  }
  
  const existing = getFromStorage<DbCompany | null>(STORAGE_KEYS.company, null);
  const updated: DbCompany = {
    id: existing?.id || `company-${Date.now()}`,
    name: company.name || existing?.name || 'My Company',
    wallet_address: company.wallet_address,
    vault_balance: company.vault_balance ?? existing?.vault_balance ?? 0,
    created_at: existing?.created_at || now,
    updated_at: now,
  };
  saveToStorage(STORAGE_KEYS.company, updated);
  return updated;
}

// User Session
export interface UserSession {
  walletAddress: string;
  role: 'employee' | 'admin';
  name: string;
  email?: string;
  companyId?: string;
  employeeId?: string;
}

export function saveUserSession(session: UserSession): void {
  saveToStorage(STORAGE_KEYS.user, session);
}

export function getUserSession(): UserSession | null {
  return getFromStorage<UserSession | null>(STORAGE_KEYS.user, null);
}

export function clearUserSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.user);
}

// Initialize default data for demo
export function initializeDemoData(walletAddress: string, role: 'admin' | 'employee'): void {
  const companyId = `company-demo-${walletAddress.slice(0, 8)}`;
  
  // Check if demo data already exists
  const existingEmployees = getFromStorage<DbEmployee[]>(STORAGE_KEYS.employees, []);
  if (existingEmployees.length > 0) return;
  
  if (role === 'admin') {
    // Create demo company
    const company: DbCompany = {
      id: companyId,
      name: 'JetrPay Demo Corp',
      wallet_address: walletAddress,
      vault_balance: 500000,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    saveToStorage(STORAGE_KEYS.company, company);
    
    // Create demo employees
    const employees: DbEmployee[] = [
      {
        id: 'emp-demo-1',
        company_id: companyId,
        name: 'Agent 0xAlex',
        role: 'Protocol Engineer',
        status: 'Active',
        salary: 142000,
        rate_per_block: 45,
        wallet_address: 'aleo1demo1...abc',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'emp-demo-2',
        company_id: companyId,
        name: 'Agent Sarah',
        role: 'Security Analyst',
        status: 'Active',
        salary: 115000,
        rate_per_block: 36,
        wallet_address: 'aleo1demo2...def',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'emp-demo-3',
        company_id: companyId,
        name: 'Agent Marcus',
        role: 'UI Architect',
        status: 'Paused',
        salary: 98000,
        rate_per_block: 31,
        wallet_address: 'aleo1demo3...ghi',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    saveToStorage(STORAGE_KEYS.employees, employees);
  }
  
  // Create demo transactions
  const transactions: DbTransaction[] = [
    {
      id: 'tx-demo-1',
      tx_id: 'at1demo1234567890',
      company_id: companyId,
      type: 'deposit',
      amount: 100000,
      status: 'confirmed',
      block_height: 1000001,
      created_at: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'tx-demo-2',
      tx_id: 'at1demo0987654321',
      company_id: companyId,
      type: 'stream_create',
      amount: 142000,
      status: 'confirmed',
      block_height: 1000050,
      created_at: new Date(Date.now() - 43200000).toISOString(),
    },
  ];
  saveToStorage(STORAGE_KEYS.transactions, transactions);
}

export { supabase };
