"use client"

import Onboarding from "@/components/auth/onboarding"
import { useApp } from "@/lib/app-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function OnboardingPage() {
  const { isLoggedIn } = useApp()
  const router = useRouter()

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard")
    }
  }, [isLoggedIn, router])

  return <Onboarding />
}
