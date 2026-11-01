import { Metadata } from "next";
import Link from "next/link";
import {
  ShieldAlert,
  AlertTriangle,
  Scale,
  Clock,
  PhoneOff,
  UserX,
  FileCheck,
  CheckCircle2,
  PhoneCall,
  FileText,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { ServiceJsonLd } from "@/components/seo/json-ld";
import { ConsultationForm } from "@/components/home/consultation-form";

export const metadata: Metadata = {
  title: "Stop Recovery Agent Harassment | RBI Guidelines & Advocate Legal Notice",
  description:
    "Immediately stop abusive recovery calls, home visits, and family threats under RBI August 2022 Circular. Our advocates issue Cease & Desist notices within 24 hours.",
  alternates: {
    canonical: `${siteConfig.url}/services/anti-harassment`,
  },
};

export default function AntiHarassmentPage() {
  const rbiGuidelines = [
    {
      rule: "Calling Hours Restriction (8:00 AM - 7:00 PM Only)",
      law: "RBI/2022-23/108 Circular Clause 2.1",
      detail:
        "Recovery agents cannot call you before 8:00 AM in the morning or after 7:00 PM in the evening under any circumstance. Calls outside these hours constitute a direct regulatory offense.",
    },
    {
      rule: "Strict Ban on Calling Family, Friends & Employers",
      law: "Right to Privacy & Fair Practices Code",
      detail:
        "Agents are strictly barred from contacting your relatives, friends, colleagues, or employers, or referencing your loan on social media. Contacting third parties violates Section 43A of the IT Act.",
    },
    {
      rule: "No Abusive Language, Humiliation or Threats",
      law: "Indian Penal Code / BNS Criminal Intimidation",
      detail:
        "Using profane language, threatening physical violence, or falsely threatening police arrest is a criminal violation. Loan default in India is strictly a civil dispute.",
    },
    {
      rule: "Mandatory Agent ID Card & Prior Intimation for Visits",
      law: "RBI Recovery Agent Empanelment Mandate",
      detail:
        "Agents must carry verified bank identity credentials, a copy of the bank's authorization letter, and an official notice copy. Unannounced visits to create a public scene are strictly illegal.",
    },
  ];

  return (
    <div className="py-12 md:py-20 bg-background text-foreground">
      <ServiceJsonLd
        title="Anti-Harassment Legal Shield & RBI Recovery Guidelines Advisory"
        description="Legal protection against recovery agent intimidation, unauthorized home visits, and abusive phone calls under RBI guidelines."
        url={`${siteConfig.url}/services/anti-harassment`}
      />

      <div className="container mx-auto px-4 sm:px-6">
        {/* Hero Header */}
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 dark:bg-red-950/70 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-semibold">
            <ShieldAlert className="h-4 w-4" />
            <span>Enforcing RBI Circular on Recovery Agents (August 2022)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Stop Recovery Agent Harassment Legally
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            You do not have to live in fear. Our high-court empanelled advocates serve formal
            Advocate Representation & Cease-and-Desist notices to bank management, forcing recovery
            agencies to halt unauthorized harassment within 24 to 48 hours.
          </p>
        </div>

        {/* Content & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-20">
          <div className="lg:col-span-7 space-y-8">
            {/* Urgent Alert Banner */}
            <div className="p-6 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-2">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
                <AlertTriangle className="h-5 w-5" />
                <span>Defaulting on a Loan is NOT a Crime</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Aggressive agents frequently mislead distressed borrowers by claiming that police
                warrants or non-bailable arrest orders have been issued. Under Indian jurisprudence,
                inability to pay an unsecured loan due to genuine hardship is a pure civil matter.
                No police officer can arrest you for defaulting on personal loans or credit cards.
              </p>
            </div>

            {/* RBI Rules Cards */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                Your 4 Fundamental Legal Rights Under RBI Guidelines:
              </h2>

              <div className="space-y-3">
                {rbiGuidelines.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-2xl border border-border bg-card space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-foreground">{item.rule}</h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-muted-foreground">
                        {item.law}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* What Debt Support Expert Does */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-foreground">
                How Our Legal Shield Halts Recovery Harassment:
              </h2>

              <div className="space-y-3">
                {[
                  {
                    title: "1. Formal Advocate Cease & Desist Notice",
                    desc: "Issued directly to the Bank Managing Director, Head of Collections, and Principal Nodal Officer, warning of criminal defamation, privacy breach, and regulatory penalties.",
                  },
                  {
                    title: "2. Advocate Power of Attorney (Vakalatnama)",
                    desc: "We instruct the bank that our law office represents you for all communications. Under law, collectors are instructed to speak with your legal counsel rather than bothering you.",
                  },
                  {
                    title: "3. Direct Escalation to RBI Banking Ombudsman",
                    desc: "If any rogue agent continues calling after our notice, we lodge a formal complaint on the RBI Complaint Management System (CMS), subjecting the bank to severe regulatory scrutiny.",
                  },
                  {
                    title: "4. Section 138 & Lok Adalat Defense",
                    desc: "If the bank issues legal summons or arbitration notices, our advocates draft point-by-point replies and represent you to ensure a fair compromise settlement.",
                  },
                ].map((act, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-foreground">{act.title}</div>
                      <div className="text-xs text-muted-foreground leading-relaxed">{act.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Sticky Sidebar */}
          <div className="lg:col-span-5 sticky top-28">
            <ConsultationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
