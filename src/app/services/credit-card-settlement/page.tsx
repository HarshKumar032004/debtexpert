import { Metadata } from "next";
import Link from "next/link";
import {
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  ShieldCheck,
  Percent,
  Clock,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { ServiceJsonLd } from "@/components/seo/json-ld";
import { ConsultationForm } from "@/components/home/consultation-form";

export const metadata: Metadata = {
  title: "Credit Card Debt Settlement India | Stop 42% APR & Settle for 50-70% Less",
  description:
    "Eliminate compounding credit card debt from SBI Card, HDFC, ICICI, Axis, and RBL. Freeze finance charges, stop recovery harassment, and settle legally with official NDC.",
  alternates: {
    canonical: `${siteConfig.url}/services/credit-card-settlement`,
  },
};

export default function CreditCardSettlementPage() {
  return (
    <div className="py-12 md:py-20 bg-background text-foreground">
      <ServiceJsonLd
        title="Credit Card Debt Settlement Advisory India"
        description="Legal credit card debt negotiation and interest waiver advisory under RBI Fair Practices Code."
        url={`${siteConfig.url}/services/credit-card-settlement`}
      />

      <div className="container mx-auto px-4 sm:px-6">
        {/* Hero Header */}
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <CreditCard className="h-4 w-4" />
            <span>Break the 42%+ APR Compounding Trap</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Credit Card Debt Settlement & Interest Freeze
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Stop making futile minimum due payments that only fund bank interest. Our advocates
            freeze exorbitant finance charges and negotiate formal One-Time Settlements (OTS) with
            up to 50% to 75% relief.
          </p>
        </div>

        {/* Content & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                The Credit Card Minimum Due Trap in India
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Credit cards in India carry the most punitive interest rates in the banking sector—averaging
                between <strong>42% and 52% APR</strong> when factoring in finance charges, 18% GST
                on interest, late payment penalties, and over-limit fees.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When you pay the &apos;Minimum Amount Due&apos; (usually 5% of the total balance),
                virtually none of your money goes toward reducing the principal loan balance. A ₹3,00,000
                credit card debt serviced only with minimum dues will take over <strong>18 years</strong>
                to clear and cost more than ₹11,00,000 in pure interest!
              </p>
            </div>

            {/* Warning Callout */}
            <div className="p-6 rounded-2xl bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 space-y-2">
              <h3 className="font-bold text-base text-amber-900 dark:text-amber-200 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                Why Credit Card Debt is Easiest to Settle for 60% - 75% Less:
              </h3>
              <p className="text-xs text-amber-950 dark:text-amber-300 leading-relaxed">
                In most card defaults over 180 days old, more than <strong>50% to 65% of the claimed balance</strong>
                consists of compounded interest, late fees, and penal charges rather than actual
                principal spends. Under RBI guidelines on Fair Practices and Compromise Settlements,
                card issuers are willing to waive these virtual finance charges during formal legal OTS.
              </p>
            </div>

            {/* Card Issuers Settle With */}
            <div className="space-y-3">
              <h3 className="font-bold text-base text-foreground">
                Card Issuers Handled by Our Empanelled Advocates:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-muted-foreground">
                {[
                  "SBI Cards & Payment Services",
                  "HDFC Bank Credit Cards",
                  "ICICI Bank Credit Cards",
                  "Axis Bank Credit Cards",
                  "Kotak Credit Cards",
                  "RBL Bank Cards",
                  "Standard Chartered Cards",
                  "American Express (Amex)",
                  "HSBC India Cards",
                  "OneCard (FPL Technologies)",
                  "IDFC FIRST WOW / Millennia",
                  "IndusInd Bank Cards",
                ].map((issuer, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl border border-border bg-card flex items-center gap-2 font-medium"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>{issuer}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits list */}
            <div className="space-y-3 pt-2">
              <h3 className="font-bold text-base text-foreground">
                What Our Legal Intervention Accomplishes:
              </h3>
              <div className="space-y-2">
                {[
                  "Immediate stoppage of compounding 42% APR interest calculation",
                  "Cease & desist notice served to third-party agency collection departments",
                  "Waiver of exorbitant late payment, overlimit, and GST penalty charges",
                  "Flexible single or 2-3 installment settlement options",
                  "Issuance of official Bank No Dues Certificate and removal from active collections",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Sticky Sidebar */}
          <div className="lg:col-span-5 sticky top-28">
            <ConsultationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
