"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Lock,
  Scale,
  Award,
  HelpCircle,
  FileCheck2,
  TrendingUp,
  CreditCard,
  MessageCircle,
  PhoneCall,
  X,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { formatINR } from "@/lib/utils";

const PRICING_PLANS = [
  {
    id: "essential",
    name: "Essential Settlement Support",
    price: 5000,
    priceDisplay: "₹5,000",
    description: "Ideal for borrowers seeking immediate legal protection and a structured OTS bank negotiation strategy.",
    badge: "Core Legal Advisory",
    isPopular: false,
    features: [
      "Complete financial and debt distress assessment",
      "Personalised OTS (One-Time Settlement) negotiation strategy",
      "Hardship documentation drafting (Job loss, medical, business deficit)",
      "Bank & NBFC negotiation coordination by empanelled advocates",
      "Cease & desist anti-harassment legal notice to lenders",
      "Official No Dues Certificate (NDC) review and validation",
    ],
    notIncluded: [
      "Credit bureau (CIBIL/Experian) report dispute filing",
      "12-Month credit score rebuilding roadmap",
    ],
    ctaText: "Choose Essential Support",
    ctaHref: "/contact?plan=essential",
  },
  {
    id: "cibil-protection",
    name: "Settlement + CIBIL Protection",
    price: 7000,
    priceDisplay: "₹7,000",
    description: "Our comprehensive legal representation package covering settlement negotiation plus complete credit bureau dispute protection.",
    badge: "Most Popular",
    isPopular: true,
    features: [
      "Everything in Essential Settlement Support",
      "Comprehensive credit report audit (CIBIL, Experian, Equifax, CRIF)",
      "Identification of inaccurate, duplicate, or illegal penal entries",
      "Credit bureau dispute filing under RBI 30-day statutory timeline",
      "Post-settlement NDC status verification with bank credit reporting desk",
      "Statutory ₹100/day delay compensation claim enforcement guidance",
      "Dedicated senior advocate case manager assignment",
    ],
    notIncluded: [
      "12-Month long-term score rebuilding advisory",
    ],
    ctaText: "Choose Most Popular Plan",
    ctaHref: "/contact?plan=cibil-protection",
  },
  {
    id: "cibil-rebuilding",
    name: "Settlement + CIBIL Rebuilding",
    price: 10000,
    priceDisplay: "₹10,000",
    description: "The end-to-end financial turnaround solution: complete loan settlement, bureau protection, and 1-year score restoration.",
    badge: "Complete 360° Relief",
    isPopular: false,
    features: [
      "Everything in Settlement + CIBIL Protection",
      "12-Month personalised credit-score rebuilding roadmap",
      "Quarterly credit report monitoring and bureau score updates",
      "Secured credit builder card and FD-backed loan roadmap",
      "Debt-to-income (DTI) optimization for future home/vehicle eligibility",
      "Direct priority WhatsApp line with senior legal and finance consultants",
      "Future creditworthiness certificate and banker readiness audit",
    ],
    notIncluded: [],
    ctaText: "Choose Complete 360° Plan",
    ctaHref: "/contact?plan=cibil-rebuilding",
  },
];

const COMPARISON_FEATURES = [
  { name: "Distress & Hardship Evaluation", essential: true, protection: true, rebuilding: true },
  { name: "Bank & NBFC OTS Negotiation", essential: true, protection: true, rebuilding: true },
  { name: "Anti-Harassment Legal Notices", essential: true, protection: true, rebuilding: true },
  { name: "No Dues Certificate (NDC) Verification", essential: true, protection: true, rebuilding: true },
  { name: "Direct-to-Bank Payment Security Guarantee", essential: true, protection: true, rebuilding: true },
  { name: "4-Bureau Credit Audit (CIBIL/Experian)", essential: false, protection: true, rebuilding: true },
  { name: "Bureau Dispute Filing (RBI 30-Day Rule)", essential: false, protection: true, rebuilding: true },
  { name: "₹100/Day Delay Penalty Enforcement", essential: false, protection: true, rebuilding: true },
  { name: "12-Month Score Rebuilding Roadmap", essential: false, false: true, rebuilding: true },
  { name: "Quarterly Credit Health Reviews", essential: false, false: true, rebuilding: true },
];

const PRICING_FAQS = [
  {
    q: "Do I pay my loan settlement money to Debt Support Expert?",
    a: "NO, absolutely not. 100% of all agreed settlement funds are paid directly by you to your lending bank or NBFC via official banking channels (branch NEFT/RTGS or net-banking). Debt Support Expert only charges a transparent professional advisory fee for legal representation and documentation.",
  },
  {
    q: "When do I pay the advisory fee?",
    a: "Our advisory fee covers the case preparation, hardship drafting, bureau audit, and advocate negotiation. We do not demand any surprise commissions, hidden costs, or percentage of savings cuts.",
  },
  {
    q: "How does the 'RBI ₹100/day delay compensation rule' work in Plan 2 and 3?",
    a: "Under the RBI Master Direction effective October 2023, banks and credit bureaus must rectify reported credit disputes within 30 calendar days. If they fail to update your settled/closed account within 30 days of submitting your No Dues Certificate, you are entitled to ₹100 per day of delay directly from the bank/bureau.",
  },
  {
    q: "Can I upgrade from Plan 1 to Plan 2 or 3 later?",
    a: "Yes. You can start with Essential Settlement Support and upgrade to CIBIL Protection or Rebuilding at any time by simply paying the difference.",
  },
];

