"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import * as aleo from "./aleo"
import * as db from "./supabase"

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
  isWalletConnecting: boolean
  connectWallet: () => Promise<string>
  disconnectWallet: () => void

  // Network State
  currentBlockHeight: number
  networkStatus: "connected" | "disconnected" | "syncing"

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
  const [isWalletConnecting, setIsWalletConnecting] = useState(false)

  // Network state
  const [currentBlockHeight, setCurrentBlockHeight] = useState(1000000)
  const [networkStatus, setNetworkStatus] = useState<"connected" | "disconnected" | "syncing">("disconnected")

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
        id: Math.random().toString(36).slice(2, 9),
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ])
  }, [])

  // Load persisted session on mount
  useEffect(() => {
    const session = db.getUserSession()
    if (session) {
      setWalletAddress(session.walletAddress)
      setUserRole(session.role)
      setUserName(session.name)
      if (session.email) setUserEmail(session.email)
      setIsLoggedIn(true)
      
      // Initialize demo data if needed
      db.initializeDemoData(session.walletAddress, session.role)
    }
  }, [])

  // Fetch block height periodically
  useEffect(() => {
    const fetchBlockHeight = async () => {
      try {
        const height = await aleo.getCurrentBlockHeight()
        setCurrentBlockHeight(height)
        setNetworkStatus("connected")
      } catch {
        setNetworkStatus("disconnected")
      }
    }

    fetchBlockHeight()
    const interval = setInterval(fetchBlockHeight, 30000)
    return () => clearInterval(interval)
  }, [])

  // Load data when logged in
  useEffect(() => {
    if (isLoggedIn && walletAddress) {
      refreshData()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, walletAddress])

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
      const companyId = `company-demo-${walletAddress.slice(0, 8)}`
      
      // Load employees (for admin)
      if (userRole === "admin") {
        const dbEmployees = await db.getEmployees(companyId)
        const mappedEmployees: Employee[] = dbEmployees.map(emp => ({
          id: emp.id,
          name: emp.name,
          role: emp.role,
          status: emp.status,
          salary: emp.salary,
          ratePerSecond: emp.rate_per_block / 12,
          ratePerBlock: emp.rate_per_block,
          accruedBalance: 0,
          walletAddress: emp.wallet_address,
          startDate: emp.created_at.split("T")[0],
          streamRecord: emp.stream_record,
        }))
        setEmployees(mappedEmployees)
        
        // Load company data
        const company = await db.getCompany(walletAddress)
        if (company) {
          setVaultBalance(company.vault_balance)
        } else {
          // Initialize with demo data
          setVaultBalance(500000)
        }
      }
      
      // Load transactions
      const dbTxs = await db.getTransactions({ companyId, limit: 50 })
      const mappedTxs: Transaction[] = dbTxs.map(tx => ({
        id: tx.id,
        type: tx.type === "stream_create" ? "stream" : tx.type as Transaction["type"],
        amount: tx.amount,
        asset: "USDC",
        timestamp: tx.created_at,
        status: tx.status,
        blockNumber: tx.block_height || currentBlockHeight,
        txId: tx.tx_id,
      }))
      setTransactions(mappedTxs)
      
      // For employees, set their stream data
      if (userRole === "employee") {
        setStreamingRate(0.000045)
        setAccruedBalance(124.52)
      }
      
    } catch (error) {
      console.error("Error refreshing data:", error)
      addNotification({
        title: "Sync Error",
        message: "Failed to sync with network. Using cached data.",
        type: "warning",
      })
    } finally {
      setIsLoading(false)
    }
  }, [walletAddress, userRole, currentBlockHeight, addNotification])

  // Connect wallet
  const connectWallet = async (): Promise<string> => {
    setIsWalletConnecting(true)
    
    try {
      // Try real wallet first
      if (aleo.isWalletAvailable()) {
        const account = await aleo.connectWallet()
        if (account) {
          setWalletAddress(account.address)
          addNotification({
            title: "Aleo Wallet Connected",
            message: `Connected to ${aleo.formatAddress(account.address)}`,
            type: "success",
          })
          return account.address
        }
      }
      
      // Fallback to mock for demo
      const mockAddress = "aleo1" + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 10) + "qrs"
      setWalletAddress(mockAddress)
      addNotification({
        title: "Demo Wallet Connected",
        message: `Using demo wallet ${aleo.formatAddress(mockAddress)}. Install Leo Wallet for real transactions.`,
        type: "warning",
      })
      return mockAddress
      
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
  const disconnectWallet = useCallback(() => {
    aleo.disconnectWallet()
    setWalletAddress(null)
    setIsLoggedIn(false)
    db.clearUserSession()
    addNotification({
      title: "Disconnected",
      message: "Wallet disconnected successfully",
      type: "info",
    })
  }, [addNotification])

  // Add transaction
  const addTransaction = useCallback((tx: Omit<Transaction, "id" | "timestamp" | "status" | "blockNumber">) => {
    const newTx: Transaction = {
      ...tx,
      id: "tx-" + Math.random().toString(36).slice(2, 9),
      timestamp: new Date().toISOString(),
      status: "confirmed",
      blockNumber: currentBlockHeight,
    }
    setTransactions((prev) => [newTx, ...prev])
    
    // Persist to DB
    if (walletAddress) {
      const companyId = `company-demo-${walletAddress.slice(0, 8)}`
      db.createTransaction({
        tx_id: newTx.txId || newTx.id,
        company_id: companyId,
        type: tx.type === "stream" ? "stream_create" : tx.type as db.DbTransaction["type"],
        amount: tx.amount,
        status: "confirmed",
        block_height: currentBlockHeight,
      })
    }
  }, [currentBlockHeight, walletAddress])

  // Withdraw funds
  const withdrawFunds = useCallback(async (amount: number, destination: string) => {
    if (amount <= 0) return
    
    setIsTransacting(true)
    try {
      if (userRole === "employee") {
        if (amount > accruedBalance) {
          addNotification({
            title: "Insufficient Balance",
            message: `Cannot withdraw ${amount} USDC. Available: ${accruedBalance.toFixed(2)} USDC`,
            type: "error",
          })
          return
        }
        setAccruedBalance((prev) => prev - amount)
      } else {
        setVaultBalance((prev) => prev - amount)
      }
      
      addTransaction({ type: "withdrawal", amount, asset: "USDC", to: destination })
      addNotification({
        title: "Withdrawal Successful",
        message: `${amount} USDC sent to ${aleo.formatAddress(destination)}`,
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
  }, [userRole, accruedBalance, addTransaction, addNotification])

  // Deposit funds
  const depositFunds = useCallback(async (amount: number) => {
    if (amount <= 0) return
    
    setIsTransacting(true)
    try {
      setVaultBalance((prev) => prev + amount)
      addTransaction({ type: "deposit", amount, asset: "USDC" })
      
      if (walletAddress) {
        await db.createOrUpdateCompany({
          wallet_address: walletAddress,
          vault_balance: vaultBalance + amount,
        })
      }
      
      addNotification({
        title: "Deposit Confirmed",
        message: `${amount} USDC added to privacy pool`,
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
  }, [vaultBalance, walletAddress, addTransaction, addNotification])

  // Claim salary (employee)
  const claimSalary = useCallback(async (amount: number) => {
    setIsTransacting(true)
    try {
      setAccruedBalance((prev) => Math.max(0, prev - amount))
      
      addTransaction({ type: "claim", amount, asset: "USDC" })
      addNotification({
        title: "Salary Claimed",
        message: `Successfully claimed ${amount} USDC via ZK proof`,
        type: "success",
      })
    } catch (error: any) {
      addNotification({
        title: "Claim Failed",
        message: error.message || "Failed to generate ZK proof",
        type: "error",
      })
    } finally {
      setIsTransacting(false)
    }
  }, [addTransaction, addNotification])

  // Create employee stream (admin)
  const createEmployeeStream = useCallback(async (
    employeeAddress: string,
    ratePerBlock: number,
    maxAmount: number
  ) => {
    setIsTransacting(true)
    try {
      addNotification({
        title: "Stream Created",
        message: `Salary stream initialized for ${aleo.formatAddress(employeeAddress)}`,
        type: "success",
      })
      
      addTransaction({ 
        type: "stream", 
        amount: maxAmount, 
        asset: "USDC",
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
  }, [addTransaction, addNotification])

  // Add employee
  const addEmployee = useCallback(async (emp: Omit<Employee, "id" | "accruedBalance" | "startDate">) => {
    const companyId = walletAddress ? `company-demo-${walletAddress.slice(0, 8)}` : "demo"
    
    const newDbEmployee = await db.createEmployee({
      company_id: companyId,
      name: emp.name,
      role: emp.role,
      status: emp.status,
      salary: emp.salary,
      rate_per_block: emp.ratePerBlock || Math.floor(emp.salary / 31536000 * 12),
      wallet_address: emp.walletAddress,
    })
    
    if (newDbEmployee) {
      const newEmployee: Employee = {
        id: newDbEmployee.id,
        name: newDbEmployee.name,
        role: newDbEmployee.role,
        status: newDbEmployee.status,
        salary: newDbEmployee.salary,
        ratePerSecond: newDbEmployee.rate_per_block / 12,
        ratePerBlock: newDbEmployee.rate_per_block,
        accruedBalance: 0,
        walletAddress: newDbEmployee.wallet_address,
        startDate: newDbEmployee.created_at.split("T")[0],
      }
      
      setEmployees((prev) => [...prev, newEmployee])
      addNotification({
        title: "Employee Added",
        message: `${emp.name} enrolled in payroll protocol`,
        type: "success",
      })
    }
  }, [walletAddress, addNotification])

  // Bulk add employees
  const bulkAddEmployees = useCallback(async (emps: Omit<Employee, "id" | "accruedBalance" | "startDate">[]) => {
    for (const emp of emps) {
      await addEmployee(emp)
    }
    addNotification({
      title: "Bulk Import Complete",
      message: `${emps.length} employees added to protocol`,
      type: "success",
    })
  }, [addEmployee, addNotification])

  // Update employee status
  const updateEmployeeStatus = useCallback(async (id: string, status: "Active" | "Paused") => {
    await db.updateEmployee(id, { status })
    setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)))
    addNotification({
      title: "Status Updated",
      message: `Employee stream ${status === "Active" ? "activated" : "paused"}`,
      type: "info",
    })
  }, [addNotification])

  // Remove employee
  const removeEmployee = useCallback(async (id: string) => {
    await db.deleteEmployee(id)
    setEmployees((prev) => prev.filter((e) => e.id !== id))
    addNotification({
      title: "Employee Removed",
      message: "Stream terminated and access revoked",
      type: "error",
    })
  }, [addNotification])

  // Request advance
  const requestAdvance = useCallback((amount: number, reason: string) => {
    addNotification({
      title: "Advance Requested",
      message: `Request for ${amount} USDC submitted. Reason: ${reason}`,
      type: "warning",
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

  // Persist session when auth changes
  useEffect(() => {
    if (isLoggedIn && walletAddress) {
      db.saveUserSession({
        walletAddress,
        role: userRole,
        name: userName,
        email: userEmail || undefined,
      })
    }
  }, [isLoggedIn, walletAddress, userRole, userName, userEmail])

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userRole,
        setUserRole,
        userName,
        setUserName,
        userEmail,
        setUserEmail,
        walletAddress,
        isWalletConnecting,
        connectWallet,
        disconnectWallet,
        currentBlockHeight,
        networkStatus,
        accruedBalance,
        streamingRate,
        transactions,
        employees,
        myStream,
        companyStats: {
          monthlyBurn: employees.reduce((acc, emp) => acc + (emp.status === "Active" ? emp.salary / 12 : 0), 0),
          vaultBalance,
          totalEmployees: employees.length,
          activeStreams: employees.filter((e) => e.status === "Active").length,
          autoTopUpEnabled: autoTopUpSettings.enabled,
          autoTopUpThreshold: autoTopUpSettings.threshold,
          autoTopUpAmount: autoTopUpSettings.amount,
        },
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
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
        addNotification,
        markNotificationRead,
        clearAllNotifications,
        multiFactorEnabled,
        toggleMultiFactor: () => setMultiFactorEnabled(!multiFactorEnabled),
        privateModeEnabled,
        togglePrivateMode: () => setPrivateModeEnabled(!privateModeEnabled),
        isLoading,
        isTransacting,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
