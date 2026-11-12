"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { StickyMobileCTA } from "@/components/sticky-mobile-cta";

interface PublicShellProps {
  children: React.ReactNode;
}

/**
 * PublicShell conditionally mounts public portal headers, footers, tickers,
 * and mobile floating CTAs only for public customer-facing routes.
 *
 * For all /admin and /admin/* routes (including /admin/login), it renders children
 * directly without any public chrome, ensuring a dedicated, full-screen SaaS CRM canvas.
 */
export function PublicShell({ children }: PublicShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname ? pathname.startsWith("/admin") : false;

  if (isAdmin) {
    return <>{children}</>;
  }

  const hideStickyCta = pathname === "/check-eligibility";

  return (
    <>
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0 relative z-10">{children}</main>
      <Footer />
      <FloatingWhatsApp />
      {!hideStickyCta && <StickyMobileCTA />}
    </>
  );
}

