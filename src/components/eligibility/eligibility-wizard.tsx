"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CreditCard,
  Scale,
  Building2,
  Smartphone,
  AlertTriangle,
  FileText,
  Lock,
  MessageCircle,
  PhoneCall,
  RotateCcw,
  Clock,
  Award,
  ChevronRight,
} from "lucide-react";
import { submitLead, validateIndianPhone } from "@/lib/lead";
import { formatINR } from "@/lib/utils";
import { siteConfig } from "@/config/site";

// Step 1: Debt Type
const DEBT_TYPES = [
  { id: "Personal Loan", title: "Personal Loan", desc: "Unsecured bank or NBFC personal loan", icon: Scale },
  { id: "Credit Card", title: "Credit Card", desc: "Revolving credit cards with high APR interest", icon: CreditCard },
  { id: "Digital Loan Apps", title: "Digital Loan Apps", desc: "Instant mobile apps & fintech credit lines", icon: Smartphone },
  { id: "Multiple Loans/Cards", title: "Multiple Loans & Cards", desc: "Combined distress across multiple lenders", icon: Building2 },
];

// Step 2: Total Outstanding
const DEBT_TIERS = [
  { id: "Below ₹1L", label: "Below ₹1 Lakh", minEst: 35000, maxEst: 50000, savingsEst: 50000 },
  { id: "₹1L–₹3L", label: "₹1L – ₹3 Lakh", minEst: 70000, maxEst: 130000, savingsEst: 140000 },
  { id: "₹3L–₹7L", label: "₹3L – ₹7 Lakh", minEst: 160000, maxEst: 280000, savingsEst: 300000 },
  { id: "₹7L–₹15L", label: "₹7L – ₹15 Lakh", minEst: 350000, maxEst: 600000, savingsEst: 650000 },
  { id: "₹15L+", label: "₹15 Lakh+ (MSME / Multi)", minEst: 750000, maxEst: 1200000, savingsEst: 1300000 },
];

// Step 3: Lenders
const LENDERS = [
  "SBI",
  "HDFC",
  "ICICI",
  "Axis",
  "Kotak",
  "Bajaj",
  "IDFC First",
  "IndusInd",
  "RBL",
  "Yes Bank",
  "Loan Apps",
  "Other",
];

// Step 4: Overdue Status
const OVERDUE_STATUSES = [
  { id: "Not Overdue Yet", label: "Not Overdue Yet", sub: "Currently paying EMIs with difficulty" },
  { id: "1–3 Months", label: "1 – 3 Months Overdue", sub: "Missed 1-3 payments, calls started" },
  { id: "3–6 Months", label: "3 – 6 Months (NPA)", sub: "Account marked NPA, legal notices" },
  { id: "6+ Months NPA", label: "6+ Months NPA", sub: "Written off or assigned to recovery agency" },
];

// Step 5: Biggest Worry
const BIGGEST_WORRIES = [
  { id: "Recovery Calls / Home Visits", label: "Abusive Recovery Calls & Home Visits", icon: AlertTriangle },
  { id: "Received Legal / Sec 138 Notice", label: "Received Legal / Sec 138 / Arbitration Notice", icon: FileText },
  { id: "CIBIL Score Impact", label: "Credit Score Damage & Blacklisting", icon: Sparkles },
  { id: "High EMI Burden", label: "Unmanageable EMI vs Income Deficit", icon: CreditCard },
];

// Step 6: Settlement Readiness
const READINESS_OPTIONS = [
  { id: "Can arrange lump sum", label: "Can arrange one-time lump sum within 30 days", badge: "Max Waiver" },
  { id: "Need 3-month split", label: "Need 2 to 3 monthly installments to pay", badge: "Most Popular" },
  { id: "Cannot pay anything right now", label: "Cannot pay right now, need harassment stopped first", badge: "Immediate Shield" },
];

