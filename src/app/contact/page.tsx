import { Metadata } from "next";
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  MessageCircle,
  Lock,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { ConsultationForm } from "@/components/home/consultation-form";

export const metadata: Metadata = {
  title: "Contact Debt Support Expert | Free Confidential Case Evaluation",
  description:
    "Schedule a confidential legal consultation with Debt Support Expert. Stop loan recovery harassment and explore One-Time Settlement (OTS) options across India.",
  alternates: {
    canonical: `${siteConfig.url}/contact`,
  },
};

export default function ContactPage() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappMessage
  )}`;

  return (
    <div className="py-12 md:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <ShieldCheck className="h-4 w-4" />
            <span>Strict Attorney-Client Privilege Guaranteed</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Schedule Your Free Legal Case Evaluation
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            Take immediate control of your financial destiny. Complete the confidential inquiry
            below or reach our legal emergency helpline.
          </p>
        </div>

        {/* Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto mb-20">
          {/* Left Column: Direct Info & Addresses */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-3xl border border-border bg-card shadow-lg space-y-6">
              <h2 className="text-xl font-bold text-foreground">
                Direct Contact Channels
              </h2>

              <div className="space-y-4 text-sm">
                {/* Phone */}
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-primary-600 dark:text-primary-400 flex items-center justify-center shrink-0">
                    <PhoneCall className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">
                      National Client Helpline
                    </div>
                    <a
                      href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
                      className="text-base font-bold text-foreground hover:text-primary-600 transition-colors"
                    >
                      {siteConfig.phoneDisplay}
                    </a>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Mon – Sat: 9:30 AM to 7:00 PM
                    </div>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">
                      Urgent WhatsApp Support
                    </div>
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      Chat with Legal Team
                    </a>
                    <div className="text-[11px] text-muted-foreground mt-0.5">
                      Fast 15-minute response time
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3.5">
                  <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/70 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">
                      Legal Documentation & Notice Submissions
                    </div>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-base font-bold text-foreground hover:text-primary-600 transition-colors"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-3.5 pt-2 border-t border-border/80">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">
                      Corporate Headquarters
                    </div>
                    <div className="text-xs font-semibold text-foreground leading-relaxed mt-0.5">
                      Level 4, Cyber City, DLF Phase 2,<br />
                      Gurugram, Haryana - 122002, India
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1">
                      Pan-India Advocate Network (Delhi, Mumbai, Bengaluru, Hyderabad, Kolkata)
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Reassurance */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-border space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Lock className="h-4 w-4 text-emerald-500" />
                <span>Zero Disclosure Guarantee</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We strictly adhere to attorney-client privilege. Your financial hardship, loan
                defaults, or contact information will NEVER be disclosed to your employer, family,
                or third-party lead brokers.
              </p>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <ConsultationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
