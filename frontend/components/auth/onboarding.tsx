"use client"

import { useState, useEffect } from "react"
import { Shield, Building2, User, Wallet, Lock, FileText, Fingerprint, Loader2, ArrowLeft, Check, AlertCircle, Search, Building, Users, Globe, CreditCard, ExternalLink, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"
import { formatAddress, isWalletAvailable } from "@/lib/aleo"
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
  const { setIsLoggedIn, setUserRole, setUserName, setUserEmail, connectWallet } = useApp()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<"employee" | "admin" | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [walletAvailable, setWalletAvailable] = useState(false)
  
  // Check wallet availability on mount
  useEffect(() => {
    const checkWallet = () => {
      setWalletAvailable(isWalletAvailable())
    }
    checkWallet()
    // Re-check periodically in case user installs wallet
    const interval = setInterval(checkWallet, 2000)
    return () => clearInterval(interval)
  }, [])
  
  // Enterprise registration
  const [companyData, setCompanyData] = useState({
    name: "",
    industry: "",
    size: "",
    country: "",
    taxId: "",
    website: "",
  })
  
  // Employee registration
  const [employeeData, setEmployeeData] = useState({
    name: "",
    email: "",
    companyCode: "",
    department: "",
  })
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null)
  const [companySearchResults, setCompanySearchResults] = useState<CompanyData[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // Processing states
  const [verificationStep, setVerificationStep] = useState(0)
  const [riskAssessment, setRiskAssessment] = useState<{score: number, factors: string[]} | null>(null)

  // Initialize companies registry
  useEffect(() => {
    const companies = getFromStorage<CompanyData[]>(STORAGE_KEYS.companies, [])
    if (companies.length === 0) {
      // Seed with some demo companies
      const demoCompanies: CompanyData[] = [
        {
          id: "comp-001",
          name: "Aleo Labs Inc",
          industry: "Blockchain",
          size: "50-200",
          country: "United States",
          walletAddress: "aleo1aleolabs...xyz",
          vaultBalance: 500000,
          riskScore: 92,
          verified: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "comp-002",
          name: "DeFi Solutions Ltd",
          industry: "Finance",
          size: "10-50",
          country: "Singapore",
          walletAddress: "aleo1defisol...abc",
          vaultBalance: 250000,
          riskScore: 88,
          verified: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: "comp-003",
          name: "Privacy Protocol DAO",
          industry: "Technology",
          size: "10-50",
          country: "Switzerland",
          walletAddress: "aleo1privacy...def",
          vaultBalance: 1000000,
          riskScore: 95,
          verified: true,
          createdAt: new Date().toISOString(),
        },
      ]
      saveToStorage(STORAGE_KEYS.companies, demoCompanies)
    }
  }, [])

  const handleRoleSelection = (selectedRole: "employee" | "admin") => {
    setRole(selectedRole)
    setUserRole(selectedRole)
    setStep(2)
    setShowWalletModal(true)
  }

  const handleConnectWallet = async () => {
    if (!walletAvailable) {
      // Open Leo Wallet install page
      window.open("https://www.leo.app/", "_blank")
      return
    }
    
    setIsConnecting(true)
    try {
      const addr = await connectWallet()
      setConnectedWallet(addr)
      setShowWalletModal(false)
      setStep(3)
    } catch (error) {
      console.error("Wallet connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }
  
  const handleUseDemoWallet = async () => {
    setIsConnecting(true)
    try {
      const addr = await connectWallet()
      setConnectedWallet(addr)
      setShowWalletModal(false)
      setStep(3)
    } catch (error) {
      console.error("Wallet connection error:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const searchCompanies = (query: string) => {
    setEmployeeData({...employeeData, companyCode: query})
    if (query.length < 2) {
      setCompanySearchResults([])
      return
    }
    
    setIsSearching(true)
    setTimeout(() => {
      const companies = getFromStorage<CompanyData[]>(STORAGE_KEYS.companies, [])
      const results = companies.filter(c => 
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.id.toLowerCase().includes(query.toLowerCase())
      )
      setCompanySearchResults(results)
      setIsSearching(false)
    }, 500)
  }

  const selectCompany = (company: CompanyData) => {
    setSelectedCompany(company)
    setEmployeeData({...employeeData, companyCode: company.name})
    setCompanySearchResults([])
  }

  const handleEnterpriseRegistration = () => {
    if (!companyData.name || !companyData.industry || !connectedWallet) return
    
    setStep(4) // Go to verification
    
    // Simulate verification process
    let stepCount = 0
    const interval = setInterval(() => {
      stepCount++
      setVerificationStep(stepCount)
      
      if (stepCount === 3) {
        // Calculate risk score
        const riskScore = Math.floor(85 + Math.random() * 15) // 85-100
        setRiskAssessment({
          score: riskScore,
          factors: [
            "Business registration verified",
            "Wallet history clean",
            "Industry risk: Low",
            "Geographic risk: Low",
          ]
        })
      }
      
      if (stepCount >= 4) {
        clearInterval(interval)
        
        // Create company
        const newCompany: CompanyData = {
          id: `comp-${Date.now()}`,
          name: companyData.name,
          industry: companyData.industry,
          size: companyData.size || "1-10",
          country: companyData.country || "Unknown",
          walletAddress: connectedWallet!,
          vaultBalance: 0,
          riskScore: riskAssessment?.score || 90,
          verified: true,
          createdAt: new Date().toISOString(),
        }
        
        // Save to storage
        const companies = getFromStorage<CompanyData[]>(STORAGE_KEYS.companies, [])
        companies.push(newCompany)
        saveToStorage(STORAGE_KEYS.companies, companies)
        saveToStorage(STORAGE_KEYS.company, newCompany)
        
        // Save user session
        const userSession = {
          walletAddress: connectedWallet!,
          role: 'admin' as const,
          name: companyData.name,
          companyId: newCompany.id,
        }
        saveToStorage(STORAGE_KEYS.user, userSession)
        
        setUserName(companyData.name)
        setStep(5)
      }
    }, 1200)
  }

  const handleEmployeeRegistration = () => {
    if (!employeeData.name || !selectedCompany || !connectedWallet) return
    
    setStep(4) // Go to verification
    
    // Simulate verification process
    let stepCount = 0
    const interval = setInterval(() => {
      stepCount++
      setVerificationStep(stepCount)
      
      if (stepCount === 3) {
        // Calculate employee risk score
        const riskScore = Math.floor(80 + Math.random() * 20) // 80-100
        setRiskAssessment({
          score: riskScore,
          factors: [
            "Identity verified",
            "Employment confirmed",
            `Company verification: ${selectedCompany.verified ? "Verified" : "Pending"}`,
            "Financial history: Clean",
          ]
        })
      }
      
      if (stepCount >= 4) {
        clearInterval(interval)
        
        // Create employee profile
        const newEmployee: EmployeeProfile = {
          id: `emp-${Date.now()}`,
          companyId: selectedCompany.id,
          companyName: selectedCompany.name,
          name: employeeData.name,
          email: employeeData.email,
          role: "Employee",
          department: employeeData.department || "General",
          walletAddress: connectedWallet!,
          salary: 0,
          ratePerBlock: 0,
          riskScore: riskAssessment?.score || 85,
          verified: true,
          startDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }
        
        // Save to storage
        const employees = getFromStorage<EmployeeProfile[]>(STORAGE_KEYS.employees, [])
        employees.push(newEmployee)
        saveToStorage(STORAGE_KEYS.employees, employees)
        
        // Save user session
        const userSession = {
          walletAddress: connectedWallet!,
          role: 'employee' as const,
          name: employeeData.name,
          email: employeeData.email,
          companyId: selectedCompany.id,
          employeeId: newEmployee.id,
        }
        saveToStorage(STORAGE_KEYS.user, userSession)
        
        setUserName(employeeData.name)
        setUserEmail(employeeData.email)
        setStep(5)
      }
    }, 1200)
  }

  useEffect(() => {
    if (step === 5) {
      const timer = setTimeout(() => setIsLoggedIn(true), 2500)
      return () => clearTimeout(timer)
    }
  }, [step, setIsLoggedIn])

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 font-mono overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-20" />

      <div className="max-w-xl w-full relative z-10">
        <div className="bg-black border border-white/10 p-8 sm:p-12 relative shadow-2xl">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black italic">
              J
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter italic text-white uppercase">JETRPAY</h1>
              <div className="px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/30 inline-block mt-1">
                <span className="text-cyan-400 font-black text-[7px] uppercase tracking-widest">on Aleo</span>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex gap-1 mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={cn("h-1 flex-1 transition-colors", step >= i ? "bg-cyan-500" : "bg-white/5")} />
            ))}
          </div>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">SELECT ACCESS TYPE</h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">
                  Choose your role to begin private payroll streaming on Aleo
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelection("employee")}
                  className="p-6 border-2 border-white/5 hover:border-cyan-500/50 transition-all text-left bg-white/[0.02] group"
                >
                  <User className="w-8 h-8 mb-4 text-neutral-600 group-hover:text-cyan-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest">EMPLOYEE</h3>
                  <p className="text-[9px] text-neutral-500 mt-1 uppercase">Join your company & receive private salary</p>
                </button>
                <button
                  onClick={() => handleRoleSelection("admin")}
                  className="p-6 border-2 border-white/5 hover:border-orange-500/50 transition-all text-left bg-white/[0.02] group"
                >
                  <Building2 className="w-8 h-8 mb-4 text-neutral-600 group-hover:text-orange-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest">ENTERPRISE</h3>
                  <p className="text-[9px] text-neutral-500 mt-1 uppercase">Register company & manage payroll</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Connect Wallet */}
          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <button onClick={() => { setStep(1); setShowWalletModal(false); }} className="text-[10px] text-neutral-500 flex items-center gap-2 hover:text-white">
                <ArrowLeft className="w-3 h-3" /> BACK
              </button>
              <div className="space-y-2">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">CONNECT ALEO WALLET</h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                  {role === "admin" ? "Connect wallet to register your enterprise" : "Connect wallet to join your company"}
                </p>
              </div>
              
              {/* Wallet Options */}
              <div className="space-y-4">
                {/* Leo Wallet - Primary Option */}
                <button
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className={cn(
                    "w-full p-6 border-2 text-left transition-all group",
                    walletAvailable 
                      ? "border-cyan-500/50 bg-cyan-500/5 hover:bg-cyan-500/10" 
                      : "border-white/10 bg-white/[0.02] hover:border-cyan-500/30"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-black text-white uppercase">Leo Wallet</p>
                          {walletAvailable && (
                            <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-[8px] font-bold uppercase">Detected</span>
                          )}
                        </div>
                        <p className="text-[9px] text-neutral-500 uppercase mt-1">
                          {walletAvailable ? "Click to connect your wallet" : "Install the official Aleo wallet"}
                        </p>
                      </div>
                    </div>
                    {!walletAvailable && (
                      <ExternalLink className="w-4 h-4 text-neutral-500 group-hover:text-cyan-400" />
                    )}
                    {isConnecting && (
                      <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />
                    )}
                  </div>
                </button>

                {/* Install Instructions if wallet not available */}
                {!walletAvailable && (
                  <div className="p-4 bg-orange-500/5 border border-orange-500/20">
                    <div className="flex items-start gap-3">
                      <Download className="w-4 h-4 text-orange-500 mt-0.5" />
                      <div>
                        <p className="text-[9px] text-orange-500 font-bold uppercase">Wallet Not Detected</p>
                        <p className="text-[9px] text-neutral-500 mt-1">
                          Install Leo Wallet from <a href="https://www.leo.app/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">leo.app</a> to connect with the Aleo network.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Demo Mode Option */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-black text-[9px] text-neutral-600 uppercase">Or continue with</span>
                  </div>
                </div>

                <button
                  onClick={handleUseDemoWallet}
                  disabled={isConnecting}
                  className="w-full p-4 border border-white/10 bg-white/[0.02] hover:bg-white/5 text-left transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral-900 border border-white/10 rounded flex items-center justify-center">
                      <Shield className="w-5 h-5 text-neutral-500" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-neutral-400 uppercase">Demo Mode</p>
                      <p className="text-[9px] text-neutral-600 uppercase mt-0.5">
                        Explore with a simulated wallet (no real transactions)
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Privacy Note */}
              <div className="p-4 border border-cyan-500/20 bg-cyan-500/5">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-cyan-500" />
                  <div>
                    <p className="text-[9px] text-cyan-400 font-bold uppercase">Zero-Knowledge Privacy</p>
                    <p className="text-[9px] text-neutral-500">Your identity and transactions remain private on Aleo</p>
                  </div>
                </div>
              </div>
                
              {connectedWallet && (
                <div className="mt-4 p-3 bg-black border border-white/10">
                  <p className="text-[9px] text-neutral-500 uppercase mb-1">Connected Wallet</p>
                  <p className="text-xs font-mono text-cyan-400">{formatAddress(connectedWallet)}</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Registration Form - Enterprise */}
          {step === 3 && role === "admin" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <button onClick={() => setStep(2)} className="text-[10px] text-neutral-500 flex items-center gap-2 hover:text-white">
                <ArrowLeft className="w-3 h-3" /> BACK
              </button>
              <div className="space-y-2">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">REGISTER ENTERPRISE</h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                  Complete KYB verification for private payroll
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Company Name *</Label>
                  <Input
                    value={companyData.name}
                    onChange={(e) => setCompanyData({...companyData, name: e.target.value})}
                    placeholder="ACME Corp"
                    className="h-12 bg-black border-white/10 text-white font-bold tracking-widest uppercase"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Industry *</Label>
                    <Select value={companyData.industry} onValueChange={(v) => setCompanyData({...companyData, industry: v})}>
                      <SelectTrigger className="h-12 bg-black border-white/10 text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/10 text-white">
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="finance">Finance</SelectItem>
                        <SelectItem value="blockchain">Blockchain</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Company Size</Label>
                    <Select value={companyData.size} onValueChange={(v) => setCompanyData({...companyData, size: v})}>
                      <SelectTrigger className="h-12 bg-black border-white/10 text-white">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-black border-white/10 text-white">
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="10-50">10-50</SelectItem>
                        <SelectItem value="50-200">50-200</SelectItem>
                        <SelectItem value="200+">200+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Country</Label>
                    <Input
                      value={companyData.country}
                      onChange={(e) => setCompanyData({...companyData, country: e.target.value})}
                      placeholder="United States"
                      className="h-12 bg-black border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Tax ID</Label>
                    <Input
                      value={companyData.taxId}
                      onChange={(e) => setCompanyData({...companyData, taxId: e.target.value})}
                      placeholder="XX-XXXXXXX"
                      className="h-12 bg-black border-white/10 text-white font-mono"
                    />
                  </div>
                </div>
                
                <div className="p-4 bg-orange-500/5 border border-orange-500/20 mt-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-[9px] text-orange-500 font-bold uppercase">KYB Verification</p>
                      <p className="text-[9px] text-neutral-500 mt-1">Your company will be verified via ZK-proof on Aleo. No sensitive data is stored on-chain.</p>
                    </div>
                  </div>
                </div>
                
                <Button
                  onClick={handleEnterpriseRegistration}
                  disabled={!companyData.name || !companyData.industry}
                  className="w-full h-14 bg-orange-500 text-black hover:bg-orange-400 font-black uppercase text-xs tracking-widest mt-4"
                >
                  BEGIN VERIFICATION
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Employee - Company Search */}
          {step === 3 && role === "employee" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <button onClick={() => setStep(2)} className="text-[10px] text-neutral-500 flex items-center gap-2 hover:text-white">
                <ArrowLeft className="w-3 h-3" /> BACK
              </button>
              <div className="space-y-2">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">JOIN YOUR COMPANY</h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                  Find your employer and complete verification
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Your Name *</Label>
                  <Input
                    value={employeeData.name}
                    onChange={(e) => setEmployeeData({...employeeData, name: e.target.value})}
                    placeholder="John Doe"
                    className="h-12 bg-black border-white/10 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Work Email</Label>
                  <Input
                    type="email"
                    value={employeeData.email}
                    onChange={(e) => setEmployeeData({...employeeData, email: e.target.value})}
                    placeholder="john@company.com"
                    className="h-12 bg-black border-white/10 text-white"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Find Your Company *</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <Input
                      value={employeeData.companyCode}
                      onChange={(e) => searchCompanies(e.target.value)}
                      placeholder="Search by company name or ID"
                      className="h-12 bg-black border-white/10 text-white pl-10"
                    />
                    {isSearching && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-500 animate-spin" />}
                  </div>
                  
                  {companySearchResults.length > 0 && (
                    <div className="border border-white/10 bg-black max-h-40 overflow-y-auto">
                      {companySearchResults.map((company) => (
                        <button
                          key={company.id}
                          onClick={() => selectCompany(company)}
                          className="w-full p-3 text-left hover:bg-white/5 border-b border-white/5 last:border-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-bold text-white">{company.name}</p>
                              <p className="text-[9px] text-neutral-500">{company.industry} • {company.size} employees</p>
                            </div>
                            {company.verified && <Check className="w-4 h-4 text-green-500" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {selectedCompany && (
                  <div className="p-4 bg-cyan-500/5 border border-cyan-500/30">
                    <div className="flex items-center gap-3">
                      <Building className="w-8 h-8 text-cyan-500" />
                      <div className="flex-1">
                        <p className="text-xs font-black text-white uppercase">{selectedCompany.name}</p>
                        <p className="text-[9px] text-neutral-500">{selectedCompany.industry} • {selectedCompany.country}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-neutral-500 uppercase">Risk Score</p>
                        <p className={cn("text-sm font-black", selectedCompany.riskScore >= 80 ? "text-green-500" : "text-orange-500")}>
                          {selectedCompany.riskScore}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Department</Label>
                  <Select value={employeeData.department} onValueChange={(v) => setEmployeeData({...employeeData, department: v})}>
                    <SelectTrigger className="h-12 bg-black border-white/10 text-white">
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/10 text-white">
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="operations">Operations</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="hr">Human Resources</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button
                  onClick={handleEmployeeRegistration}
                  disabled={!employeeData.name || !selectedCompany}
                  className="w-full h-14 bg-cyan-500 text-black hover:bg-cyan-400 font-black uppercase text-xs tracking-widest mt-4"
                >
                  VERIFY & JOIN
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Verification Process */}
          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-black italic tracking-tighter uppercase">
                  {role === "admin" ? "KYB VERIFICATION" : "KYC VERIFICATION"}
                </h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                  Processing ZK-proof verification on Aleo
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  { label: "Identity Verification", icon: Fingerprint },
                  { label: role === "admin" ? "Business Registration" : "Employment Confirmation", icon: FileText },
                  { label: "Risk Assessment", icon: Shield },
                  { label: "ZK-Proof Generation", icon: Lock },
                ].map((item, i) => (
                  <div key={i} className={cn(
                    "p-4 border flex items-center gap-4 transition-all",
                    verificationStep > i ? "border-green-500/30 bg-green-500/5" :
                    verificationStep === i ? "border-cyan-500/30 bg-cyan-500/5" :
                    "border-white/5 bg-white/[0.02]"
                  )}>
                    <div className={cn(
                      "w-8 h-8 flex items-center justify-center border",
                      verificationStep > i ? "border-green-500 bg-green-500/20" :
                      verificationStep === i ? "border-cyan-500 bg-cyan-500/20" :
                      "border-white/10"
                    )}>
                      {verificationStep > i ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : verificationStep === i ? (
                        <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" />
                      ) : (
                        <item.icon className="w-4 h-4 text-neutral-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "text-xs font-black uppercase tracking-widest",
                        verificationStep >= i ? "text-white" : "text-neutral-500"
                      )}>{item.label}</p>
                    </div>
                    {verificationStep > i && <span className="text-[9px] text-green-500 font-bold uppercase">VERIFIED</span>}
                  </div>
                ))}
              </div>
              
              {riskAssessment && (
                <div className="p-4 border border-cyan-500/30 bg-cyan-500/5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-black uppercase text-white">Risk Assessment</p>
                    <div className={cn(
                      "px-3 py-1 font-black text-sm",
                      riskAssessment.score >= 85 ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"
                    )}>
                      {riskAssessment.score}/100
                    </div>
                  </div>
                  <div className="space-y-2">
                    {riskAssessment.factors.map((factor, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3 h-3 text-cyan-500" />
                        <span className="text-[9px] text-neutral-400">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 text-center py-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-2 border-green-500/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                <Check className="absolute inset-0 m-auto w-8 h-8 text-green-500" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white uppercase italic">
                  {role === "admin" ? "ENTERPRISE VERIFIED" : "IDENTITY VERIFIED"}
                </h3>
                <p className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">
                  ZK-PROOF DEPLOYED ON ALEO_TESTNET
                </p>
              </div>
              
              {riskAssessment && (
                <div className="inline-block px-6 py-3 bg-white/5 border border-white/10">
                  <p className="text-[9px] text-neutral-500 uppercase mb-1">Your Risk Score</p>
                  <p className={cn(
                    "text-2xl font-black",
                    riskAssessment.score >= 85 ? "text-green-400" : "text-orange-400"
                  )}>{riskAssessment.score}/100</p>
                </div>
              )}
              
              <div className="w-full h-1 bg-white/5 overflow-hidden">
                <div className="h-full bg-cyan-500 animate-progress-indefinite" />
              </div>
              <p className="text-[9px] text-neutral-500 uppercase">Redirecting to dashboard...</p>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between px-2 text-[8px] font-black text-neutral-700 uppercase tracking-[0.3em]">
          <span className="flex items-center gap-2">
            <Lock className="w-3 h-3" /> END_TO_END_ENCRYPTED
          </span>
          <span>JETRPAY_ALEO_2026</span>
        </div>
      </div>
    </div>
  )
}
