"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2, Briefcase } from "lucide-react"
import { useRouter } from "next/navigation"

export default function UseCasesPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-neutral-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-neutral-400 hover:text-white text-[10px] font-bold uppercase mb-6 inline-block"
          >
            ← Back to Home
          </Link>
          <h1 className="text-5xl sm:text-6xl font-black italic tracking-tighter">Use Cases</h1>
          <p className="text-neutral-400 mt-4 max-w-2xl">
            Discover how JetrPay transforms payroll for every business type.
          </p>
        </div>
      </div>

      {/* Use Cases */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-12">
        {/* Enterprises */}
        <section className="border border-neutral-800 rounded-none overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="p-12 bg-[#0f0f0f] space-y-6">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-none w-fit">
                <Building2 className="w-6 h-6 text-cyan-500" />
              </div>
              <h2 className="text-3xl font-black italic tracking-tighter">Enterprises & Startups</h2>
              <p className="text-neutral-400">
                Scale your payroll operations with military-grade privacy. Zero-knowledge proofs ensure sensitive salary data never leaks.
              </p>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li className="flex gap-3">
                  <span className="text-cyan-500 font-bold">✓</span>
                  <span>Bulk ZK proof generation for instant payroll</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-500 font-bold">✓</span>
                  <span>Real-time burn rate privacy</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-500 font-bold">✓</span>
                  <span>Multi-sig treasury vault controls</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-500 font-bold">✓</span>
                  <span>Global off-ramp with zero history</span>
                </li>
              </ul>
              <Button className="bg-cyan-500 hover:bg-cyan-600 text-black font-black uppercase text-xs tracking-widest rounded-none h-12 w-full mt-6">
                Start Enterprise Trial
              </Button>
            </div>
            <div className="bg-gradient-to-br from-cyan-500/10 to-transparent p-12 flex items-center justify-center border-l border-neutral-800">
              <div className="space-y-6">
                <div className="p-4 bg-black border border-neutral-800 rounded-none">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase mb-2">Typical Results</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Payroll Privacy</span>
                      <span className="text-cyan-500 font-bold">100% Encrypted</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Employee Data Leaks</span>
                      <span className="text-cyan-500 font-bold">Zero</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Compliance Overhead</span>
                      <span className="text-cyan-500 font-bold">-70%</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Freelancers */}
        <section className="border border-neutral-800 rounded-none overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="bg-gradient-to-br from-purple-400/10 to-transparent p-12 flex items-center justify-center border-r border-neutral-800 order-2 md:order-1">
              <div className="space-y-6">
                <div className="p-4 bg-black border border-neutral-800 rounded-none">
                  <p className="text-[10px] font-bold text-neutral-500 uppercase mb-2">Freelancer Benefits</p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Payment Speed</span>
                      <span className="text-purple-400 font-bold">Instant</span>
                    </li>
                    <li className="flex justify-between">
                      <span>No Waiting Fees</span>
                      <span className="text-cyan-400 font-bold">2% APR</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Auto Savings</span>
                      <span className="text-cyan-400 font-bold">28% Avg</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-12 bg-[#0f0f0f] space-y-6 order-1 md:order-2">
              <div className="p-3 bg-cyan-400/10 border border-cyan-400/30 rounded-none w-fit">
                <Briefcase className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-black italic tracking-tighter">Freelancers & Gig Workers</h2>
              <p className="text-neutral-400">
                Stop waiting for payday. Get instant access to every dollar you've earned.
              </p>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Instant wage access without long waits</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Automated savings goals</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Bill payment automation</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>Low-cost global transfers</span>
                </li>
              </ul>
              <Button className="bg-cyan-400 hover:bg-cyan-500 text-black font-black uppercase text-xs tracking-widest rounded-none h-12 w-full mt-6">
                Open Freelancer Account
              </Button>
            </div>
          </div>
        </section>

        {/* Case Study */}
        <section className="border border-neutral-800 rounded-none p-12 bg-[#0f0f0f] space-y-8">
          <h2 className="text-3xl font-black italic tracking-tighter">Case Study: MetaGlobal Tech</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Employees Onboarded", value: "250+", change: "From 2 days to 2 hours" },
              { label: "Payroll Processing", value: "Real-time", change: "Previously weekly batch" },
              {
                label: "Operational Savings",
                value: "$120K/yr",
                change: "Via automation & elimination of intermediaries",
              },
            ].map((stat, i) => (
              <div key={i} className="p-6 border border-neutral-800 rounded-none space-y-3">
                <p className="text-[10px] font-bold text-neutral-500 uppercase">{stat.label}</p>
                <p className="text-3xl font-black text-orange-500">{stat.value}</p>
                <p className="text-[9px] text-neutral-500 font-bold">{stat.change}</p>
              </div>
            ))}
          </div>
          <p className="text-neutral-400">
            "JetrPay transformed how we manage global payroll. Our employees are happier, our operations are leaner, and
            our treasury is more efficient."
          </p>
          <p className="font-black text-white">— CEO, MetaGlobal Tech</p>
        </section>
      </div>

      {/* Footer CTA */}
      <section className="border-t border-neutral-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-4xl font-black italic tracking-tighter">Ready to Start?</h2>
          <Button
            onClick={() => (window.location.href = "/dashboard")}
            className="bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-xs tracking-widest rounded-none h-14 px-8 mx-auto"
          >
            Launch JetrPay Now <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  )
}
