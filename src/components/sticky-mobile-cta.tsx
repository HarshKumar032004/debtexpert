"use client";

import Link from "next/link";
import { PhoneCall, ShieldCheck, ArrowRight } from "lucide-react";
import { siteConfig } from "@/config/site";

export function StickyMobileCTA() {
  return (
    <aside
      aria-label="Quick Emergency Consultation"
      className="fixed bottom-0 inset-x-0 z-40 lg:hidden glass-panel border-t border-slate-200/90 dark:border-slate-800/90 py-2.5 px-4 shadow-[0_-8px_20px_rgba(0,0,0,0.1)]"
    >
      <div className="flex items-center gap-2.5 max-w-md mx-auto">
        <a
          href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-slate-100 font-bold text-xs active:scale-95 transition-transform"
        >
          <PhoneCall className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Call Helpline</span>
        </a>

        <Link
          href="/contact"
          className="flex-[1.4] flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-gradient-to-r from-primary-600 to-blue-700 text-white font-bold text-xs shadow-md shadow-primary-600/30 active:scale-95 transition-transform"
        >
          <ShieldCheck className="h-4 w-4 text-amber-300" />
          <span>Free Consultation</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </aside>
  );
}
