"use client"
import { Zap, TrendingUp, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useApp } from "@/lib/app-context"

export default function EmployeeStreamsDashboard() {
  const { accruedBalance, streamingRate, transactions } = useApp()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-black border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Live Accrued Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-orange-500">${accruedBalance.toFixed(2)}</span>
            </div>
            <div className="mt-2 text-[9px] font-bold text-neutral-500 uppercase flex items-center gap-2">
              <Zap className="w-3 h-3 text-orange-500" /> STREAMING_ACTIVE
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Per-Second Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-cyan-400">${streamingRate.toFixed(6)}</span>
            </div>
            <div className="mt-2 text-[9px] font-bold text-neutral-500 uppercase">/SECOND</div>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Today's Earnings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">${(streamingRate * 86400).toFixed(2)}</span>
            </div>
            <div className="mt-2 text-[9px] font-bold text-green-400 uppercase flex items-center gap-2">
              <TrendingUp className="w-3 h-3" /> ON_TRACK
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-black border-white/10">
        <CardHeader>
          <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-white italic">
            Recent Stream Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-white/5 flex items-center justify-center">
                    {tx.type === "stream" ? (
                      <Zap className="w-4 h-4 text-orange-500" />
                    ) : (
                      <DollarSign className="w-4 h-4 text-cyan-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-white">{tx.type}</p>
                    <p className="text-[8px] text-neutral-500 uppercase">{new Date(tx.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <span className="text-sm font-black text-white">${tx.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
