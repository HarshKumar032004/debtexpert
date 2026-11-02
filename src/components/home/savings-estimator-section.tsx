"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calculator,
  TrendingDown,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export function SavingsEstimatorSection() {
  const [debtAmount, setDebtAmount] = React.useState<number>(1800000);

  // Settlement ratio: Approx 35% to 45% payable (i.e., 55% to 65% waiver)
  // Higher default amounts often achieve around 60%-65% waivers
  const settlementPct = debtAmount >= 2500000 ? 38 : debtAmount >= 1000000 ? 40 : 42;
  const waiverPct = 100 - settlementPct;

  const estimatedSettlement = Math.round(debtAmount * (settlementPct / 100));
  const estimatedSavings = debtAmount - estimatedSettlement;
  const installment3Mo = Math.round(estimatedSettlement / 3);
  const installment6Mo = Math.round(estimatedSettlement / 6);

  const presets = [
    { label: "₹3 Lakh", value: 300000 },
    { label: "₹7 Lakh", value: 700000 },
    { label: "₹15 Lakh", value: 1500000 },
    { label: "₹25 Lakh", value: 2500000 },
    { label: "₹40 Lakh", value: 4000000 },
    { label: "₹50 Lakh", value: 5000000 },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <Calculator className="h-4 w-4" />
            <span>Real-Time Debt Relief Calculator</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Calculate Your Estimated Debt Settlement Savings
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Move the slider to your total unsecured debt across personal loans and credit cards. See
            your legally negotiated settlement payout and estimated waiver under RBI guidelines.
          </p>
        </div>

        {/* Interactive Calculator Card */}
        <div className="max-w-5xl mx-auto rounded-3xl border border-border bg-card shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Controls Column (7 cols) */}
          <div className="lg:col-span-7 p-5 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
            {/* Quick Presets */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Quick Amount Select
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => setDebtAmount(preset.value)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all ${
                      debtAmount === preset.value
                        ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 dark:border-primary-500 shadow-sm"
                        : "border-border text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Total Unsecured Debt (Loans + Credit Cards)
                </label>
                <span className="text-xl sm:text-2xl font-extrabold text-primary-600 dark:text-primary-400">
                  {formatINR(debtAmount)}
                </span>
              </div>
              <input
                type="range"
                min={100000}
                max={5000000}
                step={50000}
                value={debtAmount}
                onChange={(e) => setDebtAmount(Number(e.target.value))}
                className="w-full h-3.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600 my-1 py-1"
              />
              <div className="flex justify-between text-xs text-muted-foreground font-medium">
                <span>₹1 Lakh</span>
                <span>₹15 Lakh</span>
                <span>₹30 Lakh</span>
                <span>₹50 Lakh</span>
              </div>
            </div>

            {/* Visual Ratio Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Waiver Negotiated ({waiverPct}%)
                </span>
                <span className="text-slate-600 dark:text-slate-400">
                  Settlement Payable ({settlementPct}%)
                </span>
              </div>
              <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${waiverPct}%` }}
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                />
                <div
                  style={{ width: `${settlementPct}%` }}
                  className="h-full bg-slate-400 dark:bg-slate-600"
                />
              </div>
            </div>

            {/* Reassurance text */}
            <div className="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 flex items-start gap-3 text-xs text-blue-950 dark:text-blue-300 leading-relaxed">
              <Info className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
              <span>
                <strong>Zero Prepayment to Third Parties:</strong> Your settlement funds are paid
                directly into your loan account at the lending bank upon receipt of the official
                settlement letter.
              </span>
            </div>
          </div>

          {/* Results Summary Box (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-5 sm:p-8 lg:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  Estimated One-Time Settlement
                </span>
                <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Approx {settlementPct}% of Total
                </span>
              </div>

              {/* Settlement Pay Target */}
              <div className="space-y-1">
                <div className="text-xs text-slate-400 font-medium">Estimated Settlement Amount</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white">
                  {formatINR(estimatedSettlement)}
                </div>
                <div className="text-xs text-slate-500 line-through">
                  Total Claimed: {formatINR(debtAmount)}
                </div>
              </div>

              {/* Savings Box */}
              <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800/80 space-y-1">
                <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4" />
                  Total Debt Waiver Savings
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                  {formatINR(estimatedSavings)}
                </div>
                <div className="text-[11px] text-slate-400">
                  Eliminates interest, late fees, bounce charges & harassment
                </div>
              </div>

              {/* Installment breakdown */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Staged Payment Restructuring:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="text-[10px] text-slate-400">3 Month Plan</div>
                    <div className="font-bold text-white text-sm">
                      {formatINR(installment3Mo)} / mo
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <div className="text-[10px] text-slate-400">6 Month Plan</div>
                    <div className="font-bold text-white text-sm">
                      {formatINR(installment6Mo)} / mo
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA in results box */}
            <div className="pt-8">
              <Link
                href={`/contact?debtAmount=${debtAmount}`}
                className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-900/40 transition-all active:scale-95 group"
              >
                <ShieldCheck className="h-5 w-5 text-amber-300" />
                <span>Lock In Your Settlement Plan</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
