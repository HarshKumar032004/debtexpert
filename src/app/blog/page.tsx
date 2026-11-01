import { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Tag,
  Scale,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "RBI Guidelines, Legal Guides & Debt Relief Blog | Debt Support Expert",
  description:
    "Authoritative legal guides on RBI recovery agent rules, loan settlement procedures, CIBIL score rehabilitation, and legal notice defense in India.",
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
};

export const blogPosts = [
  {
    slug: "rbi-recovery-agent-guidelines-august-2022",
    title: "RBI Recovery Agent Rules: What Collection Agents CAN and CANNOT Do",
    summary:
      "A complete legal breakdown of the RBI August 2022 Circular. Learn why calling after 7 PM or contacting family members violates statutory law.",
    category: "RBI Rules",
    readTime: "6 min read",
    date: "October 2026",
    author: "Adv. Meenakshi Sundaram",
  },
  {
    slug: "can-bank-arrest-loan-default-india",
    title: "Can Banks Arrest You or File a Criminal Police Case for Loan Default in India?",
    summary:
      "Understanding civil vs criminal law in India. Defaulting on an unsecured personal loan or credit card is NOT a crime. How to respond to fraudulent arrest threats.",
    category: "Legal Rights",
    readTime: "8 min read",
    date: "October 2026",
    author: "Adv. Rajeshwardhan Singhania",
  },
  {
    slug: "section-138-ni-act-section-25-nach-bounce-notices",
    title: "How to Legally Respond to Section 138 & Section 25 NACH Bounce Notices",
    summary:
      "Received an advocate notice for bounced cheque or NACH ECS debit? Here is the step-by-step legal defense and how to reach a compromise before Lok Adalat.",
    category: "Court Notices",
    readTime: "10 min read",
    date: "September 2026",
    author: "Senior Litigation Advocate",
  },
  {
    slug: "how-to-settle-credit-card-debt-hdfc-sbi-icici",
    title: "How to Settle Credit Card Debt with HDFC, SBI, and ICICI for 60% - 70% Less",
    summary:
      "A practical insider guide to breaking free from 42% APR revolving balances through One-Time Settlement (OTS) and interest freezes.",
    category: "Credit Cards",
    readTime: "7 min read",
    date: "September 2026",
    author: "Pradeep K. Mathur",
  },
  {
    slug: "rebuild-cibil-score-after-loan-settlement",
    title: "How to Rebuild Your CIBIL Score Back to 750+ After a Debt Settlement",
    summary:
      "Will settlement ruin your financial future forever? Follow our proven 12-to-24-month roadmap using secured credit cards and timely utility reporting.",
    category: "CIBIL Rehabilitation",
    readTime: "5 min read",
    date: "August 2026",
    author: "Financial Advisory Team",
  },
  {
    slug: "no-dues-certificate-ndc-verification-guide",
    title: "What is an Official Bank No Dues Certificate (NDC) and How to Spot Fakes",
    summary:
      "Never pay a settlement without verifying the authenticity of the bank settlement letter. How to inspect digital signatures, loan account numbers, and bank seals.",
    category: "Settlement Security",
    readTime: "6 min read",
    date: "August 2026",
    author: "Legal Compliance Officer",
  },
];

export default function BlogHubPage() {
  return (
    <div className="py-12 md:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-primary-700 dark:text-blue-300 text-xs font-semibold">
            <BookOpen className="h-4 w-4" />
            <span>Authoritative Legal & Banking Knowledge Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Legal Guides, RBI Rules & Debt Relief Insights
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Written and vetted by senior High Court advocates and banking consultants to educate
            borrowers on their constitutional rights and debt restructuring strategies.
          </p>
        </div>

        {/* Featured Post Card */}
        <div className="max-w-5xl mx-auto mb-16">
          <div className="rounded-3xl border border-primary-200 dark:border-primary-900/60 bg-gradient-to-br from-primary-50/50 via-card to-card dark:from-primary-950/30 dark:via-card dark:to-card p-8 sm:p-12 shadow-lg space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-600 text-white">
                Featured Legal Analysis
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" /> 6 min read
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" /> October 2026
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-foreground leading-tight">
              RBI Recovery Agent Rules: What Collection Agencies CAN and CANNOT Do
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
              The Reserve Bank of India has laid down strict boundaries for recovery agents under the
              August 2022 Fair Practices Circular. Calling after 7:00 PM, calling before 8:00 AM,
              contacting colleagues, shouting or using abusive language, and unannounced visits to
              intimidate family members are statutory offenses punishable by the Banking Ombudsman.
            </p>

            <div className="pt-2 flex items-center justify-between">
              <div className="text-xs font-semibold text-foreground">
                Author: Adv. Meenakshi Sundaram (Consumer Rights Advocate)
              </div>
              <Link
                href="/services/anti-harassment"
                className="inline-flex items-center gap-2 font-bold text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                <span>Read Protection Guide</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {blogPosts.map((post, idx) => (
            <article
              key={idx}
              className="rounded-3xl border border-border bg-card p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground">
                    {post.category}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </span>
                </div>

                <h3 className="font-bold text-base text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                  {post.summary}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border/70 flex items-center justify-between text-xs">
                <span className="text-muted-foreground text-[11px]">{post.author}</span>
                <Link
                  href="/contact"
                  className="font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Ask Advocate</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Consultation Box */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900 text-white p-8 sm:p-10 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold">
            Have a Specific Legal Question Regarding Your Loan Notice?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Our legal advocates review Section 138 notices, arbitration letters, and recovery complaints
            free of charge during your initial confidential evaluation.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm text-slate-900 bg-white hover:bg-slate-100 transition-colors"
          >
            <span>Request Free Legal Opinion</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
