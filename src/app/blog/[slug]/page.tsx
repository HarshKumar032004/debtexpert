import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  BookOpen,
  User,
  Share2,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { blogPostsData } from "@/data/blogs";
import { siteConfig } from "@/config/site";
import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  FaqJsonLd,
} from "@/components/seo/json-ld";
import { ConsultationForm } from "@/components/home/consultation-form";
import { FadeIn } from "@/components/animations/motion-wrappers";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(blogPostsData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPostsData[slug];

  if (!post) {
    return {
      title: "Article Not Found | Debt Support Expert",
    };
  }

  const postUrl = `${siteConfig.url}/blog/${slug}`;

  return {
    title: post.metaTitle,
    description: post.metaDescription,
    keywords: post.keywords,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: postUrl,
      type: "article",
      publishedTime: post.publishedDate,
      modifiedTime: post.updatedDate,
      authors: [post.author.name],
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = blogPostsData[slug];

  if (!post) {
    notFound();
  }

  const postUrl = `${siteConfig.url}/blog/${slug}`;

  return (
    <div className="py-8 md:py-16 bg-background text-foreground">
      {/* JSON-LD Schemas */}
      <ArticleJsonLd
        title={post.title}
        description={post.metaDescription}
        url={postUrl}
        datePublished={post.publishedDate}
        dateModified={post.updatedDate}
        authorName={post.author.name}
      />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Blog", url: `${siteConfig.url}/blog` },
          { name: post.title, url: postUrl },
        ]}
      />
      {post.faqs && post.faqs.length > 0 && <FaqJsonLd items={post.faqs} />}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 overflow-x-auto py-1 scrollbar-none"
        >
          <Link href="/" className="hover:text-primary-600 transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
          <Link href="/blog" className="hover:text-primary-600 transition-colors">
            Blog
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
          <span className="font-semibold text-foreground truncate max-w-[240px] sm:max-w-none">
            {post.category}
          </span>
        </nav>

        {/* Article Header */}
        <FadeIn direction="up">
          <header className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-5 mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
              <BookOpen className="h-3.5 w-3.5" />
              <span>{post.category}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              {post.title}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {post.summary}
            </p>

            {/* Author & Meta Row */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-3 text-xs text-muted-foreground border-t border-border/80 max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold">
                  {post.author.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-bold text-foreground">{post.author.name}</div>
                  <div className="text-[10px]">{post.author.credentials}</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{post.readTime}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5" />
                <span>Updated Feb 2026</span>
              </div>
            </div>
          </header>
        </FadeIn>

        {/* Main Content & Sidebar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto mb-14 sm:mb-20">
          {/* Main Article Body (8 cols) */}
          <article className="lg:col-span-8 space-y-8 sm:space-y-10">
            {/* Table of Contents Box */}
            {post.tableOfContents && post.tableOfContents.length > 0 && (
              <div className="p-4 sm:p-6 rounded-3xl border border-border bg-slate-50 dark:bg-slate-900/60 space-y-3">
                <div className="font-extrabold text-sm text-foreground uppercase tracking-wider">
                  Table of Contents
                </div>
                <ul className="space-y-2 text-xs sm:text-sm">
                  {post.tableOfContents.map((toc) => (
                    <li key={toc.id}>
                      <a
                        href={`#${toc.id}`}
                        className="text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center gap-2"
                      >
                        <ChevronRight className="h-3 w-3" />
                        <span>{toc.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sections */}
            {post.sections.map((section) => (
              <section key={section.id} id={section.id} className="space-y-5 sm:space-y-6 pt-2">
                <div className="space-y-2 border-b border-border/80 pb-3">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                    {section.title}
                  </h2>
                  {section.intro && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.intro}
                    </p>
                  )}
                </div>

                {section.subsections && (
                  <div className="space-y-6">
                    {section.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="space-y-3">
                        <h3 className="text-lg sm:text-xl font-bold text-foreground">
                          {sub.title}
                        </h3>

                        {Array.isArray(sub.content) ? (
                          sub.content.map((p, pIdx) => (
                            <p
                              key={pIdx}
                              className="text-xs sm:text-sm text-muted-foreground leading-relaxed"
                            >
                              {p}
                            </p>
                          ))
                        ) : (
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            {sub.content}
                          </p>
                        )}

                        {sub.highlightBox && (
                          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border space-y-1.5 my-3">
                            <div className="font-bold text-xs sm:text-sm text-foreground flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4 text-primary-500 shrink-0" />
                              <span>{sub.highlightBox.title}</span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {sub.highlightBox.text}
                            </p>
                          </div>
                        )}

                        {sub.bulletPoints && (
                          <ul className="space-y-2 pt-1">
                            {sub.bulletPoints.map((pt, ptIdx) => (
                              <li
                                key={ptIdx}
                                className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground"
                              >
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </section>
            ))}

            {/* Inline Consultation CTA Callout */}
            <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-blue-700 text-white p-6 sm:p-8 space-y-4 shadow-xl">
              <h3 className="text-xl sm:text-2xl font-extrabold">
                Facing Legal Notices or Bank Recovery Threats?
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed">
                Do not face bank litigation alone. Our High Court empanelled advocates draft formal pointwise legal replies, protect you from coercive warrants, and negotiate binding One-Time Settlements.
              </p>
              <div className="pt-1">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-md"
                >
                  <span>Request Free Legal Opinion</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* FAQs Section */}
            {post.faqs && post.faqs.length > 0 && (
              <section className="space-y-4 pt-6 border-t border-border">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary-500" />
                    <span>Frequently Asked Questions</span>
                  </h3>
                </div>

                <div className="space-y-3">
                  {post.faqs.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-5 rounded-2xl border border-border bg-card space-y-2 shadow-sm"
                    >
                      <h4 className="font-bold text-sm text-foreground">
                        {faq.question}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Related Services */}
            {post.relatedServices && post.relatedServices.length > 0 && (
              <div className="pt-6 border-t border-border space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Related Debt Relief Services:
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {post.relatedServices.map((srv, sIdx) => (
                    <Link
                      key={sIdx}
                      href={srv.href}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-primary-50 dark:hover:bg-primary-950 hover:text-primary-600 transition-colors border border-border"
                    >
                      <span>{srv.title}</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>

          {/* Sticky Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6 sticky top-24">
            {/* Author Profile Card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-primary-100 dark:bg-primary-950 text-primary-700 dark:text-primary-300 flex items-center justify-center font-bold text-lg">
                  {post.author.name.charAt(0)}
                </div>
                <div>
                  <div className="font-extrabold text-sm text-foreground">
                    {post.author.name}
                  </div>
                  <div className="text-xs text-primary-600 dark:text-primary-400 font-semibold">
                    {post.author.role}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    {post.author.credentials}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Empanelled with Debt Support Expert. Advising borrowers on RBI regulatory compliance, consumer rights, and banking litigation.
              </p>
            </div>

            {/* Quick Consultation Form */}
            <ConsultationForm />
          </aside>
        </div>
      </div>
    </div>
  );
}
