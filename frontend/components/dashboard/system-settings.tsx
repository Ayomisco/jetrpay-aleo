"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Network, Lock, Users, Fingerprint, Eye, EyeOff } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { useState } from "react"

export default function SystemSettings() {
  const { multiFactorEnabled, toggleMultiFactor, privateModeEnabled, togglePrivateMode, addNotification, userRole } =
    useApp()
  const [signingThreshold, setSigningThreshold] = useState(3)

  const isAdmin = userRole === "admin"

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">System Configuration</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Controls */}
        <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
          <CardHeader className="flex flex-row items-center gap-3 border-b border-neutral-900">
            <Shield className="w-5 h-5 text-cyan-500" />
            <CardTitle className="text-xs font-black uppercase tracking-widest text-white">Security & Auth</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
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
                    message: "Generating new session view keys...",
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
                Multi-Sig Governance
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
                  arbitrum-mainnet.alchemyapi.io/v2/...
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
