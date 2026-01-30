"use client"

import { useApp } from "@/lib/app-context-v2"
import EmployeeDashboard from "@/components/dashboard/employee-dashboard"
import AdminDashboard from "@/components/dashboard/admin-dashboard"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
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

  return userRole === "employee" ? <EmployeeDashboard /> : <AdminDashboard />
}
