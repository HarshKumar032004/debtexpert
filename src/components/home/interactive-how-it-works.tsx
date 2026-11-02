"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileSearch,
  ShieldCheck,
  Scale,
  FileCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export function InteractiveHowItWorks() {
  const [activeStep, setActiveStep] = React.useState(0);

  const steps = [
    {
      number: "01",
      title: "Free Case Analysis & Legal Enrollment",
      subtitle: "Day 1 – 2",
      icon: FileSearch,
      highlight: "Confidential Hardship Evaluation",
      description:
        "Our senior financial legal experts audit your complete loan portfolio, outstanding interest charges, default duration, and documented financial hardships (job loss, medical costs, business slowdown). We determine your settlement eligibility under RBI guidelines and sign an attorney-client engagement agreement.",
      deliverables: [
        "Complete portfolio & interest fee audit",
        "Assessment of bank legal notices & court risk",
        "Personalized settlement savings forecast (50% - 70%)",
      ],
    },
    {
      number: "02",
      title: "Call Forwarding & Anti-Harassment Takeover",
      subtitle: "Day 2 – 4",
      icon: ShieldCheck,
      highlight: "Immediate Recovery Cessation",
      description:
        "We issue formal Advocate Representation Notices to the heads of collection and Principal Nodal Officers of your lending banks and NBFCs. Legally, all recovery communications must now be directed to our counsel. We activate call-divert protocols so you no longer endure daily harassment.",
      deliverables: [
        "Advocate Cease & Desist Notices served",
        "Enforcement of RBI August 2022 Circular restrictions",
        "Call forwarding guidance to shield family & workplace",
      ],
    },
    {
      number: "03",
      title: "Hardcore Negotiation with Banks/NBFCs for OTS",
      subtitle: "Month 1 – 3",
      icon: Scale,
      highlight: "Direct Committee Discussions",
      description:
        "Our empanelled advocates bypass low-level agency callers and negotiate directly with the bank's Senior Credit Committee. Presenting your audited hardship dossier, we aggressively counter compounding interest, late fees, and penal charges to secure the lowest possible One-Time Settlement (OTS).",
      deliverables: [
        "Negotiation with HDFC, ICICI, SBI, Axis, Bajaj Finserv, etc.",
        "Waiver of 50% to 75% on accumulated total debt",
        "Flexible 1-to-3 installment payment restructuring",
      ],
    },
    {
      number: "04",
      title: "Settlement Letter Issuance & Debt-Free Closure",
      subtitle: "Final Resolution",
      icon: FileCheck,
      highlight: "Official Signed Bank NDC",
      description:
        "Once terms are finalized, the bank issues an official signed One-Time Settlement letter on authentic bank letterhead. We verify every legal clause. You pay the settlement sum directly into the bank's account, and the lender issues an irrevocable No Dues Certificate (NDC), closing the debt forever.",
      deliverables: [
        "Verification of digital signature & bank letterhead",
        "Payment directly into client's loan account (No third-party escrow)",
        "Permanent closure with official No Dues Certificate (NDC)",
      ],
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-slate-50 dark:bg-slate-900/50 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-primary-700 dark:text-blue-300 text-xs font-semibold">
            <Clock className="h-4 w-4" />
            <span>Transparent 4-Step Legal Protocol</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            How Legal Loan Settlement Works
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            From stopping aggressive recovery calls on Day 1 to receiving your official Bank No Dues
            Certificate. Here is the step-by-step roadmap to financial freedom.
          </p>
        </div>

        {/* Step Selector Tabs (Desktop & Mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 max-w-5xl mx-auto mb-8 sm:mb-10">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            const isActive = activeStep === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveStep(idx)}
                className={`p-3 sm:p-4 rounded-2xl text-left border transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? "border-primary-600 bg-white dark:bg-slate-900 shadow-lg ring-2 ring-primary-500/20"
                    : "border-border bg-card/60 hover:bg-card text-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span
                    className={`text-lg sm:text-xl font-black ${
                      isActive ? "text-primary-600 dark:text-primary-400" : "text-muted-foreground/60"
                    }`}
                  >
                    {item.number}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground">
                    {item.subtitle}
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs font-bold text-foreground line-clamp-1">{item.title}</div>
              </button>
            );
          })}
        </div>

        {/* Active Step Showcase Card with Framer Motion */}
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl border border-border bg-card p-5 sm:p-8 lg:p-12 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left Column (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3">
                  <span className="text-4xl sm:text-5xl font-black text-primary-600 dark:text-primary-400">
                    {steps[activeStep].number}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      {steps[activeStep].highlight}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                      {steps[activeStep].title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {steps[activeStep].description}
                </p>

                <div className="space-y-2.5 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Key Legal Milestones in this Step:
                  </div>
                  {steps[activeStep].deliverables.map((del, dIdx) => (
                    <div key={dIdx} className="flex items-start gap-2.5 text-xs text-foreground font-medium">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{del}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 flex items-center gap-4">
                  {activeStep < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setActiveStep((prev) => prev + 1)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-md"
                    >
                      <span>Next: Step {steps[activeStep + 1].number}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  ) : (
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-md"
                    >
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Start Your Step 1 Free Case Analysis</span>
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Column (5 cols): Visual Preview Card */}
              <div className="lg:col-span-5">
                <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="text-xs font-bold text-foreground">
                      Case Dossier Progress
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      Step {activeStep + 1} of 4
                    </span>
                  </div>

                  <div className="space-y-3">
                    {steps.map((st, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium transition-colors ${
                          i === activeStep
                            ? "bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 font-bold"
                            : i < activeStep
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground/60"
                        }`}
                      >
                        <div
                          className={`h-6 w-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                            i === activeStep
                              ? "bg-primary-600 text-white"
                              : i < activeStep
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-200 dark:bg-slate-800 text-muted-foreground"
                          }`}
                        >
                          {i < activeStep ? "✓" : st.number}
                        </div>
                        <span className="truncate">{st.title}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 text-[11px] text-muted-foreground border-t border-border flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Enforced under RBI Fair Practices Code</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
