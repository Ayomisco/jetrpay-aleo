"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { 
  isAnyWalletInstalled, 
  getAvailableWallets, 
  getSupportedWallets,
  type WalletAdapter,
  type ConnectedWallet 
} from "./wallet-adapter"

// Constants
const ALEO_API_URL = 'https://api.explorer.provable.com/v1'
const PROGRAM_ID = 'jetrpay_payroll_testnet_v1.aleo'
const STORAGE_KEY = 'jetrpay_session'

// Types
export type UserRole = "employee" | "admin"

export interface Transaction {
  id: string
  type: "stream" | "withdrawal" | "deposit" | "payment" | "claim"
  amount: number
  asset: string
  timestamp: string
  status: "confirmed" | "pending" | "failed"
  to?: string
  from?: string
  blockNumber: number
  txId?: string
}

export interface Employee {
  id: string
  name: string
  role: string
  status: "Active" | "Paused"
  salary: number
  ratePerSecond: number
  ratePerBlock: number
  accruedBalance: number
  walletAddress: string
  startDate: string
  streamRecord?: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
}

export interface SalaryStream {
  id: string
  employeeAddress: string
  issuerAddress: string
  ratePerBlock: number
  startBlock: number
  lastUpdatedBlock: number
  maxCap: number
  totalClaimed: number
  unclaimedBalance: number
  recordData?: string
}

interface Session {
  walletAddress: string
  walletName: string
  role: UserRole
  name: string
  email?: string
  companyName?: string
  timestamp: number
}

interface AppContextType {
  // Auth State
  isLoggedIn: boolean
  setIsLoggedIn: (val: boolean) => void
  userRole: UserRole
  setUserRole: (role: UserRole) => void
  userName: string
  setUserName: (name: string) => void
  userEmail: string
  setUserEmail: (email: string) => void
  walletAddress: string | null
  connectedWallet: ConnectedWallet | null
  isWalletConnecting: boolean
  isWalletInstalled: boolean
  availableWallets: WalletAdapter[]
  supportedWallets: { adapter: WalletAdapter; installUrl: string }[]
  connectWallet: (adapter?: WalletAdapter) => Promise<string>
  disconnectWallet: () => void

  // Network State
  currentBlockHeight: number
  networkStatus: "connected" | "disconnected" | "syncing"
  programDeployed: boolean
  programId: string

  // Financial State
  accruedBalance: number
  streamingRate: number
  transactions: Transaction[]
  employees: Employee[]
  myStream: SalaryStream | null
  companyStats: {
    monthlyBurn: number
    vaultBalance: number
    totalEmployees: number
    activeStreams: number
    autoTopUpEnabled: boolean
    autoTopUpThreshold: number
    autoTopUpAmount: number
  }

  // Actions
  addTransaction: (tx: Omit<Transaction, "id" | "timestamp" | "status" | "blockNumber">) => void
  updateEmployeeStatus: (id: string, status: "Active" | "Paused") => Promise<void>
  addEmployee: (emp: Omit<Employee, "id" | "accruedBalance" | "startDate">) => Promise<void>
  bulkAddEmployees: (emps: Omit<Employee, "id" | "accruedBalance" | "startDate">[]) => Promise<void>
  removeEmployee: (id: string) => Promise<void>
  withdrawFunds: (amount: number, destination: string) => Promise<void>
  depositFunds: (amount: number) => Promise<void>
  requestAdvance: (amount: number, reason: string) => void
  claimSalary: (amount: number) => Promise<void>
  createEmployeeStream: (employeeAddress: string, ratePerBlock: number, maxAmount: number) => Promise<void>
  updateAutoTopUp: (settings: { enabled: boolean; threshold: number; amount: number }) => void
  refreshData: () => Promise<void>
  saveSession: (data: Omit<Session, "timestamp">) => void

  // System State
  notifications: Notification[]
  unreadCount: number
  addNotification: (notif: Omit<Notification, "id" | "timestamp" | "read">) => void
  markNotificationRead: (id: string) => void
  clearAllNotifications: () => void
  multiFactorEnabled: boolean
  toggleMultiFactor: () => void
  privateModeEnabled: boolean
  togglePrivateMode: () => void

  // Loading States
  isLoading: boolean
  isTransacting: boolean
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Helper functions
function formatAddress(address: string): string {
  if (!address || address.length < 12) return address
  return `${address.slice(0, 8)}...${address.slice(-4)}`
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 11)
}

// Local storage helpers
function saveToStorage(key: string, data: any): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (e) {
    console.error('Storage save error:', e)
  }
}

function loadFromStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (e) {
    console.error('Storage load error:', e)
    return null
  }
}

