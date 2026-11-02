import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Scale,
  ShieldCheck,
  CheckCircle2,
  Building,
  PhoneCall,
  ArrowRight,
  TrendingDown,
  Gavel,
  ChevronRight,
  AlertTriangle,
  Quote,
  HelpCircle,
} from "lucide-react";
import { citiesData } from "@/data/cities";
import { siteConfig } from "@/config/site";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/json-ld";
import { ServiceSidebar } from "@/components/services/service-sidebar";
import { ServiceComparisonTable } from "@/components/services/service-comparison-table";
import { FadeIn, StaggerContainer, StaggerItem, AnimatedCounter } from "@/components/animations/motion-wrappers";

interface CityPageProps {
  params: Promise<{
    city: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(citiesData).map((city) => ({
    city,
  }));
}

export async function generateMetadata({
  params,
}: CityPageProps): Promise<Metadata> {
  const { city } = await params;
  const data = citiesData[city];

  if (!data) {
    return {
      title: "City Not Found | Debt Support Expert",
    };
  }

  const cityUrl = `${siteConfig.url}/loan-settlement/${city}`;

  return {
    title: data.metaTitle,
    description: data.metaDescription,
    keywords: data.keywords,
    alternates: {
      canonical: cityUrl,
    },
    openGraph: {
      title: data.metaTitle,
      description: data.metaDescription,
      url: cityUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: data.metaTitle,
      description: data.metaDescription,
    },
  };
}

export default async function CityLoanSettlementPage({
  params,
}: CityPageProps) {
  const { city } = await params;
  const data = citiesData[city];

  if (!data) {
    notFound();
  }

  const cityUrl = `${siteConfig.url}/loan-settlement/${city}`;

  const comparisonRows = [
    {
      feature: "Protection Against Aggressive Local Collection Agencies",
      alone: "Endless 40+ Calls & Doorstep Threat",
      debtSupport: "Halted in 24-48 Hours",
      aloneNote: "Third-party local agencies visit residences and harass family.",
      debtSupportNote: `Advocate Cease & Desist served to regional zonal heads across ${data.cityName}.`,
    },
    {
      feature: "Direct Representation at Debt Recovery Tribunal (DRT)",
      alone: "Severe Risk of Ex-Parte Orders",
      debtSupport: "Full Advocate Representation",
      aloneNote: "Borrowers fail to challenge defective SARFAESI valuation notices.",
      debtSupportNote: `We file Securitisation Applications before ${data.drtCourts[0]?.name || "DRT"}.`,
    },
    {
      feature: "Settlement Concessions on Stressed Debts",
      alone: "Low (10% - 15%)",
      debtSupport: `${data.stats.avgWaiver} Waiver`,
      aloneNote: "Branch officers lack write-off powers and demand full penalty clearance.",
      debtSupportNote: "Direct negotiation with Zonal Settlement Committees under RBI guidelines.",
    },
    {
      feature: "Official No Dues Certificate (NDC) Delivery",
      alone: "Delayed & Left Open",
      debtSupport: "100% Guaranteed Bank Closure",
      aloneNote: "Accounts remain marked as overdue in credit bureaus for years.",
      debtSupportNote: "Verified signed letter on bank letterhead before any money is paid.",
    },
  ];

  return (
    <div className="py-8 md:py-16 bg-background text-foreground">
      {/* Schema */}
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: siteConfig.url },
          { name: "Loan Settlement", url: `${siteConfig.url}/services` },
          { name: data.cityName, url: cityUrl },
        ]}
      />
      {data.localFaqs && data.localFaqs.length > 0 && (
        <FaqJsonLd items={data.localFaqs} />
      )}

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
          <Link href="/services" className="hover:text-primary-600 transition-colors">
            Services
          </Link>
          <ChevronRight className="h-3 w-3 text-muted-foreground/60" />
          <span className="font-semibold text-foreground truncate">
            {data.cityName}
          </span>
        </nav>

        {/* Hero Header */}
        <FadeIn direction="up">
          <header className="max-w-4xl mx-auto text-center space-y-4 sm:space-y-5 mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
              <MapPin className="h-4 w-4 text-emerald-500" />
              <span>
                Empanelled Advocates in {data.cityName} • {data.state}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Best Loan Settlement & Anti-Harassment Lawyers in {data.cityName}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              {data.heroSubtitle}
            </p>

            {/* Local Stats Row */}
            <div className="pt-2 grid grid-cols-3 gap-1.5 sm:gap-3 max-w-2xl mx-auto">
              <div className="p-2.5 sm:p-3.5 rounded-2xl bg-card border border-border text-center space-y-0.5 shadow-sm">
                <div className="text-base sm:text-2xl font-black text-primary-600 dark:text-primary-400">
                  {data.stats.borrowersProtected}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-foreground">
                  Borrowers Defended
                </div>
                <div className="text-[9px] sm:text-[10px] text-muted-foreground truncate">In {data.cityName}</div>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-2xl bg-card border border-border text-center space-y-0.5 shadow-sm">
                <div className="text-base sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {data.stats.debtResolved}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-foreground">
                  Debt Resolved
                </div>
                <div className="text-[9px] sm:text-[10px] text-muted-foreground truncate">Settled & waived</div>
              </div>

              <div className="p-2.5 sm:p-3.5 rounded-2xl bg-card border border-border text-center space-y-0.5 shadow-sm">
                <div className="text-base sm:text-2xl font-black text-primary-600 dark:text-primary-400">
                  {data.stats.avgWaiver}
                </div>
                <div className="text-[10px] sm:text-[11px] font-semibold text-foreground">
                  Average Waiver
                </div>
                <div className="text-[9px] sm:text-[10px] text-muted-foreground truncate">RBI guidelines</div>
              </div>
            </div>

            {/* Popular Localities Covered */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Key Areas Covered:</span>
              {data.popularAreas.map((area, aIdx) => (
                <span
                  key={aIdx}
                  className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px]"
                >
                  {area}
                </span>
              ))}
            </div>
          </header>
        </FadeIn>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start max-w-6xl mx-auto mb-14 sm:mb-20">
          {/* Left Column: Localized Legal Strategy & Testimonials (8 cols) */}
          <div className="lg:col-span-8 space-y-12">
            {/* Localized DRT & Judicial Jurisdiction Card */}
            <section className="space-y-4">
              <div className="space-y-1 border-b border-border pb-3">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span>Judicial & Banking Jurisdictions in {data.cityName}</span>
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Where our litigation advocates represent you for court notices, SARFAESI appeals, and Lok Adalat compromises.
                </p>
              </div>

              <div className="space-y-3">
                {data.drtCourts.map((court, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-5 rounded-2xl border border-border bg-card space-y-1.5 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-foreground">
                        {court.name}
                      </div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-muted-foreground">
                        {court.location}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {court.jurisdiction}
                    </p>
                  </div>
                ))}

                {/* Local RBI Ombudsman */}
                <div className="p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-1.5">
                  <div className="font-bold text-xs text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
                    <Building className="h-4 w-4" />
                    <span>Regional RBI Banking Ombudsman Office:</span>
                  </div>
                  <div className="text-xs font-semibold text-foreground">
                    {data.rbiOmbudsmanOffice.officeName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {data.rbiOmbudsmanOffice.address}
                  </div>
                </div>
              </div>
            </section>

            {/* Local Verified Client Case Study */}
            <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-50/50 via-card to-card dark:from-emerald-950/20 dark:via-card dark:to-card border border-emerald-200 dark:border-emerald-900/60 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-600 text-white">
                  Verified Local Case Study ({data.cityName})
                </span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                  {data.clientStory.waiver}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="font-extrabold text-base text-foreground">
                    {data.clientStory.clientName}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    • Resident of {data.clientStory.locality}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                  <div className="p-2.5 rounded-xl bg-card border border-border">
                    <span className="text-muted-foreground block text-[10px]">
                      Original Claimed Dues:
                    </span>
                    <strong className="text-foreground">{data.clientStory.originalDebt}</strong>
                  </div>
                  <div className="p-2.5 rounded-xl bg-card border border-border">
                    <span className="text-muted-foreground block text-[10px]">
                      Final Settlement Paid:
                    </span>
                    <strong className="text-emerald-600 dark:text-emerald-400">
                      {data.clientStory.settledAmount}
                    </strong>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground italic leading-relaxed pt-2">
                  &ldquo;{data.clientStory.quote}&rdquo;
                </p>

                <div className="text-[11px] text-muted-foreground pt-1">
                  Lenders Settled: <strong className="text-foreground">{data.clientStory.lenders}</strong>
                </div>
              </div>
            </section>

            {/* Common Lenders Handled in this City */}
            <section className="space-y-3">
              <h3 className="text-lg font-bold text-foreground">
                Major Financial Institutions Settled Across {data.cityName}:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs text-muted-foreground">
                {data.commonLendersInCity.map((lender, lIdx) => (
                  <div
                    key={lIdx}
                    className="p-2.5 rounded-xl border border-border bg-card flex items-center gap-2 font-medium"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                    <span className="truncate">{lender}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Comparison Table */}
            <ServiceComparisonTable
              rows={comparisonRows}
              serviceTitle={`Loan Settlement in ${data.cityName}`}
            />

            {/* Local FAQs */}
            {data.localFaqs && data.localFaqs.length > 0 && (
              <section className="space-y-4 pt-4 border-t border-border">
                <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary-500" />
                  <span>Frequently Asked Questions in {data.cityName}</span>
                </h3>

                <div className="space-y-3">
                  {data.localFaqs.map((faq, fIdx) => (
                    <div
                      key={fIdx}
                      className="p-5 rounded-2xl border border-border bg-card space-y-1.5 shadow-sm"
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
          </div>

          {/* Right Column: Sticky Sidebar with Quick Form & WhatsApp Helpline (4 cols) */}
          <div className="lg:col-span-4">
            <ServiceSidebar
              serviceName={`Loan Settlement in ${data.cityName}`}
              defaultLoanType="personal-loan"
              customWhatsAppMessage={`Hello Debt Support Expert, I am located in ${data.cityName} and need urgent legal assistance with loan settlement and recovery calls.`}
            />
          </div>
        </div>

        {/* Bottom City Action Banner */}
        <div className="rounded-3xl bg-slate-900 text-white p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Empanelled Advocates Across {data.cityName}</span>
            </span>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Get Immediate Legal Protection from Recovery Harassment in {data.cityName}
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
              Our advocates inspect your loan notices, issue formal Cease & Desist orders to regional bank leadership, and secure up to 50% to 70% debt waivers.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="#sidebar-fullname"
              className="px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-900 bg-white hover:bg-slate-100 transition-colors shadow-md"
            >
              Request Advocate Callback
            </a>
            <a
              href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
              className="px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors inline-flex items-center gap-2"
            >
              <PhoneCall className="h-4 w-4 text-emerald-400" />
              <span>Call Local Legal Desk</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
