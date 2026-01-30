"use client"

import { useApp } from "@/lib/app-context-v2"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { History, Download, Search, ExternalLink, Shield, RefreshCw, Loader2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { formatAddress } from "@/lib/aleo"

export default function TransactionsPage() {
  const { isLoggedIn, transactions, networkStatus, currentBlockHeight, refreshData, isLoading } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "stream" | "withdrawal" | "deposit" | "claim">("all")
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null
  }

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.asset.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || tx.type === filterType
    return matchesSearch && matchesFilter
  })

  const handleExportCSV = () => {
    const headers = ["ID", "Type", "Amount", "Asset", "Status", "Block", "Timestamp"]
    const rows = filteredTransactions.map(tx => [
      tx.id,
      tx.type,
      tx.amount.toString(),
      tx.asset,
      tx.status,
      tx.blockNumber.toString(),
      new Date(tx.timestamp).toISOString()
    ])
    const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `jetrpay_transactions_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const openExplorer = (txId: string) => {
    window.open(`https://explorer.aleo.org/transaction/${txId}`, "_blank")
  }

  return (
    <div className="space-y-6">
      {/* Network Status Bar */}
      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-neutral-500 px-1">
        <span className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", networkStatus === "connected" ? "bg-cyan-500" : "bg-red-500")} />
          {networkStatus === "connected" ? "ALEO_TESTNET" : "DISCONNECTED"}
        </span>
        <span>Current Block: {currentBlockHeight.toLocaleString()}</span>
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

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">ZK Transaction History</h1>
          <p className="text-sm text-neutral-500 font-bold mt-1">Privacy-preserving ledger on Aleo Network</p>
        </div>
        <Button 
          onClick={handleExportCSV}
          className="bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-[10px] tracking-widest rounded-none h-9"
        >
          <Download className="w-3.5 h-3.5 mr-2" /> Export CSV
        </Button>
      </div>

      <Card className="bg-black border-neutral-800 rounded-none">
        <CardHeader className="border-b border-neutral-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                Private Transactions
              </CardTitle>
              <CardDescription className="text-[9px] font-bold uppercase text-neutral-500 mt-1">
                {filteredTransactions.length} ZK-verified records • Identity protected
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="SEARCH TRANSACTIONS..."
                  className="pl-9 h-9 bg-[#0a0a0a] border-neutral-800 text-[10px] font-bold tracking-widest uppercase placeholder:text-neutral-700 rounded-none w-64"
                />
              </div>
              <div className="flex gap-2 border border-neutral-800 h-9">
                {(["all", "stream", "withdrawal", "deposit", "claim"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 text-[9px] font-black uppercase tracking-widest transition-colors ${
                      filterType === type
                        ? "bg-cyan-500 text-black"
                        : "bg-transparent text-neutral-500 hover:text-white"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-neutral-900">
            {filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <Shield className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                <p className="text-sm font-bold text-neutral-500 uppercase">No transactions found</p>
                <p className="text-[10px] text-neutral-600 mt-2">Your ZK-verified transactions will appear here</p>
              </div>
            ) : (
              filteredTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center border border-neutral-800 group-hover:border-cyan-500/50 transition-colors">
                      <History className="w-5 h-5 text-neutral-600 group-hover:text-cyan-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                        {tx.type === "stream" ? "Stream Accrual" : tx.type === "claim" ? "ZK Claim" : tx.type.toUpperCase()}
                        <span className="text-neutral-600">•</span>
                        <span className="text-neutral-500 text-[10px]">Block #{tx.blockNumber}</span>
                      </p>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">
                        {new Date(tx.timestamp).toLocaleString()} • {formatAddress(tx.id)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p
                        className={`text-sm font-black font-mono ${tx.type === "withdrawal" || tx.type === "claim" ? "text-orange-400" : "text-green-400"}`}
                      >
                        {tx.type === "withdrawal" || tx.type === "claim" ? "-" : "+"}${tx.amount.toFixed(6)} {tx.asset}
                      </p>
                      <p className="text-[9px] text-neutral-500 font-bold uppercase mt-1">{tx.status}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-cyan-400">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
