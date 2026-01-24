"use client"

import { useApp } from "@/lib/app-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import AdminPayrollConsole from "@/components/dashboard/admin-payroll-console"
import EmployeeStreamsDashboard from "@/components/dashboard/employee-streams-dashboard"

export default function PayrollPage() {
  const { isLoggedIn, userRole } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null
  }

  return userRole === "admin" ? <AdminPayrollConsole /> : <EmployeeStreamsDashboard />
}
