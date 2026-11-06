"use client";

import * as React from "react";
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  MessageSquare,
  Lock,
  AlertTriangle,
  Send,
  CheckCircle2,
  Sparkles,
  Scale,
  MessageCircle,
  Calendar,
  Video,
  FileText,
  UserCheck,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { submitLead, validateIndianPhone } from "@/lib/lead";
import { CaseInitiatedModal } from "@/components/forms/case-initiated-modal";

const BANK_OPTIONS = [
  "SBI",
  "HDFC",
  "ICICI",
  "Axis",
  "Kotak",
  "Bajaj",
  "IDFC",
  "IndusInd",
  "Credit Card/Loan Apps",
  "Other",
];

const OVERDUE_STATUSES = [
  "Not Overdue",
  "1–3 Months",
  "3–6 Months",
  "6+ Months",
];

const PROBLEM_TAGS = [
  "Harassment Calls",
  "Home Visits",
  "Legal Notice Received",
  "High EMI Burden",
];

const CALLBACK_WINDOWS = [
  "Morning 9–12",
  "Afternoon 12–5",
  "Anytime",
];

const CONSULTATION_MODES = [
  { id: "Phone Call", label: "Phone Call", icon: PhoneCall },
  { id: "WhatsApp Video", label: "WhatsApp Video", icon: MessageCircle },
  { id: "Google Meet", label: "Google Meet", icon: Video },
];

const TIME_SLOTS = [
  "10:00 AM – 11:00 AM",
  "11:30 AM – 12:30 PM",
  "2:00 PM – 3:00 PM",
  "3:30 PM – 4:30 PM",
];

// Helper to get upcoming weekdays
function getUpcomingWeekdays(count = 5): { dateStr: string; label: string; day: string }[] {
  const result = [];
  const current = new Date();
  while (result.length < count) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Mon to Fri
      const dateStr = current.toISOString().split("T")[0];
      const day = current.toLocaleDateString("en-IN", { weekday: "short" });
      const label = current.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
      result.push({ dateStr, label, day });
    }
  }
  return result;
}

