import { Metadata } from "next";
import { ServicePageTemplate } from "@/components/services/service-page-template";
import { legalNoticeDefenseData } from "@/data/services/legal-notice-defense";

export const metadata: Metadata = {
  title: legalNoticeDefenseData.metaTitle,
  description: legalNoticeDefenseData.metaDescription,
  keywords: legalNoticeDefenseData.metaKeywords,
  alternates: {
    canonical: legalNoticeDefenseData.canonicalUrl,
  },
  openGraph: {
    title: legalNoticeDefenseData.metaTitle,
    description: legalNoticeDefenseData.metaDescription,
    url: legalNoticeDefenseData.canonicalUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: legalNoticeDefenseData.metaTitle,
    description: legalNoticeDefenseData.metaDescription,
  },
};

export default function LegalNoticeDefensePage() {
  return <ServicePageTemplate data={legalNoticeDefenseData} />;
}
