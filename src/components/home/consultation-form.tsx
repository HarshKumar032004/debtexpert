"use client";

import * as React from "react";
import {
  ShieldCheck,
  Send,
  Lock,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export function ConsultationForm() {
  const [formData, setFormData] = React.useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    loanType: "personal-loan",
    totalDebt: "5L - 10L",
    banks: "",
    facingHarassment: true,
  });

  const [status, setStatus] = React.useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    // Simulate API submission
    setTimeout(() => {
      setStatus("success");
    }, 1200);
  };

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-emerald-300 dark:border-emerald-800 bg-white dark:bg-slate-900 p-8 sm:p-12 text-center shadow-xl space-y-6">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-10 w-10" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-foreground">
            Consultation Request Received
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Thank you, <span className="font-semibold text-foreground">{formData.fullName}</span>.
            Our Senior Legal Advocate has received your portfolio details and will contact you at{" "}
            <span className="font-semibold text-foreground">+91 {formData.phone}</span> within
            30-45 minutes.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 space-y-2 max-w-md mx-auto text-left">
          <div className="font-bold flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>Immediate Advice for Your Case:</span>
          </div>
          <p>
            Do not engage with aggressive recovery agents or make verbal promises. Inform them that
            your legal advocates at Debt Support Expert are handling your debt restructuring.
          </p>
        </div>

        <div className="pt-2">
          <a
            href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-slate-900 dark:bg-slate-800 hover:bg-slate-800"
          >
            <PhoneCall className="h-4 w-4 text-emerald-400" />
            <span>Need Urgent Legal Help? Call {siteConfig.phoneDisplay}</span>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-xl relative overflow-hidden">
      <div className="space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>Strict Attorney-Client Confidentiality</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground">
          Request Free Legal Evaluation
        </h3>

        <p className="text-xs sm:text-sm text-muted-foreground">
          Get an immediate assessment of your loan settlement eligibility and an action plan to stop
          recovery harassment.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground" htmlFor="fullName">
              Full Legal Name *
            </label>
            <input
              id="fullName"
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground" htmlFor="phone">
              Mobile Number (For WhatsApp / Call) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground">
                +91
              </span>
              <input
                id="phone"
                type="tel"
                required
                pattern="[0-9]{10}"
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground" htmlFor="city">
              City / State *
            </label>
            <input
              id="city"
              type="text"
              required
              placeholder="e.g. Mumbai, Maharashtra"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground" htmlFor="email">
              Email Address (For Confidential Notices)
            </label>
            <input
              id="email"
              type="email"
              placeholder="rahul@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground" htmlFor="loanType">
              Primary Debt Category *
            </label>
            <select
              id="loanType"
              value={formData.loanType}
              onChange={(e) =>
                setFormData({ ...formData, loanType: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="personal-loan">Personal Loan (Bank / NBFC)</option>
              <option value="credit-card">Credit Card Debt</option>
              <option value="multiple-loans">Multiple Mixed Loans</option>
              <option value="business-loan">MSME / Business Loan / OD</option>
              <option value="app-loans">Digital Loan Apps / Instant Loans</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground" htmlFor="totalDebt">
              Total Outstanding Debt *
            </label>
            <select
              id="totalDebt"
              value={formData.totalDebt}
              onChange={(e) =>
                setFormData({ ...formData, totalDebt: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="Under 2 Lakh">Under ₹2,00,000</option>
              <option value="2L - 5L">₹2,00,000 - ₹5,00,000</option>
              <option value="5L - 10L">₹5,00,000 - ₹10,00,000</option>
              <option value="10L - 25L">₹10,00,000 - ₹25,00,000</option>
              <option value="25L - 50L">₹25,00,000 - ₹50,00,000</option>
              <option value="50L+">₹50,00,000+ (High Value / MSME)</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground" htmlFor="banks">
            Banks / NBFC Names (Optional)
          </label>
          <input
            id="banks"
            type="text"
            placeholder="e.g. HDFC, ICICI, SBI, Bajaj Finserv, Axis"
            value={formData.banks}
            onChange={(e) =>
              setFormData({ ...formData, banks: e.target.value })
            }
            className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          />
        </div>

        {/* Harassment Emergency Checkbox */}
        <label className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50/60 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.facingHarassment}
            onChange={(e) =>
              setFormData({ ...formData, facingHarassment: e.target.checked })
            }
            className="mt-0.5 h-4 w-4 rounded border-red-400 text-red-600 focus:ring-red-500"
          />
          <div className="text-xs text-slate-800 dark:text-slate-200">
            <span className="font-bold text-red-600 dark:text-red-400 block">
              Urgent Harassment Flag:
            </span>
            I am facing frequent threatening recovery calls, home visits, or intimidation of family members.
          </div>
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full py-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-primary-600 via-primary-700 to-blue-700 hover:from-primary-700 hover:to-blue-800 shadow-lg shadow-primary-600/30 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 group disabled:opacity-70"
        >
          {status === "submitting" ? (
            <span>Connecting to Legal Advocate...</span>
          ) : (
            <>
              <ShieldCheck className="h-5 w-5 text-amber-300" />
              <span>Get Free Legal Evaluation & Stop Harassment</span>
              <Send className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground pt-1">
          <Lock className="h-3 w-3 text-emerald-500" />
          <span>Your information is protected under attorney-client privilege. Never sold to third parties.</span>
        </div>
      </form>
    </div>
  );
}
