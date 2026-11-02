"use client";

import { motion } from "framer-motion";
import {
  PhoneOff,
  UserX,
  CreditCard,
  FileWarning,
  ShieldCheck,
  Scale,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export function ProblemSolutionBento() {
  const painPoints = [
    {
      id: "calls",
      colSpan: "lg:col-span-6",
      problemTitle: "Relentless 50+ Daily Recovery Calls at Odd Hours",
      problemDesc:
        "Aggressive collection agents call you early morning and late night, use threatening tones, and spam WhatsApp with fake legal notices.",
      solutionTitle: "Advocate Legal Cease & Desist & Call Forwarding",
      solutionDesc:
        "We serve a formal Advocate Representation Notice under the RBI August 2022 Circular. Legally, all collection agencies must route inquiries through our law office, stopping personal calls in 24-48 hours.",
      statute: "RBI/2022-23/108 Circular & Right to Privacy",
      icon: PhoneOff,
      badge: "Harassment Stopped",
    },
    {
      id: "visits",
      colSpan: "lg:col-span-6",
      problemTitle: "Unannounced Home & Workplace Visits",
      problemDesc:
        "Recovery agents show up unannounced at your home, neighbor's door, or workplace to create public embarrassment and intimidate your family members.",
      solutionTitle: "Strict Anti-Trespass Injunction & Police Notice",
      solutionDesc:
        "Under RBI mandates, unannounced visits without verified bank credentials and prior written consent are illegal. We issue immediate legal warnings to the Bank's Principal Nodal Officer.",
      statute: "IPC Sec 503/506 (Criminal Intimidation Defense)",
      icon: UserX,
      badge: "Dignity Protected",
    },
    {
      id: "interest",
      colSpan: "lg:col-span-6",
      problemTitle: "Mounting 42%+ APR Compounding Credit Card Interest",
      problemDesc:
        "Paying 5% 'Minimum Due' barely covers finance charges and 18% GST. Even a ₹2L card balance snowballs into ₹7L+ with late fees and overlimit penalties.",
      solutionTitle: "Compounding Interest Freeze & 50-70% Waiver",
      solutionDesc:
        "During OTS negotiations, our financial legal team freezes further interest accumulation and negotiates the complete waiver of exorbitant finance charges and penalty fees.",
      statute: "RBI Master Direction on Compromise Settlement",
      icon: TrendingDown,
      badge: "Interest Frozen",
    },
    {
      id: "notices",
      colSpan: "lg:col-span-6",
      problemTitle: "Section 138 (Cheque Bounce) & Arbitration Threats",
      problemDesc:
        "Banks issue legal notices for bounced ECS / NACH mandates under Section 25 PSS Act or Section 138 NI Act, or initiate unilateral arbitration proceedings.",
      solutionTitle: "Point-by-Point Legal Replies & Lok Adalat Defense",
      solutionDesc:
        "Our litigation advocates draft detailed legal replies asserting financial hardship, attend Lok Adalat proceedings, and convert legal threats into mutually agreed One-Time Settlements.",
      statute: "Sec 138 NI Act & Lok Adalat Compromise Protocol",
      icon: FileWarning,
      badge: "Court Representation",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-slate-50 dark:bg-slate-900/40 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs font-semibold">
            <AlertTriangle className="h-4 w-4" />
            <span>Borrower Pain Points vs Legal Protection</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Trapped in the Debt Cycle? Here is How the Law Protects You.
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Borrowing financial institutions deploy immense pressure tactics. Debt Support Expert
            levels the playing field by enforcing your constitutional and statutory rights.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 max-w-6xl mx-auto">
          {painPoints.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`${item.colSpan} rounded-3xl border border-border bg-card p-5 sm:p-7 lg:p-8 flex flex-col justify-between shadow-sm hover:shadow-md transition-all duration-200`}
              >
                <div className="space-y-4 sm:space-y-5">
                  {/* Problem Section (Red/Warning Badge) */}
                  <div className="space-y-2 p-3.5 sm:p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
                    <div className="flex items-center justify-between text-xs font-bold text-red-600 dark:text-red-400">
                      <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                        <AlertTriangle className="h-3.5 w-3.5" /> What You Face
                      </span>
                      <span className="line-through text-slate-400 dark:text-slate-500 font-semibold text-[11px]">
                        Harassment & Pressure
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">
                      {item.problemTitle}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {item.problemDesc}
                    </p>
                  </div>

                  {/* Solution Section (Emerald/Legal Shield) */}
                  <div className="space-y-2 p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                      <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                        <ShieldCheck className="h-3.5 w-3.5" /> Debt Support Expert Legal Shield
                      </span>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                        {item.badge}
                      </span>
                    </div>
                    <h4 className="font-bold text-foreground text-sm sm:text-base">
                      {item.solutionTitle}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.solutionDesc}
                    </p>
                    <div className="pt-1 flex items-center gap-1.5 text-[11px] font-semibold text-primary-600 dark:text-primary-400">
                      <Scale className="h-3.5 w-3.5 shrink-0" />
                      <span>{item.statute}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-border/70 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Backed by Bar Council advocates
                  </span>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    <span>Get Representation</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
