import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono as GeistMono } from "next/font/google"
import "./globals.css"
import { AppProvider } from "@/lib/app-context-v2"

const geistMono = GeistMono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "JetrPay | Real-Time Crypto Payroll",
  description: "Get paid by the second. Private payroll streaming infrastructure on Aleo with zero-knowledge proofs.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistMono.className} bg-black text-white antialiased`} suppressHydrationWarning>
        <AppProvider>
          <LayoutWrapper>{children}</LayoutWrapper>
        </AppProvider>
      </body>
    </html>
  )
}

function LayoutWrapper({ children }: { children: React.ReactNode }) {
  return children
}
