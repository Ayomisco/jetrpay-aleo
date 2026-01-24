"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Zap, Wallet, TrendingUp, Shield, Users, Globe } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LandingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-neutral-900 sticky top-0 z-50 bg-black/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="font-black text-2xl italic tracking-tighter">
              JetrPay<span className="text-cyan-400">.</span>
            </div>
            <div className="px-2 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded-none">
              <span className="text-cyan-400 font-black text-[8px] uppercase tracking-widest">on Aleo</span>
            </div>
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
            className="bg-cyan-400 hover:bg-cyan-500 text-black font-black uppercase text-xs tracking-widest rounded-none h-10"
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
          <div className="inline-block px-4 py-2 border border-cyan-400/30 bg-cyan-400/5 rounded-none">
            <p className="text-cyan-400 font-black uppercase text-[10px] tracking-widest">
              Privacy-First Payroll • Zero-Knowledge Proofs • Built on Aleo
            </p>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black italic tracking-tighter leading-tight text-balance">
            Pay Employees{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
              Anonymously
            </span>
            {" "}with Zero-Knowledge
          </h1>

          <p className="text-lg text-neutral-400 max-w-3xl mx-auto text-balance leading-relaxed">
            Companies send salaries <span className="text-white font-bold">without knowing who received what</span>. Employees receive payments <span className="text-white font-bold">without revealing their identity</span>. Powered by Aleo's programmable privacy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              onClick={() => router.push("/onboarding")}
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-black uppercase text-xs tracking-widest rounded-none h-14 px-8"
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
              <p className="text-2xl font-black text-cyan-400">100%</p>
              <p className="text-[10px] text-neutral-500 font-bold uppercase mt-2">Private by Default</p>
            </div>
            <div>
              <p className="text-2xl font-black text-purple-500">0</p>
              <p className="text-[10px] text-neutral-500 font-bold uppercase mt-2">Data Exposed</p>
            </div>
            <div>
              <p className="text-2xl font-black text-white">ZK</p>
              <p className="text-[10px] text-neutral-500 font-bold uppercase mt-2">Proof Verified</p>
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
              { icon: Shield, label: "Anonymous Claims", desc: "Employees claim salary with zero-knowledge proofs" },
              { icon: Zap, label: "Privacy Pool", desc: "Employer deposits without revealing allocations" },
              { icon: Users, label: "Unlinkable Wallets", desc: "No transaction graph analysis possible" },
              { icon: Globe, label: "Selective Disclosure", desc: "Prove compliance without exposing data" },
              { icon: Wallet, label: "ZK Compliance", desc: "Generate audit proofs for regulators" },
              { icon: TrendingUp, label: "Real-Time Access", desc: "Instant withdrawals with full privacy" },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="p-6 bg-[#0f0f0f] border border-neutral-800 rounded-none hover:border-cyan-400/30 transition group"
                >
                  <div className="p-3 bg-cyan-400/10 border border-cyan-400/30 rounded-none w-fit mb-4 group-hover:bg-cyan-400/20 transition">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="font-black uppercase text-white text-sm tracking-widest mb-2">{feature.label}</h3>
                  <p className="text-[10px] text-neutral-500 font-bold">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Privacy Crisis Section */}
      <section className="py-20 border-b border-neutral-900 bg-gradient-to-b from-red-950/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter mb-4">
              The Privacy{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                Crisis
              </span>
            </h2>
            <p className="text-neutral-400 max-w-2xl mx-auto">
              Traditional blockchain payroll is a surveillance nightmare. Here's what transparent chains expose:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-red-950/10 border border-red-500/20 rounded-none">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-none">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-sm uppercase tracking-widest text-red-400 mb-2">Employer Surveillance</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Employers see your side income, DeFi activities, and use it against you: <span className="text-white font-bold">"You don't need a raise."</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-orange-950/10 border border-orange-500/20 rounded-none">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-orange-500/10 border border-orange-500/30 rounded-none">
                  <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-sm uppercase tracking-widest text-orange-400 mb-2">Employee Leaks</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Coworkers discover salaries via transaction graphs. Pay discrimination becomes provable. <span className="text-white font-bold">Lawsuits follow.</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-yellow-950/10 border border-yellow-500/20 rounded-none">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-none">
                  <Globe className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-sm uppercase tracking-widest text-yellow-400 mb-2">Cross-Border Surveillance</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Governments monitor foreign payments. Banks flag conversions. <span className="text-white font-bold">Family sees income = safety risk.</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-red-950/10 border border-red-500/20 rounded-none">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-500/10 border border-red-500/30 rounded-none">
                  <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-sm uppercase tracking-widest text-red-400 mb-2">Financial Censorship</h3>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Banks freeze accounts based on employer name. <span className="text-white font-bold">Legal work, discriminated against.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center p-8 bg-gradient-to-r from-cyan-400/10 to-purple-500/10 border border-cyan-400/30 rounded-none">
            <p className="text-2xl font-black italic text-white mb-2">
              99% of blockchains make this <span className="text-red-500">WORSE</span>
            </p>
            <p className="text-sm text-neutral-400 max-w-2xl mx-auto">
              By putting all financial data on permanent public display. <span className="text-cyan-400 font-bold">Aleo changes everything.</span>
            </p>
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
              className="p-8 bg-gradient-to-br from-cyan-400/10 to-transparent border border-cyan-400/30 rounded-none hover:border-cyan-400 transition group"
            >
              <h3 className="font-black text-xl uppercase tracking-widest text-white mb-3 group-hover:text-cyan-400 transition">
                Crypto-Native Companies
              </h3>
              <p className="text-neutral-400 text-sm mb-6">
                Protect salary data from competitors. Prevent employee discrimination lawsuits. Privacy-first by default.
              </p>
              <div className="text-cyan-400 font-black uppercase text-[10px] flex items-center gap-2">
                Learn More <ArrowRight className="w-3 h-3" />
              </div>
            </Link>

            <Link
              href="/use-cases/freelancers"
              className="p-8 bg-gradient-to-br from-purple-500/10 to-transparent border border-purple-500/30 rounded-none hover:border-purple-500 transition group"
            >
              <h3 className="font-black text-xl uppercase tracking-widest text-white mb-3 group-hover:text-purple-500 transition">
                International Contractors
              </h3>
              <p className="text-neutral-400 text-sm mb-6">
                Avoid government surveillance. Protect from family pressure. Receive payments safely and privately.
              </p>
              <div className="text-purple-500 font-black uppercase text-[10px] flex items-center gap-2">
                Learn More <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-b border-neutral-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl sm:text-5xl font-black italic tracking-tighter">
            Ready for <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Private Payroll</span>?
          </h2>
          <p className="text-lg text-neutral-400">Prove everything. Reveal nothing. Pay everyone.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => router.push("/onboarding")}
              className="bg-cyan-400 hover:bg-cyan-500 text-black font-black uppercase text-xs tracking-widest rounded-none h-14 px-8 mx-auto"
            >
              Launch on Aleo <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="border-neutral-800 text-white hover:bg-white/5 font-black uppercase text-xs tracking-widest rounded-none h-14 px-8 bg-transparent"
              onClick={() => window.open('https://github.com/Ayomisco/jetrpay-aleo', '_blank')}
            >
              View on GitHub
            </Button>
          </div>
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
            <div className="flex items-center gap-3">
              <p className="text-[10px] text-neutral-500 font-bold uppercase">© 2026 JetrPay.</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-500 font-bold uppercase">Built on</span>
                <span className="text-[10px] text-cyan-400 font-black uppercase">ALEO</span>
              </div>
            </div>
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
