import { Metadata } from "next";
import { EligibilityWizard } from "@/components/eligibility/eligibility-wizard";
import { siteConfig } from "@/config/site";
import { Scale, ShieldCheck, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Check Loan Settlement Eligibility in 60 Seconds | Debt Support Expert",
  description:
    "Evaluate your loan or credit card settlement eligibility under RBI guidelines in 60 seconds. Instant personalized legal strategy, waiver estimate, and advocate review.",
  alternates: {
    canonical: `${siteConfig.url}/check-eligibility`,
  },
  openGraph: {
    title: "Instant Loan Settlement Eligibility Checker | Debt Support Expert",
    description:
      "Find out your legal settlement waiver potential and stop recovery harassment in 60 seconds.",
    url: `${siteConfig.url}/check-eligibility`,
    type: "website",
  },
};

export default function CheckEligibilityPage() {
  return (
    <div className="py-12 md:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
            <Scale className="h-4 w-4" />
            <span>Empanelled High Court Legal Advisory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Check Your Loan Settlement Eligibility in 60 Seconds
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Answer 6 simple questions to get your instant, personalized legal settlement strategy, estimated waiver range, and immediate harassment relief protocol.
          </p>
        </div>

        {/* Interactive Wizard */}
        <EligibilityWizard />

        {/* Trust Metrics Row */}
        <div className="max-w-3xl mx-auto mt-16 pt-8 border-t border-border grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-black text-primary">100%</div>
            <div className="text-[11px] text-muted-foreground font-semibold">Direct Bank Payouts</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">50%–70%</div>
            <div className="text-[11px] text-muted-foreground font-semibold">Avg. Debt Waived</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-black text-primary">Zero</div>
            <div className="text-[11px] text-muted-foreground font-semibold">Upfront Legal Advance</div>
          </div>
          <div className="space-y-0.5">
            <div className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">RBI Code</div>
            <div className="text-[11px] text-muted-foreground font-semibold">Fair Practice Shield</div>
          </div>
        </div>
      </div>
    </div>
  );
}
