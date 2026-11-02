"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  CreditCard,
  Scale,
  ShieldAlert,
  FileCheck2,
  Building2,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

export function CoreServicesGrid() {
  const services = [
    {
      title: "Credit Card Debt Settlement",
      badge: "Save 50% - 75%",
      icon: CreditCard,
      color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/60",
      description:
        "Break the cycle of 42%+ APR finance charges, late fees, and minimum due traps across SBI Card, HDFC, ICICI, Axis, and RBL. We freeze interest and negotiate single or multi-part One-Time Settlement.",
      features: [
        "Immediate compounding interest freeze",
        "Waiver of exorbitant late payment & overlimit penalties",
        "Official Bank No Dues Certificate (NDC)",
      ],
      link: "/services/credit-card-settlement",
    },
    {
      title: "Personal Loan Settlement (OTS)",
      badge: "Save 50% - 70%",
      icon: Scale,
      color: "bg-blue-500/10 text-primary-600 dark:text-primary-400 border-blue-200 dark:border-blue-900/60",
      description:
        "Legally settle unsecured personal loans from public & private banks (HDFC, SBI, ICICI, Kotak) and NBFCs (Bajaj Finserv, Tata Capital, Piramal) through audited hardship dossiers and direct committee negotiations.",
      features: [
        "Bypass collection agents & deal with senior bank officers",
        "Waiver of bounce charges & legal processing costs",
        "Payment directly into your bank loan account",
      ],
      link: "/services/personal-loan-settlement",
    },
    {
      title: "Anti-Harassment Legal Shield",
      badge: "RBI 2022 Compliant",
      icon: ShieldAlert,
      color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/60",
      description:
        "Immediate advocate intervention against unannounced home visits, abusive phone calls, and illegal calls to your employer or relatives. We enforce the RBI August 2022 Circular with formal Cease & Desist Notices.",
      features: [
        "Formal Advocate Representation notice within 24 hours",
        "Strict prohibition of third-party disclosures",
        "Direct Banking Ombudsman (CMS) escalation",
      ],
      link: "/services/anti-harassment",
    },
    {
      title: "Legal Notice & Arbitration Reply",
      badge: "Sec 138 & NACH Defense",
      icon: FileCheck2,
      color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-900/60",
      description:
        "Received a Section 138 NI Act (Cheque Bounce) notice, Section 25 NACH mandate notice, or unilateral arbitration summons? Our litigation advocates draft pointwise rejoinders and represent you in Lok Adalat.",
      features: [
        "Point-by-point advocate reply within 15 days",
        "Lok Adalat mediation representation & dispute settlement",
        "Defense against ex-parte arbitration awards",
      ],
      link: "/contact",
    },
    {
      title: "Business & MSME Restructuring",
      badge: "SARFAESI & OD/CC Relief",
      icon: Building2,
      color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-900/60",
      description:
        "Working capital stress, Cash Credit (CC), Overdraft (OD) limits, and machinery loan defaults. We safeguard enterprise collaterals, respond to SARFAESI Section 13(2) demand notices, and structure compromise packages.",
      features: [
        "Defense against SARFAESI Sec 13(2) & 13(4) notices",
        "Representation before Debt Recovery Tribunal (DRT)",
        "Restructuring & tenure expansion advisory",
      ],
      link: "/services/business-loan-settlement",
    },
    {
      title: "CIBIL Score Rehabilitation",
      badge: "Roadmap to 750+",
      icon: TrendingUp,
      color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/60",
      description:
        "Concerned about your credit score after settlement? We guide you through the 12-to-24-month credit rehabilitation roadmap, ensuring banks report accurate 'Settled' status and helping you build a 750+ score.",
      features: [
        "Dispute inaccurate default reporting on CIBIL & Experian",
        "Structured secured credit card builder strategy",
        "Official No Dues Certificate submission to bureaus",
      ],
      link: "/blog",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
            <Sparkles className="h-4 w-4" />
            <span>Comprehensive Legal & Financial Services</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Our 6 Core Debt Relief & Legal Services
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every debt situation requires a specialized legal defense. Explore how our empanelled
            advocates shield your rights and negotiate maximum waivers.
          </p>
        </div>

        {/* 6 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 max-w-6xl mx-auto">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl border border-border bg-card p-5 sm:p-6 lg:p-7 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-primary-500/50 transition-all duration-200 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-12 w-12 rounded-2xl flex items-center justify-center border ${service.color} group-hover:scale-110 transition-transform duration-200`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground border border-border">
                      {service.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="pt-2 space-y-2 border-t border-border/70">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-border/70">
                  <Link
                    href={service.link}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 dark:text-primary-400 group-hover:underline"
                  >
                    <span>Learn More & Consult</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
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
