import { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { AntiHarassmentBanner } from "@/components/home/anti-harassment-banner";
import { InteractiveCalculatorTeaser } from "@/components/home/interactive-calculator-teaser";
import { ServicesBento } from "@/components/home/services-bento";
import { ProcessTimeline } from "@/components/home/process-timeline";
import { CaseStudies } from "@/components/home/case-studies";
import { ComparisonMatrix } from "@/components/home/comparison-matrix";
import { FaqAccordion } from "@/components/home/faq-accordion";
import { CTASection } from "@/components/home/cta-section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Debt Support Expert | Premier Legal Loan Settlement & Anti-Harassment Advisory India",
  description:
    "Protect yourself from recovery agent harassment and settle unsecured personal loans, credit card debts, and business loans with up to 50%-75% waiver under RBI guidelines.",
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "Debt Support Expert | Legal Loan Settlement & Anti-Harassment Advisory India",
    description:
      "India's premier legal advisory network for loan settlement and borrower protection against recovery harassment under RBI guidelines.",
    url: siteConfig.url,
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AntiHarassmentBanner />
      <InteractiveCalculatorTeaser />
      <ServicesBento />
      <ProcessTimeline />
      <CaseStudies />
      <ComparisonMatrix />
      <FaqAccordion />
      <CTASection />
    </>
  );
}
