import { ConsultationForm } from "./consultation-form";
import {
  PhoneCall,
  Clock,
  ShieldCheck,
  CheckCircle,
  MapPin,
  Lock,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export function CTASection() {
  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden" id="consultation">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Reassurance & Direct Call */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-primary-700 dark:text-blue-300 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Pan-India Legal Representation</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
              Take the First Step Toward a{" "}
              <span className="text-primary-600 dark:text-blue-400">Debt-Free Future</span> Today.
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              You do not have to endure sleepless nights, relentless telephone calls, or legal
              threats alone. Speak directly with an experienced legal advocate who will evaluate
              your case in strict confidence.
            </p>

            {/* Direct Helpline Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-md space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <PhoneCall className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground font-medium">
                    National Legal Helpline
                  </div>
                  <a
                    href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
                    className="text-xl font-extrabold text-foreground hover:text-primary-600 transition-colors"
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-primary-500" />
                  <span>Mon - Sat: 9:30 AM to 7:00 PM</span>
                </div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Toll-Free Legal Advice
                </span>
              </div>
            </div>

            {/* Three key pillars */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground">
                  <strong>Zero Obligation:</strong> Free preliminary hardship audit with customized settlement roadmap.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground">
                  <strong>Fast Stoppage:</strong> Legal Cease & Desist Notices dispatched to collection agencies within 24 hours.
                </span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-xs text-muted-foreground">
                  <strong>100% Confidential:</strong> We never disclose your financial situation to family, employers, or third parties.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7">
            <ConsultationForm />
          </div>
        </div>
      </div>
    </section>
  );
}
