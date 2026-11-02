import { Metadata } from "next";
import { ServicePageTemplate } from "@/components/services/service-page-template";
import { creditCardSettlementData } from "@/data/services/credit-card-settlement";

export const metadata: Metadata = {
  title: creditCardSettlementData.metaTitle,
  description: creditCardSettlementData.metaDescription,
  keywords: creditCardSettlementData.metaKeywords,
  alternates: {
    canonical: creditCardSettlementData.canonicalUrl,
  },
  openGraph: {
    title: creditCardSettlementData.metaTitle,
    description: creditCardSettlementData.metaDescription,
    url: creditCardSettlementData.canonicalUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: creditCardSettlementData.metaTitle,
    description: creditCardSettlementData.metaDescription,
  },
};

export default function CreditCardSettlementPage() {
  return <ServicePageTemplate data={creditCardSettlementData} />;
}
