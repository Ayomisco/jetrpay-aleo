"use client"

import { useState, useEffect } from "react"
import { 
  Shield, Building2, User, Wallet, FileText, 
  Fingerprint, Loader2, ArrowLeft, Check, AlertCircle, 
  Search, Building, ExternalLink, Download
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/lib/app-context-v2"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Storage keys
const STORAGE_KEYS = {
  companies: 'jetrpay_companies',
  employees: 'jetrpay_employees',
  company: 'jetrpay_company',
  user: 'jetrpay_user',
}

function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving to localStorage:', error)
  }
}

function formatAddress(address: string): string {
  if (!address || address.length < 12) return address
  return `${address.slice(0, 8)}...${address.slice(-4)}`
}

interface CompanyData {
  id: string
  name: string
  industry: string
  size: string
  country: string
  walletAddress: string
  vaultBalance: number
  riskScore: number
  verified: boolean
  createdAt: string
}

interface EmployeeProfile {
  id: string
  companyId: string
  companyName: string
  name: string
  email: string
  role: string
  department: string
  walletAddress: string
  salary: number
  ratePerBlock: number
  riskScore: number
  verified: boolean
  startDate: string
  createdAt: string
}

export default function Onboarding() {
  const { 
    setIsLoggedIn, 
    setUserRole, 
    setUserName, 
    setUserEmail, 
    connectWallet,
    saveSession,
    isWalletInstalled,
    availableWallets,
    supportedWallets,
    networkStatus,
    currentBlockHeight,
    programDeployed,
  } = useApp()
  
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<"employee" | "admin" | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [connectedWalletName, setConnectedWalletName] = useState<string | null>(null)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  
  // Enterprise form state
  const [companyName, setCompanyName] = useState("")
  const [industry, setIndustry] = useState("")
  const [companySize, setCompanySize] = useState("")
  const [country, setCountry] = useState("")
  const [kybStatus, setKybStatus] = useState<"pending" | "verifying" | "verified" | null>(null)
  
  // Employee form state
  const [employeeSearch, setEmployeeSearch] = useState("")
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null)
  const [employeeName, setEmployeeName] = useState("")
  const [employeeEmail, setEmployeeEmail] = useState("")
  const [employeeRole, setEmployeeRole] = useState("")
  const [employeeDepartment, setEmployeeDepartment] = useState("")
  const [kycStatus, setKycStatus] = useState<"pending" | "verifying" | "verified" | null>(null)

  // Companies list
  const [companies, setCompanies] = useState<CompanyData[]>([])

  // Load companies on mount
  useEffect(() => {
    const storedCompanies = getFromStorage<CompanyData[]>(STORAGE_KEYS.companies, [])
    setCompanies(storedCompanies)
  }, [])

  // Handle wallet connection
  const handleConnectWallet = async (walletAdapter?: any) => {
    setIsConnecting(true)
    setConnectionError(null)
    
    try {
      const address = await connectWallet(walletAdapter)
      setConnectedWallet(address)
      setConnectedWalletName(walletAdapter?.name || availableWallets[0]?.name || "Wallet")
      setShowWalletModal(false)
      setStep(3) // Move to form step
    } catch (error: any) {
      console.error("Wallet connection error:", error)
      // Show user-friendly error
      const errorMsg = error.message || "Failed to connect wallet"
      setConnectionError(errorMsg)
    } finally {
      setIsConnecting(false)
    }
  }

  // Demo mode - use generated wallet for hackathon demo
  const handleDemoMode = () => {
    const demoAddress = "aleo1demo" + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 8) + "xyz"
    setConnectedWallet(demoAddress)
    setConnectedWalletName("Demo Wallet")
    setConnectionError(null)
    setStep(3) // Move to form step
  }

  // Simulate KYB verification
  const simulateKybVerification = async () => {
    setKybStatus("verifying")
    await new Promise(resolve => setTimeout(resolve, 2000))
    setKybStatus("verified")
    
    // Generate a risk score (80-100 for verified companies)
    const riskScore = Math.floor(Math.random() * 20) + 80
    
    // Create company
    const newCompany: CompanyData = {
      id: `company-${Date.now()}`,
      name: companyName,
      industry,
      size: companySize,
      country,
      walletAddress: connectedWallet!,
      vaultBalance: 0,
      riskScore,
      verified: true,
      createdAt: new Date().toISOString(),
    }
    
    const updatedCompanies = [...companies, newCompany]
    setCompanies(updatedCompanies)
    saveToStorage(STORAGE_KEYS.companies, updatedCompanies)
    saveToStorage(STORAGE_KEYS.company, newCompany)
    
    // Complete onboarding
    saveSession({
      walletAddress: connectedWallet!,
      walletName: connectedWalletName || "Wallet",
      role: "admin",
      name: companyName,
      companyName: companyName,
    })
    
    setUserRole("admin")
    setUserName(companyName)
    setIsLoggedIn(true)
  }

  // Simulate KYC verification
  const simulateKycVerification = async () => {
    setKycStatus("verifying")
    await new Promise(resolve => setTimeout(resolve, 2000))
    setKycStatus("verified")
    
    // Generate a risk score
    const riskScore = Math.floor(Math.random() * 20) + 80
    
    // Create employee profile
    const newEmployee: EmployeeProfile = {
      id: `employee-${Date.now()}`,
      companyId: selectedCompany!.id,
      companyName: selectedCompany!.name,
      name: employeeName,
      email: employeeEmail,
      role: employeeRole,
      department: employeeDepartment,
      walletAddress: connectedWallet!,
      salary: 75000,
      ratePerBlock: Math.floor(75000 / 31536000 * 12),
      riskScore,
      verified: true,
      startDate: new Date().toISOString().split("T")[0],
      createdAt: new Date().toISOString(),
    }
    
    const storedEmployees = getFromStorage<EmployeeProfile[]>(STORAGE_KEYS.employees, [])
    saveToStorage(STORAGE_KEYS.employees, [...storedEmployees, newEmployee])
    saveToStorage(STORAGE_KEYS.user, newEmployee)
    
    // Complete onboarding
    saveSession({
      walletAddress: connectedWallet!,
      walletName: connectedWalletName || "Wallet",
      role: "employee",
      name: employeeName,
      email: employeeEmail,
    })
    
    setUserRole("employee")
    setUserName(employeeName)
    setUserEmail(employeeEmail)
    setIsLoggedIn(true)
  }

  // Filter companies for search
  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(employeeSearch.toLowerCase())
  )

  // Render wallet selection modal
  const renderWalletModal = () => (
    <Dialog open={showWalletModal} onOpenChange={setShowWalletModal}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-blue-500" />
            Connect Wallet
          </DialogTitle>
          <DialogDescription>
            Connect your Aleo wallet to continue. Your wallet is required for secure, private transactions.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 py-4">
          {/* Network Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm">
            <span className="text-muted-foreground">Network</span>
            <span className="flex items-center gap-2">
              <span className={cn(
                "h-2 w-2 rounded-full",
                networkStatus === "connected" ? "bg-green-500" : 
                networkStatus === "syncing" ? "bg-yellow-500 animate-pulse" : "bg-red-500"
              )} />
              Aleo Testnet
            </span>
          </div>
          
          {currentBlockHeight > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 text-sm">
              <span className="text-muted-foreground">Block Height</span>
              <span className="font-mono">{currentBlockHeight.toLocaleString()}</span>
            </div>
          )}
          
          {/* Available Wallets */}
          {availableWallets.length > 0 ? (
            <div className="space-y-2">
              <p className="text-sm font-medium">Available Wallets</p>
              {availableWallets.map((wallet) => (
                <Button
                  key={wallet.name}
                  variant="outline"
                  className="w-full justify-between h-14"
                  onClick={() => handleConnectWallet(wallet)}
                  disabled={isConnecting}
                >
                  <span className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Wallet className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-medium">{wallet.name}</span>
                  </span>
                  {isConnecting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  )}
                </Button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium text-yellow-500">No Wallet Detected</p>
                  <p className="text-sm text-muted-foreground">
                    Install an Aleo wallet to connect. We recommend Leo Wallet.
                  </p>
                </div>
              </div>
              
              <p className="text-sm font-medium">Install a Wallet</p>
              {supportedWallets.map(({ adapter, installUrl }) => (
                <Button
                  key={adapter.name}
                  variant="outline"
                  className="w-full justify-between h-14"
                  onClick={() => window.open(installUrl, '_blank')}
                >
                  <span className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Download className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <span className="font-medium block">{adapter.name}</span>
                      <span className="text-xs text-muted-foreground">Click to install</span>
                    </div>
                  </span>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </Button>
              ))}
            </div>
          )}
          
          {connectionError && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <span className="text-red-500">{connectionError}</span>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )

  // Step 1: Role Selection
  const renderRoleSelection = () => (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome to JetrPay</h1>
        <p className="text-muted-foreground">Private payroll on Aleo. Choose how you want to get started.</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        {/* Enterprise Card */}
        <button
          onClick={() => { setRole("admin"); setStep(2); }}
          className={cn(
            "relative p-6 rounded-xl border-2 text-left transition-all hover:border-blue-500/50 hover:bg-blue-500/5",
            role === "admin" ? "border-blue-500 bg-blue-500/10" : "border-border"
          )}
        >
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Enterprise</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Register your company for private, compliant payroll management
              </p>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-500" />
                <span>KYB Verification</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-500" />
                <span>Manage Employee Streams</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-blue-500" />
                <span>Privacy-First Payroll</span>
              </li>
            </ul>
          </div>
        </button>

        {/* Employee Card */}
        <button
          onClick={() => { setRole("employee"); setStep(2); }}
          className={cn(
            "relative p-6 rounded-xl border-2 text-left transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5",
            role === "employee" ? "border-emerald-500 bg-emerald-500/10" : "border-border"
          )}
        >
          <div className="space-y-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Employee</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Join your company's payroll and access your earnings
              </p>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Real-Time Earnings</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Private Claims (ZK Proof)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Instant Withdrawals</span>
              </li>
            </ul>
          </div>
        </button>
      </div>
      
      {/* Network Status */}
      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className={cn(
            "h-2 w-2 rounded-full",
            networkStatus === "connected" ? "bg-green-500" : 
            networkStatus === "syncing" ? "bg-yellow-500 animate-pulse" : "bg-red-500"
          )} />
          Aleo Testnet
        </span>
        {currentBlockHeight > 0 && (
          <span className="font-mono">Block #{currentBlockHeight.toLocaleString()}</span>
        )}
        {programDeployed && (
          <span className="flex items-center gap-1 text-green-500">
            <Check className="h-3 w-3" />
            Contract Deployed
          </span>
        )}
      </div>
    </div>
  )

  // Step 2: Connect Wallet
  const renderWalletStep = () => (
    <div className="space-y-6">
      <button 
        onClick={() => { setStep(1); setRole(null); }}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      
      <div className="text-center space-y-2">
        <div className={cn(
          "h-14 w-14 rounded-2xl mx-auto flex items-center justify-center",
          role === "admin" 
            ? "bg-gradient-to-br from-blue-500 to-blue-600" 
            : "bg-gradient-to-br from-emerald-500 to-emerald-600"
        )}>
          <Wallet className="h-7 w-7 text-white" />
        </div>
        <h2 className="text-2xl font-bold">Connect Wallet</h2>
        <p className="text-muted-foreground text-sm">
          {role === "admin" 
            ? "Connect your wallet to manage payroll"
            : "Connect to access your salary stream"
          }
        </p>
      </div>
      
      <div className="space-y-3 max-w-sm mx-auto">
        {/* Primary Connect Button */}
        <Button
          size="lg"
          className="w-full h-12"
          onClick={() => {
            if (isWalletInstalled) {
              handleConnectWallet(availableWallets[0])
            } else {
              // Auto-generate demo wallet if no wallet installed
              const demoAddress = "aleo1" + Math.random().toString(36).slice(2, 12) + Math.random().toString(36).slice(2, 12) + "qrs"
              setConnectedWallet(demoAddress)
              setConnectedWalletName("Aleo Wallet")
              setStep(3)
            }
          }}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : isWalletInstalled ? (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Connect {availableWallets[0]?.name || "Wallet"}
            </>
          ) : (
            <>
              <Wallet className="mr-2 h-4 w-4" />
              Continue with Wallet
            </>
          )}
        </Button>

        {connectionError && (
          <p className="text-xs text-center text-red-400">{connectionError}</p>
        )}

        {!isWalletInstalled && (
          <p className="text-xs text-center text-muted-foreground">
            <a href="https://www.leo.app/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              Install Leo Wallet
            </a>
            {" "}for full blockchain features
          </p>
        )}
      </div>
    </div>
  )

  // Step 3: Enterprise Registration Form
  const renderEnterpriseForm = () => (
    <div className="space-y-6">
      <button 
        onClick={() => { setStep(2); setConnectedWallet(null); }}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Register Your Company</h2>
        <p className="text-muted-foreground">Complete KYB verification to enable private payroll</p>
      </div>
      
      {/* Connected Wallet */}
      <div className="p-4 rounded-xl border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium">Wallet Connected</p>
              <p className="text-sm text-muted-foreground font-mono">
                {formatAddress(connectedWallet || "")}
              </p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-500">
            {connectedWalletName}
          </span>
        </div>
      </div>
      
      {kybStatus === null ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              placeholder="Acme Corporation"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="industry">Industry *</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companySize">Company Size *</Label>
              <Select value={companySize} onValueChange={setCompanySize}>
                <SelectTrigger id="companySize">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 employees</SelectItem>
                  <SelectItem value="11-50">11-50 employees</SelectItem>
                  <SelectItem value="51-200">51-200 employees</SelectItem>
                  <SelectItem value="201-1000">201-1000 employees</SelectItem>
                  <SelectItem value="1000+">1000+ employees</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Country *</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="UK">United Kingdom</SelectItem>
                  <SelectItem value="DE">Germany</SelectItem>
                  <SelectItem value="FR">France</SelectItem>
                  <SelectItem value="SG">Singapore</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            className="w-full h-12"
            disabled={!companyName || !industry || !companySize || !country}
            onClick={() => setKybStatus("pending")}
          >
            <FileText className="mr-2 h-4 w-4" />
            Start KYB Verification
          </Button>
        </div>
      ) : kybStatus === "pending" ? (
        <div className="space-y-4">
          <div className="p-6 rounded-xl border bg-card text-center space-y-4">
            <div className="h-16 w-16 mx-auto rounded-full bg-blue-500/20 flex items-center justify-center">
              <FileText className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Ready for Verification</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Click below to start automated KYB verification for {companyName}
              </p>
            </div>
            <Button className="w-full" onClick={simulateKybVerification}>
              <Fingerprint className="mr-2 h-4 w-4" />
              Begin Verification
            </Button>
          </div>
        </div>
      ) : kybStatus === "verifying" ? (
        <div className="p-8 rounded-xl border bg-card text-center space-y-4">
          <Loader2 className="h-12 w-12 mx-auto text-blue-500 animate-spin" />
          <div>
            <h3 className="font-semibold text-lg">Verifying Company</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Running compliance checks and risk assessment...
            </p>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-xl border bg-card text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Verification Complete!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {companyName} is now verified for private payroll
            </p>
          </div>
          <Loader2 className="h-5 w-5 mx-auto animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      )}
    </div>
  )

  // Step 3: Employee Registration Form
  const renderEmployeeForm = () => (
    <div className="space-y-6">
      <button 
        onClick={() => { setStep(2); setConnectedWallet(null); }}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Join Your Company</h2>
        <p className="text-muted-foreground">Complete KYC verification to access your salary stream</p>
      </div>
      
      {/* Connected Wallet */}
      <div className="p-4 rounded-xl border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="font-medium">Wallet Connected</p>
              <p className="text-sm text-muted-foreground font-mono">
                {formatAddress(connectedWallet || "")}
              </p>
            </div>
          </div>
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-500">
            {connectedWalletName}
          </span>
        </div>
      </div>
      
      {kycStatus === null && !selectedCompany ? (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Find Your Company</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for your company..."
                value={employeeSearch}
                onChange={(e) => setEmployeeSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {companies.length === 0 ? (
            <div className="p-8 rounded-xl border bg-card text-center space-y-3">
              <Building className="h-12 w-12 mx-auto text-muted-foreground" />
              <div>
                <h3 className="font-medium">No Companies Registered</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Ask your employer to register on JetrPay first
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filteredCompanies.map((company) => (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompany(company)}
                  className="w-full p-4 rounded-xl border bg-card hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                      {company.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{company.name}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{company.industry}</span>
                        <span>•</span>
                        <span>{company.size} employees</span>
                        {company.verified && (
                          <>
                            <span>•</span>
                            <span className="text-green-500 flex items-center gap-1">
                              <Check className="h-3 w-3" />
                              Verified
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : kycStatus === null && selectedCompany ? (
        <div className="space-y-4">
          {/* Selected Company */}
          <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {selectedCompany.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{selectedCompany.name}</p>
                  <p className="text-xs text-muted-foreground">{selectedCompany.industry}</p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedCompany(null)}
              >
                Change
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeName">Full Name *</Label>
              <Input
                id="employeeName"
                placeholder="John Doe"
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employeeEmail">Email *</Label>
              <Input
                id="employeeEmail"
                type="email"
                placeholder="john@company.com"
                value={employeeEmail}
                onChange={(e) => setEmployeeEmail(e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeRole">Role *</Label>
              <Input
                id="employeeRole"
                placeholder="Software Engineer"
                value={employeeRole}
                onChange={(e) => setEmployeeRole(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employeeDepartment">Department *</Label>
              <Select value={employeeDepartment} onValueChange={setEmployeeDepartment}>
                <SelectTrigger id="employeeDepartment">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engineering">Engineering</SelectItem>
                  <SelectItem value="product">Product</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="sales">Sales</SelectItem>
                  <SelectItem value="hr">Human Resources</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            className="w-full h-12"
            disabled={!employeeName || !employeeEmail || !employeeRole || !employeeDepartment}
            onClick={() => setKycStatus("pending")}
          >
            <Fingerprint className="mr-2 h-4 w-4" />
            Start KYC Verification
          </Button>
        </div>
      ) : kycStatus === "pending" ? (
        <div className="p-6 rounded-xl border bg-card text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Fingerprint className="h-8 w-8 text-emerald-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Ready for Verification</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Click below to verify your identity for {selectedCompany?.name}
            </p>
          </div>
          <Button className="w-full" onClick={simulateKycVerification}>
            <Fingerprint className="mr-2 h-4 w-4" />
            Begin Verification
          </Button>
        </div>
      ) : kycStatus === "verifying" ? (
        <div className="p-8 rounded-xl border bg-card text-center space-y-4">
          <Loader2 className="h-12 w-12 mx-auto text-emerald-500 animate-spin" />
          <div>
            <h3 className="font-semibold text-lg">Verifying Identity</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Running identity verification and compliance checks...
            </p>
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-xl border bg-card text-center space-y-4">
          <div className="h-16 w-16 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
            <Check className="h-8 w-8 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Welcome, {employeeName}!</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You're now verified at {selectedCompany?.name}
            </p>
          </div>
          <Loader2 className="h-5 w-5 mx-auto animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background to-muted/30">
      <div className="w-full max-w-xl">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">J</span>
          </div>
          <span className="text-xl font-bold">JetrPay</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500 font-medium">
            on Aleo
          </span>
        </div>
        
        {/* Content */}
        <div className="rounded-2xl border bg-card/50 backdrop-blur-sm p-8">
          {step === 1 && renderRoleSelection()}
          {step === 2 && renderWalletStep()}
          {step === 3 && role === "admin" && renderEnterpriseForm()}
          {step === 3 && role === "employee" && renderEmployeeForm()}
        </div>
        
        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to JetrPay's Terms of Service and Privacy Policy
        </p>
      </div>
      
      {renderWalletModal()}
    </div>
  )
}
