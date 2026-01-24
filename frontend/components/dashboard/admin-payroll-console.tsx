"use client"

import type React from "react"

import { useState, useRef } from "react"
import {
  TrendingDown,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Power,
  PowerOff,
  DollarSign,
  Upload,
  Download,
  SettingsIcon,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/lib/app-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

export default function AdminPayrollConsole() {
  const { employees, companyStats, updateEmployeeStatus, addEmployee, removeEmployee, addNotification, depositFunds } =
    useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingEmployee, setIsAddingEmployee] = useState(false)
  const [isBulkImporting, setIsBulkImporting] = useState(false)
  const [isConfiguringAutoTopup, setIsConfiguringAutoTopup] = useState(false)
  const [autoTopupConfig, setAutoTopupConfig] = useState({ threshold: "5000", amount: "20000" })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const [newEmployee, setNewEmployee] = useState({
    name: "",
    role: "",
    salary: "",
    wallet: "",
  })

  const handleAddEmployee = () => {
    if (newEmployee.name && newEmployee.role && newEmployee.salary) {
      addEmployee({
        id: `emp-${Date.now()}`,
        name: newEmployee.name,
        role: newEmployee.role,
        status: "Active",
        salary: Number.parseFloat(newEmployee.salary),
        ratePerSecond: Number.parseFloat(newEmployee.salary) / 31536000,
        accruedBalance: 0,
        walletAddress: newEmployee.wallet || "0x" + Math.random().toString(16).slice(2, 10),
        startDate: new Date().toISOString().split("T")[0],
      })
      setNewEmployee({ name: "", role: "", salary: "", wallet: "" })
      setIsAddingEmployee(false)
    }
  }

  const handleOneTimePayment = (empName: string) => {
    addNotification({
      title: "Payment Authorized",
      message: `One-time bonus payment processed for ${empName}`,
      type: "success",
    })
  }

  const handleBulkImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      addNotification({
        title: "CSV Import Initiated",
        message: `Processing ${file.name} for bulk employee onboarding...`,
        type: "info",
      })
      setTimeout(() => {
        addNotification({
          title: "Import Complete",
          message: `Successfully imported 12 employees from ${file.name}`,
          type: "success",
        })
        setIsBulkImporting(false)
      }, 2000)
    }
  }

  const handleConfigureAutoTopup = () => {
    addNotification({
      title: "Auto-Topup Configured",
      message: `Vault will auto-refill with $${autoTopupConfig.amount} when balance drops below $${autoTopupConfig.threshold}`,
      type: "success",
    })
    setIsConfiguringAutoTopup(false)
  }

  return (
    <div className="space-y-6">
      {/* Company Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-black border-white/10 relative overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Monthly Payroll Burn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">${companyStats.monthlyBurn.toLocaleString()}</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[9px] font-bold uppercase">
              <TrendingDown className="w-3 h-3 text-green-400" />
              <span className="text-green-400">-2.4% vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Active Streams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">
                {employees.filter((e) => e.status === "Active").length}
              </span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase">/ {employees.length} Total</span>
            </div>
            <div className="mt-2 text-[9px] font-bold text-cyan-400 uppercase tracking-widest">
              Protocol Streaming Stable
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Vault Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-orange-500">${companyStats.vaultBalance.toLocaleString()}</span>
            </div>
            <div className="mt-2 text-[9px] font-bold text-neutral-500 uppercase">Supports 5.7 months burn</div>
          </CardContent>
        </Card>

        <Card className="bg-black border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Compliance Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-green-400">100%</span>
            </div>
            <div className="mt-2 text-[9px] font-bold text-neutral-500 uppercase">Tax Withholding Auto-Sync</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Dialog open={isBulkImporting} onOpenChange={setIsBulkImporting}>
          <Button
            onClick={() => setIsBulkImporting(true)}
            variant="outline"
            className="h-20 border-white/10 hover:bg-white/5 bg-transparent text-left flex items-center gap-4 p-6"
          >
            <Upload className="w-6 h-6 text-orange-500" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest">CSV Import</p>
              <p className="text-[8px] text-neutral-500 uppercase mt-1">Bulk Employee Onboarding</p>
            </div>
          </Button>
          <DialogContent className="bg-black border-white/10 text-white font-mono sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-orange-500 uppercase tracking-widest italic font-black">
                BULK_IMPORT_EMPLOYEES
              </DialogTitle>
              <DialogDescription className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">
                Upload a CSV with columns: name, role, salary, wallet_address
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <input type="file" ref={fileInputRef} accept=".csv" onChange={handleBulkImport} className="hidden" />
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-white/20 hover:border-orange-500/50 bg-white/5 hover:bg-white/10 transition-all"
              >
                <div className="flex flex-col items-center gap-3">
                  <Upload className="w-8 h-8 text-orange-500" />
                  <div className="text-center">
                    <p className="text-[10px] font-black uppercase">Click to Upload CSV</p>
                    <p className="text-[8px] text-neutral-500 mt-1 uppercase">Or drag and drop</p>
                  </div>
                </div>
              </Button>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setIsBulkImporting(false)}
                variant="outline"
                className="border-white/20 bg-transparent"
              >
                CANCEL
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button
          onClick={() => {
            const csvContent =
              "Name,Role,Salary,Wallet\nAgent Smith,Engineer,120000,0x71C7...F2C4\nAgent Jones,Designer,95000,0x3A9D...B1E8"
            const blob = new Blob([csvContent], { type: "text/csv" })
            const url = URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = "jetrpay_template.csv"
            a.click()
            addNotification({
              title: "Template Downloaded",
              message: "CSV template ready for employee import",
              type: "success",
            })
          }}
          variant="outline"
          className="h-20 border-white/10 hover:bg-white/5 bg-transparent text-left flex items-center gap-4 p-6"
        >
          <Download className="w-6 h-6 text-cyan-400" />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest">Download Template</p>
            <p className="text-[8px] text-neutral-500 uppercase mt-1">CSV Format Guide</p>
          </div>
        </Button>

        <Dialog open={isConfiguringAutoTopup} onOpenChange={setIsConfiguringAutoTopup}>
          <Button
            onClick={() => setIsConfiguringAutoTopup(true)}
            variant="outline"
            className="h-20 border-white/10 hover:bg-white/5 bg-transparent text-left flex items-center gap-4 p-6"
          >
            <SettingsIcon className="w-6 h-6 text-green-400" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest">Auto-Topup</p>
              <p className="text-[8px] text-neutral-500 uppercase mt-1">Configure Treasury Refill</p>
            </div>
          </Button>
          <DialogContent className="bg-black border-white/10 text-white font-mono sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-green-400 uppercase tracking-widest italic font-black">
                CONFIGURE_AUTO_TOPUP
              </DialogTitle>
              <DialogDescription className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">
                Automatically refill vault when balance drops below threshold
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                  Trigger Threshold (USDC)
                </label>
                <Input
                  type="number"
                  value={autoTopupConfig.threshold}
                  onChange={(e) => setAutoTopupConfig({ ...autoTopupConfig, threshold: e.target.value })}
                  placeholder="5000"
                  className="bg-black border-white/10 text-white h-12 font-black"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                  Refill Amount (USDC)
                </label>
                <Input
                  type="number"
                  value={autoTopupConfig.amount}
                  onChange={(e) => setAutoTopupConfig({ ...autoTopupConfig, amount: e.target.value })}
                  placeholder="20000"
                  className="bg-black border-white/10 text-white h-12 font-black"
                />
              </div>
              <div className="bg-white/5 p-4 border border-white/10">
                <p className="text-[9px] text-neutral-400 uppercase font-bold leading-relaxed">
                  When vault balance drops below ${autoTopupConfig.threshold}, automatically transfer $
                  {autoTopupConfig.amount} from linked bank account or treasury wallet.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleConfigureAutoTopup}
                className="w-full bg-green-500 text-black hover:bg-green-600 font-black uppercase text-xs tracking-widest h-14"
              >
                ENABLE AUTO-TOPUP PROTOCOL
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Employee Management Section */}
      <Card className="bg-black border-white/10 overflow-hidden shadow-2xl">
        <div className="h-1 bg-cyan-500 w-full" />
        <CardHeader className="border-b border-white/5 pb-6">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-white italic">
                Payroll Management Console
              </CardTitle>
              <CardDescription className="text-[9px] font-bold uppercase text-neutral-500 mt-1 tracking-widest">
                Configure real-time streams and agent compensation parameters
              </CardDescription>
            </div>
            <Dialog open={isAddingEmployee} onOpenChange={setIsAddingEmployee}>
              <Button
                onClick={() => setIsAddingEmployee(true)}
                size="sm"
                className="bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-[10px] tracking-widest h-10 px-6"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Employee
              </Button>
              <DialogContent className="bg-black border-white/10 text-white font-mono sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle className="text-orange-500 uppercase tracking-widest italic font-black">
                    INITIALIZE NEW STREAM
                  </DialogTitle>
                  <DialogDescription className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">
                    Deploy a per-second salary streaming contract for a new protocol agent.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                        Agent Name
                      </label>
                      <Input
                        value={newEmployee.name}
                        onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                        placeholder="AGENT_NAME"
                        className="bg-black border-white/10 text-white h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                        Designation
                      </label>
                      <Input
                        value={newEmployee.role}
                        onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })}
                        placeholder="ROLE_ID"
                        className="bg-black border-white/10 text-white h-12"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                      Annual Compensation (USDC)
                    </label>
                    <Input
                      type="number"
                      value={newEmployee.salary}
                      onChange={(e) => setNewEmployee({ ...newEmployee, salary: e.target.value })}
                      placeholder="0.00"
                      className="bg-black border-white/10 text-white h-12 font-black"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                      Arbitrum Wallet Address
                    </label>
                    <Input
                      value={newEmployee.wallet}
                      onChange={(e) => setNewEmployee({ ...newEmployee, wallet: e.target.value })}
                      placeholder="0x..."
                      className="bg-black border-white/10 text-white h-12 font-mono"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleAddEmployee}
                    className="w-full bg-orange-500 text-black hover:bg-orange-600 font-black uppercase text-xs tracking-widest h-14"
                  >
                    AUTHORIZE PROTOCOL DEPLOYMENT
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Filters */}
          <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row items-center gap-4 bg-white/[0.02]">
            <div className="relative w-full sm:flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH AGENT DATABASE..."
                className="pl-10 h-10 bg-black border-white/10 text-[10px] font-black tracking-[0.2em] uppercase placeholder:text-neutral-700 focus:border-cyan-500/50"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto border-white/10 text-[10px] font-black uppercase tracking-widest text-neutral-500 h-10 bg-transparent hover:bg-white/5"
            >
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-white/[0.02] border-b border-white/5">
                <tr>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500">
                    Protocol Agent
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500">
                    Annual Compensation
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500">
                    Stream Rate
                  </th>
                  <th className="px-6 py-4 text-[9px] font-black uppercase tracking-[0.3em] text-neutral-500">
                    Accrued Balance
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-black group-hover:border-orange-500 transition-all">
                          {emp.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-black text-white uppercase tracking-tight">{emp.name}</p>
                          <p className="text-[9px] text-neutral-600 font-black uppercase tracking-widest">{emp.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-3 py-1 border transition-all",
                          emp.status === "Active"
                            ? "border-green-500/50 text-green-400 bg-green-500/5"
                            : "border-yellow-500/50 text-yellow-400 bg-yellow-500/5",
                        )}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-white font-mono tracking-tight">
                      ${emp.salary.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-xs font-black text-cyan-400 font-mono tracking-tight">
                      ${emp.ratePerSecond.toFixed(6)}/s
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-xs font-black text-white font-mono tracking-tight">
                          ${emp.accruedBalance.toLocaleString()}
                        </p>
                        <div className="w-28 h-1 bg-white/5 border border-white/10 overflow-hidden">
                          <div
                            className="h-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                            style={{ width: "45%" }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-neutral-600 hover:text-white hover:bg-white/5 transition-all"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-black border-white/10 text-white font-mono min-w-[200px] shadow-2xl z-[100]">
                          <DropdownMenuItem
                            className="text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-orange-500/10 focus:bg-orange-500/10 focus:text-orange-500 p-3"
                            onClick={() => updateEmployeeStatus(emp.id, emp.status === "Active" ? "Paused" : "Active")}
                          >
                            {emp.status === "Active" ? (
                              <>
                                <PowerOff className="w-4 h-4 mr-3" /> Pause Stream
                              </>
                            ) : (
                              <>
                                <Power className="w-4 h-4 mr-3" /> Resume Stream
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-cyan-500/10 focus:bg-cyan-500/10 focus:text-cyan-400 p-3"
                            onClick={() => handleOneTimePayment(emp.name)}
                          >
                            <DollarSign className="w-4 h-4 mr-3" /> Authorize Bonus
                          </DropdownMenuItem>
                          <div className="h-px bg-white/5 my-1" />
                          <DropdownMenuItem
                            className="text-[10px] font-black uppercase tracking-widest cursor-pointer hover:bg-red-500/10 focus:bg-red-500/10 text-red-500 focus:text-red-500 p-3"
                            onClick={() => removeEmployee(emp.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-3" /> Terminate Access
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black text-neutral-700 uppercase tracking-widest">
              INDEX_SCAN: {filteredEmployees.length} of {employees.length} AGENTS DETECTED
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