export function EligibilityWizard() {
  const [step, setStep] = React.useState(1);

  // Form selections
  const [debtType, setDebtType] = React.useState("Personal Loan");
  const [totalDebt, setTotalDebt] = React.useState("₹3L–₹7L");
  const [selectedLenders, setSelectedLenders] = React.useState<string[]>(["SBI", "HDFC"]);
  const [overdueStatus, setOverdueStatus] = React.useState("3–6 Months");
  const [biggestWorry, setBiggestWorry] = React.useState("Recovery Calls / Home Visits");
  const [readiness, setReadiness] = React.useState("Need 3-month split");

  // Step 7 Contact Info (optional preview)
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [city, setCity] = React.useState("");
  const [consent, setConsent] = React.useState(true);
  const [phoneError, setPhoneError] = React.useState<string | null>(null);

  // Submission State
  const [previewUnlocked, setPreviewUnlocked] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [caseSubmitted, setCaseSubmitted] = React.useState(false);
  const [referenceId, setReferenceId] = React.useState("");
  const [whatsappUrl, setWhatsappUrl] = React.useState("");

  const toggleLender = (lender: string) => {
    setSelectedLenders((prev) =>
      prev.includes(lender) ? prev.filter((l) => l !== lender) : [...prev, lender]
    );
  };

  // Determine personalized legal strategy recommendation
  const recommendation = React.useMemo(() => {
    const activeTier = DEBT_TIERS.find((t) => t.id === totalDebt) || DEBT_TIERS[2];

    if (biggestWorry === "Received Legal / Sec 138 Notice") {
      return {
        strategyTitle: "Legal Notice Defense & Lok Adalat Conciliation Priority",
        badge: "Urgent Legal Response",
        badgeColor: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300",
        summary:
          "Because you have received a formal Section 138 (Cheque Bounce), Section 25 (NACH), or Arbitration notice, our empanelled advocates must issue a statutory reply within the 15-day window to prevent ex-parte court proceedings or bailable warrants.",
        keyAction: "Our advocate will draft your legal reply and petition for formal Lok Adalat conciliation.",
        estSettlement: `Approx. ${formatINR(activeTier.minEst)} – ${formatINR(activeTier.maxEst)}`,
        estSavings: `Save up to ${formatINR(activeTier.savingsEst)}`,
        urgency: "High — Reply within 15 Days",
      };
    }

    if (overdueStatus === "6+ Months NPA" || overdueStatus === "3–6 Months") {
      return {
        strategyTitle: "One-Time Settlement (OTS) Maximum Waiver Eligible",
        badge: "High Settlement Probability",
        badgeColor: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300",
        summary:
          "Your account qualifies under RBI Compromise Settlement norms. Because the debt has entered NPA / recovery status, banks are legally mandated to consider hardship waivers of accumulated penal interest, bounce charges, and up to 50–70% of the claim amount.",
        keyAction: "Empanelled advocates initiate direct negotiations with bank zonal settlement committees.",
        estSettlement: `Approx. ${formatINR(activeTier.minEst)} – ${formatINR(activeTier.maxEst)}`,
        estSavings: `Direct Savings: ~${formatINR(activeTier.savingsEst)}`,
        urgency: "Recommended Action: Initiate OTS Proposal",
      };
    }

    if (biggestWorry === "Recovery Calls / Home Visits") {
      return {
        strategyTitle: "Immediate Anti-Harassment Legal Shield Active",
        badge: "RBI Code Protection",
        badgeColor: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300",
        summary:
          "Collection agent harassment, abusive language, doorstep visits outside 8 AM – 7 PM, and calls to family violate the RBI August 2022 Circular. Debt Support Expert issues formal legal notices of representation to bank grievance heads to halt third-party interference.",
        keyAction: "Immediate cease & desist notice issued to lender collection desks.",
        estSettlement: `Target OTS: ${formatINR(activeTier.minEst)} – ${formatINR(activeTier.maxEst)}`,
        estSavings: `Potential Savings: ${formatINR(activeTier.savingsEst)}`,
        urgency: "Immediate Protection within 24 Hours",
      };
    }

    // Default: Proactive Restructuring
    return {
      strategyTitle: "Proactive Debt Restructuring & Moratorium Advisory",
      badge: "Credit Protection Advisory",
      badgeColor: "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-300",
      summary:
        "Since your account is not yet deep into NPA, we help table a formal restructuring or structured settlement roadmap to freeze compounding interest before severe credit score damage occurs.",
      keyAction: "Structured settlement proposal or EMI consolidation strategy.",
      estSettlement: `Target Compromise: ${formatINR(activeTier.minEst)} – ${formatINR(activeTier.maxEst)}`,
      estSavings: `Save on future compounding APR: ${formatINR(activeTier.savingsEst)}`,
      urgency: "Proactive Step",
    };
  }, [totalDebt, overdueStatus, biggestWorry]);

  const handleSubmitLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    const validation = validateIndianPhone(phone);
    if (!validation.isValid) {
      setPhoneError(validation.error || "Please enter a valid 10-digit mobile number");
      return;
    }

    setIsSubmitting(true);

    const result = await submitLead({
      fullName: fullName.trim() || "Borrower",
      phone: validation.cleaned,
      city: city.trim() || "India",
      loanType: debtType,
      totalDebt,
      banks: selectedLenders.join(", "),
      message: `Overdue: ${overdueStatus} | Biggest Worry: ${biggestWorry} | Readiness: ${readiness} | Rec: ${recommendation.strategyTitle}`,
      source: "eligibility-wizard-60sec",
    });

    setIsSubmitting(false);

    if (result.success) {
      setReferenceId(result.referenceId);
      setWhatsappUrl(result.whatsappUrl);
      setCaseSubmitted(true);
      setPreviewUnlocked(true);
    } else {
      setPhoneError(result.error || "Failed to submit assessment.");
    }
  };

  const directWhatsAppUrl = siteConfig.getWhatsAppUrl(
    `Hello Debt Support Expert, I completed your 60-Second Eligibility Assessment:\n` +
      `• Debt: ${debtType} (${totalDebt})\n` +
      `• Lenders: ${selectedLenders.join(", ")}\n` +
      `• Overdue: ${overdueStatus}\n` +
      `• Worry: ${biggestWorry}\n` +
      `• Strategy: ${recommendation.strategyTitle}\n` +
      `Please connect me with an advocate to review this strategy.`
  );

  return (
    <div className="max-w-3xl mx-auto">
      {/* Wizard Header Progress */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
          <span className="flex items-center gap-1.5 text-primary">
            <Clock className="h-3.5 w-3.5 text-primary" />
            <span>60-Second Confidential Evaluation</span>
          </span>
          <span>Step {step} of 7</span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary-600 via-primary-500 to-emerald-500"
            initial={{ width: "14%" }}
            animate={{ width: `${(step / 7) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Main Wizard Card */}
      <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        <AnimatePresence mode="wait">
          {/* STEP 1: DEBT TYPE */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Question 1 of 6
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  What type of debt are you looking to resolve?
                </h2>
                <p className="text-xs text-muted-foreground">
                  Select your primary borrowing category to calibrate the legal framework.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {DEBT_TYPES.map((item) => {
                  const Icon = item.icon;
                  const isSelected = debtType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDebtType(item.id)}
                      className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary shadow-md ring-2 ring-primary/30"
                          : "border-border bg-card hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-sm font-bold text-foreground">{item.title}</div>
                        <div className="text-[11px] text-muted-foreground leading-snug">{item.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/25"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: TOTAL OUTSTANDING */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Question 2 of 6
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  What is your approximate total outstanding debt?
                </h2>
                <p className="text-xs text-muted-foreground">
                  Include all personal loans, cards, or credit lines combined.
                </p>
              </div>

              <div className="space-y-2.5">
                {DEBT_TIERS.map((tier) => {
                  const isSelected = totalDebt === tier.id;
                  return (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setTotalDebt(tier.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary shadow-md ring-2 ring-primary/30"
                          : "border-border bg-card hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <div className="font-bold text-sm text-foreground">{tier.label}</div>
                      <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                        Avg. Savings ~{formatINR(tier.savingsEst)}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/25"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: LENDERS */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Question 3 of 6
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  Which banks or lenders do you owe?
                </h2>
                <p className="text-xs text-muted-foreground">
                  Select all institutions that apply to your current loans or credit cards.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {LENDERS.map((lender) => {
                  const isSelected = selectedLenders.includes(lender);
                  return (
                    <button
                      key={lender}
                      type="button"
                      onClick={() => toggleLender(lender)}
                      className={`py-2.5 px-4 rounded-xl text-xs font-bold border transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground shadow-sm"
                          : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {isSelected ? `✓ ${lender}` : lender}
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/25"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: OVERDUE STATUS */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Question 4 of 6
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  What is the current overdue status of your payments?
                </h2>
                <p className="text-xs text-muted-foreground">
                  The duration of default directly determines the settlement percentage banks can offer.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OVERDUE_STATUSES.map((item) => {
                  const isSelected = overdueStatus === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setOverdueStatus(item.id)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary shadow-md ring-2 ring-primary/30"
                          : "border-border bg-card hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <div className="text-sm font-bold text-foreground">{item.label}</div>
                      <div className="text-[11px] text-muted-foreground mt-0.5">{item.sub}</div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/25"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 5: BIGGEST WORRY */}
          {step === 5 && (
            <motion.div
              key="step5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Question 5 of 6
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  What is your most pressing concern right now?
                </h2>
                <p className="text-xs text-muted-foreground">
                  This tells our advocates whether you need an emergency anti-harassment shield, notice reply, or debt compromise.
                </p>
              </div>

              <div className="space-y-2.5">
                {BIGGEST_WORRIES.map((item) => {
                  const Icon = item.icon;
                  const isSelected = biggestWorry === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setBiggestWorry(item.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center gap-3.5 ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary shadow-md ring-2 ring-primary/30"
                          : "border-border bg-card hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-foreground">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(6)}
                  className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-primary hover:bg-primary/90 transition-all flex items-center gap-2 shadow-md shadow-primary/25"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: SETTLEMENT READINESS */}
          {step === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                  Question 6 of 6
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                  How soon could you arrange funds for an approved compromise?
                </h2>
                <p className="text-xs text-muted-foreground">
                  Remember: 100% of settlement funds are paid directly to your bank account, never to us.
                </p>
              </div>

              <div className="space-y-3">
                {READINESS_OPTIONS.map((item) => {
                  const isSelected = readiness === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setReadiness(item.id)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary shadow-md ring-2 ring-primary/30"
                          : "border-border bg-card hover:bg-muted/50 text-foreground"
                      }`}
                    >
                      <div className="text-xs sm:text-sm font-bold text-foreground">{item.label}</div>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-primary-100 text-primary-800 dark:bg-primary-950 dark:text-primary-300">
                        {item.badge}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(5)}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(7)}
                  className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/25"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>View My Legal Strategy</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 7: PERSONALIZED RECOMMENDATION CARD */}
          {step === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6"
            >
              {/* Recommendation Header */}
              <div className="space-y-2 text-center pb-2 border-b border-border">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border shadow-sm">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  <span>Tailored Legal Assessment Results</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {recommendation.strategyTitle}
                </h2>
                <div className="flex items-center justify-center gap-2">
                  <span className={`text-[11px] font-bold px-3 py-0.5 rounded-full border ${recommendation.badgeColor}`}>
                    {recommendation.badge}
                  </span>
                </div>
              </div>

              {/* Assessment Summary Bento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-muted/50 border border-border space-y-1">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">Estimated Target Payout</span>
                  <div className="text-lg font-extrabold text-foreground">{recommendation.estSettlement}</div>
                  <div className="text-[10px] text-muted-foreground">Original claim: {totalDebt} ({debtType})</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 uppercase">Estimated Concession</span>
                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">{recommendation.estSavings}</div>
                  <div className="text-[10px] text-emerald-700/80 dark:text-emerald-300/80">Waiver of penalties & interest</div>
                </div>
              </div>

              {/* Strategy Details */}
              <div className="p-4 rounded-2xl border border-border bg-card space-y-2 text-xs">
                <div className="font-bold text-foreground flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>Recommended Legal Action:</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {recommendation.summary}
                </p>
                <div className="p-2.5 rounded-xl bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 text-[11px] text-primary-900 dark:text-primary-300 font-semibold">
                  Key Action: {recommendation.keyAction}
                </div>
              </div>

              {/* Dual Path: Preview Unlocked OR Save Case File */}
              {!previewUnlocked && !caseSubmitted ? (
                <div className="space-y-4 pt-2">
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-bold text-foreground">
                      Save Your Official Case File (Ref #DSE)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Connect with an assigned advocate handling {selectedLenders.slice(0, 2).join(" & ")}.
                    </p>
                  </div>

                  <form onSubmit={handleSubmitLead} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          required
                          placeholder="Your Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-base sm:text-xs focus:ring-2 focus:ring-primary outline-none"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                          +91
                        </span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          required
                          placeholder="10-Digit Mobile"
                          value={phone}
                          onChange={(e) => {
                            setPhone(e.target.value);
                            if (phoneError) setPhoneError(null);
                          }}
                          className={`w-full pl-11 pr-3 py-2.5 rounded-xl border bg-background text-foreground text-base sm:text-xs focus:ring-2 outline-none ${
                            phoneError ? "border-red-500 focus:ring-red-500" : "border-input focus:ring-primary"
                          }`}
                        />
                      </div>
                    </div>
                    {phoneError && (
                      <p className="text-[10px] text-red-500 font-semibold">{phoneError}</p>
                    )}

                    <div>
                      <input
                        type="text"
                        placeholder="City / State (e.g. Mumbai, Delhi)"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-base sm:text-xs focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>

                    <label className="flex items-start gap-2 cursor-pointer text-[11px] text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                      />
                      <span>
                        I consent to Debt Support Expert contacting me regarding my assessment.
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-primary-600 via-primary-700 to-blue-700 hover:from-primary-700 hover:to-blue-800 shadow-md shadow-primary-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span>Generating Case File...</span>
                      ) : (
                        <>
                          <ShieldCheck className="h-4 w-4 text-amber-300" />
                          <span>Generate Case File & Assign Senior Advocate</span>
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>

                  {/* No-Gate Preview Button (Trust Builder) */}
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setPreviewUnlocked(true)}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground underline underline-offset-4"
                    >
                      Skip registration & preview full legal guidance immediately →
                    </button>
                  </div>
                </div>
              ) : (
                /* Unlocked / Submitted View */
                <div className="space-y-4 pt-2">
                  {referenceId && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center space-y-1">
                      <div className="inline-block px-3 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs font-mono font-bold">
                        Case File Ref #{referenceId}
                      </div>
                      <p className="text-xs text-emerald-800 dark:text-emerald-300">
                        File successfully registered. An advocate handling {selectedLenders.slice(0, 2).join(" & ")} has been assigned.
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={whatsappUrl || directWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-950/40 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Connect with Advocate on WhatsApp</span>
                    </a>

                    <Link
                      href="/contact"
                      className="py-3.5 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-foreground bg-muted hover:bg-muted/80 border border-border transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Book Consultation</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setPreviewUnlocked(false);
                        setCaseSubmitted(false);
                      }}
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Retake Assessment with Different Portfolio</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Statutory Direct Bank Settlement Note */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground pt-2 border-t border-border">
                <Lock className="h-3 w-3 text-emerald-500" />
                <span>Zero Advance Fees · 100% Direct Bank Settlement · RBI Fair Practice Code</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
