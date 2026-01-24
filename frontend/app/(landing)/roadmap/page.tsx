"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle } from "lucide-react"

export default function RoadmapPage() {
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
          <h1 className="text-5xl sm:text-6xl font-black italic tracking-tighter">Product Roadmap</h1>
          <p className="text-neutral-400 mt-4 max-w-2xl">Our vision for the future of payroll infrastructure.</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          {/* Q1 2025 */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic tracking-tighter text-orange-500">Q1 2025 — Foundation</h2>
            <div className="space-y-3">
              {[
                { item: "Per-second salary streaming on Arbitrum", completed: true },
                { item: "Employee dashboard & real-time accrual", completed: true },
                { item: "Earned Wage Access (EWA) feature", completed: true },
                { item: "Multi-sig vault security", completed: true },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-[#0f0f0f] border border-neutral-800 rounded-none">
                  {feature.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-0.5" />
                  )}
                  <span className={feature.completed ? "text-neutral-400 line-through" : "text-white"}>
                    {feature.item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Q2 2025 */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic tracking-tighter text-cyan-400">Q2 2025 — Expansion</h2>
            <div className="space-y-3">
              {[
                { item: "Bill pay automation & scheduling", completed: false },
                { item: "Savings goals with auto-transfer", completed: false },
                { item: "CSV bulk import for 1000+ employees", completed: false },
                { item: "Advanced analytics dashboard", completed: false },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-[#0f0f0f] border border-neutral-800 rounded-none">
                  <Circle className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-0.5" />
                  <span className="text-white">{feature.item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Q3 2025 */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic tracking-tighter text-white">Q3 2025 — Global</h2>
            <div className="space-y-3">
              {[
                { item: "Global on/off-ramp to 100+ currencies", completed: false },
                { item: "Mobile app (iOS & Android)", completed: false },
                { item: "Advanced KYC/KYB compliance", completed: false },
                { item: "API & developer platform", completed: false },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-[#0f0f0f] border border-neutral-800 rounded-none">
                  <Circle className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-0.5" />
                  <span className="text-white">{feature.item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Q4 2025 */}
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic tracking-tighter">Q4 2025 — Ecosystem</h2>
            <div className="space-y-3">
              {[
                { item: "Integrations with HR/payroll systems", completed: false },
                { item: "Staking & governance token launch", completed: false },
                { item: "Enterprise security compliance (SOC 2)", completed: false },
                { item: "AI-powered financial insights", completed: false },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4 items-start p-4 bg-[#0f0f0f] border border-neutral-800 rounded-none">
                  <Circle className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-0.5" />
                  <span className="text-white">{feature.item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback CTA */}
        <div className="mt-20 p-12 bg-gradient-to-br from-orange-500/10 to-transparent border border-orange-500/30 rounded-none text-center space-y-6">
          <h3 className="text-2xl font-black italic tracking-tighter">Help Shape Our Roadmap</h3>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            We're committed to building the features our users need most. Share your feedback and vote on upcoming
            features.
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600 text-black font-black uppercase text-xs tracking-widest rounded-none h-12 px-8 mx-auto">
            Provide Feedback
          </Button>
        </div>
      </div>
    </div>
  )
}
