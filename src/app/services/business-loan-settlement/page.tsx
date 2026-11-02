import { Metadata } from "next";
import { ServicePageTemplate } from "@/components/services/service-page-template";
import { businessLoanSettlementData } from "@/data/services/business-loan-settlement";

export const metadata: Metadata = {
  title: businessLoanSettlementData.metaTitle,
  description: businessLoanSettlementData.metaDescription,
  keywords: businessLoanSettlementData.metaKeywords,
  alternates: {
    canonical: businessLoanSettlementData.canonicalUrl,
  },
  openGraph: {
    title: businessLoanSettlementData.metaTitle,
    description: businessLoanSettlementData.metaDescription,
    url: businessLoanSettlementData.canonicalUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: businessLoanSettlementData.metaTitle,
    description: businessLoanSettlementData.metaDescription,
  },
};

export default function BusinessLoanSettlementPage() {
  return <ServicePageTemplate data={businessLoanSettlementData} />;
}
