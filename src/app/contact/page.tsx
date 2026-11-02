import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ContactSplitLayout } from "@/components/contact/contact-split-layout";

export const metadata: Metadata = {
  title: "Contact Debt Support Expert | Free Confidential Case Evaluation",
  description:
    "Schedule a confidential legal consultation with Debt Support Expert. Stop loan recovery harassment and explore One-Time Settlement (OTS) options across India.",
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
  openGraph: {
    title: "Contact Debt Support Expert | Legal Advisory & Loan Settlement India",
    description:
      "Schedule a confidential legal consultation with High Court advocates to halt recovery harassment and settle loans under RBI guidelines.",
    url: `${siteConfig.url}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="py-10 md:py-16 bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6">
        <ContactSplitLayout />
      </div>
    </div>
  );
}
