"use client"

import { useApp } from "@/lib/app-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, Calendar, ArrowDownRight, Download } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts"

export default function AnalyticsPage() {
  const { isLoggedIn, userRole, accruedBalance, companyStats, employees, streamingRate, transactions } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, router])

  const isAdmin = userRole === "admin"

  const burnRateChartData = useMemo(() => {
    const data = []
    const baselineBurn = companyStats.monthlyBurn
    for (let i = 0; i < 12; i++) {
      const month = new Date(2025, i).toLocaleString("en-US", { month: "short" })
      data.push({
        month,
        projected: baselineBurn + i * 500,
        actual: baselineBurn + (Math.random() - 0.3) * 2000,
      })
    }
    return data
  }, [companyStats.monthlyBurn])

  const cashFlowData = useMemo(() => {
    return [
      { week: "Week 1", inflow: 45000, outflow: 32000, balance: 420500 },
      { week: "Week 2", inflow: 48000, outflow: 35000, balance: 433500 },
      { week: "Week 3", inflow: 42000, outflow: 30000, balance: 445500 },
      { week: "Week 4", inflow: 51000, outflow: 38000, balance: 458500 },
    ]
  }, [])

  const runwayMonths = companyStats.vaultBalance / (companyStats.monthlyBurn || 1)
  const monthlyRunRate = (accruedBalance * 3600 * 24 * 30) / (streamingRate || 1)

  if (!isLoggedIn) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black italic tracking-tighter text-white uppercase">
            {isAdmin ? "Company Analytics" : "Personal Analytics"}
          </h1>
          <p className="text-sm text-neutral-500 font-bold mt-1">Real-time performance metrics and protocol health</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-neutral-800 text-[10px] font-bold uppercase tracking-widest rounded-none h-9 bg-transparent"
          >
            <Calendar className="w-3.5 h-3.5 mr-2" /> Last 30 Days
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-[10px] tracking-widest rounded-none h-9">
            <Download className="w-3.5 h-3.5 mr-2" /> Export Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isAdmin ? (
          <>
            <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Monthly Burn Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">
                    ${(companyStats.monthlyBurn / 1000).toFixed(1)}K
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[9px] font-bold uppercase">
                  <ArrowDownRight className="w-3 h-3 text-green-400" />
                  <span className="text-green-400">-2.4% vs baseline</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Runway (Months)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-orange-500">{runwayMonths.toFixed(1)}</span>
                </div>
                <div className="mt-2 text-[9px] font-bold text-neutral-500 uppercase">Cash sustainability</div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Protocol Utilization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-cyan-400">92.4%</span>
                </div>
                <div className="mt-2 text-[9px] font-bold text-neutral-500 uppercase">12 Nodes active</div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Total Vault Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">
                    ${(companyStats.vaultBalance / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="mt-2 text-[9px] font-bold text-neutral-500 uppercase">Multi-sig Protected</div>
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Accrued Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-white">${accruedBalance.toFixed(2)}</span>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[9px] font-bold uppercase">
                  <TrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-green-400">Stream Stable</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Hourly Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-cyan-400">${(streamingRate * 3600).toFixed(2)}</span>
                </div>
                <div className="mt-2 text-[9px] font-bold text-neutral-500 uppercase">Per-Second Stream</div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Daily Projection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-orange-500">${(streamingRate * 86400).toFixed(2)}</span>
                </div>
                <div className="mt-2 text-[9px] font-bold text-neutral-500 uppercase">At current rate</div>
              </CardContent>
            </Card>

            <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
                  Monthly Projection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-green-400">${monthlyRunRate.toFixed(0)}</span>
                </div>
                <div className="mt-2 text-[9px] font-bold text-neutral-500 uppercase">Annualized income</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black border-neutral-800 rounded-none overflow-hidden">
          <div className="h-1 bg-orange-500 w-full" />
          <CardHeader className="border-b border-neutral-900">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-white">
              {isAdmin ? "12-Month Burn Rate Projection" : "Earnings Trajectory (30 Days)"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {isAdmin ? (
                  <LineChart data={burnRateChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="month" stroke="#666" fontSize={10} />
                    <YAxis stroke="#666" fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0c0c0c", border: "1px solid #262626" }}
                      itemStyle={{ color: "#f97316", fontSize: "10px", fontWeight: 800 }}
                    />
                    <Legend wrapperStyle={{ color: "#999", fontSize: "10px" }} />
                    <Line
                      type="monotone"
                      dataKey="projected"
                      stroke="#f97316"
                      strokeWidth={2}
                      name="Projected Burn"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#22d3ee"
                      strokeWidth={2}
                      name="Actual Burn"
                      dot={false}
                    />
                  </LineChart>
                ) : (
                  <LineChart
                    data={Array.from({ length: 30 }, (_, i) => ({
                      day: `Day ${i + 1}`,
                      earnings: accruedBalance - (accruedBalance - streamingRate * 86400 * (i + 1)) * 0.95,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="day" stroke="#666" fontSize={8} />
                    <YAxis stroke="#666" fontSize={10} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0c0c0c", border: "1px solid #262626" }}
                      itemStyle={{ color: "#f97316" }}
                    />
                    <Line type="monotone" dataKey="earnings" stroke="#f97316" strokeWidth={2} dot={false} />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-neutral-800 rounded-none overflow-hidden">
          <div className="h-1 bg-cyan-400 w-full" />
          <CardHeader className="border-b border-neutral-900">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-white">
              {isAdmin ? "Weekly Cash Flow" : "Balance Distribution"}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {isAdmin ? (
                  <BarChart data={cashFlowData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="week" stroke="#666" fontSize={10} />
                    <YAxis stroke="#666" fontSize={10} />
                    <Tooltip contentStyle={{ backgroundColor: "#0c0c0c", border: "1px solid #262626" }} />
                    <Legend wrapperStyle={{ color: "#999", fontSize: "10px" }} />
                    <Bar dataKey="inflow" fill="#22d3ee" name="Inflow" />
                    <Bar dataKey="outflow" fill="#f97316" name="Outflow" />
                  </BarChart>
                ) : (
                  <BarChart
                    data={[
                      { name: "Available", value: accruedBalance * 0.6, fill: "#f97316" },
                      { name: "Committed", value: accruedBalance * 0.3, fill: "#22d3ee" },
                      { name: "Reserved", value: accruedBalance * 0.1, fill: "#666" },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                    <XAxis dataKey="name" stroke="#666" fontSize={10} />
                    <YAxis stroke="#666" fontSize={10} />
                    <Bar dataKey="value">
                      {[
                        { name: "Available", value: accruedBalance * 0.6, fill: "#f97316" },
                        { name: "Committed", value: accruedBalance * 0.3, fill: "#22d3ee" },
                        { name: "Reserved", value: accruedBalance * 0.1, fill: "#666" },
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none overflow-hidden">
        <CardHeader className="border-b border-neutral-900">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-white">
            Financial Insights & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isAdmin ? (
              <>
                <div className="p-4 bg-black border border-neutral-800 rounded-none space-y-2">
                  <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">Burn Rate Trend</p>
                  <p className="text-sm text-neutral-400">
                    Your burn rate is trending stable. Current trajectory suggests 5.7 months of runway at this pace.
                  </p>
                </div>
                <div className="p-4 bg-black border border-neutral-800 rounded-none space-y-2">
                  <p className="text-xs font-black text-orange-500 uppercase tracking-widest">
                    Optimization Opportunity
                  </p>
                  <p className="text-sm text-neutral-400">
                    Consider enabling auto-top-up to maintain optimal treasury balance during peak payroll periods.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 bg-black border border-neutral-800 rounded-none space-y-2">
                  <p className="text-xs font-black text-green-400 uppercase tracking-widest">Savings Goal Progress</p>
                  <p className="text-sm text-neutral-400">
                    You're on track to reach your emergency fund goal. Continue current savings rate.
                  </p>
                </div>
                <div className="p-4 bg-black border border-neutral-800 rounded-none space-y-2">
                  <p className="text-xs font-black text-cyan-400 uppercase tracking-widest">Earning Stability</p>
                  <p className="text-sm text-neutral-400">
                    Your stream is stable. Average daily earnings: ${(streamingRate * 86400).toFixed(2)}
                  </p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black border-neutral-800 rounded-none overflow-hidden">
        <div className="h-1 bg-white w-full" />
        <CardHeader className="border-b border-neutral-900">
          <CardTitle className="text-xs font-black uppercase tracking-widest text-white">
            Recent Protocol Events
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 max-h-80 overflow-y-auto custom-scrollbar">
          <div className="divide-y divide-neutral-900">
            {transactions.slice(0, 10).map((tx) => (
              <div
                key={tx.id}
                className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
              >
                <div>
                  <p className="text-xs font-black text-white uppercase">
                    {tx.type === "stream" ? "Stream Accrual" : tx.type.toUpperCase()} • Block #{tx.blockNumber}
                  </p>
                  <p className="text-[9px] text-neutral-500 font-bold uppercase mt-1">
                    {new Date(tx.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-xs font-black font-mono ${
                      tx.type === "withdrawal"
                        ? "text-red-400"
                        : tx.type === "deposit"
                          ? "text-cyan-400"
                          : "text-green-400"
                    }`}
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
  )
}
