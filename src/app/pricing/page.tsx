import { Metadata } from "next";
import { PricingView } from "@/components/pricing/pricing-view";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Transparent Advisory Plans & Settlement Fees | Debt Support Expert",
  description:
    "Explore our 3 transparent legal advisory plans for loan settlement, anti-harassment shield, and CIBIL protection. Zero hidden commissions. Settle directly with banks.",
  alternates: {
    canonical: `${siteConfig.url}/pricing`,
  },
  openGraph: {
    title: "Transparent Advisory Plans & Loan Settlement Fees | Debt Support Expert",
    description:
      "Explore transparent legal plans starting at ₹5,000 for loan settlement, anti-harassment protection, and credit rebuilding.",
    url: `${siteConfig.url}/pricing`,
    type: "website",
  },
};

export default function PricingPage() {
  return (
    <div className="py-12 md:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PricingView />
      </div>
    </div>
  );
}
