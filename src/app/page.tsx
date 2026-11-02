import { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { ProblemSolutionBento } from "@/components/home/problem-solution-bento";
import { CoreServicesGrid } from "@/components/home/core-services-grid";
import { InteractiveHowItWorks } from "@/components/home/interactive-how-it-works";
import { SavingsEstimatorSection } from "@/components/home/savings-estimator-section";
import { SuccessStoriesGrid } from "@/components/home/success-stories-grid";
import { SeoFaqAccordion } from "@/components/home/seo-faq-accordion";
import { CTASection } from "@/components/home/cta-section";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Settle Your Loans Legally & Stop Recovery Harassment Today | Debt Support Expert",
  description:
    "India's premier legal advisory for loan settlement help and anti-harassment protection. Settle personal loans and credit cards for up to 50%-70% less under RBI guidelines with official No Dues Certificates.",
  keywords: [
    "loan settlement help in india",
    "stop recovery agent harassment",
    "rbi recovery agent rules",
    "personal loan one time settlement ots",
    "credit card debt settlement",
    "debt settlement lawyer india",
    "section 138 ni act bounce reply",
    "cibil score after settlement",
  ],
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "Settle Your Loans Legally & Stop Recovery Harassment Today | Debt Support Expert",
    description:
      "Reduce personal loans and credit card debts by up to 50%-70% through legal compromise settlement and stop recovery agent harassment under RBI guidelines.",
    url: siteConfig.url,
  },
};

export default function HomePage() {
  return (
    <>
      {/* 1. HERO SECTION with two-column layout, WhatsApp CTA, trust metrics & eligibility mini-form */}
      <HeroSection />

      {/* 2. PROBLEM vs SOLUTION BENTO GRID */}
      <ProblemSolutionBento />

      {/* 3. CORE SERVICES SECTION (6 interactive cards) */}
      <CoreServicesGrid />

      {/* 4. INTERACTIVE HOW IT WORKS TIMELINE (4-step process) */}
      <InteractiveHowItWorks />

      {/* 5. INTERACTIVE SAVINGS ESTIMATOR SECTION (Live slider ₹1L - ₹50L) */}
      <SavingsEstimatorSection />

      {/* 6. CLIENT SUCCESS STORIES & TESTIMONIALS (Real Indian cases) */}
      <SuccessStoriesGrid />

      {/* 7. SEO FAQ ACCORDION (Top 8 high-search-volume questions with FAQPage Schema) */}
      <SeoFaqAccordion />

      {/* 8. FINAL HIGH-CONVERTING CONSULTATION CTA SECTION */}
      <CTASection />
    </>
  );
}
