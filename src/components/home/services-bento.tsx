import Link from "next/link";
import {
  Scale,
  CreditCard,
  ShieldAlert,
  Building2,
  ArrowRight,
  CheckCircle2,
  Percent,
  Sparkles,
} from "lucide-react";

export function ServicesBento() {
  return (
    <section className="py-20 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Heading */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
            <Sparkles className="h-4 w-4 text-primary-500" />
            <span>Comprehensive Legal & Financial Solutions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Specialized Debt Relief Services
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed">
            Tailored legal strategies for individuals, salaried employees, and MSME business
            owners trapped in compounding debt and aggressive recovery tactics.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Bento Card 1: Personal Loan Settlement (Large span 7) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-card p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-950/70 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                  <Scale className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  Save 50% - 70%
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  Personal Loan Settlement (OTS)
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Settle unsecured personal loans from top private and public banks (HDFC, ICICI,
                  Axis, SBI, Kotak) and NBFCs (Bajaj Finserv, Tata Capital, Aditya Birla). We
                  negotiate directly with senior settlement officers under the RBI Fair Practices
                  Code to waive exorbitant late fees, bounce charges, and interest.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {[
                  "Official Bank Settlement Letter",
                  "No Dues Certificate (NDC)",
                  "Stoppage of legal court notices",
                  "Structured payment tenures",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/services/personal-loan-settlement"
                className="inline-flex items-center gap-2 font-bold text-sm text-primary-600 dark:text-primary-400 group-hover:underline"
              >
                <span>Learn More About Personal Loan Settlement</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Bento Card 2: Credit Card Settlement (Span 5) */}
          <div className="lg:col-span-5 rounded-3xl border border-slate-200 dark:border-slate-800 bg-card p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <CreditCard className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  Stop 42%+ APR Trap
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  Credit Card Debt Relief
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Credit card minimum payments keep you in debt for decades. We freeze compounding
                  interest, eliminate finance charges, and secure single or installment-based
                  One-Time Settlement.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {[
                  "Complete interest freeze upon enrollment",
                  "Waiver of overdue and over-limit penalties",
                  "Affordable monthly settlement accounts",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/services/credit-card-settlement"
                className="inline-flex items-center gap-2 font-bold text-sm text-primary-600 dark:text-primary-400 group-hover:underline"
              >
                <span>Settle Credit Card Debt</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Bento Card 3: Anti-Harassment Legal Shield (Span 5) */}
          <div className="lg:col-span-5 rounded-3xl border border-red-200 dark:border-red-900/60 bg-gradient-to-b from-red-50/40 via-card to-card dark:from-red-950/20 dark:via-card dark:to-card p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <ShieldAlert className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800">
                  RBI Fair Practice
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  Anti-Harassment Legal Shield
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Defend your dignity and constitutional privacy rights. We issue formal Advocate
                  Notices to stop abusive recovery calls, unannounced visits, and intimidation of
                  your family.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                {[
                  "Cease & Desist Notices to bank leadership",
                  "Ombudsman & Banking Lokpal escalation",
                  "Advocate Power of Attorney representation",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-red-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/services/anti-harassment"
                className="inline-flex items-center gap-2 font-bold text-sm text-red-600 dark:text-red-400 group-hover:underline"
              >
                <span>Stop Agent Harassment</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Bento Card 4: Business & MSME Debt Restructuring (Span 7) */}
          <div className="lg:col-span-7 rounded-3xl border border-slate-200 dark:border-slate-800 bg-card p-8 sm:p-10 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                  MSME & Corporate
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground">
                  Business & MSME Loan Restructuring
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Working capital stress, OD/CC defaults, machinery loans, and unsecured business
                  credits. We provide legal defense against DRT and SARFAESI actions, and structure
                  favorable OTS and loan recast arrangements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {[
                  "Cash Credit & Overdraft resolution",
                  "SARFAESI Sec 13(2) & 13(4) legal defense",
                  "MSME Samadhaan & restructuring advisory",
                  "Asset protection & collateral safety",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8">
              <Link
                href="/services/business-loan-settlement"
                className="inline-flex items-center gap-2 font-bold text-sm text-primary-600 dark:text-primary-400 group-hover:underline"
              >
                <span>Explore MSME Debt Solutions</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
