"use client"

import { useApp } from "@/lib/app-context"
import EmployeeFinancialHub from "@/components/dashboard/employee-financial-hub"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function FinancialHubPage() {
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

  return (
    <div className="space-y-6">
      <EmployeeFinancialHub />
    </div>
  )
}
