"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calculator,
  ArrowRight,
  Sparkles,
  TrendingDown,
  Info,
  ShieldCheck,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export function InteractiveCalculatorTeaser() {
  const [totalDebt, setTotalDebt] = React.useState<number>(1200000);
  const [debtType, setDebtType] = React.useState<string>("personal");
  const [overdueMonths, setOverdueMonths] = React.useState<number>(6);

  // Dynamic calculation logic based on banking benchmarks in India
  const calculateSettlement = () => {
    // Overdue factor: 0-3 mo = 45%, 3-6 mo = 55%, 6-12 mo = 65%, >12 mo = 72%
    let waiverPct = 55;
    if (overdueMonths <= 3) waiverPct = 48;
    else if (overdueMonths <= 6) waiverPct = 58;
    else if (overdueMonths <= 12) waiverPct = 65;
    else waiverPct = 72;

    // Credit cards usually offer slightly higher waiver due to compounded interest charges
    if (debtType === "credit-card") waiverPct = Math.min(80, waiverPct + 5);
    if (debtType === "business") waiverPct = Math.max(40, waiverPct - 8);

    const estimatedPayable = Math.round(totalDebt * (1 - waiverPct / 100));
    const estimatedSavings = totalDebt - estimatedPayable;
    const estimatedEmi3Mo = Math.round(estimatedPayable / 3);

    return {
      waiverPct,
      estimatedPayable,
      estimatedSavings,
      estimatedEmi3Mo,
    };
  };

  const results = calculateSettlement();

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <Calculator className="h-4 w-4" />
            <span>Interactive Debt Settlement Estimator</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            See How Much You Can Legally Save
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
            Based on RBI Fair Practices Code and historical settlements achieved across major
            Indian banks (HDFC, SBI, ICICI, Axis, Bajaj Finserv, Kotak, IDFC).
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            {/* Debt Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                1. Select Debt Category
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "personal", label: "Personal Loan" },
                  { id: "credit-card", label: "Credit Cards" },
                  { id: "business", label: "MSME Loan" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDebtType(item.id)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      debtType === item.id
                        ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 dark:border-primary-500 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Debt Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  2. Total Outstanding Balance
                </label>
                <span className="text-base font-extrabold text-primary-600 dark:text-primary-400">
                  {formatINR(totalDebt)}
                </span>
              </div>
              <input
                type="range"
                min={100000}
                max={5000000}
                step={50000}
                value={totalDebt}
                onChange={(e) => setTotalDebt(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-500">
                <span>₹1 Lakh</span>
                <span>₹25 Lakh</span>
                <span>₹50 Lakh+</span>
              </div>
            </div>

            {/* Months Overdue Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  3. Default / Overdue Duration
                </label>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {overdueMonths === 0
                    ? "Currently paying / Not overdue"
                    : `${overdueMonths} Months`}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={24}
                step={1}
                value={overdueMonths}
                onChange={(e) => setOverdueMonths(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-500">
                <span>1 Month</span>
                <span>6 Months (NPA)</span>
                <span>12+ Months</span>
                <span>24 Months</span>
              </div>
            </div>

            {/* Disclaimer pill */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 text-xs">
              <Info className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
              <span>
                Actual settlement percentage is negotiated based on demonstrable financial
                hardship (job loss, medical emergency, business setback) under RBI guidelines.
              </span>
            </div>
          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Estimated Waiver Range
                </span>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Up to {results.waiverPct}% OFF
                </span>
              </div>

              {/* Settlement Pay Target */}
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Estimated Settlement Payout</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white">
                  {formatINR(results.estimatedPayable)}
                </div>
                <div className="text-xs text-slate-400 line-through">
                  Original: {formatINR(totalDebt)}
                </div>
              </div>

              {/* Savings callout box */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-1">
                <div className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4" />
                  Estimated Direct Savings
                </div>
                <div className="text-2xl font-black text-emerald-400">
                  {formatINR(results.estimatedSavings)}
                </div>
                <div className="text-[11px] text-slate-400">
                  Eliminates interest, penal fees & legal risks
                </div>
              </div>

              <div className="text-xs text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Flexible Split Option:</span>
                  <span className="font-semibold text-white">
                    ~{formatINR(results.estimatedEmi3Mo)} / mo (over 3 installments)
                  </span>
                </div>
              </div>
            </div>

            {/* CTA in results box */}
            <div className="pt-6">
              <Link
                href={`/contact?debtAmount=${totalDebt}&debtType=${debtType}`}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-900/40 transition-all active:scale-95 group"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Claim This Settlement Plan</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
