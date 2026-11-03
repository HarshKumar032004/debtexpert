"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileSearch,
  MessageCircle,
  ArrowRight,
  HelpCircle,
  Lock,
} from "lucide-react";
import { siteConfig } from "@/config/site";

interface CheckItem {
  id: string;
  title: string;
  description: string;
  redFlag: string;
}

const CHECKS: CheckItem[] = [
  {
    id: "letterhead",
    title: "1. Official Bank/NBFC Letterhead & Traceable Reference Number",
    description: "The letter must feature the official corporate logo, registered office address, and a unique, system-generated Reference / Proposal ID.",
    redFlag: "Plain Word/PDF document, generic typography, or missing reference number.",
  },
  {
    id: "ots_terms",
    title: "2. Explicit 'Full and Final Settlement (OTS)' Terms & Concession",
    description: "Must clearly specify the exact total outstanding claim, agreed compromise amount, waived amount, and unambiguous words: 'Full & Final Settlement'.",
    redFlag: "Vague terms like 'Part Payment' or 'Temporary Relief' which banks later treat as standard EMI catch-up.",
  },
  {
    id: "direct_account",
    title: "3. Payment Directed ONLY to Your Official Loan/Card Account",
    description: "The payment instructions must specify your exact 16-digit Loan Account Number or Credit Card Account. Never a third party.",
    redFlag: "CRITICAL DANGER: Directing funds to any personal UPI ID, collection agency bank account, cash collection, or QR code.",
  },
  {
    id: "ndc_timeline",
    title: "4. Explicit Commitment for No Dues Certificate (NDC/NOC) within 15–30 Days",
    description: "The letter must legally bind the lender to issue a formal No Dues Certificate and update credit bureaus (CIBIL/Experian) within 30 days.",
    redFlag: "No written commitment on NDC or bureau closure timeline.",
  },
  {
    id: "authorized_signatory",
    title: "5. Signed by an Authorized Officer (Branch / Zonal / Legal Manager)",
    description: "Contains name, employee ID, designation, and official contact/email of an authorized bank manager verifiable through the branch.",
    redFlag: "Signed merely as 'Recovery Team' or anonymous telecaller signature.",
  },
];

export function OtsLetterVerifier() {
  const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({
    letterhead: false,
    ots_terms: false,
    direct_account: false,
    ndc_timeline: false,
    authorized_signatory: false,
  });

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const score = Object.values(checkedItems).filter(Boolean).length;

  const whatsappAuditMessage = encodeURIComponent(
    `Hello Debt Support Expert, I have received a Bank Settlement Offer Letter / Notice. I used your Letter Verification Checklist (Score: ${score}/5). Can an advocate please audit this letter for authenticity before I make any payment?`
  );

  return (
    <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 lg:p-10 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md my-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/70 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-semibold">
            <FileSearch className="h-3.5 w-3.5 text-amber-600" />
            <span>Fraud Prevention & Compliance Tool</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
            Genuine vs Fake Settlement Letter Verifier
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Thousands of borrowers are scammed by unauthorized recovery agents sending fake settlement letters and stealing compromise funds. Test your letter against these 5 mandatory criteria:
          </p>
        </div>

        {/* Live Score Counter */}
        <div className="shrink-0 p-4 rounded-2xl bg-muted/60 border border-border text-center space-y-1 sm:w-44">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block">
            Authenticity Score
          </span>
          <div className="text-3xl font-black text-foreground">
            {score} <span className="text-base text-muted-foreground font-normal">/ 5</span>
          </div>
          <span
            className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${
              score === 5
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                : score >= 3
                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
            }`}
          >
            {score === 5
              ? "All 5 Verified"
              : score >= 3
              ? "Needs Verification"
              : "High Risk"}
          </span>
        </div>
      </div>

      {/* Critical Red Flag Warning Banner */}
      <div className="p-4 rounded-2xl bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-900 dark:text-red-200 space-y-1.5">
        <div className="font-extrabold flex items-center gap-2 text-red-700 dark:text-red-400">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>CRITICAL RED FLAG — NEVER PAY TO INDIVIDUAL OR AGENCY ACCOUNTS:</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          If a recovery agent asks you to transfer settlement money to any personal Google Pay, PhonePe, Paytm, agency UPI ID, or third-party bank account, <strong>STOP IMMEDIATELY</strong>. All legitimate bank settlements are credited exclusively into your own loan/credit card account.
        </p>
      </div>

      {/* 5 Interactive Checkpoints */}
      <div className="space-y-3">
        {CHECKS.map((item) => {
          const isChecked = !!checkedItems[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                isChecked
                  ? "border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-sm"
                  : "border-border bg-card hover:bg-muted/40"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="pt-0.5 shrink-0">
                  <div
                    className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-colors ${
                      isChecked
                        ? "border-emerald-600 bg-emerald-600 text-white"
                        : "border-input bg-background text-transparent"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="font-bold text-xs sm:text-sm text-foreground">
                      {item.title}
                    </span>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider ${
                        isChecked ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
                      }`}
                    >
                      {isChecked ? "✓ Verified on Letter" : "Click to Verify"}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>

                  <div className="text-[10px] text-red-600 dark:text-red-400 font-medium pt-0.5">
                    <strong>Red Flag:</strong> {item.redFlag}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action CTA Box */}
      <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="font-extrabold text-sm sm:text-base flex items-center justify-center sm:justify-start gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span>Unsure About a Bank Notice or Offer Letter?</span>
          </div>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            Send your letter to our High Court empanelled advocates for a 100% free authenticity and legal validity audit before releasing any funds.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappAuditMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 shadow-md transition-all flex items-center justify-center gap-2 text-center"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Have Advocates Audit My Letter</span>
          </a>

          <Link
            href="/contact?service=letter-audit"
            className="px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors text-center"
          >
            <span>Upload Document</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
