"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { PiggyBank, Zap, Clock, CheckCircle } from "lucide-react"

export default function EmployeeFinancialHub() {
  const { accruedBalance, addNotification, addTransaction } = useApp()
  const [ewaAmount, setEwaAmount] = useState("")
  const [savingsGoal, setSavingsGoal] = useState("")
  const [billPayee, setBillPayee] = useState("")
  const [billAmount, setBillAmount] = useState("")

  const handleEWARequest = () => {
    const amount = Number.parseFloat(ewaAmount)
    if (!isNaN(amount) && amount > 0 && amount <= accruedBalance) {
      addTransaction({ type: "payment", amount, asset: "USDC" })
      addNotification({
        title: "Earned Wage Access Requested",
        message: `$${amount.toFixed(2)} EWA request processed instantly.`,
        type: "success",
      })
      setEwaAmount("")
    }
  }

  const handleCreateSavingsGoal = () => {
    const amount = Number.parseFloat(savingsGoal)
    if (!isNaN(amount) && amount > 0) {
      addNotification({
        title: "Savings Goal Created",
        message: `Goal for $${amount.toFixed(2)} set. Auto-transfer enabled.`,
        type: "success",
      })
      setSavingsGoal("")
    }
  }

  const handleScheduleBillPay = () => {
    const amount = Number.parseFloat(billAmount)
    if (!isNaN(amount) && amount > 0 && billPayee) {
      addTransaction({ type: "payment", amount, asset: "USDC" })
      addNotification({
        title: "Bill Payment Scheduled",
        message: `$${amount.toFixed(2)} payment to ${billPayee} queued for processing.`,
        type: "success",
      })
      setBillPayee("")
      setBillAmount("")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black italic tracking-tighter text-white uppercase">Financial Hub</h2>
        <div className="flex gap-2">
          <div className="text-right">
            <p className="text-[10px] font-bold text-neutral-500 uppercase">Available Private Balance</p>
            <p className="text-lg font-black text-purple-400">${accruedBalance.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Earned Wage Access */}
        <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none overflow-hidden group hover:border-cyan-500/30 transition-all">
          <div className="h-1 bg-gradient-to-r from-cyan-500 to-purple-600 w-full" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-none">
                <Zap className="w-5 h-5 text-cyan-500" />
              </div>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-white">
                Private Wage Access
              </CardTitle>
            </div>
            <CardDescription className="text-[9px] text-neutral-500 font-bold uppercase">
              Access earned wages privately
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-black border border-neutral-800 rounded-none space-y-2">
              <p className="text-[10px] font-bold text-neutral-500 uppercase">Max Available Today</p>
              <p className="text-lg font-black text-cyan-500">${accruedBalance.toFixed(2)}</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase text-[10px] tracking-widest rounded-none h-12">
                  Request Private EWA
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0c0c0c] border-neutral-800 text-white font-mono rounded-none sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-cyan-500 uppercase tracking-widest font-black">
                    Private Wage Access Request
                  </DialogTitle>
                  <DialogDescription className="text-neutral-500 text-[10px] uppercase font-bold">
                    Get instant, anonymous access to wages
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                      Amount (Private USGS)
                    </label>
                    <Input
                      type="number"
                      value={ewaAmount}
                      onChange={(e) => setEwaAmount(e.target.value)}
                      placeholder="0.00"
                      max={accruedBalance}
                      className="bg-black border-neutral-800 text-white rounded-none h-12 font-black"
                    />
                  </div>
                  <div className="p-3 bg-orange-500/5 border border-orange-500/20 rounded-none space-y-1">
                    <p className="text-[9px] font-bold text-orange-500 uppercase">No Hidden Fees</p>
                    <p className="text-[9px] text-neutral-500">2% simple interest charged yearly</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleEWARequest}
                    disabled={!ewaAmount || Number.parseFloat(ewaAmount) > accruedBalance}
                    className="w-full bg-orange-500 text-black hover:bg-orange-600 font-black uppercase text-xs tracking-widest rounded-none h-12"
                  >
                    Get Access Now
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Savings Goals */}
        <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none overflow-hidden group hover:border-cyan-400/30 transition-all">
          <div className="h-1 bg-gradient-to-r from-cyan-400 to-cyan-500 w-full" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-400/10 border border-cyan-400/30 rounded-none">
                <PiggyBank className="w-5 h-5 text-cyan-400" />
              </div>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-white">Savings Goals</CardTitle>
            </div>
            <CardDescription className="text-[9px] text-neutral-500 font-bold uppercase">
              Auto-transfer to savings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-[9px] font-bold text-neutral-500 uppercase">
                <span>Emergency Fund</span>
                <span className="text-white">$2,450 / $5,000</span>
              </div>
              <div className="h-1.5 bg-neutral-900 rounded-none overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: "49%" }} />
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-neutral-800 text-white hover:bg-white/5 font-black uppercase text-[10px] tracking-widest rounded-none h-12 bg-transparent"
                >
                  Create New Goal
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0c0c0c] border-neutral-800 text-white font-mono rounded-none sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-cyan-400 uppercase tracking-widest font-black">
                    Create Savings Goal
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                      Goal Amount (USDC)
                    </label>
                    <Input
                      type="number"
                      value={savingsGoal}
                      onChange={(e) => setSavingsGoal(e.target.value)}
                      placeholder="0.00"
                      className="bg-black border-neutral-800 text-white rounded-none h-12 font-black"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateSavingsGoal}
                    disabled={!savingsGoal}
                    className="w-full bg-cyan-400 text-black hover:bg-cyan-500 font-black uppercase text-xs tracking-widest rounded-none h-12"
                  >
                    Create Goal
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Bill Pay Automation */}
        <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none overflow-hidden group hover:border-white/30 transition-all">
          <div className="h-1 bg-gradient-to-r from-white to-neutral-400 w-full" />
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 border border-white/30 rounded-none">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <CardTitle className="text-xs font-black uppercase tracking-widest text-white">Bill Pay</CardTitle>
            </div>
            <CardDescription className="text-[9px] text-neutral-500 font-bold uppercase">
              Schedule & automate payments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="p-2 bg-black border border-neutral-800 rounded-none text-[9px] font-bold text-neutral-500 uppercase">
                <CheckCircle className="w-3 h-3 inline mr-1 text-green-400" /> 3 Bills Scheduled
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full bg-white text-black hover:bg-neutral-200 font-black uppercase text-[10px] tracking-widest rounded-none h-12">
                  Schedule Payment
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#0c0c0c] border-neutral-800 text-white font-mono rounded-none sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-white uppercase tracking-widest font-black">
                    Schedule Bill Payment
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                      Payee Name
                    </label>
                    <Input
                      value={billPayee}
                      onChange={(e) => setBillPayee(e.target.value)}
                      placeholder="e.g., Electric Company"
                      className="bg-black border-neutral-800 text-white rounded-none h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                      Amount (USDC)
                    </label>
                    <Input
                      type="number"
                      value={billAmount}
                      onChange={(e) => setBillAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-black border-neutral-800 text-white rounded-none h-12 font-black"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleScheduleBillPay}
                    disabled={!billPayee || !billAmount}
                    className="w-full bg-white text-black hover:bg-neutral-200 font-black uppercase text-xs tracking-widest rounded-none h-12"
                  >
                    Schedule Payment
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Financial Insights */}
      <Card className="bg-black border-neutral-800 rounded-none overflow-hidden">
        <CardHeader className="border-b border-neutral-900">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-white">Financial Insights</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: "Daily Earnings", value: "$3.45", color: "text-orange-500" },
              { label: "Weekly Saved", value: "$487.50", color: "text-cyan-400" },
              { label: "Avg. Monthly Bills", value: "$1,200", color: "text-white" },
              { label: "Savings Rate", value: "28%", color: "text-green-400" },
            ].map((stat, i) => (
              <div key={i} className="p-4 bg-[#0f0f0f] border border-neutral-800 rounded-none">
                <p className="text-[9px] font-bold text-neutral-500 uppercase mb-2">{stat.label}</p>
                <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
