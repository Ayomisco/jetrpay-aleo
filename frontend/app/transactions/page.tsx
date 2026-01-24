"use client"

import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { History, Download, Search, ExternalLink } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TransactionsPage() {
  const { isLoggedIn, transactions } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "stream" | "withdrawal" | "deposit">("all")
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">Transaction History</h1>
          <p className="text-sm text-neutral-500 font-bold mt-1">Complete ledger of all blockchain activities</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-[10px] tracking-widest rounded-none h-9">
          <Download className="w-3.5 h-3.5 mr-2" /> Export CSV
        </Button>
      </div>

      <Card className="bg-black border-neutral-800 rounded-none">
        <CardHeader className="border-b border-neutral-900">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-white">
                All Transactions
              </CardTitle>
              <CardDescription className="text-[9px] font-bold uppercase text-neutral-500 mt-1">
                {filteredTransactions.length} records found
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
                {(["all", "stream", "withdrawal", "deposit"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 text-[9px] font-black uppercase tracking-widest transition-colors ${
                      filterType === type
                        ? "bg-orange-500 text-black"
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
            {filteredTransactions.map((tx) => (
              <div
                key={tx.id}
                className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex items-center justify-center border border-neutral-800 group-hover:border-orange-500/50 transition-colors">
                    <History className="w-5 h-5 text-neutral-600 group-hover:text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white uppercase tracking-tight flex items-center gap-2">
                      {tx.type === "stream" ? "Stream Accrual" : tx.type.toUpperCase()}
                      <span className="text-neutral-600">•</span>
                      <span className="text-neutral-500 text-[10px]">Block #{tx.blockNumber}</span>
                    </p>
                    <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">
                      {new Date(tx.timestamp).toLocaleString()} • {tx.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p
                      className={`text-sm font-black font-mono ${tx.type === "withdrawal" ? "text-red-400" : "text-green-400"}`}
                    >
                      {tx.type === "withdrawal" ? "-" : "+"}${tx.amount.toFixed(6)} {tx.asset}
                    </p>
                    <p className="text-[9px] text-neutral-500 font-bold uppercase mt-1">{tx.status}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-cyan-400">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
