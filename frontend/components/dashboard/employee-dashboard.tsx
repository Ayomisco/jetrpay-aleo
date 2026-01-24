"use client"

import { useState } from "react"
import { Zap, ArrowDownCircle, History, ArrowUpRight, Globe, Info, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function EmployeeDashboard() {
  const { accruedBalance, streamingRate, transactions, withdrawFunds, requestAdvance } = useApp()
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [advanceAmount, setAdvanceAmount] = useState("")
  const [sendAmount, setSendAmount] = useState("")
  const [sendAddress, setSendAddress] = useState("")

  const handleWithdraw = () => {
    const amount = Number.parseFloat(withdrawAmount)
    if (!isNaN(amount) && amount > 0) {
      withdrawFunds(amount, "PERSONAL_WALLET_0x...F2")
      setWithdrawAmount("")
    }
  }

  const handleSend = () => {
    const amount = Number.parseFloat(sendAmount)
    if (!isNaN(amount) && amount > 0 && sendAddress) {
      withdrawFunds(amount, sendAddress)
      setSendAmount("")
      setSendAddress("")
    }
  }

  const handleAdvance = () => {
    const amount = Number.parseFloat(advanceAmount)
    if (!isNaN(amount) && amount > 0) {
      requestAdvance(amount, "General Liquidity Need")
      setAdvanceAmount("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-cyan-400/5 border-cyan-400/30 rounded-none relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Zap className="w-16 h-16 text-cyan-400" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
              Private Balance (ZK-Verified)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black tracking-tighter text-white font-mono break-all">
                ${accruedBalance.toFixed(6)}
              </span>
              <span className="text-xs font-bold text-cyan-400/70 uppercase">USDC</span>
            </div>
            <p className="text-[10px] text-neutral-500 mt-2 font-bold uppercase tracking-tight">
              Identity Hidden • Amount Encrypted
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex-1 bg-cyan-400 hover:bg-cyan-500 text-black font-black uppercase text-[10px] tracking-widest rounded-none h-11">
                    <ArrowDownCircle className="w-3 h-3 mr-2" /> Anonymous Withdrawal
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0c0c0c] border-neutral-800 text-white font-mono rounded-none sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-cyan-400 uppercase tracking-widest italic font-black">
                      PRIVATE WITHDRAWAL (ZK-PROOF)
                    </DialogTitle>
                    <DialogDescription className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">
                      Withdraw to unlinkable wallet • Identity protected
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em]">
                        Amount (USDC)
                      </label>
                      <Input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-black border-neutral-800 text-white rounded-none h-14 font-black text-xl"
                      />
                    </div>
                    <div className="p-4 bg-orange-500/5 border border-orange-500/20">
                      <p className="text-[9px] text-orange-500 font-bold uppercase leading-relaxed">
                        Notice: Withdrawals are processed instantly on Arbitrum. Network fees (gas) will be deducted
                        from your protocol balance.
                      </p>
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <Button
                      onClick={handleWithdraw}
                      disabled={!withdrawAmount || Number.parseFloat(withdrawAmount) > accruedBalance}
                      className="w-full bg-orange-500 text-black hover:bg-orange-600 font-black uppercase text-xs tracking-widest rounded-none h-14"
                    >
                      EXECUTE WITHDRAWAL
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* ... existing rates card ... */}
        <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-cyan-400">
              Streaming Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-white font-mono">
                ${(streamingRate * 3600).toFixed(2)}
              </span>
              <span className="text-xs font-bold text-neutral-500 uppercase">/hr</span>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-bold uppercase text-neutral-500">
                <span>Gross Annual</span>
                <span className="text-white">$14,200.00</span>
              </div>
              <div className="flex justify-between text-[9px] font-bold uppercase text-neutral-500">
                <span>Net Monthly</span>
                <span className="text-white">$1,183.33</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ... existing scheduled card ... */}
        <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none sm:col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Next Scheduled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-cyan-500" />
                <div>
                  <p className="text-xs font-black text-white">$450.00</p>
                  <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-tight">
                    Bonus Distribution • Jan 15
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-neutral-800 text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-white rounded-none h-8 bg-transparent"
              >
                View Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stream Activity */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-black border-neutral-800 rounded-none overflow-hidden">
            <div className="h-1 bg-cyan-400 w-full" />
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-900 gap-4">
              <div>
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-white">
                  Private Transactions
                </CardTitle>
                <CardDescription className="text-[9px] font-bold uppercase text-neutral-500">
                  ZK-Verified on Aleo Network • Identity Hidden
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[9px] font-bold uppercase text-cyan-400 hover:bg-cyan-400/10 self-start sm:self-center"
              >
                Refresh Protocol
              </Button>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto custom-scrollbar">
              <div className="divide-y divide-neutral-900 min-w-[500px] sm:min-w-full">
                {transactions.slice(0, 5).map((tx) => (
                  <div
                    key={tx.id}
                    className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 flex items-center justify-center border border-neutral-800 group-hover:border-orange-500/50 transition-colors">
                        <History className="w-4 h-4 text-neutral-600 group-hover:text-orange-500" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white uppercase tracking-tight">
                          {tx.type === "stream" ? "Stream Accrual" : tx.type.toUpperCase()} • Block #{tx.blockNumber}
                        </p>
                        <p className="text-[9px] text-neutral-500 font-bold uppercase">
                          {new Date(tx.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          "text-xs font-black font-mono",
                          tx.type === "withdrawal" ? "text-red-400" : "text-green-400",
                        )}
                      >
                        {tx.type === "withdrawal" ? "-" : "+"}${tx.amount.toFixed(6)}
                      </p>
                      <p className="text-[9px] text-neutral-500 font-bold uppercase">{tx.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
            <CardHeader className="pb-4">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-white">
                Stream Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-black border border-neutral-800 space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-8 h-8 bg-orange-500/5 -mr-4 -mt-4 rotate-45" />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Asset</span>
                  <span className="text-[10px] font-bold text-white uppercase flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" /> USDC (v2)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Frequency</span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Per-Second</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Vault Protection
                  </span>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">Active (RLS)</span>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-2 tracking-[0.1em]">
                  <Info className="w-3 h-3 text-orange-500" /> Need liquidity early?
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="w-full bg-white text-black hover:bg-neutral-200 font-black uppercase text-[10px] tracking-widest rounded-none h-12">
                      Request Wage Advance
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-[#0c0c0c] border-neutral-800 text-white font-mono rounded-none sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-white uppercase tracking-widest font-black italic">
                        WAGE ADVANCE REQUEST
                      </DialogTitle>
                      <DialogDescription className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">
                        Submit a request for early access to unearned salary.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                          Requested Amount (USDC)
                        </label>
                        <Input
                          type="number"
                          value={advanceAmount}
                          onChange={(e) => setAdvanceAmount(e.target.value)}
                          placeholder="500.00"
                          className="bg-black border-neutral-800 text-white rounded-none h-12"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handleAdvance}
                        disabled={!advanceAmount}
                        className="w-full bg-white text-black hover:bg-neutral-200 font-black uppercase text-xs tracking-widest rounded-none h-14"
                      >
                        SUBMIT REQUEST
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-24 border-neutral-800 rounded-none bg-black hover:bg-white/5 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-white transition-all group p-2"
                >
                  <ArrowUpRight className="w-6 h-6 text-orange-500 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-center">Send Money</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0c0c0c] border-neutral-800 text-white font-mono rounded-none sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-orange-500 uppercase tracking-widest font-black">
                    PROTOCOL TRANSFER
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                      Destination Address
                    </label>
                    <Input
                      value={sendAddress}
                      onChange={(e) => setSendAddress(e.target.value)}
                      placeholder="0x..."
                      className="bg-black border-neutral-800 text-white rounded-none h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Amount</label>
                    <Input
                      type="number"
                      value={sendAmount}
                      onChange={(e) => setSendAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-black border-neutral-800 text-white rounded-none h-12"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleSend}
                    disabled={!sendAmount || !sendAddress}
                    className="w-full bg-orange-500 text-black font-black uppercase text-xs tracking-widest h-14 rounded-none"
                  >
                    CONFIRM TRANSFER
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-24 border-neutral-800 rounded-none bg-black hover:bg-white/5 flex flex-col items-center justify-center gap-2 text-neutral-400 hover:text-white transition-all group p-2"
                >
                  <CreditCard className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-[9px] font-black uppercase tracking-[0.2em] text-center">Pay Bills</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0c0c0c] border-neutral-800 text-white font-mono rounded-none sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-cyan-400 uppercase tracking-widest font-black">BILL PAYMENT</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center justify-center py-10 space-y-4 opacity-50">
                  <Globe className="w-12 h-12 text-neutral-800" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Off-chain rails indexing...</p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}
