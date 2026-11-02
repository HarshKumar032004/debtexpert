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
  FileCheck2,
  Lock,
  Send,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { formatINR } from "@/lib/utils";
import { AnimatedCounter } from "@/components/animations/motion-wrappers";
import { submitLead, validateIndianPhone } from "@/lib/lead";
import { CaseInitiatedModal } from "@/components/forms/case-initiated-modal";

export function HeroSection() {
  // Mini eligibility form state
  const [loanType, setLoanType] = React.useState("personal");
  const [debtAmount, setDebtAmount] = React.useState(1200000);
  const [emiStatus, setEmiStatus] = React.useState("overdue-3-6");
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [phoneError, setPhoneError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [modalData, setModalData] = React.useState({
    isOpen: false,
    referenceId: "",
    whatsappUrl: "",
  });

  const whatsappUrl = siteConfig.getWhatsAppUrl();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    const validation = validateIndianPhone(phone);
    if (!validation.isValid) {
      setPhoneError(validation.error || "Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);

    const result = await submitLead({
      fullName,
      phone: validation.cleaned,
      totalDebt: `${formatINR(debtAmount)} (Status: ${emiStatus})`,
      loanType,
      source: "hero-mini-form",
      facingHarassment: emiStatus !== "regular",
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
      setPhoneError(result.error || "Failed to submit case file. Please try again.");
    }
  };

  // Estimated waiver computation
  const estimatedWaiverPct = emiStatus === "overdue-6-plus" ? 68 : emiStatus === "overdue-3-6" ? 60 : 50;
  const estimatedSettlement = Math.round(debtAmount * (1 - estimatedWaiverPct / 100));
  const estimatedSavings = debtAmount - estimatedSettlement;

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
              Struggling with unmanageable personal loans or credit card debt? Our empanelled High
              Court advocates protect you from aggressive recovery agent intimidation and legally
              negotiate One-Time Settlements (OTS) to{" "}
              <strong className="text-slate-900 dark:text-white">reduce your debt burden by up to 50% - 70%</strong>{" "}
              with official bank No Dues Certificates (NDC).
            </p>

            {/* Dual CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href="#eligibility-form"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-base font-bold text-white bg-gradient-to-r from-primary-600 via-primary-700 to-blue-700 hover:from-primary-700 hover:to-blue-800 shadow-lg shadow-primary-600/30 hover:shadow-xl hover:shadow-primary-600/40 transition-all duration-200 group active:scale-95"
              >
                <Sparkles className="h-5 w-5 text-amber-300" />
                <span>Get Free Debt Evaluation</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-semibold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-all shadow-sm active:scale-95"
              >
                <MessageCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 fill-emerald-600/20" />
                <span>Talk to Legal Expert on WhatsApp</span>
              </a>
            </div>

            {/* Trust Bullet List */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Cease & Desist Notices in 24h</span>
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

          {/* Right Column: Interactive Quick Eligibility Form with Floating Animated Badges */}
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
              <span>Save ~{estimatedWaiverPct}% on Debt</span>
            </motion.div>

            {/* Outer decorative glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 via-primary-600 to-emerald-500 rounded-3xl blur-xl opacity-25 dark:opacity-35 -z-10 animate-pulseGlow" />

            {/* Main Interactive Eligibility Card */}
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
                        Estimated Settlement: <strong className="text-emerald-600 dark:text-emerald-400">{formatINR(estimatedSettlement)}</strong> (Saving {formatINR(estimatedSavings)}).
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Our Senior Advocate will contact you at <strong className="text-slate-900 dark:text-white">+91 {phone}</strong> shortly to halt recovery calls.
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
                  <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                    {/* 1. Loan Category */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        1. Loan Category
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-center">
                        {[
                          { id: "personal", label: "Personal" },
                          { id: "credit-card", label: "Cards" },
                          { id: "multiple", label: "Multiple" },
                          { id: "business", label: "Business" },
                        ].map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setLoanType(item.id)}
                            className={`py-2 px-1 rounded-lg text-xs font-semibold border transition-all ${
                              loanType === item.id
                                ? "border-primary-600 bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 dark:border-primary-500"
                                : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Total Debt Amount Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs">
                        <label className="font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 text-[11px]">
                          2. Total Unsecured Debt
                        </label>
                        <span className="font-extrabold text-primary-600 dark:text-primary-400 text-sm">
                          {formatINR(debtAmount)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={100000}
                        max={5000000}
                        step={50000}
                        value={debtAmount}
                        onChange={(e) => setDebtAmount(Number(e.target.value))}
                        className="w-full h-3.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary-600 my-1 py-1"
                      />
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>₹1 Lakh</span>
                        <span>₹25 Lakh</span>
                        <span>₹50 Lakh+</span>
                      </div>
                    </div>

                    {/* 3. Current EMI Status */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        3. Current EMI / Default Status
                      </label>
                      <select
                        value={emiStatus}
                        onChange={(e) => setEmiStatus(e.target.value)}
                        className="w-full px-3 py-2 text-base sm:text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                      >
                        <option value="overdue-1-3">1 - 3 Months Overdue</option>
                        <option value="overdue-3-6">3 - 6 Months Overdue (NPA Classification)</option>
                        <option value="overdue-6-plus">6+ Months Default (Heavy Recovery Calls)</option>
                        <option value="paying-stress">Paying EMIs with High Distress / Taking Fresh Loans</option>
                      </select>
                    </div>

                    {/* 4. Name & Phone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3 py-2.5 sm:py-2 text-base sm:text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        />
                      </div>
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
                            className={`w-full pl-9 pr-2.5 py-2.5 sm:py-2 text-base sm:text-xs rounded-xl border bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus-visible:outline-none focus-visible:ring-2 ${
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
                    </div>

                    {/* Live Savings Callout */}
                    <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-between text-xs">
                      <span className="text-emerald-800 dark:text-emerald-300 font-medium">
                        Estimated Settlement:
                      </span>
                      <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                        {formatINR(estimatedSettlement)} (~{estimatedWaiverPct}% Off)
                      </span>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-primary-600 via-primary-700 to-blue-700 hover:from-primary-700 hover:to-blue-800 shadow-md shadow-primary-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                      {loading ? (
                        <span>Analyzing Eligibility...</span>
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
                      <span>Attorney-client privilege. 100% confidential. No spam calls.</span>
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
                <AnimatedCounter target={70} prefix="Up to " suffix="%" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                Average Waiver Secured
              </div>
            </div>
            <div className="p-2.5 sm:p-3">
              <div className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                <AnimatedCounter target={100} suffix="%" />
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">
                Legal & RBI Compliant Advisory
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Case Initiated Modal with WhatsApp Connect */}
      <CaseInitiatedModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData((prev) => ({ ...prev, isOpen: false }))}
        referenceId={modalData.referenceId}
        clientName={fullName}
        phone={phone}
        whatsappUrl={modalData.whatsappUrl}
        totalDebt={formatINR(debtAmount)}
        category={loanType}
      />
    </section>
  );
}
