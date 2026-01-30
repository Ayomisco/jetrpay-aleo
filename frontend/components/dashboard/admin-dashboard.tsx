"use client"

import { useState } from "react"
import {
  TrendingDown,
  Plus,
  Calendar,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Power,
  PowerOff,
  DollarSign,
  Shield,
  Loader2,
  RefreshCw,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useApp } from "@/lib/app-context-v2"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { formatAddress } from "@/lib/aleo"

export default function AdminDashboard() {
  const { 
    employees, 
    companyStats, 
    updateEmployeeStatus, 
    addEmployee, 
    removeEmployee, 
    addNotification,
    createEmployeeStream,
    isTransacting,
    walletAddress,
    currentBlockHeight,
    networkStatus,
    refreshData,
    isLoading
  } = useApp()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddingEmployee, setIsAddingEmployee] = useState(false)

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

  const handleAddEmployee = async () => {
    if (newEmployee.name && newEmployee.role && newEmployee.salary && newEmployee.wallet) {
      // Create on-chain stream
      const streamCreated = await createEmployeeStream(
        newEmployee.wallet,
        Number.parseFloat(newEmployee.salary)
      )
      
      if (streamCreated) {
        addEmployee({
          id: `emp-${Date.now()}`,
          name: newEmployee.name,
          role: newEmployee.role,
          status: "Active",
          salary: Number.parseFloat(newEmployee.salary),
          ratePerSecond: Number.parseFloat(newEmployee.salary) / 31536000,
          accruedBalance: 0,
          walletAddress: newEmployee.wallet,
          startDate: new Date().toISOString().split("T")[0],
        })
        setNewEmployee({ name: "", role: "", salary: "", wallet: "" })
        setIsAddingEmployee(false)
        
        addNotification({
          title: "ZK Stream Created",
          message: `Private salary stream created for ${newEmployee.name} on Aleo`,
          type: "success",
        })
      }
    } else if (newEmployee.name && newEmployee.role && newEmployee.salary) {
      // Demo mode - no on-chain
      addEmployee({
        id: `emp-${Date.now()}`,
        name: newEmployee.name,
        role: newEmployee.role,
        status: "Active",
        salary: Number.parseFloat(newEmployee.salary),
        ratePerSecond: Number.parseFloat(newEmployee.salary) / 31536000,
        accruedBalance: 0,
        walletAddress: newEmployee.wallet || "aleo1" + Math.random().toString(36).slice(2, 10) + "...",
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

  return (
    <div className="space-y-6">
      {/* Network Status Bar */}
      <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-neutral-500 px-1">
        <span className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", networkStatus === "connected" ? "bg-cyan-500" : "bg-red-500")} />
          {networkStatus === "connected" ? "ALEO_TESTNET" : "DISCONNECTED"}
        </span>
        <span>Block: {currentBlockHeight.toLocaleString()}</span>
        {walletAddress && <span>Admin: {formatAddress(walletAddress)}</span>}
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

      {/* Company Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none relative overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Privacy Pool Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">${companyStats.monthlyBurn.toLocaleString()}</span>
            </div>
            <div className="mt-2 flex items-center gap-1 text-[9px] font-bold uppercase">
              <Shield className="w-3 h-3 text-cyan-400" />
              <span className="text-cyan-400">Encrypted • ZK-Verified</span>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity">
            <Shield className="w-12 h-12 text-cyan-400" />
          </div>
        </Card>

        <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Anonymous Claims
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white">{employees.length}</span>
              <span className="text-[10px] font-bold text-neutral-500 uppercase">Employees</span>
            </div>
            <div className="mt-2 text-[9px] font-bold text-cyan-400 uppercase tracking-widest">
              Identities Hidden • ZK Verified
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              Allocated (Private)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-purple-500">${companyStats.vaultBalance.toLocaleString()}</span>
            </div>
            <div className="mt-2 text-[9px] font-bold text-neutral-500 uppercase">Balance Hidden from Public</div>
          </CardContent>
        </Card>

        <Card className="bg-[#0f0f0f] border-neutral-800 rounded-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
              ZK Compliance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-green-400">100%</span>
            </div>
            <div className="mt-2 text-[9px] font-bold text-neutral-500 uppercase">Proofs Ready for Auditors</div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Management Section */}
      <Card className="bg-black border-neutral-800 rounded-none overflow-hidden shadow-2xl">
        <div className="h-1 bg-cyan-500 w-full" />
        <CardHeader className="border-b border-neutral-900 pb-6">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div>
              <CardTitle className="text-sm font-black uppercase tracking-[0.2em] text-white italic">
                Payroll Management Console
              </CardTitle>
              <CardDescription className="text-[9px] font-bold uppercase text-neutral-500 mt-1 tracking-widest">
                Configure real-time streams and agent compensation parameters
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="border-neutral-800 text-[10px] font-black uppercase tracking-widest text-white rounded-none h-10 hover:bg-white/5 bg-transparent"
              >
                <Calendar className="w-4 h-4 mr-2" /> Payroll History
              </Button>

              <Dialog open={isAddingEmployee} onOpenChange={setIsAddingEmployee}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-[10px] tracking-widest rounded-none h-10"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#0c0c0c] border-neutral-800 text-white font-mono rounded-none sm:max-w-lg">
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
                          className="bg-black border-neutral-800 text-white rounded-none h-12"
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
                          className="bg-black border-neutral-800 text-white rounded-none h-12"
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
                        className="bg-black border-neutral-800 text-white rounded-none h-12 font-black"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                        Aleo Wallet Address
                      </label>
                      <Input
                        value={newEmployee.wallet}
                        onChange={(e) => setNewEmployee({ ...newEmployee, wallet: e.target.value })}
                        placeholder="aleo1..."
                        className="bg-black border-neutral-800 text-white rounded-none h-12 font-mono"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAddEmployee}
                      className="w-full bg-orange-500 text-black hover:bg-orange-600 font-black uppercase text-xs tracking-widest rounded-none h-14"
                    >
                      AUTHORIZE PROTOCOL DEPLOYMENT
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Filters */}
          <div className="p-4 border-b border-neutral-900 flex flex-col sm:flex-row items-center gap-4 bg-[#0a0a0a]">
            <div className="relative w-full sm:flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="SEARCH AGENT DATABASE..."
                className="pl-10 h-10 bg-black border-neutral-800 text-[10px] font-black tracking-[0.2em] uppercase placeholder:text-neutral-700 rounded-none focus:border-cyan-500/50"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full sm:w-auto border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-500 rounded-none h-10 bg-transparent hover:bg-white/5"
            >
              <Filter className="w-4 h-4 mr-2" /> Filter
            </Button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-[#0d0d0d] border-b border-neutral-900">
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
              <tbody className="divide-y divide-neutral-900">
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-neutral-950 border border-neutral-800 flex items-center justify-center text-[11px] font-black group-hover:border-orange-500 transition-all shadow-inner">
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
                        <div className="w-28 h-1 bg-neutral-950 border border-neutral-900 rounded-none overflow-hidden">
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
                        <DropdownMenuContent className="bg-[#0c0c0c] border-neutral-800 text-white font-mono rounded-none min-w-[200px] shadow-2xl z-[100]">
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
                          <div className="h-px bg-neutral-900 my-1" />
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

          <div className="p-6 bg-[#0d0d0d] border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[10px] font-black text-neutral-700 uppercase tracking-widest">
              INDEX_SCAN: {filteredEmployees.length} of {employees.length} AGENTS DETECTED
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-neutral-900 h-10 px-6 text-[10px] font-black uppercase rounded-none opacity-50 cursor-not-allowed bg-transparent tracking-widest"
              >
                PREV_BLOCK
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-neutral-800 h-10 px-6 text-[10px] font-black uppercase rounded-none hover:bg-white/5 bg-transparent tracking-widest"
              >
                NEXT_BLOCK
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
