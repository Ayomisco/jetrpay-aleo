"use client"

import { useState, useEffect } from "react"
import { Shield, Building2, User, Wallet, Lock, FileText, Fingerprint } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/lib/app-context"
import { cn } from "@/lib/utils"

export default function Onboarding() {
  const { setIsLoggedIn, setUserRole, setUserName, setUserEmail, connectWallet } = useApp()
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<"employee" | "admin" | null>(null)
  const [authMethod, setAuthMethod] = useState<"magic" | "web3" | null>(null)
  const [emailInput, setEmailInput] = useState("")
  const [kycProcessing, setKycProcessing] = useState(false)

  const handleRoleSelection = (selectedRole: "employee" | "admin") => {
    setRole(selectedRole)
    setUserRole(selectedRole)
    setStep(2)
  }

  const handleAuth = async (method: "magic" | "web3") => {
    setAuthMethod(method)
    if (method === "web3") {
      const addr = await connectWallet()
      setUserName(`AGENT_${addr.slice(0, 6)}`)
    } else if (emailInput) {
      setUserEmail(emailInput)
      setUserName(emailInput.split("@")[0].toUpperCase())
    }
    setStep(3)
  }

  const startVerification = () => {
    setKycProcessing(true)
    setTimeout(() => {
      setKycProcessing(false)
      setStep(4)
    }, 3000)
  }

  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => setIsLoggedIn(true), 4000)
      return () => clearTimeout(timer)
    }
  }, [step, setIsLoggedIn])

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4 font-mono overflow-hidden">
      <div className="absolute inset-0 grid-bg pointer-events-none opacity-20" />

      <div className="max-w-xl w-full relative z-10">
        <div className="bg-black border border-white/10 p-8 sm:p-12 relative shadow-2xl">
          {/* Progress Indicator */}
          <div className="flex gap-1 mb-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={cn("h-1 flex-1 transition-colors", step >= i ? "bg-orange-500" : "bg-white/5")} />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">INITIALIZE PROTOCOL</h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest leading-relaxed">
                  Select your access level to begin streaming real-time payroll.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleRoleSelection("employee")}
                  className="p-6 border-2 border-white/5 hover:border-orange-500/50 transition-all text-left bg-white/[0.02] group"
                >
                  <User className="w-8 h-8 mb-4 text-neutral-600 group-hover:text-orange-500" />
                  <h3 className="text-xs font-black uppercase tracking-widest">AGENT</h3>
                  <p className="text-[9px] text-neutral-500 mt-1 uppercase">EMPLOYEE INTERFACE</p>
                </button>
                <button
                  onClick={() => handleRoleSelection("admin")}
                  className="p-6 border-2 border-white/5 hover:border-cyan-500/50 transition-all text-left bg-white/[0.02] group"
                >
                  <Building2 className="w-8 h-8 mb-4 text-neutral-600 group-hover:text-cyan-400" />
                  <h3 className="text-xs font-black uppercase tracking-widest">ENTERPRISE</h3>
                  <p className="text-[9px] text-neutral-500 mt-1 uppercase">COMPANY MANAGEMENT</p>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">ESTABLISH IDENTITY</h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                  Connect via Web3Auth or link your enterprise identifier.
                </p>
              </div>
              <div className="space-y-4">
                <Button
                  onClick={() => handleAuth("web3")}
                  className="w-full h-16 bg-white text-black hover:bg-neutral-200 font-black uppercase text-xs tracking-widest"
                >
                  <Wallet className="w-4 h-4 mr-2" /> CONNECT SECURE WALLET
                </Button>
                <div className="flex items-center gap-4 py-2">
                  <div className="h-px bg-white/10 flex-1" />
                  <span className="text-[9px] text-neutral-600 font-black">OR ENTERPRISE LINK</span>
                  <div className="h-px bg-white/10 flex-1" />
                </div>
                <div className="space-y-3">
                  <Input
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="E-MAIL IDENTIFIER"
                    className="h-14 bg-black border-white/10 text-white font-bold tracking-widest uppercase focus:border-orange-500/50"
                  />
                  <Button
                    disabled={!emailInput}
                    onClick={() => handleAuth("magic")}
                    className="w-full h-14 border border-white/20 hover:bg-white/5 text-white font-black uppercase text-[10px] tracking-widest bg-transparent"
                  >
                    SEND MAGIC LINK
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-black italic tracking-tighter uppercase">
                  {role === "admin" ? "KYB_VERIFY" : "KYC_VERIFY"}
                </h2>
                <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                  Compliance protocols required for Arbitrum mainnet streaming.
                </p>
              </div>
              <div className="bg-white/5 p-6 border border-white/10 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-none">
                    <FileText className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[10px] font-black uppercase text-white mb-1">Upload Identity Docs</h4>
                    <p className="text-[9px] text-neutral-500 uppercase">Passport / Govt ID / Tax ID</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/5 rounded-none">
                    <Fingerprint className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-[10px] font-black uppercase text-white mb-1">Biometric Hash</h4>
                    <p className="text-[9px] text-neutral-500 uppercase">Face / Liveness check</p>
                  </div>
                </div>
              </div>
              <Button
                onClick={startVerification}
                disabled={kycProcessing}
                className="w-full h-14 bg-orange-500 text-black hover:bg-orange-600 font-black uppercase text-xs tracking-widest"
              >
                {kycProcessing ? "VERIFYING_PROTOCOL..." : "INITIALIZE VERIFICATION"}
              </Button>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in zoom-in-95 text-center py-6">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 border-2 border-orange-500/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                <Shield className="absolute inset-0 m-auto w-8 h-8 text-orange-500 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white uppercase italic">DEPLOYING AGENT</h3>
                <p className="text-[9px] text-green-400 font-bold uppercase tracking-widest">
                  IDENTITY_CONFIRMED: ARBITRUM_ONE
                </p>
              </div>
              <div className="w-full h-1 bg-white/5 overflow-hidden">
                <div className="h-full bg-orange-500 animate-progress-indefinite" />
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-between px-2 text-[8px] font-black text-neutral-700 uppercase tracking-[0.3em]">
          <span className="flex items-center gap-2">
            <Lock className="w-3 h-3" /> END_TO_END_ENCRYPTED
          </span>
          <span>JETRPAY_LABS_2026</span>
        </div>
      </div>
    </div>
  )
}
