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

export function ServiceSidebar({
  serviceName,
  defaultLoanType = "personal-loan",
  customWhatsAppMessage,
}: ServiceSidebarProps) {
  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    city: "",
    loanType: defaultLoanType,
    totalDebt: "5L - 10L",
    banks: "",
    facingHarassment: true,
  });

  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">("idle");
  const [phoneError, setPhoneError] = React.useState<string | null>(null);
  const [modalData, setModalData] = React.useState({
    isOpen: false,
    referenceId: "",
    whatsappUrl: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);

    const validation = validateIndianPhone(formData.phone);
    if (!validation.isValid) {
      setPhoneError(validation.error || "Please enter a valid 10-digit mobile number");
      return;
    }

    setStatus("submitting");

    const result = await submitLead({
      fullName: formData.fullName,
      phone: validation.cleaned,
      city: formData.city,
      loanType: formData.loanType,
      totalDebt: formData.totalDebt,
      banks: formData.banks,
      facingHarassment: formData.facingHarassment,
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
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-[11px] font-semibold">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Attorney-Client Privilege</span>
          </div>

          <h3 className="text-xl font-extrabold text-foreground tracking-tight">
            Quick Callback Request
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Get an instant legal case review for <strong className="text-foreground font-semibold">{serviceName}</strong>. Our High Court advocates respond within 30-45 minutes.
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
                Thank you, <span className="font-semibold text-foreground">{formData.fullName}</span>. An advocate handling {serviceName} will call you at{" "}
                <span className="font-semibold text-foreground">+91 {formData.phone}</span> shortly.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-900 dark:text-emerald-300 text-left space-y-1">
              <div className="font-bold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Next Immediate Step:</span>
              </div>
              <p>
                Keep any bank legal notices or loan sanction letters ready. Do not make unverified payments to recovery callers.
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
          <form onSubmit={handleSubmit} className="space-y-4">
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
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-base sm:text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label
                className="text-[11px] font-bold text-foreground uppercase tracking-wider"
                htmlFor="sidebar-phone"
              >
                Mobile Number (WhatsApp Enabled) *
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
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label
                  className="text-[11px] font-bold text-foreground uppercase tracking-wider"
                  htmlFor="sidebar-city"
                >
                  City / State *
                </label>
                <input
                  id="sidebar-city"
                  type="text"
                  required
                  placeholder="e.g. Delhi, NCR"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-base sm:text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label
                  className="text-[11px] font-bold text-foreground uppercase tracking-wider"
                  htmlFor="sidebar-debt"
                >
                  Total Debt *
                </label>
                <select
                  id="sidebar-debt"
                  value={formData.totalDebt}
                  onChange={(e) =>
                    setFormData({ ...formData, totalDebt: e.target.value })
                  }
                  className="w-full px-2.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-base sm:text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="Under 2 Lakh">Under ₹2 Lakh</option>
                  <option value="2L - 5L">₹2L - ₹5 Lakh</option>
                  <option value="5L - 10L">₹5L - ₹10 Lakh</option>
                  <option value="10L - 25L">₹10L - ₹25 Lakh</option>
                  <option value="25L - 50L">₹25L - ₹50 Lakh</option>
                  <option value="50L+">₹50 Lakh+ (MSME)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label
                className="text-[11px] font-bold text-foreground uppercase tracking-wider"
                htmlFor="sidebar-banks"
              >
                Banks / NBFC Names (Optional)
              </label>
              <input
                id="sidebar-banks"
                type="text"
                placeholder="e.g. HDFC, SBI, ICICI, Bajaj Finserv"
                value={formData.banks}
                onChange={(e) =>
                  setFormData({ ...formData, banks: e.target.value })
                }
                className="w-full px-3 py-2.5 rounded-xl border border-input bg-background text-foreground text-base sm:text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>

            {/* Harassment Emergency Checkbox */}
            <label
              htmlFor="sidebar-harassment"
              className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50/70 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 cursor-pointer"
            >
              <input
                id="sidebar-harassment"
                type="checkbox"
                checked={formData.facingHarassment}
                onChange={(e) =>
                  setFormData({ ...formData, facingHarassment: e.target.checked })
                }
                className="mt-0.5 h-3.5 w-3.5 rounded border-red-400 text-red-600 focus:ring-red-500"
              />
              <div className="text-[11px] text-slate-800 dark:text-slate-200 leading-tight">
                <span className="font-bold text-red-600 dark:text-red-400 block">
                  Priority Action:
                </span>
                Facing aggressive recovery calls, home visits, or threats to family.
              </div>
            </label>

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
              <span>Strict Confidentiality • No Data Sharing</span>
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
        clientName={formData.fullName}
        phone={formData.phone}
        whatsappUrl={modalData.whatsappUrl}
        city={formData.city}
        totalDebt={formData.totalDebt}
        category={serviceName}
      />
    </aside>
  );
}