export function ContactSplitLayout() {
  const [activeTab, setActiveTab] = React.useState<"evaluation" | "consultation">("evaluation");

  // Tab 1 State
  const [evalName, setEvalName] = React.useState("");
  const [evalPhone, setEvalPhone] = React.useState("");
  const [evalEmail, setEvalEmail] = React.useState("");
  const [evalCity, setEvalCity] = React.useState("");
  const [selectedBanks, setSelectedBanks] = React.useState<string[]>(["SBI"]);
  const [evalTotalDebt, setEvalTotalDebt] = React.useState("₹3L–₹7L");
  const [evalOverdue, setEvalOverdue] = React.useState("1–3 Months");
  const [selectedProblems, setSelectedProblems] = React.useState<string[]>(["Harassment Calls"]);
  const [evalCallbackTime, setEvalCallbackTime] = React.useState("Morning 9–12");
  const [evalConsent, setEvalConsent] = React.useState(true);

  // Tab 2 State
  const upcomingWeekdays = React.useMemo(() => getUpcomingWeekdays(5), []);
  const [bookName, setBookName] = React.useState("");
  const [bookPhone, setBookPhone] = React.useState("");
  const [bookEmail, setBookEmail] = React.useState("");
  const [bookMode, setBookMode] = React.useState("Phone Call");
  const [bookDate, setBookDate] = React.useState(upcomingWeekdays[0]?.dateStr || "");
  const [bookSlot, setBookSlot] = React.useState(TIME_SLOTS[0]);
  const [bookConsent, setBookConsent] = React.useState(true);

  // Honeypot
  const [honeypot, setHoneypot] = React.useState("");

  // Submission Status & Errors
  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">("idle");
  const [phoneError, setPhoneError] = React.useState<string | null>(null);
  const [consentError, setConsentError] = React.useState<string | null>(null);
  const [dateError, setDateError] = React.useState<string | null>(null);
  const [modalData, setModalData] = React.useState({
    isOpen: false,
    referenceId: "",
    whatsappUrl: "",
    submittedName: "",
    submittedPhone: "",
  });

  const handleDateChange = (dateVal: string) => {
    if (!dateVal) {
      setBookDate("");
      setDateError(null);
      return;
    }
    const parts = dateVal.split("-").map(Number);
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const dateObj = new Date(year, month - 1, day);
      const dayOfWeek = dateObj.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        setDateError("Advocate consultations are only held on weekdays (Monday to Friday). Please select a valid weekday.");
      } else {
        setDateError(null);
      }
    }
    setBookDate(dateVal);
  };

  const toggleBank = (bank: string) => {
    setSelectedBanks((prev) =>
      prev.includes(bank) ? prev.filter((b) => b !== bank) : [...prev, bank]
    );
  };

  const toggleProblem = (problem: string) => {
    setSelectedProblems((prev) =>
      prev.includes(problem) ? prev.filter((p) => p !== problem) : [...prev, problem]
    );
  };

  const handleTab1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    setConsentError(null);

    if (honeypot) {
      setStatus("success");
      return;
    }

    if (!evalConsent) {
      setConsentError("Please agree to receive case consultation updates.");
      return;
    }

    const validation = validateIndianPhone(evalPhone);
    if (!validation.isValid) {
      setPhoneError(validation.error || "Please enter a valid 10-digit mobile number");
      return;
    }

    setStatus("submitting");

    const result = await submitLead({
      fullName: evalName,
      phone: validation.cleaned,
      email: evalEmail,
      city: evalCity,
      totalDebt: evalTotalDebt,
      banks: selectedBanks.join(", "),
      loanType: `Case Eval (Overdue: ${evalOverdue})`,
      message: `Problems: ${selectedProblems.join(", ")} | Callback: ${evalCallbackTime}`,
      source: "contact-case-evaluation",
    });

    setStatus("success");

    if (result.success) {
      setModalData({
        isOpen: true,
        referenceId: result.referenceId,
        whatsappUrl: result.whatsappUrl,
        submittedName: evalName,
        submittedPhone: validation.cleaned,
      });
    } else {
      setPhoneError(result.error || "Failed to submit case file.");
    }
  };

  const handleTab2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    setConsentError(null);

    if (dateError) {
      return;
    }

    if (bookDate) {
      const parts = bookDate.split("-").map(Number);
      if (parts.length === 3) {
        const [year, month, day] = parts;
        const dateObj = new Date(year, month - 1, day);
        const dayOfWeek = dateObj.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          setDateError("Advocate consultations are only held on weekdays (Monday to Friday). Please select a valid weekday.");
          return;
        }
      }
    }

    if (honeypot) {
      setStatus("success");
      return;
    }

    if (!bookConsent) {
      setConsentError("Please agree to receive your consultation confirmation.");
      return;
    }

    const validation = validateIndianPhone(bookPhone);
    if (!validation.isValid) {
      setPhoneError(validation.error || "Please enter a valid 10-digit mobile number");
      return;
    }

    setStatus("submitting");

    const result = await submitLead({
      fullName: bookName,
      phone: validation.cleaned,
      email: bookEmail,
      loanType: `1-on-1 Consultation (${bookMode})`,
      message: `Scheduled Slot: ${bookDate} at ${bookSlot}`,
      source: "contact-book-consultation",
    });

    setStatus("success");

    if (result.success) {
      setModalData({
        isOpen: true,
        referenceId: result.referenceId,
        whatsappUrl: result.whatsappUrl,
        submittedName: bookName,
        submittedPhone: validation.cleaned,
      });
    } else {
      setPhoneError(result.error || "Failed to book consultation.");
    }
  };

  const directWhatsAppUrl = siteConfig.getWhatsAppUrl(
    "Hello Debt Support Expert, I need urgent legal assistance regarding recovery calls and loan settlement."
  );

  return (
    <div className="space-y-12">
      {/* Top Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4 mb-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
          <Scale className="h-4 w-4" />
          <span>Strict Attorney-Client Privilege Guaranteed</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
          Connect with Verified Debt Settlement Advocates
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
          Request a full case audit or schedule a 1-on-1 legal consultation. 100% confidential, zero data sharing, and all settlement funds are paid directly to your bank/NBFC.
        </p>
      </div>

      {/* Split Screen Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
        {/* Left Side: Verified Helplines, WhatsApp & Office Hours (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Emergency Harassment Helpline Badge */}
          <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-red-950/80 via-slate-900 to-slate-950 text-white border border-red-500/30 shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-red-500/10 blur-xl pointer-events-none" />

            <div className="space-y-3 relative z-10">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-[10px] font-bold border border-red-500/40">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Emergency Harassment Shield
                </span>
                <span className="text-[10px] text-red-300/80 font-medium">Priority Dispatch</span>
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span>Facing Unlawful Threats or Home Visits?</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Under the RBI Recovery Guidelines, collection agents cannot visit before 8 AM or after 7 PM, nor harass family or employers. Reach our emergency legal desk immediately.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${siteConfig.phoneTel}`}
                  id="contact-emergency-call-button"
                  className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-950 transition-all hover:scale-[1.02] active:scale-95 text-center"
                >
                  <PhoneCall className="h-4 w-4 fill-current shrink-0" />
                  <span>Emergency Hotline: {siteConfig.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Verified Business Contact Channels Card */}
          <div className="p-4 sm:p-7 rounded-3xl border border-border bg-card shadow-lg space-y-6">
            <h3 className="text-lg font-bold text-foreground">
              Official Client Channels
            </h3>

            <div className="space-y-5 text-sm">
              {/* National Helpline */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    National Helpline & WhatsApp
                  </div>
                  <a
                    href={`tel:${siteConfig.phoneTel}`}
                    id="contact-general-phone"
                    className="text-base font-extrabold text-foreground hover:text-primary-600 transition-colors"
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                  <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{siteConfig.operatingHours}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Direct Connect */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Instant WhatsApp Advisory
                  </div>
                  <a
                    href={directWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="contact-whatsapp-direct"
                    className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
                  >
                    <span>Message Case Desk (+91 79797 89458)</span>
                  </a>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Fast advocate response during IST working hours
                  </div>
                </div>
              </div>

              {/* Primary Email */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Primary Client Support
                  </div>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    id="contact-email"
                    className="text-sm font-bold text-foreground hover:text-primary-600 transition-colors"
                  >
                    {siteConfig.email}
                  </a>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Case files, loan notices, and document verification
                  </div>
                </div>
              </div>

              {/* Grievance Email */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Grievance & Escalation Desk
                  </div>
                  <a
                    href={`mailto:${siteConfig.emails.grievance}`}
                    className="text-sm font-bold text-foreground hover:text-primary-600 transition-colors"
                  >
                    {siteConfig.emails.grievance}
                  </a>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Dedicated escalation officer oversight
                  </div>
                </div>
              </div>

              {/* Office Location */}
              <div className="flex items-start gap-3.5 pt-3 border-t border-border">
                <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Headquarters & Legal Chambers
                  </div>
                  <div className="text-xs font-semibold text-foreground leading-relaxed mt-0.5">
                    {siteConfig.address.street}, {siteConfig.address.city}, {siteConfig.address.state} - {siteConfig.address.postalCode}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Pan-India Virtual Advocates across all 28 States & UTs
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statutory Direct Lender Disclaimer */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Lock className="h-4 w-4 text-emerald-500" />
              <span>Direct Lender Settlement Guarantee</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Debt Support Expert never collects settlement funds. 100% of agreed settlement amounts are paid directly by the borrower to their lending bank or NBFC via official branch or net-banking channels.
            </p>
          </div>
        </div>

        {/* Right Side: Modern Dual-Tab Form Card (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-4 sm:p-7 lg:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
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

            {/* Clean Tab Selector */}
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-muted/60 mb-6">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("evaluation");
                  setStatus("idle");
                }}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === "evaluation"
                    ? "bg-card text-foreground shadow-md border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <FileText className="h-4 w-4 text-primary" />
                <span>Case Evaluation</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab("consultation");
                  setStatus("idle");
                }}
                className={`py-3 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  activeTab === "consultation"
                    ? "bg-card text-foreground shadow-md border border-border"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Calendar className="h-4 w-4 text-emerald-500" />
                <span>Book 1-on-1 Call</span>
              </button>
            </div>

            {status === "success" ? (
              <div className="py-8 sm:py-10 text-center space-y-5">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div className="space-y-1.5">
                  {modalData.referenceId && (
                    <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      Official Case Ref #{modalData.referenceId}
                    </div>
                  )}
                  <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                    {activeTab === "evaluation"
                      ? "Case File Successfully Registered!"
                      : "Consultation Request Reserved!"}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-foreground">{modalData.submittedName}</span>. A senior advocate has been assigned to your case and will connect with you at{" "}
                    <span className="font-semibold text-foreground">+91 {modalData.submittedPhone}</span>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 space-y-1.5 max-w-md mx-auto text-left">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Next Immediate Step:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Keep your loan account details and any recent bank demand notices handy. Do not make unverified cash or third-party payments to recovery callers.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  {modalData.whatsappUrl && (
                    <a
                      href={modalData.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
                    >
                      <MessageCircle className="h-4 w-4" />
                      <span>Connect on WhatsApp (Ref #{modalData.referenceId})</span>
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 rounded-xl font-bold text-xs text-muted-foreground hover:text-foreground border border-border"
                  >
                    Submit Another Query
                  </button>
                </div>
              </div>
            ) : activeTab === "evaluation" ? (
              /* TAB 1: COMPLETE CASE EVALUATION */
              <form onSubmit={handleTab1Submit} className="space-y-4">
                <div className="space-y-1 pb-1">
                  <h3 className="text-lg font-extrabold text-foreground">
                    Comprehensive Case Evaluation
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Fill in your debt and lender profile for an exact OTS savings estimate and advocate assignment.
                  </p>
                </div>

                {/* Name & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Rathore"
                      value={evalName}
                      onChange={(e) => setEvalName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-base sm:text-xs focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                      10-Digit Mobile Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        required
                        placeholder="9876543210"
                        value={evalPhone}
                        onChange={(e) => {
                          setEvalPhone(e.target.value);
                          if (phoneError) setPhoneError(null);
                        }}
                        className={`w-full pl-11 pr-3 py-2.5 rounded-xl border bg-background text-foreground text-base sm:text-xs focus:ring-2 outline-none ${
                          phoneError ? "border-red-500 focus:ring-red-500" : "border-input focus:ring-primary"
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-[10px] text-red-500 font-semibold">{phoneError}</p>
                    )}
                  </div>
                </div>

                {/* Email & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="vikram@example.com"
                      value={evalEmail}
                      onChange={(e) => setEvalEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-base sm:text-xs focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                      City / State *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Mumbai, Maharashtra"
                      value={evalCity}
                      onChange={(e) => setEvalCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-base sm:text-xs focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                {/* Multi-Select Bank/NBFC Pills */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-foreground uppercase tracking-wider flex justify-between">
                    <span>Lending Banks / NBFCs (Select all that apply)</span>
                    <span className="text-primary text-[10px] lowercase font-normal">
                      {selectedBanks.length} selected
                    </span>
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {BANK_OPTIONS.map((bank) => {
                      const isSelected = selectedBanks.includes(bank);
                      return (
                        <button
                          key={bank}
                          type="button"
                          onClick={() => toggleBank(bank)}
                          className={`py-1 px-2.5 rounded-lg text-[11px] font-semibold border transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                              : "border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {isSelected ? `✓ ${bank}` : bank}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Total Outstanding Debt & Overdue Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                      Total Outstanding Debt *
                    </label>
                    <select
                      value={evalTotalDebt}
                      onChange={(e) => setEvalTotalDebt(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-base sm:text-xs focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="Below ₹1L">Below ₹1 Lakh</option>
                      <option value="₹1L–₹3L">₹1L – ₹3 Lakh</option>
                      <option value="₹3L–₹7L">₹3L – ₹7 Lakh</option>
                      <option value="₹7L–₹15L">₹7L – ₹15 Lakh</option>
                      <option value="₹15L+">₹15 Lakh+ (MSME / Multi-card)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                      Overdue Status *
                    </label>
                    <select
                      value={evalOverdue}
                      onChange={(e) => setEvalOverdue(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-base sm:text-xs focus:ring-2 focus:ring-primary outline-none"
                    >
                      {OVERDUE_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Current Problem Tags (Multi-select) */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                    Current Urgent Problem
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {PROBLEM_TAGS.map((tag) => {
                      const isSelected = selectedProblems.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleProblem(tag)}
                          className={`py-2 px-2 rounded-xl text-[10px] sm:text-[11px] font-semibold border text-center transition-all ${
                            isSelected
                              ? "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold"
                              : "border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          {isSelected ? `✓ ${tag}` : tag}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preferred Callback Time */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                    Preferred Callback Window
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CALLBACK_WINDOWS.map((win) => (
                      <button
                        key={win}
                        type="button"
                        onClick={() => setEvalCallbackTime(win)}
                        className={`py-2 px-2 rounded-xl text-[11px] font-semibold border text-center transition-all ${
                          evalCallbackTime === win
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                            : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {win}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Privacy Consent Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer text-[11px] text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={evalConsent}
                      onChange={(e) => {
                        setEvalConsent(e.target.checked);
                        if (e.target.checked) setConsentError(null);
                      }}
                      className="mt-0.5 rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span>
                      I authorize Debt Support Expert advocates to review my file and contact me regarding debt resolution.
                    </span>
                  </label>
                  {consentError && (
                    <p className="text-[10px] text-red-500 font-semibold pt-0.5">{consentError}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-primary-600 via-primary-700 to-blue-700 hover:from-primary-700 hover:to-blue-800 shadow-lg shadow-primary-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {status === "submitting" ? (
                    <span>Initiating Official Case File...</span>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4 text-amber-300" />
                      <span>Submit Case for Legal Evaluation</span>
                      <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-1">
                  <Lock className="h-3 w-3 text-emerald-500" />
                  <span>Strict Confidentiality • No Data Sharing • Direct Lender Settlement</span>
                </div>
              </form>
            ) : (
              /* TAB 2: BOOK 1-ON-1 CONSULTATION CALL/MEET */
              <form onSubmit={handleTab2Submit} className="space-y-4">
                <div className="space-y-1 pb-1">
                  <h3 className="text-lg font-extrabold text-foreground">
                    Book 1-on-1 Legal Consultation
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Schedule a private advisory session with a senior advocate (Monday to Friday, 9 AM – 5 PM IST).
                  </p>
                </div>

                {/* Name & Mobile */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={bookName}
                      onChange={(e) => setBookName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-base sm:text-xs focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                      10-Digit Mobile Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                        +91
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        required
                        placeholder="9876543210"
                        value={bookPhone}
                        onChange={(e) => {
                          setBookPhone(e.target.value);
                          if (phoneError) setPhoneError(null);
                        }}
                        className={`w-full pl-11 pr-3 py-2.5 rounded-xl border bg-background text-foreground text-base sm:text-xs focus:ring-2 outline-none ${
                          phoneError ? "border-red-500 focus:ring-red-500" : "border-input focus:ring-primary"
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-[10px] text-red-500 font-semibold">{phoneError}</p>
                    )}
                  </div>
                </div>

                {/* Optional Email for Calendar Invite */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                    Email Address (For Calendar Invite & Meeting Link)
                  </label>
                  <input
                    type="email"
                    placeholder="ananya@example.com"
                    value={bookEmail}
                    onChange={(e) => setBookEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-base sm:text-xs focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                {/* Consultation Mode */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                    Preferred Consultation Mode *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {CONSULTATION_MODES.map((item) => {
                      const Icon = item.icon;
                      const isSelected = bookMode === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setBookMode(item.id)}
                          className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                            isSelected
                              ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                              : "border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <Icon className={`h-4 w-4 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                          <span className="text-[11px]">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Weekday Date Picker (Next 5 Weekdays + Date Input) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                      Select Consultation Date (Mon–Fri) *
                    </label>
                    <span className="text-[10px] text-muted-foreground">Weekdays Only</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                    <div className="sm:col-span-4">
                      <input
                        type="date"
                        name="consultationDate"
                        aria-label="Consultation Date"
                        value={bookDate}
                        onChange={(e) => handleDateChange(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border text-xs bg-background text-foreground focus:ring-2 outline-none ${
                          dateError ? "border-red-500 focus:ring-red-500" : "border-input focus:ring-primary"
                        }`}
                      />
                    </div>
                    <div className="sm:col-span-8 grid grid-cols-5 gap-1.5 text-center">
                      {upcomingWeekdays.map((item) => (
                        <button
                          key={item.dateStr}
                          type="button"
                          onClick={() => handleDateChange(item.dateStr)}
                          className={`py-2 px-1 rounded-xl border transition-all ${
                            bookDate === item.dateStr && !dateError
                              ? "border-primary bg-primary text-primary-foreground font-bold shadow-sm"
                              : "border-border text-muted-foreground hover:bg-muted"
                          }`}
                        >
                          <span className="block text-[10px] uppercase font-semibold opacity-80">{item.day}</span>
                          <span className="block text-xs font-bold">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {dateError && (
                    <p data-testid="date-error" className="text-[11px] text-red-500 font-semibold pt-0.5">
                      {dateError}
                    </p>
                  )}
                </div>

                {/* Time Slot */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                    Select Time Slot (IST) *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIME_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookSlot(slot)}
                        className={`py-2.5 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                          bookSlot === slot
                            ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                            : "border-border text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Privacy Consent Checkbox */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 cursor-pointer text-[11px] text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={bookConsent}
                      onChange={(e) => {
                        setBookConsent(e.target.checked);
                        if (e.target.checked) setConsentError(null);
                      }}
                      className="mt-0.5 rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                    />
                    <span>
                      I confirm this slot reservation and agree to receive joining details via WhatsApp/SMS.
                    </span>
                  </label>
                  {consentError && (
                    <p className="text-[10px] text-red-500 font-semibold pt-0.5">{consentError}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={status === "submitting" || Boolean(dateError)}
                  className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-lg shadow-emerald-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {status === "submitting" ? (
                    <span>Securing Advocate Slot...</span>
                  ) : (
                    <>
                      <UserCheck className="h-4 w-4 text-amber-300" />
                      <span>Confirm 1-on-1 Consultation Call</span>
                      <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-1">
                  <Lock className="h-3 w-3 text-emerald-500" />
                  <span>Confidential Advocate Session • No Advance Consultation Charges</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Case Initiated Modal with WhatsApp Connect */}
      <CaseInitiatedModal
        isOpen={modalData.isOpen}
        onClose={() => setModalData((prev) => ({ ...prev, isOpen: false }))}
        referenceId={modalData.referenceId}
        clientName={modalData.submittedName}
        phone={modalData.submittedPhone}
        whatsappUrl={modalData.whatsappUrl}
        city={evalCity}
        totalDebt={evalTotalDebt}
        category={activeTab === "evaluation" ? "Case Evaluation" : "1-on-1 Consultation"}
      />
    </div>
  );
}
