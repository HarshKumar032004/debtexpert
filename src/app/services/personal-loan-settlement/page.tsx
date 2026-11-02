import { Metadata } from "next";
import { ServicePageTemplate } from "@/components/services/service-page-template";
import { personalLoanSettlementData } from "@/data/services/personal-loan-settlement";

export const metadata: Metadata = {
  title: personalLoanSettlementData.metaTitle,
  description: personalLoanSettlementData.metaDescription,
  keywords: personalLoanSettlementData.metaKeywords,
  alternates: {
    canonical: personalLoanSettlementData.canonicalUrl,
  },
  openGraph: {
    title: personalLoanSettlementData.metaTitle,
    description: personalLoanSettlementData.metaDescription,
    url: personalLoanSettlementData.canonicalUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: personalLoanSettlementData.metaTitle,
    description: personalLoanSettlementData.metaDescription,
  },
};

export default function PersonalLoanSettlementPage() {
  return <ServicePageTemplate data={personalLoanSettlementData} />;
}
