"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, Zap, ShieldAlert, Cpu, RefreshCw } from "lucide-react"
import { useApp } from "@/lib/app-context"
import { Button } from "@/components/ui/button"

export default function OperationsCenter() {
  const { transactions, addTransaction, addNotification } = useApp()

  const handleManualScan = () => {
    addNotification({
      title: "Protocol Scan",
      message: "Manually indexing recent Arbitrum blocks...",
      type: "info",
    })

    // Add a mock new transaction
    addTransaction({
      id: `manual-${Date.now()}`,
      type: "stream",
      amount: 0.00045,
      asset: "USDC",
      timestamp: new Date().toISOString(),
      blockNumber: 82950 + Math.floor(Math.random() * 100),
      status: "confirmed",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-orange-500" />
          <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">Real-Time Operations</h2>
        </div>
        <Button
          onClick={handleManualScan}
          variant="outline"
          className="border-neutral-800 text-[10px] font-black uppercase tracking-widest text-white rounded-none hover:bg-orange-500 hover:text-black hover:border-orange-500 transition-all bg-transparent h-9"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-2" /> Index Network
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Protocol Load", value: "24%", icon: Cpu, color: "text-cyan-400" },
          { label: "Active Streams", value: "842", icon: Zap, color: "text-orange-500" },
          { label: "Security level", value: "High", icon: ShieldAlert, color: "text-green-400" },
          { label: "Tx Frequency", value: "1.2s", icon: Activity, color: "text-white" },
        ].map((stat, i) => (
          <Card key={i} className="bg-[#0f0f0f] border-neutral-800 rounded-none overflow-hidden relative">
            <div className={`absolute top-0 right-0 p-3 opacity-10`}>
              <stat.icon className="w-12 h-12" />
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-[9px] font-black uppercase tracking-widest text-neutral-500">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-black font-mono ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-black border-neutral-800 rounded-none">
        <CardHeader>
          <CardTitle className="text-xs font-black uppercase tracking-widest text-white">
            Live Protocol Stream Ledger
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-neutral-900/30 border border-neutral-800 p-4 font-mono text-[10px] text-neutral-400 overflow-auto space-y-1 scrollbar-thin scrollbar-thumb-neutral-800">
            <p className="text-cyan-400 font-bold">[SYSTEM] ARBITRUM ONE RPC CONNECTED (ID: 42161)</p>
            <p className="text-neutral-600 italic">Historical data initialized...</p>

            {transactions.map((tx, idx) => (
              <p key={tx.id}>
                <span className="text-neutral-600">[{new Date(tx.timestamp).toLocaleTimeString()}]</span>{" "}
                <span className={tx.type === "withdrawal" ? "text-red-400" : "text-green-400"}>
                  {tx.type === "withdrawal" ? "OUTFLOW" : "INFLOW"}:
                </span>{" "}
                Entry #{tx.blockNumber} confirmed.{" "}
                <span className="font-bold">
                  {tx.type === "withdrawal" ? "-" : "+"}
                  {tx.amount.toFixed(6)} {tx.asset}
                </span>{" "}
                {tx.to && <span className="text-neutral-500 font-bold">» {tx.to}</span>}
              </p>
            ))}

            <p className="text-white cursor-blink italic border-l-2 border-white pl-1 animate-pulse">
              Waiting for next block...
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
