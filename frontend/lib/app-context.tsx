"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// Types
export type UserRole = "employee" | "admin"

export interface Transaction {
  id: string
  type: "stream" | "withdrawal" | "deposit" | "payment"
  amount: number
  asset: string
  timestamp: string
  status: "confirmed" | "pending" | "failed"
  to?: string
  from?: string
  blockNumber: number
}

export interface Employee {
  id: string
  name: string
  role: string
  status: "Active" | "Paused"
  salary: number
  ratePerSecond: number
  accruedBalance: number
  walletAddress: string
  startDate: string
}

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  timestamp: string
  read: boolean
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
  connectWallet: () => Promise<string>

  // Financial State
  accruedBalance: number
  streamingRate: number // per second
  transactions: Transaction[]
  employees: Employee[]
  companyStats: {
    monthlyBurn: number
    vaultBalance: number
    totalEmployees: number
    autoTopUpEnabled: boolean
    autoTopUpThreshold: number
    autoTopUpAmount: number
  }

  // Actions
  addTransaction: (tx: Omit<Transaction, "id" | "timestamp" | "status" | "blockNumber">) => void
  updateEmployeeStatus: (id: string, status: "Active" | "Paused") => void
  addEmployee: (emp: Employee) => void
  bulkAddEmployees: (emps: Employee[]) => void
  removeEmployee: (id: string) => void
  withdrawFunds: (amount: number, destination: string) => void
  depositFunds: (amount: number) => void
  requestAdvance: (amount: number, reason: string) => void
  updateAutoTopUp: (settings: { enabled: boolean; threshold: number; amount: number }) => void

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
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: AppShellProps) {
  // Existing state with persistence
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<UserRole>("employee")
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  // Financial state
  const [accruedBalance, setAccruedBalance] = useState(124.52)
  const [streamingRate, setStreamingRate] = useState(0.000045)
  const [vaultBalance, setVaultBalance] = useState(420500.0)

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      name: "Agent 0xAlex",
      role: "Protocol Engineer",
      status: "Active",
      salary: 142000,
      ratePerSecond: 0.0045,
      accruedBalance: 1245.2,
      walletAddress: "0x71...C4",
      startDate: "2025-01-01",
    },
    {
      id: "2",
      name: "Agent Sarah",
      role: "Security Analyst",
      status: "Active",
      salary: 115000,
      ratePerSecond: 0.0036,
      accruedBalance: 842.1,
      walletAddress: "0x3A...F1",
      startDate: "2025-03-12",
    },
    {
      id: "3",
      name: "Agent Marcus",
      role: "UI Architect",
      status: "Paused",
      salary: 98000,
      ratePerSecond: 0.0031,
      accruedBalance: 0,
      walletAddress: "0x9E...B2",
      startDate: "2025-05-20",
    },
  ])

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: "tx-78923",
      type: "stream",
      amount: 0.00045,
      asset: "USDC",
      timestamp: new Date().toISOString(),
      status: "confirmed",
      blockNumber: 82951,
    },
    {
      id: "tx-78922",
      type: "withdrawal",
      amount: 50.0,
      asset: "USDC",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "confirmed",
      to: "0x...F2",
      blockNumber: 82945,
    },
    {
      id: "tx-78921",
      type: "deposit",
      amount: 1000.0,
      asset: "USDC",
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      status: "confirmed",
      from: "0x...A1",
      blockNumber: 82890,
    },
  ])

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Stream Initialized",
      message: "Your Arbitrum One salary stream is now active.",
      type: "success",
      timestamp: new Date().toISOString(),
      read: false,
    },
  ])

  // Settings
  const [multiFactorEnabled, setMultiFactorEnabled] = useState(false)
  const [privateModeEnabled, setPrivateModeEnabled] = useState(false)

  // Auto-top-up settings
  const [autoTopUpSettings, setAutoTopUpSettings] = useState({
    enabled: true,
    threshold: 5000,
    amount: 20000,
  })

  // Real-time streaming effect
  useEffect(() => {
    if (isLoggedIn && userRole === "employee") {
      const interval = setInterval(() => {
        setAccruedBalance((prev) => prev + streamingRate)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isLoggedIn, userRole, streamingRate])

  // Actions
  const connectWallet = async () => {
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        const addr = "0x" + Math.random().toString(16).slice(2, 10) + "..." + Math.random().toString(16).slice(2, 6)
        setWalletAddress(addr)
        addNotification({
          title: "Wallet Linked",
          message: `Arbitrum address ${addr} connected successfully.`,
          type: "success",
        })
        resolve(addr)
      }, 1500)
    })
  }

  const addTransaction = (tx: Omit<Transaction, "id" | "timestamp" | "status" | "blockNumber">) => {
    const newTx: Transaction = {
      ...tx,
      id: "tx-" + Math.random().toString(36).slice(2, 9),
      timestamp: new Date().toISOString(),
      status: "confirmed",
      blockNumber: 83000 + transactions.length,
    }
    setTransactions((prev) => [newTx, ...prev])
  }

  const withdrawFunds = (amount: number, destination: string) => {
    if (amount <= accruedBalance) {
      setAccruedBalance((prev) => prev - amount)
      addTransaction({ type: "withdrawal", amount, asset: "USDC", to: destination })
      addNotification({
        title: "Withdrawal Successful",
        message: `${amount} USDC transferred to ${destination}`,
        type: "success",
      })
    }
  }

  const depositFunds = (amount: number) => {
    setVaultBalance((prev) => prev + amount)
    addTransaction({ type: "deposit", amount, asset: "USDC" })
    addNotification({
      title: "Deposit Confirmed",
      message: `${amount} USDC added to protocol liquidity.`,
      type: "success",
    })
  }

  const requestAdvance = (amount: number, reason: string) => {
    addNotification({
      title: "Advance Requested",
      message: `Request for ${amount} USDC submitted for approval. Reason: ${reason}`,
      type: "warning",
    })
  }

  const addNotification = (notif: Omit<Notification, "id" | "timestamp" | "read">) => {
    setNotifications((prev) => [
      {
        ...notif,
        id: Math.random().toString(36).slice(2, 9),
        timestamp: new Date().toISOString(),
        read: false,
      },
      ...prev,
    ])
  }

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const bulkAddEmployees = (newEmps: Employee[]) => {
    setEmployees((prev) => [...prev, ...newEmps])
    addNotification({
      title: "Bulk Import Complete",
      message: `${newEmps.length} new agents enrolled via CSV protocol.`,
      type: "success",
    })
  }

  const updateAutoTopUp = (settings: { enabled: boolean; threshold: number; amount: number }) => {
    setAutoTopUpSettings(settings)
    addNotification({
      title: "Vault Strategy Updated",
      message: `Auto-top-up ${settings.enabled ? "enabled" : "disabled"} at ${settings.threshold} USDC.`,
      type: "info",
    })
  }

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
        connectWallet,
        accruedBalance,
        streamingRate,
        transactions,
        employees,
        companyStats: {
          monthlyBurn: employees.reduce((acc, emp) => acc + (emp.status === "Active" ? emp.salary / 12 : 0), 0),
          vaultBalance,
          totalEmployees: employees.length,
          autoTopUpEnabled: autoTopUpSettings.enabled,
          autoTopUpThreshold: autoTopUpSettings.threshold,
          autoTopUpAmount: autoTopUpSettings.amount,
        },
        addTransaction,
        updateEmployeeStatus: (id, status) => {
          setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, status } : e)))
          addNotification({
            title: "Status Updated",
            message: `Employee stream status changed to ${status}.`,
            type: "info",
          })
        },
        addEmployee: (emp) => {
          setEmployees((prev) => [...prev, emp])
          addNotification({
            title: "Agent Enrolled",
            message: `${emp.name} added to protocol payroll.`,
            type: "success",
          })
        },
        bulkAddEmployees,
        updateAutoTopUp,
        removeEmployee: (id) => {
          setEmployees((prev) => prev.filter((e) => e.id !== id))
          addNotification({
            title: "Access Revoked",
            message: "Employee access and stream terminated.",
            type: "error",
          })
        },
        withdrawFunds,
        depositFunds,
        requestAdvance,
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
        addNotification,
        markNotificationRead,
        clearAllNotifications,
        multiFactorEnabled,
        toggleMultiFactor: () => setMultiFactorEnabled(!multiFactorEnabled),
        privateModeEnabled,
        togglePrivateMode: () => setPrivateModeEnabled(!privateModeEnabled),
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

interface AppShellProps {
  children: ReactNode
}
