"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Network, Lock, Users, Fingerprint, Eye, EyeOff, RefreshCw, Loader2 } from "lucide-react"
import { useApp } from "@/lib/app-context-v2"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { formatAddress } from "@/lib/aleo"

export default function SystemSettings() {
  const { 
    multiFactorEnabled, 
    toggleMultiFactor, 
    privateModeEnabled, 
    togglePrivateMode, 
    addNotification, 
    userRole,
    walletAddress,
    currentBlockHeight,
    networkStatus,
    refreshData,
    isLoading,
    disconnectWallet
  } =
    useApp()
  const [signingThreshold, setSigningThreshold] = useState(3)

  const isAdmin = userRole === "admin"

  return (
    <div className="space-y-6">
      {/* Network Status */}
      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-neutral-500 px-1">
        <span className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", networkStatus === "connected" ? "bg-cyan-500" : "bg-red-500")} />
          {networkStatus === "connected" ? "ALEO_TESTNET" : "DISCONNECTED"}
        </span>
        <span>Block: {currentBlockHeight.toLocaleString()}</span>
        {walletAddress && <span>Wallet: {formatAddress(walletAddress)}</span>}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={refreshData}
          disabled={isLoading}
          className="text-[9px] text-cyan-400 hover:text-cyan-300 h-6"
        >
          {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3 mr-1" />}
          Sync
        </Button>
      </div>

      <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">Aleo Protocol Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Controls */}
        <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
          <CardHeader className="flex flex-row items-center gap-3 border-b border-neutral-900">
            <Shield className="w-5 h-5 text-cyan-500" />
            <CardTitle className="text-xs font-black uppercase tracking-widest text-white">ZK Security & Auth</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {/* Wallet Info */}
            {walletAddress && (
              <div className="p-3 bg-black border border-cyan-500/30 space-y-2">
                <p className="text-[9px] font-bold text-cyan-400 uppercase">Connected Aleo Wallet</p>
                <p className="text-xs font-mono text-white break-all">{walletAddress}</p>
                <Button
                  onClick={disconnectWallet}
                  variant="outline"
                  size="sm"
                  className="mt-2 text-[9px] font-bold uppercase tracking-widest border-red-500/30 text-red-400 hover:bg-red-500/10"
                >
                  Disconnect Wallet
                </Button>
              </div>
            )}

            <button
              onClick={toggleMultiFactor}
              className="w-full flex items-center justify-between p-3 bg-black border border-neutral-800 hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Lock className={`w-4 h-4 ${multiFactorEnabled ? "text-cyan-500" : "text-neutral-500"}`} />
                <span className="text-[10px] font-bold uppercase tracking-widest">ZK-Auth SIWE</span>
              </div>
              <div
                className={`w-10 h-5 flex items-center p-0.5 transition-colors ${multiFactorEnabled ? "bg-cyan-500 justify-end" : "bg-neutral-800 justify-start"}`}
              >
                <div className="w-4 h-4 bg-black" />
              </div>
            </button>

            <button
              onClick={togglePrivateMode}
              className="w-full flex items-center justify-between p-3 bg-black border border-neutral-800 hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-3">
                {privateModeEnabled ? (
                  <EyeOff className="w-4 h-4 text-purple-400" />
                ) : (
                  <Eye className="w-4 h-4 text-neutral-500" />
                )}
                <span className="text-[10px] font-bold uppercase tracking-widest">Max Privacy Mode</span>
              </div>
              <div
                className={`w-10 h-5 flex items-center p-0.5 transition-colors ${privateModeEnabled ? "bg-purple-500 justify-end" : "bg-neutral-800 justify-start"}`}
              >
                <div className="w-4 h-4 bg-black" />
              </div>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-10 border-neutral-800 text-[9px] font-black uppercase tracking-widest rounded-none bg-transparent"
              >
                <Fingerprint className="w-3.5 h-3.5 mr-2" /> Biometrics
              </Button>
              <Button
                onClick={() =>
                  addNotification({
                    title: "Rotating View Keys",
                    message: "Generating new Aleo session view keys...",
                    type: "warning",
                  })
                }
                className="h-10 border border-neutral-800 bg-transparent hover:bg-white/5 text-[9px] font-black uppercase tracking-widest rounded-none"
              >
                Rotate Keys
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Multi-Sig (Admin Only) */}
        {isAdmin && (
          <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
            <CardHeader className="flex flex-row items-center gap-3 border-b border-neutral-900">
              <Users className="w-5 h-5 text-purple-500" />
              <CardTitle className="text-xs font-black uppercase tracking-widest text-white">
                Multi-Sig Governance (Aleo)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase text-neutral-500">Signing Threshold</span>
                  <span className="text-xl font-black text-purple-400">{signingThreshold} / 5</span>
                </div>
                <div className="flex gap-1 h-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      onClick={() => setSigningThreshold(i)}
                      className={`flex-1 cursor-pointer transition-colors ${i <= signingThreshold ? "bg-purple-500" : "bg-neutral-900"}`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase text-neutral-600 tracking-widest">Authorized Signers</p>
                <div className="space-y-1">
                  {["aleo1...9xj (OWNER)", "aleo1...k2p (ADMIN)", "aleo1...7mn (TREASURER)"].map((addr, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-black border border-neutral-900">
                      <span className="text-[9px] font-bold text-white font-mono uppercase">{addr}</span>
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full h-10 bg-purple-500 hover:bg-purple-600 text-black font-black uppercase text-[10px] tracking-widest rounded-none">
                Update Governance Policy
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Network Protocol (Non-Admin view adjustment) */}
        {!isAdmin && (
          <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
            <CardHeader className="flex flex-row items-center gap-3 border-b border-neutral-900">
              <Network className="w-5 h-5 text-cyan-400" />
              <CardTitle className="text-xs font-black uppercase tracking-widest text-white">
                Network Protocol
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="p-4 bg-black border border-neutral-800">
                <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest mb-2">Connected Node</p>
                <p className="text-xs font-bold text-white uppercase tracking-tight">
                  api.explorer.aleo.org/v1/testnet...
                </p>
              </div>
              <div className="flex gap-3">
                <Button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase text-[10px] tracking-widest rounded-none h-10">
                  Check Latency
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-neutral-800 font-black uppercase text-[10px] tracking-widest rounded-none h-10 bg-transparent"
                >
                  Switch RPC
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
