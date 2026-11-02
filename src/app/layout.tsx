import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { StickyMobileCTA } from "@/components/sticky-mobile-cta";
import { OrganizationJsonLd } from "@/components/seo/json-ld";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8FAFC" },
    { media: "(prefers-color-scheme: dark)", color: "#090D16" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Legal Advisory & Loan Settlement India`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "loan settlement india",
    "personal loan settlement",
    "credit card settlement",
    "stop recovery agent harassment",
    "rbi loan settlement guidelines",
    "debt relief lawyer india",
    "one time settlement ots",
    "debt settlement expert",
    "cibil score after settlement",
    "bank legal notice reply",
  ],
  authors: [{ name: siteConfig.legalEntity, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.legalEntity,
  formatDetection: {
    email: false,
    address: true,
    telephone: true,
  },
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteConfig.url,
    title: `${siteConfig.name} | Legal Advisory & Loan Settlement India`,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - India's Premier Debt Settlement Advisory`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Legal Loan Settlement India`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@debtsupportexp",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${plusJakarta.variable} overflow-x-hidden`}>
      <head>
        <OrganizationJsonLd />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-foreground antialiased overflow-x-hidden">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-1 pb-24 md:pb-0">{children}</main>
          <Footer />
          <FloatingWhatsApp />
          <StickyMobileCTA />
        </ThemeProvider>
      </body>
    </html>
  );
}
