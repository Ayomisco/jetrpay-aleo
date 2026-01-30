"use client"

import { useApp } from "@/lib/app-context-v2"
import SystemSettings from "@/components/dashboard/system-settings"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function SettingsPage() {
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

  return <SystemSettings />
}
