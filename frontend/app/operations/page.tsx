"use client"

import { useApp } from "@/lib/app-context-v2"
import OperationsCenter from "@/components/dashboard/operations-center"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function OperationsPage() {
  const { isLoggedIn } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn) {
    return null
  }

  return <OperationsCenter />
}
