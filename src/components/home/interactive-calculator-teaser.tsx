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
  MessageCircle,
  CalendarCheck,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function InteractiveCalculatorTeaser() {
  const [totalDebt, setTotalDebt] = React.useState<number>(850000);
  const [debtType, setDebtType] = React.useState<string>("Personal Loan");
  const [overdueDuration, setOverdueDuration] = React.useState<string>("3–6 Months");
  const [hardshipReason, setHardshipReason] = React.useState<string>("Salary Cut");

  // Dynamic realistic calculation logic based on banking OTS settlement benchmarks
  const calculateSettlement = () => {
    let waiverPct = 52;

    // Overdue Factor
    if (overdueDuration === "0–3 Months") waiverPct = 42;
    else if (overdueDuration === "3–6 Months") waiverPct = 54;
    else if (overdueDuration === "6–12 Months") waiverPct = 64;
    else if (overdueDuration === "12+ Months") waiverPct = 72;

    // Debt Type Factor
    if (debtType === "Credit Cards") waiverPct += 6;
    else if (debtType === "Mixed Debt") waiverPct += 3;

    // Hardship Factor
    if (hardshipReason === "Job Loss") waiverPct += 4;
    else if (hardshipReason === "Medical Emergency") waiverPct += 5;
    else if (hardshipReason === "Business Loss") waiverPct += 3;

    // Cap waiver percentage realistically
    const finalWaiver = Math.min(78, Math.max(35, waiverPct));
    const estimatedPayable = Math.round(totalDebt * (1 - finalWaiver / 100));
    const estimatedSavings = totalDebt - estimatedPayable;

    // 3-Month Installment Breakdown
    const part1 = Math.round(estimatedPayable * 0.34);
    const part2 = Math.round(estimatedPayable * 0.33);
    const part3 = estimatedPayable - part1 - part2;

    return {
      waiverPct: finalWaiver,
      minWaiver: Math.max(30, finalWaiver - 6),
      maxWaiver: Math.min(80, finalWaiver + 5),
      estimatedPayable,
      estimatedSavings,
      part1,
      part2,
      part3,
    };
  };

  const results = calculateSettlement();

  const whatsappMessage = encodeURIComponent(
    `Hello Debt Support Expert, I used your Debt Calculator:\n` +
      `• Debt Type: ${debtType}\n` +
      `• Total Outstanding: ${formatINR(totalDebt)}\n` +
      `• Overdue Duration: ${overdueDuration}\n` +
      `• Hardship Reason: ${hardshipReason}\n` +
      `• Estimated Settlement: ${formatINR(results.estimatedPayable)} (~${results.waiverPct}% waiver, Savings: ${formatINR(results.estimatedSavings)})\n` +
      `• 3-Month Plan: Part 1: ${formatINR(results.part1)}, Part 2: ${formatINR(results.part2)}, Part 3: ${formatINR(results.part3)}\n` +
      `Please connect me with a senior advisor to evaluate this OTS proposal.`
  );

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <Calculator className="h-4 w-4" />
            <span>Interactive Debt Settlement Estimator</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            See How Much You Can Legally Save
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed">
            Based on RBI OTS Frameworks and historical compromise settlements across major Indian banks (HDFC, SBI, ICICI, Axis, Kotak, Bajaj Finserv).
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="lg:col-span-7 p-5 sm:p-8 space-y-5">
            {/* 1. Debt Type Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                1. Debt Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Personal Loan", "Credit Cards", "Mixed Debt"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDebtType(type)}
                    className={`py-2.5 px-2 rounded-xl text-xs font-semibold border transition-all ${
                      debtType === type
                        ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 dark:border-primary-500 shadow-sm font-bold"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Outstanding Debt Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                  2. Outstanding Debt Amount
                </label>
                <span className="text-base font-extrabold text-primary-600 dark:text-primary-400">
                  {formatINR(totalDebt)}
                </span>
              </div>
              <input
                type="range"
                min={50000}
                max={5000000}
                step={25000}
                value={totalDebt}
                onChange={(e) => setTotalDebt(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600 my-1 py-1"
              />
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span>₹50,000</span>
                <span>₹25 Lakh</span>
                <span>₹50 Lakh</span>
              </div>
            </div>

            {/* 3. Overdue Duration Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                3. Overdue Duration
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                {["0–3 Months", "3–6 Months", "6–12 Months", "12+ Months"].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setOverdueDuration(dur)}
                    className={`py-2 px-1.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                      overdueDuration === dur
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Financial Hardship Reason Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                4. Primary Hardship Reason
              </label>
              <div className="grid grid-cols-2 gap-2">
                {["Job Loss", "Salary Cut", "Medical Emergency", "Business Loss"].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setHardshipReason(reason)}
                    className={`py-2 px-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                      hardshipReason === reason
                        ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950/60 dark:text-primary-300 font-bold"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Disclaimer pill */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 text-xs">
              <Info className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
              <span>
                Settlement funds are always paid directly to your lending bank/NBFC. Final concession terms depend on bank committee approval.
              </span>
            </div>
          </div>

          {/* Results Summary Column */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-5 sm:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs uppercase tracking-wider font-semibold text-slate-400">
                  Estimated OTS Concession
                </span>
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  ~{results.waiverPct}% Waiver
                </span>
              </div>

              {/* Settlement Pay Target */}
              <div className="space-y-1">
                <div className="text-xs text-slate-400">Estimated Settlement Target</div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white">
                  {formatINR(results.estimatedPayable)}
                </div>
                <div className="text-xs text-slate-400 line-through">
                  Total Outstanding Claim: {formatINR(totalDebt)}
                </div>
              </div>

              {/* Savings callout box */}
              <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 space-y-1">
                <div className="text-xs font-medium text-emerald-300 flex items-center gap-1.5">
                  <TrendingDown className="h-4 w-4" />
                  Estimated Potential Savings
                </div>
                <div className="text-2xl font-black text-emerald-400">
                  {formatINR(results.estimatedSavings)}
                </div>
                <div className="text-[11px] text-slate-400">
                  Waives accumulated penal interest & bounce charges
                </div>
              </div>

              {/* 3-Month Installment Breakdown */}
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <CalendarCheck className="h-4 w-4 text-primary-400" />
                  <span>3-Month Installment Breakdown</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="block text-[10px] text-slate-400 uppercase">Part 1</span>
                    <span className="block text-xs font-bold text-white mt-0.5">{formatINR(results.part1)}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="block text-[10px] text-slate-400 uppercase">Part 2</span>
                    <span className="block text-xs font-bold text-white mt-0.5">{formatINR(results.part2)}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                    <span className="block text-[10px] text-slate-400 uppercase">Part 3</span>
                    <span className="block text-xs font-bold text-white mt-0.5">{formatINR(results.part3)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs in results box */}
            <div className="pt-6 space-y-2.5">
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Send Estimate to Advisor on WhatsApp</span>
              </a>

              <Link
                href={`/contact?debtAmount=${totalDebt}&debtType=${encodeURIComponent(debtType)}`}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
              >
                <ShieldCheck className="h-4 w-4 text-amber-300" />
                <span>Book Free Evaluation Call</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