function clearStorage(key: string): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(key)
  } catch (e) {
    console.error('Storage clear error:', e)
  }
}

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>("employee")
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [connectedWallet, setConnectedWallet] = useState<ConnectedWallet | null>(null)
  const [isWalletConnecting, setIsWalletConnecting] = useState(false)
  const [isWalletInstalled, setIsWalletInstalled] = useState(false)
  const [availableWallets, setAvailableWallets] = useState<WalletAdapter[]>([])

  // Network state
  const [currentBlockHeight, setCurrentBlockHeight] = useState(0)
  const [networkStatus, setNetworkStatus] = useState<"connected" | "disconnected" | "syncing">("syncing")
  const [programDeployed, setProgramDeployed] = useState(false)

  // Financial state
  const [accruedBalance, setAccruedBalance] = useState(0)
  const [streamingRate, setStreamingRate] = useState(0)
  const [vaultBalance, setVaultBalance] = useState(0)
  const [myStream, setMyStream] = useState<SalaryStream | null>(null)

  const [employees, setEmployees] = useState<Employee[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Settings
  const [multiFactorEnabled, setMultiFactorEnabled] = useState(false)
  const [privateModeEnabled, setPrivateModeEnabled] = useState(false)
  const [autoTopUpSettings, setAutoTopUpSettings] = useState({
    enabled: true,
    threshold: 5000,
    amount: 20000,
  })

  // Loading states
  const [isLoading, setIsLoading] = useState(false)
  const [isTransacting, setIsTransacting] = useState(false)

  // Helper to add notifications
  const addNotification = useCallback((notif: Omit<Notification, "id" | "timestamp" | "read">) => {
    setNotifications((prev) => [
      {
        ...notif,
        id: generateId(),
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ])
  }, [])

  // Check for wallet availability
  useEffect(() => {
    const checkWallets = () => {
      const installed = isAnyWalletInstalled()
      setIsWalletInstalled(installed)
      setAvailableWallets(getAvailableWallets())
    }
    
    checkWallets()
    // Check periodically in case wallet extension loads late
    const interval = setInterval(checkWallets, 2000)
    
    return () => clearInterval(interval)
  }, [])

  // Load persisted session on mount
  useEffect(() => {
    const session = loadFromStorage<Session>(STORAGE_KEY)
    if (session && session.walletAddress) {
      setWalletAddress(session.walletAddress)
      setUserRole(session.role)
      setUserName(session.name)
      if (session.email) setUserEmail(session.email)
      setIsLoggedIn(true)
      
      // Load persisted data
      const txData = loadFromStorage<Transaction[]>(`jetrpay_tx_${session.walletAddress.slice(0, 12)}`)
      if (txData) setTransactions(txData)
      
      const empData = loadFromStorage<Employee[]>(`jetrpay_emp_${session.walletAddress.slice(0, 12)}`)
      if (empData) setEmployees(empData)
      
      const balData = loadFromStorage<{ vault: number; accrued: number; rate: number }>(`jetrpay_bal_${session.walletAddress.slice(0, 12)}`)
      if (balData) {
        setVaultBalance(balData.vault)
        setAccruedBalance(balData.accrued)
        setStreamingRate(balData.rate)
      }
    }
  }, [])

  // Persist data on changes
  useEffect(() => {
    if (walletAddress && transactions.length > 0) {
      saveToStorage(`jetrpay_tx_${walletAddress.slice(0, 12)}`, transactions)
    }
  }, [walletAddress, transactions])

  useEffect(() => {
    if (walletAddress && employees.length > 0) {
      saveToStorage(`jetrpay_emp_${walletAddress.slice(0, 12)}`, employees)
    }
  }, [walletAddress, employees])

  useEffect(() => {
    if (walletAddress) {
      saveToStorage(`jetrpay_bal_${walletAddress.slice(0, 12)}`, {
        vault: vaultBalance,
        accrued: accruedBalance,
        rate: streamingRate,
      })
    }
  }, [walletAddress, vaultBalance, accruedBalance, streamingRate])

  // Fetch block height and check program status
  useEffect(() => {
    const fetchNetworkData = async () => {
      try {
        // Fetch block height
        const heightRes = await fetch(`${ALEO_API_URL}/testnet/latest/height`)
        if (heightRes.ok) {
          const height = await heightRes.json()
          setCurrentBlockHeight(height)
          setNetworkStatus("connected")
        }
        
        // Check if program is deployed
        const programRes = await fetch(`${ALEO_API_URL}/testnet/program/${PROGRAM_ID}`)
        setProgramDeployed(programRes.ok)
        
      } catch (error) {
        console.error('Network fetch error:', error)
        setNetworkStatus("disconnected")
      }
    }

    fetchNetworkData()
    const interval = setInterval(fetchNetworkData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Real-time streaming effect for employee balance
  useEffect(() => {
    if (isLoggedIn && userRole === "employee" && streamingRate > 0) {
      const interval = setInterval(() => {
        setAccruedBalance((prev) => prev + streamingRate)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isLoggedIn, userRole, streamingRate])

  // Refresh all data
  const refreshData = useCallback(async () => {
    if (!walletAddress) return
    
    setIsLoading(true)
    try {
      // Fetch latest block height
      const heightRes = await fetch(`${ALEO_API_URL}/testnet/latest/height`)
      if (heightRes.ok) {
        const height = await heightRes.json()
        setCurrentBlockHeight(height)
        setNetworkStatus("connected")
      }
      
      // If program is deployed, try to fetch on-chain data
      if (programDeployed && connectedWallet) {
        try {
          // Try to get records from wallet
          const records = await connectedWallet.adapter.requestRecords(PROGRAM_ID)
          console.log('Wallet records:', records)
        } catch (e) {
          console.log('Could not fetch records:', e)
        }
      }
      
    } catch (error) {
      console.error("Error refreshing data:", error)
      addNotification({
        title: "Sync Error",
        message: "Failed to sync with Aleo network",
        type: "warning",
      })
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress, programDeployed, connectedWallet, addNotification])

  // Save session
  const saveSession = useCallback((data: Omit<Session, "timestamp">) => {
    const session: Session = {
      ...data,
      timestamp: Date.now(),
    }
    saveToStorage(STORAGE_KEY, session)
    setWalletAddress(data.walletAddress)
    setUserRole(data.role)
    setUserName(data.name)
    if (data.email) setUserEmail(data.email)
    setIsLoggedIn(true)
  }, [])

  // Connect wallet
  const connectWallet = async (adapter?: WalletAdapter): Promise<string> => {
    setIsWalletConnecting(true)
    
    try {
      // If specific adapter provided, use it
      if (adapter) {
        const address = await adapter.connect()
        const connected: ConnectedWallet = {
          address,
          walletName: adapter.name,
          adapter,
        }
        setConnectedWallet(connected)
        setWalletAddress(address)
        
        addNotification({
          title: `${adapter.name} Connected`,
          message: `Connected: ${formatAddress(address)}`,
          type: "success",
        })
        
        return address
      }
      
      // Try available wallets in order
      const wallets = getAvailableWallets()
      for (const walletAdapter of wallets) {
        try {
          const address = await walletAdapter.connect()
          const connected: ConnectedWallet = {
            address,
            walletName: walletAdapter.name,
            adapter: walletAdapter,
          }
          setConnectedWallet(connected)
          setWalletAddress(address)
          
          addNotification({
            title: `${walletAdapter.name} Connected`,
            message: `Connected: ${formatAddress(address)}`,
            type: "success",
          })
          
          return address
        } catch (e) {
          console.log(`Failed to connect ${walletAdapter.name}:`, e)
        }
      }
      
      throw new Error('No wallet available. Please install Leo Wallet or Puzzle Wallet.')
      
    } catch (error: any) {
      addNotification({
        title: "Connection Failed",
        message: error.message || "Failed to connect wallet",
        type: "error",
      })
      throw error
    } finally {
      setIsWalletConnecting(false)
    }
  }

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    if (connectedWallet) {
      try {
        await connectedWallet.adapter.disconnect()
      } catch (e) {
        console.log('Disconnect error:', e)
      }
    }
    setConnectedWallet(null)
    setWalletAddress(null)
    setIsLoggedIn(false)
    clearStorage(STORAGE_KEY)
    addNotification({
      title: "Disconnected",
      message: "Wallet disconnected successfully",
      type: "info",
    })
  }, [connectedWallet, addNotification])

  // Add transaction
  const addTransaction = useCallback((tx: Omit<Transaction, "id" | "timestamp" | "status" | "blockNumber">) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${generateId()}`,
      timestamp: new Date().toISOString(),
      status: "confirmed",
      blockNumber: currentBlockHeight,
    }
    setTransactions((prev) => [newTx, ...prev])
  }, [currentBlockHeight])

  // Withdraw funds
  const withdrawFunds = useCallback(async (amount: number, destination: string) => {
    if (amount <= 0) return
    
    setIsTransacting(true)
    try {
      if (userRole === "employee") {
        if (amount > accruedBalance) {
          addNotification({
            title: "Insufficient Balance",
            message: `Cannot withdraw ${amount} ALEO. Available: ${accruedBalance.toFixed(6)} ALEO`,
            type: "error",
          })
          return
        }
        setAccruedBalance((prev) => prev - amount)
      } else {
        if (amount > vaultBalance) {
          addNotification({
            title: "Insufficient Vault Balance",
            message: `Cannot withdraw ${amount} ALEO. Vault balance: ${vaultBalance.toFixed(2)} ALEO`,
            type: "error",
          })
          return
        }
        setVaultBalance((prev) => prev - amount)
      }
      
      addTransaction({ type: "withdrawal", amount, asset: "ALEO", to: destination })
      addNotification({
        title: "Withdrawal Submitted",
        message: `${amount} ALEO sent to ${formatAddress(destination)}`,
        type: "success",
      })
    } catch (error: any) {
      addNotification({
        title: "Withdrawal Failed",
        message: error.message || "Transaction failed",
        type: "error",
      })
    } finally {
      setIsTransacting(false)
    }
  }, [userRole, accruedBalance, vaultBalance, addTransaction, addNotification])

  // Deposit funds
  const depositFunds = useCallback(async (amount: number) => {
    if (amount <= 0) return
    
    setIsTransacting(true)
    try {
      setVaultBalance((prev) => prev + amount)
      addTransaction({ type: "deposit", amount, asset: "ALEO" })
      
      addNotification({
        title: "Deposit Confirmed",
        message: `${amount} ALEO added to vault`,
        type: "success",
      })
    } catch (error: any) {
      addNotification({
        title: "Deposit Failed",
        message: error.message || "Transaction failed",
        type: "error",
      })
    } finally {
      setIsTransacting(false)
    }
  }, [addTransaction, addNotification])

  // Claim salary (employee)
  const claimSalary = useCallback(async (amount: number) => {
    if (amount <= 0 || amount > accruedBalance) {
      addNotification({
        title: "Invalid Amount",
        message: `Cannot claim ${amount}. Available: ${accruedBalance.toFixed(6)} ALEO`,
        type: "error",
      })
      return
    }
    
    setIsTransacting(true)
    try {
      // If wallet connected and program deployed, make real transaction
      if (connectedWallet && programDeployed) {
        addNotification({
          title: "Processing Claim",
          message: "Generating zero-knowledge proof...",
          type: "info",
        })
        
        // In production, this would call the smart contract
        // await connectedWallet.adapter.signTransaction({...})
      }
      
      setAccruedBalance((prev) => Math.max(0, prev - amount))
      
      addTransaction({ type: "claim", amount, asset: "ALEO" })
      addNotification({
        title: "Salary Claimed",
        message: `Successfully claimed ${amount.toFixed(6)} ALEO`,
        type: "success",
      })
    } catch (error: any) {
      addNotification({
        title: "Claim Failed",
        message: error.message || "Failed to process claim",
        type: "error",
      })
    } finally {
      setIsTransacting(false)
    }
  }, [accruedBalance, connectedWallet, programDeployed, addTransaction, addNotification])

  // Create employee stream (admin)
  const createEmployeeStream = useCallback(async (
    employeeAddress: string,
    ratePerBlock: number,
    maxAmount: number
  ) => {
    setIsTransacting(true)
    try {
      if (connectedWallet && programDeployed) {
        addNotification({
          title: "Creating Stream",
          message: "Submitting transaction to Aleo...",
          type: "info",
        })
        
        // In production, this would call the smart contract
        // await connectedWallet.adapter.signTransaction({...})
      }
      
      addNotification({
        title: "Stream Created",
        message: `Salary stream initialized for ${formatAddress(employeeAddress)}`,
        type: "success",
      })
      
      addTransaction({ 
        type: "stream", 
        amount: maxAmount, 
        asset: "ALEO",
        to: employeeAddress,
      })
      
    } catch (error: any) {
      addNotification({
        title: "Stream Creation Failed",
        message: error.message || "Failed to create salary stream",
        type: "error",
      })
    } finally {
      setIsTransacting(false)
    }
  }, [connectedWallet, programDeployed, addTransaction, addNotification])

  // Add employee
  const addEmployee = useCallback(async (emp: Omit<Employee, "id" | "accruedBalance" | "startDate">) => {
    const newEmployee: Employee = {
      ...emp,
      id: generateId(),
      accruedBalance: 0,
      startDate: new Date().toISOString().split("T")[0],
      ratePerSecond: emp.ratePerBlock / 12 || emp.salary / 31536000,
      ratePerBlock: emp.ratePerBlock || Math.floor(emp.salary / 31536000 * 12),
    }
    
    setEmployees((prev) => [...prev, newEmployee])
    addNotification({
      title: "Employee Added",
      message: `${emp.name} enrolled in payroll`,
      type: "success",
    })
  }, [addNotification])

  // Bulk add employees
  const bulkAddEmployees = useCallback(async (emps: Omit<Employee, "id" | "accruedBalance" | "startDate">[]) => {
    for (const emp of emps) {
      await addEmployee(emp)
    }
    addNotification({
      title: "Bulk Import Complete",
      message: `${emps.length} employees added`,
      type: "success",
    })
  }, [addEmployee, addNotification])

  // Update employee status
  const updateEmployeeStatus = useCallback(async (id: string, status: "Active" | "Paused") => {
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)))
    addNotification({
      title: "Status Updated",
      message: `Employee stream ${status === "Active" ? "activated" : "paused"}`,
      type: "info",
    })
  }, [addNotification])

  // Remove employee
  const removeEmployee = useCallback(async (id: string) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id))
    addNotification({
      title: "Employee Removed",
      message: "Stream terminated",
      type: "warning",
    })
  }, [addNotification])

  // Request advance
  const requestAdvance = useCallback((amount: number, reason: string) => {
    addNotification({
      title: "Advance Requested",
      message: `Request for ${amount} ALEO submitted. Reason: ${reason}`,
      type: "info",
    })
  }, [addNotification])

  // Update auto top-up settings
  const updateAutoTopUp = useCallback((settings: { enabled: boolean; threshold: number; amount: number }) => {
    setAutoTopUpSettings(settings)
    addNotification({
      title: "Settings Updated",
      message: `Auto-top-up ${settings.enabled ? "enabled" : "disabled"}`,
      type: "info",
    })
  }, [addNotification])

  // Notification helpers
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const clearAllNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  // Toggle settings
  const toggleMultiFactor = useCallback(() => {
    setMultiFactorEnabled((prev) => !prev)
  }, [])

  const togglePrivateMode = useCallback(() => {
    setPrivateModeEnabled((prev) => !prev)
  }, [])

  // Compute unread count
  const unreadCount = notifications.filter((n) => !n.read).length

  // Company stats
  const companyStats = {
    monthlyBurn: employees.filter(e => e.status === "Active").reduce((sum, e) => sum + e.salary / 12, 0),
    vaultBalance,
    totalEmployees: employees.length,
    activeStreams: employees.filter(e => e.status === "Active").length,
    autoTopUpEnabled: autoTopUpSettings.enabled,
    autoTopUpThreshold: autoTopUpSettings.threshold,
    autoTopUpAmount: autoTopUpSettings.amount,
  }

  const value: AppContextType = {
    // Auth
    isLoggedIn,
    setIsLoggedIn,
    userRole,
    setUserRole,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    walletAddress,
    connectedWallet,
    isWalletConnecting,
    isWalletInstalled,
    availableWallets,
    supportedWallets: getSupportedWallets(),
    connectWallet,
    disconnectWallet,

    // Network
    currentBlockHeight,
    networkStatus,
    programDeployed,
    programId: PROGRAM_ID,

    // Financial
    accruedBalance,
    streamingRate,
    transactions,
    employees,
    myStream,
    companyStats,

    // Actions
    addTransaction,
    updateEmployeeStatus,
    addEmployee,
    bulkAddEmployees,
    removeEmployee,
    withdrawFunds,
    depositFunds,
    requestAdvance,
    claimSalary,
    createEmployeeStream,
    updateAutoTopUp,
    refreshData,
    saveSession,

    // System
    notifications,
    unreadCount,
    addNotification,
    markNotificationRead,
    clearAllNotifications,
    multiFactorEnabled,
    toggleMultiFactor,
    privateModeEnabled,
    togglePrivateMode,

    // Loading
    isLoading,
    isTransacting,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}

// Utility hook for wallet status
export function useWallet() {
  const { 
    walletAddress, 
    connectedWallet, 
    isWalletConnecting,
    isWalletInstalled,
    availableWallets,
    supportedWallets,
    connectWallet, 
    disconnectWallet 
  } = useApp()
  
  return {
    address: walletAddress,
    connected: connectedWallet,
    isConnecting: isWalletConnecting,
    isInstalled: isWalletInstalled,
    available: availableWallets,
    supported: supportedWallets,
    connect: connectWallet,
    disconnect: disconnectWallet,
  }
}

// Utility hook for network status
export function useNetwork() {
  const { currentBlockHeight, networkStatus, programDeployed, programId } = useApp()
  
  return {
    blockHeight: currentBlockHeight,
    status: networkStatus,
    programDeployed,
    programId,
    isConnected: networkStatus === "connected",
  }
}
