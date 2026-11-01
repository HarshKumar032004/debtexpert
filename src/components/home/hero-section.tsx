"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Scale,
  ArrowRight,
  Calculator,
  CheckCircle2,
  FileCheck2,
  AlertTriangle,
  PhoneCall,
  Sparkles,
  TrendingDown,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 hero-gradient-light dark:hero-gradient-dark border-b border-slate-200/60 dark:border-slate-800/60">
      {/* Background ambient decorative shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary-500/5 dark:bg-primary-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold text-primary-700 dark:text-blue-300 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>100% Legal Protection Under RBI Fair Practices Code</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Overcome Debt Stress.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300">
                Settle Loans Legally
              </span>{" "}
              & Save Up to 50% - 75%.
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              India&apos;s authoritative legal advisory network protects you from recovery agent
              harassment and negotiates formal One-Time Settlements (OTS) with banks and NBFCs.
              Regain your peace of mind with legal backing.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-primary-600 via-primary-700 to-blue-700 hover:from-primary-700 hover:to-blue-800 shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-600/40 transition-all duration-200 group active:scale-95"
              >
                <Sparkles className="h-5 w-5 text-amber-300" />
                <span>Get Free Case Evaluation</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="/calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm active:scale-95"
              >
                <Calculator className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span>Calculate Your Settlement</span>
              </Link>
            </div>

            {/* Trust Bullet List */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Stop Agent Calls in 24-48h</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Official Bank No Dues Certificate</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>100% Confidential Legal Privilege</span>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Bento Card & Case Proof Graphic */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-3xl blur-xl opacity-20 dark:opacity-30 -z-10 animate-pulseGlow" />

              {/* Main Card */}
              <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-6 sm:p-7 shadow-2xl space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <FileCheck2 className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Case Resolution Dossier
                      </div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">
                        HDFC Unsecured Personal Loan
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    SETTLED (NDC)
                  </span>
                </div>

                {/* Amount comparison metric */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-950/70 p-4 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
                  <div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      Bank Claimed Balance
                    </div>
                    <div className="text-lg font-bold text-red-600 dark:text-red-400 line-through">
                      ₹8,50,000
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <TrendingDown className="h-3.5 w-3.5" />
                      Legal OTS Settlement
                    </div>
                    <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                      ₹2,80,000
                    </div>
                  </div>
                </div>

                {/* Savings highlight bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-600 dark:text-slate-400">Total Waiver Achieved</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      ₹5,70,000 (67% Savings)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full w-[67%]" />
                  </div>
                </div>

                {/* Protection feature list */}
                <div className="space-y-2.5 pt-1 text-xs">
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="h-4 w-4 text-blue-500 shrink-0" />
                    <span>Legal Notice served under RBI Fair Practices Code</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>100% Cessation of recovery calls and home visits</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>Direct payment made to bank account with formal NDC</span>
                  </div>
                </div>

                {/* Quick Call Button inside card */}
                <a
                  href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 font-semibold text-xs transition-colors shadow-sm"
                >
                  <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Speak with Senior Advocate Now: {siteConfig.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Aggregate Stats Banner */}
        <div className="mt-14 pt-8 border-t border-slate-200/70 dark:border-slate-800/70">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {siteConfig.stats.map((stat, i) => (
              <div key={i} className="p-3">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-600 dark:text-blue-400 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
