import { Metadata } from "next";
import Link from "next/link";
import {
  Scale,
  CreditCard,
  ShieldAlert,
  Building2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Percent,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { ServiceJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "All Legal Debt Settlement & Anti-Harassment Services | Debt Support Expert",
  description:
    "Explore our complete range of legal loan settlement services in India: Personal Loan Settlement, Credit Card Debt Settlement, Recovery Agent Protection, and MSME Restructuring.",
  alternates: {
    canonical: `${siteConfig.url}/services`,
  },
};

export default function ServicesPage() {
  const serviceList = [
    {
      title: "Personal Loan Settlement",
      href: "/services/personal-loan-settlement",
      badge: "Save Up to 70%",
      icon: Scale,
      color: "from-blue-500/10 to-primary-500/10 text-primary-600 dark:text-primary-400",
      description:
        "Negotiate One-Time Settlement (OTS) with top Indian banks (HDFC, ICICI, SBI, Axis, Kotak) and NBFCs (Bajaj Finserv, Tata Capital). Waive accumulated penalties and resolve unsecured debt under the RBI Fair Practices Code.",
      features: [
        "Formal negotiation with bank settlement committees",
        "Waiver of bounce charges, legal fees & penal interest",
        "Official signed settlement letter on bank letterhead",
        "Irrevocable No Dues Certificate (NDC) upon payment",
      ],
    },
    {
      title: "Credit Card Debt Settlement",
      href: "/services/credit-card-settlement",
      badge: "Stop 42%+ APR",
      icon: CreditCard,
      color: "from-amber-500/10 to-orange-500/10 text-amber-600 dark:text-amber-400",
      description:
        "Break free from the compounding credit card interest trap. We freeze finance charges, waive over-limit and late fee penalties, and structure a single or installment settlement that fits your current budget.",
      features: [
        "Immediate interest calculation freeze",
        "Elimination of predatory finance charges",
        "Protection from rogue credit card recovery callers",
        "Clean legal closure with bureau update",
      ],
    },
    {
      title: "Anti-Harassment & Legal Shield",
      href: "/services/anti-harassment",
      badge: "RBI Compliant",
      icon: ShieldAlert,
      color: "from-red-500/10 to-rose-500/10 text-red-600 dark:text-red-400",
      description:
        "Immediate statutory defense against abusive collection agents, unannounced home/office visits, and unauthorized calls to relatives. Our advocates issue Cease & Desist Notices and file complaints with the RBI Ombudsman.",
      features: [
        "Advocate Representation Notice served within 24h",
        "Enforcement of RBI August 2022 Circular guidelines",
        "Ombudsman & Consumer Court escalation for violations",
        "Advocate representation for Lok Adalat summons",
      ],
    },
    {
      title: "Business & MSME Loan Restructuring",
      href: "/services/business-loan-settlement",
      badge: "MSME Relief",
      icon: Building2,
      color: "from-indigo-500/10 to-purple-500/10 text-indigo-600 dark:text-indigo-400",
      description:
        "Strategic legal advisory for stressed MSME enterprises and commercial borrowers. Resolve Cash Credit (CC), Overdraft (OD) limits, machinery loans, and unsecured business borrowings while defending against DRT actions.",
      features: [
        "Defense against SARFAESI Sec 13(2) & 13(4) notices",
        "MSME Samadhaan & debt compromise representation",
        "Restructuring tenure extensions & OTS structuring",
        "Collateral safeguarding and business continuity",
      ],
    },
  ];

  return (
    <div className="py-12 md:py-20 bg-background text-foreground">
      <ServiceJsonLd
        title="Comprehensive Debt Settlement Services India"
        description="Legal loan settlement, credit card debt relief, and anti-harassment legal advisory across India."
        url={`${siteConfig.url}/services`}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hub Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>Comprehensive Legal Advisory & Debt Relief</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Our Debt Settlement & Legal Protection Services
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
            Every debt problem requires a targeted legal strategy. Discover how our empanelled
            advocates shield your rights and negotiate definitive settlements with financial
            institutions across India.
          </p>
        </div>

        {/* Services List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-14 sm:mb-20">
          {serviceList.map((service, idx) => {
            const Icon = service.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-border bg-card p-5 sm:p-7 lg:p-8 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-200 group"
              >
                <div className="space-y-4 sm:space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-foreground" />
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                      {service.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground group-hover:text-primary-600 transition-colors">
                      {service.title}
                    </h2>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/70">
                    <div className="text-xs font-bold text-foreground uppercase tracking-wider mb-2">
                      Key Legal Safeguards:
                    </div>
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 sm:pt-8">
                  <Link
                    href={service.href}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-slate-900 dark:bg-slate-800 hover:bg-primary-600 dark:hover:bg-primary-600 transition-colors shadow-sm text-center"
                  >
                    <span>View Service Details & Case Studies</span>
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="rounded-3xl bg-slate-900 text-white p-5 sm:p-8 lg:p-12 text-center space-y-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold max-w-xl mx-auto">
            Not Sure Which Settlement Route Applies to Your Loans?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
            Book a complimentary debt portfolio audit with our advocates. We review your bank notices
            and recommend the exact legal action plan.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-md text-center"
            >
              Get Free Case Assessment
            </Link>
            <Link
              href="/calculator"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-center"
            >
              Calculate Settlement Savings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
