import { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  Award,
  Users,
  Building,
  CheckCircle2,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Our Legal Team & Advocates | Debt Support Expert",
  description:
    "Learn about Debt Support Expert, India's leading legal advisory network defending borrowers against recovery harassment and negotiating legal One-Time Settlements.",
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
};

export default function AboutPage() {
  const leadership = [
    {
      name: "Adv. Rajeshwardhan Singhania",
      role: "Senior Legal Counsel & Head of Banking Litigations",
      experience: "21+ Years Experience",
      specialization: "DRT, SARFAESI Act, Section 138 NI Act, High Court Banking Writs",
      bio: "Former standing counsel for premier public sector banks with deep insider knowledge of credit restructuring, compromise settlement schemes, and RBI enforcement mechanisms.",
    },
    {
      name: "Adv. Meenakshi Sundaram",
      role: "Principal Advocate – Consumer Protection & Anti-Harassment",
      experience: "15+ Years Experience",
      specialization: "RBI Fair Practices Code, IT Act Privacy Injunctions, Ombudsman Proceedings",
      bio: "Pioneered legal intervention frameworks against illegal loan apps and brute recovery practices, securing landmark relief orders for thousands of distressed salaried professionals.",
    },
    {
      name: "Pradeep K. Mathur",
      role: "Chief Financial Restructuring Consultant",
      experience: "18+ Years Banking Veteran",
      specialization: "NPA Resolution, One-Time Settlement (OTS) Negotiation, MSME Credit Recast",
      bio: "Ex-Credit Committee Head at a leading private bank. Specializes in auditing hardship dossiers and structuring viable settlement proposals that banks readily approve.",
    },
  ];

  return (
    <div className="py-12 md:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header Breadcrumb & Title */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
            <Scale className="h-4 w-4" />
            <span>Authoritative Legal Representation</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Restoring Dignity & Financial Peace to Stressed Borrowers
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Debt Support Expert was founded by seasoned advocates and banking resolution veterans
            to bridge the power imbalance between aggressive financial institutions and honest
            citizens facing financial hardship.
          </p>
        </div>

        {/* Founding Mission & Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold">
              Why We Stand Apart: Legal Advocacy, Not Sales Gimmicks
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              When debt piles up, individuals are frequently targeted by predatory recovery agents
              employing unconstitutional intimidation, unannounced home visits, and cyber-harassment.
              Many fall into the trap of unregulated third-party agents who make false promises.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              At <strong>Debt Support Expert</strong>, every client is backed by legal advocates
              enrolled with the Bar Council of India. We enforce the Reserve Bank of India (RBI)
              Fair Practices Code and relevant consumer protection statutes, ensuring every single
              rupee saved is legally documented with an official signed bank settlement letter.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Pan-India Advocate Network</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Direct Bank Account Payouts</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>Zero Tolerance for Harassment</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                <span>100% Verified No Dues Certificates</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Our Track Record</h3>
                <p className="text-xs text-muted-foreground">Pan-India verifiable milestones</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-border">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary-600 dark:text-blue-400">
                  ₹45+ Cr
                </div>
                <div className="text-xs text-muted-foreground mt-1">Debt Waived & Settled</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-border">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  12,500+
                </div>
                <div className="text-xs text-muted-foreground mt-1">Borrowers Defended</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-border">
                <div className="text-2xl sm:text-3xl font-extrabold text-primary-600 dark:text-blue-400">
                  50-75%
                </div>
                <div className="text-xs text-muted-foreground mt-1">Average Savings</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-border">
                <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  100%
                </div>
                <div className="text-xs text-muted-foreground mt-1">RBI Compliant Process</div>
              </div>
            </div>
          </div>
        </div>

        {/* Legal Leadership Profiles */}
        <div className="space-y-8 mb-20">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Legal Advocates & Financial Strategists
            </h2>
            <p className="text-sm text-muted-foreground">
              Meet the senior advocates who lead our litigation, dispute resolution, and settlement
              negotiation wings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leadership.map((leader, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-border bg-card p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-lg">
                    {leader.name.split(" ")[1]?.charAt(0) || "A"}
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-foreground leading-snug">
                      {leader.name}
                    </h3>
                    <div className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-0.5">
                      {leader.role}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {leader.experience}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 text-xs text-foreground font-medium border border-border/80">
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-0.5">
                      Expertise:
                    </span>
                    {leader.specialization}
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {leader.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Bottom Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-blue-700 text-white p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold max-w-xl mx-auto leading-tight">
            Need Expert Legal Representation to Resolve Your Loans?
          </h2>
          <p className="text-sm text-blue-100 max-w-lg mx-auto">
            Book a confidential evaluation with our senior advocates today. We analyze your loan
            agreements and formulate an airtight defense.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="px-7 py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-md"
            >
              Get Free Case Assessment
            </Link>
            <Link
              href="/calculator"
              className="px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-primary-800/80 hover:bg-primary-800 border border-primary-400/40 transition-colors"
            >
              Check Settlement Savings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
