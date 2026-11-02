"use client";

import * as React from "react";
import {
  ShieldCheck,
  Send,
  Lock,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Sparkles,
  Clock,
  MessageCircle,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { submitLead, validateIndianPhone } from "@/lib/lead";
import { CaseInitiatedModal } from "@/components/forms/case-initiated-modal";

interface ServiceSidebarProps {
  serviceName: string;
  defaultLoanType?: string;
  customWhatsAppMessage?: string;
}

const ISSUE_PILLS = [
  { id: "Personal Loan", label: "Personal Loan" },
  { id: "Credit Card", label: "Credit Card" },
  { id: "Recovery Harassment", label: "Recovery Harassment" },
  { id: "Legal Notice / Sec 138", label: "Legal Notice / Sec 138" },
  { id: "Multiple Loans", label: "Multiple Loans" },
];

const DEBT_TIERS = [
  { id: "Below ₹1L", label: "< ₹1L" },
  { id: "₹1L–₹3L", label: "1L–3L" },
  { id: "₹3L–₹7L", label: "3L–7L" },
  { id: "₹7L–₹15L", label: "7L–15L" },
  { id: "₹15L+", label: "15L+" },
];

export function ServiceSidebar({
  serviceName,
  defaultLoanType = "personal-loan",
  customWhatsAppMessage,
}: ServiceSidebarProps) {
  // Determine default issue from serviceName
  const getInitialIssue = () => {
    const s = serviceName.toLowerCase();
    if (s.includes("credit card")) return "Credit Card";
    if (s.includes("harassment")) return "Recovery Harassment";
    if (s.includes("notice") || s.includes("138")) return "Legal Notice / Sec 138";
    if (s.includes("multiple") || s.includes("restructuring")) return "Multiple Loans";
    return "Personal Loan";
  };

  const [selectedIssue, setSelectedIssue] = React.useState(getInitialIssue());
  const [selectedDebtTier, setSelectedDebtTier] = React.useState("₹3L–₹7L");
  const [fullName, setFullName] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [city, setCity] = React.useState("");
  const [consent, setConsent] = React.useState(true);
  const [honeypot, setHoneypot] = React.useState("");

  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">("idle");
  const [phoneError, setPhoneError] = React.useState<string | null>(null);
  const [consentError, setConsentError] = React.useState<string | null>(null);
  const [modalData, setModalData] = React.useState({
    isOpen: false,
    referenceId: "",
    whatsappUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    setConsentError(null);

    // Bot detection check
    if (honeypot) {
      setStatus("success");
      return;
    }

    if (!consent) {
      setConsentError("Please agree to let us contact you regarding your enquiry.");
      return;
    }

    const validation = validateIndianPhone(phone);
    if (!validation.isValid) {
      setPhoneError(validation.error || "Please enter a valid 10-digit mobile number");
      return;
    }

    setStatus("submitting");

    const result = await submitLead({
      fullName,
      phone: validation.cleaned,
      city,
      loanType: selectedIssue,
      totalDebt: selectedDebtTier,
      source: `service-sidebar: ${serviceName}`,
    });

    setStatus("success");

    if (result.success) {
      setModalData({
        isOpen: true,
        referenceId: result.referenceId,
        whatsappUrl: result.whatsappUrl,
      });
    } else {
      setPhoneError(result.error || "Failed to submit case file.");
    }
  };

  const whatsappText = encodeURIComponent(
    customWhatsAppMessage ||
      `Hello Debt Support Expert, I need urgent legal assistance regarding ${serviceName}. Please connect me with a senior advocate.`
  );

  return (
    <aside className="space-y-6 sticky top-24">
      {/* 1. Quick Callback Request Form */}
      <div className="rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="space-y-2 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-[11px] font-semibold">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Attorney-Client Privilege</span>
          </div>

          <h3 className="text-xl font-extrabold text-foreground tracking-tight">
            Quick Callback Request
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Get an instant case evaluation for <strong className="text-foreground font-semibold">{serviceName}</strong>. Our advocates respond within 30-45 minutes.
          </p>
        </div>

        {status === "success" ? (
          <div className="py-6 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1.5">
              {modalData.referenceId && (
                <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                  Case Ref #{modalData.referenceId}
                </div>
              )}
              <h4 className="text-lg font-bold text-foreground">
                Callback Confirmed!
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Thank you, <span className="font-semibold text-foreground">{fullName}</span>. An advocate handling {serviceName} will call you at{" "}
                <span className="font-semibold text-foreground">+91 {phone}</span> shortly.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-300 text-left space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Next Immediate Step:</span>
              </div>
              <p>
                Keep any bank legal notices or loan sanction letters ready. All settlement payments are made directly to your bank/NBFC.
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {modalData.whatsappUrl && (
                <a
                  href={modalData.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-all active:scale-95"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Connect on WhatsApp (Ref #{modalData.referenceId})</span>
                </a>
              )}
              <a
                href={`tel:${siteConfig.phoneTel}`}
                id="sidebar-call-now-button"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 shadow-sm"
              >
                <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
                <span>Urgent Case? Call Now</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
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

            {/* 1. Issue Pills */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                1. Issue / Debt Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ISSUE_PILLS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedIssue(item.id)}
                    className={`py-1 px-2.5 rounded-lg text-[11px] font-semibold border transition-all ${
                      selectedIssue === item.id
                        ? "border-primary bg-primary/10 text-primary font-bold shadow-sm"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Debt Amount Tiers */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="text-[11px] font-bold text-foreground uppercase tracking-wider">
                  2. Outstanding Debt
                </label>
                <span className="font-extrabold text-primary text-xs">
                  {selectedDebtTier}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1 text-center">
                {DEBT_TIERS.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedDebtTier(tier.id)}
                    className={`py-1.5 px-0.5 rounded-lg text-[10px] font-bold border transition-all ${
                      selectedDebtTier === tier.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Full Name */}
            <div className="space-y-1">
              <label
                className="text-[11px] font-bold text-foreground uppercase tracking-wider"
                htmlFor="sidebar-fullname"
              >
                Full Legal Name *
              </label>
              <input
                id="sidebar-fullname"
                type="text"
                required
                placeholder="e.g. Rajesh Kumar"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-base sm:text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            {/* 4. Mobile Number */}
            <div className="space-y-1">
              <label
                className="text-[11px] font-bold text-foreground uppercase tracking-wider"
                htmlFor="sidebar-phone"
              >
                10-Digit Mobile (WhatsApp Enabled) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                  +91
                </span>
                <input
                  id="sidebar-phone"
                  type="tel"
                  inputMode="numeric"
                  required
                  placeholder="9876543210"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (phoneError) setPhoneError(null);
                  }}
                  className={`w-full pl-11 pr-3 py-2.5 rounded-xl border bg-background text-foreground text-base sm:text-xs focus-visible:outline-none focus-visible:ring-2 ${
                    phoneError
                      ? "border-red-500 focus-visible:ring-red-500"
                      : "border-input focus-visible:ring-primary"
                  }`}
                />
              </div>
              {phoneError && (
                <p className="text-[10px] text-red-500 font-semibold pt-0.5">
                  {phoneError}
                </p>
              )}
            </div>

            {/* 5. City */}
            <div className="space-y-1">
              <label
                className="text-[11px] font-bold text-foreground uppercase tracking-wider"
                htmlFor="sidebar-city"
              >
                City / Location *
              </label>
              <input
                id="sidebar-city"
                type="text"
                required
                placeholder="e.g. Mumbai, Delhi, Bengaluru"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-base sm:text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            {/* 6. Consent Checkbox */}
            <div className="pt-0.5">
              <label className="flex items-start gap-2 cursor-pointer text-[11px] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (e.target.checked) setConsentError(null);
                  }}
                  className="mt-0.5 rounded border-input text-primary focus:ring-primary h-3.5 w-3.5"
                />
                <span>
                  I agree to receive case consultation updates from Debt Support Expert via call/WhatsApp.
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
              id="sidebar-submit-button"
              disabled={status === "submitting"}
              className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-primary-600 via-primary-700 to-blue-700 hover:from-primary-700 hover:to-blue-800 shadow-md shadow-primary-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {status === "submitting" ? (
                <span>Routing to Senior Advocate...</span>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4 text-amber-300" />
                  <span>Request Legal Callback</span>
                  <Send className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground pt-1">
              <Lock className="h-3 w-3 text-emerald-500" />
              <span>Attorney-client privilege · Direct bank settlement</span>
            </div>
          </form>
        )}
      </div>

      {/* 2. WhatsApp Helpline Card */}
      <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 p-4 sm:p-6 text-white shadow-xl relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold border border-emerald-500/30">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Legal Desk Online
            </span>
            <span className="text-[10px] text-emerald-200/70 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Response &lt; 15 mins
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-lg font-extrabold text-white">
              Emergency WhatsApp Helpline
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Facing abusive calls right now? Message our High Court advocates directly on WhatsApp for immediate legal guidance.
            </p>
          </div>

          <div className="space-y-2 pt-1">
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappText}`}
              target="_blank"
              rel="noopener noreferrer"
              id="sidebar-whatsapp-chat-button"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-emerald-400 hover:bg-emerald-300 shadow-md shadow-emerald-500/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <MessageSquare className="h-4 w-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>

            <a
              href={`tel:${siteConfig.phoneTel}`}
              id="sidebar-direct-phone-button"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-200 bg-white/10 hover:bg-white/15 border border-white/10 transition-colors"
            >
              <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
              <span>Direct Call: {siteConfig.phoneDisplay}</span>
            </a>
          </div>

          <div className="pt-2 border-t border-emerald-500/20 grid grid-cols-2 gap-2 text-[10px] text-slate-400">
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
              <span>Zero Upfront Fee</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
              <span>RBI Code Compliant</span>
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
        city={city}
        totalDebt={selectedDebtTier}
        category={serviceName}
      />
    </aside>
  );
}
