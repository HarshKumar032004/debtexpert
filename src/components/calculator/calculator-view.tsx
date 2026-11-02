"use client";

import * as React from "react";
import {
  Calculator,
  Plus,
  Trash2,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info,
  ArrowRight,
  CreditCard,
  Building2,
  Scale,
  Smartphone,
  PieChart,
  Layers,
  MessageCircle,
} from "lucide-react";
import { formatINR } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { ConsultationForm } from "@/components/home/consultation-form";

export interface DebtItem {
  id: string;
  name: string;
  type: "credit-card" | "personal-loan" | "business-loan" | "app-loan";
  lender: string;
  balance: number;
  overdueMonths: "0-3" | "3-6" | "6-12" | "12+";
}

const initialDebts: DebtItem[] = [
  {
    id: "1",
    name: "HDFC Credit Card",
    type: "credit-card",
    lender: "HDFC Bank",
    balance: 350000,
    overdueMonths: "6-12",
  },
  {
    id: "2",
    name: "ICICI Personal Loan",
    type: "personal-loan",
    lender: "ICICI Bank",
    balance: 550000,
    overdueMonths: "3-6",
  },
];

export function CalculatorView() {
  const [debts, setDebts] = React.useState<DebtItem[]>(initialDebts);
  const [hardshipType, setHardshipType] = React.useState<string>("job-loss");

  // Helper to calculate individual debt settlement
  const calculateDebtSettlement = (debt: DebtItem) => {
    let baseWaiver = 50;

    // Overdue duration factor
    if (debt.overdueMonths === "0-3") baseWaiver = 40;
    else if (debt.overdueMonths === "3-6") baseWaiver = 55;
    else if (debt.overdueMonths === "6-12") baseWaiver = 65;
    else if (debt.overdueMonths === "12+") baseWaiver = 72;

    // Type adjustment
    if (debt.type === "credit-card") baseWaiver += 5;
    else if (debt.type === "app-loan") baseWaiver += 6;
    else if (debt.type === "business-loan") baseWaiver -= 8;

    // Hardship adjustment
    if (hardshipType === "medical") baseWaiver += 4;
    else if (hardshipType === "job-loss") baseWaiver += 3;

    // Cap waiver
    const waiverPct = Math.min(78, Math.max(30, baseWaiver));
    const estimatedSettlement = Math.round(debt.balance * (1 - waiverPct / 100));
    const estimatedSavings = debt.balance - estimatedSettlement;

    return {
      waiverPct,
      estimatedSettlement,
      estimatedSavings,
    };
  };

  // Aggregate totals
  const totalDebt = debts.reduce((acc, d) => acc + d.balance, 0);
  const totalSettlement = debts.reduce(
    (acc, d) => acc + calculateDebtSettlement(d).estimatedSettlement,
    0
  );
  const totalSavings = totalDebt - totalSettlement;
  const overallWaiverPct =
    totalDebt > 0 ? Math.round((totalSavings / totalDebt) * 100) : 0;

  // Monthly Roadmap Installments
  const installment1Mo = totalSettlement;
  const installment3Mo = Math.round(totalSettlement / 3);
  const installment6Mo = Math.round(totalSettlement / 6);

  // Approximate cost of servicing with minimum dues only over 5 years (42% APR / compounded interest)
  const fiveYearMinDueCost = Math.round(totalDebt * 1.95);

  const addDebt = () => {
    const newDebt: DebtItem = {
      id: Date.now().toString(),
      name: `Loan / Card #${debts.length + 1}`,
      type: "personal-loan",
      lender: "SBI / HDFC / Axis",
      balance: 200000,
      overdueMonths: "3-6",
    };
    setDebts([...debts, newDebt]);
  };

  const removeDebt = (id: string) => {
    if (debts.length > 1) {
      setDebts(debts.filter((d) => d.id !== id));
    }
  };

  const updateDebt = (id: string, updates: Partial<DebtItem>) => {
    setDebts(debts.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  return (
    <div className="space-y-16">
      {/* Interactive Main Calculator */}
      <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Column: Manage Multiple Debts (7 cols) */}
        <div className="lg:col-span-7 p-4 sm:p-8 lg:p-10 space-y-6 sm:space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-foreground flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <span>Your Debt Portfolio</span>
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Add all your active personal loans, credit cards, and digital borrowings.
              </p>
            </div>

            <button
              type="button"
              id="add-debt-button"
              onClick={addDebt}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 active:scale-95 transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Debt Account</span>
            </button>
          </div>

          {/* Hardship Reason Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Primary Financial Hardship Reason (RBI OTS Criterion)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: "job-loss", label: "Job Loss / Cut" },
                { id: "medical", label: "Medical Crisis" },
                { id: "business-loss", label: "Business Deficit" },
                { id: "family-crisis", label: "Family Emergency" },
              ].map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setHardshipType(h.id)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border text-center transition-all ${
                    hardshipType === h.id
                      ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 font-bold"
                      : "border-border text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-900"
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Debt Cards */}
          <div className="space-y-4">
            {debts.map((debt, index) => {
              const res = calculateDebtSettlement(debt);
              return (
                <div
                  key={debt.id}
                  className="rounded-2xl border border-border bg-slate-50/70 dark:bg-slate-900/60 p-4 sm:p-5 space-y-4 relative group transition-all hover:border-primary-300 dark:hover:border-primary-800"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-lg bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-xs">
                        #{index + 1}
                      </div>
                      <input
                        type="text"
                        value={debt.name}
                        onChange={(e) =>
                          updateDebt(debt.id, { name: e.target.value })
                        }
                        className="font-bold text-base sm:text-sm bg-transparent border-b border-transparent hover:border-border focus:border-primary-600 text-foreground px-1 py-0.5 rounded outline-none w-36 sm:w-60"
                        placeholder="e.g. HDFC Credit Card"
                      />
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 sm:px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 whitespace-nowrap">
                        ~{res.waiverPct}% Waiver
                      </span>
                      {debts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDebt(debt.id)}
                          className="text-muted-foreground hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
                          title="Remove this debt"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Debt Type */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Credit Category
                      </label>
                      <select
                        value={debt.type}
                        onChange={(e) =>
                          updateDebt(debt.id, {
                            type: e.target.value as DebtItem["type"],
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-input bg-card text-foreground text-base sm:text-xs focus:ring-2 focus:ring-primary outline-none"
                      >
                        <option value="credit-card">Credit Card Debt</option>
                        <option value="personal-loan">Personal Loan (Bank/NBFC)</option>
                        <option value="business-loan">MSME / Business Loan</option>
                        <option value="app-loan">Digital App Loan</option>
                      </select>
                    </div>

                    {/* Outstanding Balance */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Outstanding (₹)
                      </label>
                      <input
                        type="number"
                        inputMode="numeric"
                        min={10000}
                        step={10000}
                        value={debt.balance}
                        onChange={(e) =>
                          updateDebt(debt.id, {
                            balance: Math.max(0, Number(e.target.value)),
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-input bg-card text-foreground text-base sm:text-xs font-bold focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>

                    {/* Overdue Duration */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Overdue Duration
                      </label>
                      <select
                        value={debt.overdueMonths}
                        onChange={(e) =>
                          updateDebt(debt.id, {
                            overdueMonths: e.target.value as DebtItem["overdueMonths"],
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-input bg-card text-foreground text-base sm:text-xs focus:ring-2 focus:ring-primary outline-none"
                      >
                        <option value="0-3">1 - 3 Months (Standard)</option>
                        <option value="3-6">3 - 6 Months (NPA)</option>
                        <option value="6-12">6 - 12 Months (Write-Off)</option>
                        <option value="12+">12+ Months (Recovery)</option>
                      </select>
                    </div>
                  </div>

                  {/* Summary Bar for this debt */}
                  <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
                    <span className="text-muted-foreground">
                      Target Settlement:{" "}
                      <strong className="text-foreground">
                        {formatINR(res.estimatedSettlement)}
                      </strong>
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                      Direct Savings: {formatINR(res.estimatedSavings)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-start gap-2.5 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 text-xs">
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
            <span>
              <strong>RBI Settlement Precedent:</strong> Accounts overdue past 90 days (NPA status) receive the highest concessions because lenders are required under RBI provisioning norms to lock capital until bad assets are resolved or written off.
            </span>
          </div>
        </div>

        {/* Right Column: Comprehensive Estimated OTS Plan & Roadmap (5 cols) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white p-5 sm:p-8 lg:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                <PieChart className="h-4 w-4 text-emerald-400" />
                <span>Aggregated OTS Roadmap</span>
              </span>
              <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Avg. {overallWaiverPct}% Concession
              </span>
            </div>

            {/* Total Estimated Payout */}
            <div className="space-y-1">
              <div className="text-xs text-slate-400 font-medium">
                Total Estimated Settlement Payout ({debts.length} Debts)
              </div>
              <div className="text-3xl sm:text-4xl font-black text-white">
                {formatINR(totalSettlement)}
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-2">
                <span>Total Bank Claim: {formatINR(totalDebt)}</span>
              </div>
            </div>

            {/* Direct Total Savings Card */}
            <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-800/80 space-y-1">
              <div className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                <TrendingDown className="h-4 w-4" />
                Estimated Total Debt Waived
              </div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400">
                {formatINR(totalSavings)}
              </div>
              <div className="text-[11px] text-slate-400 leading-tight">
                Waived in compounded finance charges, bounce penalties & unpaid principal.
              </div>
            </div>

            {/* 3-Month Installment Breakdown */}
            <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-primary-400" />
                  <span>3-Month Installment Breakdown</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">Staged Payment</span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Month 1</span>
                  <span className="block text-sm font-black text-white">{formatINR(Math.round(totalSettlement * 0.34))}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Month 2</span>
                  <span className="block text-sm font-black text-white">{formatINR(Math.round(totalSettlement * 0.33))}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-0.5">
                  <span className="block text-[10px] uppercase font-bold text-slate-400">Month 3</span>
                  <span className="block text-sm font-black text-white">{formatINR(totalSettlement - Math.round(totalSettlement * 0.34) - Math.round(totalSettlement * 0.33))}</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-400 text-center">
                Paid in 3 parts directly to bank/NBFC accounts upon receipt of formal OTS sanction letter.
              </p>
            </div>

            {/* Minimum Due Comparison Trap */}
            <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-900/60 space-y-1 text-xs">
              <div className="font-bold text-red-400 flex items-center gap-1.5">
                <span>The 5-Year Minimum Due Alternative:</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Paying only minimum dues over 5 years would cost approximately{" "}
                <strong className="text-white">{formatINR(fiveYearMinDueCost)}</strong> in interest without clearing your principal!
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex flex-col sm:flex-row gap-3">
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
                `Hello Debt Support Expert, I calculated my debt settlement:\n` +
                `• Total Debt: ${formatINR(totalDebt)} across ${debts.length} account(s)\n` +
                `• Hardship Reason: ${hardshipType}\n` +
                `• Target Settlement: ${formatINR(totalSettlement)} (~${overallWaiverPct}% waiver, saving ${formatINR(totalSavings)})\n` +
                `• 3-Part Plan: Month 1: ${formatINR(Math.round(totalSettlement * 0.34))}, Month 2: ${formatINR(Math.round(totalSettlement * 0.33))}, Month 3: ${formatINR(totalSettlement - Math.round(totalSettlement * 0.34) - Math.round(totalSettlement * 0.33))}\n` +
                `Please review my file and connect me with a senior settlement advisor.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-4 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-950/50 transition-all active:scale-95 group text-center"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Send This Estimate to Advisor on WhatsApp</span>
            </a>

            <a
              href="#consultation-form"
              id="calculator-claim-plan-button"
              className="inline-flex items-center justify-center gap-2 py-4 px-5 rounded-2xl font-bold text-xs uppercase tracking-wider text-slate-200 hover:text-white bg-white/10 hover:bg-white/15 border border-white/15 transition-all text-center"
            >
              <ShieldCheck className="h-4 w-4 text-amber-300" />
              <span>Lock In Legal Plan</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Form Anchor with Presets */}
      <div id="consultation-form" className="pt-8 space-y-6">
        <div className="max-w-3xl mx-auto text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Lock In Your Negotiated Settlement Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Our High Court empanelled advocates will audit your {debts.length} loan accounts and table this compromise proposal with your lenders.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <ConsultationForm
            initialTotalDebt={
              totalDebt > 5000000
                ? "50L+"
                : totalDebt > 2500000
                ? "25L - 50L"
                : totalDebt > 1000000
                ? "10L - 25L"
                : totalDebt > 500000
                ? "5L - 10L"
                : totalDebt > 200000
                ? "2L - 5L"
                : "Under 2 Lakh"
            }
            initialLoanType={debts.length > 1 ? "multiple-loans" : debts[0]?.type || "personal-loan"}
            source="debt-calculator-roadmap"
          />
        </div>
      </div>
    </div>
  );
}
