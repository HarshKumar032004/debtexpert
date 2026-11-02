import { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Scale,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { blogPostsData } from "@/data/blogs";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations/motion-wrappers";

export const metadata: Metadata = {
  title: "RBI Guidelines, Legal Guides & Debt Relief Blog | Debt Support Expert",
  description:
    "Authoritative legal guides on RBI recovery agent rules, loan settlement procedures, CIBIL score rehabilitation, and legal notice defense in India.",
  alternates: {
    canonical: `${siteConfig.url}/blog`,
  },
  openGraph: {
    title: "RBI Guidelines & Debt Relief Knowledge Hub | Debt Support Expert",
    description:
      "Authoritative legal articles written by High Court advocates on borrower rights, OTS negotiation, and loan settlement.",
    url: `${siteConfig.url}/blog`,
    type: "website",
  },
};

export default function BlogHubPage() {
  const posts = Object.values(blogPostsData);
  const featuredPost = blogPostsData["rbi-guidelines-for-recovery-agents-2026"];

  return (
    <div className="py-10 md:py-16 bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <FadeIn direction="up">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-primary-700 dark:text-blue-300 text-xs font-semibold">
              <BookOpen className="h-4 w-4" />
              <span>Authoritative Legal & Banking Knowledge Hub</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Legal Guides, RBI Rules & Debt Relief Insights
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed">
              Written and vetted by senior High Court advocates and banking consultants to educate
              borrowers on their constitutional rights and debt restructuring strategies.
            </p>
          </div>
        </FadeIn>

        {/* Featured Post Card */}
        {featuredPost && (
          <FadeIn direction="up" delay={0.1}>
            <div className="max-w-5xl mx-auto mb-10 sm:mb-16">
              <div className="rounded-3xl border border-primary-200 dark:border-primary-900/60 bg-gradient-to-br from-primary-50/50 via-card to-card dark:from-primary-950/30 dark:via-card dark:to-card p-5 sm:p-8 lg:p-12 shadow-lg space-y-5 sm:space-y-6 hover:shadow-xl transition-all duration-300 group">
                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary-600 text-white">
                    Featured Legal Analysis
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {featuredPost.readTime}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" /> Updated Feb 2026
                  </span>
                </div>

                <h2 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-foreground leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  <Link href={`/blog/${featuredPost.slug}`}>
                    {featuredPost.title}
                  </Link>
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
                  {featuredPost.summary}
                </p>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-t border-border/80">
                  <div className="text-xs font-semibold text-foreground">
                    Author: {featuredPost.author.name} ({featuredPost.author.role})
                  </div>
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="inline-flex items-center gap-2 font-bold text-xs sm:text-sm text-primary-600 dark:text-primary-400 group-hover:underline"
                  >
                    <span>Read Full Legal Guide</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        )}

        {/* Blog Posts Grid */}
        <StaggerContainer className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-14 sm:mb-20">
          {posts.map((post) => (
            <StaggerItem key={post.slug}>
              <article className="h-full rounded-3xl border border-border bg-card p-5 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-primary-400/50 dark:hover:border-primary-500/50 transition-all duration-300 hover:-translate-y-1 group">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-foreground">
                      {post.category}
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                      <Clock className="h-3.5 w-3.5" /> {post.readTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-base sm:text-xl text-foreground group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {post.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/70 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground text-[11px] font-medium">
                    {post.author.name}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Bottom Consultation Box */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-slate-900 text-white p-5 sm:p-8 lg:p-10 text-center space-y-5 shadow-2xl">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
            Have a Specific Legal Question Regarding Your Loan Notice?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Our legal advocates review Section 138 notices, arbitration letters, and recovery complaints
            free of charge during your initial confidential evaluation.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-md text-center"
            >
              <span>Request Free Legal Opinion</span>
              <ArrowRight className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
