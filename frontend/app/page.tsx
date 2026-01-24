"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Wallet, TrendingUp, Shield, Users, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/app-context"
import { useEffect } from "react"

export default function LandingPage() {
  const router = useRouter()
  const { isLoggedIn } = useApp()

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/dashboard")
    }
  }, [isLoggedIn, router])

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-neutral-900 sticky top-0 z-50 bg-black/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="font-black text-2xl italic tracking-tighter">
            JetrPay<span className="text-orange-500">.</span>
          </div>
          <div className="hidden md:flex gap-8 items-center text-[10px] font-bold uppercase tracking-widest">
            <a href="#features" className="text-neutral-400 hover:text-white transition">
              Features
            </a>
            <a href="#use-cases" className="text-neutral-400 hover:text-white transition">
              Use Cases
            </a>
            <a href="/roadmap" className="text-neutral-400 hover:text-white transition">
              Roadmap
            </a>
            <a href="/pricing" className="text-neutral-400 hover:text-white transition">
              Pricing
            </a>
          </div>
          <Button
            onClick={() => router.push("/onboarding")}
            className="bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-xs tracking-widest rounded-none h-10"
          >
            Launch App
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center border-b border-neutral-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-cyan-400/5" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-block px-4 py-2 border border-orange-500/30 bg-orange-500/5 rounded-none">
            <p className="text-orange-500 font-black uppercase text-[10px] tracking-widest">
              Next-Gen Payroll Infrastructure
            </p>
          </div>

          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black italic tracking-tighter leading-tight text-balance">
            Real-Time Payroll{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
              on Arbitrum
            </span>
          </h1>

          <p className="text-xl text-neutral-400 max-w-2xl mx-auto text-balance">
            Stream salaries per-second. Give employees instant access to earned wages. Build the future of work.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              onClick={() => router.push("/onboarding")}
              className="bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-xs tracking-widest rounded-none h-14 px-8"
            >
              Get Started <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="border-neutral-800 text-white hover:bg-white/5 font-black uppercase text-xs tracking-widest rounded-none h-14 px-8 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-6 pt-12 text-center">
            <div>
              <p className="text-2xl font-black text-orange-500">$420K+</p>
              <p className="text-[10px] text-neutral-500 font-bold uppercase mt-2">Monthly Payroll</p>
            </div>
            <div>
              <p className="text-2xl font-black text-cyan-400">50+</p>
              <p className="text-[10px] text-neutral-500 font-bold uppercase mt-2">Active Employees</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">99.9%</p>
              <p className="text-[10px] text-neutral-500 font-bold uppercase mt-2">Uptime</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter mb-16 text-center">Core Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Zap, label: "Per-Second Streams", desc: "Real-time salary disbursement on Arbitrum" },
              { icon: Wallet, label: "Earned Wage Access", desc: "Instant access to accrued wages anytime" },
              { icon: TrendingUp, label: "Analytics Dashboard", desc: "Real-time payroll metrics and burn rates" },
              { icon: Shield, label: "Multi-Sig Vaults", desc: "Enterprise-grade security for treasuries" },
              { icon: Users, label: "Bulk Payroll", desc: "CSV import and manage 1000+ employees" },
              { icon: Globe, label: "Global On/Off-Ramp", desc: "Connect to 100+ fiat and crypto rails" },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="p-6 bg-[#0f0f0f] border border-neutral-800 rounded-none hover:border-orange-500/30 transition group"
                >
                  <div className="p-3 bg-orange-500/10 border border-orange-500/30 rounded-none w-fit mb-4 group-hover:bg-orange-500/20 transition">
                    <Icon className="w-6 h-6 text-orange-500" />
                  </div>
                  <h3 className="font-black uppercase text-white text-sm tracking-widest mb-2">{feature.label}</h3>
                  <p className="text-[10px] text-neutral-500 font-bold">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter mb-16 text-center">
            Who Uses JetrPay
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link
              href="/use-cases/enterprises"
              className="p-8 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/30 rounded-none hover:border-orange-500 transition group"
            >
              <h3 className="font-black text-xl uppercase tracking-widest text-white mb-3 group-hover:text-orange-500 transition">
                Enterprises & Startups
              </h3>
              <p className="text-neutral-400 text-sm mb-6">
                Scale payroll operations globally with per-second settlement and instant access to funds.
              </p>
              <div className="text-orange-500 font-black uppercase text-[10px] flex items-center gap-2">
                Learn More <ArrowRight className="w-3 h-3" />
              </div>
            </Link>

            <Link
              href="/use-cases/freelancers"
              className="p-8 bg-gradient-to-br from-cyan-400/10 to-transparent border border-cyan-400/30 rounded-none hover:border-cyan-400 transition group"
            >
              <h3 className="font-black text-xl uppercase tracking-widest text-white mb-3 group-hover:text-cyan-400 transition">
                Freelancers & Gig Workers
              </h3>
              <p className="text-neutral-400 text-sm mb-6">
                Get instant access to your earnings. No waiting days or hidden fees.
              </p>
              <div className="text-cyan-400 font-black uppercase text-[10px] flex items-center gap-2">
                Learn More <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-b border-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter">Ready to Transform Payroll?</h2>
          <p className="text-lg text-neutral-400">Join the future of work. Stream salaries today.</p>
          <Button
            onClick={() => router.push("/onboarding")}
            className="bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-xs tracking-widest rounded-none h-14 px-8 mx-auto"
          >
            Launch JetrPay <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="font-black uppercase text-[10px] text-neutral-500 mb-4">Product</p>
              <ul className="space-y-2 text-[10px] text-neutral-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/roadmap" className="hover:text-white transition">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-black uppercase text-[10px] text-neutral-500 mb-4">Resources</p>
              <ul className="space-y-2 text-[10px] text-neutral-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-black uppercase text-[10px] text-neutral-500 mb-4">Company</p>
              <ul className="space-y-2 text-[10px] text-neutral-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-black uppercase text-[10px] text-neutral-500 mb-4">Legal</p>
              <ul className="space-y-2 text-[10px] text-neutral-400">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-900 pt-8 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-[10px] text-neutral-500 font-bold uppercase">© 2025 JetrPay. All Rights Reserved.</p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <a href="#" className="text-neutral-500 hover:text-white transition text-[10px] font-bold uppercase">
                Twitter
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition text-[10px] font-bold uppercase">
                Discord
              </a>
              <a href="#" className="text-neutral-500 hover:text-white transition text-[10px] font-bold uppercase">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
