"use client";

import * as React from "react";
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  PhoneCall,
  MessageCircle,
  X,
  Lock,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { siteConfig } from "@/config/site";

interface CaseInitiatedModalProps {
  isOpen: boolean;
  onClose: () => void;
  referenceId: string;
  clientName: string;
  phone: string;
  whatsappUrl: string;
  city?: string;
  totalDebt?: string;
  category?: string;
}

export function CaseInitiatedModal({
  isOpen,
  onClose,
  referenceId,
  clientName,
  phone,
  whatsappUrl,
  city,
  totalDebt,
  category,
}: CaseInitiatedModalProps) {
  const [copied, setCopied] = React.useState(false);

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(referenceId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleWhatsAppClick = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-emerald-500/30 dark:border-emerald-500/40 p-6 sm:p-8 shadow-2xl z-10 space-y-6 text-foreground my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Top Trust Badge */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            Official Case File Initialized
          </span>
          <span className="text-[10px] text-muted-foreground">
            Strict Attorney-Client Privilege
          </span>
        </div>

        {/* Success Icon & Header */}
        <div className="space-y-2 text-center sm:text-left">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-1">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-foreground">
            Case Evaluation File Created
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Thank you, <strong className="text-foreground">{clientName}</strong>. Your legal file has been assigned to our Senior Debt Settlement & Anti-Harassment Advocates.
          </p>
        </div>

        {/* Official Reference ID Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Assigned Legal File Number
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px] flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Active in Review
            </span>
          </div>

          <div className="flex items-center justify-between gap-3 bg-white dark:bg-slate-900 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="font-mono text-lg font-black tracking-wider text-primary-600 dark:text-primary-400">
              {referenceId}
            </span>
            <button
              onClick={handleCopyRef}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Quick File Details */}
          <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-muted-foreground">
            <div>
              <span className="text-slate-400">Phone:</span>{" "}
              <span className="text-foreground font-semibold">+91 {phone}</span>
            </div>
            {city && (
              <div>
                <span className="text-slate-400">Jurisdiction:</span>{" "}
                <span className="text-foreground font-semibold">{city}</span>
              </div>
            )}
            {totalDebt && (
              <div>
                <span className="text-slate-400">Total Debt:</span>{" "}
                <span className="text-foreground font-semibold">{totalDebt}</span>
              </div>
            )}
            {category && (
              <div>
                <span className="text-slate-400">Category:</span>{" "}
                <span className="text-foreground font-semibold">{category}</span>
              </div>
            )}
          </div>
        </div>

        {/* Critical Legal Advisory Callout */}
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-300 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-[11px]">
            <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Immediate Protection Advice from Our Advocates:</span>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300/90">
            If recovery agents call right now, strictly do NOT make verbal commitments. Inform them: <em>&ldquo;My case is represented by Debt Support Expert legal counsel under RBI guidelines. Reference ID {referenceId}.&rdquo;</em>
          </p>
        </div>

        {/* Primary Action: Direct WhatsApp Connect */}
        <div className="space-y-3 pt-1">
          <button
            onClick={handleWhatsAppClick}
            type="button"
            className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/30 active:scale-95 transition-all group"
          >
            <MessageCircle className="h-5 w-5 fill-white/20" />
            <span>Connect on WhatsApp with Case #{referenceId}</span>
            <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </button>

          <div className="flex items-center justify-between gap-3">
            <a
              href={`tel:${siteConfig.phoneTel}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <PhoneCall className="h-3.5 w-3.5 text-emerald-500" />
              <span>Call Helpline: {siteConfig.phoneDisplay}</span>
            </a>
            <button
              onClick={onClose}
              type="button"
              className="py-2.5 px-4 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Done
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground pt-1 border-t border-border">
          <Lock className="h-3 w-3 text-emerald-500" />
          <span>Bar Council Legal Privilege • 100% Confidential • Zero Spam Guarantee</span>
        </div>
      </div>
    </div>
  );
}
