import Link from "next/link";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  Building,
  Scale,
  FileCheck2,
  PhoneCall,
  Clock,
  Award,
} from "lucide-react";
import { ServicePageData } from "@/types/service";
import { ServiceJsonLd } from "@/components/seo/json-ld";
import { ServiceBreadcrumb } from "./service-breadcrumb";
import { ServiceSidebar } from "./service-sidebar";
import { ServiceComparisonTable } from "./service-comparison-table";
import { ServiceFaqSection } from "./service-faq-section";
import { BankEscalationFinder } from "./bank-escalation-finder";
import { siteConfig } from "@/config/site";
import { FadeIn } from "@/components/animations/motion-wrappers";

interface ServicePageTemplateProps {
  data: ServicePageData;
}

export function ServicePageTemplate({ data }: ServicePageTemplateProps) {
  return (
    <div className="py-8 md:py-16 bg-background text-foreground">
      {/* 1. Dynamic Service Schema */}
      <ServiceJsonLd
        title={data.metaTitle}
        description={data.metaDescription}
        url={data.canonicalUrl}
      />

      <div className="container mx-auto px-4 sm:px-6">
        {/* 2. Top Breadcrumb Navigation */}
        <div className="mb-6">
          <ServiceBreadcrumb items={data.breadcrumbs} />
        </div>

        {/* 3. Hero Header Section */}
        <FadeIn direction="up">
          <div className="max-w-4xl mx-auto text-center space-y-5 mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
              <Scale className="h-4 w-4" />
              <span>{data.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              {data.h1Title}
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {data.heroSubtitle}
            </p>


          {/* Quick Stats or Highlights */}
          {data.stats && data.stats.length > 0 && (
            <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {data.stats.map((stat, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-card border border-border text-center space-y-0.5 shadow-sm"
                >
                  <div className="text-xl sm:text-2xl font-black text-primary-600 dark:text-primary-400">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-semibold text-foreground">
                    {stat.label}
                  </div>
                  {stat.description && (
                    <div className="text-[10px] text-muted-foreground">
                      {stat.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Action CTAs in Hero */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="#sidebar-fullname"
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-md shadow-primary-600/20 inline-flex items-center gap-2"
            >
              <span>Get Free Case Evaluation</span>
              <ArrowRight className="h-4 w-4" />
            </a>
            <Link
              href="/calculator"
              className="px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-foreground bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-border transition-colors inline-flex items-center gap-2"
            >
              <span>Calculate Settlement Savings</span>
            </Link>
          </div>
        </div>
      </FadeIn>

        {/* 4. Main Two-Column Layout: Educational Content vs Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start mb-20">
          {/* Left Column: Educational Content & Comparison */}
          <article className="lg:col-span-7 xl:col-span-8 space-y-12">
            {/* Urgent Notice Banner if defined */}
            {data.urgentNotice && (
              <div className="p-5 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 space-y-2">
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm">
                  <AlertTriangle className="h-5 w-5 shrink-0" />
                  <span>{data.urgentNotice.title}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {data.urgentNotice.text}
                </p>
              </div>
            )}

            {/* Deep Educational Sections with H2 & H3 */}
            {data.educationalSections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="space-y-6 pt-2"
              >
                <div className="space-y-2 border-b border-border/80 pb-3">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {section.title}
                  </h2>
                  {section.intro && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {section.intro}
                    </p>
                  )}
                </div>

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

                      {/* Highlight Box if present */}
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

                      {/* Bullet points if present */}
                      {sub.bulletPoints && sub.bulletPoints.length > 0 && (
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
              </section>
            ))}

            {/* Financial Institutions Handled */}
            {data.partnerInstitutions && data.partnerInstitutions.length > 0 && (
              <section className="space-y-4 pt-4">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">
                    {data.partnerInstitutionsTitle ||
                      "Financial Institutions Handled by Our Empanelled Advocates:"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Our law office engages directly with executive settlement committees and zonal heads at:
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-muted-foreground">
                  {data.partnerInstitutions.map((bank, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-border bg-card flex items-center gap-2 font-medium shadow-sm hover:border-primary-300 dark:hover:border-primary-800 transition-colors"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                      <span className="truncate">{bank}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Step-by-Step Legal Protocol */}
            {data.processSteps && data.processSteps.length > 0 && (
              <section className="space-y-4 pt-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">
                    {data.processTitle || "Our 4-Stage Legal Settlement Protocol:"}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {data.processSubtitle ||
                      "A systematic, legally protected procedure that shields borrowers while securing maximum waivers."}
                  </p>
                </div>

                <div className="space-y-3">
                  {data.processSteps.map((stepItem, idx) => (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl border border-border bg-card space-y-1.5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-extrabold text-xs text-primary-600 dark:text-primary-400 uppercase tracking-wider">
                          {stepItem.step}
                        </div>
                        {stepItem.badge && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-muted-foreground">
                            {stepItem.badge}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-sm sm:text-base text-foreground">
                        {stepItem.title}
                      </div>
                      <div className="text-xs text-muted-foreground leading-relaxed">
                        {stepItem.description}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Comparison Table Section */}
            <ServiceComparisonTable
              rows={data.comparisonRows}
              serviceTitle={data.serviceName}
            />

            {/* Service-Specific FAQs Section */}
            <ServiceFaqSection
              faqs={data.faqs}
              serviceName={data.serviceName}
            />
          </article>

          {/* Right Column: Sticky Sidebar with Quick Form & WhatsApp Helpline */}
          <div className="lg:col-span-5 xl:col-span-4">
            <ServiceSidebar
              serviceName={data.serviceName}
              defaultLoanType={data.defaultLoanType}
              customWhatsAppMessage={data.customWhatsAppMessage}
            />
          </div>
        </div>

        {/* Bank Escalation Matrix Section */}
        <BankEscalationFinder />

        {/* 5. Bottom Call to Action Banner */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <Award className="h-3.5 w-3.5" />
              <span>High Court Empanelled Legal Advisory</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to Resolve Your Debt and Reclaim Peace of Mind?
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
              Do not let compounding bank interest or recovery agent threats dictate your life. Speak with our senior advocates today for a 100% confidential case evaluation.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#sidebar-fullname"
              className="px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-md"
            >
              Request Advocate Consultation
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
              className="px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors inline-flex items-center gap-2"
            >
              <PhoneCall className="h-4 w-4 text-emerald-400" />
              <span>Call Helpline: {siteConfig.phoneDisplay}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
