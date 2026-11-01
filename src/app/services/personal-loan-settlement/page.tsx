import { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  CheckCircle2,
  ShieldCheck,
  TrendingDown,
  AlertCircle,
  FileCheck2,
  ArrowRight,
  PhoneCall,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { ServiceJsonLd } from "@/components/seo/json-ld";
import { ConsultationForm } from "@/components/home/consultation-form";

export const metadata: Metadata = {
  title: "Personal Loan Settlement India | Save 50-70% with Legal OTS Advisory",
  description:
    "Settle unsecured personal loans from HDFC, ICICI, SBI, Axis, Bajaj Finserv legally. Stop recovery harassment and receive official No Dues Certificate under RBI guidelines.",
  alternates: {
    canonical: `${siteConfig.url}/services/personal-loan-settlement`,
  },
};

export default function PersonalLoanSettlementPage() {
  return (
    <div className="py-12 md:py-20 bg-background text-foreground">
      <ServiceJsonLd
        title="Personal Loan Settlement & OTS Advisory India"
        description="Legal One-Time Settlement (OTS) advisory for unsecured bank and NBFC personal loans under RBI guidelines."
        url={`${siteConfig.url}/services/personal-loan-settlement`}
      />

      <div className="container mx-auto px-4 sm:px-6">
        {/* Hero Banner */}
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
            <Scale className="h-4 w-4" />
            <span>Unsecured Loan Relief Under RBI Guidelines</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Personal Loan Settlement (One-Time Settlement - OTS)
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Resolve unmanageable bank and NBFC personal loans with legal safeguards. Our advocates
            negotiate directly with senior settlement committees to secure up to 50% to 70% waivers
            and an irrevocable No Dues Certificate (NDC).
          </p>
        </div>

        {/* Content & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          {/* Detailed Legal Guide */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                How Does Personal Loan Settlement Work in India?
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                When you default on an unsecured personal loan due to genuine financial distress
                (such as loss of employment, severe medical emergencies, or salary reduction), the
                loan turns into a Non-Performing Asset (NPA) after 90 days.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Under the Reserve Bank of India (RBI) Prudential Framework and Fair Practices Code,
                banks are legally permitted to enter into a <strong>Compromise Settlement</strong> or
                <strong>One-Time Settlement (OTS)</strong>. By demonstrating documented hardship,
                our empanelled advocates convince the bank that recovering a realistic lump-sum is
                far more advantageous than spending years on costly civil litigation.
              </p>
            </div>

            {/* Why Banks Agree Box */}
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border space-y-3">
              <h3 className="font-bold text-base text-foreground flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-emerald-500" />
                Why Do Banks Agree to Waive 50% - 70% of the Loan?
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Personal loans are 100% unsecured—there is no collateral or mortgage for the bank to
                seize. Holding bad loans requires banks to lock capital under RBI provisioning norms.
                When our legal team presents an audited hardship dossier along with an upfront or
                staged settlement proposal, lenders eagerly accept a discounted closure to clear the
                bad asset from their balance sheet.
              </p>
            </div>

            {/* Banks Covered */}
            <div className="space-y-3">
              <h3 className="font-bold text-base text-foreground">
                Major Financial Institutions We Settle With:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-muted-foreground">
                {[
                  "HDFC Bank",
                  "ICICI Bank",
                  "State Bank of India (SBI)",
                  "Axis Bank",
                  "Kotak Mahindra Bank",
                  "Bajaj Finserv",
                  "Tata Capital",
                  "Aditya Birla Capital",
                  "IndusInd Bank",
                  "IDFC FIRST Bank",
                  "RBL Bank",
                  "Piramal Finance",
                ].map((bank, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl border border-border bg-card flex items-center gap-2 font-medium"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary-500" />
                    <span>{bank}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step by Step Legal Roadmap */}
            <div className="space-y-4">
              <h3 className="font-bold text-base text-foreground">
                Our 4-Stage Legal Settlement Protocol:
              </h3>
              <div className="space-y-3">
                {[
                  {
                    step: "1. Advocate Representation Notice",
                    desc: "We serve formal notice to the bank's recovery department to halt harassing calls and unannounced visits under RBI guidelines.",
                  },
                  {
                    step: "2. Hardship Dossier Preparation",
                    desc: "Our legal team collates your termination letters, medical bills, bank statements, and income declarations to prove inability to service original EMIs.",
                  },
                  {
                    step: "3. Direct Negotiation with Settlement Committee",
                    desc: "We bypass aggressive low-level agents and negotiate directly with the bank's Regional Collection Managers and Settlement Committees.",
                  },
                  {
                    step: "4. Settlement Letter Verification & NDC",
                    desc: "Before you pay a single rupee, we verify the authenticity of the bank's settlement letter and ensure a clean No Dues Certificate is granted.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-border bg-card space-y-1">
                    <div className="font-bold text-xs text-primary-600 dark:text-primary-400">
                      {item.step}
                    </div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
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
