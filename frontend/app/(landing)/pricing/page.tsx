"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export default function PricingPage() {
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
          <h1 className="text-5xl sm:text-6xl font-black italic tracking-tighter">Pricing</h1>
          <p className="text-neutral-400 mt-4 max-w-2xl">Transparent, scalable pricing for every business size.</p>
        </div>
      </div>

      {/* Pricing Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Starter",
              desc: "For small teams & freelancers",
              price: "Free",
              period: "Forever",
              features: ["Up to 5 employees", "EWA access", "Basic analytics", "Email support"],
              cta: "Get Started",
              highlight: false,
            },
            {
              name: "Professional",
              desc: "For growing companies",
              price: "$99",
              period: "/month",
              features: [
                "Up to 100 employees",
                "All Starter features",
                "Bill pay automation",
                "Savings goals",
                "Advanced analytics",
                "Priority support",
              ],
              cta: "Start Free Trial",
              highlight: true,
            },
            {
              name: "Enterprise",
              desc: "For large organizations",
              price: "Custom",
              period: "pricing",
              features: [
                "Unlimited employees",
                "All Professional features",
                "Custom integrations",
                "Dedicated account manager",
                "Custom branding",
                "SLA guarantee",
              ],
              cta: "Contact Sales",
              highlight: false,
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={`rounded-none border p-8 space-y-6 ${
                plan.highlight
                  ? "bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/50 relative"
                  : "bg-[#0f0f0f] border-neutral-800"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 right-0 bg-orange-500 text-black px-4 py-1 text-[9px] font-black uppercase tracking-widest">
                  Popular
                </div>
              )}
              <div>
                <h3 className="text-xl font-black tracking-tighter">{plan.name}</h3>
                <p className="text-[10px] text-neutral-500 font-bold uppercase mt-1">{plan.desc}</p>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black">{plan.price}</span>
                  <span className="text-[10px] text-neutral-500 font-bold uppercase">{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex gap-3 text-sm">
                    <Check className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={`w-full font-black uppercase text-xs tracking-widest rounded-none h-12 ${
                  plan.highlight
                    ? "bg-orange-500 hover:bg-orange-600 text-black"
                    : "border border-neutral-800 text-white hover:bg-white/5 bg-transparent"
                }`}
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto space-y-8">
          <h2 className="text-3xl font-black italic tracking-tighter text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Can I change plans later?", a: "Yes, upgrade or downgrade anytime with no penalty." },
              { q: "Is there a setup fee?", a: "No setup fees. Start streaming payroll immediately." },
              { q: "Do you offer discounts for annual payments?", a: "Yes, annual plans include 20% discount." },
              { q: "What if I exceed my employee limit?", a: "We'll notify you, and you can upgrade instantly." },
            ].map((faq, i) => (
              <div key={i} className="p-4 bg-[#0f0f0f] border border-neutral-800 rounded-none space-y-2">
                <p className="font-black uppercase tracking-tight">{faq.q}</p>
                <p className="text-neutral-400 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
