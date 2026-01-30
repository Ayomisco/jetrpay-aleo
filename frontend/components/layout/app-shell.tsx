"use client"

import { useState, type ReactNode } from "react"
import { Wallet, Settings, Bell, Zap, LayoutDashboard, History, X, Menu, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/app-context-v2"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface AppShellProps {
  children: ReactNode
}

export default function AppShell({ children }: AppShellProps) {
  const {
    userRole,
    userName,
    setIsLoggedIn,
    notifications,
    unreadCount,
    markNotificationRead,
    clearAllNotifications,
    walletAddress,
    connectWallet,
  } = useApp()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { id: "dashboard", icon: LayoutDashboard, label: "COMMAND", href: "/dashboard" },
    { id: "payroll", icon: Zap, label: userRole === "admin" ? "PAYROLL" : "STREAMS", href: "/payroll" },
    { id: "wallet", icon: Wallet, label: "VAULT", href: "/wallet" },
    { id: "transactions", icon: History, label: "LEDGER", href: "/transactions" },
    { id: "analytics", icon: TrendingUp, label: "INTELLIGENCE", href: "/analytics" },
    { id: "settings", icon: Settings, label: "SYSTEMS", href: "/settings" },
  ]

  const handleSignOut = () => {
    setIsLoggedIn(false)
    router.push("/")
  }

  return (
    <div className="flex h-screen bg-black text-white font-mono selection:bg-cyan-500 selection:text-black overflow-hidden relative">
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-[100] md:hidden animate-in fade-in flex flex-col p-8">
          <div className="flex justify-between items-center mb-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black italic">
                J
              </div>
              <div>
                <h1 className="text-xl font-black italic text-white uppercase tracking-tighter">JETRPAY</h1>
                <div className="px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/30 inline-block">
                  <span className="text-cyan-400 font-black text-[7px] uppercase tracking-widest">on Aleo</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
              <X className="w-6 h-6" />
            </Button>
          </div>
          <nav className="space-y-6 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-4 text-2xl font-black tracking-widest uppercase",
                  pathname === item.href ? "text-cyan-500" : "text-neutral-600",
                )}
              >
                <item.icon className="w-8 h-8" /> {item.label}
              </Link>
            ))}
          </nav>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start p-0 text-[8px] font-black text-neutral-600 hover:text-red-500 uppercase tracking-widest"
          >
            DISCONNECT
          </Button>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-black hidden md:flex flex-col relative z-50">
        <div className="p-8">
          <Link href="/dashboard" className="flex items-center gap-3 mb-16 group">
            <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black italic transition-transform group-hover:rotate-12">
              J
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tighter italic text-white uppercase">JETRPAY</h1>
              <div className="px-2 py-0.5 bg-cyan-400/10 border border-cyan-400/30 inline-block">
                <span className="text-cyan-400 font-black text-[7px] uppercase tracking-widest">on Aleo</span>
              </div>
            </div>
          </Link>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 p-3 transition-all relative group",
                  pathname === item.href ? "text-cyan-500" : "text-neutral-500 hover:text-white",
                )}
              >
                <item.icon className={cn("w-5 h-5", pathname === item.href && "neon-text-orange")} />
                <span className="text-[10px] font-black tracking-[0.2em] uppercase">{item.label}</span>
                {pathname === item.href && (
                  <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-8 border-t border-white/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-white/5 border border-white/10 flex items-center justify-center font-black text-[10px]">
              A
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-white truncate">{userName || "AGENT_0x71"}</p>
              <p className="text-[8px] font-bold uppercase text-neutral-600">
                {userRole === "admin" ? "ENTERPRISE" : "AGENT"}
              </p>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start p-0 text-[8px] font-black text-neutral-600 hover:text-red-500 uppercase tracking-widest"
          >
            DISCONNECT
          </Button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-white/5 bg-black/60 backdrop-blur-xl flex items-center justify-between px-6 sm:px-10 z-40">
          <div className="flex items-center gap-6">
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(true)} className="md:hidden">
              <Menu className="w-6 h-6" />
            </Button>
            <div className="hidden lg:flex items-center gap-4 text-[9px] font-black text-neutral-600 tracking-widest">
              <span className="text-cyan-500 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" /> ALEO_TESTNET
              </span>
              <div className="w-px h-3 bg-white/10" />
              <span>v0.1.0_BETA</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative group">
                  <Bell className="w-5 h-5 text-neutral-500 group-hover:text-orange-500" />
                  {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 border border-black shadow-[0_0_5px_rgba(249,115,22,0.8)]" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 bg-black border-white/10 p-0 text-white font-mono shadow-2xl mr-4">
                <div className="p-4 border-b border-white/10 flex items-center justify-between">
                  <h3 className="text-[10px] font-black uppercase text-orange-500 italic">SYSTEM_LOGS</h3>
                  <Button
                    variant="ghost"
                    onClick={clearAllNotifications}
                    className="h-auto p-0 text-[8px] font-black uppercase text-neutral-600 hover:text-white"
                  >
                    WIPE_ALL
                  </Button>
                </div>
                <div className="max-h-[300px] overflow-y-auto divide-y divide-white/5">
                  {notifications.length === 0 ? (
                    <div className="p-12 text-center opacity-30">
                      <p className="text-[10px] font-black uppercase">VOID_LEDGER</p>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={cn(
                          "p-4 space-y-1 cursor-pointer",
                          !notif.read ? "bg-orange-500/[0.03]" : "opacity-60",
                        )}
                        onClick={() => markNotificationRead(notif.id)}
                      >
                        <div className="flex justify-between">
                          <span className="text-[9px] font-black uppercase text-white">{notif.title}</span>
                          <span className="text-[7px] text-neutral-600 uppercase">JUST_NOW</span>
                        </div>
                        <p className="text-[9px] text-neutral-400 uppercase leading-tight">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <Button
              onClick={() => connectWallet()}
              className={cn(
                "h-10 px-6 font-black text-[10px] tracking-widest uppercase transition-all",
                walletAddress ? "bg-cyan-500 text-black hover:bg-cyan-400" : "bg-transparent border border-white/20 hover:bg-white/5",
              )}
            >
              {walletAddress 
                ? walletAddress.slice(0, 6) + "..." + walletAddress.slice(-4) 
                : "CONNECT_WALLET"}
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-10 relative">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>

        <footer className="h-8 border-t border-white/5 bg-black flex items-center justify-between px-8 text-[8px] font-black text-neutral-700 uppercase tracking-[0.3em] shrink-0">
          <div className="flex items-center gap-6">
            <span className="text-orange-500/60 flex items-center gap-2">
              <div className="w-1 h-1 bg-orange-500 rounded-full" /> LIVE_NETWORK_SYNC
            </span>
            <span className="hidden sm:inline border-x border-white/5 px-4">LATENCY: 12ms</span>
          </div>
          <span className="italic">VERIFIED_IMMUTABLE_INFRASTRUCTURE</span>
        </footer>
      </div>
    </div>
  )
}
