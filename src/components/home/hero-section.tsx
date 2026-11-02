"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Scale,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  MessageCircle,
  Lock,
  TrendingDown,
  AlertCircle,
  FileCheck2,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { formatINR } from "@/lib/utils";
import { AnimatedCounter } from "@/components/animations/motion-wrappers";
import { submitLead, validateIndianPhone } from "@/lib/lead";

const ISSUE_PILLS = [
  { id: "personal", label: "Personal Loan" },
  { id: "credit-card", label: "Credit Card" },
  { id: "harassment", label: "Recovery Harassment" },
  { id: "legal-notice", label: "Legal Notice / Sec 138" },
  { id: "multiple", label: "Multiple Loans" },
];

const DEBT_TIERS = [
  { id: "lt_1l", label: "Below ₹1L", amount: 80000 },
  { id: "1_3l", label: "₹1L–₹3L", amount: 200000 },
  { id: "3_7l", label: "₹3L–₹7L", amount: 500000 },
  { id: "7_15l", label: "₹7L–₹15L", amount: 1000000 },
  { id: "15l_plus", label: "₹15L+", amount: 2000000 },
];

export function HeroSection() {
  // Enhanced quick form state
  const [selectedIssue, setSelectedIssue] = React.useState("personal");
  const [selectedDebtTier, setSelectedDebtTier] = React.useState("3_7l");
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [city, setCity] = React.useState("");
  const [consent, setConsent] = React.useState(true);
  const [honeypot, setHoneypot] = React.useState("");

  const [phoneError, setPhoneError] = React.useState<string | null>(null);
  const [consentError, setConsentError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [modalData, setModalData] = React.useState({
    isOpen: false,
    referenceId: "",
    whatsappUrl: "",
  });

  const activeDebtAmount =
    DEBT_TIERS.find((t) => t.id === selectedDebtTier)?.amount || 500000;
  const activeDebtLabel =
    DEBT_TIERS.find((t) => t.id === selectedDebtTier)?.label || "₹3L–₹7L";
  const activeIssueLabel =
    ISSUE_PILLS.find((i) => i.id === selectedIssue)?.label || "Personal Loan";

  // Indicative calculation based on board-approved policy benchmarks
  const estimatedWaiverPct =
    selectedIssue === "credit-card"
      ? 60
      : selectedIssue === "legal-notice"
      ? 50
      : 55;
  const estimatedSettlement = Math.round(
    activeDebtAmount * (1 - estimatedWaiverPct / 100)
  );
  const estimatedSavings = activeDebtAmount - estimatedSettlement;
  const estimatedInstallment = Math.round(estimatedSettlement / 3);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    setConsentError(null);

    // Honeypot check
    if (honeypot) return;

    if (!consent) {
      setConsentError("Please tick the consent box to proceed.");
      return;
    }

    const validation = validateIndianPhone(phone);
    if (!validation.isValid) {
      setPhoneError(
        validation.error || "Please enter a valid 10-digit Indian mobile number"
      );
      return;
    }

    setLoading(true);

    const result = await submitLead({
      fullName,
      phone: validation.cleaned,
      city: city || "India",
      totalDebt: activeDebtLabel,
      loanType: activeIssueLabel,
      source: "hero-quick-form",
      facingHarassment:
        selectedIssue === "harassment" || selectedIssue === "legal-notice",
    });

    setLoading(false);

    if (result.success) {
      setModalData({
        isOpen: true,
        referenceId: result.referenceId,
        whatsappUrl: result.whatsappUrl,
      });
      setSubmitted(true);
    } else {
      setPhoneError(
        result.error || "Failed to submit case file. Please try again."
      );
    }
  };

  const whatsappDirectUrl = siteConfig.getWhatsAppUrl();

  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-12 sm:pb-16 lg:pt-16 lg:pb-24 hero-gradient-light dark:hero-gradient-dark border-b border-slate-200/60 dark:border-slate-800/60">
      {/* Background ambient decorative shapes */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-primary-500/5 dark:bg-primary-500/10 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left Column: Value Proposition & Dual CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 space-y-6 text-center lg:text-left"
          >
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800/60 text-xs font-semibold text-primary-700 dark:text-blue-300 shadow-sm">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>RBI Guideline Compliant Legal Advisory</span>
            </div>

            {/* H1 Headline */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Settle Your Loans Legally &{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-sky-300 dark:to-indigo-300">
                Stop Recovery Harassment
              </span>{" "}
              Today.
            </h1>

            {/* Empathetic Subheadline */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Struggling with unmanageable personal loans or credit card debt? Our
              empanelled High Court advocates protect you from unlawful recovery agent
              intimidation and legally negotiate One-Time Settlements (OTS) under
              official bank compromise policies with authentic No Dues Certificates (NDC).
            </p>

            {/* Direct Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <a
                href="#eligibility-form"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-primary-600 hover:bg-primary-700 shadow-lg shadow-primary-600/25 active:scale-95 transition-all text-center flex items-center justify-center gap-2"
              >
                <span>Free Case Evaluation</span>
                <ArrowRight className="h-4 w-4" />
              </a>

              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition-all text-center flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span>WhatsApp an Advocate</span>
              </a>
            </div>

            {/* Trust Badges Row */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 border-t border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>RBI Recovery Rules (8 AM–7 PM)</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Official Signed Bank NDC</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Zero Third-Party Escrow Risk</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Quick Eligibility Form */}
          <div className="lg:col-span-5 relative" id="eligibility-form">
            {/* Floating Shield Badge Animation */}
            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="hidden sm:flex absolute -top-5 -right-4 z-20 items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-bold shadow-xl border border-slate-700 backdrop-blur-md"
            >
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Advocate Protection Active</span>
            </motion.div>

            {/* Floating Savings Pill Animation */}
            <motion.div
              animate={{
                y: [0, 8, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="hidden sm:flex absolute -bottom-5 -left-4 z-20 items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold shadow-xl border border-emerald-400/50 backdrop-blur-md"
            >
              <TrendingDown className="h-4 w-4 text-white" />
              <span>Direct Bank Payment</span>
            </motion.div>

            {/* Outer decorative glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-primary-600 to-emerald-500 rounded-3xl blur-xl opacity-25 dark:opacity-35 -z-10 animate-pulseGlow" />

            {/* Main Interactive Glassmorphic Eligibility Card */}
            <div className="rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-4 sm:p-6 lg:p-7 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="h-9 w-9 rounded-xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                    <Scale className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                      Check Settlement Eligibility
                    </h2>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Free Confidential Case Evaluation
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  Instant
                </span>
              </div>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-8 text-center space-y-4"
                  >
                    <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <div className="space-y-1">
                      {modalData.referenceId && (
                        <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-[11px] font-mono font-bold text-emerald-700 dark:text-emerald-300">
                          Ref #{modalData.referenceId}
                        </div>
                      )}
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                        Case File Initiated!
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                        Thank you, <span className="font-semibold text-slate-900 dark:text-white">{fullName}</span>.
                        Estimated Settlement: <strong className="text-emerald-600 dark:text-emerald-400">{formatINR(estimatedSettlement)}</strong> (Payable in ~3 installments of {formatINR(estimatedInstallment)}).
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Our advocate team will contact you at <strong className="text-slate-900 dark:text-white">+91 {phone}</strong> shortly.
                    </p>
                    <div className="pt-2 flex flex-col gap-2">
                      {modalData.whatsappUrl && (
                        <a
                          href={modalData.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all active:scale-95"
                        >
                          <MessageCircle className="h-4 w-4" />
                          <span>Open Case on WhatsApp</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => setSubmitted(false)}
                        className="text-xs font-bold text-primary-600 dark:text-primary-400 hover:underline pt-1"
                      >
                        Check Another Portfolio
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5 pt-4">
                    {/* Honeypot field (hidden) */}
                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      style={{ display: "none" }}
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    {/* 1. Interactive Issue Pills */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        1. Primary Debt Concern
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {ISSUE_PILLS.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setSelectedIssue(item.id)}
                            className={`py-1.5 px-2.5 rounded-lg text-[11px] font-semibold border transition-all ${
                              selectedIssue === item.id
                                ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 dark:border-primary-500 shadow-sm"
                                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Total Debt Amount Selector */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[11px]">
                          2. Total Outstanding Debt
                        </label>
                        <span className="font-extrabold text-primary-600 dark:text-primary-400 text-xs">
                          {activeDebtLabel}
                        </span>
                      </div>
                      <div className="grid grid-cols-5 gap-1 text-center">
                        {DEBT_TIERS.map((tier) => (
                          <button
                            key={tier.id}
                            type="button"
                            onClick={() => setSelectedDebtTier(tier.id)}
                            className={`py-1.5 px-1 rounded-lg text-[10px] font-bold border transition-all ${
                              selectedDebtTier === tier.id
                                ? "border-primary-600 bg-primary-600 text-white"
                                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            {tier.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Name, Mobile & City */}
                    <div className="space-y-2.5 pt-1">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your full name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3 py-2 text-base sm:text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            Mobile Number *
                          </label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                              +91
                            </span>
                            <input
                              type="tel"
                              inputMode="numeric"
                              required
                              placeholder="9876543210"
                              value={phone}
                              onChange={(e) => {
                                setPhone(e.target.value);
                                if (phoneError) setPhoneError(null);
                              }}
                              className={`w-full pl-9 pr-2.5 py-2 text-base sm:text-xs rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 ${
                                phoneError
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : "border-slate-200 dark:border-slate-800 focus-visible:ring-primary"
                              }`}
                            />
                          </div>
                          {phoneError && (
                            <p className="text-[10px] text-red-500 font-semibold pt-0.5">
                              {phoneError}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            City *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Mumbai, Delhi"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="w-full px-3 py-2 text-base sm:text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 4. Mandatory Privacy Consent Checkbox */}
                    <div className="pt-1">
                      <label className="flex items-start gap-2 cursor-pointer text-[11px] text-slate-600 dark:text-slate-400">
                        <input
                          type="checkbox"
                          checked={consent}
                          onChange={(e) => {
                            setConsent(e.target.checked);
                            if (e.target.checked) setConsentError(null);
                          }}
                          className="mt-0.5 rounded border-slate-300 text-primary-600 focus:ring-primary-500 h-3.5 w-3.5"
                        />
                        <span>
                          I agree that Debt Support Expert may contact me via phone, WhatsApp, or email regarding my enquiry.
                        </span>
                      </label>
                      {consentError && (
                        <p className="text-[10px] text-red-500 font-semibold pt-0.5">
                          {consentError}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-primary-600 via-primary-700 to-blue-700 hover:from-primary-700 hover:to-blue-800 shadow-md shadow-primary-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                      {loading ? (
                        <span>Analyzing Case Details...</span>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4 text-amber-300" />
                          <span>Get Free Legal Evaluation</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                      <Lock className="h-3 w-3 text-emerald-500" />
                      <span>Attorney-client privilege · 100% confidential · Direct lender payment</span>
                    </div>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Trust Metrics Row */}
        <div className="mt-14 pt-8 border-t border-slate-200/70 dark:border-slate-800/70">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-center">
            <div className="p-2.5 sm:p-3">
              <div className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-primary-600 dark:text-blue-400 tracking-tight">
                <AnimatedCounter target={45} prefix="₹" suffix="+ Cr" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                Debt Resolved & Settled
              </div>
            </div>
            <div className="p-2.5 sm:p-3">
              <div className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                <AnimatedCounter target={12500} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                Clients Protected from Harassment
              </div>
            </div>
            <div className="p-2.5 sm:p-3">
              <div className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-primary-600 dark:text-blue-400 tracking-tight">
                100%
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                Direct-to-Bank Payments
              </div>
            </div>
            <div className="p-2.5 sm:p-3">
              <div className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                100%
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                RBI Fair Practice Compliance
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
