import { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  Scale,
  ShieldCheck,
  TrendingDown,
  AlertTriangle,
  Briefcase,
  FileText,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { ServiceJsonLd } from "@/components/seo/json-ld";
import { ConsultationForm } from "@/components/home/consultation-form";

export const metadata: Metadata = {
  title: "Business & MSME Loan Settlement India | CC/OD & SARFAESI Legal Defense",
  description:
    "Legal advisory for MSME loan restructuring, Cash Credit/OD settlement, and SARFAESI Sec 13(2) defense. Protect enterprise assets and negotiate One-Time Settlement.",
  alternates: {
    canonical: `${siteConfig.url}/services/business-loan-settlement`,
  },
};

export default function BusinessLoanSettlementPage() {
  return (
    <div className="py-12 md:py-20 bg-background text-foreground">
      <ServiceJsonLd
        title="Business & MSME Loan Settlement Advisory India"
        description="Legal loan restructuring, OTS negotiation, and SARFAESI defense for MSME and corporate borrowers across India."
        url={`${siteConfig.url}/services/business-loan-settlement`}
      />

      <div className="container mx-auto px-4 sm:px-6">
        {/* Hero Header */}
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
            <Building2 className="h-4 w-4" />
            <span>MSME & Commercial Debt Resolution</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Business & MSME Loan Restructuring & Settlement
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Protect your commercial enterprise, preserve operations, and safeguard family assets.
            Our senior banking litigators advise MSMEs on Cash Credit (CC) / Overdraft (OD)
            restructuring, SARFAESI defense, and One-Time Settlements (OTS).
          </p>
        </div>

        {/* Content & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Resolving Commercial Credit Distress in India
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Small and medium business owners face acute liquidity crunches when client payments
                are delayed, margins compress, or working capital cycles expand. When Cash Credit
                (CC) or Overdraft (OD) accounts fall into irregular status and cross 90 days of
                interest servicing default, banks classify them as NPAs.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Banks often respond aggressively with statutory notices under the SARFAESI Act,
                threatening auction of business premises or personal residential collaterals. Our
                advocates intervene legally to halt coercive auctions, invoke RBI MSME Restructuring
                circulars, and negotiate realistic One-Time Settlement (OTS) packages.
              </p>
            </div>

            {/* SARFAESI Defense Box */}
            <div className="p-6 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 space-y-3">
              <h3 className="font-bold text-base text-indigo-950 dark:text-indigo-200 flex items-center gap-2">
                <Scale className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                SARFAESI Act Section 13(2) & 13(4) Legal Representation:
              </h3>
              <p className="text-xs text-indigo-950 dark:text-indigo-300 leading-relaxed">
                If your bank has served a 60-day demand notice under Section 13(2) of the SARFAESI
                Act, you have statutory rights to file formal legal objections under Section 13(3A).
                The bank is legally obligated to reply within 15 days before initiating physical
                possession under Section 13(4). Our advocates challenge defective notices and file
                Securitisation Applications (SA) before the Debt Recovery Tribunal (DRT).
              </p>
            </div>

            {/* Commercial Debts Handled */}
            <div className="space-y-3">
              <h3 className="font-bold text-base text-foreground">
                Commercial Debt Facilities We Resolve:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                {[
                  "Cash Credit (CC) & Overdraft (OD) Facility Defaults",
                  "Unsecured Business Loans & Merchant Cash Advances",
                  "Machinery, Equipment & Commercial Vehicle Loans",
                  "Loan Against Property (LAP) / Mortgage Workouts",
                  "Director / Guarantor Personal Guarantee Invocation Defense",
                  "MSME Samadhaan Facilitation Council Representation",
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl border border-border bg-card flex items-center gap-2 font-medium"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Restructuring vs OTS */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border space-y-2">
              <h3 className="font-bold text-sm text-foreground">
                Two Proven Paths for Business Relief:
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>
                  <strong>1. Debt Restructuring / Loan Recast:</strong> If your core business model
                  is viable, we negotiate extension of loan tenure, moratorium periods on principal
                  repayment, and conversion of unpaid interest into Funded Interest Term Loans (FITL).
                </p>
                <p>
                  <strong>2. Commercial One-Time Settlement (OTS):</strong> If debt levels are
                  unsustainable, we negotiate a structured OTS to clear the entire liability at a
                  40% to 65% concession, releasing personal guarantees and mortgages.
                </p>
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
