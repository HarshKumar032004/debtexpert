"use client";

import * as React from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Clock,
  UserX,
  FileCheck2,
  Award,
  ExternalLink,
  MessageCircle,
  PhoneCall,
  Scale,
  ShieldCheck,
  ArrowRight,
  AlertOctagon,
} from "lucide-react";
import { siteConfig } from "@/config/site";

interface RbiBentoProps {
  isCompact?: boolean;
}

export function RbiBorrowerProtectionBento({ isCompact = false }: RbiBentoProps) {
  const whatsappHarassmentMessage = encodeURIComponent(
    "Hello Debt Support Expert, I am facing recovery agent harassment violating RBI Fair Practice guidelines. Please issue an immediate advocate cease & desist notice."
  );

  return (
    <section className={`rounded-3xl border border-border bg-gradient-to-b from-card via-card to-muted/30 p-5 sm:p-8 lg:p-10 shadow-xl space-y-6 ${isCompact ? "my-6 sm:my-8" : "my-10 sm:my-14"}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-300 text-xs font-semibold">
            <ShieldAlert className="h-3.5 w-3.5 text-red-600" />
            <span>RBI Statutory Protection Framework 2026–2027</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Know Your RBI Rights: 5 Absolute Legal Protections
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
            Under the Reserve Bank of India (RBI) Fair Practices Code and August 2022 Circular on Recovery Agents, borrowers in financial distress enjoy non-negotiable legal protections against intimidation.
          </p>
        </div>

        <div className="shrink-0">
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}?text=${whatsappHarassmentMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-950/20 active:scale-95 transition-all"
          >
            <AlertOctagon className="h-4 w-4" />
            <span>Stop Harassment Now</span>
          </a>
        </div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Bento 1: Strict 8 AM - 7 PM Calling Window (Large/Span 2 on lg if not compact) */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary-400 dark:hover:border-primary-700 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              RBI Time Lock
            </span>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              Strict 8:00 AM – 7:00 PM Calling Window Only
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              Recovery telecallers and field representatives are legally prohibited from calling or visiting a borrower before 8:00 AM or after 7:00 PM. Any call outside this window constitutes actionable harassment under RBI Circular DOR.ORG.REC.65/21.04.158/2022-23.
            </p>
          </div>
          <div className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60">
            Advocate Action: We issue formal statutory notices to the Bank Principal Nodal Officer documenting timestamped call logs.
          </div>
        </div>

        {/* Bento 2: Zero Workplace & Family Harassment */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary-400 dark:hover:border-primary-700 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-red-50 dark:bg-red-950/70 text-red-600 dark:text-red-400 flex items-center justify-center">
              <UserX className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-200 dark:border-red-800">
              Zero Third-Party Contact
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Zero Contact with Family & Employers
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              Agents cannot contact your spouse, parents, siblings, neighbours, or employer. Making threatening calls to workplace colleagues or accessing your phone contact list violates the Digital Personal Data Protection (DPDP) Act and RBI privacy codes.
            </p>
          </div>
        </div>

        {/* Bento 3: Mandatory Advance Intimation (RBI Jan 2027 Mandate) */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary-400 dark:hover:border-primary-700 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              Mandatory Intimation
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Mandatory Advance Recovery Agent Disclosure
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              Under RBI mandates, banks must send prior written notice via SMS/Email disclosing the recovery agency name, verified agent name, and identity card number before any agent visits your address. Unannounced doorstep intimidation is strictly unlawful.
            </p>
          </div>
        </div>

        {/* Bento 4: Statutory ₹100/Day Delay Compensation */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary-400 dark:hover:border-primary-700 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Award className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              ₹100 / Day Rule
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              ₹100/Day Delay Compensation on CIBIL Disputes
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              Under RBI Master Directions (Oct 2023), Credit Institutions and Credit Bureaus must rectify credit report disputes within 30 calendar days. If they fail to update settled/closed accounts within 30 days, the borrower is entitled to ₹100 per day of delay directly from the bank.
            </p>
          </div>
        </div>

        {/* Bento 5: Direct RBI Ombudsman Escalation Path */}
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-primary-400 dark:hover:border-primary-700 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Scale className="h-5 w-5" />
            </div>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              Ombudsman CMS
            </span>
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground">
              Direct Escalation to RBI Ombudsman (14448)
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mt-1">
              If a bank or NBFC ignores your harassment complaint for 30 days, file directly on the RBI Complaint Management System (<a href="https://cms.rbi.org.in" target="_blank" rel="noopener noreferrer" className="font-bold underline text-primary">cms.rbi.org.in</a>) or call toll-free 14448. The Ombudsman can award compensation up to ₹20 Lakhs for mental harassment.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
          <span>Need immediate advocate intervention? We serve legal cease & desist notices within 24 hours.</span>
        </div>
        <Link
          href="/contact"
          className="px-4 py-2 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-white hover:bg-slate-100 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>Request Legal Shield</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
