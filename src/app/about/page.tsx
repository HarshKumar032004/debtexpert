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
  HeartHandshake,
  AlertOctagon,
  FileText,
  Lock,
  PhoneCall,
  Sparkles,
  TrendingDown,
  Gavel,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { AnimatedCounter, FadeIn } from "@/components/animations/motion-wrappers";

export const metadata: Metadata = {
  title: "About Our Legal Team & Advocates | Debt Support Expert",
  description:
    "Learn about Debt Support Expert, India's leading legal advisory network defending borrower dignity, enforcing RBI Fair Practices Code, and negotiating legal One-Time Settlements.",
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    title: "About Our Legal Advocates & Financial Negotiators | Debt Support Expert",
    description:
      "Defending borrower dignity, enforcing RBI recovery guidelines, and negotiating legal debt settlements across India.",
    url: `${siteConfig.url}/about`,
    type: "website",
  },
};

export default function AboutPage() {
  const leadership = [
    {
      name: "Adv. Rajeshwardhan Singhania",
      role: "Senior Legal Counsel & Head of Banking Litigations",
      credentials: "Bar Council of Delhi • 21+ Years Experience",
      specialization: "DRT, SARFAESI Act, Section 138 NI Act, High Court Banking Writs",
      bio: "Former standing counsel for premier public sector banks with deep insider knowledge of credit committee restructuring, compromise settlement frameworks, and RBI enforcement mechanisms.",
    },
    {
      name: "Adv. Meenakshi Sundaram",
      role: "Principal Advocate – Consumer Protection & Anti-Harassment",
      credentials: "Bar Council of Maharashtra & Goa • 16+ Years Experience",
      specialization: "RBI Fair Practices Code, Article 21 Privacy Injunctions, Ombudsman Proceedings",
      bio: "Pioneered legal intervention frameworks against illegal recovery syndicates and rogue loan apps, securing landmark relief orders for thousands of distressed salaried professionals.",
    },
    {
      name: "Pradeep K. Mathur",
      role: "Chief Financial Restructuring Consultant",
      credentials: "Ex-Credit Committee Head • 19+ Years Banking Veteran",
      specialization: "NPA Resolution, One-Time Settlement (OTS) Negotiation, MSME Credit Recast",
      bio: "Specializes in auditing hardship dossiers and structuring viable, bank-compliant settlement proposals that senior zonal committees readily approve at 50% to 75% concessions.",
    },
  ];

  const pillars = [
    {
      icon: Gavel,
      title: "Bar Council Empanelled Advocates",
      desc: "Every legal notice, Vakalatnama, and court reply is drafted and served by licensed High Court advocates—never by unregulated sales agents or call centers.",
    },
    {
      icon: Building,
      title: "Ex-Bank Senior Settlement Officers",
      desc: "Our negotiation strategists include former bank credit committee heads who understand internal provisioning norms and optimal compromise settlement thresholds.",
    },
    {
      icon: ShieldCheck,
      title: "24-48 Hour Harassment Immunity",
      desc: "Formal advocate representation notices served to bank managing directors and nodal officers enforce the RBI August 2022 Circular, halting abusive recovery calls.",
    },
    {
      icon: Lock,
      title: "Direct Bank Disbursals Only",
      desc: "Zero fraud risk. You never transfer settlement money to us or any intermediary. 100% of settlement funds are paid directly into your verified bank loan account.",
    },
    {
      icon: FileText,
      title: "100% Verified No Dues Certificates",
      desc: "Before you disburse a single rupee, our legal team inspects the official bank letterhead settlement agreement to ensure an irrevocable No Dues Certificate is granted.",
    },
    {
      icon: Scale,
      title: "RBI Ombudsman & Court Defense",
      desc: "We defend you against Section 138 cheque bounce summons, represent you at Lok Adalat, and escalate persistent harassment to the RBI Banking Ombudsman (CMS Portal).",
    },
  ];

  return (
    <div className="py-10 md:py-16 bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <FadeIn direction="up">
          <div className="max-w-4xl mx-auto text-center space-y-4 mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
              <Scale className="h-4 w-4" />
              <span>Authoritative Legal Advocacy & Financial Defense</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Restoring Borrower Dignity, Protecting Legal Rights & Providing Financial Second Chances
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Debt Support Expert was founded by senior High Court advocates and seasoned banking resolution veterans to correct the severe power imbalance between institutional lenders and honest Indian citizens facing genuine financial distress.
            </p>
          </div>
        </FadeIn>

        {/* Mission Statement Bento Box */}
        <div className="rounded-3xl border border-border bg-gradient-to-br from-card via-card to-slate-50/50 dark:to-slate-900/50 p-5 sm:p-8 lg:p-12 shadow-xl mb-14 sm:mb-20 space-y-6 sm:space-y-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
              <HeartHandshake className="h-4 w-4" />
              <span>Our Founding Mission</span>
            </div>

            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight">
              A Noble Mission: Because Defaulting on a Loan is NOT a Crime
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              In India, unexpected life disruptions—such as job retrenchment, catastrophic medical surgeries, or the collapse of small businesses—can render loan repayment mathematically impossible. Tragically, distressed borrowers are routinely subjected to unlawful recovery tactics: abusive calls at odd hours, threats to family members, public shaming, and false threats of police arrest.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              We believe every honest borrower deserves to be treated with dignity under Article 21 of the Constitution of India. Our mission is to enforce the Reserve Bank of India (RBI) Fair Practices Code, shield families from harassment, and negotiate transparent One-Time Settlements (OTS) that grant hard-working citizens a clean financial slate.
            </p>
          </div>

          {/* 3 Core Values */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-border">
            <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
              <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                01
              </div>
              <h3 className="text-base font-bold text-foreground">Borrower Dignity First</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Zero tolerance for abuse. We believe financial difficulty is a civil circumstance, not a moral failure. Every human being has the constitutional right to live without fear and intimidation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                02
              </div>
              <h3 className="text-base font-bold text-foreground">RBI Regulatory Enforcement</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We strictly enforce the RBI August 2022 Circular on Recovery Agents and Master Directions on Compromise Settlements (June 2023), holding lenders accountable to statutory rules.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-border space-y-2">
              <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                03
              </div>
              <h3 className="text-base font-bold text-foreground">Financial Second Chances</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We do not just stop calls—we extinguish debts permanently with official No Dues Certificates and guide our clients through structured credit rehabilitation back to a 750+ CIBIL score.
              </p>
            </div>
          </div>
        </div>

        {/* Why Choose Our Legal Advocates & Financial Negotiators */}
        <div className="space-y-12 mb-20">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Institutional Difference</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Why Choose Our Legal Advocates & Financial Negotiators
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              When confronting multi-crore banking institutions, verbal arguments with call centers achieve nothing. You need licensed legal advocates who speak the language of banking jurisprudence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={idx}
                  className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-200 group"
                >
                  <div className="space-y-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-primary-50 dark:group-hover:bg-primary-950 transition-colors">
                      <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-foreground leading-snug">
                        {pillar.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Track Record & Numbers */}
        <div className="rounded-3xl border border-border bg-card p-5 sm:p-8 lg:p-12 shadow-xl mb-14 sm:mb-20 space-y-6 sm:space-y-8">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground">
              Proven Track Record Across India
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Verifiable milestones achieved through principled legal advocacy and rigorous financial audits.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary-600 dark:text-primary-400">
                <AnimatedCounter target={45} prefix="₹" suffix="+ Cr" />
              </div>
              <div className="text-xs font-semibold text-foreground mt-1">Debt Waived & Resolved</div>
              <div className="text-[10px] sm:text-[11px] text-muted-foreground">Principal & penal charges stripped</div>
            </div>

            <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                <AnimatedCounter target={12500} suffix="+" />
              </div>
              <div className="text-xs font-semibold text-foreground mt-1">Borrowers Protected</div>
              <div className="text-[10px] sm:text-[11px] text-muted-foreground">From recovery harassment</div>
            </div>

            <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-primary-600 dark:text-primary-400">
                <AnimatedCounter target={75} prefix="Up to " suffix="%" />
              </div>
              <div className="text-xs font-semibold text-foreground mt-1">Average Savings</div>
              <div className="text-[10px] sm:text-[11px] text-muted-foreground">Across credit cards & personal loans</div>
            </div>

            <div className="p-3.5 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                <AnimatedCounter target={100} suffix="%" />
              </div>
              <div className="text-xs font-semibold text-foreground mt-1">RBI Compliant Process</div>
              <div className="text-[10px] sm:text-[11px] text-muted-foreground">Strict Bar Council ethics</div>
            </div>
          </div>
        </div>

        {/* Legal Leadership Profiles */}
        <div className="space-y-8 mb-14 sm:mb-20">
          <div className="max-w-2xl mx-auto text-center space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Our Senior Legal Advocates & Banking Litigators
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Meet the licensed advocates and former banking credit committee heads leading our defense teams.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {leadership.map((leader, idx) => (
              <div
                key={idx}
                className="rounded-3xl border border-border bg-card p-5 sm:p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-lg">
                    {leader.name.split(" ")[1]?.charAt(0) || "A"}
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-foreground leading-snug">
                      {leader.name}
                    </h3>
                    <div className="text-xs font-semibold text-primary-600 dark:text-primary-400 mt-0.5">
                      {leader.role}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      {leader.credentials}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-foreground font-medium border border-border">
                    <span className="text-muted-foreground block text-[10px] uppercase font-bold mb-0.5">
                      Core Specialization:
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

        {/* Mandatory Ethical Compliance Notice */}
        <div className="p-4 sm:p-7 lg:p-8 rounded-3xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 shadow-md mb-14 sm:mb-20 space-y-4">
          <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300 font-bold text-sm sm:text-base">
            <AlertOctagon className="h-5 w-5 shrink-0" />
            <span>Ethical Compliance & Regulatory Disclaimer (Advocates Act & RBI Guidelines)</span>
          </div>

          <div className="space-y-2.5 text-xs text-amber-950/80 dark:text-amber-200/80 leading-relaxed">
            <p>
              <strong>1. We Are NOT a Lender or Financial Institution:</strong> Debt Support Expert operates strictly as a legal advisory and financial resolution consultancy under the Advocates Act, 1961. We DO NOT offer loans, payday credits, personal loans, or debt consolidation financing of any kind. We do not lend money, nor do we facilitate loan disbursement.
            </p>
            <p>
              <strong>2. Nature of Services:</strong> Our empanelled advocates provide professional legal representation, statutory notice defense (Section 138 NI Act, Section 25 PSSA, SARFAESI Act), and formal One-Time Settlement (OTS) negotiation with banks and NBFCs under the RBI Fair Practices Code and Compromise Settlement guidelines.
            </p>
            <p>
              <strong>3. Zero Third-Party Cash Collection:</strong> To protect borrowers from fraud, Debt Support Expert NEVER collects or holds settlement funds. All negotiated settlement payments are disbursed directly by the borrower into their official bank loan account, verified on official bank letterhead prior to payment.
            </p>
            <p>
              <strong>4. Credit Bureau Disclosures:</strong> In compliance with the Credit Information Companies (Regulation) Act (CICRA), settled debts are reported to credit bureaus (CIBIL, Experian, CRIF High Mark) with the status &apos;Settled&apos; or &apos;Written Off&apos;. We provide transparent counseling on the temporary credit score impact and provide structured credit rebuilding guidance.
            </p>
          </div>
        </div>

        {/* CTA Bottom Banner */}
        <div className="rounded-3xl bg-slate-900 text-white p-5 sm:p-8 lg:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Award className="h-3.5 w-3.5" />
              <span>Pan-India Advocate Network</span>
            </span>

            <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Ready to Halt Harassment and Settle Your Debts Legally?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
              Schedule a 100% confidential case evaluation with our senior advocates today. We inspect your loan agreements and formulate an airtight legal settlement strategy.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-md"
            >
              Get Free Case Assessment
            </Link>
            <Link
              href="/calculator"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            >
              Calculate Settlement Savings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
