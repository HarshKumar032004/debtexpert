import { Metadata } from "next";
import { CalculatorView } from "@/components/calculator/calculator-view";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Debt Settlement Savings Calculator India | Calculate Your Legal Loan Waiver",
  description:
    "Free interactive debt settlement calculator for Indian borrowers. Calculate your estimated OTS savings, waiver percentage, and affordable installments on personal loans and credit cards.",
  alternates: {
    canonical: `${siteConfig.url}/calculator`,
  },
};

export default function CalculatorPage() {
  return (
    <div className="py-12 md:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <span>Free Interactive Tool • 2026 Updated Banking Benchmarks</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Indian Loan Settlement & Savings Calculator
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Estimate your potential One-Time Settlement (OTS) waiver and realistic payment plan
            based on Reserve Bank of India (RBI) Fair Practices precedents.
          </p>
        </div>

        <CalculatorView />
      </div>
    </div>
  );
}
