import { Metadata } from "next";
import { ServicePageTemplate } from "@/components/services/service-page-template";
import { antiHarassmentData } from "@/data/services/anti-harassment";

export const metadata: Metadata = {
  title: antiHarassmentData.metaTitle,
  description: antiHarassmentData.metaDescription,
  keywords: antiHarassmentData.metaKeywords,
  alternates: {
    canonical: antiHarassmentData.canonicalUrl,
  },
  openGraph: {
    title: antiHarassmentData.metaTitle,
    description: antiHarassmentData.metaDescription,
    url: antiHarassmentData.canonicalUrl,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: antiHarassmentData.metaTitle,
    description: antiHarassmentData.metaDescription,
  },
};

export default function AntiHarassmentPage() {
  return <ServicePageTemplate data={antiHarassmentData} />;
}
