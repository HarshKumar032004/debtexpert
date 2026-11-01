"use client";

import * as React from "react";
import Link from "next/link";
import {
  Calculator,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { ConsultationForm } from "@/components/home/consultation-form";

export function CalculatorView() {
  const [totalDebt, setTotalDebt] = React.useState<number>(1500000);
  const [debtType, setDebtType] = React.useState<string>("personal");
  const [overdueRange, setOverdueRange] = React.useState<string>("6-12");
  const [hardshipType, setHardshipType] = React.useState<string>("job-loss");

  // Dynamic settlement calculation logic
  const calculatePlan = () => {
    let baseWaiver = 55;

    // Overdue status factor
    if (overdueRange === "0-3") baseWaiver = 45;
    else if (overdueRange === "3-6") baseWaiver = 55;
    else if (overdueRange === "6-12") baseWaiver = 65;
    else if (overdueRange === "12+") baseWaiver = 72;

    // Debt category adjustments
    if (debtType === "credit-card") baseWaiver += 5;
    else if (debtType === "business") baseWaiver -= 8;

    // Hardship adjustment
    if (hardshipType === "medical") baseWaiver += 4;
    else if (hardshipType === "job-loss") baseWaiver += 3;

    // Cap waiver
    const waiverPct = Math.min(78, Math.max(35, baseWaiver));
    const estimatedSettlement = Math.round(totalDebt * (1 - waiverPct / 100));
    const estimatedSavings = totalDebt - estimatedSettlement;

    const installment1Mo = estimatedSettlement;
    const installment3Mo = Math.round(estimatedSettlement / 3);
    const installment6Mo = Math.round(estimatedSettlement / 6);

    // Approximate cost of servicing with minimum dues only over 5 years
    const fiveYearInterestCost = Math.round(totalDebt * 1.85);

    return {
      waiverPct,
      estimatedSettlement,
      estimatedSavings,
      installment1Mo,
      installment3Mo,
      installment6Mo,
      fiveYearInterestCost,
    };
  };

  const plan = calculatePlan();

  return (
    <div className="space-y-16">
      {/* Calculator Grid */}
      <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Controls Column (7 cols) */}
        <div className="lg:col-span-7 p-6 sm:p-10 space-y-8">
          {/* Step 1: Debt Type */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              1. Type of Loan / Credit Facility
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: "personal", label: "Personal Loans" },
                { id: "credit-card", label: "Credit Cards" },
                { id: "business", label: "MSME / Business" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setDebtType(item.id)}
                  className={`py-3 px-3 rounded-2xl text-xs font-bold border transition-all ${
                    debtType === item.id
                      ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 dark:border-primary-500 shadow-sm"
                      : "border-border text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Total Debt Outstanding */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                2. Total Outstanding Balance (Principal + Dues)
              </label>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground font-extrabold text-sm sm:text-base">
                <span>{formatINR(totalDebt)}</span>
              </div>
            </div>

            <input
              type="range"
              min={100000}
              max={10000000}
              step={50000}
              value={totalDebt}
              onChange={(e) => setTotalDebt(Number(e.target.value))}
              className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₹1 Lakh</span>
              <span>₹25 Lakh</span>
              <span>₹50 Lakh</span>
              <span>₹1 Crore</span>
            </div>
          </div>

          {/* Step 3: Default Duration */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              3. Overdue / Default Timeline
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "0-3", label: "1 - 3 Months" },
                { id: "3-6", label: "3 - 6 Months (NPA)" },
                { id: "6-12", label: "6 - 12 Months" },
                { id: "12+", label: "12+ Months" },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setOverdueRange(opt.id)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-semibold border text-center transition-all ${
                    overdueRange === opt.id
                      ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-500"
                      : "border-border text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Hardship Driver */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
              4. Primary Cause of Financial Distress
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: "job-loss", label: "Job Loss / Severe Salary Cut" },
                { id: "medical", label: "Critical Medical Emergency" },
                { id: "business-loss", label: "Business Slowdown / Bad Debts" },
                { id: "family-crisis", label: "Family Financial Crisis" },
              ].map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setHardshipType(h.id)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-left transition-all ${
                    hardshipType === h.id
                      ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300"
                      : "border-border text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 text-xs">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <span>
              <strong>Legal Note:</strong> Compromise settlements under RBI Circulars are based on
              demonstrated hardship. Having documentary evidence significantly increases your
              waiver percentage.
            </span>
          </div>
        </div>

        {/* Results Column (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-6 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                Settlement Estimation
              </span>
              <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Up to {plan.waiverPct}% Waiver
              </span>
            </div>

            {/* Total Estimated Payout */}
            <div className="space-y-1">
              <div className="text-xs text-slate-400 font-medium">Estimated OTS Settlement Payout</div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                {formatINR(plan.estimatedSettlement)}
              </div>
              <div className="text-xs text-slate-500 line-through">
                Bank Claimed Amount: {formatINR(totalDebt)}
              </div>
            </div>

            {/* Direct Savings Box */}
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-800/80 space-y-1">
              <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4" />
                Total Direct Savings
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {formatINR(plan.estimatedSavings)}
              </div>
              <div className="text-[11px] text-slate-400">
                Saved in penal charges, compounded interest & late fees
              </div>
            </div>

            {/* Staged Installments Option */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Flexible Payment Structure:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">3 Monthly Installments</div>
                  <div className="font-bold text-white text-sm">
                    {formatINR(plan.installment3Mo)} / mo
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="text-[10px] text-slate-400">One-Time Lump Sum</div>
                  <div className="font-bold text-white text-sm">
                    {formatINR(plan.installment1Mo)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Claim Button */}
          <div className="pt-8">
            <a
              href="#consultation-form"
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-xl shadow-emerald-900/40 transition-all active:scale-95 group"
            >
              <ShieldCheck className="h-5 w-5 text-amber-300" />
              <span>Lock In This Legal Settlement Plan</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>

      {/* Form Anchor */}
      <div id="consultation-form" className="pt-8">
        <div className="max-w-3xl mx-auto">
          <ConsultationForm />
        </div>
      </div>
    </div>
  );
}