export function PricingView() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="space-y-16">
      {/* 1. Header Section */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Transparent Legal Advisory Pricing</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          Clear, Fixed Legal Advisory Plans with Zero Hidden Commissions
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
          No percentage cuts. No hidden charges. 100% of your settlement funds are paid directly to your lending bank. Choose the right legal protection tier for your debt portfolio.
        </p>
      </div>

      {/* 2. Direct-to-Bank Payment Security Banner */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-emerald-950/40 border border-emerald-500/30 p-5 sm:p-7 text-white shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <div className="space-y-1 flex-1">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <span>Direct Lender Payment Security Guarantee</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                100% Safe
              </span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Debt Support Expert <strong>never collects, handles, or escrows</strong> settlement money. All negotiated compromise settlements are paid directly by the borrower to the bank or NBFC against an official OTS sanction letter.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden p-6 sm:p-8 backdrop-blur-md ${
              plan.isPopular
                ? "border-primary-500 bg-card shadow-2xl ring-2 ring-primary-500/30 lg:-translate-y-2 dark:bg-slate-900"
                : "border-border bg-card shadow-lg hover:shadow-xl dark:bg-slate-900/70"
            }`}
          >
            {/* Top Most Popular Ribbon */}
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-gradient-to-l from-primary-600 to-blue-600 text-white text-[11px] font-extrabold uppercase tracking-wider py-1.5 px-6 rounded-bl-2xl shadow-md">
                ★ Most Popular
              </div>
            )}

            <div className="space-y-6">
              <div className="space-y-2">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950/70 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                  {plan.badge}
                </span>

                <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  {plan.name}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed min-h-[36px]">
                  {plan.description}
                </p>
              </div>

              {/* Price Display */}
              <div className="pt-2 pb-4 border-b border-border">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
                    {plan.priceDisplay}
                  </span>
                  <span className="text-xs text-muted-foreground font-semibold">
                    / one-time fee
                  </span>
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                  ✓ Zero percentage commission on savings
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Included in this plan:
                </div>
                <ul className="space-y-2.5 text-xs text-muted-foreground">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-foreground/90 leading-relaxed">{feat}</span>
                    </li>
                  ))}
                  {plan.notIncluded.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5 opacity-40">
                      <X className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="line-through leading-relaxed">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-8">
              <Link
                href={plan.ctaHref}
                className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md ${
                  plan.isPopular
                    ? "bg-gradient-to-r from-primary-600 via-primary-700 to-blue-700 hover:from-primary-700 hover:to-blue-800 text-white shadow-primary-600/30"
                    : "bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white"
                }`}
              >
                <span>{plan.ctaText}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Plan Comparison Table */}
      <div className="max-w-4xl mx-auto rounded-3xl border border-border bg-card p-4 sm:p-8 shadow-xl space-y-6">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
            Side-by-Side Feature Comparison
          </h3>
          <p className="text-xs text-muted-foreground">
            See exactly what is covered in each advisory tier.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-3 font-bold text-foreground uppercase tracking-wider">Features</th>
                <th className="py-3 px-3 font-bold text-center text-foreground uppercase tracking-wider">Essential (₹5K)</th>
                <th className="py-3 px-3 font-bold text-center text-primary uppercase tracking-wider">CIBIL Protection (₹7K)</th>
                <th className="py-3 px-3 font-bold text-center text-foreground uppercase tracking-wider">Rebuilding (₹10K)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {COMPARISON_FEATURES.map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 px-3 font-medium text-foreground">{item.name}</td>
                  <td className="py-3 px-3 text-center">
                    {item.essential ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center bg-primary-50/30 dark:bg-primary-950/20">
                    {item.protection ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {item.rebuilding ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 mx-auto" />
                    ) : (
                      <span className="text-muted-foreground/40">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Pricing FAQs */}
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="text-center space-y-2 mb-6">
          <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
            Frequently Asked Questions About Fees
          </h3>
          <p className="text-xs text-muted-foreground">
            Clear, upfront legal clarity before you initiate your case.
          </p>
        </div>

        <div className="space-y-3">
          {PRICING_FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card overflow-hidden shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-sm text-foreground flex items-center justify-between gap-4"
              >
                <span>{faq.q}</span>
                <span className="text-lg text-muted-foreground font-light shrink-0">
                  {openFaq === idx ? "−" : "+"}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs text-muted-foreground leading-relaxed border-t border-border/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 6. Bottom Free Evaluation CTA */}
      <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900 text-white p-6 sm:p-10 text-center space-y-5 shadow-2xl">
        <h3 className="text-xl sm:text-3xl font-extrabold tracking-tight">
          Not Sure Which Advisory Plan Fits Your Loan Portfolio?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Request a free, confidential case audit. Our advocates will review your outstanding debts and recommend the exact legal strategy suited for your lenders.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/contact"
            className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-md"
          >
            Get Free Case Evaluation
          </Link>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
              "Hello Debt Support Expert, I am looking at your pricing plans and would like advice on which plan fits my debt situation."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-md flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Chat with Advisor on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
