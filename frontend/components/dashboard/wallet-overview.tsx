"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, RefreshCcw, ShieldCheck } from "lucide-react"
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

export default function WalletOverview() {
  const { accruedBalance, userRole, companyStats, withdrawFunds, depositFunds, addNotification } = useApp()
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [depositAmount, setDepositAmount] = useState("")

  const handleWithdraw = () => {
    const val = Number.parseFloat(withdrawAmount)
    if (!isNaN(val) && val > 0) {
      withdrawFunds(val, "BANK_ACCOUNT_ENDING_4291")
      setWithdrawAmount("")
    }
  }

  const handleDeposit = () => {
    const val = Number.parseFloat(depositAmount)
    if (!isNaN(val) && val > 0) {
      depositFunds(val)
      setDepositAmount("")
    }
  }

  const displayBalance = userRole === "admin" ? companyStats.vaultBalance : accruedBalance

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">Asset Management</h2>
        <Button
          onClick={() =>
            addNotification({ title: "Syncing Assets", message: "Verifying ZK state with Aleo Network...", type: "info" })
          }
          variant="outline"
          className="border-cyan-500/50 text-cyan-500 hover:bg-cyan-500 hover:text-black rounded-none h-9 text-[10px] font-black uppercase tracking-widest bg-transparent"
        >
          <RefreshCcw className="w-3.5 h-3.5 mr-2" /> Resync ZK State
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-3 bg-black border-neutral-800 rounded-none">
          <CardHeader className="border-b border-neutral-900">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-white">
              Private Portfolio Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="relative w-48 h-48 border-[12px] border-neutral-900 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 border-[12px] border-cyan-500 border-t-transparent border-l-transparent rounded-full rotate-45" />
                <div className="text-center">
                  <p className="text-[10px] font-black text-neutral-500 uppercase">Total Encrypted Value</p>
                  <p className="text-2xl font-black text-white">${displayBalance.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex-1 w-full space-y-6">
                {[
                  {
                    asset: "Private USDC",
                    amount: (displayBalance * 0.85).toLocaleString(),
                    percent: 85,
                    color: "bg-cyan-500",
                  },
                  {
                    asset: "ALEO Credits",
                    amount: (displayBalance * 0.1).toLocaleString(),
                    percent: 10,
                    color: "bg-purple-400",
                  },
                  { asset: "ZK Gas", amount: (displayBalance * 0.05).toLocaleString(), percent: 5, color: "bg-white" },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-white">{item.asset}</span>
                      <span className="text-neutral-500">
                        {item.percent}% • ${item.amount}
                      </span>
                    </div>
                    <div className="h-1.5 bg-neutral-900 rounded-none overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-cyan-500 text-black rounded-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-black/70">
                Vault Privacy Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-8 h-8" />
                <div>
                  <p className="text-lg font-black leading-tight uppercase">Maximum</p>
                  <p className="text-[9px] font-bold uppercase tracking-tight">Zero-Knowledge Proofs Active</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="h-14 bg-white text-black hover:bg-neutral-200 rounded-none font-black uppercase text-[10px] tracking-widest shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  <ArrowUpRight className="w-4 h-4 mr-2" /> Withdraw to Bank
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0c0c0c] border-neutral-800 text-white font-mono rounded-none sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-orange-500 uppercase tracking-widest font-black italic">
                    OFF-RAMP PROTOCOL
                  </DialogTitle>
                  <DialogDescription className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">
                    Transfer USDC to connected Fiat rails. Verified Bank Account ending in 4291.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                      Amount (USDC)
                    </label>
                    <Input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-black border-neutral-800 text-white rounded-none h-14 text-xl font-black"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount || Number.parseFloat(withdrawAmount) > displayBalance}
                    className="w-full bg-orange-500 text-black hover:bg-orange-600 font-black uppercase text-xs tracking-widest rounded-none h-14"
                  >
                    AUTHORIZE WITHDRAWAL
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-14 border-neutral-800 hover:bg-white/5 rounded-none font-black uppercase text-[10px] tracking-widest bg-transparent"
                >
                  <ArrowDownLeft className="w-4 h-4 mr-2 text-cyan-400" /> Deposit Funds
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0c0c0c] border-neutral-800 text-white font-mono rounded-none sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-cyan-400 uppercase tracking-widest font-black italic">
                    ON-RAMP PROTOCOL
                  </DialogTitle>
                  <DialogDescription className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">
                    Deposit funds from external wallet to your JetrPay Vault.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Amount</label>
                    <Input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-black border-neutral-800 text-white rounded-none h-14 text-xl font-black"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleDeposit}
                    disabled={!depositAmount}
                    className="w-full bg-cyan-500 text-black hover:bg-cyan-600 font-black uppercase text-xs tracking-widest rounded-none h-14"
                  >
                    INITIALIZE DEPOSIT
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  )
}
