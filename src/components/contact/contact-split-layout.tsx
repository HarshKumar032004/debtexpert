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
  AlertOctagon,
  Scale,
  MessageCircle,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { submitLead, validateIndianPhone } from "@/lib/lead";
import { CaseInitiatedModal } from "@/components/forms/case-initiated-modal";

export function ContactSplitLayout() {
  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    totalDebt: "5L - 10L",
    loanType: "personal-loan",
    harassmentLevel: "critical",
    banks: "",
    message: "",
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
      email: formData.email,
      city: formData.city,
      totalDebt: formData.totalDebt,
      loanType: formData.loanType,
      harassmentLevel: formData.harassmentLevel,
      banks: formData.banks,
      message: formData.message,
      source: "contact-page",
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

  const whatsappUrl = siteConfig.getWhatsAppUrl(
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
          Schedule Your Free Confidential Legal Case Evaluation
        </h1>

        <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
          Take immediate legal control of your financial distress. Submit your case details below or reach our emergency harassment legal helpline.
        </p>
      </div>

      {/* Split Screen Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
        {/* Left Side: Helplines, WhatsApp, Emergency Badge & Office Hours (5 cols) */}
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
                  <span>Facing Doorstep Agents or Threats?</span>
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  If recovery agents are at your home/office right now or threatening your family, call our emergency advocate line immediately. We intervene under the RBI August 2022 Circular within 30 minutes.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
                  id="contact-emergency-call-button"
                  className="w-full inline-flex items-center justify-center gap-2 px-3.5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-950 transition-all hover:scale-[1.02] active:scale-95 text-center"
                >
                  <PhoneCall className="h-4 w-4 fill-current shrink-0" />
                  <span>Emergency Hotline: {siteConfig.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Standard Contact Channels Card */}
          <div className="p-4 sm:p-7 rounded-3xl border border-border bg-card shadow-lg space-y-6">
            <h3 className="text-lg font-bold text-foreground">
              Direct Contact Channels
            </h3>

            <div className="space-y-5 text-sm">
              {/* National Helpline */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    National Client Helpline
                  </div>
                  <a
                    href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
                    id="contact-general-phone"
                    className="text-base font-extrabold text-foreground hover:text-primary-600 transition-colors"
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                  <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>Mon – Sat: 9:30 AM to 7:00 PM IST</span>
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
                    WhatsApp Direct Connect
                  </div>
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="contact-whatsapp-direct"
                    className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1.5"
                  >
                    <span>Message On-Duty Advocate</span>
                  </a>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Fast 15-minute response time
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Notice Submission & Document Audits
                  </div>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    id="contact-email"
                    className="text-sm sm:text-base font-bold text-foreground hover:text-primary-600 transition-colors"
                  >
                    {siteConfig.email}
                  </a>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    Send bank legal notices & sanction letters for free review
                  </div>
                </div>
              </div>

              {/* Physical Address */}
              <div className="flex items-start gap-3.5 pt-3 border-t border-border">
                <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    Corporate Headquarters
                  </div>
                  <div className="text-xs font-semibold text-foreground leading-relaxed mt-0.5">
                    Level 4, Cyber City, DLF Phase 2,<br />
                    Gurugram, Haryana - 122002, India
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    Pan-India Advocates: Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strict Privacy Reassurance */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-foreground">
              <Lock className="h-4 w-4 text-emerald-500" />
              <span>Zero Disclosure Guarantee</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Your consultation is protected under Bar Council attorney-client privilege. We never disclose debt details to your employer, relatives, or third parties.
            </p>
          </div>
        </div>        {/* Right Side: Comprehensive Case Evaluation Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-border bg-card p-4 sm:p-8 lg:p-10 shadow-xl relative overflow-hidden">
            {status === "success" ? (
              <div className="py-8 sm:py-12 text-center space-y-6">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div className="space-y-2">
                  {modalData.referenceId && (
                    <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-300">
                      Official Case File #{modalData.referenceId}
                    </div>
                  )}
                  <h3 className="text-2xl font-extrabold text-foreground">
                    Case Evaluation Request Received
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-foreground">{formData.fullName}</span>. A Senior Legal Advocate has been assigned to your case portfolio and will contact you at{" "}
                    <span className="font-semibold text-foreground">+91 {formData.phone}</span> within <strong className="text-emerald-600 dark:text-emerald-400">30-45 minutes</strong>.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 space-y-2 max-w-md mx-auto text-left">
                  <div className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Immediate Advocate Instructions:</span>
                  </div>
                  <ul className="space-y-1 list-disc pl-4 text-[11px] leading-relaxed">
                    <li>Do not engage in verbal arguments with recovery agents or make unverified promises.</li>
                    <li>If an agent calls, inform them that your advocates at Debt Support Expert are handling legal representation.</li>
                    <li>Keep your loan account numbers, notices, or WhatsApp messages ready for our advocate to review.</li>
                  </ul>
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
                      <span>Connect on WhatsApp with Ref #{modalData.referenceId}</span>
                    </a>
                  )}
                  <a
                    href={`tel:${siteConfig.phoneTel}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 transition-colors"
                  >
                    <PhoneCall className="h-4 w-4 text-emerald-400" />
                    <span>Call Helpline: {siteConfig.phoneDisplay}</span>
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                <div className="space-y-2 pb-2 border-b border-border">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
                    <Sparkles className="h-3 w-3 text-amber-500" />
                    <span>Confidential Case Inquiry</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                    Request Legal Case Evaluation
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Provide your debt details to receive an actionable legal assessment and customized OTS settlement roadmap.
                  </p>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-fullname"
                      className="text-xs font-bold text-foreground"
                    >
                      Full Legal Name *
                    </label>
                    <input
                      id="contact-fullname"
                      type="text"
                      required
                      placeholder="e.g. Vikramaditya Rathore"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full px-3.5 py-3 rounded-xl border border-input bg-background text-foreground text-base sm:text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-phone"
                      className="text-xs font-bold text-foreground"
                    >
                      Mobile Number (WhatsApp Enabled) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm sm:text-xs font-semibold text-muted-foreground">
                        +91
                      </span>
                      <input
                        id="contact-phone"
                        type="tel"
                        inputMode="numeric"
                        required
                        placeholder="9876543210"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData({ ...formData, phone: e.target.value });
                          if (phoneError) setPhoneError(null);
                        }}
                        className={`w-full pl-12 pr-3.5 py-3 rounded-xl border bg-background text-foreground text-base sm:text-sm focus:ring-2 outline-none ${
                          phoneError
                            ? "border-red-500 focus:ring-red-500"
                            : "border-input focus:ring-primary"
                        }`}
                      />
                    </div>
                    {phoneError && (
                      <p className="text-[11px] text-red-500 font-semibold pt-0.5">
                        {phoneError}
                      </p>
                    )}
                  </div>
                </div>

                {/* City & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-city"
                      className="text-xs font-bold text-foreground"
                    >
                      City / State *
                    </label>
                    <input
                      id="contact-city"
                      type="text"
                      required
                      placeholder="e.g. Bengaluru, Karnataka"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      className="w-full px-3.5 py-3 rounded-xl border border-input bg-background text-foreground text-base sm:text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-xs font-bold text-foreground"
                    >
                      Email Address (For Confidential Notices)
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      placeholder="vikram@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-3.5 py-3 rounded-xl border border-input bg-background text-foreground text-base sm:text-sm focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                </div>

                {/* Debt Category & Total Unsecured Debt */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-loantype"
                      className="text-xs font-bold text-foreground"
                    >
                      Primary Debt Category *
                    </label>
                    <select
                      id="contact-loantype"
                      value={formData.loanType}
                      onChange={(e) =>
                        setFormData({ ...formData, loanType: e.target.value })
                      }
                      className="w-full px-3.5 py-3 rounded-xl border border-input bg-background text-foreground text-base sm:text-sm focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="personal-loan">Personal Loan (Bank / NBFC)</option>
                      <option value="credit-card">Credit Card Debt</option>
                      <option value="multiple-debts">Multiple Credit Cards & Loans</option>
                      <option value="business-loan">MSME / Business Loan / OD</option>
                      <option value="digital-apps">Digital Loan Apps</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-totaldebt"
                      className="text-xs font-bold text-foreground"
                    >
                      Total Unsecured Debt Amount *
                    </label>
                    <select
                      id="contact-totaldebt"
                      value={formData.totalDebt}
                      onChange={(e) =>
                        setFormData({ ...formData, totalDebt: e.target.value })
                      }
                      className="w-full px-3.5 py-3 rounded-xl border border-input bg-background text-foreground text-base sm:text-sm focus:ring-2 focus:ring-primary outline-none"
                    >
                      <option value="Under 2 Lakh">Under ₹2,00,000</option>
                      <option value="2L - 5L">₹2,00,000 - ₹5,00,000</option>
                      <option value="5L - 10L">₹5,00,000 - ₹10,00,000</option>
                      <option value="10L - 25L">₹10,00,000 - ₹25,00,000</option>
                      <option value="25L - 50L">₹25,00,000 - ₹50,00,000</option>
                      <option value="50L+">₹50,00,000+ (Commercial / MSME)</option>
                    </select>
                  </div>
                </div>

                {/* Harassment Level Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground block">
                    Current Recovery Harassment Level *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[
                      {
                        id: "mild",
                        title: "Mild / Low",
                        desc: "Occasional payment reminder calls",
                        border: "border-slate-200 dark:border-slate-800",
                        active: "border-blue-500 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300",
                      },
                      {
                        id: "moderate",
                        title: "Moderate",
                        desc: "10-20 calls/day + threatening SMS notices",
                        border: "border-amber-200 dark:border-amber-900/60",
                        active: "border-amber-500 bg-amber-50/50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300",
                      },
                      {
                        id: "critical",
                        title: "Critical Emergency",
                        desc: "30+ calls/day, calls to family/office, home visits",
                        border: "border-red-200 dark:border-red-900/60",
                        active: "border-red-500 bg-red-50/60 dark:bg-red-950/40 text-red-900 dark:text-red-300",
                      },
                    ].map((lvl) => (
                      <button
                        key={lvl.id}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, harassmentLevel: lvl.id })
                        }
                        className={`p-3 rounded-xl border text-left transition-all ${
                          formData.harassmentLevel === lvl.id
                            ? `${lvl.active} ring-2 ring-primary/40 font-bold`
                            : "border-border bg-slate-50/50 dark:bg-slate-900/30 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                      >
                        <div className="text-xs font-bold text-foreground">
                          {lvl.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">
                          {lvl.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Banks / Lenders */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-banks"
                    className="text-xs font-bold text-foreground"
                  >
                    Banks / NBFC Names (Optional)
                  </label>
                  <input
                    id="contact-banks"
                    type="text"
                    placeholder="e.g. HDFC, SBI Card, ICICI Bank, Bajaj Finserv, Axis Bank"
                    value={formData.banks}
                    onChange={(e) =>
                      setFormData({ ...formData, banks: e.target.value })
                    }
                    className="w-full px-3.5 py-3 rounded-xl border border-input bg-background text-foreground text-base sm:text-sm focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>

                {/* Message / Notice Details */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="contact-message"
                    className="text-xs font-bold text-foreground"
                  >
                    Message / Notice Details (Optional)
                  </label>
                  <textarea
                    id="contact-message"
                    rows={3}
                    placeholder="Describe your situation (e.g., received Section 138 notice, loan default duration, salary reduction, or medical emergency)..."
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-3.5 py-3 rounded-xl border border-input bg-background text-foreground text-base sm:text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="contact-submit-button"
                  disabled={status === "submitting"}
                  className="w-full py-3.5 sm:py-4 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-gradient-to-r from-primary-600 via-primary-700 to-blue-700 hover:from-primary-700 hover:to-blue-800 shadow-lg shadow-primary-600/30 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                >
                  {status === "submitting" ? (
                    <span>Submitting Case to Senior Advocates...</span>
                  ) : (
                    <>
                      <ShieldCheck className="h-5 w-5 text-amber-300" />
                      <span>Submit Case for Legal Evaluation & Harassment Relief</span>
                      <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-1">
                  <Lock className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Protected under Bar Council Attorney-Client Privilege. Zero spam guaranteed.</span>
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
        clientName={formData.fullName}
        phone={formData.phone}
        whatsappUrl={modalData.whatsappUrl}
        city={formData.city}
        totalDebt={formData.totalDebt}
        category={formData.loanType}
      />
    </div>
  );
}
